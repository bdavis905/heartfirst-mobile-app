/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugins: {
    space: false,
  },
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          green: '#16A085',
          white: '#FFFFFF',
        },
        // Secondary Colors
        secondary: {
          'green-light': '#48C9B0',
          'green-pale': '#E8F6F3',
          gray: '#ECF0F1',
        },
        // Accent Colors
        accent: {
          emerald: '#27AE60',
          coral: '#FF6B6B',
          gold: '#F39C12',
        },
        // Functional Colors
        success: '#2ECC71',
        warning: '#E67E22',
        error: '#E74C3C',
        info: '#3498DB',
        // Text Colors
        text: {
          primary: '#2C3E50',
          secondary: '#7F8C8D',
          tertiary: '#95A5A6',
          inverse: '#FFFFFF',
        },
        // Background Colors
        background: {
          primary: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary: '#ECF0F1',
          success: '#E8F6F3',
        },
      },
      fontSize: {
        // Design System Typography
        'h1': ['34px', { lineHeight: '40px', letterSpacing: '-0.4px' }],
        'h2': ['28px', { lineHeight: '34px', letterSpacing: '-0.3px' }],
        'h3': ['22px', { lineHeight: '28px', letterSpacing: '-0.2px' }],
        'h4': ['18px', { lineHeight: '24px', letterSpacing: '-0.1px' }],
        'body-large': ['17px', { lineHeight: '26px', letterSpacing: '0px' }],
        'body-regular': ['15px', { lineHeight: '22px', letterSpacing: '0px' }],
        'body-small': ['13px', { lineHeight: '18px', letterSpacing: '0.1px' }],
        'data-display': ['48px', { lineHeight: '56px', letterSpacing: '-1px' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.2px' }],
        'button': ['17px', { lineHeight: '24px', letterSpacing: '0.1px' }],
        // Original sizes
        xs: "10px",
        sm: "12px",
        base: "14px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "40px",
        "5xl": "48px",
        "6xl": "56px",
        "7xl": "64px",
        "8xl": "72px",
        "9xl": "80px",
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        '4dp': '4px',
        '8dp': '8px',
        '12dp': '12px',
        '16dp': '16px',
        '20dp': '20px',
        '24dp': '24px',
        '32dp': '32px',
        '48dp': '48px',
        '56dp': '56px',
      },
      borderRadius: {
        '12dp': '12px',
        '16dp': '16px',
        '28dp': '28px',
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      const spacing = theme("spacing");

      // space-{n}  ->  gap: {n}
      matchUtilities(
        { space: (value) => ({ gap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-x-{n}  ->  column-gap: {n}
      matchUtilities(
        { "space-x": (value) => ({ columnGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-y-{n}  ->  row-gap: {n}
      matchUtilities(
        { "space-y": (value) => ({ rowGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );
    }),
  ],
};
