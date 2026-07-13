'use client';
/* ═══════════ SHELL · nav, tema, auth gate, init sync ═══════════ */
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useTrip, hasSupabase, sb } from '@/lib/sync';
import { downloadICS } from '@/lib/ics';

const TABS = [
  { href: '/', ic: '🏠', l: 'Viaggio' },
  { href: '/itinerario/', ic: '📅', l: 'Itinerario' },
  { href: '/mappa/', ic: '🗺️', l: 'Mappa' },
  { href: '/food/', ic: '🍜', l: 'Food' },
  { href: '/prenotazioni/', ic: '🎟️', l: 'Prenotaz.' },
  { href: '/altro/', ic: '⚙️', l: 'Altro' },
];

export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { init, userEmail, ready, online } = useTrip();
  const [dark, setDark] = useState(false);
  const [authKnown, setAuthKnown] = useState(!hasSupabase);

  useEffect(() => {
    const saved = localStorage.getItem('th_theme');
    const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    init();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, [init]);

  /* Auth gate: con Supabase attivo, senza sessione → /login */
  useEffect(() => {
    if (!hasSupabase) return;
    const client = sb()!;

    (async () => {
      /* Ritorno dal magic link: l'URL contiene ?code=... (PKCE) o #access_token=...
         Scambio esplicito qui garantisce che la sessione venga salvata
         nell'ambiente corrente — anche quando l'app è aperta dall'icona PWA. */
      try {
        const url = new URL(window.location.href);
        const hasCode = url.searchParams.get('code');
        const hasHashToken = window.location.hash.includes('access_token');
        if (hasCode) {
          await client.auth.exchangeCodeForSession(window.location.href);
          window.history.replaceState({}, '', url.origin + url.pathname);
        } else if (hasHashToken) {
          /* detectSessionInUrl gestisce l'hash; ripulisco l'URL dopo */
          await new Promise(r => setTimeout(r, 300));
          window.history.replaceState({}, '', url.origin + url.pathname);
        }
      } catch { /* se fallisce, resta la getSession sotto */ }

      const { data: { session } } = await client.auth.getSession();
      setAuthKnown(true);
      if (!session && path !== '/login/' && path !== '/login') router.replace('/login/');
      if (session && (path === '/login/' || path === '/login')) router.replace('/');
    })();

    const { data: sub } = client.auth.onAuthStateChange((_e, session) => {
      if (session && (path === '/login/' || path === '/login')) router.replace('/');
    });
    return () => sub.subscription.unsubscribe();
  }, [path, router]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('th_theme', next ? 'dark' : 'light');
  };

  const isLogin = path?.startsWith('/login');

  return (
    <div className="mx-auto max-w-2xl pb-24">
      {!isLogin && (
        <header className="sticky top-0 z-50 glass flex items-center justify-between px-4 py-2.5"
          style={{ paddingTop: 'calc(10px + var(--safe-t))' }}>
          <div className="text-[16px] font-extrabold tracking-tight">🇹🇭 Thailandia <span className="text-ocean">2026</span></div>
          <div className="flex items-center gap-2">
            {!online && hasSupabase && <span className="text-[9px] font-extrabold px-2 py-1 rounded-full bg-sunset-soft text-sunset">OFFLINE</span>}
            {!hasSupabase && <span className="text-[9px] font-extrabold px-2 py-1 rounded-full bg-line text-ink2" title="Configura .env.local per la sincronizzazione">LOCALE</span>}
            <button onClick={downloadICS} title="Esporta promemoria nel Calendario" className="w-9 h-9 rounded-xl bg-surface border border-line shadow-soft flex items-center justify-center text-sm">📅</button>
            <button onClick={toggleTheme} title="Tema" className="w-9 h-9 rounded-xl bg-surface border border-line shadow-soft flex items-center justify-center text-sm">{dark ? '☀️' : '🌙'}</button>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        <motion.main key={path} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
          {(authKnown && ready) || isLogin ? children : <div className="p-8 text-center text-dim text-sm">Caricamento…</div>}
        </motion.main>
      </AnimatePresence>

      {!isLogin && (
        <nav className="fixed bottom-0 inset-x-0 z-50 glass flex" style={{ paddingBottom: 'var(--safe-b)' }}>
          {TABS.map(t => {
            const on = t.href === '/' ? path === '/' : path?.startsWith(t.href.slice(0, -1));
            return (
              <Link key={t.href} href={t.href}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[9px] font-extrabold ${on ? 'text-ocean' : 'text-dim'}`}>
                <motion.span animate={on ? { y: -2, scale: 1.14 } : { y: 0, scale: 1 }} className="text-[20px] leading-none">{t.ic}</motion.span>
                {t.l}
              </Link>
            );
          })}
        </nav>
      )}
      {userEmail && !isLogin && (
        <div className="fixed bottom-16 right-3 text-[8.5px] text-dim font-bold" style={{ marginBottom: 'var(--safe-b)' }}>
          ☁️ {userEmail.split('@')[0]}
        </div>
      )}
    </div>
  );
}
