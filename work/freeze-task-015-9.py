"""Trusted offline Gradient Boosting reference authoring, never learner execution."""
import hashlib
import importlib.metadata
import json
import math
import platform
import sys
from pathlib import Path

import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor, RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import log_loss, mean_squared_error

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/gradient-boosting"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}
SEED = 1729
RATES = [.1, .5, 1.0]
STAGES = [1, 2, 4, 8]


def encode(value):
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False) + "\n").encode()


def digest(value):
    return hashlib.sha256(value).hexdigest()


def close(actual, expected):
    assert np.allclose(actual, expected, atol=1e-9, rtol=1e-9), (actual, expected)


def sigmoid(score):
    return np.asarray([1 / (1 + math.exp(-float(value))) for value in score])


def loss(task, targets, score):
    if task == "regression":
        return sum((float(target) - float(value)) ** 2 for target, value in zip(targets, score)) / len(targets)
    return sum(float(np.logaddexp(0, value)) - float(target) * float(value) for target, value in zip(targets, score)) / len(targets)


def fixture(task, variant):
    identity = f"gb.{task}.{variant}.v1"
    training = [[index] for index in range(12)]
    validation = [[value] for value in [.5, 2.5, 4.5, 6.5, 8.5, 10.5]]
    test = [[value] for value in [1.25, 3.25, 7.25, 9.25]]
    if task == "regression":
        targets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        if variant == "noisy":
            targets = [1, 2, 3, 8, 5, 6, 7, 8, 15, 10, 11, 12]
        validation_targets = [1.5, 3.5, 5.5, 7.5, 9.5, 11.5]
        test_targets = [2.25, 4.25, 8.25, 10.25]
    else:
        targets = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]
        if variant == "noisy":
            targets = [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1]
        validation_targets = [0, 0, 0, 1, 1, 1]
        test_targets = [0, 0, 1, 1]
    return {"id": identity, "provenance": "Original authored fictional numeric data; CC0-1.0; no human records or remote sources.",
            "feature_order": ["floor_area_index" if task == "regression" else "pre_prediction_usage_risk_index"],
            "target": "house_price_in_fictional_units" if task == "regression" else "0=stays;1=churns",
            "training": {"ids": [f"{identity}.train.{index}" for index in range(12)], "inputs": training, "targets": targets},
            "validation": {"ids": [f"{identity}.validation.{index}" for index in range(6)], "inputs": validation, "targets": validation_targets},
            "sealed_test": {"ids": [f"{identity}.test.{index}" for index in range(4)], "inputs": test, "targets": test_targets, "policy": "Not evaluated by this generator; never exposed as a selection control. Final evaluation requires a locked development choice."}}


def manual_tree(tree, inputs):
    predictions = []
    leaves = []
    for row in inputs:
        node = 0
        while tree.children_left[node] != -1:
            node = int(tree.children_left[node] if np.float32(row[tree.feature[node]]) <= tree.threshold[node] else tree.children_right[node])
        leaves.append(node)
        predictions.append(float(tree.value[node, 0, 0]))
    return np.array(predictions), np.array(leaves)


