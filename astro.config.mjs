// @ts-check
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://jsconf.es',
  output: 'server',
  integrations: [sitemap({ changefreq: 'weekly' })],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
})
