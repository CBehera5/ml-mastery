"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;

/* SV01 */
export const MARG_STARTER = `import math

w, b = (1, 0), 0       # the line's weights and intercept
x = (2, 3)             # a customer: complaints, tenure

def score(w, b, x):
    return 0.0   # TODO 1: w · x + b

def distance(w, b, x):
    return 0.0   # TODO 2: the score divided by the length of w

def hinge(y, F):
    return 0.0   # TODO 3: max(0, 1 − y × score) for a label y of +1 or −1

F = score(w, b, x)
print("score:", F, " distance:", distance(w, b, x))
print("doubling w → score:", score((2, 0), b, x), " distance:", distance((2, 0), b, x))
print("hinge for a +1 customer at score 0.5:", hinge(1, 0.5))
`;
export const MARG_SOLUTION = swap(MARG_STARTER, [
  ["    return 0.0   # TODO 1: w · x + b", "    return sum(wi * xi for wi, xi in zip(w, x)) + b"],
  ["    return 0.0   # TODO 2: the score divided by the length of w", "    return score(w, b, x) / math.sqrt(sum(wi * wi for wi in w))"],
  ["    return 0.0   # TODO 3: max(0, 1 − y × score) for a label y of +1 or −1", "    return max(0.0, 1 - y * F)"],
]);
export const MARG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "w = (1, 0), x = (2, 3): score 2, distance 2", "passed": _close(score((1, 0), 0, (2, 3)), 2.0) and _close(distance((1, 0), 0, (2, 3)), 2.0), "hint": "score gave %r and distance gave %r. The score is 1×2 + 0×3 + 0." % (score((1, 0), 0, (2, 3)), distance((1, 0), 0, (2, 3)))})
    results.append({"name": "doubling w doubles the score but not the distance", "passed": _close(score((2, 0), 0, (2, 3)), 4.0) and _close(distance((2, 0), 0, (2, 3)), 2.0), "hint": "Divide the score by the length of w. Both scale together, so the distance stays at 2."})
    results.append({"name": "a +1 customer at score 0.5 is correct but inside the margin: hinge 0.5", "passed": _close(hinge(1, 0.5), 0.5), "hint": "hinge gave %r. It is max(0, 1 − 1×0.5)." % (hinge(1, 0.5),)})
    results.append({"name": "a +1 customer at score 2 costs nothing", "passed": _close(hinge(1, 2), 0.0), "hint": "Beyond the margin the penalty is 0, never negative."})
    results.append({"name": "a −1 customer at score 0.5 is wrong: hinge 1.5", "passed": _close(hinge(-1, 0.5), 1.5), "hint": "For label −1 the penalty is max(0, 1 + score)."})
${fail}`;
export const MARG_CODE: CodeLabConfig = {
  id: "svmargcode", title: "Score, distance and penalty", intro: <p>Three small functions separate three ideas: the score, the true distance, and the penalty for being on the wrong side of the margin.</p>,
  bridge: [{ math: "F = w·x + b", code: "sum(wi * xi ...) + b", note: "The score." }, { math: "distance = F ÷ ‖w‖", code: "score / math.sqrt(sum(wi * wi ...))", note: "Scale-free." }, { math: "hinge = max(0, 1 − yF)", code: "max(0.0, 1 - y * F)", note: "Zero beyond the margin." }],
  cell: { title: "score(), distance() and hinge()", starter: MARG_STARTER, solution: MARG_SOLUTION, checks: MARG_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>The score is 2. Is that a 200% chance of leaving?</>, answer: <>No. A score is a signed distance-like number, not a probability. Turning scores into trustworthy probabilities needs a separate calibration step.</> }],
  footer: <>With weights (1, 0) the customer (2, 3) scores 2 and sits 2 units away. Doubling the weights makes the score 4 and leaves the distance at 2.</>,
};

/* SV02 */
export const SOFT_STARTER = `rows = [(2, 1), (3, -1), (1, 1), (-1, -1), (0.5, 1), (-2, -1)]   # (position along the weight direction, label)
w, b = (1,), 0   # a one-dimensional line, for clarity

def margin_width(w):
    return 0.0   # TODO 1: the distance between the two margin lines: 2 divided by the length of w

def inside_margin(y, F):
    return False   # TODO 2: True when y × F is 1 or less (on the margin or inside it, or wrong)

def count_inside(rows, w, b):
    return 0   # TODO 3: how many rows are on or inside the margin

