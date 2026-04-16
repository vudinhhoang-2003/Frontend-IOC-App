/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        card: 'var(--bg-card)',
        cyan: 'var(--cyan)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        yellow: 'var(--yellow)',
        red: 'var(--red)',
        purple: 'var(--purple)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        muted: 'var(--muted)',
        label: 'var(--label)',
        border: 'var(--border)',
      },

      spacing: {
        'sidebar': 'var(--sidebar-w)',
        'header': 'var(--header-h)',
      },
      boxShadow: {
        'theme': 'var(--shadow)',
        'glow': 'var(--glow)',
      },
      borderRadius: {
        'xl': 'var(--radius)',
        'lg': 'var(--radius-sm)',
      },
      transitionTimingFunction: {
        'theme-bounce': 'var(--transition)',
      }
    },
  },
  plugins: [],
}
