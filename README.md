# Juliet O'Barr — Muscle Activation Techniques

Website for Juliet O'Barr's MAT® practice
(1225 Central Ave, Suite 8A, McKinleyville, CA). Built by Taya, who hosts
and maintains it — Juliet decided the site stays on this account.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The homepage |
| `book.html` | Booking page — has a marked slot waiting for the scheduler embed (contact-card fallback shows until then) |

Update Sept 2026: Juliet asked for online booking after all. Plan: an
agency-style scheduler (Acuity) under Taya's account — Juliet gets a login
to manage her own hours/appointments, pays nothing. Paste the embed into
`book.html`'s `#scheduler` slot and delete the `#booking-soon` block.
(The old v1 self-booking flow still lives in git history but is retired —
third-party scheduler is the way.)

## Going live (one time, ~1 minute)

Repo **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
The site appears at `https://<account>.github.io/juliet-mat-site/` a few
minutes later.

## Ownership

The repo lives on Taya's account by Juliet's choice; the live URL is
`https://juno-arch.github.io/juliet-mat-site/`. If Juliet ever wants to
take it over: she makes a free GitHub account, Taya transfers the repo
(**Settings → General → Transfer ownership**), she accepts the emailed
invite and re-enables Pages — the repo, site, and history become hers.

## Still to fill in

- Juliet's photos (hero + two photo blocks + two dark bands — spots are
  labeled in the page)
- Her hours (marked `[to confirm]` in the contact card)
- Real client reviews (the four shown are labeled samples)
- Remove the "Draft mock-up" pill once Juliet signs off
- Optional custom domain (~$12/yr) — Settings → Pages → Custom domain
