"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
const mk = (id: string, title: string, intro: string, bridge: CodeLabConfig["bridge"], cellTitle: string, starter: string, solution: string, checks: string, reflection: [string, string], footer: string, presets: CodeLabConfig["cell"]["presets"] = []): CodeLabConfig => ({
  id, title, intro: <p>{intro}</p>, bridge, cell: { title: cellTitle, starter, solution, checks, expose: [], presets }, reflections: [{ question: <>{reflection[0]}</>, answer: <>{reflection[1]}</> }], footer: <>{footer}</>,
});

/* NN01 */
const A = `import math

x, w, b = 2, 1, -1     # input, hidden weight, hidden bias
v, c = 2, 0            # output weight, output bias

def relu(z):
    return z   # TODO 1: keep positive numbers, turn negatives into 0

def hidden(x, w, b):
    return 0.0   # TODO 2: the hidden neuron's value: relu(x × w + b)

def chance(h, v, c):
    return 0.5   # TODO 3: sigmoid of (v × h + c)

h = hidden(x, w, b)
print("hidden value:", h, " chance:", round(chance(h, v, c), 4))
print("relu(-3):", relu(-3))
`;
const A_SOL = swap(A, [
  ["    return z   # TODO 1: keep positive numbers, turn negatives into 0", "    return max(0, z)"],
  ["    return 0.0   # TODO 2: the hidden neuron's value: relu(x × w + b)", "    return relu(x * w + b)"],
  ["    return 0.5   # TODO 3: sigmoid of (v × h + c)", "    return 1 / (1 + math.exp(-(v * h + c)))"],
]);
const A_C = CHECK_PRELUDE + `
try:
    results.append({"name": "relu keeps 2 and zeroes −3", "passed": relu(2) == 2 and relu(-3) == 0, "hint": "relu(-3) gave %r. A ReLU returns max(0, z)." % (relu(-3),)})
    results.append({"name": "x = 2, w = 1, b = −1 gives a hidden value of 1", "passed": _close(hidden(2, 1, -1), 1.0), "hint": "hidden gave %r. z = 2×1 − 1 = 1, and relu(1) = 1." % (hidden(2, 1, -1),)})
    results.append({"name": "with output weight 2 and bias 0 the chance is 0.8808", "passed": _close(chance(1.0, 2, 0), 0.8808, 1e-4), "hint": "chance gave %r. The logit is 2 and sigmoid(2) ≈ 0.8808." % (chance(1.0, 2, 0),)})
    results.append({"name": "a hidden neuron with a negative z stays silent", "passed": _close(hidden(0, 1, -1), 0.0), "hint": "At x = 0, z = −1, and relu(−1) = 0."})
${fail}`;
export const NN1_CODE = mk("nnneuroncode", "One hidden neuron by hand", "A tiny network is a weighted sum, a bend, another weighted sum and a squash. Each step is one line.", [{ math: "h = ReLU(x·w + b)", code: "max(0, x * w + b)", note: "The hidden neuron." }, { math: "p = σ(v·h + c)", code: "1 / (1 + math.exp(-(v * h + c)))", note: "The output chance." }], "relu(), hidden() and chance()", A, A_SOL, A_C, ["Why not skip the ReLU and use the weighted sum directly?", "Two straight layers in a row collapse into one straight rule. The bend is what gives the hidden layer something new to offer."], "For x = 2, weight 1 and bias −1, the hidden value is 1. With output weight 2 and bias 0 the logit is 2 and the chance is about 0.8808.");

