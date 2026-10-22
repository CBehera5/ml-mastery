// Test/Node harness around the same Python driver the browser worker uses.
// The browser path (lesson-worker.mjs) is plain JS so it can run as a module worker
// without bundling; both load lesson_driver.py, so behaviour cannot drift.

export type CheckResult = { name: string; passed: boolean; hint: string };
export type RunRequest = {
  /** Learner code. Runs in a fresh namespace on every call. */
  code: string;
  /** Names to read back from the namespace (must be JSON-serialisable). */
  expose?: string[];
  /** Hidden check code. It sees the learner namespace and must define `results`. */
  checks?: string;
};
export type RunResult = {
  stdout: string;
  /** Friendly error text, or null when the learner code ran. */
  error: string | null;
  values: Record<string, unknown>;
  checks: CheckResult[] | null;
};

type PyodideLike = {
  runPython(code: string): unknown;
  globals: { get(name: string): unknown };
};

export class PythonEngine {
  private ready = false;
  constructor(private readonly py: PyodideLike, private readonly driverSource: string) {}

  run(request: RunRequest): RunResult {
    if (!this.ready) { this.py.runPython(this.driverSource); this.ready = true; }
    const fn = this.py.globals.get("__lesson_run") as (code: string, expose: string[], checks: string | null) => string;
    return JSON.parse(fn(request.code, request.expose ?? [], request.checks ?? null)) as RunResult;
  }
}
