"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;

/* RF01 · bags */
export const BAG_STARTER = `ids = ["A", "B", "C", "D"]
draw = [0, 0, 2, 3]   # one tree's bag, as row numbers: A, A, C, D

def multiplicity(draw, n):
    return [0] * n   # TODO 1: for each row 0..n−1, how many times it was drawn

def unique_rows(draw):
    return 0   # TODO 2: how many different rows the bag contains

def out_of_bag(draw, n):
    return []   # TODO 3: the row numbers that were never drawn

print("draws:", len(draw), " different houses:", unique_rows(draw))
print("times each house was drawn:", multiplicity(draw, 4))
print("out-of-bag:", [ids[i] for i in out_of_bag(draw, 4)])
`;
export const BAG_SOLUTION = swap(BAG_STARTER, [
  ["    return [0] * n   # TODO 1: for each row 0..n−1, how many times it was drawn", "    return [draw.count(i) for i in range(n)]"],
  ["    return 0   # TODO 2: how many different rows the bag contains", "    return len(set(draw))"],
  ["    return []   # TODO 3: the row numbers that were never drawn", "    return [i for i in range(n) if i not in draw]"],
]);
export const BAG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "A is drawn twice, B never, C and D once", "passed": multiplicity([0, 0, 2, 3], 4) == [2, 0, 1, 1], "hint": "multiplicity gave %r. Count how often each row number appears in the draw." % (multiplicity([0, 0, 2, 3], 4),)})
    results.append({"name": "four draws, only three different houses", "passed": unique_rows([0, 0, 2, 3]) == 3, "hint": "unique_rows gave %r. Repeats count once." % (unique_rows([0, 0, 2, 3]),)})
    results.append({"name": "house B is out-of-bag", "passed": out_of_bag([0, 0, 2, 3], 4) == [1], "hint": "out_of_bag gave %r. Out-of-bag rows are the ones missing from the draw." % (out_of_bag([0, 0, 2, 3], 4),)})
    results.append({"name": "multiplicities add back up to the number of draws", "passed": sum(multiplicity([1, 3, 3, 5, 6, 6, 6, 1], 8)) == 8 and out_of_bag([1, 3, 3, 5, 6, 6, 6, 1], 8) == [0, 2, 4, 7], "hint": "Every draw lands on exactly one row, so the counts must sum to the number of draws."})
${fail}`;
export const BAG_CODE: CodeLabConfig = {
  id: "rfbagcode", title: "Draw a bag, find who was left out", intro: <p>A bootstrap bag is just a list of row numbers drawn with replacement. Counting it shows why each tree sees a slightly different dataset.</p>,
  bridge: [{ math: "draw n rows with replacement", code: "draw = [0, 0, 2, 3]", note: "Rows can repeat." }, { math: "out-of-bag = rows never drawn", code: "[i for i in range(n) if i not in draw]", note: "Unused by this tree." }],
  cell: { title: "multiplicity(), unique_rows() and out_of_bag()", starter: BAG_STARTER, solution: BAG_SOLUTION, checks: BAG_CHECKS, expose: [], presets: [preset("Another bag", "Draw A, B, B, D.", /^draw = \[0, 0, 2, 3\]/m, "draw = [0, 1, 1, 3]")] },
  reflections: [{ question: <>Why is it fine for a tree to see the same house twice?</>, answer: <>Because the point is variety. Each tree gets a slightly different view of the data, so their mistakes differ and averaging can cancel some of them.</> }],
  footer: <>Four draws gave three different houses. A was drawn twice and B was left out.</>,
};

/* RF02 · regression aggregation */
export const AVG_STARTER = `tree_prices = [2, 4, 6]   # three trees' predictions for one house (₹10 lakh)
actual = 8

def forest_mean(preds):
    return 0.0   # TODO 1: the average of the trees' predictions

def abs_error(pred, actual):
    return 0.0   # TODO 2: how far the prediction is from the actual price

def improvement(preds, i, actual):
    return 0.0   # TODO 3: tree i's error minus the forest's error (positive = averaging helped)

