import hashlib,json
from pathlib import Path
paths=[*Path('packages/math-runtime').rglob('*.ts'),*Path('python/mlmath').rglob('*.py'),*Path('apps/web/public/notebooks').glob('*.ipynb')]
Path('work/task011-baseline.json').write_text(json.dumps({str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in paths},indent=2))
