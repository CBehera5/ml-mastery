import ast
import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest
from sklearn.dummy import DummyRegressor, DummyClassifier
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
from sklearn.exceptions import NotFittedError
from sklearn.model_selection import KFold, cross_val_score

from mlmath.sklearn_learning_reference import authored_case, build, experiment_cases, HOUSES, DATA_HASH

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = json.loads((ROOT / "packages/python-contracts/fixtures/sklearn-learning.v1.json").read_text())


def test_complete_frozen_reference_and_approved_objective_map():
    assert build() == FIXTURE
    assert FIXTURE["sklearn"] == "1.9.1"
    assert len(FIXTURE["cases"]) == 124 and len(FIXTURE["lessons"]) == 5
    assert sum(case["mode"] == "practice" for case in FIXTURE["cases"]) == 40
    assert sum(case["mode"] == "mastery" for case in FIXTURE["cases"]) == 60
    objectives = [objective for lesson in FIXTURE["lessons"] for objective in lesson["objectives"]]
    assert [objective["id"] for objective in objectives if objective["critical"]] == ["S01.O1","S01.O3","S02.O1","S02.O2","S03.O1","S04.O1","S05.O1"]
    assert [objective["id"] for objective in objectives if objective["introductory"]] == ["S05.O4"]
    for objective in objectives:
        for mode, count in [("practice",2),("mastery",3)]:
            codes = [case["code"] for case in FIXTURE["cases"] if case["objective"] == objective["id"] and case["mode"] == mode]
            assert len(set(codes)) == count
    assert FIXTURE["manifest"]["sha256"] == DATA_HASH
    assert FIXTURE["manifest"]["train_ids"] == HOUSES["id"][:12]


@pytest.mark.parametrize("case", FIXTURE["cases"], ids=lambda case: f'{case["objective"]}-{case["mode"]}-{case["variant"]}')
def test_every_scored_worked_and_experiment_matches_actual_sklearn(case):
    actual = experiment_cases()[case["variant"]] if case["mode"] == "experiment" else authored_case(int(case["lesson"][1:]),int(case["objective"][-1])-1,case["amount"])
    assert actual["expected"] == case["expected"] and actual["reason"] == case["reason"]
    assert len(case["code"].splitlines()) <= 25 and len(case["code"].encode()) <= 4096
    tree = ast.parse(case["code"])
    assert not any(isinstance(node,(ast.While,ast.Lambda,ast.GeneratorExp)) for node in ast.walk(tree))
    assert not {node.id for node in ast.walk(tree) if isinstance(node,ast.Name)} & {"eval","exec","open","compile","__import__"}
    assert not {node.attr for node in ast.walk(tree) if isinstance(node,ast.Attribute)} & {"read_csv","read_sql","to_csv","query","eval","apply","system","save","dump"}


@pytest.mark.parametrize("arguments",[(1,0,True),(1,0,"import os"),(0,0,1),(6,0,1),(1,4,1),(1,-1,1),(1,0,99999)])
def test_unsupported_or_unsafe_author_configuration_rejects(arguments):
    with pytest.raises(ValueError):
        authored_case(*arguments)


def test_lifecycle_transform_and_analytic_metric_anchors():
    before = authored_case(1,0,3)["expected"]
    assert before["before_fit"] == {"tag":"error","class":"NotFittedError"}
    assert before["training_mean"] == [[200]] and before["new_predictions"] == [200,200]
    assert not before["test_target_fit_allowed"]
    assert authored_case(1,1,3)["expected"]["predictions"] == [200,200]
    transformed = authored_case(1,2,3)["expected"]
    assert transformed["saved_training_mean"] == transformed["after_transform_mean"] == [2]
    assert transformed["transformed_features"][0] == [3]
    metric = authored_case(2,1,3)["expected"]
    assert (metric["mae"],metric["mse"],metric["rmse"]) == (20,400,20)
    assert metric["units"] == {"mae":"$k","mse":"($k)^2","rmse":"$k"}
    assert metric["accuracy"] == .9 and metric["positive_cases"] == 1 and metric["positive_detected"] == 0
    scores = authored_case(3,1,3)["expected"]
    assert scores["fold_mae"] == [10,20,30] and scores["mean_mae"] == 20


