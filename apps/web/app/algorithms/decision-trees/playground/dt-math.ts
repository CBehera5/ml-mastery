/* ── Shared helpers ── */
export const mean = (v: readonly number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN);
export const sse = (v: readonly number[]) => { const m = mean(v); return v.reduce((s, x) => s + (x - m) ** 2, 0); };

/* ── DT01 · a tree is a flowchart of questions. Prices in ₹10 lakh units. ── */
export const HOUSES: readonly (readonly [area: number, price: number])[] = [[1, 2.8], [2, 3.2], [3, 6.5], [4, 7.1], [5, 7.4], [6, 9.2], [7, 8.8]];
export function stump2(t1: number, t2: number, area: number) {
  const region = area <= t1 ? 0 : area <= t2 ? 1 : 2;
  const members = HOUSES.filter(([a]) => (a <= t1 ? 0 : a <= t2 ? 1 : 2) === region);
  const leaf = (r: number) => mean(HOUSES.filter(([a]) => (a <= t1 ? 0 : a <= t2 ? 1 : 2) === r).map(h => h[1]));
  return { region, prediction: mean(members.map(h => h[1])), leaves: [leaf(0), leaf(1), leaf(2)], path: region === 0 ? [`area ≤ ${t1}: yes`] : region === 1 ? [`area ≤ ${t1}: no`, `area ≤ ${t2}: yes`] : [`area ≤ ${t1}: no`, `area ≤ ${t2}: no`] };
}

/* ── DT02 · regression leaves: the split that cuts squared error the most ── */
export const TARGETS = [2, 3, 3, 4, 8, 9, 9, 10] as const;
export function splitAt(ys: readonly number[], k: number) {
  const left = ys.slice(0, k), right = ys.slice(k), parent = sse(ys), child = sse(left) + sse(right);
  return { left, right, parent, child, reduction: parent - child, leftMean: mean(left), rightMean: mean(right) };
}
export function bestSplit(ys: readonly number[]) {
  let best = 1; for (let k = 2; k < ys.length; k++) if (splitAt(ys, k).reduction > splitAt(ys, best).reduction) best = k;
  return best;
}

/* ── DT03 · Gini impurity for churn leaves ── */
export const gini = (counts: readonly number[]) => { const n = counts.reduce((a, b) => a + b, 0); return n ? 1 - counts.reduce((s, c) => s + (c / n) ** 2, 0) : 0; };
export function giniGain(left: readonly [number, number], right: readonly [number, number]) {
  const nl = left[0] + left[1], nr = right[0] + right[1], parent: [number, number] = [left[0] + right[0], left[1] + right[1]], n = nl + nr;
  const weighted = n ? (nl * gini(left) + nr * gini(right)) / n : 0;
  return { parent, parentGini: gini(parent), weighted, gain: gini(parent) - weighted };
}

/* ── DT04 · depth: a one-feature regression tree on a noisy cohort ── */
function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
export type Pt = readonly [x: number, y: number];
export function cohort(seed: number, n: number): Pt[] {
  const r = lcg(seed); return Array.from({ length: n }, (_, i) => { const x = 1 + (i * 9) / (n - 1) + (r() - 0.5) * 0.3; const base = x < 5.5 ? 3 : 8; return [Number(x.toFixed(2)), Number((base + (r() + r() + r() - 1.5) * 3.2).toFixed(2))] as Pt; });
}
export const TRAIN_PTS = cohort(77, 24), VALID_PTS = cohort(991, 24);
export type Tree = { leaf: number } | { t: number; left: Tree; right: Tree };
export function grow(pts: readonly Pt[], depth: number, minLeaf: number): Tree {
  const sorted = [...pts].sort((a, b) => a[0] - b[0]), ys = sorted.map(p => p[1]);
  if (depth === 0 || sorted.length < 2 * minLeaf) return { leaf: mean(ys) };
  let best = -1, bestGain = 1e-9;
  for (let k = minLeaf; k <= sorted.length - minLeaf; k++) { if (sorted[k - 1][0] === sorted[k][0]) continue; const g = sse(ys) - sse(ys.slice(0, k)) - sse(ys.slice(k)); if (g > bestGain) { bestGain = g; best = k; } }
  if (best < 0) return { leaf: mean(ys) };
  return { t: (sorted[best - 1][0] + sorted[best][0]) / 2, left: grow(sorted.slice(0, best), depth - 1, minLeaf), right: grow(sorted.slice(best), depth - 1, minLeaf) };
}
export const predictTree = (tree: Tree, x: number): number => ("leaf" in tree ? tree.leaf : predictTree(x <= tree.t ? tree.left : tree.right, x));
export const leavesOf = (tree: Tree): number => ("leaf" in tree ? 1 : leavesOf(tree.left) + leavesOf(tree.right));
export const mse = (tree: Tree, pts: readonly Pt[]) => mean(pts.map(([x, y]) => (predictTree(tree, x) - y) ** 2));

