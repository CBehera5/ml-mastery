"use client";
import { useState } from "react";
import { LivePythonCell } from "../../../components/live-python/live-python-cell";
import { LossCurve } from "../../../components/live-python/loss-curve";
import type { PythonRuntime } from "../../../components/live-python/client";
import { GRADIENT_CHECKS, GRADIENT_PRESETS, GRADIENT_SOLUTION, GRADIENT_STARTER } from "./gradient-python-content";

/** Shown before the guided lab: a story, and a prediction the learner commits to first. */
export function GradientStory() {
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const right = choice === "increase";
  return (
    <section className="why-story gradient-story" aria-labelledby="gd-story-title">
      <div>
        <p className="eyebrow">The big idea</p>
        <h2 id="gd-story-title">Lost on a foggy hill</h2>
        <p>Imagine standing on a hillside at night, in thick fog. You cannot see the valley, but you can feel the ground tilt under your feet. So you do the only sensible thing: take a small step in the direction that goes <em>downhill</em>, feel the slope again, and repeat.</p>
        <p>That is how a machine learns. The hill is the <strong>loss</strong>: for every possible setting of the line (a slope <code>w</code> and a baseline <code>b</code>), the height tells us how wrong the predictions are. The valley floor is the best line. The slope under your feet is the <strong>gradient</strong>, which calculus gives us exactly. No machine ever sees the whole hill, only the slope where it stands, and that is enough.</p>
      </div>
      <div className="gradient-predict" role="group" aria-labelledby="gd-predict-title">
        <p className="eyebrow">Predict before you read on</p>
        <h3 id="gd-predict-title">Which way is downhill?</h3>
        <p>Our line starts at <code>w = 10</code>, <code>b = 100</code>. At that spot the slope of the hill is <code>−892.5</code> in the <code>w</code> direction. It is <em>negative</em>: loss goes down as <code>w</code> goes up. Which step should we take?</p>
        <div className="gradient-choices">
          {[["increase", "Increase w a little"], ["decrease", "Decrease w a little"], ["unsure", "I can't tell yet"]].map(([id, label]) => (
            <label key={id}><input type="radio" name="gd-predict" value={id} checked={choice === id} onChange={() => { setChoice(id); setRevealed(false); }} /> {label}</label>
          ))}
        </div>
        <button type="button" className="button" disabled={choice === null} onClick={() => setRevealed(true)}>Reveal</button>
        <div role="status" aria-live="polite">
          {revealed && (
            <p className={right ? "guided-feedback success" : "guided-feedback failure"}>
              {right ? "Yes. " : choice === "unsure" ? "That's a fair place to start. " : "Not quite. "}
              A negative slope means the ground tilts down as <code>w</code> grows, so <strong>increase w</strong>. Downhill is always the <em>opposite</em> of the gradient, which is why the update rule has a minus sign: <code>w ← w − α · (−892.5)</code> adds to <code>w</code>. The guided lab below lets you watch this happen.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

const BRIDGE: { math: string; code: string; note: string }[] = [
  { math: "rᵢ = ŷᵢ − yᵢ", code: "r = predict(w, b, xi) - yi", note: "How wrong is row i? (prediction minus actual)" },
  { math: "∂L/∂w = (2/m) Σ rᵢ xᵢ", code: "dw += 2 / m * r * xi", note: "The Σ is the loop; each row adds its share. Steeper where the input xᵢ is large." },
  { math: "∂L/∂b = (2/m) Σ rᵢ", code: "db += 2 / m * r", note: "Same, without xᵢ: the baseline multiplies 1." },
  { math: "w ← w − α ∂L/∂w", code: "w = w - lr * dw", note: "Step against the slope. α is lr, the size of the step." },
];

/** Shown after the guided lab: the learner writes the algorithm in real, runnable Python. */
export function GradientCodeSection({ runtime }: { runtime?: PythonRuntime }) {
  return (
    <section className="gradient-code" aria-labelledby="gd-code-title">
      <p className="eyebrow">Now you drive</p>
      <h2 id="gd-code-title">Code gradient descent yourself</h2>
      <p>The lab above ran the algorithm for you. Now write its heart: <strong>three lines of Python</strong>. The equations from this lesson become code almost word for word:</p>
      <div className="table-scroll">
        <table className="gradient-bridge">
          <caption>Maths and Python, side by side</caption>
          <thead><tr><th scope="col">Maths</th><th scope="col">Python</th><th scope="col">In plain words</th></tr></thead>
          <tbody>{BRIDGE.map((row) => <tr key={row.code}><td>{row.math}</td><td><code>{row.code}</code></td><td>{row.note}</td></tr>)}</tbody>
        </table>
      </div>
      <p>Fill in <code>TODO 1</code>, <code>TODO 2</code> and <code>TODO 3</code>, then press <strong>Check my code</strong>. Before you finish, the program already runs; with the TODOs empty, the line just never moves. Notice what the loss curve does.</p>

      <LivePythonCell
        title="Gradient descent on the housing data"
        starter={GRADIENT_STARTER}
        solution={GRADIENT_SOLUTION}
        checks={GRADIENT_CHECKS}
        expose={["history", "w", "b"]}
        presets={GRADIENT_PRESETS}
        runtime={runtime}
        renderResult={(values) => <LossCurve values={values.history} />}
      />

      <div className="gradient-reflect">
        <h3>Experiment, then explain</h3>
        <p>Finish the three TODOs, then use the quick experiments (or edit <code>lr</code> and <code>steps</code> yourself). Think about each question before opening its answer.</p>
        <details><summary>With <code>lr = 0.001</code> the loss barely moves. Is the code broken?</summary>
          <p>No. The same correct code takes tiny steps, so after 20 of them the loss has only fallen from 20,164 to about 8,451 and <code>w</code> is still near 25. Try <code>steps = 500</code>: small steps are safe, just slow.</p></details>
        <details><summary>At <code>lr = 0.05</code> the loss drops from 20,164 to about 198 in one step. Why does <code>lr = 0.1</code> blow up?</summary>
          <p>At <code>0.05</code> the first step already overshoots the valley floor (the slope flips from negative to positive), but each later step lands closer. At <code>0.1</code> every overshoot is bigger than the last, so the loss grows instead of shrinking: after 20 steps it is about 8 million. The step size has to be small enough for each correction to shrink the error.</p></details>
        <details><summary>Why is the slope for <code>b</code> (−269) smaller than for <code>w</code> (−892.5)?</summary>
          <p>Each row&rsquo;s share of <code>∂L/∂w</code> is multiplied by its area <code>xᵢ</code> (up to 4.8), but <code>∂L/∂b</code> is multiplied by 1. A feature measured in larger numbers has a steeper slope, which is why the next lessons talk about <strong>scaling features</strong>.</p></details>
      </div>
      <p className="gradient-link">Same numbers, two ways: at <code>lr = 0.01</code>, 20 steps, this code ends at <code>w ≈ 50.70</code>, <code>b ≈ 113.26</code>, loss ≈ 61.6, exactly the iteration-20 row of the guided lab above, which runs on the platform&rsquo;s verified TypeScript maths runtime.</p>
    </section>
  );
}
