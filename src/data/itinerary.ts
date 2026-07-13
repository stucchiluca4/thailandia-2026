/* ═══════════ ITINERARIO · fonte di verità statica ═══════════ */
export type CityId = 'bkk' | 'ayu' | 'cei' | 'cnx' | 'usm';
export type SceneId = 'temple' | 'ruins' | 'mountain' | 'beach' | 'islands' | 'market' | 'flight' | 'jungle' | 'hero';
export type ActStatus = 'booked' | 'todo';

export interface Activity {
  t: string; e: string; name: string;
  desc?: string; addr?: string; lat?: number; lng?: number;
  cost?: string; dur?: string; status?: ActStatus; code?: string;
  site?: string; contacts?: string; dress?: boolean;
}
export interface Transport {
  time: string; from: string; to: string; mode: string; dur: string;
  cost?: string; note?: string; code?: string; site?: string;
}
export interface Hotel {
  name: string; code: string; lat: number; lng: number;
  addr: string; phone: string; url: string; ci: string; co: string;
}
export interface Day {
  id: string; date: string; w: string; n: number;
  city: string; cityId: CityId; scene: SceneId;
  title: string; sub: string; budget: number;
  hotel?: keyof typeof HOTELS; checkIn?: boolean; checkOutHotel?: string;
  transports: Transport[]; acts: Activity[];
}
export interface Booking {
  id: string; t: string; s: string; provider: string; cost: string; d: string;
  url?: string; phone?: string; lat?: number; lng?: number; todo?: boolean;
}

export const nav = (lat: number, lng: number) => `https://maps.google.com/?q=${lat},${lng}`;
export const gq = (q: string) => 'https://maps.google.com/?q=' + encodeURIComponent(q);
export const dirs = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export const GRAB = 'https://grab.onelink.me/2695613898';
export const BOLT = 'https://bolt.eu/en-th/';

export const TRIP = {
  name: 'Thailandia 2026',
  tagline: 'Bangkok · Ayutthaya · Chiang Rai · Chiang Mai · Koh Samui',
  start: '2026-08-07T14:05:00',
  end: '2026-08-22T07:35:00',
  cities: [
    { id: 'bkk', name: 'Bangkok', lat: 13.7563, lng: 100.5018, color: '#0E7490', nights: '8–10 + 19–21', scene: 'temple' },
    { id: 'ayu', name: 'Ayutthaya', lat: 14.3532, lng: 100.5689, color: '#B4560F', nights: 'day trip 10/8', scene: 'ruins' },
    { id: 'cei', name: 'Chiang Rai', lat: 19.9105, lng: 99.8406, color: '#159570', nights: '10–12', scene: 'mountain' },
    { id: 'cnx', name: 'Chiang Mai', lat: 18.7883, lng: 98.9853, color: '#1D7A54', nights: '12–14', scene: 'mountain' },
    { id: 'usm', name: 'Koh Samui', lat: 9.512, lng: 100.0136, color: '#0891B2', nights: '14–19', scene: 'beach' },
  ],
};

/* Climi medi agosto (per fallback offline) — fonte: medie climatiche */
export const CLIMATE = {
  bkk: { hi: 33, lo: 26, rain: 60, note: 'Acquazzoni pomeridiani brevi' },
  ayu: { hi: 33, lo: 25, rain: 55, note: 'Caldo umido, piogge serali' },
  cei: { hi: 31, lo: 24, rain: 70, note: 'Verde intenso, piogge frequenti' },
  cnx: { hi: 31, lo: 24, rain: 65, note: 'Fresco la sera in montagna' },
  usm: { hi: 32, lo: 26, rain: 40, note: 'Il lato più asciutto del golfo' },
};

export const HOTELS: Record<string, Hotel> = {
  shanghai: { name: 'Shanghai Mansion Bangkok', code: 'BKG-SHM-2026', lat: 13.7397, lng: 100.5096, addr: '479-481 Yaowarat Rd, Samphanthawong', phone: '+66 2 221 2121', url: 'https://www.booking.com/hotel/th/shanghai-inn.html', ci: '14:00', co: '12:00' },
  selene: { name: 'Hotel Selene Chiang Rai', code: 'BKG-SEL-2026', lat: 19.908, lng: 99.828, addr: 'Wiang, Mueang Chiang Rai', phone: '+66 53 711 339', url: 'https://www.booking.com/hotel/th/luxe-selene-chiang-rai.html', ci: '14:00', co: '12:00' },
  lanna: { name: 'Lanna Oriental Hotel', code: 'BKG-LAN-2026', lat: 18.79, lng: 98.984, addr: 'Singharat Rd, Old City, Chiang Mai', phone: '+66 53 224 111', url: 'https://www.booking.com/hotel/th/lanna-oriental.html', ci: '14:00', co: '12:00' },
  stay: { name: 'The Stay Chaweng Beach Resort', code: 'BKG-STY-2026', lat: 9.545, lng: 100.062, addr: 'Chaweng Beach Rd, Bophut, Koh Samui', phone: '+66 77 300 599', url: 'https://www.booking.com/hotel/th/the-stay-chaweng-beach-resort.html', ci: '14:00', co: '12:00' },
  amara: { name: 'Amara Bangkok', code: 'BKG-AMA-2026', lat: 13.724, lng: 100.523, addr: '180/1 Surawong Rd, Bangrak', phone: '+66 2 021 8888', url: 'https://www.booking.com/hotel/th/amara-bangkok-hotel.html', ci: '14:00', co: '12:00' },
};

