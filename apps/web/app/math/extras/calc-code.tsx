"use client";
import type { CodeLabConfig } from "../../learn/linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "./helpers";

/* 1 · secants → tangent */
export const SEC_STARTER = `def f(x):
    return x ** 2

def secant_slope(f, x, h):
    return 0.0   # TODO 1: average change over the gap: (f(x + h) - f(x)) / h

def tangent_slope(f, x):
    h = 1.0
    while h > 1e-6:
        h = h / 2        # shrink the gap; it never reaches zero
    return 0.0           # TODO 2: the secant slope at this tiny gap

for h in (1, 0.5, 0.1, 0.01):
    print(f"h = {h:<5} secant slope = {secant_slope(f, 2, h):.4f}")
print("tangent slope at x = 2:", round(tangent_slope(f, 2), 4))
`;
export const SEC_SOLUTION = swap(SEC_STARTER, [
  ["    return 0.0   # TODO 1: average change over the gap: (f(x + h) - f(x)) / h", "    return (f(x + h) - f(x)) / h"],
  ["    return 0.0           # TODO 2: the secant slope at this tiny gap", "    return secant_slope(f, x, h)"],
]);
export const SEC_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "secant_slope(f, 2, 1) = 5", "passed": _close(secant_slope(f, 2, 1), 5.0, 1e-9), "hint": "It returned %r. From x = 2 to x = 3, f goes 4 → 9: a rise of 5 over a run of 1." % (secant_slope(f, 2, 1),)})
    results.append({"name": "secant_slope(f, 2, 0.01) is about 4.01", "passed": _close(secant_slope(f, 2, 0.01), 4.01, 1e-6), "hint": "It returned %r. Divide the rise f(x+h) − f(x) by the run h." % (secant_slope(f, 2, 0.01),)})
    results.append({"name": "tangent_slope(f, 2) is about 4", "passed": abs(tangent_slope(f, 2) - 4.0) < 1e-4, "hint": "It returned %r. Use the secant slope at the final tiny h." % (tangent_slope(f, 2),)})
    results.append({"name": "It works for another curve: x³ at x = 1 gives about 3", "passed": abs(tangent_slope(lambda x: x ** 3, 1) - 3.0) < 1e-3, "hint": "tangent_slope(x**3, 1) returned %r; it should be close to 3. Do not hard-code the function." % (tangent_slope(lambda x: x ** 3, 1),)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const SEC_CODE: CodeLabConfig = {
  id: "calcseccode", title: "Watch the secant become the tangent in code", intro: <p>The gap <code>h</code> shrinks in a loop and the secant slope settles on a number. That number is the derivative, found by measuring, with no formula for it.</p>,
  bridge: [{ math: "[f(x+h) − f(x)] / h", code: "(f(x + h) - f(x)) / h", note: "Average change over a gap of h." }, { math: "h → 0", code: "while h > 1e-6: h = h / 2", note: "Shrink the gap towards, but never to, zero." }],
  cell: { title: "secant_slope() and tangent_slope()", starter: SEC_STARTER, solution: SEC_SOLUTION, checks: SEC_CHECKS, expose: [], presets: [preset("Look at x = 3 instead", "The tangent slope should now be about 6.", /secant_slope\(f, 2, h\)/, "secant_slope(f, 3, h)")] },
  reflections: [{ question: <>Why does the loop stop at <code>1e-6</code> rather than going all the way to 0?</>, answer: <>At exactly 0 the division is undefined, and extremely small gaps make the computer subtract nearly equal numbers and lose accuracy. The step-size lab on this page shows that effect.</> }],
  footer: <>For x² at x = 2 the secant slope is exactly 2x + h, so it lands on 4 as h shrinks.</>,
};

/* 2 · rules vs measurement */
export const RULE_STARTER = `import math

def numeric_derivative(f, x, h=1e-5):
    return 0.0   # TODO 1: central difference: (f(x + h) - f(x - h)) / (2 * h)

def g(x):
    return x ** 2 * math.exp(x)

def product_rule(x):
    return 0.0   # TODO 2: (f g)' = f' g + f g'   with f = x**2 and the second factor math.exp(x)

def tempting(x):
    return 2 * x * math.exp(x)   # differentiating each factor and multiplying: wrong

for x in (0.5, 1, 2):
    print(f"x={x}: measured {numeric_derivative(g, x):.4f}  rule {product_rule(x):.4f}  tempting {tempting(x):.4f}")
`;
export const RULE_SOLUTION = swap(RULE_STARTER, [
  ["    return 0.0   # TODO 1: central difference: (f(x + h) - f(x - h)) / (2 * h)", "    return (f(x + h) - f(x - h)) / (2 * h)"],
  ["    return 0.0   # TODO 2: (f g)' = f' g + f g'   with f = x**2 and the second factor math.exp(x)", "    return 2 * x * math.exp(x) + x ** 2 * math.exp(x)"],
]);
export const RULE_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "numeric_derivative of x³ at 2 is about 12", "passed": abs(numeric_derivative(lambda x: x ** 3, 2) - 12.0) < 1e-4, "hint": "It returned %r. Take f one step right minus f one step left, divided by 2h." % (numeric_derivative(lambda x: x ** 3, 2),)})
    results.append({"name": "product_rule(1) = 3e", "passed": abs(product_rule(1) - 3 * math.e) < 1e-9, "hint": "It returned %r. The rule is f'g + fg' = 2x·eˣ + x²·eˣ; at x = 1 that is 3e." % (product_rule(1),)})
    agree = all(abs(product_rule(x) - numeric_derivative(g, x)) < 1e-4 for x in (0.5, 1, 2, 3))
    results.append({"name": "The rule agrees with the measurement at several points", "passed": agree, "hint": "At x = 2 the rule gives %r but the measured slope is %r." % (product_rule(2), numeric_derivative(g, 2))})
    results.append({"name": "The tempting version does NOT agree (it misses half the change)", "passed": abs(tempting(2) - numeric_derivative(g, 2)) > 1.0 and abs(numeric_derivative(g, 2)) > 1.0, "hint": "numeric_derivative must work first; only then can the measurement expose the tempting answer."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const RULE_CODE: CodeLabConfig = {
  id: "calcrulecode", title: "Let a measurement referee the product rule", intro: <p>You will write the measuring tool and the rule, then see the tempting shortcut fail against a measurement that knows no rules.</p>,
  bridge: [{ math: "[f(x+h) − f(x−h)] / 2h", code: "(f(x + h) - f(x - h)) / (2 * h)", note: "Measure the slope with a step on each side." }, { math: "(fg)′ = f′g + fg′", code: "2*x*math.exp(x) + x**2*math.exp(x)", note: "Each factor takes a turn changing." }],
  cell: { title: "numeric_derivative() and product_rule()", starter: RULE_STARTER, solution: RULE_SOLUTION, checks: RULE_CHECKS, expose: [], presets: [preset("Compare at x = 3 as well", "The gap between the rule and the tempting answer grows.", /for x in \(0\.5, 1, 2\)/, "for x in (0.5, 1, 2, 3)")] },
  reflections: [{ question: <>The rule and the measurement agree to about 4 decimals. Should they agree exactly?</>, answer: <>No. The measurement uses a small step, so it carries a tiny error of its own. If the two differ by something visible, one of them is wrong; if they agree to a few decimals, you can trust the formula.</> }],
  footer: <>This is how gradient checking works in real machine learning libraries.</>,
};

/* 3 · step size */
export const STEP_STARTER = `import math

def numerical_derivative(f, x, h):
    return 0.0   # TODO 1: central difference: (f(x + h) - f(x - h)) / (2 * h)

def best_k(f, x):
    """Try h = 10**-k for k = 1..15 and return the k whose answer is closest to the true slope."""
    true = math.exp(x)       # the slope of exp is exp itself
    best, best_err = 1, float("inf")
    for k in range(1, 16):
        err = abs(numerical_derivative(f, x, 10 ** -k) - true)
        # TODO 2: if this error beats best_err, remember k and err
        pass
    return best

for k in (1, 5, 14):
    est = numerical_derivative(math.exp, 1, 10 ** -k)
    print(f"h = 1e-{k:<2} estimate {est:.8f}  error {abs(est - math.e):.1e}")
print("best k:", best_k(math.exp, 1))
`;
export const STEP_SOLUTION = swap(STEP_STARTER, [
  ["    return 0.0   # TODO 1: central difference: (f(x + h) - f(x - h)) / (2 * h)", "    return (f(x + h) - f(x - h)) / (2 * h)"],
  ["        # TODO 2: if this error beats best_err, remember k and err\n        pass", "        if err < best_err:\n            best, best_err = k, err"],
]);
export const STEP_CHECKS = CHECK_PRELUDE + `
try:
    e = math.e
    results.append({"name": "h = 1e-5 is accurate to about 10 digits", "passed": abs(numerical_derivative(math.exp, 1, 1e-5) - e) < 1e-8, "hint": "It returned %r. Use f(x + h) minus f(x − h), over 2h." % (numerical_derivative(math.exp, 1, 1e-5),)})
    results.append({"name": "h = 0.1 is visibly off (blurred), but not wildly", "passed": 1e-4 < abs(numerical_derivative(math.exp, 1, 0.1) - e) < 1e-1, "hint": "The central difference at h = 0.1 is off by about 0.005, not 0.14. The latter is the one-sided formula."})
    results.append({"name": "h = 1e-14 is worse than h = 1e-5 (digits are lost)", "passed": abs(numerical_derivative(math.exp, 1, 1e-14) - e) > 100 * abs(numerical_derivative(math.exp, 1, 1e-5) - e), "hint": "Once the central difference works, an extremely small h should lose accuracy, because two nearly equal numbers are subtracted."})
    k = best_k(math.exp, 1)
    results.append({"name": "The best step is neither big nor tiny: k between 4 and 7", "passed": 4 <= k <= 7, "hint": "best_k returned %r. Loop over k, and keep the k with the smallest error." % (k,)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const STEP_CODE: CodeLabConfig = {
  id: "calcstepcode", title: "Find the best step size yourself", intro: <p>Sweep the step size from 0.1 down to 10⁻¹⁵ and let the code find the valley the chart shows.</p>,
  bridge: [{ math: "h = 10⁻ᵏ", code: "10 ** -k", note: "A family of step sizes." }, { math: "argmin of the error", code: "if err < best_err: best = k", note: "Keep the best so far." }],
  cell: { title: "numerical_derivative() and best_k()", starter: STEP_STARTER, solution: STEP_SOLUTION, checks: STEP_CHECKS, expose: [], presets: [preset("Try x = 3", "The best k should stay in the same region.", /best_k\(math\.exp, 1\)/, "best_k(math.exp, 3)")] },
  reflections: [{ question: <>Why does a smaller step make the answer <em>worse</em> past a point?</>, answer: <>A computer stores about 16 digits. For tiny h, f(x+h) and f(x−h) agree in nearly all of them, so subtracting wipes out most of what is left, and the division by a tiny 2h magnifies the damage.</> }],
  footer: <>In practice, libraries use a step near 10⁻⁵ or 10⁻⁶ for exactly this reason.</>,
};

/* 4 · gradient check */
export const DBG_STARTER = `x, y = 2.0, 6.0

def loss(w):
    return (w * x - y) ** 2

def buggy_grad(w):
    return 2 * (w * x - y)      # the outer derivative only

def grad(w):
    return 0.0   # TODO 1: chain rule: 2(w x - y) times the inner derivative

def numeric_grad(w, h=1e-5):
    return 0.0   # TODO 2: central difference of loss at w

def gradient_check(g, w, tol=1e-4):
    return abs(g(w) - numeric_grad(w)) < tol

for w in (0.0, 2.0, 5.0):
    print(f"w={w}: numeric {numeric_grad(w):8.3f}  buggy {buggy_grad(w):8.3f}  fixed {grad(w):8.3f}")
`;
export const DBG_SOLUTION = swap(DBG_STARTER, [
  ["    return 0.0   # TODO 1: chain rule: 2(w x - y) times the inner derivative", "    return 2 * (w * x - y) * x"],
  ["    return 0.0   # TODO 2: central difference of loss at w", "    return (loss(w + h) - loss(w - h)) / (2 * h)"],
]);
export const DBG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "grad(2) = −8", "passed": _close(grad(2.0), -8.0), "hint": "It returned %r. At w = 2: 2(2·2 − 6) = −4, then multiply by the inner derivative x = 2." % (grad(2.0),)})
    results.append({"name": "numeric_grad(2) is about −8", "passed": abs(numeric_grad(2.0) + 8.0) < 1e-4, "hint": "It returned %r. Central difference: (loss(w + h) − loss(w − h)) / (2h)." % (numeric_grad(2.0),)})
    results.append({"name": "The fixed gradient passes the check at several weights", "passed": all(gradient_check(grad, w) for w in (0.0, 1.0, 2.0, 5.0)), "hint": "gradient_check(grad, w) failed for some w. Compare grad(w) with numeric_grad(w) at w = 0, 1, 2 and 5."})
    results.append({"name": "The buggy gradient fails the check at w = 2", "passed": (not gradient_check(buggy_grad, 2.0)) and abs(numeric_grad(2.0)) > 1.0, "hint": "numeric_grad must work first. Then buggy_grad(2) = −4 will visibly disagree with the measured −8."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const DBG_CODE: CodeLabConfig = {
  id: "calcdbgcode", title: "Catch the chain-rule bug with a gradient check", intro: <p>Write the correct gradient and the measuring tool, then let <code>gradient_check</code> accuse the buggy formula.</p>,
  bridge: [{ math: "dL/dw = 2(wx − y) · x", code: "2 * (w * x - y) * x", note: "Outer derivative times inner derivative." }, { math: "[L(w+h) − L(w−h)] / 2h", code: "(loss(w + h) - loss(w - h)) / (2 * h)", note: "The referee: no rules needed." }],
  cell: { title: "grad(), numeric_grad() and gradient_check()", starter: DBG_STARTER, solution: DBG_SOLUTION, checks: DBG_CHECKS, expose: [], presets: [preset("Make the input 1", "The bug hides when x = 1.", /^x, y = 2\.0, 6\.0/m, "x, y = 1.0, 6.0")] },
  reflections: [{ question: <>With <code>x = 1</code> the buggy gradient would pass the check. What does that tell you about testing?</>, answer: <>One input can hide a bug. Check several inputs, including ones where the missing factor is not 1, because a formula can be wrong yet agree at a convenient point.</> }],
  footer: <>Deep learning frameworks ship this exact idea as a gradient-check utility.</>,
};
