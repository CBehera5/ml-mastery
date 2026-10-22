"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { CUSTOMERS, NOISY_TRAIN, NOISY_VALID, RARE_TEST, RARE_TRAIN, accuracyOn, confusion, rank, standardise, toZ, vote, type Point } from "./knn-math";

const STAY = "#1f7568", LEAVE = "#e36c28", PICK = "#16211c";
const word = (label: 0 | 1) => (label ? "leaves" : "stays");

function Dots({ sx, sy, coords, chosen }: { sx: (x: number) => number; sy: (y: number) => number; coords: readonly Point[]; chosen: ReadonlySet<string> }) {
  return <>{CUSTOMERS.map((c, i) => {
    const on = chosen.has(c.id), x = sx(coords[i][0]), y = sy(coords[i][1]);
    return <g key={c.id}>
      {c.churned ? <rect x={x - 6} y={y - 6} width="12" height="12" fill={LEAVE} stroke={on ? PICK : "#fff"} strokeWidth={on ? 3 : 1.5} /> : <circle cx={x} cy={y} r="7" fill={STAY} stroke={on ? PICK : "#fff"} strokeWidth={on ? 3 : 1.5} />}
      <text x={x} y={y - 11} textAnchor="middle" fontSize="10" fill="#16211c">{c.id}</text>
    </g>;
  })}</>;
}

