export const mean = (v: readonly number[]) => v.reduce((a, b) => a + b, 0) / v.length;
export const mae = (pred: readonly number[], y: readonly number[]) => mean(pred.map((p, i) => Math.abs(p - y[i])));
export const sse = (pred: readonly number[], y: readonly number[]) => pred.reduce((s, p, i) => s + (p - y[i]) ** 2, 0);
export const sst = (y: readonly number[]) => { const m = mean(y); return y.reduce((s, v) => s + (v - m) ** 2, 0); };
export const r2 = (pred: readonly number[], y: readonly number[]) => 1 - sse(pred, y) / sst(y);
export const reduction = (baseline: number, candidate: number) => (baseline - candidate) / baseline;

/* EV01 · what is known at the prediction moment */
export const FEATURES = [
  { name: "complaints in the last 30 days", day: -3 }, { name: "months as a customer", day: -400 }, { name: "support ticket opened", day: -1 },
  { name: "plan upgrade request", day: 12 }, { name: "refund after cancelling", day: 45 }, { name: "cancellation flag", day: 60 },
] as const;
export const eligible = (t: number) => FEATURES.filter(f => f.day <= t);

/* EV03 · decisions and costs */
export function metrics(tp: number, fp: number, tn: number, fn: number) {
  const precision = tp + fp ? tp / (tp + fp) : NaN, recall = tp + fn ? tp / (tp + fn) : NaN;
  return { accuracy: (tp + tn) / (tp + fp + tn + fn), precision, recall, f1: tp ? (2 * tp) / (2 * tp + fp + fn) : 0 };
}

/* EV04 · probabilities versus ranking (one customer who left, one who stayed) */
export const brier = (ps: readonly number[], ys: readonly number[]) => mean(ps.map((p, i) => (p - ys[i]) ** 2));
export const logLoss = (ps: readonly number[], ys: readonly number[]) => mean(ps.map((p, i) => (ys[i] === 1 ? -Math.log(p) : -Math.log(1 - p))));

/* EV05 · capacity and uncertainty */
export const CAPACITY = [{ name: "simple", train: 8, dev: 9 }, { name: "moderate", train: 3, dev: 4 }, { name: "flexible", train: 1, dev: 12 }] as const;
export const RESAMPLES = [2, 4, 6] as const;
export const sdPop = (v: readonly number[]) => { const m = mean(v); return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length); };

/* EV06 · honest centring */
export const TRAIN = [2, 4, 6, 8] as const, VALID = [20, 22] as const, FOLD_A = [2, 4] as const, FOLD_B = [6, 8] as const;
export const toPy = (a: unknown) => JSON.stringify(a);