def test_fold_provenance_group_time_and_complete_selection_boundary():
    for amount in (1,2,3,4,5,7):
        full = authored_case(5,2,amount)["expected"]
        assert len(full["predictions"]) == 4 and np.isfinite(full["predictions"]).all()
        assert set(full["test_ids"]) == set(HOUSES["id"][12:])
        assert full["refit_ids"] == HOUSES["id"][:12] and not full["test_may_select"]
        assert full["columns"] == ["numeric__area","numeric__age","category__neighborhood_A","category__neighborhood_B"]
        for fold in full["folds"]:
            assert not set(fold["fit_ids"]) & set(fold["validation_ids"])
            assert not set(fold["fit_ids"]) & set(full["test_ids"])
            positions = [HOUSES["id"].index(identity) for identity in fold["fit_ids"]]
            raw = pd.DataFrame(HOUSES).iloc[positions]
            np.testing.assert_allclose(fold["imputer"],[raw["area"].median(),raw["age"].median()])
            assert fold["categories"] == [["A","B"]]
        means = full["mean_cv_mae"]
        expected = "dummy" if abs(means["linear"]-means["dummy"]) <= 1e-9+1e-9*abs(means["dummy"]) or means["dummy"] < means["linear"] else "linear"
        assert full["selected_before_test"] == expected
        split = authored_case(3,0,amount)["expected"]
        for fold in split["folds"]:
            assert not set(fold["fit_ids"]) & set(fold["validation_ids"])
            if split["scenario"] == "group":
                assert not set(fold["fit_groups"]) & set(fold["validation_groups"])
            if split["scenario"] == "time":
                assert max(fold["fit_ids"]) < min(fold["validation_ids"])


def test_validation_mutations_do_not_change_training_state_even_when_bad_predictions_match():
    training = np.array([[1.],[2.],[3.],[4.]])
    target = np.array([100.,200.,300.,400.])
    fitted = make_pipeline(StandardScaler(),LinearRegression()).fit(training,target)
    saved = fitted.named_steps["standardscaler"].mean_.copy()
    for new in [np.array([[5.],[6.]]),np.array([[10000.],[20000.]])]:
        fitted.predict(new)
        np.testing.assert_array_equal(fitted.named_steps["standardscaler"].mean_,saved)
    held_out = np.array([[5.],[6.]])
    leaked_scaler = StandardScaler().fit(np.vstack([training,held_out]))
    invalid_model = LinearRegression().fit(leaked_scaler.transform(training),target)
    np.testing.assert_allclose(fitted.predict(held_out),invalid_model.predict(leaked_scaler.transform(held_out)))
    assert not np.array_equal(saved,leaked_scaler.mean_)
    with pytest.raises(NotFittedError):
        DummyRegressor(strategy="mean").predict(held_out)


def test_explicit_global_prefit_and_predeclared_tie_counterexamples():
    extra = experiment_cases()
    assert extra[0]["expected"]["scenario"] == "group" and extra[1]["expected"]["scenario"] == "time"
    invalid = extra[2]["expected"]["invalid_prefit"]
    assert invalid["fit_ids"] == HOUSES["id"][:12] and not invalid["valid_for_fold_cv"]
    assert extra[3]["expected"]["within_tolerance"] and extra[3]["expected"]["selected"] == "dummy"
    assert authored_case(5,1,4)["expected"]["winner"] == "dummy"
    assert authored_case(5,1,5)["expected"]["winner"] == "linear"
    assert authored_case(5,1,7)["expected"]["winner"] == "dummy"


def test_progressive_numeric_and_categorical_branch_examples_before_composition():
    numeric = make_pipeline(SimpleImputer(strategy="median"),StandardScaler()).fit_transform([[10.],[np.nan],[30.]])
    category = make_pipeline(SimpleImputer(strategy="most_frequent"),OneHotEncoder(categories=[["A","B"]],handle_unknown="ignore",sparse_output=False)).fit_transform(np.array([["A"],["B"],[np.nan]],dtype=object))
    np.testing.assert_allclose(numeric[:,0],[-np.sqrt(3/2),0,np.sqrt(3/2)])
    np.testing.assert_array_equal(category,[[1,0],[0,1],[1,0]])
    assert np.hstack([numeric,category]).shape == (3,3)

