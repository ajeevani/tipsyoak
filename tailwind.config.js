/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Colors
        background: 'var(--color-background)', // white
        foreground: 'var(--color-foreground)', // gray-900
        border: 'var(--color-border)', // gray-200
        input: 'var(--color-input)', // white
        ring: 'var(--color-ring)', // red-600
        
        // Card Colors
        card: {
          DEFAULT: 'var(--color-card)', // gray-50
          foreground: 'var(--color-card-foreground)' // gray-900
        },
        
        // Popover Colors
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // gray-900
        },
        
        // Muted Colors
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-100
          foreground: 'var(--color-muted-foreground)' // gray-500
        },
        
        // Primary Colors
        primary: {
          DEFAULT: 'var(--color-primary)', // red-600
          foreground: 'var(--color-primary-foreground)' // white
        },
        
        // Secondary Colors
        secondary: {
          DEFAULT: 'var(--color-secondary)', // gray-700
          foreground: 'var(--color-secondary-foreground)' // white
        },
        
        // Accent Colors
        accent: {
          DEFAULT: 'var(--color-accent)', // gray-100
          foreground: 'var(--color-accent-foreground)' // gray-900
        },
        
        // Success Colors
        success: {
          DEFAULT: 'var(--color-success)', // emerald-600
          foreground: 'var(--color-success-foreground)' // white
        },
        
        // Warning Colors
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-600
          foreground: 'var(--color-warning-foreground)' // white
        },
        
        // Error Colors
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)' // white
        },
        
        // Destructive Colors
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-600
          foreground: 'var(--color-destructive-foreground)' // white
        },
        
        // Surface Color
        surface: 'var(--color-surface)', // gray-50
        
        // Text Colors
        'text-primary': 'var(--color-text-primary)', // gray-900
        'text-secondary': 'var(--color-text-secondary)', // gray-500
        
        // Brand Colors
        'brand-red': 'var(--color-brand-red)', // red-600
        'brand-charcoal': 'var(--color-brand-charcoal)', // gray-700
        'brand-warm-gray': 'var(--color-brand-warm-gray)' // gray-100
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)'
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'contextual': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)'
      },
      backdropBlur: {
        'glass': '20px'
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'micro-bounce': 'microBounce 150ms ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        microBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      borderRadius: {
        'glass': '12px'
      },
      zIndex: {
        'navigation': '100',
        'dropdown': '200',
        'dialog-backdrop': '1000',
        'dialog-content': '1001'
      },
      minHeight: {
        'touch': '44px'
      },
      minWidth: {
        'touch': '44px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ],
}