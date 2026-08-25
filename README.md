# Shanti Ved & Associates LLP, Website

Website for Shanti Ved & Associates LLP, Chartered Accountants, C-Scheme,
Jaipur: a single-page homepage plus an Insights section (articles).
Hand-crafted static HTML/CSS/JS, no frameworks in the browser, no third-party
requests (fonts are self-hosted). A small Node build script turns Markdown
posts into pages.

## Requirements

Node.js 18 or newer. For generating article preview images (Open Graph), a
Chromium-based browser (Brave or Google Chrome) installed in /Applications;
without one the build still succeeds and uses the default image.

## Run locally

```sh
npm install
npm run build          # writes the complete site into dist/
python3 -m http.server 8080 --directory dist
# then visit http://localhost:8080
```

## Publish an article

1. Create `posts/YYYY-MM-DD-your-slug.md` with front matter:

   ```
   ---
   title: Article title
   description: One or two sentences shown in listings and link previews.
   date: 2026-08-25
   author: Shanti Ved & Associates LLP
   tags: Audit, Compliance
   ---
   Article body in Markdown. Use ## for section headings.
   ```

   `author`, `tags` and `slug` are optional; `draft: true` keeps a post
   out of the build.

2. Run `./deploy.sh`. It installs dependencies if needed, builds `dist/`,
   generates the article's branded preview image into `assets/og/`
   (commit that file), and deploys to Cloudflare Pages.

Every article gets its own URL (`/insights/<slug>/`), link-preview
metadata for WhatsApp, LinkedIn and X, share buttons, an entry in the RSS
feed (`/feed.xml`) and the sitemap.

## Deploy

`./deploy.sh` builds and deploys `dist/` to the Cloudflare Pages project
`shantived` (direct upload; requires `npx wrangler login` once).

## Layout

| Path             | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `index.html`     | The homepage: content, meta tags, JSON-LD schema             |
| `posts/`         | Articles in Markdown with front matter                       |
| `templates/`     | HTML templates for article pages, listing and preview image  |
| `build.js`       | Build script: Markdown to HTML, feed, sitemap, OG images     |
| `css/styles.css` | Design tokens, layout, animations, responsive rules          |
| `js/main.js`     | Scrollspy, reveal-on-scroll, header state, menu, share bar   |
| `assets/fonts/`  | Self-hosted woff2 fonts (Fraunces, Manrope)                  |
| `assets/og/`     | Generated link-preview images (committed)                    |
| `favicon.svg`    | SV monogram favicon                                          |
| `deploy.sh`      | Build and deploy to Cloudflare Pages                         |
| `dist/`          | Build output (ignored by git)                                |

Accessibility: semantic landmarks, skip links, visible focus states, and
full `prefers-reduced-motion` support. Pages work with JavaScript disabled.
