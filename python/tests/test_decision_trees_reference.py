import hashlib
import json
from pathlib import Path

import numpy as np
import pytest
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

from mlmath.decision_trees_reference import catalog, case

ROOT = Path(__file__).resolve().parents[2]
FAMILIES = catalog()["families"]


@pytest.mark.parametrize("family", FAMILIES, ids=lambda family: family["id"])
def test_scored_reference(family):
    authored = json.loads((ROOT / "apps/web/app/supervised/decision-trees/authored.json").read_text())
    assert family == next(item for item in authored["families"] if item["id"] == family["id"])
    lesson, objective = int(family["objective"][2:4]), int(family["objective"][-1])
    variant = ord(family["id"][-1])-ord("A")+(0 if ".practice." in family["id"] else 2)
    shift = variant+1
    answer = family["accepted"][0][0]
    if answer["kind"] == "number":
        if (lesson, objective) == (1, 1):
            query = [1, 3, 4, 6, 2][variant]
            expected = 3 if query <= 2 else 7 if query <= 5 else 9
        elif (lesson, objective) == (2, 1):
            fitted = DecisionTreeRegressor(max_depth=1).fit([[0], [0], [0]], [shift, shift+2, shift+4])
            expected = fitted.predict([[10]])[0]
        elif (lesson, objective) == (2, 2):
            fitted = DecisionTreeRegressor(max_depth=1, random_state=1729).fit([[0], [1], [2], [3]], [shift, shift, shift+4, shift+4])
            expected = fitted.tree_.threshold[0]
            assert fitted.tree_.threshold[0] == 1.5
        elif (lesson, objective) == (2, 3):
            targets = np.array([shift, shift+2, shift+4, shift+6])
            parent = DecisionTreeRegressor().fit([[0]]*4, targets)
            split = DecisionTreeRegressor(max_depth=1, random_state=1729).fit([[0], [1], [2], [3]], targets)
            expected = parent.tree_.impurity[0]*4-sum(split.tree_.impurity[node]*split.tree_.n_node_samples[node] for node in [1, 2])
        elif (lesson, objective) == (3, 1):
            fitted = DecisionTreeClassifier(criterion="gini").fit([[0]]*(shift+2), [0]*shift+[1]*2)
            expected = fitted.tree_.impurity[0]
        else:
            expected = min(shift+1, shift+5)
        assert answer["value"] == pytest.approx(float(expected), abs=1e-9)
    else:
        assert answer["optionId"] == "supported"
        assert len(family["atoms"][0]["options"]) == 3
        if (lesson, objective) == (3, 2):
            counts = np.array([[shift+1, 0], [1, shift+2]])
            parent_counts = counts.sum(axis=0)
            parent_gini = 1-sum((parent_counts/parent_counts.sum())**2)
            weighted = sum(row.sum()/counts.sum()*(1-sum((row/row.sum())**2)) for row in counts)
            assert parent_gini-weighted > 0
            assert np.allclose(counts/counts.sum(axis=1,keepdims=True), [[1,0],[1/(shift+3),(shift+2)/(shift+3)]])
    if (lesson, objective) == (2, 1):
        assert family["accepted"][0][1]["value"] == 8
    if objective == 2:
        assert len(family["atoms"]) == 2
        assert family["accepted"][0][1]["optionId"] == "mechanism"
    assert case(lesson, objective, variant)[4] == family["explanation"]


def test_frozen_hashes_and_inventory():
    directory = ROOT / "docs/verification/decision-trees"
    lock = json.loads((directory / "freeze-lock.v1.json").read_text())
    for name, digest in lock["sha256"].items():
        assert hashlib.sha256((directory/name).read_bytes()).hexdigest() == digest
    assert hashlib.sha256((ROOT/"work/freeze-task-015-7.py").read_bytes()).hexdigest() == lock["generator_sha256"]
    for name, count in [("dt-e1.manifest.v1.json", 37), ("dt-e2.manifest.v1.json", 32)]:
        manifest = json.loads((directory/name).read_text())
        assert len(manifest["configurations"]) == count
        assert len(set(item["id"] for item in manifest["configurations"])) == count
        for item in manifest["configurations"]:
            assert item["correct_prediction_id"] in [option["id"] for option in item["prediction_options"]]
            assert item["correct_reason_id"] in [option["id"] for option in item["reason_options"]]