print("margin width for w = 1:", margin_width((1,)), " for w = 0.5:", margin_width((0.5,)))
print("rows on or inside the margin:", count_inside(rows, w, b))
`;
export const SOFT_SOLUTION = swap(SOFT_STARTER, [
  ["    return 0.0   # TODO 1: the distance between the two margin lines: 2 divided by the length of w", "    return 2 / sum(wi * wi for wi in w) ** 0.5"],
  ["    return False   # TODO 2: True when y × F is 1 or less (on the margin or inside it, or wrong)", "    return y * F <= 1"],
  ["    return 0   # TODO 3: how many rows are on or inside the margin", "    return sum(1 for x, y in rows if inside_margin(y, w[0] * x + b))"],
]);
export const SOFT_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "w of length 1 gives a margin of 2; w of 0.5 gives 4", "passed": _close(margin_width((1,)), 2.0) and _close(margin_width((0.5,)), 4.0), "hint": "margin_width gave %r and %r. A smaller w means a wider margin." % (margin_width((1,)), margin_width((0.5,)))})
    results.append({"name": "a +1 customer at score 0.5 is inside the margin", "passed": inside_margin(1, 0.5) is True and inside_margin(1, 2) is False, "hint": "Inside means y × F is 1 or less."})
    results.append({"name": "a wrong-side customer also counts", "passed": inside_margin(1, -0.5) is True, "hint": "A customer on the wrong side has y × F below 0, which is below 1."})
    results.append({"name": "the rows with y × F ≤ 1 are counted for w = 1", "passed": count_inside(rows, (1,), 0) == 4, "hint": "count_inside gave %r. Test y × x ≤ 1 for every row: x = 1, 0.5, −1 and −2 qualify." % (count_inside(rows, (1,), 0),)})
    results.append({"name": "halving w widens the margin and brings in more rows", "passed": count_inside(rows, (0.5,), 0) > count_inside(rows, (1,), 0), "hint": "With w = 0.5 the scores shrink, so more rows have y × F ≤ 1."})
${fail}`;
export const SOFT_CODE: CodeLabConfig = {
  id: "svsoftcode", title: "Count who is inside the margin", intro: <p>A small weight vector means a wide margin, and a wide margin pulls more customers inside it. C decides how much that is allowed to cost.</p>,
  bridge: [{ math: "margin width = 2 ÷ ‖w‖", code: "2 / sum(wi * wi for wi in w) ** 0.5", note: "Smaller w, wider margin." }, { math: "on or inside the margin: yF ≤ 1", code: "y * F <= 1", note: "These are the supports." }],
  cell: { title: "margin_width(), inside_margin() and count_inside()", starter: SOFT_STARTER, solution: SOFT_SOLUTION, checks: SOFT_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>You increase C a lot and the margin gets narrow. Is the model automatically better?</>, answer: <>No. A narrow margin fits the training customers more tightly, which can hurt on new customers. Choose C by how the model does on customers it was not fitted on.</> }],
  footer: <>Weights of length 1 give a margin 2 wide. Halving them widens it to 4, and more customers fall inside it.</>,
};

/* SV03 */
export const RBF_STARTER = `import math

centres = [(0, 0), (3, 0)]   # two training customers
alphas = [1, -1]             # their weights in the decision score
b = 0

def rbf(d, gamma):
    return 0.0   # TODO 1: similarity at distance d: e^(−gamma × d²)

def similarity(p, q, gamma):
    return 0.0   # TODO 2: the same similarity for two points p and q

def decision(x, centres, alphas, b, gamma):
    return 0.0   # TODO 3: b plus the sum over training customers of alpha × similarity to x

print("distance 1:", round(rbf(1, 1), 6), "(gamma 1)  ", round(rbf(1, 4), 6), "(gamma 4)")
print("score at (0, 0):", round(decision((0, 0), centres, alphas, b, 1), 4), "  at (3, 0):", round(decision((3, 0), centres, alphas, b, 1), 4))
`;
export const RBF_SOLUTION = swap(RBF_STARTER, [
  ["    return 0.0   # TODO 1: similarity at distance d: e^(−gamma × d²)", "    return math.exp(-gamma * d * d)"],
  ["    return 0.0   # TODO 2: the same similarity for two points p and q", "    return rbf(math.sqrt(sum((a - c) ** 2 for a, c in zip(p, q))), gamma)"],
  ["    return 0.0   # TODO 3: b plus the sum over training customers of alpha × similarity to x", "    return b + sum(a * similarity(x, c, gamma) for a, c in zip(alphas, centres))"],
]);
export const RBF_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "distance 1: gamma 1 gives 0.367879, gamma 4 gives 0.018316", "passed": _close(rbf(1, 1), 0.367879, 1e-6) and _close(rbf(1, 4), 0.018316, 1e-6), "hint": "rbf gave %r and %r. It is exp(−gamma × d²)." % (rbf(1, 1), rbf(1, 4))})
    results.append({"name": "a customer is perfectly similar to itself", "passed": _close(rbf(0, 10), 1.0), "hint": "At distance 0, e^0 = 1 for any gamma."})
    results.append({"name": "the points (0, 0) and (3, 4) are 5 apart: similarity e^(−0.1 × 25)", "passed": _close(similarity((0, 0), (3, 4), 0.1), math.exp(-2.5)), "hint": "similarity gave %r. The squared distance is 9 + 16 = 25." % (similarity((0, 0), (3, 4), 0.1),)})
    results.append({"name": "near the first customer the score is positive, near the second negative", "passed": decision((0, 0), centres, alphas, b, 1) > 0 and decision((3, 0), centres, alphas, b, 1) < 0, "hint": "At (0, 0) the first customer's term is 1 × 1 and the second is −1 × e^(−9)."})
    results.append({"name": "a larger gamma shrinks the reach", "passed": rbf(1, 4) < rbf(1, 1), "hint": "Larger gamma makes similarity fall faster with distance."})
