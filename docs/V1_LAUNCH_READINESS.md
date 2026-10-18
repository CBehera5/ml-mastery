# V1 launch readiness

**Status:** Pre-implementation checklist. Unless marked advisory, every item is a release blocker.

## Curriculum and learning evidence

- [ ] **BLOCKER:** All approved essential lessons are substantive; no launch pathway ends at a placeholder.
- [ ] **BLOCKER:** Every module has prerequisites, measurable objectives, checks, experiment/application, misconceptions, mastery criteria, and remediation.
- [ ] **BLOCKER:** Every algorithm satisfies the universal twelve-part curriculum.
- [ ] **BLOCKER:** Visited, started, completed, assessed, and mastered are separate and correctly awarded.
- [ ] **BLOCKER:** Independent assessments use unfamiliar variants and transparent rubrics.
- [ ] Advanced deferrals are visible and do not contradict product claims.

## Mathematical and computational correctness

- [ ] **BLOCKER:** All numerical interactions use versioned runtimes/evaluators; no UI duplicates formulas.
- [ ] **BLOCKER:** Python reference and browser TypeScript outputs agree within documented tolerances.
- [ ] **BLOCKER:** Invalid, nonfinite, zero-variance, divergence, dimension, and leakage cases are tested.
- [ ] **BLOCKER:** Notebooks reproduce documented outputs from a clean environment.
- [ ] Simulated outputs are labeled and never described as live training.

## Python curriculum and projects

- [ ] **BLOCKER:** Six Python modules contain deterministic exercises and executable notebooks.
- [ ] **BLOCKER:** No arbitrary Python is executed by the platform without approved isolation/security architecture.
- [ ] **BLOCKER:** All three projects work in guided and independent modes.
- [ ] **BLOCKER:** Project datasets have licenses/provenance, schemas, versions, split rules, and limitations.
- [ ] **BLOCKER:** Project reports and notebooks are reproducible and label assumptions/limitations.

## Product quality

- [ ] **BLOCKER:** Critical onboarding, lesson, assessment, project, reset/resume, and report flows pass browser E2E tests.
- [ ] **BLOCKER:** Keyboard-only and screen-reader journeys pass; meaning never relies on color alone.
- [ ] **BLOCKER:** Reduced motion, zoom, mobile, tablet, desktop, and supported browsers pass.
- [ ] **BLOCKER:** Performance budgets are defined and met on a representative mid-range device.
- [ ] **BLOCKER:** Direct routes, refresh, malformed local state, and offline/static asset failures degrade safely.
- [ ] Visual regression coverage exists for critical diagrams or an equivalent documented manual review is complete.

## Security and privacy

- [ ] **BLOCKER:** No development secrets, private datasets, tokens, or source maps containing secrets are exposed.
- [ ] **BLOCKER:** Data collection, retention, consent, and deletion behavior are documented and match implementation.
- [ ] **BLOCKER:** Local progress and reports collect no unnecessary personal information.
- [ ] **BLOCKER:** Dependency/license/security review is complete.
- [ ] No third-party analytics transmission occurs without approved consent and privacy design.

## Test and operational evidence

- [ ] **BLOCKER:** Pytest, TypeScript runtime tests, all frontend tests, fixture-diff check, typecheck, and production build pass from a clean checkout.
- [ ] **BLOCKER:** Dataset and notebook validation are automated or have signed reproducible evidence.
- [ ] **BLOCKER:** Preview access control and direct-route behavior are verified.
- [ ] **BLOCKER:** Backup/recovery or safe reset behavior exists for learner state appropriate to the chosen persistence model.
- [ ] Known limitations and support/escalation procedures are published.

## Commercial honesty and entitlement

- [ ] **BLOCKER:** The advertised curriculum exactly matches shipped substantive content.
- [ ] **BLOCKER:** “Complete,” “mastered,” “trained,” and “project” claims are supported by evidence.
- [ ] **BLOCKER:** $39 pricing, refund/support expectations, access duration, and entitlement behavior are approved and testable.
- [ ] **BLOCKER:** Unfinished features are labeled upcoming and excluded from purchase claims.
- [ ] Marketing screenshots and examples match the released product.

## Controlled beta gate

- [ ] **BLOCKER:** 5–8 representative learners complete onboarding, one math pathway, one algorithm module, and at least one project without developer assistance.
- [ ] **BLOCKER:** Critical comprehension, accessibility, data-loss, and mathematical issues are fixed and retested.
- [ ] Completion time, confusion points, abandonment, and willingness-to-pay findings are reviewed without treating interest as purchase.
- [ ] Founder gives explicit public-launch approval after reviewing residual risks.

## Current readiness finding

V1 is **not launch ready**. The verified mathematical/runtime base, several Math pilots, five Linear Regression labs, local beta flow, and automated unit/build checks are strong foundations. Most approved curriculum, deterministic Python exercises, shared mastery infrastructure, all three projects, browser E2E/accessibility automation, and commercial entitlement decisions remain incomplete. A private preview of existing pilots can be honest; marketing the approved V1 as complete cannot.
