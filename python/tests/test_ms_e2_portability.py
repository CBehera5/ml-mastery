import importlib.util
from pathlib import Path

import numpy as np
from threadpoolctl import threadpool_limits


PATH = Path(__file__).resolve().parents[2] / "work/audit-ms-e2-portability.py"
SPEC = importlib.util.spec_from_file_location("ms_portability", PATH)
AUDIT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(AUDIT)


def test_exhaustive_gate_detects_both_v2_fragile_cutoffs():
    fixture = AUDIT.G.e2_fixture()
    for row in fixture["rows"]:
        if row["rowId"] == "E2-00-00":
            row["features"]["monthly_charge"] = 40.000001
        if row["rowId"] == "E2-00-02":
            row["features"]["monthly_charge"] = 44.0
        if row["rowId"] == "E2-06-02":
            row["features"]["monthly_charge"] = 74.0
    with threadpool_limits(limits=1):
        _, summary = AUDIT.audit(fixture)
    assert not summary["passed"]
    assert summary["failureCount"] == 6
    assert {r["queryId"] for r in summary["failures"]} == {"E2-02-02", "E2-04-02"}
    assert {r["candidateId"] for r in summary["failures"] if r["predictionCouldChange"]} == {"knn-p3-t25"}


def test_proposal_has_portable_membership_across_all_candidates_and_partitions():
    with threadpool_limits(limits=1):
        records, summary = AUDIT.audit(AUDIT.proposal(AUDIT.G.e2_fixture()))
    assert summary["passed"]
    assert len(records) == 972
    assert summary["minimumRelevantMarginOverTolerance"] > AUDIT.SAFETY_FACTOR
    assert summary["decisionDigest"] == "b422836c222a9be57c30ebd18b0199ce3db2e025cb33bec818d95e7748bc2034"


def test_near_cutoff_is_distinct_from_exact_equality_and_same_label_exchange():
    distances = np.array([0.1, 1.0, 1.0 + 1e-14])
    mixed = AUDIT.cutoff_record(distances, np.array([0, 0, 1]), 2, 1e-12)
    assert not mixed["exactMixedCutoff"]
    assert mixed["nearMixedCutoff"]
    assert mixed["possiblePositiveCounts"] == [0, 1]
    assert not mixed["meaningfulSeparation"]
    same = AUDIT.cutoff_record(distances, np.array([0, 1, 1]), 2, 1e-12)
    assert not same["nearMixedCutoff"]
    assert same["meaningfulSeparation"]
