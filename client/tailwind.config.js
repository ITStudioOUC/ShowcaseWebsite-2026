/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brandDark: '#030712',
        brandBlue: '#004b87',
        brandCyan: '#00f2fe',
        brandPurple: '#7028e4',
        brandEmerald: '#00e676',
        brandSky: '#38bdf8',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
