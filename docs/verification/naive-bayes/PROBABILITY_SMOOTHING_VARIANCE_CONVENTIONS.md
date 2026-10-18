# NB probability, smoothing and variance conventions v1.0.0

17 October2026 · Conventions authored before reference generation under founder fixture-freeze authorization. No objective/mastery changes. MultinomialNB and GaussianNB are separate likelihood models, not interchangeable feature encodings. Dataset and label values are wholly fictional teaching placeholders; no production collection or causal labels.

## Shared probability and evaluation rules

Classes ordered[0,1]:0=Good,1=Needs Improvement (positive). Class-score ties choose smallest label0 via argmax; verify library parity, not a threshold policy. Posterior uses prior×likelihood normalized across classes. Supplied priors are explicit normalized probability vectors; empirical priors use class **document/row counts**, not token totals. No sample weights or class weights. No threshold tuning or calibration training.

For two log scores, subtract their maximum before exponentiation and normalize with log-sum-exp. Independent scalar normalization is checked against scipy.special.logsumexp and fitted model outputs. Exact-zero prior/evidence gives tagged negative infinity in log space. All-class zero scores give tagged undefined posterior and no prediction, **not uniform probabilities or class0**. A small positive real density/probability may underflow to float0; retain its finite log value and list underflowed positive components. Display underflowed entries as rounded numerical0 with the positive-real/finite-log caveat, not mathematical impossibility. No NaN or bare Infinity in frozen JSON or learner numeric answers.

Use float64 throughout. Compare numerical references with abs1e-9+rel1e-9; exact counts,IDs,class labels,tags and tie membership remain exact. Display six significant digits with approximate marker, retaining full stored precision; rounding is not a grading oracle. No tolerance-created score ties. The dedicated symmetric count/Gaussian cases have exact equal class scores under these fixtures.

Single held-out label probability errors are descriptive examples: binary Brier=(p1−y)^2 and stable label log loss=−log_posterior[y]. Compute these from finite log posteriors where a float probability underflows, not from a rounded zero. They are not a population calibration estimate. If future content uses endpoint log loss or confusion metrics, preserve approved EV tagged undefined/infinity versus separately labeled clipped-library conventions; this freeze does not introduce clipped loss as mathematical truth.

## Multinomial model

Training documents are pretokenized authored lists, encoded as token-occurrence counts in lexicographically sorted training-only vocabulary[clear,error,example]. The exact document lists and encoded6×3 matrix are frozen. Count features are nonnegative integer occurrences here, not document frequencies. No arbitrary text input, tokenizer, upload or vocabulary learning from held-out tokens. Row labels and feature columns remain aligned.

At prediction, tokens outside that training vocabulary are ignored with their count explicitly reported; an unknown-only query has zero known counts. This is an authored educational preprocessing policy, not a behavior automatically supplied by MultinomialNB. With positive smoothing the empty count vector leaves the prior unchanged. Unknown word omission is not proof the word is irrelevant; no unknown-token bucket is invented.

For class c and token j, theta_cj=(N_cj+alpha)/(sum_j N_cj+alpha*V),V=3. Repeated query count x_j contributes x_j*log(theta_cj). No multinomial coefficient is required for posterior comparison because it is class-independent for the same query. The model's simplifying assumption is token evidence conditional on class, not unconditional independence of fixed-total count coordinates. Empirical prior is3/6 per class; the explicit alternative is[.7,.3]. Frozen positive alphas .5,1,2; force_alpha=True,fit_prior=True,class_prior=None for empirical or the explicit vector. No vector-valued alpha,hidden floor or count rescaling.

An alpha0 diagnostic uses class-exclusive vocabulary counts and a query containing both tokens: mathematical class scores both zero,posterior undefined. In sklearn1.9.1 with force_alpha=True,theta retains exact zero entries and log likelihoods include negative infinity. Its dense dot can additionally evaluate0×−infinity: **even an empty query yields NaN** in this diagnostic, whereas the mathematical empty-product posterior should equal the prior. The UI must reject this unsupported unsmoothed state and disclose this numerical difference rather than repeat a NaN-derived argmax. Positive-alpha fitted states avoid this issue. Negative-count fitting is separately confirmed rejected by sklearn; vocabulary provenance rejection is an educational permission rule that sklearn itself cannot enforce.

