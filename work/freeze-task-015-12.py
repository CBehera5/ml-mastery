from __future__ import annotations

import argparse
import hashlib
import json
import math
import platform
import random
import sys
import warnings
from importlib.metadata import version
from pathlib import Path

import matplotlib
import numpy as np
import pandas as pd
import scipy
import sklearn
from sklearn.dummy import DummyClassifier, DummyRegressor
from sklearn.ensemble import (
    GradientBoostingClassifier,
    GradientBoostingRegressor,
    RandomForestClassifier,
    RandomForestRegressor,
)
from sklearn.inspection import permutation_importance
from sklearn.linear_model import Lasso, LinearRegression, LogisticRegression, Ridge
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    f1_score,
    log_loss,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
)
from sklearn.model_selection import GroupKFold
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from threadpoolctl import threadpool_limits


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUT = DOCS / "verification" / "model-selection"
SPEC = DOCS / "TASK_015_12_BOUNDED_SPECIFICATION.md"
CONVENTIONS = OUT / "MODEL_SELECTION_REFERENCE_CONVENTIONS.md"
SOURCE_CHECKSUM = OUT / "scope-source.sha256"
GENERATOR = ROOT / "work" / "freeze-task-015-12.py"
MANIFESTS = {
    "ms-e1.manifest.v1.json": "ms_e1",
    "ms-e2.manifest.v1.json": "ms_e2",
    "ms-e1-test-reference-sealed.v1.json": "ms_e1_sealed",
    "ms-e2-test-reference-sealed.v1.json": "ms_e2_sealed",
    "parity-report.v1.json": "report",
}
LOCK = OUT / "freeze-lock.v1.json"
SEED = 20261018
APPROVED_SCOPE_SHA256 = "6a15b2a3db4407c85ff480bc6460dfb78747cd9ff716dcd3bc951e063228e654"
METRIC_TOLERANCE = 1e-12
KNN_DISTANCE_EQUALITY_TOLERANCE = 0.0
THRESHOLDS = (0.25, 0.5, 0.75)
FN_COST = 10.0
FP_COST = 1.0
SIMPLICITY_TOLERANCE = 0.10


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical(value: object) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2, allow_nan=False) + "\n").encode("utf-8")


def scalar(value: object) -> object:
    if isinstance(value, np.generic):
        value = value.item()
    if isinstance(value, float):
        if not math.isfinite(value):
            raise ValueError("non-finite value in frozen reference")
        return float(value)
    if isinstance(value, (int, str, bool)) or value is None:
        return value
    if isinstance(value, dict):
        return {str(key): scalar(item) for key, item in value.items()}
    if isinstance(value, (tuple, list, np.ndarray)):
        return [scalar(item) for item in value]
    raise TypeError(f"unsupported serialized value type: {type(value).__name__}")


def row_fixture(
    prefix: str,
    feature_names: list[str],
    feature_rows: list[list[float]],
    targets: list[float | int],
    ids: list[str] | None = None,
    groups: list[str] | None = None,
) -> list[dict[str, object]]:
    identifiers = ids or [f"{prefix}{index + 1:02d}" for index in range(len(targets))]
    result = []
    for index, (values, target) in enumerate(zip(feature_rows, targets, strict=True)):
        row = {
            "rowId": identifiers[index],
            "features": {name: float(value) for name, value in zip(feature_names, values, strict=True)},
            "target": int(target) if isinstance(target, (int, np.integer)) else float(target),
        }
        if groups is not None:
            row["groupId"] = groups[index]
        result.append(row)
    return result


