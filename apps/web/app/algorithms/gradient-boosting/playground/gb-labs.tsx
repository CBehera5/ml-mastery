"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { TRAIN_PTS, VALID_PTS, TRAIN_VALUES, VALID_VALUES, bestStage, boost, boostMse, boostPredict, centre, compare, logStep, squaredStep } from "./gb-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const pct = (v: number) => `${fmt(v * 100, 1)}%`;
const xs = Array.from({ length: 91 }, (_, i) => 1 + i * 0.1);

/* ── GB01 · fix what is still wrong, a little at a time ── */
export function SequentialPlayground() {
  const [m, setM] = useState(3), [eta, setEta] = useState(0.5), b = boost(TRAIN_PTS, 12, eta, 1);
  const tr = boostMse(b, TRAIN_PTS, m);
  const caption = `After ${m} correction${m === 1 ? "" : "s"} at step size ${fmt(eta, 2)}, the average squared miss on these houses is ${fmt(tr, 2)}.`;
  return (
    <Playground id="gb-sequential" title="Correct the leftovers, one small tree at a time" intro={<>Boosting starts with the average price. Each new small tree is fitted to what is still wrong, and only a fraction of it is added. Add corrections and watch the curve move toward the houses.</>}
      note="Unlike a forest, these trees are not independent. Each one exists only to fix what the earlier ones left behind.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0.5, 10.5]} yDomain={[-1, 14]} xTicks={[2, 4, 6, 8, 10]} yTicks={[0, 5, 10]} xLabel="area" yLabel="price (₹10 lakh)">
            {(sx, sy) => <>
              {TRAIN_PTS.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={3.5} fill={TEAL} />)}
              <polyline fill="none" stroke={ORANGE} strokeWidth={3} points={xs.map(x => `${sx(x)},${sy(boostPredict(b, x, m))}`).join(" ")} />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Corrections added" min={0} max={12} step={1} value={m} onChange={setM} /><Field label="Step size (learning rate)" min={0.1} max={1} step={0.1} value={eta} onChange={setEta} /></Controls>
      </Grid>
      <Readout items={[["Starting guess (average price)", fmt(b.f0, 2)], ["Average squared miss now", fmt(tr, 2)], ["Average squared miss at the start", fmt(boostMse(b, TRAIN_PTS, 0), 2)]]} />
    </Playground>
  );
}

