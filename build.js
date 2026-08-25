#!/usr/bin/env node
/*
 * Build script for shantived.consulting.
 *
 * Assembles dist/ from the hand-written homepage, the static assets and the
 * Markdown posts in posts/. Generates:
 *   /insights/               list of published posts
 *   /insights/<slug>/        one page per post, with share metadata
 *   /feed.xml                RSS feed
 *   /sitemap.xml             sitemap (also refreshed at the repo root)
 *   assets/og/<slug>.png     branded Open Graph preview image per post
 *                            (rendered once with a local Chromium browser,
 *                            then committed; skipped when no browser exists)
 *
 * Post front matter (posts/YYYY-MM-DD-slug.md):
 *   title, description, date (YYYY-MM-DD)  required
 *   author, tags (comma separated), slug, draft (true hides the post)  optional
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { marked } = require('marked');

const SITE = 'https://shantived.consulting';
const SITE_NAME = 'Shanti Ved & Associates LLP';
const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const POSTS_DIR = path.join(ROOT, 'posts');
const TEMPLATES = path.join(ROOT, 'templates');
const OG_DIR = path.join(ROOT, 'assets', 'og');
const STATIC_FILES = ['index.html', 'favicon.svg', 'robots.txt'];
const STATIC_DIRS = ['css', 'js', 'assets'];
const BROWSERS = [
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

marked.use({ gfm: true });

/* ---------- helpers ---------- */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// {{key}} escapes, {{{key}}} inserts raw HTML.
function render(template, data) {
  return template
    .replace(/\{\{\{\s*(\w+)\s*\}\}\}/g, (_, k) => (data[k] == null ? '' : String(data[k])))
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => (data[k] == null ? '' : escapeHtml(data[k])));
}

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES, name), 'utf8');
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

function rfc822(iso) {
  return new Date(`${iso}T00:00:00Z`).toUTCString();
}

function readingMinutes(text) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
}

/* ---------- posts ---------- */

function parsePost(file) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing front matter block`);

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ['title', 'description', 'date']) {
    if (!meta[key]) throw new Error(`${file}: front matter needs "${key}"`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: date must be YYYY-MM-DD`);

  const slug = meta.slug || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: slug must use lowercase letters, digits and hyphens`);

  const body = match[2].trim();
  return {
    file,
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    author: meta.author || SITE_NAME,
    tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    draft: meta.draft === 'true',
    html: marked.parse(body),
    minutes: readingMinutes(body),
    path: `/insights/${slug}/`,
    url: `${SITE}/insights/${slug}/`,
  };
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const posts = fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parsePost)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`duplicate slug "${p.slug}" (${p.file})`);
    seen.add(p.slug);
  }
  return posts;
}

/* ---------- Open Graph images ---------- */

function findBrowser() {
  return BROWSERS.find((p) => fs.existsSync(p)) || null;
}

function titleSize(title) {
  if (title.length > 70) return 50;
  if (title.length > 48) return 58;
  return 66;
}

// Renders assets/og/<name>.png once; later builds reuse the committed file.
function ensureOgImage(name, title, kicker, browser, ogTemplate, warnings) {
  const out = path.join(OG_DIR, `${name}.png`);
  if (fs.existsSync(out)) return true;
  if (!browser) {
    warnings.push(`no Chromium-based browser found: OG image for "${name}" not generated`);
    return false;
  }
  const workDir = path.join(DIST, '_og');
  fs.mkdirSync(workDir, { recursive: true });
  const page = path.join(workDir, `${name}.html`);
  fs.writeFileSync(page, render(ogTemplate, {
    title, kicker, titleSize: titleSize(title), fontsDir: path.join(ROOT, 'assets', 'fonts'),
  }));
  fs.mkdirSync(OG_DIR, { recursive: true });
  execFileSync(browser, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-prefers-reduced-motion', '--window-size=1200,630', '--virtual-time-budget=4000',
    `--screenshot=${out}`, `file://${page}`,
  ], { stdio: 'ignore' });
  fs.rmSync(workDir, { recursive: true, force: true });
  if (!fs.existsSync(out)) warnings.push(`browser did not produce OG image for "${name}"`);
  return fs.existsSync(out);
}

/* ---------- HTML fragments ---------- */

function cardHtml(post) {
  return `          <article class="insight-card" data-reveal>
            <a class="insight-link" href="${post.path}">
              <p class="insight-meta"><time datetime="${post.date}">${formatDate(post.date)}</time> · ${post.minutes} min read</p>
              <h3>${escapeHtml(post.title)}</h3>
              <p class="insight-desc">${escapeHtml(post.description)}</p>
              <span class="insight-more">Read <span aria-hidden="true">→</span></span>
            </a>
          </article>`;
}

