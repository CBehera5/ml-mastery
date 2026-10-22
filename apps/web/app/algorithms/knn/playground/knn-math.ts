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
