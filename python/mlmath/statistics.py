"""Bounded statistics.v1 reference calculations; missing/nonfinite data is rejected."""
import math


def dataset(values, minimum=1):
    if not minimum <= len(values) <= 1000 or any(isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or abs(value) > 1e12 for value in values):
        raise ValueError("Finite complete bounded dataset required")


def middle(sorted_values):
    index = len(sorted_values)//2
    return sorted_values[index] if len(sorted_values) % 2 else sorted_values[index-1]+(sorted_values[index]-sorted_values[index-1])/2


def summary_trace(values, convention="population"):
    if convention not in ["population", "sample"]:
        raise ValueError("Declare denominator")
    dataset(values, 2 if convention == "sample" else 1)
    ordered, count = sorted(values), len(values)
    origin = values[0]
    mean = origin+math.fsum(value-origin for value in values)/count
    denominator = count-1 if convention == "sample" else count
    variance = math.fsum((value-mean)**2 for value in values)/denominator
    median, half = middle(ordered), count//2
    q1 = middle(ordered[:half]) if half else median
    q3 = middle(ordered[-half:]) if half else median
    frequencies = {value: ordered.count(value) for value in ordered}
    peak = max(frequencies.values())
    modes = [] if peak == 1 else [value for value, frequency in frequencies.items() if frequency == peak]
    iqr = q3-q1
    lower_fence, upper_fence = q1-1.5*iqr, q3+1.5*iqr
    central = [value for value in ordered if lower_fence <= value <= upper_fence]
    return dict(contract="statistics.v1", count=count, convention=convention, denominator=denominator, mean=mean, median=median, modes=modes, minimum=ordered[0], maximum=ordered[-1], range=ordered[-1]-ordered[0], variance=variance, standardDeviation=math.sqrt(variance), q1=q1, q3=q3, iqr=iqr, lowerFence=lower_fence, upperFence=upper_fence, whiskerLow=central[0], whiskerHigh=central[-1], outliers=[value for value in ordered if value < lower_fence or value > upper_fence])


def paired_statistics_trace(x, y, convention="sample"):
    if len(x) != len(y):
        raise ValueError("Equal pair lengths required")
    dataset(x, 2)
    dataset(y, 2)
    first, second = summary_trace(x, convention), summary_trace(y, convention)
    cross = math.fsum((left-first["mean"])*(right-second["mean"]) for left, right in zip(x, y))
    covariance = cross/first["denominator"]
    denominator = math.sqrt(first["variance"])*math.sqrt(second["variance"])
    return dict(contract="statistics.v1", count=len(x), convention=convention, covariance=covariance, correlation=None if denominator == 0 else max(-1, min(1, covariance/denominator)))


def histogram_trace(values, bins):
    dataset(values)
    if isinstance(bins, bool) or not isinstance(bins, int) or not 1 <= bins <= 20:
        raise ValueError("Use 1–20 bins")
    minimum, maximum = min(values), max(values)
    width = 1 if minimum == maximum else (maximum-minimum)/bins
    counts = [0]*bins
    for value in values:
        counts[min(bins-1, math.floor((value-minimum)/width))] += 1
    return dict(contract="statistics.v1", bins=[dict(lower=minimum+index*width, upper=minimum+(index+1)*width, includesUpper=index == bins-1, count=counts[index]) for index in range(bins)])


def z_score(value, mean, standard_deviation):
    if not all(math.isfinite(item) for item in [value, mean, standard_deviation]) or standard_deviation < 0:
        raise ValueError("Finite values and nonnegative deviation required")
    if standard_deviation == 0:
        return None
    result = (value-mean)/standard_deviation
    if not math.isfinite(result):
        raise ValueError("Z-score exceeds numerical range")
    return result


def sampling_trace(sample_size, repetitions, seed, biased=False):
    if any(isinstance(value, bool) or not isinstance(value, int) for value in [sample_size, repetitions, seed]) or not 2 <= sample_size <= 100 or not 1 <= repetitions <= 200 or not 0 <= seed <= 0xffffffff:
        raise ValueError("Invalid sampling settings")
    population = [0, 0, 0, 0, 0, 0, 0, 0, 10, 10]
    population_summary = summary_trace(population)
    frame = population[-2:] if biased else population
    state, samples = seed, []
    standard_error = population_summary["standardDeviation"]/math.sqrt(sample_size)
    for _ in range(repetitions):
        values = []
        for _ in range(sample_size):
            state = (1664525*state+1013904223) & 0xffffffff
            values.append(frame[(state*len(frame))//4294967296])
        mean = summary_trace(values)["mean"]
        lower, upper = mean-1.96*standard_error, mean+1.96*standard_error
        samples.append(dict(mean=mean, lower=lower, upper=upper, covers=lower <= population_summary["mean"] <= upper))
    return dict(contract="statistics.v1", population=population, populationMean=population_summary["mean"], populationDeviation=population_summary["standardDeviation"], sampleSize=sample_size, repetitions=repetitions, seed=seed, biased=biased, standardError=standard_error, samples=samples, coverage=sum(sample["covers"] for sample in samples)/repetitions, meanOfMeans=math.fsum(sample["mean"] for sample in samples)/repetitions)


def relationship_trace(common_strength, direct_effect, intervention):
    if not all(math.isfinite(value) for value in [common_strength, direct_effect, intervention]) or not 0 <= common_strength <= 30 or abs(direct_effect) > 2 or abs(intervention) > 10:
        raise ValueError("Bounded toy controls required")
    rows = []
    for index in range(8):
        warm = 0 if index < 4 else 1
        noise_x, noise_y = (-2 if index % 2 == 0 else 2), (-3 if index % 4 < 2 else 3)
        x = 10+common_strength*warm+noise_x
        y = 50+30*warm+direct_effect*(x-10)+noise_y
        rows.append(dict(warm=warm, x=x, y=y, intervenedX=x+intervention, intervenedY=y+direct_effect*intervention))
    pooled = paired_statistics_trace([row["x"] for row in rows], [row["y"] for row in rows])
    groups = [paired_statistics_trace([row["x"] for row in rows if row["warm"] == warm], [row["y"] for row in rows if row["warm"] == warm]) for warm in [0, 1]]
    return dict(contract="statistics.v1", rows=rows, pooled=pooled, groups=groups, causalChange=direct_effect*intervention)


def observational_twins(intervention):
    if intervention not in [0, 1]:
        raise ValueError("Binary intervention required")
    return dict(contract="statistics.v1", observations=[dict(z=0, x=0, y=0), dict(z=1, x=1, y=1)], observedCorrelation=1, intervention=intervention, commonCauseY=[0, 1], directCauseY=[intervention, intervention])
