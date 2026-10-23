"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";
import { PS, YS, toPy } from "./ms-math";

const fail = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
const mk = (id: string, title: string, intro: string, bridge: CodeLabConfig["bridge"], cellTitle: string, starter: string, solution: string, checks: string, reflection: [string, string], footer: string, presets: CodeLabConfig["cell"]["presets"] = []): CodeLabConfig => ({
  id, title, intro: <p>{intro}</p>, bridge, cell: { title: cellTitle, starter, solution, checks, expose: [], presets }, reflections: [{ question: <>{reflection[0]}</>, answer: <>{reflection[1]}</> }], footer: <>{footer}</>,
});

/* MS01 */
const S1 = `def reduction(baseline, candidate):
    return 0.0   # TODO 1: how much smaller the candidate's error is, as a share of the baseline's

def fair(a, b):
    return False   # TODO 2: True only if both setups used the same rows, metric and tuning budget

baseline = {"rows": "val-2026", "metric": "MAE", "budget": 20}
candidate = {"rows": "val-2026", "metric": "MAE", "budget": 20}
print("reduction from 12 to 9:", reduction(12, 9))
print("fair?", fair(baseline, candidate), " with a bigger budget:", fair(baseline, {**candidate, "budget": 200}))
`;
const S1_SOL = swap(S1, [
  ["    return 0.0   # TODO 1: how much smaller the candidate's error is, as a share of the baseline's", "    return (baseline - candidate) / baseline"],
  ["    return False   # TODO 2: True only if both setups used the same rows, metric and tuning budget", "    return all(a[k] == b[k] for k in (\"rows\", \"metric\", \"budget\"))"],
]);
const S1_C = CHECK_PRELUDE + `
try:
    results.append({"name": "from 12 to 9 is a 25% reduction", "passed": _close(reduction(12, 9), 0.25), "hint": "reduction gave %r. It is (12 − 9) ÷ 12, a share of the baseline, not 25 accuracy points." % (reduction(12, 9),)})
    results.append({"name": "identical setups are fair", "passed": fair(baseline, candidate) is True, "hint": "fair should be True when rows, metric and budget all match."})
    results.append({"name": "a larger tuning budget makes it unfair", "passed": fair(baseline, {**candidate, "budget": 200}) is False, "hint": "More tuning attempts for one model changes the race, so fair should be False."})
    results.append({"name": "a different metric or different rows is also unfair", "passed": fair(baseline, {**candidate, "metric": "RMSE"}) is False and fair(baseline, {**candidate, "rows": "val-easy"}) is False, "hint": "Check all three keys: rows, metric and budget."})
${fail}`;
export const MS1_CODE = mk("msfaircode", "Same course, same ruler", "A comparison is only as good as its setup. Two tiny functions put the setup into code you can check.", [{ math: "reduction = (base − cand) ÷ base", code: "(baseline - candidate) / baseline", note: "A share of the baseline error." }, { math: "same rows, metric, budget", code: "all(a[k] == b[k] ...)", note: "A fair race." }], "reduction() and fair()", S1, S1_SOL, S1_C, ["A candidate was tuned for 200 attempts and the baseline for 20. The candidate wins. Is it a better algorithm?", "Not proven. It had ten times the tuning effort, so the win may come from the effort rather than the method."], "Going from an error of 12 to 9 is a 25% reduction. The comparison is fair only if both used the same rows, metric and tuning budget.");

