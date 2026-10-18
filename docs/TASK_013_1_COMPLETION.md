# Task 013.1 — Foundation/P01 Completion Report

16 October 2026. **Implemented for founder review; not full Task 013 or accessibility/Colab acceptance. Task 013.2 has not begun.** Founder-approved detailed policies and tested local profile were used without lowering thresholds.

## 1. Delivered scope and learning experience

- Routes: /python overview and /python/essentials/p01. Shared BetaNav adds Python discovery with a minimal wrapping rule; no existing lesson/scorer/runtime is replaced.
- P01 builds from real feature meaning and type-tagged records to a house-price rule, units, stepwise reassignment and two equivalent conversion/grouping repairs. Each section includes motivation, terminology, numerical/changed examples, a misconception, ML interpretation and targeted recall/remediation.
- One interactive experiment has **six immutable configurations**: numeric areas 2/4, decimal area, text repetition, numeric-text conversion and invalid conversion. Learners change a configuration, predict before reveal and choose a bounded explanation. Traces state output, type, units and steps in text; no visualization-only information.
- The browser is explicitly labeled a deterministic simulation, not an interpreter. A working Python operation such as text repetition can still be the wrong modeling reasoning.

## 2. Objective/exercise inventory

| Canonical objective | Demonstration | Live practice | Independent test-only |
|---|---|---:|---:|
| python.essentials.p01.o1 | Distinguish numeric/text/Boolean values in feature records | 2 | 3 |
| python.essentials.p01.o2 **critical** | Weighted prediction with type, precedence, units and rejection of text repetition; both scoring atoms required | 2 | 3 |
| python.essentials.p01.o3 | Trace reassignment and Boolean comparison without treating == as assignment | 2 | 3 |
| python.essentials.p01.o4 | Select equivalent grouping/conversion repairs and recognize conversion failure, not fabricated zero | 2 | 3 |
| **Total** | Four objective families; short P01.O1–O4 aliases are display/policy references | **8** | **12** |

Independent P01 instances have no learner route or award path. They are not a four-question replacement for Essentials. Critical options rotate deterministically; data changes across variants rather than relying on option shuffle alone. Finite-bank memorization and client inspection remain limitations.

Trusted oracle: python/mlmath/python_p01_reference.py; frozen fixture: packages/python-contracts/fixtures/p01.v1.json. TS/Python tests cover all twenty family instances and all six experiment states. Separate actual pinned-library probes cover N03 broadcasting (including incompatible shapes), D05 duplicate/null-key join cardinality and T02 training-only imputation. **These probes are not additional lessons/modules.**

## 3. Evaluator safety

Python-local contracts accept finite choice IDs, finite numbers and explicitly predefined repair-slot IDs, plus an explicit unanswered sentinel. No source-code editor, Python parser/interpreter, unrestricted import, dynamic evaluation, callable/property dispatch, filesystem/network/shell execution, learner upload or hosted execution endpoint exists.

Strict definition/response validation rejects unknown/duplicate/missing identities, extra fields, prototype keys, wrong kinds, Boolean/numeric-string coercion, nonfinite/over-limit values and excessive bytes/depth. Bounds include 512-byte atoms, 1.5-KiB families, 64-KiB submissions, two atoms/family, eight accepted whole tuples and eight nesting levels. P01 exposes six authored configurations, not arbitrary numeric/expression input.

Both explicitly reviewed O4 repairs are accepted as complete tuples. A hybrid tuple from different accepted solutions is not assembled into a pass. Numeric comparison uses inclusive absolute 1e−9 plus relative 1e−9. Unsupported representations are reported separately from valid incorrect reasoning and do not consume attempts. Legal partial slot drafts can be saved, but must be completed before grading.

Trusted author Python/notebook checks execute repository-owned reference code only, never learner responses. These checks are not a security sandbox or unrestricted-code equivalence engine.

## 4. Completion, mastery, retry and persistence

P01 completes only after **all four correct practice families AND a changed experiment configuration AND correct bounded prediction/explanation**. Practice evidence cannot award objective/module mastery.

