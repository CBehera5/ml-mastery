"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";
import { NOISY_TRAIN, NOISY_VALID, RARE_TEST, RARE_TRAIN, toPython } from "./knn-math";

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

/* KN03 · choose k with unseen data */
const KNN_PREDICT = `def knn_predict(train, query, k):
    """Majority label among the k nearest training rows. Rows are (bill, contacts, churned)."""
    ranked = sorted(train, key=lambda r: ((r[0] - query[0]) ** 2 + (r[1] - query[1]) ** 2) ** 0.5)
    return 1 if sum(r[2] for r in ranked[:k]) * 2 > k else 0
`;
export const CHOOSE_STARTER = `train = ${toPython(NOISY_TRAIN)}
valid = ${toPython(NOISY_VALID)}

${KNN_PREDICT}
def accuracy(train, test, k):
    return 0.0   # TODO 1: the share of test rows whose label knn_predict gets right

def best_k(train, valid, ks):
    return ks[0]   # TODO 2: the k with the highest accuracy on the *valid* rows (first one wins a tie)

ks = [1, 3, 5, 7, 9, 11, 13, 15]
print("k = 1 on rows it has seen:  ", round(accuracy(train, train, 1), 3))
print("k = 1 on rows it has not seen:", round(accuracy(train, valid, 1), 3))
print("best k:", best_k(train, valid, ks))
`;
export const CHOOSE_SOLUTION = swap(CHOOSE_STARTER, [
  ["    return 0.0   # TODO 1: the share of test rows whose label knn_predict gets right", "    right = sum(1 for r in test if knn_predict(train, (r[0], r[1]), k) == r[2])\n    return right / len(test)"],
  ["    return ks[0]   # TODO 2: the k with the highest accuracy on the *valid* rows (first one wins a tie)", "    best = ks[0]\n    for k in ks:\n        if accuracy(train, valid, k) > accuracy(train, valid, best):\n            best = k\n    return best"],
]);
export const CHOOSE_CHECKS = CHECK_PRELUDE + `
def _ref(train, test, k):
    hits = 0
    for r in test:
        ranked = sorted(train, key=lambda t: ((t[0] - r[0]) ** 2 + (t[1] - r[1]) ** 2) ** 0.5)
        hits += (1 if sum(t[2] for t in ranked[:k]) * 2 > k else 0) == r[2]
    return hits / len(test)
try:
    results.append({"name": "accuracy on unseen rows matches the reference for k = 3", "passed": _close(accuracy(train, valid, 3), _ref(train, valid, 3)), "hint": "accuracy(train, valid, 3) returned %r. Count the rows where knn_predict equals the real label, then divide by the number of rows." % (accuracy(train, valid, 3),)})
    results.append({"name": "k = 1 looks better on seen rows than on unseen rows", "passed": accuracy(train, train, 1) > accuracy(train, valid, 1) + 0.2, "hint": "On rows it has already seen, k = 1 should look much better, because each row is its own nearest neighbor."})
    expected = max(ks, key=lambda k: (_ref(train, valid, k), -k))
    results.append({"name": "best_k picks the best k on unseen rows", "passed": best_k(train, valid, ks) == expected, "hint": "best_k returned %r but the best k on the valid rows is %r. Compare accuracy on valid, not on train." % (best_k(train, valid, ks), expected)})
    results.append({"name": "best_k is not simply the k that is best on training rows", "passed": best_k(train, valid, ks) != max(ks, key=lambda k: (_ref(train, train, k), -k)), "hint": "If you chose the k with the best training accuracy you would always get k = 1. Use the valid rows."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const CHOOSE_CODE: CodeLabConfig = {
  id: "knnchoosecode", title: "Choose k with data it has not seen", intro: <p>Training accuracy always favors the smallest k, because a customer counts as its own neighbor. To choose honestly, score each k on customers the model did not train on.</p>,
  bridge: [{ math: "accuracy = right answers ÷ rows", code: "right / len(test)", note: "A share between 0 and 1." }, { math: "k* = the k with the highest unseen accuracy", code: "accuracy(train, valid, k)", note: "Always score on rows that were not used to train." }],
  cell: { title: "accuracy() and best_k()", starter: CHOOSE_STARTER, solution: CHOOSE_SOLUTION, checks: CHOOSE_CHECKS, expose: ["ks"], presets: [preset("Only odd k up to 7", "A smaller menu of candidates.", /^ks = \[.*\]/m, "ks = [1, 3, 5, 7]")] },
  reflections: [{ question: <>Why must the final test set stay untouched while you choose k?</>, answer: <>Every time you look at it and adjust, it starts to guide your choices, so its score stops being a fair preview of new customers. Choose k on a development split, then test once.</> }],
  footer: <>On unseen customers the score is bumpy and flat across the middle values of k. That is normal: take a modest k that does well on held-out data, not the one that merely flatters the training set.</>,
};

/* KN04 · accuracy versus recall */
export const LIMITS_STARTER = `train = ${toPython(RARE_TRAIN)}
test = ${toPython(RARE_TEST)}