${fail}`;
export const RBF_CODE: CodeLabConfig = {
  id: "svrbfcode", title: "Build a local score from similarities", intro: <p>The RBF kernel is a similarity that fades with distance. A decision score adds up each training customer's weighted similarity.</p>,
  bridge: [{ math: "K(p, q) = e^(−γ‖p−q‖²)", code: "math.exp(-gamma * d * d)", note: "Similarity." }, { math: "f(x) = b + Σ αᵢ K(x, xᵢ)", code: "b + sum(a * similarity(x, c, gamma) ...)", note: "A sum of local bumps." }],
  cell: { title: "rbf(), similarity() and decision()", starter: RBF_STARTER, solution: RBF_SOLUTION, checks: RBF_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Why standardise the features before using an RBF kernel?</>, answer: <>Distance mixes all features. A feature measured in thousands would dominate one measured in single digits, so the kernel would mostly ignore the small one.</> }],
  footer: <>At distance 1, gamma 1 gives a similarity of about 0.3679 and gamma 4 gives about 0.0183.</>,
};

/* SV04 */
export const SCALE_STARTER = `train = [0, 2]
valid = [100]

def fit_scaler(values):
    return (0.0, 1.0)   # TODO 1: (mean, standard deviation) of these values (divide by n, not n − 1)

def apply(values, scaler):
    return list(values)   # TODO 2: subtract the mean and divide by the standard deviation

def class_c(C, weight):
    return C   # TODO 3: the penalty for a class: C multiplied by its weight

s = fit_scaler(train)
print("training scaler:", s, " all-rows scaler mean:", fit_scaler(train + valid)[0])
print("validation value, scaled properly:", apply(valid, s))
print("C = 0.5 with weight 3:", class_c(0.5, 3))
`;
export const SCALE_SOLUTION = swap(SCALE_STARTER, [
  ["    return (0.0, 1.0)   # TODO 1: (mean, standard deviation) of these values (divide by n, not n − 1)", "    m = sum(values) / len(values)\n    sd = (sum((v - m) ** 2 for v in values) / len(values)) ** 0.5\n    return (m, sd)"],
  ["    return list(values)   # TODO 2: subtract the mean and divide by the standard deviation", "    m, sd = scaler\n    return [(v - m) / sd for v in values]"],
  ["    return C   # TODO 3: the penalty for a class: C multiplied by its weight", "    return C * weight"],
]);
export const SCALE_CHECKS = CHECK_PRELUDE + `
try:
    s = fit_scaler([0, 2])
    results.append({"name": "training values 0 and 2 have mean 1 and spread 1", "passed": _close(s[0], 1.0) and _close(s[1], 1.0), "hint": "fit_scaler gave %r. Mean 1; each value is 1 away, so the standard deviation is 1." % (s,)})
    results.append({"name": "including the validation value moves the mean to 34", "passed": _close(fit_scaler([0, 2, 100])[0], 34.0), "hint": "That is the leak: the held-out value 100 pulled the centre from 1 to 34."})
    results.append({"name": "the validation value scaled with the training scaler is 99", "passed": apply([100], s) == [99.0], "hint": "apply gave %r. (100 − 1) ÷ 1 = 99. Use the scaler fitted on training rows only." % (apply([100], s),)})
    results.append({"name": "C = 0.5 with weight 3 gives a penalty of 1.5", "passed": _close(class_c(0.5, 3), 1.5), "hint": "class_c gave %r. It multiplies: 0.5 × 3. The 1.5 is a penalty, not a probability." % (class_c(0.5, 3),)})
