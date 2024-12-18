// @ts-check
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  experimental: {
    svg: {
      mode: 'sprite',
    },
  },
  output: 'server',
  integrations: [tailwind()],
  adapter: vercel(),
})
