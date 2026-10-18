"""Trusted offline Logistic experiment authoring; no learner input or application execution."""
import hashlib
import importlib.metadata
import json
import math
import platform
import sys
import warnings
from pathlib import Path

import numpy as np
from scipy.special import expit
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, log_loss, precision_score, recall_score
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/logistic"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1"}
EPSILON = float(np.finfo(np.float64).eps)
TRAINING = np.array([[-2, -1], [-1.5, 1], [-1, 0], [-.5, -1], [.5, 1], [1, 0], [1.5, -1], [2, 1]], dtype=float)
TARGETS = np.array([0, 0, 1, 0, 1, 0, 1, 1])
DEVELOPMENT = np.array([[-1.2, .5], [-.2, -1], [.8, .5], [1.8, 0]], dtype=float)
DEVELOPMENT_TARGETS = np.array([0, 1, 0, 1])
TRAINING_IDS = [f"lg-train{index}" for index in range(1, 9)]
DEVELOPMENT_IDS = [f"lg-dev{index}" for index in range(1, 5)]


def close(actual, expected, tolerance=1e-9):
    assert np.allclose(actual, expected, atol=tolerance, rtol=tolerance), (actual, expected)


def tagged_divide(numerator, denominator, reason):
    return numerator / denominator if denominator else {"tag": "undefined", "reason": reason}


def probability_loss(target, probability):
    observed_probability = probability if target == 1 else 1 - probability
    return -math.log(observed_probability) if observed_probability else {"tag": "infinity", "sign": "positive", "reason": "zero-probability-observed-outcome"}


def probability_odds(probability):
    if probability == 1:
        return {"tag": "infinity", "sign": "positive", "reason": "probability-one"}
    return probability / (1 - probability)


def probability_log_odds(probability):
    if probability in (0, 1):
        return {"tag": "infinity", "sign": "negative" if probability == 0 else "positive", "reason": "probability-endpoint"}
    return math.log(probability / (1 - probability))


def evaluate(targets, probabilities, threshold, false_negative_cost=1):
    assert len(targets) == len(probabilities) > 0
    assert all(target in (0, 1) for target in targets)
    assert all(math.isfinite(value) and 0 <= value <= 1 for value in probabilities)
    predicted = [int(value >= threshold) for value in probabilities]
    true_positive = sum(target == 1 and guess == 1 for target, guess in zip(targets, predicted))
    false_positive = sum(target == 0 and guess == 1 for target, guess in zip(targets, predicted))
    true_negative = sum(target == 0 and guess == 0 for target, guess in zip(targets, predicted))
    false_negative = sum(target == 1 and guess == 0 for target, guess in zip(targets, predicted))
    precision = tagged_divide(true_positive, true_positive + false_positive, "no-predicted-positives")
    recall = tagged_divide(true_positive, true_positive + false_negative, "no-actual-positives")
    f1 = tagged_divide(2 * true_positive, 2 * true_positive + false_positive + false_negative, "zero-f1-denominator")
    contributions = [probability_loss(target, probability) for target, probability in zip(targets, probabilities)]
    mathematical_loss = {"tag": "infinity", "sign": "positive", "reason": "zero-probability-observed-outcome"} if any(isinstance(value, dict) for value in contributions) else sum(contributions) / len(targets)
    clipped = [min(1 - EPSILON, max(EPSILON, value)) for value in probabilities]
    clipped_loss = sum(-math.log(value if target else 1 - value) for target, value in zip(targets, clipped)) / len(targets)
    close(clipped_loss, log_loss(targets, np.array(probabilities, dtype=np.float64), labels=[0, 1]))
    matrix = [[true_negative, false_positive], [false_negative, true_positive]]
    assert confusion_matrix(targets, predicted, labels=[0, 1]).tolist() == matrix
    accuracy = (true_positive + true_negative) / len(targets)
    close(accuracy, accuracy_score(targets, predicted))
    for mathematical, library in [(precision, precision_score(targets, predicted, zero_division=np.nan)), (recall, recall_score(targets, predicted, zero_division=np.nan)), (f1, f1_score(targets, predicted, zero_division=np.nan))]:
        assert math.isnan(library) if isinstance(mathematical, dict) else math.isclose(mathematical, library, abs_tol=1e-12)
    assert false_positive + false_negative_cost * false_negative == sum((target != guess) * (false_negative_cost if target else 1) for target, guess in zip(targets, predicted))
    return {"predictions": predicted, "confusion_actual_rows_01": matrix,
            "tp": true_positive, "fp": false_positive, "tn": true_negative, "fn": false_negative,
            "precision": precision, "recall": recall, "f1": f1, "accuracy": accuracy,
            "prevalence": sum(targets) / len(targets), "total_cost": false_positive + false_negative_cost * false_negative,
            "row_log_loss": contributions, "mathematical_log_loss": mathematical_loss,
            "library_float64_clipped_log_loss": float(clipped_loss), "clipping_epsilon": EPSILON}


