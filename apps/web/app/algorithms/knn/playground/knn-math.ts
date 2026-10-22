/** Fictional telecom customers: monthly bill (₹) and support contacts in the last 3 months. label 1 = churned. */
export type Customer = { id: string; bill: number; contacts: number; churned: 0 | 1 };
export const CUSTOMERS: readonly Customer[] = [
  { id: "A", bill: 300, contacts: 1, churned: 0 }, { id: "B", bill: 400, contacts: 0, churned: 0 }, { id: "C", bill: 500, contacts: 1, churned: 0 },
  { id: "D", bill: 300, contacts: 2, churned: 0 }, { id: "E", bill: 600, contacts: 2, churned: 0 }, { id: "F", bill: 400, contacts: 1, churned: 0 },
  { id: "G", bill: 800, contacts: 4, churned: 1 }, { id: "H", bill: 900, contacts: 3, churned: 1 }, { id: "I", bill: 1000, contacts: 5, churned: 1 },
  { id: "J", bill: 700, contacts: 5, churned: 1 }, { id: "K", bill: 800, contacts: 3, churned: 1 }, { id: "L", bill: 600, contacts: 4, churned: 1 },
  { id: "M", bill: 500, contacts: 3, churned: 0 }, { id: "N", bill: 700, contacts: 2, churned: 1 },
];
export type Point = readonly [number, number];
export const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export type Ranked = { customer: Customer; d: number; rank: number };
/** Rank every customer by distance to the query (ties keep the original order, so the result is stable). */
export function rank(points: readonly Customer[], coords: readonly Point[], query: Point): Ranked[] {
  return points.map((customer, index) => ({ customer, d: distance(coords[index], query), index }))
    .sort((a, b) => a.d - b.d || a.index - b.index).map((item, position) => ({ customer: item.customer, d: item.d, rank: position + 1 }));
}
export function vote(ranked: readonly Ranked[], k: number) {
  const chosen = ranked.slice(0, k), churn = chosen.filter(item => item.customer.churned === 1).length;
  return { chosen, churn, stay: k - churn, prediction: churn * 2 > k ? 1 : 0 } as const;
}
export function standardise(points: readonly Customer[]) {
  const stats = (pick: (c: Customer) => number) => { const values = points.map(pick), mean = values.reduce((a, b) => a + b, 0) / values.length; const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length); return { mean, sd: sd || 1 }; };
  return { bill: stats(c => c.bill), contacts: stats(c => c.contacts) };
}
export type Scaler = ReturnType<typeof standardise>;
export const toZ = (scaler: Scaler, bill: number, contacts: number): Point => [(bill - scaler.bill.mean) / scaler.bill.sd, (contacts - scaler.contacts.mean) / scaler.contacts.sd];

/* ── A larger, noisy cohort for lessons 3 and 4: deterministic, so every number on the page is reproducible ── */
export type Row = readonly [bill: number, contacts: number, churned: 0 | 1];
function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
/** bill in ₹ hundreds (2..12), contacts 0..6. A customer is likely to churn when bill + 1.4 × contacts is high; `noise` flips that share of labels. */
export function cohort(seed: number, n: number, cut: number, noise: number): Row[] {
  const rand = lcg(seed), rows: Row[] = [];
  for (let i = 0; i < n; i++) {
    const bill = 2 + Math.round(rand() * 20) / 2, contacts = Math.floor(rand() * 7);
    let label: 0 | 1 = bill + 1.4 * contacts > cut ? 1 : 0;
    if (rand() < noise) label = label ? 0 : 1;
    rows.push([bill, contacts, label]);
  }
  return rows;
}
export const predictRow = (train: readonly Row[], query: readonly [number, number], k: number): 0 | 1 => {
  const ranked = train.map((r, i) => ({ r, i, d: Math.hypot(r[0] - query[0], r[1] - query[1]) })).sort((a, b) => a.d - b.d || a.i - b.i).slice(0, k);
  return ranked.reduce((s, x) => s + x.r[2], 0) * 2 > k ? 1 : 0;
};
export const accuracyOn = (train: readonly Row[], test: readonly Row[], k: number) => test.filter(r => predictRow(train, [r[0], r[1]], k) === r[2]).length / test.length;
export function confusion(train: readonly Row[], test: readonly Row[], k: number | "always-stay") {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const r of test) { const p = k === "always-stay" ? 0 : predictRow(train, [r[0], r[1]], k); if (p && r[2]) tp++; else if (p) fp++; else if (r[2]) fn++; else tn++; }
  return { tp, fp, fn, tn, accuracy: (tp + tn) / test.length, recall: tp + fn ? tp / (tp + fn) : 0 };
}
/** Fixed splits used by lessons 3 and 4. */
export const NOISY = cohort(1729, 200, 11, 0.2), NOISY_TRAIN = NOISY.slice(0, 120), NOISY_VALID = NOISY.slice(120);
export const RARE = cohort(2024, 200, 15.5, 0.03), RARE_TRAIN = RARE.slice(0, 120), RARE_TEST = RARE.slice(120);
export const toPython = (rows: readonly Row[]) => "[" + rows.map(r => `(${r[0]}, ${r[1]}, ${r[2]})`).join(", ") + "]";
