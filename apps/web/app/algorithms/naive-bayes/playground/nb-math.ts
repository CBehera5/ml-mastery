/** Fictional documentation-review model: classes "Good" (0) and "Needs Improvement" (1). */
export const posterior = (priorGood: number, likeGood: number, likeNeeds: number) => {
  const good = priorGood * likeGood, needs = (1 - priorGood) * likeNeeds, total = good + needs;
  return { good, needs, total, pGood: total > 0 ? good / total : NaN, pNeeds: total > 0 ? needs / total : NaN };
};
/** Four tokens and the counts seen in a small training sample of each class. */
export const TOKENS = ["deploy", "rollback", "TODO", "deprecated"] as const;
export const GOOD_COUNTS = [6, 2, 1, 1] as const, NEEDS_COUNTS = [3, 2, 5, 0] as const;
export const smoothed = (counts: readonly number[], alpha: number) => { const total = counts.reduce((a, b) => a + b, 0) + alpha * counts.length; return counts.map(c => (c + alpha) / total); };
export const ALPHAS = [0, 0.5, 1, 2] as const;
export const gaussian = (x: number, mean: number, variance: number) => Math.exp(-((x - mean) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance);
/** Posterior for class 0 when one continuous measurement is counted `copies` times (the naive assumption lets copies pile up). */
export function gaussianPosterior(x: number, copies: number, good: { mean: number; variance: number }, needs: { mean: number; variance: number }, priorGood = 0.5) {
  const lg = Math.log(priorGood) + copies * Math.log(gaussian(x, good.mean, good.variance)), ln = Math.log(1 - priorGood) + copies * Math.log(gaussian(x, needs.mean, needs.variance));
  const m = Math.max(lg, ln), eg = Math.exp(lg - m), en = Math.exp(ln - m);
  return { pGood: eg / (eg + en), pNeeds: en / (eg + en), logGood: lg, logNeeds: ln };
}
export const logLoss = (pTrue: number) => -Math.log(pTrue);
export const brier = (pNeeds: number, y: 0 | 1) => (pNeeds - y) ** 2;
/** Base evidence leans the wrong way: log-odds of "Needs Improvement" per copy. The real document needs improvement. */
export const WRONG_LEAN = -2.2;
export const wrongLeanPNeeds = (copies: number) => 1 / (1 + Math.exp(-copies * WRONG_LEAN));