/* ── DT05 · fit safely: keep every label with its own customer ── */
export type Cust = { id: string; bill: number; churned: 0 | 1 };
export const CUSTS: readonly Cust[] = [
  { id: "A", bill: 300, churned: 0 }, { id: "B", bill: 450, churned: 0 }, { id: "C", bill: 520, churned: 0 }, { id: "D", bill: 640, churned: 0 },
  { id: "E", bill: 700, churned: 1 }, { id: "F", bill: 780, churned: 1 }, { id: "G", bill: 860, churned: 1 }, { id: "H", bill: 950, churned: 1 },
];
export const HELD: readonly Cust[] = [
  { id: "P", bill: 350, churned: 0 }, { id: "Q", bill: 480, churned: 0 }, { id: "R", bill: 600, churned: 0 }, { id: "S", bill: 690, churned: 0 },
  { id: "T", bill: 740, churned: 1 }, { id: "U", bill: 820, churned: 1 }, { id: "V", bill: 900, churned: 1 }, { id: "W", bill: 1000, churned: 1 },
];
/** Best single bill cut by training accuracy (first wins ties). */
export function bestCut(bills: readonly number[], labels: readonly number[]) {
  const cuts = [...new Set(bills)].sort((a, b) => a - b); let best = cuts[0], acc = -1;
  for (const c of cuts) { const a = bills.filter((b, i) => (b > c ? 1 : 0) === labels[i]).length / bills.length; if (a > acc) { acc = a; best = c; } }
  return { cut: best, trainAccuracy: acc };
}
export const heldAccuracy = (cut: number) => HELD.filter(c => (c.bill > cut ? 1 : 0) === c.churned).length / HELD.length;
/** Sorting the feature table by bill (high to low) while the label column stays in id order. */
export function misaligned() { const bills = [...CUSTS].sort((a, b) => b.bill - a.bill).map(c => c.bill); return { bills, labels: CUSTS.map(c => c.churned) }; }
export const aligned = () => ({ bills: CUSTS.map(c => c.bill), labels: CUSTS.map(c => c.churned) });

/* ── DT06 · rules describe the fitted tree, not the world ── */
export type House = { area: number; age: number; price: number };
export const TOWN_A: readonly House[] = [
  { area: 1, age: 15, price: 2.6 }, { area: 1.5, age: 12, price: 2.9 }, { area: 2, age: 20, price: 3.1 }, { area: 1.2, age: 5, price: 3.6 }, { area: 1.8, age: 8, price: 3.8 },
  { area: 2.5, age: 3, price: 4.9 }, { area: 3, age: 14, price: 5.2 }, { area: 3, age: 6, price: 5.8 }, { area: 3.5, age: 2, price: 6.1 }, { area: 4, age: 11, price: 6.4 },
  { area: 4, age: 7, price: 6.9 }, { area: 4.5, age: 1, price: 7.4 }, { area: 5, age: 9, price: 7.6 }, { area: 5, age: 4, price: 8.1 }, { area: 5.5, age: 13, price: 8.0 },
  { area: 6, age: 2, price: 8.8 }, { area: 6, age: 16, price: 8.3 }, { area: 6.5, age: 5, price: 9.2 }, { area: 7, age: 10, price: 9.4 }, { area: 7.5, age: 3, price: 9.9 },
];
export const TOWN_B: readonly House[] = [
  { area: 3, age: 4, price: 5.0 }, { area: 3.5, age: 6, price: 5.4 }, { area: 4, age: 3, price: 6.0 }, { area: 4.5, age: 5, price: 6.3 }, { area: 5, age: 2, price: 7.0 },
  { area: 5.5, age: 7, price: 7.2 }, { area: 6, age: 3, price: 8.0 }, { area: 6, age: 8, price: 7.7 }, { area: 6.5, age: 4, price: 8.4 }, { area: 7, age: 6, price: 9.0 },
  { area: 7, age: 2, price: 9.3 }, { area: 7.5, age: 5, price: 9.6 }, { area: 8, age: 1, price: 10.0 }, { area: 8, age: 9, price: 9.5 }, { area: 8.5, age: 3, price: 10.4 },
  { area: 9, age: 4, price: 10.9 }, { area: 9, age: 7, price: 10.6 }, { area: 9.5, age: 2, price: 11.2 }, { area: 10, age: 5, price: 11.6 }, { area: 10, age: 10, price: 11.1 },
];
export const covers = (rows: readonly House[], areaMax: number, ageMin: number) => rows.filter(h => h.area <= areaMax && h.age > ageMin);
export const shareOf = (reductions: Readonly<Record<string, number>>, key: string) => reductions[key] / Object.values(reductions).reduce((a, b) => a + b, 0);
export const toPy = (a: unknown) => JSON.stringify(a);
