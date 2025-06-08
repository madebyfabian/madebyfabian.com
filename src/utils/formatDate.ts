export const formatDate = (date: string | null | undefined) => {
	try {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}

		if (!date) {
			throw new Error()
		}

		const dateObj = new Date(date)

		return new Intl.DateTimeFormat('en-US', options).format(dateObj)
	} catch (error) {
		return ''
	}
}

/**
 * Used to generate html ids for headings.
 */
export const stringToHtmlId = (str: string) => {
	return str
		.toLowerCase()
		.replace(/[^\w]+/g, '-')
		.replace(/(^-|-$)/g, '')
}
