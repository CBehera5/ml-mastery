import hashlib
import json
from pathlib import Path

import numpy as np
import pytest
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

from mlmath.polynomial_reference import DEV, TRAIN, case, catalog, experiments, expand, fitted, serialize

ROOT = Path(__file__).resolve().parents[2]
CATALOG = catalog()
LABS = experiments()


@pytest.mark.parametrize("family", CATALOG["families"], ids=lambda family: family["id"])
def test_all_80_scored_instances_regenerate_with_reference_arithmetic(family):
    stored = json.loads((ROOT / "apps/web/app/supervised/polynomial/authored.json").read_text())
    assert next(item for item in stored["families"] if item["id"] == family["id"]) == family
    lesson = int(family["objective"][2:4])
    objective = int(family["objective"][-1])
    variant = ord(family["id"][-1]) - ord("A") + (0 if ".practice." in family["id"] else 2)
    kind, prompt, expected, why = case(lesson, objective, variant)
    if lesson == 1 and objective == 3:
        value = variant + 1
        assert expected == float(np.array([value, value ** 2]) @ np.array([2, 3]) + 1)
    if lesson == 2 and objective == 1:
        actual = PolynomialFeatures(2, include_bias=False).fit_transform([[variant + 1, variant + 2]])[0].tolist()
        assert expected == str(actual).replace(".0", "")
    assert family["critical"] == (objective == 2)
    assert len(family["atoms"]) == (2 if family["critical"] else 1)
    assert prompt == family["prompt"] and why == family["explanation"]


@pytest.mark.parametrize("entry", [entry for lab in LABS for entry in lab["configurations"]], ids=lambda entry: entry["id"])
def test_all_76_frozen_states_match_manual_and_trusted_reference(entry):
    lab = 0 if entry["id"].startswith("PR-E1") else 1
    filename = ["pr-e1.manifest.v1.json", "pr-e2.manifest.v1.json"][lab]
    frozen = json.loads((ROOT / "docs/verification/polynomial" / filename).read_text())
    assert next(item for item in frozen["configurations"] if item["id"] == entry["id"]) == entry
    fixture = next(item for item in LABS[lab]["fixtures"] if item["id"] == entry["fixture"])
    if lab == 0:
        row = fixture["row"]
        if "degree" in entry["controls"]:
            expected = expand(row, entry["controls"]["degree"])
            assert entry["expected"]["features"] == expected
            assert np.allclose(PolynomialFeatures(entry["controls"]["degree"], include_bias=False).fit_transform([row])[0], expected)
        features = entry["expected"]["features"]
        assert np.isclose(entry["expected"]["prediction"], np.dot(features, fixture["coefficients"]) + fixture["intercept"], rtol=1e-9, atol=1e-9)
    else:
        controls = entry["controls"]
        degree = controls["degree"]
        if controls["fit_provenance"] == "fold-local":
            estimator = LinearRegression() if controls["penalty"] == "none" else Ridge(alpha=1, solver="svd")
            pipeline = make_pipeline(PolynomialFeatures(degree, include_bias=False), StandardScaler(), estimator)
            pipeline.fit(np.array(TRAIN["x"]).reshape(-1, 1), TRAIN["y"])
            actual = pipeline.predict([[controls["query"]]])[0]
            assert abs(actual - entry["expected"]["query_prediction"]) <= 1e-9 + 1e-9 * abs(entry["expected"]["query_prediction"])
        assert entry["expected"]["valid"] == (controls["fit_provenance"] == "fold-local" and controls["selection"] == "development")
        residuals = np.array(DEV["y"]) - entry["expected"]["development_predictions"]
        assert np.isclose(np.mean(abs(residuals)), entry["expected"]["development_mae"])


def test_freeze_hashes_and_byte_identical_regeneration():
    directory = ROOT / "docs/verification/polynomial"
    lock = json.loads((directory / "freeze-lock.v1.json").read_text())
    for index, lab in enumerate(LABS):
        name = ["pr-e1.manifest.v1.json", "pr-e2.manifest.v1.json"][index]
        assert serialize(lab) == (directory / name).read_text()
        assert hashlib.sha256((directory / name).read_bytes()).hexdigest() == lock["files"][name]
        assert len(lab["configurations"]) == [28, 48][index]
    assert hashlib.sha256((ROOT / "python/mlmath/polynomial_reference.py").read_bytes()).hexdigest() == lock["reference_sha256"]
    assert hashlib.sha256((ROOT / "apps/web/app/supervised/polynomial/authored.json").read_bytes()).hexdigest() == lock["authored_sha256"]
