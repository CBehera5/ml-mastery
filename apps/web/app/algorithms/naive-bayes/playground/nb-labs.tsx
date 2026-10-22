"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { ALPHAS, GOOD_COUNTS, NEEDS_COUNTS, TOKENS, brier, gaussian, gaussianPosterior, logLoss, posterior, smoothed, wrongLeanPNeeds } from "./nb-math";

const GOOD = "#1f7568", NEEDS = "#e36c28", INK = "#16211c";
const pct = (v: number) => (Number.isFinite(v) ? `${fmt(v * 100, 1)}%` : "undefined");

/* ── NB01 · prior × evidence ── */
export function EvidencePlayground() {
  const [prior, setPrior] = useState(60), [lg, setLg] = useState(50), [ln, setLn] = useState(25);
  const r = posterior(prior / 100, lg / 100, ln / 100);
  const caption = `After seeing a runnable example, we believe this page is ${pct(r.pGood)} likely to be Good.`;
  return (
    <Playground id="nb-evidence" title="Start with what is common, then weigh the evidence" intro={<>A reviewer is about to read a documentation page. Before looking, {prior}% of pages in the team's history were <strong>Good</strong>. Then we notice the page has a runnable code example. Good pages include one {lg}% of the time; pages that Need Improvement include one {ln}% of the time. How much should that change our mind?</>}
      actions={<><Btn onClick={() => { setPrior(60); setLg(50); setLn(25); }}>The worked example</Btn><Btn onClick={() => { setPrior(10); setLg(50); setLn(25); }}>Good pages are rare</Btn><Btn onClick={() => { setPrior(60); setLg(40); setLn(40); }}>Evidence that says nothing</Btn></>}
      note="Multiply how common each class is by how well the evidence fits it, then rescale so the two add to 100%. The same evidence moves you less when the class was rare to begin with. And the 50% chance of an example among Good pages is not the 75% chance the page is Good.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 4]} yDomain={[0, Math.max(0.1, r.good, r.needs) * 1.15]} xTicks={[]} yTicks={[]} xLabel="Good  ·  Needs Improvement" yLabel="prior × evidence">
            {(sx, sy) => <>
              <rect x={sx(0.5)} y={sy(r.good)} width={sx(1.5) - sx(0.5)} height={sy(0) - sy(r.good)} fill={GOOD} /><rect x={sx(2.5)} y={sy(r.needs)} width={sx(3.5) - sx(2.5)} height={sy(0) - sy(r.needs)} fill={NEEDS} />
              <text x={sx(1)} y={sy(r.good) - 6} textAnchor="middle" fontSize="12" fill={INK}>{fmt(r.good, 3)}</text><text x={sx(3)} y={sy(r.needs) - 6} textAnchor="middle" fontSize="12" fill={INK}>{fmt(r.needs, 3)}</text>
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Share of Good pages (prior)" min={5} max={95} step={5} value={prior} onChange={setPrior} display={`${prior}%`} />
          <Field label="Good pages with an example" min={5} max={95} step={5} value={lg} onChange={setLg} display={`${lg}%`} />
          <Field label="Needs Improvement with an example" min={5} max={95} step={5} value={ln} onChange={setLn} display={`${ln}%`} />
        </Controls>
      </Grid>
      <Readout items={[["Good: prior × evidence", fmt(r.good, 3)], ["Needs Improvement: prior × evidence", fmt(r.needs, 3)], ["Chance the page is Good", pct(r.pGood)]]} />
    </Playground>
  );
}

/* ── NB02 · counts and smoothing ── */
export function SmoothingPlayground() {
  const [i, setI] = useState(2), alpha = ALPHAS[i];
  const good = smoothed(GOOD_COUNTS, alpha), needs = smoothed(NEEDS_COUNTS, alpha);
  const dep = TOKENS.indexOf("deprecated"), r = posterior(0.5, good[dep], needs[dep]);
  const caption = alpha === 0 ? "With no smoothing, a word never seen in a class gets probability 0 and wipes that class out for every page that contains it." : `Every word gets ${alpha} extra pretend count, so a word not yet seen is rare, not impossible.`;
  return (
    <Playground id="nb-smooth" title="A word you have never seen is not impossible" intro={<>The team has read only 10 pages of each kind. The word <code>deprecated</code> appears in 1 Good page and in no Needs Improvement page. Should that mean a Needs Improvement page can never use it? Add a small pretend count to every word and see.</>}
      actions={<><Btn onClick={() => setI(0)}>No smoothing</Btn><Btn onClick={() => setI(2)}>Add 1 to every word</Btn></>}
      note="Smoothing adds the same small count to every word in the vocabulary before turning counts into shares. It cannot repair a vocabulary built from test pages or a count that is negative.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Chance of each word given the class, smoothing ${alpha}. ${caption}`} xDomain={[0, 4]} yDomain={[0, 0.65]} xTicks={[]} yTicks={[0, 0.2, 0.4, 0.6]} xLabel={TOKENS.join("   ·   ")} yLabel="chance of the word">
            {(sx, sy) => <>{TOKENS.map((t, j) => <g key={t}>
              <rect x={sx(j + 0.1)} y={sy(good[j])} width={sx(j + 0.5) - sx(j + 0.1)} height={sy(0) - sy(good[j])} fill={GOOD} /><rect x={sx(j + 0.5)} y={sy(needs[j])} width={sx(j + 0.9) - sx(j + 0.5)} height={Math.max(0, sy(0) - sy(needs[j]))} fill={NEEDS} />
              <text x={sx(j + 0.5)} y={sy(0) - 4} textAnchor="middle" fontSize="9" fill={INK}>{needs[j] === 0 ? "0" : ""}</text>
            </g>)}</>}
          </Chart>
        </Figure>
        <Controls><Field label="Pretend count added to every word" min={0} max={3} step={1} value={i} onChange={setI} display={String(alpha)} /></Controls>
      </Grid>
      <Readout items={[["Chance of “deprecated” in Good", pct(good[dep])], ["Chance of “deprecated” in Needs Improvement", pct(needs[dep])], ["Page containing only “deprecated” is Good", pct(r.pGood)]]} />
    </Playground>
  );
}

/* ── NB03 · Gaussian likelihoods, and why repeating a feature overstates confidence ── */
const G = { mean: -0.5, variance: 1 }, N = { mean: 1, variance: 1 };
export function DensityPlayground() {
  const [x, setX] = useState(0), [copies, setCopies] = useState(1);
  const dg = gaussian(x, G.mean, G.variance), dn = gaussian(x, N.mean, N.variance), r = gaussianPosterior(x, copies, G, N);
  const caption = `One reading-level score of ${fmt(x, 2)}, counted ${copies} ${copies === 1 ? "time" : "times"}, gives ${pct(r.pGood)} Good.`;
  const grid = Array.from({ length: 81 }, (_, i) => -3 + i * 0.1);
  return (
    <Playground id="nb-gauss" title="Read the curve at the value you measured" intro={<>Reading level is a measurement, not a word count, so each class gets a bell curve instead of a table. Move the measured score along the axis and read how high each curve is there. Then count the <em>same</em> measurement more than once and watch the confidence grow with no new information.</>}
      actions={<><Btn onClick={() => { setX(0); setCopies(1); }}>Leaning a little Good</Btn><Btn onClick={() => { setX(0); setCopies(4); }}>Count it four times</Btn></>}
      note="A curve's height is a density, not a probability, so it can be above 1 for a narrow curve. Naive Bayes treats each feature as separate evidence. Copying a feature is not new evidence, but the model counts it anyway.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[-3, 5]} yDomain={[0, 0.5]} xTicks={[-2, 0, 2, 4]} yTicks={[0, 0.2, 0.4]} xLabel="reading-level score" yLabel="density">
            {(sx, sy) => <>
              <polyline fill="none" stroke={GOOD} strokeWidth="2.5" points={grid.map(g => `${sx(g)},${sy(gaussian(g, G.mean, G.variance))}`).join(" ")} />
              <polyline fill="none" stroke={NEEDS} strokeWidth="2.5" points={grid.map(g => `${sx(g + 0)},${sy(gaussian(g, N.mean, N.variance))}`).join(" ")} />
              <line x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(0.5)} stroke={INK} strokeDasharray="4 4" /><circle cx={sx(x)} cy={sy(dg)} r="6" fill={GOOD} stroke="#fff" strokeWidth="2" /><circle cx={sx(x)} cy={sy(dn)} r="6" fill={NEEDS} stroke="#fff" strokeWidth="2" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Measured score" min={-2} max={3} step={0.25} value={x} onChange={setX} /><Field label="Times the same score is counted" min={1} max={6} step={1} value={copies} onChange={setCopies} display={String(copies)} /></Controls>
      </Grid>
      <Readout items={[["Curve height, Good", fmt(dg, 3)], ["Curve height, Needs Improvement", fmt(dn, 3)], ["Chance the page is Good", pct(r.pGood)]]} />
    </Playground>
  );
}

/* ── NB04 · the label can stay wrong while the confidence gets worse ── */
export function ConfidencePlayground() {
  const [copies, setCopies] = useState(1);
  const p = wrongLeanPNeeds(copies), pTrue = p, loss = logLoss(pTrue), bri = brier(p, 1);
  const caption = `The page really does need improvement, but the model gives that only ${pct(p)}. The label is wrong at every setting; the confidence keeps getting worse.`;
  return (
    <Playground id="nb-conf" title="Same wrong answer, worse confidence" intro={<>The page really needs improvement, but the evidence points the other way. We copy that evidence more and more times. The predicted label stays "Good", so accuracy cannot tell these situations apart. Probability measures can.</>}
      actions={<><Btn onClick={() => setCopies(1)}>Once</Btn><Btn onClick={() => setCopies(4)}>Four times</Btn></>}
      note="Accuracy only checks the label. Log loss and the Brier score also check how sure the model was. Log loss punishes a confident miss without limit; Brier is capped at 1.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 8]} yDomain={[0, 18]} xTicks={[1, 2, 4, 6, 8]} yTicks={[0, 6, 12, 18]} xLabel="times the evidence is counted" yLabel="log loss">
            {(sx, sy) => <>
              <polyline fill="none" stroke={NEEDS} strokeWidth="2.5" points={[0, 1, 2, 3, 4, 5, 6, 7, 8].map(c => `${sx(c)},${sy(logLoss(wrongLeanPNeeds(c)))}`).join(" ")} />
              <circle cx={sx(copies)} cy={sy(loss)} r="6.5" fill={NEEDS} stroke="#fff" strokeWidth="2" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Times the evidence is counted" min={1} max={8} step={1} value={copies} onChange={setCopies} display={String(copies)} /></Controls>
      </Grid>
      <Readout items={[["Predicted label", "Good (wrong)"], ["Chance given to the truth", pct(p)], ["Log loss", fmt(loss, 2)], ["Brier score", fmt(bri, 3)]]} />
    </Playground>
  );
}
