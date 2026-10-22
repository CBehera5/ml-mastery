"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";
import { CUSTS, HELD, HOUSES, TARGETS, TOWN_A, TOWN_B, TRAIN_PTS, VALID_PTS, toPy } from "./dt-math";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;

/* DT01 · follow the questions */
export const PART_STARTER = `houses = ${toPy(HOUSES)}   # (area, price in ₹10 lakh)
t1, t2 = 2, 5                                       # the two cut points

def region_of(area, t1, t2):
    return 0   # TODO 1: 0 if area <= t1, 1 if area <= t2, otherwise 2 (equal to a cut goes left)

def leaf_mean(houses, t1, t2, region):
    return 0.0   # TODO 2: the average price of the houses that land in this region

def predict(area, t1, t2):
    return 0.0   # TODO 3: send the area down the tree and return its region's average

for q in (2, 4, 6):
    print("area", q, "→ region", region_of(q, t1, t2), "→ predicted price", round(predict(q, t1, t2), 2))
`;
export const PART_SOLUTION = swap(PART_STARTER, [
  ["    return 0   # TODO 1: 0 if area <= t1, 1 if area <= t2, otherwise 2 (equal to a cut goes left)", "    return 0 if area <= t1 else 1 if area <= t2 else 2"],
  ["    return 0.0   # TODO 2: the average price of the houses that land in this region", "    prices = [p for a, p in houses if region_of(a, t1, t2) == region]\n    return sum(prices) / len(prices)"],
  ["    return 0.0   # TODO 3: send the area down the tree and return its region's average", "    return leaf_mean(houses, t1, t2, region_of(area, t1, t2))"],
]);
export const PART_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "an area equal to a cut goes left", "passed": region_of(2, 2, 5) == 0 and region_of(5, 2, 5) == 1, "hint": "region_of(2, 2, 5) gave %r and region_of(5, 2, 5) gave %r. The question is area <= cut, so equality answers yes." % (region_of(2, 2, 5), region_of(5, 2, 5))})
    results.append({"name": "areas 4 and 6 land in regions 1 and 2", "passed": region_of(4, 2, 5) == 1 and region_of(6, 2, 5) == 2, "hint": "Ask area <= t1 first, then area <= t2, and only then fall through to region 2."})
    results.append({"name": "the three group averages are 3, 7 and 9", "passed": _close(leaf_mean(houses, 2, 5, 0), 3.0) and _close(leaf_mean(houses, 2, 5, 1), 7.0) and _close(leaf_mean(houses, 2, 5, 2), 9.0), "hint": "leaf_mean gave %r. Average only the prices of houses whose own region matches." % ([leaf_mean(houses, 2, 5, r) for r in (0, 1, 2)],)})
    results.append({"name": "area 4 predicts 7, area 2 predicts 3, area 6 predicts 9", "passed": _close(predict(4, 2, 5), 7.0) and _close(predict(2, 2, 5), 3.0) and _close(predict(6, 2, 5), 9.0), "hint": "predict should find the region first, then return that region's average."})
    results.append({"name": "an area far outside the data still returns a group average", "passed": _close(predict(50, 2, 5), 9.0), "hint": "The tree never extrapolates: area 50 goes right and gets the right-hand group's average."})
${fail}`;
export const PART_CODE: CodeLabConfig = {
  id: "dtpartcode", title: "Be the tree", intro: <p>A fitted tree is just a few comparisons and a table of averages. Writing it by hand shows that prediction never learns anything new.</p>,
  bridge: [{ math: "x ≤ t ?", code: "area <= t1", note: "One question; equality goes left." }, { math: "ŷ = average price in the leaf", code: "sum(prices) / len(prices)", note: "The prediction is a group average." }],
  cell: { title: "region_of(), leaf_mean() and predict()", starter: PART_STARTER, solution: PART_SOLUTION, checks: PART_CHECKS, expose: [], presets: [preset("Move the first cut to 3", "A different partition.", /^t1, t2 = 2, 5/m, "t1, t2 = 3, 5")] },
  reflections: [{ question: <>You ask the tree about area 6 and then about area 60. Has it learned anything between the two questions?</>, answer: <>No. Prediction only follows the stored questions. Learning happens when the tree is fitted to training houses.</> }],
  footer: <>With cuts at 2 and 5, the three groups average 3, 7 and 9. Area 4 lands in the middle group and is priced at 7.</>,
};

/* DT02 · regression leaves */
export const SPLIT_STARTER = `targets = ${toPy([...TARGETS])}   # prices of houses sorted by area (₹10 lakh)

