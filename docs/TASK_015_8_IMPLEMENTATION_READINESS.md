# Task 015.8 — Random Forest experiment reference-freeze readiness

**Latest disposition:** separate founder authorization implemented the bounded application;see [completion/evidence](TASK_015_8_COMPLETION.md). This document preserves the earlier reference-freeze evidence and its historical stop boundary.

17 October 2026 · Reference authoring/verification complete. Application implementation is not authorized by this checkpoint.

## 1. Deliverables and unchanged scope

| Artifact | Verified inventory |
|---|---|
| [Manifest A — RF-E1](verification/random-forests/rf-e1.manifest.v1.json) |41 configurations:36 fitted regression forests,two supplied arithmetic examples,three rejection diagnostics |
| [Manifest B — RF-E2](verification/random-forests/rf-e2.manifest.v1.json) |33 configurations:26 fitted classification forests,four supplied arithmetic examples,three rejection diagnostics |
| [Aggregation/bootstrap/OOB conventions](verification/random-forests/AGGREGATION_BOOTSTRAP_OOB_CONVENTIONS.md) |Numerical,class-order,sampling,split,importance,OOB and library-difference rules |
| [Trusted parity report](verification/random-forests/parity-report.v1.json) |74-state ledger,62 fitted forest states,222 exported individual trees and mathematical/semantic counterexamples |
| [SHA-256 lock](verification/random-forests/freeze-lock.v1.json) |Both manifests,parity report,generator and conventions |
| [Application preservation evidence](verification/random-forests/source-preservation.v1.json) |490 accepted source files unchanged; no learner-evidence operations |

Both experiments remain below the64-state limit. RF-E1 enumerates three fictional fixture variants × three ensemble sizes × two depths × two feature counts=36 fitted states,plus five supplied/diagnostic states. RF-E2 enumerates two ordinary fixture variants × the same12 tuples=24 fitted states,two single-class edge fits,and seven supplied/diagnostic states. No unreviewed Cartesian expansion is permitted at implementation.

Approved scope is unchanged: RF01–RF05,five lessons,20 essential objectives,40 practice,60 independent instances,five paired O2 gates,two experiments,one notebook; mastery16/20 plus both atoms of every gate in one confirmed attempt. No new critical gate,threshold,persistence migration or evidence transfer. The100 scored instances and module notebook are not implemented or verified in this reference-only checkpoint.

## 2. What the experiments teach

**RF-E1 / RF01,RF02,RF04:** fictional house-price prediction in100000 currency units. Compare one bootstrapped tree with3/7-tree ensembles,depth1/2 and one/two feature candidates per split. Inspect exact bootstrap IDs,multiplicities,drawn feature candidates,retained splits,paths,individual prices,mean,training/development error and row-specific OOB coverage. The one-tree configuration is a one-tree bootstrap forest,not falsely described as an unbootstrapped full-sample DecisionTree baseline. Prior DT lessons remain the prerequisite baseline context.

For the changed-target depth2/one-feature example,changing one training price changes the four development predictions by mean absolute1.2 for one tree,about.433333 for three trees and.452381 for seven trees. This demonstrates reduced sensitivity in this example,not monotonic improvement with size or a measured population variance guarantee. Supplied[2,4,6] and[4,4,4] both average4;their different spreads do not establish calibrated intervals. An equal-variance/equal-correlation formula is explicitly a restricted mathematical example,not universal performance evidence.

**RF-E2 / RF03,RF05:** fictional churn labels0=stays,1=churns. Inspect aligned per-tree class fractions,probability means,sorted-class argmax and a separately labeled >=.5 action. Supplied p1=[.4,.4,.9] gives class1 from mean17/30,unlike hard-label majority0. At mean p1=.5,argmax selects0 while the >=.5 action selects1. Exact0/1 and supplied/fitted missing-class cases are explicit,not clipped or padded without explanation.

Each fitted classification state includes same-row confusion/cost evidence and held-out permutation traces. The correlated-feature fixture provides eight informative-but-zero-permutation counterexamples:the affected feature alone achieves accuracy1 on these four development rows while its forest permutation mean score decrease can be0. This demonstrates a limitation of interpreting importance as irrelevance or causality,not a production score or universal correlated-feature law. Tiny balanced development data and fictional FP1/FN5 costs are disclosed.

All states require a finite prediction/reason before reveal and a meaningful changed-state explanation for future activity credit. Visual plans have numerical/textual alternatives for every membership/path/output/OOB result. No graph-only or decorative experiment. Implementation must label replay versus supplied arithmetic,render one tree/trace at a time and clear stale outcomes on control changes.

## 3. Trusted verification evidence

Verified using the existing approved CPython3.13.16 environment with NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1. Platform is recorded in the parity report. No dependency installation or application-environment modification.

