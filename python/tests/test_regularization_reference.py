import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np
import pytest
from sklearn.linear_model import ElasticNet, Lasso, Ridge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from mlmath.regularization_reference import case, catalog

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("regularization_frozen_reference", ROOT / "work/freeze-task-015-3.py")
REFERENCE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(REFERENCE)
LABS = REFERENCE.generate()
CATALOG = catalog()
DIRECTORY = ROOT / "docs/verification/regularization"


@pytest.mark.parametrize("family", CATALOG["families"], ids=lambda family: family["id"])
def test_all_120_instances_reference_arithmetic_and_semantics(family):
    stored = json.loads((ROOT / "apps/web/app/supervised/regularization/authored.json").read_text())
    assert next(item for item in stored["families"] if item["id"] == family["id"]) == family
    lesson, objective = int(family["objective"][2:4]), int(family["objective"][-1])
    variant = ord(family["id"][-1]) - ord("A") + (0 if ".practice." in family["id"] else 2)
    kind, prompt, expected, why, distractors = case(lesson, objective, variant)
    value = variant + 1
    weights = np.array([value, -2])
    if kind == "number":
        oracle = {
            (1, 3): np.linalg.norm(weights, 1) + weights @ weights,
            (2, 1): 4 + value * np.dot([1, -2], [1, -2]),
            (3, 1): 4 / (2 * 2) + .5 * np.linalg.norm(weights, 1),
            (4, 1): .5 * np.linalg.norm(weights, 1) + .5 / 2 * (weights @ weights),
            (6, 1): 3 * value / 3,
        }[(lesson, objective)]
        assert expected == oracle
    elif kind == "choice":
        assert expected not in distractors and len(set(distractors)) == 2
        if (lesson, objective) == (4, 3):
            assert expected == [".25", ".5", ".75"][np.argmin([value + 2, value, value + 1])]
        if objective == 2:
            protected = {1: "unseen", 2: "shrinks", 3: "Conditional sparsity", 4: "mixes", 5: "each fold", 6: "units"}
            assert protected[lesson] in expected + why
    else:
        assert (lesson, objective) == (5, 3)
        assert len(family["accepted"]) == 2
        assert all(answer[0]["entries"][-1]["optionId"] == "model" for answer in family["accepted"])
    assert len(family["atoms"]) == (2 if objective == 2 else 1)
    assert family["critical"] == (objective == 2)
    assert prompt == family["prompt"] and why == family["explanation"]


@pytest.mark.parametrize("state", [state for lab in LABS for state in lab["configurations"]], ids=lambda state: state["id"])
def test_all_36_states_and_108_fold_fits(state):
    lab = LABS[0 if state["id"].startswith("RG-E1") else 1]
    fixture = next(item for item in lab["fixtures"] if item["id"] == state["fixture"])
    controls = state["controls"]
    expected = state["expected"]
    if state["selection_valid"]:
        if controls["model"] == "ridge":
            estimator = Ridge(alpha=controls["alpha"], solver="svd", tol=1e-10)
        elif controls["model"] == "lasso":
            estimator = Lasso(alpha=controls["alpha"], tol=1e-10, max_iter=100000, selection="cyclic", random_state=1729)
        else:
            estimator = ElasticNet(alpha=controls["alpha"], l1_ratio=controls["l1_ratio"], tol=1e-10, max_iter=100000, selection="cyclic", random_state=1729)
        pipeline = make_pipeline(StandardScaler(), estimator).fit(fixture["training"]["x"], fixture["training"]["y"])
        assert np.allclose(pipeline.predict(fixture["validation"]["x"]), expected["validation_predictions"], atol=1e-9, rtol=1e-9)
    for fold in state["cv_folds"]:
        assert set(fold["held_ids"]).isdisjoint(fold["estimator_fit_ids"])
        assert set(fold["held_ids"]).isdisjoint(fold["scaler_fit_ids"]) == state["selection_valid"]
    for coefficient, tag in zip(expected["coefficients_standardized"], expected["coefficient_states"]):
        assert (coefficient == 0) == (tag == "exact-zero")
    assert np.isclose(np.mean([fold["held_mae"] for fold in state["cv_folds"]]), state["cv_mean_mae"])
    assert not expected["convergence"]["warnings"]


def test_frozen_hashes_sources_and_byte_identical_regeneration():
    lock = json.loads((DIRECTORY / "freeze-lock.v1.json").read_text())
    for index, manifest in enumerate(LABS, 1):
        name = f"rg-e{index}.manifest.v1.json"
        assert REFERENCE.encoded(manifest) == (DIRECTORY / name).read_bytes()
        assert hashlib.sha256((DIRECTORY / name).read_bytes()).hexdigest() == lock["files"][name]
    assert hashlib.sha256((ROOT / "work/freeze-task-015-3.py").read_bytes()).hexdigest() == lock["reference_sha256"]
    assert hashlib.sha256((DIRECTORY / "NUMERICAL_CONVENTIONS.md").read_bytes()).hexdigest() == lock["conventions_sha256"]
