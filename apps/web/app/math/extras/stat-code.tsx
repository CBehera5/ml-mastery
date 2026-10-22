"use client";
import { CHECK_PRELUDE, preset } from "./helpers";
import { FAIL, cfg } from "./la-code";

/* 1 · data */
const DA_S = `table = {
    "Area (sq ft)":   [850, 1200, 640, 1500, 980, 2100, 760, 1320],
    "Bedrooms":       [2, 3, 1, 3, 2, 4, 2, 3],
    "City":           ["Pune", "Hyderabad", "Pune", "Chennai", "Hyderabad", "Pune", "Chennai", "Hyderabad"],
    "Price (₹ lakh)": [52, 78, 38, 95, 61, 140, 44, 85],
}

def is_numerical(values):
    return False   # TODO 1: True when every value is an int or a float

def describe(table):
    kinds = {}
    for name, values in table.items():
        pass       # TODO 2: kinds[name] = "numerical" or "categorical"
    return kinds

print("observations:", len(next(iter(table.values()))))
print("variables   :", len(table))
print(describe(table))
`;
export const ST_DA = cfg("stdata", "Describe a dataset in code", "Before any statistic, ask what each column is. Code can make that first step routine.", "is_numerical() and describe()", DA_S,
  [["    return False   # TODO 1: True when every value is an int or a float", "    return all(isinstance(v, (int, float)) for v in values)"], ["        pass       # TODO 2: kinds[name] = \"numerical\" or \"categorical\"", "        kinds[name] = \"numerical\" if is_numerical(values) else \"categorical\""]],
  CHECK_PRELUDE + `try:
    results.append({"name": "is_numerical accepts numbers and rejects labels", "passed": is_numerical([1, 2.5, 3]) and not is_numerical(["a", "b"]) and not is_numerical([1, "a"]), "hint": "is_numerical([1, 'a']) should be False: every value must be a number, not just the first."})
    d = describe(table)
    results.append({"name": "City is categorical; area, bedrooms and price are numerical", "passed": d.get("City") == "categorical" and d.get("Area (sq ft)") == "numerical" and d.get("Bedrooms") == "numerical" and d.get("Price (₹ lakh)") == "numerical", "hint": "describe returned %r. Loop over table.items() and use is_numerical(values)." % (d,)})
    results.append({"name": "One observation per row: all columns have the same length (8)", "passed": len({len(v) for v in table.values()}) == 1 and len(table["City"]) == 8, "hint": "Every variable must be measured for every case, so every column has 8 values."})
` + FAIL,
  [{ math: "numerical vs categorical", code: "isinstance(v, (int, float))", note: "Can you add and average the values?" }],
  [preset("Add a postcode column stored as numbers", "A number that is really a label. Does your function catch it? (It does not, which is the point.)", /^    "City":/m, '    "Postcode":       [411001, 500001, 411001, 600001, 500001, 411001, 600001, 500001],\n    "City":')], ["A column of postcodes is stored as integers. Is it numerical?", "As stored, yes. As meant, no: averaging postcodes is meaningless. Code sees types; you decide what the values mean."], "The table has 8 observations and 4 variables: three numerical and one categorical.");

/* 2 · centre */
const CE_S = `def mean(xs):
    return 0.0   # TODO 1: the sum divided by the count

def median(xs):
    return 0.0   # TODO 2: sort, then take the middle value (average the two middle values if the count is even)

prices = [42, 45, 48, 50, 52, 55, 58, 60, 70]
print("mean  :", round(mean(prices), 2), "median:", median(prices))
prices[-1] = 250
print("after a villa -> mean:", round(mean(prices), 2), "median:", median(prices))
`;
export const ST_CE = cfg("stcenter", "See why the median resists outliers", "Write both summaries, then watch only one of them move.", "mean() and median()", CE_S,
  [["    return 0.0   # TODO 1: the sum divided by the count", "    return sum(xs) / len(xs)"], ["    return 0.0   # TODO 2: sort, then take the middle value (average the two middle values if the count is even)", "    s = sorted(xs)\n    m = len(s) // 2\n    return s[m] if len(s) % 2 else (s[m - 1] + s[m]) / 2"]],
  CHECK_PRELUDE + `try:
    base = [42, 45, 48, 50, 52, 55, 58, 60]
    results.append({"name": "mean([2, 4]) = 3", "passed": _close(mean([2, 4]), 3.0), "hint": "mean returned %r. Add the values and divide by how many there are." % (mean([2, 4]),)})
    results.append({"name": "median of an odd list: the middle value after sorting (52)", "passed": median(base + [70]) == 52 and median([3, 1, 2]) == 2, "hint": "median([3, 1, 2]) returned %r. Sort first, then take the middle." % (median([3, 1, 2]),)})
    results.append({"name": "median of an even list averages the middle two: [1,2,3,4] → 2.5", "passed": _close(median([1, 2, 3, 4]), 2.5), "hint": "median([1,2,3,4]) returned %r. With an even count, average the two middle values." % (median([1, 2, 3, 4]),)})
    results.append({"name": "A ₹250 lakh villa pulls the mean to about 73.3 but leaves the median at 52", "passed": abs(mean(base + [250]) - 73.3333) < 1e-3 and median(base + [250]) == 52, "hint": "mean should be 660 / 9 = 73.33 and median should still be 52."})
` + FAIL,
  [{ math: "x̄ = Σx / n", code: "sum(xs) / len(xs)", note: "The balance point." }, { math: "median", code: "s[m] if len(s) % 2 else (s[m - 1] + s[m]) / 2", note: "The middle of the sorted list." }],
  [preset("Make the last house ₹55 lakh instead", "Mean and median agree.", /^prices\[-1\] = 250/m, "prices[-1] = 55")], ["A report says the average house price in a city is ₹1.2 crore. What would you ask?", "Whether that is the mean or the median, and how skewed the prices are. A few luxury homes can drag the mean far above what a typical buyer pays."], "With the villa, the mean is 660 ÷ 9 ≈ 73.3 and the median is 52, as in the playground.");