def fit_trace(task, data, rate):
    training = data["training"]
    validation = data["validation"]
    inputs = np.asarray(training["inputs"], dtype=float)
    targets = np.asarray(training["targets"], dtype=float)
    held_inputs = np.asarray(validation["inputs"], dtype=float)
    held_targets = np.asarray(validation["targets"], dtype=float)
    estimator_type = GradientBoostingRegressor if task == "regression" else GradientBoostingClassifier
    model = estimator_type(loss="squared_error" if task == "regression" else "log_loss", learning_rate=rate, n_estimators=8, max_depth=1, min_samples_leaf=2, min_samples_split=2, subsample=1.0, max_features=None, random_state=SEED, n_iter_no_change=None, warm_start=False, ccp_alpha=0.0, init=None)
    model.fit(inputs, targets)
    initial = float(np.mean(targets)) if task == "regression" else math.log(float(np.mean(targets)) / (1 - float(np.mean(targets))))
    score = np.full(len(targets), initial)
    held_score = np.full(len(held_targets), initial)
    close(model._raw_predict_init(inputs)[:, 0], score)
    library_stages = list(model.staged_predict(inputs)) if task == "regression" else [value[:, 0] for value in model.staged_decision_function(inputs)]
    library_validation = list(model.staged_predict(held_inputs)) if task == "regression" else [value[:, 0] for value in model.staged_decision_function(held_inputs)]
    probability_stages = list(model.staged_predict_proba(held_inputs)) if task == "classification" else None
    traces = []
    for stage_index, fitted_tree in enumerate(model.estimators_[:, 0]):
        before = score.copy()
        gradient = targets - score if task == "regression" else targets - sigmoid(score)
        contribution, leaves = manual_tree(fitted_tree.tree_, inputs)
        held_contribution, _ = manual_tree(fitted_tree.tree_, held_inputs)
        close(contribution, fitted_tree.predict(inputs))
        leaf_checks = []
        for leaf in sorted(set(leaves.tolist())):
            mask = leaves == leaf
            if task == "regression":
                expected_leaf = float(np.mean(gradient[mask]))
            else:
                probability = sigmoid(before[mask])
                expected_leaf = float(sum(gradient[mask]) / sum(probability * (1 - probability)))
            close(expected_leaf, fitted_tree.tree_.value[leaf, 0, 0])
            leaf_checks.append({"leaf": leaf, "training_ids": [training["ids"][index] for index in np.flatnonzero(mask)], "expected_leaf_value": expected_leaf})
        tree = fitted_tree.tree_
        root = 0
        split_check = {"is_leaf": bool(tree.children_left[root] == -1)}
        if not split_check["is_leaf"]:
            candidates = []
            ordered = sorted(set(inputs[:, 0].tolist()))
            for left, right in zip(ordered, ordered[1:]):
                threshold = (left + right) / 2
                mask = inputs[:, 0] <= threshold
                if min(sum(mask), sum(~mask)) < 2:
                    continue
                split_sse = float(sum((gradient[mask] - np.mean(gradient[mask])) ** 2) + sum((gradient[~mask] - np.mean(gradient[~mask])) ** 2))
                candidates.append({"threshold": threshold, "gradient_sse": split_sse})
            chosen = next(candidate for candidate in candidates if candidate["threshold"] == tree.threshold[root])
            close(chosen["gradient_sse"], min(candidate["gradient_sse"] for candidate in candidates))
            split_check = {"feature": 0, "threshold": float(tree.threshold[root]), "candidates": candidates, "tie_policy": "Pinned sklearn seed determines equal-gain choice; frozen threshold is authoritative, not an earliest-threshold claim."}
        score += rate * contribution
        held_score += rate * held_contribution
        close(score, library_stages[stage_index])
        close(held_score, library_validation[stage_index])
        train_loss = loss(task, targets, score)
        validation_loss = loss(task, held_targets, held_score)
        if task == "regression":
            close(train_loss, mean_squared_error(targets, score))
        else:
            close(train_loss, log_loss(targets, sigmoid(score), labels=[0, 1]))
        close(validation_loss, mean_squared_error(held_targets, held_score) if task == "regression" else log_loss(held_targets, sigmoid(held_score), labels=[0, 1]))
        trace = {"stage": stage_index + 1, "before_training_score": before.tolist(), "negative_gradient": gradient.tolist(), "unscaled_training_tree_contribution": contribution.tolist(), "scaled_training_update": (rate * contribution).tolist(), "training_score": score.tolist(), "validation_score": held_score.tolist(), "unscaled_validation_tree_contribution": held_contribution.tolist(), "training_loss": train_loss, "validation_loss": validation_loss, "leaf_checks": leaf_checks, "root_split_check": split_check, "tree_structure": {"children_left": tree.children_left.tolist(), "children_right": tree.children_right.tolist(), "feature": tree.feature.tolist(), "threshold": tree.threshold.tolist(), "value": tree.value[:, 0, 0].tolist(), "node_samples": tree.n_node_samples.tolist()}}
        if task == "classification":
            close(sigmoid(held_score), probability_stages[stage_index][:, 1])
            trace.update({"training_probability": sigmoid(score).tolist(), "validation_probability": sigmoid(held_score).tolist(), "validation_labels": (sigmoid(held_score) >= .5).astype(int).tolist(), "validation_accuracy": float(np.mean((sigmoid(held_score) >= .5) == held_targets))})
            labels = sigmoid(held_score) >= .5
            true_positive = int(sum(labels & (held_targets == 1)))
            false_positive = int(sum(labels & (held_targets == 0)))
            false_negative = int(sum(~labels & (held_targets == 1)))
            true_negative = int(sum(~labels & (held_targets == 0)))
            trace["validation_confusion"] = {"TP": true_positive, "FP": false_positive, "TN": true_negative, "FN": false_negative}
        traces.append(trace)
    forest_type = RandomForestRegressor if task == "regression" else RandomForestClassifier
    forest = forest_type(n_estimators=8, max_depth=1, min_samples_leaf=2, max_features=1.0, bootstrap=True, random_state=SEED)
    forest.fit(inputs, targets)
    tree_values = [tree.predict(held_inputs).tolist() if task == "regression" else tree.predict_proba(held_inputs)[:, 1].tolist() for tree in forest.estimators_]
    forest_prediction = np.mean(tree_values, axis=0)
    close(forest_prediction, forest.predict(held_inputs) if task == "regression" else forest.predict_proba(held_inputs)[:, 1])
    comparison = {"individual_tree_validation_outputs": tree_values, "ensemble_validation_output": forest_prediction.tolist(), "aggregation": "arithmetic mean of predictions" if task == "regression" else "arithmetic mean of class-1 probabilities; not score addition", "validation_loss": float(mean_squared_error(held_targets, forest_prediction) if task == "regression" else log_loss(held_targets, forest_prediction, labels=[0, 1])), "interpretation": "Fixed illustrative baseline, not a tuned or universally fair winner claim; no test evaluation."}
    return {"id": f"{data['id']}.eta-{rate}", "learning_rate": rate, "initial_score": initial, "initial_training_loss": loss(task, targets, np.full(len(targets), initial)), "initial_validation_loss": loss(task, held_targets, np.full(len(held_targets), initial)), "stages": traces, "bagging_comparison": comparison}


