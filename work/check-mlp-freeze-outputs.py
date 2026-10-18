"""Run the portable MLP freeze verification without reading local outputs."""

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GENERATOR = ROOT / "work/freeze-task-015-11.py"

subprocess.run([sys.executable, str(GENERATOR), "--check"], cwd=ROOT, check=True)
