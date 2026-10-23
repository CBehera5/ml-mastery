"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";
import { TRAIN_PTS, VALID_PTS, boost, boostMse } from "./gb-math";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;

/* GB01 · sequential correction */
export const SEQ_STARTER = `f0 = 3          # starting guess for one house (the average price)
eta = 0.1       # step size
leaves = [2, 1] # what each small tree suggests for this house
target = 5

def leftover(y, F):
    return 0.0   # TODO 1: how far the current guess is from the actual price

def update(F, leaf, eta):
    return F   # TODO 2: add only eta of the tree's suggestion

def run(f0, leaves, eta):
    return []   # TODO 3: the guess after each tree, in order

print("leftover at the start:", leftover(target, f0))
guesses = run(f0, leaves, eta)
print("guesses after each tree:", [round(g, 2) for g in guesses])
print("leftover after tree 1:", round(leftover(target, guesses[0]), 2) if guesses else None)
`;
export const SEQ_SOLUTION = swap(SEQ_STARTER, [
  ["    return 0.0   # TODO 1: how far the current guess is from the actual price", "    return y - F"],
  ["    return F   # TODO 2: add only eta of the tree's suggestion", "    return F + eta * leaf"],
  ["    return []   # TODO 3: the guess after each tree, in order", "    out, F = [], f0\n    for leaf in leaves:\n        F = update(F, leaf, eta)\n        out.append(F)\n    return out"],
]);
export const SEQ_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "the leftover at the start is 2", "passed": _close(leftover(5, 3), 2.0), "hint": "leftover gave %r. It is actual − guess = 5 − 3." % (leftover(5, 3),)})
    results.append({"name": "after tree 1 the guess is 3.2", "passed": _close(update(3, 2, 0.1), 3.2), "hint": "update gave %r. Add eta × leaf = 0.1 × 2 to the guess." % (update(3, 2, 0.1),)})
    g = run(3, [2, 1], 0.1)
    results.append({"name": "the guesses are 3.2 then 3.3", "passed": len(g) == 2 and _close(g[0], 3.2) and _close(g[1], 3.3), "hint": "run gave %r. Each tree starts from the guess left by the one before." % (g,)})
    results.append({"name": "the leftover shrinks from 2 to 1.8", "passed": len(g) > 0 and _close(leftover(5, g[0]), 1.8), "hint": "After tree 1 the guess is 3.2, so the leftover is 5 − 3.2 = 1.8."})
    results.append({"name": "this is not the average of 3, 2 and 1", "passed": len(g) == 2 and not _close(g[-1], 2.0), "hint": "Boosting adds small corrections one after another. Averaging 3, 2 and 1 gives 2, a different operation."})
${fail}`;
export const SEQ_CODE: CodeLabConfig = {
  id: "gbseqcode", title: "Add small corrections one after another", intro: <p>The whole idea of boosting fits in a short loop: look at what is still wrong, add a small piece of a fix, repeat.</p>,
  bridge: [{ math: "rₘ = y − Fₘ₋₁", code: "y - F", note: "The leftover." }, { math: "Fₘ = Fₘ₋₁ + η·hₘ", code: "F + eta * leaf", note: "Add a fraction of the new tree." }],
  cell: { title: "leftover(), update() and run()", starter: SEQ_STARTER, solution: SEQ_SOLUTION, checks: SEQ_CHECKS, expose: [], presets: [preset("Take bigger steps", "A step size of 0.5.", /^eta = 0.1/m, "eta = 0.5")] },
  reflections: [{ question: <>Why add only a fraction of each tree instead of the whole correction?</>, answer: <>Small steps are harder to overshoot and leave room for later trees to fix mistakes. The price is that you usually need more trees.</> }],
  footer: <>Starting at 3 with a step size of 0.1, trees suggesting 2 and 1 move the guess to 3.2 and then 3.3. The leftover for a price of 5 falls from 2 to 1.8.</>,
};

/* GB02 · squared error */
export const SQ_STARTER = `y, F, eta = 5, 3, 0.1

def residual(y, F):
    return 0.0   # TODO 1: actual minus guess

def squared_error(y, F):
    return 0.0   # TODO 2: the leftover squared

def half_squared(y, F):
    return 0.0   # TODO 3: the same, divided by 2

def leaf_correction(residuals):
    return 0.0   # TODO 4: what a leaf proposes: the average of its houses' leftovers

