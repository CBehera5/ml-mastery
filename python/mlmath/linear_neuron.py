"""Pure, deterministic linear-neuron calculations."""

from __future__ import annotations

from typing import Any, Sequence

import numpy as np

SCHEMA_VERSION = "1.0.0"
MAX_LEARNING_RATE = 1.0


def _finite_scalar(name: str, value: Any) -> float:
    if isinstance(value, (bool, np.bool_)):
        raise ValueError(f"{name} must be a finite number")
    try:
        number = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a finite number") from exc
    if not np.isfinite(number):
        raise ValueError(f"{name} must be a finite number")
    return number


def _finite_vector(name: str, values: Sequence[float]) -> np.ndarray:
    if isinstance(values, (str, bytes)):
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array")
    try:
        array = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array") from exc
    if array.ndim != 1 or array.size == 0:
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array")
    if not np.all(np.isfinite(array)):
        raise ValueError(f"{name} must contain only finite numbers")
    return array


def _validated(
    inputs: Sequence[float],
    weights: Sequence[float],
    bias: float,
    target: float,
    learning_rate: float,
) -> tuple[np.ndarray, np.ndarray, float, float, float]:
    x = _finite_vector("inputs", inputs)
    w = _finite_vector("weights", weights)
    if x.shape != w.shape:
        raise ValueError("inputs and weights must have the same length")
    b = _finite_scalar("bias", bias)
    y = _finite_scalar("target", target)
    rate = _finite_scalar("learning_rate", learning_rate)
    if not 0.0 < rate <= MAX_LEARNING_RATE:
        raise ValueError("learning_rate must be greater than 0 and at most 1")
    return x, w, b, y, rate


def _loss(inputs: np.ndarray, weights: np.ndarray, bias: float, target: float) -> float:
    prediction = float(np.dot(inputs, weights) + bias)
    return float((prediction - target) ** 2)


def linear_neuron_trace(
    inputs: Sequence[float],
    weights: Sequence[float],
    bias: float,
    target: float,
    learning_rate: float,
) -> dict[str, Any]:
    """Return a JSON-serializable forward, backward, and update trace."""
    x, w, b, y, rate = _validated(inputs, weights, bias, target, learning_rate)
    weighted_inputs = x * w
    prediction = float(np.sum(weighted_inputs) + b)
    error = prediction - y
    loss = error**2
    dloss_dprediction = 2.0 * error
    weight_gradients = dloss_dprediction * x
    bias_gradient = dloss_dprediction
    updated_weights = w - rate * weight_gradients
    updated_bias = b - rate * bias_gradient
    updated_prediction = float(np.dot(x, updated_weights) + updated_bias)
    updated_error = updated_prediction - y
    updated_loss = updated_error**2

    return {
        "schemaVersion": SCHEMA_VERSION,
        "input": {
            "inputs": x.tolist(),
            "weights": w.tolist(),
            "bias": b,
            "target": y,
            "learningRate": rate,
        },
        "forward": {
            "weightedInputs": weighted_inputs.tolist(),
            "prediction": prediction,
            "error": error,
            "loss": loss,
        },
        "backward": {
            "dLossDPrediction": dloss_dprediction,
            "dPredictionDWeights": x.tolist(),
            "weightGradients": weight_gradients.tolist(),
            "biasGradient": bias_gradient,
        },
        "update": {
            "learningRate": rate,
            "weights": updated_weights.tolist(),
            "bias": updated_bias,
            "prediction": updated_prediction,
            "error": updated_error,
            "loss": updated_loss,
        },
    }


def numerical_gradients(
    inputs: Sequence[float],
    weights: Sequence[float],
    bias: float,
    target: float,
    learning_rate: float,
    epsilon: float = 1e-5,
) -> dict[str, Any]:
    """Compute central finite-difference gradients for weights and bias."""
    x, w, b, y, _ = _validated(inputs, weights, bias, target, learning_rate)
    step = _finite_scalar("epsilon", epsilon)
    if step <= 0.0:
        raise ValueError("epsilon must be greater than 0")

    gradients = np.empty_like(w)
    for index in range(w.size):
        plus = w.copy()
        minus = w.copy()
        plus[index] += step
        minus[index] -= step
        gradients[index] = (_loss(x, plus, b, y) - _loss(x, minus, b, y)) / (2.0 * step)

    bias_gradient = (_loss(x, w, b + step, y) - _loss(x, w, b - step, y)) / (2.0 * step)
    return {"weightGradients": gradients.tolist(), "biasGradient": bias_gradient}


def gradient_check(
    inputs: Sequence[float],
    weights: Sequence[float],
    bias: float,
    target: float,
    learning_rate: float,
    epsilon: float = 1e-5,
    tolerance: float = 1e-7,
) -> dict[str, Any]:
    """Compare analytical and finite-difference gradients."""
    threshold = _finite_scalar("tolerance", tolerance)
    if threshold <= 0.0:
        raise ValueError("tolerance must be greater than 0")
    trace = linear_neuron_trace(inputs, weights, bias, target, learning_rate)
    numerical = numerical_gradients(inputs, weights, bias, target, learning_rate, epsilon)
    analytical_weights = np.asarray(trace["backward"]["weightGradients"])
    numerical_weights = np.asarray(numerical["weightGradients"])
    errors = np.abs(analytical_weights - numerical_weights)
    bias_error = abs(trace["backward"]["biasGradient"] - numerical["biasGradient"])
    max_error = float(max(float(np.max(errors)), bias_error))
    return {
        "passed": max_error <= threshold,
        "maxAbsoluteError": max_error,
        "tolerance": threshold,
        "analytical": {
            "weightGradients": analytical_weights.tolist(),
            "biasGradient": trace["backward"]["biasGradient"],
        },
        "numerical": numerical,
    }