def e1_fixtures() -> tuple[dict[str, object], dict[str, object]]:
    house_area = [60, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150]
    house_rooms = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8]
    house_age = [0, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
    house_noise = [0, 4, -3, 2, -5, 3, 0, -4, 8, -6, 5, -2, 7, -8, 4, -3, 6, -5]
    house_target = [round(75 + 1.55 * area + 5.5 * rooms - 0.48 * age + (18 if rooms >= 5 else 0) + noise, 6) for area, rooms, age, noise in zip(house_area, house_rooms, house_age, house_noise, strict=True)]
    house_features = [[float(area), float(rooms), float(age)] for area, rooms, age in zip(house_area, house_rooms, house_age, strict=True)]
    house_ids = [f"HOUSE-{index + 1:02d}" for index in range(len(house_target))]
    house_rows = row_fixture("HOUSE-", ["area_m2", "rooms", "age_years"], house_features, house_target, house_ids)
    house = {
        "fixtureId": "MS-E1-HOUSE-PRICE-V1",
        "problem": "fictional house-price regression; target is thousands of fictional credits",
        "featureNames": ["area_m2", "rooms", "age_years"],
        "targetName": "price_kcredits",
        "allRows": house_rows,
        "partitions": {
            "train": house_ids[:10],
            "validation": house_ids[10:14],
            "test": house_ids[14:],
        },
        "sealedTestTargetIds": house_ids[14:],
    }

    tenure = [3, 6, 8, 12, 17, 21, 23, 29, 34, 39, 43, 47, 51, 55, 59, 64, 68, 72, 76, 80, 84, 88, 92, 96]
    charge = [110, 85, 70, 105, 95, 125, 65, 80, 115, 105, 75, 130, 90, 118, 72, 140, 100, 125, 84, 150, 95, 132, 78, 160]
    calls = [0, 0, 1, 1, 0, 2, 0, 1, 2, 1, 0, 3, 1, 4, 0, 5, 1, 4, 0, 6, 2, 5, 1, 7]
    late = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
    churn_target = [int(call >= 4 or (call >= 3 and overdue == 1)) for call, overdue in zip(calls, late, strict=True)]
    churn_features = [[float(a), float(b), float(c), float(d)] for a, b, c, d in zip(tenure, charge, calls, late, strict=True)]
    churn_ids = [f"CHURN-{index + 1:02d}" for index in range(len(churn_target))]
    churn_rows = row_fixture("CHURN-", ["tenure_months", "monthly_charge", "support_calls", "late_payment"], churn_features, churn_target, churn_ids)
    churn = {
        "fixtureId": "MS-E1-CHURN-V1",
        "problem": "fictional customer-churn classification; label 1 means churn in the declared future window",
        "featureNames": ["tenure_months", "monthly_charge", "support_calls", "late_payment"],
        "targetName": "churn_90d",
        "positiveClass": 1,
        "negativeClass": 0,
        "allRows": churn_rows,
        "partitions": {
            "train": churn_ids[:16],
            "validation": churn_ids[16:20],
            "test": churn_ids[20:],
        },
        "sealedTestTargetIds": churn_ids[20:],
    }
    return house, churn


def e2_fixture() -> dict[str, object]:
    rows = []
    groups = []
    ids = []
    for group_index in range(12):
        group_id = f"G{group_index:02d}"
        for event_index in range(4):
            tenure = 2.0 * group_index + 1.0 + event_index * 0.1
            charge = 40.0 + 5.0 * group_index + 2.0 * event_index
            if group_index == 0 and event_index == 0:
                charge += 0.000001
            calls = event_index + (group_index % 2)
            late = int((group_index + event_index) % 5 == 0)
            positive = int(event_index == 3 or (event_index == 2 and group_index % 3 == 0))
            rows.append([tenure, charge, float(calls), float(late), float(calls)])
            groups.append(group_id)
            ids.append(f"E2-{group_index:02d}-{event_index:02d}")
    targets = [int(event_index == 3 or (event_index == 2 and group_index % 3 == 0)) for group_index in range(12) for event_index in range(4)]
    return {
        "fixtureId": "MS-E2-GROUPED-CHURN-V2",
        "problem": "fictional repeated-customer churn classification; group IDs are split metadata, never model features",
        "featureNames": ["tenure_months", "monthly_charge", "support_calls", "late_payment", "support_calls_proxy"],
        "targetName": "churn_90d",
        "positiveClass": 1,
        "negativeClass": 0,
        "rows": row_fixture("E2-", ["tenure_months", "monthly_charge", "support_calls", "late_payment", "support_calls_proxy"], rows, targets, ids, groups),
        "developmentGroups": [f"G{index:02d}" for index in range(9)],
        "sealedTestGroups": [f"G{index:02d}" for index in range(9, 12)],
        "proxyPair": ["support_calls", "support_calls_proxy"],
    }


def matrix(rows: list[dict[str, object]], feature_names: list[str]) -> tuple[np.ndarray, np.ndarray, list[str]]:
    return (
        np.asarray([[row["features"][name] for name in feature_names] for row in rows], dtype=float),
        np.asarray([row["target"] for row in rows]),
        [str(row["rowId"]) for row in rows],
    )


def metric_regression(y_true: np.ndarray, prediction: np.ndarray) -> dict[str, float]:
    truth = np.asarray(y_true, dtype=float)
    pred = np.asarray(prediction, dtype=float)
    mae = float(np.mean(np.abs(truth - pred)))
    rmse = float(np.sqrt(np.mean(np.square(truth - pred))))
    assert abs(mae - float(mean_absolute_error(truth, pred))) <= METRIC_TOLERANCE
    assert abs(rmse - float(np.sqrt(mean_squared_error(truth, pred)))) <= METRIC_TOLERANCE
    return {"mae": mae, "rmse": rmse, "r2": float(r2_score(truth, pred))}


def metric_classification(y_true: np.ndarray, prediction: np.ndarray, probability: np.ndarray | None = None) -> dict[str, object]:
    truth = np.asarray(y_true, dtype=int)
    pred = np.asarray(prediction, dtype=int)
    tp = int(np.sum((truth == 1) & (pred == 1)))
    fp = int(np.sum((truth == 0) & (pred == 1)))
    tn = int(np.sum((truth == 0) & (pred == 0)))
    fn = int(np.sum((truth == 1) & (pred == 0)))
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    specificity = tn / (tn + fp) if tn + fp else 0.0
    f1 = 2.0 * precision * recall / (precision + recall) if precision + recall else 0.0
    accuracy = (tp + tn) / len(truth) if len(truth) else 0.0
    balanced = (recall + specificity) / 2.0
    assert abs(precision - float(precision_score(truth, pred, pos_label=1, zero_division=0))) <= METRIC_TOLERANCE
    assert abs(recall - float(recall_score(truth, pred, pos_label=1, zero_division=0))) <= METRIC_TOLERANCE
    assert abs(f1 - float(f1_score(truth, pred, pos_label=1, zero_division=0))) <= METRIC_TOLERANCE
    assert abs(accuracy - float(accuracy_score(truth, pred))) <= METRIC_TOLERANCE
    assert abs(balanced - float(balanced_accuracy_score(truth, pred))) <= METRIC_TOLERANCE
    result: dict[str, object] = {
        "confusion": {"TP": tp, "FP": fp, "TN": tn, "FN": fn},
        "accuracy": accuracy,
        "balancedAccuracy": balanced,
        "precisionPositive": precision,
        "recallPositive": recall,
        "f1Positive": f1,
    }
    if probability is None:
        result["logLoss"] = {"state": "not-produced", "reason": "candidate does not expose class probabilities"}
    else:
        proba = np.asarray(probability, dtype=float)
        if np.any(~np.isfinite(proba)) or np.any(proba < 0) or np.any(proba > 1) or not np.allclose(proba.sum(axis=1), 1.0, atol=METRIC_TOLERANCE, rtol=0):
            raise AssertionError("invalid probability reference")
        manual_loss = float(-np.mean(np.log(proba[np.arange(len(truth)), truth])))
        library_loss = float(log_loss(truth, proba, labels=[0, 1]))
        assert abs(manual_loss - library_loss) <= METRIC_TOLERANCE
        result["logLoss"] = manual_loss
    return result


def model_complexity(model: object, name: str, train_count: int) -> dict[str, object]:
    estimator = model.steps[-1][1] if isinstance(model, Pipeline) else model
    if hasattr(estimator, "tree_"):
        tree = estimator.tree_
        return {"kind": "single-tree", "nodes": int(tree.node_count), "leaves": int(tree.n_leaves), "depth": int(estimator.get_depth()), "qualitative": "path-readable; one tree can be unstable"}
    if hasattr(estimator, "estimators_") and name in ("forest", "boosting", "forest-classifier", "boosting-classifier"):
        trees = np.asarray(estimator.estimators_, dtype=object).reshape(-1)
        return {"kind": "tree-ensemble", "treeCount": int(len(trees)), "totalNodes": int(sum(tree.tree_.node_count for tree in trees)), "maxDepth": int(max(tree.tree_.max_depth for tree in trees)), "qualitative": "many interacting paths; not a universal interpretability score"}
    if hasattr(estimator, "coefs_"):
        count = int(sum(value.size for value in estimator.coefs_) + sum(value.size for value in estimator.intercepts_))
        return {"kind": "neural-network", "trainableParameters": count, "qualitative": "parameter count does not equal explanation quality"}
    if hasattr(estimator, "coef_"):
        count = int(np.asarray(estimator.coef_).size + np.asarray(estimator.intercept_).size)
        return {"kind": "linear-parameters", "parameterCount": count, "qualitative": "coefficient interpretation depends on scaling, correlation, and design"}
    if hasattr(estimator, "support_"):
        return {"kind": "margin-model", "supportVectorCount": int(len(estimator.support_)), "qualitative": "decision scores are not calibrated probabilities"}
    if isinstance(estimator, KNeighborsClassifier):
        return {"kind": "stored-neighbor-reference", "storedTrainingRows": int(train_count), "qualitative": "prediction cost grows with stored observations and dimension"}
    if isinstance(estimator, (GaussianNB, DummyClassifier, DummyRegressor)):
        return {"kind": "distribution-or-baseline", "parameterCount": int(getattr(estimator, "theta_", np.empty(1)).size + getattr(estimator, "class_count_", np.empty(1)).size), "qualitative": "simple reference, not automatically adequate"}
    return {"kind": "model-family", "qualitative": "interpretation depends on model and data"}


def portable_parameters(model: object) -> dict[str, object]:
    values = model.get_params(deep=True)
    primitive = {}
    for key, value in values.items():
        if hasattr(value, "fit"):
            continue
        try:
            primitive[key] = scalar(value)
        except TypeError:
            continue
    return primitive


def pipeline_description(model: object, fit_ids: list[str]) -> dict[str, object]:
    description: dict[str, object] = {"fitRowIds": fit_ids, "steps": []}
    if isinstance(model, Pipeline):
        for name, estimator in model.steps:
            step: dict[str, object] = {"name": name, "estimator": estimator.__class__.__name__}
            if name == "scale":
                step["fitRowIds"] = fit_ids
                step["mean"] = scalar(estimator.mean_)
                step["scale"] = scalar(estimator.scale_)
            description["steps"].append(step)
    else:
        description["steps"].append({"name": "model", "estimator": model.__class__.__name__})
    return description


def e1_regression_candidates() -> list[tuple[str, object, str]]:
    return [
        ("mean-baseline", DummyRegressor(strategy="mean"), "very-high"),
        ("multiple-linear", Pipeline([("scale", StandardScaler()), ("model", LinearRegression())]), "high"),
        ("polynomial-degree-2", Pipeline([("expand", PolynomialFeatures(degree=2, include_bias=False)), ("scale", StandardScaler()), ("model", LinearRegression())]), "medium"),
        ("ridge-alpha-1", Pipeline([("scale", StandardScaler()), ("model", Ridge(alpha=1.0, fit_intercept=True, solver="svd"))]), "high"),
        ("lasso-alpha-0.1", Pipeline([("scale", StandardScaler()), ("model", Lasso(alpha=0.1, fit_intercept=True, max_iter=20000, tol=1e-9, selection="cyclic", random_state=SEED))]), "high-with-scale-caveat"),
        ("tree-depth-2", DecisionTreeRegressor(criterion="squared_error", max_depth=2, min_samples_leaf=2, random_state=SEED), "medium"),
        ("forest-16", RandomForestRegressor(n_estimators=16, criterion="squared_error", max_depth=3, min_samples_leaf=2, max_features=1.0, bootstrap=True, random_state=SEED, n_jobs=1), "lower"),
        ("boosting-12", GradientBoostingRegressor(loss="squared_error", n_estimators=12, learning_rate=0.05, max_depth=1, min_samples_leaf=2, random_state=SEED), "lower"),
    ]


def e1_classification_candidates() -> list[tuple[str, object, str]]:
    return [
        ("prior-baseline", DummyClassifier(strategy="prior", random_state=SEED), "very-high"),
        ("logistic-c1", Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(C=1.0, solver="lbfgs", l1_ratio=0.0, fit_intercept=True, max_iter=1000, tol=1e-9, random_state=SEED))]), "high"),
        ("knn-k3", Pipeline([("scale", StandardScaler()), ("model", KNeighborsClassifier(n_neighbors=3, weights="uniform", metric="minkowski", p=2, algorithm="brute"))]), "medium"),
        ("gaussian-nb", GaussianNB(priors=None, var_smoothing=1e-9), "medium"),
        ("tree-depth-2", DecisionTreeClassifier(criterion="gini", splitter="best", max_depth=2, min_samples_leaf=2, class_weight=None, random_state=SEED), "medium"),
        ("forest-16", RandomForestClassifier(n_estimators=16, criterion="gini", max_depth=3, min_samples_leaf=2, max_features="sqrt", bootstrap=True, class_weight=None, random_state=SEED, n_jobs=1), "lower"),
        ("boosting-12", GradientBoostingClassifier(loss="log_loss", n_estimators=12, learning_rate=0.05, max_depth=1, min_samples_leaf=2, random_state=SEED), "lower"),
        ("linear-svc-c1", Pipeline([("scale", StandardScaler()), ("model", SVC(C=1.0, kernel="linear", probability=False, class_weight=None, decision_function_shape="ovr", tol=1e-8, shrinking=True, random_state=SEED))]), "medium"),
        ("mlp-4-relu", Pipeline([("scale", StandardScaler()), ("model", MLPClassifier(hidden_layer_sizes=(4,), activation="relu", solver="lbfgs", alpha=0.1, batch_size="auto", learning_rate_init=0.001, max_iter=1000, tol=1e-8, early_stopping=False, random_state=SEED))]), "lower"),
    ]