print("forest says:", forest_mean(tree_prices))
print("tree 0 error:", abs_error(tree_prices[0], actual), " forest error:", abs_error(forest_mean(tree_prices), actual))
print("improvement over tree 0:", improvement(tree_prices, 0, actual))
`;
export const AVG_SOLUTION = swap(AVG_STARTER, [
  ["    return 0.0   # TODO 1: the average of the trees' predictions", "    return sum(preds) / len(preds)"],
  ["    return 0.0   # TODO 2: how far the prediction is from the actual price", "    return abs(pred - actual)"],
  ["    return 0.0   # TODO 3: tree i's error minus the forest's error (positive = averaging helped)", "    return abs_error(preds[i], actual) - abs_error(forest_mean(preds), actual)"],
]);
export const AVG_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "the forest mean of [2, 4, 6] is 4", "passed": _close(forest_mean([2, 4, 6]), 4.0), "hint": "forest_mean gave %r. Add the three predictions and divide by 3." % (forest_mean([2, 4, 6]),)})
    results.append({"name": "tree 0 misses by 6 and the forest by 4", "passed": _close(abs_error(2, 8), 6.0) and _close(abs_error(4, 8), 4.0), "hint": "abs_error is the distance between prediction and actual, never negative."})
    results.append({"name": "averaging improves tree 0 by 2", "passed": _close(improvement([2, 4, 6], 0, 8), 2.0), "hint": "improvement gave %r. It is 6 − 4." % (improvement([2, 4, 6], 0, 8),)})
    results.append({"name": "averaging can hurt a tree that was already best", "passed": _close(improvement([2, 4, 6], 2, 8), -2.0), "hint": "Tree 2 predicts 6, which is closer to 8 than the forest mean of 4: error 2 versus 4, so the improvement is −2."})
${fail}`;
export const AVG_CODE: CodeLabConfig = {
  id: "rfavgcode", title: "Average the trees, then check who gained", intro: <p>Averaging does not make every tree look bad. It protects you from picking an unlucky one.</p>,
  bridge: [{ math: "ŷ = (1/T) Σ ŷₜ", code: "sum(preds) / len(preds)", note: "The forest prediction." }, { math: "|ŷ − y|", code: "abs(pred - actual)", note: "Error for one house." }],
  cell: { title: "forest_mean(), abs_error() and improvement()", starter: AVG_STARTER, solution: AVG_SOLUTION, checks: AVG_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>The three trees predict 2, 4 and 6. Is the range 2 to 6 a 95% interval for the price?</>, answer: <>No. It only shows how much these three trees disagree. A real interval needs separate evidence about how far predictions miss on unseen houses.</> }],
  footer: <>Trees predicting 2, 4 and 6 give a forest mean of 4. If the actual price is 8, tree 0 misses by 6 and the forest by 4.</>,
};

/* RF03 · classification aggregation */
export const VOTE_STARTER = `chances = [0.4, 0.4, 0.9]   # each tree's chance that the customer leaves

def mean_proba(ps):
    return 0.0   # TODO 1: the average chance across trees

def forest_label(ps):
    return 0   # TODO 2: 1 if the average chance is at least 0.5, otherwise 0

def hand_vote(ps):
    return 0   # TODO 3: 1 if MORE than half the trees individually say 0.5 or above, otherwise 0

print("average chance:", round(mean_proba(chances), 4))
print("forest label:", forest_label(chances), " show of hands:", hand_vote(chances))
`;
export const VOTE_SOLUTION = swap(VOTE_STARTER, [
  ["    return 0.0   # TODO 1: the average chance across trees", "    return sum(ps) / len(ps)"],
  ["    return 0   # TODO 2: 1 if the average chance is at least 0.5, otherwise 0", "    return 1 if mean_proba(ps) >= 0.5 else 0"],
  ["    return 0   # TODO 3: 1 if MORE than half the trees individually say 0.5 or above, otherwise 0", "    return 1 if sum(1 for p in ps if p >= 0.5) * 2 > len(ps) else 0"],
]);
export const VOTE_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "the average of [0.4, 0.4, 0.9] is 17/30", "passed": _close(mean_proba([0.4, 0.4, 0.9]), 17 / 30), "hint": "mean_proba gave %r. It is (0.4 + 0.4 + 0.9) ÷ 3 ≈ 0.5667." % (mean_proba([0.4, 0.4, 0.9]),)})
    results.append({"name": "the forest says 1 (leaves)", "passed": forest_label([0.4, 0.4, 0.9]) == 1, "hint": "The average 0.5667 is at least 0.5, so the label is 1."})
    results.append({"name": "a show of hands says 0 for the same trees", "passed": hand_vote([0.4, 0.4, 0.9]) == 0, "hint": "Only one of three trees is at 0.5 or above, so the hand vote is 0."})
    results.append({"name": "when trees agree, both rules agree", "passed": forest_label([0.8, 0.7, 0.9]) == hand_vote([0.8, 0.7, 0.9]) == 1 and forest_label([0.1, 0.2, 0.3]) == hand_vote([0.1, 0.2, 0.3]) == 0, "hint": "If all trees are on the same side of 0.5, the average and the vote are on that side too."})
