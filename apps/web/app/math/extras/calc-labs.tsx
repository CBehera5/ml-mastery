"use client";
import { useRef, useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, curvePoints, fmt } from "./ui";
import { RULE_CASES, STEP_KS, central, dbgBuggy, dbgCorrect, dbgLoss, dbgNumeric, ruleCase, secant, sqr, stepError } from "./calc-math";

export type Done = { onDone?: () => void };
const sci = (v: number) => (v === 0 ? "0" : v.toExponential(1).replace("e-", "×10⁻").replace("e+", "×10"));

/* ── 1 · Secants: slide the second point towards the first ── */
export function SecantsPlayground({ onDone }: Done) {
  const [x, setX] = useState(2), [h, setH] = useState(1);
  const s = secant(sqr, x, h), t = 2 * x, w = Math.max(2 * h, 0.04), y0 = sqr(x), pad = Math.max(Math.abs(t), 1) * w * 1.3;
  const move = (v: number) => { setH(v); if (v <= 0.05) onDone?.(); };
  return (
    <Playground id="calc-sec" title="Slide the second point towards the first" intro={<>For <code>f(x) = x²</code>, a secant joins the point at <code>x</code> to a second point <code>h</code> further right. Its slope is the <em>average</em> change over that gap. Shrink <code>h</code> and watch what the slope settles on.</>}
      actions={<><Btn onClick={() => move(1)}>h = 1</Btn><Btn onClick={() => move(0.5)}>h = 0.5</Btn><Btn onClick={() => move(0.1)}>h = 0.1</Btn><Btn onClick={() => move(0.01)}>h = 0.01</Btn></>}
      note="Zoom in far enough and any smooth curve looks like a straight line. That line is the tangent, and its slope is the derivative. The gap h can get close to zero but never reach it, because dividing by zero is undefined.">
      <Grid>
        <Figure caption="Left: the curve with its secant (orange) and tangent (dashed). Right: the same point, zoomed in.">
          <Chart label={`Curve x squared with a secant from x = ${x} to x = ${fmt(x + h, 2)}, slope ${fmt(s, 3)}`} xDomain={[-1, 5]} yDomain={[-1, 25]} xTicks={[-1, 0, 1, 2, 3, 4, 5]} yTicks={[0, 5, 10, 15, 20, 25]} xLabel="x" yLabel="f(x) = x²" width={300} height={260}>
            {(sx, sy) => <>
              <polyline points={curvePoints(sqr, -1, 5, sx, sy)} stroke="#1f7568" strokeWidth="2.5" fill="none" />
              <line x1={sx(-1)} x2={sx(5)} y1={sy(y0 + t * (-1 - x))} y2={sy(y0 + t * (5 - x))} stroke="#16211c" strokeDasharray="4 4" />
              <line x1={sx(-1)} x2={sx(5)} y1={sy(y0 + s * (-1 - x))} y2={sy(y0 + s * (5 - x))} stroke="#e36c28" strokeWidth="2" />
              <circle cx={sx(x)} cy={sy(y0)} r="5.5" fill="#16211c" /><circle cx={sx(x + h)} cy={sy(sqr(x + h))} r="5.5" fill="#e36c28" />
            </>}
          </Chart>
          <Chart label="Zoomed view around the point: the curve looks almost straight and the secant sits on the tangent" xDomain={[x - w, x + w]} yDomain={[y0 - pad, y0 + pad]} xTicks={[]} yTicks={[]} xLabel={`x from ${fmt(x - w, 3)} to ${fmt(x + w, 3)}`} yLabel="f(x)" width={300} height={260}>
            {(sx, sy) => <>
              <polyline points={curvePoints(sqr, x - w, x + w, sx, sy)} stroke="#1f7568" strokeWidth="2.5" fill="none" />
              <line x1={sx(x - w)} x2={sx(x + w)} y1={sy(y0 - t * w)} y2={sy(y0 + t * w)} stroke="#16211c" strokeDasharray="4 4" />
              <line x1={sx(x - w)} x2={sx(x + w)} y1={sy(y0 - s * w)} y2={sy(y0 + s * w)} stroke="#e36c28" strokeWidth="2" />
              <circle cx={sx(x)} cy={sy(y0)} r="5.5" fill="#16211c" /><circle cx={sx(x + h)} cy={sy(sqr(x + h))} r="5.5" fill="#e36c28" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Point x" min={-1} max={4} step={0.25} value={x} onChange={setX} />
          <Field label="Gap h" min={0.01} max={2} step={0.01} value={h} onChange={move} display={fmt(h, 2)} />
        </Controls>
      </Grid>
      <Readout items={[["Secant slope", fmt(s, 3)], ["Tangent slope 2x", fmt(t, 3)], ["Difference", fmt(s - t, 3)]]} />
    </Playground>
  );
}

/* ── 2 · Rules: trust the rule, check against a measurement ── */
export function RulesPlayground({ onDone }: Done) {
  const [id, setId] = useState("chain"), [x, setX] = useState(2), [trust, setTrust] = useState<"rule" | "tempting" | "">("");
  const c = ruleCase(id), measured = central(c.f, x), ruleV = c.rule(x), temptV = c.tempting(x);
  const gap = (v: number) => Math.abs(v - measured);
  const agree = (v: number) => gap(v) < 1e-4 * Math.max(1, Math.abs(measured));
  const pick = (t: "rule" | "tempting") => { setTrust(t); if (t === "rule" && agree(ruleV)) onDone?.(); };
  return (
    <Playground id="calc-rules" title="Which formula survives a measurement?" intro={<>Every derivative rule has a tempting wrong version. Pick a function and compare two candidate answers with a measured slope (a tiny step either side of <code>x</code>). The measurement knows no rules, so it cannot be fooled.</>}
      note={<><strong>{c.name}.</strong> {c.why}</>}>
      <Grid>
        <Figure caption={`The measured slope of ${c.label} at x = ${fmt(x, 2)} is ${fmt(measured, 3)}.`}>
          <Chart label={`Function ${c.label} with its measured tangent at x = ${x}`} xDomain={[0.5, 3]} yDomain={[Math.min(0, ...[0.5, 1, 2, 3].map(c.f)) - 1, Math.max(...[0.5, 1, 2, 3].map(c.f)) * 1.1 + 1]} xTicks={[0.5, 1, 1.5, 2, 2.5, 3]} yTicks={[]} xLabel="x" yLabel={c.label} width={420}>
            {(sx, sy) => <>
              <polyline points={curvePoints(c.f, 0.5, 3, sx, sy)} stroke="#1f7568" strokeWidth="2.5" fill="none" />
              <line x1={sx(0.5)} x2={sx(3)} y1={sy(c.f(x) + measured * (0.5 - x))} y2={sy(c.f(x) + measured * (3 - x))} stroke="#e36c28" strokeWidth="2" strokeDasharray="5 3" />
              <circle cx={sx(x)} cy={sy(c.f(x))} r="6" fill="#16211c" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <label>Function <select aria-label="Function" value={id} onChange={(e) => { setId(e.target.value); setTrust(""); }}>{RULE_CASES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
          <Field label="Point x" min={0.5} max={3} step={0.25} value={x} onChange={(v) => { setX(v); setTrust(""); }} />
          <fieldset><legend>Which derivative do you trust?</legend>
            <label><input type="radio" name="calc-trust" checked={trust === "tempting"} onChange={() => pick("tempting")} /> The tempting one: {c.temptingText}</label>
            <label><input type="radio" name="calc-trust" checked={trust === "rule"} onChange={() => pick("rule")} /> The {c.name.toLowerCase()} answer: {c.ruleText}</label>
          </fieldset>
        </Controls>
      </Grid>
      <Readout items={[["Measured slope", fmt(measured, 4)], [`Tempting: ${c.temptingText}`, `${fmt(temptV, 4)} ${agree(temptV) ? "✓ agrees" : "✗ off"}`], [`Rule: ${c.ruleText}`, `${fmt(ruleV, 4)} ${agree(ruleV) ? "✓ agrees" : "✗ off"}`]]} />
      {trust && <p role="status">{trust === "rule" ? (agree(ruleV) ? "The rule agrees with the measurement. At this x the tempting answer does not unless the two happen to coincide." : "Neither matches here.") : agree(temptV) ? "At this x the two happen to coincide. Move x, because a wrong rule only agrees by accident." : "That one does not match the measured slope. Try the other."}</p>}
    </Playground>
  );
}

/* ── 3 · Step size: too big is wrong, too small is wrong too ── */
export function StepSizePlayground({ onDone }: Done) {
  const [k, setK] = useState(3);
  const seen = useRef({ big: false, small: false });
  const move = (v: number) => { setK(v); if (v <= 2) seen.current.big = true; if (v >= 12) seen.current.small = true; if (seen.current.big && seen.current.small) onDone?.(); };
  const h = 10 ** -k, est = central(Math.exp, 1, h), err = stepError(k);
  const errs = STEP_KS.map((q) => [q, Math.max(stepError(q), 1e-17)] as const);
  return (
    <Playground id="calc-step" title="How small should the step be?" intro={<>To measure the slope of <code>eˣ</code> at <code>x = 1</code> you compare it with a point just either side, a distance <code>h</code> apart. The true slope is <code>e = 2.71828…</code>. A big <code>h</code> blurs the curve. You might expect the tiniest <code>h</code> to be best. Try it.</>}
      actions={<><Btn onClick={() => move(1)}>Too big</Btn><Btn onClick={() => move(5)}>Textbook (h = 10⁻⁵)</Btn><Btn onClick={() => move(14)}>Too small</Btn></>}
      note="Two errors compete. A large h blurs the curve (the error shrinks as h²). A tiny h makes the computer subtract two almost-equal numbers and lose digits (the error grows as 1/h). The sweet spot sits in between.">
      <Grid>
        <Figure caption="Error of the measured slope at every step size (log scale). The best step is the bottom of the valley.">
          <Chart label={`Error against step size. At h = ${sci(h)} the error is ${sci(err)}`} xDomain={[1, 15]} yDomain={[-17, 0]} xTicks={[1, 3, 5, 7, 9, 11, 13, 15]} yTicks={[-16, -12, -8, -4, 0]} xLabel="digits in h:  h = 10⁻ᵏ  (k)" yLabel="log₁₀ error" width={460}>
            {(sx, sy) => <>
              <polyline points={errs.map(([q, e]) => `${sx(q)},${sy(Math.log10(e))}`).join(" ")} stroke="#1f7568" strokeWidth="2.5" fill="none" />
              <circle cx={sx(k)} cy={sy(Math.log10(Math.max(err, 1e-17)))} r="6.5" fill="#e36c28" stroke="#fff" strokeWidth="2" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Step size h = 10⁻ᵏ, k" min={1} max={15} step={0.25} value={k} onChange={move} display={`${fmt(k, 2)}  (h = ${sci(h)})`} /></Controls>
      </Grid>
      <Readout items={[["Measured slope", est.toFixed(10)], ["True slope e", Math.E.toFixed(10)], ["Error", sci(err)]]} />
    </Playground>
  );
}

/* ── 4 · Debug: the missing chain-rule factor ── */
export function GradientCheckPlayground({ onDone }: Done) {
  const [w, setW] = useState(2), [x, setX] = useState(2), [y, setY] = useState(6), [ran, setRan] = useState(false);
  const good = dbgCorrect(w, x, y), bad = dbgBuggy(w, x, y), num = dbgNumeric(w, x, y);
  const ok = (v: number) => Math.abs(v - num) < 1e-3 * Math.max(1, Math.abs(num));
  const run = () => { setRan(true); onDone?.(); };
  const lo = -2, hi = 8;
  return (
    <Playground id="calc-dbg" title="Run a gradient check" intro={<>Model: <code>prediction = w·x</code>. Loss: <code>L(w) = (w·x − y)²</code>. A developer wrote the gradient as <code>2(w·x − y)</code>, the outer derivative only. Set the values, then run the check: it compares each formula with a measured slope.</>}
      actions={<><Btn primary onClick={run}>Run the gradient check</Btn><Btn onClick={() => { setW(2); setX(2); setY(6); }}>Reset to w=2, x=2, y=6</Btn><Btn onClick={() => setX(1)}>Set x = 1</Btn></>}
      note="The missing factor is the inner derivative: how fast the prediction w·x moves when w moves, which is x. The bug is invisible when x = 1, and that is exactly why a numerical check is worth running on more than one input.">
      <Grid>
        <Figure caption="The loss as w changes. The slope at your w is what a gradient should report.">
          <Chart label={`Loss curve with a point at w = ${w}, true slope ${fmt(num, 2)}`} xDomain={[lo, hi]} yDomain={[0, 120]} xTicks={[-2, 0, 2, 4, 6, 8]} yTicks={[0, 40, 80, 120]} xLabel="weight w" yLabel="loss" width={420}>
            {(sx, sy) => <>
              <polyline points={curvePoints((v) => Math.min(dbgLoss(v, x, y), 120), lo, hi, sx, sy, 160)} stroke="#1f7568" strokeWidth="2.5" fill="none" />
              <circle cx={sx(w)} cy={sy(Math.min(dbgLoss(w, x, y), 120))} r="6" fill="#16211c" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Weight w" min={-2} max={8} step={0.25} value={w} onChange={(v) => { setW(v); setRan(false); }} />
          <Field label="Input x" min={0.5} max={4} step={0.25} value={x} onChange={(v) => { setX(v); setRan(false); }} />
          <Field label="Target y" min={0} max={10} step={0.5} value={y} onChange={(v) => { setY(v); setRan(false); }} />
        </Controls>
      </Grid>
      <Readout items={[["Measured slope", fmt(num, 3)], ["Buggy 2(wx − y)", fmt(bad, 3)], ["Fixed 2(wx − y)·x", fmt(good, 3)]]} />
      {ran && <p role="status">{ok(bad) ? `The buggy formula passes here (${fmt(bad, 3)}), but only by accident: x is 1 or the prediction already equals the target. Change x and run again.` : `Buggy formula fails the check: it reports ${fmt(bad, 3)} against a measured ${fmt(num, 3)}.`} {ok(good) ? `The fixed formula matches (${fmt(good, 3)}).` : "The fixed formula does not match, so something else is wrong."}</p>}
    </Playground>
  );
}
