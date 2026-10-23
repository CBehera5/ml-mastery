"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
const mk = (id: string, title: string, intro: string, bridge: CodeLabConfig["bridge"], cellTitle: string, starter: string, solution: string, checks: string, reflection: [string, string], footer: string, presets: CodeLabConfig["cell"]["presets"] = []): CodeLabConfig => ({
  id, title, intro: <p>{intro}</p>, bridge, cell: { title: cellTitle, starter, solution, checks, expose: [], presets }, reflections: [{ question: <>{reflection[0]}</>, answer: <>{reflection[1]}</> }], footer: <>{footer}</>,
});

/* EV01 */
const E1_STARTER = `features = {"complaints": -3, "tenure": -400, "upgrade request": 12, "cancellation flag": 60}   # day each value is recorded
prediction_day = 0

def usable(features, day):
    return []   # TODO 1: the names of columns recorded on or before this day

def groups_overlap(train_groups, test_groups):
    return False   # TODO 2: True if any source/template group appears in both train and test

print("usable on day 0:", usable(features, prediction_day))
print("same template in train and test?", groups_overlap(["a", "b"], ["b", "c"]))
`;
const E1_SOL = swap(E1_STARTER, [
  ["    return []   # TODO 1: the names of columns recorded on or before this day", "    return [name for name, d in features.items() if d <= day]"],
  ["    return False   # TODO 2: True if any source/template group appears in both train and test", "    return len(set(train_groups) & set(test_groups)) > 0"],
]);
const E1_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "on day 0 only complaints and tenure are usable", "passed": sorted(usable(features, 0)) == ["complaints", "tenure"], "hint": "usable gave %r. Keep a column only if its recorded day is on or before the prediction day." % (usable(features, 0),)})
    results.append({"name": "the day-60 cancellation flag is blocked on day 30", "passed": "cancellation flag" not in usable(features, 30) and "upgrade request" in usable(features, 30), "hint": "On day 30 the upgrade request (day 12) is known but the cancellation flag (day 60) is not."})
    results.append({"name": "a column recorded exactly on the prediction day is allowed", "passed": usable({"x": 5}, 5) == ["x"], "hint": "The rule is recorded day ≤ prediction day, so equality is allowed."})
    results.append({"name": "shared template groups are detected", "passed": groups_overlap(["a", "b"], ["b", "c"]) is True and groups_overlap(["a"], ["b"]) is False, "hint": "groups_overlap should be True only when a group name appears on both sides."})
${fail}`;
export const EV1_CODE = mk("evmomentcode", "Draw the line at prediction time", "Two small checks catch two of the most common leaks: using a column from the future, and testing on something that shares a source with training.", [{ math: "usable if day ≤ t", code: "d <= day", note: "Known by the prediction moment." }, { math: "train ∩ test = ∅ (by group)", code: "set(train) & set(test)", note: "No shared sources." }], "usable() and groups_overlap()", E1_STARTER, E1_SOL, E1_CHECKS, ["A column strongly predicts the outcome but is recorded after it. Can you use it?", "No. If it would not exist at the moment you need the prediction, the model could never run in practice, however good its score looks."], "On day 0 only complaints and tenure are known. The cancellation flag arrives on day 60 and is blocked.");

/* EV02 */
const E2_STARTER = `y = [1, 3]
pred = [3, 3]

def mae(pred, y):
    return 0.0   # TODO 1: the average of |prediction − actual|

def r_squared(pred, y):
    return 0.0   # TODO 2: 1 − (sum of squared errors) ÷ (sum of squared gaps from the average of y)

def error_reduction(baseline, candidate):
    return 0.0   # TODO 3: how much smaller the candidate error is, as a share of the baseline

