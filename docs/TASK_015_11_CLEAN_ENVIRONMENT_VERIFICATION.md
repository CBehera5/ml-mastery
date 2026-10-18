# Task 015.11 — Clean-Environment Verification Package

**Status: prepared; independent execution unavailable in this workspace.** MLP mastery remains disabled. This package does not modify application behavior or dependencies.

## Why it was not executed here

The available workspace at the time of preparation is a source snapshot, not a Git checkout: `git rev-parse HEAD` fails because `.git` is absent. No connected remote CI runner or separate machine is available to this task. Running another copy on the same host would not be independent from the filesystem/process environment that stalled Vitest, TypeScript and Next. The existing `.github/workflows/ci.yml` is not sufficient evidence: it uses floating Node `20` and Python `3.13`, does not run the full Python + frozen MLP + two-kernel notebook + live browser acceptance set, and has not been triggered against this snapshot. No networked runner was invoked and no results are claimed.

## Identity of the available source snapshot

The source identity is incomplete because there is no commit SHA. Use the following values to reject accidental source or lockfile drift when transferring the snapshot:

| Artifact | SHA-256 |
| --- | --- |
| `package-lock.json` | `4affe28741945793052f52a50be7a86dc149f08144d69a474a2cc2af4f5fe809` |
| `package.json` | `fd9b67de1b1542804f8b079001e8a82ed644c82e171b29a533ba89715836c4ae` |
| `pyproject.toml` | `0a5773ac5022fb428512eddb5ebf5ee7e56f1f5a670fd8763c575299eb08d5a0` |
| `vitest.config.mts` | `30722e5dbca33813833366f2124d668573fc8adfe013d811a88f8e451bfe1a33` |
| MLP catalog | `e8803352e5903cecd1faf0149a0adc4d610658d1d8a8b0e2e4011289187b8a36` |
| MLP model | `596ef74ab6afc234f912fc513e8d80d6b0c5b27d52c6a3c3cfd0a874ccd3515f` |
| MLP model tests | `46295207880dc2720d1117fac52132cae3144cb1ecf276e7b307188999dc833b` |
| MLP React tests | `6e59f28253f79e0b1d6ea18e5c7af3a2cdd290d527e1c25843491e4357653e35` |
| NN-E1 manifest | `e73bed61d5bb91ed1348628e3047cb48d9658d280bbae035de6bbb237e62c93a` |
| NN-E2 manifest | `0ce207f12e4b829b821b4e6d3a0a569ab64f580945300b1af6f1a9b061e49b56` |
| Freeze lock | `d62f186cee89016c91a4ac203e8ccc10b9185a14aebd46816be4c574b45797b2` |

Before execution, compare the checked-in `docs/verification/multilayer-perceptrons/source-checksums.sha256` values and retain the approved commit SHA and clean/dirty status. A mismatch means stop and obtain the approved source snapshot; do not “fix” it by copying selected files into a different tree.

## Approved toolchain and runtime profile

- Node.js `20.19.4`; npm `10.8.2`.
- JavaScript dependency source of truth: checked-in `package-lock.json`; install using `npm ci`, never `npm install`.
- Python: CPython `3.13.16` on macOS 15.6.1 ARM64 for the accepted local reference profile.
- Verified numerical/notebook packages: NumPy `2.5.4`, pandas `3.0.6`, Matplotlib `3.11.2`, scikit-learn `1.9.1`, SciPy `1.18.1`.
- Verified notebook runtime packages: ipykernel `7.4.0`, ipython `9.17.1`, nbclient `0.11.0`, nbformat `5.11.1`, traitlets `5.16.1`.
- The Python project has no project-wide lock. `pyproject.toml` constrains NumPy and pytest by ranges, not exact versions. A Task 015.11 verification-only pinned manifest now exists at `docs/verification/multilayer-perceptrons/requirements-clean-verification.txt`; it records the approved numerical/notebook profile plus previously tested pytest tooling. It pins package versions, but not wheel hashes, and a fresh install has not yet verified it. The independent workflow captures `pip freeze` and runs `pip check`; do not describe this as a hash-locked supply chain.
- No required secret or external service is identified. Copy `.env.example`; set `NEXT_PUBLIC_BETA_FEEDBACK_FORM_URL=` empty for deterministic local checks. Set `CI=1`, `MPLCONFIGDIR` and `IPYTHONDIR` to writable runner-local temporary directories. Preserve logs and outputs outside the source tree.
- Resource profile: one Vitest worker (`vitest.config.mts` already sets `pool: forks`, `maxWorkers: 1`); use an otherwise idle runner with at least 4 CPU cores, 8 GiB RAM and 10 GiB free disk. Do not launch overlapping build/test jobs.

