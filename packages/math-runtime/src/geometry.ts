import { dotProductTrace } from "./dot-product";
import { matrixMatrixTrace, matrixVectorTrace } from "./matrix";

export const GEOMETRY_SCHEMA_VERSION = "1.0.0" as const;
export const TRANSFORMS = {
  identity: [[1, 0], [0, 1]],
  scale: [[2, 0], [0, 1]],
  reflection: [[-1, 0], [0, 1]],
  rotation: [[0, -1], [1, 0]],
  shear: [[1, 1], [0, 1]],
  dependent: [[1, 2], [0, 0]],
  collapse: [[1, 0], [0, 0]],
  zero: [[0, 0], [0, 0]],
  near: [[1, 0], [0, 1e-10]],
  spread: [[9, 0], [0, 1]],
} as const;
export type TransformId = keyof typeof TRANSFORMS;
const getMatrix = (id: TransformId): number[][] => {
  if (!Object.prototype.hasOwnProperty.call(TRANSFORMS, id)) throw new Error("Choose a supported named 2D transformation.");
  return TRANSFORMS[id].map(row => [...row]);
};
function boundedVector(values: number[]) {
  if (!Array.isArray(values) || values.length !== 2 || values.some(value => typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > 10)) throw new Error("Use two finite coordinates of magnitude at most 10.");
  return [...values];
}
const transform = (matrix: number[][], vector: number[]) => matrixVectorTrace({ matrix, vector }).result;
export function geometryTrace(input: { first: TransformId; second: TransformId; vector: number[]; coefficients: number[] }) {
  const first = getMatrix(input.first), second = getMatrix(input.second);
  const vector = boundedVector(input.vector), coefficients = boundedVector(input.coefficients);
  const determinant = first[0][0] * first[1][1] - first[0][1] * first[1][0];
  const rank = determinant !== 0 ? 2 : first.flat().every(value => value === 0) ? 0 : 1;
  const inverseStatus = determinant === 0 ? "singular" : Math.abs(determinant) <= 1e-8 ? "near-singular" : "available";
  const inverse = inverseStatus === "available" ? [[first[1][1] / determinant, -first[0][1] / determinant], [-first[1][0] / determinant, first[0][0] / determinant]] : null;
  const mapped = transform(first, vector);
  const firstThenSecond = matrixMatrixTrace({ left: second, right: first }).result;
  const secondThenFirst = matrixMatrixTrace({ left: first, right: second }).result;
  const basis = [transform(first, [1, 0]), transform(first, [0, 1])];
  const grid = [-2, -1, 0, 1, 2].flatMap(coordinate => [
    { from: [-2, coordinate], to: [2, coordinate] },
    { from: [coordinate, -2], to: [coordinate, 2] },
  ]).map(line => ({ ...line, mappedFrom: transform(first, line.from), mappedTo: transform(first, line.to) }));
  return {
    schemaVersion: GEOMETRY_SCHEMA_VERSION,
    input: { first: input.first, second: input.second, vector, coefficients }, first, second, mapped,
    basis, spanPoint: transform(first, coefficients), rank, determinant,
    signedArea: determinant, area: Math.abs(determinant), inverseStatus, inverse,
    roundTrip: inverse === null ? null : transform(inverse, mapped),
    composition: { firstThenSecond, secondThenFirst, firstThenSecondPoint: transform(firstThenSecond, vector), secondThenFirstPoint: transform(secondThenFirst, vector) },
    grid,
    points: [[0, 0], [1, 0], [0, 1], [1, 1], vector].map(point => ({ point, mapped: transform(first, point) })),
  };
}
const EIGENPAIRS: Partial<Record<TransformId, { vector: number[]; value: number }[]>> = {
  identity: [{ vector: [1, 0], value: 1 }, { vector: [0, 1], value: 1 }],
  scale: [{ vector: [1, 0], value: 2 }, { vector: [0, 1], value: 1 }],
  reflection: [{ vector: [1, 0], value: -1 }, { vector: [0, 1], value: 1 }],
  shear: [{ vector: [1, 0], value: 1 }],
  collapse: [{ vector: [1, 0], value: 1 }, { vector: [0, 1], value: 0 }],
  spread: [{ vector: [1, 0], value: 9 }, { vector: [0, 1], value: 1 }],
};
export const EIGEN_TRANSFORMS = ["identity", "scale", "reflection", "shear", "rotation", "collapse", "spread"] as const;
export function eigenTrace(id: TransformId, rawVector: number[]) {
  if (!(EIGEN_TRANSFORMS as readonly string[]).includes(id)) throw new Error("Choose a supported known-eigenpair example.");
  const matrix = getMatrix(id), vector = boundedVector(rawVector), mapped = transform(matrix, vector);
  const zero = vector.every(value => value === 0);
  const magnitudeScale = Math.max(...vector.map(Math.abs));
  const direction = zero ? [0, 0] : vector.map(value => value / magnitudeScale);
  const mappedDirection = transform(matrix, direction);
  const squaredMagnitude = dotProductTrace({ features: direction, weights: direction }).value;
  const candidate = zero ? null : dotProductTrace({ features: direction, weights: mappedDirection }).value / squaredMagnitude;
  const residual = candidate === null ? null : Math.hypot(...mappedDirection.map((value, index) => value - candidate * direction[index]));
  const isEigenvector = !zero && residual !== null && Number.isFinite(residual) && residual <= 1e-9 * Math.max(1, Math.hypot(...mappedDirection), Math.hypot(...direction));
  return { schemaVersion: GEOMETRY_SCHEMA_VERSION, transform: id, matrix, vector, mapped, isEigenvector,
    eigenvalue: isEigenvector ? candidate : null,
    reason: zero ? "The zero vector is excluded from the definition of an eigenvector." : isEigenvector ? candidate === 0 ? "A nonzero vector maps to zero: this is an eigenvector with eigenvalue zero, although the output has no direction." : candidate! < 0 ? "The line is preserved but the pointing direction reverses: the eigenvalue is negative." : "The mapped vector remains on the same line: this is an eigenvector." : "The vector leaves its original line; it is not an eigenvector in this example.",
    knownPairs: (EIGENPAIRS[id] ?? []).map(pair => ({ ...pair, vector: [...pair.vector], mapped: transform(matrix, pair.vector) })),
    hasRealEigenvectors: id !== "rotation",
  };
}
