# Psalmist Nation Tabernacle

Partnership site with three pages: Home, Partner With Us, and Our Projects.

## Setup

1. Copy `.env.example` to `.env.local` if it is not already there.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Use the anon key only.
3. Run `npm install`, then `npm run dev`.

The app reads `projects` and inserts rows into `partners`. It does not create or alter tables, and it never uses a service role key.

Set `CURRENCY_SYMBOL` in `src/lib/format.ts` when you want a currency mark in front of amounts.
