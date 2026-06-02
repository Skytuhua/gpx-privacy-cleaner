/**
 * Right rail: the privacy report (what will be removed), export actions, and
 * statistics of the cleaned output. Static buttons are wired once; the report
 * and stats bodies are refreshed on update.
 */
import { icon } from '../icons';
import {
  fmtBBox,
  fmtBytes,
  fmtDistance,
  fmtDuration,
  fmtElevation,
  fmtInt,
  fmtPace,
  fmtSpeed,
  fmtTime,
  pct,
  escapeHtml,
} from '../format';
import { copyText, exportCsv, exportGeoJson, exportGpx } from '../download';
import { toGpx } from '../../core/serialize';
import type { Store } from '../state';

export class ReportPanel {
  readonly root: HTMLElement;
  private store: Store;
  private copyTimer: number | undefined;

  constructor(store: Store) {
    this.store = store;
    this.root = document.createElement('div');
    this.root.className = 'space-y-4';
    this.root.innerHTML = `
      <section class="card p-4 space-y-3">
        <header class="flex items-center gap-2 text-fg">
          <span class="text-accent">${icon('shield-check', 'size-4')}</span>
          <h2 class="text-sm font-semibold">Privacy report</h2>
        </header>
        <div data-ref="report-body" class="space-y-3"></div>
      </section>

      <section class="card p-4 space-y-3">
        <header class="flex items-center gap-2 text-fg">
          <span class="text-accent">${icon('download', 'size-4')}</span>
          <h2 class="text-sm font-semibold">Export cleaned track</h2>
        </header>
        <div class="grid grid-cols-3 gap-2">
          <button data-ref="exp-gpx" class="btn-primary text-xs">${icon('download', 'size-3.5')} GPX</button>
          <button data-ref="exp-geojson" class="btn-ghost text-xs">GeoJSON</button>
          <button data-ref="exp-csv" class="btn-ghost text-xs">CSV</button>
        </div>
        <button data-ref="exp-copy" class="btn-ghost w-full text-xs">${icon('copy', 'size-3.5')} <span data-ref="copy-label">Copy GPX to clipboard</span></button>
      </section>

      <section class="card p-4 space-y-3">
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-fg"><span class="text-accent">${icon('activity', 'size-4')}</span><h2 class="text-sm font-semibold">Statistics</h2></div>
          <div class="inline-flex rounded-control border border-border-soft overflow-hidden text-xs">
            <button data-ref="unit-metric" class="px-2 py-1">km</button>
            <button data-ref="unit-imperial" class="px-2 py-1 border-l border-border-soft">mi</button>
          </div>
        </header>
        <div data-ref="stats-body"></div>
      </section>`;
    this.wire();
  }

  private ref<T extends HTMLElement = HTMLElement>(name: string): T {
    return this.root.querySelector(`[data-ref="${name}"]`) as T;
  }

  private wire(): void {
    const s = this.store;
    this.ref('exp-gpx').addEventListener('click', () => exportGpx(s.derived.transform.result));
    this.ref('exp-geojson').addEventListener('click', () =>
      exportGeoJson(s.derived.transform.result),
    );
    this.ref('exp-csv').addEventListener('click', () => exportCsv(s.derived.transform.result));
    this.ref('exp-copy').addEventListener('click', async () => {
      const ok = await copyText(toGpx(s.derived.transform.result));
      const label = this.ref('copy-label');
      label.textContent = ok ? 'Copied!' : 'Copy failed';
      window.clearTimeout(this.copyTimer);
      this.copyTimer = window.setTimeout(() => {
        label.textContent = 'Copy GPX to clipboard';
      }, 1800);
    });
    this.ref('unit-metric').addEventListener('click', () => s.setUnits('metric'));
    this.ref('unit-imperial').addEventListener('click', () => s.setUnits('imperial'));
  }

  // Defensive: escape both fields so a future caller passing GPX-derived text
  // can never introduce an injection here.
  private row(label: string, value: string, accent = false): string {
    return `<div class="flex items-baseline justify-between gap-3 py-1 border-b border-border-soft/60 last:border-0">
      <span class="text-xs text-fg-muted">${escapeHtml(label)}</span>
      <span class="data text-sm ${accent ? 'text-accent' : 'text-fg'}">${escapeHtml(value)}</span>
    </div>`;
  }

