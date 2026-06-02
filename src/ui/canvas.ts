/**
 * Local canvas renderer for GPS tracks. Projects lat/lon to a local metre frame
 * and draws the track itself — no map tiles, so nothing is ever requested from a
 * network. Supports pan/zoom and click-to-set the privacy-zone centre.
 *
 * Layers (bottom→top): source track (dimmed) · privacy ring · result track
 * (bright) · removed-in-zone points (red) · start/end + waypoint markers.
 */
import { boundsOf, mergeBounds, toLocalMeters } from '../core/geo';
import { inZone } from '../core/privacy';
import type { BBox, GeoPoint, GpxDoc, PrivacyZone } from '../core/types';

interface XY {
  x: number;
  y: number;
}

const COLORS = {
  source: 'rgba(148,163,184,0.35)',
  result: '#38bdf8',
  ring: '#f59e0b',
  ringFill: 'rgba(245,158,11,0.12)',
  removed: '#f43f5e',
  start: '#22c55e',
  end: '#f43f5e',
  waypoint: '#f59e0b',
  grid: 'rgba(148,163,184,0.08)',
};

function allSegmentsPoints(doc: GpxDoc): GeoPoint[][] {
  const runs: GeoPoint[][] = [];
  for (const t of doc.tracks) for (const s of t.segments) if (s.points.length) runs.push(s.points);
  for (const r of doc.routes) if (r.points.length) runs.push(r.points);
  return runs;
}

