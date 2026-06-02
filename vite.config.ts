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
    // Inline nothing remotely; keep everything self-contained for the
    // zero-network privacy guarantee.
    assetsInlineLimit: 4096,
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});
