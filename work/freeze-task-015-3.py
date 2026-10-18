"""Offline trusted fixture authoring and independent numerical checks; no learner inputs."""
import hashlib
import importlib.metadata
import json
import platform
import sys
import warnings
from pathlib import Path

import numpy as np
from sklearn.linear_model import ElasticNet, Lasso, LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import KFold
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/regularization"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1"}
TRAIN = np.array([[1, 1, 2], [2, 2, 0], [3, 2, 1], [4, 4, 3], [5, 4, 1], [6, 6, 2], [7, 6, 0], [8, 9, 1]], dtype=float)
VALIDATION = np.array([[1.5, 2, 1], [3.5, 3, 2], [6.5, 7, 1], [9, 9, 0]], dtype=float)
TARGET = np.array([15, 18, 18, 25, 25, 30, 29, 37], dtype=float)
VALIDATION_TARGET = np.array([16, 22, 31, 36], dtype=float)
TRAIN_IDS = [f"rg-h{index}" for index in range(1, 9)]
VALIDATION_IDS = [f"rg-v{index}" for index in range(1, 5)]
TOLERANCE = 1e-10
MAX_ITER = 100000


def dataset(alternative):
    order = [0, 1, 2] if alternative == "original" else [1, 0, 2]
    names = ["area_100m2", "room_index", "age_decades"]
    return {"id": f"RG.housing.{alternative}.v1", "fictional": True,
            "feature_order": [names[index] for index in order], "target_unit": "ten_thousand_USD",
            "training": {"ids": TRAIN_IDS, "x": TRAIN[:, order].tolist(), "y": TARGET.tolist()},
            "validation": {"ids": VALIDATION_IDS, "x": VALIDATION[:, order].tolist(), "y": VALIDATION_TARGET.tolist()},
            "query": [[4.5, 4.0, 1.5][index] for index in order],
            "counterexample": "The alternative only swaps correlated feature columns and their names; compare aligned coefficients, never assume changed semantics or guaranteed changed selection."}


