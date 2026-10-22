"use client";
import { CHECK_PRELUDE, preset } from "./helpers";
import { FAIL, cfg } from "./la-code";

/* 1 · events */
const EV_S = `import random

FACES = [1, 2, 3, 4, 5, 6]

def probability(event):
    return 0.0   # TODO 1: favourable outcomes divided by total outcomes

def simulate(event, rolls, seed=1):
    rng = random.Random(seed)
    hits = 0
    for _ in range(rolls):
        face = rng.choice(FACES)
        # TODO 2: count a hit when the face is in the event
        pass
    return hits / rolls

even = [2, 4, 6]
print("exact    :", probability(even))
print("10 rolls :", simulate(even, 10))
print("20000    :", simulate(even, 20000))
`;
export const PR_EV = cfg("prev", "Compute a probability, then test it by simulation", "You will write the exact answer (count) and a simulation (roll), then see them agree.", "probability() and simulate()", EV_S,
  [["    return 0.0   # TODO 1: favourable outcomes divided by total outcomes", "    return len(event) / len(FACES)"], ["        # TODO 2: count a hit when the face is in the event\n        pass", "        if face in event:\n            hits += 1"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "P(even) = 0.5", "passed": _close(probability([2, 4, 6]), 0.5), "hint": "probability returned %r. Three favourable faces out of six." % (probability([2, 4, 6]),)})
    results.append({"name": "P(a six) = 1/6, P(any face) = 1, P(no face) = 0", "passed": _close(probability([6]), 1 / 6) and _close(probability(FACES), 1.0) and _close(probability([]), 0.0), "hint": "Every probability is between 0 and 1: the whole sample space is 1 and the empty event is 0."})
    s = simulate([2, 4, 6], 20000)
    results.append({"name": "20,000 simulated rolls land near 0.5", "passed": abs(s - 0.5) < 0.02, "hint": "simulate returned %r. Count a hit when the rolled face is in the event, then divide hits by rolls." % (s,)})
    results.append({"name": "The complement: P(not {1,2}) = 4/6", "passed": _close(1 - probability([1, 2]), 4 / 6), "hint": "1 − probability([1, 2]) should be 4/6, about 0.667."})
` + FAIL,
  [{ math: "P(A) = favourable / total", code: "len(event) / len(FACES)", note: "Equally likely outcomes." }, { math: "long-run share", code: "hits / rolls", note: "Simulation approaches the probability as rolls grow." }],
  [preset("Try the event {5, 6}", "The exact answer is 1/3.", /^even = \[2, 4, 6\]/m, "even = [5, 6]")], ["After 10 rolls the share was not 0.5. Is the die broken?", "No. A few rolls scatter widely around the probability. The share only settles near 0.5 as the number of rolls grows."], "The exact answer for {2, 4, 6} is 3 ÷ 6 = 0.5, and 20,000 rolls land within about 0.01 of it.");

/* 2 · grid */
const GR_S = `def pairs():
    return []    # TODO 1: every ordered pair (a, b) with a and b from 1 to 6

def prob(test):
    ps = pairs()
    return 0.0   # TODO 2: the share of pairs for which test(a, b) is True

print("pairs:", len(pairs()))
print("sum is 7:", prob(lambda a, b: a + b == 7))
print("at least one six:", prob(lambda a, b: a == 6 or b == 6))
`;
export const PR_GR = cfg("prgrid", "Enumerate every outcome of two dice", "Listing the sample space is the most reliable way to avoid miscounting.", "pairs() and prob()", GR_S,
  [["    return []    # TODO 1: every ordered pair (a, b) with a and b from 1 to 6", "    return [(a, b) for a in range(1, 7) for b in range(1, 7)]"], ["    return 0.0   # TODO 2: the share of pairs for which test(a, b) is True", "    return sum(1 for a, b in ps if test(a, b)) / len(ps)"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "There are 36 ordered pairs", "passed": len(pairs()) == 36 and len(set(pairs())) == 36, "hint": "pairs() returned %d items. Use two nested loops over 1..6 so (1, 2) and (2, 1) are both included." % (len(pairs()),)})
    results.append({"name": "P(sum is 7) = 6/36", "passed": _close(prob(lambda a, b: a + b == 7), 6 / 36), "hint": "prob returned %r. Six pairs make 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)." % (prob(lambda a, b: a + b == 7),)})
    results.append({"name": "P(at least one six) = 11/36", "passed": _close(prob(lambda a, b: a == 6 or b == 6), 11 / 36), "hint": "prob returned %r. Count the pairs where either die shows a six; there are 11." % (prob(lambda a, b: a == 6 or b == 6),)})
    results.append({"name": "Independence: P(both even) = P(first even) × P(second even)", "passed": _close(prob(lambda a, b: a % 2 == 0 and b % 2 == 0), 0.5 * 0.5), "hint": "Nine of 36 pairs have both dice even, which is 1/4 = 1/2 × 1/2."})
` + FAIL,
  [{ math: "sample space", code: "[(a, b) for a in range(1, 7) for b in range(1, 7)]", note: "All 36 equally likely pairs." }, { math: "P(A) = |A| / |Ω|", code: "sum(1 for a, b in ps if test(a, b)) / len(ps)", note: "Count, then divide." }],
  [preset("Ask about a double instead", "Six of 36, so 1/6.", /print\("sum is 7:", prob\(lambda a, b: a \+ b == 7\)\)/, 'print("double:", prob(lambda a, b: a == b))')], ["Why is 7 the most common sum of two dice?", "More pairs make 7 (six of them) than any other total, and every pair is equally likely. Counting the grid, not guessing, explains it."], "The playground and this cell agree: 11 of 36 pairs contain a six, so P = 11/36.");