print("MAE:", mae(pred, y), " R²:", r_squared(pred, y))
print("reduction from 5 to 4:", error_reduction(5, 4))
`;
const E2_SOL = swap(E2_STARTER, [
  ["    return 0.0   # TODO 1: the average of |prediction − actual|", "    return sum(abs(p - a) for p, a in zip(pred, y)) / len(y)"],
  ["    return 0.0   # TODO 2: 1 − (sum of squared errors) ÷ (sum of squared gaps from the average of y)", "    m = sum(y) / len(y)\n    sse = sum((p - a) ** 2 for p, a in zip(pred, y))\n    sst = sum((a - m) ** 2 for a in y)\n    return 1 - sse / sst"],
  ["    return 0.0   # TODO 3: how much smaller the candidate error is, as a share of the baseline", "    return (baseline - candidate) / baseline"],
]);
const E2_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "predictions [3, 3] for prices [1, 3] have MAE 1", "passed": _close(mae([3, 3], [1, 3]), 1.0), "hint": "mae gave %r. The errors are 2 and 0, whose average is 1." % (mae([3, 3], [1, 3]),)})
    results.append({"name": "R² is −1 (worse than guessing the average)", "passed": _close(r_squared([3, 3], [1, 3]), -1.0), "hint": "r_squared gave %r. Errors sum to 4 and the spread of y is 2, so 1 − 4/2 = −1." % (r_squared([3, 3], [1, 3]),)})
    results.append({"name": "going from 5 to 4 is a 20% reduction", "passed": _close(error_reduction(5, 4), 0.2), "hint": "error_reduction gave %r. It is (5 − 4) ÷ 5, not 80%%." % (error_reduction(5, 4),)})
    results.append({"name": "predicting the average gives R² = 0", "passed": _close(r_squared([2, 2], [1, 3]), 0.0), "hint": "Predicting the mean of y exactly explains none of the spread, so R² is 0."})
${fail}`;
export const EV2_CODE = mk("everrorcode", "Error, R² and the size of an improvement", "A score only means something against a baseline. Three tiny functions show how to say how much better a model really is.", [{ math: "MAE = mean |ŷ − y|", code: "sum(abs(p - a) ...) / len(y)", note: "Average miss." }, { math: "R² = 1 − SSE ÷ SST", code: "1 - sse / sst", note: "Below 0 means worse than the average." }, { math: "reduction = (base − cand) ÷ base", code: "(baseline - candidate) / baseline", note: "A share of the baseline error." }], "mae(), r_squared() and error_reduction()", E2_STARTER, E2_SOL, E2_CHECKS, ["A model cuts the error from 5 to 4. Is it 80% accurate?", "No. It cut the baseline error by 20%. Accuracy is a different idea that applies to classes, not to rupee errors."], "Predictions of 3 and 3 for prices 1 and 3 have an average miss of 1 and an R² of −1. Cutting error from 5 to 4 is a 20% reduction.");

/* EV03 */
const E3_STARTER = `def accuracy(tp, fp, tn, fn):
    return 0.0   # TODO 1: correct calls ÷ all calls

def precision(tp, fp):
    return 0.0   # TODO 2: of the items we flagged, the share that were real (None if we flagged none)

def recall(tp, fn):
    return 0.0   # TODO 3: of the real cases, the share we found (None if there are none)

def f1(tp, fp, fn):
    return 0.0   # TODO 4: 2·TP ÷ (2·TP + FP + FN)

print("100 items, one real case, always say 'Good':", accuracy(0, 0, 99, 1), "accuracy, recall", recall(0, 1))
print("TP 2, FP 1, TN 1, FN 1 → precision", round(precision(2, 1), 4), "recall", round(recall(2, 1), 4), "F1", round(f1(2, 1, 1), 4))
`;
const E3_SOL = swap(E3_STARTER, [
  ["    return 0.0   # TODO 1: correct calls ÷ all calls", "    return (tp + tn) / (tp + fp + tn + fn)"],
  ["    return 0.0   # TODO 2: of the items we flagged, the share that were real (None if we flagged none)", "    return tp / (tp + fp) if tp + fp else None"],
  ["    return 0.0   # TODO 3: of the real cases, the share we found (None if there are none)", "    return tp / (tp + fn) if tp + fn else None"],
  ["    return 0.0   # TODO 4: 2·TP ÷ (2·TP + FP + FN)", "    return 2 * tp / (2 * tp + fp + fn) if tp else 0.0"],
]);
const E3_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "always saying 'Good' scores 99% accuracy with recall 0", "passed": _close(accuracy(0, 0, 99, 1), 0.99) and _close(recall(0, 1), 0.0), "hint": "accuracy gave %r and recall gave %r. It finds none of the one real case." % (accuracy(0, 0, 99, 1), recall(0, 1))})
    results.append({"name": "TP 2, FP 1, TN 1, FN 1: precision 2/3 and recall 2/3", "passed": _close(precision(2, 1), 2 / 3) and _close(recall(2, 1), 2 / 3), "hint": "precision gave %r and recall gave %r." % (precision(2, 1), recall(2, 1))})
    results.append({"name": "F1 is 2/3 for that table", "passed": _close(f1(2, 1, 1), 2 / 3), "hint": "f1 gave %r. It is 4 ÷ (4 + 1 + 1)." % (f1(2, 1, 1),)})
    results.append({"name": "precision is undefined when nothing is flagged", "passed": precision(0, 0) is None, "hint": "With no flagged items precision(0, 0) should be None."})