${fail}`;
export const VOTE_CODE: CodeLabConfig = {
  id: "rfvotecode", title: "Average the chances, then compare with a vote", intro: <p>A forest averages class probabilities. Counting hands is a simpler rule that throws away how sure each tree was.</p>,
  bridge: [{ math: "P(leave) = (1/T) Σ pₜ", code: "sum(ps) / len(ps)", note: "The forest's probability." }, { math: "label = 1 if P ≥ 0.5", code: "1 if mean_proba(ps) >= 0.5 else 0", note: "Decide after averaging." }],
  cell: { title: "mean_proba(), forest_label() and hand_vote()", starter: VOTE_STARTER, solution: VOTE_SOLUTION, checks: VOTE_CHECKS, expose: [], presets: [preset("Make it unanimous", "All three trees agree.", /^chances = \[0.4, 0.4, 0.9\]/m, "chances = [0.6, 0.7, 0.9]")] },
  reflections: [{ question: <>Why does it matter that the trees' probability columns are in the same class order?</>, answer: <>Averaging column 1 of one tree with column 0 of another would mix up 'leaves' and 'stays'. Always find the churn column by class label.</> }],
  footer: <>Chances of 0.4, 0.4 and 0.9 average to 17/30 ≈ 0.567, so the forest says leaves. A show of hands would say stays.</>,
};

/* RF04 · out-of-bag */
export const OOB_STARTER = `bags = [[0, 0, 2, 3], [0, 1, 1, 3], [0, 2, 2, 3]]   # each tree's bag (row numbers)
preds_for_B = [3, 9, 7]                            # each tree's prediction for house B (row 1)

def trees_without(row, bags):
    return []   # TODO 1: the tree numbers whose bag does not contain this row

def oob_prediction(row, bags, preds):
    return None   # TODO 2: the average prediction of those trees, or None if there are none

skipped = trees_without(1, bags)
print("trees that never saw house B:", skipped)
print("out-of-bag prediction for B:", oob_prediction(1, bags, preds_for_B), "using", len(skipped), "trees")
`;
export const OOB_SOLUTION = swap(OOB_STARTER, [
  ["    return []   # TODO 1: the tree numbers whose bag does not contain this row", "    return [t for t, bag in enumerate(bags) if row not in bag]"],
  ["    return None   # TODO 2: the average prediction of those trees, or None if there are none", "    ts = trees_without(row, bags)\n    if not ts:\n        return None\n    return sum(preds[t] for t in ts) / len(ts)"],
]);
export const OOB_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "trees 0 and 2 never saw house B", "passed": trees_without(1, [[0, 0, 2, 3], [0, 1, 1, 3], [0, 2, 2, 3]]) == [0, 2], "hint": "trees_without gave %r. Tree 1's bag contains row 1, so it is excluded." % (trees_without(1, [[0, 0, 2, 3], [0, 1, 1, 3], [0, 2, 2, 3]]),)})
    results.append({"name": "the out-of-bag prediction is 5, from 2 trees", "passed": oob_prediction(1, bags, [3, 9, 7]) is not None and _close(oob_prediction(1, bags, [3, 9, 7]), 5.0), "hint": "oob_prediction gave %r. Average only trees 0 and 2: (3 + 7) ÷ 2, not ÷ 3." % (oob_prediction(1, bags, [3, 9, 7]),)})
    results.append({"name": "tree 1's prediction of 9 is not used", "passed": oob_prediction(1, bags, [3, 9, 7]) is not None and not _close(oob_prediction(1, bags, [3, 9, 7]), 19 / 3), "hint": "Tree 1 saw house B while training, so its prediction would flatter the model."})
    results.append({"name": "a house in every bag has no out-of-bag answer", "passed": oob_prediction(0, bags, [1, 2, 3]) is None, "hint": "Row 0 is in all three bags. Return None instead of dividing by zero."})
${fail}`;
export const OOB_CODE: CodeLabConfig = {
  id: "rfoobcode", title: "Grade a house with the trees that never saw it", intro: <p>Out-of-bag grading is a filter on the trees. Get the filter right and the denominator follows.</p>,
  bridge: [{ math: "OOB set for row i = {t : i ∉ bag_t}", code: "[t for t, bag in enumerate(bags) if row not in bag]", note: "Trees that did not train on i." }, { math: "ŷᵢ = mean over that set", code: "sum(preds[t] for t in ts) / len(ts)", note: "Divide by how many voted." }],
  cell: { title: "trees_without() and oob_prediction()", starter: OOB_STARTER, solution: OOB_SOLUTION, checks: OOB_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Is the out-of-bag error a replacement for a separate test set?</>, answer: <>It is a useful free check, but not a replacement. It is noisy on small data, and the final model should still be confirmed on data that was never used for any choice.</> }],
  footer: <>House B was missed by trees 0 and 2, which predict 3 and 7. The out-of-bag prediction is 5, dividing by 2 and not 3.</>,
};

