// Polynomial least squares by normal equations, for the "honest evaluation" playground.
export const TRAIN_X = [0, 0.2, 0.4, 0.6, 0.8, 1.0], TRAIN_Y = [1.0, 1.6, 1.3, 2.3, 2.2, 3.1];
export const VAL_X = [0.1, 0.3, 0.5, 0.7, 0.9], VAL_Y = [1.3, 1.6, 1.9, 2.4, 2.9];
function solve(A: number[][], b: number[]) {
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let i = 0; i < n; i++) {
    let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
    [M[i], M[p]] = [M[p], M[i]];
    for (let r = 0; r < n; r++) if (r !== i) { const f = M[r][i] / M[i][i]; M[r] = M[r].map((v, c) => v - f * M[i][c]); }
  }
  return M.map((row, i) => row[n] / row[i]);
}
export const polyFit = (xs: number[], ys: number[], d: number) => solve(
  Array.from({ length: d + 1 }, (_, i) => Array.from({ length: d + 1 }, (_, j) => xs.reduce((s, x) => s + x ** (i + j), 0))),
  Array.from({ length: d + 1 }, (_, i) => xs.reduce((s, x, k) => s + ys[k] * x ** i, 0)));
export const polyEval = (c: number[], x: number) => c.reduce((s, ci, i) => s + ci * x ** i, 0);
export const polyMse = (c: number[], xs: number[], ys: number[]) => xs.reduce((s, x, i) => s + (polyEval(c, x) - ys[i]) ** 2, 0) / xs.length;