${fail}`;
export const EV3_CODE = mk("evconfcode", "Four boxes, four numbers", "Accuracy, precision, recall and F1 all come from the same four counts. They answer different questions.", [{ math: "precision = TP ÷ (TP + FP)", code: "tp / (tp + fp)", note: "How trustworthy a flag is." }, { math: "recall = TP ÷ (TP + FN)", code: "tp / (tp + fn)", note: "How many real cases were found." }, { math: "F1 = 2TP ÷ (2TP + FP + FN)", code: "2 * tp / (2 * tp + fp + fn)", note: "A balance of the two." }], "accuracy(), precision(), recall() and f1()", E3_STARTER, E3_SOL, E3_CHECKS, ["Why can a model with 99% accuracy still be useless?", "If almost every item is negative, saying 'negative' for everything is right 99% of the time and finds no real cases. Recall exposes that."], "Among 100 items with one real case, always saying 'Good' is 99% accurate with recall 0. A table with TP 2, FP 1, TN 1, FN 1 has precision, recall and F1 of 2/3.");

/* EV04 */
const E4_STARTER = `import math

ys = [1, 0]               # the first customer left, the second stayed
probs = [0.8, 0.2]

def brier(ps, ys):
    return 0.0   # TODO 1: the average of (probability − outcome)²

def log_loss(ps, ys):
    return 0.0   # TODO 2: the average of −ln(p) for leavers and −ln(1 − p) for stayers

def ranks_correctly(p_leaver, p_stayer):
    return False   # TODO 3: True when the leaver got the higher chance

