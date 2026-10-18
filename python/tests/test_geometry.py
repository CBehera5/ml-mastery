import json
import math
from pathlib import Path
import pytest
from jsonschema import Draft202012Validator
from mlmath.geometry import TRANSFORMS, geometry_trace, eigen_trace
from mlmath.matrix import matrix_matrix_trace

ROOT = Path(__file__).resolve().parents[2]


def test_frozen_traces_and_schemas():
    fixture = json.loads((ROOT / "packages/math-contracts/fixtures/geometry.v1.json").read_text())
    for name, items, calculate in [("geometry-trace.v1", fixture["geometry"], lambda entry: geometry_trace(**entry)), ("eigen-trace.v1", fixture["eigen"], lambda entry: eigen_trace(**entry))]:
        schema = json.loads((ROOT / f"packages/math-contracts/schemas/{name}.schema.json").read_text())
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema)
        for item in items:
            trace = calculate(item["input"])
            assert trace == item["trace"]
            validator.validate(trace)
            assert not validator.is_valid({**trace, "schemaVersion": "2.0.0"})


def test_mapping_composition_and_collapse():
    trace = geometry_trace("scale", "rotation", [1, 1], [2, 3])
    assert trace["mapped"] == [2, 1]
    assert trace["spanPoint"] == [4, 3]
    assert trace["composition"]["firstThenSecondPoint"] == [-1, 2]
    assert trace["composition"]["secondThenFirstPoint"] == [-2, 1]
    assert geometry_trace("dependent", "identity", [1, 1], [3, -2])["spanPoint"] == [-1, 0]
    assert geometry_trace("zero", "identity", [1, 1], [1, 1])["rank"] == 0


def test_supported_inverse_area_and_near_singular_policy():
    for name in TRANSFORMS:
        trace = geometry_trace(name, "identity", [3, -2], [1, 1])
        assert trace["area"] == abs(trace["determinant"])
        if trace["inverse"] is not None:
            assert trace["roundTrip"] == pytest.approx([3, -2])
            assert matrix_matrix_trace(trace["inverse"], trace["first"])["result"] == [[1, 0], [0, 1]]
    assert geometry_trace("reflection", "identity", [1, 1], [1, 1])["signedArea"] == -1
    near = geometry_trace("near", "identity", [1, 1], [1, 1])
    assert near["rank"] == 2
    assert near["determinant"] == 1e-10
    assert near["inverseStatus"] == "near-singular"
    assert near["inverse"] is None


def test_eigenpair_cautions():
    assert eigen_trace("reflection", [1, 0])["eigenvalue"] == -1
    assert eigen_trace("collapse", [0, 1])["eigenvalue"] == 0
    assert eigen_trace("scale", [0, 0])["isEigenvector"] is False
    assert eigen_trace("rotation", [1e-200, 0])["isEigenvector"] is False
    assert eigen_trace("scale", [1e-200, 0])["eigenvalue"] == 2
    assert len(eigen_trace("shear", [1, 0])["knownPairs"]) == 1


@pytest.mark.parametrize("vector", [[], [1], [1, 2, 3], [True, 0], [math.nan, 0], [math.inf, 0], [1e308, 0]])
def test_invalid_vector_boundaries(vector):
    with pytest.raises(ValueError):
        geometry_trace("scale", "identity", vector, [1, 1])


def test_invalid_named_inputs_and_coefficients():
    with pytest.raises(ValueError):
        geometry_trace("unknown", "identity", [1, 1], [1, 1])
    with pytest.raises(ValueError):
        geometry_trace("scale", "identity", [1, 1], [11, 0])
    with pytest.raises(ValueError):
        eigen_trace("near", [1, 0])
