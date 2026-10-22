"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";
import { DEGREES, NARROW, TRAIN, TRUE_CURVE, VALID, fit, toPy } from "./poly-math";

/* PR01 · a curve from extra columns */
export const CURVE_STARTER = `# Houses: (area, price in ₹ lakh)
houses = ${toPy(TRAIN)}
b, w1, w2 = 10, 12, -1   # baseline, weight on x, weight on x²

def predict(x, b, w1, w2):
    return 0.0   # TODO 1: baseline + weight1 × x + weight2 × x²

def average_miss(houses, b, w1, w2):
    return 0.0   # TODO 2: the average of |price − predicted price| over all the houses

print("price at area 2:", predict(2, 1, 2, 3), "₹ lakh")
print("average miss:", round(average_miss(houses, b, w1, w2), 2), "₹ lakh")
`;
export const CURVE_SOLUTION = swap(CURVE_STARTER, [
  ["    return 0.0   # TODO 1: baseline + weight1 × x + weight2 × x²", "    return b + w1 * x + w2 * x ** 2"],
  ["    return 0.0   # TODO 2: the average of |price − predicted price| over all the houses", "    return sum(abs(price - predict(x, b, w1, w2)) for x, price in houses) / len(houses)"],
]);
export const CURVE_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "predict(2, 1, 2, 3) = 17", "passed": _close(predict(2, 1, 2, 3), 17.0), "hint": "predict(2, 1, 2, 3) returned %r. At x = 2 the columns are 2 and 4: 1 + 2×2 + 3×4 = 17." % (predict(2, 1, 2, 3),)})
    results.append({"name": "raising the weight on x from 2 to 4 moves the price to 21", "passed": _close(predict(2, 1, 4, 3), 21.0), "hint": "predict(2, 1, 4, 3) returned %r. Only the first weight changed, so the price rises by 2 × 2 = 4." % (predict(2, 1, 4, 3),)})
    ref = sum(abs(p - (b + w1 * x + w2 * x * x)) for x, p in houses) / len(houses)
    results.append({"name": "average_miss matches the reference for your curve", "passed": _close(average_miss(houses, b, w1, w2), ref), "hint": "average_miss returned %r; the reference is %r. Average the absolute misses, not the squared ones." % (average_miss(houses, b, w1, w2), ref)})
    results.append({"name": "a bent curve beats a straight line on these houses", "passed": average_miss(houses, 10, 12, -1) < average_miss(houses, 10, 8, 0), "hint": "The curve (10, 12, −1) should miss by less than the line (10, 8, 0). Check that w2 multiplies x squared."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const CURVE_CODE: CodeLabConfig = {
  id: "prcurvecode", title: "Add one column and bend the line", intro: <p>A polynomial model is the same weighted sum you already know. The only new idea is to feed it extra columns made from the old one.</p>,
  bridge: [{ math: "ŷ = b + w₁x + w₂x²", code: "b + w1 * x + w2 * x ** 2", note: "Still a weighted sum of columns." }, { math: "average miss = mean |y − ŷ|", code: "sum(abs(price - predict(...)) ...) / len(houses)", note: "How far off, on average, in ₹ lakh." }],
  cell: { title: "predict() and average_miss()", starter: CURVE_STARTER, solution: CURVE_SOLUTION, checks: CURVE_CHECKS, expose: [], presets: [preset("Try a straight line", "Set the x² weight to 0.", /^b, w1, w2 = .*/m, "b, w1, w2 = 10, 8, 0")] },
  reflections: [{ question: <>The curve bends, so why is the model still called linear?</>, answer: <>It is linear in the weights: each weight multiplies a column and the results are added. The bend comes from the columns (x and x²), not from a new kind of formula.</> }],
  footer: <>At area 2, the weights 1, 2 and 3 give 1 + 4 + 12 = 17 ₹ lakh. Changing the first weight to 4 moves it to 21.</>,
};

/* PR02 · counting columns */
export const COLUMNS_STARTER = `import math

def columns(p, d):
    return 0   # TODO 1: how many columns: (number of ways to pick terms) minus the constant, math.comb(p + d, d) - 1

def expand(a, b):
    return [a, b]   # TODO 2: degree 2 without the constant: [a, b, a², a·b, b²]

print("2 features, degree 2:", columns(2, 2), "columns")
print("10 features, degree 3:", columns(10, 3), "columns")
print("the row [2, 3] becomes", expand(2, 3))
`;
export const COLUMNS_SOLUTION = swap(COLUMNS_STARTER, [
  ["    return 0   # TODO 1: how many columns: (number of ways to pick terms) minus the constant, math.comb(p + d, d) - 1", "    return math.comb(p + d, d) - 1"],
  ["    return [a, b]   # TODO 2: degree 2 without the constant: [a, b, a², a·b, b²]", "    return [a, b, a * a, a * b, b * b]"],
]);
export const COLUMNS_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "columns(2, 2) = 5", "passed": columns(2, 2) == 5, "hint": "columns(2, 2) returned %r. C(4, 2) − 1 = 6 − 1 = 5." % (columns(2, 2),)})
    results.append({"name": "columns(2, 3) = 9", "passed": columns(2, 3) == 9, "hint": "columns(2, 3) returned %r. C(5, 3) − 1 = 10 − 1 = 9." % (columns(2, 3),)})
    results.append({"name": "columns(10, 3) = 285", "passed": columns(10, 3) == 285, "hint": "columns(10, 3) returned %r. C(13, 3) − 1 = 286 − 1 = 285." % (columns(10, 3),)})
    results.append({"name": "expand(2, 3) = [2, 3, 4, 6, 9]", "passed": list(expand(2, 3)) == [2, 3, 4, 6, 9], "hint": "expand(2, 3) returned %r. The five columns are a, b, a², a·b, b²." % (list(expand(2, 3)),)})
    results.append({"name": "expand and columns agree on the number of columns", "passed": len(expand(2, 3)) == columns(2, 2), "hint": "The expanded row should have as many entries as columns(2, 2) says."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const COLUMNS_CODE: CodeLabConfig = {
  id: "prcolumnscode", title: "Count the columns before you build them", intro: <p>Curves are cheap to draw and expensive to feed. Each extra column needs its own weight, and the number of columns grows fast with both the degree and the number of measurements.</p>,
  bridge: [{ math: "C(p + d, d) − 1", code: "math.comb(p + d, d) - 1", note: "Columns for p measurements at degree d, without the constant." }, { math: "[a, b] → [a, b, a², ab, b²]", code: "[a, b, a * a, a * b, b * b]", note: "The cross term ab lets two measurements act together." }],
  cell: { title: "columns() and expand()", starter: COLUMNS_STARTER, solution: COLUMNS_SOLUTION, checks: COLUMNS_CHECKS, expose: [], presets: [preset("Twenty features, degree 3", "How fast does it grow?", /columns\(10, 3\)/, "columns(20, 3)")] },
  reflections: [{ question: <>You have 100 houses. Is a model with 285 columns a good idea?</>, answer: <>No. Nearly three coefficients per house means the model can memorize the training houses, noise included. More columns need more evidence, or a penalty that keeps the weights calm.</> }],
  footer: <>Two measurements at degree 2 give 5 columns; at degree 3 they give 9; ten measurements at degree 3 give 285.</>,
};

/* PR03 · degree and unseen error: predictions per degree are given, choosing honestly is the exercise */
const PREDS = Object.fromEntries(DEGREES.map(d => { const f = fit(TRAIN, d); return [d, [TRAIN.map(h => Math.round(f(h.x) * 1000) / 1000), VALID.map(h => Math.round(f(h.x) * 1000) / 1000)]]; }));
const pyPreds = "{" + DEGREES.map(d => `${d}: (${JSON.stringify(PREDS[d][0])}, ${JSON.stringify(PREDS[d][1])})`).join(", ") + "}";
export const DEGREE_STARTER = `# (area, price) for 20 training houses and 20 houses the model has not seen
train = ${toPy(TRAIN)}
valid = ${toPy(VALID)}
# For each degree: (predicted prices on train, predicted prices on valid), from a fitted curve
preds = ${pyPreds}

def mae(actual, predicted):
    return 0.0   # TODO 1: the average of |actual − predicted| (both are plain lists of prices)

def best_degree(valid, preds):
    return 1   # TODO 2: the degree with the lowest mae on the *valid* houses (the first one wins a tie)

actual_train = [price for _, price in train]
actual_valid = [price for _, price in valid]
print("degree 8 on training houses:", round(mae(actual_train, preds[8][0]), 2))
print("degree 8 on unseen houses:  ", round(mae(actual_valid, preds[8][1]), 2))
print("best degree:", best_degree(valid, preds))
`;
export const DEGREE_SOLUTION = swap(DEGREE_STARTER, [
  ["    return 0.0   # TODO 1: the average of |actual − predicted| (both are plain lists of prices)", "    return sum(abs(a - p) for a, p in zip(actual, predicted)) / len(actual)"],
  ["    return 1   # TODO 2: the degree with the lowest mae on the *valid* houses (the first one wins a tie)", "    actual = [price for _, price in valid]\n    best = 1\n    for degree in sorted(preds):\n        if mae(actual, preds[degree][1]) < mae(actual, preds[best][1]):\n            best = degree\n    return best"],
]);
export const DEGREE_CHECKS = CHECK_PRELUDE + `
def _ref_mae(a, p): return sum(abs(x - y) for x, y in zip(a, p)) / len(a)
try:
    results.append({"name": "mae([10, 20], [12, 17]) = 2.5", "passed": _close(mae([10, 20], [12, 17]), 2.5), "hint": "mae returned %r. Average |10 − 12| and |20 − 17|." % (mae([10, 20], [12, 17]),)})
    av = [p for _, p in valid]; at = [p for _, p in train]
    results.append({"name": "degree 8 looks better on training houses than on unseen houses", "passed": mae(at, preds[8][0]) + 0.5 < mae(av, preds[8][1]), "hint": "Degree 8 should show a clear gap: its curve has memorized the training houses."})
    expected = min(sorted(preds), key=lambda d: (_ref_mae(av, preds[d][1]), d))
    results.append({"name": "best_degree picks the degree with the lowest unseen error", "passed": best_degree(valid, preds) == expected, "hint": "best_degree returned %r but the lowest unseen error is at degree %r. Compare mae on the valid houses, not on train." % (best_degree(valid, preds), expected)})
    results.append({"name": "the training-error favourite is not the unseen-error favourite", "passed": best_degree(valid, preds) != min(sorted(preds), key=lambda d: (_ref_mae(at, preds[d][0]), d)), "hint": "Training error keeps falling as the degree rises, so choosing by it always picks the highest degree."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const DEGREE_CODE: CodeLabConfig = {
  id: "prdegreecode", title: "Pick the degree on houses the curve has not seen", intro: <p>Training error never goes up as you add bends. To choose a degree honestly, compare candidates on houses that were left out of the fit.</p>,
  bridge: [{ math: "MAE = (1/n) Σ |y − ŷ|", code: "sum(abs(a - p) ...) / len(actual)", note: "Average miss in ₹ lakh." }, { math: "degree* = argmin MAE on unseen houses", code: "mae(actual, preds[degree][1])", note: "[1] holds the unseen-house predictions." }],
  cell: { title: "mae() and best_degree()", starter: DEGREE_STARTER, solution: DEGREE_SOLUTION, checks: DEGREE_CHECKS, expose: [], presets: [preset("Look at degree 3", "Compare a middle degree.", /preds\[8\]/g, "preds[3]")] },
  reflections: [{ question: <>Degree 8 hugs the training houses best. Why not use it?</>, answer: <>Because it learned their noise as well as their pattern. On houses it has not seen, its error is larger than that of a simple curve.</> }],
  footer: <>Degree 8 misses training houses by about ₹0.9 lakh but unseen houses by about ₹2.1 lakh. Degree 2 misses unseen houses by only about ₹1.5 lakh.</>,
};

/* PR04 · where the curve has evidence */
const QUERY = 3.8, PRED_AT = Object.fromEntries([1, 2, 3, 5, 8].map(d => [d, Math.round(fit(NARROW, d)(QUERY) * 10) / 10]));
export const LIMITS_STARTER = `train_areas = ${JSON.stringify(NARROW.map(h => h.x))}   # the model only saw houses up to area 3
query = ${QUERY}
true_price = ${Math.round(TRUE_CURVE(QUERY) * 10) / 10}                           # the price pattern at the query
preds = ${JSON.stringify(PRED_AT).replace(/"/g, "")}   # each degree's prediction at the query

def inside(x, areas):
    return True   # TODO 1: is x within the range of the areas the model learned from (min to max)?

def safest_degree(preds, true_price):
    return 1   # TODO 2: the degree whose prediction is closest to true_price

print("is the query inside the training range?", inside(query, train_areas))
print("closest degree:", safest_degree(preds, true_price))
`;
export const LIMITS_SOLUTION = swap(LIMITS_STARTER, [
  ["    return True   # TODO 1: is x within the range of the areas the model learned from (min to max)?", "    return min(areas) <= x <= max(areas)"],
  ["    return 1   # TODO 2: the degree whose prediction is closest to true_price", "    return min(preds, key=lambda d: abs(preds[d] - true_price))"],
]);
export const LIMITS_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "inside(1.5, [0.5, 2.0, 3.0]) is True", "passed": inside(1.5, [0.5, 2.0, 3.0]) is True, "hint": "1.5 lies between the smallest and largest area, so it is inside."})
    results.append({"name": "inside(3.8, [0.5, 2.0, 3.0]) is False", "passed": inside(3.8, [0.5, 2.0, 3.0]) is False, "hint": "3.8 is above the largest area seen, so it is outside the range."})
    results.append({"name": "the query is outside the training range", "passed": inside(query, train_areas) is False, "hint": "The query area is larger than any training house, so inside() should be False."})
    expected = min(preds, key=lambda d: abs(preds[d] - true_price))
    results.append({"name": "safest_degree returns the degree closest to the real pattern", "passed": safest_degree(preds, true_price) == expected, "hint": "safest_degree returned %r; the closest prediction is degree %r. Compare abs(prediction − true_price)." % (safest_degree(preds, true_price), expected)})
    results.append({"name": "the most flexible curve is not the safest outside the range", "passed": safest_degree(preds, true_price) != max(preds), "hint": "The highest degree should not be the closest outside the range, because flexible curves swing wildly there."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const LIMITS_CODE: CodeLabConfig = {
  id: "prlimitscode", title: "Check whether the query is inside what the model has seen", intro: <p>A fitted curve says nothing reliable about areas it never saw. A one-line range check before you trust a prediction catches the most dangerous mistakes.</p>,
  bridge: [{ math: "min(x_train) ≤ x ≤ max(x_train)", code: "min(areas) <= x <= max(areas)", note: "Interpolation if true, extrapolation if false." }],
  cell: { title: "inside() and safest_degree()", starter: LIMITS_STARTER, solution: LIMITS_SOLUTION, checks: LIMITS_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Why not simply trust the highest degree, since it fits the training houses best?</>, answer: <>Outside the training range nothing pins the curve down, so a high degree can swing to absurd prices. Low degrees extrapolate more calmly, and the honest move is to flag the query as unsupported.</> }],
  footer: <>At area 3.8, beyond every training house, degree 5 predicts thousands of ₹ lakh while degree 2 stays near the real pattern.</>,
};
