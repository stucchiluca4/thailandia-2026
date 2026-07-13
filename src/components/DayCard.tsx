'use client';
/* ═══════════ COMPONENTI ITINERARIO ═══════════ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HOTELS, type Day, type Activity, type Transport } from '@/data/itinerary';
import { nav, dirs, appleMaps, gq, appleMapsQ, GRAB, BOLT } from '@/lib/geo';
import { dayState, actState, durOf, useNow } from '@/lib/time';
import { useTrip } from '@/lib/sync';
import { Scene } from './Scene';
import { useWeather } from './Weather';

const TAXI: Record<string, { name: string; tel: string }> = {
  bkk: { name: 'Taxi Radio BKK', tel: '1681' }, ayu: { name: 'Taxi Radio BKK', tel: '1681' },
  cei: { name: 'Taxi (via hotel)', tel: '+6653711339' }, cnx: { name: 'CM Taxi coop', tel: '+6653279291' },
  usm: { name: 'Taxi (via hotel)', tel: '+6677300599' },
};

export function DayCard({ day, defaultOpen }: { day: Day; defaultOpen?: boolean }) {
  const now = useNow();
  const [open, setOpen] = useState(!!defaultOpen);
  const st = dayState(day, now);
  const { checks, notes, setNote } = useTrip();
  const wx = useWeather(day.cityId, day.date);
  const hotel = day.hotel ? HOTELS[day.hotel] : null;
  const nDone = day.acts.filter((_, i) => checks[`${day.id}_${i}`]).length;

  return (
    <article className={`bg-surface rounded-xl2 shadow-soft mb-3.5 overflow-hidden transition-all
      ${st === 'today' ? 'ring-2 ring-tropic shadow-lift' : ''}
      ${st === 'past' && !open ? 'opacity-50 saturate-50' : ''}`}>
      {/* ── head ── */}
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-stretch text-left">
        <div className="w-[74px] shrink-0 relative flex items-end justify-center min-h-[78px]">
          <Scene id={day.scene} className="absolute inset-0 w-full h-full" />
          <div className="relative z-10 text-white text-center pb-2 drop-shadow">
            <div className="text-[22px] font-black leading-none">{day.n}</div>
            <div className="text-[8.5px] font-black tracking-widest">{day.w.toUpperCase()}</div>
          </div>
        </div>
        <div className="flex-1 min-w-0 px-3.5 py-3">
          <div className="text-[14.5px] font-extrabold tracking-tight truncate">{day.title}</div>
          <div className="text-[11px] text-ink2 font-semibold">📍 {day.city}</div>
          <div className="text-[10.5px] text-dim truncate mt-0.5">
            {wx && <>{wx.live ? '🌤' : '📊'} {wx.hi}° · </>}
            {hotel && <>🏨 {hotel.name.split(' ').slice(0, 2).join(' ')} · </>}
            ✅ {nDone}/{day.acts.length}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 py-3 pr-3.5">
          {st === 'today' && <span className="text-[8.5px] font-black px-2.5 py-1 rounded-full bg-tropic text-white">● OGGI</span>}
          {st === 'past' && <span className="text-[8.5px] font-black px-2.5 py-1 rounded-full bg-line text-ink2">PASSATO</span>}
          {st === 'future' && <span className="text-[8.5px] font-black px-2.5 py-1 rounded-full bg-ocean-soft text-ocean">{day.w} {day.n}</span>}
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-dim text-[11px]">▼</motion.span>
        </div>
      </button>

      {/* ── body ── */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-line">

            {/* hotel */}
            {hotel && (
              <div className="m-3.5 p-3.5 rounded-2xl bg-bg border border-line">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[9px] font-black tracking-widest text-dim">HOTEL</div>
                    <div className="text-[14px] font-extrabold">{hotel.name}</div>
                    <div className="text-[11px] text-ink2">Check-in {hotel.ci} · Check-out {hotel.co} · <b>{hotel.code}</b></div>
                  </div>
                  <span className="text-2xl">🏨</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <A href={nav(hotel.lat, hotel.lng)} cls="bg-ocean text-white">🗺 Google Maps</A>
                  <A href={appleMaps(hotel.lat, hotel.lng)} cls="ghost">🧭 Apple Maps</A>
                  <A href={hotel.url} cls="ghost">🎟 Booking</A>
                  <A href={GRAB} cls="bg-tropic text-white">🟢 Grab</A>
                  <A href={'tel:' + hotel.phone.replace(/\s/g, '')} cls="ghost">📞</A>
                </div>
              </div>
            )}

            {/* trasporti */}
            {day.transports.length > 0 && <SecLabel>Spostamenti</SecLabel>}
            {day.transports.map((t, i) => <TransportRow key={i} t={t} cityId={day.cityId} />)}

            {/* timeline */}
            <SecLabel>Programma · {day.acts.length} attività</SecLabel>
            <div className="pb-2">
              {day.acts.map((a, i) => <TimelineRow key={i} day={day} act={a} idx={i} now={now} />)}
            </div>

            {/* note */}
            <div className="px-3.5 pb-4">
              <SecLabel inline>Note personali (condivise)</SecLabel>
              <textarea value={notes[day.id] ?? ''} onChange={e => setNote(day.id, e.target.value)}
                placeholder="Appunti per questa giornata…"
                className="w-full bg-bg border border-line rounded-2xl px-3.5 py-2.5 text-[12.5px] min-h-[58px] resize-y outline-none focus:border-ocean" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function SecLabel({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  return <div className={`text-[10px] font-black tracking-[1.6px] uppercase text-dim ${inline ? 'mb-1.5' : 'mx-3.5 mt-3 mb-1.5'}`}>{children}</div>;
}
export function A({ href, cls, children, onClick }: { href?: string; cls: string; children: React.ReactNode; onClick?: () => void }) {
  const base = 'inline-flex items-center gap-1 text-[10.5px] font-extrabold px-2.5 py-[7px] rounded-[10px] active:scale-95 transition-transform';
  const ghost = cls === 'ghost' ? 'bg-surface border border-line text-ink' : cls;
  if (onClick) return <button onClick={onClick} className={`${base} ${ghost}`}>{children}</button>;
  return <a href={href} target={href?.startsWith('tel:') ? undefined : '_blank'} rel="noopener" className={`${base} ${ghost}`}>{children}</a>;
}

/* ── Trasporto con Google/Apple/Grab/Bolt/Taxi ── */
export function TransportRow({ t, cityId }: { t: Transport; cityId: string }) {
  const taxi = TAXI[cityId];
  return (
    <div className="mx-3.5 mb-2 p-3 rounded-2xl border-[1.5px] border-dashed border-line">
      <div className="flex items-center gap-2.5">
        <span className="text-[19px]">{t.mode.slice(0, 2)}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-bold truncate">{t.from} → {t.to}</div>
          <div className="text-[10.5px] text-ink2">{t.time} · {t.mode.slice(2).trim()} · {t.dur}{t.cost ? ' · ' + t.cost : ''}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <A href={`https://www.google.com/maps/dir/${encodeURIComponent(t.from)}/${encodeURIComponent(t.to)}`} cls="ghost">🗺 Google</A>
        <A href={appleMapsQ(t.to)} cls="ghost">🧭 Apple</A>
        <A href={GRAB} cls="ghost">🟢 Grab</A>
        <A href={BOLT} cls="ghost">⚡ Bolt</A>
        {taxi && <A href={'tel:' + taxi.tel} cls="ghost">🚕 Taxi</A>}
      </div>
      {t.note && <div className="text-[10.5px] text-sunset font-bold mt-1.5">{t.note}</div>}
    </div>
  );
}

/* ── Riga timeline con stato smart + spunta ── */
function TimelineRow({ day, act, idx, now }: { day: Day; act: Activity; idx: number; now: Date }) {
  const [sheet, setSheet] = useState(false);
  const { checks, toggleCheck } = useTrip();
  const k = `${day.id}_${idx}`;
  const done = !!checks[k];
  const st = actState(day, act, idx, now);
  const dotColor = done ? 'bg-tropic border-tropic' :
    st === 'past' ? 'bg-dim border-dim' : st === 'now' ? 'bg-tropic border-tropic pulse-now' :
    st === 'next' ? 'bg-sunset border-sunset' : 'bg-surface border-ocean';
  const cardBg = st === 'now' && !done ? 'bg-tropic-soft border-[1.5px] border-tropic' :
    st === 'next' && !done ? 'bg-sunset-soft border-[1.5px] border-sunset' : '';

  return (
    <>
      <div className={`flex px-3.5 ${st === 'past' && !done ? 'opacity-55' : ''} ${done ? 'opacity-70' : ''}`}>
        <div className="w-11 text-right py-3.5 text-[11px] font-extrabold text-dim tabular-nums shrink-0">{act.t}</div>
        <div className="w-7 relative flex justify-center shrink-0">
          <div className="absolute inset-y-0 w-0.5 bg-line" />
          <div className={`relative w-[13px] h-[13px] rounded-full border-[2.5px] mt-[17px] ${dotColor}`} />
        </div>
        <button onClick={() => setSheet(true)} className={`flex-1 min-w-0 my-1 px-3 py-2.5 rounded-2xl text-left ${cardBg}`}>
          <div className={`text-[13px] font-bold ${done ? 'line-through decoration-tropic/60 text-ink2' : ''}`}>{act.name}</div>
          <div className="text-[10.5px] text-ink2 mt-0.5 flex flex-wrap gap-x-2 items-center">
            <span>{act.t}–{act.e}</span>
            {act.cost && <span>💰 {act.cost}</span>}
            {act.status === 'booked' && <Chip cls="bg-tropic-soft text-tropic">Prenotata</Chip>}
            {act.status === 'todo' && <Chip cls="bg-sunset-soft text-sunset">Da prenotare</Chip>}
            {st === 'now' && !done && <Chip cls="bg-tropic text-white">● In corso</Chip>}
            {st === 'next' && !done && <Chip cls="bg-sunset text-white">→ Prossima</Chip>}
            {st === 'past' && !done && day.date < nowDate(now) === false && null}
          </div>
        </button>
        <button onClick={() => toggleCheck(k)} aria-label="Segna fatta"
          className={`self-center ml-1 w-[26px] h-[26px] rounded-full border-2 shrink-0 text-[13px] leading-none
          ${done ? 'bg-tropic border-tropic text-white' : 'border-line text-transparent'}`}>✓</button>
      </div>
      <ActivitySheet open={sheet} onClose={() => setSheet(false)} day={day} act={act} />
    </>
  );
}
const nowDate = (d: Date) => d.toISOString().slice(0, 10);
function Chip({ cls, children }: { cls: string; children: React.ReactNode }) {
  return <span className={`text-[8.5px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${cls}`}>{children}</span>;
}

/* ── Bottom sheet dettaglio attività ── */
export function ActivitySheet({ open, onClose, day, act }: { open: boolean; onClose: () => void; day: Day; act: Activity }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-night/50 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 120 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-surface w-full max-w-xl rounded-t-[26px] max-h-[86dvh] overflow-y-auto shadow-lift"
            style={{ paddingBottom: 'calc(20px + var(--safe-b))' }}>
            <div className="w-10 h-1 rounded-full bg-line mx-auto mt-2.5" />
            <div className="px-5 pt-3.5 pb-3 border-b border-line">
              <div className="text-[10px] font-black text-ocean tracking-wide">{day.w.toUpperCase()} {day.n} AGOSTO · {act.t} – {act.e} · {durOf(act)}</div>
              <h2 className="text-[20px] font-black tracking-tight mt-1">{act.name}</h2>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {act.status === 'booked' && <Chip cls="bg-tropic-soft text-tropic">Prenotata{act.code ? ' · ' + act.code : ''}</Chip>}
                {act.status === 'todo' && <Chip cls="bg-sunset-soft text-sunset">Da prenotare</Chip>}
                {act.dress && <Chip cls="bg-ocean-soft text-ocean">👗 Dress code templi</Chip>}
              </div>
            </div>
            <div className="px-5 py-3.5">
              {act.desc && <p className="text-[13px] text-ink2 leading-relaxed">{act.desc}</p>}
              <dl className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-2 mt-3.5 text-[12px]">
                {act.addr && <KV k="Indirizzo" v={act.addr} />}
                {act.lat != null && <KV k="GPS" v={`${act.lat.toFixed(4)}, ${act.lng!.toFixed(4)}`} />}
                {act.code && <KV k="Prenotazione" v={act.code} />}
                {act.contacts && <KV k="Telefono" v={act.contacts} />}
                {act.cost && <KV k="Costo" v={act.cost} />}
              </dl>
            </div>
            <div className="flex flex-wrap gap-2 px-5 pb-2">
              {act.lat != null && <A href={dirs(act.lat, act.lng!)} cls="bg-ocean text-white">🧭 Naviga</A>}
              {act.lat != null && <A href={appleMaps(act.lat, act.lng!)} cls="ghost">🧭 Apple Maps</A>}
              {!act.lat && <A href={gq(act.name + ' ' + day.city)} cls="bg-ocean text-white">🗺 Cerca su Maps</A>}
              {act.contacts && <A href={'tel:' + act.contacts.replace(/\s/g, '')} cls="ghost">📞 Chiama</A>}
              <A href={GRAB} cls="ghost">🚕 Grab</A>
              {act.site && <A href={act.site} cls="bg-sunset text-white">🎟 {act.status === 'todo' ? 'Prenota ora' : 'Sito ufficiale'}</A>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function KV({ k, v }: { k: string; v: string }) {
  return (<><dt className="text-[9.5px] font-black tracking-wide uppercase text-dim pt-0.5">{k}</dt><dd className="font-semibold break-words">{v}</dd></>);
}
