"use client";
import { useState } from "react";
import { Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { BARS, cheapestBar, choose, expectedBest, fits, kfold, nestedFits, reduction, tally, totalCost } from "./ms-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const pct = (v: number) => `${fmt(v * 100, 0)}%`;

/* ── MS01 ── */
export function FairPlayground() {
  const [base, setBase] = useState(12), [cand, setCand] = useState(9), [rows, setRows] = useState(1), [metric, setMetric] = useState(1), [budget, setBudget] = useState(1);
  const fair = rows && metric && budget;
  return (
    <Playground id="ms-fair" title="Is it the same race for everyone?" intro={<>Baseline error is 12 thousand credits and the candidate's is 9. Before trusting the gap, check that both ran the same course: same homes, same ruler, same tuning effort.</>}
      note="A 25% error reduction is not a 25-point gain in accuracy. The units belong to the target.">
      <Grid>
        <Figure caption={fair ? "The comparison is fair on all three counts." : "The comparison is not fair yet, so the gap tells you little."}><p>{fair ? "The comparison is fair on all three counts." : "The comparison is not fair yet, so the gap tells you little."}</p></Figure>
        <Controls><Field label="Baseline error" min={1} max={20} step={1} value={base} onChange={setBase} /><Field label="Candidate error" min={1} max={20} step={1} value={cand} onChange={setCand} /><Field label="Same validation homes? (0 no, 1 yes)" min={0} max={1} step={1} value={rows} onChange={setRows} /><Field label="Same metric? (0 no, 1 yes)" min={0} max={1} step={1} value={metric} onChange={setMetric} /><Field label="Same tuning effort? (0 no, 1 yes)" min={0} max={1} step={1} value={budget} onChange={setBudget} /></Controls>
      </Grid>
      <Readout items={[["Error reduction vs the baseline", pct(reduction(base, cand))], ["Comparison", fair ? "fair" : "not fair"], ["What is missing", [!rows && "same homes", !metric && "same metric", !budget && "same tuning effort"].filter(Boolean).join(", ") || "nothing"]]} />
    </Playground>
  );
}

/* ── MS02 ── */
export function SearchPlayground() {
  const [c, setC] = useState(3), [g, setG] = useState(2), [k, setK] = useState(3), n = c * g;
  return (
    <Playground id="ms-search" title="Every try costs something" intro={<>A grid search fits every combination on every fold. The more combinations you try, the better the best one looks by luck alone, even if all of them are equally good.</>}
      note="Report how many candidates you tried, and keep all of them inside the same development data. The final test is touched once.">
      <Grid>
        <Figure caption={`${c} × ${g} × ${k} = ${fits(c, g, k)} fits before the final refit.`}><p>{`${c} × ${g} × ${k} = ${fits(c, g, k)} fits before the final refit.`}</p></Figure>
        <Controls><Field label="Values of C" min={1} max={8} step={1} value={c} onChange={setC} /><Field label="Values of gamma" min={1} max={8} step={1} value={g} onChange={setG} /><Field label="Folds" min={2} max={10} step={1} value={k} onChange={setK} /></Controls>
      </Grid>
      <Readout items={[["Candidate settings", String(n)], ["Fits to run (before the refit)", String(fits(c, g, k))], ["Typical luck bonus for the best of them", `${fmt(expectedBest(n), 2)} score wobbles above an average candidate`]]} />
    </Playground>
  );
}

/* ── MS03 ── */
export function NestedPlayground() {
  const [outer, setOuter] = useState(3), [inner, setInner] = useState(2), [cand, setCand] = useState(4), folds = kfold(12, outer);
  const caption = `${outer} outer folds each run their own ${inner}-fold search over ${cand} candidates: ${nestedFits(outer, inner, cand)} fits in total.`;
  return (
    <Playground id="ms-nested" title="A search inside every outer fold" intro={<>The outer folds judge the whole procedure, search included. Inside each outer training set the search runs again on its own inner folds, and the outer test fold stays untouched.</>}
      note="The outer score grades the selection procedure. It is not the score of the single final model later refit on all development rows.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 12]} yDomain={[0, outer + 1]} xTicks={[]} yTicks={[]} xLabel="12 development rows" yLabel="one row per outer fold">
            {(sx, sy) => <>{folds.map((idx, f) => Array.from({ length: 12 }, (_, r) => <rect key={`${f}-${r}`} x={sx(r) + 1} y={sy(f + 1) + 2} width={sx(1) - sx(0) - 2} height={sy(0) - sy(1) - 4} fill={idx.includes(r) ? ORANGE : TEAL} opacity={idx.includes(r) ? 0.9 : 0.35} />))}</>}
          </Chart>
        </Figure>
        <Controls><Field label="Outer folds" min={2} max={6} step={1} value={outer} onChange={setOuter} /><Field label="Inner folds" min={2} max={5} step={1} value={inner} onChange={setInner} /><Field label="Candidates" min={1} max={10} step={1} value={cand} onChange={setCand} /></Controls>
      </Grid>
      <Readout items={[["Searches run", `${outer}, one per outer fold`], ["Fits in total (including one refit per outer fold)", String(nestedFits(outer, inner, cand))], ["Orange cells", "the outer test rows, never used for choosing"]]} />
    </Playground>
  );
}

/* ── MS04 ── */
export function CostPlayground() {
  const [t, setT] = useState(0.5), [cfp, setCfp] = useState(1), [cfn, setCfn] = useState(10), r = tally(t), best = cheapestBar(cfp, cfn), rb = tally(best);
  const costs = BARS.map(x => { const q = tally(x); return totalCost(q.fp, q.fn, cfp, cfn); });
  const top = Math.max(...costs, 1), caption = `At a ${pct(t)} bar the total cost is ${totalCost(r.fp, r.fn, cfp, cfn)}. The cheapest bar is ${pct(best)}.`;
  return (
    <Playground id="ms-cost" title="Choose the bar by what mistakes cost" intro={<>Twenty customers with a chance of leaving. Missing a leaver and bothering a loyal customer have different prices. Slide the bar and watch the total.</>}
      note="The cheapest bar is often not the one with the best accuracy. Set the costs with the people who will pay them.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 1]} yDomain={[0, top * 1.1]} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[0, Math.round(top / 2), top]} xLabel="action bar" yLabel="total cost">
            {(sx, sy) => <><polyline fill="none" stroke={TEAL} strokeWidth={2.5} points={BARS.map((x, i) => `${sx(x)},${sy(costs[i])}`).join(" ")} /><circle cx={sx(t)} cy={sy(totalCost(r.fp, r.fn, cfp, cfn))} r={6} fill={ORANGE} /><line x1={sx(best)} x2={sx(best)} y1={sy(0)} y2={sy(top * 1.1)} stroke={INK} strokeDasharray="4 4" /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Action bar" min={0.05} max={0.95} step={0.05} value={t} onChange={setT} display={pct(t)} /><Field label="Cost of a wasted call" min={1} max={20} step={1} value={cfp} onChange={setCfp} /><Field label="Cost of a missed leaver" min={1} max={20} step={1} value={cfn} onChange={setCfn} /></Controls>
      </Grid>
      <Readout items={[["Wasted calls and missed leavers", `${r.fp} and ${r.fn}`], ["Total cost at this bar", String(totalCost(r.fp, r.fn, cfp, cfn))], ["Accuracy at this bar", pct(r.accuracy)], ["Cheapest bar", `${pct(best)} (cost ${totalCost(rb.fp, rb.fn, cfp, cfn)}, accuracy ${pct(rb.accuracy)})`]]} />
    </Playground>
  );
}

/* ── MS05 ── */
export function ReliancePlayground() {
  const [base, setBase] = useState(0.8), [after, setAfter] = useState(0.68), [twin, setTwin] = useState(0);
  return (
    <Playground id="ms-reliance" title="What does a drop in score really say?" intro={<>Shuffle one column among unseen customers and the score falls from 0.80 to 0.68. That drop shows how much this model, on this sample, leaned on the column.</>}
      note="A 0.12 drop is predictive reliance, not a 12% causal effect. A near-copy of the column elsewhere in the model can hide its importance.">
      <Grid>
        <Figure caption={`Score before ${fmt(base, 2)}, after shuffling ${fmt(after, 2)}.`}><p>{`Score before ${fmt(base, 2)}, after shuffling ${fmt(after, 2)}.`}</p></Figure>
        <Controls><Field label="Score before shuffling" min={0.5} max={1} step={0.01} value={base} onChange={setBase} /><Field label="Score after shuffling" min={0.4} max={1} step={0.01} value={after} onChange={setAfter} /><Field label="Is a near-copy of the column also in the model? (0 no, 1 yes)" min={0} max={1} step={1} value={twin} onChange={setTwin} /></Controls>
      </Grid>
      <Readout items={[["Drop in score", fmt(base - after, 2)], ["What it means", "the model leaned on this column; it does not say what changing a customer would do"], ["Caution", twin ? "a near-copy can cover for the column, so the drop may understate its role" : "none flagged"]]} />
    </Playground>
  );
}

/* ── MS06 ── */
export function DecidePlayground() {
  const [simple, setSimple] = useState(0.82), [gap, setGap] = useState(0.01), [tol, setTol] = useState(0.02), [seed, setSeed] = useState(1), [data, setData] = useState(1), [metric, setMetric] = useState(1);
  const pick = choose(simple, simple + gap, tol), recorded = seed + data + metric;
  return (
    <Playground id="ms-decide" title="Is the extra complexity worth it?" intro={<>A small tree scores 0.82. A forest scores a little higher but costs more and is harder to explain. Decide how much improvement you would pay for, then see which one the rule picks.</>}
      note="This is a template for writing the decision down, not an automatic answer. If the task's mistakes are expensive, the tolerance should be small.">
      <Grid>
        <Figure caption={`The forest is ahead by ${fmt(gap, 2)}; you would pay for up to ${fmt(tol, 2)}.`}><p>{`The forest is ahead by ${fmt(gap, 2)}; you would pay for up to ${fmt(tol, 2)}.`}</p></Figure>
        <Controls><Field label="Small tree's score" min={0.5} max={0.95} step={0.01} value={simple} onChange={setSimple} /><Field label="Forest's lead" min={0} max={0.1} step={0.01} value={gap} onChange={setGap} /><Field label="Lead you would pay for" min={0} max={0.1} step={0.01} value={tol} onChange={setTol} /><Field label="Seed recorded? (0 no, 1 yes)" min={0} max={1} step={1} value={seed} onChange={setSeed} /><Field label="Data version recorded? (0 no, 1 yes)" min={0} max={1} step={1} value={data} onChange={setData} /><Field label="Metric and threshold recorded? (0 no, 1 yes)" min={0} max={1} step={1} value={metric} onChange={setMetric} /></Controls>
      </Grid>
      <Readout items={[["Choice by this rule", pick === "simple" ? "the small tree" : "the forest"], ["Forest's score", fmt(simple + gap, 2)], ["Reproducible?", recorded === 3 ? "yes, everything needed is recorded" : `not yet: ${3 - recorded} item${3 - recorded === 1 ? "" : "s"} missing`]]} />
    </Playground>
  );
}
