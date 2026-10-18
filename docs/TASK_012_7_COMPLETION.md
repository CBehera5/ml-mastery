# Task 012.7 — Statistics Foundations completion

Date: 15 October 2026. **Implemented; not fully accessibility or learner verified.**
Local preview: http://127.0.0.1:3017/math/statistics
Causal experiment: http://127.0.0.1:3017/math/statistics/relationships#experiment

Work stops after Task 012.7. No deployment or Optimization work occurred.

## 1. Implementation inventory

The approved Task 012.1 Statistics scope, Probability completion report, curriculum registry, exercise/evidence contracts and existing mathematical runtimes were inspected. This module reuses the existing foundation evaluator/evidence helpers, BetaNav, lesson/table styles and proven module-local lesson/assessment pattern. Probability's binomial runtime supplies the bounded null-model experiment. No shared teaching-system refactor was introduced.

| Route under /math/statistics | Four objective checks | Scope |
|---|---|---|
| /data | Population/sample/observation; numerical/categorical features; descriptive versus inferential reasoning; representative samples | Essential |
| /center | Mean; median; mode and ties; robust-center interpretation under outliers | Essential |
| /spread | Population/sample variance and denominators; range/SD/units; quartiles/IQR; z-scores | First three essential; z-score introduction |
| /distributions | Histogram bins; box plots/fences; same mean with different shapes; normal-model limitations | First three essential; normal intuition introductory |
| /relationships | Covariance; Pearson correlation and undefined cases; confounding; observation versus intervention | Essential, with separate critical causal checks |
| /sampling | Sampling-frame bias; repeated-sample variability/SE/CLT; confidence interpretation; null-model/p-value intuition | Bias essential; CLT/inference introductory |
| /ml | EDA/train-only scaling; leakage; distribution/generalization boundaries; residual interpretation | Essential bridge, not the complete Model Evaluation module |

The overview is /math/statistics and independent mastery is /math/statistics/mastery: **nine new pages**. The Mathematics hub now links Statistics separately. Each of 28 concepts includes meaning, purpose, intuition, notation/symbol explanations, worked example, application, misconception, check and remediation. Each lesson includes prerequisite recall and a linked experiment.

## 2. Correlation versus causation — emphasized delivery

This is taught through contrasting experiments and assessed separately from correct arithmetic:

1. **Adjustable common-cause construction.** Warm weather increases both hypothetical ice-cream sales and swimming visits. At default settings, pooled r≈0.961538, while cool-only and warm-only correlations are 0. A learner can change the common-cause strength, filter weather groups and compare exact paired rows and scatterplots.
2. **Intervene rather than filter.** A distinct control assigns a change to X while keeping weather/disturbances fixed. With assumed direct coefficient c=0, changing sales has zero modeled effect on swimming despite strong pooled correlation. Changing c changes the declared mechanism, not what the observed r has proved.
3. **Observational twins.** Model A has X=Z,Y=Z; model B has X=Z,Y=X. Both give identical observational rows and r=1. Learners must predict before revealing the consequences of do(X=1) or do(X=0). Model A retains Y=[0,1]; model B gives [1,1] or [0,0]. Equal observations cannot distinguish these intervention answers.
4. **Misconception-specific repair.** Choosing “both have r=1, so the intervention must agree” triggers explicit corrective feedback. The app-retention transfer question rejects coefficient-only claims and points to appropriate causal study designs and their assumptions.
5. **Critical mastery gates.** Confounding and intervention interpretation are two separate essential critical objectives. A production-browser attempt with every other item correct scored 27/28 but did not earn mastery because its causal conclusion was invalid.

Reverse causation, selection, hidden common causes, predictive feature importance and p-values are explicitly distinguished from causal identification. Random assignment is distinguished from random population sampling; finite-sample uncertainty, adherence, interference, measurement and generalizability still matter. The examples are fictional structural-model consequences, **not empirical causal findings or a general causal-inference engine**.

Additional scatterplot scenarios include perfect negative linear association, a perfect curved relationship with Pearson r=0, and constant-X undefined correlation. Strong, weak and zero coefficients all require interpretation beyond a number.

## 3. Other interactive experiments

### Summary / Outlier Explorer
- Editable complete numerical data, 2–20 bounded values; invalid/missing entries produce an error rather than silently dropping rows.
- Add an extreme observation; compare mean and median.
- Switch population/sample denominator, translate and scale data, inspect variance/SD units and descriptive z-scores.
- Reference [1,2,3], concentrated and two-cluster mean-5 presets, right-tail outliers and constant data.
- Histograms with explicit left-closed bins and final right-edge inclusion; SVG box plot plus exact raw-value, quartile, fence, whisker and outlier tables.
- Median-of-halves convention excludes the central observation for odd n. All-unique data has no repeated mode under the declared convention.

