"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";

/* KN01 · vote among neighbors, written from scratch in core Python */
export const VOTE_STARTER = `# Past customers: (monthly bill in ₹ hundreds, support contacts, churned? 1 = yes)
customers = [(3, 1, 0), (4, 0, 0), (5, 1, 0), (3, 2, 0), (6, 2, 0), (4, 1, 0), (8, 4, 1),
             (9, 3, 1), (10, 5, 1), (7, 5, 1), (8, 3, 1), (6, 4, 1), (5, 3, 0), (7, 2, 1)]
query = (7.5, 0)   # the new customer
k = 3

def distance(a, b):
    return 0.0   # TODO 1: straight-line distance between a = (x1, y1) and b = (x2, y2)

def predict(query, k):
    ranked = sorted(customers, key=lambda c: distance((c[0], c[1]), query))
    nearest = ranked[:k]
    churned = 0   # TODO 2: how many of the k nearest customers churned? (their third value is 1)
    return 1 if churned * 2 > k else 0

print("prediction for", query, "with k =", k, "->", "churns" if predict(query, k) else "stays")
`;
export const VOTE_SOLUTION = swap(VOTE_STARTER, [
  ["    return 0.0   # TODO 1: straight-line distance between a = (x1, y1) and b = (x2, y2)", "    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5"],
  ["    churned = 0   # TODO 2: how many of the k nearest customers churned? (their third value is 1)", "    churned = sum(c[2] for c in nearest)"],
]);
export const VOTE_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "distance((0, 0), (3, 4)) = 5", "passed": _close(distance((0, 0), (3, 4)), 5.0), "hint": "distance returned %r. Square each gap, add, then take the square root." % (distance((0, 0), (3, 4)),)})
    results.append({"name": "k = 3 at (7.5, 0): two of three neighbors stayed", "passed": predict((7.5, 0), 3) == 0, "hint": "predict((7.5, 0), 3) returned %r; only one of the three nearest customers churned, so it should be 0." % (predict((7.5, 0), 3),)})
    results.append({"name": "k = 1 at (7.5, 0): the single nearest customer churned", "passed": predict((7.5, 0), 1) == 1, "hint": "predict((7.5, 0), 1) returned %r; the nearest customer churned, so it should be 1." % (predict((7.5, 0), 1),)})
    results.append({"name": "A clear stayer at (4, 1) is predicted to stay", "passed": predict((4, 1), 3) == 0, "hint": "predict((4, 1), 3) returned %r. Count only the k nearest, not all customers." % (predict((4, 1), 3),)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const VOTE_CODE: CodeLabConfig = {
  id: "knnvotecode", title: "Write the neighbor vote yourself", intro: <p>K-nearest neighbors has no formula to fit. It stores the customers, measures distance, and counts. Two small functions are the whole algorithm.</p>,
  bridge: [{ math: "d = √((x₁−x₂)² + (y₁−y₂)²)", code: "((a[0]-b[0])**2 + (a[1]-b[1])**2) ** 0.5", note: "Straight-line distance between two customers." }, { math: "predict 1 if more than k/2 of the k nearest have label 1", code: "churned * 2 > k", note: "A majority vote among the k nearest." }],
  cell: { title: "distance() and predict()", starter: VOTE_STARTER, solution: VOTE_SOLUTION, checks: VOTE_CHECKS, expose: ["k"], presets: [preset("Ask only 1 neighbor", "Does a single neighbor change the verdict?", /^k = \d+/m, "k = 1"), preset("Ask 7 neighbors", "More voters, farther away.", /^k = \d+/m, "k = 7")] },
  reflections: [{ question: <>Why must <code>k</code> be odd for two classes?</>, answer: <>With an even k the vote can tie, for example 2 against 2. An odd k always has a majority, so the rule never has to guess.</> }],
  footer: <>At (7.5, 0) with k = 3, customers N, E and C vote: churn, stay, stay, so the prediction is stay. With k = 1 only N votes, so it flips to churn. The answer depends on how many neighbors you ask.</>,
};

/* KN02 · scale defines closeness */
export const SCALE_STARTER = `ids      = list("ABCDEFGHIJKLMN")
bills    = [300, 400, 500, 300, 600, 400, 800, 900, 1000, 700, 800, 600, 500, 700]   # ₹ per month
contacts = [1, 0, 1, 2, 2, 1, 4, 3, 5, 5, 3, 4, 3, 2]                                 # support contacts

def mean(values):
    return 0.0   # TODO 1: the average of the list

def std(values):
    return 1.0   # TODO 2: population standard deviation: the square root of the average squared gap from the mean

def z(value, values):
    return (value - mean(values)) / std(values)   # how many standard deviations from the training average

def nearest(points, query, k=3):
    ranked = sorted(range(len(points)), key=lambda i: ((points[i][0] - query[0]) ** 2 + (points[i][1] - query[1]) ** 2) ** 0.5)
    return [ids[i] for i in ranked[:k]]

query = (450, 5)   # ₹450 a month, 5 support contacts
raw_points = list(zip(bills, contacts))
raw_ids = nearest(raw_points, query)

scaled_points = [(z(b, bills), z(c, contacts)) for b, c in raw_points]
scaled_query = (z(query[0], bills), z(query[1], contacts))
scaled_ids = nearest(scaled_points, scaled_query)

print("raw neighbors:   ", raw_ids)
print("scaled neighbors:", scaled_ids)
`;
export const SCALE_SOLUTION = swap(SCALE_STARTER, [
  ["    return 0.0   # TODO 1: the average of the list", "    return sum(values) / len(values)"],
  ["    return 1.0   # TODO 2: population standard deviation: the square root of the average squared gap from the mean", "    m = mean(values)\n    return (sum((v - m) ** 2 for v in values) / len(values)) ** 0.5"],
]);
export const SCALE_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "mean([2, 4, 6]) = 4", "passed": _close(mean([2, 4, 6]), 4.0), "hint": "mean returned %r. Add the values and divide by how many there are." % (mean([2, 4, 6]),)})
    results.append({"name": "std([2, 4, 6]) = √(8/3)", "passed": _close(std([2, 4, 6]), (8 / 3) ** 0.5), "hint": "std returned %r. Average the squared gaps from the mean (divide by n), then take the square root." % (std([2, 4, 6]),)})
    results.append({"name": "In raw ₹ units the neighbors are M, C, F", "passed": raw_ids == ["M", "C", "F"], "hint": "raw_ids is %r. The raw ranking should not depend on your scaling functions." % (raw_ids,)})
    results.append({"name": "After standardising, the neighbors become L, J, M", "passed": scaled_ids == ["L", "J", "M"], "hint": "scaled_ids is %r. Once mean and std are right, contacts count as much as the bill." % (scaled_ids,)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const SCALE_CODE: CodeLabConfig = {
  id: "knnscalecode", title: "Give both features a fair ruler", intro: <p>The same new customer gets different neighbors depending on the units. Standardising rewrites each feature as a z-score, so a ₹100 difference and a 1-contact difference are judged on equal terms.</p>,
  bridge: [{ math: "z = (x − μ) / σ", code: "(value - mean(values)) / std(values)", note: "Distance from the training average, in standard deviations." }, { math: "σ = √( Σ(x − μ)² / n )", code: "(sum((v - m) ** 2 for v in values) / len(values)) ** 0.5", note: "Population standard deviation of the training values." }],
  cell: { title: "mean(), std() and the scaled neighbors", starter: SCALE_STARTER, solution: SCALE_SOLUTION, checks: SCALE_CHECKS, expose: ["raw_ids", "scaled_ids"], presets: [preset("A cheaper, calmer customer", "Does the ruler still matter?", /^query = \(450, 5\)/m, "query = (400, 1)")] },
  reflections: [{ question: <>Why compute the mean and standard deviation from training customers only?</>, answer: <>A new customer should be judged by the ruler we built before we met them. Fitting the ruler on test customers lets information about the future leak into the model.</> }],
  footer: <>Raw: M, C, F — all low-bill customers who stayed. Standardised: L, J, M — high-contact customers, mostly churners. Nothing about the customer changed; only the ruler did.</>,
};
