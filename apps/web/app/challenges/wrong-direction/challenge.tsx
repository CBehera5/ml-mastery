"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LinearNeuronInput } from "../../../../../packages/math-runtime/src";
import { BetaNav } from "../../components/beta-nav";
import { trackEvent } from "../../lib/analytics";
import {
  runChallengeUpdate,
  type ChallengeUpdateResult,
  type UpdateOperator,
} from "./challenge-adapter";

const REFERENCE: LinearNeuronInput = {
  inputs: [2, 3],
  weights: [1, 2],
  bias: 1,
  target: 12,
  learningRate: 0.01,
};

const HINTS = [
  "Compare each gradient's sign with the direction its parameter moves.",
  "A gradient points toward increasing loss. Descent must travel opposite that direction.",
  "Use parameter − learning rate × gradient, so a negative gradient makes the parameter increase.",
];

const format = (value: number) => Number(value.toFixed(6)).toString();
const signed = (value: number) => `${value >= 0 ? "+" : ""}${format(value)}`;

export function WrongDirectionChallenge() {
  const [broken, setBroken] = useState<ChallengeUpdateResult | null>(null);
  const [candidate, setCandidate] = useState<UpdateOperator | null>(null);
  const [checked, setChecked] = useState<ChallengeUpdateResult | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const completionTracked = useRef(false);

  const solved = Boolean(
    checked?.followsProductionUpdate && checked.lossChange < 0,
  );
  useEffect(() => {
    if (solved && !completionTracked.current) {
      completionTracked.current = true;
      trackEvent("challenge_completed");
    }
  }, [solved]);

  const reset = () => {
    setBroken(null);
    setCandidate(null);
    setChecked(null);
    setHintCount(0);
    completionTracked.current = false;
  };

  const validate = () => {
    if (candidate) setChecked(runChallengeUpdate(REFERENCE, candidate));
  };

  return (
    <main className="challenge-page">
      <BetaNav status="Debug challenge 01" />

      <header className="challenge-hero">
        <p className="eyebrow">Gradient debugging challenge</p>
        <h1>Why is my model learning in the <em>wrong direction?</em></h1>
        <p>Observe a failing update, inspect the evidence, then repair the operator. Every number is computed from the same starting model.</p>
        <div className="challenge-progress" aria-label="Challenge progress">
          {[
            ["1", "Observe", Boolean(broken)],
            ["2", "Diagnose", candidate !== null],
            ["3", "Verify", solved],
          ].map(([number, label, complete]) => (
            <span className={complete ? "complete" : ""} key={String(label)}>
              <b>{complete ? "✓" : number}</b>{label}
            </span>
          ))}
        </div>
      </header>

      <section className="challenge-grid" aria-label="Gradient update debugging workspace">
        <article className="panel challenge-card">
          <div className="panel-heading">
            <div><span className="step">01</span><h2>Starting model</h2></div>
            <span className="live">Shared baseline</span>
          </div>
          <div className="model-equation" aria-label="Two inputs feed one linear neuron">
            <div><span>x₁ = 2</span><span>w₁ = 1</span></div>
            <div><span>x₂ = 3</span><span>w₂ = 2</span></div>
            <strong>ŷ = 9</strong>
          </div>
          <dl className="fact-grid">
            <div><dt>Bias</dt><dd>1</dd></div><div><dt>Target</dt><dd>12</dd></div>
            <div><dt>Learning rate</dt><dd>0.01</dd></div><div><dt>Starting loss</dt><dd>9</dd></div>
          </dl>
          <p className="challenge-copy">The error is −3, so the trace gives gradients w₁: −12, w₂: −18, and bias: −6.</p>
        </article>

        <article className="panel challenge-card">
          <div className="panel-heading"><div><span className="step">02</span><h2>Run the broken code</h2></div></div>
          <pre className="code-sample" aria-label="Buggy update code"><code>parameter = parameter <mark>+</mark> η × gradient</code></pre>
          <p className="challenge-copy">Run one update and look for evidence that the model moved the wrong way.</p>
          <button className="button primary" onClick={() => { setBroken(runChallengeUpdate(REFERENCE, "+")); trackEvent("challenge_started"); }}>
            <span>Run broken update</span><span aria-hidden="true">→</span>
          </button>
          {broken && <ResultPanel result={broken} label="Broken result" />}
        </article>

        <article className="panel challenge-card diagnosis-card">
          <div className="panel-heading"><div><span className="step">03</span><h2>Repair the update</h2></div></div>
          <p className="challenge-copy">Which operator moves each parameter against its gradient?</p>
          <fieldset className="operator-picker" disabled={!broken}>
            <legend>Choose the update operator</legend>
            {(["+", "-"] as UpdateOperator[]).map((operator) => (
              <label key={operator} className={candidate === operator ? "selected" : ""}>
                <input
                  type="radio"
                  name="operator"
                  value={operator}
                  checked={candidate === operator}
                  onChange={() => { setCandidate(operator); setChecked(null); }}
                />
                <span>parameter <b>{operator === "-" ? "−" : "+"}</b> η × gradient</span>
              </label>
            ))}
          </fieldset>
          <div className="challenge-actions">
            <button className="button train" disabled={!broken || !candidate} onClick={validate}>Validate fix</button>
            <button className="button secondary" onClick={() => setHintCount((count) => Math.min(HINTS.length, count + 1))} disabled={hintCount === HINTS.length}>
              {hintCount ? "Next hint" : "Show a hint"}
            </button>
          </div>
          <div className="hints" aria-live="polite">
            {HINTS.slice(0, hintCount).map((hint, index) => <p key={hint}><b>Hint {index + 1}.</b> {hint}</p>)}
          </div>
          {checked && (
            <div className={`validation ${solved ? "success" : "failure"}`} role="status">
              <strong>{solved ? "Fix verified" : "The bug is still present"}</strong>
              <p>{solved
                ? `The loss fell from ${format(checked.sourceTrace.forward.loss)} to ${format(checked.resultTrace.forward.loss)} using the production update.`
                : `The loss rose by ${format(checked.lossChange)}. This operator follows the gradient uphill.`}</p>
            </div>
          )}
        </article>

        <article className="panel challenge-card explanation-card">
          <div className="panel-heading"><div><span className="step">04</span><h2>Explain the trace</h2></div></div>
          {!solved ? (
            <div className="locked-explanation"><span aria-hidden="true">◇</span><p>Verify the corrected operator to unlock the full chain-rule explanation.</p></div>
          ) : checked && (
            <div className="reasoning-stack">
              <p><b>1. Error signal</b><code>∂L/∂ŷ = 2(9 − 12) = {format(checked.sourceTrace.backward.dLossDPrediction)}</code></p>
              {checked.sourceTrace.backward.weightGradients.map((gradient, index) => (
                <p key={index}><b>{index + 2}. Weight w{index + 1}</b><code>∂L/∂w{index + 1} = {format(checked.sourceTrace.backward.dLossDPrediction)} × {REFERENCE.inputs[index]} = {format(gradient)}</code></p>
              ))}
              <p><b>4. Opposite direction</b><code>w₁ = 1 − 0.01 × (−12) = {format(checked.updatedInput.weights[0])}</code></p>
              <p><b>5. Verified outcome</b><code>ŷ = {format(checked.resultTrace.forward.prediction)}, L = {format(checked.resultTrace.forward.loss)}</code></p>
              <div className="takeaway"><strong>The gradient points uphill.</strong> Subtracting it moves parameters downhill; a negative gradient therefore increases the parameter.</div>
            </div>
          )}
        </article>
      </section>

      {solved && <section className="panel route-completion challenge-completion" aria-labelledby="challenge-complete-title"><div><span aria-hidden="true">✓</span><div><p className="eyebrow">Challenge complete</p><h2 id="challenge-complete-title">You diagnosed a real training failure.</h2><p>You used rising loss and gradient direction to identify ascent, restored the descent operator, and verified the repair against the mathematical runtime.</p></div></div><div className="completion-links"><Link className="button primary beta-link-button" href="/beta/feedback" onClick={() => trackEvent("feedback_opened")}><span>Share structured feedback</span><span aria-hidden="true">→</span></Link><Link className="interest-link" href="/beta/feedback#pricing-interest" onClick={() => trackEvent("pricing_interest_clicked")}>I may be interested in the complete $39 kit</Link><small>The complete kit is still in development. This records interest, not a purchase.</small></div></section>}

      <div className="challenge-footer-actions">
        <button className="text-button" onClick={reset}>Reset challenge</button>
        <Link href="/demo">Return to Neural Network X-Ray →</Link>
      </div>
    </main>
  );
}

function ResultPanel({ result, label }: { result: ChallengeUpdateResult; label: string }) {
  const increased = result.lossChange > 0;
  return (
    <div className={`result-panel ${increased ? "increase" : "decrease"}`} aria-label={label}>
      <div><span>Weights</span><strong>{result.updatedInput.weights.map(format).join(", ")}</strong><small>Δ {result.weightChanges.map(signed).join(", ")}</small></div>
      <div><span>Bias</span><strong>{format(result.updatedInput.bias)}</strong><small>Δ {signed(result.biasChange)}</small></div>
      <div><span>Prediction</span><strong>{format(result.resultTrace.forward.prediction)}</strong></div>
      <div><span>Loss</span><strong>{format(result.resultTrace.forward.loss)}</strong><small>{increased ? "↑" : "↓"} {signed(result.lossChange)}</small></div>
      <p><b>{increased ? "Loss increased." : "Loss decreased."}</b> The update moved {increased ? "up" : "down"} the loss surface.</p>
    </div>
  );
}
