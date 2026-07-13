'use client';
/* ═══════════ METEO · Open-Meteo live + medie agosto offline ═══════════ */
import { useEffect, useState } from 'react';
import type { CityId } from '@/data/itinerary';

const CLIMATE: Record<CityId, { hi: number; lo: number; rain: number }> = {
  bkk: { hi: 33, lo: 26, rain: 60 }, ayu: { hi: 33, lo: 25, rain: 55 },
  cei: { hi: 31, lo: 24, rain: 70 }, cnx: { hi: 31, lo: 24, rain: 65 },
  usm: { hi: 32, lo: 26, rain: 40 },
};
const COORDS: Record<CityId, [number, number]> = {
  bkk: [13.7563, 100.5018], ayu: [14.3532, 100.5689],
  cei: [19.9105, 99.8406], cnx: [18.7883, 98.9853], usm: [9.512, 100.0136],
};

export interface Wx { hi: number; lo: number; rain: number; live: boolean }

export function useWeather(cityId: CityId, dateStr: string): Wx | null {
  const [wx, setWx] = useState<Wx | null>(null);
  useEffect(() => {
    let alive = true;
    const clim = CLIMATE[cityId];
    setWx({ ...clim, live: false });
    const diffDays = (+new Date(dateStr + 'T12:00:00') - Date.now()) / 864e5;
    if (diffDays < -1 || diffDays > 15) return;
    const key = `wx_${cityId}_${dateStr}`;
    try {
      const c = JSON.parse(localStorage.getItem(key) || 'null');
      if (c && Date.now() - c.ts < 3 * 36e5) { setWx({ ...c.d, live: true }); return; }
    } catch { /* noop */ }
    const [lat, lng] = COORDS[cityId];
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FBangkok&start_date=${dateStr}&end_date=${dateStr}`)
      .then(r => r.json())
      .then(j => {
        if (!alive || !j?.daily?.temperature_2m_max) return;
        const d = { hi: Math.round(j.daily.temperature_2m_max[0]), lo: Math.round(j.daily.temperature_2m_min[0]), rain: j.daily.precipitation_probability_max[0] ?? clim.rain };
        try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), d })); } catch { /* noop */ }
        setWx({ ...d, live: true });
      }).catch(() => {});
    return () => { alive = false; };
  }, [cityId, dateStr]);
  return wx;
}
