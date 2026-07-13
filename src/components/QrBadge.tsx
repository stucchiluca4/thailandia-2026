'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function QrBadge({ code, size = 88 }: { code: string; size?: number }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    QRCode.toDataURL(code, { width: size * 2, margin: 1 }).then(setUrl).catch(() => {});
  }, [code, size]);
  if (!url) return <div style={{ width: size, height: size }} className="rounded-xl bg-line" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={'QR ' + code} width={size} height={size} className="rounded-xl border border-line bg-white" />;
}
