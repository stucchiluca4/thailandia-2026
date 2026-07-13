'use client';
/* ═══════════ PRENOTAZIONI · voli/hotel/traghetti/transfer/tour/taxi ═══════════ */
import { useEffect, useRef, useState } from 'react';
import { BOOKINGS, type Booking } from '@/data/itinerary';
import { nav } from '@/lib/geo';
import { QrBadge } from '@/components/QrBadge';
import { useTrip, voucherUpload, voucherList, voucherUrl, fileDelete } from '@/lib/sync';

type Tab = 'voli' | 'hotel' | 'traghetti' | 'transfer' | 'tour' | 'taxi';
const TABS: { id: Tab; l: string }[] = [
  { id: 'voli', l: '✈️ Voli' }, { id: 'hotel', l: '🏨 Hotel' }, { id: 'traghetti', l: '⛴️ Traghetti' },
  { id: 'transfer', l: '🚐 Transfer' }, { id: 'tour', l: '🎟️ Tour' }, { id: 'taxi', l: '🚕 Taxi' },
];

const TAXI_LIST = [
  { id: 'TAXI-BKK', t: 'Taxi Radio Bangkok', s: 'Bangkok e Ayutthaya', provider: 'Radio taxi', cost: 'a tassametro', d: 'Chiama il 1681 e pretendi sempre il tassametro ("meter, please"). In alternativa Grab con prezzo fisso.', phone: '1681' },
  { id: 'TAXI-CEI', t: 'Taxi Chiang Rai', s: 'via Hotel Selene', provider: 'Hotel desk', cost: '~150–600 THB', d: 'La reception chiama taxi fidati. Aeroporto→hotel ~150–200 THB, Triangolo d’Oro ~600 A/R.', phone: '+66 53 711 339' },
  { id: 'TAXI-CNX', t: 'CM Taxi Cooperative', s: 'Chiang Mai', provider: 'Cooperativa', cost: 'concordato', d: 'Songthaew rossi: alza la mano, 30–50 THB in città. Grab molto diffuso.', phone: '+66 53 279 291' },
  { id: 'TAXI-USM', t: 'Taxi Koh Samui', s: 'via The Stay', provider: 'Hotel desk', cost: '~300–400 THB/tratta', d: 'I taxi dell’isola non usano il tassametro: prezzo prima di salire, o scooter in hotel (200–250 THB/g).', phone: '+66 77 300 599' },
];

export default function Prenotazioni() {
  const [tab, setTab] = useState<Tab>('voli');
  const list: Booking[] = tab === 'voli' ? BOOKINGS.flights : tab === 'hotel' ? BOOKINGS.hotels : tab === 'tour' ? BOOKINGS.tours : tab === 'taxi' ? (TAXI_LIST as Booking[]) : [];

  return (
    <div className="px-4 pt-3">
      <h1 className="text-[22px] font-black tracking-tight">Prenotazioni</h1>
      <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-4 px-4">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 text-[11px] font-extrabold px-3.5 py-2 rounded-full ${tab === t.id ? 'bg-ocean text-white' : 'bg-surface border border-line'}`}>
            {t.l}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {list.map(b => <BkCard key={b.id} b={b} kind={tab} />)}
        {(tab === 'traghetti' || tab === 'transfer') && (
          <div className="bg-surface rounded-xl2 shadow-soft p-5 text-center text-[12.5px] text-ink2">
            {tab === 'traghetti'
              ? '⛴️ Nessun traghetto in questo itinerario: Chiang Mai → Koh Samui si vola diretto (Bangkok Airways). I tour in barca (Ang Thong, Koh Tao) sono sotto 🎟️ Tour.'
              : '🚐 I transfer principali sono inclusi nei tour (pickup in hotel). Gli spostamenti singoli con Grab/taxi sono dentro ogni giornata dell’Itinerario.'}
          </div>
        )}
      </div>
      <div className="h-6" />
    </div>
  );
}

function BkCard({ b, kind }: { b: Booking; kind: Tab }) {
  const ok = !b.todo;
  const { userEmail } = useTrip();
  const [pdfs, setPdfs] = useState<{ id: string; name: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => voucherList(b.id).then(setPdfs);
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [b.id]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { alert('File troppo grande (max 8 MB)'); return; }
    setBusy(true);
    await voucherUpload(b.id, f, userEmail);
    setBusy(false);
    refresh();
    e.target.value = '';
  };
  const openPdf = async (id: string) => {
    const url = await voucherUrl(id, b.id);
    if (url) window.open(url, '_blank');
  };

  return (
    <div className={`bg-surface rounded-xl2 shadow-soft p-4 mb-3 ${!ok ? 'border-l-[4.5px] border-sunset' : ''}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <div className="text-[14.5px] font-extrabold">{kind === 'voli' ? '✈ ' : ''}{b.t}</div>
          <div className="text-[11px] text-ink2 font-semibold">{b.s}</div>
        </div>
        <span className={`text-[8.5px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap ${ok ? 'bg-tropic-soft text-tropic' : 'bg-sunset-soft text-sunset'}`}>
          {ok ? '✓ Confermato' : 'Da prenotare'}
        </span>
      </div>

      {ok && kind !== 'taxi' && (
        <div className="flex gap-3.5 items-center mt-3">
          <QrBadge code={b.id} />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-black tracking-widest text-dim">CODICE PRENOTAZIONE</div>
            <div className="text-[18px] font-black tracking-wide font-mono">{b.id}</div>
            <div className="text-[11px] text-ink2 mt-0.5">{b.provider}{b.cost && b.cost !== '—' ? ' · ' + b.cost : ''}{b.phone ? <><br />📞 {b.phone}</> : null}</div>
          </div>
        </div>
      )}
      <div className="text-[12px] text-ink2 mt-2.5 leading-relaxed">{b.d}</div>

      {/* voucher/PDF */}
      {kind !== 'taxi' && (
        <div className="mt-3 pt-3 border-t border-dashed border-line">
          {pdfs.map(p => (
            <div key={p.id} className="flex items-center gap-2.5 py-1.5">
              <span>📄</span>
              <button onClick={() => openPdf(p.id)} className="flex-1 text-left text-[12px] font-bold text-ocean truncate">{p.name}</button>
              {!p.id.startsWith('sb:') && <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-line text-ink2">offline ✓</span>}
              {!p.id.startsWith('sb:') && <button onClick={async () => { await fileDelete(p.id); refresh(); }} className="text-red-400 text-[13px]">🗑</button>}
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} disabled={busy}
            className="text-[11px] font-extrabold text-ocean bg-ocean-soft rounded-xl px-3 py-2 mt-1 disabled:opacity-50">
            {busy ? 'Caricamento…' : '+ Allega PDF / voucher'}
          </button>
          <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={onFile} />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {b.url && <a href={b.url} target="_blank" rel="noopener" className={`text-[11px] font-extrabold px-3.5 py-2 rounded-xl ${ok ? 'bg-ocean text-white' : 'bg-sunset text-white'}`}>🎟 {ok ? 'Gestisci' : 'Prenota ora'}</a>}
        {b.phone && <a href={'tel:' + b.phone.replace(/\s/g, '')} className="text-[11px] font-extrabold px-3.5 py-2 rounded-xl bg-surface border border-line">📞 Chiama</a>}
        {b.lat != null && <a href={nav(b.lat, b.lng!)} target="_blank" rel="noopener" className="text-[11px] font-extrabold px-3.5 py-2 rounded-xl bg-surface border border-line">🗺 Maps</a>}
      </div>
    </div>
  );
}
