/**
 * App shell: header, empty state, three-column workspace, and the wiring that
 * connects the store to the panels and the canvas.
 */
import { icon } from './icons';
import { fmtInt } from './format';
import { Store } from './state';
import { loadFiles, loadSample, loadText } from './fileLoader';
import { TrackCanvas } from './canvas';
import { Dropzone } from './panels/dropzone';
import { ControlsPanel } from './panels/controls';
import { ReportPanel } from './panels/report';

export function mountApp(rootEl: HTMLElement): void {
  const store = new Store();

  rootEl.innerHTML = `
    <div class="min-h-[100dvh] flex flex-col">
      <header class="sticky top-0 z-20 border-b border-border-soft bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
        <div class="mx-auto max-w-[1500px] px-4 h-14 flex items-center gap-3">
          <div class="flex items-center gap-2 text-fg">
            <span class="text-accent">${icon('shield-check', 'size-6')}</span>
            <span class="font-semibold tracking-tight">GPX Privacy Cleaner</span>
          </div>
          <span class="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
            ${icon('wifi-off', 'size-3.5')} Offline · nothing uploaded
          </span>
          <div class="ml-auto flex items-center gap-2" data-ref="header-actions"></div>
        </div>
      </header>

      <div data-ref="error" class="hidden border-b border-danger/30 bg-danger/10">
        <div class="mx-auto max-w-[1500px] px-4 py-2.5 flex items-start gap-2 text-sm text-danger">
          <span class="mt-0.5 shrink-0">${icon('alert-triangle', 'size-4')}</span>
          <p data-ref="error-text" class="flex-1"></p>
          <button data-ref="error-close" class="shrink-0 text-danger/80 hover:text-danger" aria-label="Dismiss">${icon('x', 'size-4')}</button>
        </div>
      </div>

      <main class="flex-1">
        <div data-ref="empty"></div>
        <div data-ref="workspace" class="hidden mx-auto max-w-[1500px] px-4 py-4">
          <div data-ref="chips" class="mb-3 flex flex-wrap items-center gap-2"></div>
          <div class="grid gap-4 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_360px] lg:h-[calc(100dvh-128px)]">
            <aside class="order-2 lg:order-1 lg:overflow-y-auto lg:h-full pr-0.5" data-ref="controls-host"></aside>
            <section class="order-1 lg:order-2 relative h-[52vh] lg:h-full rounded-card border border-border-soft bg-surface overflow-hidden" data-ref="canvas-host">
              <div class="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
                <button data-ref="zoom-in" class="btn-ghost size-9 !p-0" aria-label="Zoom in">${icon('zoom-in', 'size-4')}</button>
                <button data-ref="zoom-out" class="btn-ghost size-9 !p-0" aria-label="Zoom out">${icon('zoom-out', 'size-4')}</button>
                <button data-ref="zoom-fit" class="btn-ghost size-9 !p-0" aria-label="Fit to view">${icon('crosshair', 'size-4')}</button>
              </div>
              <div data-ref="legend" class="absolute left-3 top-3 z-10 rounded-control bg-bg/80 border border-border-soft px-2.5 py-2 text-[11px] space-y-1 backdrop-blur"></div>
            </section>
            <aside class="order-3 lg:overflow-y-auto lg:h-full pr-0.5" data-ref="report-host"></aside>
          </div>
        </div>
      </main>

      <footer class="border-t border-border-soft">
        <div class="mx-auto max-w-[1500px] px-4 py-3 text-xs text-fg-muted flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Runs entirely in your browser. No data is uploaded.</span>
          <a href="https://github.com/Skytuhua/gpx-privacy-cleaner" class="text-accent hover:underline">Source &amp; docs</a>
        </div>
      </footer>
    </div>`;

  const ref = <T extends HTMLElement = HTMLElement>(name: string): T =>
    rootEl.querySelector(`[data-ref="${name}"]`) as T;

  // ---- File handling ----
  async function handleFiles(files: FileList | File[]): Promise<void> {
    const { loaded, errors } = await loadFiles(files);
    if (loaded.length) store.addFiles(loaded);
    if (errors.length) store.setError(errors.join(' '));
  }
  function handlePaste(text: string): void {
    const { loaded, errors } = loadText(text);
    if (loaded.length) store.addFiles(loaded);
    else store.setError(errors.join(' '));
  }
  function handleSample(): void {
    const { loaded } = loadSample();
    store.addFiles(loaded);
  }

  // ---- Components ----
  const dropzone = new Dropzone({
    onFiles: handleFiles,
    onSample: handleSample,
    onPaste: handlePaste,
  });
  ref('empty').appendChild(dropzone.root);

  const controls = new ControlsPanel(store);
  ref('controls-host').appendChild(controls.root);

  const report = new ReportPanel(store);
  ref('report-host').appendChild(report.root);

  const canvas = new TrackCanvas(ref('canvas-host'));
  canvas.onPickCenter = (lat, lon) => {
    const z = store.config.privacyZone;
    if (z) store.patchConfig({ privacyZone: { ...z, lat, lon } });
    store.setZonePickMode(false);
  };

  ref('zoom-in').addEventListener('click', () => canvas.zoomBy(1.3));
  ref('zoom-out').addEventListener('click', () => canvas.zoomBy(1 / 1.3));
  ref('zoom-fit').addEventListener('click', () => canvas.fitView());

  // Header actions
  ref('header-actions').innerHTML = `
    <input data-ref="hdr-file" type="file" accept=".gpx,application/gpx+xml" multiple class="hidden" />
    <button data-ref="hdr-add" class="btn-ghost text-xs hidden">${icon('upload', 'size-3.5')} <span class="hidden sm:inline">Add files</span></button>
    <button data-ref="hdr-reset" class="btn-ghost text-xs hidden">${icon('rotate-ccw', 'size-3.5')} <span class="hidden sm:inline">Reset</span></button>`;
  const hdrFile = ref<HTMLInputElement>('hdr-file');
  ref('hdr-add').addEventListener('click', () => hdrFile.click());
  hdrFile.addEventListener('change', () => {
    if (hdrFile.files?.length) void handleFiles(hdrFile.files);
    hdrFile.value = '';
  });
  ref('hdr-reset').addEventListener('click', () => store.reset());

  // Error banner
  ref('error-close').addEventListener('click', () => store.clearError());

  // Global drag & drop (when in workspace, dropping adds files).
  rootEl.addEventListener('dragover', (e) => {
    if (store.files.length) e.preventDefault();
  });
  rootEl.addEventListener('drop', (e) => {
    if (store.files.length && e.dataTransfer?.files?.length) {
      e.preventDefault();
      void handleFiles(e.dataTransfer.files);
    }
  });

  // ---- Render on state changes ----
  const legendHtml = `
    <div class="flex items-center gap-1.5 text-fg-muted"><span class="inline-block h-0.5 w-4" style="background:#38bdf8"></span> cleaned track</div>
    <div class="flex items-center gap-1.5 text-fg-muted"><span class="inline-block h-0.5 w-4" style="background:rgba(148,163,184,0.6)"></span> original</div>
    <div class="flex items-center gap-1.5 text-fg-muted"><span class="inline-block size-2 rounded-full" style="background:#22c55e"></span> start <span class="inline-block size-2 rounded-full ml-1" style="background:#f43f5e"></span> end</div>`;

  function render(): void {
    const inWorkspace = store.files.length > 0;
    ref('empty').classList.toggle('hidden', inWorkspace);
    ref('workspace').classList.toggle('hidden', !inWorkspace);
    ref('hdr-add').classList.toggle('hidden', !inWorkspace);
    ref('hdr-reset').classList.toggle('hidden', !inWorkspace);

    // Error banner
    const err = ref('error');
    if (store.errorMessage) {
      err.classList.remove('hidden');
      ref('error-text').textContent = store.errorMessage;
    } else {
      err.classList.add('hidden');
    }

    if (inWorkspace) {
      // File chips
      const total = store.derived.sourceStats.total.pointCount;
      ref('chips').innerHTML =
        store.files
          .map(
            (f, i) =>
              `<span class="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border-soft px-2.5 py-1 text-xs text-fg">${icon('file', 'size-3.5')}<span class="max-w-[180px] truncate">${escapeHtml(f.name)}</span><button data-remove="${i}" class="text-fg-muted hover:text-danger" aria-label="Remove ${escapeHtml(f.name)}">${icon('x', 'size-3.5')}</button></span>`,
          )
          .join('') +
        `<span class="text-xs text-fg-muted ml-1 data">${fmtInt(total)} points loaded</span>`;
      ref('chips')
        .querySelectorAll<HTMLButtonElement>('[data-remove]')
        .forEach((b) =>
          b.addEventListener('click', () => store.removeFile(Number(b.dataset.remove))),
        );

      ref('legend').innerHTML = legendHtml;

      // Canvas
      canvas.invalidateSize();
      const { source, result } = store.derived.transform;
      canvas.setData(source, result, store.config.privacyZone);
      canvas.setPickMode(store.zonePickMode);

      // Panels
      controls.update();
      report.update();
    }
  }

  store.subscribe(render);
  render();
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
