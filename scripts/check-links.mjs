// Checks every link and media file in the built site (dist/).
// Internal links: the target file must exist in dist/ (and #anchors must exist on the page).
// External links: fetched with a GET; sites that block robots (LinkedIn answers 999) are listed, not failed.
// Usage: npm run build && npm run check-links          (add -- --offline to skip external links)
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve('dist');
const SITE = 'https://danion1.github.io';
const offline = process.argv.includes('--offline');
const BLOCKS_ROBOTS = ['linkedin.com'];

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });
}

function targetFile(urlPath) {
  const p = join(DIST, decodeURIComponent(urlPath));
  if (existsSync(p) && statSync(p).isFile()) return p;
  if (existsSync(join(p, 'index.html'))) return join(p, 'index.html');
  if (existsSync(p + '.html')) return p + '.html';
  return null;
}

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const errors = [];
const external = new Map(); // url -> pages that use it
let checked = 0;

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + file.slice(DIST.length + 1);
  for (const [, attr, raw] of html.matchAll(/\s(href|src|poster)="([^"]*)"/g)) {
    const url = raw.replaceAll('&amp;', '&');
    if (url.startsWith('mailto:') || url.startsWith('data:')) continue;
    checked++;
    if (/^https?:\/\//.test(url) && !url.startsWith(SITE)) {
      if (!external.has(url)) external.set(url, []);
      external.get(url).push(page);
      continue;
    }
    const abs = new URL(url, SITE + page.replace(/index\.html$/, ''));
    const target = targetFile(abs.pathname);
    if (!target) { errors.push(`${page}: ${attr}="${url}" -> not found`); continue; }
    if (abs.hash && target.endsWith('.html') && !ids(readFileSync(target, 'utf8')).has(abs.hash.slice(1))) {
      errors.push(`${page}: ${attr}="${url}" -> anchor ${abs.hash} not found`);
    }
  }
}

const warnings = [];
if (!offline) {
  for (const [url, pages] of external) {
    const host = new URL(url).hostname;
    try {
      const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'link-check' } });
      if (res.ok) continue;
      const msg = `${url} -> HTTP ${res.status} (on ${pages[0]})`;
      BLOCKS_ROBOTS.some((h) => host.endsWith(h)) ? warnings.push(msg + ', site blocks robots: check by hand') : errors.push(msg);
    } catch (e) {
      errors.push(`${url} -> ${e.cause?.code ?? e.name} (on ${pages[0]})`);
    }
  }
}

console.log(`${checked} links checked in ${htmlFiles(DIST).length} pages, ${external.size} distinct external${offline ? ' (skipped)' : ''}.`);
warnings.forEach((w) => console.log('WARN  ' + w));
errors.forEach((e) => console.log('ERROR ' + e));
console.log(errors.length ? `${errors.length} broken link(s).` : 'No broken links.');
process.exit(errors.length ? 1 : 0);
