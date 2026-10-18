export const MATRIX_SCHEMA_VERSION = "1.0.0" as const;
type Matrix = number[][];
const matrix = (name: string, raw: Matrix): Matrix => {
  if (!Array.isArray(raw) || raw.length === 0 || !Array.isArray(raw[0]) || raw[0].length === 0 || raw.some((row) => !Array.isArray(row) || row.length !== raw[0].length)) throw new Error(`${name} must be a non-empty rectangular numeric matrix`);
  if (raw.some((row) => row.some((value) => typeof value !== "number" || !Number.isFinite(value)))) throw new Error(`${name} must contain only finite numbers`);
  return raw.map((row) => [...row]);
};
const vector = (name: string, raw: number[]) => {
  if (!Array.isArray(raw) || raw.length === 0) throw new Error(`${name} must be a non-empty numeric vector`);
  if (raw.some((value) => typeof value !== "number" || !Number.isFinite(value))) throw new Error(`${name} must contain only finite numbers`);
  return [...raw];
};
export const matrixVectorTrace = (raw: { matrix: Matrix; vector: number[] }) => {
  const left = matrix("matrix", raw.matrix), right = vector("vector", raw.vector);
  if (left[0].length !== right.length) throw new Error(`incompatible shapes: matrix columns (${left[0].length}) must equal vector length (${right.length})`);
  const rowProducts = left.map((row) => row.map((value, index) => value * right[index]));
  return { schemaVersion: MATRIX_SCHEMA_VERSION, operation: "matrix-vector" as const, input: { matrix: left, vector: right }, shapes: { matrix: [left.length, left[0].length], vector: [right.length], result: [left.length] }, rowProducts, result: rowProducts.map((row) => row.reduce((sum, value) => sum + value, 0)) };
};
export const matrixMatrixTrace = (raw: { left: Matrix; right: Matrix }) => {
  const left = matrix("left", raw.left), right = matrix("right", raw.right);
  if (left[0].length !== right.length) throw new Error(`incompatible shapes: left columns (${left[0].length}) must equal right rows (${right.length})`);
  const cellProducts = left.map((row) => Array.from({ length: right[0].length }, (_, column) => row.map((value, index) => value * right[index][column])));
  return { schemaVersion: MATRIX_SCHEMA_VERSION, operation: "matrix-matrix" as const, input: { left, right }, shapes: { left: [left.length, left[0].length], right: [right.length, right[0].length], result: [left.length, right[0].length] }, cellProducts, result: cellProducts.map((row) => row.map((products) => products.reduce((sum, value) => sum + value, 0))) };
};
