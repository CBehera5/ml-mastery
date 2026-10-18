from pathlib import Path
import json,copy
from jsonschema import Draft202012Validator
root=Path.cwd();f=json.loads((root/'packages/math-contracts/fixtures/algebra.v1.json').read_text());count=0
for file,values in [('algebra-trace.v1.schema.json',[r['trace'] for r in f['functions']]),('algebra-support.v1.schema.json',f['equations']+f['mappings']+f['compounding'])]:
 schema=json.loads((root/'packages/math-contracts/schemas'/file).read_text());Draft202012Validator.check_schema(schema);v=Draft202012Validator(schema)
 for value in values:v.validate(value);count+=1
 bad=copy.deepcopy(values[0]);bad['schemaVersion']='2.0.0';assert not v.is_valid(bad)
print(f'PASS: both new schemas valid; {count} frozen traces validate; unsupported versions rejected.')