const GYG = {
  ayu: 'https://www.getyourguide.com/bangkok-l169/ayutthaya-day-trip-from-bangkok-t46279/',
  cr: 'https://www.getyourguide.com/chiang-rai-l585/chiang-rai-temples-tour-t46327/',
  gt: 'https://www.getyourguide.com/chiang-rai-l585/golden-triangle-day-trip-t237458/',
  ds: 'https://www.getyourguide.com/chiang-mai-l266/doi-suthep-temple-tour-t46315/',
  ele: 'https://www.elephantjunglesanctuary.com/',
  khan: 'https://www.khum-khantoke.com/',
  at: 'https://www.getyourguide.com/koh-samui-l2449/koh-samui-ang-thong-national-marine-park-day-trip-t46427/',
  kt: 'https://www.getyourguide.com/koh-samui-l2449/koh-samui-koh-tao-and-koh-nang-yuan-full-day-tour-t46452/',
  dam: 'https://www.getyourguide.com/bangkok-l169/bangkok-damnoen-saduak-floating-market-and-maeklong-railway-market-t58413/',
  bus: 'https://www.12go.asia/en/travel/chiang-rai/chiang-mai',
};

const A = (t: string, e: string, name: string, o: Partial<Activity> = {}): Activity => ({ t, e, name, ...o });
const T = (time: string, from: string, to: string, mode: string, dur: string, o: Partial<Transport> = {}): Transport => ({ time, from, to, mode, dur, ...o });

