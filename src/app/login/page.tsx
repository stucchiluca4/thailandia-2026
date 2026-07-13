'use client';
/* ═══════════ LOGIN · magic link con ritorno robusto su PWA iOS ═══════════ */
import { useState } from 'react';
import { sb, hasSupabase } from '@/lib/sync';
import { HeroScene } from '@/components/Scene';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setErr(''); setBusy(true);
    const client = sb();
    if (!client) { setErr('Supabase non configurato — l’app funziona in modalità locale.'); setBusy(false); return; }
    const { error } = await client.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.origin + '/login/' },
    });
    setBusy(false);
    if (error) { setErr(traduci(error.message)); return; }
    setSent(true);
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="relative h-[38dvh] overflow-hidden">
        <HeroScene className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-5 left-5 text-white">
          <div className="text-[10px] font-black tracking-[2.4px]">7 – 22 AGOSTO 2026</div>
          <h1 className="text-[32px] font-black tracking-tight drop-shadow-lg">Thailandia 2026</h1>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 max-w-md mx-auto w-full">
        {!sent ? (
          <>
            <h2 className="text-[19px] font-black">Benvenuto a bordo ✈️</h2>
            <p className="text-[13px] text-ink2 mt-1.5">Inserisci la tua email: ti arriva un link. <b>Aprilo da questo stesso telefono</b> e sarai dentro — niente password.</p>
            <input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && email.includes('@')) send(); }}
              placeholder="la-tua-email@esempio.it"
              className="w-full mt-5 bg-surface border border-line rounded-2xl px-4 py-3.5 text-[15px] outline-none focus:border-ocean" />
            <button onClick={send} disabled={!email.includes('@') || busy}
              className="w-full mt-3 bg-ocean text-white font-extrabold text-[14px] py-3.5 rounded-2xl disabled:opacity-40 active:scale-[.98] transition-transform">
              {busy ? 'Invio in corso…' : 'Inviami il link ✨'}
            </button>
            {err && <p className="text-[12px] text-red-500 mt-3">{err}</p>}
            {!hasSupabase && <p className="text-[11.5px] text-dim mt-4">⚠️ Variabili Supabase assenti: configura .env.local per attivare login e sincronizzazione.</p>}
            <div className="mt-6 rounded-2xl bg-ocean-soft p-3.5">
              <p className="text-[11.5px] text-ink2 leading-relaxed">
                <b>💡 Importante su iPhone:</b> quando apri l’app dall’icona in Home e tocchi il link della mail, iOS lo apre in Safari.
                Fai così: dopo aver toccato “Sign in” nella mail ed essere entrato, <b>torna all’icona dell’app in Home</b>: ora ti riconosce.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center pt-6">
            <div className="text-[44px]">📬</div>
            <h2 className="text-[18px] font-black mt-2">Controlla la posta</h2>
            <p className="text-[13px] text-ink2 mt-1.5">Link inviato a<br /><b>{email}</b></p>
            <div className="mt-5 rounded-2xl bg-tropic-soft p-4 text-left">
              <p className="text-[12.5px] text-ink2 leading-relaxed">
                <b>1.</b> Apri la mail “Your sign-in link”<br />
                <b>2.</b> Tocca <b>Sign in</b> (si apre Safari e vedrai l’app)<br />
                <b>3.</b> Torna alla <b>icona dell’app</b> nella schermata Home<br />
                <b>4.</b> Sei dentro, e ci resti ✅
              </p>
            </div>
            <button onClick={() => { setSent(false); setErr(''); }} className="mt-4 text-[12px] font-bold text-ocean">‹ Usa un’altra email</button>
          </div>
        )}
      </div>
    </div>
  );
}

function traduci(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes('rate limit')) return 'Troppe email ravvicinate. Aspetta ~30 minuti (limite del piano gratuito) e riprova UNA volta sola.';
  if (m.includes('not allowed') || m.includes('signups')) return 'Email non abilitata per questo viaggio.';
  return msg;
}
