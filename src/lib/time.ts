'use client';
/* ═══════════ TEMPO · calendario intelligente + NEXT UP ═══════════ */
import { useEffect, useState } from 'react';
import { DAYS, TRIP, type Day, type Activity, type Transport } from '@/data/itinerary';

export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export const fmtDate = (d: Date) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export type DayState = 'past' | 'today' | 'future';
export function dayState(day: Day, now: Date): DayState {
  const t = fmtDate(now);
  if (day.date < t) return 'past';
  if (day.date === t) return 'today';
  return 'future';
}

export type ActState = 'past' | 'now' | 'next' | 'future';
export function actState(day: Day, act: Activity, idx: number, now: Date): ActState {
  const ds = dayState(day, now);
  if (ds === 'past') return 'past';
  if (ds === 'future') return 'future';
  const cur = now.getHours() * 60 + now.getMinutes();
  const s = toMin(act.t);
  const e = Math.max(toMin(act.e || act.t), s + 30);
  if (cur >= e) return 'past';
  if (cur >= s) return 'now';
  /* 'next' = la prima attività che deve ancora iniziare (anche se un'altra è in corso) */
  for (let i = 0; i < idx; i++) {
    if (toMin(day.acts[i].t) >= cur) return 'future';
  }
  return 'next';
}

/* ── NEXT UP: primo evento futuro di oggi (attività o trasporto) ── */
export interface NextUp {
  kind: 'act' | 'transport';
  time: string; title: string; sub: string; minutes: number;
  emoji: string; lat?: number; lng?: number; day: Day;
}
export function nextUp(now: Date): NextUp | null {
  const today = fmtDate(now);
  const day = DAYS.find(d => d.date === today);
  if (!day) return null;
  const cur = now.getHours() * 60 + now.getMinutes();
  const events: NextUp[] = [];
  day.acts.forEach(a => {
    const s = toMin(a.t);
    if (s >= cur) events.push({
      kind: 'act', time: a.t, title: a.name,
      sub: [a.cost, a.dur].filter(Boolean).join(' · ') || a.desc?.slice(0, 60) || '',
      minutes: s - cur, emoji: pickEmoji(a.name), lat: a.lat, lng: a.lng, day,
    });
  });
  day.transports.forEach(t => {
    const s = toMin(t.time);
    if (s >= cur) events.push({
      kind: 'transport', time: t.time, title: `${t.from} → ${t.to}`,
      sub: `${t.mode} · ${t.dur}${t.cost ? ' · ' + t.cost : ''}`,
      minutes: s - cur, emoji: t.mode.includes('✈') ? '✈️' : t.mode.includes('🚌') ? '🚌' : '🚕', day,
    });
  });
  events.sort((a, b) => a.minutes - b.minutes);
  return events[0] ?? null;
}
function pickEmoji(name: string) {
  const n = name.toLowerCase();
  if (n.includes('volo')) return '✈️';
  if (n.includes('wat') || n.includes('tempio') || n.includes('palace') || n.includes('buddha')) return '🛕';
  if (n.includes('cena') || n.includes('pranzo') || n.includes('colazione')) return '🍜';
  if (n.includes('check')) return '🏨';
  if (n.includes('elephant') || n.includes('elefant')) return '🐘';
  if (n.includes('beach') || n.includes('mare') || n.includes('spiaggia')) return '🏖';
  if (n.includes('mercato') || n.includes('market') || n.includes('bazaar')) return '🛍';
  if (n.includes('rooftop') || n.includes('sky bar') || n.includes('bar')) return '🍹';
  return '📍';
}

/* ── Progress viaggio + countdown ── */
export function tripProgress(now: Date) {
  const start = new Date(TRIP.start);
  const end = new Date(TRIP.end);
  const before = now < start;
  const after = now > end;
  const pct = after ? 100 : before ? 0 : Math.round(((+now - +start) / (+end - +start)) * 100);
  const dayIdx = DAYS.findIndex(d => d.date === fmtDate(now));
  const target = before ? start : end;
  const ms = Math.max(0, +target - +now);
  return {
    before, after, during: !before && !after, pct,
    dayIdx, day: dayIdx >= 0 ? DAYS[dayIdx] : null,
    dd: Math.floor(ms / 864e5),
    hh: Math.floor((ms % 864e5) / 36e5),
    mm: Math.floor((ms % 36e5) / 6e4),
  };
}

export function durOf(a: Activity) {
  const min = toMin(a.e) - toMin(a.t);
  if (min <= 0) return a.dur || '—';
  const h = Math.floor(min / 60), m = min % 60;
  return (h ? h + 'h ' : '') + (m ? m + 'min' : '');
}
