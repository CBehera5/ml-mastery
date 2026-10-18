# Task 013.2 — Python Essentials completion

16 October 2026. **Implemented and automated verified; scoped browser verification, not full accessibility/Colab or learner-validity acceptance.** Founder explicitly approved P01–P08 and the opt-in copy-only transition. No Task013.3 work.

## 1. Exact scope and learning experience

| Lesson | Four objective families O1–O4 | Mandatory critical gate |
|---|---|---|
| P01 Values, names, operators and units | Feature types; weighted prediction/types/precedence/units/text repetition; reassignment versus comparison; grouping/conversion/failure. | P01.O2 |
| P02 Collections, order, indexing and mutation | Collection purpose; feature order/shared references/copies; index/slice boundaries; keyed lookup/set membership. | P02.O2 |
| P03 Conditions and explicit missing-value rules | Boolean comparisons; zero versus None; first matching boundary branch; accidentally changed population. | P03.O2 |
| P04 Loops and reliable aggregations | Bounded range; accumulator/count/denominator; pairing/zip truncation; empty-batch guards. | P04.O2 |
| P05 Function contracts | Parameters/arguments/local state; usable return versus print; ordered composition/conversion; fresh defaults/caller-owned mutation. | P05.O2 |
| P06 Readable transformations | Comprehension map/filter/order; record-level feature/target alignment; duplicate keys; readable loop versus reduction. | P06.O2 |
| P07 Debugging, exceptions and imports | Failing operation/error class; narrow invalid handling without zero fabrication; curated import binding; syntax versus plausible logic and repairs. | P07.O2 |
| P08 Small reproducible programs and local data | Schema/conversion/missingness; resource/relative-path flow; validated program composition; independent instance attributes/methods. | P08.O1 |

32 families (31 essential; introductory/noncritical P08.O4),64 practice instances and96 independent instances. One module assessment with three complete32-family forms, eight paired critical gates, eight finite experiments, one full Essentials notebook. Original P01 template remains separate, not a second module notebook.

Every lesson includes motivation, terminology, mathematical recall, worked and changed state examples, practical ML consequences, misconception contrasts, success criteria and targeted remediation. Worked examples precede practice. Textual code/outcome/mechanism alternatives require no visualization interpretation. P06/P07/P08 retain explicit record/error/schema distinctions rather than advanced syntax/OOP.

Routes: /python/essentials overview; /python/essentials/p01/module for module P01; /python/essentials/p02 through p08; /python/essentials/mastery. Original /python/essentials/p01 retains original teaching/progress and labels its historical prototype-only assessment message.

## 2. Assessment, mastery and retries

Production catalog completeness plus explicit verification release gates assessment availability. Require **26/32 and every critical family correct in one confirmed independent attempt**; both atoms of each critical gate required. No cross-attempt union or compensation. A failed attempt awards no mastery; a passing attempt awards module and only independently correct objectives. Later failures, lesson resets and history trimming do not erase same-version mastery.

Independent workflow active→review→separate confirmation→results, no per-answer correctness before submission. Review shows human-readable selections, not internal option IDs. Reloading review returns to active and requires reconfirmation. Unlimited A/B/C retries with fresh IDs, idempotent submitted IDs, latest20 compact summaries plus latest full submission. Known unanswered parts count wrong; malformed/partial unsupported slots reject without consuming an attempt.

Practice allows two valid submissions per A/B variant per labeled review cycle. Exhaustion gives worked correction and requires reviewed contrast plus correct changed-case recall before reopening. Completion requires all four practice families plus changed experiment, correct prediction and explanation. Page visits, reveal, self-attestation and notebook use do not suffice or award mastery.

## 3. Evaluator safety and correctness

Reused unchanged Python-local finite choice, finite numeric and predefined repair-slot contracts. Whole accepted tuple equivalence, unordered slot-entry identity and inclusive abs1e-9 + rel1e-9 numeric tolerance; Boolean is not numeric input. Unknown fields/IDs, duplicate slots, oversized/deep/corrupt objects and unsafe text representations reject as unsupported rather than being interpreted.

Frozen essentials.v1 reference has168 P02–P08 cases:28 worked,56 practice,84 independent. Exact original P01 fixtures supply its8 practice/12 independent items. Trusted author-only CPython oracle verifies real outputs and runtime/syntax failures for enumerated configurations; it never accepts learner source or exposes an execution endpoint. Browser only selects precomputed fixtures. No unrestricted imports, arbitrary expression interpreter, filesystem/network/shell/upload or hosted learner execution.

Tests cover all160 definitions/accepted tuples, actual new independent case parity, experiment reachability, all forms at25/26/27/32, and failure of each critical atom on every form (48 separate failing-gate cases). Synthetic tests run isolated in-memory fixtures and cannot write learner localStorage.

## 4. Evidence transition and preservation

Separate v2 Essentials content/policy/environment scope, never relabel original v1. [Exact P01 map](task-013-2-p01-evidence-map.md) documents all four exact mappings, source/target fields and unmapped data. Preview+opt-in+confirmation, source-byte fingerprint, pristine target P01 requirement, stable completion IDs and one atomic target write; original bytes are read-only. Failure/stale/corrupt/unsupported input leaves earlier records preserved. No independent mastery transfer or automatic award.

Strict canonical256-KiB envelope, bounded component allocations, restoration before saving, corruption/future-version preservation, denied/quota fallback and stale-tab detection tested. Scope changes require new compatibility mapping, not silent reinterpretation. LocalStorage is local-only and optimistic, not a distributed transaction or tamper-proof service.

