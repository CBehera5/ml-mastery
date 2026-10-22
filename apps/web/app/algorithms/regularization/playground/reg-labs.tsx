"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { ALPHAS, FEATURES, YTRAIN, YVALID, ZTRAIN, ZVALID, elastic, fitScaler, l1, l2sq, maeOf, predict, resamples, ridge, rowsOf, scale, TRAIN_IDX, VALID_IDX, yOf, type Fit } from "./reg-math";

const COLORS = ["#1f7568", "#e36c28", "#6b5b95"], INK = "#16211c", GREY = "#8b958f";
const valid = (f: Fit) => maeOf(predict(f, ZVALID), YVALID), train = (f: Fit) => maeOf(predict(f, ZTRAIN), YTRAIN);

function Bars({ w, label, lo = -8, hi = 8, caption }: { w: readonly number[]; label: string; lo?: number; hi?: number; caption: string }) {
  return <Chart label={`${label}: ${FEATURES.map((n, j) => `${n} ${fmt(w[j], 1)}`).join(", ")}. ${caption}`} xDomain={[0, 3]} yDomain={[lo, hi]} xTicks={[]} yTicks={[lo, 0, hi]} xLabel={FEATURES.join("   ·   ")} yLabel="weight (₹ lakh per std)">
    {(sx, sy) => <><line x1={sx(0)} x2={sx(3)} y1={sy(0)} y2={sy(0)} stroke={GREY} />{w.map((v, j) => <g key={j}><rect x={sx(j + 0.2)} y={Math.min(sy(v), sy(0))} width={sx(j + 0.8) - sx(j + 0.2)} height={Math.abs(sy(v) - sy(0)) + (v === 0 ? 1.5 : 0)} fill={COLORS[j]} /><text x={sx(j + 0.5)} y={v >= 0 ? sy(v) - 5 : sy(v) + 13} textAnchor="middle" fontSize="11" fill={INK}>{v === 0 ? "exactly 0" : fmt(v, 2)}</text></g>)}</>}
  </Chart>;
}

/* ── RG01 · correlated features make coefficients jumpy ── */
export function WhyPlayground() {
  const [i, setI] = useState(0), [alpha, setAlpha] = useState(0);
  const sets = resamples(), pick = sets[i];
  const fits = sets.map(idx => ridge(idx.map(k => ZTRAIN[k]), idx.map(k => YTRAIN[k]), alpha)), here = fits[i];
  const areaW = fits.map(f => f.w[0]), spread = Math.max(...areaW) - Math.min(...areaW);
  const caption = alpha === 0 ? "Area and rooms say almost the same thing, so the fit can lean on either. The weights jump between samples." : "The penalty pulls the weights toward each other and keeps them from swinging.";
  return (
    <Playground id="rg-why" title="Two almost-identical measuring sticks" intro={<>Area and rooms are nearly the same measurement, so a model can lean on either one. Re-draw a different sample of 12 houses (six samples are available) and watch how much the weights jump. Then turn on a penalty.</>}
      actions={<>{sets.map((_, k) => <Btn key={k} primary={k === i} onClick={() => setI(k)}>{`Sample ${k + 1}`}</Btn>)}<Btn onClick={() => setAlpha(alpha === 0 ? 10 : 0)}>{alpha === 0 ? "Turn the penalty on" : "Turn the penalty off"}</Btn></>}
      note="A penalty states a preference for small, steady weights. It cannot create evidence that is missing, and it does not say which feature causes the price.">
      <Grid>
        <Figure caption={caption}><Bars w={here.w} label={`Sample ${i + 1}, penalty ${alpha}`} caption={caption} /></Figure>
        <Controls><Field label="Ridge penalty α" min={0} max={20} step={5} value={alpha} onChange={setAlpha} display={String(alpha)} /></Controls>
      </Grid>
      <Readout items={[["Houses in this sample", String(pick.length)], ["Weight on area, this sample", fmt(here.w[0], 2)], ["Weight on area, range across 6 samples", fmt(spread, 1)]]} />
    </Playground>
  );
}