/* 3 · conditional */
const CD_S = `# each student is (group, passed): "s" studied, "r" did not
students = [("s", True)] * 60 + [("s", False)] * 20 + [("r", True)] * 30 + [("r", False)] * 90

def p_pass(group=None):
    pool = students   # TODO 1: if group is given, keep only the students in that group
    return 0.0        # TODO 2: passes in the pool divided by the size of the pool

print("everyone       :", p_pass())
print("given studied  :", p_pass("s"))
print("given not      :", p_pass("r"))
`;
export const PR_CD = cfg("prcond", "Condition on a group in code", "Conditioning is filtering: shrink the population, then count again.", "p_pass()", CD_S,
  [["    pool = students   # TODO 1: if group is given, keep only the students in that group", "    pool = students if group is None else [s for s in students if s[0] == group]"], ["    return 0.0        # TODO 2: passes in the pool divided by the size of the pool", "    return sum(1 for _, ok in pool if ok) / len(pool)"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "P(pass) over everyone = 0.45", "passed": _close(p_pass(), 0.45), "hint": "p_pass() returned %r. 90 passes out of 200 students." % (p_pass(),)})
    results.append({"name": "P(pass | studied) = 0.75", "passed": _close(p_pass("s"), 0.75), "hint": "p_pass('s') returned %r. Only the 80 students who studied are in the pool: 60 / 80." % (p_pass("s"),)})
    results.append({"name": "P(pass | did not study) = 0.25", "passed": _close(p_pass("r"), 0.25), "hint": "p_pass('r') returned %r. The pool is the 120 who did not study: 30 / 120." % (p_pass("r"),)})
    results.append({"name": "Conditioning changes the answer", "passed": p_pass("s") > p_pass(), "hint": "The probability given that a student studied should be higher than the overall probability."})
` + FAIL,
  [{ math: "P(A | B)", code: "[s for s in students if s[0] == group]", note: "Keep only the cases where B holds." }, { math: "count(A and B) / count(B)", code: "sum(1 for _, ok in pool if ok) / len(pool)", note: "The new denominator is the filtered pool." }],
  [preset("Show the group sizes", "Shows 200, 80 and 120.", /^print\("everyone       :", p_pass\(\)\)/m, 'print("sizes:", len(students), sum(1 for s in students if s[0] == "s"), sum(1 for s in students if s[0] == "r"))\nprint("everyone       :", p_pass())')], ["Does passing depend on studying, in this data?", "Yes: 75% of studiers pass against 25% of the others, so knowing the group changes the probability. Whether studying causes passing is a separate question that the table alone cannot answer."], "The playground and this cell give the same three numbers: 0.45, 0.75 and 0.25.");

/* 4 · bayes */
const BY_S = `def posterior(prevalence, sensitivity, false_positive, n=10000):
    sick = prevalence * n
    healthy = n - sick
    true_pos = 0.0    # TODO 1: sick people who test positive
    false_pos = 0.0   # TODO 2: healthy people who test positive
    if true_pos + false_pos == 0:
        return 0.0
    return true_pos / (true_pos + false_pos)

print("rare disease  :", round(posterior(0.01, 0.9, 0.09), 4))
print("common disease:", round(posterior(0.20, 0.9, 0.09), 4))
`;
export const PR_BY = cfg("prbayes", "Compute P(sick | positive) from counts", "Natural frequencies (counting people) turn Bayes' rule into two multiplications and a division.", "posterior()", BY_S,
  [["    true_pos = 0.0    # TODO 1: sick people who test positive", "    true_pos = sick * sensitivity"], ["    false_pos = 0.0   # TODO 2: healthy people who test positive", "    false_pos = healthy * false_positive"]],
  CHECK_PRELUDE + `try:
    a = posterior(0.01, 0.9, 0.09)
    results.append({"name": "Rare disease: P(sick | positive) is about 0.0917", "passed": abs(a - 0.0917431) < 1e-4, "hint": "posterior returned %r. Of 10,000 people, 90 sick people test positive and 891 healthy people do: 90 / 981." % (a,)})
    b = posterior(0.2, 0.9, 0.09)
    results.append({"name": "Common disease: about 0.7143", "passed": abs(b - 0.7142857) < 1e-4, "hint": "posterior returned %r. 1,800 true positives against 720 false ones: 1800 / 2520." % (b,)})
    results.append({"name": "The base rate matters: same test, higher prevalence, higher posterior", "passed": b > a, "hint": "The same test gives a much more reliable positive when the disease is common."})
    results.append({"name": "A perfect test gives certainty", "passed": _close(posterior(0.01, 1.0, 0.0), 1.0), "hint": "With sensitivity 1 and false-positive rate 0 every positive is a true positive."})
` + FAIL,
  [{ math: "true positives", code: "sick * sensitivity", note: "Sick people the test catches." }, { math: "false positives", code: "healthy * false_positive", note: "Healthy people it wrongly flags." }],
  [preset("A better test (3% false alarms)", "A rare disease becomes much easier to trust.", /print\("rare disease  :", round\(posterior\(0\.01, 0\.9, 0\.09\), 4\)\)/, 'print("rare disease  :", round(posterior(0.01, 0.9, 0.03), 4))')], ["A 90%-accurate test came back positive. Is there a 90% chance you are sick?", "No. The chance depends on how common the disease is. When it is rare, most positives come from the large healthy group, so the chance can be under 10%."], "For a 1% disease the posterior is 90 ÷ 981 ≈ 0.092, matching the playground.");

/* 5 · binomial */
const BN_S = `import math

def pmf(n, p):
    return []    # TODO 1: for k = 0..n, math.comb(n, k) * p**k * (1 - p)**(n - k)

def mean(dist):
    return 0.0   # TODO 2: add up k * probability for each value k

def variance(dist):
    m = mean(dist)
    return sum((k - m) ** 2 * q for k, q in enumerate(dist))

dist = pmf(10, 0.5)
print("probabilities add to", round(sum(dist), 6))
print("mean", mean(dist), "variance", variance(dist))
`;
export const PR_BN = cfg("prbinom", "Build a distribution and read off its mean", "A distribution is a list of probabilities that adds to 1. The mean and variance come straight from it.", "pmf() and mean()", BN_S,
  [["    return []    # TODO 1: for k = 0..n, math.comb(n, k) * p**k * (1 - p)**(n - k)", "    return [math.comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(n + 1)]"], ["    return 0.0   # TODO 2: add up k * probability for each value k", "    return sum(k * q for k, q in enumerate(dist))"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "pmf(2, 0.5) = [0.25, 0.5, 0.25]", "passed": len(pmf(2, 0.5)) == 3 and all(_close(a, b) for a, b in zip(pmf(2, 0.5), [0.25, 0.5, 0.25])), "hint": "pmf(2, 0.5) returned %r. There are n + 1 = 3 values (0, 1 or 2 heads)." % (pmf(2, 0.5),)})
    results.append({"name": "The probabilities add to 1", "passed": _close(sum(pmf(10, 0.3)), 1.0), "hint": "Every distribution sums to 1. Check the formula: comb(n, k) * p**k * (1 - p)**(n - k)."})
    results.append({"name": "mean of 10 flips at p = 0.5 is 5; at p = 0.3 it is 3", "passed": _close(mean(pmf(10, 0.5)), 5.0) and _close(mean(pmf(10, 0.3)), 3.0), "hint": "mean returned %r. It should equal n × p." % (mean(pmf(10, 0.5)),)})
    results.append({"name": "variance of 10 flips at p = 0.5 is 2.5", "passed": _close(variance(pmf(10, 0.5)), 2.5), "hint": "variance uses mean(); once mean works this is n·p·(1−p) = 2.5."})
` + FAIL,
  [{ math: "P(k) = C(n, k) pᵏ (1−p)ⁿ⁻ᵏ", code: "math.comb(n, k) * p ** k * (1 - p) ** (n - k)", note: "Ways to place k heads, times their probability." }, { math: "E[X] = Σ k P(k)", code: "sum(k * q for k, q in enumerate(dist))", note: "A weighted average of the values." }],
  [preset("Make the coin biased (p = 0.3)", "The mean should be 3.", /^dist = pmf\(10, 0\.5\)/m, "dist = pmf(10, 0.3)")], ["Why does the variance shrink as p moves towards 0 or 1?", "When the coin almost always lands the same way, the count hardly varies. The spread n·p·(1−p) is largest at p = 0.5, where each flip is most uncertain."], "For 10 flips of a fair coin the mean is 5 and the variance is 2.5, as the playground shows.");

