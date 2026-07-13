'use client';
/* ═══════════ SYNC · local-first con Supabase (spunte, note, allegati) ═══════════
   Senza env Supabase l'app funziona in modalità locale (solo questo telefono). */
import { create } from 'zustand';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const hasSupabase = Boolean(URL && KEY);

let _sb: SupabaseClient | null = null;
export function sb(): SupabaseClient | null {
  if (!hasSupabase) return null;
  if (!_sb) _sb = createClient(URL!, KEY!, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'th2026-auth',
    },
  });
  return _sb;
}

/* ── IndexedDB minimale (kv + outbox + file voucher) ── */
function idb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const rq = indexedDB.open('th2026', 2);
    rq.onupgradeneeded = () => {
      const db = rq.result;
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'id' });
    };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
}
export async function kvGet<T>(k: string): Promise<T | undefined> {
  const db = await idb();
  return new Promise(res => {
    const rq = db.transaction('kv').objectStore('kv').get(k);
    rq.onsuccess = () => res(rq.result as T | undefined);
    rq.onerror = () => res(undefined);
  });
}
export async function kvSet(k: string, v: unknown) {
  const db = await idb();
  return new Promise<void>(res => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(v, k);
    tx.oncomplete = () => res();
    tx.onerror = () => res();
  });
}
export async function fileSave(rec: { id: string; bookingId: string; name: string; type: string; buf: ArrayBuffer }) {
  const db = await idb();
  return new Promise<void>(res => {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').put(rec);
    tx.oncomplete = () => res(); tx.onerror = () => res();
  });
}
export async function fileList(bookingId: string) {
  const db = await idb();
  return new Promise<{ id: string; name: string }[]>(res => {
    const out: { id: string; name: string }[] = [];
    const rq = db.transaction('files').objectStore('files').openCursor();
    rq.onsuccess = () => {
      const c = rq.result;
      if (c) { const v = c.value; if (v.bookingId === bookingId) out.push({ id: v.id, name: v.name }); c.continue(); }
      else res(out);
    };
    rq.onerror = () => res(out);
  });
}
export async function fileUrl(id: string) {
  const db = await idb();
  return new Promise<string | null>(res => {
    const rq = db.transaction('files').objectStore('files').get(id);
    rq.onsuccess = () => {
      const r = rq.result;
      res(r ? window.URL.createObjectURL(new Blob([r.buf], { type: r.type || 'application/pdf' })) : null);
    };
    rq.onerror = () => res(null);
  });
}
export async function fileDelete(id: string) {
  const db = await idb();
  return new Promise<void>(res => {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').delete(id);
    tx.oncomplete = () => res(); tx.onerror = () => res();
  });
}

/* ── Store spunte + note (Zustand, mirror IDB, sync SB) ── */
interface TripState {
  checks: Record<string, boolean>;
  notes: Record<string, string>;
  userEmail: string | null;
  ready: boolean;
  online: boolean;
  toggleCheck: (actId: string) => void;
  setNote: (dayId: string, body: string) => void;
  init: () => Promise<void>;
}

type Outbox = { table: 'activity_checks' | 'day_notes'; row: Record<string, unknown> }[];
let outbox: Outbox = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

async function flush(email: string | null) {
  const client = sb();
  if (!client || outbox.length === 0) return;
  const batch = outbox; outbox = [];
  for (const m of batch) {
    try { await client.from(m.table).upsert({ ...m.row, ...(email ? (m.table === 'activity_checks' ? { done_by: email } : { updated_by: email }) : {}) }); }
    catch { outbox.push(m); }
  }
  kvSet('outbox', outbox);
}
function queue(m: Outbox[number], email: string | null) {
  outbox.push(m);
  kvSet('outbox', outbox);
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => flush(email), 800);
}