Preservation audit: **282/285 pre-existing protected files byte-identical**. Only changed protected sources: Python hub discovery, original P01 route's explanatory navigation wrapper, and two export keywords for reused AnswerInput/REMEDIATION. Original P01 contracts/fixtures/progress/scorer/notebook, all Math/Regression lessons/runtime/evidence and dependency manifests are unchanged. Historical013.1 evidence not overwritten.

## 5. Automated verification

| Check | Result / evidence |
|---|---|
| Full frontend/TypeScript suite | **368 passed,59 files**; includes15 new Essentials tests and all previous353. outputs/task-013-2/verification/frontend.log. |
| Full Python regression suite | **183 passed**:175 existing +8 new trusted reference tests. PYTHONPATH=python with isolated approved-profile QA interpreter. python.log. |
| Typechecking | PASS, both mathematical runtime and web. typecheck.log. |
| Production build | PASS, mathematical runtime plus Next16.4 optimized static production routes. build.log. |
| Mastery/equivalence/safety | All three complete forms, numeric/repair equivalence, malformed input,48 critical-atom failures, threshold boundaries, incomplete drafts and no attempt mosaics. |
| Persistence/transition | Confirmation/idempotence, bounded history, mastery preservation, restoration, corruption/quota/denied/stale/version isolation, opt-in copy and unchanged source bytes. Pure contracts plus React integration. |
| Regression | Existing Math/Regression/P01 suites pass; no failing regression or dependency change. |

An initial Python command omitted PYTHONPATH and failed collection; corrected supported invocation passes183. A trusted distractor collision was found and corrected before release; thresholds/gates were not weakened. A production preview was initially started during rebuild; restarted only after successful build. These were verification/setup issues, not waived failures.

## 6. Scoped accessibility/browser findings

Production preview at isolated QA origin127.0.0.1:3025; original founder origin3024 evidence untouched. Keyboard Enter navigation, Space radio/consent, native selects, numeric entry, experiment reveal focus, review/results focus, independent retry and copy consent verified. Real form A31/32 with P01.O2 reasoning wrong fails; fresh form B32/32 passes; reload restores history/mastery. P02 practice and meaningful activity restore. Original P01 completed via its existing UI; copy preview correctly lists four passed objectives, counters/drafts/completion and SHA-256, then confirmed copy restores without duplicating source.

320px viewport checks: all eight module lessons and assessment active/review/results have document width=scroll width=320; no page horizontal overflow. Code blocks retain their own horizontal scroll. Long select labels remain fully available through native options and textual explanations. This is scoped reflow/keyboard evidence, not complete WCAG acceptance.

**OPEN / NOT VERIFIED:** genuine screen-reader speech/navigation, genuine browser200%/400% zoom, broader device/AT coverage and genuine Google Colab execution. AX/DOM snapshots and320px viewport do not close these gates. No external learner testing or comprehensive Task017 audit.

## 7. Notebook reproducibility

New download apps/web/public/notebooks/python-essentials.ipynb includes all32 asserted objective outcomes, embedded original fictional records, seed42 and exact approved local profile. CPython3.13.16 on macOS15.6.1 ARM64; NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1 used only as the approved notebook preflight profile, not new curriculum modules.

Two clean fresh-kernel runs in separate empty working directories matched exactly; each cell timeout60seconds, no credentials/uploads/remote datasets or installation cells. Local report/artifacts: outputs/task-013-2/notebook/report.json, run-1 and run-2 executed.ipynb/results.json. Notebook SHA256 b408b29a3bfe0f86e15ec88aab437229e1fd08b06fccf1535a2c74140da46ba3; normalized result SHA256 0c6de0ef9e8eac349357c22fa5dbafc20183733d050b1358b5d6da171d1a8727.

The local runner emitted an ancillary macOS psutil/sysctl permission warning but exited successfully with both notebook assertion runs/error-free outputs. No full OS sandbox/memory-isolation claim. Local success is explicitly **not** genuine Colab verification; it remains an acceptance obligation.

## 8. Deviations, limitations and remaining risks

No unapproved architectural scope expansion: additive module-local implementation, existing deterministic grader/evidence helpers and separate opt-in copy. Finite whole-outcome choices implement bounded tracing/repair recognition where unrestricted source equivalence cannot be verified. They do not certify open-ended code writing. Three finite forms/client-visible answers and recurring explanation labels retain memorization/difficulty-equivalence risks for the later pedagogical audit.

All four P01 objective mappings are exact reused semantics; feedback text deliberately unmapped, no gap invented. Cross-tab comparison detects stale state but is not an atomic multi-writer CAS. Old full submissions beyond retained history are not promised. Actual AT/zoom/Colab, broader manual regression, curriculum transfer validity and full-V1 external learner testing remain open.

## 9. Next-task readiness and stop

Task013 totals now8/36 lessons,32/144 objective families,8/41 gates,1/6 module assessments and1/6 full notebooks. Essentials implementation is ready for founder review, not blanket launch acceptance. Recommend verifying Task013.3's approved NumPy scope/dependencies before separate authorization; reuse contracts/persistence patterns without importing Essentials mastery automatically.

No NumPy lesson/module implementation, database migration, deployment, external learner testing, commercial change or capstone work. **Stop after013.2; await founder approval.**
