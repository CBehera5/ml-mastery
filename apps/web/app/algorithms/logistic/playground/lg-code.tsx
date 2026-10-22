"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";
import { OUTCOMES, SCORES, toPy } from "./lg-math";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})`;

/* LG01 · score → probability → action */
export const SIG_STARTER = `import math

b, w, x = 0, 1, math.log(3)   # intercept, weight, feature value
threshold = 0.7               # the team's action bar

def sigmoid(z):
    return 0.5   # TODO 1: squash any score into a chance between 0 and 1: 1 / (1 + e^(−z))

def decide(p, threshold):
    return 0   # TODO 2: 1 (act) if the chance is at least the bar, otherwise 0

z = b + w * x
p = sigmoid(z)
print("score:", round(z, 4), " chance of churn:", round(p, 4), " odds:", round(p / (1 - p), 3))
print("act at a 70% bar?", decide(p, 0.7), " at an 80% bar?", decide(p, 0.8))
`;
export const SIG_SOLUTION = swap(SIG_STARTER, [
  ["    return 0.5   # TODO 1: squash any score into a chance between 0 and 1: 1 / (1 + e^(−z))", "    return 1 / (1 + math.exp(-z))"],
  ["    return 0   # TODO 2: 1 (act) if the chance is at least the bar, otherwise 0", "    return 1 if p >= threshold else 0"],
]);
export const SIG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "sigmoid(0) = 0.5", "passed": _close(sigmoid(0), 0.5), "hint": "sigmoid(0) returned %r. A score of 0 is a coin flip: 1 ÷ (1 + 1) = 0.5." % (sigmoid(0),)})
    results.append({"name": "sigmoid(ln 3) = 0.75", "passed": _close(sigmoid(math.log(3)), 0.75), "hint": "sigmoid(ln 3) returned %r. e^(−ln 3) = 1/3, so 1 ÷ (1 + 1/3) = 0.75." % (sigmoid(math.log(3)),)})
    results.append({"name": "sigmoid(−z) = 1 − sigmoid(z)", "passed": _close(sigmoid(-2), 1 - sigmoid(2)), "hint": "The S-curve is symmetric: a score of −2 gives the leftover chance of a score of +2."})
    results.append({"name": "p = 0.75 acts at a 70% bar but not at an 80% bar", "passed": decide(0.75, 0.7) == 1 and decide(0.75, 0.8) == 0, "hint": "decide returned (%r, %r). Act (1) only when p is at least the bar." % (decide(0.75, 0.7), decide(0.75, 0.8))})
    results.append({"name": "a chance exactly at the bar counts as acting", "passed": decide(0.7, 0.7) == 1, "hint": "The rule is p ≥ bar, so equality acts."})
${fail}
`;
export const SIG_CODE: CodeLabConfig = {
  id: "lgsigcode", title: "Squash a score, then decide", intro: <p>Logistic regression has two separate steps. First it turns a score into a chance. Only afterwards does a person (or a rule you write) turn the chance into an action.</p>,
  bridge: [{ math: "p = 1 ÷ (1 + e^(−z))", code: "1 / (1 + math.exp(-z))", note: "The sigmoid." }, { math: "act if p ≥ t", code: "1 if p >= threshold else 0", note: "The decision rule, applied after prediction." }],
  cell: { title: "sigmoid() and decide()", starter: SIG_STARTER, solution: SIG_SOLUTION, checks: SIG_CHECKS, expose: [], presets: [preset("Try a 0.5 weight", "A weaker signal.", /^b, w, x = 0, 1,/m, "b, w, x = 0, 0.5,")] },
  reflections: [{ question: <>Raising the bar from 70% to 80% changed the action. Did it change the chance?</>, answer: <>No. The chance is a property of the model and the customer. The bar is a business choice about how sure we need to be before acting.</> }],
  footer: <>The score ln 3 ≈ 1.0986 becomes a 75% chance. Odds are 3 to 1. It acts at a 70% bar and does not at an 80% bar.</>,
};