export const useTrip = create<TripState>((set, get) => ({
  checks: {}, notes: {}, userEmail: null, ready: false, online: true,

  toggleCheck: (actId) => {
    const next = { ...get().checks };
    if (next[actId]) delete next[actId]; else next[actId] = true;
    set({ checks: next });
    kvSet('checks', next);
    queue({ table: 'activity_checks', row: { act_id: actId, done: !!next[actId], updated_at: new Date().toISOString() } }, get().userEmail);
  },

  setNote: (dayId, body) => {
    const next = { ...get().notes, [dayId]: body };
    set({ notes: next });
    kvSet('notes', next);
    queue({ table: 'day_notes', row: { day_id: dayId, body, updated_at: new Date().toISOString() } }, get().userEmail);
  },

  init: async () => {
    /* 1. carica locale (istantaneo) */
    const [checks, notes, box] = await Promise.all([
      kvGet<Record<string, boolean>>('checks'), kvGet<Record<string, string>>('notes'), kvGet<Outbox>('outbox'),
    ]);
    outbox = box ?? [];
    set({ checks: checks ?? {}, notes: notes ?? {}, ready: true });

    const client = sb();
    if (!client) return;

    /* 2. sessione */
    const { data: { session } } = await client.auth.getSession();
    const email = session?.user?.email ?? null;
    set({ userEmail: email });
    if (!email) return;

    /* 3. pull di riconciliazione */
    try {
      const [{ data: ck }, { data: nt }] = await Promise.all([
        client.from('activity_checks').select('act_id,done'),
        client.from('day_notes').select('day_id,body'),
      ]);
      if (ck) {
        const merged = { ...get().checks };
        ck.forEach(r => { if (r.done) merged[r.act_id] = true; else delete merged[r.act_id]; });
        set({ checks: merged }); kvSet('checks', merged);
      }
      if (nt) {
        const merged = { ...get().notes };
        nt.forEach(r => { merged[r.day_id] = r.body; });
        set({ notes: merged }); kvSet('notes', merged);
      }
      set({ online: true });
    } catch { set({ online: false }); }

    /* 4. outbox residuo */
    flush(email);

    /* 5. realtime dall'altro telefono */
    client.channel('trip-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_checks' }, payload => {
        const r = payload.new as { act_id: string; done: boolean };
        if (!r?.act_id) return;
        const merged = { ...get().checks };
        if (r.done) merged[r.act_id] = true; else delete merged[r.act_id];
        set({ checks: merged }); kvSet('checks', merged);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'day_notes' }, payload => {
        const r = payload.new as { day_id: string; body: string };
        if (!r?.day_id) return;
        const merged = { ...get().notes, [r.day_id]: r.body };
        set({ notes: merged }); kvSet('notes', merged);
      })
      .subscribe();

    window.addEventListener('online', () => { set({ online: true }); flush(get().userEmail); });
    window.addEventListener('offline', () => set({ online: false }));
  },
}));

/* ── Voucher: upload su Storage + cache locale ── */
export async function voucherUpload(bookingId: string, file: File, email: string | null) {
  const buf = await file.arrayBuffer();
  const id = `${bookingId}_${Date.now()}`;
  await fileSave({ id, bookingId, name: file.name, type: file.type, buf });
  const client = sb();
  if (client && email) {
    const path = `${bookingId}/${id}_${file.name}`;
    try {
      await client.storage.from('vouchers').upload(path, file, { upsert: true });
      await client.from('attachments').insert({ booking_id: bookingId, file_name: file.name, storage_path: path, uploaded_by: email });
    } catch { /* resta locale, riproverà l'altro device a scaricarlo quando disponibile */ }
  }
  return id;
}
export async function voucherList(bookingId: string) {
  const local = await fileList(bookingId);
  const client = sb();
  if (!client) return local;
  try {
    const { data } = await client.from('attachments').select('id,file_name,storage_path').eq('booking_id', bookingId);
    const remote = (data ?? [])
      .filter(r => !local.some(l => l.name === r.file_name))
      .map(r => ({ id: 'sb:' + r.storage_path, name: r.file_name }));
    return [...local, ...remote];
  } catch { return local; }
}
export async function voucherUrl(id: string, bookingId: string) {
  if (!id.startsWith('sb:')) return fileUrl(id);
  const client = sb();
  if (!client) return null;
  const path = id.slice(3);
  try {
    const { data } = await client.storage.from('vouchers').download(path);
    if (!data) return null;
    const buf = await data.arrayBuffer();
    const localId = `${bookingId}_${Date.now()}`;
    await fileSave({ id: localId, bookingId, name: path.split('/').pop() || 'voucher.pdf', type: data.type, buf });
    return window.URL.createObjectURL(data);
  } catch { return null; }
}