def fit(strength, training_indices=None):
    indices = np.arange(len(TARGETS)) if training_indices is None else training_indices
    features, targets = TRAINING[indices], TARGETS[indices]
    scaler = StandardScaler().fit(features)
    design = scaler.transform(features)
    estimator = LogisticRegression(C=strength, solver="lbfgs", l1_ratio=0.0, tol=1e-10, max_iter=2000,
                                   fit_intercept=True, class_weight=None, random_state=1729, warm_start=False)
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        estimator.fit(design, targets)
    assert not caught, [str(item.message) for item in caught]
    assert estimator.classes_.tolist() == [0, 1] and estimator.n_iter_[0] < 2000
    coefficients, intercept = estimator.coef_[0], float(estimator.intercept_[0])
    raw_coefficients = coefficients / scaler.scale_
    raw_intercept = float(intercept - raw_coefficients @ scaler.mean_)
    scores = design @ coefficients + intercept
    probabilities = expit(scores)
    close(probabilities, estimator.predict_proba(design)[:, 1])
    gradient = design.T @ (probabilities - targets) / len(targets) + coefficients / (strength * len(targets))
    assert float(np.max(np.abs(gradient))) < 1e-7
    assert abs(float(np.mean(probabilities - targets))) < 1e-7
    training_loss = float(np.mean(np.logaddexp(0, scores) - targets * scores))
    penalty = float(coefficients @ coefficients / (2 * strength * len(targets)))
    def predictions(rows):
        transformed = scaler.transform(rows)
        logits = transformed @ coefficients + intercept
        positive = estimator.predict_proba(transformed)[:, 1]
        close(logits, estimator.decision_function(transformed))
        close(logits, np.array(rows) @ raw_coefficients + raw_intercept)
        close(positive, expit(logits))
        close(positive, [1 / (1 + math.exp(-float(value))) for value in logits])
        return logits.tolist(), positive.tolist()
    train_scores, train_probabilities = predictions(features)
    dev_scores, dev_probabilities = predictions(DEVELOPMENT)
    fold_data = {"coefficients": coefficients.tolist(), "intercept": intercept, "raw_coefficients": raw_coefficients.tolist(), "raw_intercept": raw_intercept, "classes": [0, 1],
                 "scaler_mean": scaler.mean_.tolist(), "scaler_scale": scaler.scale_.tolist(),
                 "scaler_fit_ids": [TRAINING_IDS[index] for index in indices], "estimator_fit_ids": [TRAINING_IDS[index] for index in indices],
                 "training_logits": train_scores, "training_probabilities": train_probabilities,
                 "training_metrics": evaluate(targets.tolist(), train_probabilities, .5),
                 "development_logits": dev_scores, "development_probabilities": dev_probabilities,
                 "development_metrics": evaluate(DEVELOPMENT_TARGETS.tolist(), dev_probabilities, .5),
                 "objective": {"mean_log_loss": training_loss, "l2_penalty": penalty, "total": training_loss + penalty},
                 "convergence": {"warnings": [], "iterations": int(estimator.n_iter_[0]), "max_absolute_gradient": float(np.max(np.abs(gradient))), "mean_intercept_gradient": float(np.mean(probabilities - targets))}}
    return fold_data, predictions, estimator, scaler