/* 3 · spread */
const SP_S = `import math

def mean(xs):
    return sum(xs) / len(xs)

def variance(xs, sample=False):
    m = mean(xs)
    total = 0.0    # TODO 1: the sum of squared distances from the mean
    n = len(xs) - 1 if sample else len(xs)
    return total / n

def std(xs, sample=False):
    return 0.0     # TODO 2: the square root of the variance

tight = [46, 48, 50, 50, 50, 52, 54]
wide = [30, 40, 50, 50, 50, 60, 70]
for name, xs in (("tight", tight), ("wide", wide)):
    print(name, "mean", mean(xs), "std", round(std(xs), 3), "sample std", round(std(xs, sample=True), 3))
`;
export const ST_SP = cfg("stspread", "Measure spread two ways", "The mean cannot tell the two neighbourhoods apart. The standard deviation can.", "variance() and std()", SP_S,
  [["    total = 0.0    # TODO 1: the sum of squared distances from the mean", "    total = sum((x - m) ** 2 for x in xs)"], ["    return 0.0     # TODO 2: the square root of the variance", "    return math.sqrt(variance(xs, sample))"]],
  CHECK_PRELUDE + `try:
    t = [46, 48, 50, 50, 50, 52, 54]; w = [30, 40, 50, 50, 50, 60, 70]
    results.append({"name": "Population variance of the tight data is 40/7 ≈ 5.714", "passed": abs(variance(t) - 40 / 7) < 1e-9, "hint": "variance returned %r. Add up (x − mean)² for each value: 16 + 4 + 0 + 0 + 0 + 4 + 16 = 40, then divide by 7." % (variance(t),)})
    results.append({"name": "Sample variance divides by n − 1: 40/6 ≈ 6.667", "passed": abs(variance(t, sample=True) - 40 / 6) < 1e-9, "hint": "With sample=True the divisor is len(xs) − 1 = 6."})
    results.append({"name": "Standard deviations: tight ≈ 2.390, wide ≈ 11.952", "passed": abs(std(t) - 2.3905) < 1e-3 and abs(std(w) - 11.9523) < 1e-3, "hint": "std returned %r and %r. It is the square root of the variance." % (std(t), std(w))})
    results.append({"name": "Same mean, very different spread", "passed": _close(mean(t), mean(w)) and std(w) > 4 * std(t), "hint": "Both neighbourhoods average 50, but the wide one's standard deviation should be about five times larger."})
` + FAIL,
  [{ math: "σ² = Σ(x − x̄)² / n", code: "sum((x - m) ** 2 for x in xs) / n", note: "Average squared distance from the mean." }, { math: "σ = √σ²", code: "math.sqrt(variance(xs, sample))", note: "Back to the original units." }],
  [preset("Add one extreme house to the wide group", "The standard deviation jumps.", /^wide = \[30, 40, 50, 50, 50, 60, 70\]/m, "wide = [30, 40, 50, 50, 50, 60, 70, 150]")], ["Why square the distances instead of just adding them?", "Distances above and below the mean cancel out and always add to zero. Squaring makes every distance positive and also punishes large deviations more."], "For the tight data the population variance is 40 ÷ 7 ≈ 5.71 and the standard deviation about 2.39, as the playground shows.");

