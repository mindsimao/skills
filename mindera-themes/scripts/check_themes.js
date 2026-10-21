#!/usr/bin/env node
/**
 * Render a page in every Mindera theme, check token contrast and save a screenshot per theme.
 *
 *   node check_themes.js <page.html | http://localhost:5173/…> [--out <dir>] [--width 1280] [--height 800] [--wait 500]
 *
 * The page must load mindera-theme.js; the themes to check come from window.MinderaTheme.themes.
 * Exits 1 if a required pair is below 4.5:1 or the page throws. --mt-muted2 is reported
 * but only needs 3:1, because it is reserved for incidental text (footers, timestamps).
 *
 * Needs puppeteer. It is looked up from the current directory, then from one level of
 * subfolders (some repos keep it inside a sub-project). Install it with `npm i -D puppeteer`
 * if none is found. If asdf says "No version is set for command node", prefix the command
 * with ASDF_NODEJS_VERSION=<an installed version> (see `asdf list nodejs`).
 */
const path = require('path');
const fs = require('fs');
const { createRequire } = require('module');

function loadPuppeteer() {
  const cwd = process.cwd();
  const roots = [cwd, ...fs.readdirSync(cwd, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
    .map(d => path.join(cwd, d.name))];
  for (const root of roots) {
    try { return createRequire(path.join(root, 'noop.js'))('puppeteer'); } catch (e) {}
  }
  try { return require('puppeteer'); } catch (e) {}
  console.error('puppeteer not found. Install it in this project: npm i -D puppeteer');
  process.exit(2);
}

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const target = args.find((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--'));
if (!target) { console.error('usage: check_themes.js <page.html | url> [--out dir]'); process.exit(2); }
const url = /^[a-z]+:\/\//i.test(target) ? target : 'file://' + path.resolve(target);
const out = path.resolve(opt('out', path.join(require('os').tmpdir(), 'mindera-themes')));
fs.mkdirSync(out, { recursive: true });

const PAIRS = [
  ['text', '--mt-text', '--mt-surface', 4.5],
  ['muted', '--mt-muted', '--mt-surface', 4.5],
  ['accent-ink', '--mt-accent-ink', '--mt-bg', 4.5],
  ['accent-ink/card', '--mt-accent-ink', '--mt-surface', 4.5],
  ['on-accent', '--mt-on-accent', '--mt-accent', 4.5],
  ['danger', '--mt-danger', '--mt-surface', 4.5],
  ['success', '--mt-success', '--mt-surface', 4.5],
  ['warning', '--mt-warning', '--mt-surface', 4.5],
  ['info', '--mt-info', '--mt-surface', 4.5],
  ['muted2', '--mt-muted2', '--mt-bg', 3]
];

(async () => {
  const puppeteer = loadPuppeteer();
  const browser = await puppeteer.launch({ headless: 'new', args: ['--allow-file-access-from-files'] });
  const tab = await browser.newPage();
  const errors = [];
  tab.on('pageerror', e => errors.push(e.message));
  await tab.setViewport({ width: +opt('width', 1280), height: +opt('height', 800) });
  await tab.goto(url, { waitUntil: 'networkidle0' });

  const themes = await tab.evaluate(() => window.MinderaTheme && window.MinderaTheme.themes.map(t => t.id));
  if (!themes) {
    console.error('window.MinderaTheme not found: is mindera-theme.js loaded as a classic <script> in <head>?');
    await browser.close();
    process.exit(1);
  }

  let failed = false;
  for (const id of themes) {
    await tab.evaluate(t => window.MinderaTheme.set(t, { persist: false }), id);
    await new Promise(r => setTimeout(r, +opt('wait', 500))); // let colour transitions finish
    const ratios = await tab.evaluate(pairs => {
      const cs = getComputedStyle(document.documentElement);
      const hex = n => cs.getPropertyValue(n).trim();
      const ok = h => /^#[0-9a-f]{6}/i.test(h);
      const lum = h => {
        const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
          .map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      };
      return pairs.map(([label, fg, bg, min]) => {
        if (!ok(hex(fg)) || !ok(hex(bg))) return [label, null, min];
        const [a, b] = [lum(hex(fg)), lum(hex(bg))].sort((x, y) => y - x);
        return [label, +((a + 0.05) / (b + 0.05)).toFixed(1), min];
      });
    }, PAIRS);
    const low = ratios.filter(([, r, min]) => r !== null && r < min);
    if (low.some(([label]) => label !== 'muted2')) failed = true;
    console.log(id.padEnd(14), ratios.map(([l, r]) => `${l} ${r ?? 'n/a'}`).join('  '),
      low.length ? `  LOW: ${low.map(([l]) => l).join(', ')}` : '');
    await tab.screenshot({ path: path.join(out, `${id}.png`) });
  }

  console.log(`\nScreenshots: ${out}`);
  if (errors.length) { console.log('Page errors:', [...new Set(errors)]); failed = true; }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
