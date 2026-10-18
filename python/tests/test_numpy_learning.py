import ast
import json
from pathlib import Path

import numpy as np
import pytest

from mlmath.numpy_learning_reference import authored_case, build, normalize

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = json.loads((ROOT / "packages/python-contracts/fixtures/numpy-learning.v1.json").read_text())


def test_frozen_complete_numpy_reference_and_profile():
    assert build() == FIXTURE
    assert FIXTURE["numpy"] == "2.5.4"
    assert len(FIXTURE["lessons"]) == 6
    assert len(FIXTURE["cases"]) == 144
    assert len([case for case in FIXTURE["cases"] if case["mode"] != "worked"]) == 120
    assert sum(objective["critical"] for lesson in FIXTURE["lessons"] for objective in lesson["objectives"]) == 6


@pytest.mark.parametrize("case", FIXTURE["cases"], ids=lambda case: f'{case["objective"]}-{case["mode"]}-{case["variant"]}')
def test_all_worked_practice_independent_cases_match_real_numpy(case):
    actual = authored_case(int(case["lesson"][1:]), int(case["objective"][-1]) - 1, case["amount"])
    assert actual["expected"] == case["expected"]
    assert len(case["code"].splitlines()) <= 25
    assert len(case["code"].encode()) <= 4096
    tree = ast.parse(case["code"])
    assert not any(isinstance(node, (ast.While, ast.Lambda, ast.GeneratorExp, ast.AsyncFor)) for node in ast.walk(tree))
    calls = [node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)]
    assert not set(calls) & {"clip", "linalg", "load", "save", "fromfile", "tofile"}


@pytest.mark.parametrize("arguments", [(1, 0, "1; import os"), (1, 0, True), (7, 0, 1), (1, 4, 1), (1, 0, 10000000)])
def test_author_oracle_rejects_unlisted_configurations(arguments):
    with pytest.raises(ValueError):
        authored_case(*arguments)


def test_analytic_anchors_and_error_tags():
    assert authored_case(4, 1, 3)["expected"]["prediction"]["values"] == [230.0, 140.0]
    assert authored_case(5, 1, 3)["expected"]["matrix"]["values"] == [12, 34]
    assert authored_case(6, 0, 3)["expected"]["feature_mean"]["values"] == [2.0, 15.0]
    assert authored_case(6, 1, 3)["expected"] == {"mean": 2.0, "population": 1.0, "sample": 2.0, "n": 2}
    assert authored_case(3, 0, 3)["expected"][-1] == {"tag": "error", "class": "ValueError"}
    assert authored_case(6, 2, 3)["expected"]["nan_aware"]["values"][-1] == {"tag": "missing"}
    assert authored_case(6, 3, 3)["expected"]["value"]["tag"] == "nonfinite"
    assert authored_case(6, 3, 3)["expected"]["valid_model_statistic"] is False


def test_array_bounds_and_no_nonfinite_json_numbers():
    for value in [np.zeros((33, 1)), np.zeros((9, 8)), np.zeros((1, 1, 1)), np.array([1], dtype=np.int32)]:
        with pytest.raises(AssertionError):
            normalize(value)
    json.dumps(FIXTURE, allow_nan=False)
    assert normalize(np.array(3, dtype=np.int64)) == {"shape": [], "dtype": "int64", "values": 3}


def test_equivalent_matmul_and_counterexamples_across_all_forms():
    for amount in (1, 2, 3, 4, 5, 7):
        product = authored_case(5, 1, amount)["expected"]
        assert product["matrix"] == product["equivalent"]
        assert product["matrix"]["shape"] == [2]
        assert product["elementwise"]["shape"] == [2, 2]
        broadcast = authored_case(3, 1, amount)["expected"]
        assert broadcast["intended_per_row"]["shape"] == broadcast["legal_but_per_feature"]["shape"]
        assert broadcast["intended_per_row"]["values"] != broadcast["legal_but_per_feature"]["values"]
        view = authored_case(2, 2, amount)["expected"]
        assert view[0]["values"][0][0] == view[1]["values"][0]
        assert view[1]["values"][0] != view[2]["values"][0]
