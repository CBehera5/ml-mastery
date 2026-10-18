# Task 012.6 — Probability Foundations completion

Date: 15 October 2026. **Implemented; not fully accessibility or learner verified.**
Preview: http://127.0.0.1:3017/math/probability
Work stops after Task 012.6. Statistics and deployment were not begun.

## 1. Lessons, routes and objective inventory

The Mathematics Foundations blueprint, Calculus completion report, shared curriculum/exercise/evidence contracts and existing subject patterns were inspected before implementation. Probability reuses BetaNav, foundation exercise evaluation, LearningEvidenceV1, lesson-state helpers and existing responsive lesson/table styles. It does not replace the Derivatives pilot or introduce a teaching design system.

| Lesson route under /math/probability | Four checked objectives | Depth |
|---|---|---|
| /understanding | Sample spaces/outcomes/events; valid probability and equal likelihood; complements; model probability versus frequency | Essential |
| /multiple-events | Ordered counting; union and overlap/mutual exclusion; independent multiplication; repeated-trial misconception | Essential |
| /conditional | Filtered-population denominator; reversed conditionals; undefined empty condition; dependence/replacement | Essential |
| /bayes | Prior/likelihood/evidence/posterior; total positive evidence; base-rate effects; likelihood versus posterior | Essential |
| /distributions | Random variables/PMF/Bernoulli/binomial; expectation and variance intuition; CDF; continuous density/normal family | First three essential; continuous density/normal introduction |
| /ml | Probabilities versus thresholds; conditional-independence Naive Bayes intuition; calibration; likelihood/log loss | Threshold/calibration essentials; Naive Bayes/loss introductory |

The overview is /math/probability; independent mastery is /math/probability/mastery. The Math hub now separates implemented Probability from planned Statistics. Titles are route-specific. Each of 24 concept cards includes purpose, plain language, intuition, formula/symbol explanations, numerical example, application, misconception, remediation, a linked experiment and a deterministic check. Prerequisite recall is provided per lesson. No advanced proofs or fitting algorithms are taught.

## 2. Experiments

1. **Event / Conditional Probability Explorer** shared by the first three lessons: editable four-cell count population; exact joint/union/complement/conditional readouts; independent, mutually exclusive and empty-condition presets; replacement versus no replacement; reproducible coin/dice frequencies beside exact model probabilities.
2. **Bayes Frequency Table:** integer-percentage prevalence/sensitivity/false-positive controls over 10,000 hypothetical cases; four cells and explicit posterior denominator. The blueprint's 1000-case reference is retained: 9 true positives and 99 false positives gives 9/108, not 9/10. Empty positive evidence reports undefined. Supplied detector likelihoods are distinguished from empirical rates when a class has no cases.
3. **Distribution Explorer:** Bernoulli via n=1, binomial mass/CDF and moments, parameter controls and labeled probability bars; normal density profile, location/spread controls and interval-area exploration. Height can exceed 1; exact-point probability remains 0. Every display has numerical/text alternatives.
4. **ML interpretation experiments:** six fixed scores/labels with inclusive threshold and confusion counts; actual-label likelihood/log loss including infinite boundaries; two supplied clue likelihoods under a conditional-independence assumption; one hypothetical calibration bin of 100 cases. These do not train, validate or implement a full classifier.

Simulations use a pinned uint32 LCG (1664525, 1013904223; modulus 2^32), identical in TS/Python. Sampling is illustrative, not security-grade random generation, a proof, or a source of mastery grades.

## 3. Assessment and evidence compatibility

- 24 objective-level checks; two deterministic definitions per objective (48 versioned exercise IDs).
- Independent assessment v1: 24 equally weighted items; at least **20/24 (≥80%) plus all eight essential critical objectives in the same attempt**.
- Critical gates: valid/equally likely probability calculation, union overlap, independent product, conditional denominator, empty conditioning, Bayes posterior, base-rate direction and threshold interpretation.
- Introductory continuous density/normal, Naive Bayes and log-loss items contribute to overall coverage but are not critical gates.
- Review lists every response; editing clears consent; explicit confirmation is required to submit. Results focus the heading and link failed objectives to remediation. Retry alternates v1/v2; no uncontrolled randomness affects scoring.
- Practice records objective evidence, not mastery. Lesson completion requires all four objective checks and an experiment reflection; reflection is interaction evidence, not proof of comprehension.
- Uses LearningEvidenceV1, curriculum probability.foundations.v1 and key ml-math-lab:evidence:math.probability:v1. Latest 20 Probability submissions are retained without trimming unrelated attempts; earned mastery remains after later failure. Duplicate submission IDs are idempotent.
- Unknown/corrupt/future evidence is not relabeled, erased or silently migrated: raw data stays untouched and writes are disabled with a warning. Storage exceptions degrade to in-memory practice with visible warnings.
- Saved objectives, completed lessons, assessment history and mastery survive reload. **Unsubmitted answers intentionally do not persist**; this is explained before assessment. Reload never submits or consumes an attempt.
- New module evidence is isolated. No Algebra, Linear Algebra, Calculus, Regression or notebook evidence is migrated, rescored or upgraded.

