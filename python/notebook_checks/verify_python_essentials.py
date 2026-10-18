import hashlib
import json
import os
import platform
import sys
from pathlib import Path

import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "outputs/task-013-2/notebook"
OUTPUT.mkdir(parents=True, exist_ok=True)
os.environ.update({"PYTHONHASHSEED": "0", "OMP_NUM_THREADS": "1", "OPENBLAS_NUM_THREADS": "1", "MKL_NUM_THREADS": "1", "IPYTHONDIR": str(OUTPUT / "ipython")})
path = ROOT / "apps/web/public/notebooks/python-essentials.ipynb"
original = nbformat.read(path, as_version=4)
nbformat.validate(original)
runs = []
for run_number in (1, 2):
    workspace = OUTPUT / f"run-{run_number}"
    workspace.mkdir(exist_ok=True)
    notebook = nbformat.from_dict(original)
    executed = NotebookClient(notebook, timeout=60, kernel_name="python3", allow_errors=False, resources={"metadata": {"path": str(workspace)}}).execute()
    nbformat.write(executed, workspace / "executed.ipynb")
    final = next(cell for cell in reversed(executed.cells) if cell.cell_type == "code")
    result = json.loads("".join(output.text for output in final.outputs if output.output_type == "stream" and output.name == "stdout"))
    assert result["families"] == 32 and result["lessons"] == 8
    (workspace / "results.json").write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    runs.append(result)
assert runs[0] == runs[1]
report = {"python": sys.version, "platform": platform.platform(), "fresh_kernel_runs": 2, "equal_outputs": True, "families": 32, "notebook_sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "result_sha256": hashlib.sha256(json.dumps(runs[0], sort_keys=True).encode()).hexdigest(), "colab": "UNVERIFIED; local execution only", "scope": "Fixed trusted author notebook only; 60 seconds per cell; no hosted learner execution."}
(OUTPUT / "report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
