# Task015.10 — Support Vector Machines bounded specification

**Latest17 October2026:** founder approved this bounded scope and authorized experiment reference freeze. [Frozen manifests/conventions/parity](TASK_015_10_IMPLEMENTATION_READINESS.md) resolve the numerical-authoring prerequisites below;application implementation remains unauthorized. Approved objective/mastery/evidence boundaries are unchanged.

17 October2026 · Scope verification only; no implementation or reference freeze authorized.

## 1. Verified authorities and scope

Cross-checked the [Supervised Learning Blueprint](SUPERVISED_LEARNING_BLUEPRINT.md), [implementation decision package](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [algorithm/objective matrix](supervised-lesson-objective-matrix.md), [mastery/evaluator policies](supervised-mastery-and-evaluator-proposal.md), [visual experiments](supervised-visual-experiments.md), [algorithm coverage](supervised-algorithm-coverage.md), [quality register](CURRICULUM_QUALITY_REGISTER.md) and [Task015.9 completion](TASK_015_9_COMPLETION.md). Their SV allocation agrees. Founder accepted GB implementation completeness; older GB review-pending text is historical.

| Item | Existing approved allocation |
|---|---|
| Task/module |015.10 / SV — SVM classification |
| Lessons |SV01–SV05, five lessons |
| Objectives |20 essential families, four per lesson |
| Practice |40 instances: two per objective |
| Independent assessment |60 instances: three whole20-family forms |
| Scored total |100 instances; paired atoms do not increase the denominator |
| Critical gates |Five paired O2 families, one per lesson |
| Mastery |16/20 AND both components of every gate in one confirmed attempt |
| Experiments |SV-E1 and SV-E2, each at most64 reviewed configurations |
| Notebook |One reproducible SVM classification notebook |

Prerequisites: EV,LG01–03,linear algebra and feature-scaling recall. Connect dot products,vectors/norms,distances,regularization,NumPy shapes,pandas row alignment,Data Preparation fold-only pipelines and existing classification evaluation. KN/RF/GB supply comparison context,not new mastery-transfer requirements. Keep recommended sequencing distinct from hard route locks;experienced learners can recall concepts contextually. Task014/capstone engine is not an implementation prerequisite.

Scope is binary classification with `SVC(kernel='linear')` and `SVC(kernel='rbf')`,without probability estimation. Hard-margin geometry is contextual teaching within SV02,not an additional fitted solver,lesson or gate. No SVR,multiclass expansion,polynomial/sigmoid/custom kernels,calibration algorithm implementation,arbitrary optimization engine or new curriculum module. The house-price capstone is a comparison of task suitability,not authorization to add regression SVM.

## 2. Exact lesson/objective matrix

O2 is the only critical objective in each row. Preserve these existing statements rather than making all new SVM concepts extra critical gates.

| Lesson | O1 | O2 — paired critical | O3 | O4 |
|---|---|---|---|---|
| SV01 — Margin geometry |Compute a linear decision score and distance |Distinguish sign decision,margin and probability |Identify support-vector influence in a frozen scene |Explain feature-scale dependence |
| SV02 — Soft margins and C |Read hinge-loss/slack examples |Explain C's trade-off without equating larger C with more regularization |Predict sensitivity to an outlier |Compare Logistic and linear SVM loss |
| SV03 — RBF locality |Calculate an RBF similarity |Explain gamma's locality and distinguish kernel similarity from a new input column |Compare linear/RBF boundaries |Identify overfit small regions |
| SV04 — Safe scaled workflow |Trace scaler/SVC fitted rows |Reject test-tuned C/gamma or globally scaled folds and explain why |Repair predefined pipeline/grid slots |Handle imbalance with explicit class-weight policy |
| SV05 — Limits and comparison |Compare classification errors and query costs |Reject uncalibrated scores as probabilities or extrapolated reliability |Explain kernel scaling/resource limits |Compare KNN/Logistic/tree choices for a stated problem |

Each family must map to its lesson teaching,worked/contrasting example,practice A/B,independent A/B/C and targeted remediation. Code prediction/repair must assess the associated mechanism or boundary,not merely method-name memorization.

## 3. Teaching depth and progression

Every lesson follows real problem → visual intuition → experiment → mathematics → Python → evaluation → comparison. Define terminology before notation and explain all symbols. Use fictional pre-prediction customer features for churn;Documentation Quality is contextual binary classification with human-reviewed labels,not production collection or LLM ground truth.

| Lesson | Motivation,worked progression and experiment | Misconception and remediation / success |
|---|---|---|
| SV01 |Separate customer profiles with a line,then show its higher-dimensional hyperplane meaning. With w=(1,0),b=0,x=(2,3),score2 and distance2. Change w to(2,0):score4 but geometric distance still2. Inspect frozen support IDs and scaled features in SV-E1. Python distinguishes decision_function from predict. |“Distance/score is risk probability” → compare sign,unsigned/signed distance and a probability's domain;identify actual solver support IDs rather than assuming every visually close point is a support vector. |
| SV02 |Start with separable groups,then add an overlapping/outlier customer. For y=+1,F=.5,hinge=max(0,1−yF)=.5;for F=−.5 it is1.5. Compare small/large C in SV-E1 and relate loss sensitivity to validation. Contrast Logistic's smooth log-loss with hinge loss. |“Larger C is stronger regularization / zero training error is robust” → read the objective's coefficients and compare a changed outlier scene;explain finite soft-margin penalties versus the conceptual hard-margin constraint. |
| SV03 |A straight separator misses a local pattern. RBF similarity at distance1,gamma1 is exp(−1);at gamma4 it is exp(−4). Compare reviewed linear/RBF boundaries and query outcomes in SV-E2,then examine small high-gamma regions and validation evidence. |“Gamma creates a new measured input column / nonlinear always wins” → distinguish a pairwise kernel similarity from raw data columns;explain locality and inspect an overfit counterexample. |
| SV04 |One feature's units dominate dot products/distances. Contrast training-only scaling with an invalid global transform;trace separate fold-only scaler/SVC fits. Repair finite pipeline/grid tokens in SV-E2. Class weighting is a declared training policy,not automatic probability calibration. |“A pipeline name or good test score proves safety” → annotate fit row IDs,training-only class counts and validation/test permissions;reject test-selected C/gamma and globally scaled folds. |
| SV05 |Compare matching-row confusion/errors and fit/query cost against Logistic,KNN and trees. A score2 is neither probability2 nor evidence of reliable extrapolation. Explain support-vector/kernel work,imbalance,calibration/shift and small subgroup limits using both labs. |“Large margin certifies all future predictions / importance implies causality” → state output type,population,metric and resource limitations;choose comparison evidence suitable for the task. |

Success requires reasoning on a changed numerical or ML scenario. Provide contextual prerequisite links,worked feedback and changed-case recall;do not require learners to repeat an entire prior module. SV03/SV05 give introductory kernel-resource intuition without RKHS proofs or a full dual-optimization derivation.

## 4. Critical gates and failure paths

Each gate requires decision/calculation AND reason/transfer. A wrong component fails that family and prevents mastery even with19/20 total. Neither practice nor prior-module mastery substitutes for either component.

| Gate | Required decision and explanation | Failure → targeted remediation |
|---|---|---|
| SV01.O2 |Separate sign-based class decision from geometric margin and probability interpretation |Treat score/distance as calibrated risk → contrast rescaled w,b with unchanged geometric distance and named output domains |
| SV02.O2 |Interpret C as penalty strength relative to the norm term;explain the soft-margin trade-off |Reverse C's regularization direction or promise robustness from perfect fit → compare named objective terms and a noisy/outlier example |
| SV03.O2 |Identify gamma's local similarity effect and reject kernel-as-new-observed-column reasoning |Confuse locality,raw feature engineering and universal superiority → calculate two exp(−gamma*d²) values and compare held-out behavior |
| SV04.O2 |Reject test-guided C/gamma or globally scaled folds;explain the leaked information boundary |Accept global scaling or test search → trace the scaler/model fit IDs separately in every fold and reserve final test |
| SV05.O2 |Reject uncalibrated score-as-probability or unsupported extrapolated reliability |Convert margin ranking into guaranteed calibrated risk → identify missing calibration/shift/subgroup evidence and task-specific comparison |

Feedback identifies the failed atom,shows a contrasting worked case and recommends changed recall. Retrying uses a fresh whole independent form,not patching a gate into an earlier score. Independent access is not newly locked behind remediation.

## 5. Bounded experiments and fixture plan

Exact fictional coordinates,grids,configuration counts,solver tolerances,expected fits and hashes are NOT yet authored or frozen. No numerical parity or model-fitting pass is claimed by this scope review. Recommend separate experiment reference-freeze authorization after this bounded specification is reviewed. Every exposed valid/rejected/undefined state must count toward64 per lab;no unreviewed Cartesian controls or unrestricted sliders.

### SV-E1 — Linear geometry,soft margins and outliers

- Approved mapping:SV01,SV02,SV05. Prerequisites:dot products,norms,signs,classification errors and regularization recall.
- Use small exact fictional binary training/development partitions with stable row IDs,units,feature order and label-to-sign mapping. A sealed final test must never supply fit/selection controls. Include separable and noisy/outlier contrasts.
- Controls:choose a finite manual boundary scene or a frozen fitted linear-SVC C/outlier scene. “Move boundary” means an authored w,b choice;it is explicitly illustrative geometry,not a claim to have refitted an optimum. Fitted scenes expose actual fitted coefficients/intercept and solver support IDs.
- Predict before reveal:class/sign,score,distance,margin violation or outlier effect;change a meaningful reviewed scene,predict again,reveal and explain. An initially wrong prediction is recoverable.
- Output:point/support plot,exact scores/signed and unsigned distances,hinge/slack table,support memberships,C/objective convention,train/development errors and allowed fit IDs. Explain why larger C need not yield universally better validation or monotonic empirical margins.
- Accessible alternative:wrapping semantic summary,numbered input/score/margin/hinge/support tables,labeled native controls and keyboard reveal/reset. Distinguish the boundary F=0 from canonical margin lines F=±1 and from calibrated risk. A diagram is not the sole source of any answer.

### SV-E2 — RBF locality,scaling and safe selection

- Approved mapping:SV03–SV05. Prerequisites:distance/scaling,exp intuition,linear decision scores and fold-only fit permissions.
- Use a small fictional nonlinear binary fixture,plus explicit unit-rescaling and valid/invalid pipeline provenance scenes. Training and development IDs remain disjoint;final test remains sealed. Record training-fitted scaler means/scales and class-weight provenance where used.
- Controls:finite authored C/gamma/scaled-state or boundary-permission choices. Default to at most64 plotted sample/query points plus authored boundary paths. The previously proposed21×21 mesh remains unapproved and is not implicitly authorized here.
- Predict before reveal:kernel similarity/locality,query class,boundary complexity or valid fitting/selection decision;show the changed numerical output and explain why. Demonstrate a nonlinear fit's limits,not guaranteed superiority.
- Output:RBF similarity table,actual decision_function/query classes,reviewed boundary paths,support IDs,training/development metrics,scaler fit-row manifest and parameter-selection provenance. A kernel score is not a distance to a straight boundary in original input space and is not a probability.
- Accessible alternative:input/scaled-coordinate tables,pairwise similarities,labeled query predictions and text explanation of locality,overfit regions and selection boundaries;no color-only or hover-only meaning. Keep large immutable traces separate from learner envelopes.

## 6. Numerical and API conventions to settle during reference freeze

1. For illustrative linear scenes F(x)=w·x+b;boundary F=0. Unsigned distance=abs(F)/norm(w),signed distance=F/norm(w),signed class margin=yF/norm(w),functional margin=yF for encoded y in{-1,+1}. Norm(w)=0 means geometric distance undefined,not0. Rescaling w,b together preserves the boundary and geometric distance,but not the unnormalized score or hinge value.
2. With canonical soft-margin constraints,yF>=1−xi,xi>=0;hinge=max(0,1−yF). Describe the objective (1/2)norm(w)^2 + C*sum(xi) for unweighted C-SVC,not an unexplained mean-loss normalization. Full canonical margin slab width2/norm(w) differs from distance of one point to F=0. Hard margin requires separability;finite large C is not a general exact hard-margin solver.
3. Freeze binary class order/encoding and decision_function sign orientation. Treat exact-on-boundary illustrative points as “on boundary”;pin actual fitted SVC.predict equality behavior from trusted reference rather than copying Logistic/GB threshold rules. Raw decision scores and sigmoid(score) are not automatically calibrated probabilities.
4. Fitted support vectors come from solver support_/support_vectors_/dual coefficients with pinned numerical conventions,not simply visually nearest rows. Soft-margin support vectors may violate margins or be misclassified;degeneracy can make geometric and solver-active membership differ. Check KKT/complementarity tolerances where assertions are made;never claim exact optimality from a warning/nonconverged fit.
5. RBF K(x,z)=exp(−gamma*norm(x−z)^2),gamma>0. Distances use the declared training-fitted feature space. A kernel evaluates similarity without adding a newly observed data column. Export and independently reconstruct binary decision scores from support coefficients,kernel values and intercept,including label orientation. Do not treat RBF score as Euclidean input-space distance.
6. Freeze explicit finite C>0/gamma>0 values,training-only StandardScaler behavior (including population variance/constant columns),solver/shrinking/cache/max_iter/tol settings,feature ordering,float precision,seeds and convergence outcomes. No dependence on an unspecified gamma='scale' default;either explicit numeric gamma or a separately frozen training-only derivation. Scaling effects and C/gamma interactions must be checked rather than assumed.
7. SV04.O4 requires an explicit class-weight policy. Freeze permitted unweighted/weighted scenes and provenance;class weights alter per-class C,not class probabilities. If balanced weights are used,derive them from the current training fold only. Do not silently introduce resampling,probability calibration or test-derived class weights.
8. Freeze the task-appropriate development metric,its direction,candidate set and deterministic selection tie rule before reference generation. Validation/CV consumes development information;preparation and class statistics refit inside each training fold. Test data never selects C,gamma,scaling,threshold or weights. Missing classes,invalid parameters,unsafe input,undefined metrics and nonconvergence need explicit rejected/tagged outcomes,not fabricated zeros.
9. Numeric parity uses declared absolute/relative tolerances (default1e−9 where appropriate);solver/KKT tolerances are separate and may need explicitly justified values. Record full precision;round only display. Exact class IDs,fit-row IDs and membership arrays compare exactly. Equivalent numerical answers are graded consistently with existing contracts.

Read-only local API/doc inspection during this review confirms SVC in approved sklearn1.9.1. Its probability parameter is deprecated since1.9;the documented default remains probability estimation disabled. Preserve the approved no-probabilities behavior;record any deprecation warning/explicit-False behavior at freeze and do not replace it with a new calibration workflow. Constructor inspection is not a fit,convergence or parity result. No dependency upgrade or installation is proposed.

## 7. Evaluator,completion,mastery and evidence boundaries

- Reuse the bounded deterministic supervised adapter and Python foundation answer primitives;no changes to existing module registries or grading. Allow finite option IDs,typed finite numbers and explicitly authored whole repair-slot tuples only. Geometry/kernel arithmetic operates on fixed authored inputs,not general learner expressions.
- Numeric magnitude<=1e6,default abs(a−b)<=1e−9+1e−9*abs(expected) unless explicitly versioned otherwise. Exact IDs/counts/classes use exact authored representations. Normalize negative zero unless tested. UI decimal parsing is separate from the scoring contract;NaN,Infinity,Boolean/object/numeric-string/expression answers are unsupported,not silently coerced. Tagged undefined/infinity outcomes are distinct finite choices,never numeric0.
- Preserve bounds:32 families/attempt,two atoms/family,eight options/repair slots/accepted whole tuples;atom512B,family1.5KiB,submission64KiB,envelope256KiB,depth8;snippets25lines/4KiB;learner arrays rank<=2,dimension<=32,total<=64cells;tables32×8,fixture strings120characters. Large validated immutable model traces are separate from learner submissions. No scene-limit expansion without explicit approval.
- Reject unknown versions/operations,unsafe/oversize/malformed records and unsupported representations before grading with bounded safe messages. Do not echo attacks or stack traces. Wrong valid answers receive conceptual feedback;blanks become unanswered-wrong only after review/confirmation;malformed identities reject atomically.
- No learner Python execution,unrestricted imports,eval/exec,arbitrary callable/expression interpretation,filesystem/network/shell access,uploads or arbitrary model deserialization. Trusted offline author notebooks are separate from web assessment.
- Mastery stays unavailable until complete implementation verification. Require16/20 and all five paired gates in one confirmed independent attempt. No partial family points,evidence mosaics,cross-module transfer or notebook/practice/completion mastery. A passing attempt can leave noncritical objective gaps;do not fabricate100% completion. Earlier same-version mastery survives subsequent failures.
- Lesson completion retains four demonstrated practice families,a changed explained experiment and correct bounded transfer. Practice permits two valid submissions per variant/review cycle;format rejection consumes none. Exhaustion requires worked review,changed recall and explicit cycle recovery. Independent retries are unlimited fresh IDs rotating whole A/B/C forms,with no correctness reveal while active;review and explicit confirmation are mandatory. Reloaded review requires reconfirmation. Remediation recommends recall but adds no new prerequisite access lock.
- Use a separate versioned SVM canonical scope;exact key/schema/content/assessment/fixture IDs freeze before implementation. Never import,reinterpret,delete or overwrite Math,Regression,Python or earlier supervised evidence. Hydrate/validate before writes;retain latest20 compact summaries,latest full response and earned mastery within bounds. Confirmation is idempotent by immutable attempt ID.
- Corrupt,foreign,future,oversize or stale records preserve originals. Quota/denial/stale-tab failure keeps memory-only state and a truthful warning. No distributed atomic CAS,cross-device durability or tamper-proof credential claim. Semantic changes require new versions and separately approved mapping/archive decisions;no migration is proposed.

## 8. Notebook reproducibility requirements

One trusted notebook follows customer classification → linear geometry → soft margins/C → RBF locality/scaling → fold-only pipeline/development selection → same-row comparison/error analysis. Include prerequisite recall,prediction prompts,worked examples,bounded guided repairs,expected-output assertions and an explicit notebook-does-not-award-mastery notice.

Use the accepted tested local profile:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1 on macOS15.6.1 ARM64. Record seed,exact configuration/solver settings,feature/class order,training/scaler/fold IDs,dataset provenance/license,checksums and declared tolerances. Bundle small fictional data;no credentials,uploads,remote datasets or installation cells. SVC probability estimation remains disabled. Capture any deprecation/convergence warnings truthfully.

During implementation,execute in two fresh local kernels and compare canonical expected numerical/text outputs under declared tolerances,with environment and source/output hashes. No notebook was created or executed in this scope review. Local success is not genuine Google Colab verification;Colab remains a separate open gate.

## 9. Acceptance criteria for future implementation

| Area | Evidence required before implementation completeness |
|---|---|
| Coverage/depth |All20 families map to concept/motivation,math symbols,worked/changed example,practice A/B,independent A/B/C,feedback and remediation;all five exact O2 gates remain paired |
| Reference parity |All100 scored instances,every reviewed experiment state and worked calculation checked against independent geometry/hinge/kernel arithmetic and trusted sklearn fits as applicable;semantic provenance/causality assertions separately reviewed |
| Frozen assets |Exact scenes,finite grids,scaler/class-weight/fit IDs,solver/convergence/zero-tie conventions,expected supports/scores/classes/metrics,version IDs/hashes and byte-identical regeneration;no unreviewed states |
| Mastery |Each form:15/20 fails,16/20 passes with gates correct;30 valid-wrong critical-component failures (5×2×3) at otherwise passing19/20;blank/malformed,no mosaics,prior-mastery retention |
| Numerical semantics |Functional versus geometric margins,zero-norm states,score sign/equality,hinge,C direction,class weighting,RBF similarity versus decision score,actual support membership and convergence limitations |
| Leakage/selection |Training-only and separately fold-only scaling/weights;invalid global scaling,test-tuned C/gamma/thresholds,fit/predict boundaries and matched-row comparisons rejected;test untouched during development |
| Evaluator/retries |Equivalent correct numbers/whole repair tuples,malformed/unsafe/oversize input,unsupported-versus-wrong feedback,practice exhaustion/recovery,whole-form rotation,review/reconfirmation,idempotent submit |
| Persistence |Practice/lab/draft/result restoration,corruption,quota/denial,stale tabs,foreign/future versions and no cross-module writes;truthful memory-only warnings |
| Regression/build |Complete frontend/TypeScript and Python regression suites,typecheck,production build;preserve Math,Regression,all Python modules and EV/PR/RG/LG/KN/NB/DT/RF/GB behavior |
| Live UI/accessibility |Actual keyboard controls/tab order/focus,predict/reveal/change/explain/reset,320px no document overflow,local focusable numerical scrolling,semantic text alternatives,reduced motion,route/back-forward and progress isolation |
| Notebook |Two fresh local kernels with matching expected outputs and complete dependency/dataset/seed/solver metadata;no credentials/uploads/remote data |

Use source-identical isolated QA if original-directory I/O remains unreliable;record hashes and environment differences. Prior GB test/build/manual results are baseline evidence only,not results for unimplemented SVM.

## 10. Findings,decisions and stop

No material conflict in the approved task identifier,counts,objectives,prerequisites or mastery policy was found. The two-lab allocation supports linear and RBF binary classification;hard-margin teaching fits contextually without an added solver. No mesh,regression or calibration expansion is needed.

Scope-review validation passed:all local authority links,five lesson rows,five paired-gate rows and assessment totals match;all517 accepted application/public/package/Python source hashes remain unchanged against Task015.9 evidence. No application regression,typecheck,build,manual-accessibility or notebook pass is claimed for this documentation-only checkpoint.

Founder decision requested:review and approve this bounded specification before any application implementation. Recommend separately authorizing experiment reference freeze next. Exact datasets,state counts,parameter/class-weight grids,metric/selection ties,zero-score library behavior and solver tolerances remain explicit numerical-authoring prerequisites for that later freeze,not falsely approved/frozen outputs. No additional curriculum-count or mastery-policy decision is required now. Any inability to resolve those conventions within this approved boundary must be escalated before freezing or implementing that portion.

OPEN:genuine screen-reader,genuine browser zoom,genuine Google Colab execution and original-directory I/O reliability. Finite-bank memorization,editable local evidence,tiny synthetic data/kernel resource limits and later comprehensive pedagogical audit remain risks. No application implementation,new fixtures,model fits,notebook execution,learner-evidence access,mastery-policy changes,deployment,external learner testing,migration or subsequent task work performed. Stop for founder review.