/* LG02 · log loss */
export const LOSS_STARTER = `import math

def row_loss(y, p):
    return 0.0   # TODO 1: −ln(p) if the customer left (y = 1), −ln(1 − p) if they stayed (y = 0)

def mean_loss(ys, ps):
    return 0.0   # TODO 2: the average row_loss over all customers

def gradient(y, p):
    return 0.0   # TODO 3: how the loss changes with the score: p − y

print("left, model said 50%:", round(row_loss(1, 0.5), 6))
print("left, model said 90%:", round(row_loss(1, 0.9), 6))
print("average over two customers:", round(mean_loss([1, 0], [0.9, 0.2]), 6))
`;
export const LOSS_SOLUTION = swap(LOSS_STARTER, [
  ["    return 0.0   # TODO 1: −ln(p) if the customer left (y = 1), −ln(1 − p) if they stayed (y = 0)", "    return -math.log(p) if y == 1 else -math.log(1 - p)"],
  ["    return 0.0   # TODO 2: the average row_loss over all customers", "    return sum(row_loss(y, p) for y, p in zip(ys, ps)) / len(ys)"],
  ["    return 0.0   # TODO 3: how the loss changes with the score: p − y", "    return p - y"],
]);
export const LOSS_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "row_loss(1, 0.5) = ln 2", "passed": _close(row_loss(1, 0.5), math.log(2)), "hint": "row_loss(1, 0.5) returned %r. It is −ln(0.5) ≈ 0.6931." % (row_loss(1, 0.5),)})
    results.append({"name": "row_loss(1, 0.9) = 0.105361", "passed": _close(row_loss(1, 0.9), 0.105360516), "hint": "row_loss(1, 0.9) returned %r. A customer who left, given 90%%, costs −ln(0.9)." % (row_loss(1, 0.9),)})
    results.append({"name": "row_loss(0, 0.1) = 0.105361 too", "passed": _close(row_loss(0, 0.1), 0.105360516), "hint": "For a customer who stayed, use −ln(1 − p) = −ln(0.9)."})
    results.append({"name": "mean_loss([1, 0], [0.9, 0.2]) = 0.164252", "passed": _close(mean_loss([1, 0], [0.9, 0.2]), (0.105360516 + 0.223143551) / 2), "hint": "mean_loss returned %r. Average −ln(0.9) and −ln(0.8)." % (mean_loss([1, 0], [0.9, 0.2]),)})
    results.append({"name": "gradient(1, 0.5) = −0.5 (push the score up)", "passed": _close(gradient(1, 0.5), -0.5), "hint": "gradient(1, 0.5) returned %r. It is p − y = 0.5 − 1." % (gradient(1, 0.5),)})
${fail}
`;
export const LOSS_CODE: CodeLabConfig = {
  id: "lglosscode", title: "Score the chance, not just the label", intro: <p>Log loss rewards putting a high chance on what really happened. Writing it out shows why a confident miss hurts so much more than a timid one.</p>,
  bridge: [{ math: "loss = −ln p (left) or −ln(1 − p) (stayed)", code: "-math.log(p) if y == 1 else -math.log(1 - p)", note: "The penalty for one customer." }, { math: "∂loss/∂z = p − y", code: "p - y", note: "Negative means the score should rise." }],
  cell: { title: "row_loss(), mean_loss() and gradient()", starter: LOSS_STARTER, solution: LOSS_SOLUTION, checks: LOSS_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>A model says 90% for a customer who left, and another says 51%. Both call it correctly at a 50% bar. Do they have the same loss?</>, answer: <>No. 90% gives about 0.105, while 51% gives about 0.673. Log loss rewards being right with confidence, which accuracy at a 50% bar cannot see.</> }],
  footer: <>A customer who left, scored at 50%, costs ln 2 ≈ 0.693. Scored at 90% they cost only 0.105. The gradient is −0.5, so the score should move up.</>,
};

/* LG03 · thresholds and costs */
const PS20 = [0.05, 0.1, 0.12, 0.2, 0.22, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.92, 0.95];
const YS20 = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1];
export const THR_STARTER = `ps = ${toPy(PS20)}   # model's chance of churn
ys = ${toPy(YS20)}   # 1 = the customer really left

def counts(ps, ys, t):
    tp = fp = tn = fn = 0
    for p, y in zip(ps, ys):
        guess = 1 if p >= t else 0
        # TODO 1: add one to tp, fp, tn or fn (positive means "left")
    return tp, fp, tn, fn

def precision(tp, fp):
    return 0.0   # TODO 2: of the customers we flagged, the share who really left (None if we flagged nobody)

def recall(tp, fn):
    return 0.0   # TODO 3: of the customers who really left, the share we flagged

