# Task 015.7 — Decision Trees bounded specification

17 October2026 · Approved bounded scope and frozen references implemented under separate founder authorization. See [completion/evidence](TASK_015_7_COMPLETION.md). Freeze-checkpoint stop statements below describe historical authorization boundaries.

## 1. Verified authority and prerequisites

Reconciled [Supervised Learning Blueprint](SUPERVISED_LEARNING_BLUEPRINT.md),[implementation decisions](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md),[objective matrix](supervised-lesson-objective-matrix.md),[mastery/evaluator policies](supervised-mastery-and-evaluator-proposal.md),[visual experiment plans](supervised-visual-experiments.md),[algorithm coverage](supervised-algorithm-coverage.md),[quality register](CURRICULUM_QUALITY_REGISTER.md) and [accepted Naive Bayes completion](TASK_015_6_COMPLETION.md). Task015.7 is already assigned to DT01–06,covering **both regression and classification**. Task014 remains Project Learning Engine. Older NB review-pending headers are superseded by founder acceptance.

Approved concept prerequisites:EV,LG01–03,and supplied mean/impurity primer. Recall means/residuals/SSE from Regression,probability/class proportions from Math,arrays/row alignment from Python,and training-only/fold-only preparation/evaluation. NB precedes DT in delivery order but is not a newly imposed hard mastery prerequisite. Use targeted contextual recall,not duplicate courses,route locks or automatic evidence transfer.

## 2. Exact approved allocation

| Deliverable | Approved requirement |
|---|---|
| Lessons |Six: DT01–DT06,in objective-matrix order |
| Essential objective families |24;four per lesson |
| Practice |48 instances:A/B for every objective |
| Independent assessment |72 instances:three complete24-family forms A/B/C |
| Total scored instances |120;paired atoms do not add family points |
| Paired critical gates |Six:DT01.O2,DT02.O2,DT03.O2,DT04.O2,DT05.O2,DT06.O2 |
| Experiments |Two:DT-E1 regression and DT-E2 classification;each at most64 reviewed combined configurations |
| Notebook |One reproducible notebook,with distinct regression/classification sections |
| Mastery |At least20/24 AND both atoms of every gate in one confirmed independent attempt |

Core fitted references are DecisionTreeRegressor(criterion='squared_error') and DecisionTreeClassifier(criterion='gini'),with explicit depth/leaf/seed settings. No forest,boosting,extra-tree model,arbitrary custom criterion or capstone implementation. Forest remains an explanatory comparison/future dependency only. Frozen DT-E1 has37 configurations and DT-E2 has32;the reference manifests and numerical convention lock remain unchanged.

## 3. Exact lesson and objective mapping

IDs are lesson ID plus column identifier;wording/order and critical allocation preserved.

| Lesson | O1 | O2 — paired critical | O3 | O4 |
|---|---|---|---|---|
| DT01 — Partition feature space |Follow a split path for a new row|Distinguish training a split from routing an unseen row|Describe axis-aligned regions|Handle equality at an authored threshold|
| DT02 — Regression leaves |Calculate leaf mean and SSE|Choose a split by weighted squared-error improvement and explain leaf prediction|Compare parent and child residuals|Identify inability to extrapolate beyond leaf predictions|
| DT03 — Classification leaves |Compute class proportions and Gini|Choose weighted impurity improvement and explain class/probability output|Compare balanced and imbalanced leaves|Distinguish impurity from held-out predictive success|
| DT04 — Depth and stability |Compare shallow/deep train/development errors|Reject maximal depth chosen on training error and explain variance|Predict sensitivity to a changed row|Read pruning/min-leaf trade-offs|
| DT05 — Fit safely |Read fixed criterion/depth/seed parameters|Reject leakage,target misalignment or invalid split provenance|Repair a bounded tree workflow|Compare regression/classification metrics correctly|
| DT06 — Explain rules and limits |Translate a path into a local rule|Reject rule/impurity importance as causal or globally reliable|Compare tree with linear model and forest|Report subgroup errors,instability and range limits|

