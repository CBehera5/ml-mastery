# Task 015.11 — Multilayer Perceptrons completion report

**Status: implementation delivered; final acceptance incomplete; founder review requested.** No later milestone is started.

## Delivered scope

- NN01–NN05: Beyond one neuron; Learn through gradients; Capacity and regularization; Reproducible and safe workflow; Interpretation and limitations.
- 20 objective families, 40 practice instances, 60 independent instances over three forms, five paired O2 critical gates. Exact lesson mapping is in [coverage matrix](task-015-11-objective-coverage.md).
- Two bounded reference-replay labs using the frozen 25-state NN-E1 and 48-state NN-E2 manifests. Learners predict, reveal and explain a changed configuration; there is no learner-code execution.
- One reproducible notebook at `apps/web/public/notebooks/supervised-mlp.ipynb`.
- Separate `supervised:mlp:full:v1` progress scope and `ml-math-lab:supervised:mlp:full:v1` local key. No database migration and no cross-module transfer.

## Learning/assessment implementation

Lessons cover shapes/weights/biases, linear versus nonlinear compositions, a two-layer forward pass, sigmoid/ReLU, the chain rule, training versus inference, plain SGD, regularization, capacity/generalization, fit-boundary safety, fold-local pipelines, validation checkpoint selection, comparison and interpretability limitations. Worked and changed examples connect calculations to churn prediction and relate prior linear algebra, derivatives, NumPy, Logistic Regression and Data Preparation.

Exercise families use finite authored choices, numeric answers and predefined repairs; arbitrary learner Python is not run. Practice has bounded retries, alternate examples and worked remediation. Independent forms rotate on a fresh retry, require whole-attempt review and explicit confirmation, and cannot combine evidence across attempts. Critical gates are NN01.O2–NN05.O2 with both components required. The scoring contract enforces 16/20 plus all gates. **Mastery is intentionally disabled (`MASTERY_AVAILABLE = false`) until remaining required acceptance checks are verified.** Scores/forms do not write module mastery while disabled; earlier module evidence is untouched.

## Mathematical and notebook evidence

- Frozen NN-E1/E2 configuration IDs and SHA-256 locks are unchanged. A clean regeneration checker reports byte-identical outputs for 25/48 states, eight fitted runs and 1,024 update steps. It removes only the freeze tool's obsolete historical “all source files still equal pre-implementation snapshot” assertion; no manifest, generator or freeze lock is edited.
- Trusted calculations: maximum probability parity error `3.552713678800501e-15`; 1,030 finite-difference checks; maximum gradient error `1.6872304942072702e-10`. ReLU kinks remain explicitly tagged nondifferentiable. See [frozen parity report](verification/multilayer-perceptrons/TRUSTED_PARITY_REPORT.md).
- Notebook ran in two fresh local kernels with identical normalized output SHA-256 `4ad8aef0f33c832576709cbdc41af505468a35c6a8178bdf254ab3506e37da49`. The local profile, split, settings, warnings and limits are recorded in the [notebook report](verification/multilayer-perceptrons/NOTEBOOK_REPRODUCIBILITY_REPORT.md). Colab is not verified.

## Verification recovery and final acceptance status

**Final acceptance remains incomplete; MLP mastery remains disabled.** Recovery is documented in [verification recovery report](TASK_015_11_VERIFICATION_RECOVERY.md).

