# Shantived, Website for Shanti Ved & Associates LLP

Single-page, minimal-premium website for a Chartered Accountancy firm in Jaipur.
Priorities set by the owner: smoothest and fastest possible experience, minimal
premium design, ICAI-sober tone (no client names, testimonials, or promotional claims).

## Locked decisions (user-approved)

- **Location:** `/Users/chaman/shantived` (2026-08-19)
- **Stack:** pure hand-crafted HTML/CSS/JS, zero frameworks, zero build step,
  self-hosted fonts, no third-party requests (stack delegated to Claude by the user)
- **Structure:** single page with smooth scroll, Hero → The Firm → Services → Partners → Contact
- **Partners shown:** both, Shanti Kothari and Ved Prakash Sujaka
- **Project docs:** CLAUDE.md only; the user declined a project .docx for this project
- **Content:** drafted by Claude, to be reviewed by the user

## Source of truth, firm data (from business card + user corrections, 2026-08-19)

- Firm: Shanti Ved & Associates LLP, Chartered Accountants
- Address: 503, 5th Floor, City Corporate Building, Malviya Marg, C-Scheme, Jaipur, 302001
- Phones: **+91 91666 62433** (mobile) and **0141-4030095** (office).
  The card numbers 88290-09323 and 0141-2372027 were replaced on the user's
  instruction; the "(SL)/(VP)" labels were removed. The card's 89559-79994 is NOT shown
  (user chose to show only the two numbers above).
- Email: svandassociatesllp@gmail.com
- LinkedIn: https://www.linkedin.com/in/shanti-lal-kothari-2151a317
- Shanti Kothari, FCA, DISA (ICAI); MCA Empanelled Independent Director;
  Founder & Lead Partner. Bio text supplied by the user (refined on the site).
- Ved Prakash Sujaka, ACA, M.COM; Partner.

## Open items

- **Instagram link:** user will supply later; no Instagram icon on the site until then.
- **Ved Prakash Sujaka bio:** drafted generically by Claude (no details supplied), needs user review.
- **Partner photos:** user will supply; apply duotone treatment when they arrive.
- **Cinematic UI upgrade:** user wants a beyond-best cinematic feel (crafted generative
  background, monogram intro, text-mask reveals, parallax, NO stock video). Claude
  proposed the crafted route; awaiting explicit go-ahead.
- **Requirements message:** an English draft asking the client for photos, Ved's bio,
  Instagram, FRN/LLPIN, and founding year was given to the user to forward.

## Domain & deployment

- **Note:** after ~2026-10-22 (60-day ICANN lock ends) the domain CAN optionally be
  transferred from name.com to Cloudflare Registrar for cheaper renewals. Not needed
  for going live, "Connect a domain" (DNS on Cloudflare) is the chosen route.

- **Domain (locked):** `shantived.consulting`, purchased at name.com (2026-08-23).
- **GitHub:** account `shantived`, repo `shantived/shantived` (private), pushed
  2026-08-23. Dedicated key `~/.ssh/shantived_ed25519`, ssh host alias
  `github-shantived`, this project must not reuse other projects' keys/accounts
  (user rule: work only from this chat and this folder).
- **Cloudflare:** account `shantivedllp@gmail.com` (project-dedicated), wrangler
  OAuth login done 2026-08-23. Pages project `shantived` deployed via DIRECT UPLOAD
  (`./deploy.sh` builds dist/ with public files only and runs `wrangler pages deploy`).
  NOT git-connected, every site update needs `./deploy.sh` after committing.
  Live and verified: https://shantived.pages.dev (title + assets checked; internal
  files confirmed not uploaded, unknown paths serve index.html fallback, no leak).
- **LIVE on custom domain (2026-08-23):** https://shantived.consulting and
  https://www.shantived.consulting both HTTP 200, http→https 301 works. Zone active
  on Cloudflare (nameservers wren/damian propagated). DNS: two proxied CNAMEs
  (apex + www → shantived.pages.dev), created by the user in the dashboard after
  deleting auto-imported parking A records (91.195.240.94 = name.com parking).
  Note: wrangler's OAuth token has zone:read but NOT dns_records:write, DNS edits
  need the dashboard (or a scoped API token). Fresh wrangler auth lives at
  `~/.wrangler/config/default.toml` (the ~/Library/Preferences copy is stale).
