// Module web worker that runs learner Python with Pyodide, off the main thread so an
// infinite loop can be terminated without freezing the page.
// Served as a plain static file next to the self-hosted Pyodide runtime (see
// scripts/sync-pyodide.mjs). It is deliberately NOT bundled: Pyodide's ESM build only
// runs in a real module worker.
import { loadPyodide } from "./pyodide.mjs";

let ready = null;
function boot() {
  ready ??= (async () => {
    const pyodide = await loadPyodide({ indexURL: new URL("./", import.meta.url).href });
    const source = await (await fetch(new URL("./lesson_driver.py", import.meta.url))).text();
    pyodide.runPython(source);
    return pyodide.globals.get("__lesson_run");
  })();
  return ready;
}

self.onmessage = async (event) => {
  const { id, request } = event.data;
  try {
    const run = await boot();
    self.postMessage({ type: "ready" });
    const raw = run(request.code, request.expose ?? [], request.checks ?? null);
    self.postMessage({ type: "result", id, result: JSON.parse(raw) });
  } catch (error) {
    ready = null;
    self.postMessage({ type: "fatal", id, message: error instanceof Error ? error.message : String(error) });
  }
};