def select(traces, budget):
    permitted = traces[:budget]
    minimum = min(trace["validation_loss"] for trace in permitted)
    return next(trace["stage"] for trace in permitted if abs(trace["validation_loss"] - minimum) <= 1e-12)


def manifest(task, experiment):
    datasets = [fixture(task, variant) for variant in ["clean", "noisy"]]
    runs = [fit_trace(task, data, rate) for data in datasets for rate in RATES]
    configurations = []
    for run in runs:
        for budget in STAGES:
            selected = select(run["stages"], budget)
            configurations.append({"id": f"{run['id']}.budget-{budget}", "run_id": run["id"], "estimator_budget": budget, "selected_stage": selected, "selected_validation_loss": run["stages"][selected - 1]["validation_loss"], "last_stage_validation_loss": run["stages"][budget - 1]["validation_loss"], "prediction_prompt": "Predict the next correction direction or whether the permitted later stage improves validation loss; then reveal and explain.", "explanation": "Each next tree fits the current training loss gradient; validation chooses among trained prefixes, never fitting a tree or changing its targets. More training stages need not improve validation. Classification leaf corrections are Newton-adjusted scores, not labels." if task == "classification" else "Each next tree fits current training residuals; shrinkage scales its contribution. Validation chooses among trained prefixes; noise can make later stages worse. Bagging averages independently fitted predictions instead."})
    for reason in ["test-based-stage-selection", "validation-rows-used-for-fitting", "unsupported-estimator-budget"]:
        configurations.append({"id": f"{experiment.lower()}.reject.{reason}.v1", "status": "rejected", "reason": reason, "outcome": {"tag": "invalid", "prediction": None}, "explanation": "Reject before fitting/replay; only approved training IDs and estimator budgets are permitted. Test evidence must not guide development."})
    assert len(configurations) == 27
    worsening = [run["id"] for run in runs if any(right["validation_loss"] > left["validation_loss"] + 1e-9 for left, right in zip(run["stages"], run["stages"][1:]))]
    assert worsening, "Must demonstrate a real validation overfit tail"
    return {"schema": "gradient-boosting.experiment.v1", "id": f"{experiment}.v1", "objectives": ["GB01", "GB02", "GB04", "GB06"] if task == "regression" else ["GB03", "GB04", "GB05", "GB06"], "prerequisites": ["trees", "gradients", "loss", "training-validation-test"] + (["sigmoid", "log-loss"] if task == "classification" else ["residuals", "squared-error"]), "controls": {"dataset": [data["id"] for data in datasets], "learning_rate": RATES, "estimator_budget": STAGES, "diagnostic": ["test-based-stage-selection", "validation-rows-used-for-fitting", "unsupported-estimator-budget"]}, "interaction": ["select bounded configuration", "predict before reveal", "reveal numeric trace", "change allowed control and predict again", "choose authored explanation"], "accessibility": "Labeled native controls; stage-by-stage textual table of before/gradient/tree/update/after/loss; selected-stage and fit-ID explanation. Plot/color/animation not required. No table larger than32rows x8columns; separate panels for traces.", "datasets": datasets, "runs": runs, "configurations": configurations, "observed_validation_worsening_runs": worsening}