print("error before:", squared_error(y, F), " after adding 0.1 × 2:", round(squared_error(y, F + eta * 2), 2))
print("half-squared:", half_squared(y, F), "→", round(half_squared(y, F + eta * 2), 2))
print("leaf [2, 4] proposes:", leaf_correction([2, 4]))
`;
export const SQ_SOLUTION = swap(SQ_STARTER, [
  ["    return 0.0   # TODO 1: actual minus guess", "    return y - F"],
  ["    return 0.0   # TODO 2: the leftover squared", "    return (y - F) ** 2"],
  ["    return 0.0   # TODO 3: the same, divided by 2", "    return (y - F) ** 2 / 2"],
  ["    return 0.0   # TODO 4: what a leaf proposes: the average of its houses' leftovers", "    return sum(residuals) / len(residuals)"],
]);
export const SQ_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "residual(5, 3) = 2 and squared error 4", "passed": _close(residual(5, 3), 2.0) and _close(squared_error(5, 3), 4.0), "hint": "residual gave %r and squared_error gave %r." % (residual(5, 3), squared_error(5, 3))})
    results.append({"name": "adding 0.1 × 2 moves the squared error from 4 to 3.24", "passed": _close(squared_error(5, 3.2), 3.24), "hint": "squared_error(5, 3.2) gave %r. The new leftover is 1.8 and 1.8² = 3.24." % (squared_error(5, 3.2),)})
    results.append({"name": "half-squared error goes from 2 to 1.62", "passed": _close(half_squared(5, 3), 2.0) and _close(half_squared(5, 3.2), 1.62), "hint": "half_squared is squared_error ÷ 2."})
    results.append({"name": "a leaf with leftovers [2, 4] proposes 3", "passed": _close(leaf_correction([2, 4]), 3.0), "hint": "leaf_correction gave %r. Average the leftovers; do not apply every house's own leftover." % (leaf_correction([2, 4]),)})
${fail}`;
export const SQ_CODE: CodeLabConfig = {
  id: "gbsqcode", title: "Leftovers, squared and halved", intro: <p>For squared error the 'gradient' is just the leftover. Writing it out shows why boosting with squared error is the same as fitting trees to residuals.</p>,
  bridge: [{ math: "L = (y − F)² ÷ 2", code: "(y - F) ** 2 / 2", note: "Half-squared loss." }, { math: "−∂L/∂F = y − F", code: "y - F", note: "The leftover is the push." }],
  cell: { title: "residual(), squared_error(), half_squared() and leaf_correction()", starter: SQ_STARTER, solution: SQ_SOLUTION, checks: SQ_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Why is half the squared error used in the loss?</>, answer: <>The 1/2 cancels the 2 that comes from differentiating, so the push on the guess is exactly the leftover. The best model does not change.</> }],
  footer: <>A guess of 3 for a price of 5 has squared error 4. Adding 0.1 × 2 gives 3.2, and the error falls to 3.24. A leaf with leftovers 2 and 4 proposes 3.</>,
};

