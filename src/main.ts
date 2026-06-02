import './styles/main.css';

// Phase 4 replaces this with the full app bootstrap. Kept minimal so the
// toolchain (build/dev/lint) has a real entry point during Phase 3.
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.textContent = 'GPX Privacy Cleaner';
}
