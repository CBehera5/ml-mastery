import hashlib
import importlib.metadata
import json
import os
import platform
import sys
from pathlib import Path

import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "outputs/task-015-3/notebooks"
OUTPUT.mkdir(parents=True, exist_ok=True)
os.environ.update({"PYTHONHASHSEED": "0", "OMP_NUM_THREADS": "1", "OPENBLAS_NUM_THREADS": "1", "MPLBACKEND": "Agg", "IPYTHONDIR": str(OUTPUT / "ipython")})
source = ROOT / "apps/web/public/notebooks/supervised-regularization.ipynb"
original = nbformat.read(source, as_version=4)
nbformat.validate(original)
results = []
for number in (1, 2):
    workspace = OUTPUT / f"run-{number}"
    workspace.mkdir(parents=True, exist_ok=True)
    notebook = NotebookClient(nbformat.from_dict(original), timeout=60, kernel_name="python3", allow_errors=False, resources={"metadata": {"path": str(workspace)}}).execute()
    nbformat.write(notebook, workspace / "executed.ipynb")
    outputs = ["".join(output.text for output in cell.outputs if output.output_type == "stream" and output.name == "stdout") for cell in notebook.cells if cell.cell_type == "code"]
    result = json.loads(outputs[-1].splitlines()[-1])
    assert result["rows"] == 16 and result["folds"] == 3 and result["candidates"] == 12
    results.append(outputs)
assert results[0] == results[1]
report = {"fresh_kernels": 2, "all_stdout_equal": True, "rows": 16, "folds": 3, "candidates": 12, "python": sys.version, "platform": platform.platform(), "dependencies": {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "nbclient", "nbformat", "ipykernel"]}, "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "outputs_sha256": hashlib.sha256(json.dumps(results[0], sort_keys=True).encode()).hexdigest(), "colab": "UNVERIFIED: local kernels only"}
(OUTPUT / "report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
