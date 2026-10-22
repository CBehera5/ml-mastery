/** Fictional house prices: area x (normalised, 0–4.5) and price in ₹ lakh. The true curve flattens as area grows. */
export const TRUE_CURVE = (x: number) => 10 + 12 * x - 1.0 * x * x;
function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
export type House = { x: number; y: number };
export function houses(seed: number, n: number, lo: number, hi: number): House[] {
  const rand = lcg(seed);
  return Array.from({ length: n }, (_, i) => { const x = Math.round((lo + ((hi - lo) * (i + rand() * 0.8)) / n) * 100) / 100; const noise = (rand() + rand() + rand() - 1.5) * 4; return { x, y: Math.round((TRUE_CURVE(x) + noise) * 10) / 10 }; });
}
export const ALL = houses(31, 40, 0.2, 4.4);
export const TRAIN = ALL.filter((_, i) => i % 2 === 0), VALID = ALL.filter((_, i) => i % 2 === 1);
export const NARROW = ALL.filter(h => h.x <= 3);

/** Least squares on powers of the centred, scaled area; ridge penalty alpha leaves the intercept alone. */
export function fit(data: readonly House[], degree: number, alpha = 0, mid = 2.3, half = 2.2) {
  const rows = data.map(h => { const t = (h.x - mid) / half; return Array.from({ length: degree + 1 }, (_, k) => t ** k); });
  const m = degree + 1, A = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => rows.reduce((s, r) => s + r[i] * r[j], 0) + (i === j && i > 0 ? alpha : 0)));
  const b = Array.from({ length: m }, (_, i) => rows.reduce((s, r, k) => s + r[i] * data[k].y, 0));
  for (let c = 0; c < m; c++) { let p = c; for (let r = c + 1; r < m; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < m; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < m; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; } }
  const w = new Array(m).fill(0); for (let i = m - 1; i >= 0; i--) { w[i] = (b[i] - A[i].slice(i + 1).reduce((s, v, k) => s + v * w[i + 1 + k], 0)) / A[i][i]; }
  return (x: number) => { const t = (x - mid) / half; return w.reduce((s, wk, k) => s + wk * t ** k, 0); };
}
export const mae = (model: (x: number) => number, data: readonly House[]) => data.reduce((s, h) => s + Math.abs(model(h.x) - h.y), 0) / data.length;
/** A hand-built curve: ŷ = b + w1·x + w2·x². */
export const handCurve = (b: number, w1: number, w2: number) => (x: number) => b + w1 * x + w2 * x * x;
export const columns = (p: number, d: number) => { let c = 1; for (let i = 1; i <= d; i++) c = (c * (p + i)) / i; return Math.round(c) - 1; };
export const expand2 = (a: number, b: number) => [a, b, a * a, a * b, b * b];
export const DEGREES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const toPy = (rows: readonly House[]) => "[" + rows.map(h => `(${h.x}, ${h.y})`).join(", ") + "]";
