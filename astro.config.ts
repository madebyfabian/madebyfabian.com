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
	trailingSlash: 'never',
	integrations: [
		sitemap({
			filter: page => {
				if (page.endsWith('/impressum') || page.endsWith('/datenschutz')) {
					return false
				}
				return true
			},
		}),
	],
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
