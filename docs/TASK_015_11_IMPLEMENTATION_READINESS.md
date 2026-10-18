# Task 015.11 — MLP implementation and verification status

17 October 2026 · Implementation authorized and delivered; founder review requested. No Task 015.12 work is authorized or started.

## Approved scope delivered

- Five lessons NN01–NN05; 20 objective families; 40 practice instances; 60 independent instances across three forms.
- Five paired critical gates: NN01.O2, NN02.O2, NN03.O2, NN04.O2 and NN05.O2. Each has two independently scored components.
- The implementation policy is 16/20 or higher with every gate/component correct in one explicitly confirmed independent attempt. No evidence combines across attempts; later failures retain earned mastery. Practice, labs and notebook do not award mastery. Because final acceptance is incomplete, `MASTERY_AVAILABLE` is deliberately `false`; the assessment UI is unavailable and no route can award MLP mastery yet.
- Two frozen labs NN-E1/NN-E2 expose exactly 25/48 allow-listed configurations. Experiments require a prediction and a mechanism explanation before reveal. A server route returns one requested configuration after checking the immutable manifest hash; the browser receives no sealed test partition and cannot submit code.
- One reusable notebook template section, generated MLP notebook and bounded, versioned local persistence scope. No database migration, hosted execution, upload, credential or network dependency.

## Learning sequence and objective mapping

Each lesson owns its four consecutive families NN0x.O1–O4. Every family appears in authored teaching, two practice variants, all three independent forms, a deterministic answer key and correction/remediation feedback. O2 in each lesson is critical and paired (two atoms). The mapping is recorded in [objective and assessment coverage](task-015-11-objective-coverage.md).

## Frozen evidence and reproduction

The freeze remains NN-E1=25 and NN-E2=48 states, eight fitted development runs and 1,024 sequential `partial_fit` updates. SHA-256 locks and output bytes are unchanged. The reference generator's original preservation assertion compares against the 535-file pre-implementation tree and is therefore intentionally not rerun against this expanded source tree; the separate in-memory regeneration checker removes only that historical assertion and verifies the locked manifests/output bytes. It passes byte-identical regeneration and unchanged hashes. This does not modify the approved generator, manifests or locks.

All 1,030 finite-difference checks pass; maximum absolute gradient error is 1.6872304942072702e−10, and maximum probability parity error is 3.552713678800501e−15. Five exact ReLU kinks are explicitly marked nondifferentiable/not applicable. Frozen fit, scaling, loss, penalty, update and checkpoint-selection conventions remain as specified in [numerical conventions](verification/multilayer-perceptrons/NUMERICAL_GRADIENT_CHECKPOINT_CONVENTIONS.md) and [trusted parity evidence](verification/multilayer-perceptrons/TRUSTED_PARITY_REPORT.md).

The reproducible notebook ran in two fresh local kernels and emitted identical normalized output hash `4ad8aef0f33c832576709cbdc41af505468a35c6a8178bdf254ab3506e37da49`. See [notebook report](verification/multilayer-perceptrons/NOTEBOOK_REPRODUCIBILITY_REPORT.md). A convergence warning at the documented iteration cap is retained rather than hidden. Genuine Google Colab execution remains unverified.

## Verification status

Current recovery evidence is in [Task 015.11 Verification Recovery](TASK_015_11_VERIFICATION_RECOVERY.md). Focused MLP model contracts pass 8/8 under `forks`; frozen regeneration and two fresh local notebook kernels pass. The component suite/full frontend run, current-source typecheck/build and live keyboard/320px checks remain blocked; keep `MASTERY_AVAILABLE=false`.

- Python regression: 2,607 passed (one existing non-fatal KNN/joblib physical-core warning).
- Focused MLP model-contract tests: 8 passed before the final mastery-unavailable gate hardening, including counts, all-form 15/16 boundary, all paired gate-atom failures, attempt isolation, persistence and remediation/retry semantics. Post-hardening rerun stalled before test discovery.
- Full Vitest suite: **not verified**. Vitest reported no test discovery/output and hung at worker startup; the full run was stopped. Focused React component test likewise did not complete. This is an environment/tool-runner blocker, not a pass.
- Typecheck and production build had passed before the final one-line stricter saved-credit validation. Re-runs after that hardening did not complete because local tool processes stalled before output. Treat current-tree typecheck/build re-verification as open, despite successful earlier compile/build evidence.
- Live browser route, keyboard-only end-to-end operation and 320px viewport: **not verified**. The local Next server refused connections during this verification attempt. No screenshot or live interaction claim is made.
- Genuine screen-reader, genuine browser zoom and Google Colab execution remain **OPEN**.

## Preservation, limitations and next step

The new module uses `supervised:mlp:full:v1` and `ml-math-lab:supervised:mlp:full:v1`; it does not reinterpret or write other module scopes. No prior mastery threshold changed. Storage is local and editable; these bounded forms are formative rather than tamper-proof certification. Synthetic fictional data and finite reviewed forms cannot demonstrate broad real-world performance or rule out answer-pattern memorization.

**Founder review is requested.** Do not start Task 015.12 or deploy. Before closure, resolve the local test-runner/server limitation and complete current-tree build/typecheck, browser keyboard/320px checks. Keep genuine screen-reader, browser zoom, Colab and original-directory I/O as separate open obligations.
