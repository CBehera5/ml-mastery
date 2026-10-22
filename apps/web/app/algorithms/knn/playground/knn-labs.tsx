"use client";
import { useState } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, fmt } from "../../../math/extras/ui";
import { CUSTOMERS, rank, standardise, toZ, vote, type Point } from "./knn-math";

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
