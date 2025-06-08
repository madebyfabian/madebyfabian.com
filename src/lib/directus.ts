import { createDirectus, readItem, readItems, rest } from '@directus/sdk'
import type { Schema } from '../types/directus'

const directus = createDirectus<Schema>(import.meta.env.PUBLIC_DIRECTUS_URL).with(rest())

/**
 * Todo add proxy due to robots.txt indexing issue.
 */
export const generateAssetUrl = (
	file:
		| {
				id: string
				filename_download?: string | null
				modified_on?: string | null
		  }
		| null
		| undefined,
	options: { width?: number; v?: string | number } = {}
) => {
	if (!file) return null

	const isDev = import.meta.env.MODE === 'development'
	// In prod, we use the vercel rewrite defined in `vercel.json`
	const baseUrl = isDev
		? `${import.meta.env.PUBLIC_DIRECTUS_URL}/assets`
		: `${import.meta.env.PUBLIC_SITE_URL}/content-assets`

	let url = `${baseUrl}/${file.id}`
	if (file.filename_download) {
		url = url += `/${file.filename_download}`
	}

	let optionsParams = new URLSearchParams({
		format: 'webp',
	})

	if (file.modified_on) {
		optionsParams.append('v', String(+new Date(file.modified_on)))
	}

	if (options) {
		if (options.width) {
			optionsParams.append('width', options.width.toString())
		}

		if (!file.modified_on && options.v) {
			optionsParams.append('v', String(options.v))
		}
	}

	url += `?${optionsParams.toString()}`
	return url
}

export const fetchProjects = async () => {
	const projects = await directus.request(
		readItems('Projects', {
			filter: { status: { _eq: 'published' } },
			fields: [
				'*',
				{
					logo: ['*'],
					image: ['*'],
				},
			],
		})
	)

	return projects
}

export type FetchProjectsResult = Awaited<ReturnType<typeof fetchProjects>>

export const fetchArticles = async ({ limit }: { limit: number }) => {
	const articles = await directus.request(
		readItems('Articles', {
			filter: { status: { _eq: 'published' } },
			limit,
			fields: [
				'title',
				'slug',
				'description',
				'date_created',
				'date_updated',
				{
					og_image: ['*'],
				},
			],
		})
	)

	return articles
}

export type FetchArticlesResult = Awaited<ReturnType<typeof fetchArticles>>

export const fetchSingleArticle = async ({ slug }: { slug: string }) => {
	const article = await directus.request(
		readItem('Articles', slug, {
			filter: { status: { _eq: 'published' } },
			fields: [
				'title',
				'slug',
				'description',
				'date_created',
				'date_updated',
				'content_blocks',
				{
					og_image: ['*'],
				},
			],
		})
	)
	return article
}

export type FetchSingleArticleResult = Awaited<ReturnType<typeof fetchSingleArticle>>

export const fetchPages = async ({ limit }: { limit: number }) => {
	const pages = await directus.request(
		readItems('Pages', {
			limit,
			filter: { status: { _eq: 'published' } },
			fields: ['title', 'slug', 'date_created', 'date_updated'],
		})
	)

	return pages
}

export const fetchSinglePage = async ({ slug }: { slug: string }) => {
	const page = await directus.request(
		readItem('Pages', slug, {
			filter: { status: { _eq: 'published' } },
			fields: ['title', 'slug', 'date_created', 'date_updated', 'content_blocks'],
		})
	)
	return page
}
