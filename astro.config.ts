import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import { loadEnv } from 'vite'

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV || '', process.cwd(), '')

// https://astro.build/config
export default defineConfig({
	adapter: vercel(),
	site: PUBLIC_SITE_URL,
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: 'Albert Sans',
				cssVariable: '--font-albert-sans',
			},
			{
				provider: fontProviders.google(),
				name: 'Lora',
				cssVariable: '--font-lora',
			},
		],
	},
})
