"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;

/* RG01 · the penalty is a number you can compute */
export const WHY_STARTER = `w = (1, -2)   # weights on area and rooms
sse = 4       # training error: the sum of squared misses
alpha = 2     # how much we care about small weights

def l1(w):
    return 0.0   # TODO 1: the sum of the absolute values of the weights

def l2_squared(w):
    return 0.0   # TODO 2: the sum of the squared weights

def ridge_objective(sse, alpha, w):
    return sse + alpha * l2_squared(w)

print("L1:", l1(w), " squared L2:", l2_squared(w))
print("ridge objective:", ridge_objective(sse, alpha, w))
`;
export const WHY_SOLUTION = swap(WHY_STARTER, [
  ["    return 0.0   # TODO 1: the sum of the absolute values of the weights", "    return sum(abs(v) for v in w)"],
  ["    return 0.0   # TODO 2: the sum of the squared weights", "    return sum(v * v for v in w)"],
]);
export const WHY_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "l1((1, -2)) = 3", "passed": _close(l1((1, -2)), 3.0), "hint": "l1 returned %r. Add |1| and |−2|." % (l1((1, -2)),)})
    results.append({"name": "l2_squared((1, -2)) = 5", "passed": _close(l2_squared((1, -2)), 5.0), "hint": "l2_squared returned %r. Add 1² and (−2)²." % (l2_squared((1, -2)),)})
    results.append({"name": "ridge_objective(4, 2, (1, -2)) = 14", "passed": _close(ridge_objective(4, 2, (1, -2)), 14.0), "hint": "ridge_objective returned %r. It is 4 + 2 × 5." % (ridge_objective(4, 2, (1, -2)),)})
    results.append({"name": "bigger weights cost more: (3, -4) gives 54", "passed": _close(ridge_objective(4, 2, (3, -4)), 54.0), "hint": "With weights (3, −4) the squared sum is 25, so the objective is 4 + 2 × 25 = 54."})
${fail.replace(/\n$/, "")}
`;
export const WHY_CODE: CodeLabConfig = {
  id: "rgwhycode", title: "Put a price on large weights", intro: <p>A penalty is just a number added to the training error. Writing it as code shows that nothing mysterious is going on: big weights cost more.</p>,
  bridge: [{ math: "‖w‖₁ = Σ|wⱼ|", code: "sum(abs(v) for v in w)", note: "The absolute (L1) size of the weights." }, { math: "‖w‖₂² = Σwⱼ²", code: "sum(v * v for v in w)", note: "The squared (L2) size of the weights." }, { math: "J = SSE + α‖w‖₂²", code: "sse + alpha * l2_squared(w)", note: "Training error plus the penalty." }],
  cell: { title: "l1(), l2_squared() and the objective", starter: WHY_STARTER, solution: WHY_SOLUTION, checks: WHY_CHECKS, expose: [], presets: [preset("A stronger penalty", "Double α.", /^alpha = \d+/m, "alpha = 4")] },
  reflections: [{ question: <>The objective is 14. Is that a validation error?</>, answer: <>No. It is the training error plus the penalty, a number the fitting procedure tries to make small. How the model does on unseen houses is measured separately.</> }],
  footer: <>For weights (1, −2): L1 = 3, squared L2 = 5, and with α = 2 and a training error of 4 the ridge objective is 4 + 2 × 5 = 14.</>,
};

/* RG02 · ridge shrinks smoothly */
const DATA_1D = `xs = [-2, -1, 0, 1, 2]   # area, centred
ys = [-3, -2, 0, 2, 3]   # price, centred
`;
export const RIDGE_STARTER = DATA_1D + `
def ridge_weight(xs, ys, alpha):
    return 0.0   # TODO 1: with one centred feature the ridge weight is sum(x·y) ÷ (sum(x·x) + alpha)

def shrink_share(xs, ys, alpha):
    return 1.0   # TODO 2: how much of the unpenalised weight is left: ridge_weight(alpha) ÷ ridge_weight(0)

for alpha in (0, 1, 10, 100):
    print("alpha", alpha, "-> weight", round(ridge_weight(xs, ys, alpha), 3), " share kept", round(shrink_share(xs, ys, alpha), 3))