def cheapest_bar(ps, ys, cost_fp, cost_fn, bars):
    return bars[0]   # TODO 4: the bar with the lowest cost_fp × fp + cost_fn × fn (the first wins a tie)

tp, fp, tn, fn = counts(ps, ys, 0.5)
print("at 50%: flagged", tp + fp, "caught", tp, "missed", fn)
print("cheapest bar when a miss costs 5:", cheapest_bar(ps, ys, 1, 5, [0.1 * i for i in range(1, 10)]))
`;
export const THR_SOLUTION = swap(THR_STARTER, [
  ["        # TODO 1: add one to tp, fp, tn or fn (positive means \"left\")", "        if guess and y:\n            tp += 1\n        elif guess:\n            fp += 1\n        elif y:\n            fn += 1\n        else:\n            tn += 1"],
  ["    return 0.0   # TODO 2: of the customers we flagged, the share who really left (None if we flagged nobody)", "    return tp / (tp + fp) if tp + fp else None"],
  ["    return 0.0   # TODO 3: of the customers who really left, the share we flagged", "    return tp / (tp + fn) if tp + fn else None"],
  ["    return bars[0]   # TODO 4: the bar with the lowest cost_fp × fp + cost_fn × fn (the first wins a tie)", "    def cost(t):\n        _, f_p, _, f_n = counts(ps, ys, t)\n        return cost_fp * f_p + cost_fn * f_n\n    best = bars[0]\n    for t in bars:\n        if cost(t) < cost(best):\n            best = t\n    return best"],
]);
export const THR_CHECKS = CHECK_PRELUDE + `
try:
    small_p, small_y = [0.2, 0.6, 0.8], [0, 1, 1]
    results.append({"name": "p = [0.2, 0.6, 0.8] at a 0.7 bar: TP 1, FP 0, TN 1, FN 1", "passed": tuple(counts(small_p, small_y, 0.7)) == (1, 0, 1, 1), "hint": "counts returned %r. Only 0.8 is flagged; it really left (TP). 0.6 really left but was not flagged (FN)." % (tuple(counts(small_p, small_y, 0.7)),)})
    results.append({"name": "at a 0.6 bar equality is flagged: recall becomes 1", "passed": tuple(counts(small_p, small_y, 0.6)) == (2, 0, 1, 0), "hint": "At a bar of 0.6, p = 0.6 is flagged because the rule is p ≥ bar."})
    results.append({"name": "precision(1, 0) = 1 and recall(1, 1) = 0.5", "passed": _close(precision(1, 0), 1.0) and _close(recall(1, 1), 0.5), "hint": "precision = tp ÷ (tp + fp); recall = tp ÷ (tp + fn)."})
    results.append({"name": "precision is undefined when nobody is flagged", "passed": precision(0, 0) is None, "hint": "With no flagged customers precision(0, 0) should be None, not an error and not 0."})
    bars = [0.1 * i for i in range(1, 10)]
    def _cost(t, a, b):
        tp, fp, tn, fn = counts(ps, ys, t); return a * fp + b * fn
    expected = bars[0]
    for t in bars:
        if _cost(t, 1, 5) < _cost(expected, 1, 5): expected = t
    results.append({"name": "cheapest_bar matches the lowest-cost bar when a miss costs 5", "passed": _close(cheapest_bar(ps, ys, 1, 5, bars), expected), "hint": "cheapest_bar returned %r but the cheapest bar is %r. Cost is cost_fp × fp + cost_fn × fn." % (cheapest_bar(ps, ys, 1, 5, bars), expected)})
    results.append({"name": "when a wasted call is the costly mistake the bar moves up", "passed": cheapest_bar(ps, ys, 10, 1, bars) > cheapest_bar(ps, ys, 1, 10, bars), "hint": "Make wasted calls expensive and the cheapest bar should be higher (be pickier) than when misses are expensive."})
