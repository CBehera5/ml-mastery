"use client";
import { useRef, useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "./ui";
import { BASE, PX, PY, SCORES30, TABLE, TIGHT, WIDE, accuracyInterval, correlation, histogram, mean, median, quartiles, sampleMeans, slope, std, standardError, variance, withExtra, POP_MEAN, POP_SD } from "./stat-math";
import { rng } from "./prob-math";

export type Done = { onDone?: () => void };
const C = { a: "#e36c28", b: "#1f7568", n: "#c9cfc7", ink: "#16211c" };
const pct = (v: number, d = 1) => `${fmt(v * 100, d)}%`;

/* ── 1 · Data: rows are observations, columns are variables ── */
export function DataPlayground({ onDone }: Done) {
  const [row, setRow] = useState<number | null>(0), [col, setCol] = useState<number | null>(null), [guess, setGuess] = useState<Record<number, string>>({});
  const nums = TABLE.kinds.filter((k) => k === "numerical").length;
  const pick = (r: number | null, c: number | null) => { setRow(r); setCol(c); onDone?.(); };
  const answer = (c: number, k: string) => { setGuess((g) => ({ ...g, [c]: k })); onDone?.(); };
  return (
    <Playground id="st-data" title="Rows are cases, columns are variables" intro={<>A dataset is a table. Each <strong>row</strong> is one observation (here, one house). Each <strong>column</strong> is one variable, something measured for every case. Click a row number or a column heading to see the difference, then classify each variable.</>}
      note="A number is not always a number: a postcode is a label, not a quantity, so averaging it is meaningless. Ask whether adding or averaging the values would make sense.">
      <Grid>
        <Figure caption={row !== null ? `Row ${row + 1} is one observation: a single house described by ${TABLE.cols.length} variables.` : col !== null ? `“${TABLE.cols[col]}” is one variable: the same measurement for all ${TABLE.rows.length} houses.` : "Click a row number or a column heading."}>
          <div role="region" aria-label="Housing table" tabIndex={0} style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr><th />{TABLE.cols.map((c, j) => <th key={c} style={{ padding: 0 }}><button type="button" aria-pressed={col === j} onClick={() => pick(null, j)} style={{ font: "inherit", fontWeight: 700, padding: "6px 10px", background: col === j ? "#d9efe9" : "transparent", border: "1px solid #d8d8ce", cursor: "pointer", width: "100%" }}>{c}</button></th>)}</tr></thead>
              <tbody>{TABLE.rows.map((r, i) => <tr key={i}><th scope="row" style={{ padding: 0 }}><button type="button" aria-label={`Row ${i + 1}`} aria-pressed={row === i} onClick={() => pick(i, null)} style={{ font: "inherit", padding: "6px 10px", background: row === i ? "#fde8d9" : "transparent", border: "1px solid #d8d8ce", cursor: "pointer" }}>{i + 1}</button></th>{r.map((v, j) => <td key={j} style={{ padding: "6px 10px", border: "1px solid #d8d8ce", background: row === i ? "#fde8d9" : col === j ? "#d9efe9" : "#fbfaf5" }}>{v}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Figure>
        <Controls>
          <fieldset><legend>What kind of variable is each column?</legend>
            {TABLE.cols.map((c, j) => <div key={c} style={{ marginBottom: 6 }}><span style={{ fontSize: 13 }}>{c}: </span>{["numerical", "categorical"].map((k) => <label key={k} style={{ marginRight: 10, fontSize: 13 }}><input type="radio" name={`kind-${j}`} checked={guess[j] === k} onChange={() => answer(j, k)} /> {k}</label>)}
              {guess[j] && <span style={{ fontSize: 13, color: guess[j] === TABLE.kinds[j] ? C.b : "#b00020" }}>{guess[j] === TABLE.kinds[j] ? " ✓" : " ✗ think about whether averaging makes sense"}</span>}</div>)}
          </fieldset>
        </Controls>
      </Grid>
      <Readout items={[["Observations (rows)", String(TABLE.rows.length)], ["Variables (columns)", String(TABLE.cols.length)], ["Numerical", String(nums)], ["Categorical", String(TABLE.cols.length - nums)]]} />
    </Playground>
  );
}

/* ── 2 · Centre: the mean chases outliers, the median does not ── */
export function CenterPlayground({ onDone }: Done) {
  const [v, setV] = useState(70), xs = withExtra(v), m = mean(xs), md = median(xs), move = (x: number) => { setV(x); onDone?.(); };
  return (
    <Playground id="st-center" title="Drag the last house up" intro={<>Eight houses cost ₹42 to ₹60 lakh. A ninth, drawn in orange, is yours to move. Watch the <strong>mean</strong> (the balance point) and the <strong>median</strong> (the middle value) respond.</>}
      actions={<><Btn onClick={() => move(55)}>An ordinary house</Btn><Btn onClick={() => move(250)}>A luxury villa (₹250 lakh)</Btn></>}
      note="The mean uses every value, so one extreme value pulls it. The median only cares about the order, so it barely moves. For skewed data such as house prices, report the median, or report both and explain why they differ.">
      <Grid>
        <Figure caption={`Mean ${fmt(m, 1)} lakh. Median ${fmt(md, 1)} lakh.`}>
          <Chart label={`Nine house prices; the last is ${v}. Mean ${fmt(m, 1)}, median ${fmt(md, 1)}`} xDomain={[30, 300]} yDomain={[0, 1]} xTicks={[50, 100, 150, 200, 250, 300]} yTicks={[]} xLabel="price (₹ lakh)" yLabel="" width={480} height={190}>
            {(sx, sy) => <>
              {xs.map((x, i) => <circle key={i} cx={sx(x)} cy={sy(0.3)} r="8" fill={i === xs.length - 1 ? C.a : C.b} fillOpacity="0.85" stroke="#fff" />)}
              <line x1={sx(m)} x2={sx(m)} y1={sy(0.55)} y2={sy(0.1)} stroke={C.a} strokeWidth="3" /><text x={sx(m)} y={sy(0.65)} fontSize="12" textAnchor="middle" fill={C.a} fontWeight="700">mean</text>
              <line x1={sx(md)} x2={sx(md)} y1={sy(0.55)} y2={sy(0.1)} stroke={C.ink} strokeWidth="3" strokeDasharray="4 3" /><text x={sx(md)} y={sy(0.85)} fontSize="12" textAnchor="middle" fill={C.ink} fontWeight="700">median</text>
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Price of the ninth house (₹ lakh)" min={30} max={300} step={5} value={v} onChange={move} display={String(v)} /></Controls>
      </Grid>
      <Readout items={[["Mean", fmt(m, 2)], ["Median", fmt(md, 2)], ["Mean − median", fmt(m - md, 2)]]} />
    </Playground>
  );
}

/* ── 3 · Spread: same centre, different story ── */
export function SpreadPlayground({ onDone }: Done) {
  const [which, setWhich] = useState<"tight" | "wide">("tight"), [samp, setSamp] = useState(false);
  const xs = which === "tight" ? TIGHT : WIDE, m = mean(xs), v = variance(xs, samp), s = std(xs, samp), pick = (w: "tight" | "wide") => { setWhich(w); onDone?.(); };
  return (
    <Playground id="st-spread" title="Same average, different spread" intro={<>Two neighbourhoods both average ₹50 lakh. The <strong>variance</strong> is the average squared distance from the mean, and the <strong>standard deviation</strong> is its square root, back in the original units.</>}
      actions={<><Btn onClick={() => pick("tight")}>Tight neighbourhood</Btn><Btn onClick={() => pick("wide")}>Wide neighbourhood</Btn><Btn onClick={() => { setSamp(!samp); onDone?.(); }}>{samp ? "Switch to dividing by n" : "Switch to dividing by n − 1"}</Btn></>}
      note={samp ? "Dividing by n − 1 corrects for the fact that a sample sits closer to its own mean than to the true mean. Use it when your data are a sample from a larger population." : "Dividing by n treats these seven values as the whole population. If they were only a sample, you would divide by n − 1."}>
      <Grid>
        <Figure caption={`Mean ${fmt(m, 0)}. Each orange line is a distance from the mean that gets squared.`}>
          <Chart label={`${which} neighbourhood prices with mean ${m}; standard deviation ${fmt(s, 2)}`} xDomain={[20, 80]} yDomain={[0, 1]} xTicks={[20, 30, 40, 50, 60, 70, 80]} yTicks={[]} xLabel="price (₹ lakh)" yLabel="" width={480} height={190}>
            {(sx, sy) => <>
              <rect x={sx(m - s)} y={sy(0.95)} width={sx(m + s) - sx(m - s)} height={sy(0.05) - sy(0.95)} fill={C.b} fillOpacity="0.1" />
              {xs.map((x, i) => <g key={i}><line x1={sx(m)} x2={sx(x)} y1={sy(0.3 + (i % 2) * 0.2)} y2={sy(0.3 + (i % 2) * 0.2)} stroke={C.a} /><circle cx={sx(x)} cy={sy(0.3 + (i % 2) * 0.2)} r="7" fill={C.b} stroke="#fff" /></g>)}
              <line x1={sx(m)} x2={sx(m)} y1={sy(0.95)} y2={sy(0.05)} stroke={C.ink} strokeDasharray="4 3" />
            </>}
          </Chart>
        </Figure>
      </Grid>
      <Readout items={[["Mean", fmt(m, 1)], ["Range", fmt(Math.max(...xs) - Math.min(...xs), 0)], ["Variance", fmt(v, 2)], ["Standard deviation", fmt(s, 2)]]} />
    </Playground>
  );
}

/* ── 4 · Distributions: the bin width changes the picture ── */
export function HistogramPlayground({ onDone }: Done) {
  const [w, setW] = useState(10), q = quartiles(SCORES30), h = histogram(SCORES30, w, 30), move = (x: number) => { setW(x); onDone?.(); };
  const iqr = q.q3 - q.q1, lo = q.q1 - 1.5 * iqr, hi = q.q3 + 1.5 * iqr, out = SCORES30.filter((x) => x < lo || x > hi);
  return (
    <Playground id="st-hist" title="Choose the bin width" intro={<>Thirty exam scores. A histogram counts how many fall in each bin, so the bin width is a choice, and it changes the shape you see. Try very narrow and very wide bins.</>}
      actions={<><Btn onClick={() => move(2)}>Too narrow (2)</Btn><Btn onClick={() => move(10)}>Reasonable (10)</Btn><Btn onClick={() => move(40)}>Too wide (40)</Btn></>}
      note="Narrow bins show noise and gaps; wide bins hide structure. The five-number summary below does not depend on any bin choice. A value beyond 1.5 × IQR from the quartiles is flagged as a possible outlier, not automatically a mistake.">
      <Grid>
        <Figure caption={`Bins of width ${w}, starting at 30. The dashed lines mark the quartiles.`}>
          <Chart label={`Histogram of 30 exam scores in bins of width ${w}`} xDomain={[30, 30 + h.length * w]} yDomain={[0, Math.max(...h) * 1.2]} xTicks={Array.from({ length: Math.min(h.length + 1, 9) }, (_, i) => 30 + Math.round((i * h.length) / Math.min(h.length, 8)) * w).filter((x, i, a) => a.indexOf(x) === i && x <= 30 + h.length * w)} yTicks={[]} xLabel="score" yLabel="students" width={480} height={240}>
            {(sx, sy) => <>
              {h.map((c, i) => <rect key={i} x={sx(30 + i * w) + 1} y={sy(c)} width={Math.max(1, sx(30 + (i + 1) * w) - sx(30 + i * w) - 2)} height={sy(0) - sy(c)} fill={C.b} fillOpacity="0.8" />)}
              {[q.q1, q.q2, q.q3].map((x, i) => <line key={i} x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(Math.max(...h) * 1.2)} stroke={C.a} strokeDasharray="4 3" />)}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Bin width" min={2} max={40} step={1} value={w} onChange={move} display={String(w)} /></Controls>
      </Grid>
      <Readout items={[["Bins", String(h.length)], ["Min · Q1 · Median · Q3 · Max", `${Math.min(...SCORES30)} · ${q.q1} · ${q.q2} · ${q.q3} · ${Math.max(...SCORES30)}`], ["IQR", String(iqr)], ["Possible outliers", out.length ? out.join(", ") : "none"]]} />
    </Playground>
  );
}

/* ── 5 · Relationships: correlation, outliers and what it does not say ── */
export function CorrelationPlayground({ onDone }: Done) {
  const [y, setY] = useState(45), [on, setOn] = useState(true);
  const xs = on ? [...PX, 1] : PX, ys = on ? [...PY, y] : PY, r = correlation(xs, ys), b = slope(xs, ys), a = mean(ys) - b * mean(xs);
  return (
    <Playground id="st-rel" title="One odd point can change the story" intro={<>Ten houses: bigger area, higher price. The orange point is an extra house with a small area, and you choose its price. The <strong>correlation r</strong> measures how closely the points follow a straight line, from −1 to +1.</>}
      actions={<><Btn onClick={() => { setY(45); setOn(true); onDone?.(); }}>A normal point</Btn><Btn onClick={() => { setY(120); setOn(true); onDone?.(); }}>A strange point (₹120 lakh)</Btn><Btn onClick={() => { setOn(!on); onDone?.(); }}>{on ? "Remove the extra point" : "Add the extra point"}</Btn></>}
      note="A high r says the two variables move together, not that one causes the other. Ice-cream sales and drownings both rise in summer, and heat is the hidden cause of both. Association is a fact about the data; causation needs an experiment or a careful design.">
      <Grid>
        <Figure caption={`r = ${fmt(r, 3)}. The line is the best straight-line fit: price ≈ ${fmt(a, 1)} + ${fmt(b, 1)} × area.`}>
          <Chart label={`Scatter of area against price with correlation ${fmt(r, 2)}`} xDomain={[0.5, 4]} yDomain={[20, 130]} xTicks={[1, 1.5, 2, 2.5, 3, 3.5, 4]} yTicks={[40, 60, 80, 100, 120]} xLabel="area (thousand sq ft)" yLabel="price (₹ lakh)" width={480} height={290}>
            {(sx, sy) => <>
              <line x1={sx(0.5)} y1={sy(a + b * 0.5)} x2={sx(4)} y2={sy(a + b * 4)} stroke={C.ink} strokeDasharray="5 4" />
              {PX.map((x, i) => <circle key={i} cx={sx(x)} cy={sy(PY[i])} r="6" fill={C.b} stroke="#fff" />)}
              {on && <circle cx={sx(1)} cy={sy(y)} r="8" fill={C.a} stroke="#fff" strokeWidth="2" />}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Price of the extra house (₹ lakh)" min={30} max={125} step={5} value={y} onChange={(v) => { setY(v); setOn(true); onDone?.(); }} display={String(y)} /></Controls>
      </Grid>
      <Readout items={[["Correlation r", fmt(r, 3)], ["Slope", fmt(b, 2)], ["Points", String(xs.length)]]} />
    </Playground>
  );
}

/* ── 6 · Sampling: many samples, one stable pattern ── */
export function SamplingPlayground({ onDone }: Done) {
  const [n, setN] = useState(25), [means, setMeans] = useState<number[]>([]), seed = useRef(1);
  const draw = () => { setMeans(sampleMeans(n, 300, seed.current++)); onDone?.(); };
  const bins = 16, lo = 40, hi = 110, h = Array(bins).fill(0); means.forEach((m) => { const k = Math.min(bins - 1, Math.max(0, Math.floor(((m - lo) / (hi - lo)) * bins))); h[k]++; });
  const se = standardError(POP_SD, n);
  return (
    <Playground id="st-samp" title="Draw many samples, watch the averages" intro={<>Prices are skewed: most houses are cheap and a few are very expensive (true mean ₹{POP_MEAN} lakh, standard deviation ₹{POP_SD} lakh). Take a sample of <code>n</code> houses, record its mean, and repeat 300 times. Those means form the <em>sampling distribution</em>.</>}
      actions={<><Btn primary onClick={draw}>Draw 300 samples</Btn><Btn onClick={() => { setMeans([]); }}>Clear</Btn></>}
      note="Even though individual prices are skewed, the sample means pile up in a bell shape around the true mean, and the pile gets narrower as n grows. Its spread, the standard error, is σ/√n: to halve it you need four times the data.">
      <Grid>
        <Figure caption={means.length ? "Histogram of 300 sample means. The dashed line marks the true mean." : "Choose n, then draw samples."}>
          <Chart label={`Sampling distribution of the mean for samples of ${n}`} xDomain={[lo, hi]} yDomain={[0, Math.max(30, ...h) * 1.15]} xTicks={[40, 55, 70, 85, 100]} yTicks={[]} xLabel="sample mean (₹ lakh)" yLabel="samples" width={480} height={250}>
            {(sx, sy) => <>
              {h.map((c, i) => <rect key={i} x={sx(lo + (i * (hi - lo)) / bins) + 1} y={sy(c)} width={sx(lo + (hi - lo) / bins) - sx(lo) - 2} height={sy(0) - sy(c)} fill={C.b} fillOpacity="0.8" />)}
              <line x1={sx(POP_MEAN)} x2={sx(POP_MEAN)} y1={sy(0)} y2={sy(Math.max(30, ...h) * 1.15)} stroke={C.a} strokeDasharray="4 3" strokeWidth="2" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Sample size n" min={2} max={100} step={1} value={n} onChange={(v) => { setN(v); setMeans([]); onDone?.(); }} display={String(n)} /></Controls>
      </Grid>
      <Readout items={[["Standard error σ/√n", fmt(se, 2)], ["Mean of the sample means", means.length ? fmt(mean(means), 1) : "draw samples"], ["Spread of the sample means", means.length ? fmt(std(means, true), 2) : "draw samples"]]} />
    </Playground>
  );
}

/* ── 7 · ML: how sure are we of a test accuracy? ── */
export function AccuracyPlayground({ onDone }: Done) {
  const [acc, setAcc] = useState(0.8), [n, setN] = useState(100), correct = Math.round(acc * n), [lo, hi] = accuracyInterval(correct, n);
  const sizes = [25, 100, 400, 1600];
  return (
    <Playground id="st-ml" title="Your test accuracy is an estimate" intro={<>A model gets <strong>{correct}</strong> of <strong>{n}</strong> test examples right: {pct(correct / n, 0)}. That number comes from one sample of data, so it carries uncertainty. A 95% interval is roughly the estimate ± 1.96 standard errors.</>}
      actions={<>{sizes.map((s) => <Btn key={s} onClick={() => { setN(s); onDone?.(); }}>{s} test examples</Btn>)}</>}
      note="Two models that differ by two points on a small test set may not really differ: their intervals overlap. More test data narrows the interval, with the same square-root payoff as in the sampling lab.">
      <Grid>
        <Figure caption={`With ${n} examples the plausible range is ${pct(lo)} to ${pct(hi)}.`}>
          <Chart label={`Accuracy ${pct(acc, 0)} with 95% interval ${pct(lo)} to ${pct(hi)}`} xDomain={[0.4, 1]} yDomain={[0, sizes.length + 1]} xTicks={[0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]} yTicks={[]} xLabel="accuracy" yLabel="test-set size" width={480} height={250}>
            {(sx, sy) => <>{sizes.map((s, i) => { const [l, h] = accuracyInterval(Math.round(acc * s), s); return <g key={s} opacity={s === n ? 1 : 0.45}><line x1={sx(l)} x2={sx(h)} y1={sy(i + 1)} y2={sy(i + 1)} stroke={s === n ? C.a : C.b} strokeWidth="5" strokeLinecap="round" /><circle cx={sx(Math.round(acc * s) / s)} cy={sy(i + 1)} r="5" fill={C.ink} /><text x={sx(0.41)} y={sy(i + 1) - 9} fontSize="11" fill={C.ink}>n = {s}</text></g>; })}</>}
          </Chart>
        </Figure>
        <Controls><Field label="Observed accuracy" min={0.5} max={0.99} step={0.01} value={acc} onChange={(v) => { setAcc(v); onDone?.(); }} display={pct(acc, 0)} /><Field label="Test examples n" min={25} max={1600} step={25} value={n} onChange={(v) => { setN(v); onDone?.(); }} display={String(n)} /></Controls>
      </Grid>
      <Readout items={[["Correct", `${correct} of ${n}`], ["Standard error", pct(Math.sqrt((correct / n) * (1 - correct / n) / n), 2)], ["95% interval", `${pct(lo)} to ${pct(hi)}`], ["Width", pct(hi - lo)]]} />
    </Playground>
  );
}
