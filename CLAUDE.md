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
- **Partner photos:** user will supply; apply duotone treatment when they arrive.
- **Cinematic UI upgrade:** user wants a beyond-best cinematic feel (crafted generative
  background, monogram intro, text-mask reveals, parallax — NO stock video). Claude
  proposed the crafted route; awaiting explicit go-ahead.
- **Requirements message:** an English draft asking the client for photos, Ved's bio,
  Instagram, FRN/LLPIN, and founding year was given to the user to forward.

## Domain & deployment

- **Note:** after ~2026-10-22 (60-day ICANN lock ends) the domain CAN optionally be
  transferred from name.com to Cloudflare Registrar for cheaper renewals. Not needed
  for going live — "Connect a domain" (DNS on Cloudflare) is the chosen route.

- **Domain (locked):** `shantived.consulting`, purchased at name.com (2026-08-23).
- **GitHub:** account `shantived`, repo `shantived/shantived` (private), pushed
  2026-08-23. Dedicated key `~/.ssh/shantived_ed25519`, ssh host alias
  `github-shantived` — this project must not reuse other projects' keys/accounts
  (user rule: work only from this chat and this folder).
- **Cloudflare:** account `shantivedllp@gmail.com` (project-dedicated), wrangler
  OAuth login done 2026-08-23. Pages project `shantived` deployed via DIRECT UPLOAD
  (`./deploy.sh` builds dist/ with public files only and runs `wrangler pages deploy`).
  NOT git-connected — every site update needs `./deploy.sh` after committing.
  Live and verified: https://shantived.pages.dev (title + assets checked; internal
  files confirmed not uploaded — unknown paths serve index.html fallback, no leak).
- **Next:** registry watcher running for nameserver propagation (wren/damian
  .ns.cloudflare.com set at name.com 2026-08-23) → once zone is active, attach
  custom domain `shantived.consulting` to the Pages project + www redirect.
- Canonical URL, og:url, JSON-LD url, robots.txt and sitemap.xml added 2026-08-23.
- Git repo initialized (branch `main`), initial commit made 2026-08-23.

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
