import { defineConfig } from 'vite';

// Base path is configurable so the same build works locally (/) and on
// GitHub Pages (/gpx-privacy-cleaner/). Set BASE_PATH at build time.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: false,
    // Never inline fonts as data: URIs — they would violate the strict
    // `font-src 'self'` CSP. Fonts must be served as same-origin asset files.
    assetsInlineLimit: (filePath: string) => !/\.(woff2?|ttf|otf|eot)$/i.test(filePath),
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});