export const DAYS: Day[] = [
  {
    id: 'd1', date: '2026-08-07', w: 'Ven', n: 7, city: 'Milano → In volo', cityId: 'bkk', scene: 'flight',
    title: 'Partenza', sub: 'Malpensa → Bangkok, volo notturno', budget: 30,
    transports: [T('14:05', 'Milano Malpensa T1', 'Bangkok Suvarnabhumi', '✈ Volo diretto', '11h30', { code: 'VOLO-1' })],
    acts: [
      A('11:00', '13:30', 'Check-in Malpensa T1', { desc: 'Arrivo 3h prima. Passaporti validi 6+ mesi, prenotazioni scaricate offline.', addr: 'Aeroporto Malpensa T1', lat: 45.6306, lng: 8.7281, status: 'booked', code: 'VOLO-1' }),
      A('14:05', '23:59', 'Volo MXP → BKK', { desc: 'Decollo 14:05, atterraggio 05:55 del giorno dopo (ora thai, +5h). Dormire in volo: all\'arrivo è mattina.', dur: '11h30', status: 'booked', code: 'VOLO-1' }),
    ],
  },
  {
    id: 'd2', date: '2026-08-08', w: 'Sab', n: 8, city: 'Bangkok', cityId: 'bkk', scene: 'temple',
    title: 'Templi del fiume', sub: 'Grand Palace · Wat Pho · Wat Arun · Sky Bar', budget: 2200,
    hotel: 'shanghai', checkIn: true,
    transports: [
      T('06:30', 'Aeroporto BKK', 'Shanghai Mansion (Chinatown)', '🚕 Grab / taxi ufficiale', '45 min', { cost: '~400 THB' }),
      T('13:30', 'Wat Pho — Tha Tien Pier', 'Wat Arun', '⛵ Traghetto', '5 min', { cost: '9 THB A/R' }),
      T('18:30', 'Kudi Chin', 'Lebua State Tower', '🚕 Grab', '20 min', { cost: '~120 THB' }),
    ],
    acts: [
      A('05:55', '07:30', 'Arrivo + transfer hotel', { desc: 'SIM thai in aeroporto (AIS/True ~300 THB). Grab verso Chinatown, deposito bagagli in hotel.', lat: 13.69, lng: 100.7501, status: 'booked', code: 'VOLO-1' }),
      A('09:30', '10:00', 'Phra Chan Market', { desc: 'Mercato degli amuleti buddhisti sul fiume, solo locali. Non trattare sul prezzo: è irrispettoso.', addr: 'Maharat Rd, Phra Nakhon', lat: 13.7557, lng: 100.4905, cost: 'Gratis', dur: '30 min' }),
      A('10:00', '12:00', 'Royal Grand Palace + Wat Phra Kaew', { desc: 'Il sito più sacro del paese: Buddha di Smeraldo, palazzo Chakri. Biglietti solo in cassa, dalle 10:30 code lunghe. Dress code rigido: spalle e gambe coperte.', addr: 'Na Phra Lan Rd', lat: 13.75, lng: 100.4913, cost: '500 THB', dur: '2–2.5h', status: 'todo', site: 'https://www.royalgrandpalace.th/en/home', dress: true }),
      A('12:00', '13:30', 'Wat Pho — Buddha Reclinante', { desc: 'Buddha di 46 m in foglia d\'oro. Massaggio nella scuola più antica del paese (420 THB/h) — prenota entrando.', addr: 'Sanam Chai Rd', lat: 13.7465, lng: 100.493, cost: '300 THB', dur: '1.5h', dress: true }),
      A('13:30', '15:00', 'Wat Arun — Tempio dell\'Alba', { desc: 'Torre di 79 m rivestita di porcellana. Scala ripida, vista sul fiume magnifica.', addr: 'Arun Amarin Rd', lat: 13.7437, lng: 100.4889, cost: '100 THB', dur: '1h', dress: true }),
      A('15:00', '17:30', 'Quartiere Kudi Chin', { desc: 'Quartiere portoghese del 1769: chiesa Santa Cruz, custard tarts da Thanusingha (25 THB).', addr: 'Kudeejeen, Thonburi', lat: 13.7399, lng: 100.4855, cost: 'Gratis' }),
      A('19:00', '20:15', 'Sky Bar — Lebua (64° piano)', { desc: 'Rooftop di "Una notte da leoni 2". Dress code smart casual: no shorts/infradito. Drink ~600 THB. Tramonto 18:45.', addr: 'State Tower, Silom', lat: 13.7219, lng: 100.5165, cost: '~600 THB', status: 'todo', site: 'https://www.lebua.com/restaurants/sky-bar/', contacts: '+66 2 624 9555' }),
      A('20:30', '22:30', 'Khao San Road — cena', { desc: 'Pad thai 80 THB, mango sticky rice, atmosfera dopo le 20. Occhio ai borseggi.', addr: 'Khao San Rd, Banglamphu', lat: 13.7588, lng: 100.4973, cost: '100–200 THB' }),
    ],
  },
  {
    id: 'd3', date: '2026-08-09', w: 'Dom', n: 9, city: 'Bangkok', cityId: 'bkk', scene: 'market',
    title: 'Chinatown e Siam', sub: 'Buddha d\'Oro · Golden Mount · Jim Thompson · SkyWalk', budget: 2500,
    hotel: 'shanghai',
    transports: [
      T('09:15', 'Hotel', 'Pak Klong Talad', '🚕 Grab', '15 min', { cost: '~80 THB' }),
      T('11:45', 'Chinatown', 'Wat Benchamabophit', '🛺 Tuk-tuk', '20 min', { cost: '~80 THB (contratta prima)' }),
      T('14:30', 'Wat Saket', 'Jim Thompson House', '🚕 Grab / BTS', '20 min', { cost: '~90 THB' }),
    ],
    acts: [
      A('09:30', '10:00', 'Talad Pak Klong — mercato fiori', { desc: 'Fiori 24/7 dal 1900. Ghirlande di gelsomino 20–30 THB.', addr: 'Chak Phet Rd', lat: 13.7414, lng: 100.4965, cost: 'Gratis' }),
      A('10:00', '10:45', 'Wat Trimit — Buddha d\'Oro', { desc: '5.5 tonnellate d\'oro massiccio scoperte nel 1955 sotto lo stucco.', addr: 'Mittraphap Rd', lat: 13.7377, lng: 100.5136, cost: '100 THB', dress: true }),
      A('10:45', '12:00', 'Chinatown (Yaowarat)', { desc: 'Soi Nana, via dell\'oro, ostriche fritte da Nai Mong Hoi Tod.', addr: 'Yaowarat Rd', lat: 13.7398, lng: 100.51, cost: 'Street food 80–150 THB' }),
      A('12:00', '13:30', 'Wat Benchamabophit', { desc: 'Il Tempio di Marmo (di Carrara!): chiostro con 52 Buddha da tutta l\'Asia.', addr: 'Si Ayutthaya Rd, Dusit', lat: 13.7666, lng: 100.5143, cost: '20 THB', dress: true }),
      A('13:30', '15:00', 'Wat Saket — Golden Mount', { desc: '318 gradini sulla collina artificiale: chedi dorato e vista sulla vecchia Bangkok.', addr: 'Chakkraphatdi Phong Rd', lat: 13.7539, lng: 100.5065, cost: '100 THB' }),
      A('15:00', '16:00', 'Jim Thompson House', { desc: 'Casa in teak dell\'americano della seta, sparito nel 1967. Solo visita guidata (45 min).', addr: '6 Kasemsan 2, Rama I Rd', lat: 13.7492, lng: 100.5282, cost: '150 THB', site: 'https://www.jimthompsonhouse.com/' }),
      A('16:00', '17:30', 'Siam Square + BACC', { desc: 'Cuore commerciale moderno + galleria d\'arte contemporanea (gratis).', addr: 'Siam Square, Pathum Wan', lat: 13.7455, lng: 100.5331, cost: 'Gratis' }),
      A('20:00', '21:30', 'King Power Mahanakhon SkyWalk', { desc: 'Pavimento in vetro a 310 m sul grattacielo più alto del paese. Drink incluso. Prenota online per saltare la coda.', addr: '114 Narathiwas Rd, Silom', lat: 13.7233, lng: 100.5285, cost: '1.000 THB', status: 'todo', site: 'https://www.kingpowermahanakhon.co.th/' }),
      A('22:00', '23:00', 'Night Market Bangrak', { desc: 'Cena tardi al mercato notturno, 10 min a piedi dal Mahanakhon.', lat: 13.7205, lng: 100.5152, cost: '100–200 THB' }),
    ],
  },
  {
    id: 'd4', date: '2026-08-10', w: 'Lun', n: 10, city: 'Ayutthaya → Chiang Rai', cityId: 'ayu', scene: 'ruins',
    title: 'Ayutthaya UNESCO + volo', sub: 'Templi antichi · volo serale 19:10 → Chiang Rai', budget: 2800,
    hotel: 'selene', checkIn: true, checkOutHotel: 'shanghai',
    transports: [
      T('06:45', 'Hotel Bangkok', 'Bang Pa In / Ayutthaya', '🚐 Tour organizzato (pickup)', '1h30', { note: 'Il tour DEVE includere drop-off a Suvarnabhumi' }),
      T('17:30', 'Ayutthaya', 'Aeroporto Suvarnabhumi', '🚐 Tour / taxi', '1h30', { cost: '~600 THB se taxi', note: '⚠️ Partire entro le 17:30 tassative' }),
      T('19:10', 'Bangkok BKK', 'Chiang Rai CEI', '✈ Volo', '1h20', { code: 'VOLO-2' }),
      T('20:45', 'Aeroporto CEI', 'Hotel Selene', '🚕 Taxi', '15 min', { cost: '150–200 THB' }),
    ],
    acts: [
      A('07:30', '09:00', 'Bang Pa In Royal Palace', { desc: 'Il "Versailles d\'Asia": padiglione sull\'acqua, palazzo cinese, torre gotica. Noleggia golf cart.', addr: 'Bang Pa In, Ayutthaya', lat: 14.2325, lng: 100.5793, cost: '100 THB', status: 'todo', site: GYG.ayu, dress: true }),
      A('09:30', '10:30', 'Wat Mahathat — Testa del Buddha', { desc: 'La foto più famosa della Thailandia: testa tra le radici del banyan. Inginocchiati per la foto.', addr: 'Naresuan Rd, Ayutthaya', lat: 14.3567, lng: 100.5679, cost: '50 THB' }),
      A('10:30', '11:30', 'Wat Phra Sri Sanphet', { desc: 'I tre chedi simbolo + il Buddha in bronzo più grande del paese (gratis, accanto).', lat: 14.3559, lng: 100.5583, cost: '50 THB' }),
      A('11:30', '12:30', 'Wat Yai Chai Mongkol', { desc: 'Chedi della vittoria (1592, duello su elefanti). Buddha in vesti arancioni.', lat: 14.3454, lng: 100.5925, cost: '20 THB' }),
      A('13:00', '14:00', 'Pranzo — Chao Phrom Market', { desc: 'Roti Sai Mai (solo qui!) + zuppa Guay Tiew Ruea 50–70 THB.', lat: 14.3585, lng: 100.5751, cost: '50–150 THB' }),
      A('14:00', '14:45', 'Wat Phanan Choeng', { desc: 'Il tempio più antico (1324): Buddha di 19 m. Pochissimi turisti.', lat: 14.3417, lng: 100.5776, cost: '20 THB' }),
      A('15:00', '16:30', 'Wat Chaiwatthanaram', { desc: 'Il capolavoro khmer sul fiume. Luce migliore dopo le 15:30 — la foto del viaggio.', lat: 14.3432, lng: 100.5418, cost: '50 THB' }),
      A('19:10', '20:30', 'Volo BKK → Chiang Rai', { desc: 'Partenza 19:10, arrivo 20:30. Poi taxi → Hotel Selene (15 min).', status: 'booked', code: 'VOLO-2' }),
      A('21:00', '22:30', 'Check-in + Khao Soi al Night Bazaar', { desc: 'Curry al cocco con noodles doppi, versione Chiang Rai. 15 min a piedi.', lat: 19.9072, lng: 99.8325, cost: '60–150 THB' }),
    ],
  },
  {
    id: 'd5', date: '2026-08-11', w: 'Mar', n: 11, city: 'Chiang Rai', cityId: 'cei', scene: 'mountain',
    title: 'Templi d\'artista + Triangolo d\'Oro', sub: 'White · Blue · Black House · Mekong', budget: 2600,
    hotel: 'selene',
    transports: [
      T('08:30', 'Hotel Selene', 'White Temple (13 km)', '🚕 Grab / tour', '25 min', { cost: '~163 THB' }),
      T('14:30', 'Baan Dam', 'Triangolo d\'Oro (60 km)', '🚐 Tour / taxi dedicato', '1h15', { cost: '~600 THB A/R' }),
    ],
    acts: [
      A('09:00', '10:30', 'Wat Rong Khun — White Temple', { desc: 'L\'opera d\'arte più fotografata del paese: ponte delle mani, murales pop. Arriva alle 9, dalle 10:30 bus turistici. Chiuso il lunedì.', addr: 'Pa O Don Chai', lat: 19.8243, lng: 99.7635, cost: '100 THB', status: 'todo', site: GYG.cr, dress: true }),
      A('10:30', '11:15', 'Blue Temple (Wat Rong Suea Ten)', { desc: 'Blu elettrico e oro ovunque. Gratis, meno affollato.', lat: 19.9264, lng: 99.8446, cost: 'Gratis', dress: true }),
      A('11:15', '12:15', 'Wat Huay Pla Kang — Guan Yin', { desc: 'La dea bianca di 69 m: ascensore fino alla testa, vista sulle colline.', lat: 19.9576, lng: 99.7969, cost: '40 THB ascensore' }),
      A('13:00', '14:30', 'Baan Dam — Black House + pranzo', { desc: 'Il museo oscuro di Thawan Duchanee: 40 edifici neri, pelli e ossa. Pranzo nel giardino.', lat: 19.9922, lng: 99.8618, cost: '80 THB' }),
      A('15:00', '17:30', 'Triangolo d\'Oro + Museo Oppio', { desc: 'Thailandia-Myanmar-Laos sul Mekong. Barca 300 THB + Hall of Opium 200 THB (ottimo, climatizzato).', lat: 20.3524, lng: 100.0821, cost: '~500 THB', status: 'todo', site: GYG.gt }),
      A('20:00', '20:20', 'Clock Tower — show di luci', { desc: 'Torre dorata illuminata con musica: 19:00, 20:00, 21:00. Gratis.', lat: 19.9076, lng: 99.8309, cost: 'Gratis' }),
      A('20:30', '22:00', 'Cena — Chivit Thamma Da', { desc: 'Giardino illuminato sul fiume Kok, il ristorante più bello della città.', lat: 19.9185, lng: 99.8443, cost: '150–400 THB', contacts: '+66 81 984 2925' }),
    ],
  },
  {
    id: 'd6', date: '2026-08-12', w: 'Mer', n: 12, city: 'Chiang Rai → Chiang Mai', cityId: 'cnx', scene: 'mountain',
    title: 'GreenBus + Old City', sub: 'Bus panoramico + templi dentro le mura', budget: 2000,
    hotel: 'lanna', checkIn: true, checkOutHotel: 'selene',
    transports: [
      T('07:45', 'Hotel Selene', 'Bus Terminal 1', '🚕 Grab', '8 min', { cost: '~73 THB' }),
      T('08:00', 'Chiang Rai Terminal 1', 'Chiang Mai Arcade', '🚌 GreenBus VIP', '3h20', { cost: '400 THB', code: 'BUS-1', site: GYG.bus, note: 'Prenotare online — posti limitati' }),
      T('11:30', 'Arcade Terminal', 'Lanna Oriental Hotel', '🚕 Grab', '15 min', { cost: '~60 THB' }),
    ],
    acts: [
      A('08:00', '11:20', 'GreenBus VIP → Chiang Mai', { desc: '3h20 di panorama montano, uno dei viaggi in bus più belli del paese.', status: 'todo', code: 'BUS-1', site: GYG.bus, cost: '400 THB' }),
      A('11:30', '12:45', 'Check-in + Khao Soi Khun Yai', { desc: 'IL Khao Soi di Chiang Mai. Chiude alle 15, non aspettare.', lat: 18.7959, lng: 98.9868, cost: '60–100 THB' }),
      A('13:00', '14:00', 'Wat Phra Singh', { desc: 'Il tempio più venerato del nord (1345). Murales Lanna del 1800 nel Viharn Lai Kham.', lat: 18.7885, lng: 98.9817, cost: '50 THB', dress: true }),
      A('14:00', '14:45', 'Wat Chedi Luang', { desc: 'Il chedi decapitato dal terremoto del 1545. Chat with Monks 17–18: conversa coi novizi, gratis.', lat: 18.787, lng: 98.9867, cost: '50 THB', dress: true }),
      A('14:45', '15:10', 'Wat Phan Tao', { desc: 'Teak del 1850, 28 pilastri, zero chiodi. Quasi sempre deserto.', lat: 18.7875, lng: 98.9878, cost: 'Gratis' }),
      A('15:10', '15:30', 'Wat Lok Moli', { desc: 'Chedi in mattoni del 1367 riflesso nel fossato nord.', lat: 18.7955, lng: 98.9835, cost: 'Gratis' }),
      A('15:30', '16:30', 'Silver Temple (Wat Sri Suphan)', { desc: 'Interamente in argento cesellato. Donne: non si entra nell\'ubosot (regola rituale).', lat: 18.7812, lng: 98.9848, cost: '50 THB' }),
      A('20:00', '22:00', 'Night Bazaar + cena Kalare', { desc: 'Artigianato Lanna, seta, celadon + cena con danze dal vivo. Contratta al 50-60%.', lat: 18.7852, lng: 98.9938, cost: '100–300 THB' }),
    ],
  },
  {
    id: 'd7', date: '2026-08-13', w: 'Gio', n: 13, city: 'Chiang Mai', cityId: 'cnx', scene: 'jungle',
    title: 'Doi Suthep + Elefanti + Khantoke', sub: 'La giornata più piena del viaggio', budget: 3500,
    hotel: 'lanna',
    transports: [
      T('08:45', 'Old City', 'Doi Suthep (15 km, 1.080 m)', '🚕 Grab / songthaew rosso', '40 min', { cost: 'Grab ~150 THB · songthaew 50' }),
      T('10:45', 'Wat Umong', 'Elephant Sanctuary', '🚐 Pickup incluso nel tour', '45 min' ),
      T('14:15', 'Sanctuary', 'Bo Sang (est)', '🚕 Taxi', '30 min', { cost: '~200 THB' }),
    ],
    acts: [
      A('08:00', '08:45', 'Colazione Blue Diamond', { desc: 'Breakfast club storico dell\'Old City.', lat: 18.7942, lng: 98.9856, cost: '80–150 THB' }),
      A('09:00', '10:30', 'Doi Suthep — Wat Phra That', { desc: 'Il tempio più sacro del nord a 1.080 m: 306 gradini tra i Naga (o funicolare 20 THB). Porta una giacca leggera.', lat: 18.8048, lng: 98.9216, cost: '50 THB', status: 'todo', site: GYG.ds, dress: true }),
      A('10:30', '11:00', 'Wat Umong — tempio nella foresta', { desc: 'Tunnel del 1383, cervi liberi, lago con tartarughe. Zero folle.', lat: 18.7828, lng: 98.9505, cost: 'Gratis' }),
      A('11:00', '14:00', 'Elephant Jungle Sanctuary', { desc: 'Santuario etico: nutri, cammina e bagno di fango con gli elefanti. Pranzo thai incluso. PRENOTA IN ANTICIPO.', lat: 19.05, lng: 98.85, cost: '~1.900 THB', status: 'todo', site: GYG.ele, contacts: '+66 99 271 8664' }),
      A('14:30', '16:00', 'Bo Sang — villaggio ombrelli', { desc: 'Ombrelli dipinti a mano dal XVIII sec. Artigiani al lavoro dal vivo.', lat: 18.7605, lng: 99.079, cost: 'Ingresso gratis' }),
      A('16:30', '18:30', 'Nimman Road — specialty coffee', { desc: 'Ristr8to Lab o Akha Ama: tra i migliori caffè del sud-est asiatico.', lat: 18.7995, lng: 98.9673, cost: '70–120 THB' }),
      A('20:30', '22:30', 'Cena Khantoke', { desc: 'Banchetto Lanna su vassoio a piedistallo + danze dal vivo. Prenotare 1 giorno prima.', lat: 18.7735, lng: 99.0045, cost: '~500 THB', status: 'todo', site: GYG.khan, contacts: '+66 53 304 121' }),
    ],
  },
  {
    id: 'd8', date: '2026-08-14', w: 'Ven', n: 14, city: 'Chiang Mai → Koh Samui', cityId: 'usm', scene: 'beach',
    title: 'Volo per l\'isola', sub: 'Ultimo mattino + Fisherman\'s Village (venerdì!)', budget: 2500,
    hotel: 'stay', checkIn: true, checkOutHotel: 'lanna',
    transports: [
      T('12:45', 'Lanna Oriental', 'Aeroporto CNX (4 km)', '🚕 Grab', '10 min', { cost: '~150 THB' }),
      T('14:35', 'Chiang Mai CNX', 'Koh Samui USM', '✈ Bangkok Airways', '1h45', { code: 'VOLO-3' }),
      T('16:30', 'Aeroporto USM', 'The Stay Chaweng', '🚕 Taxi / shuttle', '15 min', { cost: '~350 THB' }),
    ],
    acts: [
      A('08:00', '09:30', 'Warorot Market (Kad Luang)', { desc: 'Ultimi acquisti del nord: tè oolong, spezie, seta, celadon.', lat: 18.79, lng: 98.9997, cost: 'Prezzi locali' }),
      A('09:30', '10:30', 'Passeggiata fossato + Tha Phae Gate', { desc: 'Ultimo giro tra le mura. Foto alla porta.', lat: 18.7876, lng: 98.9933, cost: 'Gratis' }),
      A('12:00', '12:30', 'Check-out (deposito bagagli ok)', { desc: 'Check-out entro le 12:00.' }),
      A('14:35', '16:20', 'Volo CNX → USM', { desc: 'Bangkok Airways diretto. L\'aeroporto di Samui è open-air tra i giardini.', status: 'booked', code: 'VOLO-3' }),
      A('16:30', '17:30', 'Check-in The Stay Chaweng', { desc: 'Spiaggia a 200 m. Scooter noleggiabile in hotel (200–250 THB/g).', lat: 9.545, lng: 100.062, status: 'booked', code: 'BKG-STY-2026' }),
      A('19:00', '22:00', 'Bophut Fisherman\'s Village', { desc: 'VENERDÌ = Walking Street Market! Cena seafood sul waterfront: granchio al pepe, gamberi. Prezzo al kg prima di ordinare.', lat: 9.558, lng: 100.023, cost: '300–700 THB' }),
    ],
  },
  {
    id: 'd9', date: '2026-08-15', w: 'Sab', n: 15, city: 'Koh Samui', cityId: 'usm', scene: 'islands',
    title: 'Ang Thong Marine Park', sub: '42 isole — il paradiso in barca', budget: 3000,
    hotel: 'stay',
    transports: [T('07:00', 'Hotel', 'Molo partenza tour', '🚐 Pickup incluso', '30 min')],
    acts: [
      A('07:00', '08:30', 'Pickup tour Ang Thong', { desc: 'Porta: crema reef-safe, cappello, dry bag, scarpe da scoglio.', status: 'todo', site: GYG.at }),
      A('09:00', '16:30', 'Ang Thong — snorkeling + kayak', { desc: '42 isole calcaree ("The Beach"). Emerald Lagoon, viewpoint Ko Wua Talap (salita ripida, vista leggendaria), kayak tra le falesie.', lat: 9.639, lng: 99.689, cost: '~1.700–2.200 THB', status: 'todo', site: GYG.at }),
      A('19:30', '21:30', 'Cena leggera + massaggio', { desc: 'Massaman curry + massaggio thai 1h (~350 THB) per i muscoli del kayak.', cost: '400–600 THB' }),
    ],
  },
  {
    id: 'd10', date: '2026-08-16', w: 'Dom', n: 16, city: 'Koh Samui', cityId: 'usm', scene: 'beach',
    title: 'Silver Beach + Lamai', sub: 'La spiaggia più bella + Hin Ta Hin Yai', budget: 1800,
    hotel: 'stay',
    transports: [T('09:00', 'Chaweng', 'Silver Beach', '🛵 Scooter / Grab', '15 min', { cost: 'Grab ~100 THB' })],
    acts: [
      A('09:30', '13:00', 'Silver Beach (Hat Sai Kaew)', { desc: 'La spiaggia più bella di Samui: baia a mezzaluna, snorkeling alle rocce. Ombrellone 100 THB.', lat: 9.49, lng: 100.053, cost: '100 THB lettino' }),
      A('13:00', '14:30', 'Pranzo — Sabienglae Lamai', { desc: 'Il seafood più autentico del lato est, prezzi locali.', lat: 9.4664, lng: 100.0489, cost: '200–500 THB' }),
      A('14:30', '16:00', 'Hin Ta Hin Yai + Lamai Beach', { desc: 'Le rocce "nonno e nonna" + pomeriggio su Lamai.', lat: 9.4574, lng: 100.045, cost: 'Gratis' }),
      A('18:00', '19:00', 'Lamai Viewpoint — tramonto', { desc: 'Piattaforma panoramica sulla baia.', lat: 9.4489, lng: 100.0378, cost: '~100 THB' }),
      A('19:30', '21:30', 'Cena a Chaweng', { desc: 'Serata libera nel centro di Chaweng.', cost: '200–500 THB' }),
    ],
  },
  {
    id: 'd11', date: '2026-08-17', w: 'Lun', n: 17, city: 'Koh Samui', cityId: 'usm', scene: 'temple',
    title: 'Big Buddha + nord isola', sub: 'Templi sul mare + tramonto Jungle Club', budget: 1900,
    hotel: 'stay',
    transports: [T('09:00', 'Chaweng', 'Big Buddha (nord)', '🛵 Scooter / Grab', '15 min', { cost: '~120 THB' })],
    acts: [
      A('09:30', '11:00', 'Big Buddha (Wat Phra Yai)', { desc: 'Il Buddha dorato di 12 m, simbolo dell\'isola dal 1972.', lat: 9.5687, lng: 100.0603, cost: 'Gratis', dress: true }),
      A('11:00', '12:00', 'Wat Plai Laem', { desc: 'La Guan Yin a 18 braccia sul lago. Nutri i pesci sacri (20 THB).', lat: 9.5751, lng: 100.051, cost: 'Gratis' }),
      A('12:30', '14:00', 'Pranzo a Bophut', { desc: 'Fisherman\'s Village di giorno, tranquillo.', lat: 9.558, lng: 100.023, cost: '150–350 THB' }),
      A('14:30', '17:30', 'Pomeriggio mare — Chaweng', { desc: 'Spiaggia dell\'hotel, swim-up bar, o niente di niente.', cost: 'Gratis' }),
      A('18:00', '21:30', 'Jungle Club — tramonto + cena', { desc: 'Vista mozzafiato dalla collina su Chaweng. Cocktail 18:30. Prenota il tavolo vista; taxi del locale su richiesta.', lat: 9.5235, lng: 100.0499, cost: '300–700 THB', status: 'todo', site: 'https://www.jungleclubsamui.com/', contacts: '+66 81 894 2327' }),
    ],
  },
  {
    id: 'd12', date: '2026-08-18', w: 'Mar', n: 18, city: 'Koh Samui', cityId: 'usm', scene: 'islands',
    title: 'Koh Tao + Koh Nang Yuan', sub: 'Lo snorkeling più bello del golfo', budget: 3200,
    hotel: 'stay',
    transports: [T('07:30', 'Hotel', 'Molo speedboat', '🚐 Pickup incluso', '30 min')],
    acts: [
      A('07:30', '08:30', 'Pickup tour Koh Tao', { desc: 'Crema reef-safe obbligatoria, dry bag, GoPro.', status: 'todo', site: GYG.kt }),
      A('09:00', '16:30', 'Koh Tao + Nang Yuan', { desc: 'Il viewpoint delle 3 isole unite dalla sabbia = la cartolina della Thailandia. Snorkeling a Shark Bay (squali pinna nera innocui).', lat: 10.118, lng: 99.814, cost: '~1.900–2.400 THB', status: 'todo', site: GYG.kt }),
      A('19:30', '22:00', 'Cena Zazen — Bophut', { desc: 'Thai-fusion sul waterfront, il ristorante romantico dell\'isola. Prenotare.', lat: 9.5563, lng: 100.0159, cost: '400–900 THB', status: 'todo', site: 'https://www.zazenkohsamui.com/dining/', contacts: '+66 77 425 085' }),
    ],
  },
  {
    id: 'd13', date: '2026-08-19', w: 'Mer', n: 19, city: 'Koh Samui → Bangkok', cityId: 'bkk', scene: 'flight',
    title: 'Ultimo mare + volo', sub: 'Mattina in spiaggia · volo 19:45', budget: 2000,
    hotel: 'amara', checkIn: true, checkOutHotel: 'stay',
    transports: [
      T('17:00', 'The Stay Chaweng', 'Aeroporto USM', '🚕 Taxi', '15 min', { cost: '~350 THB' }),
      T('19:45', 'Koh Samui USM', 'Bangkok BKK', '✈ Volo', '1h30', { code: 'VOLO-4' }),
      T('21:45', 'Suvarnabhumi', 'Amara Bangkok (Surawong)', '🚕 Grab', '35 min', { cost: '~400 THB' }),
    ],
    acts: [
      A('09:00', '11:30', 'Ultima mattina di mare', { desc: 'Spiaggia o piscina, senza fretta.', cost: 'Gratis' }),
      A('12:00', '12:30', 'Check-out (deposito bagagli)', { desc: 'Entro le 12:00, bagagli in reception.' }),
      A('13:00', '16:30', 'Pranzo + relax finale', { desc: 'Coconut shake + Khao Pad Talay. Ultimo massaggio se vuoi.', cost: '150–400 THB' }),
      A('19:45', '21:15', 'Volo USM → BKK', { desc: 'Arrivo 21:15, Grab → Amara Bangkok.', status: 'booked', code: 'VOLO-4' }),
      A('22:30', '23:30', 'Check-in Amara', { desc: 'La piscina rooftop è aperta fino a tardi.', lat: 13.724, lng: 100.523, status: 'booked', code: 'BKG-AMA-2026' }),
    ],
  },
  {
    id: 'd14', date: '2026-08-20', w: 'Gio', n: 20, city: 'Bangkok', cityId: 'bkk', scene: 'market',
    title: 'Mercati galleggianti', sub: 'Damnoen Saduak + Maeklong Railway', budget: 2200,
    hotel: 'amara',
    transports: [
      T('07:00', 'Amara Bangkok', 'Damnoen Saduak (100 km)', '🚐 Tour con pickup', '1h30', { note: 'Tour combinato con Maeklong' }),
      T('12:30', 'Maeklong', 'Bangkok', '🚐 Tour', '1h15'),
    ],
    acts: [
      A('08:30', '10:00', 'Damnoen Saduak — mercato galleggiante', { desc: 'Barche cariche di frutta, zuppe cucinate a bordo. Giro in barca a remi ~200 THB.', lat: 13.5205, lng: 99.9597, cost: 'Barca ~200 THB', status: 'todo', site: GYG.dam }),
      A('10:30', '11:30', 'Maeklong Railway Market', { desc: 'Il mercato SUI binari: al passaggio del treno (~11:10) tutto si ritira in 30 secondi.', lat: 13.4067, lng: 99.9997, cost: 'Gratis' }),
      A('15:00', '17:00', 'Massaggio thai — 2 ore', { desc: 'Il massaggio finale: Health Land Silom, la catena più affidabile.', lat: 13.7233, lng: 100.5209, cost: '~700 THB', contacts: '+66 2 637 8883' }),
      A('17:30', '19:30', 'Shopping Silom / Patpong', { desc: 'Patpong Night Market apre alle 18. Parti dal 40% del prezzo.', lat: 13.7284, lng: 100.5341, cost: 'Variabile' }),
      A('20:00', '22:00', 'Cena a Silom', { desc: 'Zona ricca di ottimi ristoranti a 5 min dall\'hotel.', cost: '200–500 THB' }),
    ],
  },
  {
    id: 'd15', date: '2026-08-21', w: 'Ven', n: 21, city: 'Bangkok → Milano', cityId: 'bkk', scene: 'flight',
    title: 'Ultimo giorno + volo notturno', sub: 'Siam · Pratunam · cena finale · 00:55', budget: 2500,
    hotel: 'amara', checkOutHotel: 'amara',
    transports: [
      T('15:00', 'Hotel', 'Siam / Pratunam', '🚕 Grab / BTS', '15 min', { cost: '~80 THB' }),
      T('21:30', 'Amara Bangkok', 'Aeroporto Suvarnabhumi', '🚕 Grab', '35 min', { cost: '~400 THB', note: '⚠️ Partire entro le 21:30 — check-in 3h prima' }),
      T('00:55', 'Bangkok BKK', 'Milano Malpensa', '✈ Volo (22 Ago)', '~12h', { code: 'VOLO-5' }),
    ],
    acts: [
      A('10:00', '11:30', 'Piscina rooftop Amara', { desc: 'Mattinata lenta con vista skyline. Meritata.', cost: 'Incluso' }),
      A('12:00', '12:30', 'Check-out (deposito bagagli)', { desc: 'Bagagli in reception fino a sera.' }),
      A('15:30', '18:30', 'Siam Square + Mercato Pratunam', { desc: 'Ultimo shopping: 5 piani di abbigliamento a prezzi locali. Valigie semivuote!', lat: 13.7523, lng: 100.5421, cost: 'Occasioni' }),
      A('19:30', '21:00', 'Cena finale', { desc: 'Vertigo Moon Bar (rooftop Banyan Tree) o crociera sul Chao Phraya.', lat: 13.7238, lng: 100.5393, cost: '500–1.500 THB' }),
      A('21:30', '22:15', 'Grab → Aeroporto', { desc: 'Partire entro le 21:30: 35 min + check-in internazionale.' }),
      A('23:59', '23:59', 'Volo BKK → MXP (00:55)', { desc: 'Arrivo Malpensa 07:35 del 22 Agosto. Fine di un viaggio incredibile. 🙏', status: 'booked', code: 'VOLO-5' }),
    ],
  },
];