/* 4 · distributions */
const HI_S = `scores = [35, 42, 48, 50, 52, 53, 55, 56, 58, 60, 61, 62, 63, 64, 65,
          66, 67, 68, 70, 71, 72, 73, 75, 76, 78, 80, 82, 85, 90, 98]

def median(xs):
    s = sorted(xs)
    m = len(s) // 2
    return s[m] if len(s) % 2 else (s[m - 1] + s[m]) / 2

def quartiles(xs):
    s = sorted(xs)
    half = len(s) // 2
    lower = s[:half]
    upper = s[half:]   # TODO 1: with an odd count, skip the middle value: s[half + len(s) % 2:]
    return median(lower), median(s), median(upper)

def histogram(xs, width, start):
    counts = [0] * (int((max(xs) - start) // width) + 1)
    for x in xs:
        pass           # TODO 2: add 1 to the bin number (x - start) // width
    return counts

print(quartiles(scores))
print(histogram(scores, 10, 30))
`;
export const ST_HI = cfg("sthist", "Build a histogram and a five-number summary", "A histogram is counting with a choice (the bin width). The quartiles need no choice at all.", "quartiles() and histogram()", HI_S,
  [["    upper = s[half:]   # TODO 1: with an odd count, skip the middle value: s[half + len(s) % 2:]", "    upper = s[half + len(s) % 2:]"], ["        pass           # TODO 2: add 1 to the bin number (x - start) // width", "        counts[int((x - start) // width)] += 1"]],
  CHECK_PRELUDE + `try:
    q = quartiles(scores)
    results.append({"name": "Quartiles of the 30 scores are 56, 65.5 and 75", "passed": q == (56, 65.5, 75), "hint": "quartiles returned %r. The median of the lower half is 56, the median overall 65.5, the median of the upper half 75." % (q,)})
    results.append({"name": "Odd counts skip the middle value: quartiles([1..7]) = (2, 4, 6)", "passed": quartiles([1, 2, 3, 4, 5, 6, 7]) == (2, 4, 6), "hint": "quartiles([1,2,3,4,5,6,7]) returned %r. For 7 values the middle one (4) belongs to neither half." % (quartiles([1, 2, 3, 4, 5, 6, 7]),)})
    h = histogram(scores, 10, 30)
    results.append({"name": "Bins of width 10 from 30 hold 1, 2, 6, 9, 7, 3, 2 students", "passed": h == [1, 2, 6, 9, 7, 3, 2], "hint": "histogram returned %r. Each score goes into bin (x − start) // width." % (h,)})
    results.append({"name": "Every score lands in exactly one bin (counts add to 30), for any width", "passed": sum(histogram(scores, 4, 30)) == 30 and sum(histogram(scores, 25, 30)) == 30, "hint": "The bin counts must add to the number of scores, whatever the bin width."})
` + FAIL,
  [{ math: "bin = ⌊(x − start) / width⌋", code: "int((x - start) // width)", note: "Which bin a value falls in." }, { math: "IQR = Q3 − Q1", code: "q3 - q1", note: "The spread of the middle half." }],
  [preset("Use bins of width 5", "More bins, a noisier picture.", /histogram\(scores, 10, 30\)/, "histogram(scores, 5, 30)")], ["A colleague shows a histogram with bins so wide there are only two bars. What might be hidden?", "Gaps, several peaks or outliers. Always try a few bin widths before trusting a single picture."], "With width 10 the counts are 1, 2, 6, 9, 7, 3, 2, as in the playground, and the quartiles are 56, 65.5 and 75.");

