# Task015.9 — reference freeze and implementation readiness

**Latest17 October2026:** founder subsequently approved implementation. [Completed implementation/acceptance evidence](TASK_015_9_COMPLETION.md) supersedes the application-not-authorized status below;frozen manifests,conventions,hashes and scope remain unchanged. Await founder implementation review;no later algorithm work.

17 October2026 · Specification/reference work complete; application implementation NOT authorized.

## Approved allocation retained

[Bounded specification](TASK_015_9_BOUNDED_SPECIFICATION.md): GB01–06,six lessons,24 essential objectives,48 practice,72 independent instances,six paired O2 critical gates,two experiments,one notebook. Mastery20/24 AND both components of all gates in one confirmed attempt. No mastery/evaluator/persistence-policy change. Founder approved explicit external validation-stage selection; prior review-pending wording in the bounded specification is historical on that decision only.

## Frozen deliverables

1. [GB-E1 manifest](verification/gradient-boosting/gb-e1.manifest.v1.json): regression,27 configurations =24 valid prediction states +3 rejection diagnostics.
2. [GB-E2 manifest](verification/gradient-boosting/gb-e2.manifest.v1.json): binary classification,27 configurations =24 valid prediction states +3 rejection diagnostics.
3. [Stagewise loss/selection conventions](verification/gradient-boosting/STAGEWISE_LOSS_SELECTION_CONVENTIONS.md): exact partitions,tree/leaf/gradient arithmetic,initialization,thresholds,numerical tolerances,stage ties,bagging comparison and rejected configurations.
4. [Trusted parity report](verification/gradient-boosting/parity-report.v1.json) and [freeze lock](verification/gradient-boosting/freeze-lock.v1.json).
5. [Source preservation](verification/gradient-boosting/source-preservation.v1.json): accepted source hash comparison,not a claim of exhaustive filesystem or durable learner-storage verification.

Both manifests stay below64 states. Valid controls are fictional clean/noisy dataset × eta .1/.5/1 × maximum-stage budget1/2/4/8. Each rate has one eight-stage fitted trace; lower budgets replay only its prefix. Full stage traces are immutable assets,not additional learner controls or learner-envelope payloads. Textual/numerical alternatives and predict-before-reveal cycles are specified in both manifests; no UI/accessibility pass is claimed by this reference work.

## Verification evidence

Approved local CPython3.13.16/scikit-learn1.9.1 profile verified by generator assertions; see conventions for all dependency versions.12 boosting fits produce96 verified weak-learner stages,plus12 fixed forest comparison fits. All48 valid configurations and six rejected diagnostics are enumerated. Independent float32 tree traversal,candidate split SSE optimality,leaf means or binary Newton leaf updates,training/development additive scores,and numerical losses agree with trusted sklearn. Every staged classifier probability is separately checked against staged_predict_proba. Forest regression predictions/probability vectors average correctly.

Fresh-process regeneration with --check is byte-identical for both manifests,parity report,source-preservation report and lock. Hashes also bind generator and convention document. Stable-score extreme cases at±1000,initial sigmoid equality and earliest-stage validation tie are checked; no extra endpoint controls are exposed. Exact mathematical endpoint/infinity versus library-clipping distinctions are documented,not disguised as numeric zero. No test predictions or metrics are computed.

Concrete discovered counterexamples,not invented learning claims:

| Fixture/rate | Validation choice among8 stages | Selected loss | Stage8 loss |
|---|---:|---:|---:|
| Noisy regression eta .5 |4|0.800318|1.228202|
| Noisy regression eta1 |2|3.250000|4.063981|
| Noisy classification eta .5 |4|0.248271|0.283391|
| Noisy classification eta1 |2|0.202509|0.214181|

Noisy classification eta .5 has validation accuracy1.0 at every stage while log-loss worsens after stage4: perfect labels do not imply equally good probabilities. Clean examples contrast these overfit tails. The class prior here is .5,so F0=0; this does not teach that every classifier initializes at0. Noisy regression initializes at training mean7.333333333333333 rather than clean6.5.

## Exact selection and library distinctions

All stages fit training rows only; validation compares stages1 through the permitted budget using MSE or mean binary log-loss. Choose earliest stage whose loss is within absolute1e-12 of that prefix minimum. Stage0 is explanatory,not a candidate. n_iter_no_change=None; no implicit library early stopping or test-based selection. Rate remains a comparison control,not an automatically jointly tuned winner. Test partitions are sealed offline metadata; subsequent final evaluation would require a locked development choice.

Squared-error residuals are negative gradients of half-squared loss; reported MSE has twice that normalization. Binary negative gradient is y−p,while actual fitted leaf contribution is a Newton-adjusted raw-score correction. Do not replace either with raw-label residual regression. Classifier threshold>=.5 is explicit educational convention; sklearn predict uses a strict raw-score>0 positive decision at equality,so label parity at equality is intentionally not claimed. Split-gain ties use pinned sklearn/seed/exported thresholds,not an invented deterministic earliest-threshold policy. No cross-version topology claim.

## Regeneration

From the repository root,using the existing verified environment without installing packages:

```
python work/freeze-task-015-9.py --check
```

Authoring without --check rewrites the four reference assets and lock; do not use it to silently alter frozen semantics. Any semantic change requires review,versioning and renewed parity/hash verification.

## Readiness, remaining acceptance and stop

No unresolved material curriculum or numerical conflict remains for these bounded experiments. Ready for founder implementation authorization,not yet authorized to implement. Exact objective/gate mappings remain in the bounded specification. Future implementation must verify all120 scored instances,36 critical-component failure scenarios,boundaries19/24 and20/24,retries,malformed/equivalent answers,persistence/version isolation,full regressions,typecheck/build,live keyboard/320px,two fresh notebook kernels and unchanged prior modules. None of those future GB application/notebook checks is claimed as passed here.

OPEN:genuine screen-reader,genuine browser zoom,genuine Colab,original-directory I/O reliability. Successful bounded reads and reference execution do not close the original reliability obligation. Finite-bank memorization,editable origin-local evidence,tiny synthetic data and later comprehensive audit remain risks. No application implementation,new lessons,notebook implementation,learner-evidence access,mastery change,deployment,external learner testing or later algorithm work.
