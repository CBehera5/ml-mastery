"""Trusted offline specification authoring and parity verification; not an app evaluator."""

import argparse
import hashlib
import itertools
import json
import math
import os
import platform
import sys
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib
import sklearn
from sklearn.metrics import (
    accuracy_score, average_precision_score, brier_score_loss, confusion_matrix,
    f1_score, log_loss, mean_absolute_error, mean_squared_error,
    precision_recall_curve, precision_score, r2_score, recall_score, roc_auc_score,
)
from sklearn.model_selection import GroupShuffleSplit, TimeSeriesSplit
from sklearn.preprocessing import StandardScaler

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
PROFILE = {"python": "3.13.16", "numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1"}
TOLERANCE = {"absolute": 1e-9, "relative": 1e-9, "display_significant_digits": 6}
CHECKS = []


def check(condition, description):
    if not condition:
        raise AssertionError(description)
    CHECKS.append(description)


def close(actual, expected, description):
    check(math.isfinite(float(actual)) and math.isfinite(float(expected)) and abs(float(actual) - float(expected)) <= 1e-9 + 1e-9 * abs(float(expected)), description)


def undefined(reason):
    return {"tag": "undefined", "reason": reason}


def infinity(sign, reason):
    return {"tag": "infinity", "sign": sign, "reason": reason}


def ratio(numerator, denominator, reason):
    return numerator / denominator if denominator else undefined(reason)


def dump(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False, indent=2) + "\n"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def make_config(config_id, fixture, controls, prediction, output, why, objectives):
    return {"id": config_id, "fixture": fixture, "controls": controls,
            "prediction_question": prediction, "expected": output, "why": why,
            "objectives": objectives, "text_alternative": {"summary": why, "numerical_source": "expected", "show_input_row_ids": True}}


