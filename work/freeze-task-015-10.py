"""Trusted offline SVM reference freeze; never learner code execution."""
import hashlib
import importlib.metadata
import json
import math
import platform
import sys
import warnings
from pathlib import Path

import numpy as np
from sklearn.metrics import balanced_accuracy_score, confusion_matrix, hinge_loss
from sklearn.metrics.pairwise import rbf_kernel
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/support-vector-machines"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}
SEED = 1729
ALPHA_TOL = 1e-7
KKT_TOL = 1e-4


def encode(value):
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False) + "\n").encode()


def digest(value):
    return hashlib.sha256(value).hexdigest()


def close(actual, expected):
    assert np.allclose(actual, expected, atol=1e-9, rtol=1e-9), (actual, expected)


def fixture(kind, noisy):
    identity = f"sv.{kind}.{'noisy' if noisy else 'clean'}.v1"
    if kind == "linear":
        training = [[-2, -1], [-2, 1], [-1, -1], [-1, 1], [1, -1], [1, 1], [2, -1], [2, 1]]
        targets = [0, 0, 0, 0, 1, 1, 1, 1]
        if noisy:
            training.append([2.5, 0])
            targets.append(0)
        validation = [[-1.5, -.5], [-.5, .5], [.5, -.5], [1.5, .5], [.25, 0], [3, 0]]
        validation_targets = [0, 0, 1, 1, 1, 1]
        test = [[-1.25, .25], [-.25, -.25], [.25, .25], [1.25, -.25]]
        test_targets = [0, 0, 1, 1]
    else:
        training = [[-2, -200], [-1, -100], [1, 100], [2, 200], [-2, 200], [-1, 100], [1, -100], [2, -200], [-2, -100], [1, 200], [-2, 100], [1, -200]]
        targets = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0]
        if noisy:
            targets[1] = 0
        validation = [[.5, 50], [1.5, 150], [-.5, -50], [.5, -50], [-1.5, 150], [-.5, 50]]
        validation_targets = [1, 1, 1, 0, 0, 0]
        test = [[.75, 75], [-.75, -75], [.75, -75], [-.75, 75]]
        test_targets = [1, 1, 0, 0]
    grid = [[first, second * (100 if kind == "rbf" else 1)] for first in [-2., -1., 0., 1., 2.] for second in [-2., -1., 0., 1., 2.]]
    return {"id": identity, "provenance": "Original fictional CC0-1.0 customer activity/risk coordinates;no personal records,uploads or external data.", "feature_order": ["pre_prediction_activity_index", "pre_prediction_contact_index"], "feature_units": ["fictional index units", "fictional index units" if kind == "linear" else "fictional index expressed at100-times the first axis scale"], "target": "0=stays;1=churns;mathematical sign encoding0->-1,1->+1",
            "training": {"inputs": training, "targets": targets, "ids": [f"{identity}.train.{index}" for index in range(len(training))]},
            "validation": {"inputs": validation, "targets": validation_targets, "ids": [f"{identity}.validation.{index}" for index in range(6)]},
            "sealed_test": {"inputs": test, "targets": test_targets, "ids": [f"{identity}.test.{index}" for index in range(4)], "policy": "Never evaluated or used to choose parameters in this generator;strip from client replay in future implementation."},
            "plot_queries": {"inputs": grid, "ids": [f"{identity}.query.{index}" for index in range(25)], "policy": "25 reviewed sample points,not a dense mesh or exact continuous contour;classes/scores have numerical alternatives."}}


def kernel(left, right, kind, gamma):
    return np.asarray([[sum(float(a) * float(b) for a, b in zip(first, second)) if kind == "linear" else math.exp(-gamma * sum((float(a) - float(b)) ** 2 for a, b in zip(first, second))) for second in right] for first in left])