`;
export const RIDGE_SOLUTION = swap(RIDGE_STARTER, [
  ["    return 0.0   # TODO 1: with one centred feature the ridge weight is sum(x·y) ÷ (sum(x·x) + alpha)", "    return sum(x * y for x, y in zip(xs, ys)) / (sum(x * x for x in xs) + alpha)"],
  ["    return 1.0   # TODO 2: how much of the unpenalised weight is left: ridge_weight(alpha) ÷ ridge_weight(0)", "    return ridge_weight(xs, ys, alpha) / ridge_weight(xs, ys, 0)"],
]);
export const RIDGE_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "with no penalty the weight is 1.6", "passed": _close(ridge_weight(xs, ys, 0), 1.6), "hint": "ridge_weight(xs, ys, 0) returned %r. sum(x·y) = 16 and sum(x·x) = 10, so 16 ÷ 10 = 1.6." % (ridge_weight(xs, ys, 0),)})
    results.append({"name": "with α = 10 the weight is exactly halved to 0.8", "passed": _close(ridge_weight(xs, ys, 10), 0.8), "hint": "ridge_weight(xs, ys, 10) returned %r. The denominator becomes 10 + 10 = 20, so 16 ÷ 20 = 0.8." % (ridge_weight(xs, ys, 10),)})
    results.append({"name": "shrink_share(α = 10) = 0.5", "passed": _close(shrink_share(xs, ys, 10), 0.5), "hint": "shrink_share returned %r. Divide the penalised weight by the unpenalised weight." % (shrink_share(xs, ys, 10),)})
    results.append({"name": "the weight shrinks as α grows but never reaches 0", "passed": 0 < ridge_weight(xs, ys, 100) < ridge_weight(xs, ys, 10) < ridge_weight(xs, ys, 1), "hint": "Ridge makes the weight smaller each time α grows, but it stays above zero."})
${fail.replace(/\n$/, "")}
`;
export const RIDGE_CODE: CodeLabConfig = {
  id: "rgridgecode", title: "Watch one weight shrink", intro: <p>With a single centred feature, ridge has a tidy formula. The penalty adds α to the denominator, so the weight is pulled toward zero but never lands there.</p>,
  bridge: [{ math: "w = Σxy ÷ (Σx² + α)", code: "sum(x * y ...) / (sum(x * x ...) + alpha)", note: "Ridge for one centred feature." }],
  cell: { title: "ridge_weight() and shrink_share()", starter: RIDGE_STARTER, solution: RIDGE_SOLUTION, checks: RIDGE_CHECKS, expose: [], presets: [preset("Include a much larger α", "See the weight nearly vanish.", /for alpha in \(0, 1, 10, 100\)/, "for alpha in (0, 10, 100, 10000)")] },
  reflections: [{ question: <>Why does ridge never make a weight exactly zero?</>, answer: <>Its penalty grows smoothly: the pull toward zero gets weaker as the weight gets smaller. Lasso's penalty has a corner at zero, which is what allows an exact zero.</> }],
  footer: <>With α = 0 the weight is 1.6. With α = 10 it is exactly 0.8: half the weight is kept.</>,
};

/* RG03 · lasso: soft thresholding */
export const LASSO_STARTER = DATA_1D + `
def soft_threshold(rho, lam):
    return rho   # TODO 1: move rho toward zero by lam; if |rho| ≤ lam the answer is exactly 0

def lasso_weight(xs, ys, alpha):
    n = len(xs)
    rho = sum(x * y for x, y in zip(xs, ys)) / n
    norm = sum(x * x for x in xs) / n
    return 0.0   # TODO 2: soft_threshold(rho, alpha) ÷ norm

for alpha in (0, 1, 3.2, 5):
    print("alpha", alpha, "-> weight", lasso_weight(xs, ys, alpha))
`;
export const LASSO_SOLUTION = swap(LASSO_STARTER, [
  ["    return rho   # TODO 1: move rho toward zero by lam; if |rho| ≤ lam the answer is exactly 0", "    if abs(rho) <= lam:\n        return 0.0\n    return rho - lam if rho > 0 else rho + lam"],
  ["    return 0.0   # TODO 2: soft_threshold(rho, alpha) ÷ norm", "    return soft_threshold(rho, alpha) / norm"],
]);
export const LASSO_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "soft_threshold(3.2, 1) = 2.2", "passed": _close(soft_threshold(3.2, 1), 2.2), "hint": "soft_threshold(3.2, 1) returned %r. Subtract lam from a positive rho." % (soft_threshold(3.2, 1),)})
    results.append({"name": "soft_threshold(-3.2, 1) = -2.2", "passed": _close(soft_threshold(-3.2, 1), -2.2), "hint": "soft_threshold(−3.2, 1) returned %r. For a negative rho, add lam so it moves toward zero." % (soft_threshold(-3.2, 1),)})
    results.append({"name": "soft_threshold(0.5, 1) is exactly 0", "passed": soft_threshold(0.5, 1) == 0, "hint": "When |rho| ≤ lam the weight is cut to exactly 0, not a tiny number."})
    results.append({"name": "lasso_weight at α = 1 is 1.1", "passed": _close(lasso_weight(xs, ys, 1), 1.1), "hint": "lasso_weight returned %r. rho = 3.2, norm = 2, so (3.2 − 1) ÷ 2 = 1.1." % (lasso_weight(xs, ys, 1),)})
    results.append({"name": "a strong penalty (α = 5) gives an exact zero", "passed": lasso_weight(xs, ys, 5) == 0, "hint": "With α = 5, which is larger than rho = 3.2, the weight must be exactly 0."})
