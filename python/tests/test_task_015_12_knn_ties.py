import importlib.util
from pathlib import Path

import numpy as np
import pytest
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


GENERATOR_PATH = Path(__file__).resolve().parents[2] / "work" / "freeze-task-015-12.py"
SPEC = importlib.util.spec_from_file_location("task_015_12_freeze", GENERATOR_PATH)
assert SPEC is not None and SPEC.loader is not None
GENERATOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GENERATOR)


def test_mixed_label_tie_at_kth_cutoff_is_rejected() -> None:
    train = np.asarray([[-1.0, 0.0], [1.0, 0.0], [0.0, 2.0]], dtype=np.float64)
    labels = np.asarray([0, 1, 0], dtype=int)
    pipeline = Pipeline([
        ("scale", StandardScaler()),
        ("model", KNeighborsClassifier(n_neighbors=1, weights="uniform", metric="minkowski", p=2, algorithm="brute")),
    ]).fit(train, labels)

    with pytest.raises(ValueError, match="knn.ambiguous-kth-neighbor"):
        GENERATOR.reject_ambiguous_knn_cutoffs(
            pipeline,
            np.asarray([[0.0, 0.0]], dtype=np.float64),
            labels,
            ["left-class-0", "right-class-1", "far-class-0"],
            ["equidistant-query"],
            1,
        )


def test_repaired_ms_e2_fixture_is_unambiguous_across_authored_cv_fits() -> None:
    payloads = GENERATOR.output_payloads()
    import json

    manifest = json.loads(payloads["ms-e2.manifest.v1.json"])
    fixture = manifest["fixture"]
    assert fixture["fixtureId"] == "MS-E2-GROUPED-CHURN-V2"
    changed = next(row for row in fixture["rows"] if row["rowId"] == "E2-00-00")
    assert changed["features"]["monthly_charge"] == 40.000001
    assert GENERATOR.KNN_DISTANCE_EQUALITY_TOLERANCE == 0.0
