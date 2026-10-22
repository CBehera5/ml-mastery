"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { OUTCOMES, SCORES, TEST, TRAIN, accuracy, counts, fitLogistic, logit, meanLoss, rowLoss, sigmoid } from "./lg-math";

const TEAL = "#1f7568", ORANGE = "#e36c28", INK = "#16211c", GREY = "#8b958f";
const pct = (v: number) => (Number.isFinite(v) ? `${fmt(v * 100, 0)}%` : "undefined");
const zs = Array.from({ length: 81 }, (_, i) => -8 + i * 0.2);

/* ── LG01 · score → probability → action ── */
export function SigmoidPlayground() {
  const [x, setX] = useState(1.1), [w, setW] = useState(1), [b, setB] = useState(0), [t, setT] = useState(0.7);
  const z = b + w * x, p = sigmoid(z), odds = p / (1 - p), action = p >= t;
  const caption = `The score ${fmt(z, 2)} becomes a ${pct(p)} chance of churn. With the bar at ${pct(t)}, the team ${action ? "acts" : "does not act"}.`;
  return (
    <Playground id="lg-sig" title="From a score to a chance to a decision" intro={<>The model first adds up a score <code>z = b + w·x</code>. A smooth S-curve turns that score into a chance between 0% and 100%. Only then does the team decide, by comparing the chance with a bar it sets for itself.</>}
      actions={<><Btn onClick={() => { setX(1.0986); setW(1); setB(0); setT(0.7); }}>The worked example</Btn><Btn onClick={() => setT(0.8)}>Raise the bar to 80%</Btn></>}
      note="The score, the chance and the action are three different things. Changing the bar changes the action but not the chance. A weight adds to the log-odds, so exp(w) multiplies the odds, not the probability.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Score ${fmt(z, 2)} gives probability ${pct(p)}. ${caption}`} xDomain={[-6, 6]} yDomain={[0, 1]} xTicks={[-6, -3, 0, 3, 6]} yTicks={[0, 0.25, 0.5, 0.75, 1]} xLabel="score z" yLabel="chance of churn">
            {(sx, sy) => <><polyline fill="none" stroke={GREY} strokeWidth="2.5" points={zs.filter(v => v >= -6 && v <= 6).map(v => `${sx(v)},${sy(sigmoid(v))}`).join(" ")} />
              <line x1={sx(-6)} x2={sx(6)} y1={sy(t)} y2={sy(t)} stroke={INK} strokeDasharray="5 4" /><circle cx={sx(Math.max(-6, Math.min(6, z)))} cy={sy(p)} r="7" fill={action ? ORANGE : TEAL} stroke="#fff" strokeWidth="2" /></>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Feature x" min={-4} max={4} step={0.1} value={x} onChange={setX} /><Field label="Weight w" min={-3} max={3} step={0.25} value={w} onChange={setW} />
          <Field label="Intercept b" min={-3} max={3} step={0.25} value={b} onChange={setB} /><Field label="Action bar" min={0.1} max={0.9} step={0.05} value={t} onChange={setT} display={pct(t)} />
        </Controls>
      </Grid>
      <Readout items={[["Score z", fmt(z, 3)], ["Chance of churn", pct(p)], ["Odds", fmt(odds, 2)], ["Decision", action ? "act (class 1)" : "do not act (class 0)"]]} />
    </Playground>
  );
}

/* ── LG02 · log loss ── */
export function LossPlayground() {
  const [p, setP] = useState(0.5), [y, setY] = useState<0 | 1>(1);
  const loss = rowLoss(y, p), correct = (p >= 0.5 ? 1 : 0) === y, grad = p - y;
  const caption = `For a customer who ${y ? "left" : "stayed"}, the model gave ${pct(y ? p : 1 - p)} to what really happened. Loss ${fmt(loss, 3)}.`;
  const ps = Array.from({ length: 98 }, (_, i) => 0.01 + i * 0.01);
  return (
    <Playground id="lg-loss" title="Being confidently wrong costs the most" intro={<>Log loss scores the <em>chance the model gave to what really happened</em>. Pick whether the customer actually left, then slide the model's chance of churn and watch the penalty. A correct call can still carry a high loss if it was made timidly.</>}
      actions={<><Btn primary={y === 1} onClick={() => setY(1)}>Customer left</Btn><Btn primary={y === 0} onClick={() => setY(0)}>Customer stayed</Btn><Btn onClick={() => { setY(1); setP(0.9); }}>Left, model says 90%</Btn></>}
      note="At 50% the loss is ln 2 ≈ 0.693 whatever happened. Moving toward the truth drives the loss to 0; moving away from it makes the loss grow without limit. The gradient p − y says which way the score should move: up for a customer who left, down for one who stayed.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 1]} yDomain={[0, 4.6]} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[0, 1, 2, 3, 4]} xLabel="model's chance of churn" yLabel="loss">
            {(sx, sy) => <><polyline fill="none" stroke={GREY} strokeWidth="2.5" points={ps.map(v => `${sx(v)},${sy(Math.min(4.6, rowLoss(y, v)))}`).join(" ")} /><circle cx={sx(p)} cy={sy(Math.min(4.6, loss))} r="7" fill={correct ? TEAL : ORANGE} stroke="#fff" strokeWidth="2" /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Model's chance of churn" min={0.02} max={0.98} step={0.01} value={p} onChange={setP} display={pct(p)} /></Controls>
      </Grid>
      <Readout items={[["Row loss", fmt(loss, 3)], ["Label at a 50% bar", correct ? "correct" : "wrong"], ["Gradient p − y", fmt(grad, 2)]]} />
    </Playground>
  );
}

/* ── LG03 · thresholds and costs ── */
const PS = [0.05, 0.1, 0.12, 0.2, 0.22, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.92, 0.95];
const YS: (0 | 1)[] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1];
export function ThresholdPlayground() {
  const [t, setT] = useState(0.5), [cfp, setCfp] = useState(1), [cfn, setCfn] = useState(5);
  const c = counts(PS, YS, t), cost = cfp * c.fp + cfn * c.fn;
  const best = Array.from({ length: 19 }, (_, i) => 0.05 + i * 0.05).reduce((a, v) => (cfp * counts(PS, YS, v).fp + cfn * counts(PS, YS, v).fn < cfp * counts(PS, YS, a).fp + cfn * counts(PS, YS, a).fn ? v : a), 0.5);
  const caption = `At a bar of ${pct(t)} we contact ${c.tp + c.fp} customers: ${c.tp} would have left, ${c.fp} would have stayed. We miss ${c.fn}.`;
  return (
    <Playground id="lg-thr" title="Where should the bar go?" intro={<>Twenty customers, each with the model's chance of churn. Dots sit at that chance; filled dots really left. Move the bar: everyone at or above it gets a retention call. A wasted call costs {cfp}, a missed leaver costs {cfn}. Pick the bar that costs least.</>}
      actions={<><Btn onClick={() => setT(0.5)}>50%</Btn><Btn onClick={() => setT(best)}>Cheapest bar</Btn><Btn onClick={() => setT(0.9)}>Be picky: 90%</Btn></>}
      note="Raising the bar finds fewer false alarms but misses more leavers. Define which class is positive before counting, and compare the bar's cost with a cost you actually have, not just accuracy.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 1]} yDomain={[0, 1]} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[]} xLabel="model's chance of churn" yLabel="customers (stacked by order)">
            {(sx, sy) => <><line x1={sx(t)} x2={sx(t)} y1={sy(0)} y2={sy(1)} stroke={INK} strokeWidth="2" strokeDasharray="5 4" />{PS.map((p, i) => <circle key={i} cx={sx(p)} cy={sy(0.08 + (i % 5) * 0.2)} r="7" fill={YS[i] ? ORANGE : "#fff"} stroke={YS[i] ? ORANGE : TEAL} strokeWidth="2" />)}</>}
          </Chart>
        </Figure>
        <Controls><Field label="Action bar" min={0.05} max={0.95} step={0.05} value={t} onChange={setT} display={pct(t)} /><Field label="Cost of a wasted call" min={1} max={10} step={1} value={cfp} onChange={setCfp} /><Field label="Cost of a missed leaver" min={1} max={10} step={1} value={cfn} onChange={setCfn} /></Controls>
      </Grid>
      <Readout items={[["Precision", pct(c.precision)], ["Recall", pct(c.recall)], ["Total cost", String(cost)], ["Cheapest bar", pct(best)]]} />
    </Playground>
  );
}

/* ── LG04 · regularization strength and where the boundary sits ── */
const CS = [0.01, 0.1, 1, 10] as const;
const ROWS = TRAIN.map(c => [c.complaints, c.tenure]), YTR = TRAIN.map(c => c.y);
export function BoundaryPlayground() {
  const [ci, setCi] = useState(2), [t, setT] = useState(0.5), C = CS[ci];
  const m = fitLogistic(ROWS, YTR, C), offset = logit(t);
  const acc = accuracy(TEST.map(c => m.p([c.complaints, c.tenure])), TEST.map(c => c.y), t), norm = Math.hypot(m.w[0], m.w[1]);
  const lineY = (x1: number) => (offset - m.b - m.w[0] * x1) / m.w[1];
  const caption = `The line is where the chance equals ${pct(t)}. A smaller C (stronger penalty) gives smaller weights and a flatter, less sure model.`;
  return (
    <Playground id="lg-geo" title="The boundary is where the chance equals your bar" intro={<>Each dot is a past customer: complaints on the bottom, tenure up the side (both standardised). Filled dots left. The line is where the model's chance equals your bar. Slide <code>C</code>, the <em>inverse</em> of the penalty strength, and move the bar.</>}
      actions={<><Btn onClick={() => { setCi(2); setT(0.5); }}>C = 1, bar 50%</Btn><Btn onClick={() => setCi(0)}>Strong penalty</Btn><Btn onClick={() => setT(0.75)}>Bar at 75%</Btn></>}
      note="A small C means a strong penalty and smaller weights. Moving the bar shifts the line without changing the model: at a 50% bar the line is where the score is zero; at 75% it is where the score is ln 3. Compare held-out results rather than assuming a stronger or weaker penalty will win.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`C ${C}, bar ${pct(t)}. Weights ${m.w.map(v => fmt(v, 2)).join(", ")}. ${caption}`} xDomain={[-3, 3]} yDomain={[-3, 3]} xTicks={[-2, 0, 2]} yTicks={[-2, 0, 2]} xLabel="complaints (std)" yLabel="tenure (std)">
            {(sx, sy) => <>{TRAIN.map((c, i) => <circle key={i} cx={sx(c.complaints)} cy={sy(c.tenure)} r="4" fill={c.y ? ORANGE : "none"} stroke={c.y ? ORANGE : TEAL} strokeWidth="1.5" opacity="0.8" />)}
              <line x1={sx(-3)} y1={sy(lineY(-3))} x2={sx(3)} y2={sy(lineY(3))} stroke={INK} strokeWidth="2.5" /></>}
          </Chart>
        </Figure>
        <Controls><Field label="C (inverse penalty)" min={0} max={3} step={1} value={ci} onChange={setCi} display={String(C)} /><Field label="Action bar" min={0.25} max={0.75} step={0.25} value={t} onChange={setT} display={pct(t)} /></Controls>
      </Grid>
      <Readout items={[["Weights (complaints, tenure)", m.w.map(v => fmt(v, 2)).join(", ")], ["Size of weights", fmt(norm, 2)], ["Held-out accuracy", pct(acc)]]} />
    </Playground>
  );
}

/* ── LG05 · a feature from the future ── */
export function LeakPlayground() {
  const [leak, setLeak] = useState(false);
  const rowOf = (c: (typeof TRAIN)[number]) => (leak ? [c.complaints, c.tenure, c.cancelled] : [c.complaints, c.tenure]);
  const m = fitLogistic(TRAIN.map(rowOf), TRAIN.map(c => c.y), 1), acc = accuracy(TEST.map(c => m.p(rowOf(c))), TEST.map(c => c.y));
  const majority = TEST.filter(c => !c.y).length / TEST.length;
  const caption = leak ? "A score near 100% is a warning, not a victory: the model is reading the cancellation flag, which does not exist yet when we need to predict." : "With only what we know on day 0, the model beats the lazy 'nobody leaves' answer by a modest, believable margin.";
  return (
    <Playground id="lg-leak" title="Is the model predicting, or reading the answer?" intro={<>We want to predict on day 0 who will cancel during days 1 to 30. The data also holds a <code>cancelled</code> flag recorded on day 30. Switch it on and watch the score. Then ask: could we have had that flag on day 0?</>}
      actions={<><Btn primary onClick={() => setLeak(!leak)}>{leak ? "Remove the day-30 flag" : "Add the day-30 flag"}</Btn></>}
      note="Any feature recorded after the prediction moment is forbidden, however much it improves the score. Also compare with a dummy that always predicts the majority class, and fit every step on training customers only.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Accuracy: always-stays ${pct(majority)}, model ${pct(acc)}. ${caption}`} xDomain={[0, 2]} yDomain={[0, 1]} xTicks={[]} yTicks={[0, 0.5, 1]} xLabel="always say “stays”   ·   the model" yLabel="held-out accuracy">
            {(sx, sy) => <><rect x={sx(0.2)} y={sy(majority)} width={sx(0.9) - sx(0.2)} height={sy(0) - sy(majority)} fill={GREY} /><rect x={sx(1.1)} y={sy(acc)} width={sx(1.8) - sx(1.1)} height={sy(0) - sy(acc)} fill={leak ? "#c0392b" : TEAL} />
              <text x={sx(0.55)} y={sy(majority) - 5} textAnchor="middle" fontSize="12" fill={INK}>{pct(majority)}</text><text x={sx(1.45)} y={sy(acc) - 5} textAnchor="middle" fontSize="12" fill={INK}>{pct(acc)}</text></>}
          </Chart>
        </Figure>
        <Controls><p>Features used: complaints, tenure{leak ? ", cancelled on day 30" : ""}.</p></Controls>
      </Grid>
      <Readout items={[["“Nobody leaves” accuracy", pct(majority)], ["Model accuracy", pct(acc)], ["Can we know all features on day 0?", leak ? "no — the flag is from the future" : "yes"]]} />
    </Playground>
  );
}

/* ── LG06 · same labels, different confidence ── */
export function ConfidencePlayground() {
  const [k, setK] = useState(1);
  const ps = SCORES.map(s => sigmoid(k * s)), acc = accuracy(ps, OUTCOMES), loss = meanLoss(OUTCOMES, ps);
  const ks = [0.2, 0.5, 1, 1.5, 2, 3, 4, 6], bestK = ks.reduce((a, v) => (meanLoss(OUTCOMES, SCORES.map(s => sigmoid(v * s))) < meanLoss(OUTCOMES, SCORES.map(s => sigmoid(a * s))) ? v : a), 1);
  const caption = `Same eight customers, same labels, accuracy ${pct(acc)} throughout. Log loss ${fmt(loss, 2)}: ${k > 2.5 ? "the model sounds sure and gets punished when it is wrong." : k < 0.6 ? "the model sounds unsure, so even its correct calls earn little credit." : "close to the best confidence for this sample."}`;
  return (
    <Playground id="lg-conf" title="Same labels, different confidence" intro={<>Eight customers have the same scores and outcomes throughout. We only change how sure the model sounds by stretching or squeezing its scores. At a 50% bar the labels never change, so accuracy cannot see the difference. Log loss can.</>}
      actions={<><Btn onClick={() => setK(0.2)}>Timid</Btn><Btn onClick={() => setK(1)}>As fitted</Btn><Btn onClick={() => setK(6)}>Overconfident</Btn></>}
      note="Log loss on eight customers is a rough guide, not proof that the probabilities are calibrated. Report counts and costs with the sample size, and state the limits: a linear boundary, the population it was built on, and the period it was trained in.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={caption} xDomain={[0, 6.5]} yDomain={[0, 1.4]} xTicks={[1, 2, 3, 4, 5, 6]} yTicks={[0, 0.5, 1]} xLabel="how sure the model sounds (stretch)" yLabel="log loss">
            {(sx, sy) => <><polyline fill="none" stroke={GREY} strokeWidth="2.5" points={Array.from({ length: 60 }, (_, i) => 0.2 + i * 0.1).map(v => `${sx(v)},${sy(Math.min(1.4, meanLoss(OUTCOMES, SCORES.map(s => sigmoid(v * s)))))}`).join(" ")} /><circle cx={sx(k)} cy={sy(Math.min(1.4, loss))} r="7" fill={ORANGE} stroke="#fff" strokeWidth="2" /></>}
          </Chart>
        </Figure>
        <Controls><Field label="Confidence stretch" min={0.2} max={6} step={0.2} value={k} onChange={setK} display={fmt(k, 1)} /></Controls>
      </Grid>
      <Readout items={[["Accuracy at a 50% bar", pct(acc)], ["Log loss", fmt(loss, 3)], ["Lowest log loss near stretch", fmt(bestK, 1)]]} />
    </Playground>
  );
}
