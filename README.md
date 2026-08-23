# Shanti Ved & Associates LLP — Website

Single-page website for Shanti Ved & Associates LLP, Chartered Accountants,
C-Scheme, Jaipur. Hand-crafted static HTML/CSS/JS — no frameworks, no build
step, no third-party requests (fonts are self-hosted).

## Run locally

Open `index.html` in a browser, or serve it:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Upload the folder as-is to any static host (Cloudflare Pages, Netlify, GitHub
Pages, or classic shared hosting). No build step is required.

## Layout

| Path            | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `index.html`    | The entire page: content, meta tags, JSON-LD schema  |
| `css/styles.css`| Design tokens, layout, animations, responsive rules  |
| `js/main.js`    | Scrollspy, reveal-on-scroll, header state, mobile menu |
| `assets/fonts/` | Self-hosted woff2 fonts (Fraunces, Manrope)          |
| `favicon.svg`   | SV monogram favicon                                  |

Accessibility: semantic landmarks, skip link, visible focus states, and full
`prefers-reduced-motion` support. Works with JavaScript disabled.