/* MS02 */
const S2 = `def n_fits(c_values, gamma_values, folds):
    return 0   # TODO 1: fits needed to try every combination on every fold

def with_refit(c_values, gamma_values, folds):
    return 0   # TODO 2: the same, plus one final refit of the winner

def overlaps(dev_ids, test_ids):
    return False   # TODO 3: True if any row is in both development and final test

print("3 C values, 2 gamma values, 3 folds →", n_fits(3, 2, 3), "fits;", with_refit(3, 2, 3), "with the refit")
print("overlap?", overlaps([1, 2, 3], [3, 4]))
`;
const S2_SOL = swap(S2, [
  ["    return 0   # TODO 1: fits needed to try every combination on every fold", "    return c_values * gamma_values * folds"],
  ["    return 0   # TODO 2: the same, plus one final refit of the winner", "    return n_fits(c_values, gamma_values, folds) + 1"],
  ["    return False   # TODO 3: True if any row is in both development and final test", "    return len(set(dev_ids) & set(test_ids)) > 0"],
]);
const S2_C = CHECK_PRELUDE + `
try:
    results.append({"name": "3 × 2 × 3 = 18 candidate-fold fits", "passed": n_fits(3, 2, 3) == 18, "hint": "n_fits gave %r. Multiply the three counts." % (n_fits(3, 2, 3),)})
    results.append({"name": "the refit adds one", "passed": with_refit(3, 2, 3) == 19, "hint": "with_refit gave %r. 18 candidate-fold fits plus the refit." % (with_refit(3, 2, 3),)})
    results.append({"name": "a shared row between development and test is caught", "passed": overlaps([1, 2, 3], [3, 4]) is True and overlaps([1, 2], [3, 4]) is False, "hint": "overlaps should be True only when a row appears in both lists."})
    results.append({"name": "doubling the folds doubles the work", "passed": n_fits(3, 2, 6) == 2 * n_fits(3, 2, 3), "hint": "The number of fits grows in proportion to each of the three factors."})
${fail}`;
export const MS2_CODE = mk("mssearchcode", "Count what the search costs", "Searching is not free, and the test rows must never join it. Both facts fit in a few lines.", [{ math: "fits = C × γ × folds", code: "c_values * gamma_values * folds", note: "Every combination on every fold." }, { math: "dev ∩ test = ∅", code: "set(dev_ids) & set(test_ids)", note: "The test is touched once." }], "n_fits(), with_refit() and overlaps()", S2, S2_SOL, S2_C, ["You tried 18 settings and report the best score. What else should you report?", "How many settings you tried and how they were scored. The best of many is optimistic by chance alone."], "A grid of 3 C values, 2 gamma values and 3 folds needs 18 candidate-fold fits, plus one refit.");

/* MS03 */
const S3 = `def kfold(n, k):
    return []   # TODO 1: split rows 0..n−1 into k contiguous folds (earlier folds get the extra rows)

def nested_fits(outer, inner, candidates):
    return 0   # TODO 2: each outer fold runs candidates × inner fits, then one refit

def disjoint(train_idx, test_idx):
    return False   # TODO 3: True if no row is in both lists

folds = kfold(10, 3)
print("folds:", folds)
print("fits for 3 outer, 2 inner, 4 candidates:", nested_fits(3, 2, 4))
`;
const S3_SOL = swap(S3, [
  ["    return []   # TODO 1: split rows 0..n−1 into k contiguous folds (earlier folds get the extra rows)", "    sizes = [n // k + (1 if i < n % k else 0) for i in range(k)]\n    out, start = [], 0\n    for s in sizes:\n        out.append(list(range(start, start + s)))\n        start += s\n    return out"],
  ["    return 0   # TODO 2: each outer fold runs candidates × inner fits, then one refit", "    return outer * (candidates * inner + 1)"],
  ["    return False   # TODO 3: True if no row is in both lists", "    return len(set(train_idx) & set(test_idx)) == 0"],
]);
const S3_C = CHECK_PRELUDE + `
try:
    results.append({"name": "10 rows in 3 folds → sizes 4, 3, 3", "passed": [len(f) for f in kfold(10, 3)] == [4, 3, 3], "hint": "kfold gave sizes %r. The first n %% k folds get one extra row." % ([len(f) for f in kfold(10, 3)],)})
    results.append({"name": "the folds cover every row exactly once", "passed": sorted(i for f in kfold(10, 3) for i in f) == list(range(10)), "hint": "Every row index from 0 to 9 must appear in exactly one fold."})
    results.append({"name": "3 outer, 2 inner, 4 candidates → 27 fits", "passed": nested_fits(3, 2, 4) == 27, "hint": "nested_fits gave %r. Each outer fold: 4 × 2 inner fits plus 1 refit = 9, times 3." % (nested_fits(3, 2, 4),)})
    results.append({"name": "an outer test fold is disjoint from its training rows", "passed": disjoint([0, 1, 2], [3, 4]) is True and disjoint([0, 1, 2], [2, 3]) is False, "hint": "disjoint should be False as soon as one row is in both lists."})
${fail}`;
export const MS3_CODE = mk("msnestedcode", "Folds inside folds", "Nested validation is two loops, each with its own boundary. Counting the fits shows the price.", [{ math: "outer × (candidates × inner + 1)", code: "outer * (candidates * inner + 1)", note: "A search in every outer fold." }, { math: "train ∩ test = ∅", code: "set(train_idx) & set(test_idx)", note: "Per fold." }], "kfold(), nested_fits() and disjoint()", S3, S3_SOL, S3_C, ["The outer score is 0.81. Is that the score of the final model?", "No. It estimates how well the whole selection procedure works. The final model is refit on all development rows and is a different object."], "Ten rows split into three folds give sizes 4, 3 and 3. Three outer folds, two inner folds and four candidates need 27 fits.");