Essentials mastery is unavailable: only 4/32 families and 1/8 critical gates are implemented. The future real gate remains **26/32 plus all eight critical families together in one attempt**. The other approved thresholds remain 20/24 or16/20 with their complete critical lists.

Pure synthetic contract tests cover all six thresholds and all **41 critical gates on three forms**, failing either critical atom at otherwise passing scores (246 individual critical-atom/form failure cases). They also cover exact/below/above threshold, unanswered criticals, malformed coverage, no cross-attempt compensation, explicit review/confirmation, submitted idempotence and A/B/C rotation. They never write learner mastery. Draft codecs restore review as active/reconfirmation and submitted results idempotently, checking stored results against recomputation. Compact-history helper retains 20 summaries. **Real module assessment/history integration is future work, not exposed in this prototype.**

Practice permits two valid submissions per A/B variant. Exhaustion requires objective-specific worked remediation and a correct changed-case explanation before a labeled review cycle reopens. Counters, partial drafts and remediation selections survive reload. Review cycles remain available after counter saturation; saturation is labeled, never a permanent learning lock.

Storage is isolated at ml-math-lab:python:essentials:v1. A ≤256-KiB canonical, strictly versioned envelope wraps unchanged LearningEvidenceV1. It hydrates before writing, uses stable completion IDs and allows no prototype mastery/independent-attempt records. Invalid/future/wrong-scope/noncanonical/duplicate-member records remain untouched with saving disabled. Read denial/quota failure gives a visible not-saved/in-memory warning. No automatic repair, migration, rescoring or cross-device claim.

Experiment reset clears controls, not earned evidence. Confirmed lesson reset clears P01 practice/activities only; this prototype has no independent history to clear. A **separate explicit module-reset confirmation** can replace only this Python scope, including quarantined unsupported bytes; otherwise they are preserved. A failed reset write retains earlier stored bytes and reports memory-only reset. Other Python/Math/Regression keys are never cleared.

## 5. Verification results

| Command / check | Result |
|---|---|
| npm test | **353 passed, 56 files**; includes 20 new P01/foundation/parity/React tests and existing subject regressions. |
| npm run test:ts | **66 mathematical-runtime tests passed, 12 files**; no old runtime source changed. |
| PYTHONPATH=python python -m pytest -q | **175 passed**, including five new P01 reference/conversion tests. |
| npm run typecheck | PASS, both runtime and frontend projects. |
| npm run build | PASS; **63 static pages**, including the two new Python routes. No deployment. |
| Exact-profile scientific probes | PASS: broadcasting/incompatibility, join multiplicity/null keys, train-only fitted median and transformed held-out values. |
| P01 notebook runner | PASS: two fresh local kernels; expected outputs equal. |
| Browser P01 completion/reload | PASS: four practice families plus changed/correct experiment restores completed lesson; module mastery remains unavailable. |
| Keyboard | Scoped real browser checks passed for anchor/Tab/Shift-Tab flow, select/type-ahead, radio arrows/Space, numeric entry, submission, feedback focus and alternate repair practice. Automated tests cover remediation/consent resets. |
| 320px | Final Python, Math overview and Regression-errors pages: viewport320/document width320. P01 controls stay inside viewport; long code intentionally scrolls. |

Existing project .venv could not collect the complete suite because jsonschema was absent. **It was not changed**: QA used a separate CPython3.13.16 venv with the approved 54-package lock plus pytest8.4.2. No package.json/package-lock.json/pyproject.toml changes. The approved notebook reference environment itself was not repinned.

Notebook startup initially required permission for local kernel sockets; rerun succeeded. Restricted process enumeration emitted ipykernel/psutil cleanup warnings; the runner still returned success with both executed notebooks/results. No OS process/network sandbox, memory-limit enforcement or kernel-cleanup certification is claimed.

Artifacts: [regression log](../outputs/task-013-1/frontend-regression.log), [runtime tests](../outputs/task-013-1/math-runtime.log), [Python tests](../outputs/task-013-1/python-regression.log), [typecheck](../outputs/task-013-1/typecheck.log), [build](../outputs/task-013-1/build.log), [scientific probes](../outputs/task-013-1/scientific-probes.json), [preservation inventory](../outputs/task-013-1/preservation.json), [QA packages](../outputs/task-013-1/qa-packages.json).

