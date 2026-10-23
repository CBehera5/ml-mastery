"use client";
import { useState } from "react";
import { Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { FEATURES, IDS, TRAIN_PTS, VALID_PTS, bagStats, bootstrap, fitForest, forestMse, forestPredict, hardVote, mean, meanProba, meanUniqueShare, oobMse, oobPredict, permutationDrop, treeMse } from "./rf-math";
import { predictTree } from "../../decision-trees/playground/dt-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const pct = (v: number) => `${fmt(v * 100, 0)}%`;
const xs = Array.from({ length: 91 }, (_, i) => 1 + i * 0.1);

/* ── RF01 · every tree sees its own bag ── */
export function BagPlayground() {
  const [tree, setTree] = useState(1), draw = bootstrap(8, 40 + tree), s = bagStats(draw, 8);
  const caption = `Tree ${tree} drew ${draw.length} times and saw ${s.unique} different houses. ${s.oob.length ? `${s.oob.map(i => IDS[i]).join(", ")} stayed out.` : "Every house got in."}`;
  return (
    <Playground id="rf-bag" title="Each tree gets its own bag of houses" intro={<>A forest only helps if its trees disagree a little. Each tree draws from the houses with replacement, so some houses appear twice and some not at all. Step through the trees.</>}
      note="Some houses are left out of each bag. Those are that tree's out-of-bag houses, and they become useful again in lesson 4.">
      <Grid>
        <Figure caption={caption}>
          <svg role="img" aria-label={caption} viewBox="0 0 400 110" style={{ width: "100%", maxWidth: 460 }}>
            {IDS.map((id, i) => { const c = s.counts[i]; return <g key={id}><rect x={8 + i * 48} y={14} width={40} height={64} rx={6} fill={c ? TEAL : GREY} opacity={c ? 0.25 + 0.25 * Math.min(c, 3) : 0.2} /><text x={28 + i * 48} y={36} textAnchor="middle" fontSize="16" fill={INK}>{id}</text><text x={28 + i * 48} y={62} textAnchor="middle" fontSize="14" fill={INK}>{c ? `×${c}` : "out"}</text></g>; })}
            <text x={8} y={102} fontSize="12" fill={INK}>{draw.map(i => IDS[i]).join(" ")}</text>
          </svg>
        </Figure>
        <Controls><Field label="Tree number" min={1} max={6} step={1} value={tree} onChange={setTree} /></Controls>
      </Grid>
      <Readout items={[["Draws", String(draw.length)], ["Different houses seen", String(s.unique)], ["Left out (out-of-bag)", s.oob.length ? s.oob.map(i => IDS[i]).join(", ") : "none"], ["Typical share of houses in a bag", pct(meanUniqueShare(8, 300))]]} />
    </Playground>
  );
}

/* ── RF02 · average many trees ── */
export function AveragePlayground() {
  const [t, setT] = useState(10), f = fitForest(TRAIN_PTS, t);
  const fm = forestMse(f, VALID_PTS), singles = f.trees.map((_, i) => treeMse(f, i, VALID_PTS));
  const caption = `${t} tree${t > 1 ? "s" : ""}: the average has error ${fmt(fm, 2)} on unseen houses; the typical single tree has ${fmt(mean(singles), 2)}.`;
  return (
    <Playground id="rf-average" title="Many wobbly trees, one steadier answer" intro={<>Every tree here is a deep one fitted to its own bag of houses. Alone each follows the quirks of its bag. Add trees and watch the average smooth out.</>}
      note="The spread between trees is not a prediction interval. It shows disagreement among the trees, not a range that will hold 95% of the time.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0.5, 10.5]} yDomain={[-1, 14]} xTicks={[2, 4, 6, 8, 10]} yTicks={[0, 5, 10]} xLabel="area" yLabel="price (₹10 lakh)">
            {(sx, sy) => <>
              {VALID_PTS.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={3} fill="none" stroke={GREY} />)}
              {f.trees.slice(0, 12).map((tr, k) => <polyline key={k} fill="none" stroke={TEAL} strokeOpacity={0.25} strokeWidth={1.2} points={xs.map(x => `${sx(x)},${sy(predictTree(tr, x))}`).join(" ")} />)}
              <polyline fill="none" stroke={ORANGE} strokeWidth={3} points={xs.map(x => `${sx(x)},${sy(forestPredict(f, x))}`).join(" ")} />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Number of trees" min={1} max={50} step={1} value={t} onChange={setT} /></Controls>
      </Grid>
      <Readout items={[["Forest error on unseen houses", fmt(fm, 2)], ["Typical single-tree error", fmt(mean(singles), 2)], ["Best and worst single tree", `${fmt(Math.min(...singles), 2)} and ${fmt(Math.max(...singles), 2)}`]]} />
    </Playground>
  );
}

/* ── RF03 · average the chances, not the votes ── */
export function VotePlayground() {
  const [a, setA] = useState(0.4), [b, setB] = useState(0.4), [c, setC] = useState(0.9), ps = [a, b, c];
  const mp = meanProba(ps), hv = hardVote(ps), fp = mp >= 0.5 ? 1 : 0;
  const caption = `Chances ${ps.map(p => pct(p)).join(", ")} average to ${pct(mp)}, so the forest says ${fp ? "will leave" : "will stay"}. A show of hands says ${hv ? "will leave" : "will stay"}.`;
  return (
    <Playground id="rf-vote" title="Average the chances, don't count hands" intro={<>Three trees each give a chance that this customer leaves. A forest averages those chances. Counting each tree's yes or no is a different rule and can disagree.</>}
      note="Averaging keeps how sure each tree was. A tree at 90% should count for more than two trees at 40%.">
      <Grid>
        <Figure caption={caption}>
          <svg role="img" aria-label={caption} viewBox="0 0 330 120" style={{ width: "100%", maxWidth: 380 }}>
            {ps.map((p, i) => <g key={i}><rect x={20 + i * 80} y={100 - 90 * p} width={50} height={90 * p} fill={TEAL} opacity={0.6} /><text x={45 + i * 80} y={114} textAnchor="middle" fontSize="11" fill={INK}>tree {i + 1}</text></g>)}
            <line x1={10} x2={320} y1={100 - 90 * mp} y2={100 - 90 * mp} stroke={ORANGE} strokeWidth={2} /><text x={322} y={104 - 90 * mp} fontSize="11" fill={INK} textAnchor="end">average {pct(mp)}</text>
          </svg>
        </Figure>
        <Controls><Field label="Tree 1: chance of leaving" min={0} max={1} step={0.05} value={a} onChange={setA} display={pct(a)} /><Field label="Tree 2: chance of leaving" min={0} max={1} step={0.05} value={b} onChange={setB} display={pct(b)} /><Field label="Tree 3: chance of leaving" min={0} max={1} step={0.05} value={c} onChange={setC} display={pct(c)} /></Controls>
      </Grid>
      <Readout items={[["Average chance of leaving", pct(mp)], ["Forest says", fp ? "leaves" : "stays"], ["A show of hands says", hv ? "leaves" : "stays"]]} />
    </Playground>
  );
}

/* ── RF04 · out-of-bag ── */
export function OobPlayground() {
  const [t, setT] = useState(25), [row, setRow] = useState(8), f = fitForest(TRAIN_PTS, t), o = oobMse(f, TRAIN_PTS), fm = forestMse(f, VALID_PTS), one = oobPredict(f, TRAIN_PTS, row - 1);
  const caption = `${t} trees: out-of-bag error ${fmt(o.mse, 2)} on ${o.rows} rows, error on a separate set of houses ${fmt(fm, 2)}.`;
  return (
    <Playground id="rf-oob" title="Grade each house only with trees that never saw it" intro={<>A tree can fairly predict only the houses missing from its bag. Averaging just those trees for every house gives an error estimate without setting any data aside.</>}
      note="With only 24 training houses this estimate is rough, and here it is stricter than the error on the separate houses. A house included in every bag has no out-of-bag answer at all.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0.5, 10.5]} yDomain={[-1, 14]} xTicks={[2, 4, 6, 8, 10]} yTicks={[0, 5, 10]} xLabel="area" yLabel="price (₹10 lakh)">
            {(sx, sy) => <>{TRAIN_PTS.map(([x, y], i) => { const p = oobPredict(f, TRAIN_PTS, i); return <g key={i}>{Number.isFinite(p.prediction) && <line x1={sx(x)} x2={sx(x)} y1={sy(y)} y2={sy(p.prediction)} stroke={i === row - 1 ? ORANGE : GREY} />}<circle cx={sx(x)} cy={sy(y)} r={i === row - 1 ? 5.5 : 3.5} fill={i === row - 1 ? ORANGE : TEAL} /></g>; })}</>}
          </Chart>
        </Figure>
        <Controls><Field label="Number of trees" min={1} max={50} step={1} value={t} onChange={setT} /><Field label="Inspect house number" min={1} max={24} step={1} value={row} onChange={setRow} /></Controls>
      </Grid>
      <Readout items={[["Out-of-bag error", `${fmt(o.mse, 2)} (${o.rows} rows)`], ["Error on separate houses", fmt(fm, 2)], ["Houses with no out-of-bag tree", String(o.missing)], [`House ${row}: trees that skipped it`, one.n ? `${one.n} of ${t}, average ${fmt(one.prediction, 1)} vs actual ${fmt(TRAIN_PTS[row - 1][1], 1)}` : "none: no answer"]]} />
    </Playground>
  );
}

/* ── RF05 · permutation importance ── */
export function ImportancePlayground() {
  const [f, setF] = useState(0), r = FEATURES.map((_, i) => permutationDrop(i)), cur = r[f];
  const caption = `Shuffling ${FEATURES[f]} moves accuracy from ${pct(cur.base)} to ${pct(cur.permuted)}, a change of ${fmt(cur.drop * 100, 1)} points.`;
  return (
    <Playground id="rf-importance" title="Break one column and see what it costs" intro={<>Shuffle one feature among the unseen customers so it no longer matches anybody, then measure how much accuracy falls. A feature the forest relied on will hurt when scrambled. One it ignored will not.</>}
      note="This measures what the forest used, not what causes churn. It can even come out slightly negative by chance, which just means the column did nothing.">
      <Grid>
        <Figure caption={caption}>
          <svg role="img" aria-label={caption} viewBox="0 0 360 150" style={{ width: "100%", maxWidth: 420 }}>
            <line x1={120} x2={120} y1={10} y2={130} stroke={GREY} />
            {r.map((x, i) => <g key={i}><text x={112} y={36 + i * 38} textAnchor="end" fontSize="12" fill={INK}>{FEATURES[i]}</text><rect x={x.drop >= 0 ? 120 : 120 + x.drop * 600} y={20 + i * 38} width={Math.abs(x.drop) * 600} height={24} fill={i === f ? ORANGE : TEAL} opacity={0.75} /><text x={x.drop >= 0 ? 126 + x.drop * 600 : 114 + x.drop * 600} y={37 + i * 38} textAnchor={x.drop >= 0 ? "start" : "end"} fontSize="11" fill={INK}>{fmt(x.drop * 100, 1)}</text></g>)}
          </svg>
        </Figure>
        <Controls><Field label="Column to shuffle (1 to 3)" min={1} max={3} step={1} value={f + 1} onChange={v => setF(v - 1)} display={FEATURES[f]} /></Controls>
      </Grid>
      <Readout items={[["Accuracy on unseen customers", pct(cur.base)], [`Accuracy with ${FEATURES[f]} shuffled`, pct(cur.permuted)], ["Drop in accuracy (points)", fmt(cur.drop * 100, 1)]]} />
    </Playground>
  );
}
