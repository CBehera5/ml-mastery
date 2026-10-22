"use client";
import type { CodeLabConfig } from "../../linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "../../../math/extras/helpers";

/* NB01 · prior × evidence */
export const EVIDENCE_STARTER = `prior_good = 0.6    # before looking: 60% of past pages were Good
like_good = 0.5     # a runnable example appears in 50% of Good pages
like_needs = 0.25   # ...and in 25% of Needs Improvement pages

def scores(prior_good, like_good, like_needs):
    return (0.0, 0.0)   # TODO 1: (prior × likelihood) for Good, then for Needs Improvement. The two priors add to 1.

def normalize(good_score, needs_score):
    return 0.0   # TODO 2: the chance the page is Good = good_score ÷ (good_score + needs_score)

g, n = scores(prior_good, like_good, like_needs)
print("scores:", round(g, 3), round(n, 3))
print("chance the page is Good:", round(normalize(g, n), 3))
`;
export const EVIDENCE_SOLUTION = swap(EVIDENCE_STARTER, [
  ["    return (0.0, 0.0)   # TODO 1: (prior × likelihood) for Good, then for Needs Improvement. The two priors add to 1.", "    return (prior_good * like_good, (1 - prior_good) * like_needs)"],
  ["    return 0.0   # TODO 2: the chance the page is Good = good_score ÷ (good_score + needs_score)", "    return good_score / (good_score + needs_score)"],
]);
export const EVIDENCE_CHECKS = CHECK_PRELUDE + `
try:
    a, b = scores(0.6, 0.5, 0.25)
    results.append({"name": "scores(0.6, 0.5, 0.25) = (0.30, 0.10)", "passed": _close(a, 0.30) and _close(b, 0.10), "hint": "scores returned (%r, %r). Multiply each class's prior by its likelihood; the Needs Improvement prior is 1 − prior_good." % (a, b)})
    results.append({"name": "normalize(0.30, 0.10) = 0.75", "passed": _close(normalize(0.30, 0.10), 0.75), "hint": "normalize returned %r. Divide the Good score by the sum of both scores." % (normalize(0.30, 0.10),)})
    a, b = scores(0.1, 0.5, 0.25)
    results.append({"name": "rare Good pages: prior 0.1 gives a 18.2% chance of Good", "passed": _close(normalize(a, b), 0.05 / 0.275), "hint": "With a prior of 0.1 the scores should be 0.05 and 0.225, giving about 0.182. A rare class needs stronger evidence."})
    a, b = scores(0.6, 0.4, 0.4)
    results.append({"name": "evidence that fits both classes equally leaves the prior unchanged", "passed": _close(normalize(a, b), 0.6), "hint": "If both likelihoods are equal the answer should stay at the prior, 0.6."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const EVIDENCE_CODE: CodeLabConfig = {
  id: "nbevidencecode", title: "Turn a prior and some evidence into a chance", intro: <p>Naive Bayes is two steps: weigh each class by how common it is and how well the evidence fits it, then rescale so the chances add to 1.</p>,
  bridge: [{ math: "score_c = P(c) · P(x | c)", code: "prior_good * like_good", note: "How common the class is, times how well the evidence fits it." }, { math: "P(Good | x) = score_Good ÷ (score_Good + score_Needs)", code: "good_score / (good_score + needs_score)", note: "Rescale so the two classes add to 100%." }],
  cell: { title: "scores() and normalize()", starter: EVIDENCE_STARTER, solution: EVIDENCE_SOLUTION, checks: EVIDENCE_CHECKS, expose: [], presets: [preset("Good pages are rare", "Same evidence, rarer class.", /^prior_good = [^\s#]+/m, "prior_good = 0.1")] },
  reflections: [{ question: <>Why is 0.5 (a runnable example appears in Good pages) not the same as 0.75 (the page is Good)?</>, answer: <>0.5 answers “how often do Good pages have an example”. 0.75 answers the reverse question, “given an example, how likely is Good”. They differ because the second also depends on how common Good pages are.</> }],
  footer: <>With a prior of 0.6 and likelihoods 0.5 and 0.25, the scores are 0.30 and 0.10, so the page is Good with chance 0.75.</>,
};

/* NB02 · smoothing */
export const SMOOTH_STARTER = `tokens = ["deploy", "rollback", "TODO", "deprecated"]
good_counts = [6, 2, 1, 1]     # word counts in 10 Good pages
needs_counts = [3, 2, 5, 0]    # word counts in 10 Needs Improvement pages
alpha = 1                      # the pretend count added to every word

