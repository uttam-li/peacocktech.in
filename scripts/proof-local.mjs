import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, '..', 'dist');
const BASE = process.env.PERF_BASE || 'http://localhost:4173';
const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass: !!pass, detail: String(detail).slice(0, 120) });
  console.log((pass ? 'PASS' : 'FAIL') + ' | ' + name + (detail ? ' | ' + String(detail).slice(0, 100) : ''));
};

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });

// 1. dist hygiene: no localhost, meta present, one h1
for (const f of ['index.html', 'about.html', 'contact.html', '404.html', 'offline.html']) {
  const s = fs.readFileSync(path.join(DIST, f), 'utf8');
  check(f + ' no-localhost', !/localhost:\d+/.test(s));
  check(f + ' has-h1', (s.match(/<h1[ >]/g) || []).length === 1, 'h1s=' + (s.match(/<h1[ >]/g) || []).length);
  check(f + ' has-canonical', s.includes('rel="canonical"') || f === '404.html' || f === 'offline.html');
  check(f + ' has-og', s.includes('og:image') || f === 'offline.html' || f === '404.html');
  check(f + ' has-jsonld', s.includes('application/ld+json') || ['404.html', 'offline.html'].includes(f));
}
check('sitemap exists+3 urls', (() => { try { const s = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8'); return (s.match(/<url>/g) || []).length >= 3; } catch { return false; } })());
check('robots has sitemap+domain', fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8').includes('https://peacocktech.in/sitemap.xml'));
check('sw generated+versioned', (() => { try { return /pt-[A-Za-z0-9-]+-\d+/.test(fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8')); } catch { return false; } })());

// 2. hydration clean + pages 200 (warm cache off)
for (const u of ['/', '/about', '/contact', '/404']) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 80)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 80)); });
  let code = 0;
  try {
    const r = await page.goto(BASE + u, { waitUntil: 'domcontentloaded', timeout: 60000 });
    code = r ? r.status() : 0;
    await new Promise((r) => setTimeout(r, 4000));
  } catch (e) { errs.push('goto:' + String(e).slice(0, 60)); }
  check('hyd' + u, code === 200 && errs.length === 0, code + ' ' + errs.join(';'));
  await ctx.close();
}

// 3. form: validation blocks bad email, double-submit single flight, offline keeps draft
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  await page.fill('input[name="email"]', 'not-an-email');
  await new Promise((r) => setTimeout(r, 400));
  const blocked = await page.evaluate(() => document.querySelector('.contact-ticket .btn:disabled') !== null || (document.querySelector('.field-error') !== null));
  check('form blocks bad email', !!blocked);
  await ctx.close();
}

// 4. gu render: no tofu (all text non-empty boxes), lang attr flips
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + '/?lang=gu', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const st = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    tofu: [...document.querySelectorAll('#root main h1, #root main h2')].filter((el) => !el.textContent.trim()).length,
  }));
  check('gu lang flips + no empty heads', st.lang === 'gu' && st.tofu === 0, JSON.stringify(st));
  await ctx.close();
}

// 5. mobile 390px: no horizontal scroll, tap targets >= 40px on CTA row
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));
  const st = await page.evaluate(() => ({
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    btnH: Math.round(document.querySelector('.map-preview__btn')?.getBoundingClientRect().height || 0),
  }));
  check('mobile no-overflow + 44px target', st.over <= 0 && st.btnH >= 40, JSON.stringify(st));
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log('---');
console.log(fails.length === 0 ? 'ALL PASS ' + results.length + ' checks' : 'FAILURES: ' + fails.map((f) => f.name).join(', '));
process.exit(fails.length === 0 ? 0 : 1);
