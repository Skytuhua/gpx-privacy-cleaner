/**
 * Empty-state dropzone: the first thing a user sees. Leads with the privacy
 * promise, makes loading a file obvious, offers the sample and a paste box, and
 * spells out exactly what the tool can remove — before any real file is touched.
 */
import { icon } from '../icons';

export interface DropzoneCallbacks {
  onFiles: (files: FileList | File[]) => void;
  onSample: () => void;
  onPaste: (text: string) => void;
}

export class Dropzone {
  readonly root: HTMLElement;

  constructor(private cb: DropzoneCallbacks) {
    this.root = document.createElement('div');
    this.root.className = 'mx-auto w-full max-w-3xl px-4 py-10 sm:py-16';
    this.root.innerHTML = `
      <div class="text-center space-y-3 mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-fg">Strip your home location from a GPS track</h2>
        <p class="text-fg-muted max-w-xl mx-auto">Drop a <code class="font-mono text-fg">.gpx</code> file from Strava, Garmin, Komoot or your phone. Everything happens in your browser — your route never leaves this page.</p>
        <details class="max-w-xl mx-auto text-sm text-fg-muted">
          <summary class="cursor-pointer text-accent hover:underline underline-offset-2 inline-flex items-center gap-1.5">${icon('help-circle', 'size-4')} Where do I get my .gpx file?</summary>
          <ul class="mt-2 text-left space-y-1 leading-relaxed">
            <li><span class="text-fg">Strava:</span> open the activity → <span class="text-fg">⋯</span> menu → <span class="text-fg">Export GPX</span>.</li>
            <li><span class="text-fg">Garmin Connect:</span> open the activity → gear icon → <span class="text-fg">Export to GPX</span>.</li>
            <li><span class="text-fg">Komoot:</span> open the tour → <span class="text-fg">⋯</span> → <span class="text-fg">Export GPX</span>.</li>
            <li><span class="text-fg">Phone apps:</span> look for a Share or Export option and choose <span class="text-fg">GPX</span>.</li>
          </ul>
        </details>
      </div>

      <div data-ref="drop" tabindex="0" role="button" aria-label="Drop a GPX file or click to choose one"
        class="group relative rounded-card border-2 border-dashed border-border hover:border-accent focus-visible:border-accent transition-colors bg-surface/60 cursor-pointer">
        <div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <span class="text-accent">${icon('upload', 'size-8')}</span>
          <p class="text-fg font-medium">Drop your <span class="font-mono">.gpx</span> file here</p>
          <p class="text-sm text-fg-muted">or <span class="text-accent underline underline-offset-2">browse files</span> · you can load several at once</p>
        </div>
      </div>

      <div class="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button data-ref="sample" class="btn-ghost text-sm">${icon('route', 'size-4')} Try it with a sample track</button>
        <button data-ref="paste-toggle" aria-expanded="false" aria-controls="paste-box" class="btn-ghost text-sm">${icon('copy', 'size-4')} Paste GPX text</button>
      </div>

      <div data-ref="paste-box" id="paste-box" class="mt-4 hidden">
        <textarea data-ref="paste-area" rows="6" placeholder="Paste the contents of a .gpx file here…"
          class="input font-mono text-xs w-full" aria-label="Paste GPX text"></textarea>
        <div class="mt-2 text-right">
          <button data-ref="paste-load" class="btn-primary text-sm">${icon('check', 'size-4')} Load pasted GPX</button>
        </div>
      </div>

      <div class="mt-10 grid sm:grid-cols-2 gap-3">
        <div class="card p-4 space-y-2">
          <div class="flex items-center gap-2 text-fg"><span class="text-accent">${icon('wifi-off', 'size-4')}</span><h3 class="text-sm font-semibold">100% offline</h3></div>
          <p class="text-sm text-fg-muted">No uploads, no servers, no accounts, no tracking. The map is drawn locally — this page makes zero network requests.</p>
        </div>
        <div class="card p-4 space-y-2">
          <div class="flex items-center gap-2 text-fg"><span class="text-accent">${icon('eye', 'size-4')}</span><h3 class="text-sm font-semibold">What it removes</h3></div>
          <p class="text-sm text-fg-muted">Home/start-end location, timestamps, heart-rate &amp; sensor data, elevation, device info and names — then exports a clean GPX, GeoJSON or CSV.</p>
        </div>
      </div>

      <input data-ref="file" type="file" accept=".gpx,application/gpx+xml" multiple class="hidden" />`;
    this.wire();
  }

  private ref<T extends HTMLElement = HTMLElement>(name: string): T {
    return this.root.querySelector(`[data-ref="${name}"]`) as T;
  }

  private wire(): void {
    const drop = this.ref('drop');
    const fileInput = this.ref<HTMLInputElement>('file');

    drop.addEventListener('click', () => fileInput.click());
    drop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length) this.cb.onFiles(fileInput.files);
      fileInput.value = '';
    });

    const setOver = (over: boolean): void => {
      drop.classList.toggle('!border-accent', over);
      drop.classList.toggle('bg-accent/5', over);
    };
    drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      setOver(true);
    });
    drop.addEventListener('dragleave', () => setOver(false));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      setOver(false);
      if (e.dataTransfer?.files?.length) this.cb.onFiles(e.dataTransfer.files);
    });

    this.ref('sample').addEventListener('click', () => this.cb.onSample());
    this.ref('paste-toggle').addEventListener('click', () => {
      const hidden = this.ref('paste-box').classList.toggle('hidden');
      this.ref('paste-toggle').setAttribute('aria-expanded', String(!hidden));
      if (!hidden) this.ref('paste-area').focus();
    });
    this.ref('paste-load').addEventListener('click', () => {
      const text = this.ref<HTMLTextAreaElement>('paste-area').value;
      if (text.trim()) this.cb.onPaste(text);
    });
  }
}
