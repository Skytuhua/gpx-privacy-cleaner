/** Display formatting helpers. Pure; keep all unit logic here. */
import type { BBox } from '../core/types';

export type Units = 'metric' | 'imperial';

export function fmtDistance(m: number, units: Units): string {
  if (units === 'imperial') {
    const mi = m / 1609.344;
    return `${mi.toFixed(mi < 10 ? 2 : 1)} mi`;
  }
  const km = m / 1000;
  return `${km.toFixed(km < 10 ? 2 : 1)} km`;
}

export function fmtElevation(m: number, units: Units): string {
  if (units === 'imperial') return `${Math.round(m * 3.28084).toLocaleString()} ft`;
  return `${Math.round(m).toLocaleString()} m`;
}

export function fmtDuration(seconds: number | null): string {
  if (seconds === null) return '—';
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function fmtSpeed(mps: number | null, units: Units): string {
  if (mps === null) return '—';
  if (units === 'imperial') return `${(mps * 2.236936).toFixed(1)} mph`;
  return `${(mps * 3.6).toFixed(1)} km/h`;
}

export function fmtPace(mps: number | null, units: Units): string {
  if (mps === null || mps <= 0) return '—';
  // seconds per km or per mile
  const perUnit = units === 'imperial' ? 1609.344 / mps : 1000 / mps;
  const m = Math.floor(perUnit / 60);
  const s = Math.round(perUnit % 60);
  const label = units === 'imperial' ? '/mi' : '/km';
  return `${m}:${String(s).padStart(2, '0')} ${label}`;
}

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function fmtCoord(n: number, decimals = 5): string {
  return n.toFixed(decimals);
}

export function fmtBBox(b: BBox | null): string {
  if (!b) return '—';
  return `${b.minLat.toFixed(4)}, ${b.minLon.toFixed(4)} → ${b.maxLat.toFixed(4)}, ${b.maxLon.toFixed(4)}`;
}

export function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return iso;
  return new Date(ms).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString();
}

export function pct(before: number, after: number): string {
  if (before === 0) return '0%';
  return `${Math.round((1 - after / before) * 100)}%`;
}

/** Escape a string for safe interpolation into innerHTML. */
export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
