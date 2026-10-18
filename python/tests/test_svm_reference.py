import hashlib
import json
import math
import warnings
from pathlib import Path

import numpy as np
import pytest
from sklearn.metrics import balanced_accuracy_score, hinge_loss
from sklearn.metrics.pairwise import rbf_kernel
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

from mlmath.svm_reference import catalog, case

ROOT = Path(__file__).resolve().parents[2]
DIRECTORY = ROOT / "docs/verification/support-vector-machines"
MANIFESTS = [json.loads((DIRECTORY / f"sv-e{index}.manifest.v1.json").read_text()) for index in [1, 2]]
AUTHORED = json.loads((ROOT / "apps/web/app/supervised/svm/authored.json").read_text())
FAMILIES = catalog()["families"]


@pytest.mark.parametrize("family", FAMILIES, ids=lambda family: family["id"])
def test_all_scored_instances(family):
    assert next(item for item in AUTHORED["families"] if item["id"] == family["id"]) == family
    lesson, objective = int(family["objective"][2:4]), int(family["objective"][-1])
    variant = ord(family["id"][-1]) - ord("A") + (0 if ".practice." in family["id"] else 2)
    kind, _, _, _, _, facts = case(lesson, objective, variant)
    answers = family["accepted"][0]
    if kind == "numbers":
        score = float(np.dot(facts["normal"], facts["point"]) + facts["intercept"])
        distance = score / np.linalg.norm(facts["normal"])
        assert [answer["value"] for answer in answers] == pytest.approx([score, distance], abs=1e-9, rel=1e-9)
    elif kind == "number":
        if (lesson, objective) == (2, 1):
            expected = max(0., 1 - facts["sign"] * facts["score"])
            assert expected == pytest.approx(hinge_loss([0, 1], [-facts["score"], facts["score"]], labels=[0, 1]))
        elif (lesson, objective) == (3, 1):
            expected = rbf_kernel([[0., 0.]], [[facts["distance"], 0.]], gamma=facts["gamma"])[0, 0]
        else:
            expected = facts["strength"] * facts["weight"]
        assert answers[0]["value"] == pytest.approx(expected, abs=1e-9, rel=1e-9)
    elif kind == "slots":
        tuples = {tuple(entry["optionId"] for entry in answers[0]["entries"]) for answers in family["accepted"]}
        assert tuples == {(fit, select) for fit in ["fold_train", "fold_training_alias"] for select in ["development", "development_alias"]}
    else:
        selected = next(option["label"] for option in family["atoms"][0]["options"] if option["id"] == answers[0]["optionId"])
        invariants = {(1, 2): "no calibrated probability", (1, 3): "nonzero dual-coefficient", (1, 4): "training rows", (2, 2): "not stronger norm regularization", (2, 3): "inspect actual hinge", (2, 4): "Hinge can be zero", (3, 2): "pairwise computation", (3, 3): "these permitted rows", (3, 4): "perfect training fit does not prove generalization", (4, 1): "stays sealed", (4, 2): "inside each training fold", (5, 1): "same-row errors", (5, 2): "Reject", (5, 3): "support/kernel work", (5, 4): "no algorithm wins universally"}
        assert invariants[(lesson, objective)] in selected
        assert len(set(option["label"] for option in family["atoms"][0]["options"])) == 3
        if (lesson, objective) == (1, 3):
            scene = next(config for config in MANIFESTS[0]["configurations"] if config["id"] == facts["config_id"])
            assert scene["support_ids"] == facts["support_ids"]
    assert family["critical"] == (objective == 2)
    assert len(family["atoms"]) <= 2
    if family["critical"]:
        assert len(family["atoms"]) == 2
    assert family["remediation"] and family["explanation"]


CONFIGS = [(manifest, config) for manifest in MANIFESTS for config in manifest["configurations"]]
FIRST = json.loads((ROOT / "apps/web/app/supervised/svm/replay-e1.json").read_text())
SECOND = json.loads((ROOT / "apps/web/app/supervised/svm/replay-e2.json").read_text())
EXTRA = json.loads((ROOT / "apps/web/app/supervised/svm/replay-e2-extra.json").read_text())
REPLAY = [FIRST, {**SECOND, "configurations": SECOND["configurations"] + EXTRA}]


