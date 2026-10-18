import json
import math
from pathlib import Path
import pytest
from jsonschema import Draft202012Validator
from mlmath.statistics import histogram_trace, observational_twins, paired_statistics_trace, relationship_trace, sampling_trace, summary_trace, z_score

ROOT = Path(__file__).resolve().parents[2]


def test_frozen_traces_and_schema():
    fixture = json.loads((ROOT / "packages/math-contracts/fixtures/statistics.v1.json").read_text())
    schema = json.loads((ROOT / "packages/math-contracts/schemas/statistics.v1.schema.json").read_text())
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    validator.validate(fixture)
    assert not validator.is_valid({**fixture, "contract": "statistics.v2"})
    for item in fixture["summaries"]:
        assert summary_trace(item["values"], item["convention"]) == item["trace"]
    for item in fixture["paired"]:
        assert paired_statistics_trace(item["x"], item["y"], item["convention"]) == item["trace"]
    for item in fixture["histograms"]:
        assert histogram_trace(item["values"], item["bins"]) == item["trace"]
    for item in fixture["sampling"]:
        assert sampling_trace(item["size"], item["repetitions"], item["seed"], item["biased"]) == item["trace"]
    for item in fixture["relationships"]:
        assert relationship_trace(item["strength"], item["effect"], item["intervention"]) == item["trace"]
    for item in fixture["twins"]:
        assert observational_twins(item["intervention"]) == item["trace"]


def test_summaries_and_declared_conventions():
    reference = summary_trace([1, 2, 3])
    assert reference["mean"] == reference["median"] == 2
    assert reference["variance"] == pytest.approx(2/3)
    assert summary_trace([1, 2, 3], "sample")["variance"] == 1
    assert summary_trace([1, 1, 2, 2, 3])["modes"] == [1, 2]
    assert summary_trace([1, 2, 3])["modes"] == []
    assert summary_trace([1, 2, 3, 100])["mean"] == 26.5
    assert summary_trace([1, 2, 3, 100])["median"] == 2.5
    assert summary_trace([5])["q1"] == 5


def test_quartiles_whiskers_and_bin_boundaries():
    summary = summary_trace([1, 2, 3, 4, 5, 6, 7, 100])
    assert (summary["q1"], summary["q3"], summary["upperFence"], summary["whiskerHigh"]) == (2.5, 6.5, 12.5, 7)
    assert summary["outliers"] == [100]
    assert [row["count"] for row in histogram_trace([0, 1, 2], 2)["bins"]] == [1, 2]
    assert sum(row["count"] for row in histogram_trace([5, 5, 5], 4)["bins"]) == 3


def test_translation_scaling_and_stability():
    values = [1, 2, 3, 4, 9]
    baseline = summary_trace(values, "sample")
    assert summary_trace([value+1e12-10 for value in values], "sample")["variance"] == pytest.approx(baseline["variance"], abs=1e-6)
    assert summary_trace([value*3 for value in values], "sample")["variance"] == pytest.approx(9*baseline["variance"])
    assert summary_trace([value*3 for value in values], "sample")["standardDeviation"] == pytest.approx(3*baseline["standardDeviation"])


def test_paired_boundaries_nonlinearity_and_units():
    assert paired_statistics_trace([1, 2, 3], [2, 4, 6])["covariance"] == 2
    assert paired_statistics_trace([1, 2, 3], [2, 4, 6])["correlation"] == pytest.approx(1)
    assert paired_statistics_trace([1, 2, 3], [6, 4, 2])["correlation"] == pytest.approx(-1)
    assert paired_statistics_trace([1, 1, 1], [1, 2, 3])["correlation"] is None
    assert paired_statistics_trace([-2, -1, 0, 1, 2], [4, 1, 0, 1, 4])["correlation"] == 0
    assert z_score(14, 10, 2) == 2
    assert z_score(10, 10, 0) is None


def test_causal_counterexamples_and_intervention_semantics():
    trace = relationship_trace(20, 0, 10)
    assert trace["pooled"]["correlation"] > .9
    assert [group["correlation"] for group in trace["groups"]] == [0, 0]
    assert trace["causalChange"] == 0
    assert all(row["y"] == row["intervenedY"] for row in trace["rows"])
    assert relationship_trace(20, 1, 10)["causalChange"] == 10
    for intervention in [0, 1]:
        twins = observational_twins(intervention)
        assert twins["observedCorrelation"] == 1
        assert twins["commonCauseY"] != twins["directCauseY"]


def test_seeded_sampling_and_deliberate_frame_bias():
    trace = sampling_trace(10, 20, 42)
    assert trace == sampling_trace(10, 20, 42)
    assert trace["populationMean"] == 2 and trace["populationDeviation"] == 4
    assert sampling_trace(100, 20, 42)["standardError"] == .4
    biased = sampling_trace(100, 20, 42, True)
    assert biased["meanOfMeans"] == 10 and biased["coverage"] == 0
    assert all(sample["covers"] == (sample["lower"] <= 2 <= sample["upper"]) for sample in trace["samples"])


@pytest.mark.parametrize("function,args", [
    (summary_trace, [[]]), (summary_trace, [[math.nan, 1]]), (summary_trace, [[math.inf, 1]]),
    (summary_trace, [[1e13, 1]]), (summary_trace, [[1], "sample"]), (summary_trace, [[1, 2], "unknown"]),
    (summary_trace, [[None, 1]]), (paired_statistics_trace, [[1, 2], [1]]),
    (paired_statistics_trace, [[1], [2]]), (histogram_trace, [[1, 2], 0]),
    (sampling_trace, [1, 10, 42]), (sampling_trace, [10, 10, -1]),
    (sampling_trace, [10, 201, 42]), (relationship_trace, [31, 0, 0]), (z_score, [1, 0, -1]),
])
def test_invalid_inputs(function, args):
    with pytest.raises(ValueError):
        function(*args)
