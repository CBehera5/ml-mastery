"""Bounded, deterministic probability.v1 reference calculations."""
import math


def probability(value):
    if isinstance(value, bool) or not math.isfinite(value) or not 0 <= value <= 1:
        raise ValueError("Probability must be between 0 and 1")
    return value


def count_probability(favorable, total):
    if any(not isinstance(value, int) or isinstance(value, bool) or abs(value) > 9007199254740991 for value in [favorable, total]) or not 0 <= favorable <= total or total <= 0:
        raise ValueError("Whole counts and positive total required")
    return favorable / total


def event_trace(both, only_a, only_b, neither):
    counts = [both, only_a, only_b, neither]
    if any(not isinstance(value, int) or isinstance(value, bool) or value < 0 for value in counts) or sum(counts) > 1_000_000:
        raise ValueError("Invalid counts")
    total = sum(counts)
    joint = count_probability(both, total)
    p_a, p_b = (both + only_a) / total, (both + only_b) / total
    return dict(contract="probability.v1", total=total, pA=p_a, pB=p_b, joint=joint, union=(both + only_a + only_b) / total, complementA=1-p_a, conditional=None if both + only_b == 0 else both / (both + only_b), independent=abs(joint-p_a*p_b) < 1e-12)


def bayes_trace(prior, sensitivity, false_positive_rate):
    for value in [prior, sensitivity, false_positive_rate]:
        probability(value)
    true_positive = prior*sensitivity
    false_positive = (1-prior)*false_positive_rate
    evidence = true_positive+false_positive
    return dict(contract="probability.v1", prior=prior, sensitivity=sensitivity, falsePositiveRate=false_positive_rate, truePositive=true_positive, falsePositive=false_positive, evidence=evidence, posterior=None if evidence == 0 else true_positive/evidence)


def binomial_trace(trials, success_probability):
    if not isinstance(trials, int) or isinstance(trials, bool) or not 1 <= trials <= 30:
        raise ValueError("Trials must be 1–30")
    probability(success_probability)
    mass = [math.comb(trials, successes)*success_probability**successes*(1-success_probability)**(trials-successes) for successes in range(trials+1)]
    accumulated, cdf = 0, []
    for value in mass:
        accumulated += value
        cdf.append(min(1, accumulated))
    return dict(contract="probability.v1", mass=mass, cdf=cdf, expectation=trials*success_probability, variance=trials*success_probability*(1-success_probability))


def normal_density(value, mean, deviation):
    if not all(math.isfinite(item) for item in [value, mean, deviation]) or deviation <= 0:
        raise ValueError("Finite inputs and positive deviation required")
    standardized = (value-mean)/deviation
    density = math.exp(-0.5*standardized*standardized)/(deviation*math.sqrt(2*math.pi))
    if not math.isfinite(density):
        raise ValueError("Density exceeds numerical range")
    return density


def simulate_outcomes(sides, draws, seed):
    if sides not in [2, 6] or isinstance(draws, bool) or not isinstance(draws, int) or not 1 <= draws <= 10000 or isinstance(seed, bool) or not isinstance(seed, int) or not 0 <= seed <= 0xffffffff:
        raise ValueError("Invalid simulation inputs")
    counts, state = [0]*sides, seed
    for _ in range(draws):
        state = (1664525*state+1013904223) & 0xffffffff
        counts[(state*sides)//4294967296] += 1
    return dict(contract="probability.v1", sides=sides, draws=draws, seed=seed, counts=counts)


def normal_interval(lower_z, upper_z):
    if not all(math.isfinite(value) for value in [lower_z, upper_z]) or lower_z < -8 or upper_z > 8 or lower_z > upper_z:
        raise ValueError("Use ordered standardized limits within -8 to 8")
    steps, width = 1024, (upper_z-lower_z)/1024
    total = normal_density(lower_z, 0, 1)+normal_density(upper_z, 0, 1)
    for index in range(1, steps):
        total += (2 if index % 2 == 0 else 4)*normal_density(lower_z+width*index, 0, 1)
    return min(1, max(0, total*width/3))


def threshold_trace(threshold):
    probability(threshold)
    rows = [dict(score=score, actual=actual, predicted=int(score >= threshold)) for score, actual in zip([.9, .7, .6, .4, .3, .1], [1, 0, 1, 0, 1, 0])]
    result = dict(rows=rows)
    for name, actual, predicted in [("truePositive", 1, 1), ("falsePositive", 0, 1), ("falseNegative", 1, 0), ("trueNegative", 0, 0)]:
        result[name] = sum(row["actual"] == actual and row["predicted"] == predicted for row in rows)
    return result


def binary_log_loss(actual, predicted):
    if isinstance(actual, bool) or actual not in [0, 1]:
        raise ValueError("Binary actual required")
    probability(predicted)
    assigned = predicted if actual == 1 else 1-predicted
    return math.inf if assigned == 0 else -math.log(assigned)
