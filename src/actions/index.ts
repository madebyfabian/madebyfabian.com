import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import nodemailer from 'nodemailer'

export const server = {
	submitContactForm: defineAction({
		accept: 'form',
		input: z.object({
			name: z.string().min(1),
			email: z.string().email(),
			message: z.string(),
			'cf-turnstile-response': z.string().min(1),
		}),
		handler: async ({ name, email, message, 'cf-turnstile-response': turnstile_token }) => {
			if (!import.meta.env.TURNSTILE_SECRET_TOKEN) {
				throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'TURNSTILE_SECRET_TOKEN not found' })
			}

			const formData = new FormData()
			formData.append('secret', import.meta.env.TURNSTILE_SECRET_TOKEN)
			formData.append('response', turnstile_token)

			const turnstileURL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
			const result = await fetch(turnstileURL, {
				body: formData,
				method: 'POST',
			})

			const outcome = await result.json()

			if (!outcome.success) {
				throw new ActionError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'An error occurred while verifying you with Turnstile. Are you a human?',
				})
			}

			const transporter = nodemailer.createTransport(import.meta.env.NODEMAILER_CONNECTION)

			const info = await transporter.sendMail({
				from: import.meta.env.NODEMAILER_FROM,
				to: import.meta.env.NODEMAILER_FROM,
				subject: 'New contact form submission!',
				replyTo: email,
				text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
			})

			if (info.rejectedErrors?.length) {
				throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Mail rejected' })
			}

			return {
				success: true,
			}
		},
	}),
}
