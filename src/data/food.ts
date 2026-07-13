/* ═══════════ FOOD & DRINKS · dataset curato per città ═══════════ */
import type { CityId } from './itinerary';

export type FoodCat = 'thai' | 'seafood' | 'fine' | 'brunch' | 'cocktail' | 'street' | 'dessert' | 'intl';
export const CAT_LABEL: Record<FoodCat, string> = {
  thai: '🍜 Thai autentico', seafood: '🦞 Seafood', fine: '🍷 Fine Dining',
  brunch: '☕ Breakfast & Brunch', cocktail: '🍸 Cocktail Bar',
  street: '🌶 Street Food', dessert: '🍦 Dessert', intl: '🍕 Internazionale',
};

export interface Venue {
  name: string; cityId: CityId; cat: FoodCat; rating: number; price: 1 | 2 | 3 | 4;
  lat: number; lng: number; desc: string; hours?: string; site?: string;
}
export interface Rooftop {
  name: string; cityId: CityId; rating: number; price: 1 | 2 | 3 | 4;
  lat: number; lng: number; view: string; dress: string; booking: boolean;
  bestTime: string; site?: string;
}

export const VENUES: Venue[] = [
  /* ─── Bangkok ─── */
  { name: 'Jay Fai', cityId: 'bkk', cat: 'street', rating: 4.4, price: 3, lat: 13.7527, lng: 100.5046, desc: 'La cuoca stellata Michelin degli occhialoni da sci. Il crab omelette è leggendario — prenotare con giorni di anticipo o code infinite.', hours: '9:30–19:30, chiuso dom-lun' },
  { name: 'Krua Apsorn', cityId: 'bkk', cat: 'thai', rating: 4.4, price: 2, lat: 13.7597, lng: 100.5063, desc: 'Cucina reale thai frequentata dalla famiglia reale. Stir-fried crab al curry giallo imperdibile.', hours: '10:30–19:30, chiuso dom' },
  { name: 'Thipsamai Pad Thai', cityId: 'bkk', cat: 'street', rating: 4.2, price: 1, lat: 13.7528, lng: 100.5049, desc: 'Il pad thai più famoso di Bangkok dal 1966, avvolto nella frittata. Coda veloce.', hours: '17:00–24:00' },
  { name: 'Nai Mong Hoi Tod', cityId: 'bkk', cat: 'street', rating: 4.4, price: 1, lat: 13.7412, lng: 100.5107, desc: 'Ostriche fritte in pastella croccante dal 1956, cuore di Chinatown.', hours: '10:00–21:00' },
  { name: 'T&K Seafood', cityId: 'bkk', cat: 'seafood', rating: 4.2, price: 2, lat: 13.7405, lng: 100.5117, desc: 'L’angolo verde di Yaowarat: granchio al pepe nero e gamberi giganti alla griglia, tavolini in strada.', hours: '16:30–24:00' },
  { name: 'On Lok Yun', cityId: 'bkk', cat: 'brunch', rating: 4.3, price: 1, lat: 13.7492, lng: 100.5008, desc: 'Colazione sino-thai dal 1933: toast alla crema, uova e caffè olieng. Un tuffo nel tempo.', hours: '5:30–15:30' },
  { name: 'After You Dessert Café', cityId: 'bkk', cat: 'dessert', rating: 4.5, price: 2, lat: 13.7466, lng: 100.5347, desc: 'Lo shibuya honey toast che ha conquistato la città. Perfetto dopo Siam Square.', hours: '10:00–22:30' },
  { name: 'Vertigo & Moon Bar', cityId: 'bkk', cat: 'cocktail', rating: 4.6, price: 4, lat: 13.7238, lng: 100.5393, desc: 'Cena e cocktail al 61° piano del Banyan Tree, a cielo aperto. Candidata cena finale.', hours: '17:00–24:00', site: 'https://www.banyantree.com/thailand/bangkok/dining/vertigo' },
  /* ─── Chiang Rai ─── */
  { name: 'Paa Suk (Khao Soi)', cityId: 'cei', cat: 'thai', rating: 4.6, price: 1, lat: 19.9067, lng: 99.8283, desc: 'Il khao soi più amato dai locals. Coda di soli thai = garanzia. Pochi euro.', hours: '8:00–15:00' },
  { name: 'Chivit Thamma Da', cityId: 'cei', cat: 'brunch', rating: 4.5, price: 3, lat: 19.9185, lng: 99.8443, desc: 'Giardino coloniale sul fiume Kok: brunch, torte e tè pomeridiano. Il posto più bello della città.', hours: '8:30–18:00', site: 'https://www.chivitthammada.com' },
  { name: 'Barrab', cityId: 'cei', cat: 'thai', rating: 4.6, price: 2, lat: 19.9089, lng: 99.8318, desc: 'Cucina del nord in versione curata: laab, sai ua, gaeng hung lay. Vicino al Night Bazaar.', hours: '11:00–22:00' },
  { name: 'Melt In Your Mouth', cityId: 'cei', cat: 'intl', rating: 4.4, price: 2, lat: 19.9203, lng: 99.8452, desc: 'Riverside café con dolci e piatti western quando serve una pausa dal riso.', hours: '9:00–21:00' },
  /* ─── Chiang Mai ─── */
  { name: 'Khao Soi Khun Yai', cityId: 'cnx', cat: 'thai', rating: 4.6, price: 1, lat: 18.7959, lng: 98.9868, desc: 'IL khao soi di Chiang Mai, ricetta della nonna. Chiude quando finisce — arrivare entro le 14.', hours: '10:00–15:00' },
  { name: 'Huen Phen', cityId: 'cnx', cat: 'thai', rating: 4.4, price: 2, lat: 18.7857, lng: 98.9832, desc: 'Istituzione della cucina Lanna nell’Old City: gaeng hung lay e nam prik noom come si deve.', hours: '8:30–16:00 / 17:00–22:00' },
  { name: 'Cowboy Hat Lady (Khao Kha Moo)', cityId: 'cnx', cat: 'street', rating: 4.5, price: 1, lat: 18.7911, lng: 98.9908, desc: 'Lo stinco di maiale al Chang Phueak Gate reso celebre da Bourdain. Solo sera.', hours: '17:00–24:00' },
  { name: 'Ristr8to Lab', cityId: 'cnx', cat: 'brunch', rating: 4.6, price: 2, lat: 18.7967, lng: 98.9674, desc: 'Caffetteria pluripremiata di Nimman: latte art da campionato mondiale.', hours: '7:00–18:00' },
  { name: 'Akha Ama Coffee', cityId: 'cnx', cat: 'brunch', rating: 4.7, price: 1, lat: 18.7946, lng: 98.9819, desc: 'Caffè direttamente dalle montagne Akha, progetto sociale. Il flat white migliore del nord.', hours: '8:00–17:30' },
  { name: 'David’s Kitchen', cityId: 'cnx', cat: 'fine', rating: 4.8, price: 4, lat: 18.7794, lng: 99.0011, desc: 'Franco-thai elegante, servizio memorabile. Per una serata importante — prenotare.', hours: '18:00–23:00', site: 'https://www.davidskitchen.co.th' },
  { name: 'Cheevit Cheeva', cityId: 'cnx', cat: 'dessert', rating: 4.6, price: 2, lat: 18.7998, lng: 98.9689, desc: 'Bingsu coreano e dolci instagrammabili in giardino tropicale.', hours: '9:00–21:00' },
  /* ─── Koh Samui ─── */
  { name: 'Sabienglae', cityId: 'usm', cat: 'seafood', rating: 4.4, price: 2, lat: 9.4664, lng: 100.0489, desc: 'Il seafood più autentico dell’isola, lato Lamai: granchio al curry, prezzi da locali.', hours: '11:00–22:00' },
  { name: 'Bang Po Seafood', cityId: 'usm', cat: 'seafood', rating: 4.5, price: 2, lat: 9.5698, lng: 99.9448, desc: 'Sulla spiaggia di Bang Po, piedi nella sabbia e ricette samui autentiche (riccio di mare!).', hours: '12:00–21:00' },
  { name: 'Zazen Restaurant', cityId: 'usm', cat: 'fine', rating: 4.6, price: 4, lat: 9.5563, lng: 100.0159, desc: 'Thai-fusion romantico sul waterfront di Bophut, candele e onde. Prenotare il tavolo fronte mare.', hours: '18:00–22:30', site: 'https://www.zazenkohsamui.com/dining/' },
  { name: 'The Jungle Club', cityId: 'usm', cat: 'intl', rating: 4.5, price: 3, lat: 9.5235, lng: 100.0499, desc: 'Sulla collina sopra Chaweng: vista mozzafiato, cucina med-thai. Tramonto obbligatorio.', hours: '9:00–23:00', site: 'https://www.jungleclubsamui.com' },
  { name: 'Vikasa Life Café', cityId: 'usm', cat: 'brunch', rating: 4.5, price: 2, lat: 9.5069, lng: 100.0605, desc: 'Brunch healthy a strapiombo sul mare tra Chaweng e Lamai. Smoothie bowl con vista.', hours: '7:00–21:00' },
  { name: 'Coco Tam’s', cityId: 'usm', cat: 'cocktail', rating: 4.4, price: 3, lat: 9.5577, lng: 100.0235, desc: 'Beach bar iconico di Bophut: pouf sulla sabbia, fire show alle 21:30, cocktail al cocco.', hours: '11:00–24:00' },
];

