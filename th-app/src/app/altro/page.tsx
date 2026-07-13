'use client';
/* ═══════════ ALTRO · vicino a te, info, assistente ═══════════ */
import Link from 'next/link';
import { DAYS, HOTELS } from '@/data/itinerary';
import { NEAR_CATS_500, NEAR_CATS_2K } from '@/data/food';
import { useNow, fmtDate } from '@/lib/time';
import { nearSearch } from '@/lib/geo';
import { downloadICS } from '@/lib/ics';
import { useTrip, hasSupabase, sb } from '@/lib/sync';

export default function Altro() {
  const now = useNow();
  const today = fmtDate(now);
  const day = DAYS.find(d => d.date === today) ?? DAYS.find(d => d.hotel) ?? DAYS[1];
  const hotel = day.hotel ? HOTELS[day.hotel] : HOTELS.shanghai;
  const { userEmail } = useTrip();

  return (
    <div className="px-4 pt-3">
      <h1 className="text-[22px] font-black tracking-tight">Altro</h1>

      <Link href="/altro/assistente/" className="block mt-4 rounded-xl2 shadow-lift overflow-hidden">
        <div className="bg-gradient-to-br from-night to-[#2C3E50] text-white p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-tropic to-ocean flex items-center justify-center text-[20px] shrink-0">🌴</div>
          <div className="flex-1">
            <div className="text-[14.5px] font-extrabold">Assistente di viaggio</div>
            <div className="text-[11px] opacity-80">Cosa fare adesso, consigli contestuali — funziona offline</div>
          </div>
          <span className="opacity-70">›</span>
        </div>
      </Link>

      <Sec>Vicino a te · da {hotel.name.split(' ').slice(0, 3).join(' ')}</Sec>
      <div className="text-[10px] font-black tracking-widest text-dim ml-1 mb-1.5">ENTRO 500 METRI</div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {NEAR_CATS_500.map(c => (
          <a key={c.q} href={nearSearch(c.q, hotel.lat, hotel.lng)} target="_blank" rel="noopener"
            className="shrink-0 w-[92px] bg-surface rounded-xl2 shadow-soft p-3 text-center">
            <div className="text-[22px]">{c.emoji}</div>
            <div className="text-[10.5px] font-extrabold mt-1">{c.label}</div>
            <div className="text-[9px] text-ocean font-bold mt-0.5">Naviga →</div>
          </a>
        ))}
      </div>
      <div className="text-[10px] font-black tracking-widest text-dim ml-1 mb-1.5 mt-3">ENTRO 2 KM</div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {NEAR_CATS_2K.map(c => (
          <a key={c.q} href={nearSearch(c.q, hotel.lat, hotel.lng)} target="_blank" rel="noopener"
            className="shrink-0 w-[92px] bg-surface rounded-xl2 shadow-soft p-3 text-center">
            <div className="text-[22px]">{c.emoji}</div>
            <div className="text-[10.5px] font-extrabold mt-1">{c.label}</div>
            <div className="text-[9px] text-ocean font-bold mt-0.5">Naviga →</div>
          </a>
        ))}
      </div>

      <Sec>Info utili</Sec>
      <Card t="🆘 Emergenze">Polizia turistica <b>1155</b> (inglese) · Ambulanza <b>1669</b> · Ambasciata d&apos;Italia BKK <b>+66 2 250 4970</b> · Ospedali: Bumrungrad (BKK), Bangkok Hospital Samui (Chaweng)</Card>
      <Card t="💰 Soldi">1 € ≈ 38–40 THB. Bancomat: fee fissa 220 THB → pochi prelievi grandi. Contanti per street food, mercati, tuk-tuk.</Card>
      <Card t="📱 SIM">In aeroporto: AIS o TrueMove ~300 THB illimitati 8–15 giorni. Oppure eSIM (Airalo) prima di partire.</Card>
      <Card t="👗 Templi">Spalle e ginocchia coperte, scarpe fuori. Mai toccare la testa, mai piedi verso il Buddha, donne mai toccare i monaci.</Card>
      <Card t="🌧 Agosto">30–32°C, umido. Acquazzoni 15–18 che passano in 30–60 min. Templi entro mezzogiorno, poncho in borsa.</Card>

      <Sec>Impostazioni</Sec>
      <button onClick={downloadICS} className="w-full bg-surface rounded-xl2 shadow-soft p-4 text-left flex items-center gap-3">
        <span className="text-[20px]">📅</span>
        <div className="flex-1">
          <div className="text-[13px] font-extrabold">Esporta promemoria nel Calendario</div>
          <div className="text-[11px] text-ink2">Voli, check-in e attività con avvisi — funzionano anche ad app chiusa</div>
        </div>
      </button>
      <div className="bg-surface rounded-xl2 shadow-soft p-4 mt-2.5 flex items-center gap-3">
        <span className="text-[20px]">{hasSupabase ? '☁️' : '📴'}</span>
        <div className="flex-1">
          <div className="text-[13px] font-extrabold">{hasSupabase ? 'Sincronizzazione attiva' : 'Modalità locale'}</div>
          <div className="text-[11px] text-ink2">{hasSupabase ? (userEmail ? `Connesso come ${userEmail}` : 'Accedi per sincronizzare con l’altro telefono') : 'Configura .env.local con le chiavi Supabase per la sync a due'}</div>
        </div>
        {hasSupabase && userEmail && (
          <button onClick={async () => { await sb()?.auth.signOut(); location.href = '/login/'; }}
            className="text-[10.5px] font-extrabold text-red-400 border border-line rounded-lg px-2.5 py-1.5">Esci</button>
        )}
      </div>
      <div className="h-6" />
    </div>
  );
}
function Sec({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] font-black tracking-[1.8px] uppercase text-dim mt-6 mb-2.5 ml-1">{children}</div>;
}
function Card({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl2 shadow-soft p-4 mb-2.5">
      <div className="text-[12.5px] font-extrabold">{t}</div>
      <div className="text-[12px] text-ink2 mt-1 leading-relaxed">{children}</div>
    </div>
  );
}
