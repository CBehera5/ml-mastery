# Task 013 — Dependency-Lock Verification

**Founder decision recorded:** the local dependency profile is approved for the environment and versions actually tested. This does not approve Linux execution or genuine Colab compatibility; their execution gates remain open. Task 013.1 uses this unchanged reference profile, with a separate QA venv adding pytest 8.4.2 for the existing regression suite; no application dependency files are changed.

16 October 2026. Candidate environment evidence, not application dependency changes or universal compatibility certification. **The existing application environment and 267 protected files are unchanged.**

## Proposed manifest and actual environment

| Component | Proposed exact version | Verification |
|---|---|---|
| CPython | 3.13.16, conventional GIL build | Installed with isolated uv 0.13.1 managed Python; version asserted inside each executed kernel. Host/bootstrap Python 3.13.0 was not used for notebook results. |
| NumPy | 2.5.4 | Imported and numerical/shape/reduction probes passed. Requires Python ≥3.12. |
| pandas | 3.0.6 | Label/group/join probes passed. Requires Python ≥3.11; NumPy≥1.26 on Python<3.14, satisfied here. |
| Matplotlib | 3.11.2 | Agg histogram rendering and numerical density checks passed. Requires Python ≥3.11; NumPy≥1.25, satisfied. |
| scikit-learn | 1.9.1 | Imputer/encoder/scaler/baseline/linear pipeline/KFold reference probes passed. Requires Python ≥3.11; NumPy≥1.24.1, SciPy≥1.10, joblib≥1.4, narwhals≥2.0.1, threadpoolctl≥3.5, all resolved. |
| Verification notebook tools | nbclient 0.11.0; nbformat 5.11.1; ipykernel 7.4.0 | Used for actual fresh-kernel execution. They are tooling, not a new app execution service. |
| Environment package manager | pip 26.2.1 | Explicitly pinned, including seeded venv pip. |
| Separate verification tools | uv 0.13.1; pip-audit 2.10.1 | Bootstrap venv only; not notebook runtime/application dependencies. Toolchain pins are recorded, but bootstrap tooling is not a fully hash-locked production supply chain. |

Release existence/requirements checked against official versioned PyPI pages: [NumPy](https://pypi.org/project/numpy/2.5.4/), [pandas](https://pypi.org/project/pandas/3.0.6/), [Matplotlib](https://pypi.org/project/matplotlib/3.11.2/), [scikit-learn](https://pypi.org/project/scikit-learn/1.9.1/). Full dependency metadata and distribution hashes were captured directly from the [PyPI JSON API](https://docs.pypi.org/api/json/). The [CPython source archive URL](https://www.python.org/ftp/python/3.13.16/Python-3.13.16.tar.xz) returned HTTP 200; this run used uv's managed binary distribution, **not** a source build or independently signature-verified CPython build.

Actual execution: macOS 15.6.1, ARM64, CPython 3.13.16, Clang 23.1.3. An isolated temporary environment was used; no system/application package install. Detailed interpreter and NumPy build provenance remains in the originating task's excluded local verification outputs and is not included in this portable snapshot. No PYTHONPATH injection or access to application dependencies was required.

## Lock artifacts and compatibility

- [Direct manifest](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/requirements.in): four curriculum libraries plus three notebook tools and pip.
- [macOS ARM64 / CPython 3.13 hash lock](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/requirements-macos-arm64-py313.lock): **54 exact packages**, resolved against official PyPI; wheel-only, hash-required installation actually completed.
- [Linux x86-64 / CPython 3.13 hash lock](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/requirements-linux-x86_64-py313.lock): **53 exact packages**, cross-platform resolver succeeded with binary-only constraints. Same shared versions; macOS-only appnope accounts for the difference. **Not installed or executed on Linux; not proof of Colab support.**
- Resolution includes SciPy 1.18.1, joblib 1.6.0, narwhals 2.27.1 and threadpoolctl 3.7.0. Full transitive pins, not just top-level versions, are in the locks. Do not use the platform locks interchangeably.
- [Installed-package inventory](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/installed-packages.json), [resolution log](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/resolution.log), [installation log](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/installation.log), [Linux resolution log](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/linux-resolution.log).
- [pip check](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/pip-check.log): **No broken requirements found.** Notebook imports and numerical execution passed, which is stronger than metadata compatibility but covers only the authored probes, not the full library test suites.

These locks are proposed reference profiles. No broad Python range, Windows, Intel macOS, Linux execution or Colab runtime is approved as tested. A fresh host whose Python patch/ABI/architecture differs must fail version preflight or receive a separately resolved, executed and reviewed profile; never silently change the manifest to fit.

## Security findings and limits

[pip-audit JSON](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/security-audit.json) and [summary](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/security-summary.json), captured 16 October 2026: **54 packages audited; zero published known vulnerabilities returned; zero skipped packages**, using the default PyPI advisory service. The auditor ran outside the target venv. The first invocation could not write its default user cache; it was rerun successfully with a temporary explicit cache. No application changes or “fix” mode were used.

This is **not** a security guarantee. Package advisories do not fully cover CPython, OS, SSL/BLAS/native bundled libraries, compromised maintainers, unpublished vulnerabilities or all transitive binary code. Hash-required installs check integrity against registry-derived hashes, not independent publisher trust. uv's bootstrap and managed interpreter provenance are recorded but not independently attested. No package signatures/SBOM/native CVE scanner/full dependency source review was performed.

Use only official indexes; disallow extra indexes and source builds in the reference procedure; do not install notebook extras/test suites casually. Recheck advisories before implementation/release and periodically thereafter. Any needed repin requires a new lock, clean execution, expected-output comparison and review of affected fixture/evaluator/content versions; never retroactively reinterpret stored mastery.

## Reproduction procedure

1. On macOS ARM64, obtain the exact Python/toolchain in a new temporary directory. Record download provenance and interpreter hash; do not use the application's virtualenv. Create a fresh venv with CPython 3.13.16.
2. Install the macOS lock with `uv pip install --python <fresh-venv>/bin/python --require-hashes --only-binary :all: --index-url https://pypi.org/simple -r requirements-macos-arm64-py313.lock`. uv cache must be a writable isolated directory; enable system CA certificates where required. A missing wheel/hash failure stops the run, not a source-build fallback.
3. Verify exact interpreter and all direct versions, run `python -m pip check`, save `python -m pip list --format=json`, and audit the installed site-packages from a separate pinned auditor environment.
4. Prepend that venv's bin directory to PATH so the python3 Jupyter kernelspec uses the exact interpreter. Run the [trusted verification driver](../../../2026-10-15/continu-from-where-you-had-left-3/outputs/task-013-finalization/verify_notebook.py) with that interpreter. It generates/executes only its own fixed notebook twice and asserts versions inside the kernels.
5. Compare deterministic numerical JSON and embedded-data hash, not PDF/PNG pixel bytes or timestamp-bearing notebook JSON. Record platform/BLAS/thread settings and any warnings. [Notebook evidence](task-013-notebook-colab-evidence.md) defines the actual tested scope.
6. Repeat on each proposed supported host. A cross-platform resolution alone never adds it to the executed support list.

## Founder decision

Recommend adopting this **verified macOS candidate reference lock**, with Linux/Colab execution still open and a reviewed repinning process. Approval is D1 in the [policy matrix](task-013-founder-policy-decision-matrix.md); it does not authorize application installation or 013.1. A decision on a separately tested Colab profile may be necessary once its actual interpreter is known.
