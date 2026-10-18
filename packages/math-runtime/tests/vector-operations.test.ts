import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { vectorOperationsTrace, matrixMatrixTrace, matrixVectorTrace } from "../src";

describe("bounded vector geometry and existing matrix semantics", () => {
  it("matches frozen Python traces to numerical tolerance", () => {
    const fixture = JSON.parse(readFileSync(fileURLToPath(new URL("../../math-contracts/fixtures/vector-operations.v1.json", import.meta.url)), "utf8"));
    for (const item of fixture.cases) {
      const trace = vectorOperationsTrace(item.input);
      expect(trace.schemaVersion).toBe(item.trace.schemaVersion);
      for (const key of ["leftMagnitude", "rightMagnitude", "dot", "cosine", "angleDegrees"] as const) {
        if (item.trace[key] === null) expect(trace[key]).toBeNull();
        else expect(trace[key]).toBeCloseTo(item.trace[key], 9);
      }
      for (const key of ["sum", "scaled", "unitDirection", "projection"] as const) {
        if (item.trace[key] === null) expect(trace[key]).toBeNull();
        else item.trace[key].forEach((value: number, index: number) => expect(trace[key]![index]).toBeCloseTo(value, 9));
      }
    }
  });
  it("satisfies analytic projection, scaling and angle invariants", () => {
    const trace = vectorOperationsTrace({ left: [3, 4], right: [1, 0], scale: -2 });
    expect(trace.leftMagnitude).toBe(5); expect(trace.sum).toEqual([4, 4]); expect(trace.scaled).toEqual([-6, -8]); expect(trace.projection).toEqual([3, 0]);
    expect(trace.unitDirection).toEqual([.6, .8]); expect(trace.cosine).toBeCloseTo(.6);
    for (const left of [[1, 3], [-2, 4], [0, 0]]) for (const right of [[2, 1], [-3, 2]]) {
      const projected = vectorOperationsTrace({ left, right, scale: 1 }).projection!;
      expect((left[0] - projected[0]) * right[0] + (left[1] - projected[1]) * right[1]).toBeCloseTo(0, 9);
    }
    expect(vectorOperationsTrace({ left: [1, 0], right: [0, 1], scale: 0 }).angleDegrees).toBe(90);
    expect(vectorOperationsTrace({ left: [1, 0], right: [-1, 0], scale: 0 }).angleDegrees).toBe(180);
  });
  it("defines zero behavior and rejects invalid, mismatched and overflow-scale inputs before old runtimes", () => {
    expect(vectorOperationsTrace({ left: [0, 0], right: [1, 0], scale: 1 })).toMatchObject({ unitDirection: null, angleDegrees: null, cosine: null, projection: [0, 0] });
    expect(vectorOperationsTrace({ left: [1, 0], right: [0, 0], scale: 1 }).projection).toBeNull();
    expect(vectorOperationsTrace({ left: [1, 0], right: [1e-200, 0], scale: 1 }).projection).toEqual([1, 0]);
    expect(vectorOperationsTrace({ left: [1e-200, 0], right: [1e-200, 0], scale: 1 }).cosine).toBe(1);
    for (const left of [[], [1], [1, 2, 3], [NaN, 0], [Infinity, 0], [1e308, 1e308]]) expect(() => vectorOperationsTrace({ left, right: [1, 0], scale: 1 })).toThrow();
    expect(() => vectorOperationsTrace({ left: [1, 2], right: [1, 0], scale: 11 })).toThrow();
  });
  it("keeps rectangular row isolation, multiplication order, mismatch and house predictions", () => {
    expect(matrixVectorTrace({ matrix: [[2, 3, 4], [4, 2, 5], [3, 4, 2]], vector: [5, 2, 3] }).result).toEqual([28, 39, 29]);
    const left = [[1, 2, 3], [4, 5, 6]], right = [[1, 0], [0, 1], [1, 1]];
    expect(matrixMatrixTrace({ left, right }).result).toEqual([[4, 5], [10, 11]]);
    expect(matrixMatrixTrace({ left: [[2, 2, 3], left[1]], right }).result).toEqual([[5, 5], [10, 11]]);
    expect(matrixMatrixTrace({ left: right, right: left }).shapes.result).toEqual([3, 3]);
    expect(() => matrixMatrixTrace({ left, right: [[1, 0], [0, 1]] })).toThrow("incompatible");
  });
});
