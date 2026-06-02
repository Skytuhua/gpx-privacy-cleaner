/**
 * Local file downloads via Blob URLs. No network — the browser saves the file
 * the app generated in memory.
 */
import { toCsv, toGeoJson, toGpx } from '../core/serialize';
import type { GpxDoc } from '../core/types';

export function downloadText(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after a tick so the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function baseName(doc: GpxDoc): string {
  const raw = doc.sourceName ?? doc.metadata.name ?? 'track';
  return raw.replace(/\.gpx$/i, '').replace(/[^a-z0-9-_]+/gi, '-') || 'track';
}

export function exportGpx(doc: GpxDoc): void {
  downloadText(`${baseName(doc)}-cleaned.gpx`, toGpx(doc), 'application/gpx+xml');
}
export function exportGeoJson(doc: GpxDoc): void {
  downloadText(`${baseName(doc)}-cleaned.geojson`, toGeoJson(doc), 'application/geo+json');
}
export function exportCsv(doc: GpxDoc): void {
  downloadText(`${baseName(doc)}-cleaned.csv`, toCsv(doc), 'text/csv');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