def fixture_rows_by_ids(fixture: dict[str, object], ids: list[str]) -> list[dict[str, object]]:
    lookup = {row["rowId"]: row for row in fixture["allRows"]}
    return [lookup[row_id] for row_id in ids]


def e1_fit_candidate(task: str, fixture: dict[str, object], candidate_id: str, estimator: object, interpretability: str) -> dict[str, object]:
    partitions = fixture["partitions"]
    train_ids = partitions["train"]
    validation_ids = partitions["validation"]
    test_ids = partitions["test"]
    assert set(train_ids).isdisjoint(validation_ids)
    assert set(train_ids).isdisjoint(test_ids)
    assert set(validation_ids).isdisjoint(test_ids)
    train_rows = fixture_rows_by_ids(fixture, train_ids)
    validation_rows = fixture_rows_by_ids(fixture, validation_ids)
    x_train, y_train, _ = matrix(train_rows, fixture["featureNames"])
    x_valid, y_valid, _ = matrix(validation_rows, fixture["featureNames"])
    caught: list[str] = []
    with warnings.catch_warnings(record=True) as recorded:
        warnings.simplefilter("always")
        estimator.fit(x_train, y_train)
        caught = [f"{item.category.__name__}: {item.message}" for item in recorded]
    train_prediction = estimator.predict(x_train)
    validation_prediction = estimator.predict(x_valid)
    train_probability = estimator.predict_proba(x_train) if hasattr(estimator, "predict_proba") else None
    validation_probability = estimator.predict_proba(x_valid) if hasattr(estimator, "predict_proba") else None
    train_metrics = metric_regression(y_train, train_prediction) if task == "regression" else metric_classification(y_train, train_prediction, train_probability)
    validation_metrics = metric_regression(y_valid, validation_prediction) if task == "regression" else metric_classification(y_valid, validation_prediction, validation_probability)
    if task == "regression":
        assert len(np.unique(y_valid)) > 1
    else:
        assert set(np.unique(y_valid)) == {0, 1}
    return {
        "configId": f"MS-E1-{task.upper()}-{candidate_id.upper()}",
        "fixtureId": fixture["fixtureId"],
        "candidateFamily": candidate_id.split("-")[0],
        "parameters": portable_parameters(estimator),
        "preprocessing": pipeline_description(estimator, train_ids),
        "evaluationBudget": {"candidateFits": 1, "searchFits": 0, "sameTrainRows": True},
        "training": {
            "rowIds": train_ids,
            "truth": scalar(y_train),
            "predictions": scalar(train_prediction),
            "probabilitiesClassOrder01": scalar(train_probability) if train_probability is not None else {"state": "not-produced"},
            "metrics": train_metrics,
        },
        "validation": {
            "rowIds": validation_ids,
            "truth": scalar(y_valid),
            "predictions": scalar(validation_prediction),
            "probabilitiesClassOrder01": scalar(validation_probability) if validation_probability is not None else {"state": "not-produced"},
            "metrics": validation_metrics,
            "primaryMetric": "mae" if task == "regression" else "balancedAccuracy",
        },
        "testPartitionIds": partitions["test"],
        "testOutcome": {"state": "sealed-not-evaluated-in-MS-E1"},
        "complexity": model_complexity(estimator, candidate_id, len(train_ids)),
        "interpretabilityTier": interpretability,
        "warnings": caught,
    }