def metrics(targets, predicted):
    groups = [sum(int(target == label and prediction == label) for target, prediction in zip(targets, predicted)) / sum(int(target == label) for target in targets) for label in [0, 1]]
    accuracy = sum(int(target == prediction) for target, prediction in zip(targets, predicted)) / len(targets)
    balanced = sum(groups) / 2
    close(balanced, balanced_accuracy_score(targets, predicted))
    confusion = [[sum(int(target == actual and prediction == chosen) for target, prediction in zip(targets, predicted)) for chosen in [0, 1]] for actual in [0, 1]]
    assert confusion == confusion_matrix(targets, predicted, labels=[0, 1]).tolist()
    return {"accuracy": accuracy, "balanced_accuracy": balanced, "confusion_actual_rows_predicted_columns": confusion}


def fit_config(data, kind, strength, gamma, scaled, weighting="none"):
    raw = np.asarray(data["training"]["inputs"], dtype=float)
    targets = np.asarray(data["training"]["targets"])
    signs = 2 * targets - 1
    if scaled:
        scaler = StandardScaler(copy=True, with_mean=True, with_std=True).fit(raw)
        mean = [sum(float(row[index]) for row in raw) / len(raw) for index in range(2)]
        variance = [sum((float(row[index]) - mean[index]) ** 2 for row in raw) / len(raw) for index in range(2)]
        scale = [math.sqrt(value) if value > 0 else 1. for value in variance]
        close(scaler.mean_, mean)
        close(scaler.var_, variance)
        close(scaler.scale_, scale)
        mean, scale = scaler.mean_.tolist(), scaler.scale_.tolist()
        preprocessing = {"kind": "StandardScaler", "mean": mean, "population_variance": scaler.var_.tolist(), "scale": scale, "fit_ids": data["training"]["ids"]}
    else:
        scaler = None
        mean, scale = [0., 0.], [1., 1.]
        preprocessing = {"kind": "identity", "mean": mean, "scale": scale, "fit_ids": []}
    transformed = (raw - mean) / scale
    if scaler is not None:
        close(transformed, scaler.transform(raw))
        transformed = scaler.transform(raw)
    class_weight = None if weighting == "none" else "balanced" if weighting == "balanced" else {0: 1., 1: 3.}
    model = SVC(C=strength, kernel=kind, gamma=gamma, probability=False, shrinking=False, tol=1e-6, cache_size=64, class_weight=class_weight, verbose=False, max_iter=200000, decision_function_shape="ovr", break_ties=False, random_state=SEED)
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        model.fit(transformed, targets)
    assert model.fit_status_ == 0
    assert all(issubclass(item.category, FutureWarning) and "probability" in str(item.message) for item in caught)
    assert model.classes_.tolist() == [0, 1]
    support = model.support_.tolist()
    dual = model.dual_coef_[0]
    support_points = transformed[support]
    close(support_points, model.support_vectors_)
    training_gram = kernel(transformed, transformed, kind, gamma)
    if kind == "rbf":
        close(training_gram, rbf_kernel(transformed, transformed, gamma=gamma))
    alpha = np.zeros(len(targets))
    alpha[support] = np.abs(dual)
    close(dual, alpha[support] * signs[support])
    assert abs(sum(alpha * signs)) <= 1e-7
    counts = [int(sum(targets == label)) for label in [0, 1]]
    weights = [1., 1.] if weighting == "none" else [len(targets) / (2 * count) for count in counts] if weighting == "balanced" else [1., 3.]
    close(model.class_weight_, weights)
    bounds = np.asarray([strength * weights[int(label)] for label in targets])
    assert np.all(alpha >= 0) and np.all(alpha <= bounds + ALPHA_TOL)
    signed_coefficients = alpha * signs
    norm_squared = float(signed_coefficients @ training_gram @ signed_coefficients)
    assert norm_squared > 0
    training_score = kernel(transformed, support_points, kind, gamma) @ dual + model.intercept_[0]
    margins = signs * training_score
    hinge = np.maximum(0., 1 - margins)
    close(float(np.mean(hinge)), hinge_loss(targets, training_score, labels=[0, 1]))
    kkt = []
    for index, coefficient in enumerate(alpha):
        if coefficient <= ALPHA_TOL:
            violation = max(0., 1 - margins[index])
            status = "zero-alpha"
        elif bounds[index] - coefficient <= ALPHA_TOL:
            violation = max(0., margins[index] - 1)
            status = "at-C-bound"
        else:
            violation = abs(margins[index] - 1)
            status = "free-support"
        assert violation <= KKT_TOL, (kind, strength, gamma, violation)
        kkt.append({"id": data["training"]["ids"][index], "alpha": float(coefficient), "C_i": float(bounds[index]), "status": status, "functional_margin": float(margins[index]), "hinge": float(hinge[index]), "kkt_violation": float(violation), "solver_support": index in support})
    primal = .5 * norm_squared + float(sum(bounds * hinge))
    dual_objective = float(sum(alpha)) - .5 * norm_squared
    gap = primal - dual_objective
    assert gap >= -KKT_TOL and gap <= KKT_TOL * max(1., primal), (kind, strength, gamma, gap)
    outputs = {}
    for partition, values in [("training", data["training"]), ("validation", data["validation"]), ("plot_queries", data["plot_queries"])]:
        inputs = (np.asarray(values["inputs"], dtype=float) - mean) / scale
        if scaler is not None:
            close(inputs, scaler.transform(values["inputs"]))
            inputs = scaler.transform(values["inputs"])
        similarities = kernel(inputs, support_points, kind, gamma)
        expected_score = similarities @ dual + model.intercept_[0]
        actual_score = model.decision_function(inputs)
        close(expected_score, actual_score)
        predicted = model.predict(inputs)
        assert np.array_equal((actual_score >= 0).astype(int), predicted)
        clear = np.abs(expected_score) > 1e-9
        assert np.array_equal((expected_score[clear] >= 0).astype(int), predicted[clear])
        output = {"ids": values["ids"], "scaled_inputs": inputs.tolist(), "decision_scores": actual_score.tolist(), "manual_kernel_scores": expected_score.tolist(), "predictions": predicted.tolist(), "near_boundary_indices": np.flatnonzero(np.abs(expected_score) <= 1e-9).tolist()}
        if "targets" in values:
            output["metrics"] = metrics(values["targets"], predicted)
        if kind == "linear":
            coefficient = np.asarray(model.coef_[0])
            close(coefficient, dual @ support_points)
            close(inputs @ coefficient + model.intercept_[0], actual_score)
            output["signed_geometric_distance_in_fitted_space"] = (actual_score / np.linalg.norm(coefficient)).tolist()
        outputs[partition] = output
    identity = f"{data['id']}.{kind}.C-{strength}.gamma-{gamma}.{'scaled' if scaled else 'raw'}.weights-{weighting}"
    result = {"id": identity, "fixture_id": data["id"], "kind": "fitted", "controls": {"kernel": kind, "C": strength, "gamma": gamma, "scaling": "training-standard" if scaled else "none", "class_weight": weighting}, "settings": {"probability": False, "shrinking": False, "tol": 1e-6, "max_iter": 200000, "cache_size_mb": 64, "random_state": SEED, "decision_function_shape": "ovr", "break_ties": False}, "class_weights_in_class_order": weights, "training_class_counts": counts, "preprocessing": preprocessing, "fit_ids": data["training"]["ids"], "class_order": [0, 1], "intercept": float(model.intercept_[0]), "support_indices": support, "support_ids": [data["training"]["ids"][index] for index in support], "support_coordinates_fitted_space": support_points.tolist(), "dual_coefficients": dual.tolist(), "support_counts_by_class": model.n_support_.tolist(), "fit_status": int(model.fit_status_), "iterations": model.n_iter_.tolist(), "warnings": sorted(set(str(item.message) for item in caught)), "outputs": outputs, "training_kernel_gram": training_gram.tolist(), "kkt_rows": kkt, "rkhs_norm_squared": norm_squared, "primal_objective": primal, "dual_objective": dual_objective, "primal_dual_gap": gap}
    if kind == "linear":
        result.update({"coefficient": model.coef_[0].tolist(), "canonical_margin_slab_width_in_fitted_space": 2 / math.sqrt(norm_squared), "margin_presentation": "True geometric distance in declared fitted feature units;not an arbitrary pixel width. Manual score rescaling changes canonical F=±1 slab,not the F=0 boundary."})
    else:
        result["kernel_probe"] = {"pair": [data["training"]["ids"][0], data["training"]["ids"][1]], "squared_distance_fitted_space": float(sum((transformed[0] - transformed[1]) ** 2)), "log_similarity": -gamma * float(sum((transformed[0] - transformed[1]) ** 2)), "similarity": float(training_gram[0, 1]), "numerical_underflow": bool(training_gram[0, 1] == 0), "interpretation": "Similarity,not a measured new input column,original-space margin distance or calibrated probability. Finite negative log similarity can exponentiate numerically to0 through underflow,not theoretical zero similarity."}
    query_index = 2 if data["id"].startswith("sv.linear.") else 0
    result.update({"prediction_query_id": data["validation"]["ids"][query_index], "prediction_input": data["validation"]["inputs"][query_index], "prediction_question": f"For validation query{data['validation']['ids'][query_index]} at{data['validation']['inputs'][query_index]},predict class0 or class1 before revealing scores,margin/kernel evidence and validation errors.", "correct_prediction_id": f"class-{outputs['validation']['predictions'][query_index]}", "prediction_options": [{"id": "class-0", "label": "Class0:stays"}, {"id": "class-1", "label": "Class1:churns"}, {"id": "invalid", "label": "Unsupported configuration"}], "correct_reason_id": "mechanism", "reason_options": [{"id": "mechanism", "label": "Use the fitted decision sign in its declared feature space;C/kernel/scaling change the fit,not calibrated probabilities."}, {"id": "probability", "label": "The decision score is automatically P(churn)."}, {"id": "test", "label": "Use final-test labels to choose the boundary."}], "explanation": "C weights hinge violations relative to the norm penalty;support vectors have nonzero dual coefficients. Linear scores define geometric distances after norm normalization. RBF scores combine similarities to supports in the declared scaled space. Training fits parameters;validation compares them;test remains sealed.", "counterexample": "Larger C or more local gamma need not improve validation. A high score or large margin does not certify calibrated risk or reliability under shift."})
    return result


