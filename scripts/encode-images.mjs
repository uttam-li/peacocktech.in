import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'industries');
const media = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'media');
const PNGS = ['diamond-ring-green.png', 'jewellery-necklace.png', 'erp-laptop.png', 'sme-buildings.png', 'diamond-tweezer.png'];

for (const f of PNGS) {
  const base = path.join(dir, f.replace(/\.png$/, ''));
  const png = base + '.png';
  if (!fs.existsSync(png)) continue;
  await sharp(png).webp({ quality: 72, effort: 6 }).toFile(base + '.webp');
  await sharp(png).avif({ quality: 38, effort: 6 }).toFile(base + '.avif');
  const q = (p) => fs.statSync(p).size;
  console.log(f, 'png', q(png), 'webp', q(base + '.webp'), 'avif', q(base + '.avif'));
}
for (const f of ['peacock-technotrics-loader-poster.webp', 'peacock-portrait-poster.webp']) {
  const p = path.join(media, f);
  const out = p.replace(/\.webp$/, '.avif');
  await sharp(p).avif({ quality: 38, effort: 6 }).toFile(out);
  console.log(f, 'webp', fs.statSync(p).size, 'avif', fs.statSync(out).size);
}