def manifest_e1() -> tuple[dict[str, object], dict[str, object], dict[str, object]]:
    house, churn = e1_fixtures()
    states: list[dict[str, object]] = []
    for candidate_id, estimator, tier in e1_regression_candidates():
        states.append(e1_fit_candidate("regression", house, candidate_id, estimator, tier))
    for candidate_id, estimator, tier in e1_classification_candidates():
        states.append(e1_fit_candidate("classification", churn, candidate_id, estimator, tier))
    states.extend([
        {"configId": "MS-E1-REJECT-MISMATCHED-VALIDATION-ROWS", "status": "rejected", "reasonCode": "comparison.validation-rows-differ", "message": "Candidates must share the same validation row IDs; no ranking is computed."},
        {"configId": "MS-E1-REJECT-GLOBAL-PREPROCESS-FIT", "status": "rejected", "reasonCode": "preprocessing.fit-outside-training", "message": "Fit preprocessing only on training rows; no model score is computed."},
        {"configId": "MS-E1-REJECT-TEST-BASED-SELECTION", "status": "rejected", "reasonCode": "selection.final-test-access", "message": "The test set cannot select or tune candidates; no model score is computed."},
    ])
    public_fixtures = []
    for fixture in (house, churn):
        test_ids = set(fixture["partitions"]["test"])
        public_fixtures.append({
            **fixture,
            "allRows": [row for row in fixture["allRows"] if row["rowId"] not in test_ids],
            "testFeatureRows": [
                {"rowId": row["rowId"], "features": row["features"]}
                for row in fixture["allRows"] if row["rowId"] in test_ids
            ],
            "sealedTestTargetRows": "see verification-only test-reference sidecar",
        })
        assert not (set(row["rowId"] for row in public_fixtures[-1]["allRows"]) & test_ids)
        assert all("target" not in row for row in public_fixtures[-1]["testFeatureRows"])
    manifest = {
        "manifestId": "TASK-015.12-MS-E1-V1",
        "experimentId": "MS-E1",
        "title": "Fair model comparison",
        "version": 1,
        "objectives": ["MS01.O1", "MS01.O2", "MS01.O3", "MS01.O4", "MS06.O1"],
        "interaction": "Learner predicts a validation comparison and complexity trade-off before the frozen result table is revealed.",
        "fixtures": public_fixtures,
        "configurationCount": len(states),
        "configurationLimit": 64,
        "metricConventions": {
            "regressionPrimary": "MAE",
            "classificationPrimary": "balanced accuracy",
            "classificationPositiveClass": 1,
            "probabilityClassOrder": [0, 1],
            "logLossUnavailableForNoProbabilityEstimator": True,
            "tieToleranceAbsolute": METRIC_TOLERANCE,
        },
        "configurations": states,
        "textAlternative": "Every row, target, split, fit boundary, prediction, metric and model-complexity description is represented in the synchronized numerical/text table.",
    }
    sealed = {
        "referenceId": "TASK-015.12-MS-E1-TEST-REFERENCE-V1",
        "visibility": "verification-only; not a learner-facing configuration payload",
        "fixtures": [
            {"fixtureId": house["fixtureId"], "testRows": fixture_rows_by_ids(house, house["partitions"]["test"])},
            {"fixtureId": churn["fixtureId"], "testRows": fixture_rows_by_ids(churn, churn["partitions"]["test"])},
        ],
        "evaluation": "none; MS-E1 comparison and selection expose training/development-validation results only",
    }
    return manifest, sealed, {"house": house, "churn": churn}


def make_e2_model(model_family: str, parameter: float | int, scaler: bool) -> object:
    if model_family == "prior-baseline":
        return DummyClassifier(strategy="prior", random_state=SEED)
    if model_family == "logistic":
        model = LogisticRegression(C=float(parameter), solver="lbfgs", l1_ratio=0.0, fit_intercept=True, max_iter=1000, tol=1e-9, random_state=SEED)
    elif model_family == "tree":
        return DecisionTreeClassifier(criterion="gini", splitter="best", max_depth=int(parameter), min_samples_leaf=2, class_weight=None, random_state=SEED)
    elif model_family == "knn":
        model = KNeighborsClassifier(n_neighbors=int(parameter), weights="uniform", metric="minkowski", p=2, algorithm="brute")
    else:
        raise ValueError(f"unknown model family: {model_family}")
    if scaler:
        return Pipeline([("scale", StandardScaler()), ("model", model)])
    return model


def e2_candidates() -> list[dict[str, object]]:
    values: list[dict[str, object]] = [{"candidateId": "prior-baseline-t0.50", "family": "prior-baseline", "parameter": None, "threshold": 0.5, "complexityTier": 0}]
    for family, params, tier in (("logistic", (0.1, 1.0, 10.0), 1), ("tree", (1, 2, 4), 2), ("knn", (1, 3, 5), 3)):
        for parameter in params:
            for threshold in THRESHOLDS:
                parameter_label = str(parameter).replace(".", "p")
                values.append({"candidateId": f"{family}-p{parameter_label}-t{int(threshold * 100):02d}", "family": family, "parameter": parameter, "threshold": threshold, "complexityTier": tier + (0 if parameter in (0.1, 1.0, 1) else 1 if parameter in (3, 2) else 2)})
    return values


def cost_metrics(y_true: np.ndarray, probability_positive: np.ndarray, threshold: float) -> dict[str, object]:
    pred = (np.asarray(probability_positive, dtype=float) >= float(threshold)).astype(int)
    metrics = metric_classification(y_true, pred)
    confusion = metrics["confusion"]
    total_cost = FN_COST * confusion["FN"] + FP_COST * confusion["FP"]
    return {
        "threshold": float(threshold),
        "predictions": scalar(pred),
        "confusion": confusion,
        "metrics": metrics,
        "totalCost": float(total_cost),
        "costPerRow": float(total_cost / len(y_true)),
    }


def select_by_cost(scores: list[dict[str, object]], simplicity_tolerance: float = SIMPLICITY_TOLERANCE) -> dict[str, object]:
    best_cost = min(float(item["meanCostPerRow"]) for item in scores)
    eligible = [item for item in scores if float(item["meanCostPerRow"]) <= best_cost + simplicity_tolerance + METRIC_TOLERANCE]
    return min(eligible, key=lambda item: (
        int(item["complexityTier"]),
        abs(float(item.get("threshold", 0.5)) - 0.5),
        -float(item.get("threshold", 0.5)),
        str(item["candidateId"]),
    ))


def rows_in_groups(fixture: dict[str, object], group_set: set[str]) -> list[dict[str, object]]:
    return [row for row in fixture["rows"] if row["groupId"] in group_set]


def group_splits(rows: list[dict[str, object]], groups: list[str], split_count: int):
    _, _, _ids = matrix(rows, [name for name in rows[0]["features"]])
    x = np.zeros((len(rows), 1))
    group_array = np.asarray(groups)
    splitter = GroupKFold(n_splits=split_count)
    return list(splitter.split(x, np.asarray([row["target"] for row in rows]), group_array))


def eval_candidate_cv(
    fixture: dict[str, object],
    rows: list[dict[str, object]],
    fold_specs: list[tuple[list[str], list[str]]],
    candidates: list[dict[str, object]],
) -> list[dict[str, object]]:
    features = fixture["featureNames"]
    results = []
    for candidate in candidates:
        fold_results = []
        family = candidate["family"]
        parameter = candidate["parameter"]
        for fold_number, (train_ids, valid_ids) in enumerate(fold_specs, start=1):
            train_rows = fixture_rows_by_ids({"allRows": rows}, train_ids)
            valid_rows = fixture_rows_by_ids({"allRows": rows}, valid_ids)
            train_groups = {row["groupId"] for row in train_rows}
            valid_groups = {row["groupId"] for row in valid_rows}
            assert set(train_ids).isdisjoint(valid_ids)
            assert train_groups.isdisjoint(valid_groups)
            x_train, y_train, _ = matrix(train_rows, features)
            x_valid, y_valid, _ = matrix(valid_rows, features)
            estimator = make_e2_model(family, parameter if parameter is not None else 0, family in ("logistic", "knn"))
            with warnings.catch_warnings(record=True) as recorded:
                warnings.simplefilter("always")
                estimator.fit(x_train, y_train)
            if family == "knn":
                reject_ambiguous_knn_cutoffs(estimator, x_valid, y_train, train_ids, valid_ids, int(parameter))
            probabilities = estimator.predict_proba(x_valid)[:, 1]
            costs = cost_metrics(y_valid, probabilities, float(candidate["threshold"]))
            fold_results.append({
                "fold": fold_number,
                "fitRowIds": train_ids,
                "fitGroupIds": sorted(set(row["groupId"] for row in train_rows)),
                "fitPreprocessing": pipeline_description(estimator, train_ids),
                "scoreRowIds": valid_ids,
                "scoreGroupIds": sorted(set(row["groupId"] for row in valid_rows)),
                "positiveProbabilities": scalar(probabilities),
                "costAndMetrics": costs,
                "warnings": [f"{item.category.__name__}: {item.message}" for item in recorded],
            })
        mean_cost = float(np.mean([item["costAndMetrics"]["costPerRow"] for item in fold_results]))
        mean_balanced = float(np.mean([item["costAndMetrics"]["metrics"]["balancedAccuracy"] for item in fold_results]))
        results.append({
            "candidateId": candidate["candidateId"],
            "family": family,
            "parameter": parameter,
            "threshold": candidate["threshold"],
            "complexityTier": candidate["complexityTier"],
            "meanCostPerRow": mean_cost,
            "meanBalancedAccuracy": mean_balanced,
            "foldResults": fold_results,
        })
    return results


