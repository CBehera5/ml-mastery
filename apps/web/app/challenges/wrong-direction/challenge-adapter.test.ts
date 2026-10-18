import { describe, expect, it } from "vitest";
import { linearNeuronTrace, type LinearNeuronInput } from "../../../../../packages/math-runtime/src";
import { runChallengeUpdate, type UpdateOperator } from "./challenge-adapter";

const reference = (): LinearNeuronInput => ({
  inputs: [2, 3], weights: [1, 2], bias: 1, target: 12, learningRate: 0.01,
});

describe("wrong-direction challenge adapter", () => {
  it("demonstrates that the buggy ascent update increases reference loss", () => {
    const result = runChallengeUpdate(reference(), "+");
    expect(result.sourceTrace.forward.loss).toBe(9);
    expect(result.updatedInput.weights).toEqual([0.88, 1.82]);
    expect(result.updatedInput.bias).toBe(0.94);
    expect(result.resultTrace.forward.prediction).toBeCloseTo(8.16, 12);
    expect(result.resultTrace.forward.loss).toBeCloseTo(14.7456, 12);
    expect(result.lossChange).toBeGreaterThan(0);
  });

  it("uses the canonical descent update and decreases reference loss", () => {
    const result = runChallengeUpdate(reference(), "-");
    expect(result.updatedInput.weights).toEqual(result.sourceTrace.update.weights);
    expect(result.updatedInput.bias).toBe(result.sourceTrace.update.bias);
    expect(result.resultTrace.forward.loss).toBeCloseTo(4.6656, 12);
    expect(result.lossChange).toBeLessThan(0);
    expect(result.followsProductionUpdate).toBe(true);
  });

  it("rejects unsupported operators", () => {
    expect(() => runChallengeUpdate(reference(), "×" as UpdateOperator)).toThrow(
      'Update operator must be "+" or "-"',
    );
  });

  it("does not mutate inputs or contaminate the production runtime", () => {
    const input = reference();
    const snapshot = structuredClone(input);
    const before = linearNeuronTrace(input);
    runChallengeUpdate(input, "+");
    const after = linearNeuronTrace(input);
    expect(input).toEqual(snapshot);
    expect(after).toEqual(before);
    expect(after.update.loss).toBeCloseTo(4.6656, 12);
  });
});

