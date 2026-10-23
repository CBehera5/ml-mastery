import { CUSTOMERS, TEST, TRAIN } from "../../logistic/playground/lg-math";
export const mean = (v: readonly number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN);
export const dot = (a: readonly number[], b: readonly number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const norm = (a: readonly number[]) => Math.sqrt(dot(a, a));

/* ── SV01 · margin geometry ── */
export const score = (w: readonly number[], b: number, x: readonly number[]) => dot(w, x) + b;
export const distance = (w: readonly number[], b: number, x: readonly number[]) => score(w, b, x) / norm(w);
export const hinge = (y: 1 | -1, F: number) => Math.max(0, 1 - y * F);

/** Two well-separated groups, plus one stray customer on each side that makes the margin a real choice. */
function blobRows(seed: number, n: number): Row[] {
  let s = seed >>> 0; const r = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const g = () => (r() + r() + r() - 1.5) * 1.1;
  const rows = Array.from({ length: n }, (_, i) => { const y: 1 | -1 = i % 2 === 0 ? 1 : -1; return [Number((y * 1.7 + g() * 0.8).toFixed(2)), Number((y * 1.0 + g() * 0.8).toFixed(2)), y] as Row; });
  return rows;
}
export const BLOBS = blobRows(5, 32);
export const BLOBS_HELD = blobRows(808, 40);

/* ── SV02 · a soft-margin linear SVM by sub-gradient descent on  ½‖w‖² + C·Σ hinge ── */
export type Row = readonly [x1: number, x2: number, y: 1 | -1];
export const ROWS: Row[] = TRAIN.map(c => [c.complaints, c.tenure, c.y ? 1 : -1] as Row);
export const HELD: Row[] = TEST.map(c => [c.complaints, c.tenure, c.y ? 1 : -1] as Row);
export function fitLinear(rows: readonly Row[], C: number, iters = 4000) {
  let w = [0, 0], b = 0; const n = rows.length;
  for (let t = 1; t <= iters; t++) {
    const gw = [w[0] / (C * n), w[1] / (C * n)]; let gb = 0;
    for (const [x1, x2, y] of rows) if (y * (w[0] * x1 + w[1] * x2 + b) < 1) { gw[0] -= (y * x1) / n; gw[1] -= (y * x2) / n; gb -= y / n; }
    const step = 1 / Math.sqrt(t) * 0.5; w = [w[0] - step * gw[0] * 1, w[1] - step * gw[1] * 1]; b -= step * gb;
  }
  return { w, b, margin: 2 / norm(w) };
}
export type Linear = ReturnType<typeof fitLinear>;
export const supports = (m: Linear, rows: readonly Row[]) => rows.filter(([x1, x2, y]) => y * (m.w[0] * x1 + m.w[1] * x2 + m.b) <= 1.05).length;
export const linAccuracy = (m: Linear, rows: readonly Row[]) => rows.filter(([x1, x2, y]) => (m.w[0] * x1 + m.w[1] * x2 + m.b >= 0 ? 1 : -1) === y).length / rows.length;

/* ── SV03 · RBF similarity ── */
export const rbf = (d: number, gamma: number) => Math.exp(-gamma * d * d);
export const sqDist = (a: readonly number[], b: readonly number[]) => a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0);
/** A ring of customers: the inner group leaves, the outer group stays. */
export function ring(seed: number, n: number): Row[] {
  let s = seed >>> 0; const r = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  return Array.from({ length: n }, (_, i) => { const inner = i % 2 === 0, rad = (inner ? 0.9 : 2.4) + (r() - 0.5) * 0.6, th = r() * 2 * Math.PI; return [Number((rad * Math.cos(th)).toFixed(2)), Number((rad * Math.sin(th)).toFixed(2)), inner ? 1 : -1] as Row; });
}
export const RING_TRAIN = ring(11, 60), RING_TEST = ring(97, 60);
/** Kernel SVM (RBF) by sub-gradient descent on  ½αᵀKα + C·Σ hinge. */
export function fitRbf(rows: readonly Row[], C: number, gamma: number, iters = 3000) {
  const n = rows.length, K = rows.map(a => rows.map(b => rbf(Math.sqrt(sqDist([a[0], a[1]], [b[0], b[1]])), gamma)));
  let a = new Array<number>(n).fill(0), b = 0;
  for (let t = 1; t <= iters; t++) {
    const f = K.map((row, i) => row.reduce((s, k, j) => s + k * a[j], 0) + b), g = new Array<number>(n).fill(0); let gb = 0;
    for (let i = 0; i < n; i++) { const y = rows[i][2]; if (y * f[i] < 1) { for (let j = 0; j < n; j++) g[j] -= C * y * K[i][j]; gb -= C * y; } }
    for (let j = 0; j < n; j++) g[j] += K[j].reduce((s, k, m) => s + k * a[m], 0);
    const step = 0.2 / Math.sqrt(t) / (1 + C); a = a.map((v, j) => v - step * g[j]); b -= step * gb / n;
  }
  return { rows, a, b, gamma };
}
export const rbfScore = (m: ReturnType<typeof fitRbf>, x: readonly number[]) => m.rows.reduce((s, r, j) => s + m.a[j] * rbf(Math.sqrt(sqDist([r[0], r[1]], x)), m.gamma), m.b);
export const rbfAccuracy = (m: ReturnType<typeof fitRbf>, rows: readonly Row[]) => rows.filter(r => (rbfScore(m, [r[0], r[1]]) >= 0 ? 1 : -1) === r[2]).length / rows.length;

/* ── SV04 · fit scaling on training rows only; class weights ── */
export const TRAIN_VALUES = [0, 2] as const, VALID_VALUES = [100] as const;
export const classC = (C: number, weight: number) => C * weight;
/* ── SV05 · accuracy versus balanced accuracy ── */
export function balanced(pos: number, neg: number, posRight: number, negRight: number) {
  const recallPos = pos ? posRight / pos : NaN, recallNeg = neg ? negRight / neg : NaN;
  return { accuracy: (posRight + negRight) / (pos + neg), balanced: (recallPos + recallNeg) / 2, recallPos, recallNeg };
}
export const toPy = (a: unknown) => JSON.stringify(a);
export { CUSTOMERS };