Every objective must map to explanation/motivation,terminology,worked and changed examples,mathematical symbols,Python application,practice A/B,independent A/B/C,misconception feedback and targeted recall. Every lesson follows real problem → visual intuition → experiment → mathematics → Python → evaluation → comparison. Interpret mechanisms,not just parameter names.

### Teaching progression and depth

- **DT01:** Route a new house/customer through a fixed tree before explaining how training chooses its nodes. Approved equality seed:feature≤2 goes left. Trace recursive partitions,conjunctions along a path and axis-aligned regions. Prediction reuses trained thresholds;it does not rebuild splits using the query outcome. A supplied illustrative split is not falsely labeled the estimator's optimal learned split.
- **DT02:** Piecewise house-price prediction,with declared units. Approved leaf targets[2,4] have mean3 and SSE2. A regression leaf predicts a numeric mean,not a majority class. Compare parent residuals with both children and explain why a tree's leaf constants do not continue a learned linear slope beyond training regions. Do not conflate SSE with mean squared error or weight an already summed SSE twice.
- **DT03:** Churn or a separate fictional documentation classification task. Approved parent counts[2,2] yield proportions[.5,.5] and Gini.5. Child impurity must be weighted by actual membership. Leaves report class frequencies/probability vectors,then a class decision;pure or tiny leaves are not guaranteed calibrated probabilities. Reduced training impurity does not prove unseen predictive success. Entropy treatment is a founder decision described below,not a silently enabled estimator criterion.
- **DT04:** Compare shallow/deep trees on matching train/development rows;move one authored training row and inspect changed structure/predictions. Explain variance/stability without claiming every deeper tree improves training fit or worsens validation error strictly. Pruning/min-leaf interpretation is already allocated to O4. Read finite supplied traces:complexity controls can remove useful as well as noisy detail;select settings through training/development or fold-local CV,never final-test feedback.
- **DT05:** Separate regression squared-error targets/metrics from classification labels/metrics. Preserve feature order,target alignment,split provenance and prediction-time availability. Tree splitting itself learns from training labels;even when scaling is unnecessary for a simple tree,any learned preprocessing still fits training-only and separately within each CV fold. Fix criterion/depth/seed before claiming reproducibility;seed does not turn an arbitrary mathematical tie into a unique optimum.
- **DT06:** Translate a path into a local conditional rule and report how many rows it covers;approved seed covers3 of20 training rows. Impurity importance reflects training split reductions,not causal effects or universal reliability. Correlated predictors and feature cardinality can distort interpretation. Compare piecewise rules with existing linear models and a conceptual forest;report subgroup errors,shift,instability and numeric-range limitations rather than a universal algorithm ranking.

Applications connect regression to House Price Prediction and classification to Churn/Technical Documentation Quality. Use small fictional data;0/1 class meanings must be named per dataset (e.g.stays/churns versus Good/Needs Improvement),not silently reused across targets. No production labels,LLM ground truth assumption,data collection or capstones.

## 4. Critical decision,reason,failure and remediation mapping

| Gate | Decision/calculation atom | Required reason/transfer atom | Failure and changed recall |
|---|---|---|---|
| DT01.O2 |Identify training-time split learning versus inference through a saved path|Explain why an unseen query is routed without its outcome labels or refitting thresholds|Trace a changed query through an unchanged tree;contrast with a separately changed training dataset|
| DT02.O2 |Choose the valid regression split using correct child sizes/squared-error improvement|Explain why the resulting leaves predict numeric means,not class votes or individual targets|Recompute parent/child means,SSE and gain on changed memberships;restore the declared error normalization|
| DT03.O2 |Choose classification split using size-weighted impurity improvement|Explain leaf class proportions/probability output and decision,not regression averaging of label codes|Contrast unequal child sizes and a majority vote with probability confidence;recompute changed class counts|
| DT04.O2 |Reject maximum depth selected solely by training error|Explain variance/instability and why unseen development or fold-local evidence must govern complexity selection|Compare changed train/development curves;repair a training-only or test-selected depth decision|
| DT05.O2 |Reject leaked features,misaligned targets or invalid split provenance in the authored case|Identify the actual information/row-identity boundary and its valid repair|Rebuild an aligned training/fold-only workflow and trace saved-state held-out prediction|
| DT06.O2 |Reject a local rule or impurity importance interpreted as causal/globally reliable|Explain training-distribution dependence,coverage/correlation or feature-cardinality limitations in the changed case|Compare a tiny covered region with shifted/uncovered observations;state a supported conditional claim instead|