- Canonical URL, og:url, JSON-LD url, robots.txt and sitemap.xml added 2026-08-23.
- Git repo initialized (branch `main`), initial commit made 2026-08-23.

## Structure

```
index.html          the homepage (hand-written; build injects the latest posts between markers)
posts/*.md          Insights articles (Markdown + front matter), the content source of truth
templates/          header/footer partials, post page, insights listing, home strip, OG image
build.js            Node build: Markdown to HTML, feed.xml, sitemap.xml, OG images, dist/
css/styles.css      design system (tokens, layout, animations, insights/post/share styles)
js/main.js          scrollspy, reveal-on-scroll, header state, mobile menu, share bar
assets/fonts/       self-hosted woff2 (Fraunces 600, Fraunces italic 500, Manrope variable)
assets/og/          generated 1200x630 link-preview PNGs (committed; built once per post)
assets/logo/        official CA India logo PNG + favicon set (32/180/192/512, white-padded)
brand/              logo source files (AI/EPS/PDF) + ICAI logo manual; NOT copied to dist
favicon.svg         OLD SV monogram, unreferenced since 2026-08-25 (delete only with user's ok)
deploy.sh           npm install (if needed) + npm run build + wrangler pages deploy dist
dist/               build output, gitignored, the only thing that is uploaded
```

## How to run

```
cd /Users/chaman/shantived && npm install && npm run build
python3 -m http.server 8080 --directory dist
```

## Insights (blog) workflow, decided 2026-08-25

- Posts are published THROUGH Chaman/Claude (user's pick), not by the client.
  Section is named "Insights". Every post must be shareable: own URL, OG/Twitter
  preview metadata with a branded image, share buttons (WhatsApp, LinkedIn, X,
  Email, Copy link, native share on mobile), RSS + sitemap entries.
- To publish: add posts/YYYY-MM-DD-slug.md (front matter: title, description,
  date; optional author, tags, slug, draft) and run ./deploy.sh. Commit the new
  assets/og/<slug>.png the build generates.
- Content rules: ICAI-sober, general guidance only, no rates/deadlines/section
  numbers unless the client supplies and approves them; disclaimer is rendered
  on every post automatically. Launch posts (3, dated 2026-08-25) were drafted by
  Claude and need client review.
- OG image generation needs Brave/Chrome on the build machine; builds elsewhere
  fall back to assets/og/default.png with a warning.

## Status log

- 2026-08-19, Project created. Fonts self-hosted (~100 KB latin subsets). Full
  single-page site built: hero, firm, 6 services, 2 partners, contact, footer.
  Verified visually with headless Brave screenshots at 1440px and 390px (every
  section inspected). Fixed during verification: contact rows needed a
  `.contact-body` wrapper (grid auto-placement bug), hero height capped at
  `min(100svh, 960px)`, brand name sized to fit uncut on small screens.
  Total page weight ~137 KB (~9.5 KB gzipped text + ~102 KB fonts), zero
  external requests. Tool note: old-headless fragment screenshots and
  `sips --cropOffset 0` are unreliable, use an iframe wrapper page to
  verify mobile layouts.
- 2026-08-25 - Insights section built: Markdown posts, build.js, templates, share
  bar, OG images, feed.xml, sitemap. Homepage nav gained "Insights" and a
  "Latest from the practice" strip. Em-dash ban (user rule from 2026-08-20)
  applied: all project files swept to zero em dashes. Stack note: the browser
  still gets zero frameworks; Node + marked are build-time only.
- 2026-08-25 - SV monogram replaced by the official ICAI "CA India" logo (user
  request: "CA wala logo double right ke sign wala"). Files came from ICAI's own
  download (icai.org/post/2167, archive caindia-logo-download.rar); the manual is
  in brand/. Rules applied from the manual: logo unaltered, proportional scaling
  only, white background (footer uses a white tile, OG images use a white tile),
  no rotation/crop. Colours: blue #145886, orange #F37920, green #55B848. The new
  logo is effective 24 Nov 2023 with a one-year transition, so the client's
  visiting card still carries the OLD logo; told the user. OG images re-rendered
  (OG_REFRESH=1). Favicons are PNG now; favicon.svg is unused, pending deletion.
