"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { CUSTS, HELD, HOUSES, TARGETS, TOWN_A, TOWN_B, TRAIN_PTS, VALID_PTS, aligned, bestCut, bestSplit, covers, giniGain, grow, heldAccuracy, leavesOf, mean, misaligned, mse, predictTree, shareOf, splitAt, stump2 } from "./dt-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const pct = (v: number) => (Number.isFinite(v) ? `${fmt(v * 100, 0)}%` : "undefined");

/* ── DT01 · a tree is a flowchart ── */
export function PartitionPlayground() {
  const [t1, setT1] = useState(2), [t2, setT2] = useState(5), [q, setQ] = useState(4);
  const lo = Math.min(t1, t2), hi = Math.max(t1, t2), s = stump2(lo, hi, q);
  const caption = `A house of area ${fmt(q, 1)} follows ${s.path.join(", then ")} and is priced at ${fmt(s.prediction, 1)}.`;
  return (
    <Playground id="dt-partition" title="Follow a house down the tree" intro={<>A tree asks one yes-or-no question at a time. Each answer sends the house down a branch until it lands in a group whose average price becomes the prediction. Slide the query house and the two cut points.</>}
      note="Training chooses the cut points. Prediction only follows them, so moving the query never changes the tree.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 8]} yDomain={[0, 11]} xTicks={[0, 2, 4, 6, 8]} yTicks={[0, 5, 10]} xLabel="area" yLabel="price (₹10 lakh)">
            {(sx, sy) => <>
              {[[0, lo, s.leaves[0]], [lo, hi, s.leaves[1]], [hi, 8, s.leaves[2]]].map(([a, b, v], i) => <line key={i} x1={sx(a)} x2={sx(b)} y1={sy(v)} y2={sy(v)} stroke={i === s.region ? ORANGE : GREY} strokeWidth={i === s.region ? 4 : 2} />)}
              {[lo, hi].map(c => <line key={c} x1={sx(c + 0.5)} x2={sx(c + 0.5)} y1={sy(0)} y2={sy(11)} stroke={GREY} strokeDasharray="4 4" />)}
              {HOUSES.map(([a, p]) => <circle key={a} cx={sx(a)} cy={sy(p)} r={4} fill={TEAL} />)}
              <line x1={sx(q)} x2={sx(q)} y1={sy(0)} y2={sy(11)} stroke={ORANGE} strokeWidth={1.5} />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Query house area" min={0.5} max={7.5} step={0.5} value={q} onChange={setQ} /><Field label="First cut: area ≤" min={1} max={4} step={1} value={t1} onChange={setT1} /><Field label="Second cut: area ≤" min={3} max={6} step={1} value={t2} onChange={setT2} /></Controls>
      </Grid>
      <Readout items={[["Questions asked", s.path.join(" → ")], ["Group average = prediction", `${fmt(s.prediction, 1)} (₹10 lakh)`], ["Group averages, left to right", s.leaves.map(v => fmt(v, 1)).join(" · ")]]} />
    </Playground>
  );
}

/* ── DT02 · regression leaves ── */
export function SplitPlayground() {
  const [k, setK] = useState(2), ys = [...TARGETS], r = splitAt(ys, k), best = bestSplit(ys);
  const caption = `Cutting after house ${k} leaves squared error ${fmt(r.child, 1)} from ${fmt(r.parent, 1)}, a drop of ${fmt(r.reduction, 1)}.`;
  return (
    <Playground id="dt-split" title="Where should the tree cut the prices?" intro={<>Eight houses sorted by area. A cut splits them into a left and right group. Each group predicts its own average, and the tree wants the cut that leaves the least squared error behind.</>}
      actions={<Btn onClick={() => setK(best)}>Jump to the best cut</Btn>}
      note="The leaf predicts the group average, not the cut point. A house far outside the data still gets the average of the group it reaches.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 9]} yDomain={[0, 11]} xTicks={[1, 2, 3, 4, 5, 6, 7, 8]} yTicks={[0, 5, 10]} xLabel="houses, sorted by area" yLabel="price (₹10 lakh)">
            {(sx, sy) => <>
              <line x1={sx(0.5)} x2={sx(k + 0.5)} y1={sy(r.leftMean)} y2={sy(r.leftMean)} stroke={ORANGE} strokeWidth={3} /><line x1={sx(k + 0.5)} x2={sx(8.5)} y1={sy(r.rightMean)} y2={sy(r.rightMean)} stroke={ORANGE} strokeWidth={3} />
              <line x1={sx(k + 0.5)} x2={sx(k + 0.5)} y1={sy(0)} y2={sy(11)} stroke={GREY} strokeDasharray="4 4" />
              {ys.map((y, i) => <circle key={i} cx={sx(i + 1)} cy={sy(y)} r={4.5} fill={TEAL} />)}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Cut after house number" min={1} max={7} step={1} value={k} onChange={setK} /></Controls>
      </Grid>
      <Readout items={[["Error before the cut", fmt(r.parent, 1)], ["Error after the cut", fmt(r.child, 1)], ["Error removed", fmt(r.reduction, 1)], ["Best cut for these houses", `after house ${best} (removes ${fmt(splitAt(ys, best).reduction, 1)})`]]} />
    </Playground>
  );
}

/* ── DT03 · Gini ── */
export function GiniPlayground() {
  const [ls, setLs] = useState(3), [lc, setLc] = useState(0), [rs, setRs] = useState(1), [rc, setRc] = useState(2);
  const g = giniGain([ls, lc], [rs, rc]);
  const caption = `Mixing before the split ${fmt(g.parentGini, 3)}, after ${fmt(g.weighted, 3)}. Gain ${fmt(g.gain, 3)}.`;
  const Bar = ({ x, n, c, label }: { x: number; n: number; c: number; label: string }) => { const tot = Math.max(n + c, 1); return <><rect x={x} y={20} width={170} height={28} fill={GREY} opacity={0.35} /><rect x={x} y={20} width={170 * (c / tot)} height={28} fill={ORANGE} /><text x={x} y={14} fontSize="12" fill={INK}>{label}: {n} stay · {c} leave</text></>; };
  return (
    <Playground id="dt-gini" title="How mixed is each group?" intro={<>A classification tree wants groups that are mostly one answer. Gini is a number for how mixed a group is: 0 for pure, 0.5 for an even split. Set the customer counts in each branch.</>}
      note="The gain weights each branch by its size. A tiny pure branch does not rescue a large messy one.">
      <Grid>
        <Figure caption={caption}>
          <svg role="img" aria-label={caption} viewBox="0 0 380 70" style={{ width: "100%", maxWidth: 420 }}><Bar x={5} n={ls} c={lc} label="Left" /><Bar x={205} n={rs} c={rc} label="Right" /></svg>
        </Figure>
        <Controls><Field label="Left: stayed" min={0} max={6} step={1} value={ls} onChange={setLs} /><Field label="Left: left us" min={0} max={6} step={1} value={lc} onChange={setLc} /><Field label="Right: stayed" min={0} max={6} step={1} value={rs} onChange={setRs} /><Field label="Right: left us" min={0} max={6} step={1} value={rc} onChange={setRc} /></Controls>
      </Grid>
      <Readout items={[["Before the split (stayed, left)", `${g.parent[0]}, ${g.parent[1]} · Gini ${fmt(g.parentGini, 3)}`], ["After, weighted by size", fmt(g.weighted, 3)], ["Gain", fmt(g.gain, 3)]]} />
    </Playground>
  );
}

/* ── DT04 · depth ── */
export function DepthPlayground() {
  const [d, setD] = useState(1), [ml, setMl] = useState(1);
  const tree = grow(TRAIN_PTS, d, ml), tr = mse(tree, TRAIN_PTS), va = mse(tree, VALID_PTS);
  const rows = [0, 1, 2, 3, 4, 5].map(depth => { const t = grow(TRAIN_PTS, depth, ml); return { depth, tr: mse(t, TRAIN_PTS), va: mse(t, VALID_PTS) }; });
  const bestDepth = rows.reduce((a, b) => (b.va < a.va ? b : a)).depth;
  const caption = `Depth ${d}, at least ${ml} house${ml > 1 ? "s" : ""} per leaf: ${leavesOf(tree)} leaves. Error on training houses ${fmt(tr, 2)}, on unseen houses ${fmt(va, 2)}.`;
  const xs = Array.from({ length: 91 }, (_, i) => 1 + i * 0.1);
  return (
    <Playground id="dt-depth" title="Let the tree grow, then test it on new houses" intro={<>Deeper trees can chase every wobble in the training prices. Compare the error on the houses it learned from with the error on houses it has never seen.</>}
      note="Training error can only fall as depth grows. The unseen-house error is the one to trust, and it can turn upward.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0.5, 10.5]} yDomain={[-1, 14]} xTicks={[2, 4, 6, 8, 10]} yTicks={[0, 5, 10]} xLabel="area" yLabel="price (₹10 lakh)">
            {(sx, sy) => <>
              {VALID_PTS.map(([x, y], i) => <circle key={`v${i}`} cx={sx(x)} cy={sy(y)} r={3} fill="none" stroke={GREY} />)}
              {TRAIN_PTS.map(([x, y], i) => <circle key={`t${i}`} cx={sx(x)} cy={sy(y)} r={3.5} fill={TEAL} />)}
              <polyline fill="none" stroke={ORANGE} strokeWidth={2.5} points={xs.map(x => `${sx(x)},${sy(predictTree(tree, x))}`).join(" ")} />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Tree depth" min={0} max={5} step={1} value={d} onChange={setD} /><Field label="Fewest houses per leaf" min={1} max={4} step={1} value={ml} onChange={setMl} /></Controls>
      </Grid>
      <Readout items={[["Leaves", String(leavesOf(tree))], ["Error on training houses", fmt(tr, 2)], ["Error on unseen houses", fmt(va, 2)], ["Depth with the lowest unseen error", String(bestDepth)]]} />
    </Playground>
  );
}

/* ── DT05 · fit safely ── */
export function AlignPlayground() {
  const [mixed, setMixed] = useState(false);
  const { bills, labels } = mixed ? misaligned() : aligned(), fit = bestCut(bills, labels), held = heldAccuracy(fit.cut);
  const caption = mixed ? "The bills were sorted but the labels were not, so every label now sits next to someone else's bill." : "Each label still sits next to its own customer's bill.";
  return (
    <Playground id="dt-align" title="Did every label stay with its customer?" intro={<>Eight customers, each with a monthly bill and whether they left. Sort only the feature table and the rows no longer match the labels. The tree still fits without complaint.</>}
      actions={<Btn primary onClick={() => setMixed(!mixed)}>{mixed ? "Rejoin by customer id" : "Sort the bills but not the labels"}</Btn>}
      note="Join features and labels by customer id, never by position. Fit any imputer or pruning choice inside training data only.">
      <Grid>
        <Figure caption={caption}>
          <table aria-label={caption}><thead><tr><th scope="col">Row</th><th scope="col">Bill (₹)</th><th scope="col">Left us?</th></tr></thead>
            <tbody>{bills.map((b, i) => <tr key={i}><th scope="row">{i + 1}</th><td>{b}</td><td>{labels[i] ? "yes" : "no"}</td></tr>)}</tbody></table>
        </Figure>
        <Controls><p>{caption}</p></Controls>
      </Grid>
      <Readout items={[["Best bill cut found", `₹${fit.cut}`], ["Accuracy on the rows it trained on", pct(fit.trainAccuracy)], ["Accuracy on 8 new customers", pct(held)]]} />
    </Playground>
  );
}

/* ── DT06 · rules and limits ── */
export function RulePlayground() {
  const [area, setArea] = useState(2), [age, setAge] = useState(10), [town, setTown] = useState<"A" | "B">("A");
  const rows = town === "A" ? TOWN_A : TOWN_B, hit = covers(rows, area, age), share = hit.length / rows.length;
  const reductions = { area: 8, age: 2 };
  const caption = `The rule "area ≤ ${area} and age > ${age}" matches ${hit.length} of ${rows.length} houses in town ${town}.`;
  return (
    <Playground id="dt-rule" title="What does this rule actually cover?" intro={<>A tree's path reads like a rule. The rule describes which houses it fits today. It does not say that changing a house would change its price, and it may cover very few houses somewhere else.</>}
      actions={<Btn onClick={() => setTown(town === "A" ? "B" : "A")}>{town === "A" ? "Try it on town B" : "Back to town A"}</Btn>}
      note="Importance of 0.8 for area means area earned 80% of the tree's error reduction on the training houses. It is not an 80% cause.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 11]} yDomain={[0, 22]} xTicks={[0, 2, 4, 6, 8, 10]} yTicks={[0, 10, 20]} xLabel="area" yLabel="house age (years)">
            {(sx, sy) => <>
              <rect x={sx(0)} y={sy(22)} width={sx(area) - sx(0)} height={sy(age) - sy(22)} fill={ORANGE} opacity={0.18} />
              {rows.map((h, i) => <circle key={i} cx={sx(h.area)} cy={sy(h.age)} r={4} fill={h.area <= area && h.age > age ? ORANGE : TEAL} />)}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Area at most" min={1} max={10} step={0.5} value={area} onChange={setArea} /><Field label="Age more than (years)" min={0} max={20} step={1} value={age} onChange={setAge} /></Controls>
      </Grid>
      <Readout items={[["Houses the rule covers", `${hit.length} of ${rows.length} (${pct(share)})`], ["Their average price", hit.length ? `${fmt(mean(hit.map(h => h.price)), 1)} (₹10 lakh)` : "no houses"], ["Share of error reduction from area", pct(shareOf(reductions, "area"))]]} />
    </Playground>
  );
}
