# Task 015.12 — Controlled mastery activation and closure review

## Current status

Founder-authorized Model Selection mastery activation is prepared and all 68 focused
activation/UI/API checks pass locally. Complete regressions and new independent CI
are required before claiming verified activation or recommending formal closure.
Any failed activation gate requires restoring `MASTERY_AVAILABLE=false` and stopping.

## Approved change and preserved contracts

The only production behavior change is Model Selection's `MASTERY_AVAILABLE=true`.
The scorer, evaluator, authored objectives, six paired O2 gates, 20/24 threshold,
one confirmed independent attempt requirement, storage keys/schema/version identities,
restoration rules and earlier learner evidence are unchanged. No practice, lab or
notebook completion independently awards mastery. No other mastery module is changed.
The canonical macOS ARM64 numerical policy, MS-E1/MS-E2 V3 files and freeze lock are
unchanged from the accepted reference verification.

## Activation gate evidence

The focused suite runs four files and 68 tests, including 50 activation-specific cases:

- For forms A, B and C, confirmed 19/24 fails and 20/24 passes with all six gates correct.
- All 36 form/gate/component combinations fail mastery at an otherwise passing 23/24.
- Active-phase submission and review without confirmation are rejected. Submitted
  attempts are idempotent; restored review drafts require fresh review/confirmation.
- Retries rotate A→B→C→A with new identities and blank answers. Complementary failed
  23/24 attempts cover all objectives in aggregate but do not award mastery.
- A later failed attempt retains earlier earned mastery; serialization and ModuleStore
  restoration preserve it. Other-module storage is not interpreted or written.
- Scope, content, policy, assessment and fixture version mismatches are isolated;
  unsupported stored bytes remain unwritten.
- Exhausted practice requires targeted review and transfer recall before reopening.
- Complete practice in both variants, both labs and every lesson transfer still does
  not substitute for independent evidence: an unanswered confirmed assessment scores 0.
- UI tests verify enabled assessment, confirmation, failed-result remediation links,
  restoration and retry without awarding blank-attempt mastery.

## Browser verification requirements

The updated production smoke uses an empty, disposable browser context. It does not
inject answers or mastery into browser storage. Test-only authored answer fixtures are
used by the verifier to select visible assessment controls through the UI. The test
checks practice/lab/notebook availability never synthesize mastery, blank form A fails,
form B earns exactly 20/24 only after confirmation, reload restores it, and blank form C
does not erase the earned record. It also retains navigation, experiment replay,
fixture V3, sealed-data isolation, persistence, Tab focus and 320px checks.

Native popup keyboard selection remains a headed-browser check because the accepted
macOS headless process does not commit native popup key input. Fresh activation-source
headed verification is required where supported; prior-source evidence is not reused
as proof of activated state.

## Evidence preservation and release boundaries

Only isolated test states are created by verification. No existing learner/browser
profile or real mastery record is edited, imported, migrated or seeded. Persistence
and evaluator source files remain byte-identical. No numerical artifact is regenerated
or widened. No deployment, external learner testing, landing page, Project Studio,
capstone or unrelated mastery/curriculum work is included.

Genuine screen-reader, browser zoom, Google Colab and original-directory I/O reliability
remain platform-release obligations. Clean local source verification is used to avoid
the already-documented original-directory I/O stalls; that does not close the I/O issue.

Recommendation pending new complete CI: do not claim verified activation or formal
Task 015.12 closure from the earlier canonical-reference CI. Record the new activation
commit, complete run results and native/browser evidence, then stop for founder review.
