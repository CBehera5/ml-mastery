"""Trusted offline Logistic exercise fixtures; never evaluates learner programs."""
import itertools
import json
import math


def case(lesson, objective, variant):
    probability = [.25, .5, .75, .9, .1][variant]
    odds = probability / (1 - probability)
    sample_size = variant + 1
    threshold = [.5, .6, .7, 1, 0][variant]
    probabilities = [.2, .6, .8]
    labels = [int(value >= threshold) for value in probabilities]
    context = ["A churn training example", "A changed development cohort", "An unseen-customer example", "A changed cost scenario", "A new deployment cohort"][variant]
    prefix = context + ": "
    if lesson == 1:
        cases = [
            ("number", f"intercept0, weight1, x=ln({odds!r}). Calculate p(churn)=sigmoid(x), not a hard label.", probability, "A linear score becomes probability through sigmoid; odds=exp(score). Do not treat probability as a class label.", []),
            ("choice", "which sequence correctly distinguishes learning and decisions?", "Fit parameters on training labels, predict saved-model probabilities, then apply a chosen threshold", "Thresholding a saved probability changes the action, not model parameters or the probability; fitting needs permitted training data.", ["Moving a threshold refits model coefficients", "Predicting on a new row must fit its outcome label"]),
            ("choice", f"a feature has coefficient1. Change its value from{sample_size} to{sample_size+1}, holding other features fixed. What changes?", "A one-unit feature change adds1 to log-odds, not1 to probability", "The conditional odds multiply by exp(1); probability change depends on the starting logit and is not a causal effect.", ["The probability must increase by one percentage point", "The coefficient is the causal effect of intervention"]),
            ("choice", f"Raw binary predict_proba for{sample_size} rows is reported with shape({sample_size},), before selecting a class column. What is wrong?", "The class axis is missing: require shape(n,2), then select the positive column by class identity", "Raw binary probabilities have shape(n,2). A selected positive-column vector or hard-label vector can have shape(n,), but is not the full predict_proba matrix.", ["Treat shape(n,) as the complete two-class probability matrix", "Two class columns would incorrectly create two observations per row"]),
        ]
    elif lesson == 2:
        cases = [
            ("number", f"Observed y=1, p={probability}. Calculate natural-log loss for this row.", -math.log(probability), "Loss is minus the natural logarithm of the probability assigned to the observed class, not the thresholded label.", []),
            ("choice", "which labels may influence a model-fitting log-loss gradient?", "Training labels only; held-out labels evaluate and final-test labels must not fit or select", "Log loss depends on the observed label and supplies the training signal; held-out labels must not influence parameter updates or selection.", ["Final-test labels may update parameters if accuracy improves", "Use validation/test labels in the gradient because probability is not a label"]),
            ("number", f"Unweighted one-row illustration y=1,p={probability}, no penalty. Calculate dL/dz.", probability - 1, "For a positive training label, dL/dz=p−1 is negative; a negative gradient step pushes its logit upward. This is not sklearn's optimizer.", []),
            ("choice", "two models predict positive at threshold.5 for y=1, with p=.6 and p=.9. What differs?", "Both labels are correct, but p=.9 has smaller log loss for this observed positive", "Correct hard decisions need not have equal probability quality. For exact y=0,p=1 loss is infinite, separately from library clipping.", ["Equal classification accuracy implies equal log loss", "A correctly classified row always has zero log loss"]),
        ]
    elif lesson == 3:
        cases = [
            ("choice", f"Fixed p=[.2,.6,.8], threshold={threshold}; use p>=threshold. Predict labels.", str(labels), "Equality predicts positive; thresholding never changes the stored probabilities or refits the model.", ["Threshold changes the probabilities themselves", "Use greater-than strictly and always call equality negative"]),
            ("choice", "a threshold reduces development decision cost. What is permitted?", "Select it on development costs, freeze it, and keep final-test feedback out of selection", "Changing a threshold is a decision rule, not retraining. Honest selection uses development data, not repeated final-test inspection.", ["Retune it after every final-test score", "A lower development cost means the model was retrained"]),
            ("number", f"Actual labels[0,1,1], p=[.2,.6,.8], threshold={threshold}. Count false negatives.", sum(actual == 1 and guess == 0 for actual, guess in zip([0, 1, 1], labels)), "A false negative is actual class1 predicted0. Use the named positive class and equality convention before counting.", []),
            ("choice", "one churn event in100 customers; all-stay predictions are99% accurate. What follows?", "Positive class1 has zero recall; majority accuracy alone does not establish useful detection", "Prevalence changes accuracy interpretation; state positive class, denominators and decision costs. No predicted positives makes precision undefined.", ["99% accuracy proves excellent churn probability estimates", "There are no errors relevant to the positive class"]),
        ]
    elif lesson == 4:
        cases = [
            ("choice", "why fit scaling inside training folds before a coefficient penalty?", "Scaling changes penalty geometry and must learn only from each fold training set", "Changing feature units changes coefficient magnitudes; globally learned statistics leak held-out inputs even without targets.", ["All feature scales leave the penalty geometry identical", "Scaling can safely learn from all rows because it ignores labels"]),
            ("choice", "in the frozen binary L2/lbfgs workflow, how should larger C and an lbfgs/L1 request be treated?", "Larger C weakens regularization; reject the unsupported lbfgs/L1 tuple", "C is inverse strength under the declared objective, not RG alpha; a mathematical penalty does not make every solver combination supported.", ["Larger C means a larger penalty and lbfgs supports every penalty", "Equal numeric C and Ridge alpha imply identical strength"]),
            ("choice", "raw two-feature classes surround a circular region. What limitation matters?", "A linear logit boundary may underfit; compare fair development alternatives rather than promise a curved separator", "Sigmoid curves the probability scale but does not make the raw-input decision boundary an arbitrary nonlinear shape.", ["The sigmoid automatically makes any curved boundary learnable", "Logistic must win because its probabilities are nonlinear"]),
            ("choice", "an almost separated sample yields very large weights or a convergence warning. What is defensible?", "Inspect scaling, penalty, convergence and held-out behavior; do not assume a stable finite unregularized solution", "Separation and weak regularization can yield unstable coefficients; a returned vector or reproducible seed is not a convergence/generalization guarantee.", ["A large coefficient proves causal importance", "Ignore convergence warnings if training accuracy is perfect"]),
        ]
    elif lesson == 5:
        cases = [
            ("choice", f"fit is complete; classes_=[0,1], probability row=[{1-probability},{probability}]. What is p(churn)?", str(probability), "Select the column for class1 from predict_proba; prediction uses learned training state, not the new row's outcome.", [str(1-probability) if probability != .5 else "Both columns are labels", "A new row requires refitting on its label"]),
            ("choice", "a cancellation flag recorded after the prediction date or a globally fitted scaler improves a score. Is it valid?", "No: reject unavailable target-derived features and fit learned transforms only on training/fold-training rows", "Prediction-time availability and separate fold-only fitting protect evaluation; good arithmetic or accuracy does not repair leakage.", ["Any feature is allowed if correlation is high", "A pipeline name guarantees validity even when its scaler was prefit globally"]),
            ("slots", "Repair the whole fold-local classification pipeline; preserve aligned targets and select the pipeline within development CV.", None, "Align features/targets by row ID, fit the scaler on each fold training set, then fit the estimator on those same rows. Pass the whole unfitted pipeline to CV.", []),
            ("choice", "a DummyClassifier scores on easy rows and Logistic on different rows. Can their accuracy be compared as a fair model test?", "No: compare on identical held-out IDs, target definition and metric/cost protocol", "Baselines are meaningful only with aligned evaluation rows and the same information permissions.", ["Yes: higher raw accuracy always identifies the better model", "Training accuracy is sufficient to replace a baseline comparison"]),
        ]
    else:
        cases = [
            ("choice", "a false negative misses a future churn event; a small subgroup has few events. What should a report do?", "State error counts/costs and subgroup sample limits rather than certify fairness from a small percentage", "False positives and negatives have different consequences; unstable small-subgroup estimates need uncertainty and context.", ["A small subgroup's zero observed errors proves universal fairness", "Only overall accuracy needs reporting"]),
            ("choice", "a coefficient odds ratio or predicted probability is high. What is justified?", "A conditional model association, not a causal intervention effect or guaranteed future risk", "Calibration, conditioning and population shift limit probability interpretation; odds ratios are not intervention effects.", ["The coefficient proves an intervention prevents churn", "A probability guarantees the same event rate in every future population"]),
            ("choice", "a supplied nonlinear candidate has lower development cost than Logistic on the same rows. What is sensible?", "Investigate a fair reproducible comparison and failure modes without declaring a universal winner", "Logistic offers a linear logit mechanism; supplied KNN/tree candidates are comparisons, not automatically superior or newly implemented models.", ["Always choose Logistic regardless of the question", "One development result proves the candidate wins in every population"]),
            ("choice", "two score sets rank customers identically but have different probability confidence. What must be reported?", "Ranking does not establish calibration; assess probability quality and shift/linear-boundary limitations", "Equal ordering or hard accuracy can coexist with different log loss. Calibration is not certified by rank or a fixed seed.", ["Equal ranking proves equal calibrated risk", "A fixed seed removes population shift"]),
        ]
    kind, prompt, expected, explanation, distractors = cases[objective - 1]
    return kind, prefix + prompt, expected, explanation, distractors


