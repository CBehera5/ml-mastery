import hashlib
import json
import os
import sys
from pathlib import Path

import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "outputs/task-013-1/notebook"
OUTPUT.mkdir(parents=True, exist_ok=True)
os.environ.update({
    "PYTHONHASHSEED": "0",
    "OMP_NUM_THREADS": "1",
    "OPENBLAS_NUM_THREADS": "1",
    "MKL_NUM_THREADS": "1",
    "MPLBACKEND": "Agg",
    "IPYTHONDIR": str(OUTPUT / "ipython"),
})
notebook_path = ROOT / "apps/web/public/notebooks/python-p01-template.ipynb"
original = nbformat.read(notebook_path, as_version=4)
nbformat.validate(original)
results = []
for run_number in (1, 2):
    workspace = OUTPUT / f"run-{run_number}"
    workspace.mkdir(exist_ok=True)
    notebook = nbformat.from_dict(original)
    client = NotebookClient(notebook, timeout=60, kernel_name="python3", allow_errors=False, resources={"metadata": {"path": str(workspace)}})
    executed = client.execute()
    nbformat.write(executed, workspace / "executed.ipynb")
    final_cell = next(cell for cell in reversed(executed.cells) if cell.cell_type == "code")
    stdout = "".join(output.text for output in final_cell.outputs if output.output_type == "stream" and output.name == "stdout")
    result = json.loads(stdout)
    (workspace / "results.json").write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    results.append(result)
assert results[0] == results[1]
report = {
    "python": sys.version,
    "fresh_kernel_runs": 2,
    "outputs_equal": True,
    "notebook_sha256": hashlib.sha256(notebook_path.read_bytes()).hexdigest(),
    "result_sha256": hashlib.sha256(json.dumps(results[0], sort_keys=True).encode()).hexdigest(),
    "colab": "UNVERIFIED: local execution is not Google Colab evidence.",
    "limits": "60 seconds per cell; trusted fixed author notebook only, not a hosted learner execution service.",
}
(OUTPUT / "report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