def fit(fixture, kind, strength, mix, provenance, indices=None):
    training = np.array(fixture["training"]["x"])
    validation = np.array(fixture["validation"]["x"])
    selected = np.arange(8) if indices is None else np.array(indices)
    fit_ids = [TRAIN_IDS[index] for index in selected]
    scaler_rows = training[selected] if provenance == "training-only" else np.vstack([training, validation])
    scaler_ids = fit_ids if provenance == "training-only" else TRAIN_IDS + VALIDATION_IDS
    scaler = StandardScaler().fit(scaler_rows)
    design = scaler.transform(training[selected])
    targets = TARGET[selected]
    if kind == "ridge":
        estimator = Ridge(alpha=strength, solver="svd", fit_intercept=True, tol=TOLERANCE)
    elif kind == "lasso":
        estimator = Lasso(alpha=strength, fit_intercept=True, tol=TOLERANCE, max_iter=MAX_ITER, selection="cyclic", random_state=1729)
    elif kind == "elastic-net":
        estimator = ElasticNet(alpha=strength, l1_ratio=mix, fit_intercept=True, tol=TOLERANCE, max_iter=MAX_ITER, selection="cyclic", random_state=1729)
    else:
        estimator = LinearRegression(fit_intercept=True)
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        estimator.fit(design, targets)
    assert not caught, [str(item.message) for item in caught]
    weights = estimator.coef_
    residual = targets - estimator.predict(design)
    sse = float(residual @ residual)
    norm_l1 = float(np.abs(weights).sum())
    norm_l2_squared = float(weights @ weights)
    if kind == "ridge":
        data_loss, l1_penalty, l2_penalty = sse, 0.0, strength * norm_l2_squared
        gradient = -2 * design.T @ residual + 2 * strength * weights
        assert np.max(np.abs(gradient)) < 1e-7
        centered = design - design.mean(axis=0)
        oracle = np.linalg.solve(centered.T @ centered + strength * np.eye(3), centered.T @ (targets - targets.mean()))
        assert np.allclose(oracle, weights, atol=1e-9, rtol=1e-9)
    else:
        data_loss = sse / (2 * len(selected))
        fraction = 1.0 if kind == "lasso" else mix
        l1_penalty = strength * fraction * norm_l1 if kind != "ols" else 0.0
        l2_penalty = strength * (1 - fraction) * norm_l2_squared / 2 if kind != "ols" else 0.0
        gradient = -design.T @ residual / len(selected) + (strength * (1 - fraction) * weights if kind != "ols" else 0)
        for coefficient, derivative in zip(weights, gradient):
            if coefficient == 0:
                assert abs(derivative) <= strength * fraction + 1e-7
            else:
                assert abs(derivative + (strength * fraction * np.sign(coefficient) if kind != "ols" else 0)) < 1e-7
    assert abs(residual.mean()) < 1e-9
    raw_weights = weights / scaler.scale_
    raw_intercept = float(estimator.intercept_ - raw_weights @ scaler.mean_)
    def predictions(rows):
        rows = np.array(rows)
        manual = rows @ raw_weights + raw_intercept
        actual = estimator.predict(scaler.transform(rows))
        assert np.allclose(actual, manual, atol=1e-9, rtol=1e-9)
        return actual.tolist()
    training_predictions = predictions(training[selected])
    validation_predictions = predictions(validation)
    def metrics(actual, predicted):
        errors = np.array(actual) - np.array(predicted)
        mae, mse = float(np.abs(errors).mean()), float((errors ** 2).mean())
        assert np.isclose(mae, mean_absolute_error(actual, predicted), atol=1e-12)
        assert np.isclose(mse, mean_squared_error(actual, predicted), atol=1e-12)
        return {"mae": mae, "mse": mse, "rmse": float(np.sqrt(mse))}
    dual_gap = float(getattr(estimator, "dual_gap_", 0))
    assert dual_gap <= TOLERANCE * float(np.mean((targets - targets.mean()) ** 2)) + 1e-12
    return {"coefficients_standardized": weights.tolist(), "intercept_standardized": float(estimator.intercept_),
            "coefficients_raw": raw_weights.tolist(), "intercept_raw": raw_intercept,
            "coefficient_states": ["exact-zero" if value == 0 else "near-zero-nonzero" if abs(value) <= 1e-8 else "nonzero" for value in weights],
            "scaler_mean": scaler.mean_.tolist(), "scaler_scale": scaler.scale_.tolist(),
            "scaler_fit_ids": scaler_ids, "estimator_fit_ids": fit_ids,
            "training_predictions": training_predictions, "all_training_predictions": predictions(training), "validation_predictions": validation_predictions,
            "query_prediction": predictions([fixture["query"]])[0], "training_metrics": metrics(targets, training_predictions),
            "validation_metrics": metrics(VALIDATION_TARGET, validation_predictions),
            "loss_terms": {"sse": sse, "data_loss": data_loss, "l1_norm": norm_l1, "l2_squared": norm_l2_squared,
                           "l1_penalty": l1_penalty, "l2_penalty": l2_penalty, "objective": data_loss + l1_penalty + l2_penalty},
            "convergence": {"warnings": [], "dual_gap": dual_gap if kind in ["lasso", "elastic-net"] else None,
                            "iterations": int(estimator.n_iter_) if kind in ["lasso", "elastic-net"] else None,
                            "status": "verified-kkt-and-intercept-stationarity"}}


