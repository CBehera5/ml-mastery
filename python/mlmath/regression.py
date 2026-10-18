"""Deterministic dataset-level linear regression reference runtime."""

from __future__ import annotations

from typing import Any, Sequence

import numpy as np

REGRESSION_SCHEMA_VERSION = "1.0.0"
MAX_OBSERVATIONS = 1000
MAX_FEATURES = 64
MAX_TRAINING_ITERATIONS = 1000
MAX_LEARNING_RATE = 10.0
NUMERICAL_LIMIT = 1e300


def _scalar(name: str, value: Any) -> float:
    if isinstance(value, (bool, np.bool_)):
        raise ValueError(f"{name} must be a finite number")
    try:
        result = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a finite number") from exc
    if not np.isfinite(result):
        raise ValueError(f"{name} must be a finite number")
    return result


def _vector(name: str, values: Sequence[float]) -> np.ndarray:
    if isinstance(values, (str, bytes)):
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array")
    try:
        result = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array") from exc
    if result.ndim != 1 or result.size == 0:
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array")
    if not np.all(np.isfinite(result)):
        raise ValueError(f"{name} must contain only finite numbers")
    return result


def _matrix(values: Sequence[Sequence[float]]) -> np.ndarray:
    if isinstance(values, (str, bytes)):
        raise ValueError("features must be a non-empty rectangular numeric matrix")
    try:
        result = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc:
        raise ValueError("features must be a non-empty rectangular numeric matrix") from exc
    if result.ndim != 2 or 0 in result.shape:
        raise ValueError("features must be a non-empty rectangular numeric matrix")
    if result.shape[0] > MAX_OBSERVATIONS:
        raise ValueError(f"features may contain at most {MAX_OBSERVATIONS} observations")
    if result.shape[1] > MAX_FEATURES:
        raise ValueError(f"features may contain at most {MAX_FEATURES} columns")
    if not np.all(np.isfinite(result)):
        raise ValueError("features must contain only finite numbers")
    return result


def _dataset(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float
) -> tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    x, y, w, b = _matrix(features), _vector("targets", targets), _vector("weights", weights), _scalar("bias", bias)
    if y.size != x.shape[0]:
        raise ValueError("targets length must equal the number of observations")
    if w.size != x.shape[1]:
        raise ValueError("weights length must equal the number of feature columns")
    return x, y, w, b


def validate_regression_input(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float
) -> dict[str, Any]:
    """Validate and normalize a regression dataset and parameter vector."""
    x, y, w, b = _dataset(features, targets, weights, bias)
    return {"features": x.tolist(), "targets": y.tolist(), "weights": w.tolist(), "bias": b}


def _rate(value: float) -> float:
    rate = _scalar("learningRate", value)
    if not 0.0 < rate <= MAX_LEARNING_RATE:
        raise ValueError(f"learningRate must be greater than 0 and at most {MAX_LEARNING_RATE:g}")
    return rate


def predict_one(features: Sequence[float], weights: Sequence[float], bias: float) -> float:
    row, w, b = _vector("features", features), _vector("weights", weights), _scalar("bias", bias)
    if row.size != w.size:
        raise ValueError("features and weights must have the same length")
    result = float(np.dot(row, w) + b)
    if not np.isfinite(result):
        raise ValueError("prediction became non-finite; reduce input or parameter magnitudes")
    return result


def predict_batch(features: Sequence[Sequence[float]], weights: Sequence[float], bias: float) -> list[float]:
    x = _matrix(features)
    w, b = _vector("weights", weights), _scalar("bias", bias)
    if w.size != x.shape[1]:
        raise ValueError("weights length must equal the number of feature columns")
    values = x @ w + b
    if not np.all(np.isfinite(values)):
        raise ValueError("predictions became non-finite; reduce input or parameter magnitudes")
    return values.tolist()


def residuals(predictions: Sequence[float], targets: Sequence[float]) -> list[float]:
    predicted, actual = _vector("predictions", predictions), _vector("targets", targets)
    if predicted.size != actual.size:
        raise ValueError("predictions and targets must have the same length")
    values = predicted - actual
    if not np.all(np.isfinite(values)):
        raise ValueError("residuals became non-finite; reduce value magnitudes")
    return values.tolist()


def regression_metrics(residual_values: Sequence[float]) -> dict[str, float]:
    values = _vector("residuals", residual_values)
    with np.errstate(over="ignore", invalid="ignore"):
        mae = float(np.mean(np.abs(values)))
        mse = float(np.mean(values * values))
        rmse = float(np.sqrt(mse))
    if not all(np.isfinite(value) for value in (mae, mse, rmse)):
        raise ValueError("metrics became non-finite; reduce data or parameter magnitudes")
    return {"mae": mae, "mse": mse, "rmse": rmse}


