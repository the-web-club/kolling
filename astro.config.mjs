import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

const geheim = () => envField.string({ context: 'server', access: 'secret', optional: true });
const openbaar = () => envField.string({ context: 'client', access: 'public', optional: true });

export default defineConfig({
  site: 'https://kolling.nl',
  trailingSlash: 'never',
  adapter: vercel(),
  env: {
    schema: {
      RESEND_API_KEY: geheim(),
      AANVRAAG_ONTVANGER: geheim(),
      AANVRAAG_AFZENDER: geheim(),
      AANVRAAG_BCC: geheim(),
      TURNSTILE_SECRET_KEY: geheim(),
      CRM_WEBHOOK_URL: geheim(),
      CRM_WEBHOOK_GEHEIM: geheim(),
      PUBLIC_TURNSTILE_SITE_KEY: openbaar(),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
