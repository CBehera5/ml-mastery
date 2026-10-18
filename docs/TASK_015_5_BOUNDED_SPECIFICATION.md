# Task 015.5 — K-Nearest Neighbors bounded specification

17 October 2026 · Founder approved this bounded scope,reference freeze and application implementation. [Completion/evidence](TASK_015_5_COMPLETION.md) records delivery; founder review pending. [Frozen references](TASK_015_5_IMPLEMENTATION_READINESS.md) unchanged. Historical pending-freeze/implementation statements below preserve the original plan, not current delivery status.

## Authority, dependencies and exclusions

Reconciled the [blueprint](SUPERVISED_LEARNING_BLUEPRINT.md), [implementation decisions](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [objective matrix](supervised-lesson-objective-matrix.md), [mastery/evaluator policies](supervised-mastery-and-evaluator-proposal.md), [experiment specification](supervised-visual-experiments.md), [algorithm coverage](supervised-algorithm-coverage.md), [quality register](CURRICULUM_QUALITY_REGISTER.md) and [015.4 completion](TASK_015_4_COMPLETION.md). Founder acceptance of Logistic supersedes older review-pending headers. Task 014 remains Project Learning Engine; 015.5 is already allocated to KN.

Approved prerequisites: EV and LG01–03, with distance/scaling recall. Recall vectors, Euclidean distance, feature units, row alignment, training-only/fold-only preprocessing and sklearn pipelines from existing Math/Python content. Prerequisites guide the journey; they do not transfer mastery or introduce a new route lock.

This module is **KNN classification**. Regression appears only as the approved contrast between class voting and numeric-target averaging; no KNeighborsRegressor course, new regression objectives or notebook workflow. Euclidean distance is the supported core metric; no separately approved Manhattan/cosine metric allocation was found. Other metrics require an explicit amendment, not a silent evaluator extension. SVM is comparison context, not implementation.

## Exact allocation

| Deliverable | Approved scope |
|---|---|
| Lessons | KN01–KN04, four complete lessons |
| Objectives | 16 essential families, four per lesson |
| Practice | 32 instances: A/B for every family |
| Independent | 48 instances: three complete 16-family forms A/B/C |
| Total scored instances | 80; paired atoms do not add family points |
| Critical gates | Four paired O2 families, listed below |
| Experiments | KN-E1 and KN-E2; each at most 64 reviewed combined configurations |
| Notebook | One reproducible KNN classification notebook |
| Mastery | At least 13/16 AND both components of every gate in one confirmed independent attempt |

## Exact objectives and teaching coverage

IDs are lesson ID plus the column identifier. Matrix wording and boundaries are preserved.

| Lesson | O1 | O2 — paired critical | O3 | O4 |
|---|---|---|---|---|
| KN01 — Vote among neighbors | Calculate distances and ordered neighbors | Derive a vote with explicit tie rules and explain why labels are not averaged as regression | Predict a label from k neighbors | Distinguish stored training examples from prediction queries |
| KN02 — Scale defines closeness | Compute scaled two-feature distances | Reject test-fitted scaling and explain metric sensitivity to units | Compare raw/scaled neighbor sets | Diagnose irrelevant high-dimensional features |
| KN03 — Choose k honestly | Compare finite k train/development results | Reject k exceeding fold-training count or selected using final test | Explain bias/variance behavior without monotonic guarantees | Compare uniform versus distance weighting |
| KN04 — Workflow and limits | Repair a bounded sklearn KNN pipeline | Identify imbalance/distance/query-cost failure and explain its mechanism | Compare Logistic/SVM assumptions | Summarize valid unseen-data performance |

Every objective must map to explanation, worked and changed examples, practice A/B, assessment A/B/C, misconception feedback and targeted recall. Each lesson follows problem → visual intuition → prediction/experiment → mathematics → trusted Python → evaluation → comparison. No standalone syntax tutorial or unassessed added objective.

KN01 starts with fictional churn observations and the approved distances 1,2,3 with labels 0,1,1: uniform k=3 votes class 1. Explain distance symbols, squared coordinate differences and square root before syntax; nearest is not necessarily representative. KN02 contrasts currency and age units, then computes training-scaled distances; distinguish missing values from valid zeros and avoid promising every rescaling changes neighbors. KN03 compares noisy/clean queries and development results at k=1/3/5; larger k does not guarantee higher bias or lower error on every finite fixture. KN04 audits a scaler/classifier pipeline, minority errors and inference work; fast fitting is not automatically fast prediction.

Connect directly to churn and Technical Documentation Quality binary classification (Good / Needs Improvement), using fictional numerical features, not production labels. Continuous house-price prediction is a task-type contrast, not a claim this classifier predicts prices. Neighbor vote fractions are not guaranteed calibrated risk, causal explanations or reliable future outcomes.

## Critical gates: decision, reason and recovery

| Gate | Decision/calculation atom | Reason/transfer atom | Failure feedback and changed recall |
|---|---|---|---|
| KN01.O2 | Select correct neighbors/vote under the explicit fixture tie policy | Explain classification voting versus averaging numeric regression targets | Show distance/label/weight table and a changed vote; averaging label codes does not produce a class prediction |
| KN02.O2 | Reject preprocessing fitted with held-out observations | Explain how feature units affect distance and why scaling parameters must come from permitted training rows | Recompute a two-feature distance with training-only parameters and identify forbidden fit IDs |
| KN03.O2 | Reject illegal fold k or final-test-driven selection | Explain smallest fold-training capacity and development/CV selection before untouched-test evaluation | Contrast legal/illegal fold counts and repair a changed selection sequence |
| KN04.O2 | Diagnose the authored imbalance, distance or query-cost failure | Explain the actual mechanism rather than a generic algorithm slogan | Contrast minority-neighborhood errors, noisy dimensions or counted brute-force work; transfer to a changed case |

Either valid wrong atom fails its gate even with 15 other families correct. Do not make O1/O3/O4 secretly critical. Across three forms test all 24 component failures with the other atom and every other family correct; parser rejection is not gate evidence.

## Two bounded experiment plans

**KN-E1 — Vote and flexibility (KN01/03).** Learner predicts a class/reason before revealing; selects authored query positions, k=1/3/5 and approved uniform/distance weighting variants on noisy/clean fictional data. Reveal point plot, ordered row IDs/distances/labels/weights, class totals and prediction; compare changed k/query and explain minority-boundary behavior. All exposed combinations, including tie/duplicate cases, must fit one reviewed set of at most 64 states. No arbitrary drag coordinates, live training or implicit Cartesian-product expansion.

**KN-E2 — Units and limits (KN02/04).** Predict neighbor change, then select raw versus training-scaled features and an authored redundant/irrelevant-dimension case. Reveal before/after coordinates, fit IDs, distances, neighbors, minority outcomes and explicitly labeled brute-force distance-work counts. Include a rejected test-fitted-scaling diagnostic, not a valid fitting option. Count diagnostics in the manifest's reachable state inventory. A constant added coordinate and a duplicated informative coordinate are not interchangeable: demonstrate only the actual reference-supported geometry. Compare finite sampled query predictions to show boundary changes, not an exhaustive boundary proof.

Both labs require a changed configuration and correct bounded transfer explanation for meaningful completion; initially wrong predictions are recoverable. Provide complete numerical tables and explanatory text, not color/hover/spatial-only answers. Use native keyboard controls, visible focus, reduced motion and 320px reflow. Respect existing 64-point scene limits; no unapproved dense decision mesh. Reset/reveal never awards mastery.

### Required reference freeze before application work

Exact datasets, row order, queries, configuration counts, settings, outputs, versions and hashes are **not yet frozen**. Author both manifests within the above bounds and verify every state with independent Euclidean arithmetic and trusted local sklearn. Freeze regeneration commands, source/output hashes and dependency metadata only after successful parity; no reference success is claimed by this document.

The freeze must explicitly resolve: equal-distance neighbor ordering; ties at the kth membership boundary; equal class totals for uniform/weighted votes; zero-distance duplicates with same/conflicting labels; invalid k; class order; weighting normalization; zero-variance scaling; display rounding versus grading tolerance. Odd k does not eliminate all these cases. Do not invent a stable row-ID tie order and claim sklearn guarantees it. Proposed reference configuration is a pinned brute-force backend, immutable training-row order and fixed numeric dtype, with library behavior verified before adoption. If a desired educational tie policy differs from that reference, report the conflict for approval rather than silently changing prediction semantics. Zero-distance weighting must be explicit, not uncontrolled division by zero. Numeric tolerance must not silently create or erase neighbor ties.

Preprocessing fits training rows only; each CV fold refits its own scaler. Check k against every fold-training count; reject rather than silently clip. Keep in-sample self-neighbors distinct from unseen queries and label any training score appropriately. Freeze positive labels per dataset, confusion/undefined-metric conventions by reusing EV definitions, not default numeric replacement of undefined outcomes.

## Mastery, retries and persistence

Use the approved supervised policy unchanged: 12/16 fails, 13/16 passes only with all four gates; no evidence combination across attempts or modules. Practice, experiments, lesson completion and notebooks cannot award mastery. Retain previous same-version mastery after later failed attempts; do not fabricate mastery for noncritical objectives missed in a passing attempt. Keep mastery unavailable until full verification.

Lesson completion requires four correct practice families, meaningful experiment interaction and correct bounded transfer. Two valid practice submissions per variant/review cycle; malformed formats do not consume them. Exhaustion requires worked review, changed recall and explicit new cycle. Independent attempts are unlimited fresh attempts rotating A/B/C, without active correctness disclosure; review and explicit confirmation required. Reloaded review requires reconfirmation. Failed gates receive atom-specific feedback/counterexamples; recommend remediation but do not lock reassessment or patch an old attempt.

Freeze separate KN scope/schema/content/assessment/fixture versions before code. Reuse canonical bounded envelopes, hydration-before-write, immutable attempt IDs, idempotent confirmation, latest 20 summaries, latest full response and retained mastery. No migration/import of Math, Regression, Python, EV, PR, RG or LG evidence. Validate ownership/version/shape on restore; preserve corrupt, oversized, foreign, future or stale original bytes without reinterpretation. Quota/denial/stale-tab failures must retain safe memory state and show truthful non-saved warnings. No cross-device, tamper-proof or distributed-atomicity claim. Semantic grading changes require new versions and separately approved mapping; no automatic migration.

## Evaluator capabilities and safety

Reuse finite choices, typed finite numeric answers and predefined whole repair tuples with immutable authored fixtures. Allowed reasoning: fixed Euclidean calculations, neighbor IDs/order, authored votes/weights, split/fit permissions, finite k comparisons and pipeline repair. No general expression language, arbitrary learner Python, imports, eval/exec, shell, filesystem/network access, uploads or model deserialization. Trusted notebook code runs outside the web evaluator.

Use approved exact semantic IDs/counts and explicitly authored equivalent tuples; numeric default tolerance is abs 1e-9 plus rel 1e-9, unless a versioned exercise declares otherwise. Display rounding is not an answer oracle. Accept typed finite numbers of absolute value at most 1e6; reject NaN/Infinity, Booleans, objects and scorer numeric strings/expressions without coercion. Distinguish unsupported format from valid wrong mathematics. Keep existing payload/fixture bounds: 32 families, two atoms, eight options/slots/accepted tuples; 512B atom, 1.5KiB family, 64KiB submission, 256KiB envelope, depth eight; snippets 25 lines/4KiB, rank-two arrays at most 64 cells, tables at most 32×8. Undefined reference states remain tagged. Safe errors must not echo malicious input or internal traces. Static fixtures cannot certify arbitrary programs, production accuracy or general reasoning outside the finite bank.

## Notebook and reference requirements

One trusted notebook uses small bundled fictional data, no credentials, uploads, downloads or remote datasets. Show manual distances/votes, StandardScaler → KNeighborsClassifier, uniform/distance comparisons, development or fold-only selection and final unseen evaluation with baseline/comparison and limitations. Include explicit schema, units, labels, row/split IDs, seed, dependencies, expected outputs and instructions; no SVM training or capstone implementation.

Reuse the locally verified profile: CPython 3.13.16, NumPy 2.5.4, pandas 3.0.6, Matplotlib 3.11.2, scikit-learn 1.9.1 (existing SciPy 1.18.1). Record the actual isolated environment and notebook tooling. Run twice in fresh kernels with matching normalized outputs and hashes; document deterministic ordering and any normalization. This is a requirement, not new verification evidence. Genuine Colab execution remains unverified independently of local success.

## Implementation acceptance and stop conditions

1. Audit all 16 objectives against content, worked/changed examples, 32 practice and 48 independent instances, misconception feedback and remediation; no missing or duplicate identities.
2. Verify all 80 scored fixtures and every exposed frozen lab state against trusted Python/sklearn and independent simple-mechanism calculations; unchanged hashes and byte-identical regeneration. Explicit tie, duplicate-zero, scaling, neighbor-order, weighting and illegal-k tests are mandatory.
3. Test 12/16 and 13/16 in each form, all 24 valid-wrong critical-component failures, unanswered atoms, confirmation/reload, retries, remediation, equivalent and malformed inputs, no cross-attempt mosaics and previous-mastery retention.
4. Test persistence restoration, duplicate confirmation, corruption, quota/denial, stale tabs and scope/version isolation; preserve earlier modules and learner bytes. No new migrations or mastery thresholds.
5. Run complete frontend/TypeScript and Python regression suites, typecheck and production build. Record actual counts/environment; unresolved original-directory I/O must not be labeled passing based on isolated success alone.
6. Perform live keyboard and 320px checks on lesson/practice/experiment/assessment/restore/navigation states; verify accessible numerical alternatives, focus and meaningful changed outcomes. Record genuine screen-reader and browser-zoom checks as open unless actually performed.
7. Execute the notebook in two fresh local kernels; record output/dependency/source evidence. Genuine Colab remains a separate open obligation.
8. Update implementation status, objective/gate coverage, quality register, notebook evidence, environment/accessibility risks and completion report. No deployment, external learner testing, production data collection or later algorithm work.

## Approval package and remaining decisions

No contradiction was found in approved lesson/count/gate/threshold allocations. Approve this bounded specification and authorize **experiment authoring/reference freeze next**, before application implementation. Exact tie/zero-distance/reference settings and fixture state inventories are deliberately not invented here; approve their verified manifests separately. If an alternative distance metric, KNN regression workflow, dense boundary mesh or sklearn-divergent tie policy is desired, that is a scope/product decision requiring explicit amendment. None is needed to deliver the current classification allocation.

Current checkpoint: documentation only; no reference calculations, notebook execution, application changes or new QA passes claimed. Original-directory I/O reliability, genuine screen-reader, genuine browser zoom and genuine Colab remain OPEN. Stop for founder review; no Task 015.5 implementation authorized by this scope-verification request.