@pytest.mark.parametrize("manifest,config", CONFIGS, ids=[config["id"] for _, config in CONFIGS])
def test_every_frozen_state(manifest, config):
    replay = next(item for item in REPLAY if item["id"] == manifest["id"])
    exported = next(item for item in replay["configurations"] if item["id"] == config["id"])
    assert exported["expected"] == config
    assert all("sealed_test" not in data for data in replay["fixtures"])
    if config["kind"] == "rejected":
        assert config["expected"] == {"tag": "invalid", "prediction": None, "score": None, "support_ids": None}
        return
    data = next(data for data in manifest["datasets"] if data["id"] == config["fixture_id"])
    if config["kind"] == "manual-geometry":
        coefficient = np.array(config["controls"]["coefficient"])
        inputs = np.array(data["validation"]["inputs"])
        score = inputs @ coefficient + config["controls"]["intercept"]
        assert np.allclose(score, config["decision_scores"], atol=1e-9, rtol=1e-9)
        norm = np.linalg.norm(coefficient)
        if norm:
            assert np.allclose(score / norm, config["signed_distance"], atol=1e-9, rtol=1e-9)
            assert config["canonical_slab_width"] == pytest.approx(2 / norm)
        else:
            assert config["signed_distance"]["tag"] == "undefined"
        assert config["solver_support_ids"]["tag"] == "unavailable"
        signs = 2 * np.array(data["validation"]["targets"]) - 1
        assert np.allclose(np.maximum(0, 1 - signs * score), config["hinge"])
        return
    inputs = np.array(data["training"]["inputs"])
    scaler = StandardScaler().fit(inputs) if config["controls"]["scaling"] == "training-standard" else None
    if scaler is not None:
        assert config["preprocessing"]["fit_ids"] == data["training"]["ids"]
        assert np.allclose(scaler.mean_, config["preprocessing"]["mean"])
        assert np.allclose(scaler.var_, config["preprocessing"]["population_variance"])
    prepared = scaler.transform(inputs) if scaler is not None else inputs
    policy = config["controls"]["class_weight"]
    weight = None if policy == "none" else "balanced" if policy == "balanced" else {0: 1., 1: 3.}
    model = SVC(kernel=config["controls"]["kernel"], C=config["controls"]["C"], gamma=config["controls"]["gamma"], probability=False, shrinking=False, tol=1e-6, max_iter=200000, cache_size=64, class_weight=weight, random_state=1729, decision_function_shape="ovr", break_ties=False)
    with warnings.catch_warnings(record=True) as notices:
        warnings.simplefilter("always")
        model.fit(prepared, data["training"]["targets"])
    assert model.fit_status_ == config["fit_status"] == 0
    assert all(issubclass(notice.category, FutureWarning) and "probability" in str(notice.message) for notice in notices)
    assert model.support_.tolist() == config["support_indices"]
    assert [data["training"]["ids"][index] for index in model.support_] == config["support_ids"]
    for partition in ["training", "validation", "plot_queries"]:
        points = np.array(data[partition]["inputs"])
        transformed = scaler.transform(points) if scaler is not None else points
        result = config["outputs"][partition]
        score = model.decision_function(transformed)
        assert np.allclose(score, result["decision_scores"], atol=1e-9, rtol=1e-9)
        assert model.predict(transformed).tolist() == result["predictions"]
        assert (score >= 0).astype(int).tolist() == result["predictions"]
        if partition != "plot_queries":
            assert balanced_accuracy_score(data[partition]["targets"], result["predictions"]) == pytest.approx(result["metrics"]["balanced_accuracy"])
    assert "sealed_test" not in config["outputs"]
    assert max(row["kkt_violation"] for row in config["kkt_rows"]) <= 1e-4
    assert abs(config["primal_dual_gap"]) <= 1e-4 * max(1, config["primal_objective"])


def test_hashes_counts_and_selection():
    lock = json.loads((DIRECTORY / "freeze-lock.v1.json").read_text())
    for name, expected in lock["sha256"].items():
        assert hashlib.sha256((DIRECTORY / name).read_bytes()).hexdigest() == expected
    assert hashlib.sha256((ROOT / "work/freeze-task-015-10.py").read_bytes()).hexdigest() == lock["generator_sha256"]
    assert hashlib.sha256((DIRECTORY / "SOLVER_MARGIN_KERNEL_CONVENTIONS.md").read_bytes()).hexdigest() == lock["conventions_sha256"]
    assert len(FAMILIES) == 100
    assert [len(manifest["configurations"]) for manifest in MANIFESTS] == [15, 43]
    for manifest in MANIFESTS:
        for chosen in manifest["validation_selection"]:
            candidates = [next(config for config in manifest["configurations"] if config["id"] == identity) for identity in chosen["candidate_ids_in_tie_order"]]
            maximum = max(config["outputs"]["validation"]["metrics"]["balanced_accuracy"] for config in candidates)
            expected = next(config["id"] for config in candidates if abs(config["outputs"]["validation"]["metrics"]["balanced_accuracy"] - maximum) <= 1e-12)
            assert chosen["selected_id"] == expected
            assert not chosen["test_evaluated"]


def test_geometric_and_scaling_counterexamples():
    first = MANIFESTS[0]["configurations"]
    assert first[0]["canonical_margin_slab_width_in_fitted_space"] == pytest.approx(4)
    assert first[1]["canonical_margin_slab_width_in_fitted_space"] == pytest.approx(2)
    assert len(first[1]["support_ids"]) == 2
    assert sum(abs(row["functional_margin"] - 1) < 1e-6 for row in first[1]["kkt_rows"]) == 4
    assert np.allclose(first[6]["signed_distance"], first[7]["signed_distance"])
    second = MANIFESTS[1]["configurations"]
    scores = {config["id"]: config["outputs"]["validation"]["metrics"]["balanced_accuracy"] for config in second if config["kind"] == "fitted"}
    assert scores["sv.rbf.clean.v1.rbf.C-1.0.gamma-1.0.raw.weights-none"] == .5
    assert scores["sv.rbf.clean.v1.rbf.C-1.0.gamma-1.0.scaled.weights-none"] == 1.
    assert math.isclose(math.exp(-1), rbf_kernel([[0., 0.]], [[1., 0.]], gamma=1.)[0, 0])
