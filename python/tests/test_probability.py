import json
import math
from pathlib import Path
import pytest
from jsonschema import Draft202012Validator
from mlmath.probability import bayes_trace, binary_log_loss, binomial_trace, count_probability, event_trace, normal_density, normal_interval, probability, simulate_outcomes, threshold_trace

ROOT = Path(__file__).resolve().parents[2]


def test_frozen_python_traces_and_schema():
    fixture = json.loads((ROOT / "packages/math-contracts/fixtures/probability.v1.json").read_text())
    schema = json.loads((ROOT / "packages/math-contracts/schemas/probability.v1.schema.json").read_text())
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    validator.validate(fixture)
    assert not validator.is_valid({**fixture, "contract": "probability.v2"})
    for key, function in [("events", event_trace), ("bayes", bayes_trace), ("binomial", binomial_trace), ("simulation", simulate_outcomes)]:
        for item in fixture[key]:
            assert function(*item["input"]) == item["trace"]
    for item in fixture["normal"]:
        assert normal_density(*item["input"]) == item["density"]
    for item in fixture["intervals"]:
        assert normal_interval(*item["input"]) == item["area"]
    for item in fixture["thresholds"]:
        assert threshold_trace(item["input"]) == item["trace"]


def test_bayes_and_conditional_references():
    assert bayes_trace(.01, .9, .1)["posterior"] == pytest.approx(9/108)
    assert bayes_trace(.5, .9, .1)["posterior"] == pytest.approx(.9)
    assert bayes_trace(.5, 0, 0)["posterior"] is None
    assert event_trace(8, 12, 2, 78)["conditional"] == .8
    assert event_trace(0, 20, 0, 80)["conditional"] is None
    assert event_trace(25, 25, 25, 25)["independent"]
    assert not event_trace(0, 50, 50, 0)["independent"]


def test_mass_cdf_moments_and_endpoints():
    for trials in [1, 2, 10, 30]:
        for chance in [0, .01, .3, .5, .99, 1]:
            trace = binomial_trace(trials, chance)
            assert sum(trace["mass"]) == pytest.approx(1, abs=1e-12)
            assert sum(index*mass for index, mass in enumerate(trace["mass"])) == pytest.approx(trace["expectation"])
            assert sum((index-trace["expectation"])**2*mass for index, mass in enumerate(trace["mass"])) == pytest.approx(trace["variance"])
            assert sorted(trace["cdf"]) == trace["cdf"]


def test_normal_area_against_independent_erf_reference():
    for lower in [-8, -3, -1, 0, 1]:
        for upper in [lower, 1, 3, 8]:
            if upper >= lower:
                expected = (math.erf(upper/math.sqrt(2))-math.erf(lower/math.sqrt(2)))/2
                assert normal_interval(lower, upper) == pytest.approx(expected, abs=1e-8)
    assert normal_density(0, 0, .1) > 1


def test_reproducible_sampling_and_conservation():
    for sides in [2, 6]:
        for seed in [0, 42, 4294967295]:
            trace = simulate_outcomes(sides, 1000, seed)
            assert trace == simulate_outcomes(sides, 1000, seed)
            assert sum(trace["counts"]) == 1000


def test_threshold_boundary_and_log_loss():
    assert threshold_trace(.6)["truePositive"] == 2
    assert threshold_trace(.6)["falsePositive"] == 1
    assert binary_log_loss(1, .8) == pytest.approx(.223143551314)
    assert binary_log_loss(1, 0) == math.inf
    assert binary_log_loss(0, 1) == math.inf
    assert binary_log_loss(1, 1) == 0


@pytest.mark.parametrize("function,args", [
    (probability, [-.1]), (probability, [math.nan]), (probability, [1.1]),
    (count_probability, [1, 0]), (count_probability, [2, 1]), (count_probability, [.5, 1]),
    (event_trace, [0, 0, 0, 0]), (event_trace, [-1, 1, 1, 1]),
    (bayes_trace, [.1, 1.1, .2]), (binomial_trace, [0, .5]), (binomial_trace, [31, .5]),
    (normal_density, [0, 0, 0]), (normal_interval, [2, 1]),
    (simulate_outcomes, [3, 10, 1]), (simulate_outcomes, [2, 10001, 1]),
    (simulate_outcomes, [2, 10, -1]), (binary_log_loss, [2, .5]),
])
def test_invalid_inputs(function, args):
    with pytest.raises(ValueError):
        function(*args)