/* GB03 · classification */
export const LOG_STARTER = `import math

y, F, eta = 1, 0.0, 0.1   # the customer left; current score; step size

def sigmoid(z):
    return 0.5   # TODO 1: turn a score into a chance: 1 / (1 + e^(−z))

def gradient(y, F):
    return 0.0   # TODO 2: the push on the score: y minus the current chance

def hessian(F):
    return 1.0   # TODO 3: how uncertain the model is: p × (1 − p)

def leaf_correction(y, F):
    return 0.0   # TODO 4: the gradient divided by the uncertainty

new_F = F + eta * leaf_correction(y, F)
print("chance now:", sigmoid(F), " gradient:", gradient(y, F), " uncertainty:", hessian(F))
print("leaf correction:", leaf_correction(y, F), " new score:", new_F, " new chance:", round(sigmoid(new_F), 6))
`;
export const LOG_SOLUTION = swap(LOG_STARTER, [
  ["    return 0.5   # TODO 1: turn a score into a chance: 1 / (1 + e^(−z))", "    return 1 / (1 + math.exp(-z))"],
  ["    return 0.0   # TODO 2: the push on the score: y minus the current chance", "    return y - sigmoid(F)"],
  ["    return 1.0   # TODO 3: how uncertain the model is: p × (1 − p)", "    p = sigmoid(F)\n    return p * (1 - p)"],
  ["    return 0.0   # TODO 4: the gradient divided by the uncertainty", "    return gradient(y, F) / hessian(F)"],
]);
export const LOG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "a score of 0 is a 50% chance", "passed": _close(sigmoid(0), 0.5), "hint": "sigmoid(0) gave %r. e^0 = 1, so 1 ÷ (1 + 1) = 0.5." % (sigmoid(0),)})
    results.append({"name": "for a customer who left at a 50% chance, the gradient is 0.5", "passed": _close(gradient(1, 0.0), 0.5), "hint": "gradient gave %r. It is y − p = 1 − 0.5." % (gradient(1, 0.0),)})
    results.append({"name": "uncertainty at 50% is 0.25", "passed": _close(hessian(0.0), 0.25), "hint": "hessian gave %r. It is 0.5 × 0.5." % (hessian(0.0),)})
    results.append({"name": "the leaf correction is 0.5 ÷ 0.25 = 2, not the gradient 0.5", "passed": _close(leaf_correction(1, 0.0), 2.0), "hint": "leaf_correction gave %r. Divide the gradient by the uncertainty." % (leaf_correction(1, 0.0),)})
    results.append({"name": "with a step of 0.1 the new chance is about 0.549834", "passed": _close(sigmoid(0.0 + 0.1 * leaf_correction(1, 0.0)), 0.549834, 1e-5), "hint": "The new score is 0.2, and sigmoid(0.2) ≈ 0.549834."})
${fail}`;
export const LOG_CODE: CodeLabConfig = {
  id: "gblogcode", title: "One log-loss correction by hand", intro: <p>With log loss the leftover is a chance, not a price, so the size of a correction depends on how unsure the model currently is.</p>,
  bridge: [{ math: "g = y − p", code: "y - sigmoid(F)", note: "The push on the score." }, { math: "leaf = g ÷ (p(1 − p))", code: "gradient(y, F) / hessian(F)", note: "A Newton-style step." }],
  cell: { title: "sigmoid(), gradient(), hessian() and leaf_correction()", starter: LOG_STARTER, solution: LOG_SOLUTION, checks: LOG_CHECKS, expose: [], presets: [preset("Customer who stayed", "Flip the label.", /^y, F, eta = 1, 0.0, 0.1/m, "y, F, eta = 0, 0.0, 0.1")] },
  reflections: [{ question: <>Why divide by p(1 − p)?</>, answer: <>A model that is already near 0 or 1 is very sure, so p(1 − p) is tiny and the correction is large. The step accounts for how steep the curve is at the current score.</> }],
  footer: <>At a 50% chance the gradient for a customer who left is 0.5 and the uncertainty is 0.25, so the leaf correction is 2. With a step of 0.1 the chance moves from 50% to about 54.98%.</>,
};

/* GB04 · stopping */
const STOP_BOOST = boost(TRAIN_PTS, 12, 0.5, 2), STOP_CURVE = Array.from({ length: 13 }, (_, m) => Number(boostMse(STOP_BOOST, VALID_PTS, m).toFixed(4)));
export const STOP_STARTER = `valid_mse = ${JSON.stringify(STOP_CURVE)}   # error on unseen houses after 0, 1, 2, … corrections

def best_stage(valid_mse, budget):
    return 0   # TODO 1: the stage (list position) from 0 to budget with the lowest error; the first wins a tie

def keep_going(valid_mse, stage, patience):
    return True   # TODO 2: False if the error has not improved on its best for the last 'patience' stages

