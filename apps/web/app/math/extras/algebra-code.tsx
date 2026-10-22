"use client";
import type { CodeLabConfig } from "../../algorithms/linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "./helpers";

/* 1 · variables */
export const VAR_STARTER = `book = 120       # ₹ for the book
price = 35       # ₹ per notebook
total = 330      # the bill

def bill(n):
    return 0.0   # TODO 1: what does a bill with n notebooks cost?  (book + price × n)

def solve(price, book, total):
    return 0.0   # TODO 2: undo the bill: subtract the book, then divide by the price

n = solve(price, book, total)
print(f"{n} notebooks")
print(f"check: bill({n}) = {bill(n)}  (target {total})")
`;
export const VAR_SOLUTION = swap(VAR_STARTER, [
  ["    return 0.0   # TODO 1: what does a bill with n notebooks cost?  (book + price × n)", "    return book + price * n"],
  ["    return 0.0   # TODO 2: undo the bill: subtract the book, then divide by the price", "    return (total - book) / price"],
]);
export const VAR_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "bill(6) = 330", "passed": _close(bill(6), 330.0), "hint": "bill(6) returned %r. The bill is the fixed book price plus price × n." % (bill(6),)})
    results.append({"name": "solve(35, 120, 330) = 6", "passed": _close(solve(35, 120, 330), 6.0), "hint": "solve returned %r. Undo in reverse: (total − book) first, then ÷ price." % (solve(35, 120, 330),)})
    results.append({"name": "solve works for another rule: 2x + 3 = 11 gives x = 4", "passed": _close(solve(2, 3, 11), 4.0), "hint": "solve(price=2, book=3, total=11) returned %r; it should be 4. Don't hard-code 120 or 35." % (solve(2, 3, 11),)})
    results.append({"name": "The answer checks out: bill(n) equals the total", "passed": _close(bill(n), total), "hint": "bill(n) is %r but the total is %r." % (bill(n), total)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const VAR_CODE: CodeLabConfig = {
  id: "algvarcode", title: "Turn the story into two functions", intro: <p>An equation records a story; Python can both <em>run</em> the story forward (<code>bill</code>) and <em>undo</em> it backward (<code>solve</code>).</p>,
  bridge: [{ math: "120 + 35n", code: "book + price * n", note: "The bill for n notebooks." }, { math: "n = (330 − 120) ÷ 35", code: "(total - book) / price", note: "Undo the addition, then the multiplication." }],
  cell: { title: "bill() and solve()", starter: VAR_STARTER, solution: VAR_SOLUTION, checks: VAR_CHECKS, expose: ["n"], presets: [preset("A different bill: ₹400", "How many notebooks now?", /^total = [^\s#]+/m, "total = 400")] },
  reflections: [{ question: <>Why subtract the book <em>before</em> dividing?</>, answer: <>The bill was built by multiplying first and adding second, so we undo it in reverse: remove the added ₹120, then undo the ×35. Dividing first would split the book price too.</> }, { question: <>Try a bill of ₹400. Is the answer a sensible number of notebooks?</>, answer: <>It gives 8, which fits. Try ₹250: you get a fraction of a notebook. The equation is solved, but the story says counts must be whole numbers, so check the answer against the situation.</> }],
  footer: <>Both solutions agree with the lesson: 6 notebooks, and 120 + 35 × 6 = 330.</>,
};

/* 2 · functions */
export const FN_STARTER = `def fare(d):
    """Delivery fare in ₹ for d km. The app serves 0 to 30 km only."""
    # TODO 1: raise ValueError("outside the domain") if d is below 0 or above 30
    # TODO 2: return the fare 2 × d + 3
    return 0.0

for d in (0, 2.5, 7):
    print(f"{d} km -> ₹{fare(d)}")
try:
    fare(-1)
except ValueError as err:
    print("-1 km ->", err)
`;
export const FN_SOLUTION = swap(FN_STARTER, [
  ["    # TODO 1: raise ValueError(\"outside the domain\") if d is below 0 or above 30\n    # TODO 2: return the fare 2 × d + 3\n    return 0.0", "    if d < 0 or d > 30:\n        raise ValueError(\"outside the domain\")\n    return 2 * d + 3"],
]);
export const FN_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "fare(2.5) = 8", "passed": _close(fare(2.5), 8.0), "hint": "fare(2.5) returned %r. The rule is 2 × d + 3." % (fare(2.5),)})
    results.append({"name": "fare(0) = 3: the starting fee", "passed": _close(fare(0), 3.0), "hint": "fare(0) returned %r. With zero distance only the fixed fee is left." % (fare(0),)})
    try:
        fare(-1); ok = False
    except ValueError:
        ok = True
    results.append({"name": "fare(−1) raises ValueError: outside the domain", "passed": ok, "hint": "A negative distance is not in the domain, so the function should raise ValueError, not return a number."})
    try:
        fare(31); ok2 = False
    except ValueError:
        ok2 = True
    results.append({"name": "fare(31) also raises ValueError", "passed": ok2, "hint": "The app serves up to 30 km, so 31 is outside the domain."})
    results.append({"name": "Each input gives one output: [1, 2, 3] -> [5, 7, 9]", "passed": [fare(d) for d in (1, 2, 3)] == [5, 7, 9], "hint": "Expected [5, 7, 9] from 2d + 3 at 1, 2, 3."})
except Exception as exc:
    results.append({"name": "Your function runs", "passed": False, "hint": str(exc)})
`;
export const FN_CODE: CodeLabConfig = {
  id: "algfncode", title: "Write a function with a domain", intro: <p>A Python <code>def</code> is a function in exactly the maths sense: one input in, one output out. The domain becomes a guard that refuses inputs the rule does not accept.</p>,
  bridge: [{ math: "f(d) = 2d + 3", code: "return 2 * d + 3", note: "The rule." }, { math: "domain: 0 ≤ d ≤ 30", code: "if d < 0 or d > 30: raise ValueError", note: "Refuse anything outside it." }],
  cell: { title: "fare(d) with a guarded domain", starter: FN_STARTER, solution: FN_SOLUTION, checks: FN_CHECKS, expose: [] },
  reflections: [{ question: <>Why raise an error instead of returning 0 for a bad distance?</>, answer: <>A 0 looks like a real quote. An error cannot be mistaken for an answer, which is how a function stays honest about what it does not cover.</> }],
  footer: <>These are the same fares as the playground: 2.5 km costs ₹8 and 0 km costs the ₹3 fee.</>,
};

/* 3 · graphs */
export const GR_STARTER = `# Two readings from the same line: (1, 5) and (3, 9)
p, q = (1.0, 5.0), (3.0, 9.0)

def slope(p, q):
    return 0.0   # TODO 1: change in output ÷ change in input

def intercept(p, a):
    return 0.0   # TODO 2: where the line meets x = 0, given a point p and the slope a

def x_for(y, a, b):
    return 0.0   # TODO 3: the input that gives output y, on the line y = a·x + b

a = slope(p, q)
b = intercept(p, a)
print(f"y = {a}x + {b}")
print("price 11 happens at x =", x_for(11, a, b))
`;
export const GR_SOLUTION = swap(GR_STARTER, [
  ["    return 0.0   # TODO 1: change in output ÷ change in input", "    return (q[1] - p[1]) / (q[0] - p[0])"],
  ["    return 0.0   # TODO 2: where the line meets x = 0, given a point p and the slope a", "    return p[1] - a * p[0]"],
  ["    return 0.0   # TODO 3: the input that gives output y, on the line y = a·x + b", "    return (y - b) / a"],
]);
export const GR_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "slope((1,5),(3,9)) = 2", "passed": _close(slope((1.0, 5.0), (3.0, 9.0)), 2.0), "hint": "slope returned %r. Rise ÷ run: (9 − 5) ÷ (3 − 1)." % (slope((1.0, 5.0), (3.0, 9.0)),)})
    results.append({"name": "intercept = 3: the starting value at x = 0", "passed": _close(intercept((1.0, 5.0), 2.0), 3.0), "hint": "intercept returned %r. Go back from the point to x = 0: y − slope × x." % (intercept((1.0, 5.0), 2.0),)})
    results.append({"name": "x_for(11, 2, 3) = 4", "passed": _close(x_for(11, 2, 3), 4.0), "hint": "x_for returned %r. Solve y = a·x + b for x: (y − b) ÷ a." % (x_for(11, 2, 3),)})
    results.append({"name": "A negative slope works too: line through (0, 10) and (5, 0)", "passed": _close(slope((0.0, 10.0), (5.0, 0.0)), -2.0), "hint": "Rise is −10 over a run of 5, so the slope is −2. Keep the signs."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const GR_CODE: CodeLabConfig = {
  id: "alggrcode", title: "Recover a line from two points", intro: <p>Given two readings, can you rebuild the rule? You will compute the slope, the intercept, and then run the line backward to find an input.</p>,
  bridge: [{ math: "a = Δy ÷ Δx", code: "(q[1] - p[1]) / (q[0] - p[0])", note: "Rise over run." }, { math: "b = y₁ − a·x₁", code: "p[1] - a * p[0]", note: "Walk back to x = 0." }, { math: "x = (y − b) ÷ a", code: "(y - b) / a", note: "Undo the line." }],
  cell: { title: "slope(), intercept(), x_for()", starter: GR_STARTER, solution: GR_SOLUTION, checks: GR_CHECKS, expose: ["a", "b"], presets: [preset("Different points", "(0, 10) and (5, 0)", /^p, q = .*/m, "p, q = (0.0, 10.0), (5.0, 0.0)")] },
  reflections: [{ question: <>What goes wrong if both points have the same x?</>, answer: <>Δx is 0, so you divide by zero. A vertical line has no single output for that input, so it is not a function of x.</> }],
  footer: <>The line is y = 2x + 3, the same rule as the fare machine, and a bill of 11 happens at x = 4.</>,
};

/* 4 · powers */
export const POW_STARTER = `def linear(d):
    return 10 + 10 * d      # Plan A adds 10 GB a day

def doubling(d):
    return 0.0              # TODO 1: Plan B starts at 10 GB and doubles every day

def crossover():
    # TODO 2: the first day when doubling is STRICTLY bigger than linear
    return -1

def compound(n):
    return 0.0              # TODO 3: (1 + 1/n) ** n, the growth of 100% interest split into n parts

print("day 5:", linear(5), "vs", doubling(5))
print("doubling first wins on day", crossover())
print("e is about", round(compound(1_000_000), 5))
`;
export const POW_SOLUTION = swap(POW_STARTER, [
  ["    return 0.0              # TODO 1: Plan B starts at 10 GB and doubles every day", "    return 10 * 2 ** d"],
  ["    # TODO 2: the first day when doubling is STRICTLY bigger than linear\n    return -1", "    d = 0\n    while doubling(d) <= linear(d):\n        d += 1\n    return d"],
  ["    return 0.0              # TODO 3: (1 + 1/n) ** n, the growth of 100% interest split into n parts", "    return (1 + 1 / n) ** n"],
]);
export const POW_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "doubling(5) = 320 and doubling(0) = 10", "passed": _close(doubling(5), 320.0) and _close(doubling(0), 10.0), "hint": "doubling(5) returned %r. Start at 10 and multiply by 2 once per day: 10 × 2**d." % (doubling(5),)})
    results.append({"name": "doubling first beats adding on day 2", "passed": crossover() == 2, "hint": "crossover returned %r. Day 0 and day 1 are ties (10 vs 10, 20 vs 20); day 2 is 40 vs 30." % (crossover(),)})
    results.append({"name": "compound(1) = 2 and compound(12) ≈ 2.613035", "passed": _close(compound(1), 2.0) and _close(compound(12), 2.613035, 1e-6), "hint": "compound(n) = (1 + 1/n) ** n. compound(1) should be 2; yours is %r." % (compound(1),)})
    results.append({"name": "compound(1,000,000) ≈ 2.71828: the number e", "passed": _close(compound(1_000_000), 2.7182804691, 1e-6), "hint": "As n grows, (1 + 1/n)**n settles near e ≈ 2.71828. You got %r." % (compound(1_000_000),)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const POW_CODE: CodeLabConfig = {
  id: "algpowcode", title: "Two kinds of growth, and the number e", intro: <p>Adding the same amount and multiplying by the same factor give very different futures. You will build both, find the day they separate, and watch <code>(1 + 1/n)ⁿ</code> settle on <em>e</em>.</p>,
  bridge: [{ math: "10 + 10d", code: "10 + 10 * d", note: "Linear: same amount each step." }, { math: "10 · 2ᵈ", code: "10 * 2 ** d", note: "Exponential: same factor each step." }, { math: "(1 + 1/n)ⁿ → e", code: "(1 + 1 / n) ** n", note: "Splitting growth into more and more parts." }],
  cell: { title: "linear(), doubling(), compound()", starter: POW_STARTER, solution: POW_SOLUTION, checks: POW_CHECKS, expose: [] },
  reflections: [{ question: <>On day 1 both plans are at 20 GB. Why is the winner so lopsided by day 10?</>, answer: <>Plan A is at 110 GB; Plan B is at 10,240 GB. Plan A adds the same 10 every day while Plan B&rsquo;s daily increase doubles each day. Early on that difference is invisible.</> }],
  footer: <>Day 10: 110 GB against 10,240 GB, and compound(1,000,000) ≈ 2.71828.</>,
};

/* 5 · logarithms */
export const LOG_STARTER = `import math

def doublings(target):
    return 0.0    # TODO 1: how many doublings of 1 reach target?  (the base-2 logarithm)

def log_base(x, base):
    return 0.0    # TODO 2: log of x in any base, using the natural log: ln(x) ÷ ln(base)

for t in (8, 1000, 1_000_000):
    print(f"{t:>9}: {doublings(t):.4f} doublings")
print("log10(1000) =", log_base(1000, 10))
`;
export const LOG_SOLUTION = swap(LOG_STARTER, [
  ["    return 0.0    # TODO 1: how many doublings of 1 reach target?  (the base-2 logarithm)", "    return math.log(target, 2)"],
  ["    return 0.0    # TODO 2: log of x in any base, using the natural log: ln(x) ÷ ln(base)", "    return math.log(x) / math.log(base)"],
]);
export const LOG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "doublings(8) = 3", "passed": _close(doublings(8), 3.0), "hint": "2 × 2 × 2 = 8, so 3 doublings. You returned %r. Use the base-2 logarithm." % (doublings(8),)})
    results.append({"name": "doublings(1000) ≈ 9.9658", "passed": _close(doublings(1000), 9.965784284662087, 1e-9), "hint": "1000 is a little under 2**10 = 1024, so just under 10 doublings. You returned %r." % (doublings(1000),)})
    results.append({"name": "doublings(1,000,000) ≈ 19.9316", "passed": _close(doublings(1000000), 19.931568569324174, 1e-9), "hint": "A million is a little under 2**20, so just under 20. You returned %r." % (doublings(1000000),)})
    results.append({"name": "log_base(1000, 10) = 3 (change of base)", "passed": _close(log_base(1000, 10), 3.0, 1e-9), "hint": "log_base(x, base) = ln(x) ÷ ln(base). You returned %r." % (log_base(1000, 10),)})
    results.append({"name": "A logarithm undoes a power: 2 ** doublings(37) = 37", "passed": _close(2 ** doublings(37), 37.0, 1e-9), "hint": "If doublings is the inverse of 2**x, then 2 ** doublings(t) must give back t."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const LOG_CODE: CodeLabConfig = {
  id: "alglogcode", title: "Ask the reverse question", intro: <p>A power answers &ldquo;what do I get after n doublings?&rdquo;. A logarithm answers &ldquo;how many doublings to reach this?&rdquo;. One line of Python each way, and the change-of-base rule lets you use any base.</p>,
  bridge: [{ math: "log₂(t)", code: "math.log(target, 2)", note: "How many doublings reach t." }, { math: "log_b(x) = ln x ÷ ln b", code: "math.log(x) / math.log(base)", note: "Any base from one natural log." }],
  cell: { title: "doublings() and log_base()", starter: LOG_STARTER, solution: LOG_SOLUTION, checks: LOG_CHECKS, expose: [] },
  reflections: [{ question: <>Why does a million need only about 20 doublings?</>, answer: <>Doubling is powerful: 2²⁰ = 1,048,576. A logarithm turns a huge ratio into a count of steps, which is why growth charts use a log scale.</> }],
  footer: <>1,000 needs 9.9658 doublings, one million needs 19.9316, and log₁₀(1000) = 3.</>,
};

/* 6 · transformations */
export const TR_STARTER = `def f(x): return x * x
def g(x): return 2 * x + 1

def compose(outer, inner):
    # TODO 1: return a NEW function that first applies inner, then outer
    return lambda x: x

def shifted(fn, h):
    # TODO 2: return fn slid RIGHT by h:  the new function at x equals fn(x − h)
    return fn

print("f(g(2)) =", compose(f, g)(2))
print("g(f(2)) =", compose(g, f)(2))
print("x² slid right by 3, at x = 5:", shifted(f, 3)(5))
`;
export const TR_SOLUTION = swap(TR_STARTER, [
  ["    # TODO 1: return a NEW function that first applies inner, then outer\n    return lambda x: x", "    return lambda x: outer(inner(x))"],
  ["    # TODO 2: return fn slid RIGHT by h:  the new function at x equals fn(x − h)\n    return fn", "    return lambda x: fn(x - h)"],
]);
export const TR_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "f(g(2)) = 25", "passed": _close(compose(f, g)(2), 25.0), "hint": "compose(f, g)(2) returned %r. First g(2) = 5, then f(5) = 25: apply the INNER function first." % (compose(f, g)(2),)})
    results.append({"name": "g(f(2)) = 9: the order matters", "passed": _close(compose(g, f)(2), 9.0), "hint": "compose(g, f)(2) returned %r. First f(2) = 4, then g(4) = 9." % (compose(g, f)(2),)})
    results.append({"name": "x² slid right by 3, at x = 5, is 4", "passed": _close(shifted(f, 3)(5), 4.0), "hint": "shifted(f, 3)(5) returned %r. Sliding RIGHT by 3 means feeding the old rule x − 3: f(2) = 4." % (shifted(f, 3)(5),)})
    results.append({"name": "The lowest point of the slid curve moves to x = 3", "passed": _close(shifted(f, 3)(3), 0.0) and shifted(f, 3)(2) > 0 and shifted(f, 3)(4) > 0, "hint": "After sliding right by 3, the bottom (value 0) should sit at x = 3."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const TR_CODE: CodeLabConfig = {
  id: "algtrcode", title: "Build transformations as functions", intro: <p>In Python a function is a value, so you can write functions that <em>return functions</em>. That makes composition and shifting one-liners.</p>,
  bridge: [{ math: "(f ∘ g)(x) = f(g(x))", code: "lambda x: outer(inner(x))", note: "Do g first, then f." }, { math: "f(x − h)", code: "lambda x: fn(x - h)", note: "Slides the graph right by h." }],
  cell: { title: "compose() and shifted()", starter: TR_STARTER, solution: TR_SOLUTION, checks: TR_CHECKS, expose: [] },
  reflections: [{ question: <>Why does f(x − 3) move the curve to the <em>right</em>?</>, answer: <>The curve's bottom used to be at x = 0. Now the bottom needs x − 3 = 0, which is x = 3. The input has to be 3 bigger to produce the same output, so the picture slides right.</> }],
  footer: <>f(g(2)) = 25 but g(f(2)) = 9; and x² slid right by 3 gives 4 at x = 5.</>,
};
