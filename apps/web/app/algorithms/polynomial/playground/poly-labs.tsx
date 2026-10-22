"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { DEGREES, NARROW, TRAIN, TRUE_CURVE, VALID, columns, expand2, fit, handCurve, mae } from "./poly-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const xs = Array.from({ length: 91 }, (_, i) => (i * 4.5) / 90);
const path = (sx: (x: number) => number, sy: (y: number) => number, f: (x: number) => number, lo = 0, hi = 4.5, clampY = [-5, 95] as [number, number]) => xs.filter(x => x >= lo && x <= hi).map(x => `${sx(x)},${sy(Math.min(clampY[1], Math.max(clampY[0], f(x))))}`).join(" ");
const Dots = ({ sx, sy, data, color, hollow }: { sx: (x: number) => number; sy: (y: number) => number; data: readonly { x: number; y: number }[]; color: string; hollow?: boolean }) => <>{data.map((h, i) => <circle key={i} cx={sx(h.x)} cy={sy(h.y)} r="4" fill={hollow ? "none" : color} stroke={color} strokeWidth="1.5" opacity="0.85" />)}</>;

/* ── PR01 · a curve from extra columns ── */
export function CurvePlayground() {
  const [b, setB] = useState(10), [w1, setW1] = useState(8), [w2, setW2] = useState(0);
  const f = handCurve(b, w1, w2), err = mae(f, TRAIN), at2 = f(2);
  const caption = w2 === 0 ? "With no x² contribution this is a straight line. Add a bend with the third slider." : `Same weighted-sum machine, one extra column (x²), and the line now bends. Mean miss: ₹${fmt(err, 1)} lakh.`;
  return (
    <Playground id="pr-curve" title="Give the line one more column and it bends" intro={<>Each dot is a house: area on the bottom, price in ₹ lakh up the side. The model is still a weighted sum, but now it gets two measurements of every house: its area <code>x</code> and <code>x²</code>. Set the baseline and the two weights to make the curve pass through the dots.</>}
      actions={<><Btn onClick={() => { setB(1); setW1(2); setW2(3); }}>The worked example</Btn><Btn onClick={() => { setB(10); setW1(12); setW2(-1); }}>A curve that fits</Btn><Btn onClick={() => { setB(10); setW1(8); setW2(0); }}>Back to a line</Btn></>}
      note="At area 2 the worked example's model reads x = 2 and x² = 4, so the price is 1 + 2×2 + 3×4 = ₹17 lakh. The weights are still added in a straight way. Only the columns changed, which is why this counts as a linear model.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Curve with baseline ${b}, weight on x ${w1}, weight on x squared ${w2}. ${caption}`} xDomain={[0, 4.6]} yDomain={[0, 80]} xTicks={[0, 1, 2, 3, 4]} yTicks={[0, 20, 40, 60, 80]} xLabel="area (normalised)" yLabel="price (₹ lakh)">
            {(sx, sy) => <><Dots sx={sx} sy={sy} data={TRAIN} color={GREY} /><polyline fill="none" stroke={TEAL} strokeWidth="3" points={path(sx, sy, f, 0, 4.5, [0, 80])} /><circle cx={sx(2)} cy={sy(Math.min(80, Math.max(0, at2)))} r="6" fill={ORANGE} stroke="#fff" strokeWidth="2" /></>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Baseline b (₹ lakh)" min={-10} max={30} step={1} value={b} onChange={setB} />
          <Field label="Weight on x" min={-4} max={20} step={0.5} value={w1} onChange={setW1} />
          <Field label="Weight on x²" min={-4} max={4} step={0.25} value={w2} onChange={setW2} />
        </Controls>
      </Grid>
      <Readout items={[["Price at area 2", `₹${fmt(at2, 1)} lakh`], ["Formula", `${b} + ${w1}·x ${w2 < 0 ? "−" : "+"} ${Math.abs(w2)}·x²`], ["Average miss", `₹${fmt(err, 1)} lakh`]]} />
    </Playground>
  );
}

/* ── PR02 · interactions and how fast the columns multiply ── */
export function ColumnsPlayground() {
  const [p, setP] = useState(2), [d, setD] = useState(2);
  const count = columns(p, d), names = p === 2 && d === 2 ? ["x₀", "x₁", "x₀²", "x₀x₁", "x₁²"] : null;
  const caption = `${p} measurements raised to degree ${d} become ${count} columns.`;
  const rows = [1, 2, 3, 4, 5].map(deg => ({ deg, count: columns(p, deg) })), top = Math.max(10, ...rows.map(r => r.count));
  return (
    <Playground id="pr-cols" title="How many columns does a curve need?" intro={<>With two measurements <code>[a, b]</code>, degree 2 gives <code>a, b, a², ab, b²</code>. That is 5 columns, and the cross term <code>ab</code> lets the two measurements work together. Change how many measurements you start with and how high the degree goes.</>}
      actions={<><Btn onClick={() => { setP(2); setD(2); }}>Two features, degree 2</Btn><Btn onClick={() => { setP(10); setD(3); }}>Ten features, degree 3</Btn></>}
      note="Every new column needs a coefficient, and every coefficient needs evidence. The count is C(p + d, d) − 1, one less than the number of ways to choose terms, because the constant column is not counted.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Columns for ${p} measurements at degrees 1 to 5: ${rows.map(r => r.count).join(", ")}. ${caption}`} xDomain={[0, 6]} yDomain={[0, top * 1.1]} xTicks={[1, 2, 3, 4, 5]} yTicks={[0, Math.round(top / 2), top]} xLabel="degree" yLabel="columns">
            {(sx, sy) => <>{rows.map(r => <g key={r.deg}><rect x={sx(r.deg - 0.35)} y={sy(r.count)} width={sx(r.deg + 0.35) - sx(r.deg - 0.35)} height={sy(0) - sy(r.count)} fill={r.deg === d ? ORANGE : TEAL} /><text x={sx(r.deg)} y={sy(r.count) - 5} textAnchor="middle" fontSize="11" fill={INK}>{r.count}</text></g>)}</>}
          </Chart>
        </Figure>
        <Controls><Field label="Measurements p" min={1} max={12} step={1} value={p} onChange={setP} display={String(p)} /><Field label="Degree d" min={1} max={5} step={1} value={d} onChange={setD} display={String(d)} /></Controls>
      </Grid>
      <Readout items={[["Columns", String(count)], ["For the row [2, 3] at degree 2", expand2(2, 3).join(", ")], ["Column names", names ? names.join("  ") : "(set p = 2, d = 2 to see them)"]]} />
    </Playground>
  );
}

/* ── PR03 · degree and the ridge penalty ── */
const ALPHAS = [0, 0.1, 1] as const;
export function DegreePlayground() {
  const [degree, setDegree] = useState(8), [ai, setAi] = useState(0), alpha = ALPHAS[ai];
  const f = fit(TRAIN, degree, alpha), tr = mae(f, TRAIN), va = mae(f, VALID);
  const best = DEGREES.reduce((a, d) => (mae(fit(TRAIN, d, alpha), VALID) < mae(fit(TRAIN, a, alpha), VALID) ? d : a), 1 as number);
  const caption = degree >= 7 && alpha === 0 ? "The curve snakes through the training houses. It has learned their noise." : degree === 1 ? "A straight line misses the bend in both groups." : "The curve follows the trend and treats the houses it has not seen about as well as the ones it has.";
  return (
    <Playground id="pr-degree" title="More bends are not always better" intro={<>Filled dots are the 20 houses the model learns from. Hollow dots are 20 different houses it has never seen. Raise the degree and watch the two errors. Then turn on the ridge penalty, which discourages big coefficients.</>}
      actions={<><Btn onClick={() => { setDegree(2); setAi(0); }}>Degree 2</Btn><Btn onClick={() => { setDegree(8); setAi(0); }}>Degree 8</Btn><Btn onClick={() => { setDegree(8); setAi(1); }}>Degree 8 with a penalty</Btn></>}
      note="Choose the degree (and the penalty) by the error on unseen houses, not by how well the curve hugs the training dots. The penalty trades a little training accuracy for a calmer curve.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Degree ${degree}, penalty ${alpha}. Training error ${fmt(tr, 2)}, unseen error ${fmt(va, 2)}. ${caption}`} xDomain={[0, 4.6]} yDomain={[0, 60]} xTicks={[0, 1, 2, 3, 4]} yTicks={[0, 20, 40, 60]} xLabel="area (normalised)" yLabel="price (₹ lakh)">
            {(sx, sy) => <><Dots sx={sx} sy={sy} data={VALID} color={ORANGE} hollow /><Dots sx={sx} sy={sy} data={TRAIN} color={TEAL} /><polyline fill="none" stroke={INK} strokeWidth="2.5" points={path(sx, sy, f, 0.2, 4.4, [0, 60])} /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Degree" min={1} max={8} step={1} value={degree} onChange={setDegree} display={String(degree)} /><Field label="Ridge penalty α" min={0} max={2} step={1} value={ai} onChange={setAi} display={String(alpha)} /></Controls>
      </Grid>
      <Readout items={[["Average miss, training houses", `₹${fmt(tr, 2)} lakh`], ["Average miss, unseen houses", `₹${fmt(va, 2)} lakh`], [`Best degree at α = ${alpha}`, String(best)]]} />
    </Playground>
  );
}

/* ── PR04 · where the curve has no evidence ── */
export function LimitsPlayground() {
  const [degree, setDegree] = useState(5), [q, setQ] = useState(3.8);
  const f = fit(NARROW, degree), pred = f(q), truth = TRUE_CURVE(q), outside = q > 3;
  const caption = outside ? "The query lies beyond every house the model learned from. The curve here is a guess, and high degrees guess wildly." : "Inside the area the model has seen, a flexible curve usually does fine.";
  return (
    <Playground id="pr-limits" title="A curve is only trustworthy where it has seen houses" intro={<>The model learned only from houses with area up to 3 (shaded). Pick a degree and slide the query house outside that range. The dashed line is what the real price pattern would give.</>}
      actions={<><Btn onClick={() => { setDegree(2); setQ(3.8); }}>Degree 2</Btn><Btn onClick={() => { setDegree(5); setQ(3.8); }}>Degree 5</Btn><Btn onClick={() => { setDegree(5); setQ(1.5); }}>Inside the range</Btn></>}
      note="Inside the training range this is interpolation. Outside it is extrapolation, and no amount of fit on training houses says the curve will behave there.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Degree ${degree}, query area ${q}. Prediction ₹${fmt(pred, 0)} lakh against a pattern value of ₹${fmt(truth, 0)} lakh. ${caption}`} xDomain={[0, 4.6]} yDomain={[0, 80]} xTicks={[0, 1, 2, 3, 4]} yTicks={[0, 20, 40, 60, 80]} xLabel="area (normalised)" yLabel="price (₹ lakh)">
            {(sx, sy) => <><rect x={sx(0)} y={sy(80)} width={sx(3) - sx(0)} height={sy(0) - sy(80)} fill={TEAL} opacity="0.08" /><Dots sx={sx} sy={sy} data={NARROW} color={TEAL} />
              <polyline fill="none" stroke={GREY} strokeDasharray="5 4" strokeWidth="2" points={path(sx, sy, TRUE_CURVE, 0, 4.5, [0, 80])} /><polyline fill="none" stroke={INK} strokeWidth="2.5" points={path(sx, sy, f, 0, 4.5, [0, 80])} />
              <line x1={sx(q)} x2={sx(q)} y1={sy(0)} y2={sy(80)} stroke={ORANGE} strokeDasharray="3 3" /><circle cx={sx(q)} cy={sy(Math.min(80, Math.max(0, pred)))} r="6" fill={ORANGE} stroke="#fff" strokeWidth="2" /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Degree" min={1} max={8} step={1} value={degree} onChange={setDegree} display={String(degree)} /><Field label="Query house area" min={0.5} max={4.5} step={0.1} value={q} onChange={setQ} display={fmt(q, 1)} /></Controls>
      </Grid>
      <Readout items={[["Prediction", `₹${fmt(pred, 0)} lakh`], ["Real pattern", `₹${fmt(truth, 0)} lakh`], ["Inside the training range?", outside ? "no, extrapolating" : "yes"]]} />
    </Playground>
  );
}
