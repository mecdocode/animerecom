/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0A0A0A',
          800: '#1A1A1A',
          700: '#2A2A2A'
        },
        paper: {
          50: '#FAFAFA',
          100: '#F2F2F2',
          200: '#E5E5E5'
        },
        halftone: {
          gray: '#D9D9D9'
        },
        crimson: {
          600: '#E11D48',
          700: '#BE123C'
        },
        cobalt: {
          600: '#2563EB',
          700: '#1D4ED8'
        },
        success: '#16A34A',
        warn: '#F59E0B',
        error: '#DC2626'
      },
      fontFamily: {
        'display': ['Bangers', 'cursive'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'comic': ['Permanent Marker', 'cursive']
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.16s ease-out',
        'letter-pop': 'letterPop 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        letterPop: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      boxShadow: {
        'ink': '0 4px 12px rgba(10, 10, 10, 0.15)',
        'panel': '0 2px 8px rgba(10, 10, 10, 0.1)',
        'card-hover': '0 8px 24px rgba(10, 10, 10, 0.2)'
      },
      backgroundImage: {
        'halftone': 'radial-gradient(circle, #D9D9D9 1px, transparent 1px)',
        'paper-texture': 'repeating-radial-gradient(circle at 0 0, transparent 0, #f8f7f4 10px)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