## Clean-run procedure

Use a fresh, isolated CI worker or separate machine, not another directory on the affected Mac. The prepared `.github/workflows/task-015-11-verification.yml` is manual-trigger-only and uses separate hosted macOS jobs for frontend, Python/numerical/notebook, and browser checks. Check out the founder-approved commit and record OS/image, architecture, commit SHA, clean/dirty status, Node/npm/Python versions, `npm ci` result, Python `pip freeze`, free disk and memory. First verify the checksums above.

From repository root, capture each command's exit code, duration, stdout/stderr, and discovered/executed test counts. Fail fast for diagnostics, but continue to the next independent diagnostic after saving a failure:

```sh
set -o pipefail
node --version && npm --version
python --version
npm ci
npm run test:ts
npm run test:web
npm run typecheck
npm run build
python -m pip install '.[test]'
python -m pytest
python work/check-mlp-freeze-outputs.py
python work/verify-mlp-notebook.py
```

Use the approved frozen Python reference environment for the MLP reference checker and notebook (CPython 3.13.16 and package versions above). The full `pip freeze` must be attached to evidence. **Run the notebook verifier only in a disposable clean checkout/copy:** `work/verify-mlp-notebook.py` writes executed outputs back to the notebook path in its checkout. First hash the notebook; run the verifier twice in its two fresh kernels; compare the normalized output hash; then restore the notebook in that disposable checkout from the approved revision and confirm its original hash. Never run this script against the protected verification source tree. The freeze checker must pass byte-identical regeneration and all locked hash, trusted parity and finite-difference assertions. Do not describe two runs in one reused kernel as fresh-kernel verification.

Both `test:ts` and `test:web` must complete with summaries and exit 0; these jointly cover the project's separate TypeScript-runtime and frontend test partitions. Any worker termination, timeout, missing discovery summary, interrupted process, or unreported test count is a failure—not a pass. `npm run build` includes the math package build and Next production build; record both output and exit status. Do not accept the existing CI's `build:web` alone as production build evidence.

## Live browser and mastery acceptance

Only after the clean run passes test, typecheck, build, frozen numerical and notebook gates, start a fresh production preview from that exact tree. The prepared browser job uses isolated Playwright `1.58.2` with its matching Chromium build; this verification-only package is not added to the application lockfile ([upstream release](https://github.com/microsoft/playwright/releases/tag/v1.58.2)). Record the browser version. Verify:

1. MLP lesson route and previous/next/browser back-forward navigation.
2. Both frozen interactive experiments, prediction-before-reveal, controls and numerical/text alternatives.
3. Practice, independent forms, 15/20 failure, 16/20 pass with all five paired gates, and failure of either component in each gate blocks mastery.
4. Reload/restoration, stale/invalid storage handling, and unaffected prior module evidence.
5. Keyboard-only operation including visible focus, no keyboard trap, dialogs and confirmation.
6. Responsive layout at exactly 320 CSS pixels and desktop; retain screenshots and browser console output.

For this verification milestone only, genuine screen-reader, genuine browser zoom and Google Colab remain platform-level open obligations unless separately tested on actual assistive technology, browser zoom controls, and Colab. Do not label an automated accessibility scan as screen-reader verification. Never activate mastery during this verification until all mandatory implementation checks above pass. Any authorized activation requires a separate review/authorization and rerunning mastery + regression checks; this package does not authorize activation.

## Evidence bundle and failure triage

Attach a single timestamped report containing source and lock checksums, environment and full Python freeze, command logs/exit codes/durations/counts, freeze and notebook hashes, browser screenshots at desktop/320px, and keyboard checklist. If a failure occurs, preserve the earliest complete error/log and stop repeated suite attempts. A clean-run failure must name its earliest reproducible stage and distinguish observed facts from hypotheses. No source changes, lockfile refreshes, cache deletion, mastery activation or dependency upgrade are authorized as part of the run.

## Exact founder action required

Provide or authorize a separate CI/machine session with access to the approved source snapshot (ideally restore its Git metadata and approved commit SHA), plus the runner’s result bundle. Until that is available, independent clean-environment verification is **not executed** and final acceptance remains blocked. Keep `MASTERY_AVAILABLE = false`; do not begin Task 015.12.
