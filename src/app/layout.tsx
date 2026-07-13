import type { Metadata, Viewport } from 'next';
import './globals.css';
import Shell from '@/components/Shell';

export const metadata: Metadata = {
  title: 'Thailandia 2026 · Travel Companion',
  description: 'Il compagno di viaggio per la Thailandia, 7–22 agosto 2026',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Thailandia' },
  icons: { apple: '/apple-touch-icon.png' },
};
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#FBF7EF' }, { media: '(prefers-color-scheme: dark)', color: '#12191F' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
