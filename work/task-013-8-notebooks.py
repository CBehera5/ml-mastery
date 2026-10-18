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
OUTPUT = ROOT / "outputs/task-013-8/notebooks"
OUTPUT.mkdir(parents=True, exist_ok=True)
os.environ.update({"PYTHONHASHSEED": "0", "OMP_NUM_THREADS": "1", "OPENBLAS_NUM_THREADS": "1", "MKL_NUM_THREADS": "1", "MPLBACKEND": "Agg", "IPYTHONDIR": str(OUTPUT / "ipython")})
reports = []
for module, lessons, families in [("essentials", 8, 32), ("numpy", 6, 24), ("pandas", 6, 24), ("visualization", 5, 20), ("preparation", 6, 24), ("sklearn", 5, 20)]:
    path = ROOT / f"apps/web/public/notebooks/python-{module}.ipynb"
    original = nbformat.read(path, as_version=4)
    nbformat.validate(original)
    results = []
    for number in (1, 2):
        workspace = OUTPUT / module / f"run-{number}"
        workspace.mkdir(parents=True, exist_ok=True)
        notebook = nbformat.from_dict(original)
        executed = NotebookClient(notebook, timeout=60, kernel_name="python3", allow_errors=False, resources={"metadata": {"path": str(workspace)}}).execute()
        nbformat.write(executed, workspace / "executed.ipynb")
        final = next(cell for cell in reversed(executed.cells) if cell.cell_type == "code")
        result = json.loads("".join(output.text for output in final.outputs if output.output_type == "stream" and output.name == "stdout"))
        assert result["families"] == families and result["lessons"] == lessons
        (workspace / "results.json").write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
        results.append(result)
    assert results[0] == results[1], module
    report = {"module": module, "fresh_kernels": 2, "equal_final_results": True, "lessons": lessons, "families": families, "source_sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "result_sha256": hashlib.sha256(json.dumps(results[0], sort_keys=True).encode()).hexdigest(), "metadata": dict(original.metadata)}
    reports.append(report)
    print(module + ": two fresh kernels, equal final results", flush=True)
report = {"python": sys.version, "platform": platform.platform(), "dependencies": {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "nbclient", "nbformat", "ipykernel"]}, "notebooks": reports, "colab": "UNVERIFIED: local kernels only", "comparison": "Complete final structured result equality; incidental timing and image bytes are not compared."}
(OUTPUT / "report.json").write_text(json.dumps(report, indent=2) + "\n")
