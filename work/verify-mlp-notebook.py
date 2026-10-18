import hashlib
import json
import sys
from pathlib import Path

import nbformat
from nbclient import NotebookClient

root = Path(__file__).resolve().parents[1]
path = root / "apps/web/public/notebooks/supervised-mlp.ipynb"
original = nbformat.read(path, as_version=4)
canonical_runs = []
for run in range(2):
    notebook = nbformat.from_dict(original)
    executed = NotebookClient(notebook, timeout=600, kernel_name="python3", allow_errors=False).execute(cwd=str(root))
    outputs = []
    for cell in executed.cells:
        if cell.cell_type != "code":
            continue
        for output in cell.get("outputs", []):
            if output.output_type == "stream":
                outputs.append(output.text)
            elif output.output_type == "execute_result":
                outputs.append(output.data.get("text/plain", ""))
            elif output.output_type == "display_data":
                outputs.append(output.data.get("text/plain", ""))
            elif output.output_type == "error":
                raise RuntimeError("Notebook cell failed: " + output.ename + ": " + output.evalue)
    canonical_runs.append("\n".join(outputs))
    if run == 0:
        nbformat.write(executed, path)
if canonical_runs[0] != canonical_runs[1]:
    raise SystemExit("Fresh-kernel notebook outputs differed.")
digest = hashlib.sha256(canonical_runs[0].encode()).hexdigest()
print(json.dumps({"python": sys.version.split()[0], "runs": 2, "matching_outputs": True, "canonical_output_sha256": digest, "output": canonical_runs[0]}, indent=2))
