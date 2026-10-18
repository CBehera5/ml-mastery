# Task015.10 — SVM experiment freeze and implementation readiness

## Task015.10 implementation — current status

17 October2026. [Completion report](TASK_015_10_COMPLETION.md):SV01–SV05 implemented;20 objectives,40 practice,60 independent instances,five paired O2 gates,16/20 in one confirmed attempt,two frozen labs(15/43 states) and one locally reproducible notebook. Full regressions,typecheck/build and live keyboard/320px checks verified in isolated QA. Mastery uses only the separate SVM scope;prior thresholds/evidence remain unchanged. Genuine screen-reader/browser zoom/Colab and original-directory I/O reliability remain OPEN. No later algorithm work authorized. Older freeze-only statements below are historical,superseded by this implementation entry.

17 October2026 · Reference-freeze milestone only. Application implementation requires separate founder authorization.

## Approved scope preserved

[Bounded specification](TASK_015_10_BOUNDED_SPECIFICATION.md):SV01 Margin geometry,SV02 Soft margins and C,SV03 RBF locality,SV04 Safe scaled workflow,SV05 Limits and comparison. Five lessons,20 essential objective families,40 practice,60 independent instances,five paired O2 gates,two experiments and one notebook. Mastery16/20 AND both components of every gate in one confirmed attempt. No objective,remediation,evaluator,persistence or mastery-policy change.

## Frozen deliverables

1. [SV-E1 manifest](verification/support-vector-machines/sv-e1.manifest.v1.json):15 configurations—six linear fits,six manual boundary scenes,three rejection diagnostics. True geometric distances/canonical slab widths,score/hinge/support evidence,C/outlier contrasts and manual-not-fitted distinctions are explicit.
2. [SV-E2 manifest](verification/support-vector-machines/sv-e2.manifest.v1.json):43 configurations—36 finite RBF grid fits,two training-derived class-weight contrasts,two same-data linear baselines and three rejection diagnostics. Exact scaling,kernels,supports,query decisions and evaluation boundaries are frozen.
3. [Solver,margin and kernel conventions](verification/support-vector-machines/SOLVER_MARGIN_KERNEL_CONVENTIONS.md):solver/KKT/score tolerances,class ordering,exact-zero versus near-boundary behavior,scaler/weight training provenance,probability deprecation and sparse boundary-sample semantics.
4. [Trusted parity evidence](verification/support-vector-machines/TRUSTED_PARITY_REPORT.md),[machine report](verification/support-vector-machines/parity-report.v1.json) and [hash lock](verification/support-vector-machines/freeze-lock.v1.json).
5. [Source preservation](verification/support-vector-machines/source-preservation.v1.json):517 accepted source files unchanged;no learner-storage access.

All58 configurations are enumerated within existing per-lab bounds.46 actual SVC models pass independent geometry/kernel/score/support/KKT/metric checks. Six manual scenes never invent fitted support IDs. Six rejected scenes never invent predictions or losses. Predict-before-reveal,changed configuration,post-observation explanation,units/fit IDs and numerical/text alternatives are defined. No new interactive application is implied by those manifests.

## Selection and numerical commitments

Linear C∈{.1,1,10}. RBF C∈{.1,1,10},gamma∈{.1,1,4},identity or training-only StandardScaler;extra weight/baseline combinations are explicitly listed,not an open product. Binary classes0/1,positive1. probability=False;decision scores are not calibrated probabilities. tol1e−6,max_iter200000,shrinkingFalse and fixed library/settings/row order determine the verified local fits. Expected deprecation warnings are recorded;all final fit_status values are0.

Validation balanced accuracy selects only among the frozen per-fixture candidates;ties within1e−12 choose the first frozen candidate. Neither validation nor test fits a scaler,weights or SVC. Test remains sealed and unevaluated;future app replay must omit sealed test metadata. CV fold-only behavior still needs its approved lesson,assessment and notebook evidence;these experiments do not claim to have run CV.

Manual geometry uses F=w·x+b and distance F/norm(w),not score-as-probability. Canonical F=±1 slab width differs from empirical nearest-observation distance and is not claimed to be an optimized margin for a manually moved line. Fitted support IDs come from verified dual coefficients,not guessed geometric closeness. RBF boundaries are shown through25 reviewed query samples with exact scores/classes,not an unapproved dense mesh or fabricated exact contour.

Byte-identical regeneration and frozen hash verification pass in the tested dependency environment. No unresolved numerical or curriculum conflict remains for these bounded manifests. Initial overly strict draft solver stopping was resolved before freeze without changing the independent parity/KKT criteria;see parity report. Any future semantic change requires review,versioning and renewed hashes—not silent replacement.

## Implementation acceptance still required

Before later implementation completeness:all20 objectives must map to teaching/practice/assessment/remediation;all100 scored instances need independent trusted verification;all58 frozen states must replay exactly. Verify15/20 failure,16/20 success and30 valid-wrong critical-component scenarios across three forms;no cross-attempt combination or loss of earlier mastery. Test malformed/equivalent inputs,retry/remediation/confirmation,persistence/restoration/corruption/quota/stale-tab/version isolation,full frontend/TypeScript/Python regressions,typecheck/build,real keyboard/320px and two fresh local notebook kernels. Preserve Math,Regression,Python and all prior supervised evidence. No new module mastery activation before complete verification.

OPEN:genuine screen-reader,genuine browser zoom,genuine Google Colab,and original-directory I/O reliability. Also retain finite-bank memorization,editable local evidence,tiny synthetic datasets,near-boundary/solver sensitivity and later comprehensive curriculum audit risks. Successful bounded reference reads/fits do not close the original I/O obligation.

Ready for founder review and separate Task015.10 implementation authorization. No application implementation,new lesson/notebook construction,learner-evidence changes,mastery-policy change,deployment,external learner testing,migration or subsequent algorithm work. Stop here.