Either valid wrong atom fails its gate even at23/24 overall. Verify **36 valid-wrong component failures**:six gates×two atoms×three forms,with the other atom and every other family correct. Parser rejection is not critical-reasoning evidence. Other objective families remain essential but noncritical;no hidden entropy,pruning or feature-importance arithmetic gate is added.

## 5. Mathematical and deterministic conventions to freeze

Before application work,author exact fixtures and verify every reachable state with independent arithmetic and trusted local sklearn. These are required convention decisions,not new reference results.

1. **Routing and structure:** fixed feature/row ordering,finite feature domains and explicit threshold equality (left≤threshold,right>threshold). Freeze node IDs,children,thresholds,leaf memberships and queries. Verify exported threshold precision and library feature conversion before selecting equality/near-threshold probes;display rounding must not determine routing. Do not assume a hand-authored midpoint is the exact learned sklearn threshold.
2. **Regression:** unweighted leaf mean=sum targets/n;SSE=sum squared residuals. For one parent,ΔSSE=SSE_parent−SSE_left−SSE_right;equivalent local MSE reduction=ΔSSE/n_parent. If averaging child MSEs,use n_child/n_parent weights. Do not multiply already summed child SSEs by those weights again. Distinguish node-local gain from estimator globally weighted impurity-decrease parameters. No sample weights or alternative regression criterion unless explicitly amended.
3. **Classification:** class proportions from aligned leaf counts;Gini=1−sum(p_c²);gain=G_parent−(n_left/n_parent)G_left−(n_right/n_parent)G_right. Freeze class order,prediction tie policy and probabilities after trusted verification. Label codes are categories;their numeric mean is not a regression leaf. Entropy's proposed contextual formula/role is separated below from the Gini fitting allowlist.
4. **Construction/ties:** fix splitter,random_state,feature order,depth,min_samples_split,min_samples_leaf and pruning tuple;inspect actual installed API/defaults,not remembered defaults. Tie equal-gain candidates,constant/duplicate features and invalid/empty-child candidates explicitly. A fixed seed pins the local reference behavior but is not a unique mathematical optimum or cross-version guarantee. If an authored display tie-break differs from sklearn,declare it and demonstrate the difference or reject that unsupported case;do not silently claim parity.
5. **Complexity/pruning:** freeze finite max_depth/min-leaf/pruning traces under DT04.O4. Document cost-complexity risk normalization,ccp_alpha scale,node/leaf counts and which values are training-derived after inspecting local reference behavior. If deriving a pruning path,derive it inside the training/fold boundary,not using held-out targets;development/CV may select among candidates,final test may not. No unbounded sliders or arbitrary pruning program.
6. **Edge cases:** pure class node,constant numeric target,no eligible split,undersized leaves,duplicate feature values,class ties and boundary equality. An ordinary no-split tree may validly return its root mean/frequencies;do not call it an error or fabricate a split. Reject unsupported missing/nonfinite inputs and invalid parameter tuples explicitly for the bounded curriculum,regardless of broader library capabilities. Reuse EV conventions for undefined metrics,absent classes and constant-target R² rather than silently coercing undefined outcomes to0.
7. **Precision:** typed finite numeric learner answers≤1e6 in absolute value;default abs1e-9+rel1e-9 unless a versioned fixture declares otherwise. Membership,counts,IDs,labels,tags and topology require exact agreement;epsilon grading must not change partition membership,ties or learned thresholds. Display precision and reference precision separate. Freeze all inputs,expected outputs,source/convention/dependency/output hashes and byte-identical regeneration only after successful parity.

