"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "./ui";
import { cfg, FAIL } from "./la-code";
import { CHECK_PRELUDE, preset } from "./helpers";
import { modelingScenario } from "../integration/content";

export type Done = { onDone?: () => void };
const C = { a: "#e36c28", b: "#1f7568", ink: "#16211c" };
const STAGES = ["1 · Predict", "2 · Measure the miss", "3 · Slope of the miss", "4 · Take a step", "5 · Check the result"];

/* A guided walk through one training step, joining algebra, linear algebra, statistics, calculus and optimization. */
export function TrainingStepPlayground({ onDone }: Done) {
  const [stage, setStage] = useState(0), [w, setW] = useState(100), [rate, setRate] = useState(0.001);
  const s = modelingScenario(2, 10, w, 50, rate), row = s.evaluation.rows[0], g = s.update.gradient, after = s.update.after.rows[0].prediction;
  const go = (n: number) => { setStage(n); onDone?.(); };
  const text = [
    <>Each feature is multiplied by its own weight and the bias is added once: <code>ŷ = {fmt(w, 0)}×2 + (−2)×10 + 50 = {fmt(row.prediction, 1)}</code> thousand dollars. This is a dot product, the same one you wrote in Linear Algebra.</>,
    <>The target is 250. The residual is prediction minus target: <code>{fmt(row.prediction, 1)} − 250 = {fmt(row.residual, 1)}</code>. Squaring it gives the loss, <code>{fmt(row.residual ** 2, 1)}</code>. A negative residual means the model is too low.</>,
    <>Calculus asks how the loss changes if a weight moves. By the chain rule the slope for each weight is <code>2 × residual × feature</code>: area weight {fmt(g.weightGradients[0], 1)}, age weight {fmt(g.weightGradients[1], 1)}, bias {fmt(g.biasGradient, 1)}. Negative slopes mean increasing that weight lowers the loss.</>,
    <>Optimization moves every parameter a small step against its slope: <code>new = old − rate × slope</code>, using the <em>original</em> slopes for all of them. With rate {rate}, the area weight becomes {fmt(s.update.updatedParameters.weights[0], 3)}.</>,
    <>The new prediction is {fmt(after, 2)}, closer to 250 than {fmt(row.prediction, 1)}, and the loss falls from {fmt(row.residual ** 2, 1)} to {fmt(s.update.after.metrics.mse, 2)}. The gradient check {s.check.passed ? "agrees" : "disagrees"} with a measured slope. One step is not convergence, and one house is not a validated model.</>,
  ];
  return (
    <Playground id="cap-step" title="Walk through one training step" intro={<>A house has area 2 (thousand sq ft) and age 10, and it sold for 250. A model guesses the price from an area weight, an age weight of −2 and a bias of 50. Step through one training update, then change the area weight or the learning rate.</>}
      actions={<>{STAGES.map((t, i) => <Btn key={t} primary={i === stage} onClick={() => go(i)}>{t}</Btn>)}</>}
      note="Every stage is a tool from a different Math subject. Models are built by chaining them: algebra for the rule, linear algebra for many inputs, calculus for slopes, optimization for the step, and statistics and probability for asking whether the result can be trusted.">
      <Grid>
        <Figure caption={text[stage]}>
          <Chart label={`Target 250; prediction before ${fmt(row.prediction, 1)} and after one step ${fmt(after, 1)}`} xDomain={[200, 260]} yDomain={[0, 1]} xTicks={[200, 220, 240, 260]} yTicks={[]} xLabel="price (thousand dollars)" yLabel="" width={460} height={170}>
            {(sx, sy) => <>
              <line x1={sx(250)} x2={sx(250)} y1={sy(0.05)} y2={sy(0.95)} stroke={C.b} strokeWidth="3" /><text x={sx(250)} y={sy(0.97) + 12} textAnchor="middle" fontSize="12" fill={C.b} fontWeight="700">target 250</text>
              <circle cx={sx(row.prediction)} cy={sy(0.5)} r="9" fill={C.a} /><text x={sx(row.prediction)} y={sy(0.5) + 26} textAnchor="middle" fontSize="12" fill={C.a}>before</text>
              {stage >= 3 && <><circle cx={sx(after)} cy={sy(0.5)} r="9" fill={C.ink} /><text x={sx(after)} y={sy(0.5) - 16} textAnchor="middle" fontSize="12" fill={C.ink}>after</text></>}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Area weight" min={80} max={120} step={5} value={w} onChange={(v) => { setW(v); onDone?.(); }} display={String(w)} /><Field label="Learning rate" min={0.0005} max={0.01} step={0.0005} value={rate} onChange={(v) => { setRate(v); onDone?.(); }} display={String(rate)} /></Controls>
      </Grid>
      <Readout items={[["Prediction", fmt(row.prediction, 2)], ["Residual", fmt(row.residual, 2)], ["Loss", fmt(row.residual ** 2, 2)], ["Loss after one step", fmt(s.update.after.metrics.mse, 2)]]} />
    </Playground>
  );
}

const CAP_S = `def predict(x, w, b):
    return sum(xi * wi for xi, wi in zip(x, w)) + b

def loss(rows, targets, w, b):
    return sum((predict(x, w, b) - y) ** 2 for x, y in zip(rows, targets)) / len(rows)

def gradients(rows, targets, w, b):
    gw, gb = [0.0] * len(w), 0.0
    n = len(rows)
    for x, y in zip(rows, targets):
        r = predict(x, w, b) - y
        pass       # TODO 1: for each j add 2 * r * x[j] / n to gw[j], and add 2 * r / n to gb
    return gw, gb

def step(rows, targets, w, b, lr):
    gw, gb = gradients(rows, targets, w, b)
    return w, b    # TODO 2: return the new weights and bias: old minus lr times its gradient

rows, targets = [[2, 10]], [250]
w, b = [100.0, -2.0], 50.0
print("loss before:", loss(rows, targets, w, b))
w2, b2 = step(rows, targets, w, b, 0.001)
print("after one step:", w2, b2, "loss", round(loss(rows, targets, w2, b2), 2))
`;
export const CAP_CODE = cfg("capcode", "Write one training step from scratch", "Predict, measure, take the slope, move. You will write the slope and the update, and let a gradient check referee them.", "gradients() and step()", CAP_S,
  [["        pass       # TODO 1: for each j add 2 * r * x[j] / n to gw[j], and add 2 * r / n to gb", "        for j in range(len(w)):\n            gw[j] += 2 * r * x[j] / n\n        gb += 2 * r / n"], ["    return w, b    # TODO 2: return the new weights and bias: old minus lr times its gradient", "    return [wi - lr * gi for wi, gi in zip(w, gw)], b - lr * gb"]],
  CHECK_PRELUDE + `try:
    gw, gb = gradients([[2, 10]], [250], [100.0, -2.0], 50.0)
    results.append({"name": "One house: gradients are [−80, −400] and −40", "passed": _close(gw[0], -80.0) and _close(gw[1], -400.0) and _close(gb, -40.0), "hint": "gradients returned %r and %r. Residual is −20, so the slope for each weight is 2 × (−20) × its feature." % (gw, gb)})
    w2, b2 = step([[2, 10]], [250], [100.0, -2.0], 50.0, 0.001)
    results.append({"name": "One step at rate 0.001: weights [100.08, −1.6], bias 50.04", "passed": _close(w2[0], 100.08, 1e-9) and _close(w2[1], -1.6, 1e-9) and _close(b2, 50.04, 1e-9), "hint": "step returned %r and %r. new = old − rate × gradient, for every parameter." % (w2, b2)})
    results.append({"name": "The step lowers the loss: 400 falls to 249.64", "passed": _close(loss([[2, 10]], [250], [100.0, -2.0], 50.0), 400.0) and _close(loss([[2, 10]], [250], w2, b2), 249.64, 1e-9), "hint": "After one step the loss should be 249.64. If it did not fall, check the sign of the update."})
    R = [[2, 10], [1, 5], [3, 15]]; T = [250, 160, 310]; W = [100.0, -2.0]; B = 50.0
    gw3, gb3 = gradients(R, T, W, B); h = 1e-5
    num = (loss(R, T, [W[0] + h, W[1]], B) - loss(R, T, [W[0] - h, W[1]], B)) / (2 * h)
    results.append({"name": "Gradient check on three houses: formula matches a measured slope", "passed": abs(gw3[0] - num) < 1e-4, "hint": "gradients gave %r for the area weight but a measured slope gives %r. Divide each term by the number of rows n." % (gw3[0], num)})
` + FAIL,
  [{ math: "∂L/∂wⱼ = 2 r xⱼ", code: "gw[j] += 2 * r * x[j] / n", note: "Chain rule: outer 2r, inner xⱼ." }, { math: "θ ← θ − η ∇L", code: "[wi - lr * gi for wi, gi in zip(w, gw)]", note: "Step against the slope." }],
  [preset("Use a learning rate ten times larger", "Watch whether the loss still falls.", /w2, b2 = step\(rows, targets, w, b, 0\.001\)/, "w2, b2 = step(rows, targets, w, b, 0.01)")], ["If the loss went up after a step, what are the two most likely causes?", "A sign error in the update, or a learning rate so large that the step overshoots the minimum. A gradient check separates them: if the slope matches a measured slope, shrink the rate."], "These are the numbers on the Integration page: prediction 230 → 234.2, loss 400 → 249.64.");
