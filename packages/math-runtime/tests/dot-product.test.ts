import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { dotProductTrace, type DotProductInput } from "../src";

describe("dot product", () => {
  it("calculates the house-score trace", () => {
    expect(dotProductTrace({ features: [2, 3, 4], weights: [5, 2, 3] })).toEqual({
      schemaVersion: "1.0.0", input: { features: [2, 3, 4], weights: [5, 2, 3] }, contributions: [10, 6, 12], value: 28,
    });
  });
  it("rejects invalid vectors and dimensions", () => {
    expect(() => dotProductTrace({ features: [], weights: [] })).toThrow("non-empty");
    expect(() => dotProductTrace({ features: [1, Number.NaN], weights: [2, 3] })).toThrow("finite");
    expect(() => dotProductTrace({ features: [1, 2], weights: [3] })).toThrow("same length");
  });
  it("matches Python fixtures", () => {
    const path = fileURLToPath(new URL("../../math-contracts/fixtures/dot-product.v1.json", import.meta.url));
    const fixture = JSON.parse(readFileSync(path, "utf8")) as { cases: Array<{ input: DotProductInput; trace: unknown }> };
    fixture.cases.forEach((testCase) => expect(dotProductTrace(testCase.input)).toEqual(testCase.trace));
  });
});
