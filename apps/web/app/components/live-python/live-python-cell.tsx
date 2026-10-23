"use client";
import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import type { CheckResult, RunRequest, RunResult } from "./engine";
import { sharedPythonRuntime, type PythonRuntime } from "./client";
import styles from "./live-python.module.css";

export type CellPreset = { label: string; description?: string; apply: (code: string) => string };

type Props = {
  title: string;
  starter: string;
  /** Names read back from the learner's namespace after a run. */
  expose?: string[];
  /** Hidden Python checks; must define `results = [{name, passed, hint}]`. */
  checks?: string;
  /** Revealed on request, after the learner has had a chance to try. */
  solution?: string;
  presets?: CellPreset[];
  /** Renders a visual from the values read back after a run. */
  renderResult?: (values: Record<string, unknown>) => ReactNode;
  onRun?: (result: RunResult) => void;
  onAllChecksPassed?: () => void;
  /** Injected in tests. Defaults to the Pyodide worker runtime. */
  runtime?: PythonRuntime;
  rows?: number;
};

type Status = { kind: "idle" } | { kind: "running"; label: string } | { kind: "error"; message: string };

export function LivePythonCell({ title, starter, expose, checks, solution, presets, renderResult, onRun, onAllChecksPassed, runtime, rows }: Props) {
  const [code, setCode] = useState(starter);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [result, setResult] = useState<RunResult | null>(null);
  const [checked, setChecked] = useState<CheckResult[] | null>(null);
  const [everRan, setEverRan] = useState(false);
  const editorId = useId();
  const latest = useRef(0);
  const busy = status.kind === "running";

  const execute = useCallback(async (source: string, withChecks: boolean) => {
    const ticket = ++latest.current;
    setStatus({ kind: "running", label: everRan ? (withChecks ? "Checking your code…" : "Running…") : "Starting Python — the first run loads the runtime (and NumPy, pandas or scikit-learn if you import them), then it is cached…" });
    const request: RunRequest = { code: source, expose, checks: withChecks ? checks : undefined };
    try {
      const out = await (runtime ?? sharedPythonRuntime()).run(request);
      if (ticket !== latest.current) return;
      setResult(out);
      setChecked(withChecks ? out.checks : null);
      setStatus({ kind: "idle" });
      setEverRan(true);
      onRun?.(out);
      if (withChecks && out.checks && out.checks.length > 0 && out.checks.every((c) => c.passed)) onAllChecksPassed?.();
    } catch (error) {
      if (ticket !== latest.current) return;
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Python could not run." });
    }
  }, [checks, everRan, expose, onAllChecksPassed, onRun, runtime]);

  const run = () => { if (!busy) void execute(code, false); };
  const check = () => { if (!busy && checks) void execute(code, true); };
  const preset = (p: CellPreset) => { if (busy) return; const next = p.apply(code); setCode(next); void execute(next, false); };

  const passedCount = checked?.filter((c) => c.passed).length ?? 0;
  const allPassed = checked !== null && checked.length > 0 && passedCount === checked.length;

  return (
    <section className={styles.cell} aria-labelledby={`${editorId}-title`}>
      <header className={styles.head}>
        <p className={styles.badge}>Live Python</p>
        <h3 id={`${editorId}-title`}>{title}</h3>
        <p className={styles.note}>Runs in your browser on your device. Nothing you type is sent anywhere, and nothing here changes your saved progress.</p>
      </header>

      {presets && presets.length > 0 && (
        <div className={styles.presets} role="group" aria-label="Quick experiments">
          <span>Quick experiments:</span>
          {presets.map((p) => (
            <button key={p.label} type="button" className={styles.chip} onClick={() => preset(p)} disabled={busy} title={p.description}>{p.label}</button>
          ))}
        </div>
      )}

      <label htmlFor={editorId} className={styles.editorLabel}>Python code (editable)</label>
      <textarea
        id={editorId}
        className={styles.editor}
        value={code}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={rows ?? Math.min(40, code.split("\n").length + 2)}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); run(); } }}
        aria-describedby={`${editorId}-hint`}
      />
      <p id={`${editorId}-hint`} className={styles.hint}>Press Ctrl+Enter (⌘+Enter on Mac) to run. Tab moves focus to the next control, as usual; use spaces to indent.</p>

      <div className={styles.actions}>
        <button type="button" className="button" onClick={run} disabled={busy}>▶ Run code</button>
        {checks && <button type="button" className={`button ${styles.secondary}`} onClick={check} disabled={busy}>✓ Check my code</button>}
        <button type="button" className={styles.link} onClick={() => { setCode(starter); setResult(null); setChecked(null); }} disabled={busy}>Reset to starter</button>
      </div>

      <div role="status" aria-live="polite" className={styles.status}>
        {status.kind === "running" && <p className={styles.running}>{status.label}</p>}
        {status.kind === "error" && <p className={styles.fail}>{status.message}</p>}
        {status.kind === "idle" && result?.error && <p className={styles.fail}><strong>Python stopped with an error.</strong> {result.error}</p>}
        {status.kind === "idle" && result && !result.error && !checked && <p className={styles.ok}>Ran without errors.</p>}
        {status.kind === "idle" && allPassed && <p className={styles.ok}><strong>All {checked!.length} checks passed.</strong> That is your code, running the real algorithm.</p>}
      </div>

      {result && (result.stdout || !result.error) && (
        <div className={styles.output}>
          <h4>Output</h4>
          <pre aria-label="Program output" tabIndex={0}>{result.stdout || "(nothing printed)"}</pre>
        </div>
      )}

      {result && !result.error && renderResult && <div className={styles.visual}>{renderResult(result.values)}</div>}

      {checked && checked.length > 0 && (
        <ul className={styles.checks} aria-label="Check results">
          {checked.map((c) => (
            <li key={c.name} className={c.passed ? styles.pass : styles.nope}>
              <span aria-hidden="true">{c.passed ? "✓" : "✗"}</span>
              <div><strong>{c.name}</strong><span className={styles.srOnly}>{c.passed ? " — passed" : " — not yet"}</span>{!c.passed && c.hint && <p>{c.hint}</p>}</div>
            </li>
          ))}
        </ul>
      )}

      {solution && (
        <details className={styles.solution}>
          <summary>Stuck? Show a worked solution (try first!)</summary>
          <pre tabIndex={0}>{solution}</pre>
          <button type="button" className={styles.link} onClick={() => setCode(solution)}>Copy solution into the editor</button>
        </details>
      )}
    </section>
  );
}