def e1_manifest():
    prototype = json.loads((ROOT / "apps/web/app/supervised/foundation/authored.json").read_text())
    fixtures = []
    configs = []
    for scene in prototype["scenes"]:
        fixture_id = "ev-e1.split." + scene["id"] + ".v1"
        fixtures.append({"id": fixture_id, "kind": "prediction-permission", "source": "unchanged EV01 authored scene", "data": scene})
        for feature, plan in itertools.product(scene["features"], scene["plans"]):
            train = [row for row in scene["rows"] if row["id"] in plan["train"]]
            test = [row for row in scene["rows"] if row["id"] in plan["test"]]
            overlap = sorted(set(plan["train"]) & set(plan["test"]))
            groups = sorted({row["group"] for row in train} & {row["group"] for row in test}) if scene["requireGroup"] else []
            future = [row["id"] for row in train if row["time"] >= min(item["time"] for item in test)] if scene["requireTime"] else []
            feature_valid = feature["observedAt"] <= 0
            split_valid = not (overlap or groups or future)
            reason = "both-valid" if feature_valid and split_valid else "feature-future" if split_valid else "split-invalid" if feature_valid else "both-invalid"
            frame = pd.DataFrame(scene["rows"]).set_index("id")
            check(overlap == sorted(set(frame.loc[plan["train"]].index) & set(frame.loc[plan["test"]].index)), "split row overlap " + fixture_id + plan["id"] + feature["id"])
            if scene["requireGroup"]:
                training_groups = frame.loc[plan["train"], "group"]
                held_groups = frame.loc[plan["test"], "group"]
                check(groups == sorted(set(training_groups) & set(held_groups)), "group overlap " + fixture_id + plan["id"] + feature["id"])
            if scene["requireTime"]:
                pandas_future = frame.loc[plan["train"]].loc[lambda part: part.time >= frame.loc[plan["test"], "time"].min()].index.tolist()
                check(future == pandas_future, "temporal boundary " + fixture_id + plan["id"] + feature["id"])
            why = f"Feature at t={feature['observedAt']} must exist by t=0. Row overlap={overlap}; required group overlap={groups}; prohibited future training IDs={future}. Group separation is required only for a declared unseen-group deployment question; causal effects are not established."
            configs.append(make_config("EV-E1.split." + scene["id"] + "." + feature["id"] + "." + plan["id"], fixture_id,
                {"feature": feature["id"], "split": plan["id"]}, "Will both the feature and split be permissible for this deployment question?",
                {"feature_valid": feature_valid, "split_valid": split_valid, "valid": feature_valid and split_valid, "overlap": overlap, "groups": groups, "future": future, "reason": reason, "final_test_permission": "not-yet-selection-not-frozen"}, why, ["EV01.O1", "EV01.O2", "EV01.O3", "EV01.O4"]))
    capacities = [
        {"id": "low", "train_predictions": [92, 108], "dev_predictions": [91, 109]},
        {"id": "middle", "train_predictions": [97, 103], "dev_predictions": [96, 104]},
        {"id": "high", "train_predictions": [99, 101], "dev_predictions": [88, 112]},
    ]
    fixtures.append({"id": "ev-e1.capacity.v1", "kind": "fixed-prediction-replay", "unit": "thousand USD", "train_ids": ["h1", "h2"], "dev_ids": ["h3", "h4"], "target": [100, 100], "baseline_dev_predictions": [95, 105], "candidates": capacities, "final_test_ids": ["h5", "h6"], "final_test_targets": "withheld", "parameter_hyperparameter": "Fitted coefficients are parameters; capacity is a hyperparameter. No coefficients are refitted in the browser."})
    for candidate, selection in itertools.product(capacities, ["development", "test-peeking"]):
        train_error = sum(abs(100 - pred) for pred in candidate["train_predictions"]) / 2
        dev_error = sum(abs(100 - pred) for pred in candidate["dev_predictions"]) / 2
        for split, manual in [("train", train_error), ("dev", dev_error)]:
            close(mean_absolute_error([100, 100], candidate[split + "_predictions"]), manual, "capacity MAE " + candidate["id"] + split + selection)
        close(mean_absolute_error([100, 100], [95, 105]), 5, "baseline MAE " + candidate["id"] + selection)
        why = f"Capacity {candidate['id']} gives train MAE {train_error} and development MAE {dev_error} thousand USD; baseline MAE is 5. Middle capacity minimizes development MAE at 4, a 20% relative reduction. Lower training error alone does not select a model. Repeated final-test selection is invalid even if the displayed development error is unchanged."
        configs.append(make_config("EV-E1.capacity." + candidate["id"] + "." + selection, "ev-e1.capacity.v1", {"capacity": candidate["id"], "selection_source": selection}, "Will training and development errors both improve with greater capacity, and is this selection source permissible?",
            {"train_mae": train_error, "development_mae": dev_error, "baseline_mae": 5, "relative_error_reduction": (5 - dev_error) / 5, "best_development_candidate": "middle", "selection_valid": selection == "development", "final_test_permission": "eligible-once-selection-and-workflow-frozen" if selection == "development" else "invalid-test-used-for-selection", "reason": "development-selection" if selection == "development" else "test-selection-optimism"}, why, ["EV02.O1", "EV02.O2", "EV02.O3", "EV05.O1", "EV05.O2", "EV06.O4"]))
    values = {"r1": 2, "r2": 4, "r3": 6, "r4": 8, "r5": 20, "r6": 22}
    fits = [
        ("train-only", ["r1", "r2", "r3", "r4"], ["r1", "r2", "r3", "r4"], ["r5", "r6"]),
        ("train-plus-validation", list(values), ["r1", "r2", "r3", "r4"], ["r5", "r6"]),
        ("fold-a-only", ["r1", "r2"], ["r1", "r2"], ["r3", "r4"]),
        ("fold-a-global", ["r1", "r2", "r3", "r4"], ["r1", "r2"], ["r3", "r4"]),
        ("fold-b-only", ["r3", "r4"], ["r3", "r4"], ["r1", "r2"]),
        ("fold-b-global", ["r1", "r2", "r3", "r4"], ["r3", "r4"], ["r1", "r2"]),
    ]
    fixtures.append({"id": "ev-e1.fit.v1", "kind": "center-only-preprocessing", "unit": "feature units", "rows": [{"id": key, "value": val} for key, val in values.items()], "query_id": "q1", "query_value": 10, "policies": [{"id": name, "fit_ids": fit, "permitted_ids": permitted, "evaluation_ids": evaluation} for name, fit, permitted, evaluation in fits], "final_test_ids": ["r7", "r8"], "final_test_values": "withheld"})
    for name, fit, permitted, evaluation in fits:
        mean = sum(values[row] for row in fit) / len(fit)
        oracle = StandardScaler(with_mean=True, with_std=False).fit([[values[row]] for row in fit])
        close(oracle.mean_[0], mean, "fit mean " + name)
        close(oracle.transform([[10]])[0, 0], 10 - mean, "fit transform " + name)
        unexpected = sorted(set(fit) - set(permitted))
        why = f"Only {permitted} may determine this preprocessing mean. Actual fit IDs {fit} produce mean {mean:.12g}; query 10 becomes {10 - mean:.12g}. Forbidden fit IDs={unexpected}. A globally training-only transform still leaks within cross-validation when a fold's validation rows influence its mean. A pipeline is valid only with the correct fit boundary."
        configs.append(make_config("EV-E1.fit." + name, "ev-e1.fit.v1", {"fit_policy": name}, "Does this mean use only permitted training rows, including the current fold boundary?",
            {"fit_ids": fit, "permitted_ids": permitted, "evaluation_ids": evaluation, "forbidden_fit_ids": unexpected, "mean": mean, "transformed_query": 10 - mean, "valid": not unexpected, "reason": "fit-local" if not unexpected else "fit-leakage", "final_test_permission": "not-yet-selection-not-frozen"}, why, ["EV06.O1", "EV06.O2", "EV06.O4"]))
    resamples = [[4, 4, 4], [2, 4, 6], [1, 4, 7]]
    fixtures.append({"id": "ev-e1.resamples.v1", "kind": "fixed-resample-replay", "unit": "thousand USD MAE", "resample_ids": ["s1", "s2", "s3"], "error_sets": resamples, "seed": 1729, "population": "fictional development houses", "deployment_caveat": "No evidence for new regions, rare subgroups or shifted time periods"})
    for index, errors in enumerate(resamples):
        mean = sum(errors) / 3
        spread = math.sqrt(sum((value - mean) ** 2 for value in errors) / 3)
        close(np.mean(errors), mean, "resample mean " + str(index))
        close(np.std(errors, ddof=0), spread, "resample spread " + str(index))
        why = f"The same fixed mean {mean} hides different error spread: population SD across these three authored resamples is {spread:.12g}. A fixed seed reproduces this replay; it does not remove sampling uncertainty or certify future regions/subgroups. This spread is not a confidence interval."
        configs.append(make_config("EV-E1.resample." + str(index + 1), "ev-e1.resamples.v1", {"resample_set": index + 1}, "Can equal mean errors have different variability, and does reproducibility establish future reliability?",
            {"errors": errors, "mean": mean, "population_sd": spread, "range": max(errors) - min(errors), "confidence_interval": "not-estimated", "reason": "seed-not-generalization", "shift_conclusion": "unsupported-without-representative-evidence"}, why, ["EV05.O3", "EV05.O4", "EV06.O3"]))
    edge_rows = [
        ("negative-r2", [1, 3], [3, 3], [2, 2]),
        ("constant-perfect", [2, 2], [2, 2], [2, 2]),
        ("constant-imperfect", [2, 2], [1, 1], [2, 2]),
    ]
    fixtures.append({"id": "ev-e1.regression-edges.v1", "kind": "regression-metric-boundaries", "unit": "target units", "cases": [{"id": name, "ids": ["e1", "e2"], "target": target, "prediction": pred, "baseline": baseline} for name, target, pred, baseline in edge_rows]})
    for name, target, pred, baseline in edge_rows:
        residual_sse = sum((truth - guess) ** 2 for truth, guess in zip(target, pred))
        total_sse = sum((truth - sum(target) / 2) ** 2 for truth in target)
        r_squared = 1 - residual_sse / total_sse if total_sse else undefined("constant-target-zero-over-zero") if not residual_sse else infinity("negative", "constant-target-positive-sse")
        mae = sum(abs(truth - guess) for truth, guess in zip(target, pred)) / 2
        baseline_mae = sum(abs(truth - guess) for truth, guess in zip(target, baseline)) / 2
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            raw_r2 = r2_score(target, pred, force_finite=False)
        if isinstance(r_squared, dict):
            check(math.isnan(raw_r2) if r_squared["tag"] == "undefined" else raw_r2 == -math.inf, "R2 raw boundary " + name)
        else:
            close(raw_r2, r_squared, "R2 manual " + name)
        close(mean_squared_error(target, pred), residual_sse / 2, "MSE manual " + name)
        close(mean_absolute_error(target, pred), mae, "edge MAE " + name)
        why = "R² compares SSE with variation around the evaluated target mean, not classification accuracy. A negative value is worse than that mean reference. Constant targets have zero reference variation: perfect predictions give undefined 0/0; imperfect predictions give a negative-infinite extension. A zero-error baseline makes percentage error reduction undefined. Library force_finite=True replacements are not mathematical values."
        configs.append(make_config("EV-E1.edge." + name, "ev-e1.regression-edges.v1", {"metric_case": name}, "Is R² negative, finite or undefined, and is percentage improvement defined?",
            {"sse": residual_sse, "target_variation_sse": total_sse, "mae": mae, "baseline_mae": baseline_mae, "r2": r_squared, "relative_error_reduction": ratio(baseline_mae - mae, baseline_mae, "zero-baseline-error"), "library_force_finite_r2": float(r2_score(target, pred)), "reason": "r2-not-accuracy"}, why, ["EV02.O3", "EV02.O4"]))
    return envelope("EV-E1", fixtures, configs, ["EV01", "EV02", "EV05", "EV06"])


