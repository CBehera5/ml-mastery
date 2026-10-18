import hashlib
import json
from pathlib import Path

import pytest

from mlmath.supervised_ev01 import analyze, corpus, scenarios


ROOT = Path(__file__).resolve().parents[2]
CONTENT = corpus()


@pytest.mark.parametrize("state", CONTENT["states"], ids=lambda state: state["id"])
def test_every_scene_state_matches_frozen_reference_and_manual_boundary(state):
    frozen = json.loads((ROOT / "python/tests/fixtures/supervised-ev01-reference.json").read_text())
    assert state == next(item for item in frozen["states"] if item["id"] == state["id"])
    expected_valid = state["feature"] == "available" and state["plan"] == "holdout"
    assert state["expected"]["valid"] == expected_valid
    assert state["expected"]["featureValid"] == (state["feature"] == "available")
    assert state["expected"]["splitValid"] == (state["plan"] == "holdout")


@pytest.mark.parametrize("entry", CONTENT["practice"] + CONTENT["independent"], ids=lambda entry: entry["family"]["id"])
def test_every_exercise_has_independent_semantic_oracle(entry):
    family, oracle = entry["family"], entry["oracle"]
    answer = family["accepted"][0]
    objective = oracle["objective"]
    scene = next(item for item in scenarios() if item["id"] == oracle["scenario"])
    if objective == 1:
        expected = {"housing": ("price", "currency"), "churn": ("churn", "binary"), "docs": ("quality", "binary")}[scene["domain"]]
        assert [item["optionId"] for item in answer[0]["entries"]] == list(expected)
    elif objective == 2:
        assert family["critical"] and len(family["atoms"]) == 2
        assert [item["optionId"] for item in answer] == (["allow", "before"] if oracle["feature"] == "available" else ["reject", "after"])
    elif objective == 3:
        assert [item["optionId"] for item in answer] == (["valid", "boundary"] if oracle["plan"] == "holdout" else ["invalid", "crossing"])
    else:
        scene_index = [item["id"] for item in scenarios()].index(scene["id"])
        assert [item["optionId"] for item in answer] == ["unsupported" if scene_index % 2 == 0 else "supported", "observation"]
    assert family["objective"] == f"EV01.O{objective}"


@pytest.mark.parametrize("scene", scenarios(), ids=lambda scene: scene["id"])
def test_fixed_row_group_and_future_oracles(scene):
    assert analyze(scene, "available", "overlap")["overlap"] == ["r4"]
    crossed = analyze(scene, "available", "crossed")
    assert crossed["groups"] == (["g1", "g2", "g3"] if scene["requireGroup"] else [])
    expected_future = ["r3", "r5"] if scene["id"] == "docs-future" else ["r5", "r6"] if scene["requireTime"] else []
    assert crossed["future"] == expected_future
    assert len(scene["rows"]) == 6 and len(scene["features"]) == 2 and len(scene["plans"]) == 3


def test_authored_manifest_hashes_and_test_only_separation():
    base = ROOT / "apps/web/app/supervised/foundation"
    manifest = json.loads((base / "provenance.json").read_text())
    for name, expected in manifest["sha256"].items():
        assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == expected
    authored = json.loads((base / "authored.json").read_text())
    assert len(authored["practice"]) == 8
    assert "independent" not in authored
    assert len(CONTENT["independent"]) == 12
    assert sum(item["expected"]["valid"] for item in CONTENT["states"]) == 6