def mean(v):
    return 0.0   # TODO 1: the average of the list

def sse(v):
    return 0.0   # TODO 2: the sum of squared gaps from the average

def split_gain(v, k):
    return 0.0   # TODO 3: error of the whole list minus error of v[:k] and v[k:] together

def best_split(v):
    return 1   # TODO 4: the k (1 to len−1) with the largest gain; the first wins a tie

print("error with no split:", sse(targets))
print("best cut after house", best_split(targets), "removes", split_gain(targets, best_split(targets)))
`;
export const SPLIT_SOLUTION = swap(SPLIT_STARTER, [
  ["    return 0.0   # TODO 1: the average of the list", "    return sum(v) / len(v)"],
  ["    return 0.0   # TODO 2: the sum of squared gaps from the average", "    m = mean(v)\n    return sum((x - m) ** 2 for x in v)"],
  ["    return 0.0   # TODO 3: error of the whole list minus error of v[:k] and v[k:] together", "    return sse(v) - sse(v[:k]) - sse(v[k:])"],
  ["    return 1   # TODO 4: the k (1 to len−1) with the largest gain; the first wins a tie", "    best = 1\n    for k in range(2, len(v)):\n        if split_gain(v, k) > split_gain(v, best):\n            best = k\n    return best"],
]);
export const SPLIT_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "[2, 4] has average 3 and error 2", "passed": _close(mean([2, 4]), 3.0) and _close(sse([2, 4]), 2.0), "hint": "mean([2, 4]) gave %r and sse([2, 4]) gave %r. The gaps are −1 and +1, so the squares add to 2." % (mean([2, 4]), sse([2, 4]))})
    results.append({"name": "[1, 1, 5, 5] has error 16; cutting in the middle removes all of it", "passed": _close(sse([1, 1, 5, 5]), 16.0) and _close(split_gain([1, 1, 5, 5], 2), 16.0), "hint": "split_gain([1, 1, 5, 5], 2) gave %r. Both halves are flat, so their errors are 0." % (split_gain([1, 1, 5, 5], 2),)})
    results.append({"name": "[1, 3, 5, 7] cut in the middle removes 16", "passed": _close(split_gain([1, 3, 5, 7], 2), 16.0), "hint": "Parent error is 20, and each half [1, 3] and [5, 7] has error 2, so the gain is 20 − 4 = 16."})
    results.append({"name": "the best cut for the eight prices is after house 4, removing 72", "passed": best_split(targets) == 4 and _close(split_gain(targets, 4), 72.0), "hint": "best_split gave %r. Try every k from 1 to len−1 and keep the one with the largest gain." % (best_split(targets),)})
    results.append({"name": "a tie keeps the first cut", "passed": best_split([1, 1, 1, 1]) == 1, "hint": "When no cut helps, the first candidate (k = 1) should win."})
${fail}`;
export const SPLIT_CODE: CodeLabConfig = {
  id: "dtsplitcode", title: "Find the best cut yourself", intro: <p>The tree tries every possible cut, scores each by how much squared error it removes, and keeps the best. That search is a short loop.</p>,
  bridge: [{ math: "SSE = Σ (y − ȳ)²", code: "sum((x - m) ** 2 for x in v)", note: "Squared gaps from the group average." }, { math: "gain = SSE(parent) − SSE(left) − SSE(right)", code: "sse(v) - sse(v[:k]) - sse(v[k:])", note: "Error removed by the cut." }],
  cell: { title: "mean(), sse(), split_gain() and best_split()", starter: SPLIT_STARTER, solution: SPLIT_SOLUTION, checks: SPLIT_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Why add the two child errors instead of averaging them?</>, answer: <>The parent error is a sum over all houses, so the children must also be sums over their houses. Averaging would count the same houses twice with different weights.</> }],
  footer: <>The eight prices have total error 76. Cutting after house 4 leaves two groups with error 2 each, so it removes 72.</>,
};

