import json
import math
from pathlib import Path
import pytest
from jsonschema import Draft202012Validator
from mlmath.vector_operations import vector_operations_trace

ROOT = Path(__file__).resolve().parents[2]


def test_fixtures_and_versioned_schema():
    fixture = json.loads((ROOT / "packages/math-contracts/fixtures/vector-operations.v1.json").read_text())
    schema = json.loads((ROOT / "packages/math-contracts/schemas/vector-operations.v1.schema.json").read_text())
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    for item in fixture["cases"]:
        trace = vector_operations_trace(**item["input"])
        validator.validate(trace)
        assert trace["input"] == item["trace"]["input"]
        for key in ("sum", "scaled", "unitDirection", "projection", "leftMagnitude", "rightMagnitude", "dot", "cosine", "angleDegrees"):
            if item["trace"][key] is None:
                assert trace[key] is None
            else:
                assert trace[key] == pytest.approx(item["trace"][key], abs=1e-10)
        assert not validator.is_valid({**trace, "schemaVersion": "2.0.0"})


def test_geometry_references():
    trace = vector_operations_trace([3, 4], [1, 0], -2)
    assert trace["leftMagnitude"] == 5
    assert trace["sum"] == [4, 4]
    assert trace["scaled"] == [-6, -8]
    assert trace["projection"] == [3, 0]
    assert trace["angleDegrees"] == pytest.approx(math.degrees(math.acos(.6)))
    assert vector_operations_trace([0, 0], [1, 0], 1)["angleDegrees"] is None
    assert vector_operations_trace([1, 0], [0, 0], 1)["projection"] is None
    assert vector_operations_trace([1, 0], [1e-200, 0], 1)["projection"] == [1, 0]
    assert vector_operations_trace([1e-200, 0], [1e-200, 0], 1)["cosine"] == 1


@pytest.mark.parametrize("left,right,scale", [([], [1, 0], 1), ([1, 2, 3], [1, 0], 1), ([1, 2], [0], 1), ([True, 0], [1, 0], 1), ([math.inf, 0], [1, 0], 1), ([1e308, 0], [1, 0], 1), ([1, 2], [1, 0], 11), ([1, 2], [1, 0], True)])
def test_invalid_boundary(left, right, scale):
    with pytest.raises(ValueError):
        vector_operations_trace(left, right, scale)
