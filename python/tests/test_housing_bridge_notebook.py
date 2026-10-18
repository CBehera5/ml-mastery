"""Independent Python/runtime parity and actual execution of the downloadable project notebook."""
import json
import math
from pathlib import Path
import pytest
from mlmath import feature_scaling_trace, transform_features, regression_training_trace, regression_evaluation_trace

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "apps/web/public"
DATA = json.loads((PUBLIC / "data/linear-regression-housing-bridge.v1.json").read_text())
REFERENCE = json.loads((PUBLIC / "data/linear-regression-housing-bridge.reference.v1.json").read_text())


def test_project_python_runtime_matches_independent_notebook_fixture():
    train = [row for row in DATA["rows"] if row["split"] == "train"]
    test = [row for row in DATA["rows"] if row["split"] == "test"]
    scaling = feature_scaling_trace([[r["area"], r["age"]] for r in train])
    assert scaling["mean"] == pytest.approx(REFERENCE["mean"])
    assert scaling["scale"] == pytest.approx(REFERENCE["scale"])
    trace = regression_training_trace(features=scaling["scaled"], targets=[r["price"] for r in train], weights=[0, 0], bias=200, learning_rate=0.05, iterations=100)
    final = trace["entries"][-1]
    assert final["weights"] == pytest.approx(REFERENCE["weights"])
    assert final["bias"] == pytest.approx(REFERENCE["bias"])
    test_x = transform_features([[r["area"], r["age"]] for r in test], scaling["mean"], scaling["scale"])
    result = regression_evaluation_trace(features=test_x, targets=[r["price"] for r in test], weights=final["weights"], bias=final["bias"])
    assert result["metrics"] == pytest.approx(REFERENCE["testMetrics"])
    assert [r["prediction"] for r in result["rows"]] == pytest.approx(REFERENCE["testPredictions"])


def test_downloadable_notebook_executes_all_cells_in_a_fresh_namespace():
    notebook = json.loads((PUBLIC / "notebooks/linear-regression-housing-bridge.ipynb").read_text())
    namespace = {"__name__": "__main__"}
    count = 0
    for index, cell in enumerate(notebook["cells"]):
        if cell["cell_type"] == "code":
            exec(compile("".join(cell["source"]), f"housing-bridge:cell-{index}", "exec"), namespace)
            count += 1
    assert count == 8
    assert namespace["dataset"] == DATA
    assert namespace["test_metrics"] == pytest.approx(REFERENCE["testMetrics"])
    assert "not real" in namespace["dataset"]["provenance"].lower() or "no real" in namespace["dataset"]["provenance"].lower()
    assert math.isfinite(namespace["test_metrics"]["rmse"])
