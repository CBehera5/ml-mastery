import hashlib
import importlib.util
import json
from pathlib import Path

import pytest

from mlmath.supervised_evaluation import authored_catalog, reference_case
from mlmath.supervised_ev01 import corpus

ROOT = Path(__file__).resolve().parents[2]
CATALOG = authored_catalog()


@pytest.mark.parametrize("family", CATALOG["practice"] + CATALOG["independent"], ids=lambda family: family["id"])
def test_all_120_scored_instances_have_trusted_reference_parity(family):
    stored = json.loads((ROOT / "apps/web/app/supervised/module/authored.json").read_text())
    matches = [item for item in stored["practice"] + stored["independent"] if item["id"] == family["id"]]
    assert matches == [family]
    assert family["objective"].split(".")[1] in ["O1", "O2", "O3", "O4"]
    assert family["critical"] == family["objective"].endswith(".O2")
    if family["critical"]:
        assert len(family["atoms"]) == len(family["accepted"][0]) == 2
    if family["objective"].startswith("EV01"):
        original = corpus()
        assert family in [entry["family"] for entry in original["practice"] + original["independent"]]
    else:
        reference = next(item for item in CATALOG["reference_cases"] if item["family_id"] == family["id"])
        case = reference_case(reference["lesson"], reference["objective"], reference["variant"])
        assert case == reference["case"]
        if case["kind"] == "number":
            assert family["accepted"][0][0]["value"] == case["expected"]
        else:
            assert next(option["label"] for option in family["atoms"][0]["options"] if option["id"] == family["accepted"][0][0]["optionId"]) == case["expected"]


def test_all_86_frozen_states_regenerate_with_trusted_metric_oracles_and_unchanged_hashes():
    directory = ROOT / "docs/verification/ev-phase-b"
    module_spec = importlib.util.spec_from_file_location("ev_manifest_oracle", directory / "freeze_manifests.py")
    oracle = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(oracle)
    first, second = oracle.e1_manifest(), oracle.e2_manifest()
    oracle.verify_invariants(first, second)
    for name, manifest in [("ev-e1.manifest.v1.json", first), ("ev-e2.manifest.v1.json", second)]:
        assert (directory / name).read_text() == oracle.dump(manifest)
    lock = json.loads((directory / "freeze-lock.v1.json").read_text())
    for name, expected in lock["files"].items():
        assert hashlib.sha256((directory / name).read_bytes()).hexdigest() == expected
    assert hashlib.sha256((directory / "freeze_manifests.py").read_bytes()).hexdigest() == lock["author_script_sha256"]
    assert hashlib.sha256((directory / "METRIC_CONVENTIONS.md").read_bytes()).hexdigest() == lock["metric_spec_sha256"]


def test_five_forms_cover_each_objective_and_requalify_without_inflation():
    assert len(CATALOG["practice"]) == 48
    assert len(CATALOG["independent"]) == 72
    assert len(CATALOG["reference_cases"]) == 100
    for lesson in range(1, 7):
        for objective in range(1, 5):
            identity = f"EV{lesson:02}.O{objective}"
            assert sum(item["objective"] == identity for item in CATALOG["practice"]) == 2
            assert sum(item["objective"] == identity for item in CATALOG["independent"]) == 3
