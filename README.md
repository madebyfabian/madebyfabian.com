# madebyfabian.com

My Portfolio – built with Astro (v6) and self hosted Directus

## Tech Stack

- 🚀 Astro v6
- 🎨 Tailwind CSS v4

Self-Hosted on VPS with Coolify:

- 🦌 Directus v11
- 🅿️ Plausible Analytics

## Setup

1. Create a `.env` file and add all env variables, see `.env.example` for a full list
2. Run `pnpm typegen:directus` to generate the Directus types for your directus instance.
3. Replace the urls in `vercel.json` with your own Directus and Plausible instances.
