# ML Math Lab — Mathematical Engine

Task 001 provides a verified Python reference engine and browser-compatible TypeScript runtime for an inspectable linear neuron.

## Setup and verification

```sh
python3 -m venv .venv
.venv/bin/python -m pip install '.[test]'
.venv/bin/python python/scripts/generate_fixtures.py
.venv/bin/python -m pytest
npm install
npm run typecheck
npm run test:ts
```

The fixture generator is deterministic. It rewrites every shared fixture, including `regression.v1.json`, from the Python reference runtime. CI regenerates fixtures and fails if the committed output differs. Run it with `PYTHONPATH=python .venv/bin/python python/scripts/generate_fixtures.py` when a versioned mathematical contract changes.

## Run the Neural Network X-Ray

```sh
npm install
npm run dev
```

Open `http://localhost:3000/demo`. The interface runs calculations locally through the verified TypeScript runtime; no Python server is required.

Frontend verification:

```sh
npm run typecheck
npm run test:web
npm run build:web
```