def e2_manifest():
    seeds = [
        ("balanced", [0, 0, 1, 1], [.1, .4, .6, .9], 1, 1),
        ("same-ranking", [0, 0, 1, 1], [.01, .49, .51, .99], 1, 1),
        ("imbalanced", [0, 0, 0, 0, 0, 0, 0, 1], [.1, .2, .3, .4, .2, .1, .3, .6], 1, 5),
        ("no-positives", [0, 0, 0, 0], [.1, .2, .6, .8], 1, 5),
        ("no-negatives", [1, 1, 1, 1], [.1, .2, .6, .8], 1, 5),
        ("endpoints", [0, 1, 0, 1], [0, 1, 1, 0], 1, 5),
        ("all-tied", [0, 1, 0, 1], [.5, .5, .5, .5], 1, 1),
        ("reversed-ranking", [0, 0, 1, 1], [.9, .6, .4, .1], 1, 1),
    ]
    configs = []
    fixtures = []
    for name, truth, probabilities, fp_cost, fn_cost in seeds:
        fixture_id = "ev-e2." + name + ".v1"
        fixtures.append({"id": fixture_id, "kind": "fixed-probability-replay", "population": "fictional documentation review items", "positive": {"value": 1, "label": "Needs Improvement"}, "negative": {"value": 0, "label": "Good"}, "rows": [{"id": "d" + str(index + 1), "target": target, "probability_positive": probability} for index, (target, probability) in enumerate(zip(truth, probabilities))], "cost_fp": fp_cost, "cost_fn": fn_cost, "cost_unit": "illustrative review-cost units", "split": "development-only; final test withheld", "provenance": "original fictional teaching values; not production labels or evidence of calibration"})
        for threshold in [0, .5, .75, 1]:
            prefix = name + ":" + str(threshold)
            predicted = [int(probability >= threshold) for probability in probabilities]
            tp = sum(target == 1 and guess == 1 for target, guess in zip(truth, predicted))
            fp = sum(target == 0 and guess == 1 for target, guess in zip(truth, predicted))
            tn = sum(target == 0 and guess == 0 for target, guess in zip(truth, predicted))
            fn = sum(target == 1 and guess == 0 for target, guess in zip(truth, predicted))
            precision = ratio(tp, tp + fp, "no-predicted-positives")
            recall = ratio(tp, tp + fn, "no-actual-positives")
            f1 = ratio(2 * tp, 2 * tp + fp + fn, "no-actual-or-predicted-positives")
            specificity = ratio(tn, tn + fp, "no-actual-negatives")
            balanced = (recall + specificity) / 2 if isinstance(recall, (int, float)) and isinstance(specificity, (int, float)) else undefined("both-classes-required")
            positives = sum(truth)
            negatives = len(truth) - positives
            auc = sum((positive > negative) + .5 * (positive == negative) for positive, target in zip(probabilities, truth) if target == 1 for negative, other in zip(probabilities, truth) if other == 0) / (positives * negatives) if positives and negatives else undefined("both-classes-required")
            pr_points = []
            for cutoff in sorted(set(probabilities)):
                point_tp = sum(target == 1 and probability >= cutoff for target, probability in zip(truth, probabilities))
                point_fp = sum(target == 0 and probability >= cutoff for target, probability in zip(truth, probabilities))
                pr_points.append({"threshold": cutoff, "tp": point_tp, "fp": point_fp, "precision": ratio(point_tp, point_tp + point_fp, "no-predicted-positives"), "recall": ratio(point_tp, positives, "no-actual-positives")})
            ap = sum((point["recall"] - (pr_points[index + 1]["recall"] if index + 1 < len(pr_points) else 0)) * point["precision"] for index, point in enumerate(pr_points)) if positives else undefined("no-actual-positives")
            contributions = []
            for target, probability in zip(truth, probabilities):
                likelihood = probability if target else 1 - probability
                contributions.append({"brier": (probability - target) ** 2, "log_loss": max(0.0, -math.log(likelihood)) if likelihood else infinity("positive", "zero-probability-observed-outcome")})
            brier = sum(item["brier"] for item in contributions) / len(truth)
            loss = infinity("positive", "zero-probability-observed-outcome") if any(isinstance(item["log_loss"], dict) for item in contributions) else sum(item["log_loss"] for item in contributions) / len(truth)
            calibration = []
            for lower, upper in [(0, .5), (.5, 1)]:
                indexes = [index for index, probability in enumerate(probabilities) if lower <= probability and (probability < upper if upper < 1 else probability <= upper)]
                calibration.append({"lower_inclusive": lower, "upper": upper, "upper_inclusive": upper == 1, "count": len(indexes), "mean_probability": sum(probabilities[index] for index in indexes) / len(indexes) if indexes else undefined("empty-bin"), "observed_positive_fraction": sum(truth[index] for index in indexes) / len(indexes) if indexes else undefined("empty-bin")})
            matrix = confusion_matrix(truth, predicted, labels=[0, 1])
            check(matrix.tolist() == [[tn, fp], [fn, tp]], "confusion counts " + prefix)
            close(accuracy_score(truth, predicted), (tp + tn) / len(truth), "accuracy " + prefix)
            close(np.sum((np.array(truth) == 0) & (np.array(predicted) == 0)), tn, "negative count " + prefix)
            oracle_cost = np.where((np.array(truth) == 0) & (np.array(predicted) == 1), fp_cost, np.where((np.array(truth) == 1) & (np.array(predicted) == 0), fn_cost, 0))
            close(np.sum(oracle_cost), fp_cost * fp + fn_cost * fn, "total cost " + prefix)
            close(np.mean(oracle_cost), (fp_cost * fp + fn_cost * fn) / len(truth), "mean cost " + prefix)
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                for metric, manual, library in [("precision", precision, precision_score), ("recall", recall, recall_score), ("f1", f1, f1_score)]:
                    observed = library(truth, predicted, pos_label=1, zero_division=np.nan)
                    if isinstance(manual, dict):
                        check(math.isnan(observed), metric + " undefined " + prefix)
                    else:
                        close(observed, manual, metric + " " + prefix)
                if positives and negatives:
                    close(roc_auc_score(truth, probabilities), auc, "ROC pairwise " + prefix)
                else:
                    check(math.isnan(roc_auc_score(truth, probabilities)), "single-class library ROC undefined " + prefix)
                if positives:
                    close(average_precision_score(truth, probabilities), ap, "average precision step sum " + prefix)
                    lib_precision, lib_recall, lib_thresholds = precision_recall_curve(truth, probabilities, pos_label=1)
                    check(len(lib_thresholds) == len(pr_points), "PR threshold count " + prefix)
                    for index, point in enumerate(pr_points):
                        close(lib_thresholds[index], point["threshold"], "PR threshold " + prefix + str(index))
                        close(lib_precision[index], point["precision"], "PR precision " + prefix + str(index))
                        close(lib_recall[index], point["recall"], "PR recall " + prefix + str(index))
                else:
                    close(average_precision_score(truth, probabilities), 0, "library AP replacement differs from undefined " + prefix)
                    check(isinstance(ap, dict) and all(isinstance(point["recall"], dict) for point in pr_points), "mathematical absent-positive recall/AP tags " + prefix)
            close(brier_score_loss(truth, probabilities, pos_label=1, scale_by_half=True), brier, "binary Brier " + prefix)
            epsilon = float(np.finfo(np.float64).eps)
            clipped = [min(1 - epsilon, max(epsilon, value)) for value in probabilities]
            clipped_loss = -sum(math.log(probability if target else 1 - probability) for target, probability in zip(truth, clipped)) / len(truth)
            library_loss = float(log_loss(truth, np.array(probabilities, dtype=np.float64), labels=[0, 1]))
            close(library_loss, clipped_loss, "float64 clipped log loss " + prefix)
            if not isinstance(loss, dict):
                close(library_loss, loss, "interior mathematical log loss " + prefix)
            for index, bucket in enumerate(calibration):
                if bucket["count"]:
                    selected = [offset for offset, probability in enumerate(probabilities) if bucket["lower_inclusive"] <= probability and (probability < bucket["upper"] if bucket["upper"] < 1 else probability <= bucket["upper"])]
                    close(np.mean(np.array(probabilities)[selected]), bucket["mean_probability"], "calibration predicted " + prefix + str(index))
                    close(np.mean(np.array(truth)[selected]), bucket["observed_positive_fraction"], "calibration observed " + prefix + str(index))
            why = f"Fixed probabilities; threshold {threshold} predicts positive on equality. TP={tp}, FP={fp}, TN={tn}, FN={fn}. Changing threshold changes actions and cost, not fitted parameters, probabilities, ranking or probability losses. Costs FP={fp_cost}, FN={fn_cost} are illustrative development assumptions, not universal values. No accuracy, ranking or tiny calibration table establishes causal effects or calibrated future risk."
            configs.append(make_config("EV-E2." + name + ".t" + str(threshold).replace(".", "_"), fixture_id, {"probability_set": name, "threshold": threshold}, "How will threshold change confusion counts and cost? Will ranking or probability loss change?",
                {"predicted": predicted, "tp": tp, "fp": fp, "tn": tn, "fn": fn, "prevalence": positives / len(truth), "accuracy": (tp + tn) / len(truth), "precision": precision, "recall": recall, "f1": f1, "specificity": specificity, "balanced_accuracy": balanced, "fpr": ratio(fp, fp + tn, "no-actual-negatives"), "total_cost": fp_cost * fp + fn_cost * fn, "mean_cost": (fp_cost * fp + fn_cost * fn) / len(truth), "roc_auc": auc, "average_precision": ap, "pr_points": pr_points, "no_prediction_endpoint": {"precision": undefined("no-predicted-positives"), "recall": 0 if positives else undefined("no-actual-positives")}, "brier": brier, "mean_log_loss": loss, "row_loss_contributions": contributions, "library_float64_clipped_log_loss": library_loss, "calibration_bins": calibration, "reason": "threshold-not-retraining", "final_test_permission": "not-yet-threshold-and-workflow-not-frozen"}, why, ["EV03.O1", "EV03.O2", "EV03.O3", "EV03.O4", "EV04.O1", "EV04.O2", "EV04.O3", "EV04.O4"]))
    return envelope("EV-E2", fixtures, configs, ["EV03", "EV04"])