def manual(data, name, coefficient, intercept):
    inputs = np.asarray(data["validation"]["inputs"], dtype=float)
    scores = inputs @ coefficient + intercept
    norm = math.sqrt(sum(value * value for value in coefficient))
    distance = (scores / norm).tolist() if norm else {"tag": "undefined", "reason": "zero-normal-vector"}
    decisions = ["on-boundary" if score == 0 else "class-1" if score > 0 else "class-0" for score in scores]
    signs = 2 * np.asarray(data["validation"]["targets"]) - 1
    return {"id": f"sv-e1.manual.{name}.v1", "fixture_id": data["id"], "kind": "manual-geometry", "controls": {"coefficient": coefficient, "intercept": intercept}, "decision_scores": scores.tolist(), "signed_distance": distance, "unsigned_distance": np.abs(distance).tolist() if norm else distance, "functional_margins": (signs * scores).tolist(), "hinge": np.maximum(0, 1 - signs * scores).tolist(), "canonical_slab_width": 2 / norm if norm else distance, "decisions": decisions, "solver_support_ids": {"tag": "unavailable", "reason": "illustration-not-a-fitted-model"}, "prediction_query_id": data["validation"]["ids"][2], "prediction_input": data["validation"]["inputs"][2], "prediction_question": "For validation point(.5,-.5),predict its side of the manually supplied boundary,or undefined geometry if its normal vector is zero.", "correct_prediction_id": decisions[2] if norm else "undefined", "prediction_options": [{"id": "class-0", "label": "Negative side"}, {"id": "class-1", "label": "Positive side"}, {"id": "on-boundary", "label": "On the boundary"}, {"id": "undefined", "label": "Undefined geometric distance:zero normal"}], "correct_reason_id": "mechanism", "reason_options": [{"id": "mechanism", "label": "Normalize score by the nonzero normal-vector norm;manual movement is not a fitted optimum or calibrated risk."}, {"id": "probability", "label": "Distance is automatically P(churn)."}, {"id": "test", "label": "Use test labels to select the most attractive line."}], "explanation": "This is authored geometry,not SVC training. Rescaling w and b preserves boundary and normalized distance but changes functional scores and canonical F=±1 slab. A zero normal has undefined distance. No solver support membership is invented.", "counterexample": "w=(1,0) and(2,0),b=0 separate the same points with equal point-to-boundary distances but different raw scores."}


