import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { HTML_PAGES } from './pages.mjs';

const DIST = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const OUT = process.argv[2] || 'dist';
const PORT = Number(process.argv[3] || 4333);
const PAGES = HTML_PAGES;

function fileFor(url) {
  return url === '/' ? 'index.html' : url.slice(1);
}

async function main() {
  const server = spawn('bun', ['run', 'preview', '--port', String(PORT)], { cwd: DIST, stdio: 'pipe' });
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('preview timeout')), 15000);
    server.stdout.on('data', (d) => { if (String(d).includes(String(PORT))) { clearTimeout(t); res(); } });
    server.stderr.on('data', () => {});
  });

  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  try {
    for (const url of PAGES) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
      await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      if (url === '/') {
        await page.waitForFunction(() => !document.querySelector('.intro') && document.querySelector('[data-ready="true"]'), { timeout: 60000 });
      } else {
        await page.waitForFunction(
          () => document.querySelector('#root main') && document.querySelector('#root main').textContent.length > 200,
          { timeout: 60000 },
        );
      }
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => null);
      await new Promise((r) => setTimeout(r, 1200));
      const origin = new URL(page.url()).origin;
      const html = await page.evaluate((org) => {
        const root = document.getElementById('root');
        root.querySelectorAll('[data-in]').forEach((el) => el.removeAttribute('data-in'));
        root.querySelectorAll('[data-ready]').forEach((el) => el.removeAttribute('data-ready'));
        root.querySelectorAll('.is-in').forEach((el) => el.classList.remove('is-in'));
        root.querySelectorAll('.fc-right').forEach((el) => el.removeAttribute('style'));
        root.querySelectorAll('.pit .bub').forEach((el) => {
          el.setAttribute('style', `width:${el.dataset.s}px;height:${el.dataset.s}px;left:${el.dataset.fx}%;top:${el.dataset.fy}%;transform:translate(-50%,-50%)`)
        })
        root.querySelectorAll('.toast').forEach((el) => el.remove())
        root.querySelectorAll('#pit .bb').forEach((el) => el.remove())
        root.querySelectorAll('#dt').forEach((el) => { el.innerHTML = '' })
        root.querySelectorAll('#bgd').forEach((el) => { el.innerHTML = '' })
        root.querySelectorAll('#bn').forEach((el) => el.setAttribute('value', 'Peacock Technotrics'))
        root.querySelectorAll('#sel').forEach((el) => el.remove())
        root.querySelectorAll('#cur2').forEach((el) => el.removeAttribute('style'));
        root.querySelectorAll('.why__clock-time').forEach((el) => { el.textContent = '--:--'; });
        root.querySelectorAll('[data-dyn]').forEach((el) => { el.textContent = '-'; });
        root.querySelectorAll('.map').forEach((el) => { el.innerHTML = '<div class="map-preview flex flex-1 items-center justify-center min-h-[260px] p-6 text-center"><button type="button" class="map-preview__btn" disabled="">Load map</button></div>'; });
        const overlay = root.querySelector('.intro');
        if (overlay) overlay.remove();
        return root.innerHTML.split(org + '/').join('./');
      }, origin);
      if (errors.length) throw new Error('hydration errors on ' + url + ': ' + JSON.stringify(errors));
      const fp = path.join(DIST, OUT, fileFor(url));
      let s = fs.readFileSync(fp, 'utf8');
      s = s.replace(/<style>\.boot-fallback[\s\S]*?<\/style>\n?/, '');
      const withNoScript = /<div id="root">[\s\S]*?<\/div>\n  <\/div>\n  <noscript>[\s\S]*?<\/noscript>/;
      const bare = /<div id="root">[\s\S]*?<\/div>\n  <\/div>/;
      if (withNoScript.test(s)) s = s.replace(withNoScript, `<div id="root">${html}</div>`);
      else if (bare.test(s)) s = s.replace(bare, `<div id="root">${html}</div>`);
      else throw new Error('root boot block not found in ' + url);
      if (s.includes('boot-fallback')) throw new Error('boot markup still present in ' + url);
      fs.writeFileSync(fp, s);
      console.log('prerendered', url, html.length, 'chars');
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