print("Brier:", brier(probs, ys), " log loss:", round(log_loss(probs, ys), 6))
print("with [0.6, 0.4] → Brier:", round(brier([0.6, 0.4], ys), 4), " log loss:", round(log_loss([0.6, 0.4], ys), 6))
`;
const E4_SOL = swap(E4_STARTER, [
  ["    return 0.0   # TODO 1: the average of (probability − outcome)²", "    return sum((p - y) ** 2 for p, y in zip(ps, ys)) / len(ys)"],
  ["    return 0.0   # TODO 2: the average of −ln(p) for leavers and −ln(1 − p) for stayers", "    return sum(-math.log(p) if y == 1 else -math.log(1 - p) for p, y in zip(ps, ys)) / len(ys)"],
  ["    return False   # TODO 3: True when the leaver got the higher chance", "    return p_leaver > p_stayer"],
]);
const E4_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "Brier for [.8, .2] is 0.04", "passed": _close(brier([0.8, 0.2], [1, 0]), 0.04), "hint": "brier gave %r. Both squared gaps are 0.2² = 0.04." % (brier([0.8, 0.2], [1, 0]),)})
    results.append({"name": "log loss for [.8, .2] is 0.223144", "passed": _close(log_loss([0.8, 0.2], [1, 0]), 0.22314355, 1e-6), "hint": "log_loss gave %r. Both rows cost −ln(0.8)." % (log_loss([0.8, 0.2], [1, 0]),)})
    results.append({"name": "[.6, .4] keeps the order but Brier becomes 0.16 and log loss 0.510826", "passed": ranks_correctly(0.6, 0.4) is True and _close(brier([0.6, 0.4], [1, 0]), 0.16) and _close(log_loss([0.6, 0.4], [1, 0]), 0.51082562, 1e-6), "hint": "Same ranking, but a less confident model has worse Brier and log loss."})
    results.append({"name": "a flipped order is not ranked correctly", "passed": ranks_correctly(0.3, 0.6) is False, "hint": "ranks_correctly(0.3, 0.6) should be False: the leaver got the lower chance."})
${fail}`;
export const EV4_CODE = mk("evprobacode", "Rank, then check the honesty", "Ranking says who is riskier. Brier score and log loss check how sure the model was, which matters whenever the number itself will be used.", [{ math: "Brier = mean (p − y)²", code: "(p - y) ** 2", note: "Squared probability error." }, { math: "log loss = mean(−ln p_true)", code: "-math.log(p)", note: "Punishes confident misses." }], "brier(), log_loss() and ranks_correctly()", E4_STARTER, E4_SOL, E4_CHECKS, ["Two models rank customers in exactly the same order. Must they be equally good?", "No. One can be calibrated and the other over-cautious. Same order, different probabilities, different Brier and log loss."], "For chances of 0.8 and 0.2 the Brier score is 0.04 and the log loss is about 0.223. Chances of 0.6 and 0.4 keep the order but give 0.16 and 0.511.", [preset("Try [0.9, 0.1]", "A more confident model.", /^probs = \[0.8, 0.2\]/m, "probs = [0.9, 0.1]")]);

/* EV05 */
const E5_STARTER = `pairs = [(8, 9), (3, 4), (1, 12)]   # (training error, development error) at three model flexibilities
resamples = [2, 4, 6]

def best_capacity(pairs):
    return 0   # TODO 1: the position of the pair with the lowest development error (the first wins a tie)

def mean(v):
    return sum(v) / len(v)

def spread(v):
    return 0.0   # TODO 2: the standard deviation, dividing by n (not n − 1)

print("best on development data:", best_capacity(pairs), " best on training data:", min(range(3), key=lambda i: pairs[i][0]))
print("mean:", mean(resamples), " spread:", round(spread(resamples), 6))
`;
const E5_SOL = swap(E5_STARTER, [
  ["    return 0   # TODO 1: the position of the pair with the lowest development error (the first wins a tie)", "    best = 0\n    for i, (_, dev) in enumerate(pairs):\n        if dev < pairs[best][1]:\n            best = i\n    return best"],
  ["    return 0.0   # TODO 2: the standard deviation, dividing by n (not n − 1)", "    m = mean(v)\n    return (sum((x - m) ** 2 for x in v) / len(v)) ** 0.5"],
]);
const E5_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "the middle capacity wins on development data", "passed": best_capacity([(8, 9), (3, 4), (1, 12)]) == 1, "hint": "best_capacity gave %r. Use the second number of each pair (development error), not the first." % (best_capacity([(8, 9), (3, 4), (1, 12)]),)})
    results.append({"name": "the most flexible model fits training best but is not chosen", "passed": min(range(3), key=lambda i: pairs[i][0]) == 2 and best_capacity(pairs) != 2, "hint": "Training error always favours the most flexible model. Development error is the one to choose by."})
    results.append({"name": "errors [2, 4, 6] have mean 4 and spread √(8/3) ≈ 1.632993", "passed": _close(mean([2, 4, 6]), 4.0) and _close(spread([2, 4, 6]), 1.632993, 1e-6), "hint": "spread gave %r. Divide the squared gaps (4 + 0 + 4 = 8) by n = 3, then take the square root." % (spread([2, 4, 6]),)})
    results.append({"name": "a tie keeps the first", "passed": best_capacity([(1, 5), (2, 5)]) == 0, "hint": "When development errors tie, keep the earlier (simpler) entry."})