${fail}
`;
export const THR_CODE: CodeLabConfig = {
  id: "lgthrcode", title: "Count the mistakes and price them", intro: <p>A bar turns chances into calls. Counting four cells and pricing the two kinds of mistake lets you choose a bar on purpose, instead of defaulting to 50%.</p>,
  bridge: [{ math: "precision = TP ÷ (TP + FP)", code: "tp / (tp + fp)", note: "Of the customers flagged, the share who left." }, { math: "recall = TP ÷ (TP + FN)", code: "tp / (tp + fn)", note: "Of the customers who left, the share flagged." }, { math: "cost = c_FP·FP + c_FN·FN", code: "cost_fp * fp + cost_fn * fn", note: "What the mistakes cost." }],
  cell: { title: "counts(), precision(), recall() and cheapest_bar()", starter: THR_STARTER, solution: THR_SOLUTION, checks: THR_CHECKS, expose: [], presets: [preset("Make wasted calls costly", "Flip the costs.", /cheapest_bar\(ps, ys, 1, 5,/, "cheapest_bar(ps, ys, 5, 1,")] },
  reflections: [{ question: <>Why define which class is “positive” before counting?</>, answer: <>Precision and recall swap meaning if you flip the classes. Naming the positive class first (here, “left”) keeps the numbers pointing at the question the business actually asks.</> }],
  footer: <>At a 0.7 bar, the small example flags one customer who really left, misses one, and has no false alarms: precision 1, recall 0.5.</>,
};

/* LG04 · the boundary */
export const GEO_STARTER = `import math

w = (1, 1)    # weights on complaints and tenure
b = -2        # intercept

def logit(p):
    return 0.0   # TODO 1: the score at which the chance equals p: ln(p ÷ (1 − p))

def predict(x, w, b, t):
    z = b + sum(wi * xi for wi, xi in zip(w, x))
    return 0   # TODO 2: 1 if the score is at least logit(t), otherwise 0

print("score needed for a 50% chance:", round(logit(0.5), 4))
print("score needed for a 75% chance:", round(logit(0.75), 4))
print("(1, 1) at a 50% bar:", predict((1, 1), w, b, 0.5), " (1.5, 1) at a 75% bar:", predict((1.5, 1), w, b, 0.75))
`;
export const GEO_SOLUTION = swap(GEO_STARTER, [
  ["    return 0.0   # TODO 1: the score at which the chance equals p: ln(p ÷ (1 − p))", "    return math.log(p / (1 - p))"],
  ["    return 0   # TODO 2: 1 if the score is at least logit(t), otherwise 0", "    return 1 if z >= logit(t) else 0"],
]);
export const GEO_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "logit(0.5) = 0", "passed": _close(logit(0.5), 0.0), "hint": "logit(0.5) returned %r. A 50%% chance is a score of 0." % (logit(0.5),)})
    results.append({"name": "logit(0.75) = ln 3", "passed": _close(logit(0.75), math.log(3)), "hint": "logit(0.75) returned %r. It is ln(0.75 ÷ 0.25) = ln 3." % (logit(0.75),)})
    results.append({"name": "(1, 1) sits exactly on the 50% boundary and counts as 1", "passed": predict((1, 1), (1, 1), -2, 0.5) == 1, "hint": "The score is 1 + 1 − 2 = 0, which is exactly logit(0.5); the rule is score ≥ logit(t)."})
    results.append({"name": "(1, 0.5) is below the 50% boundary", "passed": predict((1, 0.5), (1, 1), -2, 0.5) == 0, "hint": "The score is −0.5, which is below 0, so the prediction is 0."})
    results.append({"name": "a higher bar needs a higher score: (1.5, 1) is 1 at 50% but 0 at 75%... and 1 at a lower score only if it clears ln 3", "passed": predict((1.5, 1), (1, 1), -2, 0.5) == 1 and predict((1.5, 1), (1, 1), -2, 0.75) == 0 and predict((2, 1.2), (1, 1), -2, 0.75) == 1, "hint": "(1.5, 1) has score 0.5, which clears 0 but not ln 3 ≈ 1.0986. (2, 1.2) has score 1.2, which clears it."})
${fail}
`;
export const GEO_CODE: CodeLabConfig = {
  id: "lggeocode", title: "Find where the line sits for a given bar", intro: <p>The boundary of a logistic model is a straight line, and its position depends on your bar. A 50% bar puts it where the score is 0; a higher bar pushes it to a higher score.</p>,
  bridge: [{ math: "z = b + w·x", code: "b + sum(wi * xi ...)", note: "The score." }, { math: "boundary: z = ln(t ÷ (1 − t))", code: "z >= logit(t)", note: "Where the chance equals the bar." }],
  cell: { title: "logit() and predict()", starter: GEO_STARTER, solution: GEO_SOLUTION, checks: GEO_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Does moving the bar from 50% to 75% retrain the model?</>, answer: <>No. The weights stay the same. Only the line where we act moves. A stronger penalty (smaller C), on the other hand, changes the weights themselves.</> }],
  footer: <>A 50% chance is a score of 0 and a 75% chance is a score of ln 3 ≈ 1.0986. The same model, with two different lines.</>,
};

