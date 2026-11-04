import { chromium } from 'playwright-core';

const BASE = process.env.PERF_BASE || 'http://localhost:4173';
const PAGES = ['/', '/about.html', '/contact.html'];
const PROFILES = {
  'fast-4g': { download: 9 * 1024 * 1024 / 8, upload: 3 * 1024 * 1024 / 8, latency: 40, cpu: 1 },
  'slow-4g': { download: 1.6 * 1024 * 1024 / 8, upload: 750 * 1024 / 8, latency: 150, cpu: 2 },
  'slow-3g': { download: 400 * 1024 / 8, upload: 400 * 1024 / 8, latency: 400, cpu: 4 },
};

async function measure(browser, url, prof) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: prof.download,
    uploadThroughput: prof.upload,
    latency: prof.latency,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: prof.cpu });
  await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  const fcp = await page.evaluate(() => new Promise((res) => {
    const t0 = performance.now();
    const check = () => {
      const p = performance.getEntriesByType('paint').find((x) => x.name === 'first-contentful-paint');
      if (p) { res(Math.round(p.startTime)); return; }
      if (performance.now() - t0 > 90000) { res(-1); return; }
      setTimeout(check, 200);
    };
    check();
  }));
  const t1 = Date.now();
  await page.waitForFunction(
    () => document.querySelector('[data-ready="true"]') || (document.querySelector('#root main') && document.querySelector('#root main').textContent.length > 200),
    { timeout: 120000 },
  ).catch(() => null);
  const res = await page.evaluate(() => {
    const r = performance.getEntriesByType('resource');
    return { n: r.length, kb: Math.round(r.reduce((a, x) => a + (x.transferSize || 0), 0) / 1024) };
  });
  await ctx.close();
  return { fcpMs: fcp, usableMs: Date.now() - t1 + 0, reqs: res.n, kb: res.kb, errors: errors.length };
}

const only = process.argv[2];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const rows = [];
for (const [name, prof] of Object.entries(PROFILES)) {
  if (only && only !== name) continue;
  for (const u of PAGES) {
    try {
      const r = await measure(browser, u, prof);
      rows.push({ profile: name, page: u, ...r });
      console.log(JSON.stringify(rows[rows.length - 1]));
    } catch (e) { console.log(JSON.stringify({ profile: name, page: u, fail: String(e).slice(0, 120) })); }
  }
}
await browser.close();