def envelope(experiment, fixtures, configurations, lessons):
    return {"schema": "supervised.ev.experiment-manifest.v1", "id": experiment, "version": "1.0.0", "status": "frozen-specification-not-implemented", "metric_conventions": "supervised.ev.metrics.1.0.0", "reference_profile": PROFILE, "tolerance": TOLERANCE, "lesson_ids": lessons, "initial_configuration": "EV-E1.split.housing-units.available.holdout" if experiment == "EV-E1" else "EV-E2.balanced.t0_5", "prerequisites": ["existing Regression residuals", "Math Statistics and Probability", "Python Data Preparation fit boundaries", "EV01 prediction moment"], "interaction_spec": "EV_E1_MANIFEST.md" if experiment == "EV-E1" else "EV_E2_MANIFEST.md", "fixture_provenance": "Original fictional teaching fixtures only; no credentials, uploads, remote data or production annotation", "configuration_rule": "Only listed IDs and their complete control tuple are supported; no Cartesian-product inference", "configurations": configurations, "fixtures": fixtures}


def verify_invariants(first, second):
    check(len(first["configurations"]) == 54, "EV-E1 exactly 54 states")
    check(len(second["configurations"]) == 32, "EV-E2 exactly 32 states")
    for manifest in [first, second]:
        configurations = manifest["configurations"]
        check(len(configurations) <= 64, manifest["id"] + " state cap")
        check(len({item["id"] for item in configurations}) == len(configurations), manifest["id"] + " unique state IDs")
        fixture_ids = {item["id"] for item in manifest["fixtures"]}
        check(all(item["fixture"] in fixture_ids for item in configurations), manifest["id"] + " fixture ownership")
        check(all(item["why"] and item["prediction_question"] and item["text_alternative"] for item in configurations), manifest["id"] + " learning/accessibility metadata")
    grouped = {}
    for item in second["configurations"]:
        grouped.setdefault(item["fixture"], []).append(item)
    for fixture, items in grouped.items():
        for field in ["brier", "mean_log_loss", "roc_auc", "average_precision", "calibration_bins"]:
            check(all(item["expected"][field] == items[0]["expected"][field] for item in items), "threshold invariant " + fixture + field)
        ordered = sorted(items, key=lambda item: item["controls"]["threshold"])
        check(all(left["expected"]["tp"] >= right["expected"]["tp"] and left["expected"]["fp"] >= right["expected"]["fp"] for left, right in zip(ordered, ordered[1:])), "threshold monotonic counts " + fixture)
    split = [item for item in first["configurations"] if item["id"].startswith("EV-E1.split.")]
    check(len(split) == 36 and sum(item["expected"]["valid"] for item in split) == 6, "unchanged prototype 36-state permissions")
    prior_reference = json.loads((ROOT / "python/tests/fixtures/supervised-ev01-reference.json").read_text())
    for item in split:
        source_id = item["id"].removeprefix("EV-E1.split.").replace(".", ":")
        prior = next(row["expected"] for row in prior_reference["states"] if row["id"] == source_id)
        current = item["expected"]
        check(all(current[new_key] == prior[old_key] for new_key, old_key in [("feature_valid", "featureValid"), ("split_valid", "splitValid"), ("valid", "valid"), ("overlap", "overlap"), ("groups", "groups"), ("future", "future"), ("reason", "reason")]), "frozen EV01 reference preserved " + source_id)
    for fixture in second["fixtures"]:
        rows = fixture["rows"]
        check(0 < len(rows) <= 32 and len({row["id"] for row in rows}) == len(rows), "bounded distinct input rows " + fixture["id"])
        check(all(type(row["target"]) is int and row["target"] in [0, 1] and type(row["probability_positive"]) in [int, float] and 0 <= row["probability_positive"] <= 1 for row in rows), "binary targets and probability domain " + fixture["id"])
    probabilities = {name: items[0]["expected"] for name, items in grouped.items()}
    close(probabilities["ev-e2.balanced.v1"]["roc_auc"], probabilities["ev-e2.same-ranking.v1"]["roc_auc"], "same rank same AUC")
    check(probabilities["ev-e2.balanced.v1"]["brier"] != probabilities["ev-e2.same-ranking.v1"]["brier"], "same rank different probability error")
    imbalanced = next(item["expected"] for item in second["configurations"] if item["fixture"] == "ev-e2.imbalanced.v1" and item["controls"]["threshold"] == .75)
    check(imbalanced["accuracy"] == .875 and imbalanced["recall"] == 0 and isinstance(imbalanced["precision"], dict) and imbalanced["f1"] == 0, "majority accuracy is not detection; F1 zero differs from undefined precision")
    endpoint = probabilities["ev-e2.endpoints.v1"]
    check(endpoint["mean_log_loss"]["tag"] == "infinity" and math.isfinite(endpoint["library_float64_clipped_log_loss"]), "mathematical infinite versus library clipped loss")
    grouped_rows = np.array(["g1", "g1", "g2", "g2", "g3", "g3"])
    train, held = next(GroupShuffleSplit(n_splits=1, test_size=1/3, random_state=1729).split(np.zeros((6, 1)), groups=grouped_rows))
    check(not set(grouped_rows[train]) & set(grouped_rows[held]), "trusted grouped split permission example")
    check(all(max(train) < min(held) for train, held in TimeSeriesSplit(n_splits=2).split(np.zeros((6, 1)))), "trusted temporal split permission example")