function shareBarHtml(post) {
  const url = encodeURIComponent(post.url);
  const title = encodeURIComponent(post.title);
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${post.url}`)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  const x = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  const email = `mailto:?subject=${title}&body=${encodeURIComponent(`${post.description}\n\n${post.url}`)}`;
  return `<div class="share" data-share-url="${escapeHtml(post.url)}" data-share-title="${escapeHtml(post.title)}">
          <span class="share-label">Share</span>
          <a class="share-btn" href="${whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-btn" href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="share-btn" href="${x}" target="_blank" rel="noopener">X</a>
          <a class="share-btn" href="${email}">Email</a>
          <button class="share-btn share-copy" type="button">Copy link</button>
          <button class="share-btn share-native" type="button" hidden>More</button>
        </div>`;
}

function tagsHtml(post) {
  if (!post.tags.length) return '';
  return `<ul class="post-tags" aria-label="Topics">${post.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`;
}

function moreHtml(post, posts) {
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  if (!others.length) return '';
  return `    <section class="post-more">
      <div class="container">
        <div class="section-head section-head-row" data-reveal>
          <div>
            <p class="eyebrow">Keep reading</p>
            <h2>More insights</h2>
          </div>
          <a class="link-arrow" href="/insights/">All insights <span aria-hidden="true">→</span></a>
        </div>
        <div class="insights-grid">
${others.map(cardHtml).join('\n')}
        </div>
      </div>
    </section>`;
}

function postJsonLd(post, ogImage) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: post.url,
    mainEntityOfPage: post.url,
    image: ogImage,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE}/` },
  });
}

/* ---------- feeds ---------- */

function feedXml(posts) {
  const items = posts.map((p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${p.url}</link>
      <guid isPermaLink="true">${p.url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${escapeHtml(p.description)}</description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Insights: ${escapeHtml(SITE_NAME)}</title>
    <link>${SITE}/insights/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Practical writing on audit, taxation, compliance and governance from a Chartered Accountancy practice in Jaipur.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

function sitemapXml(posts, today) {
  const latest = posts.length ? posts[0].date : today;
  const entry = (loc, lastmod, freq, priority) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  const urls = [
    entry(`${SITE}/`, today, 'monthly', '1.0'),
    entry(`${SITE}/insights/`, latest, 'weekly', '0.8'),
    ...posts.map((p) => entry(p.url, p.date, 'yearly', '0.7')),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

/* ---------- build ---------- */

function build() {
  const today = new Date().toISOString().slice(0, 10);
  const year = today.slice(0, 4);
  const warnings = [];

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const posts = loadPosts();
  const browser = findBrowser();
  const ogTemplate = readTemplate('og.html');

  // Default preview image (homepage, insights index, posts without their own).
  ensureOgImage('default', 'Clarity in numbers. Integrity in practice.', 'Chartered Accountants · Jaipur', browser, ogTemplate, warnings);
  const defaultOg = `${SITE}/assets/og/default.png`;

  const header = readTemplate('header.html');
  const footer = render(readTemplate('footer.html'), { year });

  // Posts.
  const postTemplate = readTemplate('post.html');
  for (const post of posts) {
    const hasOwnImage = ensureOgImage(post.slug, post.title, 'Insights', browser, ogTemplate, warnings);
    const ogImage = hasOwnImage ? `${SITE}/assets/og/${post.slug}.png` : defaultOg;
    const html = render(postTemplate, {
      title: post.title,
      description: post.description,
      url: post.url,
      ogImage,
      dateIso: post.date,
      dateHuman: formatDate(post.date),
      minutes: post.minutes,
      author: post.author,
      tagsHtml: tagsHtml(post),
      shareBar: shareBarHtml(post),
      body: post.html,
      more: moreHtml(post, posts),
      jsonld: postJsonLd(post, ogImage),
      header,
      footer,
    });
    const dir = path.join(DIST, 'insights', post.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }

  // Insights index.
  const cards = posts.length
    ? posts.map(cardHtml).join('\n')
    : '          <p class="insights-empty">Articles are on their way. Please check back soon.</p>';
  fs.mkdirSync(path.join(DIST, 'insights'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'insights', 'index.html'), render(readTemplate('insights.html'), {
    url: `${SITE}/insights/`, ogImage: defaultOg, cards, header, footer,
  }));

  // Static files and directories (assets/ includes the generated OG images).
  for (const dir of STATIC_DIRS) fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true });
  for (const file of STATIC_FILES) {
    if (file === 'index.html') continue;
    fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file));
  }

  // Homepage: inject the latest posts between the build markers.
  const markerStart = '<!-- build:latest-insights -->';
  const markerEnd = '<!-- /build:latest-insights -->';
  let home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const start = home.indexOf(markerStart);
  const end = home.indexOf(markerEnd);
  if (start === -1 || end === -1 || end < start) throw new Error('index.html: latest-insights build markers missing');
  const latest = posts.length
    ? render(readTemplate('home-insights.html'), { cards: posts.slice(0, 3).map(cardHtml).join('\n') })
    : '';
  home = home.slice(0, start) + latest + home.slice(end + markerEnd.length);
  fs.writeFileSync(path.join(DIST, 'index.html'), home);

  // Feeds.
  fs.writeFileSync(path.join(DIST, 'feed.xml'), feedXml(posts));
  const sitemap = sitemapXml(posts, today);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

  console.log(`Built ${posts.length} post(s) into ${path.relative(ROOT, DIST)}/`);
  for (const p of posts) console.log(`  ${p.date}  ${p.path}`);
  for (const w of warnings) console.warn(`Warning: ${w}`);
}

build();