def smoothed(counts, alpha):
    return [0.0 for c in counts]   # TODO 1: (count + alpha) ÷ (total of all counts + alpha × number of words), for each word

def chance_good(word, alpha):
    i = tokens.index(word)
    g = smoothed(good_counts, alpha)[i]
    n = smoothed(needs_counts, alpha)[i]
    return 0.0   # TODO 2: with equal priors, the chance a page containing only this word is Good: g ÷ (g + n)

print("needs shares:", [round(x, 3) for x in smoothed(needs_counts, alpha)])
print("page with only 'deprecated' is Good with chance", round(chance_good("deprecated", alpha), 3))
`;
export const SMOOTH_SOLUTION = swap(SMOOTH_STARTER, [
  ["    return [0.0 for c in counts]   # TODO 1: (count + alpha) ÷ (total of all counts + alpha × number of words), for each word", "    total = sum(counts) + alpha * len(counts)\n    return [(c + alpha) / total for c in counts]"],
  ["    return 0.0   # TODO 2: with equal priors, the chance a page containing only this word is Good: g ÷ (g + n)", "    return g / (g + n)"],
]);
export const SMOOTH_CHECKS = CHECK_PRELUDE + `
try:
    s = smoothed([2, 0], 1)
    results.append({"name": "smoothed([2, 0], 1) = [3/4, 1/4]", "passed": _close(s[0], 0.75) and _close(s[1], 0.25), "hint": "smoothed returned %r. The denominator is 2 + 1 × 2 = 4, and each count gets +1." % (s,)})
    results.append({"name": "the shares add up to 1", "passed": _close(sum(smoothed(needs_counts, 1)), 1.0), "hint": "The shares must add to 1. Check that the denominator includes alpha × the number of words."})
    results.append({"name": "without smoothing, an unseen word has probability 0", "passed": smoothed(needs_counts, 0)[3] == 0, "hint": "With alpha = 0 the word 'deprecated' was never seen in Needs Improvement pages, so its share is 0."})
    results.append({"name": "with alpha = 1, a page with only “deprecated” is Good with chance 2/3", "passed": _close(chance_good("deprecated", 1), 2 / 3), "hint": "chance_good returned %r. With alpha = 1 the shares are 2/14 (Good) and 1/14 (Needs), so the chance is 2/3." % (chance_good("deprecated", 1),)})
    results.append({"name": "without smoothing the same page is declared certainly Good", "passed": _close(chance_good("deprecated", 0), 1.0), "hint": "With alpha = 0 the Needs share is 0, so g ÷ (g + 0) = 1. That overconfidence is the problem smoothing fixes."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const SMOOTH_CODE: CodeLabConfig = {
  id: "nbsmoothcode", title: "Add a pretend count so nothing is impossible", intro: <p>Counting words gives shares. A word that has never appeared in a class would get a share of exactly 0, which silently rules that class out. A small pretend count fixes it.</p>,
  bridge: [{ math: "θ_j = (N_j + α) ÷ (Σ N + α·V)", code: "(c + alpha) / total", note: "V is the number of words in the vocabulary." }],
  cell: { title: "smoothed() and chance_good()", starter: SMOOTH_STARTER, solution: SMOOTH_SOLUTION, checks: SMOOTH_CHECKS, expose: [], presets: [preset("No smoothing", "See the overconfidence.", /^alpha = \d+(\.\d+)?/m, "alpha = 0"), preset("Smoothing of 2", "A stronger pretend count.", /^alpha = \d+(\.\d+)?/m, "alpha = 2")] },
  reflections: [{ question: <>Why must the vocabulary come from training pages only?</>, answer: <>If words from the test pages sneak into the vocabulary, the model has already seen what it is being tested on, and its score will look better than it deserves.</> }],
  footer: <>With alpha = 1, “deprecated” gets shares 2/14 and 1/14, so a page with only that word is Good with chance 2/3, a sensible answer instead of a certainty.</>,
};

/* NB03 · Gaussian likelihoods */
export const GAUSS_STARTER = `import math

good = (-0.5, 1.0)    # (mean, variance) of the reading-level score on Good pages
needs = (1.0, 1.0)    # ...and on Needs Improvement pages

def density(x, mean, variance):
    return 0.0   # TODO 1: the bell curve  exp(-(x - mean)² / (2 · variance)) ÷ sqrt(2π · variance)

def chance_good(x, copies=1, prior_good=0.5):
    g = prior_good * density(x, *good) ** copies
    n = (1 - prior_good) * density(x, *needs) ** copies
    return 0.0   # TODO 2: rescale so the two scores add to 1: g ÷ (g + n)

print("one measurement:   ", round(chance_good(0.0), 3))
print("counted four times:", round(chance_good(0.0, copies=4), 3))
`;
export const GAUSS_SOLUTION = swap(GAUSS_STARTER, [
  ["    return 0.0   # TODO 1: the bell curve  exp(-(x - mean)² / (2 · variance)) ÷ sqrt(2π · variance)", "    return math.exp(-((x - mean) ** 2) / (2 * variance)) / math.sqrt(2 * math.pi * variance)"],
  ["    return 0.0   # TODO 2: rescale so the two scores add to 1: g ÷ (g + n)", "    return g / (g + n)"],
]);
export const GAUSS_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "density(0, 0, 1) = 0.398942", "passed": _close(density(0, 0, 1), 0.3989422804), "hint": "density(0, 0, 1) returned %r. At the mean of a unit bell curve the height is 1 ÷ sqrt(2π)." % (density(0, 0, 1),)})
    results.append({"name": "a narrow curve can be taller than 1: density(0, 0, 0.01) = 3.9894", "passed": _close(density(0, 0, 0.01), 3.989422804), "hint": "density(0, 0, 0.01) returned %r. A height above 1 is fine, it is a density, not a probability." % (density(0, 0, 0.01),)})
    ref = (0.5 * 0.35206533) / (0.5 * 0.35206533 + 0.5 * 0.24197072)
    results.append({"name": "one measurement of 0.0 gives about 59% Good", "passed": abs(chance_good(0.0) - ref) < 1e-6, "hint": "chance_good(0.0) returned %r; the reference is about 0.593." % (chance_good(0.0),)})
    results.append({"name": "counting the same measurement four times makes the model more confident", "passed": chance_good(0.0, copies=4) > chance_good(0.0) + 0.15, "hint": "Four copies should multiply the evidence four times, so the chance must rise noticeably. Check that copies is used in g and n."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const GAUSS_CODE: CodeLabConfig = {
  id: "nbgausscode", title: "Read a bell curve instead of a count", intro: <p>For a measurement such as a reading-level score, each class gets a bell curve. The curve's height at your value is how well the value fits the class.</p>,
  bridge: [{ math: "f(x) = exp(−(x − μ)² / 2σ²) ÷ √(2πσ²)", code: "math.exp(-((x - mean) ** 2) / (2 * variance)) / math.sqrt(2 * math.pi * variance)", note: "The height of the curve at x." }],
  cell: { title: "density() and chance_good()", starter: GAUSS_STARTER, solution: GAUSS_SOLUTION, checks: GAUSS_CHECKS, expose: [], presets: [preset("A score closer to Needs Improvement", "Move the measurement.", /chance_good\(0\.0\)/, "chance_good(1.0)")] },
  reflections: [{ question: <>Why does counting the same measurement four times push the answer toward certainty?</>, answer: <>Naive Bayes treats each feature as independent evidence and multiplies their effects. A copied feature is not new evidence, but the model counts it as if it were.</> }],
  footer: <>One measurement of 0.0 gives about 59% Good. Counted four times it climbs to about 82% with nothing new learned.</>,
};

/* NB04 · probability quality */
export const CONF_STARTER = `import math

def log_loss(p_true):
    return 0.0   # TODO 1: minus the natural log of the probability the model gave to what really happened

def brier(p_needs, really_needs):
    return 0.0   # TODO 2: (p_needs − really_needs) squared, where really_needs is 1 if the page needs improvement, else 0

def p_needs(copies, lean=-2.2):
    """The evidence leans toward Good by 2.2 log-odds per copy. The page really needs improvement."""
    return 1 / (1 + math.exp(-copies * lean))

for copies in (1, 2, 4, 8):
    p = p_needs(copies)
    print(copies, "copies: truth gets", round(p, 6), " log loss", round(log_loss(p), 2), " Brier", round(brier(p, 1), 3))
`;
export const CONF_SOLUTION = swap(CONF_STARTER, [
  ["    return 0.0   # TODO 1: minus the natural log of the probability the model gave to what really happened", "    return -math.log(p_true)"],
  ["    return 0.0   # TODO 2: (p_needs − really_needs) squared, where really_needs is 1 if the page needs improvement, else 0", "    return (p_needs - really_needs) ** 2"],
]);
export const CONF_CHECKS = CHECK_PRELUDE + `
try:
    results.append({"name": "log_loss(0.5) = ln 2", "passed": _close(log_loss(0.5), math.log(2)), "hint": "log_loss(0.5) returned %r. It is −ln(p) where p is the chance given to the truth." % (log_loss(0.5),)})
    results.append({"name": "log_loss(0.1) = 2.3026", "passed": _close(log_loss(0.1), 2.302585093), "hint": "log_loss(0.1) returned %r." % (log_loss(0.1),)})
    results.append({"name": "brier(0.1, 1) = 0.81 and brier(0.1, 0) = 0.01", "passed": _close(brier(0.1, 1), 0.81) and _close(brier(0.1, 0), 0.01), "hint": "brier returned (%r, %r). Square the gap between the predicted chance and 1 (or 0)." % (brier(0.1, 1), brier(0.1, 0))})
    results.append({"name": "eight copies: log loss keeps growing but Brier stays below 1", "passed": log_loss(p_needs(8)) > 17 and brier(p_needs(8), 1) < 1.0001, "hint": "Log loss at eight copies should be above 17; Brier is capped near 1."})
except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const CONF_CODE: CodeLabConfig = {
  id: "nbconfcode", title: "Score the confidence, not just the label", intro: <p>Two models can give the same label yet differ in how sure they sound. Log loss and the Brier score both look at the chance the model gave to what really happened.</p>,
  bridge: [{ math: "log loss = −ln p", code: "-math.log(p_true)", note: "p is the chance given to the true class." }, { math: "Brier = (p − y)²", code: "(p_needs - really_needs) ** 2", note: "y is 1 when the page really needs improvement." }],
  cell: { title: "log_loss() and brier()", starter: CONF_STARTER, solution: CONF_SOLUTION, checks: CONF_CHECKS, expose: [], presets: [preset("Only the first three copies", "A shorter table.", /for copies in \(1, 2, 4, 8\)/, "for copies in (1, 2, 3)")] },
  reflections: [{ question: <>The label was wrong at every copy count. Why does it still matter that confidence grew?</>, answer: <>A reviewer who sees “98% sure” stops checking. The more confident a wrong model is, the more damage a miss does. Log loss makes that cost visible; accuracy hides it.</> }],
  footer: <>One copy gives the truth a 10% chance (log loss 2.31). Eight copies give it almost none (log loss 17.6), while accuracy shows the same wrong label.</>,
};
