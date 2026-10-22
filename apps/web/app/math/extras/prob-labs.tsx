"use client";
import { useRef, useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "./ui";
import { EVENTS2, FACES, LABELS, PAIRS, SCORES, STUDY, bayes, binomPmf, confusion, logLoss, mean, pEvent, pairsWhere, rng, studyTotals, variance } from "./prob-math";

export type Done = { onDone?: () => void };
const pct = (v: number, d = 1) => (Number.isFinite(v) ? `${fmt(v * 100, d)}%` : "undefined");
const C = { a: "#e36c28", b: "#1f7568", n: "#c9cfc7", ink: "#16211c" };

/* ── 1 · Understanding: favourable ÷ total, then check by rolling ── */
export function EventsPlayground({ onDone }: Done) {
  const [event, setEvent] = useState<number[]>([2, 4, 6]), [counts, setCounts] = useState<number[]>(Array(6).fill(0));
  const r = useRef(rng(7));
  const n = counts.reduce((a, b) => a + b, 0), hits = event.reduce((s, f) => s + counts[f - 1], 0);
  const roll = (k: number) => { const next = [...counts]; for (let i = 0; i < k; i++) next[Math.floor(r.current() * 6)]++; setCounts(next); onDone?.(); };
  const toggle = (f: number) => { setEvent((e) => (e.includes(f) ? e.filter((x) => x !== f) : [...e, f].sort())); setCounts(Array(6).fill(0)); onDone?.(); };
  const p = pEvent(event);
  return (
    <Playground id="pr-ev" title="Pick an event, then roll to check it" intro={<>A fair die has 6 equally likely outcomes. An <em>event</em> is any group of outcomes you care about. Click faces to build one. Its probability is <strong>favourable ÷ total</strong>. Then roll the die and see whether the long-run share agrees.</>}
      actions={<><Btn onClick={() => roll(1)}>Roll 1</Btn><Btn onClick={() => roll(10)}>Roll 10</Btn><Btn onClick={() => roll(100)}>Roll 100</Btn><Btn onClick={() => roll(1000)}>Roll 1000</Btn><Btn onClick={() => setCounts(Array(6).fill(0))}>Clear rolls</Btn></>}
      note="A few rolls can be far from the probability, and that is normal. Probability describes what happens in the long run, not what the next roll will do.">
      <Grid>
        <Figure caption="Orange faces are in your event. Bars show how often each face has come up.">
          <div role="group" aria-label="Faces in your event" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>{FACES.map((f) => <button key={f} type="button" aria-pressed={event.includes(f)} onClick={() => toggle(f)} style={{ width: 44, height: 44, fontSize: 18, fontWeight: 700, borderRadius: 8, border: `2px solid ${event.includes(f) ? C.a : "#c9cfc7"}`, background: event.includes(f) ? "#fde8d9" : "#fbfaf5", cursor: "pointer" }}>{f}</button>)}</div>
          <Chart label={`Rolls so far: ${n}. ${hits} landed in the event.`} xDomain={[0.5, 6.5]} yDomain={[0, Math.max(5, ...counts) * 1.15]} xTicks={FACES} yTicks={[]} xLabel="face" yLabel="times rolled" width={420} height={230}>
            {(sx, sy) => <>{counts.map((c, i) => <rect key={i} x={sx(i + 1) - 18} y={sy(c)} width={36} height={sy(0) - sy(c)} fill={event.includes(i + 1) ? C.a : C.n} />)}</>}
          </Chart>
        </Figure>
      </Grid>
      <Readout items={[["Favourable ÷ total", `${event.length} ÷ 6`], ["P(event)", pct(p)], ["Rolled so far", String(n)], ["Share that landed in the event", n ? pct(hits / n) : "roll to find out"], ["P(not event)", pct(1 - p)]]} />
    </Playground>
  );
}

/* ── 2 · Multiple events: count the grid ── */
export function GridPlayground({ onDone }: Done) {
  const [key, setKey] = useState("six");
  const ev = EVENTS2[key], hit = pairsWhere(ev.test), k = hit.length;
  const pick = (id: string) => { setKey(id); onDone?.(); };
  return (
    <Playground id="pr-grid" title="Count the grid of two dice" intro={<>Two dice give 6 × 6 = 36 equally likely pairs. Choose an event and the cells that belong to it light up. The probability is again <strong>favourable ÷ total</strong>, now counted over pairs.</>}
      actions={<>{Object.entries(EVENTS2).map(([id, e]) => <Btn key={id} onClick={() => pick(id)}>{e.label}</Btn>)}</>}
      note={key === "six" ? "Counting “not a six on either die” is easier: 5 × 5 = 25 pairs, so P(at least one six) = 1 − 25/36 = 11/36. Counting the complement is a favourite shortcut." : key === "even" ? "Each die is even with probability 1/2, and the dice do not influence each other, so the probabilities multiply: 1/2 × 1/2 = 1/4 = 9/36." : key === "double" ? "Six doubles out of 36 is 1/6. Whatever the first die shows, exactly one of the six faces on the second die makes a double." : "Six pairs make 7, more than any other sum. That is why 7 is the most common total."}>
      <Grid>
        <Figure caption={`${k} of 36 pairs are “${ev.label}”.`}>
          <table aria-label="Grid of all 36 pairs of two dice" style={{ borderCollapse: "separate", borderSpacing: 3 }}>
            <thead><tr><th scope="col"><span className="sr-only">die 1 ↓ / die 2 →</span></th>{FACES.map((b) => <th key={b} scope="col" style={{ fontSize: 12 }}>{b}</th>)}</tr></thead>
            <tbody>{FACES.map((a) => <tr key={a}><th scope="row" style={{ fontSize: 12 }}>{a}</th>{FACES.map((b) => { const on = ev.test(a, b); return <td key={b} title={`(${a}, ${b})`} style={{ width: 34, height: 30, textAlign: "center", fontSize: 11, background: on ? "#fde8d9" : "#fbfaf5", border: `1px solid ${on ? C.a : "#d8d8ce"}`, fontWeight: on ? 700 : 400 }}>{on ? "●" : ""}</td>; })}</tr>)}</tbody>
          </table>
        </Figure>
      </Grid>
      <Readout items={[["Favourable pairs", String(k)], ["Total pairs", String(PAIRS.length)], ["P(event)", `${k}/36 = ${pct(k / 36)}`], ["P(not event)", `${36 - k}/36 = ${pct((36 - k) / 36)}`]]} />
    </Playground>
  );
}

/* ── 3 · Conditional: the condition changes the denominator ── */
export function ConditionalPlayground({ onDone }: Done) {
  const [cond, setCond] = useState<"all" | "studied" | "rest">("all");
  const t = studyTotals(), S = STUDY;
  const group = cond === "all" ? t.total : cond === "studied" ? t.studied : t.rest;
  const pass = cond === "all" ? t.pass : cond === "studied" ? S.studiedPass : S.restPass;
  const people = [...Array(S.studiedPass).fill("sp"), ...Array(S.studiedFail).fill("sf"), ...Array(S.restPass).fill("rp"), ...Array(S.restFail).fill("rf")] as string[];
  const inGroup = (g: string) => cond === "all" || (cond === "studied" ? g[0] === "s" : g[0] === "r");
  const choose = (c: "all" | "studied" | "rest") => { setCond(c); onDone?.(); };
  return (
    <Playground id="pr-cond" title="Change the condition, change the denominator" intro={<>200 students: 80 studied for a test and 120 did not. Each dot is one student. <em>Teal</em> passed, <em>grey</em> failed. “Given that…” means we only look at one group, so that group becomes the new total.</>}
      actions={<><Btn onClick={() => choose("all")}>Everyone</Btn><Btn onClick={() => choose("studied")}>Given: studied</Btn><Btn onClick={() => choose("rest")}>Given: did not study</Btn></>}
      note={`P(pass | studied) = ${S.studiedPass}/${t.studied} = ${pct(S.studiedPass / t.studied, 0)}, but P(pass | did not study) = ${S.restPass}/${t.rest} = ${pct(S.restPass / t.rest, 0)}. The numerator is a count of passes; the denominator is only the group you were told about.`}>
      <Grid>
        <Figure caption={cond === "all" ? "Looking at all 200 students." : `Looking only at the ${group} students who ${cond === "studied" ? "studied" : "did not study"}. The rest are faded.`}>
          <div role="img" aria-label={`${group} students in view, ${pass} passed`} style={{ display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: 4, maxWidth: 460 }}>
            {people.map((g, i) => <span key={i} style={{ aspectRatio: "1", borderRadius: "50%", background: g[1] === "p" ? C.b : "#9aa39d", opacity: inGroup(g) ? 1 : 0.15, outline: g[0] === "s" ? `2px solid ${C.a}` : "none", outlineOffset: -1 }} />)}
          </div>
          <p style={{ fontSize: 12 }}>Orange ring: studied.</p>
        </Figure>
      </Grid>
      <Readout items={[["Students in view (the denominator)", String(group)], ["Of them, passed", String(pass)], [cond === "all" ? "P(pass)" : cond === "studied" ? "P(pass | studied)" : "P(pass | did not study)", `${pass}/${group} = ${pct(pass / group)}`]]} />
    </Playground>
  );
}

/* ── 4 · Bayes: natural frequencies ── */
export function BayesPlayground({ onDone }: Done) {
  const [prev, setPrev] = useState(0.01), [sens, setSens] = useState(0.9), [fpr, setFpr] = useState(0.09);
  const b = bayes(prev, sens, fpr), up = (f: (n: number) => void) => (n: number) => { f(n); onDone?.(); };
  return (
    <Playground id="pr-bayes" title="A positive test: how worried should you be?" intro={<>A disease affects <strong>{pct(prev)}</strong> of people. The test catches <strong>{pct(sens, 0)}</strong> of sick people and wrongly flags <strong>{pct(fpr, 0)}</strong> of healthy ones. Out of 10,000 people, how many positives are really sick? Count people, not percentages.</>}
      actions={<><Btn onClick={() => { setPrev(0.01); setSens(0.9); setFpr(0.09); onDone?.(); }}>Rare disease (1%)</Btn><Btn onClick={() => { setPrev(0.2); setSens(0.9); setFpr(0.09); onDone?.(); }}>Common disease (20%)</Btn></>}
      note={`Positives are ${fmt(b.tp, 0)} sick people plus ${fmt(b.fp, 0)} healthy people the test got wrong. A healthy person is much more common than a sick one, so even a small false-positive rate produces many false alarms. That is the base rate at work.`}>
      <Grid>
        <Figure caption={`Of ${fmt(b.positives, 0)} positives, ${fmt(b.tp, 0)} are really sick.`}>
          <Chart label={`Of ${fmt(b.positives, 0)} positive tests, ${fmt(b.tp, 0)} are sick and ${fmt(b.fp, 0)} are healthy`} xDomain={[0, 1]} yDomain={[0, 1]} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[]} xLabel="share of the people who tested positive" yLabel="" width={460} height={170}>
            {(sx, sy) => <>
              <rect x={sx(0)} y={sy(0.8)} width={sx(b.positives ? b.tp / b.positives : 0) - sx(0)} height={sy(0.2) - sy(0.8)} fill={C.a} />
              <rect x={sx(b.positives ? b.tp / b.positives : 0)} y={sy(0.8)} width={sx(1) - sx(b.positives ? b.tp / b.positives : 0)} height={sy(0.2) - sy(0.8)} fill={C.n} />
              <text x={sx(0.02)} y={sy(0.5) + 4} fontSize="12" fill="#fff">really sick</text><text x={sx(0.98)} y={sy(0.5) + 4} fontSize="12" textAnchor="end" fill={C.ink}>healthy, false alarm</text>
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Prevalence (sick)" min={0.005} max={0.3} step={0.005} value={prev} onChange={up(setPrev)} display={pct(prev)} />
          <Field label="Sensitivity (catches sick)" min={0.5} max={1} step={0.01} value={sens} onChange={up(setSens)} display={pct(sens, 0)} />
          <Field label="False-positive rate (healthy flagged)" min={0.01} max={0.3} step={0.01} value={fpr} onChange={up(setFpr)} display={pct(fpr, 0)} />
        </Controls>
      </Grid>
      <Readout items={[["Sick people", fmt(b.sick, 0)], ["Sick and positive", fmt(b.tp, 0)], ["Healthy and positive", fmt(b.fp, 0)], ["P(sick | positive)", pct(b.posterior)]]} />
    </Playground>
  );
}

/* ── 5 · Distributions: a random variable and its mean ── */
export function BinomialPlayground({ onDone }: Done) {
  const [n, setN] = useState(10), [p, setP] = useState(0.5), [draws, setDraws] = useState<number[]>([]);
  const r = useRef(rng(11)), pmf = binomPmf(n, p), m = mean(pmf), v = variance(pmf);
  const upd = (f: (x: number) => void) => (x: number) => { f(x); setDraws([]); onDone?.(); };
  const sample = () => { const out: number[] = []; for (let i = 0; i < 200; i++) { let k = 0; for (let j = 0; j < n; j++) if (r.current() < p) k++; out.push(k); } setDraws(out); onDone?.(); };
  const hist = Array(n + 1).fill(0); draws.forEach((k) => hist[k]++);
  const ymax = Math.max(...pmf, ...hist.map((h) => h / (draws.length || 1))) * 1.15;
  return (
    <Playground id="pr-dist" title="Shape a distribution" intro={<>Flip a coin that lands heads with probability <code>p</code>, <code>n</code> times, and count the heads. That count is a <em>random variable</em>. A distribution lists how likely each value is, and the probabilities add up to 1.</>}
      actions={<><Btn onClick={sample}>Draw 200 samples</Btn><Btn onClick={() => { setN(10); setP(0.5); setDraws([]); }}>Reset</Btn></>}
      note="The mean is the long-run average and the variance measures how spread out the values are. For this distribution they have simple formulas: mean = n·p and variance = n·p·(1−p). Draw samples and watch the dots settle around the bars.">
      <Grid>
        <Figure caption="Bars: the exact probabilities. Dots: the share of 200 sampled counts.">
          <Chart label={`Distribution of heads in ${n} flips with p = ${p}; mean ${fmt(m, 2)}`} xDomain={[-0.5, n + 0.5]} yDomain={[0, ymax]} xTicks={Array.from({ length: n + 1 }, (_, i) => i).filter((i) => n <= 10 || i % 2 === 0)} yTicks={[]} xLabel="number of heads" yLabel="probability" width={460} height={250}>
            {(sx, sy) => <>
              {pmf.map((q, k) => <rect key={k} x={sx(k) - 10} y={sy(q)} width={20} height={sy(0) - sy(q)} fill={C.b} fillOpacity="0.8" />)}
              {draws.length > 0 && hist.map((h, k) => <circle key={k} cx={sx(k)} cy={sy(h / draws.length)} r="4.5" fill={C.a} stroke="#fff" />)}
              <line x1={sx(m)} x2={sx(m)} y1={sy(0)} y2={sy(ymax * 0.97)} stroke={C.ink} strokeDasharray="4 3" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Flips n" min={1} max={20} step={1} value={n} onChange={upd(setN)} display={String(n)} /><Field label="Chance of heads p" min={0.05} max={0.95} step={0.05} value={p} onChange={upd(setP)} /></Controls>
      </Grid>
      <Readout items={[["Mean n·p", fmt(m, 2)], ["Variance n·p·(1−p)", fmt(v, 2)], ["Probabilities add to", fmt(pmf.reduce((a, b) => a + b, 0), 3)], ["Sample mean", draws.length ? fmt(draws.reduce((a, b) => a + b, 0) / draws.length, 2) : "draw samples"]]} />
    </Playground>
  );
}

/* ── 6 · ML: thresholds, precision and recall ── */
export function ThresholdPlayground({ onDone }: Done) {
  const [t, setT] = useState(0.5), c = confusion(t), move = (v: number) => { setT(v); onDone?.(); };
  return (
    <Playground id="pr-ml" title="Turn probabilities into decisions" intro={<>A model scores ten emails with the probability each is spam. Filled dots are truly spam, hollow dots are not. Anything scoring at or above the <strong>threshold</strong> is flagged. Move it and see who is caught and who is wrongly flagged.</>}
      actions={<><Btn onClick={() => move(0.3)}>Catch more spam (0.3)</Btn><Btn onClick={() => move(0.5)}>Balanced (0.5)</Btn><Btn onClick={() => move(0.8)}>Be cautious (0.8)</Btn></>}
      note="Precision asks: of the emails flagged, how many really were spam? Recall asks: of the real spam, how much did we flag? Raising the threshold usually raises precision and lowers recall. Which matters more depends on the cost of each mistake.">
      <Grid>
        <Figure caption={`Threshold ${fmt(t, 2)}: ${c.tp + c.fp} flagged, ${c.tp} correctly.`}>
          <Chart label={`Ten scored emails with a threshold at ${t}; ${c.tp} true positives, ${c.fp} false positives`} xDomain={[0, 1]} yDomain={[0, 1]} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[]} xLabel="model's probability of spam" yLabel="" width={460} height={190}>
            {(sx, sy) => <>
              <rect x={sx(t)} y={sy(1)} width={sx(1) - sx(t)} height={sy(0) - sy(1)} fill={C.a} fillOpacity="0.1" />
              <line x1={sx(t)} x2={sx(t)} y1={sy(1)} y2={sy(0)} stroke={C.a} strokeWidth="2" />
              {SCORES.map((s, i) => <circle key={i} cx={sx(s)} cy={sy(0.5 + (i % 3 - 1) * 0.18)} r="9" fill={LABELS[i] ? C.ink : "#fbfaf5"} stroke={C.ink} strokeWidth="2" />)}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Threshold" min={0.05} max={0.95} step={0.05} value={t} onChange={move} /></Controls>
      </Grid>
      <Readout items={[["Caught spam (TP)", String(c.tp)], ["False alarms (FP)", String(c.fp)], ["Missed spam (FN)", String(c.fn)], ["Correctly kept (TN)", String(c.tn)], ["Precision", pct(c.precision, 0)], ["Recall", pct(c.recall, 0)], ["Log loss of the scores", fmt(logLoss(), 3)]]} />
    </Playground>
  );
}
