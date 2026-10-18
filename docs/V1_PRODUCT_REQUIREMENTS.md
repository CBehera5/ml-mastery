# ML Mastery Platform V1 product requirements

## Founder amendment — supervised planning baseline

16 October2026. Current Task015 conditional baseline and “ML Mastery — Learn Machine Learning by Doing” learning sequence are recorded in the [implementation decision package](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md). Accepted supervised planning scope includes Elastic Net, Naive Bayes and bounded introductory MLP; Task014 remains projects and need not precede algorithm authoring. Third capstone is now **Technical Documentation Quality Classification (Good / Needs Improvement)**, replacing historical Spam. Existing Regression, mastery/progress and commercial configuration are unchanged. No implementation authorization follows from this planning amendment.

**Status:** Task 010.1 planning baseline  
**Canonical for:** V1 promise, audience, scope, outcomes, and release boundaries  
**Related sources:** `V1_CURRICULUM_MASTER_PLAN.md`, `V1_CURRICULUM_GAP_AUDIT.md`, `V1_INTERACTIVE_PROJECTS_SPEC.md`, `V1_IMPLEMENTATION_ROADMAP.md`, and `V1_LAUNCH_READINESS.md`

## Product promise

ML Mastery Platform V1 teaches technical learners to understand, implement, evaluate, debug, and apply supervised machine-learning methods. The commercial promise is **“Stop memorizing ML. Start understanding it.”** A learner should finish able to approach an unfamiliar supervised-learning problem, build a reproducible baseline, justify choices, diagnose errors, and communicate limitations.

V1 is a one-time $39 product for developers, data analysts, and technical professionals transitioning into ML. Billing, entitlement, and marketing implementation are not part of Task 010.1, but honest launch claims and future entitlement readiness are release concerns.

## Approved V1 scope

1. **Mathematics for ML:** algebra/functions, linear algebra, calculus, probability, statistics, and optimization.
2. **Python for ML:** Python essentials, NumPy, pandas, visualization, data preparation, and scikit-learn.
3. **Supervised ML:** Linear and Polynomial Regression, Ridge/Lasso, Logistic Regression, KNN, Decision Trees, Random Forests, Gradient Boosting, SVM, model evaluation, and model selection/tuning.
4. **Projects:** House Price Prediction, Spam Email Detection, and Customer Churn Prediction, each in guided and independent modes.

The detailed, canonical topic inventory is in `V1_CURRICULUM_MASTER_PLAN.md`. Existing historical task documents remain evidence of prior decisions, not alternate V1 scope definitions.

## Required learning contract

Every module defines prerequisites, measurable objectives, checks, experiments, practical exercises, misconceptions, mastery criteria, and remediation. Every algorithm covers the problem, use cases, intuition, mathematics, stepwise behavior, experimentation, Python, hyperparameters, evaluation, failure modes, alternatives, and an independent challenge.

Learning states are distinct:

- **Visited:** route opened; never evidence of learning.
- **Started:** a meaningful learner action occurred.
- **Completed:** required lesson activities were demonstrated.
- **Assessed:** a rubric-bearing attempt was submitted.
- **Mastered:** the learner met objective-level criteria on an unfamiliar or reduced-scaffolding task.

Completion never implies mastery. Progress must remain independently resettable by lesson, while explicit module-level reset is separate.

## Experience requirements

- Lessons are independently accessible; prerequisites are recommendations and remediation links, not route locks.
- Interactive work follows **Predict → Experiment → Observe → Explain → Apply**.
- Projects follow **Problem → Data → Exploration → Preparation → Modeling → Evaluation → Debugging → Reporting**.
- All computed mathematical claims come from versioned runtimes or deterministic evaluators, not duplicated UI formulas.
- Python activities use tracing, constrained edits, debugging, deterministic checks, and downloadable Colab-compatible notebooks. Arbitrary hosted execution is prohibited without a separate security architecture.
- Interfaces must be keyboard operable, responsive, understandable without color alone, and respectful of reduced-motion preferences.
- Predetermined outputs must be clearly described as simulations or fixtures; the product must not claim a model was trained when no training occurred.

## Technical and privacy constraints

- Preserve the Python-reference/browser-TypeScript parity model and versioned JSON traces.
- Extend incrementally; do not rewrite verified runtimes or force every algorithm into one inflexible template.
- Add dependencies only after documenting the need, alternatives, bundle/security impact, and approval.
- V1 may start with validated browser-local progress. Account-backed entitlement or cross-device state requires an approved identity and privacy design.
- Analytics remain local/session-only until consent, retention, data minimization, and provider decisions are approved.
- No database, arbitrary Python service, AI chatbot, or payment implementation is authorized by this plan.

## Success and release evidence

V1 is not complete because routes exist. Release requires:

- all approved modules have substantive instruction, practice, and explicit objectives;
- required labs work and produce mathematically verified results;
- every algorithm has an independent assessment with a transparent rubric;
- all three projects can be completed in both modes with reproducible artifacts;
- mathematical parity, deterministic evaluator, frontend, accessibility, route, and production-build checks pass;
- claims, limitations, privacy behavior, support expectations, and pricing state are accurate.

The release-blocker checklist is canonical in `V1_LAUNCH_READINESS.md`.

## Out of scope for Task 010.1

This planning task changes no routes, UI, runtime, schemas, dependencies, analytics behavior, deployment, payment, or authentication. Task 010.2 may begin only after founder review of the decisions listed in the roadmap.