/* NN02 */
const B = `xs = [1, 2, 3]
ys = [2, 4, 6]   # the truth is y = 2x

def sgd_step(w, grad, lr):
    return w   # TODO 1: move against the gradient: w − lr × grad

def gradient(w, xs, ys):
    return 0.0   # TODO 2: the average of 2 × x × (w × x − y)

def descend(lr, steps, w=0.0):
    return w   # TODO 3: repeat sgd_step 'steps' times (recompute the gradient each time) and return the final weight

print("one step from w = 1 with gradient 0.2 and lr 0.1:", sgd_step(1, 0.2, 0.1))
print("gradient at w = 0:", round(gradient(0, xs, ys), 4))
print("after 20 steps at lr 0.05:", round(descend(0.05, 20), 4))
`;
const B_SOL = swap(B, [
  ["    return w   # TODO 1: move against the gradient: w − lr × grad", "    return w - lr * grad"],
  ["    return 0.0   # TODO 2: the average of 2 × x × (w × x − y)", "    return sum(2 * x * (w * x - y) for x, y in zip(xs, ys)) / len(xs)"],
  ["    return w   # TODO 3: repeat sgd_step 'steps' times (recompute the gradient each time) and return the final weight", "    for _ in range(steps):\n        w = sgd_step(w, gradient(w, xs, ys), lr)\n    return w"],
]);
const B_C = CHECK_PRELUDE + `
try:
    results.append({"name": "w = 1, gradient 0.2, lr 0.1 gives 0.98", "passed": _close(sgd_step(1, 0.2, 0.1), 0.98), "hint": "sgd_step gave %r. It is 1 − 0.1 × 0.2." % (sgd_step(1, 0.2, 0.1),)})
    results.append({"name": "the gradient at w = 0 is −56/3", "passed": _close(gradient(0, xs, ys), -56 / 3), "hint": "gradient gave %r. Average 2·x·(0·x − y) over the three points: (−4 − 16 − 36) ÷ 3." % (gradient(0, xs, ys),)})
    results.append({"name": "a small learning rate walks toward 2", "passed": abs(descend(0.05, 30) - 2) < 0.1, "hint": "descend gave %r. Recompute the gradient before every step." % (descend(0.05, 30),)})
    results.append({"name": "a learning rate that is too large overshoots and gets worse", "passed": abs(descend(0.3, 6) - 2) > abs(descend(0.3, 1) - 2), "hint": "At lr = 0.3 each step jumps past the target by more than the last, so the distance grows."})
${fail}`;
export const NN2_CODE = mk("nndescentcode", "Walk downhill, then watch it blow up", "Gradient descent is a loop of one line. The learning rate decides whether the walk converges or runs away.", [{ math: "w ← w − η·∂L/∂w", code: "w - lr * grad", note: "One step." }, { math: "∂L/∂w = mean 2x(wx − y)", code: "sum(2 * x * (w * x - y) ...) / len(xs)", note: "Squared-error slope." }], "sgd_step(), gradient() and descend()", B, B_SOL, B_C, ["Training loss goes up after a step. What is the first thing to try?", "Lower the learning rate. A step that is too big jumps over the minimum and can land higher than where it started."], "One step from w = 1 with gradient 0.2 and learning rate 0.1 gives 0.98. Every gradient in a step comes from the same old parameters.", [preset("Too large a stride", "Try 0.3.", /descend\(0\.05, 20\)/, "descend(0.3, 20)")]);