def rejection(experiment, reason):
    return {"id": f"{experiment.lower()}.reject.{reason}.v1", "kind": "rejected", "reason": reason, "expected": {"tag": "invalid", "prediction": None, "score": None, "support_ids": None}, "prediction_question": "Is this configuration allowed,or must it reject before fitting?", "correct_prediction_id": "invalid", "prediction_options": [{"id": "invalid", "label": "Reject before fitting"}, {"id": "class-0", "label": "Invent class0"}, {"id": "class-1", "label": "Invent class1"}], "correct_reason_id": "mechanism", "reason_options": [{"id": "mechanism", "label": "Only approved parameters and training/fold fit boundaries are permitted;test cannot guide selection."}, {"id": "probability", "label": "SVM scores are calibrated probabilities regardless of workflow."}, {"id": "test", "label": "Strong test feedback permits all configurations."}], "explanation": "Reject unsupported numerical parameters or invalid global/test-derived fitting before replay. No prediction,score or support IDs are fabricated.", "counterexample": "A high apparent score cannot repair leaked scaling or test-tuned hyperparameters."}


def manifest(experiment, datasets, configs, objectives):
    assert len(configs) <= 64 and len({config["id"] for config in configs}) == len(configs)
    return {"schema": "svm.experiment.v1", "id": f"{experiment}.v1", "objectives": objectives, "prerequisites": ["dot-products", "norms", "regularization", "classification-evaluation", "training-only-and-fold-only-preparation"], "datasets": datasets, "configurations": configs, "interaction": ["choose a reviewed finite configuration", "predict before reveal", "reveal numerical and visual result", "change meaningful control and predict again", "select supported post-observation explanation"], "accessibility": "Native labeled selectors/buttons;visible focus;wrapping numeric tables of input/score/class/hinge/support or kernel similarity;concise result summary. No color,hover or animation-only meaning. Exact labels/units/fit IDs accompany every diagram. At most25 plotted query points plus training/validation inputs;no21x21 mesh.", "selection": "Validation balanced accuracy,larger is better;within1e-12 ties choose the first entry in the frozen candidate order. Test is not evaluated. Selection is over the explicitly frozen candidate subset,not an unbounded search or guaranteed generalization."}