/* DT03 · Gini */
export const GINI_STARTER = `def gini(counts):
    return 0.0   # TODO 1: 1 minus the sum of squared shares; an empty group has gini 0

def split_gain(left, right):
    return 0.0   # TODO 2: gini of the combined group minus the size-weighted gini of left and right

def leaf_proba(counts):
    return [0.5, 0.5]   # TODO 3: the share of each class, in the order [stays, leaves]

def leaf_class(counts):
    return 0   # TODO 4: the class with the most customers; a tie goes to class 0

print("gini of [2, 2]:", gini([2, 2]), " gini of [2, 0]:", gini([2, 0]))
print("gain, [3, 0] and [1, 2]:", round(split_gain([3, 0], [1, 2]), 4))
print("leaf [1, 3]:", leaf_proba([1, 3]), "→ class", leaf_class([1, 3]))
`;
export const GINI_SOLUTION = swap(GINI_STARTER, [
  ["    return 0.0   # TODO 1: 1 minus the sum of squared shares; an empty group has gini 0", "    n = sum(counts)\n    return 1 - sum((c / n) ** 2 for c in counts) if n else 0.0"],
  ["    return 0.0   # TODO 2: gini of the combined group minus the size-weighted gini of left and right", "    nl, nr = sum(left), sum(right)\n    both = [a + b for a, b in zip(left, right)]\n    return gini(both) - (nl * gini(left) + nr * gini(right)) / (nl + nr)"],
  ["    return [0.5, 0.5]   # TODO 3: the share of each class, in the order [stays, leaves]", "    n = sum(counts)\n    return [c / n for c in counts]"],
  ["    return 0   # TODO 4: the class with the most customers; a tie goes to class 0", "    return 1 if counts[1] > counts[0] else 0"],
]);
export const GINI_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "gini([2, 2]) = 0.5 and gini([2, 0]) = 0", "passed": _close(gini([2, 2]), 0.5) and _close(gini([2, 0]), 0.0), "hint": "gini([2, 2]) gave %r. It is 1 − (0.5² + 0.5²) = 0.5. A pure group gives 0." % (gini([2, 2]),)})
    results.append({"name": "splitting [2, 2] into [2, 0] and [0, 2] gains 0.5", "passed": _close(split_gain([2, 0], [0, 2]), 0.5), "hint": "split_gain gave %r. Both children are pure, so the whole 0.5 of mixing disappears." % (split_gain([2, 0], [0, 2]),)})
    results.append({"name": "children [3, 0] and [1, 2] gain 2/9", "passed": _close(split_gain([3, 0], [1, 2]), 2 / 9), "hint": "split_gain gave %r. Parent [4, 2] has gini 4/9; the children's weighted gini is 2/9, so the gain is 2/9." % (split_gain([3, 0], [1, 2]),)})
    results.append({"name": "leaf [1, 3] gives [0.25, 0.75] and class 1", "passed": _close(leaf_proba([1, 3])[0], 0.25) and _close(leaf_proba([1, 3])[1], 0.75) and leaf_class([1, 3]) == 1, "hint": "leaf_proba gave %r. Divide each count by the leaf size." % (leaf_proba([1, 3]),)})
    results.append({"name": "a tied leaf [1, 1] predicts class 0", "passed": leaf_class([1, 1]) == 0, "hint": "On a tie the first class (0, stays) wins, so only choose class 1 when it has strictly more customers."})
${fail}`;
export const GINI_CODE: CodeLabConfig = {
  id: "dtginicode", title: "Measure how mixed a group is", intro: <p>Gini turns a pile of stay and leave counts into one number. Weighting the children by their size turns it into a score for a whole split.</p>,
  bridge: [{ math: "Gini = 1 − Σ pᵢ²", code: "1 - sum((c / n) ** 2 for c in counts)", note: "0 means pure." }, { math: "gain = Gini(parent) − Σ (nᵢ/n)·Gini(childᵢ)", code: "gini(both) - (nl * gini(left) + nr * gini(right)) / (nl + nr)", note: "Weighted by branch size." }],
  cell: { title: "gini(), split_gain(), leaf_proba() and leaf_class()", starter: GINI_STARTER, solution: GINI_SOLUTION, checks: GINI_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>A leaf has 3 customers who stayed and 1 who left. Is the chance of leaving exactly 25%?</>, answer: <>It is the best estimate from those four customers, but four customers is a very small sample. Treat it as a rough reading, not a promise.</> }],
  footer: <>A parent with 4 who stayed and 2 who left has Gini 4/9. Splitting into [3, 0] and [1, 2] leaves a weighted Gini of 2/9, a gain of 2/9.</>,
};

/* DT04 · depth */
export const DEPTH_STARTER = `train = ${toPy(TRAIN_PTS)}   # (area, price) the tree learns from
valid = ${toPy(VALID_PTS)}   # houses it has never seen

