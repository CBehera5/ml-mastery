# Supervised mastery and bounded evaluator proposal

**17 October2026 EV disposition:** founder approved the documented EV20/24 plus six paired gates,single-attempt,retry/remediation/confirmation and separate versioned-scope rules. Task015.1 Phase B implements and verifies EV only; [evidence](TASK_015_1_PHASE_B_COMPLETION.md). Other new modules' activation remains subject to their separate authorizations. No Math/Regression/Python policy is changed. Historical proposal wording below remains applicable as planning for unimplemented modules.

16 October 2026 · new-module policy proposal; existing policies are unchanged.

## Scoring and critical coverage

Four families per lesson; all essential. Two practice variants and three complete independent forms per family. Every lesson's **O2** is exactly one paired critical family: calculation/decision AND reason/transfer. Either atom wrong makes the family wrong and independently fails that gate. Noncritical families may use one or two atoms; any required atom wrong makes the family wrong. No partial family points. Form A/B/C assess the same objective with different numbers, data contexts and distractor order, not copied answer sequences.

Module mastery = `correctFamilies >= ceil(0.8 × familyCount)` **AND every critical family fully correct**, in one confirmed independent attempt. No rounding percentages downward, evidence mosaics, practice credit, notebook credit, completion credit or cross-module transfer. Paired atoms do not inflate the denominator. Existing Regression's assessment is not converted to this new layout.

| Module | Families / gates | Required | Aggregate failure / success boundary with all gates correct | Critical-component failure scenarios (gates×2×3 forms) |
|---|---|---:|---|---:|
| EV |24/6|20|19 fails;20 passes|36|
| PR |16/4|13|12 fails;13 passes|24|
| RG |24/6|20|19 fails;20 passes|36|
| LG |24/6|20|19 fails;20 passes|36|
| KN |16/4|13|12 fails;13 passes|24|
| NB |16/4|13|12 fails;13 passes|24|
| DT |24/6|20|19 fails;20 passes|36|
| RF |20/5|16|15 fails;16 passes|30|
| GB |24/6|20|19 fails;20 passes|36|
| SV |20/5|16|15 fails;16 passes|30|
| NN |20/5|16|15 fails;16 passes|30|
| MS |24/6|20|19 fails;20 passes|36|
| Total |252/63|Per module|No track aggregate|**378**|

For all378 critical-component scenarios, use a structurally valid **wrong** atom with the other atom and all other families correct; a parser rejection is not evidence of a critical reasoning gate. Also test each aggregate boundary in each form, unanswered critical/noncritical atoms, malformed attempts, no cross-attempt combination and prior-mastery retention after a later failure. Exact gate descriptions and remediation are the [63 O2 rows](supervised-lesson-objective-matrix.md); leakage/evaluation/fit protections exist in every algorithm workflow, not only EV/MS.

## Completion, retries and feedback

- Lesson completion: all four practice families correct across allowed practice cycles, a meaningful experiment cycle and one correct bounded transfer explanation. Started/visited/completed/mastered stay distinct.
- Practice: two valid submissions per variant/review cycle. Invalid representation does not consume a graded attempt. After exhaustion, show objective-specific worked feedback and a changed recall check; learner explicitly starts a new cycle after review. Never erase old evidence to simulate a first attempt.
- Independent: unlimited newly identified attempts, rotate three forms with visible version; no arbitrary cooldown. No per-question correctness or accepted-answer reveal while active. Show answer review, explicit confirmation and final submission. Reloaded review returns to active/reconfirmation, not silent submission.
- Failed critical atom: name the exact decision/reason error, show a contrasting worked case and recommend targeted recall before reassessment. Independent access is not locked behind practice/remediation. Reassessment is a **complete fresh independent form**, not patching one failed gate into an old passing total. Previously earned same-version mastery remains visible after later failed attempts.
- No persistent claim that finite questions eliminate memorization. Rotate contexts and options, use both reasoning atoms and unfamiliar transfer, and record finite-bank limitations for Task017. Unlimited retries are formative, not proctored certification.

## Evaluator allowlist and safe representations

Reuse existing finite-answer validation/scoring primitives where suitable. The current Python scorer has a six-module policy registry; it is **not** an existing universal algorithm registry. Propose a separate versioned supervised policy/catalog adapter with pure functions and explicit approved keys. No modification of Python/Math/Regression scoring tables, evidence interpretation or runtimes.

