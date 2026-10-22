"use client";
import type { CodeLabConfig } from "../../algorithms/linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "./helpers";

/* ── Lesson 2: updates ── */
export const UPDATES_STARTER = `# Minimise  L(w) = (w − 3)²   (its slope is 2 × (w − 3))
w0 = 1.0       # where we start
lr = 0.1       # learning rate: the size of each step
steps = 1      # how many steps to take

def slope(w):
    return 0.0    # TODO 1: the slope of (w − 3)² at w

def update(w, lr):
    return w      # TODO 2: one step downhill (move against the slope, scaled by lr)

path = [w0]
for _ in range(steps):
    path.append(update(path[-1], lr))

print("w after each step:", [round(w, 4) for w in path])
print(f"loss: {(w0 - 3) ** 2:.4f} -> {(path[-1] - 3) ** 2:.4f}")
`;
export const UPDATES_SOLUTION = swap(UPDATES_STARTER, [
  ["    return 0.0    # TODO 1: the slope of (w − 3)² at w", "    return 2 * (w - 3)    # derivative of (w − 3)²"],
  ["    return w      # TODO 2: one step downhill (move against the slope, scaled by lr)", "    return w - lr * slope(w)    # w ← w − lr × slope"],
]);
export const UPDATES_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "slope(1) is −4", "passed": _close(slope(1.0), -4.0), "hint": "slope(1.0) returned %r. The slope of (w − 3)² is 2 × (w − 3); at w = 1 that is −4." % (slope(1.0),)})
    results.append({"name": "update(1, 0.1) is 1.4: one small step uphill in w", "passed": _close(update(1.0, 0.1), 1.4), "hint": "update(1, 0.1) returned %r. New w = old w − lr × slope. The slope is negative here, so w goes UP." % (update(1.0, 0.1),)})
    k = 5; w = 1.0
    for _ in range(k): w = update(w, 0.1)
    results.append({"name": "After 5 steps at rate 0.1, w ≈ 2.3446", "passed": _close(w, 3 + (1 - 0.2) ** 5 * (1.0 - 3)), "hint": "Each step should shrink the distance to 3 by a factor of 1 − 2 × lr = 0.8. After 5 steps w = 3 − 2 × 0.8⁵ ≈ 2.3446; yours is %r." % (w,)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const UPDATES_PRESETS = [preset("Rate 0.5: one jump to the bottom", "Lands exactly on 3", /^lr = [^\s#]+/m, "lr = 0.5"), preset("Rate 0.01: tiny steps", "Slow but safe", /^lr = [^\s#]+/m, "lr = 0.01"), preset("Take 5 steps", "Watch it settle", /^steps = [^\s#]+/m, "steps = 5")];
export const UPDATES_CODE: CodeLabConfig = {
  id: "updcode", title: "Write the update rule", intro: <p>The playground ran the rule for you. Now write it: a slope function and a one-line update. The rest of the cell takes the steps and prints them.</p>,
  bridge: [{ math: "L′(w) = 2(w − 3)", code: "2 * (w - 3)", note: "Slope of the loss at w." }, { math: "w ← w − η·L′(w)", code: "w - lr * slope(w)", note: "Step against the slope, scaled by the learning rate η." }],
  cell: { title: "One gradient step, then many", starter: UPDATES_STARTER, solution: UPDATES_SOLUTION, checks: UPDATES_CHECKS, expose: ["path"], presets: UPDATES_PRESETS },
  reflections: [
    { question: <>Why does a rate of 0.5 land exactly on 3 in one step?</>, answer: <>The slope at w is 2(w − 3), so the step is 0.5 × 2(w − 3) = (w − 3): the whole distance. Each step multiplies the distance to 3 by 1 − 2·lr, which is 0 here.</> },
    { question: <>At rate 0.1 the loss goes from 4 to 2.56 in one step. Is that a lot?</>, answer: <>It is 36% lower. Every later step multiplies the loss by 0.64, so after ten steps it is about 0.04.</> },
  ],
  footer: <>Start w = 1, rate 0.1: slope −4, new w 1.4, new loss 2.56, the numbers in the reading above.</>,
};

/* ── Lesson 3: geometry ── */
export const GEOMETRY_STARTER = `# L(a, b) = (a − 3)² + k·b²   (steep in b when k is large)
k = 10.0
lr = 0.05

def step(a, b, k, lr):
    # TODO 1: one gradient step on BOTH coordinates. dL/da = 2(a − 3), dL/db = 2·k·b
    return a, b

def safe_step(k):
    # TODO 2: the largest learning rate for which b still shrinks each step
    return 1.0

a, b = 1.0, 1.0
for i in range(6):
    a, b = step(a, b, k, lr)
    print(f"step {i + 1}: a = {a:.3f}, b = {b:.3f}")
print("largest safe step for this k:", safe_step(k))
`;
export const GEOMETRY_SOLUTION = swap(GEOMETRY_STARTER, [
  ["    # TODO 1: one gradient step on BOTH coordinates. dL/da = 2(a − 3), dL/db = 2·k·b\n    return a, b", "    da, db = 2 * (a - 3), 2 * k * b    # both slopes, from the SAME starting point\n    return a - lr * da, b - lr * db"],
  ["    # TODO 2: the largest learning rate for which b still shrinks each step\n    return 1.0", "    return 1 / max(1.0, k)    # b is multiplied by 1 − 2·k·lr, which needs |.| < 1"],
]);
export const GEOMETRY_CHECKS = CHECK_PRELUDE + `
try:
    r = step(1.0, 1.0, 10.0, 0.05)
    results.append({"name": "step(1, 1, k=10, lr=0.05) is (1.2, 0.0)", "passed": _close(r[0], 1.2) and _close(r[1], 0.0, 1e-9), "hint": "You returned %r. da = 2(a−3) = −4 so a goes 1 → 1.2; db = 2·k·b = 20 so b goes 1 − 0.05×20 = 0." % (r,)})
    r2 = step(1.0, 1.0, 10.0, 0.1)
    results.append({"name": "At lr = 0.1 the b coordinate flips sign (b = −1): the edge of stability", "passed": _close(r2[1], -1.0), "hint": "step(1, 1, 10, 0.1) should give b = 1 − 0.1×20 = −1. You got %r." % (r2,)})
    results.append({"name": "safe_step(10) = 0.1 and safe_step(1) = 1", "passed": _close(safe_step(10.0), 0.1) and _close(safe_step(1.0), 1.0), "hint": "b is multiplied by (1 − 2·k·lr) each step. It shrinks while |1 − 2·k·lr| < 1, i.e. lr < 1/k (this lesson's safe limit uses 1/k as the boundary)."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const GEOMETRY_PRESETS = [preset("k = 1: a round bowl", "Same step suits both", /^k = [^\s#]+/m, "k = 1.0"), preset("k = 40: a very narrow bowl", "A tiny safe step", /^k = [^\s#]+/m, "k = 40.0"), preset("lr = 0.12: too big for k = 10", "b overshoots and grows", /^lr = [^\s#]+/m, "lr = 0.12")];
export const GEOMETRY_CODE: CodeLabConfig = {
  id: "geocode", title: "Step both coordinates, then find the safe step", intro: <p>A step has to use <em>both</em> slopes measured at the same starting point. Then you will work out the biggest step the steep direction can take.</p>,
  bridge: [{ math: "∂L/∂a = 2(a − 3)", code: "2 * (a - 3)", note: "Gentle direction." }, { math: "∂L/∂b = 2·k·b", code: "2 * k * b", note: "Steep direction when k is large." }, { math: "b ← (1 − 2·k·η)·b", code: "b - lr * 2 * k * b", note: "b shrinks only if |1 − 2kη| < 1." }],
  cell: { title: "Gradient step on a narrow bowl", starter: GEOMETRY_STARTER, solution: GEOMETRY_SOLUTION, checks: GEOMETRY_CHECKS, expose: ["a", "b", "k", "lr"], presets: GEOMETRY_PRESETS },
  reflections: [{ question: <>With k = 10 and rate 0.05, b reaches exactly 0 in one step. Why does a still crawl?</>, answer: <>a is multiplied by 1 − 2η = 0.9 each step, so it only closes 10% of its distance to 3. One step size, two different speeds: that is why scaling features helps.</> }],
  footer: <>For k = 10 the gradient at (1, 1) is (−4, 20), exactly the numbers in the lesson.</>,
};

/* ── Lesson 4: stability ── */
export const STABILITY_STARTER = `# L(w) = (w − 3)²,  start w = 1.  Each step multiplies the distance to 3 by (1 − 2·lr).
def run(w0, lr, steps):
    path = [w0]
    for _ in range(steps):
        pass    # TODO 1: append the next w (move against the slope 2 * (w − 3))
    return path

def behaviour(lr):
    # TODO 2: return "converging", "oscillating" or "diverging" from |1 − 2·lr|
    return "converging"

for lr in (0.1, 1.0, 1.1):
    p = run(1.0, lr, 4)
    print(f"lr = {lr}: {[round(w, 2) for w in p]}  ->  {behaviour(lr)}")
`;
export const STABILITY_SOLUTION = swap(STABILITY_STARTER, [
  ["        pass    # TODO 1: append the next w (move against the slope 2 * (w − 3))", "        w = path[-1]\n        path.append(w - lr * 2 * (w - 3))"],
  ["    # TODO 2: return \"converging\", \"oscillating\" or \"diverging\" from |1 − 2·lr|\n    return \"converging\"", "    r = abs(1 - 2 * lr)\n    if r < 1 - 1e-9: return \"converging\"\n    if r > 1 + 1e-9: return \"diverging\"\n    return \"oscillating\""],
]);
export const STABILITY_CHECKS = CHECK_PRELUDE + `
try:
    p = run(1.0, 1.0, 4)
    results.append({"name": "At lr = 1 the path bounces: 1, 5, 1, 5, 1", "passed": len(p) == 5 and all(_close(a, b) for a, b in zip(p, [1, 5, 1, 5, 1])), "hint": "run(1, 1, 4) returned %r. Each new w = w − lr × 2(w − 3), using the PREVIOUS w." % (p,)})
    q = run(1.0, 1.1, 3)
    results.append({"name": "At lr = 1.1 the path swings wider each time: 1, 5.4, 0.12, 6.456", "passed": len(q) == 4 and _close(q[1], 5.4) and _close(q[2], 0.12), "hint": "run(1, 1.1, 3) returned %r. First step: 1 − 1.1 × 2 × (1 − 3) = 5.4; second: 5.4 − 1.1 × 2 × (5.4 − 3) = 0.12." % (q,)})
    results.append({"name": "Behaviour labels", "passed": behaviour(0.1) == "converging" and behaviour(1.0) == "oscillating" and behaviour(1.1) == "diverging", "hint": "Ratio r = |1 − 2·lr|: below 1 converging, exactly 1 oscillating, above 1 diverging. Got %r, %r, %r for 0.1, 1, 1.1." % (behaviour(0.1), behaviour(1.0), behaviour(1.1))})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const STABILITY_PRESETS = [preset("Add more steps", "Four steps are a short history", /range\(steps\)/, "range(steps)")];
export const STABILITY_CODE: CodeLabConfig = {
  id: "stabcode", title: "Classify a training run", intro: <p>A few steps can look fine and still hide trouble. Build the run, then write the rule that says what it will do <em>forever</em>, which a short history alone cannot prove.</p>,
  bridge: [{ math: "wₖ₊₁ − 3 = (1 − 2η)(wₖ − 3)", code: "w - lr * 2 * (w - 3)", note: "Each step multiplies the distance to 3 by the same number." }, { math: "|1 − 2η| < 1", code: "abs(1 - 2 * lr) < 1", note: "Shrinks: converging." }],
  cell: { title: "run() and behaviour()", starter: STABILITY_STARTER, solution: STABILITY_SOLUTION, checks: STABILITY_CHECKS, expose: [] },
  reflections: [{ question: <>At rate 1 the loss stays at 4 forever. Did training fail?</>, answer: <>It made no progress, but nothing blew up: the path bounces between 1 and 5. Read the whole history, not only the last number.</> }],
  footer: <>Rate 1.1 sends w from 1 to 5.4 and the loss from 4 to 5.76. Its distance from 3 grows 2, 2.4, 2.88, 3.46: it swings wider each time.</>,
};

/* ── Lesson 5: regularization ── */
export const REG_STARTER = `areas  = [1.0, 1.8, 2.5, 3.2, 4.0, 4.8]
prices = [178, 213, 246, 278, 316, 349]
lam = 0.3          # penalty strength λ

m = len(areas)
x_mean = sum(areas) / m
y_mean = sum(prices) / m
sxx = 0.0          # TODO 1: Σ(x − x̄)²
sxy = 0.0          # TODO 2: Σ(x − x̄)(y − ȳ)

def slope(lam):
    return 0.0     # TODO 3: sxy / (sxx + m × λ). The penalty λ·w² shrinks the slope.

w = slope(lam)
b = y_mean - w * x_mean
mse = sum((w * x + b - y) ** 2 for x, y in zip(areas, prices)) / m
print(f"λ = {lam}: slope {w:.3f}, misses (MSE) {mse:.1f}, penalty {lam * w * w:.1f}")
`;
export const REG_SOLUTION = swap(REG_STARTER, [
  ["sxx = 0.0          # TODO 1: Σ(x − x̄)²", "sxx = sum((x - x_mean) ** 2 for x in areas)"],
  ["sxy = 0.0          # TODO 2: Σ(x − x̄)(y − ȳ)", "sxy = sum((x - x_mean) * (y - y_mean) for x, y in zip(areas, prices))"],
  ["    return 0.0     # TODO 3: sxy / (sxx + m × λ). The penalty λ·w² shrinks the slope.", "    return sxy / (sxx + m * lam)"],
]);
export const REG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "slope(0) = 45.461: no penalty gives plain least squares", "passed": _close(slope(0.0), 45.46098095398618, 1e-9), "hint": "slope(0) returned %r. With λ = 0 the formula is sxy / sxx, the ordinary best-fit slope (≈ 45.461)." % (slope(0.0),)})
    results.append({"name": "slope(1) = 28.293: a penalty shrinks the slope", "passed": _close(slope(1.0), 28.29345, 1e-4), "hint": "slope(1) returned %r. sxy / (sxx + m × λ) with m = 6." % (slope(1.0),)})
    s = [slope(l) for l in (0.0, 0.5, 1.0, 2.0, 5.0)]
    results.append({"name": "A bigger penalty always means a smaller slope", "passed": all(a > b for a, b in zip(s, s[1:])), "hint": "Slopes for λ = 0, 0.5, 1, 2, 5 were %r; they should strictly fall." % ([round(v, 3) for v in s],)})
    results.append({"name": "sxx ≈ 9.888 and sxy ≈ 449.53", "passed": _close(sxx, 9.888333333333332, 1e-9) and _close(sxy, 449.5333333333333, 1e-9), "hint": "sxx and sxy are sums of squared and cross deviations from the means. You have sxx = %r, sxy = %r." % (sxx, sxy)})
except Exception as exc:
    results.append({"name": "Your code runs", "passed": False, "hint": str(exc)})
`;
export const REG_PRESETS = [preset("λ = 0: no penalty", "Plain best fit", /^lam = [^\s#]+/m, "lam = 0.0"), preset("λ = 1", "Slope falls to about 28", /^lam = [^\s#]+/m, "lam = 1.0"), preset("λ = 3: heavy penalty", "A much flatter line", /^lam = [^\s#]+/m, "lam = 3.0")];
export const REG_CODE: CodeLabConfig = {
  id: "regcode", title: "Shrink a slope with a penalty", intro: <p>With a penalty <code>λ·w²</code> added to the squared misses, the best slope has a simple closed form. You build it from the sums you already know.</p>,
  bridge: [{ math: "Sxx = Σ(xᵢ − x̄)²", code: "sum((x - x_mean) ** 2 ...)", note: "How spread out the inputs are." }, { math: "Sxy = Σ(xᵢ − x̄)(yᵢ − ȳ)", code: "sum((x - x_mean) * (y - y_mean) ...)", note: "How x and y move together." }, { math: "w = Sxy / (Sxx + m·λ)", code: "sxy / (sxx + m * lam)", note: "The penalty adds m·λ to the denominator, so w shrinks." }],
  cell: { title: "Ridge slope from scratch", starter: REG_STARTER, solution: REG_SOLUTION, checks: REG_CHECKS, expose: ["w", "b", "mse", "lam"], presets: REG_PRESETS },
  reflections: [{ question: <>The misses (MSE) get worse as λ grows. Why would anyone accept that?</>, answer: <>A flatter line is less sensitive to noise in the data. You trade a little fit on the houses you have for steadier predictions on houses you have not seen, but only validation can tell you whether the trade paid off.</> }],
  footer: <>Slope 45.46 at λ = 0 and 28.29 at λ = 1. Misses rise from 1.2 to 486.9 while the penalty is 800.5.</>,
};

/* ── Lesson 6: honest evaluation ── */
export const RESP_STARTER = `train_x = [0, 0.2, 0.4, 0.6, 0.8, 1.0];  train_y = [1.0, 1.6, 1.3, 2.3, 2.2, 3.1]
val_x   = [0.1, 0.3, 0.5, 0.7, 0.9];       val_y   = [1.3, 1.6, 1.9, 2.4, 2.9]

# Coefficients [c0, c1, c2, …] of polynomials fitted to the TRAINING points only.
fits = {
    1: [0.966667, 1.9],
    3: [1.039683, 2.332011, -2.96627, 2.662037],
    5: [1.0, 23.766667, -186.25, 521.354167, -593.75, 236.979167],
}

def predict(coeffs, x):
    return 0.0    # TODO 1: c0 + c1·x + c2·x² + …

def mse(coeffs, xs, ys):
    return 0.0    # TODO 2: average squared miss of predict(coeffs, x) against y

def best_degree():
    # TODO 3: the degree whose HELD-BACK error is smallest
    return 5

for d, c in fits.items():
    print(f"degree {d}: training {mse(c, train_x, train_y):.4f}, held back {mse(c, val_x, val_y):.4f}")
print("validation prefers degree", best_degree())
`;
export const RESP_SOLUTION = swap(RESP_STARTER, [
  ["    return 0.0    # TODO 1: c0 + c1·x + c2·x² + …", "    return sum(c * x ** i for i, c in enumerate(coeffs))"],
  ["    return 0.0    # TODO 2: average squared miss of predict(coeffs, x) against y", "    return sum((predict(coeffs, x) - y) ** 2 for x, y in zip(xs, ys)) / len(xs)"],
  ["    # TODO 3: the degree whose HELD-BACK error is smallest\n    return 5", "    return min(fits, key=lambda d: mse(fits[d], val_x, val_y))"],
]);
export const RESP_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "predict() evaluates a polynomial: [1, 2] at x = 3 is 7", "passed": _close(predict([1.0, 2.0], 3.0), 7.0), "hint": "predict([1, 2], 3) returned %r. Add c × x**i for each coefficient c at position i." % (predict([1.0, 2.0], 3.0),)})
    t5 = mse(fits[5], train_x, train_y); v5 = mse(fits[5], val_x, val_y); t1 = mse(fits[1], train_x, train_y); v1 = mse(fits[1], val_x, val_y)
    results.append({"name": "Degree 5 fits the training data almost perfectly (error ≈ 0)", "passed": t5 < 1e-6, "hint": "Training error for degree 5 should be ~0 (it passes through all six points). You got %r." % (t5,)})
    results.append({"name": "Degree 1: training 0.0702, held back 0.0171", "passed": _close(t1, 0.0702, 1e-3) and _close(v1, 0.0171, 1e-2), "hint": "Degree 1 should give training %r and held-back %r." % (0.0702, 0.0171)})
    results.append({"name": "Degree 5 is far worse on held-back data (≈ 0.299)", "passed": _close(v5, 0.2992, 1e-3), "hint": "Held-back error for degree 5 should be ≈ 0.2992; you got %r." % (v5,)})
    results.append({"name": "Validation prefers degree 1", "passed": best_degree() == 1, "hint": "Pick the degree with the smallest HELD-BACK error, not training error. You returned %r." % (best_degree(),)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const RESP_PRESETS = [preset("Add degree 2", "A mild curve", /5: \[1\.0, 23\.766667/, "2: [1.103571, 0.873214, 1.026786],\n    5: [1.0, 23.766667")];
export const RESP_CODE: CodeLabConfig = {
  id: "respcode", title: "Let the held-back data choose", intro: <p>Fitting the training data is the easy part; the honest question is how a model does on data it has never seen. You will score three fitted curves both ways and let the held-back points decide.</p>,
  bridge: [{ math: "ŷ = c₀ + c₁x + c₂x² + …", code: "sum(c * x ** i for i, c in enumerate(coeffs))", note: "A polynomial is a weighted sum of powers." }, { math: "MSE = (1/n) Σ (ŷ − y)²", code: "sum((...) ** 2 ...) / len(xs)", note: "Average squared miss." }, { math: "argmin over degrees of MSE_val", code: "min(fits, key=...)", note: "Choose by held-back error." }],
  cell: { title: "Training error versus held-back error", starter: RESP_STARTER, solution: RESP_SOLUTION, checks: RESP_CHECKS, expose: [], presets: RESP_PRESETS },
  reflections: [{ question: <>If degree 5 is perfect on training, why is it a worse model?</>, answer: <>It memorised the six points, including their noise. On the five held-back points its error is about 17 times larger than the straight line&rsquo;s (0.299 vs 0.017).</> }, { question: <>Is the held-back error a guarantee for future data?</>, answer: <>No. Five points is a tiny sample, so treat it as evidence, not proof. And once you choose a model using the held-back points, they are no longer a fair test: keep a final test set untouched.</> }],
  footer: <>Training error falls from 0.0702 (degree 1) to 0 (degree 5) while held-back error rises from 0.0171 to 0.2992.</>,
};