/* NN03 */
const C = `def n_params(sizes):
    return 0   # TODO 1: weights plus biases for layers like [2, 4, 1] (each layer: inputs × outputs + outputs)

def l2_penalty(weights, alpha):
    return 0.0   # TODO 2: alpha times the sum of squared weights

def params_per_row(sizes, rows):
    return 0.0   # TODO 3: adjustable numbers divided by training rows

print("2 → 2 → 1:", n_params([2, 2, 1]), " 2 → 4 → 1:", n_params([2, 4, 1]))
print("penalty for [1, -2] at alpha 0.5:", l2_penalty([1, -2], 0.5))
print("17 numbers for 20 rows:", params_per_row([2, 4, 1], 20))
`;
const C_SOL = swap(C, [
  ["    return 0   # TODO 1: weights plus biases for layers like [2, 4, 1] (each layer: inputs × outputs + outputs)", "    return sum(a * b + b for a, b in zip(sizes, sizes[1:]))"],
  ["    return 0.0   # TODO 2: alpha times the sum of squared weights", "    return alpha * sum(w * w for w in weights)"],
  ["    return 0.0   # TODO 3: adjustable numbers divided by training rows", "    return n_params(sizes) / rows"],
]);
const C_C = CHECK_PRELUDE + `
try:
    results.append({"name": "2 → 2 → 1 has 9 weights and biases", "passed": n_params([2, 2, 1]) == 9, "hint": "n_params gave %r. 2×2 + 2 + 2×1 + 1 = 9." % (n_params([2, 2, 1]),)})
    results.append({"name": "2 → 4 → 1 has 17", "passed": n_params([2, 4, 1]) == 17, "hint": "n_params gave %r. 2×4 + 4 + 4×1 + 1 = 17." % (n_params([2, 4, 1]),)})
    results.append({"name": "the penalty for weights (1, −2) at alpha 0.5 is 2.5", "passed": _close(l2_penalty([1, -2], 0.5), 2.5), "hint": "l2_penalty gave %r. Squares are 1 and 4, which sum to 5, times 0.5." % (l2_penalty([1, -2], 0.5),)})
    results.append({"name": "17 adjustable numbers for 20 rows is 0.85 per row", "passed": _close(params_per_row([2, 4, 1], 20), 0.85), "hint": "params_per_row gave %r. 17 ÷ 20." % (params_per_row([2, 4, 1], 20),)})
${fail}`;
export const NN3_CODE = mk("nncapcode", "Count the adjustable numbers", "Capacity is countable. Counting the weights and biases, and comparing with the rows you have, is the first sanity check for a network.", [{ math: "params = Σ (inᵢ × outᵢ + outᵢ)", code: "sum(a * b + b for ...)", note: "Weights plus biases per layer." }, { math: "penalty = α Σ w²", code: "alpha * sum(w * w ...)", note: "Keeps weights small." }], "n_params(), l2_penalty() and params_per_row()", C, C_SOL, C_C, ["Doubling the hidden units doubles the capacity. Does it halve the error?", "No. More capacity lets the model fit more, including noise. Whether it helps depends on the validation score."], "A 2 → 2 → 1 network has 9 weights and biases. A 2 → 4 → 1 network has 17, which is not a promise of better validation performance.");

/* NN04 */
const D = `train = [0, 2]
valid = [100]

def centre(values, fit_on):
    return []   # TODO 1: subtract the mean of fit_on from each of values

def init_weights(seed, n):
    s = seed
    out = []
    # TODO 2: repeat n times: s = (s × 1664525 + 1013904223) mod 2³², then append s ÷ 2³² to out
    return out

print("validation centred with training only:", centre(valid, train), " with everything:", centre(valid, train + valid))
print("seed 7:", [round(v, 4) for v in init_weights(7, 3)], " again:", [round(v, 4) for v in init_weights(7, 3)])
`;
const D_SOL = swap(D, [
  ["    return []   # TODO 1: subtract the mean of fit_on from each of values", "    m = sum(fit_on) / len(fit_on)\n    return [v - m for v in values]"],
  ["    # TODO 2: repeat n times: s = (s × 1664525 + 1013904223) mod 2³², then append s ÷ 2³² to out", "    for _ in range(n):\n        s = (s * 1664525 + 1013904223) % 4294967296\n        out.append(s / 4294967296)"],
]);
const D_C = CHECK_PRELUDE + `
try:
    results.append({"name": "training-only centring puts the validation value at 99", "passed": centre([100], [0, 2]) == [99.0], "hint": "centre gave %r. The training mean is 1, so 100 − 1 = 99." % (centre([100], [0, 2]),)})
    results.append({"name": "centring with everything would give 66 (a leak)", "passed": _close(centre([100], [0, 2, 100])[0] if centre([100], [0, 2, 100]) else -1, 66.0), "hint": "Fitting on all rows moves the mean to 34, giving 100 − 34 = 66."})
    results.append({"name": "the same seed gives the same weights", "passed": len(init_weights(7, 3)) == 3 and init_weights(7, 3) == init_weights(7, 3), "hint": "init_weights should return a list of n numbers, and the same seed must give the same list."})
    results.append({"name": "a different seed gives different weights", "passed": init_weights(7, 3) != init_weights(8, 3), "hint": "Two different seeds should start the generator in different places."})
${fail}`;
export const NN4_CODE = mk("nnsafecode", "Repeatable and honest", "A fixed seed makes a run repeatable. A scaler fitted on training rows keeps it honest. Both are a few lines.", [{ math: "centre with the training mean", code: "v - sum(fit_on) / len(fit_on)", note: "Never the validation rows." }, { math: "same seed, same start", code: "s = (s * 1664525 + 1013904223) % 2**32", note: "A seeded generator." }], "centre() and init_weights()", D, D_SOL, D_C, ["The network scores 0.31 on one seed and 0.34 on another. Which one do you report?", "Both, or their average with the spread. One seed is one draw of the starting weights, and the difference is part of the evidence."], "Training values 0 and 2 centre at 1, so the validation value 100 becomes 99. Fitting on all three would use a mean of 34 and give 66.");

