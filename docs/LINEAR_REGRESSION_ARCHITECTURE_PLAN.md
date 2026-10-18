# Task 009 — Linear Regression Mastery Lab architecture plan

> Historical Task 009 plan. Implemented status is recorded in `IMPLEMENTATION_STATUS.md`; V1 sequencing and remaining Linear Regression work are canonical in `V1_IMPLEMENTATION_ROADMAP.md` and `V1_CURRICULUM_GAP_AUDIT.md`.

## Scope of this document

This is the inspection and planning deliverable only. It does not add routes, mathematical operations, lessons, analytics events, or learner state. The existing application remains unchanged.

## Repository findings

### Application and routes

- The product is a dependency-light Next.js 16 application under `apps/web`, built from the repository root.
- Existing learning surfaces are `/math`, three Math Foundations lessons, `/math/derivatives`, `/demo`, `/challenges/wrong-direction`, and the `/beta` flow.
- The visual system is implemented with shared CSS tokens and route-specific classes in `apps/web/app/globals.css`. Responsive SVG is the established visualization method.
- `BetaNav` supplies shared navigation. There is no general-purpose LMS, route registry, component library, or content CMS.
- Vercel deployment is configured for the monorepo output at `apps/web/.next`.

### Verified mathematics

- NumPy in `python/mlmath` is the reference authority; `packages/math-runtime` is the dependency-free browser implementation.
- Versioned JSON schemas and Python-generated fixtures under `packages/math-contracts` verify cross-runtime parity.
- Existing contracts cover a single linear neuron, dot products, matrix multiplication, and scalar calculus.
- The single-neuron contract uses one sample and loss `(prediction-target)^2`. It must not be reinterpreted as dataset mean squared error.
- No dataset-level regression metrics, batch gradients, feature scaling trace, or regression training trace currently exists.

### Learning and state

- Evidence-based completion is an accepted decision: visits and navigation do not confer completion.
- Browser-local progress is versioned and keyed by lesson or topic ID. It is suitable for the current account-free architecture.
- The Derivatives topic demonstrates independent module navigation, separate completion/mastery, retries, and remediation.
- There is no reusable objective-level attempt schema yet; the regression module needs a richer store than a boolean outcome array.

### Analytics and privacy

- Existing analytics are first-party, session-only records containing event, timestamp, and route. They do not leave the browser.
- No consented third-party analytics provider, database, user identity, or cross-device persistence exists.
- Educational duration, abandonment, return-visit, and misconception events are not currently modeled.

### Exercises and execution

- The repository provides visible/downloadable NumPy notebook examples but has no safe hosted Python execution environment.
- Arbitrary Python execution should remain out of scope. Guided editable snippets, deterministic answer validation, and downloadable notebooks fit the architecture.

### Quality infrastructure

- Vitest and Testing Library cover runtime and React behavior. Vitest deliberately uses one isolated fork to avoid jsdom cold-start contention.
- Pytest covers reference mathematics. GitHub Actions runs Python tests, fixture regeneration checks, TypeScript checks, frontend tests, and the production build.
- There is no Playwright suite, visual-regression system, or automated accessibility scanner.

## Proposed information architecture

Use a new algorithm namespace and preserve all current routes:

- `/learn/linear-regression` — module overview, prerequisite check, mastery summary, and recommended next activity.
- `/learn/linear-regression/why`
- `/learn/linear-regression/equation`
- `/learn/linear-regression/errors`
- `/learn/linear-regression/gradient-descent`
- `/learn/linear-regression/multiple-features`
- `/learn/linear-regression/implementation`
- `/learn/linear-regression/failure-modes`
- `/learn/linear-regression/project`
- `/learn/linear-regression/mastery`

Each lesson is a direct route and follows `Discover → Predict → Experiment → Explain → Apply → Assess`. Lessons remain independently accessible; the overview recommends an order but does not lock navigation.

Prerequisite cards should deep-link to existing content:

- Functions and graphs → `/math/functions-derivatives`
- Vectors and weighted sums → `/math/vectors-dot-product`
- Matrices → `/math/matrices-multiplication`
- Derivatives and gradients → `/math/derivatives`
- Existing single-neuron application → `/demo`

## Proposed frontend architecture

