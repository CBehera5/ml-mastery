import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { continuityTrace, multivariableTrace, centralDerivative, type ContinuityCase } from "../src";
const fixture = JSON.parse(readFileSync(fileURLToPath(new URL("../../math-contracts/fixtures/calculus-extension.v1.json", import.meta.url)), "utf8"));
function compare(actual: any, expected: any) {
  if (typeof expected === "number") expect(actual).toBeCloseTo(expected, 8);
  else if (Array.isArray(expected)) { expect(actual).toHaveLength(expected.length); expected.forEach((value, index) => compare(actual[index], value)); }
  else if (expected && typeof expected === "object") { expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort()); Object.entries(expected).forEach(([key, value]) => compare(actual[key], value)); }
  else expect(actual).toEqual(expected);
}
describe("Calculus completion mathematics", () => {
  it("matches independent Python traces", () => {
    fixture.continuity.forEach((item: any) => compare(continuityTrace(item.kind, item.step), item.trace));
    fixture.multivariable.forEach((item: any) => compare(multivariableTrace(item.input), item.trace));
  });
  it("distinguishes a limit, a missing value, a jump and a continuous corner", () => {
    expect(continuityTrace("hole", .01)).toMatchObject({ center: 1, value: null, limit: 2, continuous: false, differentiable: false, derivative: null });
    expect(continuityTrace("jump", .01)).toMatchObject({ limit: null, value: 1, continuous: false, differentiable: false });
    expect(continuityTrace("corner", .01)).toMatchObject({ value: 0, limit: 0, continuous: true, differentiable: false, derivative: null, symmetricEstimate: 0, leftSlope: -1, rightSlope: 1 });
    expect(continuityTrace("smooth", .01)).toMatchObject({ limit: 0, continuous: true, differentiable: true, derivative: 0 });
  });
  it("checks analytic partials, simultaneous update, directional change and sensitivity matrix orientation", () => {
    const trace = multivariableTrace({ x: 1, y: 2, rate: .1, shape: "bowl", direction: "x" });
    expect(trace.value).toBe(13); expect(trace.gradient).toEqual([2, 12]); compare(trace.numericalGradient, [2, 12]); compare(trace.update.next, [.8, .8]);
    expect(trace.directionalDerivative).toBe(2); expect(trace.update.displacement).not.toEqual(trace.gradient);
    expect(trace.jacobian).toEqual([[1, 1], [2, 1]]); expect(trace.hessian).toEqual([[2, 0], [0, 6]]);
    for (const [x, y] of [[-2, 1], [0, 0], [1, 2]]) {
      const actual = multivariableTrace({ x, y, rate: .1, shape: "bowl", direction: "diagonal" });
      compare(actual.numericalGradient, actual.gradient);
      expect(actual.directionalDerivative).toBeCloseTo((2*x+6*y)/Math.sqrt(2), 9);
      compare(actual.jacobian, [[centralDerivative(value => value+y, x), centralDerivative(value => x+value, y)], [centralDerivative(value => value*y, x), centralDerivative(value => x*value, y)]]);
      expect(actual.hessian[0][1]).toBe(actual.hessian[1][0]);
      expect(actual.update.value).toBeLessThanOrEqual(actual.value + 1e-10);
    }
    const saddle = multivariableTrace({ x: 0, y: 0, rate: .1, shape: "saddle", direction: "y" });
    expect(saddle.gradient).toEqual([0, -0]); expect(saddle.hessian).toEqual([[2, 0], [0, -2]]);
  });
  it("rejects invalid sampling and bounded inputs before existing mathematical APIs", () => {
    for (const step of [0, -1, 1e-12, 2, Infinity, NaN]) expect(() => continuityTrace("corner", step)).toThrow();
    expect(() => continuityTrace("unknown" as ContinuityCase, .1)).toThrow();
    for (const x of [6, Infinity, NaN, 1e308]) expect(() => multivariableTrace({ x, y: 1, rate: .1, shape: "bowl", direction: "x" })).toThrow();
    expect(() => multivariableTrace({ x: 1, y: 1, rate: -.1, shape: "bowl", direction: "x" })).toThrow();
  });
});
