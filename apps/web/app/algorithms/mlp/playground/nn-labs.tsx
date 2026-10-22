"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { TRAIN_VALUES, VALID_VALUES, descend, forward, gradOf, initWeights, lossOf, mean, nParams, preferSimple, relu, sgdStep, shapes } from "./nn-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const pct = (v: number) => `${fmt(v * 100, 1)}%`;

/* ── NN01 ── */
export function NeuronPlayground() {
  const [x, setX] = useState(2), [w, setW] = useState(1), [b, setB] = useState(-1), [v, setV] = useState(2), [c, setC] = useState(0), [act, setAct] = useState<"relu" | "linear">("relu");
  const f = forward(x, w, b, v, c, act), s = shapes(4, 2, 1), xs = Array.from({ length: 61 }, (_, i) => -3 + i * 0.1);
  const caption = `Input ${x} becomes a pre-activation of ${fmt(f.z, 2)}, a hidden value of ${fmt(f.h, 2)}, a logit of ${fmt(f.logit, 2)} and a chance of ${pct(f.p)}.`;
  return (
    <Playground id="nn-neuron" title="Follow one signal through a tiny network" intro={<>One input is multiplied by a weight and shifted by a bias. An activation bends the result. A second weight and bias turn it into a score, and a sigmoid turns the score into a chance.</>}
      actions={<><Btn primary={act === "relu"} onClick={() => setAct("relu")}>Bend with ReLU</Btn><Btn primary={act === "linear"} onClick={() => setAct("linear")}>No bend (linear)</Btn></>}
      note="Without the bend, stacked layers collapse into one straight rule. The bend is what lets a network represent richer patterns.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[-3, 3]} yDomain={[-4, 6]} xTicks={[-3, 0, 3]} yTicks={[-4, 0, 6]} xLabel="input x" yLabel="hidden value">
            {(sx, sy) => <><polyline fill="none" stroke={TEAL} strokeWidth={2.5} points={xs.map(t => `${sx(t)},${sy(act === "relu" ? relu(t * w + b) : t * w + b)}`).join(" ")} /><circle cx={sx(x)} cy={sy(f.h)} r={6} fill={ORANGE} /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Input x" min={-3} max={3} step={0.5} value={x} onChange={setX} /><Field label="Weight into the hidden neuron" min={-3} max={3} step={0.5} value={w} onChange={setW} /><Field label="Bias of the hidden neuron" min={-3} max={3} step={0.5} value={b} onChange={setB} /><Field label="Output weight" min={-3} max={3} step={0.5} value={v} onChange={setV} /><Field label="Output bias" min={-3} max={3} step={0.5} value={c} onChange={setC} /></Controls>
      </Grid>
      <Readout items={[["Before the bend (z = x·w + b)", fmt(f.z, 3)], ["Hidden value", fmt(f.h, 3)], ["Output score (logit)", fmt(f.logit, 3)], ["Chance", pct(f.p)], ["Shapes for 4 rows, 2 features, 1 hidden neuron", `X ${s.X.join("×")}, W1 ${s.W1.join("×")}, b1 ${s.b1.join("")}, W2 ${s.W2.join("×")}, b2 ${s.b2.join("")}`]]} />
    </Playground>
  );
}

/* ── NN02 ── */
export function DescentPlayground() {
  const [lr, setLr] = useState(0.1), [steps, setSteps] = useState(12), [w, setW] = useState(1), [g, setG] = useState(0.2), [eta, setEta] = useState(0.1);
  const path = descend(lr, steps), losses = path.map(lossOf), top = Math.min(Math.max(...losses), 60);
  const caption = `Learning rate ${lr}: after ${steps} steps the weight is ${fmt(path[steps], 3)} and the loss is ${fmt(losses[steps], 3)}.`;
  return (
    <Playground id="nn-descent" title="Take small steps downhill" intro={<>One weight should be 2. Start at 0, measure which way the loss slopes, and step against it. The learning rate sets the stride. Too small is slow; too large overshoots and blows up.</>}
      note="Every gradient in a step is computed from the same old parameters. Only then are all of them updated together.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 30]} yDomain={[0, top]} xTicks={[0, 10, 20, 30]} yTicks={[0, Math.round(top / 2), Math.round(top)]} xLabel="steps" yLabel="loss (clipped)">
            {(sx, sy) => <><polyline fill="none" stroke={TEAL} strokeWidth={2.5} points={descend(lr, 30).map(lossOf).map((l, i) => `${sx(i)},${sy(Math.min(l, top))}`).join(" ")} /><circle cx={sx(steps)} cy={sy(Math.min(losses[steps], top))} r={5} fill={ORANGE} /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Learning rate" min={0.01} max={0.4} step={0.01} value={lr} onChange={setLr} /><Field label="Steps taken" min={0} max={30} step={1} value={steps} onChange={setSteps} /><Field label="One step: current weight" min={0} max={3} step={0.1} value={w} onChange={setW} /><Field label="One step: gradient" min={-1} max={1} step={0.1} value={g} onChange={setG} /><Field label="One step: learning rate" min={0.01} max={1} step={0.01} value={eta} onChange={setEta} /></Controls>
      </Grid>
      <Readout items={[["Weight after the steps (target 2)", fmt(path[steps], 3)], ["Loss", fmt(losses[steps], 3)], ["Gradient at the start", fmt(gradOf(0), 2)], ["One step: new weight", fmt(sgdStep(w, g, eta), 3)], ["Learning rate stable?", lr * mean([1, 4, 9]) * 2 < 2 ? "yes: the loss falls each step" : "no: it overshoots"]]} />
    </Playground>
  );
}

/* ── NN03 ── */
export function CapacityNnPlayground() {
  const [h, setH] = useState(2), [rows, setRows] = useState(20), p = nParams(2, h);
  return (
    <Playground id="nn-capacity" title="How many adjustable numbers?" intro={<>Every weight and bias is a number the network can bend to fit the training rows. Count them and compare with how many rows you have to learn from.</>}
      note="More hidden units is more capacity, not a promise of a better validation score. Stronger weight penalties and early stopping rein capacity in.">
      <Grid>
        <Figure caption={`A 2 → ${h} → 1 network has ${p} adjustable numbers; you have ${rows} rows.`}><p>{`A 2 → ${h} → 1 network has ${p} adjustable numbers; you have ${rows} rows.`}</p></Figure>
        <Controls><Field label="Hidden units" min={1} max={20} step={1} value={h} onChange={setH} /><Field label="Training rows" min={5} max={200} step={5} value={rows} onChange={setRows} /></Controls>
      </Grid>
      <Readout items={[["Weights and biases", `2×${h} + ${h} + ${h}×1 + 1 = ${p}`], ["Numbers per training row", fmt(p / rows, 2)], ["Reading", p > rows ? "more adjustable numbers than rows: be ready to overfit" : "fewer adjustable numbers than rows"]]} />
    </Playground>
  );
}

/* ── NN04 ── */
export function SafePlayground() {
  const [all, setAll] = useState(false), [seed, setSeed] = useState(7), [run, setRun] = useState(1), fitOn = all ? [...TRAIN_VALUES, ...VALID_VALUES] : [...TRAIN_VALUES], m = mean(fitOn), w = initWeights(seed, 4);
  return (
    <Playground id="nn-safe" title="Same start, same preparation" intro={<>Two habits make a network run repeatable and honest. Fit the scaler on training rows only, and fix the random seed so the starting weights are the same every run.</>}
      actions={<><Btn primary onClick={() => setAll(!all)}>{all ? "Fit scaler on training rows only" : "Fit scaler on all rows"}</Btn><Btn onClick={() => setRun(run + 1)}>Run again with the same seed</Btn></>}
      note="Change the seed and the starting weights change, so a score from one seed is one draw. Report more than one seed when the choice matters.">
      <Grid>
        <Figure caption={`Starting weights for seed ${seed} (run ${run}): ${w.join(", ")}.`}><p>{`Starting weights for seed ${seed} (run ${run}): ${w.join(", ")}.`}</p></Figure>
        <Controls><Field label="Seed" min={1} max={20} step={1} value={seed} onChange={setSeed} /></Controls>
      </Grid>
      <Readout items={[["Scaler centre", fmt(m, 1)], ["Validation value after centring", fmt(VALID_VALUES[0] - m, 1)], ["Allowed?", all ? "no: validation data shaped the scaler" : "yes"], ["First starting weights", w.join(", ")]]} />
    </Playground>
  );
}

/* ── NN05 ── */
export function WorthPlayground() {
  const [simple, setSimple] = useState(0.42), [complex, setComplex] = useState(0.42), [tol, setTol] = useState(0.02), [cost, setCost] = useState(10);
  const pick = preferSimple(simple, complex, tol);
  return (
    <Playground id="nn-worth" title="Is the network worth it?" intro={<>Logistic regression and a network both score 0.42 log loss. The network costs ten times as much to fit. Move the sliders to see when the extra effort would be justified.</>}
      note="A network is a good tool when the pattern really is complicated. When a simpler model is adequate, it is also easier to explain and to audit.">
      <Grid>
        <Figure caption={`Simple model's log loss ${fmt(simple, 2)}, network's ${fmt(complex, 2)}, network costs ${cost}× more.`}><p>{`Simple model's log loss ${fmt(simple, 2)}, network's ${fmt(complex, 2)}, network costs ${cost}× more.`}</p></Figure>
        <Controls><Field label="Simple model's log loss" min={0.2} max={0.7} step={0.01} value={simple} onChange={setSimple} /><Field label="Network's log loss" min={0.2} max={0.7} step={0.01} value={complex} onChange={setComplex} /><Field label="Improvement you would pay for" min={0} max={0.1} step={0.01} value={tol} onChange={setTol} /><Field label="How many times more the network costs" min={1} max={20} step={1} value={cost} onChange={setCost} /></Controls>
      </Grid>
      <Readout items={[["Improvement from the network", fmt(simple - complex, 2)], ["Choice by this rule", pick === "simple" ? "the simpler model" : "the network"], ["Extra cost", `${cost}× for ${fmt(simple - complex, 2)} less log loss`]]} />
    </Playground>
  );
}
