/**
 * Guard the zero-network guarantee: fail if the built bundle contains any
 * network primitive. Run after `vite build`. This catches bundler-generated
 * code (e.g. preload helpers) that source-level ESLint rules cannot see.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ASSETS = new URL('../dist/assets/', import.meta.url).pathname;
// Match real call/usage sites, tolerant of minification, but avoid matching
// substrings inside unrelated identifiers.
const FORBIDDEN = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bnavigator\s*\.\s*sendBeacon\b/,
  /\bnew\s+WebSocket\b/,
  /\bnew\s+EventSocket\b/,
  /\bnew\s+EventSource\b/,
  /\bimportScripts\s*\(/,
];

let failed = false;
const files = readdirSync(ASSETS).filter((f) => f.endsWith('.js'));
if (files.length === 0) {
  console.error('check-no-network: no JS assets found — did you run `npm run build`?');
  process.exit(2);
}

for (const f of files) {
  const src = readFileSync(join(ASSETS, f), 'utf8');
  for (const re of FORBIDDEN) {
    const m = src.match(re);
    if (m) {
      console.error(
        `check-no-network: FORBIDDEN network primitive ${re} found in dist/assets/${f}`,
      );
      const idx = src.indexOf(m[0]);
      console.error(
        '  context: …' + src.slice(Math.max(0, idx - 60), idx + 60).replace(/\n/g, ' ') + '…',
      );
      failed = true;
    }
  }
}

if (failed) {
  console.error('\nThe app must make ZERO network requests. Remove the primitive above.');
  process.exit(1);
}
console.log(`check-no-network: OK — no network primitives in ${files.length} bundle file(s).`);
