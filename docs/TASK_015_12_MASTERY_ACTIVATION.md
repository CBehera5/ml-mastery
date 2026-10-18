# Task 015.12 — Controlled mastery activation and closure review

## Current status — activation rolled back; stop for founder review

**Mastery remains disabled.** Candidate activation commit:
`55bac5f524f1cfb552a4ece48699e47bce1a117f`.
All focused activation checks, full regression suites, typecheck, numerical audit and
notebook execution passed. The required production build failed on the verification
copy's symlinked `node_modules` directory. The agent introduced that unsupported
dependency layout while preparing the clean local copy; this is a confirmed setup
failure, not evidence of a mastery-scorer defect or a successful production build.

The rollback guard immediately restored `MASTERY_AVAILABLE=false`. The candidate's
enabled-state tests and browser helper were then restored to the accepted disabled
baseline so the branch remains internally consistent. The candidate code is preserved
in the commit above and the evidence archive. No repair/retry was attempted after the
failed gate, in accordance with the founder's explicit stop condition.

**New independent CI URL: none.** The local build gate failed before the new activation
candidate was pushed or dispatched. Earlier canonical-reference CI is not reused as
proof of activated mastery. No activation browser or native-keyboard pass is claimed.

## Attempted change and preserved contracts

The candidate's only production behavior change was Model Selection's
`MASTERY_AVAILABLE=true`; this has been rolled back to `false`.
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

## Required gate results

| Gate | Actual result on candidate activation source |
| --- | --- |
| Focused activation/UI/API | PASS: 4 files / 68 tests, including 50 activation-specific cases |
| Full frontend | PASS: 97 files / 2,845 tests |
| TypeScript math runtime | PASS: 12 files / 66 tests |
| Full Python | PASS: 2,612 tests |
| Typecheck | PASS |
| Canonical frozen references | PASS: 31 states byte-identical, all locked hashes unchanged |
| Complete KNN rankings | PASS: 972 cases; accepted decision digest and payload hashes match |
| Two fresh notebook kernels | PASS: digest `134e21b507492443d6e5a4c577e6ef4ae9deff697d1d11adb12134490b195e63` |
| Production build | FAIL: Next/Turbopack rejected the symlinked dependency directory |
| Activation browser / persistence / 320px / native keyboard | NOT RUN: stopped after build gate failure |
| New independent GitHub Actions | NOT DISPATCHED: stopped after local gate failure |

Exact build diagnostic:

`Symlink node_modules could not be resolved: the symlink target leaves the filesystem root or its parent directory could not be resolved`

The clean copy was `/private/tmp/task01512-activation-review`, whose `node_modules`
linked to the preceding verified temporary checkout. Tests and TypeScript accepted
that layout, but Next/Turbopack did not. No numerical or application-policy change was
made to conceal the failure. Logs and the failed build output are retained.

## Prepared browser checks — not executed

The candidate production smoke was prepared to use an empty, disposable browser context. It does not
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

Recommendation: **do not activate mastery or formally close Task 015.12 from this
attempt.** Keep the disabled state and stop for founder review. A separately authorized
retry should install exact lockfile dependencies directly inside its clean source copy,
then repeat the build, activated browser/native checks and new complete independent CI.
The successful earlier canonical-reference result remains valid for that earlier
milestone only. No such retry is inferred from this report.