/* 5 · relationships */
const RE_S = `import math

def mean(xs):
    return sum(xs) / len(xs)

def correlation(xs, ys):
    mx, my = mean(xs), mean(ys)
    sxy = sxx = syy = 0.0
    for x, y in zip(xs, ys):
        pass       # TODO 1: add (x-mx)*(y-my) to sxy, (x-mx)**2 to sxx and (y-my)**2 to syy
    return 0.0 if sxx == 0 or syy == 0 else sxy / math.sqrt(sxx * syy)

def slope(xs, ys):
    return 0.0     # TODO 2: sum((x - mx) * (y - my)) divided by sum((x - mx) ** 2)

area = [1, 1.2, 1.5, 1.8, 2, 2.2, 2.5, 2.8, 3, 3.5]
price = [40, 46, 52, 58, 63, 68, 75, 80, 88, 100]
print("r without the odd point:", round(correlation(area, price), 3))
print("r with it              :", round(correlation(area + [1], price + [120]), 3))
`;
export const ST_RE = cfg("strel", "Compute a correlation and see an outlier move it", "Correlation is a recipe: centre both variables, multiply, normalise. One odd point can change it.", "correlation() and slope()", RE_S,
  [["        pass       # TODO 1: add (x-mx)*(y-my) to sxy, (x-mx)**2 to sxx and (y-my)**2 to syy", "        sxy += (x - mx) * (y - my)\n        sxx += (x - mx) ** 2\n        syy += (y - my) ** 2"], ["    return 0.0     # TODO 2: sum((x - mx) * (y - my)) divided by sum((x - mx) ** 2)", "    mx, my = mean(xs), mean(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "A perfect upward line has r = 1", "passed": _close(correlation([1, 2, 3, 4], [3, 5, 7, 9]), 1.0), "hint": "correlation returned %r. Accumulate sxy, sxx and syy inside the loop." % (correlation([1, 2, 3, 4], [3, 5, 7, 9]),)})
    results.append({"name": "A perfect downward line has r = −1", "passed": _close(correlation([1, 2, 3, 4], [9, 7, 5, 3]), -1.0), "hint": "Going down together in opposite directions should give r = −1."})
    results.append({"name": "A weak pattern: r = −1/√5 ≈ −0.447", "passed": abs(correlation([1, 2, 3, 4], [2, 1, 2, 1]) + 0.4472136) < 1e-6, "hint": "correlation([1,2,3,4],[2,1,2,1]) returned %r." % (correlation([1, 2, 3, 4], [2, 1, 2, 1]),)})
    results.append({"name": "slope of y = 2x + 1 is 2", "passed": _close(slope([1, 2, 3, 4], [3, 5, 7, 9]), 2.0), "hint": "slope returned %r. It is the sum of (x−mx)(y−my) divided by the sum of (x−mx)²." % (slope([1, 2, 3, 4], [3, 5, 7, 9]),)})
    results.append({"name": "One strange house lowers r", "passed": correlation(area + [1], price + [120]) < correlation(area, price) - 0.1, "hint": "Adding a small house priced at 120 should visibly lower the correlation."})
` + FAIL,
  [{ math: "r = Σ(x−x̄)(y−ȳ) / √(Σ(x−x̄)² Σ(y−ȳ)²)", code: "sxy / math.sqrt(sxx * syy)", note: "Co-movement, scaled to −1…1." }, { math: "slope = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²", code: "sum(...) / sum(...)", note: "The best-fit line's tilt." }],
  [preset("Make the extra house cost 50", "A near-normal point barely changes r.", /area \+ \[1\], price \+ \[120\]/, "area + [1], price + [50]")], ["Two variables have r = 0.9. Can you say one causes the other?", "No. They move together, but a hidden third factor, or the reverse direction, could explain it. Correlation is evidence of association, not a cause."], "Without the odd house, r is about 0.998; with a ₹120 lakh house of 1,000 sq ft it falls sharply, as in the playground.");

/* 6 · sampling */
const SA_S = `import math
import random

def mean(xs):
    return sum(xs) / len(xs)

def sample_means(n, trials, seed=1):
    rng = random.Random(seed)
    means = []
    for _ in range(trials):
        sample = [40 + rng.expovariate(1 / 30) for _ in range(n)]   # a skewed price population
        means.append(0.0)    # TODO 1: the mean of this sample
    return means

def standard_error(sigma, n):
    return 0.0               # TODO 2: sigma divided by the square root of n

def spread(xs):
    m = mean(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1))

for n in (5, 25, 100):
    ms = sample_means(n, 2000)
    print(f"n={n:<4} mean of means {mean(ms):6.2f}   spread {spread(ms):5.2f}   theory {standard_error(30, n):5.2f}")
`;
export const ST_SA = cfg("stsamp", "Simulate a sampling distribution", "Draw thousands of samples from a skewed population and measure how their means behave.", "sample_means() and standard_error()", SA_S,
  [["        means.append(0.0)    # TODO 1: the mean of this sample", "        means.append(sum(sample) / n)"], ["    return 0.0               # TODO 2: sigma divided by the square root of n", "    return sigma / math.sqrt(n)"]],
  CHECK_PRELUDE + `try:
    m25 = sample_means(25, 2000); m100 = sample_means(100, 2000)
    results.append({"name": "standard_error(30, 25) = 6 and standard_error(30, 100) = 3", "passed": _close(standard_error(30, 25), 6.0) and _close(standard_error(30, 100), 3.0), "hint": "standard_error(30, 25) returned %r. It is sigma / sqrt(n)." % (standard_error(30, 25),)})
    results.append({"name": "The mean of the sample means is near the population mean 70", "passed": abs(mean(m25) - 70) < 1.5, "hint": "mean(sample_means(25, 2000)) returned %r. Each entry should be the average of that sample." % (mean(m25),)})
    results.append({"name": "Their spread for n = 25 is near the standard error, 6", "passed": abs(spread(m25) - 6) < 0.8, "hint": "spread returned %r; expected about 6. Check that each entry is a sample mean." % (spread(m25),)})
    results.append({"name": "Bigger samples give a narrower distribution (n = 100 is about 3)", "passed": spread(m100) < spread(m25) and abs(spread(m100) - 3) < 0.5, "hint": "spread for n = 100 returned %r. It should be about half of the n = 25 spread." % (spread(m100),)})
` + FAIL,
  [{ math: "SE = σ / √n", code: "sigma / math.sqrt(n)", note: "How much a sample mean wobbles." }, { math: "sample mean", code: "sum(sample) / n", note: "One draw from the sampling distribution." }],
  [preset("Try samples of 400", "The spread is about 1.5.", /for n in \(5, 25, 100\):/, "for n in (5, 25, 100, 400):")], ["Why does ten times the data give only about three times the precision?", "The standard error shrinks with the square root of n, and the square root of 10 is about 3.2. Each further gain in accuracy costs more data than the last."], "For samples of 25 the standard error is 30 ÷ 5 = 6, and the simulated spread lands close to it.");

/* 7 · ML */
const ML_S = `import math

def accuracy_interval(correct, n):
    p = correct / n
    se = 0.0               # TODO 1: the standard error sqrt(p * (1 - p) / n)
    low, high = p, p       # TODO 2: p - 1.96 * se and p + 1.96 * se, kept between 0 and 1
    return low, high

for n in (25, 100, 400, 1600):
    low, high = accuracy_interval(round(0.8 * n), n)
    print(f"n={n:<5} accuracy 0.80  interval {low:.3f} to {high:.3f}")
`;
export const ST_ML = cfg("stml", "Put an error bar on an accuracy", "A test accuracy is an estimate from one sample. A confidence interval says how much to trust it.", "accuracy_interval()", ML_S,
  [["    se = 0.0               # TODO 1: the standard error sqrt(p * (1 - p) / n)", "    se = math.sqrt(p * (1 - p) / n)"], ["    low, high = p, p       # TODO 2: p - 1.96 * se and p + 1.96 * se, kept between 0 and 1", "    low, high = max(0.0, p - 1.96 * se), min(1.0, p + 1.96 * se)"]],
  CHECK_PRELUDE + `try:
    lo, hi = accuracy_interval(80, 100)
    results.append({"name": "80 of 100 correct: interval 0.7216 to 0.8784", "passed": abs(lo - 0.7216) < 1e-4 and abs(hi - 0.8784) < 1e-4, "hint": "accuracy_interval(80, 100) returned %r. se = sqrt(0.8 × 0.2 / 100) = 0.04, so the interval is 0.8 ± 0.0784." % ((lo, hi),)})
    lo2, hi2 = accuracy_interval(1280, 1600)
    results.append({"name": "Sixteen times the data: half-width about 0.0196", "passed": abs((hi2 - lo2) / 2 - 0.0196) < 1e-4, "hint": "With n = 1600 the standard error is 0.01, so the half-width is 1.96 × 0.01 = 0.0196."})
    results.append({"name": "More data, narrower interval", "passed": (hi2 - lo2) < (hi - lo) / 3, "hint": "Going from n = 100 to 1600 should shrink the width by a factor of 4."})
    results.append({"name": "The interval never leaves 0 to 1", "passed": accuracy_interval(100, 100) == (1.0, 1.0) and accuracy_interval(0, 100) == (0.0, 0.0) and accuracy_interval(99, 100)[1] <= 1.0, "hint": "Clip the ends with max(0.0, ...) and min(1.0, ...)."})
` + FAIL,
  [{ math: "SE = √(p(1−p)/n)", code: "math.sqrt(p * (1 - p) / n)", note: "Uncertainty of a proportion." }, { math: "p ± 1.96·SE", code: "p - 1.96 * se, p + 1.96 * se", note: "A 95% interval." }],
  [preset("Test only 25 examples", "A very wide interval.", /for n in \(25, 100, 400, 1600\):/, "for n in (25,):")], ["Model A scores 82% and model B 80% on the same 100 test examples. Is A better?", "Not necessarily. Each estimate has an interval of about ±8 points, and the intervals overlap heavily. A real difference needs more test data or a paired comparison."], "For 80 of 100 correct, the interval is 0.8 ± 0.0784, matching the playground.");
