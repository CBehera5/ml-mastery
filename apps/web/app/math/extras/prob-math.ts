/** Pure maths behind the Probability playgrounds. Lesson text, charts and Python cells agree with these. */
export const rng = (seed: number) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

/** A fair six-sided die. An event is any set of faces; P(event) = favourable ÷ total. */
export const FACES = [1, 2, 3, 4, 5, 6];
export const pEvent = (event: number[]) => event.length / FACES.length;

/** Two dice, 36 equally likely ordered outcomes. */
export const PAIRS: [number, number][] = FACES.flatMap((a) => FACES.map((b) => [a, b] as [number, number]));
export const pairsWhere = (f: (a: number, b: number) => boolean) => PAIRS.filter(([a, b]) => f(a, b));
export const EVENTS2: Record<string, { label: string; test: (a: number, b: number) => boolean }> = {
  sum7: { label: "the sum is 7", test: (a, b) => a + b === 7 },
  six: { label: "at least one six", test: (a, b) => a === 6 || b === 6 },
  even: { label: "both dice are even", test: (a, b) => a % 2 === 0 && b % 2 === 0 },
  double: { label: "a double (both the same)", test: (a, b) => a === b },
};

/** 200 students: studied (80) or not (120); passed or failed. */
export const STUDY = { studiedPass: 60, studiedFail: 20, restPass: 30, restFail: 90 };
export const studyTotals = (s = STUDY) => { const studied = s.studiedPass + s.studiedFail, rest = s.restPass + s.restFail; return { studied, rest, total: studied + rest, pass: s.studiedPass + s.restPass }; };

/** Bayes: natural frequencies out of 10,000 people. */
export const bayes = (prevalence: number, sensitivity: number, falsePositive: number, n = 10000) => {
  const sick = prevalence * n, healthy = n - sick, tp = sick * sensitivity, fp = healthy * falsePositive;
  return { sick, healthy, tp, fn: sick - tp, fp, tn: healthy - fp, positives: tp + fp, posterior: tp + fp === 0 ? NaN : tp / (tp + fp) };
};

/** Binomial distribution. */
export const comb = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
export const binomPmf = (n: number, p: number) => Array.from({ length: n + 1 }, (_, k) => comb(n, k) * p ** k * (1 - p) ** (n - k));
export const mean = (pmf: number[]) => pmf.reduce((s, p, k) => s + k * p, 0);
export const variance = (pmf: number[]) => { const m = mean(pmf); return pmf.reduce((s, p, k) => s + (k - m) ** 2 * p, 0); };

/** A tiny scored dataset for threshold, precision, recall and log loss. */
export const SCORES = [0.95, 0.9, 0.8, 0.7, 0.6, 0.4, 0.35, 0.3, 0.2, 0.1];
export const LABELS = [1, 1, 1, 0, 1, 1, 0, 0, 0, 0];
export const confusion = (t: number) => {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  SCORES.forEach((s, i) => { const pred = s >= t ? 1 : 0; if (pred && LABELS[i]) tp++; else if (pred) fp++; else if (LABELS[i]) fn++; else tn++; });
  return { tp, fp, fn, tn, precision: tp + fp === 0 ? NaN : tp / (tp + fp), recall: tp + fn === 0 ? NaN : tp / (tp + fn) };
};
export const logLoss = () => -SCORES.reduce((s, p, i) => s + (LABELS[i] ? Math.log(p) : Math.log(1 - p)), 0) / SCORES.length;