stage = best_stage(valid_mse, 8)
print("budget 8 keeps stage", stage, "with error", valid_mse[stage])
print("budget 2 keeps stage", best_stage(valid_mse, 2))
`;
export const STOP_SOLUTION = swap(STOP_STARTER, [
  ["    return 0   # TODO 1: the stage (list position) from 0 to budget with the lowest error; the first wins a tie", "    best = 0\n    for m in range(1, min(budget, len(valid_mse) - 1) + 1):\n        if valid_mse[m] < valid_mse[best]:\n            best = m\n    return best"],
  ["    return True   # TODO 2: False if the error has not improved on its best for the last 'patience' stages", "    best = min(valid_mse[: stage + 1])\n    recent = valid_mse[max(0, stage - patience + 1): stage + 1]\n    return stage + 1 <= patience or min(recent) == best"],
]);
export const STOP_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "a budget of 8 keeps stage 4", "passed": best_stage(valid_mse, 8) == 4, "hint": "best_stage gave %r. Look only at stages 0 to the budget and keep the lowest-error one." % (best_stage(valid_mse, 8),)})
    results.append({"name": "a budget of 2 can only keep stage 2", "passed": best_stage(valid_mse, 2) == 2, "hint": "Stages beyond the budget are not allowed, even if they would score better."})
    results.append({"name": "a bigger budget does not keep a worse stage", "passed": valid_mse[best_stage(valid_mse, 12)] <= valid_mse[best_stage(valid_mse, 8)], "hint": "More budget should never give a higher error than a smaller budget."})
    results.append({"name": "early stopping: still improving at stage 3, stalled by stage 8", "passed": keep_going(valid_mse, 3, 2) is True and keep_going(valid_mse, 8, 3) is False, "hint": "keep_going should be False when none of the last 'patience' stages beat the best error seen so far."})
${fail}`;
export const STOP_CODE: CodeLabConfig = {
  id: "gbstopcode", title: "Choose how many corrections to keep", intro: <p>Boosting can keep adding trees long after they stop helping. A validation curve, and a few lines to read it, decide where to stop.</p>,
  bridge: [{ math: "m* = argmin validation error", code: "valid_mse[m] < valid_mse[best]", note: "Judged on unseen houses." }, { math: "stop when no improvement for p stages", code: "min(recent) <= best", note: "Early stopping with patience." }],
  cell: { title: "best_stage() and keep_going()", starter: STOP_STARTER, solution: STOP_SOLUTION, checks: STOP_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>For a churn model, accuracy was 100% at stage 4 and at stage 8. Which stage would you keep?</>, answer: <>Compare the log loss as well. Two models can call the same labels while one gives much better probabilities, and that is the one you would want to act on.</> }],
  footer: <>On these houses the error on unseen data is lowest at stage 4. A budget of 8 keeps stage 4, a budget of 2 can only keep stage 2.</>,
};

/* GB05 · leakage */
export const TRANS_STARTER = `train = [0, 2]
valid = [100]

def mean(v):
    return sum(v) / len(v)

def centre(values, fit_on):
    return (0.0, values)   # TODO 1: return (the centre, values minus that centre), using the mean of fit_on

def centre_validation(train, valid):
    return []   # TODO 2: the validation values centred with the TRAINING mean only

def fold_centres(train, folds):
    return []   # TODO 3: for each (fit_rows, hold_rows) pair of index lists, the mean of the train values at fit_rows

print("centre from training only:", centre(valid, train)[0], " centre from everything:", centre(valid, train + valid)[0])
print("validation value centred properly:", centre_validation(train, valid))
`;
export const TRANS_SOLUTION = swap(TRANS_STARTER, [
  ["    return (0.0, values)   # TODO 1: return (the centre, values minus that centre), using the mean of fit_on", "    m = mean(fit_on)\n    return (m, [v - m for v in values])"],
  ["    return []   # TODO 2: the validation values centred with the TRAINING mean only", "    return centre(valid, train)[1]"],
  ["    return []   # TODO 3: for each (fit_rows, hold_rows) pair of index lists, the mean of the train values at fit_rows", "    return [mean([train[i] for i in fit]) for fit, hold in folds]"],
]);
export const TRANS_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "the training centre is 1 and the global centre is 34", "passed": _close(centre(valid, train)[0], 1.0) and _close(centre(valid, train + valid)[0], 34.0), "hint": "centre gave %r and %r. The first call must use only the training values." % (centre(valid, train)[0], centre(valid, train + valid)[0])})
    results.append({"name": "the validation value centred properly is 99", "passed": centre_validation(train, valid) == [99.0], "hint": "centre_validation gave %r. Subtract the training mean (1) from 100." % (centre_validation(train, valid),)})
    results.append({"name": "centring on everything would give 66, which is leakage", "passed": centre(valid, train + valid)[1] == [66.0], "hint": "Fitting on all rows lets the validation value pull the centre toward itself."})
    results.append({"name": "each fold gets its own centre", "passed": fold_centres([0, 2, 4, 6], [([0, 1], [2, 3]), ([2, 3], [0, 1])]) == [1.0, 5.0], "hint": "fold_centres gave %r. Fit on the fit rows of each fold only, and never reuse one outer fit." % (fold_centres([0, 2, 4, 6], [([0, 1], [2, 3]), ([2, 3], [0, 1])]),)})
