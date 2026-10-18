import hashlib
import json
import math
from fractions import Fraction
from pathlib import Path

import numpy as np
import pytest
from scipy.special import expit
from sklearn.metrics import log_loss, mean_squared_error

from mlmath.gradient_boosting_reference import catalog, case

ROOT = Path(__file__).resolve().parents[2]
DIRECTORY = ROOT / "docs/verification/gradient-boosting"
FAMILIES = catalog()["families"]
MANIFESTS = [json.loads((DIRECTORY / f"gb-e{index}.manifest.v1.json").read_text()) for index in [1, 2]]


@pytest.mark.parametrize("family", FAMILIES, ids=lambda family: family["id"])
def test_all_scored_instances(family):
    authored = json.loads((ROOT / "apps/web/app/supervised/gradient-boosting/authored.json").read_text())
    assert next(entry for entry in authored["families"] if entry["id"] == family["id"]) == family
    lesson, objective = int(family["objective"][2:4]), int(family["objective"][-1])
    variant = ord(family["id"][-1]) - ord("A") + (0 if ".practice." in family["id"] else 2)
    answer = family["accepted"][0][0]
    _, _, _, _, _, facts = case(lesson, objective, variant)
    if answer["kind"] == "number":
        if (lesson, objective) in [(1, 1), (2, 1), (2, 2)]:
            expected = float(Fraction(str(facts["initial"])) + Fraction(str(facts["rate"])) * Fraction(str(facts["correction"])))
        elif (lesson, objective) == (2, 3):
            expected = mean_squared_error(facts["residuals"], [0, 0])
        elif (lesson, objective) == (3, 1):
            expected = 1 - expit(facts["score"])
        else:
            expected = expit(facts["score"])
        assert answer["value"] == pytest.approx(expected, abs=1e-9, rel=1e-9)
    else:
        atom = family["atoms"][0]
        selected = next(option["label"] for option in atom["options"] if option["id"] == answer["optionId"])
        assert len(set(option["label"] for option in atom["options"])) == 3
        invariants = {(1, 2): "current training loss gradients", (1, 3): "equal eta×stages need not", (1, 4): "measures loss without fitting", (2, 4): "100 times larger", (3, 2): "Newton adjustment", (3, 4): "Score0;probability.5;action label1", (4, 1): "validation loss", (4, 2): "validation loss", (4, 3): "actual validation trace", (4, 4): "training improves while validation worsens", (5, 1): "inside each training fold", (5, 2): "inside each training fold", (5, 3): "inside each training fold", (5, 4): "Binary log-loss" if variant in [1, 2, 4] else "Squared-error", (6, 1): "smaller observed MAE", (6, 2): "Reject the guarantee", (6, 3): "not a causal effect", (6, 4): "limits"}
        assert invariants[(lesson, objective)] in selected
        if lesson == 4 and objective in [1, 2]:
            assert f"Stage{int(np.argmin(facts['losses'])) + 1}," in selected
        if lesson == 5 and objective in [1, 2, 3]:
            assert "inside each training fold" in selected and "freeze before untouched test" in selected
        if (lesson, objective) == (3, 2):
            assert "Newton" in selected and "score" in selected
        if (lesson, objective) == (1, 2):
            assert "current training loss gradients" in selected
        if lesson == 6:
            assert any(word in selected for word in ["observed", "Reject", "not a causal", "limits"])
    assert family["critical"] == (objective == 2)
    assert len(family["atoms"]) == (2 if objective == 2 else 1)
    assert family["remediation"] and family["explanation"]


STAGES = [(manifest_index, run, stage) for manifest_index, manifest in enumerate(MANIFESTS) for run in manifest["runs"] for stage in run["stages"]]


