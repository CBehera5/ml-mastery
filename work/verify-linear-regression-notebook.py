"""Execute unchanged notebook code cells sequentially in a fresh Python process.
Run with work/task-011-verification-venv/bin/python work/verify-linear-regression-notebook.py.
This verifies Python execution, not the Google Colab or Jupyter UI.
"""
import json
from pathlib import Path
import numpy, sklearn
notebook=Path(__file__).resolve().parents[1]/'apps/web/public/notebooks/linear-regression-from-scratch.ipynb'
namespace={'__name__':'__main__'}
count=0
for index,cell in enumerate(json.loads(notebook.read_text())['cells']):
 if cell['cell_type']=='code':
  exec(compile(''.join(cell['source']),f'{notebook}:cell-{index}','exec'),namespace)
  count+=1
print(f'PASS: {count} code cells; NumPy {numpy.__version__}; scikit-learn {sklearn.__version__}')