def regression_evaluation_trace(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float
) -> dict[str, Any]:
    x, y, w, b = _dataset(features, targets, weights, bias)
    with np.errstate(over="ignore", invalid="ignore"):
        contributions = x * w
        predictions = np.sum(contributions, axis=1) + b
        errors = predictions - y
    if not np.all(np.isfinite(contributions)) or not np.all(np.isfinite(predictions)) or not np.all(np.isfinite(errors)):
        raise ValueError("evaluation became non-finite; reduce data or parameter magnitudes")
    metrics = regression_metrics(errors.tolist())
    return {
        "schemaVersion": REGRESSION_SCHEMA_VERSION,
        "shape": {"observations": int(x.shape[0]), "features": int(x.shape[1])},
        "parameters": {"weights": w.tolist(), "bias": b},
        "rows": [
            {
                "features": x[index].tolist(),
                "contributions": contributions[index].tolist(),
                "target": float(y[index]),
                "prediction": float(predictions[index]),
                "residual": float(errors[index]),
                "absoluteResidual": float(abs(errors[index])),
                "squaredResidual": float(errors[index] ** 2),
            }
            for index in range(x.shape[0])
        ],
        "metrics": metrics,
    }


def regression_gradient_trace(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float
) -> dict[str, Any]:
    x, y, w, b = _dataset(features, targets, weights, bias)
    evaluation = regression_evaluation_trace(x, y, w, b)
    errors = np.asarray([row["residual"] for row in evaluation["rows"]], dtype=np.float64)
    with np.errstate(over="ignore", invalid="ignore"):
        weight_gradients = (2.0 / x.shape[0]) * (x.T @ errors)
        bias_gradient = float((2.0 / x.shape[0]) * np.sum(errors))
    if not np.all(np.isfinite(weight_gradients)) or not np.isfinite(bias_gradient):
        raise ValueError("gradients became non-finite; scale features or reduce parameter magnitudes")
    return {
        "schemaVersion": REGRESSION_SCHEMA_VERSION,
        "residuals": errors.tolist(),
        "factor": 2.0 / x.shape[0],
        "weightGradients": weight_gradients.tolist(),
        "biasGradient": bias_gradient,
    }


def regression_update_trace(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float, learning_rate: float
) -> dict[str, Any]:
    x, y, w, b = _dataset(features, targets, weights, bias)
    rate = _rate(learning_rate)
    before = regression_evaluation_trace(x, y, w, b)
    gradient = regression_gradient_trace(x, y, w, b)
    updated_weights = w - rate * np.asarray(gradient["weightGradients"])
    updated_bias = b - rate * gradient["biasGradient"]
    if not np.all(np.isfinite(updated_weights)) or not np.isfinite(updated_bias):
        raise ValueError("parameter update became non-finite; reduce the learning rate")
    after = regression_evaluation_trace(x, y, updated_weights, float(updated_bias))
    return {
        "schemaVersion": REGRESSION_SCHEMA_VERSION,
        "learningRate": rate,
        "before": before,
        "gradient": gradient,
        "updatedParameters": {"weights": updated_weights.tolist(), "bias": float(updated_bias)},
        "after": after,
    }


def numerical_regression_gradients(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float, epsilon: float = 1e-5
) -> dict[str, Any]:
    x, y, w, b = _dataset(features, targets, weights, bias)
    step = _scalar("epsilon", epsilon)
    if step <= 0:
        raise ValueError("epsilon must be greater than 0")
    gradients = []
    for index in range(w.size):
        plus, minus = w.copy(), w.copy()
        plus[index] += step
        minus[index] -= step
        plus_loss = regression_evaluation_trace(x, y, plus, b)["metrics"]["mse"]
        minus_loss = regression_evaluation_trace(x, y, minus, b)["metrics"]["mse"]
        gradients.append((plus_loss - minus_loss) / (2.0 * step))
    plus_bias = regression_evaluation_trace(x, y, w, b + step)["metrics"]["mse"]
    minus_bias = regression_evaluation_trace(x, y, w, b - step)["metrics"]["mse"]
    return {"weightGradients": gradients, "biasGradient": (plus_bias - minus_bias) / (2.0 * step)}


def regression_gradient_check(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float,
    epsilon: float = 1e-5, tolerance: float = 1e-7,
) -> dict[str, Any]:
    threshold = _scalar("tolerance", tolerance)
    if threshold <= 0:
        raise ValueError("tolerance must be greater than 0")
    analytical = regression_gradient_trace(features, targets, weights, bias)
    numerical = numerical_regression_gradients(features, targets, weights, bias, epsilon)
    errors = [abs(a - n) for a, n in zip(analytical["weightGradients"], numerical["weightGradients"])]
    maximum = max(errors + [abs(analytical["biasGradient"] - numerical["biasGradient"])])
    return {"passed": maximum <= threshold, "maxAbsoluteError": maximum, "tolerance": threshold, "analytical": {"weightGradients": analytical["weightGradients"], "biasGradient": analytical["biasGradient"]}, "numerical": numerical}