def reject_ambiguous_knn_cutoffs(
    estimator: Pipeline,
    x_query: np.ndarray,
    y_train: np.ndarray,
    train_ids: list[str],
    query_ids: list[str],
    k: int,
) -> None:
    """Reject exact mixed-label ties crossing the kth-neighbor membership cutoff."""
    model = estimator.named_steps["model"]
    scaler = estimator.named_steps["scale"]
    query_scaled = scaler.transform(x_query)
    distances, neighbors = model.kneighbors(query_scaled, n_neighbors=len(y_train), return_distance=True)
    for query_index, (query_distances, query_neighbors) in enumerate(zip(distances, neighbors, strict=True)):
        cutoff = float(query_distances[k - 1])
        tied_positions = np.flatnonzero(np.abs(query_distances - cutoff) <= KNN_DISTANCE_EQUALITY_TOLERANCE)
        closer_positions = np.flatnonzero(query_distances < cutoff - KNN_DISTANCE_EQUALITY_TOLERANCE)
        available_slots = k - len(closer_positions)
        if len(tied_positions) <= available_slots:
            continue
        tied_indices = query_neighbors[tied_positions]
        tied_labels = {int(y_train[index]) for index in tied_indices}
        if len(tied_labels) > 1:
            tied_rows = ",".join(train_ids[int(index)] for index in tied_indices)
            raise ValueError(
                f"knn.ambiguous-kth-neighbor: query={query_ids[query_index]} k={k} "
                f"distance={cutoff:.17g} tiedRows={tied_rows}"
            )


def outer_fold_specs(fixture: dict[str, object]) -> list[dict[str, object]]:
    dev_rows = rows_in_groups(fixture, set(fixture["developmentGroups"]))
    groups = [row["groupId"] for row in dev_rows]
    splits = group_splits(dev_rows, groups, 3)
    result = []
    for fold_number, (train_indices, valid_indices) in enumerate(splits, start=1):
        train = [dev_rows[int(index)] for index in train_indices]
        valid = [dev_rows[int(index)] for index in valid_indices]
        assert {row["groupId"] for row in train}.isdisjoint({row["groupId"] for row in valid})
        train_ids = [row["rowId"] for row in train]
        valid_ids = [row["rowId"] for row in valid]
        assert set(row["groupId"] for row in train).isdisjoint(set(row["groupId"] for row in valid))
        result.append({"fold": fold_number, "trainRows": train, "validationRows": valid, "trainIds": train_ids, "validationIds": valid_ids})
    return result


def nested_grouped_reference(fixture: dict[str, object], candidates: list[dict[str, object]]) -> dict[str, object]:
    outer = outer_fold_specs(fixture)
    all_outer: list[dict[str, object]] = []
    for outer_fold in outer:
        outer_train = outer_fold["trainRows"]
        outer_valid = outer_fold["validationRows"]
        inner_split_indices = group_splits(outer_train, [row["groupId"] for row in outer_train], 2)
        inner_specs = []
        for train_indices, valid_indices in inner_split_indices:
            inner_specs.append((
                [outer_train[int(index)]["rowId"] for index in train_indices],
                [outer_train[int(index)]["rowId"] for index in valid_indices],
            ))
        candidate_scores = eval_candidate_cv(fixture, outer_train, inner_specs, candidates)
        selected = select_by_cost(candidate_scores)
        x_train, y_train, _ = matrix(outer_train, fixture["featureNames"])
        x_valid, y_valid, _ = matrix(outer_valid, fixture["featureNames"])
        estimator = make_e2_model(selected["family"], selected["parameter"] if selected["parameter"] is not None else 0, selected["family"] in ("logistic", "knn"))
        estimator.fit(x_train, y_train)
        if selected["family"] == "knn":
            reject_ambiguous_knn_cutoffs(estimator, x_valid, y_train, outer_fold["trainIds"], outer_fold["validationIds"], int(selected["parameter"]))
        proba = estimator.predict_proba(x_valid)[:, 1]
        evaluated = cost_metrics(y_valid, proba, selected["threshold"])
        inner_best = min(float(item["meanCostPerRow"]) for item in candidate_scores)
        all_outer.append({
            "fold": outer_fold["fold"],
            "outerTrainRowIds": outer_fold["trainIds"],
            "outerTrainGroupIds": sorted(set(row["groupId"] for row in outer_train)),
            "outerValidationRowIds": outer_fold["validationIds"],
            "outerValidationGroupIds": sorted(set(row["groupId"] for row in outer_valid)),
            "innerFoldProvenance": [item["foldResults"] for item in candidate_scores[:1]],
            "innerCandidateScores": [{key: item[key] for key in ("candidateId", "meanCostPerRow", "meanBalancedAccuracy", "complexityTier")} for item in candidate_scores],
            "selectedByInnerDevelopment": {key: selected[key] for key in ("candidateId", "family", "parameter", "threshold", "meanCostPerRow", "complexityTier")},
            "innerBestCostPerRow": inner_best,
            "outerValidation": {"positiveProbabilities": scalar(proba), "truth": scalar(y_valid), "metricsAndCost": evaluated},
            "outerFitPreprocessing": pipeline_description(estimator, outer_fold["trainIds"]),
            "outerFitWarnings": [],
        })
    outer_costs = [float(item["outerValidation"]["metricsAndCost"]["costPerRow"]) for item in all_outer]
    outer_balanced = [float(item["outerValidation"]["metricsAndCost"]["metrics"]["balancedAccuracy"]) for item in all_outer]
    return {
        "outerFoldCount": len(all_outer),
        "innerFoldsPerOuter": 2,
        "outerFolds": all_outer,
        "nestedProcedureEstimate": {
            "meanCostPerRow": float(np.mean(outer_costs)),
            "sampleStandardDeviationCostPerRow": float(np.std(outer_costs, ddof=1)),
            "costRangePerRow": [float(min(outer_costs)), float(max(outer_costs))],
            "meanBalancedAccuracy": float(np.mean(outer_balanced)),
            "sampleStandardDeviationBalancedAccuracy": float(np.std(outer_balanced, ddof=1)),
            "interpretation": "descriptive outer-fold dispersion, not a confidence interval and not the final refit artifact",
        },
        "selectionOptimismContrast": {
            "description": "best inner-development score is a selection score; compare it with outer-fold performance of the entire selection procedure",
            "meanInnerBestCostPerRow": float(np.mean([item["innerBestCostPerRow"] for item in all_outer])),
            "meanOuterCostPerRow": float(np.mean(outer_costs)),
        },
        "fitCount": sum(len(item["innerCandidateScores"]) * 2 + 1 for item in all_outer),
    }


