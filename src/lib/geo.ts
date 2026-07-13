/* ═══════════ GEO · distanze e link navigazione ═══════════ */
export const nav = (lat: number, lng: number) => `https://maps.google.com/?q=${lat},${lng}`;
export const gq = (q: string) => 'https://maps.google.com/?q=' + encodeURIComponent(q);
export const dirs = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
export const appleMaps = (lat: number, lng: number) => `https://maps.apple.com/?daddr=${lat},${lng}`;
export const appleMapsQ = (q: string) => `https://maps.apple.com/?q=${encodeURIComponent(q)}`;
export const nearSearch = (q: string, lat: number, lng: number) =>
  `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${lat},${lng},16z`;
export const GRAB = 'https://grab.onelink.me/2695613898';
export const BOLT = 'https://bolt.eu/en-th/';

export function distKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371, dLat = (bLat - aLat) * Math.PI / 180, dLng = (bLng - aLng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
export const fmtDist = (km: number) => km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1).replace('.', ',') + ' km';