export const ROOFTOPS: Rooftop[] = [
  { name: 'Sky Bar — Lebua', cityId: 'bkk', rating: 4.5, price: 4, lat: 13.7219, lng: 100.5165, view: 'Chao Phraya e skyline a 247 m', dress: 'Smart casual — no shorts/infradito', booking: false, bestTime: '18:15–19:15', site: 'https://www.lebua.com/restaurants/sky-bar/' },
  { name: 'Vertigo & Moon Bar', cityId: 'bkk', rating: 4.6, price: 4, lat: 13.7238, lng: 100.5393, view: 'Skyline 360° a cielo aperto, 61° piano', dress: 'Smart casual', booking: true, bestTime: '18:00–19:30', site: 'https://www.banyantree.com/thailand/bangkok/dining/vertigo' },
  { name: 'Tichuca Rooftop', cityId: 'bkk', rating: 4.5, price: 3, lat: 13.7245, lng: 100.5606, view: 'L’albero luminoso su Sukhumvit, 46° piano', dress: 'Casual elegante', booking: true, bestTime: '18:30–20:00' },
  { name: 'Myst — Maya Rooftop', cityId: 'cnx', rating: 4.5, price: 2, lat: 18.8022, lng: 98.9675, view: 'Doi Suthep e tramonto su Nimman', dress: 'Casual', booking: false, bestTime: '18:00–19:15' },
  { name: 'Coco Tam’s (beach bar)', cityId: 'usm', rating: 4.4, price: 3, lat: 9.5577, lng: 100.0235, view: 'Spiaggia di Bophut, fire show serale', dress: 'Piedi nudi benvenuti', booking: false, bestTime: '18:00–21:30' },
  { name: 'Air Bar — InterContinental', cityId: 'usm', rating: 4.5, price: 4, lat: 9.4227, lng: 99.9605, view: 'Il tramonto più bello dell’isola (lato ovest)', dress: 'Smart casual', booking: true, bestTime: '17:30–19:00' },
];

/* ═══════ Vicino a te · categorie di ricerca dall'hotel del giorno ═══════ */
export const NEAR_CATS_500 = [
  { emoji: '🍜', label: 'Ristoranti', q: 'restaurants' },
  { emoji: '🏧', label: 'ATM', q: 'atm' },
  { emoji: '💊', label: 'Farmacia', q: 'pharmacy' },
  { emoji: '🏪', label: 'Minimarket', q: '7-eleven' },
  { emoji: '☕', label: 'Caffè', q: 'coffee shop' },
];
export const NEAR_CATS_2K = [
  { emoji: '🍸', label: 'Rooftop', q: 'rooftop bar' },
  { emoji: '🛍', label: 'Mercati', q: 'market' },
  { emoji: '🛕', label: 'Templi', q: 'temple' },
  { emoji: '🏖', label: 'Beach club', q: 'beach club' },
  { emoji: '📸', label: 'Attrazioni', q: 'tourist attraction' },
];
