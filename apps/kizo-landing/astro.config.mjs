// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const LANDING_URL = process.env.VITE_LANDING_URL;

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: LANDING_URL,
  vite: {
    plugins: []
  }
});