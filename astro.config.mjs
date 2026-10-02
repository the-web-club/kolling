import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kolling.nl',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
});
