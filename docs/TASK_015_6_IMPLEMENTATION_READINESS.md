# Task 015.6 — Naive Bayes experiment reference freeze

17 October 2026 · Founder subsequently authorized application implementation. [Completion/verification](TASK_015_6_COMPLETION.md) records delivery;founder review pending. Frozen references below remain unchanged;historical application-pending statements preserve the prior checkpoint.

## 1. Frozen manifests and educational coverage

| Artifact | Complete reachable state set | Reference categories |
|---|---:|---|
| [NB-E1 — Multinomial/count evidence manifest](verification/naive-bayes/nb-e1.manifest.v1.json) |26|18 fitted positive-alpha states; four defined supplied Bayes cases; one undefined all-zero supplied-evidence case; three rejected diagnostics|
| [NB-E2 — Gaussian/representation manifest](verification/naive-bayes/nb-e2.manifest.v1.json) |30|24 base/repeated-feature fitted states; two supplied Gaussian-density cases; one smoothed zero-class-variance fit; three rejected diagnostics|

**56 total states:**43 fitted prediction states,seven supplied mathematical cases (one undefined),six rejection diagnostics. These are states,not43 distinct model parameter sets: queries reuse the same six Multinomial and eight ordinary Gaussian setting combinations,plus the special zero-class-variance setting. Both experiments remain below64 reviewed configurations. Exhaustive allowed ID lists prohibit unreviewed combinations or arbitrary learner parameters.

Stable schema `supervised.naive-bayes.experiment.v1`,version `1.0.0`,identities NB-E1/NB-E2 and every fixture/configuration ID are frozen. Exact data,labels,training/query IDs,vocabulary,settings,expected likelihood/log contributions,priors,normalization,posteriors/predictions or tagged rejection/undefined outcomes,correct prediction/reason,explanation,counterexample and accessibility alternatives are included. Largest training matrix6×3; no resource extension. Declared related objectives are context/teaching links,not a claim experiments award objective or module mastery.

Fictional target:0=Good,1=Needs Improvement. Labels are teaching placeholders,not collected production annotations or LLM ground truth. NB-E1 connects documentation word evidence to prior/likelihood/posterior reasoning and additive smoothing. NB-E2 connects continuous feature assumptions to density,variance and the danger of repeatedly counting correlated evidence. Existing Logistic is a mechanism/evaluation comparison,not newly fitted or implemented here. No additional NB variants,calibration estimator,text-ingestion system or capstone.

Both require prediction and bounded reason before reveal,then a changed configuration and supported transfer explanation. Prior edits,smoothing,query selection and repeated-feature choices are finite complete tuples. Numerical tables/text explain every graphic; native keyboard,focus,reduced-motion and320px behavior are future UI requirements,not offline test claims. Wrong first predictions can recover; no experiment credit awards mastery.

## 2. Probability and library conventions

[Probability/smoothing/variance specification](verification/naive-bayes/PROBABILITY_SMOOTHING_VARIANCE_CONVENTIONS.md) was documented before reference generation and is locked with the outputs.

- **Multinomial:** training-only sorted vocabulary[clear,error,example]; token-occurrence counts distinct from class document counts. Priors empirical[.5,.5] or explicit[.7,.3];alpha.5/1/2,force_alpha=True. Likelihood denominator is class token total+alpha×vocabulary size. Unknown tokens are explicitly ignored by the authored encoder,not magically handled by MultinomialNB; an unknown-only query becomes empty known evidence and retains the prior under positive alpha. Vocabulary/encoder construction and query count mapping are independently asserted.
- **Zero-frequency/library distinction:** alpha0 with class-exclusive token evidence gives all-zero class scores and mathematically undefined posterior. Additionally,sklearn1.9.1 dense multiplication can evaluate0×negative-infinity for an empty count vector and emit NaN,although the mathematical empty-product posterior equals the prior. This alpha0 state is a labeled rejected diagnostic,not a NaN-derived class prediction. Positive-alpha numerical states avoid it. Held-out vocabulary fitting is rejected by curriculum provenance policy; sklearn itself cannot enforce that permission.
- **Gaussian:** separate signed continuous base6×2 and duplicated-first-feature6×3 datasets. Per-class variance is population/ddof0. Inspected local GaussianNB full-fit source computes epsilon=`var_smoothing*max(training-global population feature variance)` and adds the same scalar to each class/feature variance. It is not sample variance,per-feature epsilon or a query-fitted statistic. Settings1e-9/.1;empirical or explicit priors. Incremental partial_fit is not exposed or generalized from these full-fit examples. Local implementation source hashes are in the parity report.
- **Zero variance:** class-constant rows0,0,2,2 with smoothing.001 have positive global variance,epsilon.001,valid tied posterior[.5,.5],class0. Smoothing0 is rejected. Globally constant rows1,1,1,1 have epsilon0 even with positive smoothing; the local library emits NaN and the educational state rejects. Gaussian density requires positive effective variance; a positive smoothing argument alone does not guarantee it.
- **Normalization and extremes:** scalar manual arithmetic and stable log-sum-exp agree with trusted references. Class ties choose0. Exact zero priors/log-negative-infinity and undefined all-zero evidence are tagged. Extreme Gaussian queries demonstrate float underflow despite finite log densities/posteriors; float0 is not silently called mathematical impossibility. Supplied Gaussian densities can exceed1; a density is not point probability. Stable label log loss is retained separately from any rounded probability/clipped endpoint interpretation. Default numerical parity abs1e-9+rel1e-9;display six significant digits does not change the oracle.

