/**
 * Controls rail: privacy zone, metadata stripping, coordinate fuzzing, trim,
 * simplify and merge. The DOM is built once; `update()` only syncs values and
 * live counts so interactive controls (sliders) never lose focus mid-drag.
 */
import { detectHomeZone } from '../../core/privacy';
import { combineDocs } from '../../core/merge';
import { boundsOf, decimalsToMeters } from '../../core/geo';
import { icon } from '../icons';
import { fmtBytes, fmtInt } from '../format';
import type { Store } from '../state';

function section(id: string, iconName: string, title: string, body: string): string {
  return `<section class="card p-4 space-y-3" data-ref="sec-${id}">
    <header class="flex items-center gap-2 text-fg">
      <span class="text-accent">${icon(iconName, 'size-4')}</span>
      <h2 class="text-sm font-semibold">${title}</h2>
    </header>
    ${body}
  </section>`;
}

function toggle(ref: string, label: string): string {
  return `<label class="flex items-center gap-2.5 cursor-pointer select-none">
    <input type="checkbox" data-ref="${ref}" class="peer sr-only" />
    <span class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-surface-2 border border-border-soft transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
      <span class="inline-block size-3.5 translate-x-1 rounded-full bg-fg-muted transition-transform peer-checked:translate-x-[18px] peer-checked:bg-on-accent"></span>
    </span>
    <span class="text-sm text-fg">${label}</span>
  </label>`;
}

function stripRow(ref: string, label: string, desc: string): string {
  return `<div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      ${toggle(ref, label)}
      <p class="ml-[46px] mt-0.5 text-xs text-fg-muted">${desc}</p>
    </div>
    <span data-ref="${ref}-badge" class="data shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium"></span>
  </div>`;
}

