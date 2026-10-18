export const SCHEMA_VERSION = "1.0.0" as const;
export const MAX_LEARNING_RATE = 1;

export interface LinearNeuronInput {
  inputs: number[];
  weights: number[];
  bias: number;
  target: number;
  learningRate: number;
}

export interface LinearNeuronTrace {
  schemaVersion: typeof SCHEMA_VERSION;
  input: LinearNeuronInput;
  forward: { weightedInputs: number[]; prediction: number; error: number; loss: number };
  backward: {
    dLossDPrediction: number;
    dPredictionDWeights: number[];
    weightGradients: number[];
    biasGradient: number;
  };
  update: {
    learningRate: number;
    weights: number[];
    bias: number;
    prediction: number;
    error: number;
    loss: number;
  };
}

const finiteScalar = (name: string, value: number): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`);
  }
  return value;
};

const finiteVector = (name: string, values: number[]): number[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${name} must be a non-empty one-dimensional numeric array`);
  }
  values.forEach((value) => finiteScalar(`${name} value`, value));
  return [...values];
};

const validate = (value: LinearNeuronInput): LinearNeuronInput => {
  const inputs = finiteVector("inputs", value.inputs);
  const weights = finiteVector("weights", value.weights);
  if (inputs.length !== weights.length) throw new Error("inputs and weights must have the same length");
  const learningRate = finiteScalar("learningRate", value.learningRate);
  if (!(learningRate > 0 && learningRate <= MAX_LEARNING_RATE)) {
    throw new Error("learningRate must be greater than 0 and at most 1");
  }
  return {
    inputs,
    weights,
    bias: finiteScalar("bias", value.bias),
    target: finiteScalar("target", value.target),
    learningRate,
  };
};

const dot = (left: number[], right: number[]): number =>
  left.reduce((sum, value, index) => sum + value * right[index], 0);

const lossAt = (inputs: number[], weights: number[], bias: number, target: number): number => {
  const error = dot(inputs, weights) + bias - target;
  return error * error;
};

export const linearNeuronTrace = (rawInput: LinearNeuronInput): LinearNeuronTrace => {
  const input = validate(rawInput);
  const weightedInputs = input.inputs.map((value, index) => value * input.weights[index]);
  const prediction = weightedInputs.reduce((sum, value) => sum + value, 0) + input.bias;
  const error = prediction - input.target;
  const loss = error * error;
  const dLossDPrediction = 2 * error;
  const weightGradients = input.inputs.map((value) => dLossDPrediction * value);
  const biasGradient = dLossDPrediction;
  const weights = input.weights.map((weight, index) => weight - input.learningRate * weightGradients[index]);
  const bias = input.bias - input.learningRate * biasGradient;
  const updatedPrediction = dot(input.inputs, weights) + bias;
  const updatedError = updatedPrediction - input.target;

  return {
    schemaVersion: SCHEMA_VERSION,
    input,
    forward: { weightedInputs, prediction, error, loss },
    backward: {
      dLossDPrediction,
      dPredictionDWeights: [...input.inputs],
      weightGradients,
      biasGradient,
    },
    update: {
      learningRate: input.learningRate,
      weights,
      bias,
      prediction: updatedPrediction,
      error: updatedError,
      loss: updatedError * updatedError,
    },
  };
};

export const numericalGradients = (rawInput: LinearNeuronInput, epsilon = 1e-5) => {
  const input = validate(rawInput);
  finiteScalar("epsilon", epsilon);
  if (epsilon <= 0) throw new Error("epsilon must be greater than 0");
  const weightGradients = input.weights.map((_, index) => {
    const plus = [...input.weights];
    const minus = [...input.weights];
    plus[index] += epsilon;
    minus[index] -= epsilon;
    return (
      (lossAt(input.inputs, plus, input.bias, input.target) -
        lossAt(input.inputs, minus, input.bias, input.target)) /
      (2 * epsilon)
    );
  });
  const biasGradient =
    (lossAt(input.inputs, input.weights, input.bias + epsilon, input.target) -
      lossAt(input.inputs, input.weights, input.bias - epsilon, input.target)) /
    (2 * epsilon);
  return { weightGradients, biasGradient };
};

export const gradientCheck = (rawInput: LinearNeuronInput, epsilon = 1e-5, tolerance = 1e-7) => {
  finiteScalar("tolerance", tolerance);
  if (tolerance <= 0) throw new Error("tolerance must be greater than 0");
  const analytical = linearNeuronTrace(rawInput).backward;
  const numerical = numericalGradients(rawInput, epsilon);
  const errors = analytical.weightGradients.map((value, index) =>
    Math.abs(value - numerical.weightGradients[index]),
  );
  const maxAbsoluteError = Math.max(
    ...errors,
    Math.abs(analytical.biasGradient - numerical.biasGradient),
  );
  return { passed: maxAbsoluteError <= tolerance, maxAbsoluteError, tolerance, numerical };
};