/* 6 · threshold */
const TH_S = `SCORES = [0.95, 0.9, 0.8, 0.7, 0.6, 0.4, 0.35, 0.3, 0.2, 0.1]   # model's probability of spam
LABELS = [1, 1, 1, 0, 1, 1, 0, 0, 0, 0]                             # 1 = really spam

def confusion(t):
    tp = fp = fn = tn = 0
    for s, y in zip(SCORES, LABELS):
        flagged = s >= t
        # TODO 1: add 1 to exactly one of tp, fp, fn, tn
        pass
    return tp, fp, fn, tn

def precision_recall(t):
    tp, fp, fn, tn = confusion(t)
    return 0.0, 0.0   # TODO 2: precision = tp / (tp + fp), recall = tp / (tp + fn)

for t in (0.3, 0.5, 0.8):
    print(t, confusion(t), precision_recall(t))
`;
export const PR_TH = cfg("prml", "From scores to decisions: confusion counts, precision and recall", "Every classifier turns a probability into a yes or no with a threshold. These counts tell you what that choice costs.", "confusion() and precision_recall()", TH_S,
  [["        # TODO 1: add 1 to exactly one of tp, fp, fn, tn\n        pass", "        if flagged and y == 1:\n            tp += 1\n        elif flagged:\n            fp += 1\n        elif y == 1:\n            fn += 1\n        else:\n            tn += 1"], ["    return 0.0, 0.0   # TODO 2: precision = tp / (tp + fp), recall = tp / (tp + fn)", "    return (tp / (tp + fp) if tp + fp else 0.0), (tp / (tp + fn) if tp + fn else 0.0)"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "At 0.5: 4 caught, 1 false alarm, 1 missed, 4 correctly kept", "passed": confusion(0.5) == (4, 1, 1, 4), "hint": "confusion(0.5) returned %r; it should be (4, 1, 1, 4). Flagged and spam is a TP, flagged and not spam is an FP." % (confusion(0.5),)})
    pr = precision_recall(0.5)
    results.append({"name": "At 0.5: precision 0.8 and recall 0.8", "passed": _close(pr[0], 0.8) and _close(pr[1], 0.8), "hint": "precision_recall(0.5) returned %r. Precision = 4/5 flagged; recall = 4/5 real spam." % (pr,)})
    hi = precision_recall(0.8)
    results.append({"name": "At 0.8: perfect precision but recall falls to 0.6", "passed": _close(hi[0], 1.0) and _close(hi[1], 0.6), "hint": "precision_recall(0.8) returned %r. Only three emails are flagged, all spam; but 2 of 5 real spam are missed." % (hi,)})
    lo = precision_recall(0.3)
    results.append({"name": "At 0.3: perfect recall but precision falls to 0.625", "passed": _close(lo[1], 1.0) and _close(lo[0], 0.625), "hint": "precision_recall(0.3) returned %r. Eight emails are flagged, five of them spam: 5/8." % (lo,)})
` + FAIL,
  [{ math: "precision = TP / (TP + FP)", code: "tp / (tp + fp)", note: "Of the flagged, how many are right." }, { math: "recall = TP / (TP + FN)", code: "tp / (tp + fn)", note: "Of the real spam, how much we caught." }],
  [preset("Add a threshold of 0.6", "In between: precision 0.8 and recall 0.8.", /for t in \(0\.3, 0\.5, 0\.8\):/, "for t in (0.3, 0.5, 0.6, 0.8):")], ["A spam filter and a cancer screen both use a threshold. Should they set it the same way?", "No. Missing cancer is far costlier than a false alarm, so a screen favours recall; a spam filter that hides real email favours precision. The threshold encodes the cost of each mistake."], "At threshold 0.5 the table is 4 / 1 / 1 / 4 and precision and recall are both 0.8, as in the playground.");
