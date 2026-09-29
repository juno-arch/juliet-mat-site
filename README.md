# Juliet O'Barr · Muscle Activation Techniques

Website for Juliet O'Barr's MAT® practice
(1225 Central Ave, Suite 8A, McKinleyville, CA). Built and cared for by Taya
(Web Faery).

Live at **https://jomastudios.com** (GitHub Pages, custom domain via the `CNAME`
file, HTTPS enforced). Launched September 29, 2026.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The homepage |
| `book.html` | Redirect to the homepage contact card (old booking link, kept so it never 404s) |
| `images/` | Site photos (location data stripped) and the link-preview image `share.jpg` |
| `juliet-intake-form.pdf` | Printable intake form linked from the First visit card |
| `CNAME` | Tells GitHub Pages to serve the site at jomastudios.com |

Sessions are scheduled by call, text, or email (no online booking). An older
booking version lives in git history (commit e4c9de0) if it's ever wanted again.

## Domain and email

- Domain and DNS: Porkbun. The root has GitHub Pages A and AAAA records, and
  `www` is a CNAME to `juno-arch.github.io`.
- `info@jomastudios.com` forwards to Juliet's inbox through Porkbun email forwarding.
  Replies "from" info@ use Porkbun email hosting with Gmail's "Send mail as".

## Ownership

The repo lives on Taya's account by Juliet's choice. If Juliet ever wants to
take it over, she makes a free GitHub account, Taya transfers the repo
(**Settings → General → Transfer ownership**), and she accepts the emailed
invite. The domain stays pointed at wherever the site is hosted.
