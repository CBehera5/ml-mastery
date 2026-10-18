# V1 interactive projects specification

## Current founder-approved lineup amendment

16 October2026. **Technical Documentation Quality Classification** replaces Spam as the third project direction alongside House Price and Customer Churn. Target: human-reviewed Good/Needs Improvement; no automatic LLM ground truth. [Current dependency map](supervised-capstone-dependencies.md) and [proposed annotation/dataset protocol](task-015-documentation-quality-dataset-spec.md) supersede the historical Spam direction below. Keep that section for provenance, not as a fourth active capstone. Annotation/reliability, rights, dataset readiness and engine/project rubric details still require their specified approvals. No project implementation, data collection or change to existing rubric/mastery semantics.

## Purpose and boundary

Projects prove transfer from lessons to complete ML work. They are not static walkthroughs and must not pretend predetermined output is live training. V1 supports deterministic web decisions and calculations plus downloadable notebooks for actual Python execution. Arbitrary hosted Python remains excluded.

## Shared project contract

Each project implements:

1. **Problem:** define target, users, decision, success measure, and harm/cost tradeoffs.
2. **Data:** inspect a documented, versioned dataset card and feature/target schema.
3. **Exploration:** investigate distributions, missingness, imbalance, outliers, and suspicious relationships.
4. **Preparation:** choose split, train-fitted transformations, encoding, and missing-data strategy.
5. **Modeling:** establish a baseline, select approved models, and generate reproducible outputs.
6. **Evaluation:** use held-out evidence and metrics aligned with the objective.
7. **Debugging:** diagnose at least one realistic failure without contaminating production runtimes.
8. **Reporting:** produce decisions, evidence, limitations, and reproducibility instructions.

### Guided mode

Ordered stages, decision prompts, immediate contextual feedback, explanations for incorrect choices, prerequisite links, deterministic outputs, and explicit checkpoints. Guidance explains consequences but does not silently make decisions.

### Independent mode

An unfamiliar dataset variant with reduced scaffolding, learner-selected preprocessing/modeling choices, transparent rubric, targeted feedback, and final summary. Critical leakage or invalid-evaluation errors cap the result regardless of aggregate score.

## Proposed reusable architecture

Add only after approval:

```text
apps/web/app/projects/
  curriculum.ts                 project metadata and stable IDs
  components/                   shell, stage nav, decision prompt, evidence panel
  [project]/                    overview plus guided/independent routes
packages/project-contracts/
  datasets/                     versioned compact fixtures and dataset cards
  schemas/                      project state, decisions, rubric, report
packages/exercise-runtime/      deterministic evaluators; no code execution
apps/web/public/notebooks/      versioned Colab-compatible project notebooks
```

Project state should store dataset/variant versions, learner decisions, completed evidence, rubric results, and report fields. It should not store unnecessary personal data or unrestricted code. A migration must preserve prior evidence or explicitly explain invalidation.

## Dataset requirements

- Stable identifier, semantic version, license/provenance, checksum, schema, units, target definition, split policy, known limitations, and intended misconceptions.
- Small deterministic fixture for browser interactions; notebook-accessible full or pedagogically representative data.
- Train/validation/test boundaries fixed or deterministically seeded and never recomputed differently between Python and browser.
- Synthetic data must be labeled synthetic. Real data must include licensing and representativeness caveats.
- All preprocessing statistics fit on training data only.

## Project 1 — House Price Prediction

**Objective:** produce and critique a reproducible regression workflow.

- Explore target/features, missingness, outliers, skew, and suspicious leakage.
- Build a valid split and preprocessing pipeline.
- Compare baseline, Linear Regression, Ridge, and Random Forest.
- Evaluate MAE, RMSE, residual patterns, and important limitations.
- Guided debug: scaling or leakage error.
- Independent variant: changed geography/features with at least one misleading column.
- Artifacts: notebook, model-comparison table, residual evidence, and project report.
- Critical rubric: valid split; training-only preprocessing; correct metric interpretation; honest generalization claim.

## Project 2 — Spam Email Detection

**Objective:** build a text classifier and reason about asymmetric errors.

- Explore labels, imbalance, document length, and representative examples without exposing personal email data.
- Introduce bag-of-words and TF-IDF only to the depth required by the project.
- Train baseline and Logistic Regression classifier.
- Evaluate precision, recall, F1, confusion matrix, and threshold behavior.
- Inspect false positives and negatives and justify a threshold.
- Guided debug: vectorizer fit before split or metric mismatch.
- Independent variant: shifted class balance or different error-cost requirement.
- Artifacts: notebook, threshold analysis, error review, and evaluation report.
- Critical rubric: no vocabulary leakage; metric choice reflects stated costs; no accuracy-only conclusion.

## Project 3 — Customer Churn Prediction

**Objective:** compare classifiers and recommend an action under business costs.

- Explore mixed numerical/categorical data, missingness, imbalance, and leakage-prone post-outcome fields.
- Build a column-aware preprocessing pipeline.
- Compare Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting.
- Evaluate discrimination, confusion outcomes, and false-positive/negative business costs.
- Investigate feature importance with explicit noncausal caveats.
- Recommend a decision threshold and limitations.
- Guided debug: leakage or invalid model comparison.
- Independent variant: changed intervention cost and population mix.
- Artifacts: notebook, model comparison, cost table, threshold recommendation, and report.
- Critical rubric: leakage-free pipeline; comparable validation; cost-aware threshold; no causal overclaim.

## Assessment rubric

Score each dimension 0–3: problem framing, data reasoning, split/preparation, baseline/model choice, evaluation, debugging, reproducibility, and communication. Guided completion requires all stages and no critical failure. Independent mastery requires at least level 2 in every critical dimension and an approved aggregate threshold. Alternate variants enable retry; feedback links to exact prerequisites.

## Acceptance tests

- Direct access and resume/reset isolation for both modes.
- Deterministic fixture outputs agree with notebook/reference generation.
- Invalid decisions produce specific explanations and never crash.
- A learner cannot receive mastery without submitting independent evidence.
- Keyboard, screen-reader, reduced-motion, mobile, and desktop project flows work.
- Exported reports label simulated versus actually executed results accurately.

## Explicit exclusions

Hosted arbitrary execution, notebook hosting, dataset uploads, collaboration, instructor dashboards, automated free-text grading, deployment, and account implementation are not authorized by Task 010.1.
