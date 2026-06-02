/**
 * Central application store (no framework). Holds the loaded documents and the
 * declarative EditConfig, recomputes the derived transform result + stats on any
 * change, and notifies subscribers so panels and the canvas can update.
 */
import { combineDocs } from '../core/merge';
import { inventory } from '../core/privacy';
import { computeStats, type DocStats } from '../core/stats';
import { applyEdits, type TransformResult } from '../core/transform';
import { defaultEditConfig, type EditConfig, type GpxDoc } from '../core/types';
import type { Units } from './format';

export type Status = 'empty' | 'ready' | 'error';

export interface LoadedFile {
  name: string;
  doc: GpxDoc;
}

export interface Derived {
  transform: TransformResult;
  sourceStats: DocStats;
  resultStats: DocStats;
  trimMax: number; // number of track points in the combined source
  inventory: ReturnType<typeof inventory>;
}

type Listener = (store: Store) => void;

function trackPointCount(doc: GpxDoc): number {
  let n = 0;
  for (const t of doc.tracks) for (const s of t.segments) n += s.points.length;
  return n;
}

export class Store {
  files: LoadedFile[] = [];
  config: EditConfig = defaultEditConfig();
  units: Units = 'metric';
  status: Status = 'empty';
  errorMessage: string | null = null;
  /** When true, clicking the canvas sets the privacy-zone centre. */
  zonePickMode = false;

  private listeners = new Set<Listener>();
  private derivedCache: Derived | null = null;

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(): void {
    this.derivedCache = null;
    for (const fn of this.listeners) fn(this);
  }

  get docs(): GpxDoc[] {
    return this.files.map((f) => f.doc);
  }

  get derived(): Derived {
    if (this.derivedCache) return this.derivedCache;
    const source = combineDocs(this.docs);
    const transform = applyEdits(this.docs, this.config);
    const derived: Derived = {
      transform,
      sourceStats: computeStats(source),
      resultStats: computeStats(transform.result),
      trimMax: Math.max(0, trackPointCount(source) - 1),
      inventory: inventory(source),
    };
    this.derivedCache = derived;
    return derived;
  }

  /** Number of tracks across all loaded files (controls merge availability). */
  get trackCount(): number {
    return this.docs.reduce((n, d) => n + d.tracks.length, 0);
  }

  addFiles(loaded: LoadedFile[]): void {
    if (loaded.length === 0) return;
    this.files.push(...loaded);
    this.status = 'ready';
    this.errorMessage = null;
    // Reset config when the data set changes so stale indices don't apply.
    this.config = defaultEditConfig();
    this.zonePickMode = false;
    this.emit();
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    if (this.files.length === 0) {
      this.status = 'empty';
    }
    this.config = defaultEditConfig();
    this.emit();
  }

  reset(): void {
    this.files = [];
    this.config = defaultEditConfig();
    this.status = 'empty';
    this.errorMessage = null;
    this.zonePickMode = false;
    this.emit();
  }

  setError(message: string): void {
    this.errorMessage = message;
    if (this.files.length === 0) this.status = 'error';
    this.emit();
  }

  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = null;
      if (this.files.length === 0) this.status = 'empty';
      this.emit();
    }
  }

  patchConfig(patch: Partial<EditConfig>): void {
    this.config = { ...this.config, ...patch };
    this.emit();
  }

  patchStrip(patch: Partial<EditConfig['strip']>): void {
    this.config = { ...this.config, strip: { ...this.config.strip, ...patch } };
    this.emit();
  }

  setUnits(units: Units): void {
    this.units = units;
    this.emit();
  }

  setZonePickMode(on: boolean): void {
    this.zonePickMode = on;
    this.emit();
  }
}