def mean(v):
    return sum(v) / len(v)

def best_stump(pts):
    return (0.0, 0.0, 0.0)   # TODO 1: return (cut, left_mean, right_mean) for the best single cut on area

def stump_mse(stump, pts):
    return 0.0   # TODO 2: the average squared gap between the stump's prediction and each price

def pick_depth(valid_errors):
    return 0   # TODO 3: the depth (list position) with the lowest error on unseen houses; the first wins a tie

stump = best_stump(train)
print("cut:", round(stump[0], 2), "train error:", round(stump_mse(stump, train), 3), "unseen error:", round(stump_mse(stump, valid), 3))
print("chosen depth:", pick_depth([9.72, 1.99, 2.45, 2.81, 2.73, 3.01]))
`;
export const DEPTH_SOLUTION = swap(DEPTH_STARTER, [
  ["    return (0.0, 0.0, 0.0)   # TODO 1: return (cut, left_mean, right_mean) for the best single cut on area", "    pts = sorted(pts)\n    ys = [y for _, y in pts]\n    def sse(v):\n        m = mean(v)\n        return sum((x - m) ** 2 for x in v)\n    best, best_gain = None, 1e-9\n    for k in range(1, len(pts)):\n        if pts[k - 1][0] == pts[k][0]:\n            continue\n        gain = sse(ys) - sse(ys[:k]) - sse(ys[k:])\n        if gain > best_gain:\n            best, best_gain = k, gain\n    cut = (pts[best - 1][0] + pts[best][0]) / 2\n    return (cut, mean(ys[:best]), mean(ys[best:]))"],
  ["    return 0.0   # TODO 2: the average squared gap between the stump's prediction and each price", "    cut, lo, hi = stump\n    return mean([((lo if x <= cut else hi) - y) ** 2 for x, y in pts])"],
  ["    return 0   # TODO 3: the depth (list position) with the lowest error on unseen houses; the first wins a tie", "    best = 0\n    for i, e in enumerate(valid_errors):\n        if e < valid_errors[best]:\n            best = i\n    return best"],
]);
export const DEPTH_CHECKS = CHECK_PRELUDE + `
try:
    tiny = [(1, 1), (2, 1), (3, 5), (4, 5)]
    s = best_stump(tiny)
    results.append({"name": "on [1, 1, 5, 5] the cut is 2.5 with averages 1 and 5", "passed": _close(s[0], 2.5) and _close(s[1], 1.0) and _close(s[2], 5.0), "hint": "best_stump gave %r. The cut sits halfway between the last house on the left (area 2) and the first on the right (area 3)." % (s,)})
    results.append({"name": "a perfect stump has zero error", "passed": _close(stump_mse(s, tiny), 0.0), "hint": "stump_mse gave %r. Predict the left average for area ≤ cut and the right average otherwise." % (stump_mse(s, tiny),)})
    st = best_stump(train)
    results.append({"name": "training error of the best stump is 1.440", "passed": abs(stump_mse(st, train) - 1.440) < 0.002, "hint": "stump_mse on train gave %r. Check you picked the cut with the largest error removed." % (stump_mse(st, train),)})
    results.append({"name": "error on unseen houses is 1.993", "passed": abs(stump_mse(st, valid) - 1.993) < 0.002, "hint": "stump_mse on valid gave %r. Use the cut and averages learned on train, not refitted on valid." % (stump_mse(st, valid),)})
    results.append({"name": "pick_depth chooses depth 1, and the first of a tie", "passed": pick_depth([9.72, 1.99, 2.45, 2.81, 2.73, 3.01]) == 1 and pick_depth([2, 1, 1]) == 1, "hint": "Choose the list position with the smallest unseen-house error; do not choose by training error."})
