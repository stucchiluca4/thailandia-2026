'use client';
/* ═══════════ FOOD & DRINKS · per la città del giorno ═══════════ */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DAYS, HOTELS, TRIP, type CityId } from '@/data/itinerary';
import { VENUES, ROOFTOPS, CAT_LABEL, type FoodCat } from '@/data/food';
import { useNow, fmtDate } from '@/lib/time';
import { gq, distKm, fmtDist } from '@/lib/geo';

export default function Food() {
  const now = useNow();
  const today = fmtDate(now);
  const curDay = DAYS.find(d => d.date === today) ?? DAYS[1];
  const [cityId, setCityId] = useState<CityId>(curDay.cityId === 'ayu' ? 'bkk' : curDay.cityId);
  const [cat, setCat] = useState<FoodCat | 'all'>('all');

  const hotel = useMemo(() => {
    const d = DAYS.find(x => x.cityId === cityId && x.hotel);
    return d?.hotel ? HOTELS[d.hotel] : null;
  }, [cityId]);

  const venues = VENUES
    .filter(v => v.cityId === cityId && (cat === 'all' || v.cat === cat))
    .map(v => ({ ...v, dist: hotel ? distKm(hotel.lat, hotel.lng, v.lat, v.lng) : null }))
    .sort((a, b) => (a.dist ?? 99) - (b.dist ?? 99));
  const roofs = ROOFTOPS.filter(r => r.cityId === cityId);
  const cityName = TRIP.cities.find(c => c.id === cityId)?.name ?? '';

  return (
    <div className="px-4 pt-3">
      <h1 className="text-[22px] font-black tracking-tight">Food & Drinks</h1>
      <div className="text-[11.5px] text-ink2">📍 {cityName}{hotel ? ` · distanze da ${hotel.name.split(' ').slice(0, 2).join(' ')}` : ''}</div>

      {/* selettore città */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-4 px-4">
        {TRIP.cities.filter(c => c.id !== 'ayu').map(c => (
          <button key={c.id} onClick={() => setCityId(c.id as CityId)}
            className={`shrink-0 text-[11px] font-extrabold px-3.5 py-2 rounded-full ${cityId === c.id ? 'bg-ocean text-white' : 'bg-surface border border-line'}`}>
            {c.name}
          </button>
        ))}
      </div>
      {/* categorie */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2.5 -mx-4 px-4">
        <button onClick={() => setCat('all')} className={`shrink-0 text-[11px] font-extrabold px-3.5 py-2 rounded-full ${cat === 'all' ? 'bg-sunset text-white' : 'bg-surface border border-line'}`}>Tutte</button>
        {(Object.keys(CAT_LABEL) as FoodCat[]).map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 text-[11px] font-extrabold px-3.5 py-2 rounded-full ${cat === c ? 'bg-sunset text-white' : 'bg-surface border border-line'}`}>
            {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      {/* locali */}
      <div className="mt-4">
        {venues.map((v, i) => (
          <motion.div key={v.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-surface rounded-xl2 shadow-soft p-3 mb-2.5 flex items-center gap-3">
            <div className="w-[62px] h-[62px] rounded-2xl bg-gradient-to-br from-sunset to-[#E4574F] flex items-center justify-center text-[27px] shrink-0">
              {CAT_LABEL[v.cat].slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-extrabold truncate">{v.name}</div>
              <div className="text-[10.5px] text-ink2">{CAT_LABEL[v.cat].slice(3)} · ⭐ {v.rating} · {'€'.repeat(v.price)}</div>
              <div className="text-[10.5px] text-dim truncate">
                {v.dist != null && <>📍 {fmtDist(v.dist)} dall&apos;hotel · </>}{v.hours}
              </div>
              <div className="text-[11px] text-ink2 mt-1 leading-snug line-clamp-2">{v.desc}</div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <a href={gq(v.name + ' ' + cityName)} target="_blank" rel="noopener" className="bg-surface border border-line text-[10.5px] font-extrabold px-2.5 py-1.5 rounded-lg text-center">🗺</a>
              {v.site && <a href={v.site} target="_blank" rel="noopener" className="bg-ocean text-white text-[10.5px] font-extrabold px-2.5 py-1.5 rounded-lg text-center">🌐</a>}
            </div>
          </motion.div>
        ))}
        {venues.length === 0 && <div className="text-[12.5px] text-dim py-6 text-center">Nessun locale in questa categoria per {cityName} — prova &quot;Tutte&quot;.</div>}
      </div>

      {/* rooftop */}
      {roofs.length > 0 && (
        <>
          <div className="text-[10.5px] font-black tracking-[1.8px] uppercase text-dim mt-6 mb-2.5 ml-1">🍸 Rooftop & aperitivi</div>
          {roofs.map(r => (
            <div key={r.name} className="bg-surface rounded-xl2 shadow-soft overflow-hidden mb-3">
              <div className="h-2 bg-gradient-to-r from-ocean via-tropic to-sunset" />
              <div className="p-3.5">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <div className="text-[14.5px] font-extrabold">{r.name}</div>
                    <div className="text-[11px] text-ink2">⭐ {r.rating} · {'€'.repeat(r.price)} · {r.view}</div>
                    <div className="text-[10.5px] text-dim mt-0.5">👔 {r.dress}{r.booking ? ' · prenotazione consigliata' : ''}</div>
                  </div>
                  <span className="text-[9px] font-black px-2.5 py-1.5 rounded-full bg-sunset-soft text-sunset shrink-0 whitespace-nowrap">🌅 {r.bestTime}</span>
                </div>
                <div className="flex gap-2 mt-2.5">
                  <a href={gq(r.name + ' ' + cityName)} target="_blank" rel="noopener" className="bg-ocean text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl">🗺 Apri Maps</a>
                  {r.site && <a href={r.site} target="_blank" rel="noopener" className="bg-sunset text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl">🎟 Prenota</a>}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <div className="h-6" />
    </div>
  );
}
