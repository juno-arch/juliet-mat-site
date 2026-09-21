# Juliet's Booking Backend — Google Sheets Setup

Same recipe as the Garden Faery apps: one Google Sheet + one Apps Script
deployment gives the website live availability, real self-serve booking,
and an admin app — all free.

## Step 1: Create the Google Sheet

1. Go to https://sheets.new (signed in as Juliet's Google account)
2. Name it "Juliet MAT — Bookings"
3. That's it — the script auto-creates the "Bookings" tab with headers:
   `id, name, contact, service, date, time, notes, status, created`

## Step 2: Add the Apps Script

1. In the sheet: **Extensions → Apps Script**
2. Delete everything in the editor and paste the code from `apps-script.js`
3. **Important:** change `ADMIN_KEY` at the top to a phrase only Juliet knows
4. **Deploy → New deployment** → gear icon → **Web app**
5. "Execute as" → **Me** · "Who has access" → **Anyone**
6. Click **Deploy**, copy the web app URL (`https://script.google.com/macros/s/…/exec`)

## Step 3: Connect the website

In `option-c.html`, find this line near the bottom and paste the URL:

```js
var BOOKING_API = '';   →   var BOOKING_API = 'https://script.google.com/macros/s/…/exec';
```

The booking widget flips from "Demo mode" to "Live availability" automatically.

## Step 4: Connect Juliet's admin app

Open `admin.html` (deployed alongside the site), tap **Settings**, paste the
same URL plus her admin key. She can add it to her phone's home screen like
any of the GF apps.

## Step 5: Bookings in her phone's native calendar

The script also serves a private **calendar feed**. Subscribe once and every
booking appears in her normal calendar app automatically (name, service,
time, notes, studio address — 90 or 60 minutes blocked off correctly).

The link is:  `<web app URL>?mode=ics&key=<her admin key>`
(The admin app shows it ready-made under Settings, with a Copy button.)

- **iPhone:** Settings → Apps → Calendar → Calendar Accounts → Add Account →
  Other → **Add Subscribed Calendar** → paste the link
- **Google Calendar:** Other calendars → **+** → **From URL** → paste

Cancelled bookings drop off the feed automatically. Keep the link private —
it contains her admin key (changing `ADMIN_KEY` + redeploying revokes it).
Phones refresh subscribed calendars on their own schedule (typically every
few hours; iPhone lets you choose in Settings).

## How it works

- The site fetches `?mode=slots` — it only ever sees *which times are taken*,
  never client names or contact info.
- Booking posts the client's details; the script uses a lock + re-check so
  two people can't grab the same slot simultaneously.
- The admin app (with the key) sees full bookings, marks them Done, or
  cancels — a cancelled slot opens back up on the site instantly.
- Juliet can also just open the Google Sheet directly; it's the same data.

## Editing the schedule

Bookable times currently live in `option-c.html` (`times` array, Sundays off).
Change them there — the sheet doesn't restrict times, it only records them.