/* MS04 */
const S4 = `ps = ${toPy(PS)}
ys = ${toPy(YS)}   # 1 = the customer left

def counts(ps, ys, t):
    tp = fp = tn = fn = 0
    for p, y in zip(ps, ys):
        guess = 1 if p >= t else 0
        # TODO 1: add one to tp, fp, tn or fn
    return tp, fp, tn, fn

def total_cost(fp, fn, cost_fp, cost_fn):
    return 0   # TODO 2: false alarms times their cost plus misses times theirs

def cheapest(ps, ys, cost_fp, cost_fn, bars):
    return bars[0]   # TODO 3: the bar with the lowest total cost (the first wins a tie)

print("10 misses at 10 each and 2 wasted calls at 1 each:", total_cost(2, 10, 1, 10))
bars = [round(0.05 * i, 2) for i in range(1, 20)]
print("cheapest bar when a miss costs 10:", cheapest(ps, ys, 1, 10, bars))
`;
const S4_SOL = swap(S4, [
  ["        # TODO 1: add one to tp, fp, tn or fn", "        if guess and y:\n            tp += 1\n        elif guess:\n            fp += 1\n        elif y:\n            fn += 1\n        else:\n            tn += 1"],
  ["    return 0   # TODO 2: false alarms times their cost plus misses times theirs", "    return fp * cost_fp + fn * cost_fn"],
  ["    return bars[0]   # TODO 3: the bar with the lowest total cost (the first wins a tie)", "    def cost(t):\n        _, f_p, _, f_n = counts(ps, ys, t)\n        return total_cost(f_p, f_n, cost_fp, cost_fn)\n    best = bars[0]\n    for t in bars:\n        if cost(t) < cost(best):\n            best = t\n    return best"],
]);
const S4_C = CHECK_PRELUDE + `
try:
    results.append({"name": "p = [.2, .6, .8], y = [0, 1, 1] at 0.7: TP 1, FP 0, TN 1, FN 1", "passed": tuple(counts([0.2, 0.6, 0.8], [0, 1, 1], 0.7)) == (1, 0, 1, 1), "hint": "counts gave %r. Only 0.8 is flagged." % (tuple(counts([0.2, 0.6, 0.8], [0, 1, 1], 0.7)),)})
    results.append({"name": "10 misses at 10 and 2 false alarms at 1 cost 102", "passed": total_cost(2, 10, 1, 10) == 102, "hint": "total_cost gave %r. It is 2×1 + 10×10." % (total_cost(2, 10, 1, 10),)})
    bars = [round(0.05 * i, 2) for i in range(1, 20)]
    c_cheap = cheapest(ps, ys, 1, 10, bars); c_picky = cheapest(ps, ys, 10, 1, bars)
    results.append({"name": "when misses are costly the cheapest bar is lower", "passed": c_cheap < c_picky, "hint": "cheapest gave %r (misses costly) and %r (wasted calls costly). Costly misses should push the bar down." % (c_cheap, c_picky)})
${fail}`;
export const MS4_CODE = mk("mscostcode", "Price the mistakes, then pick the bar", "Once each mistake has a price, choosing the bar is arithmetic. The hard part is agreeing on the prices.", [{ math: "cost = c_FP·FP + c_FN·FN", code: "fp * cost_fp + fn * cost_fn", note: "Total price of the mistakes." }, { math: "pick argmin cost", code: "cost(t) < cost(best)", note: "Not argmax accuracy." }], "counts(), total_cost() and cheapest()", S4, S4_SOL, S4_C, ["The bar with the lowest cost has lower accuracy than the default. Is something wrong?", "No. Accuracy treats every mistake as equal. If a miss costs ten times a wasted call, trading some accuracy for fewer misses is the point."], "Ten misses at 10 each and two wasted calls at 1 each cost 102. A different bar may cost less while reducing overall accuracy.");

