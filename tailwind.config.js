/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary — deep teal/blue (from ExpanseFlow logo)
        violet: {
          20: '#D6EFF5',
          40: '#9DD4E5',
          60: '#3DABC7',
          80: '#1A8BA8',
          100: '#0D7390',
        },
        // Income — green
        income: {
          20: '#CFFAEA',
          40: '#93F0C8',
          60: '#65D1A3',
          80: '#2AB784',
          100: '#00A86B',
        },
        // Expense — red
        expense: {
          20: '#FDD5D7',
          40: '#FDA2A9',
          60: '#FD6F7A',
          80: '#FD5662',
          100: '#FD3C4A',
        },
        // Warning — yellow
        warning: {
          20: '#FCEED4',
          40: '#FCDDA1',
          60: '#FCCC6F',
          80: '#FCBB3C',
          100: '#FCAC12',
        },
        // Info — blue
        info: {
          20: '#BDDCFF',
          40: '#8AC0FF',
          60: '#57A5FF',
          80: '#248AFF',
          100: '#0077FF',
        },
        // Surface colors
        surface: {
          light: '#F6F6F6',
          dark: '#161719',
        },
        card: {
          light: '#FFFFFF',
          dark: '#212325',
        },
        border: {
          light: '#E0E0E0',
          dark: '#333338',
        },
        muted: {
          DEFAULT: '#91919F',
          light: '#C6C6C6',
          dark: '#5A5A66',
        },
        // Legacy aliases (for easier migration)
        primary: {
          50: '#D6EFF5',
          100: '#D6EFF5',
          200: '#9DD4E5',
          300: '#3DABC7',
          400: '#1A8BA8',
          500: '#0D7390',
          600: '#0A6178',
          700: '#084F60',
          800: '#063D48',
          900: '#042B30',
          950: '#021A1E',
        },
        accent: {
          50: '#CFFAEA',
          100: '#CFFAEA',
          200: '#93F0C8',
          300: '#65D1A3',
          400: '#2AB784',
          500: '#00A86B',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#91919F',
          500: '#5A5A66',
          600: '#333338',
          700: '#212325',
          800: '#161719',
          900: '#0D0E0F',
          950: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'montra': '16px',
        'montra-sm': '12px',
        'montra-lg': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'bottom-nav': '0 -4px 20px rgba(0, 0, 0, 0.06)',
        'fab': '0 8px 24px rgba(13, 115, 144, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

