"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, curvePoints, fmt } from "./ui";
import { bill, compound, crossoverDay, doublings, FARE_MAX, fare, growth, lin, solveLinear, sq } from "./algebra-math";

/* ── 1 · Variables: balance the bill ── */
export function VariablesPlayground() {
  const [n, setN] = useState(2);
  const total = bill(n), gap = total - 330;
  const verdict = gap === 0 ? "Balanced. This value of n makes the story true." : gap < 0 ? `Not enough: ₹${-gap} short of the ₹330 bill.` : `Too much: ₹${gap} over the ₹330 bill.`;
  return (
    <Playground id="alg-var" title="Find the number that balances the bill" intro={<>A book costs ₹120 and each notebook ₹35. The bill is ₹330. Instead of guessing, call the number of notebooks <code>n</code>: the story becomes <code>120 + 35n = 330</code>. Slide <code>n</code> until the two sides balance.</>}
      actions={<><Btn onClick={() => setN(6)}>Show me the answer</Btn></>}
      note="Solving is just undoing, in reverse order: subtract the book (330 − 120 = 210), then divide by the price (210 ÷ 35 = 6).">
      <Grid>
        <Figure caption={verdict}>
          <Chart label={`Your side costs ₹${total}; the target is ₹330. ${verdict}`} xDomain={[0, 3]} yDomain={[0, 450]} xTicks={[]} yTicks={[0, 150, 300, 450]} xLabel="your side  ·  the bill" yLabel="₹">
            {(sx, sy) => <>
              <rect x={sx(0.35)} y={sy(120)} width={sx(1.25) - sx(0.35)} height={sy(0) - sy(120)} fill="#8b958f" />
              <rect x={sx(0.35)} y={sy(total)} width={sx(1.25) - sx(0.35)} height={sy(120) - sy(total)} fill="#e36c28" />
              <rect x={sx(1.75)} y={sy(330)} width={sx(2.65) - sx(1.75)} height={sy(0) - sy(330)} fill="#1f7568" />
              <text x={sx(0.8)} y={sy(60)} textAnchor="middle" fontSize="12" fill="#fff">book 120</text>
              {n > 0 && <text x={sx(0.8)} y={sy(120 + (total - 120) / 2) + 4} textAnchor="middle" fontSize="12" fill="#fff">{n} × 35</text>}
              <text x={sx(2.2)} y={sy(165)} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">330</text>
              <line x1={sx(0.1)} x2={sx(2.9)} y1={sy(330)} y2={sy(330)} stroke="#16211c" strokeDasharray="5 4" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Notebooks n" min={0} max={10} step={1} value={n} onChange={setN} display={String(n)} /></Controls>
      </Grid>
      <Readout items={[["Your side: 120 + 35n", `₹${total}`], ["The bill", "₹330"], ["Difference", gap === 0 ? "0" : `${gap > 0 ? "+" : "−"}₹${Math.abs(gap)}`]]} />
    </Playground>
  );
}

/* ── 2 · Functions: a machine with a domain ── */
export function FunctionsPlayground() {
  const [d, setD] = useState(2.5);
  const ok = d >= 0 && d <= FARE_MAX;
  return (
    <Playground id="alg-fn" title="Feed the fare machine" intro={<>A delivery app quotes <code>f(d) = 2d + 3</code> rupees for <code>d</code> km. One input in, exactly one quote out, but only for distances the app serves (0 to {FARE_MAX} km). Try a negative distance.</>}
      actions={<><Btn onClick={() => setD(0)}>0 km</Btn><Btn onClick={() => setD(2.5)}>2.5 km</Btn><Btn onClick={() => setD(-1)}>−1 km</Btn></>}
      note="The domain is the set of inputs the rule accepts. Outside it, the machine does not return a wrong number: it returns no quote at all.">
      <Grid>
        <Figure caption={ok ? `A ${fmt(d, 1)} km trip costs ₹${fmt(fare(d), 1)}.` : "No quote: this distance is outside the domain."}>
          <Chart label={ok ? `Input ${d} km gives output ${fare(d)}` : `Input ${d} km is outside the domain`} xDomain={[-5, 12]} yDomain={[-5, 30]} xTicks={[-4, 0, 4, 8, 12]} yTicks={[0, 10, 20, 30]} xLabel="distance d (km)" yLabel="fare f(d) (₹)">
            {(sx, sy) => <>
              <polyline points={`${sx(0)},${sy(fare(0))} ${sx(12)},${sy(fare(12))}`} stroke="#1f7568" strokeWidth="3" fill="none" />
              <polyline points={`${sx(-5)},${sy(fare(-5))} ${sx(0)},${sy(fare(0))}`} stroke="#c9cfc7" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              {ok ? <><line x1={sx(d)} x2={sx(d)} y1={sy(0)} y2={sy(fare(d))} stroke="#e36c28" strokeDasharray="3 3" /><circle cx={sx(d)} cy={sy(fare(d))} r="6.5" fill="#e36c28" stroke="#fff" strokeWidth="2" /></>
                : <text x={sx(d)} y={sy(2)} textAnchor="middle" fontSize="16" fill="#b00020">✕</text>}
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Distance d (km)" min={-5} max={12} step={0.5} value={d} onChange={setD} /></Controls>
      </Grid>
      <Readout items={[["Input d", `${fmt(d, 1)} km`], ["Output f(d)", ok ? `₹${fmt(fare(d), 1)}` : "no quote"], ["In the domain?", ok ? "yes" : "no"]]} />
    </Playground>
  );
}

/* ── 3 · Graphs: slope and intercept ── */
export function GraphsPlayground() {
  const [a, setA] = useState(2), [b, setB] = useState(3);
  const xi = a === 0 ? null : -b / a;
  return (
    <Playground id="alg-gr" title="Read a line: where it starts and how fast it climbs" intro={<>Every straight rule is <code>y = a·x + b</code>. The intercept <code>b</code> is the starting fee (where the line meets the price axis). The slope <code>a</code> is the price of one more kilometre. Change them one at a time.</>}
      actions={<><Btn onClick={() => { setA(2); setB(3); }}>Reset to 2 and 3</Btn></>}
      note={`One step right (1 km more) moves the line ${a >= 0 ? "up" : "down"} by ${fmt(Math.abs(a), 2)}. That is the slope: change in output ÷ change in input.`}>
      <Grid>
        <Figure caption="The orange step shows one unit of input and the rise it causes.">
          <Chart label={`Line y = ${a}x + ${b}. Slope ${a}, intercept ${b}${xi === null ? "" : `, crosses zero at x = ${fmt(xi, 2)}`}`} xDomain={[-4, 6]} yDomain={[-10, 20]} xTicks={[-4, -2, 0, 2, 4, 6]} yTicks={[-10, 0, 10, 20]} xLabel="x" yLabel="y">
            {(sx, sy) => <>
              <polyline points={`${sx(-4)},${sy(a * -4 + b)} ${sx(6)},${sy(a * 6 + b)}`} stroke="#1f7568" strokeWidth="3" fill="none" />
              <polyline points={`${sx(1)},${sy(a + b)} ${sx(2)},${sy(a + b)} ${sx(2)},${sy(2 * a + b)}`} stroke="#e36c28" strokeWidth="2.5" fill="none" />
              <circle cx={sx(0)} cy={sy(b)} r="6" fill="#16211c" stroke="#fff" strokeWidth="1.5" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Slope a" min={-5} max={5} step={0.5} value={a} onChange={setA} />
          <Field label="Intercept b" min={-5} max={10} step={0.5} value={b} onChange={setB} />
        </Controls>
      </Grid>
      <Readout items={[["Rule", `y = ${fmt(a, 1)}x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b), 1)}`], ["Starts at (x = 0)", fmt(b, 1)], ["Crosses y = 0 at", xi === null ? "never" : `x = ${fmt(xi, 2)}`]]} />
    </Playground>
  );
}

/* ── 4 · Powers: adding versus multiplying ── */
export function PowersPlayground() {
  const [days, setDays] = useState(5), [n, setN] = useState(12);
  const cross = crossoverDay();
  return (
    <Playground id="alg-pow" title="Adding 10 each day versus doubling each day" intro={<>Two storage plans both start at 10 GB. Plan A <strong>adds</strong> 10 GB a day. Plan B <strong>doubles</strong> every day. For a few days they look alike; then they do not.</>}
      actions={<Btn onClick={() => setDays(10)}>Jump to day 10</Btn>}
      note={`Doubling first beats adding on day ${cross}. By day ${days}: Plan A ${fmt(growth.linear(days), 0)} GB, Plan B ${fmt(growth.doubling(days), 0)} GB. The second slider shows where (1 + 1/n)ⁿ settles: the number e ≈ 2.718.`}>
      <Grid>
        <Figure caption="Teal: adds 10 a day. Orange: doubles every day.">
          <Chart label={`Plan A adds 10 GB a day, Plan B doubles. On day ${days}: A ${growth.linear(days)}, B ${growth.doubling(days)}`} xDomain={[0, 10]} yDomain={[0, 400]} xTicks={[0, 2, 4, 6, 8, 10]} yTicks={[0, 100, 200, 300, 400]} xLabel="day" yLabel="GB (clipped at 400)">
            {(sx, sy) => <>
              <polyline points={curvePoints((x) => Math.min(growth.linear(x), 400), 0, 10, sx, sy)} stroke="#1f7568" strokeWidth="3" fill="none" />
              <polyline points={curvePoints((x) => Math.min(growth.doubling(x), 400), 0, 10, sx, sy)} stroke="#e36c28" strokeWidth="3" fill="none" />
              <line x1={sx(days)} x2={sx(days)} y1={sy(0)} y2={sy(400)} stroke="#16211c" strokeDasharray="4 4" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Day" min={0} max={10} step={1} value={days} onChange={setDays} display={String(days)} />
          <Field label="Compounding periods n" min={1} max={1000} step={1} value={n} onChange={setN} display={String(n)} />
        </Controls>
      </Grid>
      <Readout items={[["Plan A (adds)", `${fmt(growth.linear(days), 0)} GB`], ["Plan B (doubles)", `${fmt(growth.doubling(days), 0)} GB`], ["(1 + 1/n)ⁿ", fmt(compound(n), 6)]]} />
    </Playground>
  );
}

/* ── 5 · Logarithms: counting doublings ── */
export function LogarithmsPlayground() {
  const [p, setP] = useState(2);
  const target = 10 ** p, x = doublings(target);
  return (
    <Playground id="alg-log" title="How many doublings does it take?" intro={<>A logarithm asks the reverse of a power: <em>how many times</em> must I double to reach a number? Slide the target from 10 up to a million, and read the answer off the bottom.</>}
      actions={<><Btn onClick={() => setP(3)}>1,000</Btn><Btn onClick={() => setP(6)}>1,000,000</Btn></>}
      note={`2^${fmt(x, 4)} = ${fmt(target, 0)}. A thousand-fold increase needs only about 10 doublings; a million-fold, only about 20. Logarithms squash huge ranges into small ones, which is why charts of growth often use a log axis.`}>
      <Grid>
        <Figure caption="The orange dot reads off how many doublings reach your target. Each whole step right is one more doubling.">
          <Chart label={`${fmt(target, 0)} is reached after ${fmt(x, 2)} doublings of 1`} xDomain={[0, 21]} yDomain={[0, 21]} xTicks={[0, 5, 10, 15, 20]} yTicks={[0, 5, 10, 15, 20]} xLabel="number of doublings" yLabel="log₂ of the value">
            {(sx, sy) => <>
              <polyline points={curvePoints((v) => v, 0, 21, sx, sy, 2)} stroke="#c9cfc7" strokeWidth="2" fill="none" />
              <line x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(x)} stroke="#e36c28" strokeDasharray="3 3" />
              <circle cx={sx(x)} cy={sy(x)} r="6.5" fill="#e36c28" stroke="#fff" strokeWidth="2" />
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Target value (power of ten)" min={1} max={6} step={0.25} value={p} onChange={setP} display={fmt(target, 0)} /></Controls>
      </Grid>
      <Readout items={[["Target", fmt(target, 0)], ["Doublings needed (log₂)", fmt(x, 4)], ["Powers of ten (log₁₀)", fmt(p, 2)]]} />
    </Playground>
  );
}

/* ── 6 · Transformations: shift, stretch and chain ── */
export function TransformationsPlayground() {
  const [h, setH] = useState(2), [k, setK] = useState(1);
  const g = (x: number) => k * sq(x - h);
  return (
    <Playground id="alg-tr" title="Slide and stretch a curve, then chain two rules" intro={<>Start from <code>f(x) = x²</code> (grey). Replacing <code>x</code> with <code>x − h</code> slides the curve right by <code>h</code>; multiplying by <code>k</code> stretches it. Then notice that chaining rules depends on the order.</>}
      actions={<Btn onClick={() => { setH(2); setK(1); }}>Reset</Btn>}
      note={`Chaining: with f(x) = x² and g(x) = 2x + 1, f(g(2)) = f(5) = 25 but g(f(2)) = g(4) = 9. The order matters.`}>
      <Grid>
        <Figure caption="Grey: x². Teal: your curve k·(x − h)².">
          <Chart label={`Curve ${k}·(x − ${h})². Its lowest point is at x = ${h}.`} xDomain={[-4, 8]} yDomain={[0, 30]} xTicks={[-4, 0, 4, 8]} yTicks={[0, 10, 20, 30]} xLabel="x" yLabel="y">
            {(sx, sy) => <>
              <polyline points={curvePoints((x) => Math.min(sq(x), 32), -4, 8, sx, sy)} stroke="#a8b0a8" strokeWidth="2.2" fill="none" />
              <polyline points={curvePoints((x) => Math.min(g(x), 32), -4, 8, sx, sy)} stroke="#1f7568" strokeWidth="3" fill="none" />
              <circle cx={sx(h)} cy={sy(0)} r="6" fill="#e36c28" stroke="#fff" strokeWidth="2" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Slide right by h" min={-3} max={6} step={0.5} value={h} onChange={setH} />
          <Field label="Stretch by k" min={0.25} max={3} step={0.25} value={k} onChange={setK} />
        </Controls>
      </Grid>
      <Readout items={[["Lowest point", `x = ${fmt(h, 1)}`], ["Value at x = 5", fmt(g(5), 2)], ["f(g(2)) vs g(f(2))", `${sq(lin(2))} vs ${lin(sq(2))}`]]} />
    </Playground>
  );
}
