#!/bin/sh
# Deploy the site to Cloudflare Pages (project: shantived).
# Only public files go into dist/ — internal notes (CLAUDE.md, README.md),
# git data, and this script itself must never be served.
set -eu
cd "$(dirname "$0")"

rm -rf dist
mkdir dist
cp index.html favicon.svg robots.txt sitemap.xml dist/
cp -R css js assets dist/

npx -y wrangler pages deploy dist --project-name shantived --branch main --commit-dirty=true
