export const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
export const logit = (p: number) => Math.log(p / (1 - p));
export const rowLoss = (y: 0 | 1, p: number) => (y === 1 ? -Math.log(p) : -Math.log(1 - p));
export const meanLoss = (ys: readonly (0 | 1)[], ps: readonly number[]) => ys.reduce<number>((s, y, i) => s + rowLoss(y, ps[i]), 0) / ys.length;
export function counts(ps: readonly number[], ys: readonly (0 | 1)[], t: number) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  ps.forEach((p, i) => { const g = p >= t ? 1 : 0; if (g && ys[i]) tp++; else if (g) fp++; else if (ys[i]) fn++; else tn++; });
  return { tp, fp, tn, fn, precision: tp + fp ? tp / (tp + fp) : NaN, recall: tp + fn ? tp / (tp + fn) : NaN };
}
function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
const normal = (r: () => number) => (r() + r() + r() + r() - 2) * 1.7320508;
/** Fictional churn cohort. complaints and tenure are standardised; `cancelled` is a flag recorded AFTER the prediction moment. */
export type Customer = { complaints: number; tenure: number; cancelled: number; y: 0 | 1 };
export function cohort(seed: number, n: number): Customer[] {
  const r = lcg(seed);
  return Array.from({ length: n }, () => { const c = normal(r), t = normal(r), y: 0 | 1 = r() < sigmoid(-0.4 + 1.1 * c - 0.8 * t) ? 1 : 0; return { complaints: Math.round(c * 100) / 100, tenure: Math.round(t * 100) / 100, cancelled: r() < 0.03 ? 1 - y : y, y }; });
}
export const CUSTOMERS = cohort(2468, 160), TRAIN = CUSTOMERS.slice(0, 100), TEST = CUSTOMERS.slice(100);
/** Gradient descent on mean log loss + ||w||² / (2·C·n); the intercept is not penalised. */
export function fitLogistic(rows: readonly (readonly number[])[], ys: readonly number[], C: number, iterations = 2500) {
  const n = rows.length, p = rows[0].length, w = new Array(p).fill(0); let b = 0;
  for (let it = 0; it < iterations; it++) {
    const gw = new Array(p).fill(0); let gb = 0;
    rows.forEach((x, i) => { const e = sigmoid(b + x.reduce((s, v, j) => s + v * w[j], 0)) - ys[i]; gb += e / n; x.forEach((v, j) => (gw[j] += (e * v) / n)); });
    for (let j = 0; j < p; j++) w[j] -= 0.5 * (gw[j] + w[j] / (C * n)); b -= 0.5 * gb;
  }
  return { w, b, p: (x: readonly number[]) => sigmoid(b + x.reduce((s, v, j) => s + v * w[j], 0)) };
}
export const accuracy = (ps: readonly number[], ys: readonly number[], t = 0.5) => ps.filter((p, i) => (p >= t ? 1 : 0) === ys[i]).length / ys.length;
/** Eight customers for lesson 6: a logit score and what really happened. */
export const SCORES = [-2.5, -1.5, -0.8, -0.3, 0.4, 0.9, 1.6, 2.4], OUTCOMES: (0 | 1)[] = [0, 0, 1, 0, 1, 0, 1, 1];
export const toPy = (a: unknown) => JSON.stringify(a);