${fail}`;
export const TRANS_CODE: CodeLabConfig = {
  id: "gbtranscode", title: "Fit the centre without peeking", intro: <p>A learned transform is a model too. If it sees the validation rows while it is being fitted, the validation score is no longer honest.</p>,
  bridge: [{ math: "centre = mean of training rows", code: "mean(fit_on)", note: "Never the validation rows." }, { math: "one transform per fold", code: "mean([train[i] for i in fit])", note: "Refit inside every fold." }],
  cell: { title: "centre(), centre_validation() and fold_centres()", starter: TRANS_STARTER, solution: TRANS_SOLUTION, checks: TRANS_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>The validation labels were never used. How can fitting the centre on all rows still leak?</>, answer: <>The transform still learned from the validation rows' feature values, which shifts the centre toward them. Any information about validation data entering a fit makes the score optimistic.</> }],
  footer: <>Training values 0 and 2 have mean 1. Including the validation value 100 would move the mean to 34, so the validation row would be centred at 66 instead of 99.</>,
};

/* GB06 · compare */
export const CMP_STARTER = `forest = [4, 6]    # forest predictions on two held-out houses
booster = [5, 7]   # boosting predictions on the same houses
actual = [5, 8]

def mae(preds, actual):
    return 0.0   # TODO 1: the average of |prediction − actual|

def better(a, b, actual):
    return "tie"   # TODO 2: "a" or "b", whichever has the lower mae, or "tie" when they are equal

print("forest MAE:", mae(forest, actual), " booster MAE:", mae(booster, actual))
print("better on these houses:", better(forest, booster, actual))
`;
export const CMP_SOLUTION = swap(CMP_STARTER, [
  ["    return 0.0   # TODO 1: the average of |prediction − actual|", "    return sum(abs(p - a) for p, a in zip(preds, actual)) / len(actual)"],
  ["    return \"tie\"   # TODO 2: \"a\" or \"b\", whichever has the lower mae, or \"tie\" when they are equal", "    ma, mb = mae(a, actual), mae(b, actual)\n    return \"a\" if ma < mb else \"b\" if mb < ma else \"tie\""],
]);
export const CMP_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "forest MAE is 1.5 and booster MAE is 0.5", "passed": _close(mae([4, 6], [5, 8]), 1.5) and _close(mae([5, 7], [5, 8]), 0.5), "hint": "mae gave %r and %r. Errors for the forest are 1 and 2; for the booster 0 and 1." % (mae([4, 6], [5, 8]), mae([5, 7], [5, 8]))})
    results.append({"name": "the booster wins on these houses", "passed": better([4, 6], [5, 7], [5, 8]) == "b", "hint": "better should return the label of the lower-MAE model: 'b' here."})
    results.append({"name": "swapping the models flips the answer", "passed": better([5, 7], [4, 6], [5, 8]) == "a", "hint": "The comparison should not depend on which model is listed first."})
    results.append({"name": "equal errors give a tie", "passed": better([4], [6], [5]) == "tie", "hint": "Both models miss by 1 on the single house, so the result is 'tie'."})
${fail}`;
export const CMP_CODE: CodeLabConfig = {
  id: "gbcmpcode", title: "Score two models on the same houses", intro: <p>A fair comparison uses the same held-out rows and the same measure for both models. The win belongs to those rows, not to the method in general.</p>,
  bridge: [{ math: "MAE = mean |ŷ − y|", code: "sum(abs(p - a) ...) / len(actual)", note: "Average miss." }, { math: "pick the lower MAE", code: "ma < mb", note: "On the same rows." }],
  cell: { title: "mae() and better()", starter: CMP_STARTER, solution: CMP_SOLUTION, checks: CMP_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Boosting beat the forest on two houses. Should you always pick boosting?</>, answer: <>No. Two houses is almost no evidence, and on other data or other settings the forest can win. Compare on a larger held-out set and tune both fairly.</> }],
  footer: <>On the same two houses the forest misses by 1.5 on average and boosting by 0.5. That is an observation about these houses, not a universal ranking.</>,
};
