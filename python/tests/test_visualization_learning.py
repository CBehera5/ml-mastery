import ast
import hashlib
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pytest
from mlmath.visualization_learning_reference import authored_case, build, normalize

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = json.loads((ROOT / "packages/python-contracts/fixtures/visualization-learning.v1.json").read_text())


@pytest.mark.parametrize("case", FIXTURE["cases"], ids=lambda item: f'{item["objective"]}-{item["mode"]}-{item["variant"]}')
def test_all_scored_and_worked_chart_references(case):
    actual = authored_case(int(case["objective"][1:3]), int(case["objective"][-1]) - 1, case["amount"])
    assert actual["expected"] == case["expected"] and actual["charts"] == case["charts"]
    assert len(case["code"].splitlines()) <= 25 and len(case["code"].encode()) <= 4096
    tree = ast.parse(case["code"])
    assert not any(isinstance(node, (ast.While, ast.Lambda, ast.GeneratorExp)) for node in ast.walk(tree))
    assert not plt.get_fignums()


def test_complete_catalog_versions_and_variants():
    assert build() == FIXTURE
    assert hashlib.sha256(json.dumps(FIXTURE["cases"], sort_keys=True).encode()).hexdigest() == FIXTURE["manifest"]["cases_sha256"]
    assert len(FIXTURE["cases"]) == 122
    assert sum(item["mode"] in ("practice", "mastery") for item in FIXTURE["cases"]) == 100
    objectives = [item for lesson in FIXTURE["lessons"] for item in lesson["objectives"]]
    assert len(objectives) == 20
    assert [item["id"] for item in objectives if item["critical"]] == ["V01.O2", "V02.O2", "V03.O2", "V04.O2", "V05.O1"]
    assert [item["id"] for item in objectives if item["introductory"]] == ["V05.O4"]
    for objective in objectives:
        cases = [case for case in FIXTURE["cases"] if case["objective"] == objective["id"] and case["mode"] != "experiment"]
        assert len({case["code"] for case in cases}) == 6


@pytest.mark.parametrize("arguments", [(True, 0, 0), (1, 0, "import os"), (6, 0, 0), (1, 4, 0), (1, 0, 1000000)])
def test_rejects_unauthored_configuration(arguments):
    with pytest.raises(ValueError):
        authored_case(*arguments)


def test_anchors_match_actual_matplotlib_artists():
    line = authored_case(1, 1, 0)
    assert line["expected"]["y"] == [130, 230, 330]
    assert line["charts"][0]["series"][0]["y"] == line["expected"]["y"]
    swapped = authored_case(1, 1, 6)
    assert swapped["charts"][0]["series"][0]["x"] == [130, 230, 330]
    assert swapped["charts"][0]["series"][0]["y"] == [1, 2, 3]
    wrong_units = authored_case(1, 1, 7)
    assert wrong_units["charts"][0]["series"][0]["y"] == [130, 230, 330]
    assert wrong_units["charts"][0]["ylabel"] == "Predicted price (dollars)"
    assert "thousands" in wrong_units["expected"]["repair"]
    hist = authored_case(2, 1, 0)
    assert hist["expected"]["counts"] == [2, 2]
    assert hist["expected"]["density_heights"] == [.25, .25]
    assert sum(hist["expected"]["areas"]) == 1
    assert [bar["height"] for bar in hist["charts"][0]["bars"]] == [.25, .25]
    final = authored_case(2, 0, 0)["expected"]
    assert final["counts"] == [1, 3] and final["answer"] == 3
    box = authored_case(4, 1, 0)["expected"]
    assert box["quartiles"] == [2.25, 3.5, 4.75] and box["iqr"] == 2.5
    assert box["fences"] == [-1.5, 8.5] and box["whiskers"] == [1, 5] and box["outliers"] == [20]


def test_causal_stories_pairing_curvature_and_subgroups():
    for amount in range(6):
        story = authored_case(3, 1, amount)["expected"]
        hours = np.array(story["x"])
        experience = hours.copy()
        offset = story["stories"]["observational_offset"]
        assert np.array_equal(2 * hours + offset, 2 * experience + offset)
        assert np.array_equal(2 * (hours + 1) + offset - (2 * hours + offset), np.full(4, 2))
        assert np.array_equal(2 * experience + offset - (2 * experience + offset), np.zeros(4))
        pairing = authored_case(3, 0, amount)["expected"]
        assert list(map(list, zip(pairing["x"], pairing["y"]))) != pairing["wrong_independent_sort_pairs"]
    curved = authored_case(3, 2, 1)["expected"]
    assert curved["correlation"] == pytest.approx(0)
    pooled = authored_case(3, 2, 0)["expected"]
    assert pooled["correlation"] > 0 and all(value < 0 for value in pooled["within_group_correlations"])


def test_bin_denominators_and_transparent_scale_repair_equivalence():
    hist = authored_case(2, 1, 1)["expected"]
    assert hist["widths"] == [1.5, 2.5] and hist["areas"] == pytest.approx([.5, .5])
    outside = authored_case(2, 2, 0)["expected"]
    assert outside["included"] == 4 and outside["excluded"] == 1
    for amount in range(6):
        item = authored_case(5, 0, amount)
        first, second = item["charts"]
        assert first["series"] == second["series"] and first["ylim"] != second["ylim"]
        assert item["expected"]["absolute_difference"] == 2 + amount
        assert len(item["expected"]["safe_repairs"]) == 2
        assert first["ylabel"] == second["ylabel"] == "Price (thousands of dollars)"


def test_tagged_normalization():
    assert normalize(float("nan")) == {"tag": "undefined", "reason": "nonfinite"}
    assert normalize(-0.0) == 0
    with pytest.raises(ValueError):
        normalize(object())
    json.dumps(FIXTURE, allow_nan=False)
