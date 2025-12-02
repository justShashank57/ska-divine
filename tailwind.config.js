/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-purple': '#2E1A47',
        'deep-purple': '#3A235A',
        'gold': '#D4AF37',
        'soft-gold-glow': '#F4DFA5',
        'cream': '#F8F3E8',
        'text-dark': '#2E1A47',
        'text-light': '#5A4A6A',
      },
      fontFamily: {
        'heading': ['Cinzel', 'serif'],
        'body': ['Lora', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.4)',
        'custom': '0 4px 20px rgba(46, 26, 71, 0.15)',
        'custom-lg': '0 10px 40px rgba(46, 26, 71, 0.25)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out',
        'shimmer': 'shimmer 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '50%': { transform: 'translate(-50%, -50%) rotate(180deg)' },
        },
      },
    },
  },
  plugins: [],
}