Supplied Bayes score cases (.30,.10 normalization etc.) are clearly labeled **not fitted MultinomialNB**. Their likelihoods/priors are given mathematical inputs, not fabricated training outputs. A supplied zero-prior class has exact posterior0 and tagged negative-infinite log posterior if another class has positive evidence. The all-zero supplied-evidence state is undefined rather than an arbitrary choice.

## Gaussian model and inspected sklearn1.9.1 behavior

Continuous centered clarity/structure signals may be negative and are not token counts. Separate base6×2 and repeated-first-feature6×3 training arrays are frozen, with matching held-out query arrays. The repeated column is an exact copy, deliberately violating class-conditional feature independence. It is not a new independent measurement. Each configuration refits its own full GaussianNB on the same training row IDs; no scaling or unreported preprocessing.

For each class and feature, mean is arithmetic mean; variance is **population**,sum squared deviations/n_class (ddof0),not sample variance/(n−1). For these ordinary full fit calls, inspected GaussianNB._partial_fit computes epsilon_=var_smoothing*max(var(X_train,axis0)), where var is the training-global population variance across both classes. That same scalar is added to every class/feature variance. It is not per-feature epsilon,not multiplied by class variance,not a fixed absolute constant and not fitted from queries. Source hash recorded in parity report. Incremental partial_fit is **not exposed**; do not generalize this full-fit trace to changing-batch incremental semantics.

Frozen var_smoothing values1e−9 and.1; priors empirical[.5,.5] or explicit[.7,.3]; no weights. Gaussian log density is −.5*log(2*pi*effective_variance)−(x−mean)^2/(2*effective_variance). Sum per-feature log densities plus log prior,normalize. Densities can exceed1; two supplied-density cases verify this using scipy.stats.norm but are **not fitted classifiers**. Exact real-point probability is not a density value.

Zero within-class variance with positive training-global variance is illustrated separately by rows0,0,2,2 and smoothing.001:epsilon=.001 rescues the class variances,query1 gives a tied posterior[.5,.5],prediction0. The same data with smoothing0 has invalid Gaussian densities; reject. A globally constant dataset1,1,1,1 has global variance0,so even smoothing1e−9 gives epsilon0 and sklearn numerical NaN; reject rather than claim variance smoothing universally prevents singularity. Invalid-representation diagnostic rejects applying MultinomialNB to these signed continuous signals,not the Gaussian model itself.

The extreme query[1000,1000] demonstrates ordinary likelihood-product underflow while stable log scores still produce usable normalized posteriors/log losses. Its extrapolation is not evidence of reliable far-out prediction. Duplicate-evidence confidence comparisons hold prior,query,base rows,smoothing and labels fixed; compare actual observed probability error. No claim that every correlated feature increases confidence or harms error,or that a small fictional cohort measures calibration.

## Bounds, interaction and reproduction

Only listed manifest configuration IDs are legal: NB-E1=26,NB-E2=30; diagnostics included,each≤64. No additional Cartesian expansion or general expression evaluator. Largest matrix6×3,all read-only curve/table assets remain within inherited scene/array/table limits. Numerical assets are separate from bounded answer envelopes; learner grading remains finite choices,numeric answers or authored repairs only. Every state includes fixture ID,settings,expected outputs or tagged diagnostic,explanation and counterexample. Training IDs are in the fixture; no development IDs enter any fitted parameters. No CV configuration is exposed; future notebook/workflow must separately verify fold-only vocabulary/parameter fitting.

Before reveal require predicted class/undefined/rejection and a bounded reason; then show likelihood/log contribution,prior,normalizer,posterior and explanatory tables plus optional redundant graphics. Change a legal state and explain a changed case. Initial wrong predictions may recover; no mastery is awarded. Native keyboard controls,visible focus,reduced motion,320px reflow and textual alternatives are implementation obligations,not checks performed by offline reference generation.

Existing accepted environment: CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1; actual platform recorded in report. No installation. From repository root:

```
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python work/freeze-task-015-6.py --freeze
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python work/freeze-task-015-6.py --check
```

Generation validates all states before writing. --check recomputes all trusted/manual references and compares output bytes and generator/convention locks. Sorted,indented JSON is finite-only; warnings from deliberate diagnostic fits are captured as category names,not treated as successful posteriors. Output/report/source/convention SHA256 values frozen. No cross-platform bitwise or genuine Colab claim. Screen-reader,browser zoom,Colab and original-directory I/O remain open. No app implementation,learner evidence change or mastery-policy change.
