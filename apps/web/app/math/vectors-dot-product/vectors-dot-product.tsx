"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { dotProductTrace } from "@mlmath/runtime";
import { PublicNav } from "../../landing/public-nav";
import { LinearPath } from "../linear-algebra/journey";
import { useLessonProgress } from "../lesson-progress";
import { CoreLearning } from "../linear-algebra/core-learning";

const FEATURES = ["Normalized house size", "Bedrooms", "Location score"];
const INITIAL = { features: [2, 3, 4], weights: [5, 2, 3] };
const CODE = `import numpy as np

features = np.array([2, 3, 4])
weights = np.array([5, 2, 3])

prediction = np.dot(features, weights)
print(prediction)  # 28`;
const STAGES = ["Problem", "Explore", "Math", "NumPy", "Debug"];

export function VectorsDotProductLesson() {
  const [stage, setStage] = useState(0);
  const [inputError, setInputError] = useState("");
  const [features, setFeatures] = useState(INITIAL.features);
  const [weights, setWeights] = useState(INITIAL.weights);
  const { progress, setProgress, resetLessonProgress, storageError } = useLessonProgress("vectors-dot-product");
  const [selectedContribution, setSelectedContribution] = useState<number | null>(null);
  const [debugChoice, setDebugChoice] = useState<string | null>(null);
  const [debugResult, setDebugResult] = useState<"correct" | "incorrect" | null>(null);
  const trace = useMemo(() => dotProductTrace({ features, weights }), [features, weights]);
  const wrongTrace = useMemo(() => dotProductTrace({ features: [3, 2, 4], weights: INITIAL.weights }), []);
  const complete = progress.every(Boolean);
  const mark = (index: number) => setProgress((current) => current.map((value, item) => item === index ? true : value));
  const next = () => { if (progress[stage]) setStage((value) => Math.min(4, value + 1)); };
  const update = (kind: "feature" | "weight", index: number, value: string) => {
    const number = Number(value);
    if (!value.trim() || !Number.isFinite(number) || Math.abs(number) > 100) { setInputError("Use a finite value between −100 and 100. The previous valid value is retained."); return; }
    setInputError("");
    (kind === "feature" ? setFeatures : setWeights)((current) => current.map((item, itemIndex) => itemIndex === index ? number : item));
    mark(1);
  };
  const copyCode = async () => {
    mark(3);
    try { await navigator.clipboard?.writeText(CODE); } catch { /* The visible code remains selectable. */ }
  };
  const checkDebug = () => {
    const corrected = debugChoice === "reorder" ? dotProductTrace(INITIAL) : wrongTrace;
    const passes = corrected.value === dotProductTrace(INITIAL).value;
    setDebugResult(passes ? "correct" : "incorrect");
    if (passes) mark(4);
  };

  return <main className="math-lesson-page la-page">{storageError&&<p role="alert">Lesson progress is unavailable or unsupported. Existing data is preserved; changes stay in memory until you explicitly reset this lesson.</p>}<a className="la-skip" href="#linear-algebra-content">Skip to lesson content</a>
    <PublicNav active="Math"/><LinearPath current={0}/>
    <header className="math-lesson-hero"><div><p className="eyebrow">Math intuition pathway</p><h1>Vectors turn many features into <em>one prediction.</em></h1><p>Discover why machine learning represents a house as a vector—and how a dot product combines those values with learned importance.</p></div><div className="lesson-meta panel"><span>LESSON OUTCOME</span><strong>Explain, calculate, code, and debug a dot product.</strong><p>Ordered values and basic multiplication</p></div></header>

    <CoreLearning lesson="vectors" />
    <h2 id="existing-house-lab">Existing five-stage house lab</h2>
    <p>These five flags are historical completion only. Copying code does not add new understanding or mastery evidence.</p>
    {inputError && <p role="alert">{inputError}</p>}
    <nav className="math-stage-nav" aria-label="Lesson stages">{STAGES.map((label, index) => <button key={label} onClick={() => setStage(index)} className={`${stage === index ? "current" : ""} ${progress[index] ? "complete":""}`} aria-current={stage === index ? "step" : undefined}><b>{progress[index] ? "✓" : index + 1}</b><span>{label}</span></button>)}</nav>

    <section className="panel math-stage" aria-label="Existing five-stage house lab">
      {stage === 0 && <div className="stage-copy"><p className="eyebrow">01 · Real-world problem</p><h2>How can three different facts become one score?</h2><p>A prediction model cannot reason about “a nice house” directly. It needs an ordered list of numbers: size, bedrooms, and location. That list is a <strong>feature vector</strong>. A second vector says how influential each position is.</p><div className="vector-pair"><code>x = [2, 3, 4]</code><span>meets</span><code>w = [5, 2, 3]</code></div><button className="button primary stage-action" onClick={() => mark(0)}><span>I can identify the two vectors</span><span>→</span></button></div>}

      {stage === 1 && <div><div className="stage-copy compact"><p className="eyebrow">02 · Visual exploration</p><h2>Change one value. Watch its influence.</h2><p>Each feature only pairs with the weight in the same position. Edit any value to complete this stage.</p></div><div className="dot-playground"><div className="contribution-list">{FEATURES.map((label, index) => <article key={label} className={selectedContribution === index ? "selected" : ""}><button aria-label={`Inspect ${label} contribution`} onClick={() => setSelectedContribution(index)}><span>{label}</span><strong>{trace.input.features[index]} × {trace.input.weights[index]} = {trace.contributions[index]}</strong></button><div><label>Feature<input aria-label={`${label} feature`} type="number" value={features[index]} onChange={(event) => update("feature", index, event.target.value)} /></label><label>Weight<input aria-label={`${label} weight`} type="number" value={weights[index]} onChange={(event) => update("weight", index, event.target.value)} /></label></div><span className="contribution-bar" style={{ width: `${Math.min(100, Math.abs(trace.contributions[index]) * 5)}%` }} /></article>)}</div><div className="dot-total"><span>Weighted prediction score</span><strong data-testid="dot-product" role="status" aria-label="Weighted prediction score">{trace.value}</strong><code>{trace.contributions.join(" + ")} = {trace.value}</code><small>Illustrative score with fictional weights, not a trained house-price model.</small></div></div></div>}

      {stage === 2 && <div className="math-explanation"><div className="stage-copy compact"><p className="eyebrow">03 · Mathematical explanation</p><h2>The dot means “pair, multiply, then add.”</h2><p>Both vectors must have the same length because every feature needs exactly one matching weight.</p></div><div className="equation-board"><strong>x · w = Σ xᵢwᵢ</strong><code>[{features.join(", ")}] · [{weights.join(", ")}]</code><p>{trace.contributions.map((value, index) => <button key={index} onClick={() => { setSelectedContribution(index); mark(2); }} className={selectedContribution === index ? "selected" : ""}>{features[index]} × {weights[index]} = {value}</button>)}</p><span>Select a term to connect notation to its feature.</span></div></div>}

      {stage === 3 && <div className="code-stage"><div className="stage-copy compact"><p className="eyebrow">04 · NumPy implementation</p><h2>The equation becomes one explicit line of code.</h2><p><code>np.dot</code> performs the same pair–multiply–add operation you just explored.</p></div><pre><code>{CODE}</code></pre><div className="code-actions"><button className="button primary stage-action" onClick={copyCode}><span>Copy NumPy exercise</span><span>⌘C</span></button><a className="button secondary beta-link-button" href="/notebooks/vectors-dot-product.ipynb" download>Download Colab notebook</a></div></div>}

      {stage === 4 && <div className="debug-stage"><div className="stage-copy compact"><p className="eyebrow">05 · Debugging challenge</p><h2>The shapes match. Why is the score wrong?</h2><p>A data pipeline emitted <code>[bedrooms, size, location]</code>, but the weights still expect <code>[size, bedrooms, location]</code>.</p></div><div className="debug-compare"><div><span>Expected</span><code>[2, 3, 4] · [5, 2, 3]</code><strong>28</strong></div><div className="broken"><span>Pipeline output</span><code>[3, 2, 4] · [5, 2, 3]</code><strong>{wrongTrace.value}</strong></div></div><fieldset className="debug-options"><legend>Choose the safest fix</legend><label><input type="radio" name="debug-fix" onChange={() => { setDebugChoice("weights"); setDebugResult(null); }} /> Reorder the weights until this one row produces 28</label><label><input type="radio" name="debug-fix" onChange={() => { setDebugChoice("reorder"); setDebugResult(null); }} /> Restore the documented feature order before calculation</label></fieldset><button className="button train stage-action" disabled={!debugChoice} onClick={checkDebug}>Verify fix</button>{debugResult && <p role="status" className={`validation ${debugResult === "correct" ? "success" : "failure"}`}>{debugResult === "correct" ? "Fix verified: labels, values, and weights now describe the same positions, so the runtime returns 28." : "That can hide the pipeline defect and corrupt other rows. Restore the feature contract instead."}</p>}</div>}

      <div className="math-stage-footer"><button onClick={() => setStage((value) => Math.max(0, value - 1))} disabled={stage === 0}>Previous</button><button onClick={resetLessonProgress}>Reset this lesson</button><span>{progress.filter(Boolean).length} of 5 outcomes demonstrated</span><button className="next" onClick={next} disabled={!progress[stage] || stage === 4}>Next stage</button></div>
    </section>

    {complete && <section className="panel route-completion math-completion"><div><span>✓</span><div><p className="eyebrow">Lesson complete</p><h2>One vector, four representations.</h2><p>You connected a practical prediction problem to a visual trace, mathematical notation, NumPy code, and a feature-ordering bug.</p></div></div><Link className="button primary beta-link-button" href="/math/matrices-multiplication"><span>Next: Matrices & Multiplication</span><span>→</span></Link></section>}
  </main>;
}
