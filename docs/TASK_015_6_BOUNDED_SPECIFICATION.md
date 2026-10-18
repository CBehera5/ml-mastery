# Task 015.6 — Naive Bayes bounded specification

17 October 2026 · Founder approved this bounded scope,reference freeze and application implementation. [Completion/verification](TASK_015_6_COMPLETION.md) records delivery;founder review pending. [Frozen references](TASK_015_6_IMPLEMENTATION_READINESS.md) unchanged. Historical pending-freeze/implementation statements below preserve the plan,not current delivery status.

## 1. Authority and dependencies

Reconciled the [Supervised Learning Blueprint](SUPERVISED_LEARNING_BLUEPRINT.md), [implementation decision package](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [objective matrix](supervised-lesson-objective-matrix.md), [mastery/evaluator policies](supervised-mastery-and-evaluator-proposal.md), [experiment specification](supervised-visual-experiments.md), [algorithm coverage](supervised-algorithm-coverage.md), [quality register](CURRICULUM_QUALITY_REGISTER.md) and [accepted KNN completion](TASK_015_5_COMPLETION.md). Task015.6 is already assigned to NB01–04; Task014 remains Project Learning Engine. Older KNN review-pending headers are superseded by founder acceptance.

Approved prerequisites are EV,LG01–03 and Probability conditional/Bayes recall. KNN precedes NB in delivery order but is not an additional hard mastery prerequisite. Recall Probability's likelihood/Bayes examples, NumPy shapes/log arithmetic, pandas alignment, Visualization's probability/evaluation cautions and Data Preparation's training-only/fold-only fitting. Recommend contextual refreshers, not repeated courses, route locks or evidence imports.

## 2. Exact approved allocation

| Deliverable | Approved requirement |
|---|---|
| Lessons | Four: NB01–NB04 in matrix order |
| Essential objective families |16; four per lesson |
| Practice |32 instances: A/B per family |
| Independent assessment |48 instances: three complete16-family forms A/B/C |
| Total scored instances |80; paired atoms do not inflate the denominator |
| Critical gates |Four paired O2 families: NB01.O2,NB02.O2,NB03.O2,NB04.O2 |
| Experiments |Two: NB-E1 and NB-E2; each at most64 reviewed combined configurations |
| Notebook |One self-contained reproducible Naive Bayes notebook |
| Mastery |At least13/16 AND both atoms of all four gates in one confirmed independent attempt |

Scope includes separate **MultinomialNB and GaussianNB** mechanisms, as explicitly allocated. No BernoulliNB,ComplementNB,CategoricalNB,new text-vectorizer course,calibration algorithm,production dataset collection or other algorithm implementation. Gaussian and count representations are not interchangeable model modes on arbitrary inputs.

## 3. Exact lesson/objective mapping

IDs are lesson plus column identifier. Wording and critical allocation follow the approved objective matrix.

| Lesson | O1 | O2 — paired critical | O3 | O4 |
|---|---|---|---|---|
| NB01 — Combine class evidence |Compute normalized posterior from supplied likelihoods|Explain conditional independence given class, not independence of all features|Distinguish prior, likelihood and posterior|Use log-score addition to avoid tiny products|
| NB02 — Counts and smoothing |Calculate smoothed word likelihood|Reject negative count inputs or held-out vocabulary fitting with a reason|Predict effect of a zero-count term|Compare class prior and count normalization|
| NB03 — Continuous likelihoods |Calculate/compare supplied Gaussian likelihoods|Choose Gaussian versus Multinomial assumptions for a feature representation|Diagnose correlated/repeated evidence and overconfidence|Interpret variance smoothing without promising calibration|
| NB04 — Evaluate probabilistic shortcuts |Trace a training-only NB workflow|Reject accuracy-only/calibration/causal conclusions unsupported by evaluation|Compare Logistic/NB under the same split/costs|Explain false-positive/negative examples and distribution shift|

Every objective must have motivation/definition, worked and changed cases, mathematical symbols, meaningful guided practice, Python application, ML comparison, misconception feedback and targeted recall. Map each to practice A/B and independent A/B/C; assess the whole objective, not only an API name. Every lesson follows problem → visual intuition → experiment → mathematics → Python → evaluation → comparison.

### Lesson depth and practical progression

- **NB01:** Fictional Technical Documentation Quality classification,0=Good,1=Needs Improvement. Define a prediction-time feature and human-reviewed target without collecting production data. Prior is belief before this evidence; likelihood is evidence conditional on a class; posterior conditions the class on evidence. Approved seed .6×.5=.30 and .4×.25=.10 normalizes to .75/.25. Explain proportional scores and their sum, then log-score addition and normalization. Separate conditioning from intervention: a predictive word is not a cause of quality. Conditional independence is given the class, not unconditional independence or a fact proven by training accuracy.
- **NB02:** Small bundled nonnegative word-count tables and explicit fixed training vocabulary. Approved seed class token counts[2,0],alpha1 gives[3/4,1/4]. Distinguish number of documents for a class prior from token totals for a word likelihood. An unseen count is not impossible language. Predict the effect of an absent class-token term before smoothing; compare changed counts/alpha without fitting a vocabulary on held-out documents. Multinomial token likelihoods use repeated token contributions; do not claim fixed-total count-vector coordinates are unconditionally independent.
- **NB03:** A separate fictional continuous-signal representation uses Gaussian class-conditional densities. Approved seed densities.5/.25 and priors.6/.4 gives normalized .75/.25. A density is not a probability mass at an exact real value and can exceed1. Explain mean,variance and variance smoothing. Duplicate/correlated signals can double-count support and make model confidence less reliable; neither every duplicate nor every NB application must become more confident or wrong. Compare assumptions before choosing the model, not from the estimator name alone.
- **NB04:** Trace permitted training/fold vocabulary and model fit IDs, then saved-state inference on aligned unseen rows. Inspect precision,recall,log loss and probability-error evidence, not accuracy alone. Equal decisions can conceal different probability quality. Compare Logistic and NB on identical splits,target windows and costs, recalling LG rather than implementing it again. Discuss false positives/negatives,prevalence,shift and tiny-sample uncertainty; a curve or score does not prove calibration or causality.

These mechanisms support churn and documentation classification. Continuous house-price prediction is a target-type contrast, not a claim NB solves regression. Documentation labels remain fictional until separately authorized human annotation/provenance procedures are satisfied; no LLM score is assumed ground truth.

## 4. Critical decisions, failure and remediation

| Gate | Decision component | Required mechanism/transfer component | Failure feedback and changed recall |
|---|---|---|---|
| NB01.O2 |Identify the correct class-conditional factorization or reject an unconditional-independence claim|Explain that independence is assumed conditional on the class and may fail with redundant evidence|Contrast associated features with class-conditioned evidence; factor a changed supplied likelihood case without causal claims|
| NB02.O2 |Reject negative count representation or held-out/global vocabulary fitting|Explain nonnegative count meaning and training/fold-only vocabulary provenance in the authored case|Repair a changed invalid count/vocabulary workflow; recall smoothed count normalization separately|
| NB03.O2 |Choose Gaussian versus Multinomial assumptions for the supplied representation|Explain continuous-density versus nonnegative-token-count likelihood requirements, not simply datatype or model name|Contrast signed continuous measurements with counts; an integer-valued measurement is not automatically a word count|
| NB04.O2 |Reject unsupported accuracy-only,calibration or causal conclusions|Identify the missing evaluation evidence and explain why class accuracy/association cannot establish probability reliability or causal effects|Compare equal-decision/different-confidence examples and a changed unseen-data/shift claim|

Either atom wrong independently fails its gate, even at15/16 overall. Test **24 valid-wrong critical-component failures**: four gates×two atoms×three forms, other atom and all other families correct. Parser rejection is not evidence of a critical reasoning gate.

**Do not silently change the gate mapping:** posterior calculation NB01.O1,smoothed likelihood NB02.O1 and zero-count effects NB02.O3 are essential but noncritical. NB02.O2 protects count validity and vocabulary provenance; NB03.O2 protects representation/model assumptions. The user's priorities are covered through these objectives and approved gates, not a new hidden smoothing or arithmetic gate. Making those arithmetic families mandatory despite an otherwise passing score would require founder-approved objective/policy amendment; none is proposed.

## 5. Bounded experiment/fixture plan

### NB-E1 — Priors, token evidence and smoothing (NB01/02)

Select only authored prior,count-evidence and alpha configurations; predict class/posterior direction or the explicit degenerate outcome before reveal. Reveal prior×likelihood contributions,normalizer,posterior/log scores,training document counts,token totals and vocabulary IDs. Change a control and explain the changed result. Include an absent token and smoothing counterexample; distinguish an unseen training token from a supplied vocabulary word with class count0. A vocabulary learned from held-out text is a rejection diagnostic, not an accepted model fit.

Two clearly labeled reference tracks: supplied-likelihood Bayes arithmetic and trusted MultinomialNB fitted on bundled training counts. Do not claim arbitrary authored scores came from a fitted estimator. Priors,likelihoods and denominators must be consistent within each track. Pin feature/token ordering,class ordering,counts,fit IDs and alpha conventions in the manifest.

### NB-E2 — Representation, repeated evidence and confidence (NB03/04)

Choose finite Gaussian/count representation examples and original versus correlated/repeated evidence cases. Predict the supported classification/confidence interpretation,then inspect supplied density curves/tables,per-feature/log contributions,posterior and held-out probability-error comparisons. GaussianNB and MultinomialNB have separate coherent datasets/assumptions; incompatible representation choices reject rather than silently convert. Explain why confidence and calibration differ,using comparable evaluation rows and a counterexample,not a fabricated assertion that duplicated evidence always worsens error.

Both manifests must freeze exact fictional data,queries/observations,labels,training/development/fold IDs,legal control tuples,expected numerical/tagged outcomes,correct explanations/counterexamples,version IDs and hashes. **Exact configuration counts,datasets and outputs are not yet authored or verified.** At most64 combined reachable states per experiment,including diagnostics; no automatic Cartesian expansion,arbitrary feature input,free text,uploads or online fitting. Keep plots/scenes and array/table assets within existing resource bounds; no new dense grid or asset-size extension.

Prediction-before-reveal requires a bounded prediction and reason. Wrong initial predictions can recover through changed-state explanation/transfer. Reset or replay does not grant mastery. Provide native keyboard controls,visible focus,readable headings,numerical contribution/posterior tables and full textual alternatives; curves cannot depend on hover,color or spatial interpretation alone. Respect reduced motion and320px reflow.

## 6. Numerical conventions to author and reference-freeze

Before application work,document and verify all exposed states against the approved local dependency profile and independent manual calculations. Pin estimator arguments explicitly after inspecting the installed reference API; do not assume library defaults or imply this review has run parity.

1. Define class scores `s_c=prior_c×product_j likelihood_jc` for supplied evidence and posterior `s_c/sum(s)` when positive finite normalization is defined. Priors sum1 and lie in[0,1]. Token likelihoods are masses; Gaussian likelihoods are densities,not restricted to[0,1]. Reject malformed domains/nonfinite inputs explicitly.
2. Use log-score addition and stable log-sum-exp for small products; zero score is log negative infinity as a tagged state,not an accepted nonfinite numeric answer. All-class zero evidence has undefined posterior,not a fabricated uniform distribution. Exact zero,underflow and a small positive value are different. Freeze positive-class order and class-score tie convention after trusted verification; no decision-threshold extension is authorized.
3. For Multinomial counts,freeze scalar alpha and vocabulary size V: `(class_token_count+alpha)/(class_token_total+alpha*V)`. Define prior estimation versus explicit supplied priors separately. State alpha0/no-smoothing diagnostic behavior,empty documents,zero-total classes,all-zero evidence and out-of-vocabulary handling; no hidden automatic alpha floor. Inspect and disclose any library smoothing/default behavior rather than replace mathematical definitions silently. No arbitrary tokenizer/vocabulary learning from learner text.
4. For Gaussian reference,density `exp(−(x−mu)^2/(2*variance))/sqrt(2*pi*variance)` needs positive variance; separate supplied valid variances from estimator variance smoothing. Freeze variance estimator,training-only means/variances,epsilon rule and zero-variance rejection/smoothing semantics after local reference checks. Negative continuous values may be valid Gaussian inputs; they are invalid Multinomial counts,not universally invalid features.
5. Correlated-feature cases must preserve what is held fixed,what is refitted and which evaluation rows are used. Distinguish manual duplicate-likelihood reasoning from actual duplicated-column estimator fitting. Report observed overconfidence/probability errors without claiming a calibration algorithm or measured population calibration from tiny fixtures.
6. Reuse EV metric conventions for positive labels,undefined denominators,mathematical probability-endpoint loss and separately labeled library clipping. No silent zero substitution or claiming a clipped finite value is mathematical infinity. Default numeric comparison abs1e-9+rel1e-9 unless a versioned reference states otherwise; counts,IDs,class outcomes and tags exact. Round display separately from the oracle. Reject NaN/infinity as learner numeric answers; represent applicable reference degeneracies with explicit tags.

Freeze source/conventions/dependency/output hashes and deterministic regeneration commands only after every reachable configuration passes parity. If library behavior cannot match a proposed educational state without altered semantics,report the precise conflict before freezing. No reference-training algorithm or unsupported operation is invented by this planning checkpoint.

## 7. Mastery, retries and persistence

Approved policy unchanged:13/16 plus all four paired gates in one confirmed independent attempt.12/16 fails;13/16 with any gate failure fails. No combining attempts/modules,practice completion,notebook or experiment credit. Keep mastery unavailable until all content/forms/gates pass verification; preserve earlier same-version mastery after subsequent failure and retain missed noncritical gaps rather than fabricate100% objective mastery.

Lesson completion:four correct practice families,meaningful explained experiment interaction and correct bounded transfer. Two valid submissions per practice variant/cycle; malformed representations do not consume them. Exhausted variants need worked feedback,changed recall and explicit new cycle. Independent attempts unlimited,fresh IDs,rotate A/B/C; no active correctness disclosure. Review+confirmation required; review reload requires reconfirmation. Failed gates get decision/reason-specific explanations,counterexamples and recall; reassessment is a whole new form,not patching an old attempt. No new remediation lock.

Reuse module-scoped canonical persistence,not existing learner evidence. Exact NB key/schema/content/policy/assessment/fixture versions must be frozen before code. Validate before writes and on restoration; preserve foreign,corrupt,oversize,future/stale original bytes without reinterpretation. Retain latest20 compact summaries,latest full response and earned mastery; immutable attempt IDs,idempotent confirmation. Quota/denial/stale-tab failures remain safe in-memory state with truthful non-saved warnings. No automatic import/migration,distributed CAS,tamper-proof credential or cross-device guarantee. Semantic changes require new versions and separately approved mapping/archive decisions.

## 8. Evaluator allowlist and boundaries

Reuse immutable fixture-backed finite semantic choices,typed finite numeric answers and predefined whole repair tuples. Approved operations:bounded supplied Bayes normalization/log-score reasoning,smoothed count likelihood arithmetic,comparison of supplied Gaussian likelihoods,representation/model choice,fixed vocabulary/split/fit permissions and comparable metric/claim decisions. Training outputs are labeled trusted offline replay,not browser fitting. No general probability-expression parser,arbitrary learner Python,imports,eval/exec,network/filesystem/shell,uploads,callables,model deserialization or unrestricted prose grader.

Equivalent authored IDs/whole tuples get equal credit; do not assemble an unapproved tuple from independently valid parts. Finite numeric absolute value≤1e6,default abs/rel1e-9; numeric strings/expressions,Booleans,objects,NaN/infinity reject at the scoring contract. Decimal UI parsing stays bounded; no coercion by the scorer. Unknown operations/versions,unsafe keys,oversize/deep structures reject before scoring with safe nontechnical format guidance; valid wrong mathematics receives conceptual feedback. Do not echo malicious input or stack traces. Blanks count wrong only after review/confirmation; malformed identity/structure rejects atomically.

Inherited limits:32 families, two atoms/family,eight options/repair slots/accepted whole tuples;512B atom,1.5KiB family,64KiB submission,256KiB envelope,depth8;snippets25 lines/4KiB;arrays rank≤2,dimensions≤32,total64 cells;tables32×8,strings120 characters;lab≤64 states. Reference assets separately validated,not smuggled into answer envelopes. Static checks cannot verify arbitrary programs,production label quality,causality or general calibration.

## 9. Notebook and reproducibility

One notebook combines manual Bayes/log normalization,count smoothing,training-only MultinomialNB and a separate GaussianNB representation,correlated-evidence caution and comparable unseen evaluation. Use embedded or safely bundled fictional data with explicit units,count vocabulary,labels,row/split/fold IDs and expected outputs. Include Dummy baseline and existing Logistic comparison where appropriate without developing another course. No credentials,remote datasets,paid services,uploads or production collection. Vocabulary and any learned preparation fit training-only and separately inside each CV training fold; test outcomes cannot select priors/alpha/model variants.

Plan against the accepted local profile:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1;existing SciPy1.18.1. Record actual reference platform,notebook tooling and deterministic seed (reuse1729 where sampling is needed),settings,source/output hashes. Run twice in fresh local kernels with expected assertions and matching normalized outputs; document any normalization. Genuine Colab is an independent unresolved acceptance gate,not inferred from local execution. No dependency installation or notebook execution performed in this scope review.

## 10. Implementation acceptance checklist

1. Audit all16 objectives against teaching,worked/changed examples,32 practice,48 independent,remediation and recall; verify no missing/duplicate IDs or hidden gates. Independent forms must assess conceptual transfer,not copied answer positions.
2. Verify all80 scored instances and every exposed experiment/worked configuration against independent arithmetic and trusted Python/sklearn where applicable; semantic permission claims use explicit auditable invariants,not a false library oracle. Confirm frozen hashes and byte-identical regeneration.
3. Test posterior normalization,prior/likelihood distinction,class-conditional factorization,log underflow handling,zero/all-zero evidence,smoothing denominators,negative counts,empty/unseen vocabulary cases,Gaussian density/variance domains,representation rejection,correlated evidence and calibration limitations. Freeze expected outcomes before exposing controls.
4. Test12/16 failure and13/16 success in each form,all24 valid-wrong paired critical-component failures,unanswered atoms,malformed/equivalent answers,retries/remediation,review/reconfirmation,idempotence,no evidence mosaics and preservation of earlier mastery after later failure.
5. Test training-only and fold-only vocabulary/model fitting,aligned inference,unseen-data evaluation,no test-selected preprocessing/hyperparameters; compare models on identical rows,targets and metrics.
6. Test restoration,corruption,quota/denial,stale tabs,version/content/fixture isolation and preservation of all Math,Regression,Python,EV,PR,RG,LG,KN evidence. No migrations or altered thresholds.
7. Run complete frontend/TypeScript and Python regressions,typecheck and production build; record exact environment/counts. Source-identical isolated recovery may be used,with input hashes and differences documented; original-directory I/O remains open unless actually resolved.
8. Verify live keyboard controls,navigation,focus,feedback,confirmation,retry and320px lesson/lab/assessment states with expanded numerical alternatives. Genuine screen-reader and genuine browser zoom remain open unless performed with evidence. Check reduced-motion support without decorative dependency.
9. Run the notebook in two fresh local kernels with matching expected outputs,dependency/data metadata and no credentials/uploads/remote resources. Genuine Colab remains separately unverified.
10. Update implementation status,quality register,objective/gate coverage,notebook evidence and risk register; produce completion report and stop. No deployment,external learner testing,capstones,databases or subsequent algorithms.

## 11. Decisions and stop point

No count,lesson,gate or threshold conflict was found. Approve this bounded specification before application implementation. Recommended next authorization is **NB-E1/NB-E2 authoring and trusted reference freeze**, resolving exact datasets,alpha/variance settings,zero-evidence/tie/OOV outcomes,configuration inventories and hashes. These are pending fixture decisions,not previously verified values. Any library/mathematical conflict discovered there must be reported before freeze.

No extra NB variants,calibration training,text ingestion or additional critical gates are required to satisfy the current matrix. Such expansion needs explicit approval. Current deliverable is specification only: no new lessons,fixtures,notebook,application code,learner records or numerical QA execution. Continue tracking genuine screen-reader,browser zoom,Colab and original-directory I/O reliability. Await founder approval; do not begin Task015.6 implementation or later work.
