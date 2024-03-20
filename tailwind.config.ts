import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        upper: '0 -4px 6px -1px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
