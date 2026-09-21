# Juliet O'Barr — Muscle Activation Techniques

Website and self-booking for Juliet O'Barr's MAT® practice
(1225 Central Ave, Suite 8A, McKinleyville, CA). Built as a gift by Taya,
designed to be handed over completely.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The website (landing page + self-booking) |
| `admin.html` | Juliet's private "Booking Book" — stats, upcoming sessions, done/cancel |
| `apps-script.js` | The booking backend — paste into a Google Sheet's Apps Script |
| `SHEETS-SETUP.md` | Step-by-step backend + phone-calendar setup |

## Going live (one time, ~1 minute)

Repo **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
The site appears at `https://<account>.github.io/juliet-mat-site/` a few
minutes later.

## Booking: off by default

The site ships in demo mode (booking widget shows example slots, saves
nothing). To turn on real self-booking, follow `SHEETS-SETUP.md`, then paste
the Apps Script URL into `index.html` where it says `var BOOKING_API = ''`.
Until then, clients use the call/email buttons — the site works fine without
the backend.

### Phone calendar

Once booking is live, bookings can appear in Juliet's native iPhone/Google
calendar via a private subscription link — see Step 5 in `SHEETS-SETUP.md`.

## Handing it over to Juliet

1. Juliet creates a free GitHub account
2. This repo: **Settings → General → Transfer ownership** → her username
3. She accepts the emailed invite — the repo, site, and history are hers
4. She re-enables Pages under her account (same one-minute step as above;
   her URL becomes `https://<her-username>.github.io/juliet-mat-site/`)
5. Google Sheet (if created): **Share → Transfer ownership** to her Gmail;
   she then redeploys the Apps Script once from her account and updates
   `BOOKING_API` in `index.html` with the new URL

## Still to fill in

- Juliet's photos (hero + two photo blocks — spots are labeled in the page)
- Her hours (marked `[hours to confirm]`)
- Real client reviews (the three shown are labeled samples)
- Optional custom domain (~$12/yr) — Settings → Pages → Custom domain