def config(identity, fixture, controls, expected, reason, why, counterexample):
    return {"id": identity, "fixture": fixture, "controls": controls, "expected": expected, "explanation_id": reason,
            "explanation": why, "counterexample": counterexample,
            "text_alternative": "Read ordered input contributions, scores/probabilities, named classes, exact counts and tagged loss/undefined outcomes; no graphic or color is required."}


def generate():
    first_states, first_fixtures = [], []
    for coefficient in [1, 2]:
        for input_name, coordinate in [("negative-tail", -20.0), ("negative-ln3", -math.log(3)), ("zero", 0.0), ("positive-ln3", math.log(3)), ("positive-tail", 20.0)]:
            for target in [0, 1]:
                fixture_id = f"LG.authored.w{coefficient}.{input_name}.y{target}.v1"
                score = coefficient * coordinate
                probability = float(expit(score))
                close(probability, 1 / (1 + math.exp(-score)))
                stable_loss = float(np.logaddexp(0, -score if target else score))
                score_gradient = -float(expit(-score)) if target else probability
                delta = 1e-5
                signed_score = -score if target else score
                difference = (float(np.logaddexp(0, signed_score + delta)) - float(np.logaddexp(0, signed_score - delta))) / (2 * delta)
                close(score_gradient, -difference if target else difference, 1e-7)
                weight_gradient = score_gradient * coordinate
                step_weight = coefficient - .1 * weight_gradient
                step_intercept = -.1 * score_gradient
                next_score = step_weight * coordinate + step_intercept
                close(float(expit(next_score)), 1 / (1 + math.exp(-next_score)))
                first_fixtures.append({"id": fixture_id, "kind": "authored-weights-not-fitted", "input": [coordinate], "coefficients": [coefficient], "intercept": 0, "label": target, "unit": "dimensionless feature; logit dimensionless", "threshold": .5, "gradient_step": {"learning_rate": .1, "penalty": "none", "training_row_only": True}})
                curve_min, curve_max = min(-8.0, score), max(8.0, score)
                curve = [[float(value), float(expit(value))] for value in np.linspace(curve_min, curve_max, 21)]
                for coordinate_score, coordinate_probability in curve:
                    close(coordinate_probability, 1 / (1 + math.exp(-coordinate_score)))
                expected = {"score": score, "sigmoid_samples": curve, "curve_score_axis": [curve_min, curve_max], "probability_float64": probability, "probability_semantics": "rounded-float-endpoint; finite-logit mathematical probability is interior" if probability in (0, 1) else "interior",
                            "odds_from_finite_logit": math.exp(score), "log_odds_from_finite_logit": score,
                            "odds_from_stored_probability": probability_odds(probability), "log_odds_from_stored_probability": probability_log_odds(probability),
                            "stable_mathematical_loss_from_finite_logit": stable_loss,
                            "evaluation_of_stored_probability": evaluate([target], [probability], .5),
                            "gradient": {"score": score_gradient, "weight": weight_gradient, "intercept": score_gradient, "next_weight": step_weight, "next_intercept": step_intercept, "next_score": next_score, "next_probability": float(expit(next_score))}}
                first_states.append(config(f"LG-E1.{fixture_id}", fixture_id, {"coefficient": coefficient, "input": input_name, "target": target}, expected, "score-probability-learning", "The weighted score becomes a probability; the label determines log loss and the training signal. A threshold acts after prediction, not as parameter fitting. Finite-logit stable loss and saturated stored-probability loss are explicitly distinct.", "The same hard label can have a different loss when confidence changes; a tiny training-row update is not the sklearn optimizer or proof of generalization."))
    fitted_fixture = "LG.fitted-churn.v1"
    first_fixtures.append({"id": fitted_fixture, "kind": "reference-trained", "fictional": True, "feature_names": ["usage_change", "support_activity"], "units": ["dimensionless", "dimensionless"], "training": {"ids": TRAINING_IDS, "x": TRAINING.tolist(), "y": TARGETS.tolist()}, "development": {"ids": DEVELOPMENT_IDS, "x": DEVELOPMENT.tolist(), "y": DEVELOPMENT_TARGETS.tolist()}, "test_targets": "not exposed"})
    for strength in [.1, 1, 10]:
        fitted, predict, estimator, scaler = fit(strength)
        folds = []
        for fold_number, (train_indices, held_indices) in enumerate(StratifiedKFold(3, shuffle=True, random_state=1729).split(TRAINING, TARGETS)):
            fold_fit, fold_predict, _, _ = fit(strength, train_indices)
            _, probabilities = fold_predict(TRAINING[held_indices])
            held_ids = [TRAINING_IDS[index] for index in held_indices]
            assert set(held_ids).isdisjoint(fold_fit["scaler_fit_ids"])
            folds.append({"fold": fold_number, "held_ids": held_ids, "scaler_fit_ids": fold_fit["scaler_fit_ids"], "estimator_fit_ids": fold_fit["estimator_fit_ids"], "scaler_mean": fold_fit["scaler_mean"], "held_metrics": evaluate(TARGETS[held_indices].tolist(), probabilities, .5), "convergence": fold_fit["convergence"]})
        for query_id, query in [("q1", [.5, 1]), ("q2", [2, -1])]:
            logits, probabilities = predict([query])
            expected = {**fitted, "query": query, "query_score": logits[0], "query_probability": probabilities[0], "query_label_ge_half": int(probabilities[0] >= .5), "folds": folds, "predict_proba_shape": [1, 2], "selection_permission": "development only; final-test feedback forbidden"}
            first_states.append(config(f"LG-E1.fit.C{strength}.{query_id}", fitted_fixture, {"C": strength, "query": query_id, "solver": "lbfgs", "l1_ratio": 0.0}, expected, "inverse-c-training-only", "Larger C means weaker L2 preference under the declared normalization. Scaler/model parameters use training rows; each CV fold fits them separately. Inspect actual held-out scores, not a promise that weaker or stronger penalties always improve.", "A small training loss does not guarantee a good unseen probability; selecting C with test labels invalidates final evaluation."))
    for diagnostic in ["nonpositive-C", "lbfgs-L1-unsupported"]:
        parameters = {"C": 0, "solver": "lbfgs", "l1_ratio": 0.0} if diagnostic == "nonpositive-C" else {"C": 1, "solver": "lbfgs", "l1_ratio": 1.0}
        try:
            LogisticRegression(**parameters).fit(TRAINING, TARGETS)
            raise AssertionError("Unsupported tuple unexpectedly accepted")
        except ValueError as error:
            rejection_class = type(error).__name__
        first_states.append(config(f"LG-E1.invalid.{diagnostic}", fitted_fixture, {"diagnostic": diagnostic}, {"status": {"tag": "unsupported", "reason": diagnostic}, "model_fitted": False, "reference_rejection_class": rejection_class}, "reject-unsupported-model", "Reject the unsupported authored solver/parameter tuple without fitting. Positive finite C and the verified L2/lbfgs combination are the only exposed trained model settings.", "A mathematical penalty does not make every solver/penalty combination supported; an error is not a zero-probability prediction."))
    base_targets = [0, 0, 0, 0, 0, 1, 0, 1]
    probability_sets = {"moderate": [.1, .2, .3, .4, .5, .6, .8, .9], "cautious": [.4, .45, .46, .48, .5, .51, .55, .6], "sharp": [.01, .02, .03, .04, .5, .7, .99, .999]}
    second_fixtures, second_states = [], []
    for name, probabilities in probability_sets.items():
        fixture_id = f"LG.fixed-probabilities.{name}.v1"
        second_fixtures.append({"id": fixture_id, "fictional": True, "provenance": "authored fixed development outputs; not a claimed trained model", "ids": [f"lg-action{index}" for index in range(1, 9)], "declared_fit_ids": [f"lg-action-train{index}" for index in range(1, 5)], "prediction_day": 0, "eligible_feature_day": -7, "target_window_days": [1, 30], "y": base_targets, "probabilities": probabilities, "majority_baseline": evaluate(base_targets, [0.0] * 8, .5), "positive_label": "1=churns;0=stays"})
        for threshold in [0, .5, .6, 1]:
            for cost in [1, 5]:
                second_states.append(config(f"LG-E2.{name}.t{threshold}.fn{cost}", fixture_id, {"threshold": threshold, "false_positive_cost": 1, "false_negative_cost": cost}, {"metrics": evaluate(base_targets, probabilities, threshold, cost), "probabilities_unchanged": True, "selection_valid": True}, "threshold-development-only", "Probability>=threshold predicts positive, including equality. Threshold changes counts and costs, not probabilities or log loss. Select using development costs, then freeze before final evaluation.", "At threshold.5 all three confidence sets have the same hard labels and accuracy but different probability loss; their identical ranking does not prove calibration."))
    for name, targets, probabilities in [("exact-endpoints", [0, 1, 1, 0], [0.0, 1.0, 0.0, 1.0]), ("no-actual-positives", [0, 0, 0, 0], [0.0, .2, .4, .8])]:
        fixture_id = f"LG.endpoint.{name}.v1"
        second_fixtures.append({"id": fixture_id, "fictional": True, "provenance": "authored metric diagnostic, not finite-logit mathematical endpoints", "ids": [f"lg-edge{index}" for index in range(1, 5)], "y": targets, "probabilities": probabilities})
        for threshold in [0, .5, 1]:
            second_states.append(config(f"LG-E2.{name}.t{threshold}", fixture_id, {"threshold": threshold, "false_positive_cost": 1, "false_negative_cost": 1}, {"metrics": evaluate(targets, probabilities, threshold), "selection_valid": True, "diagnostic_only": True}, "endpoint-and-undefined", "Correct endpoint probability has zero mathematical loss; certainty in the wrong outcome gives tagged infinity. Missing metric denominators are undefined, not silently zero; a clipped library loss is a separate numerical result.", "A library's finite clipped log loss does not make mathematical infinite loss finite, and no actual positives makes recall undefined regardless of accuracy."))
    for violation in ["global-scaler", "target-derived-feature", "test-selected-threshold"]:
        evaluation_ids = [f"lg-action{index}" for index in range(1, 9)]
        fit_ids = [f"lg-action-train{index}" for index in range(1, 5)]
        workflow = {"kind": "authored-permission-diagnostic-not-executed-fit", "estimator_fit_ids": fit_ids,
                    "scaler_fit_ids": fit_ids + evaluation_ids if violation == "global-scaler" else fit_ids,
                    "evaluation_ids": evaluation_ids, "feature_available_day": 30 if violation == "target-derived-feature" else -7,
                    "prediction_day": 0, "threshold_selection_ids": ["lg-final-test1"] if violation == "test-selected-threshold" else evaluation_ids,
                    "final_test_targets": "not exposed"}
        second_states.append(config(f"LG-E2.invalid.{violation}", "LG.fixed-probabilities.moderate.v1", {"threshold": .5, "violation": violation}, {"metrics": evaluate(base_targets, probability_sets["moderate"], .5), "selection_valid": False, "violation": violation, "workflow": workflow}, "reject-leakage", "Reject this evaluation/selection claim despite correct arithmetic: fit preprocessing within each training fold, exclude unavailable target-derived inputs, and never select a threshold from final-test feedback.", "An attractive numerical score cannot establish honest evaluation when the information boundary is violated."))
    def manifest(identity, fixtures, states, lessons):
        assert len(states) <= 64 and len({state["id"] for state in states}) == len(states)
        return {"id": identity, "schema": "supervised.logistic.experiment.v1", "version": "1.0.0", "profile": {"python": platform.python_version(), **PROFILE}, "seed": 1729,
                "learning_question": "How do score, probability, training loss and regularization differ?" if identity == "LG-E1" else "How do threshold decisions, probability quality and evaluation permissions differ?",
                "objectives": [f"LG0{lesson}.O{objective}" for lesson in lessons for objective in range(1, 5)],
                "prerequisites": ["Evaluation Foundations", "Probability and Derivatives", "linear scores and training-only scaling"],
                "positive_class": "1=churns;0=stays", "initial_configuration": states[0]["id"], "fixtures": fixtures, "configurations": states,
                "allowed_controls": "Only complete listed configuration IDs; no free-form weights, thresholds, models or datasets.",
                "prediction_options": ["Probability changes because the linear score changes", "The decision may change without refitting or changing probabilities", "The score cannot justify this evaluation or probability interpretation"],
                "explanation_options": ["score-probability-learning", "inverse-c-training-only", "reject-unsupported-model", "threshold-development-only", "endpoint-and-undefined", "reject-leakage", "training-accuracy-guarantees-risk", "threshold-change-refits-model"],
                "interaction": ["Record prediction before reveal", "Change a meaningful listed configuration", "Reveal exact score/probability or metric tables and synchronized visual", "Choose the supported explanation", "Apply a changed-case bounded transfer"],
                "completion": "Wrong initial predictions are recoverable; changed state plus correct post-observation reasoning is required. Never module mastery.",
                "rejection": "Reject unknown/altered IDs, nonfinite or out-of-domain inputs, arbitrary expressions and unsupported Cartesian tuples. Unsupported model diagnostics are explicit tagged states, never fitted outputs."}
    return [manifest("LG-E1", first_fixtures, first_states, [1, 2, 4]), manifest("LG-E2", second_fixtures, second_states, [3, 5, 6])]


