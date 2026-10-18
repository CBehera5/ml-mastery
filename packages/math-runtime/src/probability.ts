export const PROBABILITY_CONTRACT = "probability.v1" as const;
export function probability(value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error("Probability must be between 0 and 1.");
  return value;
}
export function countProbability(favorable: number, total: number) {
  if (![favorable, total].every(Number.isSafeInteger) || total <= 0 || favorable < 0 || favorable > total) throw new Error("Use whole counts with 0 ≤ favorable ≤ positive total.");
  return favorable / total;
}
export function eventTrace(both: number, onlyA: number, onlyB: number, neither: number) {
  const counts = [both, onlyA, onlyB, neither];
  if (!counts.every(value => Number.isSafeInteger(value) && value >= 0) || counts.reduce((sum, value) => sum + value, 0) > 1e6) throw new Error("Counts must be whole, nonnegative and total at most one million.");
  const total = counts.reduce((sum, value) => sum + value, 0);
  const joint = countProbability(both, total);
  const pA = (both + onlyA) / total, pB = (both + onlyB) / total;
  return { contract: PROBABILITY_CONTRACT, total, pA, pB, joint, union: (both + onlyA + onlyB) / total, complementA: 1 - pA, conditional: both + onlyB === 0 ? null : both / (both + onlyB), independent: Math.abs(joint - pA * pB) < 1e-12 };
}
export function bayesTrace(prior: number, sensitivity: number, falsePositiveRate: number) {
  [prior, sensitivity, falsePositiveRate].forEach(probability);
  const truePositive = prior * sensitivity, falsePositive = (1 - prior) * falsePositiveRate;
  const evidence = truePositive + falsePositive;
  return { contract: PROBABILITY_CONTRACT, prior, sensitivity, falsePositiveRate, truePositive, falsePositive, evidence, posterior: evidence === 0 ? null : truePositive / evidence };
}
export function binomialTrace(trials: number, successProbability: number) {
  if (!Number.isInteger(trials) || trials < 1 || trials > 30) throw new Error("Trials must be an integer from 1 to 30.");
  probability(successProbability);
  const mass = Array.from({ length: trials + 1 }, (_, successes) => {
    let combinations = 1;
    for (let factor = 1; factor <= successes; factor++) combinations *= (trials - factor + 1) / factor;
    return combinations * successProbability ** successes * (1 - successProbability) ** (trials - successes);
  });
  let accumulated = 0;
  const cdf = mass.map(value => { accumulated += value; return Math.min(1, accumulated); });
  return { contract: PROBABILITY_CONTRACT, mass, cdf, expectation: trials * successProbability, variance: trials * successProbability * (1 - successProbability) };
}
export function normalDensity(value: number, mean: number, deviation: number) {
  if (![value, mean, deviation].every(Number.isFinite) || deviation <= 0) throw new Error("Finite values and positive standard deviation required.");
  const density = Math.exp(-0.5 * ((value - mean) / deviation) ** 2) / (deviation * Math.sqrt(2 * Math.PI));
  if (!Number.isFinite(density)) throw new Error("Density exceeds numerical range.");
  return density;
}
export function simulateOutcomes(sides: number, draws: number, seed: number) {
  if (![2, 6].includes(sides) || !Number.isInteger(draws) || draws < 1 || draws > 10000 || !Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error("Use 2 or 6 sides, 1–10000 draws and a uint32 seed.");
  let state = seed >>> 0;
  const counts = Array<number>(sides).fill(0);
  for (let draw = 0; draw < draws; draw++) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    counts[Math.floor(state / 4294967296 * sides)]++;
  }
  return { contract: PROBABILITY_CONTRACT, sides, draws, seed, counts };
}
export function normalInterval(lowerZ: number, upperZ: number) {
  if (![lowerZ, upperZ].every(Number.isFinite) || lowerZ < -8 || upperZ > 8 || lowerZ > upperZ) throw new Error("Use ordered standardized limits within −8 to 8.");
  const steps = 1024, width = (upperZ - lowerZ) / steps;
  let sum = normalDensity(lowerZ, 0, 1) + normalDensity(upperZ, 0, 1);
  for (let index = 1; index < steps; index++) sum += (index % 2 === 0 ? 2 : 4) * normalDensity(lowerZ + width * index, 0, 1);
  return Math.min(1, Math.max(0, sum * width / 3));
}
export function thresholdTrace(threshold: number) {
  probability(threshold);
  const rows = [{ score: 0.9, actual: 1 }, { score: 0.7, actual: 0 }, { score: 0.6, actual: 1 }, { score: 0.4, actual: 0 }, { score: 0.3, actual: 1 }, { score: 0.1, actual: 0 }].map(row => ({ ...row, predicted: row.score >= threshold ? 1 : 0 }));
  return { rows, truePositive: rows.filter(row => row.actual === 1 && row.predicted === 1).length, falsePositive: rows.filter(row => row.actual === 0 && row.predicted === 1).length, falseNegative: rows.filter(row => row.actual === 1 && row.predicted === 0).length, trueNegative: rows.filter(row => row.actual === 0 && row.predicted === 0).length };
}
export function binaryLogLoss(actual: number, predicted: number) {
  if (actual !== 0 && actual !== 1) throw new Error("Actual label must be 0 or 1.");
  probability(predicted);
  const assigned = actual === 1 ? predicted : 1 - predicted;
  return assigned === 0 ? Infinity : -Math.log(assigned);
}
