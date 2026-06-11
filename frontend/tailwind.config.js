/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-navy': '#0A192F',
        'cyber-dark': '#111827',
        'cyber-cyan': '#22D3EE',
        'cyber-blue': '#3B82F6',
        'cyber-purple': '#7C3AED',
        'cyber-gray': '#B0BEC5',
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #0A192F 0%, #111827 50%, #1a2a4e 100%)',
        'gradient-glow': 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-cyber': 'pulse-cyber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-cyber': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(34, 211, 238, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