def verify_edges(manifests):
    first, second = manifests
    assert [len(manifest["configurations"]) for manifest in manifests] == [28, 33]
    for manifest in manifests:
        fixture_ids = {fixture["id"] for fixture in manifest["fixtures"]}
        assert len(fixture_ids) == len(manifest["fixtures"])
        for state in manifest["configurations"]:
            assert state["fixture"] in fixture_ids
            assert state["explanation_id"] in manifest["explanation_options"]
    anchor = next(state for state in first["configurations"] if state["id"] == "LG-E1.LG.authored.w1.positive-ln3.y1.v1")
    close(anchor["expected"]["probability_float64"], .75)
    close(anchor["expected"]["odds_from_finite_logit"], 3)
    for state in first["configurations"]:
        expected = state["expected"]
        if "gradient" in expected:
            fixture = next(fixture for fixture in first["fixtures"] if fixture["id"] == state["fixture"])
            assert expected["gradient"]["score"] <= 0 if fixture["label"] else expected["gradient"]["score"] >= 0
            if expected["score"] == 0:
                assert expected["evaluation_of_stored_probability"]["predictions"] == [1]
                close(expected["stable_mathematical_loss_from_finite_logit"], math.log(2))
        if "folds" in expected:
            for fold in expected["folds"]:
                assert set(fold["held_ids"]).isdisjoint(fold["scaler_fit_ids"])
                assert fold["scaler_fit_ids"] == fold["estimator_fit_ids"]
    saturated = next(state for state in first["configurations"] if state["id"] == "LG-E1.LG.authored.w2.positive-tail.y0.v1")["expected"]
    close(saturated["stable_mathematical_loss_from_finite_logit"], 40)
    assert saturated["evaluation_of_stored_probability"]["mathematical_log_loss"]["tag"] == "infinity"
    assert math.isfinite(saturated["evaluation_of_stored_probability"]["library_float64_clipped_log_loss"])
    comparable = [state["expected"]["metrics"] for state in second["configurations"] if state["id"] in [f"LG-E2.{name}.t0.5.fn1" for name in ["moderate", "cautious", "sharp"]]]
    assert len({tuple(metrics["predictions"]) for metrics in comparable}) == 1
    assert len({metrics["accuracy"] for metrics in comparable}) == 1
    assert len({metrics["mathematical_log_loss"] for metrics in comparable}) == 3
    endpoint = next(state for state in second["configurations"] if state["id"] == "LG-E2.exact-endpoints.t1")["expected"]["metrics"]
    assert endpoint["predictions"] == [0, 1, 0, 1]
    assert endpoint["row_log_loss"][0] == endpoint["row_log_loss"][1] == 0
    assert endpoint["row_log_loss"][2]["tag"] == endpoint["row_log_loss"][3]["tag"] == "infinity"
    absent = next(state for state in second["configurations"] if state["id"] == "LG-E2.no-actual-positives.t1")["expected"]["metrics"]
    assert absent["precision"]["tag"] == absent["recall"]["tag"] == absent["f1"]["tag"] == "undefined"
    for state in second["configurations"]:
        if not state["expected"]["selection_valid"]:
            workflow = state["expected"]["workflow"]
            violation = state["expected"]["violation"]
            if violation == "global-scaler":
                assert set(workflow["evaluation_ids"]) <= set(workflow["scaler_fit_ids"])
            elif violation == "target-derived-feature":
                assert workflow["feature_available_day"] > workflow["prediction_day"]
            else:
                assert workflow["threshold_selection_ids"] == ["lg-final-test1"]