${fail.replace(/\n$/, "")}
`;
export const LASSO_CODE: CodeLabConfig = {
  id: "rglassocode", title: "Cut a weight to exactly zero", intro: <p>Lasso's secret is one small function. It moves a number toward zero by a fixed amount, and if the number would cross zero it stops there.</p>,
  bridge: [{ math: "S(ρ, λ) = sign(ρ) · max(|ρ| − λ, 0)", code: "0 if abs(rho) <= lam else rho - lam (or + lam)", note: "The soft threshold." }, { math: "w = S(ρ, α) ÷ mean(x²)", code: "soft_threshold(rho, alpha) / norm", note: "Lasso for one centred feature." }],
  cell: { title: "soft_threshold() and lasso_weight()", starter: LASSO_STARTER, solution: LASSO_SOLUTION, checks: LASSO_CHECKS, expose: [], presets: [preset("Try α = 2", "Partway to zero.", /for alpha in \(0, 1, 3.2, 5\)/, "for alpha in (0, 1, 2, 3)")] },
  reflections: [{ question: <>Two nearly identical features: why might lasso keep one and drop the other?</>, answer: <>They explain the same variation, so either one can carry the weight. Which one wins can depend on small details of the sample, which is why a dropped feature is not proof it does not matter.</> }],
  footer: <>At α = 1 the weight is (3.2 − 1) ÷ 2 = 1.1. At α = 3.2 and above it is exactly 0.</>,
};

/* RG04 · elastic net penalty */
export const ELASTIC_STARTER = `w = (1, 2)
alpha = 1     # overall strength
q = 0.5       # share given to the absolute-value penalty (the rest goes to the squares)

def enet_penalty(w, alpha, q):
    absolute = 0.0   # TODO 1: alpha × q × the sum of |w|
    squared = 0.0    # TODO 2: alpha × (1 − q) × the sum of w² ÷ 2
    return absolute + squared

def objective(sse, n, w, alpha, q):
    return sse / (2 * n) + enet_penalty(w, alpha, q)