${fail}`;
export const EV5_CODE = mk("evcapcode", "Choose by unseen error, then say how much it wobbles", "Pick capacity by the error on houses the model did not learn from, and describe the wobble across resamples honestly.", [{ math: "choose argmin development error", code: "dev < pairs[best][1]", note: "Not training error." }, { math: "spread = √(mean (e − ē)²)", code: "(sum((x - m) ** 2 ...) / len(v)) ** 0.5", note: "Descriptive, not an interval." }], "best_capacity() and spread()", E5_STARTER, E5_SOL, E5_CHECKS, ["The resampled errors are 2, 4 and 6, with a spread of about 1.63. Is that a 95% range for a new house?", "No. It describes how much the score moved across these resamples, not where a new house's error will fall."], "The middle capacity has the best development error (4), even though the flexible model fits training best. Errors 2, 4 and 6 have mean 4 and spread about 1.63.");

/* EV06 */
const E6_STARTER = `train = [2, 4, 6, 8]
valid = [20, 22]
folds = [([2, 4], [6, 8]), ([6, 8], [2, 4])]   # (rows a fold may fit on, rows it is tested on)

def mean(v):
    return sum(v) / len(v)

def centre_for(fit_rows):
    return 0.0   # TODO 1: the centre fitted on these rows

def leaked(fit_rows, held_out_rows):
    return False   # TODO 2: True if any held-out row was used to fit

def fold_centres(folds):
    return []   # TODO 3: one centre per fold, fitted on that fold's fit rows only

print("training centre:", centre_for(train), " with validation:", round(centre_for(train + valid), 4))
print("per fold:", fold_centres(folds))
`;
const E6_SOL = swap(E6_STARTER, [
  ["    return 0.0   # TODO 1: the centre fitted on these rows", "    return mean(fit_rows)"],
  ["    return False   # TODO 2: True if any held-out row was used to fit", "    return any(r in fit_rows for r in held_out_rows)"],
  ["    return []   # TODO 3: one centre per fold, fitted on that fold's fit rows only", "    return [centre_for(fit) for fit, hold in folds]"],
]);
const E6_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "training centre is 5; adding validation changes it to 31/3", "passed": _close(centre_for(train), 5.0) and _close(centre_for(train + valid), 31 / 3), "hint": "centre_for gave %r and %r." % (centre_for(train), centre_for(train + valid))})
    results.append({"name": "fitting on training plus validation counts as a leak", "passed": leaked(train + valid, valid) is True and leaked(train, valid) is False, "hint": "leaked should be True only when a held-out row appears among the fit rows."})
    results.append({"name": "fold A centres on 3 and fold B on 7", "passed": fold_centres(folds) == [3.0, 7.0], "hint": "fold_centres gave %r. Each fold fits only on its own fit rows." % (fold_centres(folds),)})
    results.append({"name": "a global centre of 5 is not what either fold should use", "passed": all(not _close(c, 5.0) for c in fold_centres(folds)), "hint": "Using the global training mean before cross-validation leaks across folds."})
${fail}`;
export const EV6_CODE = mk("evhonestcode", "Refit inside every fold", "A learned step is part of the model. Fitting it once outside the folds quietly lets every fold see its neighbours.", [{ math: "fit on fit-rows only", code: "centre_for(fit)", note: "One per fold." }, { math: "leak: held-out ∩ fit ≠ ∅", code: "any(r in fit_rows ...)", note: "Detect the overlap." }], "centre_for(), leaked() and fold_centres()", E6_STARTER, E6_SOL, E6_CHECKS, ["Why does fitting the centre once on all training rows before cross-validation still leak?", "Each fold's validation rows were part of that fit, so the centre already knew something about them. Refit inside each fold."], "Training values 2, 4, 6, 8 centre at 5. Adding validation values 20 and 22 would move it to 31/3. Fold A may fit only on 2 and 4 (centre 3), fold B only on 6 and 8 (centre 7).");
