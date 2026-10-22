"use client";
import { useMemo, useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { BLOBS, BLOBS_HELD, RING_TEST, RING_TRAIN, TRAIN_VALUES, VALID_VALUES, balanced, classC, distance, fitLinear, fitRbf, hinge, linAccuracy, mean, norm, rbf, rbfAccuracy, rbfScore, score, supports } from "./sv-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const pct = (v: number) => (Number.isFinite(v) ? `${fmt(v * 100, 0)}%` : "undefined");

/* ── SV01 · how far from the line? ── */
export function MarginPlayground() {
  const [w1, setW1] = useState(1), [w2, setW2] = useState(0), [b, setB] = useState(0), [x1, setX1] = useState(2), [x2, setX2] = useState(3);
  const w = [w1, w2], n = norm(w), F = score(w, b, [x1, x2]), d = n ? distance(w, b, [x1, x2]) : NaN;
  const caption = n ? `The point (${x1}, ${x2}) scores ${fmt(F, 2)} and sits ${fmt(Math.abs(d), 2)} units from the line, on the ${F >= 0 ? "positive" : "negative"} side.` : "A line needs a direction: set at least one weight.";
  const line = (c: number) => { if (!n) return null; const p0 = [(-b + c) * w1 / (n * n), (-b + c) * w2 / (n * n)], dir = [-w2 / n, w1 / n]; return [[p0[0] - 8 * dir[0], p0[1] - 8 * dir[1]], [p0[0] + 8 * dir[0], p0[1] + 8 * dir[1]]]; };
  return (
    <Playground id="sv-margin" title="How far is this customer from the line?" intro={<>A support vector machine scores a customer with a straight line. The score is not the distance. Dividing the score by the length of the weights gives the true distance, which is why doubling the weights changes the score but not the position of the line.</>}
      note="A score of 2 is not a probability of 2, and not automatically a trustworthy chance of anything. It only says which side, and how far in score units.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[-4, 4]} yDomain={[-4, 4]} xTicks={[-4, -2, 0, 2, 4]} yTicks={[-4, -2, 0, 2, 4]} xLabel="complaints (std)" yLabel="tenure (std)">
            {(sx, sy) => <>
              {[-1, 1].map(c => { const l = line(c); return l && <line key={c} x1={sx(l[0][0])} y1={sy(l[0][1])} x2={sx(l[1][0])} y2={sy(l[1][1])} stroke={GREY} strokeDasharray="4 4" />; })}
              {(() => { const l = line(0); return l && <line x1={sx(l[0][0])} y1={sy(l[0][1])} x2={sx(l[1][0])} y2={sy(l[1][1])} stroke={INK} strokeWidth={2} />; })()}
              <circle cx={sx(x1)} cy={sy(x2)} r={6} fill={ORANGE} />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Weight on complaints" min={-3} max={3} step={0.5} value={w1} onChange={setW1} /><Field label="Weight on tenure" min={-3} max={3} step={0.5} value={w2} onChange={setW2} /><Field label="Intercept" min={-3} max={3} step={0.5} value={b} onChange={setB} /><Field label="Customer: complaints" min={-3} max={3} step={0.5} value={x1} onChange={setX1} /><Field label="Customer: tenure" min={-3} max={3} step={0.5} value={x2} onChange={setX2} /></Controls>
      </Grid>
      <Readout items={[["Score", fmt(F, 2)], ["Distance from the line", n ? fmt(d, 2) : "undefined"], ["Penalty if this customer should be positive (hinge)", fmt(hinge(1, F), 2)], ["Penalty if this customer should be negative (hinge)", fmt(hinge(-1, F), 2)]]} />
    </Playground>
  );
}

/* ── SV02 · soft margins and C ── */
const CS = [0.01, 0.03, 0.1, 0.3, 1, 10];
export function SoftMarginPlayground() {
  const [ci, setCi] = useState(2), C = CS[ci], m = useMemo(() => fitLinear(BLOBS, C, 6000), [C]);
  const sv = supports(m, BLOBS), n = norm(m.w);
  const lineAt = (c: number) => { const p0 = [(c - m.b) * m.w[0] / (n * n), (c - m.b) * m.w[1] / (n * n)], dir = [-m.w[1] / n, m.w[0] / n]; return [[p0[0] - 8 * dir[0], p0[1] - 8 * dir[1]], [p0[0] + 8 * dir[0], p0[1] + 8 * dir[1]]]; };
  const caption = `C = ${C}: the margin is ${fmt(m.margin, 2)} wide and ${sv} of ${BLOBS.length} customers touch it or sit inside it.`;
  return (
    <Playground id="sv-soft" title="How strict should the line be?" intro={<>C sets how much each customer inside the margin costs. A small C accepts a few of them to keep the margin wide. A large C squeezes the margin to keep them out.</>}
      note="The wide margin of a small C is rarely a mistake. The point of C is that you pick it on held-out customers, not on training ones.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[-4, 4]} yDomain={[-3, 3]} xTicks={[-4, -2, 0, 2, 4]} yTicks={[-2, 0, 2]} xLabel="complaints (std)" yLabel="tenure (std)">
            {(sx, sy) => <>
              {[-1, 1].map(c => { const l = lineAt(c); return <line key={c} x1={sx(l[0][0])} y1={sy(l[0][1])} x2={sx(l[1][0])} y2={sy(l[1][1])} stroke={GREY} strokeDasharray="4 4" />; })}
              {(() => { const l = lineAt(0); return <line x1={sx(l[0][0])} y1={sy(l[0][1])} x2={sx(l[1][0])} y2={sy(l[1][1])} stroke={INK} strokeWidth={2} />; })()}
              {BLOBS.map(([a, b2, y], i) => { const inside = y * (m.w[0] * a + m.w[1] * b2 + m.b) <= 1.05; return <circle key={i} cx={sx(a)} cy={sy(b2)} r={inside ? 6 : 4} fill={y === 1 ? ORANGE : TEAL} stroke={inside ? INK : "none"} strokeWidth={1.5} />; })}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="C (penalty for crossing the margin)" min={0} max={5} step={1} value={ci} onChange={setCi} display={String(C)} /></Controls>
      </Grid>
      <Readout items={[["Margin width", fmt(m.margin, 2)], ["Customers on or inside the margin", `${sv} of ${BLOBS.length}`], ["Accuracy on these customers", pct(linAccuracy(m, BLOBS))], ["Accuracy on 40 new customers", pct(linAccuracy(m, BLOBS_HELD))]]} />
    </Playground>
  );
}

/* ── SV03 · RBF locality ── */
const GAMMAS = [0.1, 0.5, 1, 4, 10, 20];
export function RbfPlayground() {
  const [gi, setGi] = useState(2), [C, setC] = useState(1), gamma = GAMMAS[gi];
  const m = useMemo(() => fitRbf(RING_TRAIN, C, gamma), [C, gamma]), lin = useMemo(() => fitLinear(RING_TRAIN, 1), []);
  const cells = useMemo(() => Array.from({ length: 21 * 21 }, (_, k) => { const x = -3.5 + (k % 21) * 0.35, y = -3.5 + Math.floor(k / 21) * 0.35; return { x, y, s: rbfScore(m, [x, y]) }; }), [m]);
  const caption = `Gamma ${gamma}, C ${C}: ${pct(rbfAccuracy(m, RING_TRAIN))} on training customers, ${pct(rbfAccuracy(m, RING_TEST))} on new ones. A straight line gets ${pct(linAccuracy(lin, RING_TEST))} on new ones.`;
  return (
    <Playground id="sv-rbf" title="When one straight line is not enough" intro={<>Customers who leave sit in the middle, customers who stay sit in a ring around them. No straight line separates them. The RBF kernel scores a customer by how close it is to the training customers, and gamma sets how short that reach is.</>}
      note="A large gamma gives each training customer a tiny territory, which fits training perfectly and can fail on new customers. Features should be standardised before the kernel measures distance.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[-3.5, 3.5]} yDomain={[-3.5, 3.5]} xTicks={[-3, 0, 3]} yTicks={[-3, 0, 3]} xLabel="complaints (std)" yLabel="tenure (std)">
            {(sx, sy) => <>
              {cells.map((c, k) => <rect key={k} x={sx(c.x)} y={sy(c.y + 0.35)} width={sx(0.35) - sx(0)} height={sy(0) - sy(0.35)} fill={c.s >= 0 ? ORANGE : TEAL} opacity={0.14} />)}
              {RING_TRAIN.map(([a, b, y], i) => <circle key={i} cx={sx(a)} cy={sy(b)} r={3.5} fill={y === 1 ? ORANGE : TEAL} />)}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Gamma (how short the reach is)" min={0} max={5} step={1} value={gi} onChange={setGi} display={String(gamma)} /><Field label="C" min={1} max={10} step={9} value={C} onChange={setC} /></Controls>
      </Grid>
      <Readout items={[["Similarity at distance 1", fmt(rbf(1, gamma), 4)], ["Training accuracy", pct(rbfAccuracy(m, RING_TRAIN))], ["Accuracy on new customers", pct(rbfAccuracy(m, RING_TEST))], ["Straight line, on new customers", pct(linAccuracy(lin, RING_TEST))]]} />
    </Playground>
  );
}

/* ── SV04 · scale on training rows, weight the classes ── */
export function ScalePlayground() {
  const [all, setAll] = useState(false), [C, setC] = useState(0.5), [wt, setWt] = useState(3), fitOn = all ? [...TRAIN_VALUES, ...VALID_VALUES] : [...TRAIN_VALUES], m = mean(fitOn);
  return (
    <Playground id="sv-scale" title="Fit the scaler on the right rows" intro={<>Scaling matters for an SVM because distances drive everything. The training values are 0 and 2, and one validation value is 100. Fit the centre on training rows only, then try everything. A second dial shows how a class weight multiplies C.</>}
      actions={<Btn primary onClick={() => setAll(!all)}>{all ? "Fit on training rows only" : "Fit on all rows"}</Btn>}
      note="A class weight multiplies C for that class. A weight of 3 with C = 0.5 gives that class a penalty of 1.5, which is a penalty, not a probability.">
      <Grid>
        <Figure caption={all ? "The validation value 100 helped set the centre, so held-out information leaked in." : "The centre uses training rows only."}><p>{all ? "The validation value 100 helped set the centre, so held-out information leaked in." : "The centre uses training rows only."}</p></Figure>
        <Controls><Field label="C" min={0.1} max={2} step={0.1} value={C} onChange={setC} /><Field label="Weight on the positive class" min={1} max={10} step={1} value={wt} onChange={setWt} /></Controls>
      </Grid>
      <Readout items={[["Centre used", fmt(m, 1)], ["Validation value after centring", fmt(VALID_VALUES[0] - m, 1)], ["Allowed?", all ? "no: held-out data shaped the scaler" : "yes"], ["Penalty C for the positive class", fmt(classC(C, wt), 2)]]} />
    </Playground>
  );
}

/* ── SV05 · accuracy is not always the right grade ── */
export function LimitsPlayground() {
  const [pos, setPos] = useState(3), [neg, setNeg] = useState(3), [pr, setPr] = useState(1), [nr, setNr] = useState(2);
  const p = Math.min(pr, pos), n = Math.min(nr, neg), r = balanced(pos, neg, p, n);
  const caption = `${p + n} of ${pos + neg} customers are called correctly: accuracy ${pct(r.accuracy)}, balanced accuracy ${pct(r.balanced)}.`;
  return (
    <Playground id="sv-limits" title="Is the grade hiding something?" intro={<>Accuracy counts every customer equally. When one group is rare, a model that ignores it can still look excellent. Balanced accuracy averages the share of each group found.</>}
      actions={<Btn onClick={() => { setPos(5); setNeg(95); setPr(0); setNr(95); }}>Try a rare-leaver case</Btn>}
      note="A score of 2, or sigmoid(2) ≈ 88%, is not automatically a calibrated risk. And one comparison on one dataset, such as linear against RBF here, is local evidence, not a universal win.">
      <Grid>
        <Figure caption={caption}><p>{caption}</p></Figure>
        <Controls><Field label="Customers who left" min={1} max={100} step={1} value={pos} onChange={setPos} /><Field label="Customers who stayed" min={1} max={100} step={1} value={neg} onChange={setNeg} /><Field label="Leavers found" min={0} max={100} step={1} value={Math.min(pr, pos)} onChange={setPr} /><Field label="Stayers found" min={0} max={100} step={1} value={Math.min(nr, neg)} onChange={setNr} /></Controls>
      </Grid>
      <Readout items={[["Accuracy", pct(r.accuracy)], ["Share of leavers found", pct(r.recallPos)], ["Share of stayers found", pct(r.recallNeg)], ["Balanced accuracy", pct(r.balanced)]]} />
    </Playground>
  );
}
