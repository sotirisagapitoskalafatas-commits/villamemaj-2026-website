# Villa Memaj — 2026 Website

Hotel website built with Next.js 16 (App Router), Tailwind CSS 4 and Supabase.

- Bilingual: **Greek (EL)** default + **English (EN)** — `/el/...`, `/en/...`
- Pages: Home, Rooms (+ per-room detail), Gallery, Booking request, Contact
- Booking & contact forms insert into Supabase (`hotel_bookings`, `hotel_contact_messages`)
- Room/gallery content is managed in Supabase (`hotel_rooms`, `hotel_gallery_images`)

## Local development

```bash
npm install
cp .env.example .env.local   # already created locally
npm run dev
```

Open http://localhost:3000 (redirects to `/el`).

## Environment variables

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jbmccmokfvyvijmumuzn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | your Supabase publishable key |

Add both in **Vercel → Project → Settings → Environment Variables** after connecting the repo.

## Managing content

All content lives in Supabase (Dashboard → Table Editor):

- `hotel_rooms` — rooms/suites (EL/EN names, price, amenities, images)
- `hotel_gallery_images` — gallery photos
- `hotel_bookings` — booking requests from the site (status: pending/confirmed/cancelled)
- `hotel_contact_messages` — contact form messages

Update the hotel's real **phone, email, address** in `src/lib/site.ts`.

## Deploy

Push to GitHub, then in Vercel: *Add New → Project → Import this repo*. Vercel auto-detects Next.js. Add the two environment variables above and deploy.