def regression_training_trace(
    features: Sequence[Sequence[float]], targets: Sequence[float], weights: Sequence[float], bias: float,
    learning_rate: float, iterations: int,
) -> dict[str, Any]:
    x, y, current_weights, current_bias = _dataset(features, targets, weights, bias)
    rate = _rate(learning_rate)
    if isinstance(iterations, bool) or not isinstance(iterations, (int, np.integer)) or not 1 <= int(iterations) <= MAX_TRAINING_ITERATIONS:
        raise ValueError(f"iterations must be an integer from 1 to {MAX_TRAINING_ITERATIONS}")
    requested = int(iterations)
    entries: list[dict[str, Any]] = []
    status, reason = "completed", "iterations_completed"
    for iteration in range(requested + 1):
        try:
            evaluation = regression_evaluation_trace(x, y, current_weights, current_bias)
            gradient = regression_gradient_trace(x, y, current_weights, current_bias)
            loss = evaluation["metrics"]["mse"]
            if loss > NUMERICAL_LIMIT or max([abs(value) for value in gradient["weightGradients"]] + [abs(gradient["biasGradient"])]) > NUMERICAL_LIMIT:
                raise OverflowError("numerical limit exceeded")
            entries.append({"iteration": iteration, "weights": current_weights.tolist(), "bias": float(current_bias), "loss": loss, "weightGradients": gradient["weightGradients"], "biasGradient": gradient["biasGradient"], "status": "running", "terminationReason": None})
        except (ValueError, OverflowError) as exc:
            status = "diverged"
            reason = "numerical_limit_exceeded" if isinstance(exc, OverflowError) else "non_finite_calculation"
            entries.append({"iteration": iteration, "weights": current_weights.tolist(), "bias": float(current_bias), "loss": None, "weightGradients": None, "biasGradient": None, "status": status, "terminationReason": reason})
            break
        if iteration == requested:
            entries[-1]["status"], entries[-1]["terminationReason"] = status, reason
            break
        next_weights = current_weights - rate * np.asarray(gradient["weightGradients"])
        next_bias = float(current_bias - rate * gradient["biasGradient"])
        if not np.all(np.isfinite(next_weights)) or not np.isfinite(next_bias):
            status, reason = "diverged", "non_finite_calculation"
            entries[-1]["status"], entries[-1]["terminationReason"] = status, reason
            break
        current_weights, current_bias = next_weights, next_bias
    return {"schemaVersion": REGRESSION_SCHEMA_VERSION, "entryConvention": "iteration 0 is the initial state; iteration k is the state after k updates", "requestedIterations": requested, "completedUpdates": max(0, len(entries) - 1), "learningRate": rate, "status": status, "terminationReason": reason, "entries": entries}


def feature_scaling_trace(features: Sequence[Sequence[float]]) -> dict[str, Any]:
    x = _matrix(features)
    means, scales = np.mean(x, axis=0), np.std(x, axis=0)
    zero_columns = np.flatnonzero(scales == 0.0)
    if zero_columns.size:
        index = int(zero_columns[0])
        raise ValueError(f"feature column {index} has zero variance and cannot be scaled; remove it or choose a varying feature")
    scaled = (x - means) / scales
    if not np.all(np.isfinite(scaled)):
        raise ValueError("feature scaling became non-finite; reduce feature magnitudes")
    return {"schemaVersion": REGRESSION_SCHEMA_VERSION, "method": "standard", "original": x.tolist(), "mean": means.tolist(), "scale": scales.tolist(), "scaled": scaled.tolist()}


def transform_features(features: Sequence[Sequence[float]], mean: Sequence[float], scale: Sequence[float]) -> list[list[float]]:
    x, means, scales = _matrix(features), _vector("mean", mean), _vector("scale", scale)
    if means.size != x.shape[1] or scales.size != x.shape[1]:
        raise ValueError("mean and scale lengths must equal the number of feature columns")
    if np.any(scales <= 0):
        raise ValueError("scale values must be greater than 0")
    result = (x - means) / scales
    if not np.all(np.isfinite(result)):
        raise ValueError("feature transformation became non-finite")
    return result.tolist()


def inverse_transform_features(features: Sequence[Sequence[float]], mean: Sequence[float], scale: Sequence[float]) -> list[list[float]]:
    x, means, scales = _matrix(features), _vector("mean", mean), _vector("scale", scale)
    if means.size != x.shape[1] or scales.size != x.shape[1]:
        raise ValueError("mean and scale lengths must equal the number of feature columns")
    if np.any(scales <= 0):
        raise ValueError("scale values must be greater than 0")
    result = x * scales + means
    if not np.all(np.isfinite(result)):
        raise ValueError("inverse feature transformation became non-finite")
    return result.tolist()