/* MS05 */
const S5 = `def drop(base, after):
    return 0.0   # TODO 1: how far the score fell when the column was shuffled (can be negative)

def rank_by_drop(drops):
    return []   # TODO 2: the column names, biggest drop first; drops is a dict like {"tenure": 0.12}

print("0.80 → 0.68 is a drop of", round(drop(0.80, 0.68), 2))
print("0.50 → 0.52 is a drop of", round(drop(0.50, 0.52), 2))
print("ranking:", rank_by_drop({"tenure": 0.12, "complaints": 0.2, "noise": -0.01}))
`;
const S5_SOL = swap(S5, [
  ["    return 0.0   # TODO 1: how far the score fell when the column was shuffled (can be negative)", "    return base - after"],
  ["    return []   # TODO 2: the column names, biggest drop first; drops is a dict like {\"tenure\": 0.12}", "    return sorted(drops, key=lambda k: -drops[k])"],
]);
const S5_C = CHECK_PRELUDE + `
try:
    results.append({"name": "0.80 → 0.68 is a drop of 0.12", "passed": _close(drop(0.80, 0.68), 0.12), "hint": "drop gave %r. It is base − after." % (drop(0.80, 0.68),)})
    results.append({"name": "a score that rises when shuffled gives a negative drop", "passed": _close(drop(0.50, 0.52), -0.02), "hint": "Do not clip at zero: a column can look slightly helpful by chance."})
    results.append({"name": "the ranking puts the biggest drop first", "passed": rank_by_drop({"tenure": 0.12, "complaints": 0.2, "noise": -0.01}) == ["complaints", "tenure", "noise"], "hint": "rank_by_drop gave %r. Sort by drop, largest first." % (rank_by_drop({"tenure": 0.12, "complaints": 0.2, "noise": -0.01}),)})
${fail}`;
export const MS5_CODE = mk("msreliancecode", "What leaned on what", "Permutation importance is a subtraction and a sort. The skill is in saying what it does not mean.", [{ math: "drop = score − score(shuffled)", code: "base - after", note: "Reliance of this model on this column." }], "drop() and rank_by_drop()", S5, S5_SOL, S5_C, ["The score drops by 0.12 when 'tenure' is shuffled. If you change a customer's tenure, will the chance of leaving change by 12%?", "Not necessarily. The drop says the model relied on tenure in this sample. It is not a causal effect of changing it."], "A held-out score that falls from 0.80 to 0.68 when one column is shuffled is a drop of 0.12. That is reliance by this model, not a 12% causal effect.");

/* MS06 */
const S6 = `def choose(simple, complex_, tolerance):
    return "complex"   # TODO 1: "simple" if the complex model's lead is no more than tolerance, otherwise "complex"

def missing(record, required):
    return []   # TODO 2: the required keys that are not in the record

required = ["seed", "data_version", "metric", "threshold"]
record = {"seed": 7, "metric": "balanced accuracy"}
print("0.82 vs 0.83 with a tolerance of 0.02 →", choose(0.82, 0.83, 0.02))
print("missing from the record:", missing(record, required))
`;
const S6_SOL = swap(S6, [
  ["    return \"complex\"   # TODO 1: \"simple\" if the complex model's lead is no more than tolerance, otherwise \"complex\"", "    return \"simple\" if complex_ - simple <= tolerance else \"complex\""],
  ["    return []   # TODO 2: the required keys that are not in the record", "    return [k for k in required if k not in record]"],
]);
const S6_C = CHECK_PRELUDE + `
try:
    results.append({"name": "a 0.01 lead inside a 0.02 tolerance keeps the simple model", "passed": choose(0.82, 0.83, 0.02) == "simple", "hint": "choose gave %r. A lead of 0.01 does not exceed the tolerance of 0.02." % (choose(0.82, 0.83, 0.02),)})
    results.append({"name": "a 0.05 lead beyond the tolerance picks the complex model", "passed": choose(0.82, 0.87, 0.02) == "complex", "hint": "A lead larger than the tolerance justifies the extra complexity."})
    results.append({"name": "a lead exactly at the tolerance still keeps the simple model", "passed": choose(0.5, 0.52, 0.02 + 1e-9) == "simple", "hint": "The rule is lead <= tolerance."})
    results.append({"name": "the record is missing the data version and threshold", "passed": sorted(missing(record, required)) == ["data_version", "threshold"], "hint": "missing gave %r. List the required keys not present." % (missing(record, required),)})
${fail}`;
export const MS6_CODE = mk("msdecidecode", "Write the decision down", "A final choice is only reproducible if the rule and the record are both written down. Two functions capture them.", [{ math: "keep simple if lead ≤ tolerance", code: "complex_ - simple <= tolerance", note: "The price you would pay." }, { math: "record everything needed to rerun", code: "[k for k in required if k not in record]", note: "Seed, data, metric, threshold." }], "choose() and missing()", S6, S6_SOL, S6_C, ["The forest is 0.01 better than the tree but harder to audit. What should decide?", "Whether 0.01 matters for the cost of mistakes in this task. If it does not, the simpler model is adequate and easier to defend."], "A small tree and a forest differing by 0.01 may favour the tree if the forest costs more and is harder to audit, unless the task's mistakes justify the extra complexity.");
