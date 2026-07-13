# Thailandia 2026 · Travel Companion

PWA premium per il viaggio in Thailandia (7–22 agosto 2026), in due con sincronizzazione.

## Stack
Next.js 15 (export statico) · TypeScript · Tailwind · Framer Motion · Supabase (magic link + realtime) · Leaflet · PWA offline.

## Avvio locale
```bash
npm install
cp .env.example .env.local   # inserisci URL e publishable key Supabase
npm run dev                  # http://localhost:3000
```
Senza `.env.local` l'app parte in **modalità locale** (nessun login, dati solo sul dispositivo).

## Build e deploy
```bash
npm run build                # genera ./out (statico puro)
```
Su **Vercel**: importa il progetto, framework Next.js (auto), aggiungi le due env
`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`, deploy.

## Struttura
- `src/data/itinerary.ts` — l'itinerario completo (fonte di verità)
- `src/data/food.ts` — locali e rooftop curati per città
- `src/lib/sync.ts` — local-first: IndexedDB + outbox + Supabase Realtime
- `src/lib/time.ts` — calendario intelligente e NEXT UP
- `public/photos/` — metti qui foto reali per sostituire le illustrazioni

## Supabase (già configurato dall'utente)
Tabelle: `trip_members`, `activity_checks`, `day_notes`, `attachments` + RLS `is_member()` + bucket privato `vouchers`. SQL completo nel documento Step 1.
