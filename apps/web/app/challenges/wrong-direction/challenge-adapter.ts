import {
  linearNeuronTrace,
  type LinearNeuronInput,
  type LinearNeuronTrace,
} from "../../../../../packages/math-runtime/src";

export type UpdateOperator = "+" | "-";

export interface ChallengeUpdateResult {
  operator: UpdateOperator;
  sourceTrace: LinearNeuronTrace;
  resultTrace: LinearNeuronTrace;
  updatedInput: LinearNeuronInput;
  weightChanges: number[];
  biasChange: number;
  lossChange: number;
  followsProductionUpdate: boolean;
}

function assertOperator(operator: string): asserts operator is UpdateOperator {
  if (operator !== "+" && operator !== "-") {
    throw new Error('Update operator must be "+" or "-"');
  }
}

/**
 * Educational boundary for experimenting with an intentionally wrong update.
 * Forward, loss, gradients, and the canonical descent update still come from
 * the production runtime. Only the chosen parameter movement is local here.
 */
export const runChallengeUpdate = (
  input: LinearNeuronInput,
  operator: UpdateOperator,
): ChallengeUpdateResult => {
  assertOperator(operator);
  const sourceTrace = linearNeuronTrace(input);
  const direction = operator === "-" ? -1 : 1;
  const weights = sourceTrace.input.weights.map(
    (weight, index) =>
      weight + direction * sourceTrace.input.learningRate * sourceTrace.backward.weightGradients[index],
  );
  const bias =
    sourceTrace.input.bias +
    direction * sourceTrace.input.learningRate * sourceTrace.backward.biasGradient;
  const updatedInput: LinearNeuronInput = {
    ...sourceTrace.input,
    inputs: [...sourceTrace.input.inputs],
    weights,
    bias,
  };
  const resultTrace = linearNeuronTrace(updatedInput);
  const followsProductionUpdate =
    operator === "-" &&
    weights.every((value, index) => Math.abs(value - sourceTrace.update.weights[index]) <= Number.EPSILON) &&
    Math.abs(bias - sourceTrace.update.bias) <= Number.EPSILON;

  return {
    operator,
    sourceTrace,
    resultTrace,
    updatedInput,
    weightChanges: weights.map((value, index) => value - sourceTrace.input.weights[index]),
    biasChange: bias - sourceTrace.input.bias,
    lossChange: resultTrace.forward.loss - sourceTrace.forward.loss,
    followsProductionUpdate,
  };
};
