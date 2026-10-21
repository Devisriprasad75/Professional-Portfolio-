/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.9375rem', { lineHeight: '1.4rem' }],
        sm: ['1.0625rem', { lineHeight: '1.6rem' }],
        base: ['1.125rem', { lineHeight: '1.75rem' }],
        lg: ['1.375rem', { lineHeight: '2rem' }],
        xl: ['1.5rem', { lineHeight: '2.1rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.875rem', { lineHeight: '1.1' }],
        '5xl': ['3.5rem', { lineHeight: '1.08' }],
        '6xl': ['4rem', { lineHeight: '1.06' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
      },
      colors: {
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          surface: 'rgb(var(--bg-surface) / <alpha-value>)',
          raised: 'rgb(var(--bg-raised) / <alpha-value>)',
          border: 'rgb(var(--bg-border) / <alpha-value>)',
        },
        accent: {
          blue: '#4f7dfb',
          violet: '#8b6bfb',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(79,125,251,0.25), 0 0 32px -8px rgba(139,107,251,0.35)',
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 50% 0%, rgba(79,125,251,0.10), transparent 60%)',
      },
    },
  },
  plugins: [],
}
