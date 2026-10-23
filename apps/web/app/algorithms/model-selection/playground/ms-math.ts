export const mean = (v: readonly number[]) => v.reduce((a, b) => a + b, 0) / v.length;
export const reduction = (baseline: number, candidate: number) => (baseline - candidate) / baseline;

/* ── MS02 · a search spends information ── */
export const fits = (c: number, g: number, folds: number) => c * g * folds;
function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
/** Expected best of n equally good candidates whose scores wobble by one standard deviation (simulated, repeatable). */
export function expectedBest(n: number, trials = 600) {
  const r = lcg(2024), z = () => (r() + r() + r() + r() - 2) * 1.7320508; let total = 0;
  for (let t = 0; t < trials; t++) { let best = -Infinity; for (let i = 0; i < n; i++) best = Math.max(best, z()); total += best; }
  return total / trials;
}
/* ── MS03 · nested validation ── */
export const nestedFits = (outer: number, inner: number, candidates: number) => outer * (candidates * inner + 1);
export function kfold(n: number, k: number) {
  const sizes = Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0)); let start = 0;
  return sizes.map(sz => { const idx = Array.from({ length: sz }, (_, j) => start + j); start += sz; return idx; });
}
/* ── MS04 · thresholds and cost ── */
export const PS = [0.05, 0.1, 0.12, 0.2, 0.22, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.92, 0.95] as const;
export const YS = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1] as const;
export function tally(t: number) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  PS.forEach((p, i) => { const g = p >= t ? 1 : 0; if (g && YS[i]) tp++; else if (g) fp++; else if (YS[i]) fn++; else tn++; });
  return { tp, fp, tn, fn, accuracy: (tp + tn) / PS.length };
}
export const totalCost = (fp: number, fn: number, cfp: number, cfn: number) => fp * cfp + fn * cfn;
export const BARS = Array.from({ length: 19 }, (_, i) => Number(((i + 1) * 0.05).toFixed(2)));
export function cheapestBar(cfp: number, cfn: number) { let best = BARS[0]; for (const t of BARS) { const a = tally(t), b = tally(best); if (totalCost(a.fp, a.fn, cfp, cfn) < totalCost(b.fp, b.fn, cfp, cfn)) best = t; } return best; }
/* ── MS06 · a final decision ── */
export const choose = (simple: number, complex: number, tolerance: number) => (complex - simple <= tolerance ? "simple" : "complex");
export const toPy = (a: unknown) => JSON.stringify(a);
