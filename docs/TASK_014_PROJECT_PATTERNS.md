# Project patterns from Task 011.4 for Task 014

This is a record of concrete patterns, not a universal project-engine specification. The applied housing bridge remains module-local.

## Patterns to reuse when the full projects are approved

1. **Versioned dataset fixture.** Package immutable row IDs, explicit split membership, units, feature availability, target meaning and provenance together. Use constructed stress cases honestly; never describe their errors as a representative market estimate. The bridge fixture has 12 original synthetic rows, 8 training and 4 held out. It uses `price = 100 + 60 * area - age + adjustment`; the model never receives `adjustment` or the authoring equation as a feature.
2. **Pure preparation and training adapter.** Keep runtime calls outside React presentation. Fit scaling and gradients on training rows only, then apply the same transform to held-out inputs. Verify separation with a metamorphic test that changes held-out inputs/targets while requiring identical fitted statistics, parameters and training losses.
3. **Bounded local draft.** Validate version, allowed keys, feature mode, numeric ranges, selected row IDs and execution flags before restoring. This bridge has two feature modes, at most two weights, 1–200 updates, a rate in [0.001, 2], at most eight inspected rows and thirteen bounded responses. Invalid drafts reset only their project session; existing learning evidence remains separate.
4. **Explicit learning gates.** Pair each stage objective with an interaction and deterministic interpretation check. Navigation is never evidence. Requiring an update inspection and a run with finite, reduced training MSE prevents a button click from standing in for learning.
5. **Existing evidence contracts.** Record stage objectives and six `project-milestone` records using the existing functions. Keep the existing aggregate curriculum objective ID. First-completion evidence identifies dataset version and configuration; new practice changes invalidate current downstream checks without deleting historical completion. No project action calls the mastery award function.
6. **Equivalent data representations.** Reuse the loss SVG for training state selection, but provide captioned tables and native controls as alternatives. Do not draw a misleading single regression line for a multiple-feature model; the bridge's exploration scatterplot shows observations without a fitted line.
7. **Honest evaluation boundary.** Hide test targets in early exploration and show them after training. Track that outcomes have been exposed: further tuning is educational, requiring fresh data for a final claim. This is a teaching boundary, not secure assessment isolation; the downloadable artifact necessarily contains all rows.
8. **Structured explanation and portable summary.** Check bounded statements about objective, selected features, actual metrics, limitations and appropriateness. Generate a readable report using the evaluated run's exact settings and numbers. Do not pretend to grade arbitrary prose automatically.
9. **Notebook parity as evidence.** Provide a repository-independent standard-Python reference notebook, frozen expected output fixture, actual sequential execution and parity tests against both mathematical runtimes. The reference notebook is not automatically customized; copy a browser run's settings into its configuration cell.

## Decisions intentionally left open

- Full project dataset approval, external-data licensing and provenance maintenance.
- Train/validation/test governance for model selection, including temporal/entity splits for appropriate real datasets. The bridge uses a fixed, explicit teaching split rather than a deployment-ready sampling design.
- Immutable completed-report snapshots and multi-run comparison/history retention. The bridge retains first-completion evidence and one bounded current draft, not a report archive.
- A shared stage engine or schema: extract only after at least another approved project demonstrates the same concrete needs.
- Account synchronization, collaboration, report export beyond Markdown and any hosted execution.
- Rubrics for independent reasoning and project-to-mastery linkage. Guided milestones must not become automatic mastery awards.
- Dataset/exercise migration policy across incompatible versions; unsupported bridge draft versions currently reset safely.
- Browser keyboard, zoom/mobile, download and screen-reader verification. Until exercised in a live supported browser, this remains a release blocker.

Task 014 must preserve the verified mathematical runtimes and versioned curriculum/evidence schemas unless separately authorized changes establish new contracts.
