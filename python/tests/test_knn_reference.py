import hashlib
import importlib.util
import json
import math
from pathlib import Path

import numpy as np
import pytest
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[2]
DIRECTORY = ROOT / "docs/verification/knn"
FAMILIES = json.loads((ROOT / "apps/web/app/supervised/knn/authored.json").read_text())["families"]
SPEC = importlib.util.spec_from_file_location("knn_frozen", ROOT / "work/freeze-task-015-5.py")
REFERENCE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(REFERENCE)


@pytest.mark.parametrize("family", FAMILIES, ids=lambda family: family["id"])
def test_all_80_scored_instances(family):
    lesson = int(family["objective"][2:4])
    objective = int(family["objective"][-1])
    variant = ord(family["id"][-1]) - ord("A") + (0 if ".practice." in family["id"] else 2)
    offset = variant + 1
    answer = family["accepted"][0][0]
    if (lesson, objective) == (1, 1):
        distance = np.linalg.norm([3 * offset, 4 * offset])
        assert math.isclose(answer["value"], distance)
        assert distance < np.linalg.norm([6 * offset, 8 * offset])
        assert family["accepted"][0][1] == {"kind": "choice", "optionId": "ab"}
    elif (lesson, objective) == (1, 3):
        label = variant % 2
        model = KNeighborsClassifier(n_neighbors=3).fit([[1], [2], [3]], [label, 1-label, label])
        predicted = int(model.predict([[0]])[0])
        assert answer == {"kind": "choice", "optionId": "safe"}
        assert next(option["label"] for option in family["atoms"][0]["options"] if option["id"] == "safe") == f"Class{predicted}"
    elif (lesson, objective) == (2, 1):
        assert answer["value"] == np.linalg.norm(np.array([3*offset, 4*offset])/offset)
    else:
        assert answer == {"kind": "choice", "optionId": "safe"}
        selected = next(option["label"] for option in family["atoms"][0]["options"] if option["id"] == "safe")
        if (lesson, objective) == (1, 2):
            if variant < 2:
                assert KNeighborsClassifier(n_neighbors=3).fit([[offset], [offset+1], [offset+2]], [0, 1, 1]).predict([[0]])[0] == 1
                assert "class1" in selected and "numeric" in selected
            elif variant == 2:
                assert KNeighborsClassifier(n_neighbors=2).fit([[0], [2]], [0, 1]).predict([[1]])[0] == 0
                assert "class0" in selected
            elif variant == 3:
                assert KNeighborsClassifier(n_neighbors=3, weights="distance").fit([[0], [0], [2]], [0, 1, 1]).predict([[0]])[0] == 0
                assert "exact-zero" in selected
            else:
                assert "Reject" in selected and REFERENCE.edge_checks()["kth_tie_training_order_counterexample"]
        elif (lesson, objective) == (2, 3):
            assert np.linalg.norm([10*offset, 0]) > np.linalg.norm([0, 2])
            assert np.linalg.norm([1, 0]) < np.linalg.norm([0, 2])
            assert "scaled A" in selected
        elif (lesson, objective) == (3, 4):
            for weights, expected in [("uniform", 1), ("distance", 0)]:
                assert KNeighborsClassifier(n_neighbors=3, weights=weights).fit([[offset], [2*offset], [3*offset]], [0, 1, 1]).predict([[0]])[0] == expected
        elif (lesson, objective) == (3, 2):
            assert "Reject" in selected and "test-based" in selected
            with pytest.raises(ValueError):
                KNeighborsClassifier(n_neighbors=5+variant).fit(np.arange(4+variant).reshape(-1, 1), np.arange(4+variant)%2).predict([[0]])
        elif (lesson, objective) == (4, 2):
            assert f"{(6+variant)*3} coordinate" in selected
        elif (lesson, objective) == (4, 4):
            assert "Accuracy90%" in selected and "recall0" in selected
        elif (lesson, objective) in [(2, 2), (4, 1)]:
            assert "train" in selected.lower() and "all rows" not in selected.lower()
        else:
            assert family["explanation"] and family["remediation"]
    assert family["critical"] == (objective == 2)
    if objective == 2:
        assert family["accepted"][0][1] == {"kind": "choice", "optionId": "mechanism"}
        assert next(option["label"] for option in family["atoms"][1]["options"] if option["id"] == "mechanism") == family["explanation"]


LABS = [json.loads((DIRECTORY / name).read_text()) for name in ["kn-e1.manifest.v1.json", "kn-e2.manifest.v1.json"]]


@pytest.mark.parametrize("lab,state", [(lab, state) for lab in LABS for state in lab["configurations"]], ids=[state["id"] for lab in LABS for state in lab["configurations"]])
def test_all_61_frozen_states(lab, state):
    if "outcome" in state:
        assert state["outcome"]["tag"] == "rejected" and state["prediction"] is None
        return
    data = next(data for data in lab["datasets"] if data["id"] == state["dataset_id"])
    generated = REFERENCE.state(data, state["query_index"], state["k"], state["weights"], state["scaled"])
    assert state == generated


def test_frozen_hashes_and_edges():
    lock = json.loads((DIRECTORY / "freeze-lock.v1.json").read_text())
    for name, expected in lock["sha256"].items():
        assert hashlib.sha256((DIRECTORY / name).read_bytes()).hexdigest() == expected
    assert REFERENCE.edge_checks()["near_equal_not_tied"]
    scaler = StandardScaler().fit([[0, 1], [2, 3]])
    original = scaler.mean_.copy()
    scaler.transform([[100, 300]])
    assert np.array_equal(original, scaler.mean_)