def catalog():
    families = []
    for lesson, objective, variant in itertools.product(range(1, 7), range(1, 5), range(5)):
        kind, prompt, expected, explanation, distractors = case(lesson, objective, variant)
        mode, form = ("practice", "AB"[variant]) if variant < 2 else ("assessment", "ABC"[variant - 2])
        identity = f"LG{lesson:02}.O{objective}"
        decision = {"id": "decision", "kind": kind, "label": "Decision or calculation"}
        if kind == "choice":
            options = [{"id": "supported", "label": expected}] + [{"id": f"wrong{index}", "label": label} for index, label in enumerate(distractors)]
            shift = (lesson + objective + variant) % 3
            decision["options"] = options[shift:] + options[:shift]
            accepted = [[{"kind": "choice", "optionId": "supported"}]]
        elif kind == "number":
            accepted = [[{"kind": "number", "value": expected}]]
        else:
            options = [{"id": token, "label": label} for token, label in [("align", "Align feature/target row IDs"), ("align_alias", "The identical row-ID alignment (alias)"), ("scale", "Fold-training scaler fit"), ("model", "Estimator fit on the same fold training rows"), ("test_fit", "Fit or select using final-test rows")]]
            decision["slots"] = [{"id": f"step{index+1}", "label": f"Pipeline step{index+1}", "options": options} for index in range(3)]
            accepted = [[{"kind": "slots", "entries": [{"slotId": "step1", "optionId": token}, {"slotId": "step2", "optionId": "scale"}, {"slotId": "step3", "optionId": "model"}]}] for token in ["align", "align_alias"]]
        atoms = [decision]
        if objective == 2:
            reasons = [{"id": "mechanism", "label": explanation}, {"id": "shortcut", "label": "A good training score makes probabilities causal and final-test fitting or threshold selection valid."}]
            if variant % 2:
                reasons.reverse()
            atoms.append({"id": "reason", "kind": "choice", "label": "Explain the mechanism or protected boundary", "options": reasons})
            accepted = [answers + [{"kind": "choice", "optionId": "mechanism"}] for answers in accepted]
        families.append({"id": f"{identity}.{mode}.{form}", "objective": identity, "critical": objective == 2, "prompt": prompt, "code": "", "atoms": atoms, "accepted": accepted, "explanation": explanation, "remediation": f"Recall {identity}, the worked contrast and the prediction/evaluation boundary. " + explanation})
    return {"content": "supervised.logistic.1.0.0", "families": families}


if __name__ == "__main__":
    print(json.dumps(catalog(), ensure_ascii=False, sort_keys=True, indent=2, allow_nan=False))