### Sampling / Uncertainty Explorer
- Known population [0,0,0,0,0,0,0,0,10,10], μ=2 and population SD=4.
- Seeded independent draws with replacement; adjustable n, repetition count and seed; sample means and individual interval rows.
- Target-population reference SE=4/√n; nominal normal-based known-σ intervals x̄±1.96σ/√n. Coverage is measured, never guaranteed to be exactly 95%.
- Biased-frame toggle samples only the two high values: more draws center at 10, not target mean 2, and the displayed target intervals are explicitly labeled invalid.
- Exact two-sided null-model thought experiment for 10 fair independent coin tosses. Ten heads gives p=2/1024≈0.001953; the text rejects P(null true), causal-proof and practical-importance interpretations.

### Leakage / Scaling Bridge
- Six fixed hypothetical labels and a fixed rule, not a trained algorithm. A legitimate pre-outcome proxy scores 4/6; copying eventual labels produces 6/6 but is explicitly invalid prospective evidence.
- Training [0,2] has population mean/SD 1/1. Changing a held-out value leaves clean training references unchanged; incorrectly fitting on train+test visibly changes the reference.
- Links to existing Regression errors/failure-modes material; preserves residual sign prediction−observation and all existing scaling semantics. No full Model Evaluation module is duplicated.

Every visualization has a caption and numerical/text alternative. Group markers use circles versus squares, not color alone.

## 4. Objective checks, mastery and evidence

- 28 objective checks with two deterministic definitions each: **56 versioned exercise IDs**.
- Independent mastery v1 requires **23/28 (at least 80%) AND all ten critical essentials in the same attempt**.
- Critical set: representativeness; robust-center selection; variance denominator; SD units; undefined zero-spread correlation; confounding; intervention interpretation; sampling-frame bias; leakage; generalization boundary.
- Introductory z-scores, normal intuition, CLT, interval and testing items are assessed but not critical.
- Review/edit precedes explicit consent and confirmed submission. Results focus the heading; failed objectives link to remediation; retry alternates variants. Sampling never grades mastery.
- Practice can record objective completion, not mastery. Lesson completion requires four successful objective checks plus an interaction/reflection record. Reflection is activity evidence, not proof of comprehension.
- Reuses LearningEvidenceV1 with curriculum statistics.foundations.v1 and storage key ml-math-lab:evidence:math.statistics:v1.
- Latest 20 Statistics submissions are retained; unrelated attempts and previously earned mastery are not removed. Duplicate submission IDs are idempotent.
- Saved objectives, lesson completion, submitted scores and mastery survive reload. **Unsubmitted answers intentionally restart on reload**, without submission or consuming an attempt; this is stated in the UI.
- Unknown/corrupt/future versions preserve raw stored data and disable writes visibly. Storage denial/failure degrades to in-memory practice with a warning, not silent loss or a crash.
- No old subject evidence is rescored, relabeled or upgraded.

## 5. Mathematical correctness

Additive statistics.v1 TS/Python runtimes cover summaries, histogram boundaries, paired covariance/correlation, z-scores, reproducible sampling and declared toy causal mechanisms.

**27 frozen cross-language/schema cases:** 9 summaries, 5 paired statistics, 3 histograms, 4 sampling settings, 4 relationship settings and 2 observational twins. Fixture schema uses draft 2020-12, rejects unknown contract versions and validates every frozen shape.

Verified references and invariants:
- [1,2,3] mean/median 2, population variance 2/3, sample variance/SD 1.
- Mode ties and all-unique convention; odd/even/single-value quartiles; 1.5-IQR fences and observed whiskers.
- Translation preserves variance; scaling by k multiplies variance by k² and SD by |k|. Representative 10^12-offset calculations remain stable using centered summation.
- Sample covariance [1,2,3] versus [2,4,6] is 2; population covariance is 4/3. Unit/sign changes and r=±1 behave correctly.
- Constant-variable correlation and zero-SD z-scores return undefined (null), not fabricated zero. A curved deterministic relationship can have r=0.
- Empty, nonfinite, sparse/missing, oversized and out-of-bounds datasets are rejected; sample/paired minimum n and pair-length errors are tested.
- Histogram count conservation and maximum inclusion.
- Identical seeded sequences in TS/Python; reproducible sample means/intervals and correct coverage booleans.
- Strong confounding with no direct effect, and identical observational data with differing intervention predictions.
- Confidence-interval and p-value interpretation are checked deterministically rather than judged by random coverage outcomes.