/* ── KN01 · Vote among neighbors: bill in ₹ hundreds and contacts are on a similar scale ── */
export function NeighborsPlayground() {
  const [bill, setBill] = useState(750), [contacts, setContacts] = useState(0), [k, setK] = useState(3);
  const query: Point = [bill / 100, contacts], coords = CUSTOMERS.map<Point>(c => [c.bill / 100, c.contacts]);
  const ranked = rank(CUSTOMERS, coords, query), result = vote(ranked, k);
  const ids = new Set(result.chosen.map(item => item.customer.id)), reach = result.chosen[result.chosen.length - 1].d;
  const verdict = `${result.churn} of ${k} nearest customers churned, so this customer ${word(result.prediction)}.`;
  return (
    <Playground id="knn-vote" title="Let the nearest customers vote" intro={<>A new customer joins. We do not fit a formula. We find the <strong>{k}</strong> most similar past customers (by monthly bill and support contacts) and let them vote. Drag the new customer around and change <em>k</em>.</>}
      actions={<><Btn onClick={() => { setBill(750); setContacts(0); }}>A close call</Btn><Btn onClick={() => { setBill(400); setContacts(1); }}>Clearly a stayer</Btn><Btn onClick={() => { setBill(900); setContacts(5); }}>Clearly a leaver</Btn></>}
      note="Circles stayed, squares churned. Try k = 1, 3 and 5: the verdict flips, because the answer depends on how many neighbors you ask. The ring marks how far we had to look to find k neighbors. A bigger k asks more people, so a lone odd neighbor matters less, but the neighbors also sit farther away.">
      <Grid>
        <Figure caption={verdict}>
          <Chart label={`New customer at ₹${bill} and ${contacts} contacts. ${verdict}`} xDomain={[1, 12]} yDomain={[-0.5, 6.5]} xTicks={[2, 4, 6, 8, 10, 12]} yTicks={[0, 2, 4, 6]} xLabel="monthly bill (₹ hundreds)" yLabel="support contacts">
            {(sx, sy) => <>
              <ellipse cx={sx(query[0])} cy={sy(query[1])} rx={Math.abs(sx(query[0] + reach) - sx(query[0]))} ry={Math.abs(sy(query[1] + reach) - sy(query[1]))} fill="none" stroke={PICK} strokeDasharray="4 4" />
              <Dots sx={sx} sy={sy} coords={coords} chosen={ids} />
              <polygon points={`${sx(query[0])},${sy(query[1]) - 10} ${sx(query[0]) + 9},${sy(query[1]) + 7} ${sx(query[0]) - 9},${sy(query[1]) + 7}`} fill="#fff" stroke={PICK} strokeWidth="2.5" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Monthly bill (₹)" min={200} max={1100} step={50} value={bill} onChange={setBill} display={`₹${bill}`} />
          <Field label="Support contacts" min={0} max={6} step={1} value={contacts} onChange={setContacts} display={String(contacts)} />
          <Field label="Neighbors k" min={1} max={9} step={2} value={k} onChange={setK} display={String(k)} />
        </Controls>
      </Grid>
      <Readout items={[["Nearest, in order", result.chosen.map(item => `${item.customer.id} (${fmt(item.d, 2)})`).join(", ")], ["Votes", `${result.churn} churn · ${result.stay} stay`], ["Prediction", result.prediction ? "will churn" : "will stay"]]} />
    </Playground>
  );
}

/* ── KN02 · Scale defines closeness: raw ₹ swamps contacts until we standardise ── */
export function ScalePlayground() {
  const [bill, setBill] = useState(450), [contacts, setContacts] = useState(5), [scaled, setScaled] = useState(false);
  const scaler = standardise(CUSTOMERS), k = 3;
  const space = (useScale: boolean) => ({ coords: CUSTOMERS.map<Point>(c => useScale ? toZ(scaler, c.bill, c.contacts) : [c.bill, c.contacts]), query: (useScale ? toZ(scaler, bill, contacts) : [bill, contacts]) as Point });
  const raw = space(false), z = space(true);
  const rawVote = vote(rank(CUSTOMERS, raw.coords, raw.query), k), zVote = vote(rank(CUSTOMERS, z.coords, z.query), k);
  const active = scaled ? { ...z, result: zVote } : { ...raw, result: rawVote };
  const ids = new Set(active.result.chosen.map(item => item.customer.id));
  const differ = rawVote.prediction !== zVote.prediction || rawVote.chosen.map(i => i.customer.id).join() !== zVote.chosen.map(i => i.customer.id).join();
  const caption = scaled ? "Both features now count in standard units, so contacts matter again." : "In raw units, ₹ swing by hundreds while contacts move by a few: the bill decides almost everything.";
  const dom = scaled ? { x: [-2, 2.2] as [number, number], y: [-2, 2.2] as [number, number], xt: [-2, -1, 0, 1, 2], yt: [-2, -1, 0, 1, 2] } : { x: [100, 1200] as [number, number], y: [-0.5, 6.5] as [number, number], xt: [200, 600, 1000], yt: [0, 2, 4, 6] };
  return (
    <Playground id="knn-scale" title="Same customers, different ruler" intro={<>Distance adds up differences in <em>every</em> feature, so the feature with the biggest numbers wins. ₹ bills move in hundreds; support contacts move in ones. Switch the ruler and watch the neighbors change without any customer changing.</>}
      actions={<><Btn primary onClick={() => setScaled(!scaled)}>{scaled ? "Show raw units" : "Standardise both features"}</Btn><Btn onClick={() => { setBill(450); setContacts(5); }}>A case where the ruler matters</Btn></>}
      note="Standardising rewrites each feature as 'how many standard deviations from the training average'. Learn the average and spread from training customers only, then reuse them for every new customer.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`${scaled ? "Standardised" : "Raw"} view. ${caption}`} xDomain={dom.x} yDomain={dom.y} xTicks={dom.xt} yTicks={dom.yt} xLabel={scaled ? "bill (standard deviations)" : "monthly bill (₹)"} yLabel={scaled ? "contacts (std. dev.)" : "support contacts"}>
            {(sx, sy) => <>
              <Dots sx={sx} sy={sy} coords={active.coords} chosen={ids} />
              <polygon points={`${sx(active.query[0])},${sy(active.query[1]) - 10} ${sx(active.query[0]) + 9},${sy(active.query[1]) + 7} ${sx(active.query[0]) - 9},${sy(active.query[1]) + 7}`} fill="#fff" stroke={PICK} strokeWidth="2.5" />
            </>}
          </Chart>
        </Figure>
        <Controls>
          <Field label="Monthly bill (₹)" min={200} max={1100} step={50} value={bill} onChange={setBill} display={`₹${bill}`} />
          <Field label="Support contacts" min={0} max={6} step={1} value={contacts} onChange={setContacts} display={String(contacts)} />
        </Controls>
      </Grid>
      <Readout items={[["Raw neighbors (k = 3)", rawVote.chosen.map(i => i.customer.id).join(", ")], ["Standardised neighbors", zVote.chosen.map(i => i.customer.id).join(", ")], ["Predictions", `raw ${rawVote.prediction ? "churns" : "stays"} · standardised ${zVote.prediction ? "churns" : "stays"}${differ ? " — the ruler changed the answer" : ""}`]]} />
    </Playground>
  );
}

/* ── KN03 · choose k honestly: training accuracy flatters small k; validation tells the truth ── */
export const K_CHOICES = [1, 3, 5, 7, 9, 11, 13, 15] as const;
export function ChooseKPlayground() {
  const [k, setK] = useState(1);
  const curve = K_CHOICES.map(value => ({ k: value, train: accuracyOn(NOISY_TRAIN, NOISY_TRAIN, value), valid: accuracyOn(NOISY_TRAIN, NOISY_VALID, value) }));
  const here = curve.find(item => item.k === k)!, best = curve.reduce((a, b) => (b.valid > a.valid ? b : a));
  const gap = here.train - here.valid;
  const caption = k === 1 ? "With k = 1 every training customer is its own nearest neighbor, so it looks nearly perfect on the customers it has already seen." : gap > 0.12 ? "A wide gap between the two lines means the model is remembering, not learning." : "The two lines sit close: what it learned carries over to customers it has not seen.";
  const pct = (v: number) => `${fmt(v * 100, 0)}%`;
  return (
    <Playground id="knn-k" title="Which k should we trust?" intro={<>120 past customers train the model and 80 different customers test it. Try each k and compare how it does on customers it has <em>seen</em> with how it does on customers it has <em>never seen</em>. Only the second tells you about tomorrow.</>}
      actions={<><Btn onClick={() => setK(1)}>k = 1</Btn><Btn onClick={() => setK(best.k)}>Best on unseen customers</Btn><Btn onClick={() => setK(15)}>k = 15</Btn></>}
      note="Pick k with held-out data, never with the training score, and never by peeking at the final test again and again. The unseen curve is bumpy: do not expect every bigger k to be better.">
      <Grid>
        <Figure caption={caption}>
          <Chart label={`Accuracy by k. At k = ${k}: training ${pct(here.train)}, unseen ${pct(here.valid)}. ${caption}`} xDomain={[0, 16]} yDomain={[0.4, 1]} xTicks={[1, 5, 9, 13]} yTicks={[0.4, 0.6, 0.8, 1]} xLabel="neighbors k" yLabel="accuracy">
            {(sx, sy) => <>
              <polyline fill="none" stroke={STAY} strokeWidth="2.5" points={curve.map(c => `${sx(c.k)},${sy(c.train)}`).join(" ")} />
              <polyline fill="none" stroke={LEAVE} strokeWidth="2.5" points={curve.map(c => `${sx(c.k)},${sy(c.valid)}`).join(" ")} />
              <line x1={sx(k)} x2={sx(k)} y1={sy(0.4)} y2={sy(1)} stroke={PICK} strokeDasharray="4 4" />
              <circle cx={sx(k)} cy={sy(here.train)} r="6" fill={STAY} stroke="#fff" strokeWidth="2" /><circle cx={sx(k)} cy={sy(here.valid)} r="6" fill={LEAVE} stroke="#fff" strokeWidth="2" />
              <text x={sx(15.2)} y={sy(curve[7].train) - 8} fontSize="11" fill={STAY} textAnchor="end">seen customers</text><text x={sx(15.2)} y={sy(curve[7].valid) + 16} fontSize="11" fill={LEAVE} textAnchor="end">unseen customers</text>
            </>}
          </Chart>
        </Figure>
        <Controls><Field label="Neighbors k" min={1} max={15} step={2} value={k} onChange={setK} display={String(k)} /></Controls>
      </Grid>
      <Readout items={[["Right on seen customers", pct(here.train)], ["Right on unseen customers", pct(here.valid)], ["Gap", `${fmt(gap * 100, 0)} points`], ["Best on unseen", `k = ${best.k} (${pct(best.valid)})`]]} />
    </Playground>
  );
}

/* ── KN04 · limits: accuracy hides who you miss ── */
export function LimitsPlayground() {
  const [k, setK] = useState(5), [baseline, setBaseline] = useState(false);
  const c = confusion(RARE_TRAIN, RARE_TEST, baseline ? "always-stay" : k), churners = c.tp + c.fn;
  const caption = baseline ? `Predicting "stays" for everyone is right ${fmt(c.accuracy * 100, 1)}% of the time and finds none of the ${churners} customers who left.` : `Of ${churners} customers who really left, the model caught ${c.tp} and missed ${c.fn}.`;
  return (
    <Playground id="knn-limits" title="A good score can hide who you miss" intro={<>Only {fmt((churners / RARE_TEST.length) * 100, 0)}% of these {RARE_TEST.length} customers actually left. That makes "accuracy" easy to flatter. Compare the model with the lazy answer that nobody ever leaves, and watch <em>recall</em>: of the customers who left, how many did we catch?</>}
      actions={<><Btn primary onClick={() => setBaseline(!baseline)}>{baseline ? "Back to KNN" : "Predict “stays” for everyone"}</Btn></>}
      note="Before trusting a score, ask who the mistakes land on. A retention team cares about the customers who leave, and a 96% accuracy figure says nothing about them.">
      <Grid>
        <Figure caption={caption}>
          <table aria-label="Confusion table"><caption className="sr-only">Predictions against what really happened</caption>
            <thead><tr><th scope="col"></th><th scope="col">Predicted: stays</th><th scope="col">Predicted: leaves</th></tr></thead>
            <tbody><tr><th scope="row">Really stayed</th><td>{c.tn}</td><td>{c.fp}</td></tr><tr><th scope="row">Really left</th><td>{c.fn}</td><td>{c.tp}</td></tr></tbody></table>
        </Figure>
        <Controls><Field label="Neighbors k" min={1} max={15} step={2} value={k} onChange={v => { setK(v); setBaseline(false); }} display={String(k)} /></Controls>
      </Grid>
      <Readout items={[["Accuracy", `${fmt(c.accuracy * 100, 1)}%`], ["Recall of leavers", `${fmt(c.recall * 100, 0)}%`], ["Missed leavers", String(c.fn)]]} />
    </Playground>
  );
}
