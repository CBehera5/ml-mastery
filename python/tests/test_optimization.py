import json
import math
from pathlib import Path
import pytest
from jsonschema import Draft202012Validator
from mlmath.optimization import optimization_grid, optimization_regression_comparison, optimization_slice, optimization_state, optimization_training_trace
from mlmath.regression import regression_training_trace

ROOT = Path(__file__).resolve().parents[2]


def test_frozen_traces_and_schema():
    fixture = json.loads((ROOT / "packages/math-contracts/fixtures/optimization.v1.json").read_text())
    schema = json.loads((ROOT / "packages/math-contracts/schemas/optimization.v1.schema.json").read_text())
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    validator.validate(fixture)
    assert not validator.is_valid({**fixture, "contract": "optimization.v2"})
    for item in fixture["states"]:
        assert optimization_state(**item["input"]) == item["trace"]
    for item in fixture["training"]:
        assert optimization_training_trace(**item["input"], learning_rate=item["rate"], iterations=item["iterations"]) == item["trace"]
    for item in fixture["comparison"]:
        assert optimization_regression_comparison(item["rate"], item["iterations"]) == item["trace"]


def test_signed_and_simultaneous_updates():
    state = optimization_state("quadratic", [1, 0])
    assert state["gradient"] == [-4, 0] and state["dataLoss"] == 4
    assert optimization_training_trace("quadratic", [1, 0], 1, 0, .1, 1)["entries"][1]["point"] == pytest.approx([1.4, 0])
    assert optimization_training_trace("coupled", [1, 2], 1, 0, .1, 1)["entries"][1]["point"] == pytest.approx([.4, 1.4])


def test_gradients_grid_slice_and_stationary_points():
    for kind in ["quadratic", "anisotropic", "coupled", "saddle", "double-well"]:
        for point in [[-2, 1], [0, 0], [1, 2]]:
            trace = optimization_state(kind, point, 10)
            assert trace["gradientCheck"]["passed"]
            assert trace["numericalGradient"] == pytest.approx(trace["gradient"], abs=1e-5)
    assert optimization_state("saddle", [0, 0])["gradientNorm"] == 0
    assert optimization_state("saddle", [0, 1])["totalLoss"] == -1
    grid = optimization_grid("quadratic", [1, 0])
    assert len(grid) == 121
    for cell in grid:
        assert cell["totalLoss"] == optimization_state("quadratic", cell["point"])["totalLoss"]
    assert len(optimization_slice("quadratic", [1, 0])) == 41


def test_budget_is_not_convergence_and_guards_preserve_failure():
    oscillation = optimization_training_trace("quadratic", [1, 0], 1, 0, 1, 4)
    assert [entry["point"][0] for entry in oscillation["entries"]] == [1, 5, 1, 5, 1]
    assert oscillation["terminationReason"] == "iterations_completed"
    failed = optimization_training_trace("anisotropic", [1, 1], 100, 0, .1, 30)
    assert failed["status"] == "diverged" and failed["terminationReason"] == "numerical_limit_exceeded"
    assert failed["entries"][-1]["totalLoss"] is None
    assert failed["entries"][-1]["gradient"] is None
    json.dumps(failed, allow_nan=False)


def test_l2_decomposition_optima_and_preserved_regression():
    state = optimization_state("quadratic", [1, 0], 1, 1)
    assert (state["dataLoss"], state["penaltyLoss"], state["totalLoss"]) == (4, 1, 5)
    for penalty in [0, 1, 2]:
        assert optimization_state("quadratic", [3/(1+penalty), 0], 1, penalty)["gradientNorm"] == pytest.approx(0, abs=1e-12)
    trace = optimization_regression_comparison(.01, 4)
    assert trace["original"] == regression_training_trace([[-20], [-10], [10], [20]], [-4, -2, 2, 4], [0], 0, .01, 4)
    assert trace["original"]["entries"][-1]["loss"] > trace["original"]["entries"][0]["loss"]
    assert trace["scaled"]["entries"][-1]["loss"] < trace["scaled"]["entries"][0]["loss"]


@pytest.mark.parametrize("rate", [0, -1, 2.1, math.inf, math.nan, True])
def test_invalid_rates(rate):
    with pytest.raises(ValueError):
        optimization_training_trace("quadratic", [1, 0], 1, 0, rate, 4)


@pytest.mark.parametrize("budget", [0, 101, 1.5, True])
def test_invalid_budgets(budget):
    with pytest.raises(ValueError):
        optimization_training_trace("quadratic", [1, 0], 1, 0, .1, budget)


@pytest.mark.parametrize("kind,point,scale,penalty", [
    ("unknown", [1, 0], 1, 0), ("quadratic", [math.nan, 0], 1, 0),
    ("quadratic", [1], 1, 0), ("quadratic", [1, 0], 101, 0),
    ("quadratic", [1, 0], 1, -1), ("saddle", [1, 0], 1, 1),
])
def test_invalid_objective_settings(kind, point, scale, penalty):
    with pytest.raises(ValueError):
        optimization_state(kind, point, scale, penalty)
