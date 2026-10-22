"use client";
import { useState } from "react";
import { Btn, Controls, Field, Figure, Grid, Playground, Readout, clamp, fmt } from "./ui";
import { HOUSE_X, HOUSE_Y, behaviour, bowl, closedForm1, descend1, descendBowl, grad1, loss1, ridgeFit, ridgeLoss, stableLimit } from "./descent";

/* ── shared 1-D curve with the path of descent drawn on it ── */
function DescentCurve({ path, xMin = -2, xMax = 8, yMax = 40, label }: { path: number[]; xMin?: number; xMax?: number; yMax?: number; label: string }) {
  const W = 460, H = 280, L = 44, R = 12, T = 12, B = 38;
  const sx = (x: number) => L + ((x - xMin) / (xMax - xMin)) * (W - L - R), sy = (y: number) => T + (1 - clamp(y, 0, yMax) / yMax) * (H - T - B);
  const curve = Array.from({ length: 81 }, (_, i) => { const x = xMin + (i / 80) * (xMax - xMin); return `${sx(x)},${sy(loss1(x))}`; }).join(" ");
  const shown = path.filter((p) => Number.isFinite(p));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="#fbfaf5" stroke="#d8d8ce" />
      {Array.from({ length: 5 }, (_, i) => (i * yMax) / 4).map((v) => <g key={v}><line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="#e7e6dc" /><text x={L - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#16211c">{v}</text></g>)}
      {Array.from({ length: Math.floor((xMax - xMin) / 2) + 1 }, (_, i) => xMin + i * 2).map((v) => <text key={v} x={sx(v)} y={H - B + 15} textAnchor="middle" fontSize="11" fill="#16211c">{v}</text>)}
      <polyline points={curve} fill="none" stroke="#1f7568" strokeWidth="2.6" />
      <line x1={sx(3)} x2={sx(3)} y1={T} y2={H - B} stroke="#8b958f" strokeDasharray="4 4" /><text x={sx(3) + 5} y={T + 12} fontSize="11" fontWeight="700" fill="#16211c">best: w = 3</text>
      {shown.length > 1 && <polyline points={shown.map((p) => `${sx(clamp(p, xMin, xMax))},${sy(loss1(p))}`).join(" ")} fill="none" stroke="#e36c28" strokeWidth="1.6" strokeDasharray="3 3" />}
      {shown.map((p, i) => p >= xMin && p <= xMax ? <circle key={i} cx={sx(p)} cy={sy(loss1(p))} r={i === 0 ? 7 : i === shown.length - 1 ? 6 : 3.5} fill={i === 0 ? "#16211c" : "#e36c28"} stroke="#fff" strokeWidth="1.5" /> : null)}
      <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#16211c">weight w</text>
      <text x={12} y={(T + H - B) / 2} textAnchor="middle" fontSize="12" fill="#16211c" transform={`rotate(-90 12 ${(T + H - B) / 2})`}>loss (w − 3)²</text>
    </svg>
  );
}

/* ── Lesson 2: how a slope becomes a step ── */
export function UpdatesPlayground() {
  const [w0, setW0] = useState(1), [lr, setLr] = useState(0.1), [steps, setSteps] = useState(1);
  const path = descend1(w0, lr, steps), last = path[path.length - 1];
  return (
    <Playground id="upd" title="Turn a slope into a step" intro={<>The loss is <code>L(w) = (w − 3)²</code>, so its slope is <code>2(w − 3)</code>. Pick a start, a step size (the <strong>learning rate</strong>) and how many steps to take. Each step moves <em>against</em> the slope.</>}
      actions={<><Btn primary onClick={() => setSteps((s) => Math.min(30, s + 1))}>One more step</Btn><Btn onClick={() => { setW0(1); setLr(0.1); setSteps(1); }}>Back to w = 1, rate 0.1</Btn></>}
      note={`Start ${fmt(w0)}, rate ${fmt(lr)}: after ${steps} step${steps === 1 ? "" : "s"} w = ${fmt(last, 4)} and the loss is ${fmt(loss1(last), 4)}. Each step multiplies the distance to 3 by ${fmt(1 - 2 * lr, 3)}.`}>
      <Grid>
        <Figure caption="The black dot is the start; orange dots are the steps taken."><DescentCurve path={path} label={`Gradient descent on (w−3)²: start ${w0}, rate ${lr}, ${steps} steps, ends at w = ${fmt(last, 3)}`} /></Figure>
        <div>
          <Controls>
            <Field label="Start w" min={-2} max={8} step={0.5} value={w0} onChange={(v) => { setW0(v); }} />
            <Field label="Learning rate" min={0.01} max={1.2} step={0.01} value={lr} onChange={setLr} />
            <Field label="Steps" min={1} max={30} step={1} value={steps} onChange={setSteps} display={String(steps)} />
          </Controls>
        </div>
      </Grid>
      <Readout items={[["Slope here", fmt(grad1(path[Math.max(0, path.length - 2)]), 3)], ["w now", fmt(last, 4)], ["Loss now", fmt(loss1(last), 4)], ["Loss at start", fmt(loss1(w0), 2)]]} />
    </Playground>
  );
}

/* ── Lesson 4: what a short history proves ── */
export function StabilityPlayground() {
  const [lr, setLr] = useState(1), [steps, setSteps] = useState(8);
  const path = descend1(1, lr, steps), kind = behaviour(lr), last = path[path.length - 1];
  const verdict = kind === "converging" ? "Shrinking toward 3. Each step lands closer." : kind === "oscillating" ? "Bouncing between two points forever: the loss never improves." : "Growing: every step lands farther away than the last.";
  return (
    <Playground id="stab" title="Read a training history honestly" intro={<>Same loss, same start (<code>w = 1</code>), different learning rates. Try <strong>0.1</strong>, <strong>1</strong> and <strong>1.1</strong>, then ask: after only a few steps, what do you actually know?</>}
      actions={<>{[0.1, 1, 1.1].map((v) => <Btn key={v} onClick={() => setLr(v)}>Rate {v}</Btn>)}</>}
      note={`Each step multiplies the distance to 3 by |1 − 2×${fmt(lr)}| = ${fmt(Math.abs(1 - 2 * lr), 3)}. Below 1 it shrinks, at exactly 1 it bounces, above 1 it grows. ${steps} steps show only the steps you looked at; they do not prove what happens later.`}>
      <Grid>
        <Figure caption={verdict}><DescentCurve path={path} xMin={-8} xMax={12} yMax={100} label={`Descent with rate ${lr}: ${verdict}`} /></Figure>
        <Controls>
          <Field label="Learning rate" min={0.05} max={1.2} step={0.05} value={lr} onChange={setLr} />
          <Field label="Steps shown" min={1} max={20} step={1} value={steps} onChange={setSteps} display={String(steps)} />
        </Controls>
      </Grid>
      <Readout items={[["Behaviour", kind], ["w after steps", fmt(last, 3)], ["Loss", fmt(loss1(last), 3)], ["Loss at start", "4"]]} />
    </Playground>
  );
}

/* ── Lesson 3: geometry, one step size for two directions ── */
export function GeometryPlayground() {
  const [k, setK] = useState(10), [lr, setLr] = useState(0.05), [steps, setSteps] = useState(12);
  const path = descendBowl(1, 1, k, lr, steps), last = path[path.length - 1], limit = stableLimit(k);
  const W = 460, H = 300, L = 40, R = 12, T = 12, B = 34;
  const sx = (a: number) => L + ((a + 1) / 8) * (W - L - R), sy = (b: number) => T + (1 - (b + 2) / 4) * (H - T - B);
  const cells = Array.from({ length: 36 * 24 }, (_, i) => { const c = i % 36, r = Math.floor(i / 36); const a = -1 + ((c + 0.5) / 36) * 8, b = 2 - ((r + 0.5) / 24) * 4; return { a, b, t: Math.min(1, Math.log1p(bowl(a, b, k)) / Math.log1p(bowl(-1, 2, k))) }; });
  const inView = (p: [number, number]) => p[0] >= -1 && p[0] <= 7 && p[1] >= -2 && p[1] <= 2;
  return (
    <Playground id="geo" title="One step size, two very different slopes" intro={<>The bowl is <code>L(a, b) = (a − 3)² + k·b²</code>. Raise <code>k</code> and it gets steep in <code>b</code> but stays gentle in <code>a</code>. The same step size is then right for one direction and wrong for the other.</>}
      actions={<><Btn primary onClick={() => setLr(Number(limit.toFixed(3)) * 0.9)}>Set a safe step for this bowl</Btn><Btn onClick={() => { setK(10); setLr(0.05); setSteps(12); }}>Reset</Btn></>}
      note={`k = ${k}: the largest safe step is 1 ÷ ${Math.max(1, k)} = ${fmt(limit, 3)}. Above it the b coordinate overshoots and grows. Your rate ${fmt(lr, 3)} is ${lr < limit ? "inside" : lr === limit ? "exactly at" : "above"} that limit.`}>
      <Grid>
        <Figure caption="Lighter is lower. The orange path is gradient descent from (1, 1)."><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Narrow bowl with k = ${k}, rate ${lr}. After ${steps} steps the point is (${fmt(last[0], 2)}, ${fmt(last[1], 2)}).`}>
          {cells.map((c, i) => <rect key={i} x={sx(c.a) - 6.4} y={sy(c.b) - 6.4} width={13} height={13} fill={`rgb(${Math.round(232 - 200 * c.t)},${Math.round(244 - 170 * c.t)},${Math.round(238 - 120 * c.t)})`} />)}
          <polyline points={path.filter(inView).map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")} fill="none" stroke="#e36c28" strokeWidth="1.8" />
          {path.filter(inView).map((p, i) => <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={i === 0 ? 6 : 3} fill={i === 0 ? "#16211c" : "#e36c28"} stroke="#fff" />)}
          <circle cx={sx(3)} cy={sy(0)} r="6" fill="none" stroke="#16211c" strokeWidth="2" />
          {[-1, 1, 3, 5, 7].map((v) => <text key={v} x={sx(v)} y={H - B + 15} textAnchor="middle" fontSize="11" fill="#16211c">{v}</text>)}
          {[-2, 0, 2].map((v) => <text key={v} x={L - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#16211c">{v}</text>)}
          <text x={(L + W - R) / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="#16211c">a</text><text x={10} y={(T + H - B) / 2} fontSize="12" fill="#16211c">b</text>
        </svg></Figure>
        <Controls>
          <Field label="Steepness k" min={1} max={50} step={1} value={k} onChange={setK} display={String(k)} />
          <Field label="Learning rate" min={0.01} max={0.6} step={0.01} value={lr} onChange={setLr} />
          <Field label="Steps" min={1} max={40} step={1} value={steps} onChange={setSteps} display={String(steps)} />
        </Controls>
      </Grid>
      <Readout items={[["Gradient at start", `(${fmt(2 * (1 - 3))}, ${fmt(2 * k)})`], ["Now at", `(${fmt(last[0], 2)}, ${fmt(last[1], 2)})`], ["Loss now", fmt(bowl(last[0], last[1], k), 3)], ["Safe step limit", fmt(limit, 3)]]} />
    </Playground>
  );
}

/* ── Lesson 5: regularization trades fit for smallness ── */
export function RegularizationPlayground() {
  const [lambda, setLambda] = useState(0.3);
  const [w, b] = ridgeFit(lambda), { mse, penalty, total } = ridgeLoss(lambda), [w0, b0] = ridgeFit(0);
  const P = { W: 460, H: 280, L: 44, T: 12, R: 12, B: 38 };
  const px = (x: number) => P.L + (x / 5.4) * (P.W - P.L - P.R), py = (y: number) => P.T + (1 - y / 420) * (P.H - P.T - P.B);
  return (
    <Playground id="reg" title="Pay for big weights and the line flattens" intro={<>Plain least squares picks the line that misses the houses least. Add a <strong>penalty</strong> <code>λ·w²</code> for a large slope and the best line changes: it flattens, and fits the houses worse. Move <code>λ</code> and watch the trade.</>}
      actions={<Btn onClick={() => setLambda(0)}>No penalty (λ = 0)</Btn>}
      note={`λ = ${fmt(lambda)}: slope ${fmt(w, 2)} (was ${fmt(w0, 2)} with no penalty). Total objective = misses ${fmt(mse, 1)} + penalty ${fmt(penalty, 1)} = ${fmt(total, 1)}.`}>
      <Grid>
        <Figure caption="Dashed grey: the unpenalised best line. Teal: the line for your λ.">
          <svg viewBox={`0 0 ${P.W} ${P.H}`} role="img" aria-label={`Six houses; unpenalised slope ${fmt(w0, 1)}; with lambda ${lambda} the slope is ${fmt(w, 1)}`}>
            <rect x={P.L} y={P.T} width={P.W - P.L - P.R} height={P.H - P.T - P.B} fill="#fbfaf5" stroke="#d8d8ce" />
            {[100, 200, 300, 400].map((v) => <text key={v} x={P.L - 5} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#16211c">{v}</text>)}
            {[1, 2, 3, 4, 5].map((v) => <text key={v} x={px(v)} y={P.H - P.B + 15} textAnchor="middle" fontSize="11" fill="#16211c">{v}</text>)}
            <line x1={px(0)} y1={py(b0)} x2={px(5.4)} y2={py(w0 * 5.4 + b0)} stroke="#8b958f" strokeWidth="2" strokeDasharray="6 5" />
            <line x1={px(0)} y1={py(b)} x2={px(5.4)} y2={py(w * 5.4 + b)} stroke="#1f7568" strokeWidth="3" />
            {HOUSE_X.map((x, i) => <circle key={i} cx={px(x)} cy={py(HOUSE_Y[i])} r="5" fill="#16211c" />)}
            <text x={(P.L + P.W - P.R) / 2} y={P.H - 6} textAnchor="middle" fontSize="12" fill="#16211c">area (thousand ft²)</text>
          </svg>
        </Figure>
        <Controls><Field label="Penalty strength λ" min={0} max={3} step={0.05} value={lambda} onChange={setLambda} /></Controls>
      </Grid>
      <Readout items={[["Slope w", fmt(w, 2)], ["Misses (MSE)", fmt(mse, 1)], ["Penalty λw²", fmt(penalty, 1)], ["Total", fmt(total, 1)]]} />
    </Playground>
  );
}

/* ── Lesson 6: training success is not generalisation ── */
import { TRAIN_X, TRAIN_Y, VAL_X, VAL_Y, polyEval, polyFit, polyMse } from "./poly";
export function ResponsiblePlayground() {
  const [deg, setDeg] = useState(5);
  const c = polyFit(TRAIN_X, TRAIN_Y, deg);
  const trainMse = polyMse(c, TRAIN_X, TRAIN_Y), valMse = polyMse(c, VAL_X, VAL_Y);
  const rows = [1, 2, 3, 4, 5].map((d) => { const cc = polyFit(TRAIN_X, TRAIN_Y, d); return { d, t: polyMse(cc, TRAIN_X, TRAIN_Y), v: polyMse(cc, VAL_X, VAL_Y) }; });
  const best = rows.reduce((a, r) => (r.v < a.v ? r : a));
  const W = 460, H = 280, L = 44, R = 12, T = 12, B = 38;
  const sx = (x: number) => L + x * (W - L - R), sy = (y: number) => T + (1 - (clamp(y, 0, 4) - 0) / 4) * (H - T - B);
  const curve = Array.from({ length: 101 }, (_, i) => { const x = i / 100; return `${sx(x)},${sy(polyEval(c, x))}`; }).join(" ");
  const maxErr = Math.max(...rows.flatMap((r) => [r.t, r.v]));
  return (
    <Playground id="resp" title="A perfect fit on the training data can still be a worse model" intro={<>Eleven measurements: six to <strong>train</strong> on (black) and five <strong>held back</strong> (orange). A higher-degree curve bends more. Raise the degree and compare the two errors.</>}
      actions={<Btn onClick={() => setDeg(best.d)}>Use the degree validation prefers</Btn>}
      note={`Degree ${deg}: training error ${fmt(trainMse, 4)}, held-back error ${fmt(valMse, 4)}. Validation picks degree ${best.d}. A low training error alone would have picked degree 5.`}>
      <Grid>
        <Figure caption="The curve is fitted to the black points only. The orange points are the test.">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Degree ${deg} fit. Training error ${fmt(trainMse, 3)}, held-back error ${fmt(valMse, 3)}.`}>
            <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="#fbfaf5" stroke="#d8d8ce" />
            {[0, 1, 2, 3, 4].map((v) => <text key={v} x={L - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#16211c">{v}</text>)}
            <polyline points={curve} fill="none" stroke="#1f7568" strokeWidth="2.8" />
            {TRAIN_X.map((x, i) => <circle key={`t${i}`} cx={sx(x)} cy={sy(TRAIN_Y[i])} r="5" fill="#16211c" />)}
            {VAL_X.map((x, i) => <circle key={`v${i}`} cx={sx(x)} cy={sy(VAL_Y[i])} r="5" fill="#e36c28" stroke="#fff" strokeWidth="1.5" />)}
            <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#16211c">input</text>
          </svg>
        </Figure>
        <div>
          <Controls><Field label="Curve degree" min={1} max={5} step={1} value={deg} onChange={setDeg} display={String(deg)} /></Controls>
          <table style={{ width: "100%", fontSize: ".85rem" }}><caption style={{ textAlign: "left", fontWeight: 700 }}>Error by degree</caption>
            <thead><tr><th scope="col">Degree</th><th scope="col">Training</th><th scope="col">Held back</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.d} style={r.d === deg ? { background: "#f4f2e8" } : undefined}><th scope="row">{r.d}</th><td>{fmt(r.t, 4)} <span aria-hidden style={{ display: "inline-block", height: 8, width: `${(r.t / maxErr) * 60}px`, background: "#16211c" }} /></td><td>{fmt(r.v, 4)} <span aria-hidden style={{ display: "inline-block", height: 8, width: `${(r.v / maxErr) * 60}px`, background: "#e36c28" }} /></td></tr>)}</tbody></table>
        </div>
      </Grid>
      <Readout items={[["Training error", fmt(trainMse, 4)], ["Held-back error", fmt(valMse, 4)], ["Validation prefers", `degree ${best.d}`]]} />
    </Playground>
  );
}