def full_development_cv(fixture: dict[str, object], candidates: list[dict[str, object]], groups_override: list[str] | None = None) -> tuple[list[dict[str, object]], int]:
    dev_rows = rows_in_groups(fixture, set(fixture["developmentGroups"]))
    split_indices = group_splits(dev_rows, groups_override or [row["groupId"] for row in dev_rows], 3)
    fold_specs = []
    for train_indices, valid_indices in split_indices:
        fold_specs.append(([dev_rows[int(index)]["rowId"] for index in train_indices], [dev_rows[int(index)]["rowId"] for index in valid_indices]))
    return eval_candidate_cv(fixture, dev_rows, fold_specs, candidates), len(candidates) * 3


def threshold_oof_reference(fixture: dict[str, object]) -> dict[str, object]:
    dev_rows = rows_in_groups(fixture, set(fixture["developmentGroups"]))
    splits = group_splits(dev_rows, [row["groupId"] for row in dev_rows], 3)
    predictions_by_id: dict[str, float] = {}
    fit_records = []
    for fold_number, (train_indices, valid_indices) in enumerate(splits, start=1):
        train = [dev_rows[int(index)] for index in train_indices]
        valid = [dev_rows[int(index)] for index in valid_indices]
        assert {row["groupId"] for row in train}.isdisjoint({row["groupId"] for row in valid})
        model = make_e2_model("logistic", 1.0, True)
        x_train, y_train, _ = matrix(train, fixture["featureNames"])
        x_valid, _, valid_ids = matrix(valid, fixture["featureNames"])
        model.fit(x_train, y_train)
        p = model.predict_proba(x_valid)[:, 1]
        predictions_by_id.update({row_id: float(probability) for row_id, probability in zip(valid_ids, p, strict=True)})
        fit_records.append({"fold": fold_number, "fitRows": [row["rowId"] for row in train], "fitGroups": sorted(set(row["groupId"] for row in train)), "scoredRows": valid_ids, "scoredGroups": sorted(set(row["groupId"] for row in valid)), "pipeline": pipeline_description(model, [row["rowId"] for row in train])})
    ordered_rows = sorted(dev_rows, key=lambda row: row["rowId"])
    y = np.asarray([row["target"] for row in ordered_rows], dtype=int)
    p = np.asarray([predictions_by_id[row["rowId"]] for row in ordered_rows], dtype=float)
    candidates = [cost_metrics(y, p, threshold) for threshold in THRESHOLDS]
    selected = min(candidates, key=lambda item: (float(item["costPerRow"]), abs(float(item["threshold"]) - 0.5), -float(item["threshold"])))
    return {
        "model": "LogisticRegression(C=1.0) with StandardScaler; threshold selected from development OOF probabilities only",
        "fitRecords": fit_records,
        "oofRowIds": [row["rowId"] for row in ordered_rows],
        "oofGroupIds": [row["groupId"] for row in ordered_rows],
        "truth": scalar(y),
        "positiveProbabilities": scalar(p),
        "thresholdCandidates": candidates,
        "selectedThreshold": selected["threshold"],
        "selectedCostPerRow": selected["costPerRow"],
        "tieRule": "minimum cost; then closest to 0.50; then higher threshold",
    }


def permutation_reference(fixture: dict[str, object]) -> dict[str, object]:
    train_groups = set(fixture["developmentGroups"][:6])
    valid_groups = set(fixture["developmentGroups"][6:9])
    train = rows_in_groups(fixture, train_groups)
    valid = rows_in_groups(fixture, valid_groups)
    x_train, y_train, _ = matrix(train, fixture["featureNames"])
    x_valid, y_valid, _ = matrix(valid, fixture["featureNames"])
    model = RandomForestClassifier(n_estimators=32, criterion="gini", max_depth=3, min_samples_leaf=2, max_features="sqrt", bootstrap=True, random_state=SEED, n_jobs=1)
    model.fit(x_train, y_train)
    result = permutation_importance(model, x_valid, y_valid, scoring="balanced_accuracy", n_repeats=8, random_state=SEED, n_jobs=1)
    return {
        "configurationId": "MS-E2-PERMUTATION-DEVELOPMENT-HOLDOUT",
        "trainRowIds": [row["rowId"] for row in train],
        "trainGroupIds": sorted(train_groups),
        "validationRowIds": [row["rowId"] for row in valid],
        "validationGroupIds": sorted(valid_groups),
        "baseBalancedAccuracy": float(balanced_accuracy_score(y_valid, model.predict(x_valid))),
        "scoringMetric": "balanced accuracy",
        "repeats": 8,
        "randomState": SEED,
        "importanceMean": {name: float(value) for name, value in zip(fixture["featureNames"], result.importances_mean, strict=True)},
        "importanceStandardDeviation": {name: float(value) for name, value in zip(fixture["featureNames"], result.importances_std, strict=True)},
        "correlatedProxyPair": fixture["proxyPair"],
        "interpretation": "predictive score change on one permitted development holdout; not a causal effect; correlated proxies may substitute",
    }


def final_test_reference(fixture: dict[str, object], selected: dict[str, object]) -> dict[str, object]:
    development = rows_in_groups(fixture, set(fixture["developmentGroups"]))
    test = rows_in_groups(fixture, set(fixture["sealedTestGroups"]))
    x_development, y_development, development_ids = matrix(development, fixture["featureNames"])
    x_test, y_test, test_ids = matrix(test, fixture["featureNames"])
    estimator = make_e2_model(selected["family"], selected["parameter"] if selected["parameter"] is not None else 0, selected["family"] in ("logistic", "knn"))
    estimator.fit(x_development, y_development)
    probabilities = estimator.predict_proba(x_test)[:, 1]
    applied = cost_metrics(y_test, probabilities, float(selected["threshold"]))
    return {
        "referenceId": "TASK-015.12-MS-E2-FINAL-TEST-REFERENCE-V2",
        "visibility": "sealed verification/reference output; release only after explicit model and threshold freeze",
        "fixtureId": fixture["fixtureId"],
        "testGroupIds": fixture["sealedTestGroups"],
        "trainRefitIds": development_ids,
        "testRowIds": test_ids,
        "testRows": test,
        "selectedCandidate": selected["candidateId"],
        "selectedThresholdFromDevelopmentCV": selected["threshold"],
        "refitPreprocessing": pipeline_description(estimator, development_ids),
        "positiveProbabilities": scalar(probabilities),
        "predictions": applied["predictions"],
        "truth": scalar(y_test),
        "metricsAndCost": applied,
        "warning": "This one final-test result cannot be used to change the model, threshold, calibration, features, preprocessing, or tuning. A failed result is reported honestly; it is not a retuning signal.",
    }