## 6. Accessibility findings and remaining obligations

All experiment outcomes have actual text/type/unit/step alternatives. Native labeled controls, fieldsets/legends, headings, skip/section navigation, visible keyboard focus, status feedback and disabled-until-hydrated controls are present.

Browser QA found and fixed inherited light-page/dim-label colors in the scoped dark P01 lesson. It also found the added shared navigation link caused 320px overflow on legacy pages; a minimal shared nav wrapping rule corrected the Math/Regression smoke cases without changing their learning behavior.

**Genuine screen-reader speech/navigation and genuine 200%/400% browser zoom remain NOT VERIFIED.** AX snapshots and320px resizing are not substitutes. Full contrast/state/device, text-spacing and comprehensive accessibility acceptance are not claimed. Owners and closure procedures remain in RELEASE_ACCESSIBILITY_QA_BLOCKERS.md.

![P01 experiment at320px](../outputs/task-013-1/browser/p01-320-experiment.png)

## 7. Notebook reproducibility

[Downloadable notebook](../apps/web/public/notebooks/python-p01-template.ipynb): reusable template plus P01 feasibility section, not any completed full-module notebook. It needs no credentials, uploads, paid compute or external dataset; it submits no platform evidence.

Actual local environment: macOS15.6.1 ARM64, CPython3.13.16, NumPy2.5.4, pandas3.0.6, Matplotlib3.11.2, sklearn1.9.1; nbclient0.11.0/nbformat5.11.1/ipykernel7.4.0. Each fresh kernel asserts the exact profile; seed42 and process thread/hash settings are explicit.

Expected/observed: types int/float/str/bool; weighted predictions250/450($k); text222; final area3 and comparisonFalse; equivalent repairs300.0/300.0 versus incorrect precedence102.0; invalid conversionValueError. [Execution report](../outputs/task-013-1/notebook/report.json), [run1 results](../outputs/task-013-1/notebook/run-1/results.json), [run2 results](../outputs/task-013-1/notebook/run-2/results.json).

Notebook SHA-256: e35040eccb0b67c997a5cd2db3d31769554782572c42dbfe88d14ac9c3a39047. Normalized result SHA-256: cfabde63f84ce699933f46574a89264b90e3b56e746eb322e93b2cb2e36010a6.

**Genuine Colab remains UNVERIFIED.** The prior actual attempt reached a Google sign-in barrier; this milestone did not execute a Colab runtime. Local success is not Colab verification; full six-notebook/profile acceptance remains future work.

## 8. Preservation, deviations and risks

Against the267-file pre-implementation baseline, **266 existing files are byte-identical**; only BetaNav changes for discovery/wrapping. New files are confined to Python/P01 contracts/UI/tests/notebook/reference fixtures and a tiny navigation CSS module. Existing Math/Regression lesson logic, runtime source, notebooks, evidence helpers, dependency manifests and scoring policies are unchanged; no files deleted.

No architectural deviation requires a new product decision. Compact stored answer arrays meet the approved depth bound; module-reset recovery requires separate explicit consent. The foundation deliberately does not ship incomplete independent assessment UI or a fake mastery award.

Residual risks: finite/client-visible banks and editable localStorage are not proctoring/tamper-proof credentials; bounded choices do not certify unrestricted coding fluency; genuine AT/zoom/Colab and full-V1 learner/depth evaluation remain open. Current synthetic scoring/draft/history contracts still need real module integration tests when full Essentials is authored.

## 9. Next-task readiness and stop

**Ready for founder review of Task013.2, not authorized to start.** The approved next milestone completes P02–P08, promotes/reviews P01, authors all32 Essentials families/eight gates and three independent forms, adds the full module notebook and integrates real assessment/history persistence. Preserve prototype progress through an explicitly reviewed version mapping or separate scope; never silently relabel/rescore it.

No P02–P08/other Python module, capstone, database migration, commercial change, deployment or external learner testing was undertaken. The wider36-lesson/144-family/41-gate/six-assessment/six-production-notebook plan is unchanged. Stop for founder approval.