```text
apps/web/app/learn/linear-regression/
├── page.tsx                         overview
├── curriculum.ts                   typed lesson/objective metadata
├── progress.ts                     parser, migration, recommendation logic
├── assessment.ts                   deterministic rubrics and scoring
├── analytics.ts                    educational event adapter
├── components/
│   ├── regression-shell.tsx
│   ├── lesson-navigation.tsx
│   ├── learning-stage.tsx
│   ├── prerequisite-check.tsx
│   ├── objective-status.tsx
│   ├── feedback-panel.tsx
│   ├── scatterplot.tsx
│   ├── residual-plot.tsx
│   ├── loss-chart.tsx
│   └── training-stepper.tsx
├── why/page.tsx
├── equation/page.tsx
├── errors/page.tsx
├── gradient-descent/page.tsx
├── multiple-features/page.tsx
├── implementation/page.tsx
├── failure-modes/page.tsx
├── project/page.tsx
└── mastery/page.tsx
```

Server page files should provide metadata and render focused client lesson components. Mathematical values come only from runtime traces. React owns drafts, learner evidence, formatting, SVG geometry, and navigation.

Do not introduce a CMS or force all future algorithms into identical content. Reuse a small shell, navigation, objective-status, feedback, and chart vocabulary while allowing lesson-specific pedagogy.

## Proposed mathematical boundary

Add a new regression v1 contract rather than changing the linear-neuron v1 contract.

### Input

- Non-empty rectangular feature matrix `X` with `m` rows and `n` columns.
- Target vector `y` of length `m`.
- Weight vector of length `n` and finite bias.
- Finite positive learning rate with a documented safe UI range.
- Bounded positive integer training steps.

### Trace operations

1. `regressionEvaluationTrace`
   - Per-row weighted products and predictions.
   - Residuals defined consistently as `prediction - target`.
   - Absolute and squared residuals.
   - MAE, MSE, and RMSE.

2. `regressionGradientTrace`
   - MSE gradients `dMSE/dw = (2/m) Xᵀ(Xw+b-y)`.
   - Bias gradient `(2/m) Σ residual`.
   - Central finite-difference comparison.

3. `regressionUpdateTrace`
   - Immutable old parameters, gradient, learning rate, updated parameters, and before/after evaluation.

4. `regressionTrainingTrace`
   - Bounded deterministic steps.
   - Per-step parameters, metrics, and finite/divergence status.
   - No assumption that every update reduces loss.

5. `featureScalingTrace`
   - Training-set mean and standard deviation.
   - Explicit zero-variance rejection or documented zero mapping.
   - Reuse of training statistics for evaluation data to prevent leakage.

Python generates shared fixtures for simple, multiple-feature, zero-residual, large-value, and divergent cases. TypeScript parity remains within the documented numeric tolerance.

## Synthetic datasets

Commit small deterministic datasets as typed fixtures, not remote resources:

- House size → price for Lessons 1–4.
- Size, bedrooms, and age → price for Lessons 5–6.
- Curved, outlier, leakage, correlated-feature, and scale-mismatch variants for Lesson 7.
- A distinct real-world-style project dataset for Lesson 8.
- An unfamiliar scenario and alternate retry variant for Lesson 9.

Units, generation assumptions, train/test split, and intended misconception must be documented with each dataset. No dataset should imply real property valuations.

## Progress and mastery model

Use `ml-math-lab:module:linear-regression:v1` in `localStorage`:

```ts
type RegressionProgressV1 = {
  schemaVersion: "1.0.0";
  lessonCompletion: Record<LessonId, { completed: boolean; completedAt?: string }>;
  objectiveMastery: Record<ObjectiveId, { level: 0|1|2|3; bestScore: number }>;
  attempts: Array<{
    assessmentId: string;
    variant: string;
    score: number;
    misconceptions: string[];
    timestamp: string;
  }>;
  lastVisitedLesson: LessonId | null;
  recommendedNext: LessonId | null;
};
```

- Completion requires lesson-specific evidence.
- Mastery levels map transparently to conceptual, applied, and independent rubrics.
- Attempts store rubric results and controlled misconception codes, never free-text responses or personal data.
- Keep only a bounded recent attempt history to avoid unbounded storage.
- Reset one lesson without clearing other lessons or module mastery. Provide a separate explicit module reset.
- Parser validation and migrations must fail safely without erasing unrelated Math Foundations progress.

## Assessment design

- Level 1: constrained concept interpretation and graph reading.
- Level 2: numerical calculations and parameter-change predictions.
- Level 3: unfamiliar dataset diagnosis and justified model decisions.
- First incorrect attempts receive a targeted cue; later attempts may reveal a worked explanation.
- Open explanations use self-check rubrics with required learner acknowledgement, not keyword grading.
- Alternate deterministic variants support retries.
- Remediation links point to a specific regression lesson or existing Math Foundation route.

## Educational analytics plan

Extend the first-party adapter without coupling events to lesson logic. Proposed event envelope:

```ts
type LearningEvent = {
  event: "lesson_started"|"lesson_completed"|"experiment_interacted"|
    "assessment_attempted"|"module_returned"|"module_abandoned";
  timestamp: string;
  route: string;
  module: "linear-regression";
  lessonId?: LessonId;
  objectiveId?: ObjectiveId;
  result?: "correct"|"incorrect"|"completed";
  durationBucket?: "under_1m"|"1_5m"|"5_15m"|"15m_plus";
  misconception?: ControlledMisconception;
};
```

- Store session events locally and emit the existing browser custom event.
- Track active, visible time in coarse buckets; never store raw keystrokes or answer text.
- Derive abandonment on lesson exit only after meaningful activity.
- A return visit is a local module visit in a later browser session, without a user identifier.
- No network provider until privacy, consent, retention, and tester-access decisions are approved.

## Implementation sequence

### 009.2 — Framework and navigation

- Add overview and nine stable direct routes.
- Add typed curriculum metadata, prerequisite links, shared shell, direct navigation, and empty progress model.
- Acceptance: mobile/desktop navigation works; visits alone do not complete lessons; all old routes remain unchanged.

### 009.3 — Mathematical engine

- Implement NumPy reference traces, TypeScript parity runtime, JSON schemas, and fixtures.
- Cover evaluation metrics, gradients, updates, bounded training, multiple features, and scaling.
- Acceptance: Python/TypeScript agree within tolerance; invalid and nonfinite inputs are rejected; gradient checks pass.

### 009.4 — Core interactive labs

- Build Lessons 1–4 with scatterplot, line controls, residuals, metrics, loss curve, and training stepper.
- Acceptance: every displayed number comes from a trace; learner prediction precedes reveal; reset is deterministic.

### 009.5 — Application and diagnostics

- Build Lessons 5–8, deterministic code exercises/notebooks, failure-mode datasets, and guided project.
- Acceptance: no arbitrary code execution; scaling uses training statistics; diagnostic feedback is specific.

### 009.6 — Assessment and progress

- Build Level 1–3 assessments, alternate variants, rubric feedback, objective mastery, bounded attempts, reset isolation, and recommendations.
- Acceptance: mastery requires evidence; retries preserve best score and expose remediation.

### 009.7 — Validation instrumentation

- Add typed local learning events and privacy documentation.
- Acceptance: tracking failure cannot break learning; no personal/free-text data; no network transmission.

### 009.8 — QA and controlled beta

- Run all mathematical and frontend regressions, type checks, production build, direct-route smoke checks, keyboard review, reduced-motion review, responsive browser QA, and deployment review.
- Acceptance: exact counts and limitations reported; tester access policy explicitly selected before invitations.

## Test strategy

- Python: deterministic calculations, randomized dimensions, finite-difference gradients, edge cases, fixtures.
- TypeScript: cross-runtime parity for every numeric trace leaf and training status.
- Frontend: prerequisite routing, lesson navigation, prediction-before-reveal, trace synchronization, invalid inputs, reset isolation, assessment feedback, retries, recommendations, and persistence migration.
- Accessibility-critical: labels, fieldsets/legends, keyboard controls, SVG accessible names, visible focus, non-color encodings, and reduced motion.
- Build/regression: existing 34 Python tests, 16 current runtime tests, and 57 current frontend tests remain the starting regression baseline.
- Add browser smoke coverage if a stable Playwright setup is introduced during 009.8; do not add it solely for route checks that existing tools cover reliably.

## Approved architecture decisions

1. **Task identifier.** Approved as **Task 009 — Linear Regression Mastery Lab**; Task 008 remains the Derivatives depth pilot.
2. **Route namespace.** Approved as `/learn/linear-regression/*`, separate from Math Foundations and the single X-Ray demo.
3. **Loss convention.** Dataset training optimizes MSE with the `2/m` gradient; the existing single-neuron squared-error convention remains unchanged.
4. **Feature scaling.** Selected zero-variance features are rejected with an educational diagnostic rather than silently mapped to zero.
5. **Python exercise scope.** Deterministic browser exercises and downloadable notebooks only; no hosted or arbitrary Python execution.
6. **Analytics scope.** Local/session-only instrumentation for the first pilot; no third-party transmission.
7. **Deployment access.** Approved for access-controlled Vercel preview invitations; do not use an unrestricted preview as a substitute before 009.8.

## Dependencies

No new production dependency is required for 009.2 or the mathematical engine. React, SVG, TypeScript, NumPy, Vitest, Testing Library, and pytest cover the proposed work. A charting, state-management, symbolic-math, analytics, or Python-execution dependency is not justified at this stage.