${fail}`;
export const SCALE_CODE: CodeLabConfig = {
  id: "svscalecode", title: "Scale without peeking, then weight the classes", intro: <p>Two small habits protect an SVM: fit the scaler on training rows only, and remember that a class weight multiplies C.</p>,
  bridge: [{ math: "z = (x − mean) ÷ sd", code: "(v - m) / sd", note: "Fitted on training rows." }, { math: "C_class = C × weight", code: "C * weight", note: "A penalty, not a probability." }],
  cell: { title: "fit_scaler(), apply() and class_c()", starter: SCALE_STARTER, solution: SCALE_SOLUTION, checks: SCALE_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>The validation labels were never used when fitting the scaler. Why is it still a leak?</>, answer: <>The scaler still learned from validation feature values. Anything that influences a fitted step must come from training rows only.</> }],
  footer: <>Training values 0 and 2 have mean 1. Including the validation value 100 would make the mean 34. With C = 0.5 and a weight of 3, the positive class's penalty is 1.5.</>,
};

/* SV05 */
export const LIM_STARTER = `y_true = [1, 1, 1, -1, -1, -1]
y_pred = [1, -1, -1, -1, -1, 1]

def accuracy(y_true, y_pred):
    return 0.0   # TODO 1: the share of customers called correctly

def recall(y_true, y_pred, label):
    return 0.0   # TODO 2: of the customers truly in this class, the share we called correctly

def balanced_accuracy(y_true, y_pred):
    return 0.0   # TODO 3: the average of the recall for +1 and the recall for −1

print("accuracy:", accuracy(y_true, y_pred), " balanced:", balanced_accuracy(y_true, y_pred))
lazy_true = [1] * 5 + [-1] * 95
lazy_pred = [-1] * 100
print("always say 'stays' → accuracy:", accuracy(lazy_true, lazy_pred), " balanced:", balanced_accuracy(lazy_true, lazy_pred))
`;
export const LIM_SOLUTION = swap(LIM_STARTER, [
  ["    return 0.0   # TODO 1: the share of customers called correctly", "    return sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true)"],
  ["    return 0.0   # TODO 2: of the customers truly in this class, the share we called correctly", "    rows = [(t, p) for t, p in zip(y_true, y_pred) if t == label]\n    return sum(1 for t, p in rows if p == label) / len(rows)"],
  ["    return 0.0   # TODO 3: the average of the recall for +1 and the recall for −1", "    return (recall(y_true, y_pred, 1) + recall(y_true, y_pred, -1)) / 2"],
]);
export const LIM_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "three of six correct is accuracy 0.5", "passed": _close(accuracy([1, 1, 1, -1, -1, -1], [1, -1, -1, -1, -1, 1]), 0.5), "hint": "accuracy gave %r. Count the matches and divide by 6." % (accuracy([1, 1, 1, -1, -1, -1], [1, -1, -1, -1, -1, 1]),)})
    results.append({"name": "recall for +1 is 1/3 and for −1 is 2/3", "passed": _close(recall([1, 1, 1, -1, -1, -1], [1, -1, -1, -1, -1, 1], 1), 1 / 3) and _close(recall([1, 1, 1, -1, -1, -1], [1, -1, -1, -1, -1, 1], -1), 2 / 3), "hint": "recall counts only customers truly in that class."})
    results.append({"name": "balanced accuracy of the six is 0.5", "passed": _close(balanced_accuracy([1, 1, 1, -1, -1, -1], [1, -1, -1, -1, -1, 1]), 0.5), "hint": "Average the two recalls: (1/3 + 2/3) ÷ 2."})
    results.append({"name": "a model that always says 'stays' scores 0.95 accuracy but 0.5 balanced", "passed": _close(accuracy(lazy_true, lazy_pred), 0.95) and _close(balanced_accuracy(lazy_true, lazy_pred), 0.5), "hint": "It finds none of the 5 leavers, so that recall is 0, and the average of 0 and 1 is 0.5."})
${fail}`;
export const LIM_CODE: CodeLabConfig = {
  id: "svlimcode", title: "Grade a model without being flattered", intro: <p>When one group is rare, plain accuracy can look excellent for a model that does nothing. Balanced accuracy refuses to be fooled by that.</p>,
  bridge: [{ math: "accuracy = correct ÷ all", code: "sum(1 for t, p in zip(...) if t == p) / len(y_true)", note: "Every customer counts equally." }, { math: "balanced = mean of per-class recall", code: "(recall(+1) + recall(−1)) / 2", note: "Every class counts equally." }],
  cell: { title: "accuracy(), recall() and balanced_accuracy()", starter: LIM_STARTER, solution: LIM_SOLUTION, checks: LIM_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Balanced accuracy is 0.5. Is the model as good as a coin flip in every sense?</>, answer: <>It tells you the model finds one group no better than chance overall. Look at each group's recall and at the cost of each kind of mistake before deciding what to do.</> }],
  footer: <>Three of six correct is an accuracy of 0.5. A model that always says "stays" on 5 leavers and 95 stayers gets 0.95 accuracy but only 0.5 balanced accuracy.</>,
};