def generate():
    fixtures = [dataset(name) for name in ["original", "swapped-correlated-columns"]]
    for fixture in fixtures:
        fixture["unregularized_baseline"] = fit(fixture, "ols", 0, 1, "training-only")
    manifests = []
    for experiment in [1, 2]:
        configurations = []
        for fixture in fixtures:
            for kind in (["ridge", "lasso"] if experiment == 1 else ["elastic-net"]):
                for strength in ([.1, 1, 10] if experiment == 1 else [.1, 1]):
                    for mix in ([1] if experiment == 1 else [.25, .5, .75]):
                        for provenance in (["training-only"] if experiment == 1 else ["training-only", "global-development-invalid"]):
                            expected = fit(fixture, kind, strength, mix, provenance)
                            folds = []
                            for fold_number, (train_indices, held_indices) in enumerate(KFold(3, shuffle=True, random_state=1729).split(TRAIN)):
                                fitted = fit(fixture, kind, strength, mix, provenance, train_indices)
                                held_rows = np.array(fixture["training"]["x"])[held_indices]
                                predicted = held_rows @ fitted["coefficients_raw"] + fitted["intercept_raw"]
                                assert np.allclose(predicted, np.array(fitted["all_training_predictions"])[held_indices], atol=1e-9, rtol=1e-9)
                                folds.append({"fold": fold_number, "held_ids": [TRAIN_IDS[index] for index in held_indices],
                                              "scaler_fit_ids": fitted["scaler_fit_ids"], "estimator_fit_ids": fitted["estimator_fit_ids"],
                                              "held_predictions": predicted.tolist(), "held_mae": float(np.abs(TARGET[held_indices] - predicted).mean()),
                                              "scaler_mean": fitted["scaler_mean"], "convergence": fitted["convergence"]})
                            valid = provenance == "training-only"
                            reason = "Shrinkage is not automatic elimination; sparsity is conditional and validation, not training objective, informs selection." if experiment == 1 else "Select the complete pipeline inside development folds; restore units and do not infer causality from coefficients."
                            if not valid:
                                reason = "Reject this selection claim: scaler statistics include validation and CV-held-out rows, although estimator target fitting still uses training rows."
                            configurations.append({"id": f"RG-E{experiment}.{fixture['id']}.{kind}.a{strength}.q{mix}.{provenance}",
                                                   "fixture": fixture["id"], "controls": {"model": kind, "alpha": strength, "l1_ratio": mix if kind == "elastic-net" else None, "scale_provenance": provenance},
                                                   "expected": expected, "cv_folds": folds, "cv_mean_mae": float(np.mean([fold["held_mae"] for fold in folds])),
                                                   "selection_valid": valid, "correct_explanation": reason,
                                                   "explanation_id": "reject-global-scaling" if not valid else "conditional-shrinkage" if experiment == 1 else "fold-local-comparison",
                                                   "counterexample": fixture["counterexample"], "text_alternative": "Read the ordered coefficient table with exact-zero tags, units, training/development errors, objective components and explicit fold fit IDs; no graphic is required."})
        assert len(configurations) <= 64
        manifests.append({"id": f"RG-E{experiment}", "version": "supervised.regularization.experiment.1.0.0", "schema": "supervised.regularization.manifest.v1",
                          "objectives": [f"RG0{lesson}.O{objective}" for lesson in (range(1, 4) if experiment == 1 else range(4, 7)) for objective in range(1, 5)],
                          "prerequisites": ["Evaluation Foundations", "multiple Linear Regression", "norms and Optimization", "training-only scaling"],
                          "question": "What does coefficient shrinkage or sparsity establish?" if experiment == 1 else "Which mixed-penalty comparison respects scale and evaluation boundaries?",
                          "profile": {"python": platform.python_version(), **PROFILE}, "seed": 1729,
                          "fixtures": fixtures, "configurations": configurations, "initial_configuration": configurations[0]["id"],
                          "allowed_controls": "Only the complete listed configuration IDs; no arbitrary values or Cartesian expansion.",
                          "prediction_options": ["Smaller training error need not mean smaller validation error", "Exact zero and a small coefficient are different", "Global scaling invalidates the selection claim even if its score is good"],
                          "explanation_options": ["conditional-shrinkage", "fold-local-comparison", "reject-global-scaling", "lower-training-error-guarantees-generalization", "zero-proves-causal-irrelevance"],
                          "interaction": ["Record a finite prediction before reveal", "Change at least one listed meaningful configuration", "Reveal numerical and visual reference outputs", "Choose the correct post-observation explanation", "Apply a bounded changed-scenario transfer"],
                          "completion": "Initial prediction may be wrong; changed state plus correct post-observation reasoning is required. No independent mastery.",
                          "rejection": "Unknown ID, altered dataset, unsupported model/alpha/mix/provenance or nonfinite input is rejected; no interpolation or execution."})
    return manifests


def encoded(value):
    return (json.dumps(value, indent=2, sort_keys=True, allow_nan=False) + "\n").encode()


def main():
    manifests = generate()
    files = {f"rg-e{index}.manifest.v1.json": encoded(manifest) for index, manifest in enumerate(manifests, 1)}
    lock = {"schema": "supervised.regularization.freeze.v1", "files": {name: hashlib.sha256(data).hexdigest() for name, data in files.items()},
            "reference_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
            "conventions_sha256": hashlib.sha256((DEST / "NUMERICAL_CONVENTIONS.md").read_bytes()).hexdigest(),
            "profile": {"python": platform.python_version(), **PROFILE}}
    if "--check" in sys.argv:
        assert all((DEST / name).read_bytes() == data for name, data in files.items())
        assert json.loads((DEST / "freeze-lock.v1.json").read_text()) == lock
    else:
        assert "--freeze" in sys.argv
        DEST.mkdir(parents=True, exist_ok=True)
        for name, data in files.items():
            (DEST / name).write_bytes(data)
        (DEST / "freeze-lock.v1.json").write_bytes(encoded(lock))
    print(json.dumps({"mode": "check" if "--check" in sys.argv else "freeze", "configurations": [len(manifest["configurations"]) for manifest in manifests], "hashes": lock["files"], "profile": lock["profile"], "platform": platform.platform(), "parity": "all states: sklearn, manual predictions/metrics, KKT, intercept stationarity; Ridge independent linear solve", "colab": "UNVERIFIED"}, indent=2))


if __name__ == "__main__":
    main()