## 4. Mathematical verification

New additive probability.v1 runtimes in TypeScript and Python cover finite count traces, Bayes, binomial mass/CDF/moments, normal density/area, seeded sampling, fixed-score thresholds and binary log loss.

**28 frozen cross-language reference cases**: 3 event, 5 Bayes, 5 binomial, 3 simulation, 3 normal-density, 4 interval-area and 5 threshold cases; the frozen fixture is validated by its draft-2020-12 JSON schema. Numerical traces agree to tested tolerances; seeded integer counts agree exactly.

Tests cover probability/count bounds, invalid/empty denominators, complement and inclusion-exclusion, joint/conditional identities, independence versus exclusivity, base rates and zero evidence, normalized mass and monotonic CDF, weighted means/variances, p=0/1 endpoints, deterministic seed conservation, inclusive threshold decisions and infinite impossible-outcome loss. Normal areas use 1024-step Simpson integration on bounded standardized limits [−8,8], independently compared with Python erf with absolute error below 1e−8 for tested ranges. The UI restricts these parameters further; displayed values are rounded, not symbolic proofs.

## 5. Verification results

| Verification | Result |
|---|---|
| Focused new TS/runtime/model/frontend suite | 20 tests in 3 files pass |
| Focused Python Probability suite | 23 tests pass |
| Full TypeScript/frontend regression | 268 tests in 45 files pass |
| Full Python regression | 122 tests pass |
| Type checking | Pass |
| Production build | Pass; all eight new Probability pages prerender |
| All 24 lesson checks and six lessons | Completed through production UI on isolated port 3018; each lesson completion survives reload |
| Critical failure/retry | 23/24 with a critical failure does not award mastery; alternate changed-value v2 passes 24/24 |
| Assessment persistence | Both scores and earned mastery visible after reload; unsubmitted attempt resets without automatic submission |
| Responsive | All six lessons and active/review/result assessment states measure 320px document width at 320px viewport; final ML additions also fit |
| Keyboard | Native sliders respond to Home/arrows; radios to Space; review/confirmation/submission/retry to keyboard. Sequential Tab reaches the enabled Bayes reflection control in 25 stops after the brand link |
| Basic accessibility markup | Bayes DOM inspection finds zero unlabeled inputs/selects and zero captionless tables; fieldsets, scoped table headers, labels and live textual readouts present |
| Browser errors | No console errors observed in the final Probability preview |

The final eight-gate policy is visibly confirmed in the rebuilt production UI; no introductory objective is critical. Browser test evidence stays on isolated origin 3018, separate from the founder's 3017 progress. The test server is stopped; the local 3017 preview remains available. Temporary viewport override is reset.

## 6. Preserved behavior

A pre-edit SHA-256 snapshot covered 135 existing source files. 131 remain byte-for-byte unchanged. The four intentional changes are Math hub source/test, additive reference catalog integration and the runtime export barrel. All five shipped notebooks also match the earlier Task 012.5 preserved hashes. Existing Algebra, Linear Algebra, Derivatives/Calculus and Linear Regression lesson/runtime implementations are untouched; their regression tests pass. Global CSS additions are Probability-scoped. No existing exercise scorer, historical threshold, storage key, runtime function or notebook was replaced.

## 7. Accessibility, remaining risks and acceptance

**Implemented is not fully verified.** Native keyboard controls, scoped focus behavior, semantic tables, named meters and complete numerical/text alternatives are available. The 320px check is reflow evidence, not genuine zoom evidence.

Open requirements:
- Actual VoiceOver/NVDA speech testing, mathematical symbols, table navigation and live feedback.
- Genuine 200% and 400% browser zoom and supported device/browser matrix.
- Comprehensive WCAG checks, including contrast, targets, text spacing and full scanner/manual acceptance. No axe/full scanner pass is claimed.
- Formal learner comprehension, transfer and psychometric equivalence of the two finite variants; not performed or authorized here.

No essential content gap is known within the bounded blueprint. Fixed examples do not establish calibration/generalization, simulation is not inference, and normal approximations are not a claim that all data are normal. Local-browser storage is not cloud synchronization. Assessment answer drafts intentionally restart on reload.

## 8. Documentation and next milestone

Updated Mathematics Foundations blueprint, curriculum master plan, implementation status, V1 roadmap, conceptual-depth backlog and release/accessibility blocker register. Prior dated stopping-point notes remain historical; the new 012.6 entries supersede “Probability not begun.”

Recommended **Task 012.7 — Statistics foundations**: center/spread/units; population versus sample variance; covariance/correlation without causation; sampling and bias; introductory CLT and interval meaning. Use the approved Summary/Outlier, Covariance/Correlation and Sampling/Uncertainty labs with deterministic evidence and separate mastery. Keep the blueprint references [1,2,3] → mean/median 2, population variance 2/3, sample variance 1. Preserve Probability evidence and all previous subjects.

No Statistics, Optimization, Python-for-ML, new full ML algorithms, capstones, teaching-system redesign, formal learner study, broad Task 017 refinement or deployment was performed. **Stop after Task 012.6 and await founder approval.**
