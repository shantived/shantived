#!/bin/sh
# Build and deploy the site to Cloudflare Pages (project: shantived).
# build.js assembles dist/ with public files only; internal notes, git data,
# sources (posts/, templates/) and this script are never uploaded.
set -eu
cd "$(dirname "$0")"

[ -d node_modules ] || npm install
npm run build
npx -y wrangler pages deploy dist --project-name shantived --branch main --commit-dirty=true