def selection(configs):
    candidates = [config for config in configs if config["kind"] == "fitted"]
    records = []
    for fixture_id in sorted(set(config["fixture_id"] for config in candidates)):
        subset = [config for config in candidates if config["fixture_id"] == fixture_id]
        best = max(config["outputs"]["validation"]["metrics"]["balanced_accuracy"] for config in subset)
        chosen = next(config for config in subset if abs(config["outputs"]["validation"]["metrics"]["balanced_accuracy"] - best) <= 1e-12)
        records.append({"fixture_id": fixture_id, "candidate_ids_in_tie_order": [config["id"] for config in subset], "selected_id": chosen["id"], "validation_balanced_accuracy": best, "test_evaluated": False})
    return records


def main():
    linear_data = [fixture("linear", noisy) for noisy in [False, True]]
    nonlinear_data = [fixture("rbf", noisy) for noisy in [False, True]]
    first_configs = [fit_config(data, "linear", strength, 1., False) for data in linear_data for strength in [.1, 1., 10.]]
    first_configs += [manual(linear_data[0], name, coefficient, intercept) for name, coefficient, intercept in [("reference", [1., 0.], 0.), ("rescaled", [2., 0.], 0.), ("move-left", [1., 0.], 1.), ("move-right", [1., 0.], -1.), ("rotated", [1., 1.], 0.), ("zero-normal", [0., 0.], 0.)]]
    first_configs += [rejection("SV-E1", reason) for reason in ["nonpositive-C", "nonfinite-boundary", "test-tuned-boundary"]]
    second_configs = [fit_config(data, "rbf", strength, gamma, scaled) for data in nonlinear_data for strength in [.1, 1., 10.] for gamma in [.1, 1., 4.] for scaled in [False, True]]
    second_configs += [fit_config(nonlinear_data[1], "rbf", 1., 1., True, weighting) for weighting in ["balanced", "positive-three"]]
    second_configs += [fit_config(data, "linear", 1., 1., True) for data in nonlinear_data]
    second_configs += [rejection("SV-E2", reason) for reason in ["nonpositive-gamma", "globally-fitted-scaling", "test-tuned-C-gamma"]]
    first = manifest("SV-E1", linear_data, first_configs, ["SV01", "SV02", "SV05"])
    second = manifest("SV-E2", nonlinear_data, second_configs, ["SV03", "SV04", "SV05"])
    first["validation_selection"] = selection(first_configs)
    second["validation_selection"] = selection(second_configs)
    reference, rescaled = first_configs[6:8]
    close(reference["signed_distance"], rescaled["signed_distance"])
    close(reference["decision_scores"], np.asarray(rescaled["decision_scores"]) / 2)
    assert first_configs[11]["signed_distance"] == {"tag": "undefined", "reason": "zero-normal-vector"}
    constant = StandardScaler().fit([[1., 2.], [3., 2.]])
    close(constant.var_, [1., 0.])
    close(constant.scale_, [1., 1.])
    close(math.exp(-1.), rbf_kernel([[0., 0.]], [[1., 0.]], gamma=1.)[0, 0])
    fitted = [config for config in first_configs + second_configs if config["kind"] == "fitted"]
    report = {"schema": "svm.parity.v1", "python": platform.python_version(), "dependencies": PROFILE, "platform": platform.platform(), "seed": SEED, "experiment_counts": {"SV-E1": len(first_configs), "SV-E2": len(second_configs)}, "fitted_states": len(fitted), "manual_states": 6, "rejection_states": 6, "all_fit_status_zero": True, "max_kkt_violation": max(row["kkt_violation"] for config in fitted for row in config["kkt_rows"]), "max_primal_dual_gap": max(config["primal_dual_gap"] for config in fitted), "checks": ["independent scaler population means/variances", "manual linear/RBF kernels versus sklearn", "manual dual score versus all decision functions", "binary class sign including exact-zero native tie", "dual feasibility,KKT and primal-dual objective checks", "exact support IDs and coordinates", "manual geometry,hinge and zero-normal undefined state", "balanced accuracy and confusion arithmetic", "validation-only candidate/tie selection", "sealed test never predicted or evaluated"], "not_verified": ["application implementation", "100 future scored exercise instances", "notebook kernels", "screen reader", "browser zoom", "Google Colab", "original-directory I/O reliability"]}
    baseline = json.loads((ROOT / "outputs/task-015-9/source-equality.json").read_text())["sha256"]
    changed = [name for name, expected in baseline.items() if digest((ROOT / name).read_bytes()) != expected]
    assert not changed, changed
    preservation = {"schema": "svm.source-preservation.v1", "baseline": "outputs/task-015-9/source-equality.json", "checked_files": len(baseline), "changed_files": changed, "learner_storage_accessed": False, "original_directory_io_reliability": "OPEN"}
    files = {"sv-e1.manifest.v1.json": encode(first), "sv-e2.manifest.v1.json": encode(second), "parity-report.v1.json": encode(report), "source-preservation.v1.json": encode(preservation)}
    lock = {"schema": "svm.freeze.v1", "sha256": {name: digest(value) for name, value in files.items()}, "generator_sha256": digest(Path(__file__).read_bytes()), "conventions_sha256": digest((DEST / "SOLVER_MARGIN_KERNEL_CONVENTIONS.md").read_bytes())}
    files["freeze-lock.v1.json"] = encode(lock)
    if "--check" in sys.argv:
        for name, value in files.items():
            assert (DEST / name).read_bytes() == value, name
        print(f"PASS byte-identical regeneration:{len(first_configs)}/{len(second_configs)} configurations,{len(fitted)} fitted states;all frozen hashes unchanged")
    else:
        for name, value in files.items():
            (DEST / name).write_bytes(value)
        print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
