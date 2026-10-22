/** Fictional housing data: area, rooms (almost the same information as area) and a noise column. Price is in ₹ lakh. */
function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
const normal = (r: () => number) => (r() + r() + r() + r() - 2) * 1.7320508;
export type Table = { z: number[][]; y: number[] };
export const FEATURES = ["area", "rooms", "noise"] as const;
function build(seed: number, n: number): { raw: number[][]; y: number[] } {
  const r = lcg(seed), raw: number[][] = [], y: number[] = [];
  for (let i = 0; i < n; i++) { const area = normal(r), rooms = 0.96 * area + 0.28 * normal(r), noise = normal(r); raw.push([area, rooms, noise]); y.push(Math.round((50 + 6 * area + 3 * normal(r)) * 100) / 100); }
  return { raw, y };
}
const DATA = build(77, 60);
const mean = (v: readonly number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v: readonly number[]) => { const m = mean(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length) || 1; };
export type Scaler = { mean: number[]; sd: number[] };
export const fitScaler = (rows: readonly number[][]): Scaler => ({ mean: FEATURES.map((_, j) => mean(rows.map(r => r[j]))), sd: FEATURES.map((_, j) => sd(rows.map(r => r[j]))) });
export const scale = (rows: readonly number[][], s: Scaler) => rows.map(r => r.map((v, j) => (v - s.mean[j]) / s.sd[j]));
export const TRAIN_IDX = Array.from({ length: 18 }, (_, i) => i), VALID_IDX = Array.from({ length: 42 }, (_, i) => 18 + i);
export const rowsOf = (idx: readonly number[]) => idx.map(i => DATA.raw[i]), yOf = (idx: readonly number[]) => idx.map(i => DATA.y[i]);
export const SCALER = fitScaler(rowsOf(TRAIN_IDX));
export const ZTRAIN = scale(rowsOf(TRAIN_IDX), SCALER), YTRAIN = yOf(TRAIN_IDX), ZVALID = scale(rowsOf(VALID_IDX), SCALER), YVALID = yOf(VALID_IDX);

function solve(A: number[][], b: number[]) {
  const m = b.length; A = A.map(r => r.slice()); b = b.slice();
  for (let c = 0; c < m; c++) { let p = c; for (let r = c + 1; r < m; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < m; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < m; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; } }
  const w = new Array(m).fill(0); for (let i = m - 1; i >= 0; i--) w[i] = (b[i] - A[i].slice(i + 1).reduce((s, v, k) => s + v * w[i + 1 + k], 0)) / A[i][i]; return w;
}
export type Fit = { w: number[]; b: number };
/** Ridge: minimise SSE + alpha·Σw². Intercept is the mean price and is not penalised. */
export function ridge(z: readonly number[][], y: readonly number[], alpha: number): Fit {
  const p = z[0].length, b = mean(y), yc = y.map(v => v - b);
  const A = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => z.reduce((s, r) => s + r[i] * r[j], 0) + (i === j ? alpha : 0)));
  return { w: solve(A, Array.from({ length: p }, (_, i) => z.reduce((s, r, k) => s + r[i] * yc[k], 0))), b };
}
export const soft = (rho: number, lam: number) => Math.sign(rho) * Math.max(Math.abs(rho) - lam, 0);
/** Elastic net by coordinate descent: SSE/(2n) + l1·Σ|w| + l2/2·Σw². l2 = 0 is the lasso. */
export function elastic(z: readonly number[][], y: readonly number[], l1: number, l2: number): Fit {
  const n = z.length, p = z[0].length, b = mean(y), r = y.map(v => v - b), w = new Array(p).fill(0);
  const norm = Array.from({ length: p }, (_, j) => z.reduce((s, row) => s + row[j] * row[j], 0) / n);
  for (let sweep = 0; sweep < 2000; sweep++) { let move = 0;
    for (let j = 0; j < p; j++) { const rho = z.reduce((s, row, i) => s + row[j] * (r[i] + row[j] * w[j]), 0) / n, next = soft(rho, l1) / (norm[j] + l2);
      if (next !== w[j]) { const d = next - w[j]; for (let i = 0; i < n; i++) r[i] -= z[i][j] * d; move = Math.max(move, Math.abs(d)); w[j] = next; } }
    if (move < 1e-10) break; }
  return { w, b };
}
export const predict = (f: Fit, z: readonly number[][]) => z.map(row => f.b + row.reduce((s, v, j) => s + v * f.w[j], 0));
export const maeOf = (pred: readonly number[], y: readonly number[]) => pred.reduce((s, p, i) => s + Math.abs(p - y[i]), 0) / y.length;
export const sse = (pred: readonly number[], y: readonly number[]) => pred.reduce((s, p, i) => s + (p - y[i]) ** 2, 0);
export const l1 = (w: readonly number[]) => w.reduce((s, v) => s + Math.abs(v), 0), l2sq = (w: readonly number[]) => w.reduce((s, v) => s + v * v, 0);
/** Six re-draws of 12 houses from the training set, to show how unstable correlated coefficients are. */
export function resamples(count = 6, size = 12) { const r = lcg(5), out: number[][] = []; for (let k = 0; k < count; k++) { const pick = new Set<number>(); while (pick.size < size) pick.add(Math.floor(r() * TRAIN_IDX.length)); out.push([...pick].sort((a, b) => a - b)); } return out; }
export const ALPHAS = [0, 0.1, 0.25, 0.5, 1, 2, 4] as const;
export const toPy = (a: readonly (readonly number[])[] | readonly number[]) => JSON.stringify(a);
