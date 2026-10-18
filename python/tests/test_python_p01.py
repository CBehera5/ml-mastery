import json
from pathlib import Path

import pytest

from mlmath.python_p01_reference import reference_fixture

ROOT = Path(__file__).resolve().parents[2]


def test_frozen_python_p01_reference():
    fixture = json.loads((ROOT / "packages/python-contracts/fixtures/p01.v1.json").read_text())
    assert reference_fixture() == fixture
    for group in fixture["groups"].values():
        for case in group:
            assert case["grouped"] == case["distributed"]
            assert case["grouped"] != case["ungrouped"]
            assert case["comparison"] is False


@pytest.mark.parametrize("source", ["unknown", "2x", ""])
def test_bad_conversion_does_not_become_zero(source):
    with pytest.raises(ValueError):
        float(source)


def test_assignment_and_text_repetition_are_not_mathematical_equality_or_multiplication():
    area = 2
    area = area + 1
    comparison = area == 2
    assert area == 3 and comparison is False
    assert "2" * 3 == "222"
    assert type(True) is bool
    assert type("2") is str