Concrete confidence counterexample: the first Gaussian query has fictional held-out label1 while the model favors0. With empirical priors and smoothing1e-9,base p1≈.005220126,duplicated-evidence p1≈.00005829127. The incorrect class becomes more confident;stable label log loss rises from≈5.255234 to≈9.750058. Brier error also worsens and is checked against sklearn. This is an individual probability-error example,not a population calibration study or proof every correlated feature harms performance. No labels from these evaluation rows enter fitting.

## 3. Trusted verification evidence

[Machine-readable parity report](verification/naive-bayes/parity-report.v1.json) contains all56 configuration IDs,kinds,passing status,edge results,dependency/platform metadata and inspected library-source hashes.

Executed in the existing accepted environment `python`: CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1;macOS15.6.1 ARM64. No dependency installation or application environment modification.

- All43 fitted prediction states match trusted MultinomialNB/GaussianNB priors,feature counts or means/effective variances,probabilities/log probabilities and predictions. Independent scalar arithmetic checks token smoothing,Gaussian population moments/global epsilon,per-feature density logs and stable normalization; scipy.stats.norm and scipy.special.logsumexp provide separate references. Probability errors match sklearn Brier calculations where exposed.
- Seven supplied arithmetic states are explicitly not fictitious trained models. Direct Bayes score normalization and Gaussian density evaluation are checked,including zero prior,all-zero undefined normalization,equal-score tie and density>1.
- Six rejection diagnostics are explicitly separated from numerical parity: negative count representation,held-out vocabulary,alpha0 degeneracy,continuous-as-count representation,zero effective variance and globally constant data. Actual library negative-count rejection,alpha0 NaNs and both zero-variance behaviors are probed; provenance/representation policy is not falsely attributed to sklearn.
- `work/freeze-task-015-6.py --check` recalculates references and compares every frozen output byte plus generator/convention hashes. Successful independent process regeneration recorded; no cross-platform bitwise guarantee. Deliberate diagnostic warnings are captured by category rather than hidden as successful predictions.
- [Source preservation](verification/naive-bayes/source-preservation.v1.json) checks464 application/public/package/Python files against accepted Task015.5 hashes:unchanged. No learner storage was read,regraded,migrated or overwritten.

[Freeze lock](verification/naive-bayes/freeze-lock.v1.json) pins generator,conventions and output/report SHA256. Regeneration commands are in the convention specification. Frozen manifest SHA256:

```
NB-E1 f9109d5f60a08594c7a770dcaa2760e4b23f8f5b1079725abe0a784f66c21fbf
NB-E2 c3d3c79b936829a895f0164fce4735dd0b4a6ce46fbc0d7bb823efd6210176eb
```

## 4. Scope, readiness and open obligations

[Approved bounded specification](TASK_015_6_BOUNDED_SPECIFICATION.md) remains NB01–04,16 essential objectives,32 practice,48 independent,four paired O2 gates,two experiments,one notebook;mastery13/16 plus every paired gate in one confirmed independent attempt. **NB02.O1 smoothing arithmetic stays noncritical;NB02.O2 stays critical.** No lesson,80-instance exercise bank,UI,evaluator adapter,persistence,notebook or mastery activation was implemented by this checkpoint.

No unresolved reference conflict remains within these explicit controls. Intentional mathematical/library differences are documented and represented,not silently altered. Ready for **separate founder application implementation authorization**. Future implementation must preserve these fixtures/conventions and verify all80 scored instances,all56 states,12/16 and13/16 boundaries,24 valid-wrong paired critical-component failures,retries/remediation,persistence/isolation,full frontend/Python regressions,typecheck/build,live keyboard/320px and two fresh notebook kernels.

Genuine screen-reader,genuine browser zoom,genuine Google Colab and original-directory I/O reliability remain OPEN. No application regression/build,notebook or manual accessibility result is claimed newly passed by this offline reference work. Finite-bank,local editable progress,tiny fictional examples and later comprehensive depth/learner review remain limitations. No deployment,external learner testing,production collection,migrations,learner-code execution or subsequent algorithm work. Stop for founder review.