${KNN_PREDICT}
def confusion(train, test, k):
    tp = fp = fn = tn = 0
    for r in test:
        guess = knn_predict(train, (r[0], r[1]), k)
        # TODO 1: add one to the right counter. tp = guessed 1 and really 1, fp = guessed 1 but really 0,
        # fn = guessed 0 but really 1, tn = guessed 0 and really 0
        pass
    return tp, fp, fn, tn

def recall(tp, fn):
    return 0.0   # TODO 2: of the customers who really left, the share we caught

tp, fp, fn, tn = confusion(train, test, 5)
print("caught", tp, "missed", fn, "false alarms", fp)
print("accuracy:", round((tp + tn) / len(test), 3), " recall:", round(recall(tp, fn), 3))
print("accuracy of always saying 'stays':", round(sum(1 for r in test if r[2] == 0) / len(test), 3))
`;
export const LIMITS_SOLUTION = swap(LIMITS_STARTER, [
  ["        # TODO 1: add one to the right counter. tp = guessed 1 and really 1, fp = guessed 1 but really 0,\n        # fn = guessed 0 but really 1, tn = guessed 0 and really 0\n        pass", "        if guess == 1 and r[2] == 1:\n            tp += 1\n        elif guess == 1:\n            fp += 1\n        elif r[2] == 1:\n            fn += 1\n        else:\n            tn += 1"],
  ["    return 0.0   # TODO 2: of the customers who really left, the share we caught", "    return tp / (tp + fn) if tp + fn else 0.0"],
]);
export const LIMITS_CHECKS = CHECK_PRELUDE + `
def _ref(train, test, k):
    tp = fp = fn = tn = 0
    for r in test:
        ranked = sorted(train, key=lambda t: ((t[0] - r[0]) ** 2 + (t[1] - r[1]) ** 2) ** 0.5)
        g = 1 if sum(t[2] for t in ranked[:k]) * 2 > k else 0
        if g and r[2]: tp += 1
        elif g: fp += 1
        elif r[2]: fn += 1
        else: tn += 1
    return tp, fp, fn, tn
try:
    got = confusion(train, test, 5)
    results.append({"name": "confusion counts match the reference for k = 5", "passed": tuple(got) == _ref(train, test, 5), "hint": "confusion returned %r. Use all four counters: tp, fp, fn, tn." % (got,)})
    results.append({"name": "the four counts add up to every test row", "passed": sum(got) == len(test), "hint": "The counts add to %r but there are %r test rows. Every row belongs to exactly one cell." % (sum(got), len(test))})
    results.append({"name": "recall(8, 2) = 0.8", "passed": _close(recall(8, 2), 0.8), "hint": "recall(8, 2) returned %r. It is caught ÷ (caught + missed)." % (recall(8, 2),)})
    results.append({"name": "recall of an always-stays model is 0", "passed": recall(0, 14) == 0, "hint": "recall(0, 14) returned %r. If nobody who left is caught, recall is 0." % (recall(0, 14),)})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const LIMITS_CODE: CodeLabConfig = {
  id: "knnlimitscode", title: "Count who you catch and who you miss", intro: <p>A single accuracy number hides the mix of mistakes. Counting four cells shows who the errors land on.</p>,
  bridge: [{ math: "recall = TP ÷ (TP + FN)", code: "tp / (tp + fn)", note: "Of customers who really left, the share we caught." }, { math: "accuracy = (TP + TN) ÷ all rows", code: "(tp + tn) / len(test)", note: "Looks good even when the rare group is missed." }],
  cell: { title: "confusion() and recall()", starter: LIMITS_STARTER, solution: LIMITS_SOLUTION, checks: LIMITS_CHECKS, expose: [], presets: [preset("Ask 15 neighbors", "Does recall hold up?", /confusion\(train, test, 5\)/, "confusion(train, test, 15)")] },
  reflections: [{ question: <>If only 17% of customers leave, why is “nobody leaves” a useful comparison?</>, answer: <>It scores about 83% without learning anything. A model has to beat that baseline, and on the customers you actually care about, before its accuracy means much.</> }],
  footer: <>With k = 5 the model catches 11 of 14 leavers. The “nobody leaves” rule scores 82.5% accuracy and catches none of them.</>,
};
