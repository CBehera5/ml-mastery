from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pytest

from mlmath import gradient_check, linear_neuron_trace, numerical_gradients


def test_reference_example() -> None:
    trace = linear_neuron_trace([2, 3], [1, 2], 1, 12, 0.01)
    assert trace["forward"]["prediction"] == 9
    assert trace["forward"]["loss"] == 9
    assert trace["backward"]["weightGradients"] == [-12, -18]
    assert trace["backward"]["biasGradient"] == -6
    assert trace["update"]["weights"] == pytest.approx([1.12, 2.18])
    assert trace["update"]["bias"] == pytest.approx(1.06)
    assert trace["update"]["prediction"] == pytest.approx(9.84)
    assert trace["update"]["loss"] == pytest.approx(4.6656)


def test_gradient_check_reference_example() -> None:
    check = gradient_check([2, 3], [1, 2], 1, 12, 0.01)
    assert check["passed"]
    assert check["maxAbsoluteError"] < 1e-7


@pytest.mark.parametrize(
    ("field", "value", "message"),
    [
        ("inputs", [], "non-empty"),
        ("inputs", [1, np.nan], "finite"),
        ("weights", [1, np.inf], "finite"),
        ("bias", np.nan, "finite"),
        ("target", np.inf, "finite"),
        ("learning_rate", 0, "greater than 0"),
        ("learning_rate", 1.01, "at most 1"),
    ],
)
def test_invalid_values(field: str, value: object, message: str) -> None:
    arguments = {"inputs": [1, 2], "weights": [3, 4], "bias": 0, "target": 1, "learning_rate": 0.1}
    arguments[field] = value
    with pytest.raises(ValueError, match=message):
        linear_neuron_trace(**arguments)


def test_shape_mismatch() -> None:
    with pytest.raises(ValueError, match="same length"):
        linear_neuron_trace([1, 2], [1], 0, 1, 0.1)


def test_invalid_finite_difference_step() -> None:
    with pytest.raises(ValueError, match="epsilon"):
        numerical_gradients([1], [1], 0, 1, 0.1, epsilon=0)


def test_randomized_dimensions_are_deterministic_and_gradients_agree() -> None:
    rng = np.random.default_rng(20261014)
    for dimension in range(1, 33):
        inputs = rng.uniform(-3, 3, dimension).tolist()
        weights = rng.uniform(-2, 2, dimension).tolist()
        bias = float(rng.uniform(-1, 1))
        target = float(rng.uniform(-5, 5))
        first = linear_neuron_trace(inputs, weights, bias, target, 0.01)
        second = linear_neuron_trace(inputs, weights, bias, target, 0.01)
        assert first == second
        assert gradient_check(inputs, weights, bias, target, 0.01, tolerance=1e-6)["passed"]


def test_generated_fixture_matches_reference_engine() -> None:
    fixture_path = Path(__file__).parents[2] / "packages/math-contracts/fixtures/linear-neuron.v1.json"
    fixture = json.loads(fixture_path.read_text())
    for case in fixture["cases"]:
        values = case["input"]
        actual = linear_neuron_trace(
            values["inputs"], values["weights"], values["bias"], values["target"], values["learningRate"]
        )
        assert actual == case["trace"]