/* LG05 · trusted workflow: classes order and prediction-time features */
export const FLOW_STARTER = `classes = [1, 0]          # the order the model reports its columns in
row = [0.25, 0.75]        # probabilities, one per class in that order

def proba_of(label, classes, row):
    return 0.0   # TODO 1: the probability for this label: look up its column with classes.index(label)

def dummy_accuracy(labels):
    return 0.0   # TODO 2: accuracy of always predicting the most common label

def allowed(feature_day, prediction_day):
    return True   # TODO 3: a feature is allowed only if it is known on or before the prediction day

print("chance of churn (label 1):", proba_of(1, classes, row))
print("always-stays accuracy on [0, 0, 0, 1]:", dummy_accuracy([0, 0, 0, 1]))
print("cancellation flag (day 30) allowed on day 0?", allowed(30, 0))
`;
export const FLOW_SOLUTION = swap(FLOW_STARTER, [
  ["    return 0.0   # TODO 1: the probability for this label: look up its column with classes.index(label)", "    return row[classes.index(label)]"],
  ["    return 0.0   # TODO 2: accuracy of always predicting the most common label", "    return max(labels.count(0), labels.count(1)) / len(labels)"],
  ["    return True   # TODO 3: a feature is allowed only if it is known on or before the prediction day", "    return feature_day <= prediction_day"],
]);
export const FLOW_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "classes [0, 1], row [0.25, 0.75]: chance of churn is 0.75", "passed": _close(proba_of(1, [0, 1], [0.25, 0.75]), 0.75), "hint": "proba_of returned %r. With classes [0, 1] the second column belongs to label 1." % (proba_of(1, [0, 1], [0.25, 0.75]),)})
    results.append({"name": "classes [1, 0], same row: chance of churn is 0.25", "passed": _close(proba_of(1, [1, 0], [0.25, 0.75]), 0.25), "hint": "proba_of returned %r. When the classes are listed [1, 0] the first column belongs to label 1; never assume the order." % (proba_of(1, [1, 0], [0.25, 0.75]),)})
    results.append({"name": "dummy_accuracy([0, 0, 0, 1]) = 0.75", "passed": _close(dummy_accuracy([0, 0, 0, 1]), 0.75), "hint": "dummy_accuracy returned %r. Always predicting 0 is right 3 times out of 4." % (dummy_accuracy([0, 0, 0, 1]),)})
    results.append({"name": "a day-30 cancellation flag cannot be used for a day-0 prediction", "passed": allowed(30, 0) is False and allowed(0, 0) is True and allowed(-5, 0) is True, "hint": "allowed(30, 0) should be False; allowed(0, 0) and allowed(−5, 0) should be True."})
${fail}
`;
export const FLOW_CODE: CodeLabConfig = {
  id: "lgflowcode", title: "Three habits that prevent quiet mistakes", intro: <p>Most failures in a classification workflow are not mathematical. They come from reading the wrong probability column, skipping the baseline, or using a feature that did not exist yet.</p>,
  bridge: [{ math: "P(churn) = column of label 1", code: "row[classes.index(1)]", note: "Never assume the column order." }, { math: "baseline = share of the most common class", code: "max(labels.count(0), labels.count(1)) / len(labels)", note: "The accuracy of doing nothing clever." }],
  cell: { title: "proba_of(), dummy_accuracy() and allowed()", starter: FLOW_STARTER, solution: FLOW_SOLUTION, checks: FLOW_CHECKS, expose: [], presets: [preset("Classes in the usual order", "Now the second column is churn.", /^classes = \[1, 0\]/m, "classes = [0, 1]")] },
  reflections: [{ question: <>Why compare the model with “nobody leaves” before celebrating its accuracy?</>, answer: <>If most customers stay, a model that never predicts churn already looks good. The baseline tells you how much of the score the model actually earned.</> }],
  footer: <>With classes [1, 0] the first column is churn, so the row [0.25, 0.75] means a 25% chance of churn. Reversed, it would mean 75%.</>,
};

/* LG06 · limits: same labels, different confidence */
export const CONF_STARTER = `import math

