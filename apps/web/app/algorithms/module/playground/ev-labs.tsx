"use client";
import { useState } from "react";
import { Btn, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { CAPACITY, FEATURES, FOLD_A, FOLD_B, RESAMPLES, TRAIN, VALID, brier, eligible, logLoss, mae, mean, metrics, r2, reduction, sdPop, sse, sst } from "./ev-math";

const pct = (v: number) => (Number.isFinite(v) ? `${fmt(v * 100, 1)}%` : "undefined");

/* ── EV01 ── */
export function MomentPlayground() {
  const [t, setT] = useState(0), ok = eligible(t);
  const caption = `Predicting on day ${t}: ${ok.length} of ${FEATURES.length} columns are known by then.`;
  return (
    <Playground id="ev-moment" title="What is known when the prediction is made?" intro={<>Pick the day the prediction is made. A column can be used only if its value was already recorded by then, however well it correlates with the outcome.</>}
      note="Rows from the same source or template must stay together, either all in training or all in testing. Otherwise the test is not a stranger.">
      <Grid>
        <Figure caption={caption}>
          <table aria-label={caption}><thead><tr><th scope="col">Column</th><th scope="col">Recorded on day</th><th scope="col">Usable?</th></tr></thead>
            <tbody>{FEATURES.map(f => <tr key={f.name}><th scope="row">{f.name}</th><td>{f.day}</td><td>{f.day <= t ? "yes" : "no: from the future"}</td></tr>)}</tbody></table>
        </Figure>
        <Controls><Field label="Prediction day" min={0} max={60} step={1} value={t} onChange={setT} /></Controls>
      </Grid>
      <Readout items={[["Usable columns", String(ok.length)], ["Blocked as future information", String(FEATURES.length - ok.length)], ["Most dangerous blocked column", FEATURES.length - ok.length ? FEATURES[FEATURES.length - 1].name : "none"]]} />
    </Playground>
  );
}

/* ── EV02 ── */
export function ErrorPlayground() {
  const [p1, setP1] = useState(3), [p2, setP2] = useState(3), [base, setBase] = useState(5), [cand, setCand] = useState(4);
  const y = [1, 3], pred = [p1, p2], model = mae(pred, y), meanBase = mae([2, 2], y);
  return (
    <Playground id="ev-error" title="A better score than what, exactly?" intro={<>Two houses sell for 1 and 3 (₹ lakh). Set your predictions for them and see error, R², and the comparison with just guessing the average. A second pair of sliders shows how a drop in error becomes a percentage.</>}
      note="A 20% error reduction is not 80% accuracy. The error is in rupees, and R² can go below zero when a model is worse than predicting the average.">
      <Grid>
        <Figure caption={`Model errors ${fmt(Math.abs(p1 - 1), 1)} and ${fmt(Math.abs(p2 - 3), 1)}; guessing 2 for both has errors 1 and 1.`}><p>{`Model errors ${fmt(Math.abs(p1 - 1), 1)} and ${fmt(Math.abs(p2 - 3), 1)}; guessing the average (2) for both has errors 1 and 1.`}</p></Figure>
        <Controls><Field label="Prediction for the house that sold at 1" min={0} max={5} step={0.5} value={p1} onChange={setP1} /><Field label="Prediction for the house that sold at 3" min={0} max={5} step={0.5} value={p2} onChange={setP2} /><Field label="Baseline average error (₹ lakh)" min={1} max={10} step={1} value={base} onChange={setBase} /><Field label="Candidate average error (₹ lakh)" min={1} max={10} step={1} value={cand} onChange={setCand} /></Controls>
      </Grid>
      <Readout items={[["Model average error", fmt(model, 2)], ["Average-guess error", fmt(meanBase, 2)], ["R²", `${fmt(r2(pred, y), 2)} (errors ${fmt(sse(pred, y), 2)} vs total spread ${fmt(sst(y), 2)})`], ["Error reduction, baseline → candidate", pct(reduction(base, cand))]]} />
    </Playground>
  );
}

/* ── EV03 ── */
export function ConfusionPlayground() {
  const [tp, setTp] = useState(2), [fp, setFp] = useState(1), [tn, setTn] = useState(1), [fn, setFn] = useState(1), m = metrics(tp, fp, tn, fn);
  return (
    <Playground id="ev-confusion" title="Count the four kinds of call" intro={<>Every call lands in one of four boxes. Precision asks how many of the flagged items were right. Recall asks how many of the real cases were found. Accuracy can look wonderful while recall is zero.</>}
      actions={<Btn onClick={() => { setTp(0); setFp(0); setTn(99); setFn(1); }}>Try 100 items with one real case</Btn>}
      note="Which mistake costs more decides which number to watch. Accuracy alone cannot tell you.">
      <Grid>
        <Figure caption={`Found ${tp} real cases, raised ${fp} false alarms, missed ${fn}, correctly ignored ${tn}.`}><p>{`Found ${tp} real cases, raised ${fp} false alarms, missed ${fn}, correctly ignored ${tn}.`}</p></Figure>
        <Controls><Field label="Real cases found (TP)" min={0} max={100} step={1} value={tp} onChange={setTp} /><Field label="False alarms (FP)" min={0} max={100} step={1} value={fp} onChange={setFp} /><Field label="Correctly ignored (TN)" min={0} max={100} step={1} value={tn} onChange={setTn} /><Field label="Real cases missed (FN)" min={0} max={100} step={1} value={fn} onChange={setFn} /></Controls>
      </Grid>
      <Readout items={[["Accuracy", pct(m.accuracy)], ["Precision", pct(m.precision)], ["Recall", pct(m.recall)], ["F1", pct(m.f1)]]} />
    </Playground>
  );
}

/* ── EV04 ── */
export function ProbabilityPlayground() {
  const [a, setA] = useState(0.8), [b, setB] = useState(0.2), ps = [a, b], ys = [1, 0];
  return (
    <Playground id="ev-proba" title="Same order, different honesty" intro={<>One customer left and one stayed. Set the chance the model gave each. As long as the leaver scores higher, the ranking is right. Brier score and log loss also grade how sure the model was.</>}
      note="Ranking quality and probability quality are different jobs. Choose the measure that matches how the number will be used.">
      <Grid>
        <Figure caption={a > b ? "The leaver is ranked above the stayer." : a === b ? "A tie: the ranking cannot separate them." : "The stayer is ranked above the leaver."}><p>{a > b ? "The leaver is ranked above the stayer." : a === b ? "A tie: the ranking cannot separate them." : "The stayer is ranked above the leaver."}</p></Figure>
        <Controls><Field label="Chance given to the customer who left" min={0.05} max={0.95} step={0.05} value={a} onChange={setA} display={pct(a)} /><Field label="Chance given to the customer who stayed" min={0.05} max={0.95} step={0.05} value={b} onChange={setB} display={pct(b)} /></Controls>
      </Grid>
      <Readout items={[["Ranking", a > b ? "correct" : a === b ? "tied" : "wrong"], ["Brier score (lower is better)", fmt(brier(ps, ys), 3)], ["Log loss (lower is better)", fmt(logLoss(ps, ys), 4)]]} />
    </Playground>
  );
}

/* ── EV05 ── */
export function CapacityPlayground() {
  const [c, setC] = useState(1), row = CAPACITY[c], best = CAPACITY.reduce((a, b) => (b.dev < a.dev ? b : a));
  return (
    <Playground id="ev-capacity" title="Fitting well is not the same as predicting well" intro={<>Three models of growing flexibility, each scored on the houses it learned from and on houses it did not. Then three resampled error values show how much a single score can wobble.</>}
      note="The standard deviation of resampled errors describes how much the score moved across resamples. It is not a 95% interval for a new house.">
      <Grid>
        <Figure caption={`${row.name}: error ${row.train} on training houses, ${row.dev} on unseen houses.`}><p>{`${row.name}: error ${row.train} on training houses, ${row.dev} on unseen houses.`}</p></Figure>
        <Controls><Field label="Model flexibility (1 simple, 3 flexible)" min={0} max={2} step={1} value={c} onChange={setC} display={row.name} /></Controls>
      </Grid>
      <Readout items={[["Error on training houses", String(row.train)], ["Error on unseen houses", String(row.dev)], ["Best on unseen houses", best.name], [`Resampled errors ${RESAMPLES.join(", ")}`, `mean ${fmt(mean(RESAMPLES), 2)}, spread ${fmt(sdPop(RESAMPLES), 4)}`]]} />
    </Playground>
  );
}

/* ── EV06 ── */
const FITS = [{ label: "training rows only", rows: [...TRAIN], ok: true }, { label: "training and validation rows", rows: [...TRAIN, ...VALID], ok: false }, { label: "fold A's training rows", rows: [...FOLD_A], ok: true }, { label: "fold B's training rows", rows: [...FOLD_B], ok: true }];
export function HonestPlayground() {
  const [i, setI] = useState(0), f = FITS[i], m = mean(f.rows);
  return (
    <Playground id="ev-honest" title="Which rows may set the centre?" intro={<>Training values are 2, 4, 6, 8. Validation values are 20 and 22. In cross-validation, fold A may fit only on 2 and 4, fold B only on 6 and 8.</>}
      note="Fitting a step once on all training rows before cross-validation still leaks across folds. Refit inside each fold.">
      <Grid>
        <Figure caption={`The centre is the mean of ${f.rows.join(", ")}.`}><p>{`The centre is the mean of ${f.rows.join(", ")}.`}</p></Figure>
        <Controls><Field label="Fit the centre on (1 to 4)" min={1} max={4} step={1} value={i + 1} onChange={v => setI(v - 1)} display={f.label} /></Controls>
      </Grid>
      <Readout items={[["Centre", fmt(m, 2)], ["Allowed?", f.ok ? "yes" : "no: validation rows leaked in"], ["Rows used", f.rows.join(", ")]]} />
    </Playground>
  );
}