- All62 fitted forest states match trusted sklearn and repeated deterministic fits;222 individual trees are exported. Independent weighted DecisionTree refits and verification helper fits are additional checks,not additional exposed configurations or inflated learner counts.
- Actual estimators_samples_ match independently regenerated replacement draws. Tree seeds and the exact bounded-domain per-split feature draw order follow inspected pinned RNG/splitter source; source hashes are in the parity evidence. Selected features/thresholds achieve independent exact-rational weighted gains. Every feature column is distinct across active rows,avoiding unsupported general constant/missing-feature reconstruction.
- Independently recomputed weighted memberships,means/SSE/class fractions/Gini,unique versus weighted row counts,paths and leaf outputs match the trees. Per-tree predictions aggregate to sklearn mean/probability results. Impurity importance is independently reconstructed from retained split gains.
- Same-bootstrap comparisons hold rows fixed while changing max_features. Seven-tree one-feature root selections include both feature0 and1;the base classification development predictions change from[0,1,1,1] to[0,0,1,1] when both features are considered. This is a concrete diversity/mechanism comparison,not proof that one setting is universally better.
- OOB contributor sets exclude every tree containing the row,including duplicated draws. All172 uncovered-row occurrences across fitted states are tagged unavailable. Raw library zero placeholders,warnings and default all-row score are frozen separately;covered-only mathematical metrics never invent predictions for uncovered rows.
- All classification permutation repeats match sklearn.permutation_importance;actual cumulative shuffled row mappings,score direction and repeat summaries are recorded. No final-test labels influence sampling,fitting or these development comparisons.
- All supplied examples use independent rational arithmetic and NumPy agreement. Six rejection states comprise two library-verified invalid bootstrap/OOB parameter cases and four authored information-boundary invariants. A semantic diagnostic is not claimed as library provenance enforcement.
- Independent-process --check regenerates byte-identical JSON and locks. No raw NaN serialization. Numerical parity uses declared1e-9 absolute/relative tolerance;identities,classes,memberships and topology are exact.

### Regeneration

From repository root:

```sh
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python work/freeze-task-015-8.py --check
```

Default mode is the trusted authoring/regeneration procedure;it writes expected artifacts and must not be used to silently bless changed outputs during implementation. Use --check against the approved lock. If the temporary environment is unavailable,recreate the recorded profile in an isolated environment and reverify;do not install into the application environment or change pinned versions silently.

## 4. Intentional mathematical/library distinctions

1. Classifier predict uses mean probabilities then argmax,not hard-label majority. A separate threshold action is not library predict at equality.
2. Outer forest labels and internal tree class codes are different for one-class fits;probability columns are aligned to actual forest classes. Supplied missing-class examples explicitly zero-align absent classes.
3. sklearn1.9.1 can use uncovered OOB zero placeholders in its default score. The educational prediction is unavailable for those rows and excludes them from covered-only metrics,with excluded IDs and denominator visible. OOB coverage is not external validation and cannot repair group/time/global-fitting leakage.
4. Seeded feature draws and ties are pinned-version implementation behavior,not a unique mathematical optimum or a cross-version guarantee. The source-reconstructed splitter trace is valid only for these distinct-value,no-missing,min-leaf1 fixtures.
5. Tree spread,training impurity importance and development permutation importance are not calibrated uncertainty,causal effects or independent final-test evidence. Adding correlated trees can leave shared bias/errors.

No unresolved conflict with approved mastery/evaluator/persistence or numerical policies was found. These distinctions implement the already approved bounded specification rather than introduce an unapproved scoring change.

## 5. Resource, preservation and remaining work

Finite states use8 training rows,two features,four development queries,at most7 trees and depth2 (theoretical maximum49 retained nodes;actual maxima45 in RF-E1 and33 in RF-E2). Bootstrap7×8 and OOB8×7 tables remain bounded;model traces are immutable read-only reference assets,not larger learner answer arrays or persisted envelopes. Pretty-printed manifests are1,302,850 and1,147,499 bytes;implementation should display/select traces without persisting raw model assets or silently expanding answer contracts. No dense mesh or learner model deserialization.

All490 accepted application/public/package/Python source files match their Task015.7 baseline hashes. This does not claim exhaustive filesystem equality or inspect/change browser learner storage. New files are only trusted reference tooling and specification/evidence artifacts. Successful bounded reads/reference runs do not resolve general original-directory I/O reliability.

No new frontend/build,mastery/persistence,notebook or manual-accessibility pass is claimed here. Before application completion,verify all100 scored instances,15/20 and16/20 boundaries,30 valid-wrong critical-component failures,retries/remediation/restoration/corruption/quota/version isolation,full regressions,typecheck/build,keyboard/320px interactions and two fresh notebook kernels. Mastery remains unavailable until complete implementation verification. The reference-freeze is not curriculum implementation completeness.

OPEN:genuine screen-reader,genuine browser zoom,genuine Google Colab,original-directory I/O reliability,finite-bank/local-evidence limitations,tiny fictional cohorts and deferred comprehensive pedagogy/learner review. No application implementation,learner-evidence/mastery changes,deployment,external learner testing,database migration or later algorithm work.

**Recommendation:** reference-freeze complete;ready for separate Task015.8 application implementation authorization. Stop for founder review.