Runtime bounds are finite complete datasets of at most 1000 values within ±10^12; UI editing is narrower. This is not arbitrary-precision statistical software, an unrestricted inference library or evidence of valid real-world causal assumptions.

## 6. Verification results

| Check | Result |
|---|---|
| Focused new TS/runtime/model/frontend | 23 tests in 3 files pass |
| Focused Python Statistics | 22 tests pass |
| Full TypeScript/frontend regression | 291 tests in 48 files pass |
| Full Python regression | 144 tests pass |
| Type checking | Pass |
| Production build | Pass, 52 prerendered pages including nine new Statistics pages |
| Lesson browser journey | All 28 checks exercised; all seven completed lessons survive reload |
| Causal gate | 27/28 does not earn mastery when the confounding conclusion is wrong |
| Retry and persistence | Changed-value v2 passes 28/28; both scores and mastery visible after reload |
| Review consent | Submission disabled before explicit confirmation; edit resets consent |
| Responsive | All seven lesson routes and assessment active/review/result states measure 320px document width at a 320px viewport |
| Keyboard | Native form controls, prediction/reveal, review, consent, submission and retry work; sequential Tab reaches enabled relationship reflection in 30 stops after the brand link |
| Scoped markup | Relationship audit: zero unlabeled inputs/selects, captionless tables or unnamed SVG images |
| Browser boundaries | Verified sample denominator, constant-data undefined z-scores, biased-frame warnings, copied-label 6/6 invalidity and leaked preprocessing |
| Console | No errors observed in final Statistics preview |

Tests ran against the local production build; learner-test evidence was isolated on port 3018 from founder progress on 3017. The test server is stopped; the user preview remains on 3017. Temporary viewport override is reset. The screenshot shows the prediction/reveal and differing intervention outcomes.

## 7. Preservation and compatibility

A pre-edit SHA-256 snapshot covered 160 existing source/notebook files. **155 are byte-for-byte unchanged.** The five intentional edits are Probability-independent global CSS additions scoped to Statistics, Math hub source/test, additive curriculum integration and runtime export barrel.

All five shipped notebooks, Probability source/runtime/evidence implementation, Algebra, Linear Algebra, Calculus/Derivatives and Linear Regression implementations remain unchanged. Existing regression tests pass. In particular, featureScalingTrace still uses its verified population convention and rejects zero-variance features; the original Regression objective and residual sign are untouched.

## 8. Accessibility and remaining risks

Status is **implemented, not fully verified**:
- Actual VoiceOver/NVDA speech, mathematical symbols, table navigation and chart/reveal announcements remain NOT VERIFIED.
- Genuine 200%/400% browser zoom remains NOT VERIFIED. A 320px viewport is not zoom.
- Comprehensive WCAG/device/browser, contrast, target-size, text-spacing and full scanner/manual acceptance remain open. No comprehensive automated accessibility pass is claimed.
- Formal learner comprehension, causal transfer and psychometric variant equivalence were not tested or authorized.
- Toy mechanisms do not identify real causal effects; real causal studies require justified design/assumptions.
- Normal-based intervals are introductory known-σ approximations; biased sampling and small skewed samples can defeat nominal coverage.
- Local browser persistence is not cross-device synchronization; unfinished assessment answers deliberately do not persist.

No essential scope gap is known within the approved bounded blueprint. These limitations remain named release requirements, not a claim of full verification.

## 9. Documentation and next milestone

Updated Mathematics Foundations blueprint, curriculum master plan, implementation status, V1 roadmap, conceptual-depth backlog and release/accessibility blocker register. Catalog version is 1.3.0. Prior dated “Statistics planned” stopping points remain historical and are superseded by the 012.7 updates.

Recommended **Task 012.8 — Optimization Foundations**:
- Loss landscapes, gradients versus minima, learning rates and scaling.
- Bounded same-start scalar/2D histories and finite-run stability, with explicit failure/stop reasons and no automatic convergence claims.
- Reuse Regression training traces; keep its verified v1 unregularized objective unchanged.
- Introduce regularization rationale with data loss and penalty reported separately.
- Blueprint references: (w−3)² at w=1 has gradient −4; η=0.1 gives next w=1.4. With λ=1, (w−3)²+λw² has minimum 1.5 rather than 3.
- Separate versioned objective/mastery evidence; critical sign/settings/convergence/validation-boundary reasoning.

No Optimization, Python-for-ML, additional supervised algorithms, capstone, teaching-system rollout, comprehensive Task 017 refinement, formal learner study or deployment was performed. **Stop after Task 012.7 and await founder approval.**
