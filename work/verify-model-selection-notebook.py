from __future__ import annotations

import hashlib
import json
import os
import tempfile
from pathlib import Path

import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[1]
NOTEBOOK = ROOT / "apps/web/public/notebooks/supervised-model-selection.ipynb"


def output_digest(notebook) -> tuple[str, int]:
    outputs: list[str] = []
    for cell in notebook.cells:
        if cell.cell_type != "code":
            continue
        for output in cell.outputs:
            if output.output_type == "error":
                raise RuntimeError(f"Notebook cell failed: {output.ename}: {output.evalue}")
            if output.output_type == "stream":
                outputs.append(output.text)
            elif output.output_type in {"execute_result", "display_data"}:
                outputs.append(output.data.get("text/plain", ""))
    return hashlib.sha256("\n".join(outputs).encode()).hexdigest(), len(outputs)


def execute_fresh(run: int) -> tuple[str, int]:
    notebook = nbformat.read(NOTEBOOK, as_version=4)
    notebook = nbformat.validator.normalize(notebook)[1]
    with tempfile.TemporaryDirectory(prefix=f"model-selection-kernel-{run}-") as directory:
        NotebookClient(
            notebook,
            timeout=180,
            kernel_name="python3",
            resources={"metadata": {"path": directory}},
        ).execute()
    return output_digest(notebook)


def main() -> None:
    os.environ.setdefault("IPYTHONDIR", str(Path(tempfile.gettempdir()) / "ml-mastery-ipython"))
    os.environ.setdefault("MPLCONFIGDIR", str(Path(tempfile.gettempdir()) / "ml-mastery-mpl"))
    first, first_count = execute_fresh(1)
    second, second_count = execute_fresh(2)
    if first != second or first_count != second_count:
        raise SystemExit("Fresh notebook runs did not produce matching structured output.")
    print(json.dumps({"status": "PASS", "freshKernels": 2, "outputCount": first_count, "outputSha256": first}, sort_keys=True))


if __name__ == "__main__":
    main()