/* ── GB02 · one house, squared error ── */
export function SquaredPlayground() {
  const [y, setY] = useState(5), [F, setF] = useState(3), [leaf, setLeaf] = useState(2), [eta, setEta] = useState(0.1), s = squaredStep(y, F, leaf, eta);
  const caption = `Actual ${y}, current guess ${F}. The leftover is ${fmt(s.residual, 2)}. Adding ${fmt(eta * leaf, 2)} moves the guess to ${fmt(s.Fnew, 2)}.`;
  return (
    <Playground id="gb-squared" title="One house, one correction" intro={<>For squared error the leftover is simply actual minus guess. A tree proposes a correction for the leaf, and only the step size's share of it is added.</>}
      note="The correction a leaf proposes is the average leftover of the houses in it, not any single house's leftover.">
      <Grid>
        <Figure caption={caption}>
          <svg role="img" aria-label={caption} viewBox="0 0 360 60" style={{ width: "100%", maxWidth: 420 }}>
            <line x1={20} x2={340} y1={30} y2={30} stroke={GREY} />
            {[[y, TEAL, "actual"], [F, GREY, "guess"], [s.Fnew, ORANGE, "new guess"]].map(([v, c, l], i) => <g key={i}><circle cx={20 + (Number(v) / 10) * 320} cy={30} r={6} fill={String(c)} /><text x={20 + (Number(v) / 10) * 320} y={i === 1 ? 52 : 16} textAnchor="middle" fontSize="11" fill={INK}>{String(l)}</text></g>)}
          </svg>
        </Figure>
        <Controls><Field label="Actual price" min={0} max={10} step={0.5} value={y} onChange={setY} /><Field label="Current guess" min={0} max={10} step={0.5} value={F} onChange={setF} /><Field label="Leaf's correction" min={-4} max={6} step={0.5} value={leaf} onChange={setLeaf} /><Field label="Step size" min={0.1} max={1} step={0.1} value={eta} onChange={setEta} /></Controls>
      </Grid>
      <Readout items={[["Leftover (actual − guess)", fmt(s.residual, 2)], ["New guess", fmt(s.Fnew, 2)], ["Squared error, before → after", `${fmt(s.errBefore, 2)} → ${fmt(s.errAfter, 2)}`], ["Half-squared error, before → after", `${fmt(s.halfBefore, 2)} → ${fmt(s.halfAfter, 2)}`]]} />
    </Playground>
  );
}

/* ── GB03 · one customer, log loss ── */
export function LogLossPlayground() {
  const [y, setY] = useState<0 | 1>(1), [F, setF] = useState(0), [eta, setEta] = useState(0.1), s = logStep(y, F, eta);
  const caption = `The score ${fmt(F, 2)} means a ${pct(s.p)} chance of leaving. The customer ${y ? "left" : "stayed"}. After one correction the chance is ${pct(s.pNew)}.`;
  return (
    <Playground id="gb-logloss" title="One customer, one correction" intro={<>For churn, the model keeps a running score and turns it into a chance. The gradient says which way to push the score. Dividing by how uncertain the model is gives the size of the leaf's correction.</>}
      actions={<><Btn primary={y === 1} onClick={() => setY(1)}>Customer left</Btn><Btn primary={y === 0} onClick={() => setY(0)}>Customer stayed</Btn></>}
      note="A leaf's correction is gradient ÷ p(1 − p), not the gradient alone. A single step like this is an illustration, not the whole fitting algorithm.">
      <Grid>
        <Figure caption={caption}><p>{caption}</p></Figure>
        <Controls><Field label="Current score" min={-4} max={4} step={0.25} value={F} onChange={setF} /><Field label="Step size" min={0.1} max={1} step={0.1} value={eta} onChange={setEta} /></Controls>
      </Grid>
      <Readout items={[["Chance of leaving now", pct(s.p)], ["Push on the score (gradient)", fmt(s.gradient, 3)], ["Uncertainty p(1 − p)", fmt(s.hessian, 3)], ["Leaf correction", fmt(s.leaf, 3)], ["New score → chance", `${fmt(s.Fnew, 3)} → ${pct(s.pNew)}`]]} />
    </Playground>
  );
}

/* ── GB04 · when to stop ── */
export function StopPlayground() {
  const [budget, setBudget] = useState(8), b = boost(TRAIN_PTS, 30, 0.5, 2), best = bestStage(b, VALID_PTS, budget);
  const tr = Array.from({ length: 31 }, (_, m) => boostMse(b, TRAIN_PTS, m)), va = Array.from({ length: 31 }, (_, m) => boostMse(b, VALID_PTS, m));
  const caption = `With a budget of ${budget} corrections, the best stage on unseen houses is ${best.stage}, with error ${fmt(best.mse, 2)}.`;
  return (
    <Playground id="gb-stop" title="More corrections are not always better" intro={<>Training error keeps shrinking as corrections pile up. The error on unseen houses reaches a low point and then climbs. Set a budget and see which stage you would keep.</>}
      note="Pick the stage using validation houses, never training houses. Lower step sizes need more stages to get as far.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 30]} yDomain={[0, 6]} xTicks={[0, 10, 20, 30]} yTicks={[0, 2, 4, 6]} xLabel="corrections added" yLabel="average squared miss">
            {(sx, sy) => <>
              <polyline fill="none" stroke={TEAL} strokeWidth={2.5} points={tr.map((v, m) => `${sx(m)},${sy(Math.min(v, 6))}`).join(" ")} />
              <polyline fill="none" stroke={ORANGE} strokeWidth={2.5} points={va.map((v, m) => `${sx(m)},${sy(Math.min(v, 6))}`).join(" ")} />
              <line x1={sx(best.stage)} x2={sx(best.stage)} y1={sy(0)} y2={sy(6)} stroke={INK} strokeDasharray="4 4" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Budget (most corrections allowed)" min={1} max={30} step={1} value={budget} onChange={setBudget} /></Controls>
      </Grid>
      <Readout items={[["Stage to keep", String(best.stage)], ["Error on unseen houses at that stage", fmt(best.mse, 2)], ["Error on unseen houses at the full budget", fmt(va[budget], 2)], ["Error on training houses at the full budget", fmt(tr[budget], 2)]]} />
    </Playground>
  );
}

/* ── GB05 · fit transforms on training rows only ── */
export function LeakTransformPlayground() {
  const [all, setAll] = useState(false), fitOn = all ? [...TRAIN_VALUES, ...VALID_VALUES] : [...TRAIN_VALUES], r = centre([...VALID_VALUES], fitOn);
  const caption = all ? "The centre was computed with the validation house included, so the validation row helped set its own scale." : "The centre comes from training rows only. The validation row is treated like a brand-new one.";
  return (
    <Playground id="gb-leak" title="Where did the centre come from?" intro={<>Training values are 0 and 2. One validation value is 100. Subtract a centre fitted on training rows alone, then try fitting it on everything.</>}
      actions={<Btn primary onClick={() => setAll(!all)}>{all ? "Fit on training rows only" : "Fit on all rows"}</Btn>}
      note="Any learned step (centring, filling blanks, choosing features) must be refitted inside each training fold. Reusing the outer fit inside validation folds leaks the same way.">
      <Grid>
        <Figure caption={caption}><p>{caption}</p></Figure>
        <Controls><p>Fitted on: {all ? "training and validation rows" : "training rows only"}.</p></Controls>
      </Grid>
      <Readout items={[["Centre used", fmt(r.mean, 1)], ["Validation value after centring", fmt(r.shifted[0], 1)], ["Allowed?", all ? "no: validation data shaped the transform" : "yes"]]} />
    </Playground>
  );
}

/* ── GB06 · boosting versus a forest ── */
export function ComparePlayground() {
  const [stages, setStages] = useState(30), [etaI, setEtaI] = useState(1), eta = [0.1, 0.3, 0.5][etaI], c = compare(stages, eta);
  const winner = Math.abs(c.boosting - c.forest) < 0.005 ? "about even" : c.boosting < c.forest ? "boosting" : "the forest";
  const caption = `Boosting misses by ${fmt(c.boosting, 2)} on average, the forest by ${fmt(c.forest, 2)}. Better here: ${winner}.`;
  return (
    <Playground id="gb-compare" title="Boosting or a forest? It depends on the settings" intro={<>Both are scored on the same unseen houses. Change the number of corrections and the step size and watch the winner change.</>}
      note="One win on one dataset is not a rule. Compare on the same held-out rows, and look at probability quality as well as labels when the target is a class.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 2]} yDomain={[0, 2]} xTicks={[]} yTicks={[0, 1, 2]} xLabel="forest   ·   boosting" yLabel="average miss (₹10 lakh)">
            {(sx, sy) => <><rect x={sx(0.2)} y={sy(c.forest)} width={sx(0.9) - sx(0.2)} height={sy(0) - sy(c.forest)} fill={TEAL} opacity={0.7} /><rect x={sx(1.1)} y={sy(c.boosting)} width={sx(1.8) - sx(1.1)} height={sy(0) - sy(c.boosting)} fill={ORANGE} opacity={0.8} /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Corrections" min={1} max={60} step={1} value={stages} onChange={setStages} /><Field label="Step size (slow, medium, fast)" min={0} max={2} step={1} value={etaI} onChange={setEtaI} display={String(eta)} /></Controls>
      </Grid>
      <Readout items={[["Forest, average miss", fmt(c.forest, 2)], ["Boosting, average miss", fmt(c.boosting, 2)], ["Better here", winner]]} />
    </Playground>
  );
}