  update(): void {
    const s = this.store;
    const { report } = s.derived.transform;
    const units = s.units;

    // unit toggle styling
    this.ref('unit-metric').className =
      `px-2 py-1 ${units === 'metric' ? 'bg-accent text-on-accent' : 'text-fg-muted'}`;
    this.ref('unit-imperial').className =
      `px-2 py-1 border-l border-border-soft ${units === 'imperial' ? 'bg-accent text-on-accent' : 'text-fg-muted'}`;

    // ---- Privacy report ----
    const removedItems: Array<[boolean, string]> = [
      [
        report.privacyZoneApplied !== null && report.privacyZonePointsRemoved > 0,
        'Home/privacy zone cropped',
      ],
      [report.removedTimestamps, 'Timestamps removed'],
      [report.removedExtensions, 'Sensor data removed'],
      [report.removedElevation, 'Elevation removed'],
      [report.removedNames, 'Names & notes removed'],
      [report.removedCreator, 'Device & author removed'],
      [report.fuzzedTo !== null, `Coordinates rounded to ${report.fuzzedTo} dp`],
    ];
    const active = removedItems.filter(([on]) => on);
    const anyClean = active.length > 0;

    const banner = anyClean
      ? `<div class="flex items-center gap-2 rounded-control bg-accent/10 border border-accent/30 px-3 py-2 text-accent text-sm">${icon('shield-check', 'size-4')}<span>${active.length} privacy action(s) applied — ready to share.</span></div>`
      : `<div class="flex items-center gap-2 rounded-control bg-surface-2 border border-border-soft px-3 py-2 text-fg-muted text-sm">${icon('shield', 'size-4')}<span>No personal data removed yet. Turn on the controls at left.</span></div>`;

    const checklist = active
      .map(
        ([, label]) =>
          `<li class="flex items-center gap-2 text-sm text-fg"><span class="text-accent">${icon('check', 'size-3.5')}</span>${label}</li>`,
      )
      .join('');

    const sizeDelta =
      report.bytesBefore > 0
        ? `${fmtBytes(report.bytesBefore)} → ${fmtBytes(report.bytesAfter)} (${pct(report.bytesBefore, report.bytesAfter)} smaller)`
        : fmtBytes(report.bytesAfter);

    this.ref('report-body').innerHTML = `
      ${banner}
      ${anyClean ? `<ul class="space-y-1">${checklist}</ul>` : ''}
      <div class="pt-1">
        ${this.row('Points', `${fmtInt(report.pointsBefore)} → ${fmtInt(report.pointsAfter)}`, report.pointsRemoved > 0)}
        ${this.row('Removed', `${fmtInt(report.pointsRemoved)}`, report.pointsRemoved > 0)}
        ${this.row('File size', sizeDelta)}
        ${this.row('Bounds (after)', fmtBBox(report.bboxAfter))}
      </div>`;

    // ---- Stats (of the cleaned output) ----
    const t = s.derived.resultStats.total;
    this.ref('stats-body').innerHTML = `
      <p class="text-[11px] uppercase tracking-wide text-fg-muted mb-1">Cleaned output</p>
      ${this.row('Distance', fmtDistance(t.distanceM, units))}
      ${this.row('Duration', fmtDuration(t.durationS))}
      ${this.row('Moving time', fmtDuration(t.movingTimeS))}
      ${this.row('Elevation gain', t.maxEleM !== null ? fmtElevation(t.elevationGainM, units) : '—')}
      ${this.row('Elevation loss', t.maxEleM !== null ? fmtElevation(t.elevationLossM, units) : '—')}
      ${this.row('Min / max elev.', t.minEleM !== null && t.maxEleM !== null ? `${fmtElevation(t.minEleM, units)} / ${fmtElevation(t.maxEleM, units)}` : '—')}
      ${this.row('Avg / max speed', `${fmtSpeed(t.avgSpeedMps, units)} / ${fmtSpeed(t.maxSpeedMps, units)}`)}
      ${this.row('Avg pace', fmtPace(t.avgSpeedMps, units))}
      ${this.row('Points', fmtInt(t.pointCount))}
      ${this.row('Start', fmtTime(t.startTime))}
      ${this.row('End', fmtTime(t.endTime))}`;
  }
}