def encoded(value):
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False) + "\n").encode()


def main():
    manifests = generate()
    verify_edges(manifests)
    files = {f"lg-e{index}.manifest.v1.json": encoded(manifest) for index, manifest in enumerate(manifests, 1)}
    lock = {"schema": "supervised.logistic.freeze.v1", "files": {name: hashlib.sha256(data).hexdigest() for name, data in files.items()}, "reference_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), "conventions_sha256": hashlib.sha256((DEST / "NUMERICAL_CONVENTIONS.md").read_bytes()).hexdigest(), "profile": {"python": platform.python_version(), **PROFILE}, "scipy": importlib.metadata.version("scipy")}
    if "--check" in sys.argv:
        assert all((DEST / name).read_bytes() == data for name, data in files.items())
        assert json.loads((DEST / "freeze-lock.v1.json").read_text()) == lock
    else:
        assert "--freeze" in sys.argv
        DEST.mkdir(parents=True, exist_ok=True)
        for name, data in files.items():
            (DEST / name).write_bytes(data)
        (DEST / "freeze-lock.v1.json").write_bytes(encoded(lock))
    print(json.dumps({"mode": "check" if "--check" in sys.argv else "freeze", "configurations": [len(manifest["configurations"]) for manifest in manifests], "profile": lock["profile"], "scipy": lock["scipy"], "platform": platform.platform(), "hashes": lock["files"], "checks": "all states: independent arithmetic and trusted scipy/sklearn; trained model stationarity and separate fold fits", "state_ledger": [{"id": state["id"], "status": "verified", "fixture": state["fixture"]} for manifest in manifests for state in manifest["configurations"]], "colab": "UNVERIFIED; no notebook execution"}, indent=2))


if __name__ == "__main__":
    main()