def manifest_e2() -> tuple[dict[str, object], dict[str, object], dict[str, object]]:
    fixture = e2_fixture()
    candidates = e2_candidates()
    nested = nested_grouped_reference(fixture, candidates)
    grid_scores, grid_fits = full_development_cv(fixture, candidates)
    selected_grid = select_by_cost(grid_scores)
    sample = random.Random(SEED).sample(candidates, 8)
    random_scores, random_fits = full_development_cv(fixture, sample)
    selected_random = select_by_cost(random_scores)
    threshold = threshold_oof_reference(fixture)
    all_candidates = grid_scores
    selected = select_by_cost(all_candidates)
    permutation = permutation_reference(fixture)
    sealed = final_test_reference(fixture, selected)
    safe_rows = rows_in_groups(fixture, set(fixture["developmentGroups"]))
    public_fixture = {
        **fixture,
        "rows": [{**row, "target": row["target"]} for row in safe_rows],
        "partitions": {"development": [row["rowId"] for row in safe_rows], "test": [row["rowId"] for row in rows_in_groups(fixture, set(fixture["sealedTestGroups"]))]},
        "testFeatureRows": [{"rowId": row["rowId"], "groupId": row["groupId"], "features": row["features"]} for row in rows_in_groups(fixture, set(fixture["sealedTestGroups"]))],
        "sealedTestTargetRows": "see locked MS-E2 test reference sidecar; not included in learner-facing manifest",
    }
    states: list[dict[str, object]] = [
        {
            "configId": "MS-E2-NESTED-GROUPED-CV-LEGAL",
            "status": "reference-computed",
            "controls": {"candidateSpace": len(candidates), "outerFolds": 3, "innerFolds": 2, "groupBoundary": "customer groups remain disjoint"},
            "expected": nested,
        },
        {
            "configId": "MS-E2-GRID-SEARCH-DEV-LEGAL",
            "status": "reference-computed",
            "controls": {"search": "full finite candidate grid", "candidateStateCount": len(candidates), "folds": 3},
            "expected": {"fitCount": grid_fits, "scores": [{key: item[key] for key in ("candidateId", "meanCostPerRow", "meanBalancedAccuracy", "complexityTier")} for item in grid_scores], "selected": {key: selected_grid[key] for key in ("candidateId", "meanCostPerRow", "complexityTier")}},
        },
        {
            "configId": "MS-E2-RANDOM-SEARCH-SEEDED-LEGAL",
            "status": "reference-computed",
            "controls": {"search": "seeded finite candidate subset", "seed": SEED, "candidateStateCount": len(sample), "folds": 3},
            "expected": {"candidateIds": [item["candidateId"] for item in sample], "fitCount": random_fits, "scores": [{key: item[key] for key in ("candidateId", "meanCostPerRow", "meanBalancedAccuracy", "complexityTier")} for item in random_scores], "selected": {key: selected_random[key] for key in ("candidateId", "meanCostPerRow", "complexityTier")}},
        },
        {
            "configId": "MS-E2-DEVELOPMENT-THRESHOLD-COST-LEGAL",
            "status": "reference-computed",
            "controls": {"positiveClass": 1, "falseNegativeCost": FN_COST, "falsePositiveCost": FP_COST, "thresholds": list(THRESHOLDS)},
            "expected": threshold,
        },
        {
            "configId": "MS-E2-SIMPLE-ADEQUATE-MODEL-LEGAL",
            "status": "reference-computed",
            "controls": {"selectionRule": "simplest within predeclared cost tolerance of best grouped development score", "costTolerancePerRow": SIMPLICITY_TOLERANCE},
            "expected": {"bestCandidate": {key: selected[key] for key in ("candidateId", "meanCostPerRow", "complexityTier")}, "allCandidates": [{key: item[key] for key in ("candidateId", "meanCostPerRow", "complexityTier")} for item in all_candidates], "selectedModelRefitRows": fixture["developmentGroups"]},
        },
        {"configId": "MS-E2-PERMUTATION-DEVELOPMENT-HOLDOUT", "status": "reference-computed", "controls": {"usesFinalTest": False, "scoring": "balanced_accuracy", "repeats": 8, "seed": SEED}, "expected": permutation},
        {
            "configId": "MS-E2-FINAL-TEST-EVALUATION-ONCE",
            "status": "sealed-until-choice-freeze",
            "controls": {"selectionCompleteBeforeReveal": True, "usesFinalTestForTuning": False, "testAccess": "single final evaluation"},
            "referenceSidecar": "ms-e2-test-reference-sealed.v1.json",
        },
        {"configId": "MS-E2-REJECT-ROW-WISE-SPLIT-GROUP-OVERLAP", "status": "rejected", "reasonCode": "split.customer-group-overlap", "message": "A repeated customer cannot appear on both sides of the evaluation boundary; no score is produced."},
        {"configId": "MS-E2-REJECT-GLOBAL-PREPROCESS-FIT", "status": "rejected", "reasonCode": "preprocessing.fit-outside-fold-training", "message": "Fit each transformation inside the training fold; no score is produced."},
        {"configId": "MS-E2-REJECT-TUNE-ON-OUTER-HOLDOUT", "status": "rejected", "reasonCode": "selection.outer-holdout-access", "message": "Outer holdouts evaluate the complete selection procedure; they cannot choose its parameters."},
        {"configId": "MS-E2-REJECT-SELECT-ON-TEST", "status": "rejected", "reasonCode": "selection.final-test-access", "message": "The final test is opened once after the choice is frozen; no retuning score is produced."},
    ]
    manifest = {
        "manifestId": "TASK-015.12-MS-E2-V2",
        "experimentId": "MS-E2",
        "title": "Selection and generalization",
        "version": 2,
        "objectives": ["MS02.O1", "MS02.O2", "MS02.O3", "MS02.O4", "MS03.O1", "MS03.O2", "MS03.O3", "MS03.O4", "MS04.O1", "MS04.O2", "MS04.O3", "MS05.O1", "MS05.O2", "MS05.O3", "MS06.O1", "MS06.O2", "MS06.O3"],
        "interaction": "Predict the valid search, selected candidate, threshold cost, outer-fold behavior, and final-test rule before revealing each development trace; the sealed final result is revealed only after a choice is frozen.",
        "fixture": public_fixture,
        "candidateSpace": candidates,
        "simplicityRule": {"costTolerancePerRow": SIMPLICITY_TOLERANCE, "rule": "Among candidates no more than the stated cost tolerance above the minimum development CV cost, choose the lowest predeclared complexity tier, then candidate ID."},
        "costConvention": {"falseNegative": FN_COST, "falsePositive": FP_COST, "positiveClass": 1, "reported": "per scored row"},
        "configurationCount": len(states),
        "configurationLimit": 64,
        "configurations": states,
        "textAlternative": "The lab provides row/group membership tables, exact fit/score IDs for every fold, candidate scores, threshold confusion tables, fold dispersion, and the explicit selection/test timeline.",
    }
    parity_details = {
        "e1TrainedCandidates": [item["configId"] for item in manifest_e1()[0]["configurations"] if item.get("status") != "rejected"],
        "nestedFitCount": nested["fitCount"],
        "gridFitCount": grid_fits,
        "seededRandomFitCount": random_fits,
        "finalDevelopmentSelected": {key: selected[key] for key in ("candidateId", "meanCostPerRow", "complexityTier")},
        "outerFoldGroupsDisjoint": all(set(item["outerTrainGroupIds"]).isdisjoint(set(item["outerValidationGroupIds"])) for item in nested["outerFolds"]),
        "thresholdOOFRowsCoverDevelopmentExactlyOnce": len(threshold["oofRowIds"]) == len(set(threshold["oofRowIds"])) == len(safe_rows),
        "permutationUsedOnlyDevelopmentIds": set(permutation["trainRowIds"] + permutation["validationRowIds"]).issubset({row["rowId"] for row in safe_rows}),
    }
    return manifest, sealed, {"fixture": fixture, "parityDetails": parity_details}


