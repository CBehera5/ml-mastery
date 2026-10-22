import { TRAIN_PTS, VALID_PTS, grow, mean, predictTree, type Pt } from "../../decision-trees/playground/dt-math";
export { TRAIN_PTS, VALID_PTS, mean };
export type { Pt };

export function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

/* ── RF01 · bootstrap bags ── */
export const IDS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
/** n draws with replacement from n rows. */
export function bootstrap(n: number, seed: number): number[] { const r = lcg(seed); return Array.from({ length: n }, () => Math.floor(r() * n)); }
export function bagStats(draw: readonly number[], n: number) {
  const counts = Array.from({ length: n }, (_, i) => draw.filter(d => d === i).length);
  return { counts, unique: counts.filter(c => c > 0).length, oob: counts.map((c, i) => (c === 0 ? i : -1)).filter(i => i >= 0) };
}
/** Average share of rows that appear in a bag, over many seeds. */
export function meanUniqueShare(n: number, bags: number) { let s = 0; for (let b = 0; b < bags; b++) s += bagStats(bootstrap(n, 1000 + b), n).unique / n; return s / bags; }

/* ── RF02 / RF04 · a regression forest on one feature ── */
export function forestBags(pts: readonly Pt[], trees: number, seed = 5) { return Array.from({ length: trees }, (_, t) => bootstrap(pts.length, seed + t * 7919)); }
export function fitForest(pts: readonly Pt[], trees: number, depth = 3, seed = 5) {
  const bags = forestBags(pts, trees, seed);
  return { bags, trees: bags.map(b => grow(b.map(i => pts[i]), depth, 1)) };
}
export type Forest = ReturnType<typeof fitForest>;
export const forestPredict = (f: Forest, x: number) => mean(f.trees.map(t => predictTree(t, x)));
export const forestMse = (f: Forest, pts: readonly Pt[]) => mean(pts.map(([x, y]) => (forestPredict(f, x) - y) ** 2));
export const treeMse = (f: Forest, t: number, pts: readonly Pt[]) => mean(pts.map(([x, y]) => (predictTree(f.trees[t], x) - y) ** 2));
/** Out-of-bag prediction for training row i: only trees whose bag missed it vote. */
export function oobPredict(f: Forest, pts: readonly Pt[], i: number) {
  const votes = f.trees.filter((_, t) => !f.bags[t].includes(i)).map(t => predictTree(t, pts[i][0]));
  return { n: votes.length, prediction: votes.length ? mean(votes) : NaN };
}
export function oobMse(f: Forest, pts: readonly Pt[]) {
  const errs = pts.map((p, i) => { const o = oobPredict(f, pts, i); return Number.isFinite(o.prediction) ? (o.prediction - p[1]) ** 2 : NaN; }).filter(Number.isFinite);
  return { mse: mean(errs), rows: errs.length, missing: pts.length - errs.length };
}

/* ── RF03 · aggregating class probabilities ── */
export const meanProba = (ps: readonly number[]) => mean(ps);
export const hardVote = (ps: readonly number[]) => (ps.filter(p => p >= 0.5).length * 2 > ps.length ? 1 : 0);

/* ── RF05 · a classification forest and permutation importance ── */
export type Cust = readonly [complaints: number, tenure: number, noise: number, churned: 0 | 1];
export const FEATURES = ["complaints", "tenure", "random number"] as const;
export function custs(seed: number, n: number): Cust[] {
  const r = lcg(seed), z = () => (r() + r() + r() + r() - 2) * 1.7320508;
  return Array.from({ length: n }, () => { const c = z(), t = z(), noise = z(), p = 1 / (1 + Math.exp(-(1.6 * c - 1.1 * t - 0.3))); return [Number(c.toFixed(2)), Number(t.toFixed(2)), Number(noise.toFixed(2)), r() < p ? 1 : 0] as Cust; });
}
export const CTRAIN = custs(314, 160), CHELD = custs(2718, 80);
type CTree = { p: number } | { f: number; t: number; left: CTree; right: CTree };
const g = (a: number, b: number) => { const n = a + b; return n ? 1 - (a / n) ** 2 - (b / n) ** 2 : 0; };
function growC(rows: readonly Cust[], depth: number, rng: () => number): CTree {
  const ones = rows.filter(r => r[3] === 1).length, leaf = { p: rows.length ? ones / rows.length : 0.5 };
  if (depth === 0 || rows.length < 6 || ones === 0 || ones === rows.length) return leaf;
  const feats = [0, 1, 2].sort(() => rng() - 0.5).slice(0, 2);
  let best: { f: number; t: number; s: number } | null = null;
  for (const f of feats) { const v = [...rows].sort((a, b) => a[f] - b[f]); for (let k = 3; k <= v.length - 3; k++) { if (v[k - 1][f] === v[k][f]) continue; const l = v.slice(0, k), rr = v.slice(k), lo = l.filter(x => x[3]).length, ro = rr.filter(x => x[3]).length, s = (l.length * g(l.length - lo, lo) + rr.length * g(rr.length - ro, ro)) / v.length; if (!best || s < best.s) best = { f, t: (v[k - 1][f] + v[k][f]) / 2, s }; } }
  if (!best) return leaf;
  const { f, t } = best; return { f, t, left: growC(rows.filter(r => r[f] <= t), depth - 1, rng), right: growC(rows.filter(r => r[f] > t), depth - 1, rng) };
}
const predC = (t: CTree, row: readonly number[]): number => ("p" in t ? t.p : predC(row[t.f] <= t.t ? t.left : t.right, row));
export function fitClassForest(rows: readonly Cust[], trees = 15, seed = 11) {
  const rng = lcg(seed);
  return Array.from({ length: trees }, (_, k) => growC(bootstrap(rows.length, seed + k * 104729).map(i => rows[i]), 4, rng));
}
export const forestProba = (f: ReturnType<typeof fitClassForest>, row: readonly number[]) => mean(f.map(t => predC(t, row)));
export const classAccuracy = (f: ReturnType<typeof fitClassForest>, rows: readonly Cust[]) => rows.filter(r => (forestProba(f, r) >= 0.5 ? 1 : 0) === r[3]).length / rows.length;
export const FOREST = fitClassForest(CTRAIN);
/** Accuracy drop when one held-out column is shuffled (mean over 5 shuffles). */
export function permutationDrop(feature: number, rows: readonly Cust[] = CHELD, forest = FOREST) {
  const base = classAccuracy(forest, rows); let total = 0;
  for (let s = 0; s < 5; s++) { const r = lcg(900 + s * 31 + feature), order = rows.map((_, i) => i).sort(() => r() - 0.5); const shuffled = rows.map((row, i) => { const c = [...row] as unknown as number[]; c[feature] = rows[order[i]][feature]; return c as unknown as Cust; }); total += classAccuracy(forest, shuffled); }
  return { base, permuted: total / 5, drop: base - total / 5 };
}
export const toPy = (a: unknown) => JSON.stringify(a);
