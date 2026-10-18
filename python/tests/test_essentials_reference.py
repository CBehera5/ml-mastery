import ast
import json
from pathlib import Path

import pytest

from mlmath.essentials_reference import authored_case, build

ROOT = Path(__file__).resolve().parents[2]


def test_complete_frozen_essentials_reference():
    fixture = json.loads((ROOT / "packages/python-contracts/fixtures/essentials.v1.json").read_text())
    assert build() == fixture
    assert len(fixture["lessons"]) == 8
    assert sum(len(lesson["objectives"]) for lesson in fixture["lessons"]) == 32
    assert sum(objective["critical"] for lesson in fixture["lessons"] for objective in lesson["objectives"]) == 8
    assert len(fixture["cases"]) == 168
    for case in fixture["cases"]:
        assert len(case["code"].splitlines()) <= 25
        assert len(case["code"].encode()) <= 4096
        assert case["expected"] != case["wrong"]
        if case["raises"] != "SyntaxError":
            tree = ast.parse(case["code"])
            assert not any(isinstance(node, (ast.While, ast.AsyncFor, ast.Lambda, ast.ImportFrom)) for node in ast.walk(tree))


def test_real_independent_debugging_forms_cover_error_classes_and_minimal_syntax_repair():
    cases = build()["cases"]
    errors = [case for case in cases if case["mode"] == "mastery" and case["objective"] == "P07.O1"]
    assert {case["expected"][0] for case in errors} == {"IndexError", "TypeError", "ValueError"}
    syntax = [case for case in cases if case["mode"] == "mastery" and case["objective"] == "P07.O4" and case["raises"] == "SyntaxError"]
    assert syntax and syntax[0]["expected"][1] == "add ':' after if"


@pytest.mark.parametrize("arguments", [(2, 0, "1; import os"), (2, 0, True), (9, 0, 1), (2, 4, 1), (2, 0, 10000000)])
def test_author_oracle_is_not_an_arbitrary_source_or_configuration_executor(arguments):
    with pytest.raises(ValueError):
        authored_case(*arguments)


def test_critical_references_reject_lost_alignment_zero_defaults_and_missing_schema():
    cases = build()["cases"]
    for case in cases:
        if case["objective"] == "P03.O2":
            assert len(case["expected"]) == 2 and len(case["wrong"]) == 1
        if case["objective"] == "P06.O2":
            assert case["expected"][-1][-1] == 300
            assert case["wrong"][-1][-1] == 200
        if case["objective"] == "P08.O1":
            assert case["expected"] == ["invalid required area", None, None]
            assert case["wrong"] == ["valid", 0, 0]