def main():
    first = manifest("regression", "GB-E1")
    second = manifest("classification", "GB-E2")
    close(select([{"stage": 1, "validation_loss": 1.0}, {"stage": 2, "validation_loss": 1.0 + 5e-13}], 2), 1)
    close(sigmoid([0]), [.5])
    close(loss("classification", [1], [1000]), 0)
    close(loss("classification", [0], [1000]), 1000)
    close(loss("classification", [0], [-1000]), 0)
    close(loss("classification", [1], [-1000]), 1000)
    baseline = json.loads((ROOT / "outputs/task-015-8/source-equality.json").read_text())
    changed = [name for name, expected in baseline["sha256"].items() if digest((ROOT / name).read_bytes()) != expected]
    assert not changed, changed
    preservation = {"schema": "gradient-boosting.source-preservation.v1", "baseline": "outputs/task-015-8/source-equality.json", "checked_files": len(baseline["sha256"]), "changed_files": changed, "scope": "Accepted application/public/package/Python sources; no learner storage accessed. Documentation and offline authoring only; not exhaustive filesystem equality.", "original_directory_io_reliability": "OPEN"}
    report = {"schema": "gradient-boosting.parity.v1", "python": platform.python_version(), "dependencies": PROFILE, "seed": SEED, "platform_verified": "macOS15.6.1 ARM64", "experiments": {"GB-E1": 27, "GB-E2": 27}, "valid_prediction_states": 48, "rejected_states": 6, "boosting_fits": 12, "verified_tree_stages": 96, "bagging_comparison_fits": 12, "checks": ["manual float32 tree traversal versus estimator", "independent negative gradients and leaf means/Newton updates", "candidate gradient SSE optimality", "additive score versus every sklearn staged output on train and validation", "independent loss versus sklearn metrics", "forest probability/prediction averaging", "stage-selection tie chooses earliest within1e-12", "actual validation worsening in both experiments", "test split never evaluated"], "not_verified": ["application implementation", "120 future scored exercise instances", "notebook kernels", "screen reader", "browser zoom", "Google Colab", "original-directory I/O reliability"]}
    files = {"gb-e1.manifest.v1.json": encode(first), "gb-e2.manifest.v1.json": encode(second), "parity-report.v1.json": encode(report), "source-preservation.v1.json": encode(preservation)}
    lock = {"schema": "gradient-boosting.freeze.v1", "sha256": {name: digest(value) for name, value in files.items()}, "generator_sha256": digest(Path(__file__).read_bytes()), "conventions_sha256": digest((DEST / "STAGEWISE_LOSS_SELECTION_CONVENTIONS.md").read_bytes())}
    files["freeze-lock.v1.json"] = encode(lock)
    if "--check" in sys.argv:
        for name, value in files.items():
            assert (DEST / name).read_bytes() == value, name
        print("PASS byte-identical regeneration:54 states,12 boosting fits,96 tree stages,12 forest comparisons; frozen hashes unchanged")
    else:
        for name, value in files.items():
            (DEST / name).write_bytes(value)
        print("WROTE54 reviewed states; all numerical assertions passed")


if __name__ == "__main__":
    main()
