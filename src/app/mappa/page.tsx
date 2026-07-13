'use client';
/* ═══════════ MAPPA · stile Airbnb con filtri ═══════════ */
import { useEffect, useRef, useState } from 'react';
import { TRIP, DAYS, HOTELS } from '@/data/itinerary';
import { VENUES, ROOFTOPS } from '@/data/food';
import { dirs } from '@/lib/geo';
import 'leaflet/dist/leaflet.css';

type Filter = 'all' | 'hotel' | 'act' | 'food' | 'roof' | 'beach' | 'shop';
const FILTERS: { id: Filter; l: string }[] = [
  { id: 'all', l: 'Tutto' }, { id: 'hotel', l: '🏨 Hotel' }, { id: 'act', l: '🎯 Attività' },
  { id: 'food', l: '🍜 Food' }, { id: 'roof', l: '🍸 Rooftop' }, { id: 'beach', l: '🏖 Spiagge' }, { id: 'shop', l: '🛍 Shopping' },
];

interface Pt { lat: number; lng: number; name: string; sub: string; kind: Filter; color: string; emoji: string }

function buildPoints(): Pt[] {
  const cityColor: Record<string, string> = Object.fromEntries(TRIP.cities.map(c => [c.id, c.color]));
  const pts: Pt[] = [];
  Object.values(HOTELS).forEach(h => pts.push({ lat: h.lat, lng: h.lng, name: h.name, sub: h.addr, kind: 'hotel', color: '#E8B54A', emoji: '🏨' }));
  DAYS.forEach(d => d.acts.forEach(a => {
    if (a.lat == null) return;
    const n = a.name.toLowerCase();
    const kind: Filter = /beach|spiaggia|mare|hin ta/.test(n) ? 'beach' : /market|mercato|bazaar|shopping|pratunam|siam square/.test(n) ? 'shop' : /cena|pranzo|colazione/.test(n) ? 'food' : 'act';
    pts.push({ lat: a.lat, lng: a.lng!, name: a.name, sub: `${d.w} ${d.n} Ago · ${a.t}–${a.e}${a.cost ? ' · ' + a.cost : ''}`, kind, color: cityColor[d.cityId] ?? '#0984E3', emoji: kind === 'beach' ? '🏖' : kind === 'shop' ? '🛍' : kind === 'food' ? '🍜' : '📍' });
  }));
  VENUES.forEach(v => pts.push({ lat: v.lat, lng: v.lng, name: v.name, sub: `⭐ ${v.rating} · ${'€'.repeat(v.price)}`, kind: 'food', color: '#FD9644', emoji: '🍜' }));
  ROOFTOPS.forEach(r => pts.push({ lat: r.lat, lng: r.lng, name: r.name, sub: `⭐ ${r.rating} · ${r.view}`, kind: 'roof', color: '#8E44AD', emoji: '🍸' }));
  return pts;
}

export default function Mappa() {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [sel, setSel] = useState<Pt | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !ref.current || mapRef.current) return;
      const dark = document.documentElement.classList.contains('dark');
      const map = L.map(ref.current, { zoomControl: false }).setView([13.9, 100.6], 6);
      mapRef.current = map;
      L.tileLayer(dark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, attribution: '© OpenStreetMap © CARTO' }).addTo(map);
      L.polyline(TRIP.cities.map(c => [c.lat, c.lng]), { color: '#0984E3', weight: 2.5, dashArray: '7 7', opacity: 0.55 }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      map.fitBounds(TRIP.cities.map(c => [c.lat, c.lng] as [number, number]), { padding: [36, 36] });
      draw(L, filter);
    })();
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draw = (L: any, f: Filter) => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    buildPoints().filter(p => f === 'all' || p.kind === f).forEach(p => {
      const big = p.kind === 'hotel';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${big ? 30 : 24}px;height:${big ? 30 : 24}px;border-radius:50%;background:${p.color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:${big ? 14 : 11}px">${p.emoji}</div>`,
        iconSize: [big ? 30 : 24, big ? 30 : 24], iconAnchor: [big ? 15 : 12, big ? 15 : 12],
      });
      L.marker([p.lat, p.lng], { icon }).addTo(layer).on('click', () => setSel(p));
    });
  };

  useEffect(() => {
    (async () => {
      if (!mapRef.current) return;
      const L = (await import('leaflet')).default;
      draw(L, filter);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="relative" style={{ height: 'calc(100dvh - 140px)' }}>
      <div ref={ref} className="absolute inset-0 z-0" />
      {/* filtri */}
      <div className="absolute top-3 inset-x-0 z-[500] flex gap-2 overflow-x-auto no-scrollbar px-4">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => { setFilter(f.id); setSel(null); }}
            className={`shrink-0 text-[11px] font-extrabold px-3.5 py-2 rounded-full shadow-soft
            ${filter === f.id ? 'bg-night text-white' : 'glass text-ink'}`}>{f.l}</button>
        ))}
      </div>
      {/* card selezione */}
      {sel && (
        <div className="absolute bottom-4 inset-x-4 z-[500]">
          <div className="bg-surface rounded-xl2 shadow-lift p-3.5 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] shrink-0" style={{ background: sel.color + '22' }}>{sel.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-extrabold truncate">{sel.name}</div>
              <div className="text-[11px] text-ink2 truncate">{sel.sub}</div>
            </div>
            <a href={dirs(sel.lat, sel.lng)} target="_blank" rel="noopener"
              className="bg-ocean text-white text-[11px] font-extrabold px-3.5 py-2.5 rounded-xl shrink-0">Naviga</a>
            <button onClick={() => setSel(null)} className="text-dim px-1">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