scores = ${toPy(SCORES)}
outcomes = ${toPy(OUTCOMES)}   # 1 = the customer left

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def accuracy(ps, ys):
    return 0.0   # TODO 1: the share of customers where (p ≥ 0.5) matches what happened

def log_loss(ps, ys):
    return 0.0   # TODO 2: the average of −ln(p) for customers who left and −ln(1 − p) for those who stayed

for stretch in (0.2, 1, 6):
    ps = [sigmoid(stretch * s) for s in scores]
    print("stretch", stretch, "accuracy", accuracy(ps, outcomes), "log loss", round(log_loss(ps, outcomes), 3))
`;
export const CONF_SOLUTION = swap(CONF_STARTER, [
  ["    return 0.0   # TODO 1: the share of customers where (p ≥ 0.5) matches what happened", "    return sum(1 for p, y in zip(ps, ys) if (1 if p >= 0.5 else 0) == y) / len(ys)"],
  ["    return 0.0   # TODO 2: the average of −ln(p) for customers who left and −ln(1 − p) for those who stayed", "    return sum(-math.log(p) if y == 1 else -math.log(1 - p) for p, y in zip(ps, ys)) / len(ys)"],
]);
export const CONF_CHECKS = CHECK_PRELUDE + `
try:
    ref_acc = lambda k: sum(1 for s, y in zip(scores, outcomes) if (1 if sigmoid(k * s) >= 0.5 else 0) == y) / len(scores)
    ref_loss = lambda k: sum(-math.log(sigmoid(k * s)) if y == 1 else -math.log(1 - sigmoid(k * s)) for s, y in zip(scores, outcomes)) / len(scores)
    p1 = [sigmoid(s) for s in scores]
    results.append({"name": "accuracy at stretch 1 matches the reference (0.75)", "passed": _close(accuracy(p1, outcomes), ref_acc(1)), "hint": "accuracy returned %r. Count customers where p ≥ 0.5 gives the same label as what happened." % (accuracy(p1, outcomes),)})
    results.append({"name": "accuracy does not change when the model sounds less or more sure", "passed": _close(accuracy([sigmoid(0.2 * s) for s in scores], outcomes), accuracy([sigmoid(6 * s) for s in scores], outcomes)), "hint": "Stretching the scores never flips the sign of a score, so the labels at a 50% bar stay the same."})
    results.append({"name": "log loss at stretch 1 is 0.504", "passed": abs(log_loss(p1, outcomes) - ref_loss(1)) < 1e-9, "hint": "log_loss returned %r. Average −ln(p) for customers who left and −ln(1 − p) for those who stayed." % (log_loss(p1, outcomes),)})
    results.append({"name": "log loss is worse when the model is overconfident than as fitted", "passed": log_loss([sigmoid(6 * s) for s in scores], outcomes) > log_loss(p1, outcomes) + 0.5, "hint": "A very sure model gets punished hard on the customers it gets wrong, so its log loss should be clearly higher."})
${fail}
`;
export const CONF_CODE: CodeLabConfig = {
  id: "lgconfcode", title: "See what accuracy cannot", intro: <p>Stretch or squeeze the model's scores and the labels at a 50% bar never change. Only a measure that looks at the chances can tell a calm model from a reckless one.</p>,
  bridge: [{ math: "accuracy = share of correct labels", code: "(1 if p >= 0.5 else 0) == y", note: "Blind to how sure the model was." }, { math: "log loss = mean(−ln p_true)", code: "-math.log(p) if y == 1 else -math.log(1 - p)", note: "Sees confidence." }],
  cell: { title: "accuracy() and log_loss()", starter: CONF_STARTER, solution: CONF_SOLUTION, checks: CONF_CHECKS, expose: [], presets: [preset("Include a stretch of 3", "A middle setting.", /for stretch in \(0.2, 1, 6\)/, "for stretch in (0.2, 1, 3, 6)")] },
  reflections: [{ question: <>Is a low log loss on eight customers proof the probabilities can be trusted?</>, answer: <>No. Eight customers is a tiny sample. A low log loss is encouraging, but to trust the probabilities you need a larger held-out sample and a check that predicted chances match observed frequencies.</> }],
  footer: <>At a 50% bar the accuracy stays at 75% for every stretch. Log loss is about 0.50 as fitted and 1.31 when the model is very sure.</>,
};
