'use client';
/* ═══════════ HOME · Viaggio ═══════════ */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TRIP, DAYS } from '@/data/itinerary';
import { useNow, tripProgress, nextUp } from '@/lib/time';
import { dirs, gq } from '@/lib/geo';
import { HeroScene, Scene } from '@/components/Scene';
import { useWeather } from '@/components/Weather';
import { useTrip } from '@/lib/sync';

export default function Home() {
  const now = useNow();
  const p = tripProgress(now);
  const nu = nextUp(now);
  const curCityId = p.day?.cityId ?? 'bkk';
  const wx = useWeather(curCityId, p.day?.date ?? DAYS[0].date);
  const { checks } = useTrip();
  const totActs = DAYS.reduce((s, d) => s + d.acts.length, 0);
  const doneActs = Object.keys(checks).length;

  const CITY_EMOJI: Record<string, string> = { bkk: '🏯', ayu: '🏛', cei: '⛰', cnx: '🐘', usm: '🏝' };

  return (
    <div className="px-4 pt-3">
      {/* ── HERO ── */}
      <div className="relative rounded-[24px] overflow-hidden shadow-lift">
        <HeroScene className="absolute inset-0 w-full h-full" />
        <div className="relative p-5 pt-4 text-white min-h-[320px] flex flex-col">
          <div className="flex justify-between">
            <span className="glass text-white text-[10.5px] font-extrabold px-3 py-1.5 rounded-full">📍 {p.day?.city ?? 'Milano'}</span>
            {wx && <span className="glass text-white text-[10.5px] font-extrabold px-3 py-1.5 rounded-full">{wx.live ? '🌤' : '☀️'} {wx.hi}°</span>}
          </div>
          <div className="mt-auto">
            <div className="text-[10px] font-black tracking-[2.4px] opacity-90">7 – 22 AGOSTO 2026 · 15 GIORNI</div>
            <h1 className="text-[34px] font-black tracking-[-1.2px] leading-tight drop-shadow-lg">{TRIP.name}</h1>
            <div className="text-[11.5px] font-semibold opacity-95">{TRIP.tagline}</div>
            <div className="flex gap-2 mt-3.5">
              {[[p.dd, 'GIORNI'], [p.hh, 'ORE'], [p.mm, 'MIN'], [p.before ? '✈️' : p.after ? '🏁' : '🌴', p.before ? 'PARTENZA' : p.after ? 'FINE' : 'VIAGGIO']].map(([v, l], i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="flex-1 glass rounded-2xl py-2 text-center">
                  <div className="text-[21px] font-black tabular-nums leading-tight">{v}</div>
                  <div className="text-[8px] font-black tracking-widest opacity-85">{l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── NEXT UP ── */}
      {nu && (
        <>
          <Sec>Next up</Sec>
          <Link href="/itinerario/" className="block bg-surface rounded-xl2 shadow-soft border-l-[5px] border-sunset p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sunset-soft flex items-center justify-center text-[22px] shrink-0">{nu.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-sunset tracking-wide">
                  {nu.minutes === 0 ? 'ADESSO' : nu.minutes < 60 ? `TRA ${nu.minutes} MINUTI` : `TRA ${Math.floor(nu.minutes / 60)}H ${nu.minutes % 60}M`} · {nu.time}
                </div>
                <div className="text-[14.5px] font-extrabold truncate">{nu.title}</div>
                <div className="text-[11px] text-ink2 truncate">{nu.sub}</div>
              </div>
              <a onClick={e => e.stopPropagation()} href={nu.lat != null ? dirs(nu.lat, nu.lng!) : gq(nu.title)} target="_blank" rel="noopener"
                className="bg-ocean text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl shrink-0">Naviga</a>
            </div>
          </Link>
        </>
      )}
      {p.during && !nu && (
        <>
          <Sec>Next up</Sec>
          <div className="bg-surface rounded-xl2 shadow-soft p-4 text-[13px] text-ink2">
            🌙 Programma di oggi completato — goditi la serata. Dai un&apos;occhiata a <Link href="/food/" className="text-ocean font-bold">Food & Drinks</Link> per un rooftop.
          </div>
        </>
      )}

      {/* ── PROGRESS ── */}
      <Sec>Progresso viaggio</Sec>
      <div className="bg-surface rounded-xl2 shadow-soft p-4">
        <div className="flex justify-between text-[11px] font-extrabold mb-2">
          <span>{p.during && p.dayIdx >= 0 ? `Giorno ${p.dayIdx + 1} di ${DAYS.length}` : p.before ? 'Si parte il 7 agosto' : 'Viaggio concluso 🙏'}</span>
          <span className="text-tropic">{p.pct}% · ✅ {doneActs}/{totActs}</span>
        </div>
        <div className="h-[9px] bg-line rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: p.pct + '%' }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-tropic to-ocean" />
        </div>
        <div className="flex justify-between text-[9px] font-bold text-dim mt-1.5">
          {TRIP.cities.map(c => <span key={c.id} className={p.day?.cityId === c.id ? 'text-tropic' : ''}>{p.day?.cityId === c.id ? '● ' : ''}{c.id.toUpperCase()}</span>)}
        </div>
      </div>

      {/* ── TAPPE ── */}
      <Sec>Le tappe</Sec>
      {TRIP.cities.map((c, i) => (
        <motion.div key={c.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
          <Link href="/itinerario/" className="flex items-center gap-3.5 bg-surface rounded-xl2 shadow-soft p-3 mb-2.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden relative shrink-0">
              <Scene id={c.scene as never} className="absolute inset-0 w-full h-full" />
              <span className="absolute inset-0 flex items-center justify-center text-[20px]">{CITY_EMOJI[c.id]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-extrabold">{c.name}</div>
              <div className="text-[11px] text-ink2">{c.nights} Agosto · {DAYS.filter(d => d.cityId === c.id).length} giorni in programma</div>
            </div>
            <span className="text-dim">›</span>
          </Link>
        </motion.div>
      ))}
      <div className="h-6" />
    </div>
  );
}

function Sec({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] font-black tracking-[1.8px] uppercase text-dim mt-5 mb-2.5 ml-1">{children}</div>;
}
