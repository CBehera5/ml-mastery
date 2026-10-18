import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { TRANSFORMS, geometryTrace, eigenTrace, matrixMatrixTrace, matrixVectorTrace, type TransformId } from "../src";
const fixture = JSON.parse(readFileSync(fileURLToPath(new URL("../../math-contracts/fixtures/geometry.v1.json", import.meta.url)), "utf8"));
function compare(actual: unknown, expected: unknown) {
  if (typeof expected === "number") expect(actual).toBeCloseTo(expected, 9);
  else if (Array.isArray(expected)) { expect(actual).toHaveLength(expected.length); expected.forEach((value, index) => compare((actual as unknown[])[index], value)); }
  else if (expected && typeof expected === "object") { expect(Object.keys(actual as object).sort()).toEqual(Object.keys(expected).sort()); Object.entries(expected).forEach(([key, value]) => compare((actual as Record<string, unknown>)[key], value)); }
  else expect(actual).toEqual(expected);
}
describe("chosen 2D geometry and eigenpair runtime", () => {
  it("matches Python fixtures including singular, near-singular, zero and tiny-vector cases", () => {
    fixture.geometry.forEach((item: any) => compare(geometryTrace(item.input), item.trace));
    fixture.eigen.forEach((item: any) => compare(eigenTrace(item.input.name, item.input.vector), item.trace));
  });
  it("satisfies analytic mapping, composition and basis-span references", () => {
    const trace = geometryTrace({ first: "scale", second: "rotation", vector: [1, 1], coefficients: [2, 3] });
    expect(trace.mapped).toEqual([2, 1]); expect(trace.spanPoint).toEqual([4, 3]); expect(trace.basis).toEqual([[2, 0], [0, 1]]);
    expect(trace.composition.firstThenSecondPoint).toEqual([-1, 2]); expect(trace.composition.secondThenFirstPoint).toEqual([-2, 1]);
    const collapsed = geometryTrace({ first: "dependent", second: "identity", vector: [2, 7], coefficients: [3, -2] });
    expect(collapsed.rank).toBe(1); expect(collapsed.spanPoint).toEqual([-1, 0]); expect(collapsed.inverseStatus).toBe("singular");
    expect(geometryTrace({ first: "zero", second: "identity", vector: [2, 7], coefficients: [3, -2] }).rank).toBe(0);
  });
  it("preserves linearity, inverse round trips, signed area and grid endpoints", () => {
    for (const first of Object.keys(TRANSFORMS) as TransformId[]) {
      const trace = geometryTrace({ first, second: "identity", vector: [3, -2], coefficients: [1, 1] });
      const basis = trace.basis;
      expect(basis[0][0] * basis[1][1] - basis[1][0] * basis[0][1]).toBeCloseTo(trace.signedArea, 12);
      expect(trace.area).toBe(Math.abs(trace.determinant));
      const mappedSum = matrixVectorTrace({ matrix: trace.first, vector: [3, 3] }).result;
      const mappedLeft = matrixVectorTrace({ matrix: trace.first, vector: [1, 2] }).result;
      const mappedRight = matrixVectorTrace({ matrix: trace.first, vector: [2, 1] }).result;
      mappedSum.forEach((value, index) => expect(value).toBeCloseTo(mappedLeft[index] + mappedRight[index], 12));
      trace.grid.forEach(line => expect(line.mappedFrom).toEqual(matrixVectorTrace({ matrix: trace.first, vector: line.from }).result));
      if (trace.inverse) {
        trace.roundTrip!.forEach((value, index) => expect(value).toBeCloseTo(trace.input.vector[index], 10));
        compare(matrixMatrixTrace({ left: trace.inverse, right: trace.first }).result, [[1, 0], [0, 1]]);
        compare(matrixMatrixTrace({ left: trace.first, right: trace.inverse }).result, [[1, 0], [0, 1]]);
      }
    }
    const near = geometryTrace({ first: "near", second: "identity", vector: [1, 1], coefficients: [1, 1] });
    expect(near).toMatchObject({ rank: 2, inverseStatus: "near-singular", inverse: null, roundTrip: null, determinant: 1e-10 });
    expect(geometryTrace({ first: "reflection", second: "identity", vector: [1, 1], coefficients: [1, 1] }).signedArea).toBe(-1);
  });
  it("distinguishes valid signed/zero eigenvalues, a zero vector and non-real rotation directions", () => {
    expect(eigenTrace("scale", [1, 0])).toMatchObject({ isEigenvector: true, eigenvalue: 2 });
    expect(eigenTrace("scale", [1, 1]).isEigenvector).toBe(false);
    expect(eigenTrace("reflection", [1, 0])).toMatchObject({ isEigenvector: true, eigenvalue: -1 });
    expect(eigenTrace("collapse", [0, 1])).toMatchObject({ isEigenvector: true, eigenvalue: 0 });
    expect(eigenTrace("scale", [0, 0])).toMatchObject({ isEigenvector: false, eigenvalue: null });
    expect(eigenTrace("rotation", [1e-200, 0])).toMatchObject({ isEigenvector: false, hasRealEigenvectors: false });
    expect(eigenTrace("scale", [1e-200, 0])).toMatchObject({ isEigenvector: true, eigenvalue: 2 });
    for (const name of ["scale", "shear", "reflection", "collapse", "identity", "spread"] as TransformId[]) for (const pair of eigenTrace(name, [1, 0]).knownPairs) pair.mapped.forEach((value, index) => expect(value).toBeCloseTo(pair.value * pair.vector[index], 12));
  });
  it("rejects unknown presets, shape defects and unsafe finite magnitudes without changing old APIs", () => {
    for (const vector of [[], [1], [1, 2, 3], [NaN, 0], [Infinity, 0], [1e308, 0]]) expect(() => geometryTrace({ first: "scale", second: "rotation", vector, coefficients: [1, 1] })).toThrow();
    expect(() => geometryTrace({ first: "arbitrary" as TransformId, second: "identity", vector: [1, 1], coefficients: [1, 1] })).toThrow();
    expect(() => geometryTrace({ first: "scale", second: "identity", vector: [1, 1], coefficients: [11, 0] })).toThrow();
    expect(() => eigenTrace("near", [1, 1])).toThrow();
  });
});