${fail}`;
export const DEPTH_CODE: CodeLabConfig = {
  id: "dtdepthcode", title: "Fit one cut, then judge it on new houses", intro: <p>Depth is a dial between too simple and too eager. The honest way to set it is to compare errors on houses the tree never saw.</p>,
  bridge: [{ math: "MSE = mean (ŷ − y)²", code: "mean([(pred - y) ** 2 ...])", note: "Average squared error." }, { math: "pick the depth that minimises unseen-house error", code: "valid_errors[i] < valid_errors[best]", note: "Never the training error." }],
  cell: { title: "best_stump(), stump_mse() and pick_depth()", starter: DEPTH_STARTER, solution: DEPTH_SOLUTION, checks: DEPTH_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Training error falls at every depth. Why not simply pick the deepest tree?</>, answer: <>A deep tree can memorise the odd prices in the training set. Its error on unseen houses is what shows whether it learned the pattern or the noise.</> }],
  footer: <>One cut gives an error of 1.44 on the training houses and 1.99 on unseen ones. Deeper trees keep improving the first number while the second gets worse.</>,
};

/* DT05 · fit safely */
export const ALIGN_STARTER = `features = ${toPy(CUSTS.map(c => [c.id, c.bill]).reverse())}   # (id, bill), in a different order
labels = ${toPy(Object.fromEntries(CUSTS.map(c => [c.id, c.churned])))}      # id → 1 if they left
held = ${toPy(HELD.map(c => [c.bill, c.churned]))}   # (bill, label) of 8 new customers

def join(features, labels):
    return []   # TODO 1: a list of (bill, label) pairs matched by customer id, sorted by bill

def best_cut(pairs):
    return (0, 0.0)   # TODO 2: (cut, accuracy) over the distinct bills; predict 1 when bill > cut; the first wins a tie

def held_accuracy(cut, held):
    return 0.0   # TODO 3: the share of held-out customers where (bill > cut) matches the label

pairs = join(features, labels)
cut, acc = best_cut(pairs)
print("cut:", cut, "training accuracy:", acc, "new customers:", held_accuracy(cut, held))
`;
export const ALIGN_SOLUTION = swap(ALIGN_STARTER, [
  ["    return []   # TODO 1: a list of (bill, label) pairs matched by customer id, sorted by bill", "    return sorted((bill, labels[cid]) for cid, bill in features)"],
  ["    return (0, 0.0)   # TODO 2: (cut, accuracy) over the distinct bills; predict 1 when bill > cut; the first wins a tie", "    best, best_acc = None, -1\n    for c in sorted(set(b for b, _ in pairs)):\n        a = sum(1 for b, y in pairs if (1 if b > c else 0) == y) / len(pairs)\n        if a > best_acc:\n            best, best_acc = c, a\n    return (best, best_acc)"],
  ["    return 0.0   # TODO 3: the share of held-out customers where (bill > cut) matches the label", "    return sum(1 for b, y in held if (1 if b > cut else 0) == y) / len(held)"],
]);
export const ALIGN_CHECKS = CHECK_PRELUDE + `
try:
    j = join([("B", 20), ("A", 10)], {"A": 0, "B": 1})
    results.append({"name": "join matches by id, not by position", "passed": j == [(10, 0), (20, 1)], "hint": "join gave %r. Look each label up by the customer's id with labels[cid]." % (j,)})
    results.append({"name": "join gives the same pairs for any row order", "passed": join(features, labels) == join(list(reversed(features)), labels) and len(join(features, labels)) == 8, "hint": "Shuffling the feature rows must not change the result when labels are matched by id."})
    c = best_cut(join(features, labels))
    results.append({"name": "with matched rows the best cut is ₹640 and it fits all 8", "passed": c[0] == 640 and _close(c[1], 1.0), "hint": "best_cut gave %r. Try every distinct bill as a cut and keep the one with the highest accuracy." % (c,)})
    results.append({"name": "that cut scores 7 of 8 on new customers", "passed": _close(held_accuracy(640, held), 0.875), "hint": "held_accuracy gave %r. Count held-out customers where (bill > 640) agrees with their label." % (held_accuracy(640, held),)})
    wrong = best_cut(sorted(zip(sorted(b for _, b in features), [labels[k] for k in sorted(labels, reverse=True)])))
    results.append({"name": "labels pasted by position give a worse tree", "passed": held_accuracy(wrong[0], held) < held_accuracy(640, held), "hint": "Pairing bills with labels by position scrambles who left; the cut it finds should do worse on new customers."})
