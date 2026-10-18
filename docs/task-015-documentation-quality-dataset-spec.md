# Documentation Quality Classification — dataset and label specification

**17 October2026 founder disposition:** binary Good/Needs Improvement and this design baseline are accepted. No production collection or labeling is authorized. Actual rubric clarity, human agreement procedure/results, provenance/rights, label consistency, balance, leakage and partition readiness must be verified before a later production-data authorization. No such evidence is claimed by EV01's fictional manifests.

16 October2026 · proposed protocol, **no corpus collected or annotated**. Binary target and replacement of Spam are founder-approved; operational criteria below await review. No capstone implementation or external learner testing.

## Target, scope and annotation unit

Predict **Good** versus **Needs Improvement** for a specific submitted technical-document version at a declared prediction time, intended audience and task. Recommend an initial English developer how-to/API-guide domain with a supplied task/reference pack. “Good” means adequate for that stated task/audience, not universally excellent prose or factual truth beyond the available reference. Positive class for metrics is **Needs Improvement**; freeze this ID/convention in schema, notebook, confusion labels and threshold policy.

Unit: one immutable document version plus permitted pre-submission metadata; retain document-family/source/template/version lineage in governance metadata. Group related versions/templates before splitting. Unknown/missing evidence or out-of-domain documents are **quarantined/not scorable**, not a hidden third label or automatic Needs Improvement. Abstention/referral is a workflow state, not an unapproved target class.

Proposed stable encoding: Good=0, Needs Improvement=1; preserve readable labels everywhere and assert class ordering before selecting a probability column. Encoding choice is part of the proposed protocol, not an inferred quality score or ordinal distance.

## Annotation rubric and exact label rule — proposed

Two independent qualified human reviewers read document + stated user task/audience + trusted reference pack, blind to model predictions and each other's labels. They record evidence spans, issue severity and four dimensions: correctness, task completeness, actionable structure/navigation, clarity/unambiguity. Score each dimension0 (blocking),1 (material issue),2 (adequate); this ordinal rubric is annotation support, **not a numerical regression target**.

- **Good:** all four dimensions2; no material/blocking issue. Minor stylistic preference that does not impair the task is recorded as a minor note but does not lower a dimension.
- **Needs Improvement:** at least one dimension0/1, supported by a concrete task-impacting error/omission/ambiguity or navigation failure. Examples: wrong argument name contradicted by the reference; a required prerequisite omitted; steps that cannot be followed; contradictory instruction. Length, passive voice, formatting taste or author identity alone never determine the label.
- **Quarantine:** factual/task adequacy cannot be checked, reference is missing/conflicted, unsupported domain/language, secrets/PII, unclear intended task or unresolved reviewer dispute. Resolve evidence or exclude; do not force a binary judgment to inflate sample size.

Provide an annotation manual with positive/negative boundary examples, issue severity anchors, “brief but sufficient” and “long but wrong” counterexamples. Reviewers must justify the user impact rather than paraphrase a style score. No assumptions that an LLM score, readability formula or existing popularity metric is ground truth. LLM-generated teaching documents, if used, require provenance tagging and the same human review; no unsupervised LLM labels. Model/LLM suggestions may not be shown to initial annotators.

## Label consistency and governance

Recommended author-owned calibration pilot:30 documents across templates, both expected labels and edge cases, independently double-reviewed; not a claim those labels exist. Resolve disagreements through a third human adjudicator with evidence. Keep original labels, rubric/manual version, reviewer pseudonyms, adjudication and exclusion reasons; hide all of these from model features.

Before corpus release, double-review every retained document. Report **pre-adjudication** agreement, per-class agreement, confusion and Cohen's kappa, plus prevalence and denominators. Propose≥85% raw agreement and kappa≥0.60 on a representative≥100-unit audit as minimum readiness signals, not proof of label validity. Undefined kappa, rare classes or insufficient independent groups block the claim, not trigger a default pass. If thresholds fail, revise guidelines, recalibrate and relabel affected data under a new version. Do not compute agreement only after adjudication, cherry-pick easy examples or call these unapproved numbers established standards.

Full corpus size is **not fixed by algorithm lesson counts**. Require a pre-release feasibility/power-and-coverage review with enough independent groups and both labels in each evaluation partition/fold to support the intended error claims. A30-row synthetic notebook can demonstrate arithmetic but cannot satisfy this release requirement. If the100-unit audit or reliable class/group coverage is infeasible, reduce claims or defer capstone release; do not duplicate rows or count versions as independent sample size.

