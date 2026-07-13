/* ═══════════ SCENE · illustrazioni SVG per destinazioni ═══════════
   Sostituibili con foto reali: metti i file in public/photos/<scene>.jpg
   e verranno usati automaticamente al posto dell'illustrazione. */
import type { SceneId } from '@/data/itinerary';

const G: Record<string, [string, string]> = {
  temple: ['#0A3A4A', '#0984E3'], ruins: ['#7A3B10', '#C2571F'],
  mountain: ['#0D4A38', '#00B894'], beach: ['#0984E3', '#22B8D4'],
  islands: ['#065A6E', '#0891B2'], market: ['#7A2E12', '#FD9644'],
  flight: ['#123A52', '#2274A5'], jungle: ['#0B3D2E', '#147A54'],
  hero: ['#0984E3', '#00B894'],
};

function Draw({ id }: { id: SceneId }) {
  switch (id) {
    case 'temple': return (<g fill="#E8B54A"><rect x="30" y="58" width="40" height="6" rx="1" /><rect x="35" y="50" width="30" height="8" rx="1" opacity=".85" /><polygon points="38,50 62,50 57,36 43,36" /><polygon points="47,38 53,38 51,16 49,16" /><circle cx="50" cy="14" r="2.5" fill="#FFF7E0" /></g>);
    case 'ruins': return (<g fill="#F5D9A8" opacity=".92"><polygon points="34,62 46,62 44,30 36,30" /><polygon points="54,62 66,62 64,38 56,38" /><ellipse cx="40" cy="28" rx="5" ry="4" /><ellipse cx="60" cy="36" rx="4.5" ry="3.5" /></g>);
    case 'mountain': return (<g><polygon points="14,64 40,26 58,64" fill="#0A3A2C" opacity=".8" /><polygon points="44,64 66,32 88,64" fill="#0D5A42" opacity=".9" /><polygon points="36,34 40,26 44,34" fill="#EFFAF3" /><circle cx="76" cy="18" r="6" fill="#FDE68A" /></g>);
    case 'beach': return (<g><ellipse cx="50" cy="66" rx="46" ry="9" fill="#F5E6C8" /><path d="M62 52 Q60 30 62 24 M62 26 Q50 20 44 26 M62 26 Q72 18 78 24 M62 27 Q56 16 62 12 M62 27 Q70 18 66 12" stroke="#0D5A42" strokeWidth="2.5" fill="none" strokeLinecap="round" /><ellipse cx="62" cy="53" rx="4" ry="2.5" fill="#7A4A1C" /><circle cx="24" cy="18" r="7" fill="#FDE68A" /></g>);
    case 'islands': return (<g><ellipse cx="30" cy="58" rx="16" ry="7" fill="#0D4A38" /><ellipse cx="68" cy="62" rx="20" ry="8" fill="#0A3A2C" /><polygon points="22,58 30,42 38,58" fill="#159570" /><polygon points="58,62 68,40 80,62" fill="#0D5A42" /><path d="M8 70 Q25 66 50 70 T96 70" stroke="#7DE3F0" strokeWidth="2" fill="none" opacity=".7" /></g>);
    case 'market': return (<g><path d="M20 40 L50 26 L80 40 L80 46 L20 46 Z" fill="#E8B54A" /><rect x="24" y="46" width="52" height="18" fill="#8A4A1E" opacity=".7" /><rect x="40" y="50" width="8" height="14" fill="#FDE68A" opacity=".85" /><rect x="56" y="50" width="8" height="14" fill="#FDE68A" opacity=".6" /><circle cx="30" cy="55" r="3.5" fill="#E4574F" /><circle cx="34" cy="58" r="3" fill="#FD9644" /></g>);
    case 'flight': return (<g fill="#EFF7FA"><path d="M18 52 L70 38 L82 40 L74 46 L46 56 L38 66 L32 64 L38 54 L24 56 Z" /><circle cx="26" cy="20" r="5" opacity=".5" /><circle cx="70" cy="16" r="3.5" opacity=".35" /></g>);
    default: return (<g><path d="M30 64 Q28 40 32 30 M31 36 Q20 30 14 36 M31 34 Q42 26 48 32" stroke="#0A2E22" strokeWidth="3" fill="none" strokeLinecap="round" /><ellipse cx="66" cy="56" rx="15" ry="10" fill="#8A8F98" /><ellipse cx="78" cy="50" rx="6" ry="5.5" fill="#8A8F98" /><path d="M82 54 Q86 60 83 64" stroke="#8A8F98" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="79.5" cy="49" r="1" fill="#1A222B" /></g>);
  }
}

export function Scene({ id, className }: { id: SceneId; className?: string }) {
  const [c1, c2] = G[id] ?? G.temple;
  return (
    <svg viewBox="0 0 100 74" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs><linearGradient id={'sg' + id} x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
      <rect width="100" height="74" fill={`url(#sg${id})`} />
      <Draw id={id} />
    </svg>
  );
}

/* Hero tropicale (barca longtail, palma, isola) — la scena firma dell'app */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0984E3" /><stop offset=".55" stopColor="#28A0EA" /><stop offset=".75" stopColor="#7CC8F2" /></linearGradient>
        <linearGradient id="hsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0aa3c2" /><stop offset="1" stopColor="#00B894" /></linearGradient>
      </defs>
      <rect width="390" height="300" fill="url(#hsky)" />
      <circle cx="310" cy="74" r="34" fill="#FFE9A8" opacity=".95" />
      <circle cx="310" cy="74" r="48" fill="#FFE9A8" opacity=".25" />
      <ellipse cx="90" cy="86" rx="46" ry="14" fill="#fff" opacity=".5" />
      <ellipse cx="150" cy="66" rx="30" ry="10" fill="#fff" opacity=".35" />
      <path d="M0 208 Q60 190 120 200 T260 196 T390 202 L390 300 L0 300 Z" fill="url(#hsea)" />
      <path d="M0 216 Q80 206 160 214 T390 212" stroke="#fff" strokeWidth="2" fill="none" opacity=".3" />
      <path d="M268 208 Q300 168 352 200 L390 208 L390 224 L268 218 Z" fill="#0B7A63" />
      <g transform="translate(96,206)">
        <path d="M0 22 Q30 34 92 24 L110 8 Q106 20 96 26 Q40 40 -8 26 Q-16 20 -22 8 Q-8 20 0 22Z" fill="#7A4A22" />
        <path d="M8 22 Q40 30 84 23" stroke="#5C3517" strokeWidth="3" fill="none" />
        <rect x="34" y="-4" width="5" height="26" rx="2" fill="#5C3517" />
        <path d="M18 2 Q42 -12 68 2 L64 10 Q42 0 22 10 Z" fill="#E4574F" />
        <path d="M104 10 L128 -6" stroke="#5C3517" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      <g transform="translate(30,120)">
        <path d="M14 96 Q10 46 20 18" stroke="#3E2A16" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M20 20 Q-14 8 -26 24 M20 20 Q0 -8 -16 -6 M20 20 Q28 -14 48 -10 M20 20 Q52 2 62 20 M20 20 Q44 22 54 38" stroke="#0B7A63" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
