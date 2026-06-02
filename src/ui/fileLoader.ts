/**
 * Reading and parsing dropped/picked files. All reading is local (FileReader);
 * nothing is uploaded. The bundled sample is inlined at build time (no fetch).
 */
import sampleGpx from '../data/sample.gpx?raw';
import { parseGpx } from '../core/parse';
import type { LoadedFile } from './state';

export interface LoadOutcome {
  loaded: LoadedFile[];
  errors: string[];
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.readAsText(file);
  });
}

const MAX_BYTES = 60 * 1024 * 1024; // 60 MB guard

export async function loadFiles(files: FileList | File[]): Promise<LoadOutcome> {
  const list = Array.from(files);
  const loaded: LoadedFile[] = [];
  const errors: string[] = [];

  for (const file of list) {
    if (file.size > MAX_BYTES) {
      errors.push(`${file.name}: file is too large (${(file.size / 1024 / 1024).toFixed(0)} MB).`);
      continue;
    }
    const lower = file.name.toLowerCase();
    if (!lower.endsWith('.gpx') && file.type !== 'application/gpx+xml') {
      // Still try to parse — some exports omit the extension — but warn.
      errors.push(`${file.name}: not a .gpx file; attempting to parse anyway.`);
    }
    try {
      const text = await readAsText(file);
      const res = parseGpx(text, file.name);
      if (res.ok) loaded.push({ name: file.name, doc: res.doc });
      else errors.push(`${file.name}: ${res.error}`);
    } catch (e) {
      errors.push(`${file.name}: ${(e as Error).message}`);
    }
  }
  // Remove the soft "attempting to parse" warnings if the file actually loaded.
  const okNames = new Set(loaded.map((l) => l.name));
  return { loaded, errors: errors.filter((e) => !okNames.has(e.split(':')[0]!)) };
}

export function loadText(text: string, name = 'pasted.gpx'): LoadOutcome {
  const res = parseGpx(text, name);
  if (res.ok) return { loaded: [{ name, doc: res.doc }], errors: [] };
  return { loaded: [], errors: [`${name}: ${res.error}`] };
}

export function loadSample(): LoadOutcome {
  return loadText(sampleGpx, 'sample-morning-loop.gpx');
}
