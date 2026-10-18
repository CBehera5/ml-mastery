import hashlib
import importlib.util
import json
import math
from pathlib import Path

import numpy as np
import pytest
from scipy.special import expit
from sklearn.metrics import confusion_matrix, log_loss

from mlmath.logistic_reference import case, catalog

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("frozen_logistic_reference", ROOT / "work/freeze-task-015-4.py")
REFERENCE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(REFERENCE)
LABS = REFERENCE.generate()
REFERENCE.verify_edges(LABS)
CATALOG = catalog()
DIRECTORY = ROOT / "docs/verification/logistic"


@pytest.mark.parametrize("family", CATALOG["families"], ids=lambda family: family["id"])
def test_all_120_scored_instances_arithmetic_and_semantic_reference(family):
    stored = json.loads((ROOT / "apps/web/app/supervised/logistic/authored.json").read_text())
    assert next(item for item in stored["families"] if item["id"] == family["id"]) == family
    lesson, objective = int(family["objective"][2:4]), int(family["objective"][-1])
    variant = ord(family["id"][-1]) - ord("A") + (0 if ".practice." in family["id"] else 2)
    kind, prompt, expected, explanation, distractors = case(lesson, objective, variant)
    probability = [.25, .5, .75, .9, .1][variant]
    threshold = [.5, .6, .7, 1, 0][variant]
    if kind == "number":
        if (lesson, objective) == (1, 1):
            assert np.isclose(expected, expit(math.log(probability / (1 - probability))))
        elif (lesson, objective) == (2, 1):
            assert np.isclose(expected, log_loss([1], [probability], labels=[0, 1]))
        elif (lesson, objective) == (2, 3):
            score = math.log(probability / (1 - probability))
            derivative = (np.logaddexp(0, -score - 1e-5) - np.logaddexp(0, -score + 1e-5)) / 2e-5
            assert np.isclose(expected, derivative, atol=1e-8)
        else:
            assert (lesson, objective) == (3, 3)
            predicted = [int(value >= threshold) for value in [.2, .6, .8]]
            assert expected == confusion_matrix([0, 1, 1], predicted, labels=[0, 1])[1, 0]
    elif kind == "choice":
        assert expected not in distractors and len(set(distractors)) == 2
        if (lesson, objective) == (1, 3):
            before = variant + 1
            after = before + 1
            assert after - before == 1
            assert np.isclose(np.exp(after) / np.exp(before), np.e)
            assert "coefficient1" in prompt and "one-unit feature change" in expected
        if (lesson, objective) == (1, 4):
            assert "before selecting a class column" in prompt and "class axis is missing" in expected
        if (lesson, objective) == (3, 1):
            assert expected == str([int(value >= threshold) for value in [.2, .6, .8]])
        if objective == 2:
            protected = {1: "threshold", 2: "training", 3: "final-test", 4: "inverse", 5: "fold", 6: "causal"}
            assert protected[lesson] in (expected + explanation).lower()
    else:
        assert (lesson, objective) == (5, 3)
        assert len(family["accepted"]) == 2
        for accepted in family["accepted"]:
            assert [entry["optionId"] for entry in accepted[0]["entries"]][1:] == ["scale", "model"]
    assert family["critical"] == (objective == 2)
    assert len(family["atoms"]) == (2 if objective == 2 else 1)
    assert family["prompt"] == prompt and family["explanation"] == explanation
    assert not (family["objective"] == "LG02.O1" and family["critical"])


@pytest.mark.parametrize("state", [state for lab in LABS for state in lab["configurations"]], ids=lambda state: state["id"])
def test_all_61_frozen_states_match_trusted_reference(state):
    lab = LABS[0 if state["id"].startswith("LG-E1") else 1]
    frozen = json.loads((DIRECTORY / ("lg-e1.manifest.v1.json" if lab["id"] == "LG-E1" else "lg-e2.manifest.v1.json")).read_text())
    assert next(item for item in frozen["configurations"] if item["id"] == state["id"]) == state
    expected = state["expected"]
    if "score" in expected:
        assert np.isclose(expit(expected["score"]), expected["probability_float64"])
        assert math.isfinite(expected["stable_mathematical_loss_from_finite_logit"])
        assert len(expected["sigmoid_samples"]) == 21
    if "folds" in expected:
        assert expected["classes"] == [0, 1] and expected["predict_proba_shape"] == [1, 2]
        for fold in expected["folds"]:
            assert set(fold["held_ids"]).isdisjoint(fold["scaler_fit_ids"])
            assert fold["scaler_fit_ids"] == fold["estimator_fit_ids"]
    if "metrics" in expected:
        fixture = next(item for item in lab["fixtures"] if item["id"] == state["fixture"])
        decisions = [int(probability >= state["controls"]["threshold"]) for probability in fixture["probabilities"]]
        assert decisions == expected["metrics"]["predictions"]
        assert confusion_matrix(fixture["y"], decisions, labels=[0, 1]).tolist() == expected["metrics"]["confusion_actual_rows_01"]


def test_freeze_sources_hashes_and_byte_identical_regeneration():
    lock = json.loads((DIRECTORY / "freeze-lock.v1.json").read_text())
    for index, lab in enumerate(LABS, 1):
        name = f"lg-e{index}.manifest.v1.json"
        assert REFERENCE.encoded(lab) == (DIRECTORY / name).read_bytes()
        assert hashlib.sha256((DIRECTORY / name).read_bytes()).hexdigest() == lock["files"][name]
    assert hashlib.sha256((ROOT / "work/freeze-task-015-4.py").read_bytes()).hexdigest() == lock["reference_sha256"]
    assert hashlib.sha256((DIRECTORY / "NUMERICAL_CONVENTIONS.md").read_bytes()).hexdigest() == lock["conventions_sha256"]