| Allowed operation / representation | Acceptance | Reject / limitations |
|---|---|---|
| Finite choices |Exact authored semantic option IDs; bounded IDs; order independent of correctness|Unknown/extra IDs, free-text justifications, arbitrary code|
| Finite numeric answers |Typed finite numbers with absolute value≤1e6; decimal entry adapter; exact integers/counts where required; default `abs(a−b) <= 1e−9 + 1e−9*abs(expected)` unless explicitly versioned exercise tolerance/rounding|NaN/Infinity, Booleans, objects, numeric strings at the scoring contract, expression strings such as `1/2`, code, arbitrary coercion; unsupported representation distinguished from valid wrong value|
| Predefined repair slots |Finite tokens and whole authored accepted tuples, each prevalidated; equivalent correct tuples get equal credit|No parser/interpreter; no mixing individually valid pieces into an unapproved tuple; whitespace only normalized where specified|
| Mechanism arithmetic |Versioned scalar/vector dot products, supplied probabilities/distances/counts, SSE/Gini/norms/losses, fixed gradient steps; only within authored operations and input domains|No general algebra/expression evaluator, user-defined functions, dynamic derivatives or arbitrary loops|
| Training/evaluation reasoning |Fixture IDs for row/split membership, fit/predict/transform permissions, threshold/candidate comparisons and fixed configuration repairs|No claim to validate unrestricted learner programs or infer causal validity from a selected answer|
| Model results |Immutable reference-trained outputs, explicitly labeled replay; numerical/manual claims checked independently|No browser/backend training on learner code; no invented “live fit” or hidden unsupported config|

Bound inherited primitives: ≤32 families/attempt; ≤2 atoms/family; ≤8 repair slots and ≤8 accepted **whole** tuples; ≤8 options; answer atom≤512B, family≤1.5KiB, submission≤64KiB, envelope≤256KiB, depth≤8. Authored snippets≤25 lines/4KiB; arrays rank≤2, dimensions≤32, total≤64 cells; tables≤32×8 with fixture strings≤120 characters; ≤64 finite lab configurations. Large trained-model/plot traces belong to separately validated immutable assets, not learner answer/envelope payloads. Any new scene limit requires explicit approval, not relaxing the answer codec.

Reject unknown operation/version, unsafe strings/keys, oversize/deep input and unsupported shapes before scoring, with bounded nontechnical messages (“Choose one listed repair”; “Enter a finite number, not an expression”). Do not echo raw malicious input or internal stack traces. A structurally valid wrong answer gets conceptual feedback after allowed grading; an unsupported format gets format guidance without claiming the mathematics was wrong. Blank answers become an explicit unanswered-wrong sentinel only after learner review/confirmation; missing identities or malformed structure reject submission atomically.

**Prohibited:** learner Python execution, eval/exec, imports, shell, filesystem/network operations, upload, arbitrary callable/string parsing, model deserialization and hosted execution. Notebook code is trusted author content run outside the web evaluator. No unrestricted free-text grader is proposed.

Normalize negative zero unless the objective explicitly tests it. Missing/incompatible/error are tagged states, never silently numeric zero. Numeric input UI may parse its strictly bounded decimal field into a typed number, but the scoring contract never coerces a string. Award new independent objective mastery only for correct families in a passing module attempt; a failed attempt awards no new mastery. A passing attempt may leave a missed noncritical objective unmastered. Preserve these gaps rather than fabricate100% completion.

## Reference correctness

Generate trusted Python/sklearn traces offline, version dataset/parameters/library profile/seeds/fit IDs/checksums, and parity-check every scored/experiment/worked instance. All1,260 scored instances and all reachable experiment configurations require reference evidence, not just one example per family. Independent oracle arithmetic must cover simple mechanisms separately from exported estimator results; replaying the same incorrect JSON is not a correctness test.

Pin class ordering, tie handling, threshold equality, loss normalizations, initial predictions, feature ordering, missingness policy, solver, convergence tolerances and random seeds. Exact IDs/shapes/counts are exact; floating results use declared tolerances. Degenerate/undefined metrics must be explicit: precision/recall zero denominators, constant-target R², absent-fold classes, k too large, no OOB vote and convergence warnings. Do not silently substitute a valid-looking zero or pass a nonconverged fit as proven optimal.

Training-only preprocessing and **separate fold-only fitting** are distinct tested permissions. Test target-derived features, repeated entities/time leakage, test-selected thresholds, globally selected features/vocabulary, test-based stopping and invalid comparison rows. Document resampling/class-weight/threshold/calibration boundaries independently. [Official leakage guidance](https://scikit-learn.org/stable/common_pitfalls.html), [cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html).

## Evidence and version isolation

Propose one scope per new module, e.g. `ml-math-lab:supervised:ev:v1`; exact schema/content/assessment IDs frozen before implementation. New keys read/write only their own canonical envelopes. No automatic import of Math, Python, X-Ray or Regression evidence; no migrations here. Prior evidence is prerequisite context, not an equivalent answer.

Hydrate/validate before write; maintain latest20 compact attempt summaries and latest full response within the envelope bound. One canonical commit per confirmation with immutable attempt ID and idempotent confirmation. Validate scope/schema/content/assessment/fixture ownership on restore. Reject corrupt, oversize, foreign, unsupported future/stale records without deletion or reinterpretation. Quota/denial/stale-tab failure keeps safe in-memory state and displays a truthful non-saved warning; preserve original bytes. Do not claim distributed atomic CAS or cross-device durability from localStorage.

Semantic objective/grading changes require a new assessment/content version and an explicit founder-approved mapping or archive/reset choice; never silently regrade old mastery. Original records stay untouched. No new migration is proposed for this implementation plan. Test reloads, retry drafts, review reconfirmation, duplicate submit, quota/corruption/version isolation and stale tabs. Client records are editable and origin-local: no tamper-proof credential, authentication or account sync claim.