/* ── RG02 · ridge: weights shrink smoothly as α grows ── */
const RIDGE_A = [0, 1, 2, 5, 10, 20, 80] as const;
export function RidgePlayground() {
  const [i, setI] = useState(1), alpha = RIDGE_A[i];
  const f = ridge(ZTRAIN, YTRAIN, alpha), v = valid(f), t = train(f);
  const best = RIDGE_A.reduce((a, b) => (valid(ridge(ZTRAIN, YTRAIN, b)) < valid(ridge(ZTRAIN, YTRAIN, a)) ? b : a), 0 as number);
  const caption = `At α = ${alpha} the weights are ${f.w.map(w => fmt(w, 2)).join(", ")}. Training miss ₹${fmt(t, 2)} lakh; unseen miss ₹${fmt(v, 2)} lakh.`;
  return (
    <Playground id="rg-ridge" title="Turn the dial on the penalty" intro={<>Ridge adds <code>α × (sum of squared weights)</code> to the training error. A larger α makes big weights expensive, so all the weights shrink, but none is forced exactly to zero. Slide α and compare the error on the 18 training houses with the error on 42 houses the model has not seen.</>}
      actions={<><Btn onClick={() => setI(0)}>No penalty</Btn><Btn onClick={() => setI(RIDGE_A.indexOf(best as 1))}>Best on unseen houses</Btn><Btn onClick={() => setI(6)}>Very strong</Btn></>}
      note="Too little penalty leaves the weights jumpy; too much makes the model too stiff to follow real price differences. Choose α using houses that were not used to fit.">
      <Grid>
        <Figure caption={caption}><Bars w={f.w} label={`Ridge α ${alpha}`} caption={caption} /></Figure>
        <Controls><Field label="Penalty α" min={0} max={6} step={1} value={i} onChange={setI} display={String(alpha)} /></Controls>
      </Grid>
      <Readout items={[["Average miss, training houses", `₹${fmt(t, 2)} lakh`], ["Average miss, unseen houses", `₹${fmt(v, 2)} lakh`], ["Best α on unseen houses", String(best)]]} />
    </Playground>
  );
}

/* ── RG03 · lasso: weights hit exactly zero ── */
export function LassoPlayground() {
  const [i, setI] = useState(2), alpha = ALPHAS[i];
  const f = elastic(ZTRAIN, YTRAIN, alpha, 0), zeros = f.w.filter(w => w === 0).length;
  const caption = zeros === 0 ? "Every feature is still in use. Raise α to see weights hit zero." : `${zeros} of 3 weights are exactly zero: those features have been dropped from the model.`;
  return (
    <Playground id="rg-lasso" title="Some weights can hit exactly zero" intro={<>Lasso adds <code>α × (sum of the absolute weights)</code>. The pointed corner of the absolute value lets a weight stop at exactly zero instead of shrinking forever. That makes lasso a way to pick features: the ones left standing are the ones the model kept.</>}
      actions={<><Btn onClick={() => setI(0)}>No penalty</Btn><Btn onClick={() => setI(1)}>Gentle</Btn><Btn onClick={() => setI(5)}>Strong</Btn></>}
      note="A weight of 0.0000000001 is tiny but not zero, so only an exact zero counts as dropped. Which of two nearly identical features survives can change with a small change in the data, so do not read it as proof one of them matters more.">
      <Grid>
        <Figure caption={caption}><Bars w={f.w} label={`Lasso α ${alpha}`} caption={caption} /></Figure>
        <Controls><Field label="Penalty α" min={0} max={6} step={1} value={i} onChange={setI} display={String(alpha)} /></Controls>
      </Grid>
      <Readout items={[["Weights exactly zero", `${zeros} of 3`], ["Average miss, unseen houses", `₹${fmt(valid(f), 2)} lakh`], ["Features kept", FEATURES.filter((_, j) => f.w[j] !== 0).join(", ") || "none"]]} />
    </Playground>
  );
}

