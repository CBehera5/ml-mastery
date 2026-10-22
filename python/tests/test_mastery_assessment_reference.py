"""Independent arithmetic and verified Python runtime checks for all mastery numerical variants."""
import json
from pathlib import Path
import pytest
from mlmath import regression_evaluation_trace, regression_gradient_trace, regression_update_trace, regression_metrics

ROOT = Path(__file__).resolve().parents[2]
REFERENCE = json.loads((ROOT / "apps/web/app/algorithms/linear-regression/mastery/math-reference.v1.json").read_text())["variants"]

@pytest.mark.parametrize("index", range(12))
def test_mastery_numerical_variant_reference(index):
    n = index + 1
    expected = REFERENCE[f"v{n:02d}"]
    assert expected["q04"] == (4 if index % 2 else -3)
    prediction = regression_evaluation_trace(features=[[n + 1]], targets=[0], weights=[2 + index % 3], bias=3)
    assert expected["q05"] == pytest.approx(prediction["rows"][0]["prediction"])
    assert expected["q06"] == pytest.approx(regression_metrics([-n, n + 1])["mse"])
    assert expected["q07"] == pytest.approx(regression_metrics([n, -n - 2, 2])["mae"])
    gradient = regression_gradient_trace(features=[[1], [2]], targets=[n + 3, 2 * n + 4], weights=[1], bias=0)
    assert expected["q08"] == pytest.approx(gradient["weightGradients"][0])
    update = regression_update_trace(features=[[1], [3]], targets=[3 * n, 4 * n + 1], weights=[2], bias=1, learning_rate=0.1)
    assert expected["q09"] == pytest.approx(update["updatedParameters"]["weights"][0])
    multi = regression_evaluation_trace(features=[[n, 2]], targets=[0], weights=[2, -3], bias=5)
    assert expected["q13"] == pytest.approx(multi["rows"][0]["prediction"])
    trace = regression_update_trace(features=[[2], [4]], targets=[n + 7, n + 15], weights=[2], bias=1, learning_rate=0.05)
    params = trace["updatedParameters"]
    inference = regression_evaluation_trace(features=[[n + 2]], targets=[0], weights=params["weights"], bias=params["bias"])
    assert expected["q19"] == pytest.approx(inference["rows"][0]["prediction"])
