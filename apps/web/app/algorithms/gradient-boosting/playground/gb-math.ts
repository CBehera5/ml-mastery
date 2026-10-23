import { TRAIN_PTS, VALID_PTS, grow, mean, predictTree, type Pt, type Tree } from "../../decision-trees/playground/dt-math";
import { fitForest, forestPredict } from "../../random-forests/playground/rf-math";
export { TRAIN_PTS, VALID_PTS, mean };
export type { Pt };

/* ── GB01 / GB04 / GB06 · boosting on one feature ── */
export type Booster = { f0: number; eta: number; trees: Tree[] };
/** Start from the average price, then repeatedly fit a small tree to what is still wrong and add a fraction of it. */
export function boost(pts: readonly Pt[], stages: number, eta: number, depth = 1): Booster {
  const f0 = mean(pts.map(p => p[1])), trees: Tree[] = [];
  const F = pts.map(() => f0);
  for (let m = 0; m < stages; m++) {
    const t = grow(pts.map((p, i) => [p[0], p[1] - F[i]] as Pt), depth, 1);
    trees.push(t); pts.forEach((p, i) => { F[i] += eta * predictTree(t, p[0]); });
  }
  return { f0, eta, trees };
}
export const boostPredict = (b: Booster, x: number, stages = b.trees.length) => b.trees.slice(0, stages).reduce((s, t) => s + b.eta * predictTree(t, x), b.f0);
export const boostMse = (b: Booster, pts: readonly Pt[], stages = b.trees.length) => mean(pts.map(([x, y]) => (boostPredict(b, x, stages) - y) ** 2));
export const boostMae = (b: Booster, pts: readonly Pt[], stages = b.trees.length) => mean(pts.map(([x, y]) => Math.abs(boostPredict(b, x, stages) - y)));
/** Stage (0..budget) with the lowest validation MSE; the first wins a tie. */
export function bestStage(b: Booster, valid: readonly Pt[], budget: number) {
  let best = 0, bestErr = boostMse(b, valid, 0);
  for (let m = 1; m <= budget; m++) { const e = boostMse(b, valid, m); if (e < bestErr) { best = m; bestErr = e; } }
  return { stage: best, mse: bestErr };
}

/* ── GB02 · one row of squared-error boosting ── */
export function squaredStep(y: number, F: number, leaf: number, eta: number) {
  const residual = y - F, Fnew = F + eta * leaf;
  return { residual, Fnew, errBefore: residual ** 2, errAfter: (y - Fnew) ** 2, halfBefore: residual ** 2 / 2, halfAfter: (y - Fnew) ** 2 / 2 };
}
/* ── GB03 · one row of log-loss boosting ── */
export const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
export function logStep(y: 0 | 1, F: number, eta: number) {
  const p = sigmoid(F), gradient = y - p, hessian = p * (1 - p), leaf = gradient / hessian, Fnew = F + eta * leaf;
  return { p, gradient, hessian, leaf, Fnew, pNew: sigmoid(Fnew) };
}
/* ── GB05 · a transform must be fitted on training rows only ── */
export const TRAIN_VALUES = [0, 2] as const, VALID_VALUES = [100] as const;
export function centre(values: readonly number[], fitOn: readonly number[]) { const m = mean(fitOn); return { mean: m, shifted: values.map(v => v - m) }; }
/* ── GB06 · boosting versus a forest on the same held-out houses ── */
export function compare(stages: number, eta: number, trees = 25) {
  const b = boost(TRAIN_PTS, stages, eta, 2), f = fitForest(TRAIN_PTS, trees);
  const mae = (pred: (x: number) => number) => mean(VALID_PTS.map(([x, y]) => Math.abs(pred(x) - y)));
  return { boosting: mae(x => boostPredict(b, x)), forest: mae(x => forestPredict(f, x)) };
}
export const toPy = (a: unknown) => JSON.stringify(a);
