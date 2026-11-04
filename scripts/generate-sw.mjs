import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRECACHE_HTML } from './pages.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, '..', 'dist');
let rev = String(Date.now());
try {
  rev = execSync('git rev-parse --short HEAD', { cwd: path.join(root, '..') }).toString().trim() + '-' + Date.now();
} catch { /* no git: timestamp only */ }
const version = 'pt-' + rev;

const bundle = fs.readdirSync(path.join(dist, 'bundle'));
const pick = (re) => {
  const f = bundle.find((x) => re.test(x));
  if (!f) throw new Error('missing bundle asset for ' + re);
  return './bundle/' + f;
};
const precache = [
  ...PRECACHE_HTML,
  './offline.html',
  './favicon.svg',
  './og-cover.png',
  ...bundle.filter((f) => f.endsWith('.js')).map((f) => './bundle/' + f),
  ...bundle.filter((f) => f.endsWith('.css')).map((f) => './bundle/' + f),
  pick(/^bricolage-latin-.*\.woff2$/),
  pick(/^inter-latin-.*\.woff2$/),
  pick(/^peacock-logo-480-.*\.webp$/),
];

let tpl = fs.readFileSync(path.join(root, 'sw-template.js'), 'utf8');
tpl = tpl.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(precache));
fs.writeFileSync(path.join(dist, 'sw.js'), tpl);
console.log('sw', version, precache.length, 'entries');
