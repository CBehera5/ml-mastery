"""Trusted author-only Evaluation Foundations fixtures and independent metric oracles."""

import json
import math
from pathlib import Path

import numpy as np
from sklearn.metrics import brier_score_loss, f1_score, log_loss, mean_absolute_error, precision_score, r2_score, recall_score
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[2]
CONTENT = "supervised.evaluation.1.0.0"


def choice(label, expected, alternatives, reason, misconception):
    return {"label": label, "expected": expected, "alternatives": alternatives, "reason": reason, "misconception": misconception, "kind": "choice"}


def numeric(label, expected, reason, misconception):
    return {"label": label, "expected": expected, "alternatives": [], "reason": reason, "misconception": misconception, "kind": "number"}


def reference_case(lesson, objective, variant):
    amount = variant + 2
    context = ["house-price comparison", "customer churn review", "documentation quality review", "future house listings", "new customer cohort", "unseen documentation families"][variant]
    if lesson == 2:
        if objective == 1:
            return choice(f"For {context}: coefficients are fitted on training rows; capacity is selected on development rows. Which roles are correct?", "Coefficients: parameters; capacity: hyperparameter; untouched final test: evaluation", ["Coefficients: final-test metrics; capacity: a prediction", "All three are fitted parameters"], "Parameters are learned during fit; hyperparameters are choices; final evaluation estimates the frozen workflow on unseen rows.", "Calling every number a parameter hides selection leakage.")
        if objective == 2:
            valid = variant % 2 == 0
            return choice(f"For {context}, {amount} candidate thresholds are compared on {'development' if valid else 'final-test'} labels before choosing the best. Is the comparison permitted?", "Permitted development selection; freeze before final evaluation" if valid else "Invalid final-test selection; the winning estimate is optimistic", ["Any high score proves unbiased future performance", "Final-test labels are always permitted for choosing thresholds" if valid else "Valid because thresholds do not retrain coefficients"], "Selecting on development data is allowed; reusing final-test feedback makes the chosen workflow depend on test outcomes. Threshold selection is selection even without refitting coefficients.", "A test used to choose the winner is no longer an untouched evaluation.")
        if objective == 3:
            baseline, model = amount + 3, amount + 1
            assert mean_absolute_error([0, 0], [baseline, baseline]) == baseline
            assert mean_absolute_error([0, 0], [model, model]) == model
            return numeric(f"In {context}, baseline MAE={baseline} and candidate MAE={model}, same rows/target units. Enter relative error reduction as a fraction, not a percent.", (baseline - model) / baseline, f"(baseline − candidate)/baseline = ({baseline} − {model})/{baseline}. Keep the evaluated rows identical; a zero baseline would make this ratio undefined.", "Dividing by candidate error changes the question.")
        target, predicted = [0, amount], [amount, amount]
        assert r2_score(target, predicted) == -1
        return numeric(f"For {context}, y={target}, predictions={predicted}. Compute R², not classification accuracy.", -1, f"Target mean={amount / 2}; SSE={amount ** 2}; SST={amount ** 2 / 2}. R²=1−SSE/SST=−1: worse squared error than the evaluated-target mean reference.", "Negative R² is possible; it is not negative classification accuracy.")
    if lesson == 3:
        truth = [0, 0, 1, 1, 1]
        predicted = [0, 1, 1, 0, 1] if variant % 2 == 0 else [0, 0, 1, 0, 1]
        tp = sum(target == guess == 1 for target, guess in zip(truth, predicted))
        fp = sum(target == 0 and guess == 1 for target, guess in zip(truth, predicted))
        tn = sum(target == guess == 0 for target, guess in zip(truth, predicted))
        fn = sum(target == 1 and guess == 0 for target, guess in zip(truth, predicted))
        if objective == 1:
            return choice(f"Needs Improvement=1. For {context}, actual={truth}, predicted={predicted}. Choose (TP,FP,TN,FN).", f"({tp},{fp},{tn},{fn})", [f"({tn},{fn},{tp},{fp})", f"({tp + 1},{fp},{tn},{fn})"], "Name the positive class first; TP/FP are predicted-positive rows, FN are missed actual positives. Rows and labels must stay aligned.", "Swapping actual and predicted axes exchanges false positives with false negatives.")
        if objective == 2:
            count = 10 * amount
            return choice(f"A churn model predicts all {count} customers negative; one actually churns. Accuracy={(count - 1) / count:.3f}. Missed churn costs five times a false alert. Is accuracy alone sufficient?", "No: positive recall is 0; inspect recall, precision and explicit FN/FP cost on development data", ["Yes: majority accuracy proves useful positive detection", "Yes: all-negative predictions make recall undefined despite an actual positive"], "One actual positive and no detections means recall0, not undefined. Compare cost-aware alternatives on the same development rows; choose a threshold before final evaluation.", "Imbalance can hide every missed positive behind high accuracy.")
        if objective == 3:
            requested = ["precision", "recall", "f1"][variant % 3]
            expected = {"precision": tp / (tp + fp), "recall": tp / (tp + fn), "f1": 2 * tp / (2 * tp + fp + fn)}[requested]
            oracle = {"precision": precision_score, "recall": recall_score, "f1": f1_score}[requested](truth, predicted, pos_label=1, zero_division=np.nan)
            assert math.isclose(expected, oracle)
            return numeric(f"Positive=1, actual={truth}, predictions={predicted}. Enter {requested} as a fraction.", expected, f"TP={tp},FP={fp},TN={tn},FN={fn}. Precision=TP/(TP+FP), recall=TP/(TP+FN), F1=2TP/(2TP+FP+FN). Undefined denominators require tags, not coerced zeros.", "Precision asks about alerts; recall asks about actual positives.")
        return choice(f"For {context}, keep probabilities [.2,.5,.8] fixed and move threshold from .5 to .75 using >=. What changed?", "Labels [0,1,1] become [0,0,1]; probabilities and fitted coefficients stay fixed", ["Probabilities become [.2,.75,.8] because the model retrained", "Equality at .5 predicts negative"], "A threshold changes an action rule, not the trained probability model. Equality belongs to the positive class.", "Predicting labels is not refitting the estimator.")
    if lesson == 4:
        probability = [.2, .3, .4, .6, .7, .8][variant]
        if objective == 1:
            return choice(f"For {context}, a system exports label=1, probability={probability}, and margin=2.4. Which interpretation is valid?", "The margin is a score, not automatically a probability; the label is a decision", ["Any positive margin is a calibrated probability", "A hard label1 guarantees the outcome"], "Labels, real-valued ranking scores and normalized probabilities are different objects. A probability lies in [0,1] but that alone does not prove calibration.", "Do not label SVM-like margins as risk probabilities.")
        if objective == 2:
            return choice(f"In {context}, two probability sets have identical ordering and ROC AUC=1 but different Brier errors. Can both be declared calibrated future risk?", "No: ordering does not establish calibration or deployment reliability", ["Yes: perfect ranking guarantees calibrated probabilities", "Yes: a probability is a causal effect of the feature"], "ROC depends on ordering; Brier/log loss depend on the actual probability values and labels. A tiny development calibration table cannot certify future risk or causation.", "Ranking, calibrated risk and causal effects are not interchangeable.")
        if objective == 3:
            metric = "Brier" if variant % 2 == 0 else "log loss"
            truth, probs = [1, 0], [probability, 1 - probability]
            expected = (1 - probability) ** 2 if metric == "Brier" else -math.log(probability)
            oracle = brier_score_loss(truth, probs, pos_label=1, scale_by_half=True) if metric == "Brier" else log_loss(truth, probs, labels=[0, 1])
            assert math.isclose(expected, oracle)
            return numeric(f"For two rows y={truth}, p(class1)={probs}, compute mean binary {metric} using natural logs when needed.", expected, f"Both rows assign probability {probability} to the observed outcome. Brier is squared probability error; log loss is −ln(probability of observed outcome). Correct certainty gives0; impossible observed outcomes give mathematical +infinity, not the library's clipped approximation.", "Do not average labels or silently substitute finite clipped loss for mathematical infinity.")
        return choice(f"For {context}, class prevalence changes while score ordering is held fixed. Which comparison is justified?", "ROC is pairwise ranking; PR/AP depend on positive detection and prevalence; AP is a step-weighted precision sum", ["AP is always trapezoidal area and independent of prevalence", "ROC AUC is classification accuracy at threshold .5"], "ROC pairs positives with negatives and gives tied pairs half credit. Precision-recall describes positive-class retrieval; average precision uses recall increments, not trapezoidal interpolation. Absent classes have explicit undefined states.", "A ranking summary is not an operating threshold or a probability calibration score.")
    if lesson == 5:
        if objective == 1:
            return choice(f"For {context}, low-capacity train/dev MAE=(8,9); high-capacity=(1,12). What is supported?", "High capacity fits training better but generalizes worse on development; low capacity may underfit", ["Training MAE1 proves the high-capacity model is best for unseen rows", "Increasing capacity must lower development error"], "Training residuals shrink while held-out error rises: this is consistent with overfitting, not a guarantee of future error. Compare an intermediate capacity on development rows.", "More flexible does not mean better unseen prediction.")
        if objective == 2:
            return choice(f"For {context}, candidate capacities were chosen by repeatedly inspecting final-test MAE {amount} times. Is the final estimate untouched?", "No: choose capacity on development/CV, freeze workflow, then use final test once", ["Yes: each model used training-only fit, so selection cannot leak", "Yes: the smallest test MAE is an unbiased generalization estimate"], "Training-only fit is necessary but not sufficient: model selection also learns from feedback. Repeated test-driven choices make the winner's test score optimistic.", "The boundary protects selection as well as fitting.")
        if objective == 3:
            errors = [amount, amount + 2, amount + 4]
            expected = math.sqrt(8 / 3)
            assert math.isclose(np.std(errors, ddof=0), expected)
            return numeric(f"Fixed development resample MAEs={errors}. Compute descriptive population SD with divisor3 (ddof=0), not a confidence interval.", expected, "Mean is the middle value; squared deviations sum8. SD=sqrt(8/3). This describes only these three fixed errors, not future population coverage.", "A resample spread is not automatically a confidence interval.")
        return choice(f"For {context}, seed1729 reproduces exactly the same resamples. What follows?", "The calculation is reproducible, but sampling uncertainty and deployment shift remain", ["The fixed seed removes uncertainty", "Reproducibility proves all subgroups are equally accurate"], "A seed fixes a random sequence, not the population. Review subgroup counts, future cohorts and sample variation separately.", "Determinism is not certainty.")
    if objective == 1:
        values = [amount, amount + 2]
        assert StandardScaler(with_std=False).fit(np.array(values).reshape(-1, 1)).mean_[0] == amount + 1
        return numeric(f"For {context}, permitted train values={values}; validation value100 must not fit. Enter the center-only fitted mean.", amount + 1, "Only the two named training values determine the mean. Applying that saved mean to validation data is transform, not a new fit.", "Transforming held-out rows is allowed; letting them determine the mean is not.")
    if objective == 2:
        return choice(f"For {context}, a transform is fitted on all development rows before cross-validation. Fold A's validation rows affected its mean. Is this permitted?", "No: fit preprocessing separately on each fold's training IDs inside the evaluated workflow", ["Yes: all development rows count as training in every fold", "Yes: putting an already globally fitted transform next to a model fixes the leakage"], "Fold-only fitting is stricter than one global training-only fit. Each validation fold must be excluded from preprocessing fit; refit the chosen pipeline on permitted development data only after selection.", "A pipeline name alone does not prove fit provenance.")
    if objective == 3:
        return choice(f"A {context} report has small overall MAE on one source population. What is an honest limitation?", "Performance may differ for new times, sources and small subgroups; inspect subgroup counts/errors and shift", ["The overall metric guarantees every subgroup", "A high held-out score establishes a causal effect"], "The deployment population and sampling scheme limit what the comparison supports. Small subgroups and shifted sources need separate evidence, not a promise from the aggregate.", "A mean error can conceal sparse or harmed subgroups.")
    return choice(f"For {context}, which reproducible comparison record permits final evaluation after selection?", "Record dataset/split IDs, target/units, fit IDs, seed, versions, metric convention and frozen selection; preserve final-test isolation", ["Record only the best score and tune again on final-test feedback", "A seed alone defines the data, metric and permissions"], "Reproducibility requires data identity, learned-state provenance, settings and metric semantics. Final-test permission follows frozen selection, not merely a small error.", "The winning score is not a complete audit trail.")