export class TrackCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr = Math.max(1, window.devicePixelRatio || 1);

  private source: GpxDoc | null = null;
  private result: GpxDoc | null = null;
  private zone: PrivacyZone | null = null;
  private pickMode = false;

  private originLat = 0;
  private baseScale = 1;
  private dataCenter: XY = { x: 0, y: 0 };
  private zoom = 1;
  private panX = 0;
  private panY = 0;

  private dragging = false;
  private moved = false;
  private lastX = 0;
  private lastY = 0;

  onPickCenter: ((lat: number, lon: number) => void) | null = null;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'block size-full touch-none';
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'Map preview of the GPS track (rendered locally)');
    container.appendChild(this.canvas);
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.ctx = ctx;

    const ro = new ResizeObserver(() => this.resize());
    ro.observe(container);

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointerleave', this.onPointerUp);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.resize();
  }

  private get cssW(): number {
    return this.canvas.clientWidth || 1;
  }
  private get cssH(): number {
    return this.canvas.clientHeight || 1;
  }

  private resize = (): void => {
    this.canvas.width = Math.round(this.cssW * this.dpr);
    this.canvas.height = Math.round(this.cssH * this.dpr);
    this.draw();
  };

  setData(source: GpxDoc | null, result: GpxDoc | null, zone: PrivacyZone | null): void {
    const isNew = source !== this.source;
    this.source = source;
    this.result = result;
    this.zone = zone;
    if (isNew && source) {
      this.computeProjection(source);
      this.fitView();
    }
    this.draw();
  }

  setPickMode(on: boolean): void {
    this.pickMode = on;
    this.canvas.style.cursor = on ? 'crosshair' : 'grab';
  }

  private computeProjection(doc: GpxDoc): void {
    let bbox: BBox | null = null;
    for (const run of allSegmentsPoints(doc)) bbox = mergeBounds(bbox, boundsOf(run));
    bbox = mergeBounds(bbox, boundsOf(doc.waypoints));
    if (!bbox) bbox = { minLat: 0, minLon: 0, maxLat: 0, maxLon: 0 };
    this.originLat = (bbox.minLat + bbox.maxLat) / 2;
    const a = toLocalMeters(bbox.minLat, bbox.minLon, this.originLat);
    const b = toLocalMeters(bbox.maxLat, bbox.maxLon, this.originLat);
    this.dataCenter = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const dataW = Math.max(1, Math.abs(b.x - a.x));
    const dataH = Math.max(1, Math.abs(b.y - a.y));
    const pad = 0.86;
    this.baseScale = Math.min((this.cssW * pad) / dataW, (this.cssH * pad) / dataH);
    if (!Number.isFinite(this.baseScale) || this.baseScale <= 0) this.baseScale = 1;
  }

  fitView(): void {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.draw();
  }

  /** Recompute backing-store size (call after the canvas becomes visible). */
  invalidateSize(): void {
    if (this.source) this.computeProjection(this.source);
    this.resize();
  }

  zoomBy(factor: number): void {
    this.zoom = Math.min(200, Math.max(0.2, this.zoom * factor));
    this.draw();
  }

  private scale(): number {
    return this.baseScale * this.zoom;
  }

  private project(p: GeoPoint): XY {
    const m = toLocalMeters(p.lat, p.lon, this.originLat);
    const s = this.scale();
    return {
      x: this.cssW / 2 + (m.x - this.dataCenter.x) * s + this.panX,
      y: this.cssH / 2 - (m.y - this.dataCenter.y) * s + this.panY,
    };
  }

  /** Inverse of project: screen px → lat/lon (for click-to-set-centre). */
  private unproject(sx: number, sy: number): { lat: number; lon: number } {
    const s = this.scale();
    const mx = (sx - this.cssW / 2 - this.panX) / s + this.dataCenter.x;
    const my = -(sy - this.cssH / 2 - this.panY) / s + this.dataCenter.y;
    const EARTH = 6_371_008.8;
    const DEG = Math.PI / 180;
    const lat = my / (DEG * EARTH);
    const lon = mx / (DEG * EARTH * Math.cos(this.originLat * DEG));
    return { lat, lon };
  }

  private onPointerDown = (e: PointerEvent): void => {
    this.dragging = true;
    this.moved = false;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.canvas.setPointerCapture(e.pointerId);
    if (!this.pickMode) this.canvas.style.cursor = 'grabbing';
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) this.moved = true;
    if (!this.pickMode) {
      this.panX += dx;
      this.panY += dy;
      this.draw();
    }
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.dragging && this.pickMode && !this.moved) {
      const rect = this.canvas.getBoundingClientRect();
      const { lat, lon } = this.unproject(e.clientX - rect.left, e.clientY - rect.top);
      this.onPickCenter?.(lat, lon);
    }
    this.dragging = false;
    if (!this.pickMode) this.canvas.style.cursor = 'grab';
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
  };

  private draw(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.cssW, this.cssH);

    // subtle background grid for spatial reference
    this.drawGrid();

    if (!this.source) {
      ctx.restore();
      return;
    }

    // source (dimmed) — shows what is being removed
    this.drawRuns(allSegmentsPoints(this.source), COLORS.source, 1.5);

    // privacy ring
    if (this.zone) this.drawZone(this.zone);

    // result (bright)
    if (this.result) this.drawRuns(allSegmentsPoints(this.result), COLORS.result, 2.5);

    // removed-in-zone points (red dots) on the source
    if (this.zone) this.drawRemovedPoints(this.source, this.zone);

    // markers
    if (this.result) this.drawEndpoints(this.result);
    this.drawWaypoints(this.source);

    this.drawScaleBar();
    ctx.restore();
  }

  private drawGrid(): void {
    const ctx = this.ctx;
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    const step = 40;
    ctx.beginPath();
    for (let x = 0; x < this.cssW; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.cssH);
    }
    for (let y = 0; y < this.cssH; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.cssW, y);
    }
    ctx.stroke();
  }

  private drawRuns(runs: GeoPoint[][], color: string, width: number): void {
    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (const run of runs) {
      ctx.beginPath();
      run.forEach((p, i) => {
        const s = this.project(p);
        if (i === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      });
      ctx.stroke();
    }
  }

  private drawZone(zone: PrivacyZone): void {
    const ctx = this.ctx;
    const c = this.project({ lat: zone.lat, lon: zone.lon });
    const r = zone.radiusM * this.scale();
    ctx.beginPath();
    ctx.arc(c.x, c.y, Math.max(2, r), 0, Math.PI * 2);
    ctx.fillStyle = COLORS.ringFill;
    ctx.fill();
    ctx.strokeStyle = COLORS.ring;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    // centre crosshair
    ctx.strokeStyle = COLORS.ring;
    ctx.beginPath();
    ctx.moveTo(c.x - 6, c.y);
    ctx.lineTo(c.x + 6, c.y);
    ctx.moveTo(c.x, c.y - 6);
    ctx.lineTo(c.x, c.y + 6);
    ctx.stroke();
  }

  private drawRemovedPoints(doc: GpxDoc, zone: PrivacyZone): void {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.removed;
    for (const run of allSegmentsPoints(doc)) {
      for (const p of run) {
        if (inZone(p, zone)) {
          const s = this.project(p);
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  private drawEndpoints(doc: GpxDoc): void {
    const runs = allSegmentsPoints(doc);
    if (runs.length === 0) return;
    const first = runs[0]![0]!;
    const lastRun = runs[runs.length - 1]!;
    const last = lastRun[lastRun.length - 1]!;
    this.marker(this.project(first), COLORS.start);
    this.marker(this.project(last), COLORS.end);
  }

  private drawWaypoints(doc: GpxDoc): void {
    for (const w of doc.waypoints) this.marker(this.project(w), COLORS.waypoint, 3.5);
  }

  private marker(s: XY, color: string, r = 5): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
  }

  private drawScaleBar(): void {
    const ctx = this.ctx;
    const s = this.scale(); // px per metre
    if (!Number.isFinite(s) || s <= 0) return;
    // pick a "nice" distance ~80px wide
    const targetPx = 80;
    const rawM = targetPx / s;
    const nice = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
    let dist = nice[nice.length - 1]!;
    for (const n of nice) {
      if (n >= rawM) {
        dist = n;
        break;
      }
    }
    const w = dist * s;
    const x = 16;
    const y = this.cssH - 18;
    ctx.strokeStyle = 'rgba(248,250,252,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x, y + 4);
    ctx.moveTo(x + w, y - 4);
    ctx.lineTo(x + w, y + 4);
    ctx.stroke();
    ctx.fillStyle = 'rgba(248,250,252,0.85)';
    ctx.font = '11px "JetBrains Mono", monospace';
    const label = dist >= 1000 ? `${dist / 1000} km` : `${dist} m`;
    ctx.fillText(label, x, y - 8);
  }
}
