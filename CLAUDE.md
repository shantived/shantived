# Shantived — Website for Shanti Ved & Associates LLP

Single-page, minimal-premium website for a Chartered Accountancy firm in Jaipur.
Priorities set by the owner: smoothest and fastest possible experience, minimal
premium design, ICAI-sober tone (no client names, testimonials, or promotional claims).

## Locked decisions (user-approved)

- **Location:** `/Users/chaman/shantived` (2026-08-19)
- **Stack:** pure hand-crafted HTML/CSS/JS — zero frameworks, zero build step,
  self-hosted fonts, no third-party requests (stack delegated to Claude by the user)
- **Structure:** single page with smooth scroll — Hero → The Firm → Services → Partners → Contact
- **Partners shown:** both — Shanti Kothari and Ved Prakash Sujaka
- **Project docs:** CLAUDE.md only; the user declined a project .docx for this project
- **Content:** drafted by Claude, to be reviewed by the user

## Source of truth — firm data (from business card + user corrections, 2026-08-19)

- Firm: Shanti Ved & Associates LLP — Chartered Accountants
- Address: 503, 5th Floor, City Corporate Building, Malviya Marg, C-Scheme, Jaipur — 302001
- Phones: **+91 91666 62433** (mobile) and **0141-4030095** (office).
  The card numbers 88290-09323 and 0141-2372027 were replaced on the user's
  instruction; the "(SL)/(VP)" labels were removed. The card's 89559-79994 is NOT shown
  (user chose to show only the two numbers above).
- Email: svandassociatesllp@gmail.com
- LinkedIn: https://www.linkedin.com/in/shanti-lal-kothari-2151a317
- Shanti Kothari — FCA, DISA (ICAI); MCA Empanelled Independent Director;
  Founder & Lead Partner. Bio text supplied by the user (refined on the site).
- Ved Prakash Sujaka — ACA, M.COM; Partner.

## Open items

- **Instagram link:** user will supply later; no Instagram icon on the site until then.
- **Ved Prakash Sujaka bio:** drafted generically by Claude (no details supplied) — needs user review.
- Domain and hosting: not discussed yet.

## Structure

```
index.html          — the whole page (semantic sections, JSON-LD, meta)
css/styles.css      — design system (tokens, layout, animations, responsive, reduced-motion)
js/main.js          — scrollspy, reveal-on-scroll, sticky header state, mobile menu
assets/fonts/       — self-hosted woff2 (Fraunces 600, Fraunces italic 500, Manrope variable)
favicon.svg         — SV monogram
```

## How to run

Static site — open `index.html` directly, or serve locally:

```
cd /Users/chaman/shantived && python3 -m http.server 8080
```

## Status log

- 2026-08-19 — Project created. Fonts self-hosted (~100 KB latin subsets). Full
  single-page site built: hero, firm, 6 services, 2 partners, contact, footer.
  Verified visually with headless Brave screenshots at 1440px and 390px (every
  section inspected). Fixed during verification: contact rows needed a
  `.contact-body` wrapper (grid auto-placement bug), hero height capped at
  `min(100svh, 960px)`, brand name sized to fit uncut on small screens.
  Total page weight ~137 KB (~9.5 KB gzipped text + ~102 KB fonts), zero
  external requests. Tool note: old-headless fragment screenshots and
  `sips --cropOffset 0` are unreliable — use an iframe wrapper page to
  verify mobile layouts.