## 6. Two experiment fixture plans

### DT-E1 — Regression partitions and generalization

Approved coverage DT01,02,04,05. Use fictional house-size/price data with explicit units,training/development IDs and a small set of query positions. Choose authored regression split,depth or changed training row;predict membership,leaf mean or squared-error direction before revealing. Show recursive path/partition,actual row memberships,parent/child means and SSE or clearly labeled MSE,query prediction,training/development residuals and out-of-range query behavior.

Separate manual candidate-split replay from an actual fitted DecisionTreeRegressor;not every manually chosen threshold is its best learned threshold. Compare a matched finite deeper/shallow trace and changed-row stability. Include finite min-leaf/pruning traces to support the already approved DT04.O4;exact parameter tuples/state counts remain authoring decisions for reference freeze. A forbidden test-selected complexity case is a labeled permission diagnostic,not an accepted fitting option. No new third experiment.

### DT-E2 — Class partitions,probabilities and explanation limits

Approved coverage DT01,03–06. Use small fictional churn/classification rows,declared positive class and fixed training/development/query IDs. Choose authored split/depth;predict size-weighted Gini,leaf class proportions or held-out error behavior. Reveal tree/path structure,child class counts,sizes,weighted impurity gain,leaf probabilities,class decision and confusion/error outcomes. Contrast balanced/imbalanced leaves and a local rule's coverage;show why a pure training leaf or high impurity importance does not certify calibration,causality or global reliability.

Finite boundary visualizations use authored region rectangles/paths and reviewed query samples,not a silently added dense mesh. Fixed pruning/min-leaf comparison traces may be allocated within the existing64-state budget,not a free new parameter cross-product. Compare regression mean leaves versus class-frequency leaves contextually without mixing tasks/metrics or duplicating DT-E1's fitted workflow. Forest remains a mechanism comparison,not trained content.

For both manifests,freeze exact fictional arrays,feature/target definitions,labels,train/fold/query IDs,allowed controls,complete legal configuration lists,expected nodes/memberships/outputs,explanations/counterexamples and stable fixture/version IDs. Each≤64 combined states including diagnostics. Exact counts are deliberately **not assigned as approved numbers** until authored/reviewed. Keep arrays/tables/scenes within inherited limits;no arbitrary query coordinates,new scene budget or continuous training interface.

Prediction and bounded reason precede reveal. Initially wrong predictions may recover;require a changed legal state and correct transfer explanation for meaningful completion. Provide native keyboard controls,visible focus,semantic tree headings and a complete textual path/node table,not only a diagram. Numerical membership/impurity/error tables must explain every plot;no hover,color,animation or spatial-only meaning. Reduced motion and320px reflow required. Reset/replay never awards mastery.

## 7. Founder-resolved entropy policy

The new directive requests **Gini and entropy**;the approved objective matrix explicitly says Gini in DT03.O1 and the fitted coverage baseline specifies criterion='gini'. No separately approved entropy exercise allocation or fitted criterion allowlist was found.

**Recommended bounded treatment:** retain Gini as the core scored/fitted criterion;teach entropy as a contextual contrast inside DT03's existing explanation/worked/guided material,without a new objective,family,gate or estimator configuration. Explain H=−sum p_c log2(p_c),with0 log2(0)=0;balanced binary entropy1 bit versus Gini.5,pure node0 for both. Their numeric scales are not directly comparable. Entropy intuition does not imply it always selects a different/better split. Any displayed entropy arithmetic still requires trusted reference verification before delivery.