export class ControlsPanel {
  readonly root: HTMLElement;
  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.root = document.createElement('div');
    this.root.className = 'space-y-4';
    this.root.innerHTML = this.template();
    this.wire();
  }

  private template(): string {
    return [
      // Privacy zone
      section(
        'zone',
        'shield-check',
        'Privacy zone',
        `<p class="text-xs text-fg-muted">Hide your home: cut the points around a chosen centre. Auto-detected from where your tracks start and end.</p>
         ${toggle('zone-on', 'Enable privacy zone')}
         <div data-ref="zone-body" class="space-y-3 hidden">
           <div class="flex gap-2">
             <button data-ref="zone-auto" class="btn-ghost flex-1 text-xs">${icon('crosshair', 'size-3.5')} Auto-detect home</button>
             <button data-ref="zone-pick" class="btn-ghost flex-1 text-xs">${icon('map-pin', 'size-3.5')} <span data-ref="zone-pick-label">Pick on map</span></button>
           </div>
           <div class="grid grid-cols-2 gap-2">
             <label class="space-y-1"><span class="label">Latitude</span><input data-ref="zone-lat" class="input" inputmode="decimal" /></label>
             <label class="space-y-1"><span class="label">Longitude</span><input data-ref="zone-lon" class="input" inputmode="decimal" /></label>
           </div>
           <label class="space-y-1 block">
             <span class="label flex justify-between"><span>Radius</span><span data-ref="zone-radius-val" class="text-fg-muted"></span></span>
             <input data-ref="zone-radius" type="range" min="50" max="1000" step="10" class="w-full accent-accent" />
           </label>
           <div role="radiogroup" class="grid grid-cols-2 gap-2 text-xs">
             <label class="flex items-center gap-2 cursor-pointer rounded-control border border-border-soft px-2.5 py-2"><input type="radio" name="zone-mode" data-ref="mode-crop" value="crop-ends" class="accent-accent" /> Crop ends</label>
             <label class="flex items-center gap-2 cursor-pointer rounded-control border border-border-soft px-2.5 py-2"><input type="radio" name="zone-mode" data-ref="mode-cut" value="cut-all" class="accent-accent" /> Cut all</label>
           </div>
           <p class="text-xs text-fg-muted"><span class="text-fg">Crop ends</span> trims only the start &amp; finish near home — best for most people. <span class="text-fg">Cut all</span> removes every point inside the zone, anywhere on the route.</p>
           <p data-ref="zone-count" class="data text-xs"></p>
         </div>`,
      ),
      // Strip
      section(
        'strip',
        'eye',
        'Remove personal data',
        `<div class="space-y-3">
           ${stripRow('strip-time', 'Timestamps', 'When you were there. Reveals your routine.')}
           ${stripRow('strip-ext', 'Sensor data', 'Heart rate, cadence, power, GPS accuracy.')}
           ${stripRow('strip-ele', 'Elevation', 'Per-point altitude readings.')}
           ${stripRow('strip-names', 'Names & notes', 'Track, waypoint and route names/comments.')}
           ${stripRow('strip-creator', 'Device & author', 'The recording device and author metadata.')}
         </div>`,
      ),
      // Fuzz
      section(
        'fuzz',
        'crosshair',
        'Coordinate precision',
        `<p class="text-xs text-fg-muted">Round coordinates to blur exact positions. Off keeps full precision.</p>
         ${toggle('fuzz-on', 'Reduce precision')}
         <label data-ref="fuzz-body" class="space-y-1 hidden block">
           <span class="label flex justify-between"><span>Decimal places</span><span data-ref="fuzz-res" class="text-fg-muted"></span></span>
           <input data-ref="fuzz-dec" type="range" min="2" max="6" step="1" class="w-full accent-accent" />
         </label>`,
      ),
      // Trim
      section(
        'trim',
        'scissors',
        'Trim',
        `<p class="text-xs text-fg-muted">Drop points from the start and end of the track.</p>
         ${toggle('trim-on', 'Trim range')}
         <div data-ref="trim-body" class="space-y-2 hidden">
           <label class="space-y-1 block"><span class="label">Start point</span><input data-ref="trim-start" type="range" min="0" step="1" class="w-full accent-accent" /></label>
           <label class="space-y-1 block"><span class="label">End point</span><input data-ref="trim-end" type="range" min="0" step="1" class="w-full accent-accent" /></label>
           <p data-ref="trim-count" class="data text-xs text-fg-muted"></p>
         </div>`,
      ),
      // Simplify
      section(
        'simplify',
        'minimize',
        'Simplify',
        `<p class="text-xs text-fg-muted">Reduce the number of points to shrink the file.</p>
         ${toggle('simp-on', 'Simplify geometry')}
         <div data-ref="simp-body" class="space-y-1 hidden">
           <label class="space-y-1 block">
             <span class="label flex justify-between"><span>Tolerance</span><span data-ref="simp-tol" class="text-fg-muted"></span></span>
             <input data-ref="simp-range" type="range" min="1" max="50" step="1" class="w-full accent-accent" />
           </label>
           <p data-ref="simp-count" class="data text-xs"></p>
         </div>`,
      ),
      // Merge
      `<section data-ref="sec-merge" class="card p-4 space-y-2 hidden">
         <header class="flex items-center gap-2 text-fg"><span class="text-accent">${icon('merge', 'size-4')}</span><h2 class="text-sm font-semibold">Merge</h2></header>
         <p class="text-xs text-fg-muted">Combine all loaded tracks into one.</p>
         ${toggle('merge-on', 'Merge into one track')}
       </section>`,
    ].join('');
  }

  private ref<T extends HTMLElement = HTMLElement>(name: string): T {
    return this.root.querySelector(`[data-ref="${name}"]`) as T;
  }

  private wire(): void {
    const s = this.store;

    // Privacy zone enable
    this.ref<HTMLInputElement>('zone-on').addEventListener('change', (e) => {
      const on = (e.target as HTMLInputElement).checked;
      if (on) {
        const source = combineDocs(s.docs);
        const zone =
          detectHomeZone(source) ??
          (() => {
            const b = boundsOf(source.tracks.flatMap((t) => t.segments.flatMap((g) => g.points)));
            return b
              ? { lat: (b.minLat + b.maxLat) / 2, lon: (b.minLon + b.maxLon) / 2, radiusM: 200 }
              : { lat: 0, lon: 0, radiusM: 200 };
          })();
        s.patchConfig({ privacyZone: zone });
      } else {
        s.setZonePickMode(false);
        s.patchConfig({ privacyZone: null });
      }
    });

    this.ref('zone-auto').addEventListener('click', () => {
      const zone = detectHomeZone(combineDocs(s.docs));
      if (zone) s.patchConfig({ privacyZone: zone });
      else s.setError('Could not auto-detect a home location (your track does not loop back).');
    });

    this.ref('zone-pick').addEventListener('click', () => s.setZonePickMode(!s.zonePickMode));

    const patchZone = (patch: Partial<{ lat: number; lon: number; radiusM: number }>): void => {
      const z = s.config.privacyZone;
      if (!z) return;
      s.patchConfig({ privacyZone: { ...z, ...patch } });
    };
    this.ref<HTMLInputElement>('zone-lat').addEventListener('change', (e) => {
      const v = Number((e.target as HTMLInputElement).value);
      if (Number.isFinite(v)) patchZone({ lat: v });
    });
    this.ref<HTMLInputElement>('zone-lon').addEventListener('change', (e) => {
      const v = Number((e.target as HTMLInputElement).value);
      if (Number.isFinite(v)) patchZone({ lon: v });
    });
    this.ref<HTMLInputElement>('zone-radius').addEventListener('input', (e) =>
      patchZone({ radiusM: Number((e.target as HTMLInputElement).value) }),
    );
    this.ref<HTMLInputElement>('mode-crop').addEventListener('change', () =>
      s.patchConfig({ privacyMode: 'crop-ends' }),
    );
    this.ref<HTMLInputElement>('mode-cut').addEventListener('change', () =>
      s.patchConfig({ privacyMode: 'cut-all' }),
    );

    // Strip toggles
    const stripMap: Array<[string, keyof Store['config']['strip']]> = [
      ['strip-time', 'time'],
      ['strip-ext', 'extensions'],
      ['strip-ele', 'elevation'],
      ['strip-names', 'names'],
      ['strip-creator', 'creator'],
    ];
    for (const [ref, key] of stripMap) {
      this.ref<HTMLInputElement>(ref).addEventListener('change', (e) =>
        s.patchStrip({ [key]: (e.target as HTMLInputElement).checked }),
      );
    }

    // Fuzz
    this.ref<HTMLInputElement>('fuzz-on').addEventListener('change', (e) =>
      s.patchConfig({ fuzzDecimals: (e.target as HTMLInputElement).checked ? 4 : null }),
    );
    this.ref<HTMLInputElement>('fuzz-dec').addEventListener('input', (e) =>
      s.patchConfig({ fuzzDecimals: Number((e.target as HTMLInputElement).value) }),
    );

    // Trim
    this.ref<HTMLInputElement>('trim-on').addEventListener('change', (e) => {
      const on = (e.target as HTMLInputElement).checked;
      s.patchConfig({ trimRange: on ? { start: 0, end: s.derived.trimMax } : null });
    });
    const onTrim = (): void => {
      const start = Number(this.ref<HTMLInputElement>('trim-start').value);
      const end = Number(this.ref<HTMLInputElement>('trim-end').value);
      s.patchConfig({ trimRange: { start: Math.min(start, end), end: Math.max(start, end) } });
    };
    this.ref('trim-start').addEventListener('input', onTrim);
    this.ref('trim-end').addEventListener('input', onTrim);

    // Simplify
    this.ref<HTMLInputElement>('simp-on').addEventListener('change', (e) =>
      s.patchConfig({ simplifyToleranceM: (e.target as HTMLInputElement).checked ? 5 : null }),
    );
    this.ref<HTMLInputElement>('simp-range').addEventListener('input', (e) =>
      s.patchConfig({ simplifyToleranceM: Number((e.target as HTMLInputElement).value) }),
    );

    // Merge
    this.ref<HTMLInputElement>('merge-on').addEventListener('change', (e) =>
      s.patchConfig({ merge: (e.target as HTMLInputElement).checked }),
    );
  }

  update(): void {
    const s = this.store;
    const c = s.config;
    const d = s.derived;
    const inv = d.inventory;

    // Zone
    const zoneOn = !!c.privacyZone;
    this.ref<HTMLInputElement>('zone-on').checked = zoneOn;
    this.ref('zone-body').classList.toggle('hidden', !zoneOn);
    if (c.privacyZone) {
      const latEl = this.ref<HTMLInputElement>('zone-lat');
      const lonEl = this.ref<HTMLInputElement>('zone-lon');
      if (document.activeElement !== latEl) latEl.value = c.privacyZone.lat.toFixed(6);
      if (document.activeElement !== lonEl) lonEl.value = c.privacyZone.lon.toFixed(6);
      this.ref<HTMLInputElement>('zone-radius').value = String(c.privacyZone.radiusM);
      this.ref('zone-radius-val').textContent = `${c.privacyZone.radiusM} m`;
      this.ref<HTMLInputElement>('mode-crop').checked = c.privacyMode === 'crop-ends';
      this.ref<HTMLInputElement>('mode-cut').checked = c.privacyMode === 'cut-all';
      const removed = d.transform.report.privacyZonePointsRemoved;
      const countEl = this.ref('zone-count');
      countEl.textContent = `${fmtInt(removed)} ${removed === 1 ? 'point' : 'points'} inside the zone will be removed.`;
      countEl.className = `data text-xs ${removed > 0 ? 'text-danger' : 'text-fg-muted'}`;
    }
    const pickLabel = this.ref('zone-pick-label');
    pickLabel.textContent = s.zonePickMode ? 'Click the map…' : 'Pick on map';
    const pickBtn = this.ref('zone-pick');
    pickBtn.classList.toggle('!border-accent', s.zonePickMode);
    pickBtn.setAttribute('aria-pressed', String(s.zonePickMode));

    // Strip toggles + inventory badges
    this.ref<HTMLInputElement>('strip-time').checked = c.strip.time;
    this.ref<HTMLInputElement>('strip-ext').checked = c.strip.extensions;
    this.ref<HTMLInputElement>('strip-ele').checked = c.strip.elevation;
    this.ref<HTMLInputElement>('strip-names').checked = c.strip.names;
    this.ref<HTMLInputElement>('strip-creator').checked = c.strip.creator;
    this.setBadge('strip-time-badge', inv.hasTime);
    this.setBadge('strip-ext-badge', inv.hasExtensions);
    this.setBadge('strip-ele-badge', inv.hasElevation);
    this.setBadge('strip-names-badge', inv.hasNames);
    this.setBadge('strip-creator-badge', inv.hasCreator);

    // Fuzz
    const fuzzOn = c.fuzzDecimals !== null;
    this.ref<HTMLInputElement>('fuzz-on').checked = fuzzOn;
    this.ref('fuzz-body').classList.toggle('hidden', !fuzzOn);
    if (fuzzOn) {
      this.ref<HTMLInputElement>('fuzz-dec').value = String(c.fuzzDecimals);
      const m = decimalsToMeters(c.fuzzDecimals!);
      this.ref('fuzz-res').textContent =
        `${c.fuzzDecimals} dp · ≈ ${m >= 1000 ? `${(m / 1000).toFixed(0)} km` : `${m.toFixed(m < 10 ? 1 : 0)} m`}`;
    }

    // Trim
    const trimOn = c.trimRange !== null;
    this.ref<HTMLInputElement>('trim-on').checked = trimOn;
    this.ref('trim-body').classList.toggle('hidden', !trimOn);
    const startEl = this.ref<HTMLInputElement>('trim-start');
    const endEl = this.ref<HTMLInputElement>('trim-end');
    startEl.max = String(d.trimMax);
    endEl.max = String(d.trimMax);
    if (c.trimRange) {
      if (document.activeElement !== startEl) startEl.value = String(c.trimRange.start);
      if (document.activeElement !== endEl) endEl.value = String(c.trimRange.end);
      const kept = c.trimRange.end - c.trimRange.start + 1;
      this.ref('trim-count').textContent =
        `Keeping points ${fmtInt(c.trimRange.start)}–${fmtInt(c.trimRange.end)} (${fmtInt(kept)} of ${fmtInt(d.trimMax + 1)}).`;
    }

    // Simplify
    const simpOn = c.simplifyToleranceM !== null && c.simplifyToleranceM > 0;
    this.ref<HTMLInputElement>('simp-on').checked = simpOn;
    this.ref('simp-body').classList.toggle('hidden', !simpOn);
    if (simpOn) {
      this.ref<HTMLInputElement>('simp-range').value = String(c.simplifyToleranceM);
      this.ref('simp-tol').textContent = `${c.simplifyToleranceM} m`;
      const before = d.sourceStats.total.pointCount;
      const after = d.resultStats.total.pointCount;
      const el = this.ref('simp-count');
      el.textContent = `${fmtInt(before)} → ${fmtInt(after)} pts · ~${fmtBytes(d.transform.report.bytesAfter)}`;
      el.className = 'data text-xs text-accent';
    }

    // Merge availability
    this.ref('sec-merge').classList.toggle('hidden', s.trackCount <= 1);
    this.ref<HTMLInputElement>('merge-on').checked = c.merge;
  }

  private setBadge(ref: string, present: boolean): void {
    const b = this.ref(ref);
    b.textContent = present ? 'present' : 'none';
    b.className = `data shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${
      present ? 'bg-warn/15 text-warn' : 'bg-surface-2 text-fg-muted'
    }`;
  }
}