${fail}`;
export const ALIGN_CODE: CodeLabConfig = {
  id: "dtaligncode", title: "Join by id, then fit", intro: <p>A tree fits happily on scrambled rows and never complains. The only protection is to match every label to its customer by id before fitting.</p>,
  bridge: [{ math: "(xᵢ, yᵢ) belong to the same customer i", code: "labels[cid]", note: "Join on the id." }, { math: "held-out accuracy", code: "(1 if b > cut else 0) == y", note: "Scored on customers not used in the fit." }],
  cell: { title: "join(), best_cut() and held_accuracy()", starter: ALIGN_STARTER, solution: ALIGN_SOLUTION, checks: ALIGN_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>The tree trained on scrambled rows did not crash. How would you notice the problem?</>, answer: <>Compare against a baseline and check held-out accuracy. A cut that is no better than guessing on new customers is a sign the rows or labels are wrong.</> }],
  footer: <>Matched by id, a cut at ₹640 fits all 8 customers and gets 7 of 8 new customers right. Pasted by position, the fit falls apart.</>,
};

/* DT06 · rules and limits */
export const RULE_STARTER = `town_a = ${toPy(TOWN_A.map(h => [h.area, h.age, h.price]))}   # (area, age, price)
town_b = ${toPy(TOWN_B.map(h => [h.area, h.age, h.price]))}
reductions = {"area": 8, "age": 2}                      # error removed by each feature in the fitted tree

def covered(rows, area_max, age_min):
    return []   # TODO 1: the rows with area <= area_max AND age > age_min

def coverage(rows, area_max, age_min):
    return 0.0   # TODO 2: the share of all rows that the rule covers

def importance(reductions, key):
    return 0.0   # TODO 3: this feature's share of the total error removed

print("town A coverage:", coverage(town_a, 2, 10), " town B coverage:", coverage(town_b, 2, 10))
print("importance of area:", importance(reductions, "area"))
`;
export const RULE_SOLUTION = swap(RULE_STARTER, [
  ["    return []   # TODO 1: the rows with area <= area_max AND age > age_min", "    return [r for r in rows if r[0] <= area_max and r[1] > age_min]"],
  ["    return 0.0   # TODO 2: the share of all rows that the rule covers", "    return len(covered(rows, area_max, age_min)) / len(rows)"],
  ["    return 0.0   # TODO 3: this feature's share of the total error removed", "    return reductions[key] / sum(reductions.values())"],
]);
export const RULE_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "the rule covers 3 houses in town A", "passed": len(covered(town_a, 2, 10)) == 3, "hint": "covered gave %d rows. Both conditions must hold: area <= 2 AND age > 10." % len(covered(town_a, 2, 10))})
    results.append({"name": "that is 15% of town A", "passed": _close(coverage(town_a, 2, 10), 0.15), "hint": "coverage gave %r. Divide the covered rows by all 20 rows." % (coverage(town_a, 2, 10),)})
    results.append({"name": "the same rule covers nothing in town B", "passed": coverage(town_b, 2, 10) == 0, "hint": "Town B's houses are bigger and newer, so the same rule matches none of them. Coverage in one town says nothing about another."})
    results.append({"name": "loosening the age condition changes the count, not the rule's meaning", "passed": len(covered(town_a, 2, 5)) > len(covered(town_a, 2, 10)), "hint": "Lowering the age requirement from 10 to 5 should admit more houses."})
    results.append({"name": "area earned 80% of the error reduction", "passed": _close(importance(reductions, "area"), 0.8) and _close(importance(reductions, "age"), 0.2), "hint": "importance gave %r. Divide the feature's reduction by the sum over all features." % (importance(reductions, "area"),)})
${fail}`;
export const RULE_CODE: CodeLabConfig = {
  id: "dtrulecode", title: "Count what a rule covers", intro: <p>A rule is only a description of the houses it matched during training. Counting its coverage in a different town shows how little it promises.</p>,
  bridge: [{ math: "coverage = rows matching the rule ÷ all rows", code: "len(covered(...)) / len(rows)", note: "How much of the data the rule describes." }, { math: "importance = a feature's share of error removed", code: "reductions[key] / sum(reductions.values())", note: "A share of fit, not a cause." }],
  cell: { title: "covered(), coverage() and importance()", starter: RULE_STARTER, solution: RULE_SOLUTION, checks: RULE_CHECKS, expose: [], presets: [preset("Try a looser age rule", "Admit younger houses.", /coverage\(town_a, 2, 10\)/, "coverage(town_a, 2, 5)")] },
  reflections: [{ question: <>Area has importance 0.8. If you add a room, will the price rise by 80%?</>, answer: <>No. Importance says how much of the tree's fit came from area on the training houses. It says nothing about what happens if you change a house.</> }],
  footer: <>In town A the rule covers 3 of 20 houses (15%). In town B it covers none. Importance of 0.8 for area is a share of error removed, not an 80% effect.</>,
};
