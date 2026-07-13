'use client';
/* ═══════════ ASSISTENTE · concierge rule-based, offline ═══════════ */
import Link from 'next/link';
import { DAYS, HOTELS, type Activity } from '@/data/itinerary';
import { VENUES, ROOFTOPS } from '@/data/food';
import { useNow, fmtDate, toMin, actState } from '@/lib/time';
import { dirs, gq, distKm, fmtDist, GRAB } from '@/lib/geo';
import { useTrip } from '@/lib/sync';

export default function Assistente() {
  const now = useNow(15000);
  const { userEmail, checks } = useTrip();
  const name = userEmail ? userEmail.split('@')[0].replace(/^\w/, c => c.toUpperCase()) : 'viaggiatore';
  const h = now.getHours();
  const greet = h < 12 ? 'Sawasdee, buongiorno' : h < 18 ? 'Sawasdee, buon pomeriggio' : 'Sawasdee, buonasera';
  const today = fmtDate(now);
  const day = DAYS.find(d => d.date === today);

  /* Contesto: attività corrente, prossima, suggerimento food */
  let currentAct: Activity | null = null;
  let nextAct: Activity | null = null;
  if (day) {
    const cur = now.getHours() * 60 + now.getMinutes();
    for (let i = 0; i < day.acts.length; i++) {
      const st = actState(day, day.acts[i], i, now);
      if (st === 'now') currentAct = day.acts[i];
      if (st === 'next' && nextAct === null) nextAct = day.acts[i];
    }
    if (nextAct === null) nextAct = day.acts.find(a => toMin(a.t) > cur) ?? null;
  }
  const hotel = day?.hotel ? HOTELS[day.hotel] : null;

  /* Suggerimento: dopo le 17 un rooftop, altrimenti il locale più vicino all'hotel */
  const cityId = day?.cityId ?? 'bkk';
  const roof = ROOFTOPS.filter(r => r.cityId === cityId)[0];
  const eats = VENUES.filter(v => v.cityId === cityId && (h >= 17 ? ['thai', 'seafood', 'fine', 'street'].includes(v.cat) : ['brunch', 'thai', 'street'].includes(v.cat)))
    .map(v => ({ ...v, dist: hotel ? distKm(hotel.lat, hotel.lng, v.lat, v.lng) : 9 }))
    .sort((a, b) => a.dist - b.dist);
  const eat = eats[0];
  const doneToday = day ? day.acts.filter((_, i) => checks[`${day.id}_${i}`]).length : 0;

  const mins = nextAct ? toMin(nextAct.t) - (now.getHours() * 60 + now.getMinutes()) : 0;

  return (
    <div className="px-4 pt-3">
      <Link href="/altro/" className="text-[12px] font-bold text-dim">‹ Altro</Link>
      <div className="mt-3 rounded-xl3 overflow-hidden shadow-lift">
        <div className="bg-gradient-to-br from-night to-[#2C3E50] text-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tropic to-ocean flex items-center justify-center text-[18px]">🌴</div>
            <div>
              <div className="text-[13px] font-extrabold">{greet}, {name}</div>
              <div className="text-[10px] opacity-70">{now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} · {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}{day ? ' · ' + day.city : ''}</div>
            </div>
          </div>

          {!day && (
            <p className="text-[14px] leading-relaxed">
              Il viaggio {new Date() < new Date('2026-08-07') ? 'non è ancora iniziato — si parte il ' : 'si è concluso il '}
              <b>{new Date() < new Date('2026-08-07') ? '7 agosto ✈️' : '22 agosto 🙏'}</b>.<br /><br />
              Nel frattempo: controlla i tour <b className="text-[#FFD08A]">da prenotare</b> nella sezione Prenotazioni.
            </p>
          )}

          {day && (
            <p className="text-[14px] leading-[1.75]">
              {currentAct && <>Adesso sei a: <b>{currentAct.name}</b>.<br /><br /></>}
              {nextAct ? (<>
                {mins > 0 ? <>Tra <b className="text-[#FFD08A]">{mins < 60 ? mins + ' minuti' : Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm'}</b> hai:</> : <>Prossimo in programma:</>}<br />
                <b className="text-[16px]">📍 {nextAct.name}</b><br />
                <span className="text-[12px] opacity-85">
                  Ore {nextAct.t}{nextAct.cost ? ' · ' + nextAct.cost : ''}
                  {nextAct.desc ? ' — ' + nextAct.desc.slice(0, 90) + '…' : ''}
                </span><br /><br />
              </>) : (<>Programma di oggi completato ({doneToday}/{day.acts.length} spuntate) — serata libera! 🌙<br /><br /></>)}
              {h >= 16 && roof && (<>
                Per l&apos;aperitivo ti consiglio:<br />
                <b>🍸 {roof.name}</b> ⭐ {roof.rating}<br />
                <span className="text-[12px] opacity-85">{roof.view} · miglior orario {roof.bestTime}</span><br /><br />
              </>)}
              {eat && (<>
                {h >= 17 ? 'Per cena' : 'Per una pausa'} qui vicino:<br />
                <b>🍜 {eat.name}</b> ⭐ {eat.rating}<br />
                <span className="text-[12px] opacity-85">{hotel ? 'A ' + fmtDist(eat.dist) + ' dall’hotel' : ''} · {'€'.repeat(eat.price)}</span>
              </>)}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-5">
            {nextAct && nextAct.lat != null && (
              <a href={dirs(nextAct.lat, nextAct.lng!)} target="_blank" rel="noopener"
                className="bg-tropic text-white text-[11.5px] font-extrabold px-4 py-2.5 rounded-xl">🧭 Naviga alla prossima</a>
            )}
            <a href={GRAB} target="_blank" rel="noopener"
              className="text-[11.5px] font-extrabold px-4 py-2.5 rounded-xl border border-white/25 bg-white/10">🚕 Chiama un Grab</a>
            {eat && <a href={gq(eat.name + ' ' + (day?.city ?? ''))} target="_blank" rel="noopener"
              className="text-[11.5px] font-extrabold px-4 py-2.5 rounded-xl border border-white/25 bg-white/10">🍜 Vai al ristorante</a>}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-dim mt-4 px-1 leading-relaxed">
        L&apos;assistente ragiona su itinerario, orologio e hotel del giorno — tutto sul telefono, funziona anche offline e si aggiorna da solo ogni 15 secondi.
      </p>
      <div className="h-6" />
    </div>
  );
}