def preserved_hashes():
    result = {}
    for directory in ["apps", "packages", "python"]:
        for path in sorted((ROOT / directory).rglob("*")):
            if path.is_file() and not any(part in {".next", "node_modules", "__pycache__", ".venv", ".pytest_cache"} for part in path.parts) and path.suffix not in {".pyc", ".tsbuildinfo"}:
                result[str(path.relative_to(ROOT))] = sha(path)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--freeze", action="store_true")
    args = parser.parse_args()
    actual = {"python": platform.python_version(), "numpy": np.__version__, "pandas": pd.__version__, "matplotlib": matplotlib.__version__, "scikit-learn": sklearn.__version__}
    check(actual == PROFILE, "approved exact dependency profile")
    before = preserved_hashes()
    first, second = e1_manifest(), e2_manifest()
    verify_invariants(first, second)
    files = {"ev-e1.manifest.v1.json": first, "ev-e2.manifest.v1.json": second}
    for filename, data in files.items():
        path = HERE / filename
        serialized = dump(data)
        if args.freeze:
            path.write_text(serialized)
        else:
            check(path.read_text() == serialized, "byte-identical independent regeneration " + filename)
    check(before == preserved_hashes(), "all application/package/Python source and fixtures preserved")
    lock = {"schema": "supervised.ev.manifest-freeze.v1", "metric_conventions": "supervised.ev.metrics.1.0.0", "files": {filename: sha(HERE / filename) for filename in files}, "author_script_sha256": sha(Path(__file__)), "metric_spec_sha256": sha(HERE / "METRIC_CONVENTIONS.md"), "experiment_spec_sha256": {filename: sha(HERE / filename) for filename in ["EV_E1_MANIFEST.md", "EV_E2_MANIFEST.md"]}, "prototype_authored_sha256": sha(ROOT / "apps/web/app/supervised/foundation/authored.json"), "prototype_reference_sha256": sha(ROOT / "python/tests/fixtures/supervised-ev01-reference.json")}
    if args.freeze:
        (HERE / "freeze-lock.v1.json").write_text(dump(lock))
    else:
        check(json.loads((HERE / "freeze-lock.v1.json").read_text()) == lock, "frozen source/metric/manifest hashes match")
    evidence = {"status": "passed", "mode": "freeze" if args.freeze else "regenerate-and-verify", "environment": {"platform": platform.platform(), "machine": platform.machine(), "executable": sys.executable, "dependencies": actual, "MPLCONFIGDIR": os.environ.get("MPLCONFIGDIR")}, "configuration_counts": {"EV-E1": 54, "EV-E2": 32}, "checks_passed": len(CHECKS), "checks": CHECKS, "hashes": lock, "preserved_source_count": len(before), "scope": "specification reference parity only; no app implementation, assessment verification, notebook execution or genuine accessibility/Colab verification"}
    (HERE / ("freeze-evidence.v1.json" if args.freeze else "verification-evidence.v1.json")).write_text(dump(evidence))
    (HERE / "preserved-source-hashes.v1.json").write_text(dump(before))
    print(json.dumps({"status": "passed", "mode": evidence["mode"], "checks_passed": len(CHECKS), "configurations": evidence["configuration_counts"], "preserved_source_count": len(before)}))


if __name__ == "__main__":
    main()
