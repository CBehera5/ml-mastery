import json
from pathlib import Path

import pytest

NOTEBOOKS = Path(__file__).resolve().parents[2] / "apps/web/public/notebooks"


@pytest.mark.parametrize("name", ["functions-derivatives", "vectors-dot-product", "matrices-multiplication", "linear-regression-from-scratch", "linear-regression-housing-bridge"])
def test_published_notebook_code_executes_without_network(name):
    notebook = json.loads((NOTEBOOKS / f"{name}.ipynb").read_text())
    namespace = {"__name__": "__main__"}
    executed = 0
    for index, cell in enumerate(notebook["cells"]):
        if cell["cell_type"] == "code":
            exec(compile("".join(cell["source"]), f"{name}:cell-{index}", "exec"), namespace)
            executed += 1
    assert executed >= 3
