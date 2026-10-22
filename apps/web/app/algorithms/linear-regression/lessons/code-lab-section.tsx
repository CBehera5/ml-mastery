"use client";
import { useState, type ReactNode } from "react";
import { LivePythonCell, type CellPreset } from "../../../components/live-python/live-python-cell";
import type { PythonRuntime } from "../../../components/live-python/client";

export type BridgeRow = { math: string; code: string; note: string };
export type Reflection = { question: ReactNode; answer: ReactNode };
export type CodeLabConfig = {
  /** Unique, used for heading ids. */
  id: string;
  title: string;
  intro: ReactNode;
  bridgeCaption?: string;
  bridge: BridgeRow[];
  afterBridge?: ReactNode;
  cell: { title: string; starter: string; solution: string; checks: string; expose: string[]; presets?: CellPreset[]; renderResult?: (values: Record<string, unknown>) => ReactNode };
  reflectIntro?: ReactNode;
  reflections: Reflection[];
  footer?: ReactNode;
};

/**
 * The reusable lesson pattern: maths ↔ Python bridge, a runnable cell with hidden checks and quick
 * experiments, then "experiment, then explain" questions. Content lives in config, not markup.
 */
export function CodeLabSection({ config, runtime }: { config: CodeLabConfig; runtime?: PythonRuntime }) {
  const headingId = `${config.id}-code-title`;
  return (
    <section className="gradient-code" aria-labelledby={headingId}>
      <p className="eyebrow">Now you drive</p>
      <h2 id={headingId}>{config.title}</h2>
      {config.intro}
      <div className="table-scroll">
        <table className="gradient-bridge">
          <caption>{config.bridgeCaption ?? "Maths and Python, side by side"}</caption>
          <thead><tr><th scope="col">Maths</th><th scope="col">Python</th><th scope="col">In plain words</th></tr></thead>
          <tbody>{config.bridge.map((row) => <tr key={row.code}><td>{row.math}</td><td><code>{row.code}</code></td><td>{row.note}</td></tr>)}</tbody>
        </table>
      </div>
      {config.afterBridge}
      <LivePythonCell
        title={config.cell.title}
        starter={config.cell.starter}
        solution={config.cell.solution}
        checks={config.cell.checks}
        expose={config.cell.expose}
        presets={config.cell.presets}
        renderResult={config.cell.renderResult}
        runtime={runtime}
      />
      <div className="gradient-reflect">
        <h3>Experiment, then explain</h3>
        {config.reflectIntro ?? <p>Finish the TODOs, then try the quick experiments. Think about each question before opening its answer.</p>}
        {config.reflections.map((r, i) => <details key={i}><summary>{r.question}</summary><p>{r.answer}</p></details>)}
      </div>
      {config.footer && <p className="gradient-link">{config.footer}</p>}
    </section>
  );
}

export type PredictConfig = {
  id: string;
  eyebrow?: string;
  title: string;
  story: ReactNode;
  predictTitle: string;
  question: ReactNode;
  options: { id: string; label: string }[];
  correctId: string;
  /** Shown after Reveal, whatever was chosen. */
  explanation: ReactNode;
};

/** Story opener plus a commit-before-you-read prediction. Unscored: it never touches saved progress. */
export function PredictStory({ config }: { config: PredictConfig }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const right = choice === config.correctId;
  return (
    <section className="why-story gradient-story" aria-labelledby={`${config.id}-story-title`}>
      <div>
        <p className="eyebrow">{config.eyebrow ?? "The big idea"}</p>
        <h2 id={`${config.id}-story-title`}>{config.title}</h2>
        {config.story}
      </div>
      <div className="gradient-predict" role="group" aria-labelledby={`${config.id}-predict-title`}>
        <p className="eyebrow">Predict before you read on</p>
        <h3 id={`${config.id}-predict-title`}>{config.predictTitle}</h3>
        {config.question}
        <div className="gradient-choices">
          {config.options.map((o) => (
            <label key={o.id}><input type="radio" name={`${config.id}-predict`} value={o.id} checked={choice === o.id} onChange={() => { setChoice(o.id); setRevealed(false); }} /> {o.label}</label>
          ))}
        </div>
        <button type="button" className="button" disabled={choice === null} onClick={() => setRevealed(true)}>Reveal</button>
        <div role="status" aria-live="polite">
          {revealed && <p className={right ? "guided-feedback success" : "guided-feedback failure"}>{right ? "Yes. " : "Not quite. "}{config.explanation}</p>}
        </div>
      </div>
    </section>
  );
}