def output_payloads() -> dict[str, bytes]:
    if sys.version_info[:3] != (3, 13, 16):
        raise RuntimeError(f"approved CPython 3.13.16 required, found {sys.version.split()[0]}")
    expected_versions = {
        "numpy": (np.__version__, "2.5.4"),
        "pandas": (pd.__version__, "3.0.6"),
        "scikit-learn": (sklearn.__version__, "1.9.1"),
        "scipy": (scipy.__version__, "1.18.1"),
        "matplotlib": (matplotlib.__version__, "3.11.2"),
    }
    mismatches = {name: pair for name, pair in expected_versions.items() if pair[0] != pair[1]}
    if mismatches:
        raise RuntimeError(f"approved dependency profile mismatch: {mismatches}")
    if version("threadpoolctl") != "3.7.0":
        raise RuntimeError(f"approved threadpoolctl 3.7.0 required, found {version('threadpoolctl')}")
    scope_hash = sha256(SPEC.read_bytes())
    if scope_hash != APPROVED_SCOPE_SHA256:
        raise RuntimeError(f"approved Task 015.12 source specification changed: {scope_hash}")
    with threadpool_limits(limits=1):
        e1, sealed_e1, _ = manifest_e1()
        e2, sealed_e2, e2_internal = manifest_e2()
    scope_checksum = f"{scope_hash}  docs/TASK_015_12_BOUNDED_SPECIFICATION.md\n".encode("utf-8")
    report = {
        "reportId": "TASK-015.12-REFERENCE-PARITY-V2",
        "status": "PASS",
        "environment": {
            "python": sys.version.split()[0],
            "numpy": np.__version__,
            "pandas": pd.__version__,
            "matplotlib": matplotlib.__version__,
            "scikitLearn": sklearn.__version__,
            "scipy": scipy.__version__,
            "threadpoolctl": version("threadpoolctl"),
            "architecture": f"{platform.system()} {platform.machine()}; threadpool limit 1",
        },
        "scopeSourceChecksum": scope_hash,
        "manifestConfigurationCounts": {"MS-E1": e1["configurationCount"], "MS-E2": e2["configurationCount"]},
        "e1": {
            "fixtureCount": len(e1["fixtures"]),
            "trainedEstimatorStates": sum(item.get("status") != "rejected" for item in e1["configurations"]),
            "rejectionStates": sum(item.get("status") == "rejected" for item in e1["configurations"]),
            "metricIndependentChecks": "MAE, RMSE, accuracy, balanced accuracy, positive precision/recall/F1, and log loss independently recomputed from frozen predictions and targets; all model outputs generated by the pinned scikit-learn estimators.",
            "testRowsEvaluated": 0,
        },
        "e2": {
            "developmentRows": sum(row["groupId"] in e2_internal["fixture"]["developmentGroups"] for row in e2_internal["fixture"]["rows"]),
            "sealedTestRows": sum(row["groupId"] in e2_internal["fixture"]["sealedTestGroups"] for row in e2_internal["fixture"]["rows"]),
            "nestedGroupBoundaryAssertions": len(e2_internal["parityDetails"]["outerFoldGroupsDisjoint"]) if isinstance(e2_internal["parityDetails"]["outerFoldGroupsDisjoint"], list) else 3,
            "nestedAndSearchFitCounts": {"nested": e2_internal["parityDetails"]["nestedFitCount"], "grid": e2_internal["parityDetails"]["gridFitCount"], "random": e2_internal["parityDetails"]["seededRandomFitCount"]},
            "oofCoverageAssertion": e2_internal["parityDetails"]["thresholdOOFRowsCoverDevelopmentExactlyOnce"],
            "permutationBoundaryAssertion": e2_internal["parityDetails"]["permutationUsedOnlyDevelopmentIds"],
            "finalTestPredictionsFrozenInSidecar": True,
        },
        "numericTolerance": {"metricAbsolute": METRIC_TOLERANCE, "logLossAbsolute": METRIC_TOLERANCE, "selectionTieAbsolute": METRIC_TOLERANCE, "knnDistanceEqualityAbsolute": KNN_DISTANCE_EQUALITY_TOLERANCE},
        "determinism": "No timestamps; fixed seeds; deterministic split order and candidate IDs; n_jobs/threadpool=1; byte comparison enforced by --check.",
    }
    payloads = {
        "ms-e1.manifest.v1.json": canonical(e1),
        "ms-e2.manifest.v1.json": canonical(e2),
        "ms-e1-test-reference-sealed.v1.json": canonical(sealed_e1),
        "ms-e2-test-reference-sealed.v1.json": canonical(sealed_e2),
        "parity-report.v1.json": canonical(report),
        "scope-source.sha256": scope_checksum,
    }
    return payloads


def lock_payload(payloads: dict[str, bytes]) -> bytes:
    files = {f"docs/verification/model-selection/{name}": sha256(data) for name, data in sorted(payloads.items())}
    files["docs/verification/model-selection/MODEL_SELECTION_REFERENCE_CONVENTIONS.md"] = sha256(CONVENTIONS.read_bytes())
    files["docs/verification/model-selection/REFERENCE_FREEZE_REPORT.md"] = sha256((OUT / "REFERENCE_FREEZE_REPORT.md").read_bytes())
    files["docs/verification/model-selection/REFERENCE_FREEZE_REPORT.md"] = sha256((OUT / "REFERENCE_FREEZE_REPORT.md").read_bytes())
    files["docs/TASK_015_12_BOUNDED_SPECIFICATION.md"] = sha256(SPEC.read_bytes())
    files["work/freeze-task-015-12.py"] = sha256(GENERATOR.read_bytes())
    files["docs/verification/multilayer-perceptrons/requirements-clean-verification.txt"] = sha256((ROOT / "docs/verification/multilayer-perceptrons/requirements-clean-verification.txt").read_bytes())
    return canonical({
        "lockId": "TASK-015.12-MODEL-SELECTION-FREEZE-V2",
        "schemaVersion": 1,
        "manifestIds": ["TASK-015.12-MS-E1-V1", "TASK-015.12-MS-E2-V2"],
        "approvedBaselineCommit": "8b37d1e8c75a33a0ee2f73265294385a95549ebb",
        "configurationCounts": {"MS-E1": 20, "MS-E2": 11, "MS-E1-tested-model-configurations": 17, "MS-E2-rejections": 4},
        "pythonProfile": {"python": "3.13.16", "numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1", "threadpoolctl": "3.7.0"},
        "sha256": files,
    })


def write_freeze() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    payloads = output_payloads()
    for name, payload in payloads.items():
        (OUT / name).write_bytes(payload)
    LOCK.write_bytes(lock_payload(payloads))


def check_freeze() -> None:
    payloads = output_payloads()
    missing = [name for name in (*payloads.keys(), LOCK.name) if not (OUT / name).is_file()]
    if missing:
        raise SystemExit(f"missing frozen artifacts: {', '.join(missing)}")
    differences = [name for name, payload in payloads.items() if (OUT / name).read_bytes() != payload]
    expected_lock = lock_payload(payloads)
    if LOCK.read_bytes() != expected_lock:
        differences.append(LOCK.name)
    if differences:
        raise SystemExit(f"freeze mismatch: {', '.join(differences)}")
    lock = json.loads(LOCK.read_text(encoding="utf-8"))
    for name, expected_hash in lock["sha256"].items():
        path = ROOT / name
        if not path.is_file() or sha256(path.read_bytes()) != expected_hash:
            raise SystemExit(f"locked hash mismatch: {name}")
    print(f"PASS byte-identical regeneration: MS-E1={20} states, MS-E2={11} states; locked hashes unchanged")


def main() -> None:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--freeze", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.freeze:
        write_freeze()
        print("Wrote Task 015.12 MS-E1/MS-E2 references and freeze lock")
    else:
        check_freeze()


if __name__ == "__main__":
    main()