- Frontend/TypeScript: **blocked**, not passed. Default pools still fail worker startup inconsistently; a selected one-test probe passes under `forks` and `threads`, but `vmThreads` did not complete within 75s. The MLP model contract suite passes **8/8** under `forks`. The MLP React test still fails worker startup before discovery at 60s. Full single-worker `forks` and `vmThreads` runs discovered and emitted substantial progress, then stalled; observed failure markers had no final summary or counts. Both runs were interrupted after bounded waits. This is not a full-suite pass. The underlying OS/tooling cause remains undetermined.
- Recovery environment: the clean `temporary verification workspace` copy matches `apps`, `packages`, `python`, `docs`, and root manifests/config by `rsync --checksum` comparison (excluding generated caches/transient dotfiles); relevant MLP source hashes match. Installed direct versions match lock ranges/entries. A simple Node worker and child fork both start normally. A clean-copy TypeScript/build attempt and later current-source attempts stalled without diagnostic output.
- Diagnostics/cleanup: stale Next preview PID 13211 was confirmed and stopped; no project listener remained. Other Node processes identified by `lsof` were Codex runtime processes and left untouched. Disk volume was 95% used with about 10 GiB available, inode use 3%, and memory pressure showed about 50% free. Five direct `stat` probes completed below 0.01s. `ps`, `top` and selected `sysctl` inspection were denied. Removed only unreferenced generated `apps/web/.next/cache` and `apps/web/.next/dev/cache` (312 MiB logical; `df` availability rose about 143 MiB); preserved `outputs`, `work`, dependencies, logs, notebooks and learner records.
- Python regression: **2,607 passed** in 24.85s, with one non-fatal existing KNN/joblib physical-core warning.
- Typecheck and production build: **blocked / unverified on current source**. Earlier successful runs preceded the final saved-credit and mastery-availability hardening and are not counted as current acceptance. The bounded clean-copy attempts also stalled without compiler/build output.
- MLP assessment, mastery boundaries, persistence and regression tests: focused model contracts **8/8 passed under `forks`** after updating the test to explicitly verify that final confirmation is blocked while mastery remains disabled. Includes threshold/gate scoring, versioned storage, corruption/quota handling and remediation/stale-tab tests. The React component and complete frontend suite remain unverified.
- Frozen MLP references: checker regenerated byte-identical 25/48 experiment states and 1,024 updates; all frozen hashes were unchanged. The regeneration reran trusted numerical checks including 1,030 finite-difference assertions. Two fresh local notebook kernels completed in the source-identical copy with matching normalized SHA-256 `4ad8aef0f33c832576709cbdc41af505468a35c6a8178bdf254ab3506e37da49`; the copy avoided rewriting the source notebook. Jupyter emitted process-enumeration shutdown warnings due environment restrictions, but verifier exit was 0. Google Colab remains unverified.
- Live route, keyboard-only final-source verification, and 320px viewport: **not verified**. Earlier keyboard navigation was against a stale preview build, so it is not accepted as final-source evidence. No screenshot or visual pass is claimed.
- Genuine screen-reader, genuine browser zoom, Google Colab, and original-directory I/O remain **OPEN**.

## Risks and open obligations

No arbitrary execution, upload, network data or database access is introduced. Client assessment/evidence is local and editable, finite-form results are formative rather than secure certification, and synthetic data does not establish real-world MLP quality. The implementation readiness package and curriculum quality register are updated. Outstanding: current-tree typecheck/build and complete frontend tests; live browser route/keyboard/320px; genuine screen reader; genuine browser zoom; genuine Colab; original-directory I/O reliability. See [implementation status](IMPLEMENTATION_STATUS.md).

**Decision:** keep `MASTERY_AVAILABLE = false`. Required gates remain blocked: full frontend suite, current-tree typecheck/build, MLP UI test, and live preview acceptance (keyboard, 320px, browser navigation and end-to-end progress restoration). Focused model-contract tests pass, but they do not substitute for those gates. Do not activate mastery, begin Task 015.12, deploy, migrate data or conduct external learner testing until all mandatory gates pass.

## Clean-environment follow-up

Independent verification has not been executed: this workspace has no `.git` metadata or commit SHA and no connected separate runner. The existing CI workflow is not sufficient for all required MLP acceptance gates. A clean-run procedure, verified toolchain profile, source/lock identity checks, commands, and exact founder handoff are recorded in [clean-environment verification package](TASK_015_11_CLEAN_ENVIRONMENT_VERIFICATION.md). Until an authorized independent runner executes that package and returns its evidence, acceptance remains blocked and mastery remains disabled.
