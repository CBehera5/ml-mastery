import json
from pathlib import Path
import pytest
from jsonschema import Draft202012Validator
from mlmath.calculus_extension import continuity_trace, multivariable_trace
ROOT = Path(__file__).resolve().parents[2]


def test_frozen_traces_and_schema():
    fixture = json.loads((ROOT / "packages/math-contracts/fixtures/calculus-extension.v1.json").read_text())
    schema = json.loads((ROOT / "packages/math-contracts/schemas/calculus-extension.v1.schema.json").read_text())
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    for item in fixture["continuity"]:
        trace = continuity_trace(item["kind"], item["step"])
        assert trace == item["trace"]
        validator.validate(trace)
        assert not validator.is_valid({**trace, "schemaVersion": "2.0.0"})
    for item in fixture["multivariable"]:
        trace = multivariable_trace(**item["input"])
        assert trace == item["trace"]
        validator.validate(trace)


def test_essential_references():
    assert continuity_trace("hole", .01)["limit"] == 2
    assert continuity_trace("hole", .01)["value"] is None
    assert continuity_trace("jump", .01)["limit"] is None
    corner = continuity_trace("corner", .01)
    assert corner["continuous"] and not corner["differentiable"]
    assert corner["symmetricEstimate"] == 0
    assert (corner["leftSlope"], corner["rightSlope"]) == (-1, 1)
    trace = multivariable_trace(1, 2, .1, "bowl", "x")
    assert trace["gradient"] == [2, 12]
    assert trace["numericalGradient"] == pytest.approx([2, 12])
    assert trace["update"]["next"] == pytest.approx([.8, .8])
    assert trace["jacobian"] == [[1, 1], [2, 1]]
    assert trace["hessian"] == [[2, 0], [0, 6]]


@pytest.mark.parametrize("step", [0, -1, 2, 1e-12, float("inf"), True])
def test_bad_intervals(step):
    with pytest.raises(ValueError):
        continuity_trace("corner", step)


def test_bad_multivariable_inputs():
    with pytest.raises(ValueError):
        multivariable_trace(1e308, 1, .1, "bowl", "x")
    with pytest.raises(ValueError):
        multivariable_trace(1, 1, -.1, "bowl", "x")
