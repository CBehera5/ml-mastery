import math

import numpy as np
import pytest

from mlmath import (
    feature_scaling_trace,
    inverse_transform_features,
    predict_batch,
    predict_one,
    regression_evaluation_trace,
    regression_gradient_check,
    regression_gradient_trace,
    regression_metrics,
    regression_training_trace,
    regression_update_trace,
    residuals,
    transform_features,
)


SINGLE = {"features": [[1], [2], [3]], "targets": [3, 5, 7], "weights": [1], "bias": 0}
MULTIPLE = {"features": [[1, 2], [2, 0], [3, 1]], "targets": [5, 4, 7], "weights": [0.5, -1], "bias": 1}


def test_predictions_residuals_and_metrics():
    assert predict_one([2, 3], [1, 2], 1) == 9
    assert predict_batch(SINGLE["features"], [2], 1) == [3, 5, 7]
    assert residuals([2, 7, 6], [3, 5, 7]) == [-1, 2, -1]
    assert regression_metrics([-1, 2, -1]) == pytest.approx({"mae": 4 / 3, "mse": 2, "rmse": math.sqrt(2)})


def test_evaluation_and_gradients_use_dataset_mse():
    evaluation = regression_evaluation_trace(**SINGLE)
    assert evaluation["metrics"] == {"mae": 3.0, "mse": 29 / 3, "rmse": pytest.approx(math.sqrt(29 / 3))}
    gradient = regression_gradient_trace(**SINGLE)
    assert gradient["factor"] == pytest.approx(2 / 3)
    assert gradient["weightGradients"] == pytest.approx([-40 / 3])
    assert gradient["biasGradient"] == pytest.approx(-6)


def test_update_and_small_learning_rate_reduce_convex_loss():
    update = regression_update_trace(**SINGLE, learning_rate=0.01)
    assert update["updatedParameters"]["weights"] == pytest.approx([1 + 0.01 * 40 / 3])
    assert update["updatedParameters"]["bias"] == pytest.approx(0.06)
    assert update["after"]["metrics"]["mse"] < update["before"]["metrics"]["mse"]


def test_analytical_gradients_match_central_differences():
    assert regression_gradient_check(**MULTIPLE, tolerance=1e-6)["passed"]
    rng = np.random.default_rng(90210)
    for observations in (1, 3, 8):
        for dimensions in (1, 2, 7):
            features = rng.normal(size=(observations, dimensions)).tolist()
            targets = rng.normal(size=observations).tolist()
            weights = rng.normal(size=dimensions).tolist()
            assert regression_gradient_check(features, targets, weights, 0.3, tolerance=1e-6)["passed"]


def test_training_trace_is_bounded_and_uses_state_entries():
    trace = regression_training_trace(**SINGLE, learning_rate=0.01, iterations=5)
    assert len(trace["entries"]) == 6
    assert trace["entries"][0]["iteration"] == 0
    assert trace["entries"][-1]["iteration"] == 5
    assert trace["completedUpdates"] == 5
    assert trace["status"] == "completed"
    assert trace["terminationReason"] == "iterations_completed"
    assert trace["entries"][-1]["loss"] < trace["entries"][0]["loss"]
    with pytest.raises(ValueError, match="integer from 1"):
        regression_training_trace(**SINGLE, learning_rate=0.01, iterations=1001)


def test_training_reports_divergence_without_serializing_nonfinite_numbers():
    trace = regression_training_trace([[1e100]], [1], [0], 0, 1, 3)
    assert trace["status"] == "diverged"
    assert trace["terminationReason"] in {"non_finite_calculation", "numerical_limit_exceeded"}
    assert trace["entries"][-1]["status"] == "diverged"
    assert trace["entries"][-1]["loss"] is None


def test_scaling_reuses_training_statistics_and_inverts_values():
    values = [[1, 10], [2, 20], [3, 30]]
    trace = feature_scaling_trace(values)
    assert np.mean(trace["scaled"], axis=0).tolist() == pytest.approx([0, 0], abs=1e-12)
    assert np.allclose(transform_features(values, trace["mean"], trace["scale"]), trace["scaled"])
    assert np.allclose(inverse_transform_features(trace["scaled"], trace["mean"], trace["scale"]), values)
    with pytest.raises(ValueError, match="feature column 1 has zero variance"):
        feature_scaling_trace([[1, 4], [2, 4]])


@pytest.mark.parametrize(
    ("call", "message"),
    [
        (lambda: regression_evaluation_trace([], [], [], 0), "non-empty rectangular"),
        (lambda: regression_evaluation_trace([[1], [2, 3]], [1, 2], [1], 0), "rectangular"),
        (lambda: regression_evaluation_trace([[1]], [1, 2], [1], 0), "targets length"),
        (lambda: regression_evaluation_trace([[1, 2]], [1], [1], 0), "weights length"),
        (lambda: regression_evaluation_trace([[float("nan")]], [1], [1], 0), "finite"),
        (lambda: regression_update_trace(**SINGLE, learning_rate=0), "greater than 0"),
        (lambda: regression_update_trace(**SINGLE, learning_rate=11), "at most 10"),
    ],
)
def test_validation_errors_are_deterministic(call, message):
    with pytest.raises(ValueError, match=message):
        call()
