// @ts-check
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://jsconf.es',
  output: 'server',
  integrations: [sitemap({ changefreq: 'weekly' }), react()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
})
