import ast
import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import make_pipeline

from mlmath.preparation_learning_reference import authored_case, build, experiment_cases, HOUSES, DATA_HASH

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = json.loads((ROOT / "packages/python-contracts/fixtures/preparation-learning.v1.json").read_text())


def test_complete_frozen_reference_profile_and_exact_objectives():
    assert build() == FIXTURE
    assert FIXTURE["sklearn"] == "1.9.1"
    assert len(FIXTURE["lessons"]) == 6
    assert len(FIXTURE["cases"]) == 148
    assert len([case for case in FIXTURE["cases"] if case["mode"] in ("practice", "mastery")]) == 120
    gates = [objective["id"] for lesson in FIXTURE["lessons"] for objective in lesson["objectives"] if objective["critical"]]
    assert gates == ["T01.O1", "T01.O2", "T02.O1", "T03.O1", "T04.O1", "T05.O1", "T05.O2", "T06.O1"]
    assert FIXTURE["manifest"]["sha256"] == DATA_HASH
    assert FIXTURE["manifest"]["train_ids"] == HOUSES["id"][:12]
    assert FIXTURE["manifest"]["test_ids"] == HOUSES["id"][12:]
    for lesson in FIXTURE["lessons"]:
        for objective in lesson["objectives"]:
            for mode, count in [("practice", 2), ("mastery", 3)]:
                codes = [case["code"] for case in FIXTURE["cases"] if case["objective"] == objective["id"] and case["mode"] == mode]
                assert len(set(codes)) == count


@pytest.mark.parametrize("case", FIXTURE["cases"], ids=lambda case: f'{case["objective"]}-{case["mode"]}-{case["variant"]}')
def test_every_scored_worked_and_exposed_reference(case):
    actual = experiment_cases()[case["variant"]] if case["mode"] == "experiment" else authored_case(int(case["lesson"][1:]), int(case["objective"][-1]) - 1, case["amount"])
    assert actual["expected"] == case["expected"]
    assert actual["reason"] == case["reason"]
    assert len(case["code"].splitlines()) <= 25 and len(case["code"].encode()) <= 4096
    tree = ast.parse(case["code"])
    assert not any(isinstance(node, (ast.While, ast.Lambda, ast.GeneratorExp)) for node in ast.walk(tree))
    assert not {node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)} & {"eval", "query", "apply", "read_csv", "to_csv", "system"}
    assert not {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)} & {"eval", "exec", "open", "compile", "__import__"}
    imports = [node.module for node in ast.walk(tree) if isinstance(node, ast.ImportFrom)]
    assert set(imports) <= {"sklearn.model_selection", "sklearn.impute", "sklearn.preprocessing", "sklearn.compose", "sklearn.pipeline"}


@pytest.mark.parametrize("arguments", [(1, 0, True), (1, 0, "import os"), (0, 0, 1), (7, 0, 1), (1, -1, 1), (1, 4, 1), (1, 0, 99999)])
def test_unlisted_and_malformed_author_configs_reject(arguments):
    with pytest.raises(ValueError):
        authored_case(*arguments)


def test_analytic_anchors_and_explicit_invalid_fit_comparators():
    missing = authored_case(2, 0, 3)["expected"]
    assert missing["training_median"] == [20]
    assert missing["test_output"] == [[1000], [20]]
    assert missing["whole_data_fit_allowed"] is False
    scale = authored_case(4, 0, 3)["expected"]
    assert scale["mean"] == [2] and scale["scale"] == [1]
    assert scale["population_variance"] == [1] and scale["sample_variance_wrong_for_scaler"] == 2
    assert scale["test"] == [[3]] and scale["whole_data_fit_allowed"] is False
    constant = authored_case(4, 2, 3)["expected"]
    assert constant["variance"] == [0] and constant["scale"] == [1] and constant["new_output"] == [[1]]
    assert authored_case(3, 0, 3)["expected"]["encoded"] == [[0, 0]]
    assert authored_case(6, 0, 3)["expected"]["transformed"] == [50]


def test_test_mutations_cannot_change_training_or_fold_fit_attributes():
    train = np.array([[10.], [np.nan], [30.]])
    imputer = SimpleImputer(strategy="median").fit(train)
    scaler = StandardScaler().fit([[1.], [3.]])
    encoder = OneHotEncoder(categories=[["basic", "pro"]], handle_unknown="ignore", sparse_output=False).fit([["basic"], ["pro"]])
    for extreme in [-100000, 0, 100000]:
        np.testing.assert_array_equal(imputer.transform([[extreme], [np.nan]])[:, 0], [extreme, 20])
        np.testing.assert_array_equal(imputer.statistics_, [20])
        np.testing.assert_array_equal(scaler.transform([[extreme]]), [[extreme - 2]])
        np.testing.assert_array_equal(scaler.mean_, [2])
        np.testing.assert_array_equal(encoder.transform([["new"]]), [[0, 0]])
        assert encoder.categories_[0].tolist() == ["basic", "pro"]
    local = make_pipeline(SimpleImputer(strategy="median"), StandardScaler()).fit(train)
    np.testing.assert_array_equal(local.named_steps["simpleimputer"].statistics_, [20])
    local.transform([[99999.], [np.nan]])
    np.testing.assert_array_equal(local.named_steps["simpleimputer"].statistics_, [20])
    for amount in (1, 2, 3, 4, 5, 7):
        fold = authored_case(5, 1, amount)["expected"]
        assert not set(fold["stage_fit_ids"]) & set(fold["transform_only_ids"])
        assert fold["fold_statistic"] != fold["invalid_prefit_statistic"]
        assert fold["prefit_allowed"] is False


def test_unknown_drop_schema_all_missing_and_invalid_sequences():
    cases = experiment_cases()
    assert cases[0]["expected"]["valid_future_forecast_boundary"] is False
    assert cases[2]["expected"]["class"] == "ValueError"
    assert cases[3]["expected"]["class"] == "ValueError"
    no_drop = authored_case(3, 3, 3)["expected"]
    dropped = authored_case(3, 3, 2)["expected"]
    assert no_drop["basic"] != no_drop["unknown"]
    assert dropped["basic"] == dropped["unknown"] and not dropped["same_meaning_guaranteed"]
    missing = authored_case(2, 3, 3)["expected"]
    assert missing["statistics"][0] == {"tag": "missing"}
    assert missing["output_names"] == ["area"]
    assert len(missing["output"][0]) == 1
    with pytest.raises(ValueError):
        StandardScaler().fit(pd.DataFrame({"age": [1., 3.]})).transform(pd.DataFrame({"other": [5.]}))
    for amount in (1, 2, 3, 4, 5, 7):
        assert authored_case(6, 3, amount)["expected"]["compatible"] is False
        sequence = authored_case(5, 2, amount)["expected"]
        assert sequence["columns"] == ["numeric__age", "category__plan_basic", "category__plan_pro"]
        assert sequence["shape"] == [2, 3]

