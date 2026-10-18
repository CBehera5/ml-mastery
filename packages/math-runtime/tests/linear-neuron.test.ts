import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { gradientCheck, linearNeuronTrace, numericalGradients, type LinearNeuronInput } from "../src";

const reference: LinearNeuronInput = {
  inputs: [2, 3],
  weights: [1, 2],
  bias: 1,
  target: 12,
  learningRate: 0.01,
};

const expectCloseDeep = (actual: unknown, expected: unknown, tolerance = 1e-9): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(tolerance);
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((value, index) => expectCloseDeep((actual as unknown[])[index], value, tolerance));
  } else if (expected && typeof expected === "object") {
    for (const [key, value] of Object.entries(expected)) {
      expectCloseDeep((actual as Record<string, unknown>)[key], value, tolerance);
    }
  } else {
    expect(actual).toBe(expected);
  }
};

describe("linear neuron", () => {
  it("produces the reference example", () => {
    const trace = linearNeuronTrace(reference);
    expect(trace.forward.prediction).toBe(9);
    expect(trace.forward.loss).toBe(9);
    expect(trace.backward.weightGradients).toEqual([-12, -18]);
    expect(trace.backward.biasGradient).toBe(-6);
    expect(trace.update.weights).toEqual([1.12, 2.18]);
    expect(trace.update.bias).toBe(1.06);
    expect(trace.update.prediction).toBeCloseTo(9.84, 12);
    expect(trace.update.loss).toBeCloseTo(4.6656, 12);
  });

  it("passes central finite-difference checking", () => {
    const check = gradientCheck(reference);
    expect(check.passed).toBe(true);
    expect(check.maxAbsoluteError).toBeLessThan(1e-7);
  });

  it("rejects invalid shapes and non-finite values", () => {
    expect(() => linearNeuronTrace({ ...reference, weights: [1] })).toThrow("same length");
    expect(() => linearNeuronTrace({ ...reference, inputs: [] })).toThrow("non-empty");
    expect(() => linearNeuronTrace({ ...reference, bias: Number.NaN })).toThrow("finite");
    expect(() => linearNeuronTrace({ ...reference, target: Number.POSITIVE_INFINITY })).toThrow("finite");
    expect(() => linearNeuronTrace({ ...reference, learningRate: 0 })).toThrow("greater than 0");
    expect(() => linearNeuronTrace({ ...reference, learningRate: 1.01 })).toThrow("at most 1");
    expect(() => numericalGradients(reference, 0)).toThrow("epsilon");
  });

  it("is deterministic across randomized dimensions", () => {
    let state = 20261014;
    const random = () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 0x100000000;
    };
    for (let dimension = 1; dimension <= 32; dimension += 1) {
      const input: LinearNeuronInput = {
        inputs: Array.from({ length: dimension }, () => random() * 6 - 3),
        weights: Array.from({ length: dimension }, () => random() * 4 - 2),
        bias: random() * 2 - 1,
        target: random() * 10 - 5,
        learningRate: 0.01,
      };
      expect(linearNeuronTrace(input)).toEqual(linearNeuronTrace(input));
      expect(gradientCheck(input, 1e-5, 1e-6).passed).toBe(true);
    }
  });

  it("matches Python-generated fixtures", () => {
    const path = fileURLToPath(new URL("../../math-contracts/fixtures/linear-neuron.v1.json", import.meta.url));
    const fixture = JSON.parse(readFileSync(path, "utf8")) as {
      cases: Array<{ input: LinearNeuronInput; trace: unknown }>;
    };
    fixture.cases.forEach((testCase) => expectCloseDeep(linearNeuronTrace(testCase.input), testCase.trace));
  });
});