**Approved decision:** contextual-only entropy inside DT03; Gini remains the classification scored/fitted criterion. No entropy-based fitted variants or new entropy gates. The freeze verifies the bounded entropy comparison. Counts and six O2 gates are unchanged. Separate application authorization is still required.

## 8. Mastery,retries and persistence

Policies unchanged:20/24 plus all six paired gates in one confirmed independent attempt.19/24 fails;20/24 with any gate failure fails. Three complete forms,each assesses all24 families once. No partial-family points,across-attempt mosaics,cross-module transfer,practice/notebook/experiment mastery or automatic award from completion. Preserve earlier same-version mastery after later failure;missed noncritical families remain explicit gaps. Mastery unavailable until full verification.

Lesson completion requires four correct practice families,meaningful explained lab interaction and correct bounded transfer. Two valid graded submissions per practice variant/cycle;malformed format does not consume them. Exhaustion requires worked review,changed recall and explicit new cycle. Independent retries unlimited fresh IDs,A/B/C rotation,no active correctness disclosure,review+confirmation. Review reload returns to active/reconfirmation. Failed critical atoms get specific explanation,counterexample and recall;recommend remediation without a new access lock;reassess a whole fresh form,not patch an earlier attempt.

Freeze a separate DT scope/key/schema/content/policy/assessment/fixture identity before code. Reuse canonical bounded envelopes,hydrate/validate before write,immutable attempt IDs,idempotent confirmation,latest20 summaries,latest full response and retained mastery. No evidence import or migration from Math,Regression,Python,EV,PR,RG,LG,KN or NB. Preserve corrupt,oversize,foreign,future/stale original bytes;quota/denial/stale-tab failures remain in-memory with truthful non-saved warnings. No distributed CAS,tamper-proof certification or account sync. Semantic changes require new versions and separately approved mapping/archive decisions.

## 9. Evaluator capabilities and security boundaries

Allow only authored finite choices,typed finite numeric answers and predefined whole repair tuples. Operations:fixed-threshold path routing,supplied row memberships,means/SSE/residuals,class counts/proportions/Gini,weighted gain,fixed complexity/pruning trace interpretation,fit/split/row permissions,task-metric comparison and local-rule/importance claims. Trusted fitted outputs are immutable offline replay,not browser training. Contextual entropy display does not silently extend the scoring language;follow the founder decision above.

Exact semantic IDs/counts/topology/tags;numeric equivalence uses declared tolerances,not expression interpretation or rounding-based membership. Explicit authored equivalent whole tuples get equal credit;no assembly of unsupported combinations. Reject scorer numeric strings/expressions,NaN/infinity,Booleans,objects,unsafe keys,unknown operations/versions and oversize/deep input before scoring. Give safe format guidance separately from valid wrong mathematics;do not echo malicious input or stacks. Blanks count wrong only after review/confirmation;malformed identity/structure rejects atomically.

Inherited limits:32 families, two atoms/family,eight options/repair slots/accepted whole tuples;512B atom,1.5KiB family,64KiB submission,256KiB envelope,depth8;snippets25 lines/4KiB;arrays rank≤2,dimensions≤32,total64 cells;tables32×8,strings120 characters;lab≤64 states. Read-only model/diagram assets separately validated within approved scene bounds,not put into learner envelopes. No general tree-expression interpreter,learner Python,imports,eval/exec,network/filesystem/shell,uploads,callables or model deserialization. Static bounded checks cannot certify arbitrary programs,production performance,causality or explanation reliability outside fixtures.

## 10. Notebook reproducibility requirements

One notebook,with separate embedded regression/classification datasets and target meanings. Demonstrate manual paths/means/SSE/Gini,DecisionTreeRegressor/Classifier,finite depth/min-leaf/pruning comparison,training/fold-only model selection,matching unseen evaluation,local rules and importance limitations. Recall existing Linear/Logistic comparisons;do not train a new forest or implement later algorithms. Any entropy explanation follows the founder-approved treatment and independently verified arithmetic.