def family_from_case(lesson, objective, variant, case):
    objective_id = f"EV{lesson:02}.O{objective}"
    mode, suffix = ("practice", "AB"[variant]) if variant < 2 else ("independent", "ABC"[variant - 2])
    expected, alternatives = case["expected"], case["alternatives"]
    options = [{"id": "reference", "label": str(expected)}] + [{"id": f"counter{index}", "label": value} for index, value in enumerate(alternatives)]
    shift = (lesson + objective + variant) % len(options)
    options = options[shift:] + options[:shift]
    decision = {"id": "decision", "kind": case["kind"], "label": "Decision or calculation"}
    if case["kind"] == "choice":
        decision["options"] = options
    answer = {"kind": "choice", "optionId": "reference"} if case["kind"] == "choice" else {"kind": "number", "value": expected}
    atoms, accepted = [decision], [answer]
    if objective == 2:
        reasons = [{"id": "mechanism", "label": case["reason"]}, {"id": "shortcut", "label": case["misconception"] + " Therefore the shortcut is acceptable."}, {"id": "score", "label": "A high score alone proves all information boundaries and conclusions are valid."}]
        shift = variant % 3
        atoms.append({"id": "reason", "kind": "choice", "label": "Explain the mechanism or protected boundary", "options": reasons[shift:] + reasons[:shift]})
        accepted.append({"kind": "choice", "optionId": "mechanism"})
    return {"id": f"{objective_id}.{mode}.{suffix}", "objective": objective_id, "critical": objective == 2, "prompt": case["label"], "code": "", "atoms": atoms, "accepted": [accepted], "explanation": case["reason"], "remediation": case["misconception"] + " " + case["reason"]}


def authored_catalog():
    original = json.loads((ROOT / "apps/web/app/supervised/foundation/authored.json").read_text())
    private = json.loads((ROOT / "python/tests/fixtures/supervised-ev01-reference.json").read_text())
    practice = [item["family"] for item in original["practice"]]
    independent = [item["family"] for item in private["independent"]]
    references = []
    for lesson in range(2, 7):
        for objective in range(1, 5):
            for variant in range(5):
                case = reference_case(lesson, objective, variant)
                family = family_from_case(lesson, objective, variant, case)
                (practice if variant < 2 else independent).append(family)
                references.append({"family_id": family["id"], "lesson": lesson, "objective": objective, "variant": variant, "case": case})
    return {"content": CONTENT, "practice": practice, "independent": independent, "reference_cases": references, "ev01_requalification": "Original 8 practice and 12 private independent definitions retained exactly; reviewed into full-EV forms without any evidence import."}


if __name__ == "__main__":
    print(json.dumps(authored_catalog(), ensure_ascii=False, allow_nan=False, indent=2))