## Provenance, rights and reproducibility

Prefer original author-owned technical examples with reproducible reference packs; any third-party documents need an explicit compatible license and attribution/redistribution review. No scraping, external collection, upload or source purchase is authorized here. Publicly viewable does not itself mean redistributable. Keep source URL/owner, license/version, collection permission, language/domain/task, source/version/template/family IDs, document checksum, creation/prediction/reference dates and permitted transformations in the manifest. Record synthetic/LLM-assisted origin separately.

Strip secrets/PII; never include real customer support credentials or author-identifying features. Archive immutable dataset/annotation/manual/reference/split versions and checksums. Bundle small safe notebook subsets locally/in-notebook without remote downloads or credentials; full project distribution needs rights approval. Keep licenses/provenance accessible in exports. Test boundary documents must not appear in guided teaching examples.

## Balance, leakage and feature permissions

Inspect label counts overall **and by source/template/domain/time**, class prevalence and exclusions. Seek coverage of both labels without defining equal50/50 as “natural.” If author curation balances classes for teaching, disclose sampling and do not claim deployment prevalence or calibrated real-world precision. Keep a prevalence-shift comparison fixture; do not rebalance final test to make a result look better. Training class weights/optional resampling and threshold choice belong within training/development folds only.

Never use annotation scores/comments, reviewer/adjudicator IDs, label-bearing filenames/folders, post-review edits, future acceptance outcomes, issue-resolution flags or text derived from final labels as features. Freeze the document at prediction time; corrected versions cannot appear in training while the original is held out. Group source/document lineage and shared templates; review near-duplicates before split. Exact and normalized-text hashes are necessary checks but not sufficient semantic duplicate detection; manual template/family review remains required.

Recommend a group-disjoint70/15/15 train/development/test **target**, assigned by whole source/template/document groups with a seeded, versioned manifest. If group/class constraints cannot satisfy target proportions, report actual counts and choose an audited feasible allocation before modeling, not split documents across boundaries. For future-version use, add a chronological/group-aware evaluation protocol; do not promise both protocols estimate the same deployment question. Cross-validation uses only training/development data, group-aware folds and fold-local fit. TF-IDF/vocabulary, imputers/scalers, feature selection, calibration and any sampling never learn from final test. Small count-feature lessons do not authorize a new full NLP module.

## Baselines, evaluation and intended use

Required comparison candidates: DummyClassifier, Logistic Regression and an appropriate tree/forest classifier. Multinomial NB is a useful optional baseline on nonnegative training-only count features; SVM/Boosting/MLP are optional justified comparisons, not mandatory performance winners. Numerical feature examples can reuse NumPy/pandas; text expansion is a later bounded project bridge.

Primary evaluation: recall/precision/F1 for **Needs Improvement**, full confusion counts/denominators, balanced accuracy and baseline comparison. Choose operational costs/threshold on development only; missed material defects and unnecessary review have different costs. Report average precision when ranked scores exist, with its exact definition; probability log loss/Brier/calibration only for valid probabilities. Do not call SVM margins probabilities. Report subgroup errors by domain/template/length, pre-adjudication uncertainty and examples of false Good versus false Needs Improvement. No universal metric/target score is claimed before data and cost review.

Freeze feature set/pipeline/candidates/threshold before one final test. Report test failures honestly; do not tune on them. Bootstrap/interval methods, if used, resample independent groups with a declared procedure, not correlated document rows. Evaluation speaks only to represented task/domain/groups, not universal documentation expertise. No employee/author ranking or automated publication blocking; human editorial judgment and abstention for unsupported cases remain necessary.

## Dataset acceptance gate (later, before Task016 release)

Approved rights/provenance/manual and target; complete human-review/adjudication audit; consistency/coverage criteria passed or explicitly revised by founder; group/time/duplicate/leakage audit; frozen balanced-count/split/fit manifests; reproducible safe bundled data; baseline/error analysis with honest limitations; no credentials/uploads; governance approval for source retention. None is marked passed by this specification. Actual dataset sourcing/labeling effort and reviewer availability are separate from Task015 algorithm delivery estimates.