/* NN05 */
const E = `def prefer_simple(simple_loss, complex_loss, tolerance):
    return "complex"   # TODO 1: "simple" if the complex model improves the loss by no more than tolerance, otherwise "complex"

def cost_per_gain(extra_cost, gain):
    return 0.0   # TODO 2: extra cost divided by the gain; None if there is no gain

print("0.42 vs 0.42, tolerance 0.02:", prefer_simple(0.42, 0.42, 0.02))
print("0.42 vs 0.30, tolerance 0.02:", prefer_simple(0.42, 0.30, 0.02))
print("10× the cost for no gain:", cost_per_gain(10, 0), " for a gain of 0.05:", cost_per_gain(10, 0.05))
`;
const E_SOL = swap(E, [
  ["    return \"complex\"   # TODO 1: \"simple\" if the complex model improves the loss by no more than tolerance, otherwise \"complex\"", "    return \"simple\" if simple_loss - complex_loss <= tolerance else \"complex\""],
  ["    return 0.0   # TODO 2: extra cost divided by the gain; None if there is no gain", "    return extra_cost / gain if gain > 0 else None"],
]);
const E_C = CHECK_PRELUDE + `
try:
    results.append({"name": "equal loss keeps the simple model", "passed": prefer_simple(0.42, 0.42, 0.02) == "simple", "hint": "prefer_simple gave %r. A gain of 0 does not exceed the tolerance." % (prefer_simple(0.42, 0.42, 0.02),)})
    results.append({"name": "a gain of 0.12 justifies the network", "passed": prefer_simple(0.42, 0.30, 0.02) == "complex", "hint": "0.42 − 0.30 = 0.12, which is more than the tolerance of 0.02."})
    results.append({"name": "no gain means no cost per gain", "passed": cost_per_gain(10, 0) is None, "hint": "With a gain of 0, return None instead of dividing by zero."})
    results.append({"name": "10× the cost for a gain of 0.05 is 200 per unit", "passed": cost_per_gain(10, 0.05) is not None and _close(cost_per_gain(10, 0.05), 200.0), "hint": "cost_per_gain gave %r. It is 10 ÷ 0.05." % (cost_per_gain(10, 0.05),)})
${fail}`;
export const NN5_CODE = mk("nnworthcode", "Is the complicated model worth it?", "The honest question is not whether the network works but whether it earns its cost. Two small functions put numbers on it.", [{ math: "keep simple if gain ≤ tolerance", code: "simple_loss - complex_loss <= tolerance", note: "Lower loss is better." }, { math: "cost per unit of gain", code: "extra_cost / gain", note: "What each improvement costs." }], "prefer_simple() and cost_per_gain()", E, E_SOL, E_C, ["A network ties Logistic Regression on log loss but costs ten times more to fit. Which would you ship?", "Usually the simpler one. It does the same job, is faster to fit and is easier to explain and audit."], "If a network and Logistic Regression both have a development log loss of 0.42, but the network costs ten times as much to fit, the simpler adequate model can be the better choice.");
