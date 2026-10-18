import json
from pathlib import Path

import numpy as np
import pytest

from mlmath import dot_product_trace


def test_house_score() -> None:
    assert dot_product_trace([2, 3, 4], [5, 2, 3]) == {
        "schemaVersion": "1.0.0",
        "input": {"features": [2.0, 3.0, 4.0], "weights": [5.0, 2.0, 3.0]},
        "contributions": [10.0, 6.0, 12.0],
        "value": 28.0,
    }


@pytest.mark.parametrize("features,weights,message", [([], [], "non-empty"), ([1, np.nan], [2, 3], "finite"), ([1, 2], [3], "same length")])
def test_invalid_vectors(features: list[float], weights: list[float], message: str) -> None:
    with pytest.raises(ValueError, match=message):
        dot_product_trace(features, weights)


def test_randomized_parity_with_numpy() -> None:
    rng = np.random.default_rng(504)
    for dimension in range(1, 33):
        features = rng.uniform(-5, 5, dimension)
        weights = rng.uniform(-3, 3, dimension)
        trace = dot_product_trace(features, weights)
        assert trace["value"] == pytest.approx(float(np.dot(features, weights)))


def test_generated_fixture() -> None:
    path = Path(__file__).parents[2] / "packages/math-contracts/fixtures/dot-product.v1.json"
    fixture = json.loads(path.read_text())
    for case in fixture["cases"]:
        assert dot_product_trace(**case["input"]) == case["trace"]

