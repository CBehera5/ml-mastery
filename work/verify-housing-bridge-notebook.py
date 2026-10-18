"""Run the downloadable reference notebook unchanged, in cell order.
Usage: python3 -I work/verify-housing-bridge-notebook.py
Only the Python standard library is used; no Jupyter UI execution is claimed.
"""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
notebook=root/'apps/web/public/notebooks/linear-regression-housing-bridge.ipynb'
namespace={'__name__':'__main__'}
count=0
for index,cell in enumerate(json.loads(notebook.read_text())['cells']):
 if cell['cell_type']=='code':
  exec(compile(''.join(cell['source']),f'{notebook}:cell-{index}','exec'),namespace)
  count+=1
assert count==8
print(f'PASS: {count} notebook code cells executed sequentially; all assertions passed.')