Bundle small fictional arrays with declared units,feature order,labels,row/split/fold IDs,settings,seeds,expected outputs and hashes. Fit all learned preprocessing and any derived pruning candidate path within permitted training folds;use development/CV for selection,untouched test only after freezing. No credentials,uploads,remote datasets,paid services or production collection.

Plan against accepted local profile:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1;existing SciPy1.18.1. Reuse seed1729 where relevant,pin actual splitter/settings after inspection and record notebook tooling/platform. Two fresh local kernels must match normalized outputs and expected assertions;explain any normalization. Genuine Colab is separately unverified,not inferred from local success. No package installation or notebook execution in this scope checkpoint.

## 11. Implementation acceptance criteria

1. Verify all24 essential objectives against teaching,worked/changed cases,48 practice,72 independent,feedback and recall;preserve exact six O2 gates. Regression/classification task-specific gates are separately assessed,not collapsed into generic tree questions.
2. Verify all120 scored instances and every exposed experiment/worked state against trusted Python/sklearn and independent arithmetic where applicable. Semantic permissions/causal claims use auditable authored invariants,not a false claim the library validates provenance. Freeze expected outputs/hashes only after parity;confirm byte-identical regeneration and unchanged locks during implementation.
3. Test path equality/near-threshold routing,actual threshold precision,leaf means/SSE and proper gain normalization,weighted Gini,leaf probabilities/class ties,deterministic reference topology,split ties,constant/pure nodes,invalid/undersized splits and no-split root predictions. Verify pruning/min-leaf traces and any approved entropy display/variants distinctly.
4. Test19/24 failure and20/24 success in all three forms,all36 valid-wrong paired gate-component failures,unanswered/malformed/equivalent answers,active-feedback suppression,review/reconfirmation,idempotence,retry/remediation,no evidence mosaics and prior-mastery retention.
5. Test target alignment,training-only and separate fold-only fitting,split/pruning provenance,test-selection rejection and task-appropriate metrics on matching rows. Do not mistake lower training impurity for generalization or calibrated/causal importance.
6. Test restoration,corruption,quota/denial,stale tabs,scope/schema/content/fixture isolation and preservation of earlier modules/evidence. No migrations or changed thresholds.
7. Run complete frontend/TypeScript and Python regressions,typecheck and production build;record exact counts/environment. Source-identical isolated recovery is permitted with input equality evidence,not a claim original-directory I/O is resolved.
8. Perform live keyboard navigation/controls,visible focus,feedback/review/confirmation/retry and320px checks including tree diagrams and expanded numerical/path alternatives. Check reduced motion. Genuine screen-reader and genuine browser zoom remain open unless actually verified.
9. Run notebook twice in fresh local kernels with deterministic expected outputs,dependency/data metadata and no external resources. Genuine Colab remains a separate obligation.
10. Update implementation status,quality register,objective/critical-gate coverage,notebook evidence,architecture/risk documentation and completion report. No deployment,external learner testing,capstones,databases or subsequent algorithms.

## 12. Approval package and stop point

Approved lesson/count/gate/threshold allocation is consistent. Founder approved contextual entropy with Gini-only scoring/fitting. Pruning/min-leaf interpretation remains DT04.O4. Frozen finite tuples stay within the two existing lab budgets.

Authorized reference freeze is complete: DT-E1 has37 configurations and DT-E2 has32. [Readiness](TASK_015_7_IMPLEMENTATION_READINESS.md) records parity, byte-identical regeneration and hashes. No unresolved mathematical conflict remains.

This checkpoint authors trusted offline fixtures,reference tooling and documentation only. No application lessons,notebook,evaluator,learner storage or mastery changed. Reference parity is verified; no new frontend/build,notebook or manual accessibility pass is claimed. Genuine screen-reader,browser zoom,Colab and original-directory I/O reliability remain OPEN. Stop for founder review;no application implementation or later work.
