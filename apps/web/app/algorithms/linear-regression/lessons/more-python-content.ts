// Live-Python content for Linear Regression lessons 2, 3, 5 and 7. Each lab has a starter with TODOs,
// a worked solution (built from the starter, so they cannot drift), and hidden checks that recompute
// the answer from the learner's own variables. Every number quoted in lesson text is asserted in tests.
import type { CellPreset } from "../../../components/live-python/live-python-cell";

const swap = (starter: string, edits: [string, string][]) => edits.reduce((code, [from, to]) => { if (!code.includes(from)) throw new Error(`missing: ${from}`); return code.replace(from, to); }, starter);
const preset = (label: string, description: string, from: RegExp, to: string): CellPreset => ({ label, description, apply: (code) => code.replace(from, to) });

/* ───────── Lesson 2 · The line equation ───────── */
export const EQUATION_STARTER = `# A line of best guess:  price = w × area + b
w = 42.0     # rupees (in ₹ lakh) added per extra thousand ft²
b = 140.0    # baseline price of a house with zero area

def predict(w, b, x):
    return 0.0    # TODO 1: return the line's value at x  (w times x, plus b)

areas  = [1.0, 1.8, 2.5, 3.2, 4.0, 4.8]
prices = [178, 213, 246, 278, 316, 349]

estimates = [predict(w, b, a) for a in areas]
x, actual = 2.5, 246
estimate = predict(w, b, x)
residual = 0.0    # TODO 2: how far off was this estimate?  (estimate minus actual)

print(f"a {x} thousand ft² house: estimate {estimate:.1f}, recorded {actual}, residual {residual:+.1f}")
`;
export const EQUATION_SOLUTION = swap(EQUATION_STARTER, [
  ["    return 0.0    # TODO 1: return the line's value at x  (w times x, plus b)", "    return w * x + b    # slope × input + baseline"],
  ["residual = 0.0    # TODO 2: how far off was this estimate?  (estimate minus actual)", "residual = estimate - actual    # prediction minus recorded value"],
]);
export const EQUATION_CHECKS = `
def _close(a, b, tol=1e-9): return abs(a - b) <= tol * max(1.0, abs(b))
results = []
try:
    results.append({"name": "predict(w=42, b=140, x=2.5) is 245", "passed": _close(predict(42.0, 140.0, 2.5), 245.0),
        "hint": "predict returned %r. The line is w * x + b: multiply the slope by the input, then add the baseline once." % (predict(42.0, 140.0, 2.5),)})
    results.append({"name": "At x = 0 the line equals the baseline b", "passed": _close(predict(42.0, 140.0, 0.0), 140.0),
        "hint": "With an area of zero the w * x part vanishes, so only b is left. Is b being added exactly once?"})
except Exception as exc:
    results.append({"name": "predict() runs", "passed": False, "hint": "predict() raised: " + str(exc)})
try:
    results.append({"name": "The residual is estimate − actual (here −1)", "passed": _close(residual, estimate - actual),
        "hint": "Your residual is %r. Residual = prediction − recorded value, so a house we under-predicted has a negative residual." % (residual,)})
except Exception as exc:
    results.append({"name": "residual defined", "passed": False, "hint": str(exc)})
`;
export const EQUATION_PRESETS: CellPreset[] = [
  preset("Steeper line (w = 60)", "Each extra ft² adds more", /^w = [^\s#]+/m, "w = 60.0"),
  preset("Flatter line (w = 20)", "Each extra ft² adds less", /^w = [^\s#]+/m, "w = 20.0"),
  preset("Higher baseline (b = 200)", "Slides the whole line up", /^b = [^\s#]+/m, "b = 200.0"),
  preset("Back to w = 42, b = 140", "The lesson's line", /^w = [^\s#]+/m, "w = 42.0"),
];

/* ───────── Lesson 3 · Measuring error ───────── */
export const ERRORS_STARTER = `import math

w, b = 42.0, 140.0
areas  = [1.0, 1.8, 2.5, 3.2, 4.0, 4.8]
prices = [178, 213, 246, 278, 316, 349]

predictions = [w * a + b for a in areas]

residuals = []     # TODO 1: one residual per house (prediction minus recorded price)

mae  = 0.0         # TODO 2: mean absolute error: the average size of the misses
mse  = 0.0         # TODO 3: mean squared error: the average of the squared misses
rmse = 0.0         # TODO 4: root mean squared error: back in ₹ lakh

print("residuals:", [round(r, 2) for r in residuals])
print(f"MAE  = {mae:.4f}")
print(f"MSE  = {mse:.4f}")
print(f"RMSE = {rmse:.4f}")
`;
export const ERRORS_SOLUTION = swap(ERRORS_STARTER, [
  ["residuals = []     # TODO 1: one residual per house (prediction minus recorded price)", "residuals = [p - y for p, y in zip(predictions, prices)]"],
  ["mae  = 0.0         # TODO 2: mean absolute error: the average size of the misses", "mae  = sum(abs(r) for r in residuals) / len(residuals)"],
  ["mse  = 0.0         # TODO 3: mean squared error: the average of the squared misses", "mse  = sum(r ** 2 for r in residuals) / len(residuals)"],
  ["rmse = 0.0         # TODO 4: root mean squared error: back in ₹ lakh", "rmse = math.sqrt(mse)"],
]);
export const ERRORS_CHECKS = `
def _close(a, b, tol=1e-9): return abs(a - b) <= tol * max(1.0, abs(b))
_res = [p - y for p, y in zip(predictions, prices)]
results = []
results.append({"name": "Residuals are prediction − recorded price (first one is +4)",
    "passed": len(residuals) == len(_res) and all(_close(a, b) for a, b in zip(residuals, _res)),
    "hint": "You have %d residuals; expected %d. Build one per house: p - y for each pair, in the same order. Over-predictions are positive." % (len(residuals), len(_res))})
_n = len(_res)
results.append({"name": "MAE ≈ 4.4333", "passed": _close(mae, sum(abs(r) for r in _res) / _n),
    "hint": "MAE = average of |residual|. You got %r. Take abs() before adding up, so positive and negative misses don't cancel." % (mae,)})
results.append({"name": "MSE ≈ 25.9133", "passed": _close(mse, sum(r * r for r in _res) / _n),
    "hint": "MSE = average of residual². You got %r. Square each residual, add them, divide by the number of houses." % (mse,)})
results.append({"name": "RMSE ≈ 5.0905", "passed": _close(rmse, math.sqrt(sum(r * r for r in _res) / _n)),
    "hint": "RMSE = √MSE. You got %r. It is MSE with the square root taken, so it is back in the same units as the price." % (rmse,)})
`;
export const ERRORS_PRESETS: CellPreset[] = [
  preset("A worse line (w = 30)", "Watch every error grow", /^w, b = [^\n]+/m, "w, b = 30.0, 140.0"),
  preset("A very wrong line (w = 42, b = 200)", "A baseline that's too high", /^w, b = [^\n]+/m, "w, b = 42.0, 200.0"),
  preset("The lesson's line", "w = 42, b = 140", /^w, b = [^\n]+/m, "w, b = 42.0, 140.0"),
];

/* ───────── Lesson 5 · Several features ───────── */
export const MULTI_STARTER = `weights = [82.0, 18.0, -1.4]   # ₹ lakh per: thousand ft², bedroom, year of age
bias    = 75.0
house   = [2.4, 3, 12]         # 2,400 ft², 3 bedrooms, 12 years old

def predict(weights, bias, features):
    total = bias
    for wj, xj in zip(weights, features):
        total += 0.0           # TODO 1: this feature's contribution (its weight times its value)
    return total

# TODO 2: one contribution per feature (weight × value), then the baseline last
contributions = []

estimate = predict(weights, bias, house)

rows = [[1.2, 2, 35], [1.8, 3, 20], [2.4, 3, 12], [3.1, 4, 5]]
all_estimates = [predict(weights, bias, r) for r in rows]

print(f"estimate for {house}: {estimate:.1f}")
print("all four houses:", [round(e, 1) for e in all_estimates])
`;
export const MULTI_SOLUTION = swap(MULTI_STARTER, [
  ["        total += 0.0           # TODO 1: this feature's contribution (its weight times its value)", "        total += wj * xj       # weight × value, added to the running total"],
  ["# TODO 2: one contribution per feature (weight × value), then the baseline last\ncontributions = []", "contributions = [wj * xj for wj, xj in zip(weights, house)] + [bias]"],
]);
export const MULTI_CHECKS = `
def _close(a, b, tol=1e-9): return abs(a - b) <= tol * max(1.0, abs(b))
def _ref(wts, bi, f): return bi + sum(a * c for a, c in zip(wts, f))
results = []
try:
    got = predict([82.0, 18.0, -1.4], 75.0, [2.4, 3, 12])
    results.append({"name": "predict() gives 309 for the 2,400 ft² house", "passed": _close(got, 309.0),
        "hint": "predict returned %r. Inside the loop add wj * xj to total: each feature adds its weight times its value." % (got,)})
    results.append({"name": "predict() works for any number of features", "passed": _close(predict([1.0, 2.0], 10.0, [3.0, 4.0]), 21.0),
        "hint": "Try predict([1, 2], 10, [3, 4]): 10 + 1×3 + 2×4 = 21. The loop should not assume exactly three features."})
except Exception as exc:
    results.append({"name": "predict() runs", "passed": False, "hint": "predict() raised: " + str(exc)})
want = [a * c for a, c in zip(weights, house)] + [bias]
results.append({"name": "contributions = [196.8, 54, −16.8, 75]", "passed": len(contributions) == len(want) and all(_close(a, b) for a, b in zip(contributions, want)),
    "hint": "You have %r. Expected one weight × value per feature in order, then the baseline last. Hint: zip(weights, house)." % (contributions,)})
results.append({"name": "The four contributions add up to the estimate", "passed": len(contributions) > 0 and _close(sum(contributions), estimate),
    "hint": "The estimate is just the sum of every feature's contribution plus the baseline."})
`;
export const MULTI_PRESETS: CellPreset[] = [
  preset("Older house (35 years)", "Age pulls the price down", /^house\s+= [^\n]+/m, "house   = [2.4, 3, 35]         # same size, much older"),
  preset("An extra bedroom", "One more room adds its weight", /^house\s+= [^\n]+/m, "house   = [2.4, 4, 12]         # one more bedroom"),
  preset("The lesson's house", "2,400 ft², 3 bedrooms, 12 years", /^house\s+= [^\n]+/m, "house   = [2.4, 3, 12]         # 2,400 ft², 3 bedrooms, 12 years old"),
];

/* ───────── Lesson 7 · When a line fails ───────── */
export const FAILURE_STARTER = `areas  = [1.0, 1.8, 2.5, 3.2, 4.0, 4.8]
prices = [178, 213, 246, 278, 316, 349]

# A data-entry slip: a big house recorded at a tiny price. Set this to True to add it.
add_typo = False

def fit(X, y):
    """Best-fit line by least squares. Returns (slope, intercept)."""
    n = len(X)
    x_mean = sum(X) / n
    y_mean = sum(y) / n
    slope = 0.0         # TODO 1: Σ(x − x̄)(y − ȳ)  divided by  Σ(x − x̄)²
    intercept = 0.0     # TODO 2: the line passes through the point (x̄, ȳ)
    return slope, intercept

clean_w, clean_b = fit(areas, prices)

X = areas + [4.8] if add_typo else areas
Y = prices + [120] if add_typo else prices
w, b = fit(X, Y)

print(f"clean data : price = {clean_w:.2f} × area + {clean_b:.2f}")
print(f"your data  : price = {w:.2f} × area + {b:.2f}")
`;
export const FAILURE_SOLUTION = swap(FAILURE_STARTER, [
  ["    slope = 0.0         # TODO 1: Σ(x − x̄)(y − ȳ)  divided by  Σ(x − x̄)²", "    slope = sum((a - x_mean) * (c - y_mean) for a, c in zip(X, y)) / sum((a - x_mean) ** 2 for a in X)"],
  ["    intercept = 0.0     # TODO 2: the line passes through the point (x̄, ȳ)", "    intercept = y_mean - slope * x_mean"],
]);
export const FAILURE_CHECKS = `
def _close(a, b, tol=1e-9): return abs(a - b) <= tol * max(1.0, abs(b))
def _ref(X, y):
    n = len(X); xm = sum(X) / n; ym = sum(y) / n
    s = sum((a - xm) * (c - ym) for a, c in zip(X, y)) / sum((a - xm) ** 2 for a in X)
    return s, ym - s * xm
results = []
try:
    s, i = fit([1.0, 2.0, 3.0], [3.0, 5.0, 7.0])
    results.append({"name": "A perfect line y = 2x + 1 is recovered exactly", "passed": _close(s, 2.0) and _close(i, 1.0),
        "hint": "fit([1,2,3],[3,5,7]) returned slope %r, intercept %r; expected 2 and 1. Slope = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²." % (s, i)})
    rs, ri = _ref(areas, prices)
    results.append({"name": "Clean housing data: slope 45.46, intercept 132.25", "passed": _close(clean_w, rs, 1e-9) and _close(clean_b, ri, 1e-9),
        "hint": "You got slope %.4f, intercept %.4f; expected %.4f and %.4f. The intercept is ȳ − slope × x̄." % (clean_w, clean_b, rs, ri)})
    ws, wi = _ref(X, Y)
    results.append({"name": "Your current data is fitted correctly", "passed": _close(w, ws, 1e-9) and _close(b, wi, 1e-9),
        "hint": "Your fit on the current data is (%.4f, %.4f); expected (%.4f, %.4f)." % (w, b, ws, wi)})
except Exception as exc:
    results.append({"name": "fit() runs", "passed": False, "hint": "fit() raised: " + str(exc)})
`;
export const FAILURE_PRESETS: CellPreset[] = [
  preset("Add the typo row", "One house at ₹120 lakh instead of ~₹349 lakh", /^add_typo = \w+/m, "add_typo = True"),
  preset("Remove the typo row", "Back to the clean data", /^add_typo = \w+/m, "add_typo = False"),
];
