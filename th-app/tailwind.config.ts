import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: '#0984E3',
        tropic: '#00B894',
        sand: '#F6E9D7',
        sunset: '#FD9644',
        night: '#1E272E',
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        ink2: 'var(--ink2)',
        dim: 'var(--dim)',
        line: 'var(--line)',
        'ocean-soft': 'var(--ocean-soft)',
        'tropic-soft': 'var(--tropic-soft)',
        'sunset-soft': 'var(--sunset-soft)',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(30,39,46,.05), 0 12px 34px rgba(30,39,46,.08)',
        lift: '0 6px 20px rgba(30,39,46,.10), 0 24px 60px rgba(30,39,46,.16)',
      },
      borderRadius: { xl2: '20px', xl3: '26px' },
    },
  },
  plugins: [],
} satisfies Config;