@pytest.mark.parametrize("manifest_index,run,stage", STAGES, ids=[f"{run['id']}.stage{stage['stage']}" for _, run, stage in STAGES])
def test_all_frozen_stage_arithmetic(manifest_index, run, stage):
    dataset = next(data for data in MANIFESTS[manifest_index]["datasets"] if run["id"].startswith(data["id"] + ".eta-"))
    targets = np.array(dataset["training"]["targets"])
    before = np.array(stage["before_training_score"])
    gradient = targets - (before if manifest_index == 0 else expit(before))
    assert np.allclose(gradient, stage["negative_gradient"], atol=1e-9, rtol=1e-9)
    after = before + run["learning_rate"] * np.array(stage["unscaled_training_tree_contribution"])
    assert np.allclose(after, stage["training_score"], atol=1e-9, rtol=1e-9)
    score = mean_squared_error(targets, after) if manifest_index == 0 else log_loss(targets, expit(after), labels=[0, 1])
    assert score == pytest.approx(stage["training_loss"], abs=1e-9, rel=1e-9)
    train_ids = dataset["training"]["ids"]
    for leaf in stage["leaf_checks"]:
        indices = [train_ids.index(identity) for identity in leaf["training_ids"]]
        if manifest_index == 0:
            correction = np.mean(gradient[indices])
        else:
            probability = expit(before[indices])
            correction = sum(gradient[indices]) / sum(probability * (1 - probability))
        assert correction == pytest.approx(leaf["expected_leaf_value"], abs=1e-9, rel=1e-9)


CONFIGS = [(manifest, config) for manifest in MANIFESTS for config in manifest["configurations"]]


@pytest.mark.parametrize("manifest,config", CONFIGS, ids=[config["id"] for _, config in CONFIGS])
def test_each_frozen_configuration_and_replay(manifest, config):
    replay = json.loads((ROOT / "apps/web/app/supervised/gradient-boosting/replay.json").read_text())
    lab = next(lab for lab in replay if lab["id"] == manifest["id"])
    displayed = next(entry for entry in lab["configurations"] if entry["id"] == config["id"])
    assert displayed["expected"] == config
    assert all("sealed_test" not in fixture for fixture in lab["fixtures"])
    if config.get("status") == "rejected":
        assert config["outcome"] == {"tag": "invalid", "prediction": None}
        return
    run = next(run for run in manifest["runs"] if run["id"] == config["run_id"])
    assert next(entry for entry in lab["runs"] if entry["id"] == run["id"]) == run
    candidates = run["stages"][:config["estimator_budget"]]
    minimum = min(stage["validation_loss"] for stage in candidates)
    selected = next(stage for stage in candidates if abs(stage["validation_loss"] - minimum) <= 1e-12)
    assert selected["stage"] == config["selected_stage"]
    assert selected["validation_loss"] == config["selected_validation_loss"]


def test_freeze_hashes_and_untouched_test():
    lock = json.loads((DIRECTORY / "freeze-lock.v1.json").read_text())
    for filename, expected in lock["sha256"].items():
        assert hashlib.sha256((DIRECTORY / filename).read_bytes()).hexdigest() == expected
    for manifest in MANIFESTS:
        assert len(manifest["configurations"]) == 27
        for data in manifest["datasets"]:
            partitions = [set(data[name]["ids"]) for name in ["training", "validation", "sealed_test"]]
            assert all(not left & right for index, left in enumerate(partitions) for right in partitions[index+1:])
        assert "test_loss" not in json.dumps(manifest["runs"])
    assert math.isclose(float(expit(0)), .5)


def test_loss_endpoints_and_probability_quality():
    assert np.logaddexp(0, 1000) - 1000 == 0
    assert np.logaddexp(0, 1000) == 1000
    run = next(run for run in MANIFESTS[1]["runs"] if run["id"] == "gb.classification.noisy.v1.eta-0.5")
    assert all(stage["validation_accuracy"] == 1 for stage in run["stages"])
    assert run["stages"][3]["validation_loss"] < run["stages"][7]["validation_loss"]