print("penalty:", enet_penalty(w, alpha, q))
print("objective with SSE = 4 and n = 2:", objective(4, 2, w, alpha, q))
`;
export const ELASTIC_SOLUTION = swap(ELASTIC_STARTER, [
  ["    absolute = 0.0   # TODO 1: alpha × q × the sum of |w|", "    absolute = alpha * q * sum(abs(v) for v in w)"],
  ["    squared = 0.0    # TODO 2: alpha × (1 − q) × the sum of w² ÷ 2", "    squared = alpha * (1 - q) * sum(v * v for v in w) / 2"],
]);
export const ELASTIC_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "enet_penalty((1, 2), 1, 0.5) = 2.75", "passed": _close(enet_penalty((1, 2), 1, 0.5), 2.75), "hint": "enet_penalty returned %r. The absolute part is 1 × 0.5 × 3 = 1.5 and the squared part is 1 × 0.5 × 5 ÷ 2 = 1.25." % (enet_penalty((1, 2), 1, 0.5),)})
    results.append({"name": "q = 1 is a pure lasso penalty: alpha × sum |w|", "passed": _close(enet_penalty((1, 2), 2, 1), 6.0), "hint": "With q = 1 only the absolute part remains: 2 × 3 = 6."})
    results.append({"name": "q = 0 is a pure squared penalty: alpha × sum w² ÷ 2", "passed": _close(enet_penalty((1, 2), 2, 0), 5.0), "hint": "With q = 0 only the squared part remains: 2 × 5 ÷ 2 = 5."})
    results.append({"name": "objective(4, 2, (1, 2), 1, 0.5) = 3.75", "passed": _close(objective(4, 2, (1, 2), 1, 0.5), 3.75), "hint": "objective returned %r. The error part is 4 ÷ (2 × 2) = 1 and the penalty is 2.75." % (objective(4, 2, (1, 2), 1, 0.5),)})
${fail.replace(/\n$/, "")}
`;
export const ELASTIC_CODE: CodeLabConfig = {
  id: "rgelasticcode", title: "Blend the two penalties", intro: <p>Elastic net keeps both pulls: the absolute part can zero out weights, the squared part keeps correlated weights from competing. One number, q, sets the blend.</p>,
  bridge: [{ math: "α·q·Σ|wⱼ| + α·(1−q)·Σwⱼ²/2", code: "alpha * q * sum(abs(v)...) + alpha * (1 - q) * sum(v*v...) / 2", note: "The elastic net penalty." }],
  cell: { title: "enet_penalty() and objective()", starter: ELASTIC_STARTER, solution: ELASTIC_SOLUTION, checks: ELASTIC_CHECKS, expose: [], presets: [preset("All lasso", "q = 1", /^q = [^\s#]+/m, "q = 1"), preset("All ridge", "q = 0", /^q = [^\s#]+/m, "q = 0")] },
  reflections: [{ question: <>The penalty number is 2.75. Does a lower penalty alone tell you which model is best?</>, answer: <>No. The penalty is only one part of what the fit trades off. A model is judged by how well it predicts on houses it has not seen.</> }],
  footer: <>For w = (1, 2), α = 1 and q = 0.5: 1.5 from the absolute part plus 1.25 from the squared part makes 2.75.</>,
};

/* RG05 · fit the scaler inside the fold */
export const SAFE_STARTER = `areas = [8, 12, 30]   # three houses; the third one is held out for testing
train_ids = [0, 1]
held_ids = [2]

def fit_scaler(values, ids):
    mean = 0.0   # TODO 1: the average of only the values at these ids
    spread = 1.0 # TODO 2: the population standard deviation of those same values
    return mean, spread

def leaked(fit_ids, held_ids):
    return False   # TODO 3: True if any held-out id was used to fit the scaler

mean, spread = fit_scaler(areas, train_ids)
print("scaler:", mean, spread)
print("held-out z-score:", (areas[2] - mean) / spread)
print("fit on everything leaks?", leaked([0, 1, 2], held_ids))
`;
export const SAFE_SOLUTION = swap(SAFE_STARTER, [
  ["    mean = 0.0   # TODO 1: the average of only the values at these ids\n    spread = 1.0 # TODO 2: the population standard deviation of those same values", "    picked = [values[i] for i in ids]\n    mean = sum(picked) / len(picked)\n    spread = (sum((v - mean) ** 2 for v in picked) / len(picked)) ** 0.5"],
  ["    return False   # TODO 3: True if any held-out id was used to fit the scaler", "    return any(i in held_ids for i in fit_ids)"],
]);
export const SAFE_CHECKS = CHECK_PRELUDE + `
try:
    m, s = fit_scaler(areas, train_ids)
    results.append({"name": "fitted on the training houses only the mean is 10", "passed": _close(m, 10.0), "hint": "The mean is %r. Use only the values at the training ids: (8 + 12) ÷ 2 = 10, not the average of all three." % (m,)})
    results.append({"name": "the training spread is 2", "passed": _close(s, 2.0), "hint": "The spread is %r. For 8 and 12 the population standard deviation is 2." % (s,)})
    results.append({"name": "the held-out house gets z = 10", "passed": _close((30 - m) / s, 10.0), "hint": "With mean 10 and spread 2 the held-out area 30 is 10 standard deviations away. That surprise is real information."})
    results.append({"name": "fitting on all three houses is flagged as leakage", "passed": leaked([0, 1, 2], [2]) is True, "hint": "leaked([0, 1, 2], [2]) should be True because id 2 was used to fit."})
    results.append({"name": "fitting on training ids only is not leakage", "passed": leaked([0, 1], [2]) is False, "hint": "leaked([0, 1], [2]) should be False."})
${fail.replace(/\n$/, "")}
`;
export const SAFE_CODE: CodeLabConfig = {
  id: "rgsafecode", title: "Fit the scaler on training houses only", intro: <p>A scaler learns two numbers from data. If it learns them from houses that will later be used for testing, the test has already leaked into the model.</p>,
  bridge: [{ math: "μ and s from the training fold only", code: "[values[i] for i in ids]", note: "Pick only the training rows before averaging." }],
  cell: { title: "fit_scaler() and leaked()", starter: SAFE_STARTER, solution: SAFE_SOLUTION, checks: SAFE_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>If the leak makes the model look better, why does it matter?</>, answer: <>Because the score you report would not hold up on genuinely new houses. A decision to deploy based on an inflated score is a decision made on false evidence.</> }],
  footer: <>Fitted on houses 8 and 12 only, the scaler has mean 10 and spread 2. The held-out house of area 30 sits 10 standard deviations away, which the model should see as a surprise.</>,
};

/* RG06 · back to raw units */
export const INTERP_STARTER = `def price_scaled(ws, s, b, mu, x):
    """The model as it was fitted: price = b + ws × (x − mu) ÷ s."""
    return b + ws * (x - mu) / s

def to_raw(ws, s, b, mu):
    slope = 0.0       # TODO 1: the weight per raw unit: ws ÷ s
    intercept = 0.0   # TODO 2: b − slope × mu
    return slope, intercept

slope, intercept = to_raw(6, 3, 10, 4)
print("price per raw unit:", slope, " intercept:", intercept)
print("price at x = 7 (scaled route):", price_scaled(6, 3, 10, 4, 7))
print("price at x = 7 (raw route):   ", intercept + slope * 7)
`;
export const INTERP_SOLUTION = swap(INTERP_STARTER, [
  ["    slope = 0.0       # TODO 1: the weight per raw unit: ws ÷ s\n    intercept = 0.0   # TODO 2: b − slope × mu", "    slope = ws / s\n    intercept = b - slope * mu"],
]);
export const INTERP_CHECKS = CHECK_PRELUDE + `
try:
    sl, ic = to_raw(6, 3, 10, 4)
    results.append({"name": "the slope is 2 price units per raw unit", "passed": _close(sl, 2.0), "hint": "The slope is %r. Divide the scaled weight 6 by the training spread 3." % (sl,)})
    results.append({"name": "the intercept is 2", "passed": _close(ic, 2.0), "hint": "The intercept is %r. It is 10 − 2 × 4 = 2." % (ic,)})
    results.append({"name": "both routes give 16 at x = 7", "passed": _close(ic + sl * 7, price_scaled(6, 3, 10, 4, 7)) and _close(ic + sl * 7, 16.0), "hint": "The raw route and the scaled route must agree: both are 16 at x = 7."})
    a, c = to_raw(-5, 2.5, 20, 6)
    results.append({"name": "another model agrees too: ws = −5, s = 2.5, b = 20, μ = 6", "passed": _close(c + a * 9, price_scaled(-5, 2.5, 20, 6, 9)), "hint": "Check both formulas on a different model. If they disagree, one of slope or intercept is wrong."})
${fail.replace(/\n$/, "")}
`;
export const INTERP_CODE: CodeLabConfig = {
  id: "rginterpcode", title: "Translate a weight back to real units", intro: <p>Scaled weights are right for fitting and awkward for explaining. Two lines turn them back into prices per square metre, or per room.</p>,
  bridge: [{ math: "w_raw = w_scaled ÷ s", code: "ws / s", note: "Price change per raw unit." }, { math: "b_raw = b − w_raw · μ", code: "b - slope * mu", note: "The intercept in raw units." }],
  cell: { title: "to_raw()", starter: INTERP_STARTER, solution: INTERP_SOLUTION, checks: INTERP_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>The raw slope is ₹2 lakh per unit. Does that mean adding a unit would raise a particular house's price by ₹2 lakh?</>, answer: <>Not necessarily. It describes how this fitted model's predictions differ across houses, not what would happen to one house if you changed it.</> }],
  footer: <>A scaled weight of 6 with spread 3 is 2 per raw unit. With a mean of 4 and a scaled intercept of 10 the raw intercept is 2, and both routes give 16 at x = 7.</>,
};