export const BOOKINGS: { flights: Booking[]; hotels: Booking[]; tours: Booking[] } = {
  flights: [
    { id: 'VOLO-1', t: 'MXP → BKK', s: 'Ven 7 Ago · 14:05 → 05:55 (+1)', provider: 'Volo intercontinentale', cost: '—', d: 'Milano Malpensa T1 → Bangkok Suvarnabhumi · ~11h30' },
    { id: 'VOLO-2', t: 'BKK → CEI', s: 'Lun 10 Ago · 19:10 → 20:30', provider: 'Volo domestico', cost: '—', d: 'Bangkok → Chiang Rai · dopo il day trip Ayutthaya' },
    { id: 'VOLO-3', t: 'CNX → USM', s: 'Ven 14 Ago · 14:35 → 16:20', provider: 'Bangkok Airways', cost: '—', d: 'Chiang Mai → Koh Samui · diretto' },
    { id: 'VOLO-4', t: 'USM → BKK', s: 'Mer 19 Ago · 19:45 → 21:15', provider: 'Volo domestico', cost: '—', d: 'Koh Samui → Bangkok · notte di transito' },
    { id: 'VOLO-5', t: 'BKK → MXP', s: '22 Ago · 00:55 → 07:35', provider: 'Volo intercontinentale', cost: '—', d: 'Bangkok → Milano Malpensa · ~12h' },
  ],
  hotels: Object.entries(HOTELS).map(([k, h]) => ({ id: h.code, t: h.name, s: { shanghai: '8–10 Ago · 2 notti', selene: '10–12 Ago · 2 notti', lanna: '12–14 Ago · 2 notti', stay: '14–19 Ago · 5 notti', amara: '19–21 Ago · 2 notti' }[k] ?? '', provider: 'Booking.com', cost: '—', d: h.addr + ' · check-in ' + h.ci + ' · check-out ' + h.co, url: h.url, phone: h.phone, lat: h.lat, lng: h.lng })),
  tours: [
    { id: 'T-AYU', t: 'Tour Ayutthaya + transfer BKK', s: 'Lun 10 Ago — CRITICO', provider: 'GetYourGuide', cost: '~900 THB', d: 'Deve includere il drop-off a Suvarnabhumi per il volo 19:10 — verificare alla prenotazione.', url: GYG.ayu, todo: true },
    { id: 'T-GT', t: 'Tour Triangolo d\'Oro', s: 'Mar 11 Ago', provider: 'GetYourGuide', cost: '~800 THB', d: 'Combinato templi + Triangolo, oppure Grab per i templi e tour solo per il Mekong.', url: GYG.gt, todo: true },
    { id: 'BUS-1', t: 'GreenBus CR → CM (VIP)', s: 'Mer 12 Ago · 8:00', provider: '12go.asia', cost: '400 THB', d: 'Posti limitati, prenotare online.', url: GYG.bus, todo: true },
    { id: 'T-ELE', t: 'Elephant Jungle Sanctuary', s: 'Gio 13 Ago', provider: 'Diretto', cost: '~1.900 THB', d: 'Pickup hotel + pranzo inclusi. Si esaurisce — prenotare subito.', url: GYG.ele, todo: true, phone: '+66 99 271 8664' },
    { id: 'T-KHA', t: 'Cena Khantoke', s: 'Gio 13 Ago · 20:30', provider: 'Khum Khantoke', cost: '~500 THB', d: 'Prenotare almeno 1 giorno prima.', url: GYG.khan, todo: true, phone: '+66 53 304 121' },
    { id: 'T-AT', t: 'Tour Ang Thong Marine Park', s: 'Sab 15 Ago', provider: 'GetYourGuide', cost: '~2.000 THB', d: 'Speedboat, kayak, Emerald Lagoon. Pickup hotel.', url: GYG.at, todo: true },
    { id: 'T-KT', t: 'Tour Koh Tao + Nang Yuan', s: 'Mar 18 Ago', provider: 'GetYourGuide', cost: '~2.200 THB', d: 'Snorkeling + viewpoint iconico. Pickup hotel.', url: GYG.kt, todo: true },
    { id: 'T-DAM', t: 'Tour Damnoen + Maeklong', s: 'Gio 20 Ago · pickup 7:00', provider: 'GetYourGuide', cost: '~1.100 THB', d: 'Mercato galleggiante + mercato sul treno.', url: GYG.dam, todo: true },
  ],
};

export const TAXI_NUMBERS = {
  bkk: { name: 'Taxi Radio Bangkok', tel: '1681' },
  cei: { name: 'Chiang Rai taxi (chiedi in hotel)', tel: '+66 53 711 339' },
  cnx: { name: 'CM Taxi cooperative', tel: '+66 53 279 291' },
  usm: { name: 'Samui taxi (chiedi in hotel)', tel: '+66 77 300 599' },
  ayu: { name: 'Bangkok Taxi Radio', tel: '1681' },
};
