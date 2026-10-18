import hashlib
import json
from pathlib import Path

import numpy as np
import pytest
from sklearn.metrics import accuracy_score

from mlmath.random_forests_reference import catalog, case

ROOT = Path(__file__).resolve().parents[2]
FAMILIES = catalog()["families"]


@pytest.mark.parametrize("family", FAMILIES, ids=lambda family: family["id"])
def test_scored_instances(family):
    authored = json.loads((ROOT/"apps/web/app/supervised/random-forests/authored.json").read_text())
    assert next(item for item in authored["families"] if item["id"] == family["id"]) == family
    lesson, objective = int(family["objective"][2:4]), int(family["objective"][-1])
    variant = ord(family["id"][-1])-ord("A")+(0 if ".practice." in family["id"] else 2)
    answer = family["accepted"][0][0]
    if answer["kind"] == "number":
        if (lesson,objective) == (1,1):
            expected = [0,2,1,0,3][variant]
        elif (lesson,objective) == (2,1):
            expected = float(np.mean([[2,4,6],[1,4,7],[3,6,9],[2,3,7],[4,8,12]][variant]))
        elif (lesson,objective) == (2,3):
            actual,single,ensemble = np.array([[8,2,4],[9,4,7],[10,7,8],[6,7,5],[12,5,9]][variant])
            expected = abs(actual-single)-abs(actual-ensemble)
        elif (lesson,objective) == (3,1):
            expected = np.mean([[.2,.4,.6],[.1,.5,.9],[.3,.6,.9],[.1,.2,.6],[.2,.7,.9]][variant])
        elif (lesson,objective) == (3,3):
            probability,threshold = [(.5,.5),(.4,.5),(.8,.7),(.3,.3),(.65,.7)][variant]
            expected = int(probability >= threshold)
        elif (lesson,objective) == (3,4):
            fp,fn = [(2,1),(1,3),(0,2),(4,0),(3,2)][variant]
            matrix = np.array([[3,fp],[fn,2]])
            expected = float(np.sum(matrix*np.array([[0,1],[5,0]])))
        else:
            original,permuted = [(.75,.5),(.5,.75),(1.,1.),(.8,.6),(.6,.2)][variant]
            expected = original-permuted
        assert answer["value"] == pytest.approx(float(expected),abs=1e-9)
    else:
        assert answer["optionId"] == "supported"
        assert len(family["atoms"][0]["options"]) == 3
        label = next(option["label"] for option in family["atoms"][0]["options"] if option["id"] == "supported")
        if (lesson,objective) == (1,1):
            assert label.startswith(f"{[0,2,1,0,3][variant]} occurrences")
        if (lesson,objective) == (3,3):
            probability,threshold = [(.5,.5),(.4,.5),(.8,.7),(.3,.3),(.65,.7)][variant]
            assert label.startswith(f"Action{int(probability>=threshold)} ")
        if (lesson,objective) == (3,2):
            positive = [[.4,.4,.9],[.1,.6,.6],[.3,.4,.99],[.49,.49,.9],[.01,.51,.51]][variant]
            probabilities = np.array([[1-value,value] for value in positive])
            decision = int(np.argmax(np.mean(probabilities,axis=0)))
            votes = np.argmax(probabilities,axis=1)
            hard = int(np.argmax(np.bincount(votes,minlength=2)))
            assert hard != decision
            correct_label = next(option["label"] for option in family["atoms"][0]["options"] if option["id"] == "supported")
            assert correct_label.startswith(f"Class{decision} ")
    if objective == 2:
        assert family["critical"] and len(family["atoms"]) == 2
        assert family["accepted"][0][1]["optionId"] == "mechanism"
    else:
        assert not family["critical"]
    assert case(lesson,objective,variant)[4] == family["explanation"]


def test_frozen_lock_and_resource_bounds():
    directory = ROOT/"docs/verification/random-forests"
    lock = json.loads((directory/"freeze-lock.v1.json").read_text())
    for name,digest in lock["sha256"].items():
        assert hashlib.sha256((directory/name).read_bytes()).hexdigest() == digest
    assert hashlib.sha256((ROOT/"work/freeze-task-015-8.py").read_bytes()).hexdigest() == lock["generator_sha256"]
    assert hashlib.sha256((directory/"AGGREGATION_BOOTSTRAP_OOB_CONVENTIONS.md").read_bytes()).hexdigest() == lock["conventions_sha256"]


CONFIGS = []
for filename in ["rf-e1.manifest.v1.json","rf-e2.manifest.v1.json"]:
    manifest = json.loads((ROOT/"docs/verification/random-forests"/filename).read_text())
    assert len(manifest["configurations"]) <= 64
    CONFIGS.extend(manifest["configurations"])


@pytest.mark.parametrize("state",CONFIGS,ids=lambda state:state["id"])
def test_all_frozen_bootstrap_aggregation_and_oob_states(state):
    assert state["correct_prediction_id"] in [option["id"] for option in state["prediction_options"]]
    if state["kind"] != "reference-fitted-forest":
        return
    expected = state["expected"]
    trees = expected["trees"]
    assert len(trees) == state["controls"]["n_estimators"] <= 7
    assert sum(len(tree["nodes"]) for tree in trees) <= 49
    for tree in trees:
        assert len(tree["bootstrap_indices"]) == 8
        assert tree["multiplicity"] == np.bincount(tree["bootstrap_indices"],minlength=8).tolist()
        assert tree["oob_indices"] == [row for row in range(8) if row not in tree["bootstrap_indices"]]
    for row in expected["oob"]["rows"]:
        eligible = [tree["id"] for tree in trees if row["row_index"] in tree["oob_indices"]]
        assert eligible == row["contributing_tree_ids"]
        assert row["denominator"] == len(eligible)
        if not eligible:
            assert row["mathematical"] == {"tag":"unavailable","reason":"no-oob-contributor"}
    for split in ["training","development"]:
        outputs = expected["outputs"][split]
        average = np.mean(outputs["individual_tree_outputs"],axis=0)
        if expected["class_order"]:
            assert np.allclose(average,outputs["mean_probabilities"],atol=1e-9,rtol=1e-9)
            labels = np.array(expected["class_order"])[np.argmax(average,axis=1)].tolist()
            assert labels == outputs["predictions"]
        else:
            assert np.allclose(average,outputs["predictions"],atol=1e-9,rtol=1e-9)