/* ── RG04 · elastic net: a blend, and the penalty arithmetic ── */
export function ElasticPlayground() {
  const [w1, setW1] = useState(1), [w2, setW2] = useState(2), [alpha, setAlpha] = useState(1), [q, setQ] = useState(0.5);
  const l1c = alpha * q * (Math.abs(w1) + Math.abs(w2)), l2c = (alpha * (1 - q) * (w1 * w1 + w2 * w2)) / 2, total = l1c + l2c;
  const f = elastic(ZTRAIN, YTRAIN, alpha * q * 0.25, alpha * (1 - q) * 0.25);
  const caption = `L1 part ${fmt(l1c, 2)} + L2 part ${fmt(l2c, 2)} = ${fmt(total, 2)} added to the training error.`;
  return (
    <Playground id="rg-elastic" title="Mix the two penalties" intro={<>Elastic net splits the penalty between Lasso's absolute values and Ridge's squares. The mix <code>q</code> is the share given to the absolute values. Set two weights and the penalty strength, and read how much each part costs.</>}
      actions={<><Btn onClick={() => { setW1(1); setW2(2); setAlpha(1); setQ(0.5); }}>The worked example</Btn><Btn onClick={() => setQ(1)}>All Lasso</Btn><Btn onClick={() => setQ(0)}>All Ridge</Btn></>}
      note="With w = (1, 2), α = 1 and q = 0.5, the absolute part is 1 × 0.5 × 3 = 1.5 and the squared part is 1 × 0.5 × 5 ÷ 2 = 1.25. Their total, 2.75, is added to the error before the model is scored on training houses.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 2]} yDomain={[0, Math.max(3, total * 1.2)]} xTicks={[]} yTicks={[0, 1, 2, 3]} xLabel="absolute part  ·  squared part" yLabel="penalty">
            {(sx, sy) => <><rect x={sx(0.2)} y={sy(l1c)} width={sx(0.8) - sx(0.2)} height={sy(0) - sy(l1c)} fill={COLORS[0]} /><rect x={sx(1.2)} y={sy(l2c)} width={sx(1.8) - sx(1.2)} height={sy(0) - sy(l2c)} fill={COLORS[1]} /></>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Weight 1" min={-4} max={4} step={0.5} value={w1} onChange={setW1} /><Field label="Weight 2" min={-4} max={4} step={0.5} value={w2} onChange={setW2} />
          <Field label="Strength α" min={0} max={4} step={0.5} value={alpha} onChange={setAlpha} /><Field label="Share of absolute part q" min={0} max={1} step={0.25} value={q} onChange={setQ} />
        </Controls>
      </Grid>
      <Readout items={[["Absolute (L1) part", fmt(l1c, 2)], ["Squared (L2) part", fmt(l2c, 2)], ["Total penalty", fmt(total, 2)], ["Housing weights with this mix", f.w.map(w => fmt(w, 2)).join(", ")]]} />
    </Playground>
  );
}

/* ── RG05 · fit the scaler inside the training fold ── */
const FOLDS = [0, 1, 2].map(k => { const all = TRAIN_IDX.concat(VALID_IDX.slice(0, 12)); const hold = all.filter((_, i) => i % 3 === k), tr = all.filter((_, i) => i % 3 !== k); return { hold, tr }; });
export function SafePlayground() {
  const [honest, setHonest] = useState(true), [fold, setFold] = useState(0);
  const { hold, tr } = FOLDS[fold], allIdx = FOLDS.flatMap(f => f.hold);
  const scalerHonest = fitScaler(rowsOf(tr)), scalerLeak = fitScaler(rowsOf(allIdx)), scaler = honest ? scalerHonest : scalerLeak;
  const f = ridge(scale(rowsOf(tr), scaler), yOf(tr), 1), err = maeOf(predict(f, scale(rowsOf(hold), scaler)), yOf(hold));
  const heldMean = rowsOf(hold).reduce((s, r) => s + r[0], 0) / hold.length, trainMean = scalerHonest.mean[0];
  const caption = honest ? "The scaler only ever saw this fold's training houses." : "The scaler's average already includes the houses it will be tested on. That is leakage.";
  return (
    <Playground id="rg-safe" title="Learn the ruler from training houses only" intro={<>Standardising features means subtracting an average and dividing by a spread. If those numbers are computed from <em>all</em> the houses, the held-out houses have already influenced the model. Flip the switch and compare the scaler's average with and without the leak.</>}
      actions={<><Btn primary onClick={() => setHonest(!honest)}>{honest ? "Fit the scaler on all houses (leaky)" : "Fit inside the training fold"}</Btn><Btn onClick={() => setFold((fold + 1) % 3)}>{`Next fold (now ${fold + 1} of 3)`}</Btn></>}
      note="Every step that learns from data (the scaler, the model, the choice of α) must be fitted on the training rows of each fold only, then applied to the held-out rows. The final test set stays untouched until the choices are frozen.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Mean area used by the scaler: ${fmt(scaler.mean[0], 2)}. Training mean ${fmt(trainMean, 2)}, held-out mean ${fmt(heldMean, 2)}. ${caption}`} xDomain={[0, 4]} yDomain={[-1, 1]} xTicks={[]} yTicks={[-1, 0, 1]} xLabel="training mean  ·  scaler mean  ·  held-out mean" yLabel="mean area">
            {(sx, sy) => <>{[trainMean, scaler.mean[0], heldMean].map((v, j) => <g key={j}><rect x={sx(j * 1.3 + 0.1)} y={Math.min(sy(v), sy(0))} width={sx(j * 1.3 + 1.1) - sx(j * 1.3 + 0.1)} height={Math.abs(sy(v) - sy(0)) + 1} fill={[COLORS[0], honest ? COLORS[0] : "#c0392b", COLORS[1]][j]} /><text x={sx(j * 1.3 + 0.6)} y={sy(v) - 5} textAnchor="middle" fontSize="11" fill={INK}>{fmt(v, 2)}</text></g>)}</>}
          </Chart>
        </Figure>
        <Controls><p>Fold {fold + 1}: {tr.length} training houses, {hold.length} held out.</p></Controls>
      </Grid>
      <Readout items={[["Scaler average (area)", fmt(scaler.mean[0], 3)], ["Average from training houses only", fmt(trainMean, 3)], ["Held-out miss with this scaler", `₹${fmt(err, 2)} lakh`]]} />
    </Playground>
  );
}

/* ── RG06 · back to real units ── */
export function InterpretPlayground() {
  const [ws, setWs] = useState(6), [s, setS] = useState(3), [mu, setMu] = useState(4), [b, setB] = useState(10), [x, setX] = useState(7);
  const slope = ws / s, intercept = b - slope * mu, viaScaled = b + (ws * (x - mu)) / s, viaRaw = intercept + slope * x;
  const caption = `One more unit of the raw feature adds ₹${fmt(slope, 2)} lakh. Both routes give ₹${fmt(viaRaw, 1)} lakh at x = ${x}.`;
  return (
    <Playground id="rg-interp" title="Read a weight in real units" intro={<>A scaled weight says how much the price moves per <em>standard deviation</em> of a feature. To explain it to a buyer you need it per square metre or per room. Divide by the training spread, and shift the intercept to match.</>}
      actions={<><Btn onClick={() => { setWs(6); setS(3); setMu(4); setB(10); setX(7); }}>The worked example</Btn></>}
      note="Raw slope = scaled weight ÷ training spread. Raw intercept = scaled intercept − raw slope × training mean. A weight describes this fitted model's predictions, and it does not by itself show that changing the feature would change the price.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 12]} yDomain={[0, 40]} xTicks={[0, 4, 8, 12]} yTicks={[0, 10, 20, 30, 40]} xLabel="raw feature" yLabel="price (₹ lakh)">
            {(sx, sy) => <><line x1={sx(0)} y1={sy(intercept)} x2={sx(12)} y2={sy(intercept + slope * 12)} stroke={COLORS[0]} strokeWidth="3" /><circle cx={sx(x)} cy={sy(viaRaw)} r="6" fill={COLORS[1]} stroke="#fff" strokeWidth="2" /></>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Scaled weight" min={-10} max={10} step={1} value={ws} onChange={setWs} /><Field label="Training spread s" min={1} max={6} step={1} value={s} onChange={setS} /><Field label="Training mean μ" min={0} max={8} step={1} value={mu} onChange={setMu} />
          <Field label="Scaled intercept b" min={0} max={20} step={1} value={b} onChange={setB} /><Field label="Query value x" min={0} max={12} step={1} value={x} onChange={setX} />
        </Controls>
      </Grid>
      <Readout items={[["Raw slope", `${fmt(slope, 2)} ₹ lakh per unit`], ["Raw intercept", `₹${fmt(intercept, 2)} lakh`], ["Price at x (scaled route)", `₹${fmt(viaScaled, 1)} lakh`], ["Price at x (raw route)", `₹${fmt(viaRaw, 1)} lakh`]]} />
    </Playground>
  );
}
export { l1, l2sq };