/* RF05 · permutation importance */
export const IMP_STARTER = `def accuracy(preds, actual):
    return 0.0   # TODO 1: the share of predictions that match the actual labels

def drop(base, permuted):
    return 0.0   # TODO 2: how much accuracy fell when the column was shuffled (can be negative)

def shuffle_column(col, shift):
    return col   # TODO 3: move every value 'shift' places along, wrapping around (a fixed, repeatable shuffle)

def most_used(drops):
    return ""   # TODO 4: the name with the biggest drop; drops is a dict like {"complaints": 0.18}

print("drop when accuracy goes .75 → .5:", drop(0.75, 0.5))
print("drop when accuracy goes .5 → .75:", drop(0.5, 0.75))
print("shuffled column:", shuffle_column([1, 2, 3, 4], 1))
print("most used:", most_used({"complaints": 0.18, "tenure": 0.055, "random number": -0.03}))
`;
export const IMP_SOLUTION = swap(IMP_STARTER, [
  ["    return 0.0   # TODO 1: the share of predictions that match the actual labels", "    return sum(1 for p, a in zip(preds, actual) if p == a) / len(actual)"],
  ["    return 0.0   # TODO 2: how much accuracy fell when the column was shuffled (can be negative)", "    return base - permuted"],
  ["    return col   # TODO 3: move every value 'shift' places along, wrapping around (a fixed, repeatable shuffle)", "    shift %= len(col)\n    return col[-shift:] + col[:-shift] if shift else list(col)"],
  ["    return \"\"   # TODO 4: the name with the biggest drop; drops is a dict like {\"complaints\": 0.18}", "    return max(drops, key=lambda k: drops[k])"],
]);
export const IMP_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "3 of 4 correct is 0.75", "passed": _close(accuracy([1, 0, 1, 1], [1, 0, 0, 1]), 0.75), "hint": "accuracy gave %r. Count matches and divide by the number of labels." % (accuracy([1, 0, 1, 1], [1, 0, 0, 1]),)})
    results.append({"name": ".75 to .5 is a drop of .25", "passed": _close(drop(0.75, 0.5), 0.25), "hint": "drop = base − permuted."})
    results.append({"name": ".5 to .75 is a drop of −.25; a negative is possible", "passed": _close(drop(0.5, 0.75), -0.25), "hint": "Do not clip at zero. A column can look slightly helpful when shuffled just by chance."})
    results.append({"name": "shuffling [1, 2, 3, 4] by 1 gives [4, 1, 2, 3], and the original is untouched", "passed": shuffle_column([1, 2, 3, 4], 1) == [4, 1, 2, 3] and shuffle_column([1, 2, 3, 4], 0) == [1, 2, 3, 4], "hint": "shuffle_column gave %r. Move each value one place right, with the last value wrapping to the front." % (shuffle_column([1, 2, 3, 4], 1),)})
    results.append({"name": "the most used column is complaints", "passed": most_used({"complaints": 0.18, "tenure": 0.055, "random number": -0.03}) == "complaints", "hint": "Pick the key with the largest drop value."})
${fail}`;
export const IMP_CODE: CodeLabConfig = {
  id: "rfimpcode", title: "Measure what breaks when a column is scrambled", intro: <p>Permutation importance is a before-and-after measurement. The code is short, and the interpretation is the careful part.</p>,
  bridge: [{ math: "importance = accuracy(before) − accuracy(after shuffling)", code: "base - permuted", note: "Can be negative." }, { math: "shuffle one column only", code: "col[-shift:] + col[:-shift]", note: "Break the link to the labels." }],
  cell: { title: "accuracy(), drop(), shuffle_column() and most_used()", starter: IMP_STARTER, solution: IMP_SOLUTION, checks: IMP_CHECKS, expose: [], presets: [] },
  reflections: [{ question: <>Shuffling the column 'tenure' barely changes accuracy. Does tenure not matter for churn?</>, answer: <>Not necessarily. It only shows the forest did not rely on it, perhaps because a correlated column carried the same information. It says nothing about what would change if you changed someone's tenure.</> }],
  footer: <>Going from .75 to .5 is a drop of .25. Going from .5 to .75 is −.25, which just means the shuffled column did nothing useful.</>,
};
