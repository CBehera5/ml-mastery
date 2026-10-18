# Task015.11 — Introductory Multilayer Perceptrons: bounded scope verification

17 October2026 · Specification only; founder review pending. Task015.10 is founder-accepted. No MLP application,fixtures,notebook or mastery implementation is authorized by this document.

## 1. Authority and scope reconciliation

Reviewed authorities:

- [Task015 blueprint](SUPERVISED_LEARNING_BLUEPRINT.md):12-module planning allocation and lesson-depth contract.
- [Implementation decision package](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md):Task015.11 NN allocation,prerequisites,thresholds,paired gates,retries,evaluator bounds and progress isolation.
- [Exact objective matrix](supervised-lesson-objective-matrix.md#nn--introductory-mlp-classification-5):NN01–NN05,not newly invented MLP-prefixed objectives.
- [Mastery/evaluator policy](supervised-mastery-and-evaluator-proposal.md),[experiment designs](supervised-visual-experiments.md),[coverage/dependencies](supervised-algorithm-coverage.md),[implementation roadmap](supervised-implementation-roadmap.md).
- [Quality register](CURRICULUM_QUALITY_REGISTER.md),[SVM completion](TASK_015_10_COMPLETION.md) and its source-equality evidence.

Historical “not authorized” paragraphs describe earlier milestones;the latest founder authorization permits this scope review only. Task015.11 is introductory feedforward **binary classification**,not an advanced deep-learning course. Existing X-Ray is prerequisite weighted-sum intuition,not equivalent MLP completion.

| Approved deliverable | Exact allocation |
|---|---:|
| Lessons |5:NN01–NN05 |
| Essential objective families |20:four per lesson |
| Practice instances |40:two per family,A/B |
| Independent instances |60:three complete20-family forms,A/B/C |
| Total scored instances |100 |
| Paired critical gates |5:every lesson's O2 only |
| Core experiments |2:NN-E1,NN-E2 |
| Reproducible notebooks |1 |
| Independent mastery |16/20 AND both atoms of all five gates in one confirmed attempt |

Prerequisites are EV,LG and RG01 plus existing X-Ray,chain rule and matrices. Recall NumPy shapes/vectorization,Python sklearn workflows,training-only scaling and separately fold-only pipelines. These are contextual recommendations,not route locks or automatic evidence transfers. SVM is the preceding delivery milestone,not an additional mathematical prerequisite.

Direct ML anchors:fictional customer-churn classification and comparison with human-reviewed Good/Needs Improvement documentation labels. No production documentation data is collected. House-price prediction is a task-suitability contrast,not authorization for MLPRegressor or a capstone. No CNN,RNN,transformer,GPU,deep-learning framework,multiclass/multilabel extension,arbitrary architecture builder or hosted training.

## 2. Exact lesson/objective coverage

The following O1–O4 statements reproduce the approved matrix in order. Every objective has practice A/B and independent A/B/C;O2 has mandatory decision/calculation AND reason/transfer. Other families may have one or two required atoms without becoming critical.

| Lesson | O1 | O2 — paired critical | O3 | O4 | Core lab |
|---|---|---|---|---|---|
| NN01 — Beyond one neuron |Trace input/hidden/output shapes and parameters |Explain why nonlinear activations are needed between linear layers |Calculate a two-layer forward pass |Relate to existing X-Ray weighted sums |NN-E1 |
| NN02 — Learn through gradients |Read chain-rule dependencies |Distinguish training gradient updates from fixed-weight prediction |Calculate one supplied bounded gradient step |Recognize saturation/dead-activation cases |NN-E2 |
| NN03 — Capacity and regularization |Compare tiny architecture parameter counts |Explain overfit/regularization/early-stopping trade-offs without promising global optimum |Read training/development loss curves |Diagnose convergence warnings |NN-E1/E2 |
| NN04 — Reproducible safe workflow |Trace seed, scaling and solver configuration |Reject leaked preprocessing/stopping and explain train/fold boundaries |Repair an authored MLP pipeline |Separate deterministic configuration from cross-host exact arithmetic |NN-E2 |
| NN05 — Interpret limits |Compare MLP/Logistic/tree evidence |Reject causal, guaranteed-best or hidden-layer-as-human-concept claims |Report resource/shift/calibration limitations |Choose a simpler adequate baseline when justified |NN-E1/E2 |

Coverage arithmetic per lesson:four families,eight practice,twelve independent instances,one paired gate. Total5×4=20,5×8=40,5×12=60. Do not add hidden gates for loss arithmetic,ReLU derivatives or seed recall;assess them within the existing objective meanings.

### Teaching depth and progressive examples

Every lesson follows real problem → visual intuition → experiment → mathematics → trusted Python → evaluation → comparison. Explain neurons as weighted sums plus activation,weights as learned coefficients,biases as offsets and layers as composed mappings before tensor notation. Numerical teaching must explain every shape,symbol,loss denominator and parameter update.

| Lesson | Motivation,worked/changed examples and ML application | Misconception → remediation and success criterion |
|---|---|---|
| NN01 |A single linear churn rule cannot represent every interaction. Trace x through hidden preactivations,ReLU or sigmoid and a binary sigmoid output. Start with ReLU(2−1)=1,output logit2,p≈.8808;then change a bias/input. Compare an identity-hidden network by multiplying its affine layers. Connect each operation to X-Ray and NumPy matrix multiplication. |“Stacking linear layers automatically adds nonlinear expressiveness” → collapse the matrices AND biases into one affine rule;identify where a nonlinear activation changes the result. Correct shapes,forward values and transfer explanation are required. |
| NN02 |Trace how one parameter affects a downstream loss. Start w=1,g=.2,eta=.1 → w=.98;then show a full tiny-network backward pass with supplied factors and simultaneous updates. Contrast fixed-weight inference,small/large learning-rate updates,sigmoid saturation and an inactive ReLU. |“Prediction learns from every query / subtract loss instead of gradient” → freeze parameters during inference and trace dL/dw,not L. Compute the changed step and explain which operation may alter learned state. |
| NN03 |Compare1-hidden-unit and2-hidden-unit capacity on the same classification task. A2→2→1 network has4+2+2+1=9 learned weights/biases. Inspect training versus development loss,an L2 contrast and a finite stopping trace. Explain warnings and why adding units/iterations may hurt generalization. |“More units or a decreasing training loss guarantees the best model” → use held-out curves and convergence evidence,distinguish underfit/overfit from optimization failure. Explain a permitted capacity/regularization/stopping choice without a global-optimum promise. |
| NN04 |Build a trusted StandardScaler→MLPClassifier workflow,record solver/seed and training IDs. Trace scaler and classifier refitting inside each CV training fold;repair finite pipeline tokens. Contrast reproducible settings with leaked stopping or globally fitted scaling. |“A seed or a pipeline name proves validity” → identify actual rows consumed by every learned step and stopping choice. Reject a leaked plan and explain training/fold/test permissions. No claim that identical seed guarantees cross-host bit identity. |
| NN05 |Compare MLP,Logistic and a small tree on matching rows/targets/metrics. Use equal development error with different fitting/query costs as a counterexample. Discuss probability calibration,shift,small subgroups and hidden-unit permutations. |“A hidden unit is inherently a human concept / flexibility implies causality or universal superiority” → separate parameterization from interpretation and report missing evidence. Justify a simpler adequate candidate or a bounded nonlinear alternative using measured trade-offs. |

Sigmoid and ReLU are taught explicitly;identity is a bounded contrast,not a third algorithm. Binary cross-entropy belongs to forward/loss/gradient examples;L2 and early-stopping intuition belong to NN03 and safe permissions to NN04. Backpropagation is the chain rule computing gradients,not the optimizer itself. No full automatic-differentiation engine,arbitrary symbolic differentiation or convergence proof.

For each objective,implementation must supply a progressively changed example,objective-specific incorrect-reason feedback,a worked correction and a contextual recall link. The seeds above are not finished teaching content.

## 3. Critical gates and failure paths

| Exact gate | Decision/calculation AND reasoning required | Failure and targeted remediation |
|---|---|---|
| NN01.O2 |Recognize affine-layer collapse versus genuinely nonlinear composition;explain why hidden nonlinear activation matters |Accept linear stacking as sufficient → multiply a two-layer affine example including biases,then compare a changed ReLU input. |
| NN02.O2 |Distinguish a training parameter update from fixed-weight inference;explain the loss/chain-rule/update dependency |Treat prediction as a weight update or backprop as automatic parameter movement → trace unchanged inference parameters,then a separate gradient and optimizer step. |
| NN03.O2 |Choose a defensible capacity/L2/stopping trade-off without guaranteeing unseen improvement or global optimality |Choose solely by training loss or promise universal success → compare crossing training/development curves and a warning-bearing counterexample. |
| NN04.O2 |Reject leaked preprocessing/stopping;explain both training-only and separately fold-only fitting |Accept test-based stopping/global scaling → annotate scaler,network and stopping row IDs for each fold;reserve final test. |
| NN05.O2 |Reject causal,guaranteed-best and intrinsic-human-concept claims about hidden layers;explain the evidence limitation |Infer causal or semantic certainty from a prediction/unit → contrast equal predictions under relabeled hidden units and matching-row baseline results. |

Either component wrong prevents mastery,even at19/20. Feedback names the failed atom,shows its changed counterexample and recommends recall. Retrying is a whole new independent attempt,not replacement of a failed gate inside an earlier total. Forward-pass numerics and activation behavior remain covered by NN01.O1/O3 and NN02.O4;do not silently make those noncritical IDs additional gates. The approved O2 meanings protect the associated conceptual reasoning.

## 4. Experiment fixture plan — not yet authored or frozen

Both labs retain their approved mappings. Exact datasets,weights,biases,learning rates,architectures,epoch budgets,state counts,outputs,solver settings and hashes require a later reference-freeze checkpoint. No numerical parity or fitted-model result is claimed here. Keep each **complete** configuration set at most64,including invalid/undefined/warning scenes;controls must not create unreviewed Cartesian combinations.

### NN-E1 — Small-network forward signals and nonlinear capacity

- Mapping:NN01,NN03,NN05. Prerequisites:weighted sums,dot products,matrix dimensions,Logistic sigmoid and class/probability distinctions.
- Proposed tiny binary fictional dataset with named2D feature units,stable train/development/query IDs and disjoint sealed test IDs. Use one-hidden-layer1-unit/2-unit architectures only;binary output has one sigmoid unit. A manual identity-hidden scene contrasts affine collapse;ReLU and sigmoid hidden scenes demonstrate nonlinear effects. Any alternative architecture must stay within the approved tiny-network boundary and be enumerated before freeze.
- Controls:choose one authored input/weight/bias/activation/architecture scene or one approved fitted-model snapshot. “Change weights” selects fixed authored values;no unrestricted parameter entry,training slider or arbitrary graph editor.
- Predict before reveal:a named preactivation/activation/output,dimension,parameter count or justified class/interpretation. Change a scene,re-predict,inspect the changed values,explain and transfer.
- Reveal:layer graph plus exact input matrices,coefficient orientation,bias vectors,weighted sums,activations,output logit/probability and named class rule. Manual networks are illustrative,not fitted optima. Fit-backed scenes reconstruct trusted MLPClassifier outputs from exported weights without inferring a unit's human meaning.
- Compare a fixed linear baseline and nonlinear candidate on the same permitted observations. Use at most64 plotted points plus authored paths;no unapproved dense decision mesh or invented exact contour.
- Accessible alternative:ordered layer trace with shapes,scalar values,parameter counts,input/output units and text explanation. Color,animation,hover and graph position are never the sole information source.

### NN-E2 — One gradient step,training traces and safe stopping

- Mapping:NN02–NN05. Prerequisites:chain rule,derivatives of sigmoid/ReLU,loss versus gradient,gradient descent,regularization and held-out evaluation.
- Separate two explicit kinds of scene:(a) manual supplied tiny-network forward/backward/update arithmetic;(b) trusted MLPClassifier training snapshots. A hand step must not be presented as an Adam or stochastic-library trajectory unless that exact optimizer/state is actually reproduced.
- Controls:choose a finite authored learning rate/update/activation state,training epoch/capacity/L2 contrast or fit/stopping provenance scenario. No free-form optimizer code,arbitrary epoch count or hidden unreviewed seed search.
- Predict before reveal:gradient sign,changed parameter,post-step output/loss,valid stopping decision or warning interpretation. Reveal chain-rule factors,all gradients,simultaneous updated weights/biases,and separately recomputed post-update loss.
- Training scenes expose epoch,solver,initialization,optimizer state needed for replay,training/development losses,selected checkpoint and row permissions. A local training improvement does not guarantee development improvement;large steps can worsen loss. Inference does not update scaler,weights or optimizer state.
- **Recommended stopping protocol for founder review:**explicit external development partitions and finite checkpoint selection;fit scaler/network only on training rows,select by development binary log loss,break declared numerical ties toward the earliest checkpoint,keep test sealed. Disable implicit library early stopping in these reference experiments. This is a proposed numerical/workflow convention,not an already frozen policy. Inside CV,an optional stopping subset must come only from that fold's training portion;the outer evaluation fold cannot choose epochs. Without such a subset,use a predeclared fixed training budget.
- Provide valid/invalid training/fold/test boundary scenes and explicit nonconvergence warnings. Warnings may be educational states;never call a capped or warning-bearing optimization converged or optimal.
- Accessible alternative:chain-rule dependency list,gradient/update table,training/development/checkpoint table,fit-ID timeline and concise text conclusions. Large immutable traces remain separate from learner envelopes;no hundreds-of-values live announcement.

Every experiment needs stable fixture/version/configuration IDs,authored prediction options,post-observation explanation/counterexample IDs,exact inputs/expected outputs and checksums. All reachable states must pass trusted references and byte-identical regeneration before freezing.

## 5. Numerical and library conventions to freeze

These are authoring requirements and recommended bounded choices,not approval to generate fixtures in this review.

1. Use row-major batches X of shape(n,d),weights W1(d,h),b1(h),W2(h,1),b2(1). Hidden Z1=XW1+b1,A1=g(Z1);output z2=A1W2+b2,p=sigmoid(z2). State any scalar/column-vector alternative explicitly and transpose it correctly. Count learned weights AND biases;two affine layers collapse including their combined bias.
2. Define sigmoid stably,ReLU=max(0,z),sigmoid derivative a(1−a),and ReLU derivative1 for z>0/0 for z<0. At0,ReLU is mathematically nondifferentiable;recommend the pinned library's derivative convention0 for an explicitly tagged kink scene. Never claim a central finite-difference check proves differentiability there.
3. Binary labels0/1 must have a named positive class and consistent class-column order. A binary sigmoid output is a model probability estimate,not evidence of calibration,causality or reliability under shift. Keep logits,probabilities and class decisions distinct.
4. **Local source inspection finding:**in approved sklearn1.9.1,MLPClassifier uses logistic binary output and LabelBinarizer inverse thresholding uses strict greater-than. Recommend native fitted predictions p>0.5→class1,p=0.5→class0,verified during freeze;do not copy SVC's score>=0 or another module's threshold convention. If illustrating an explicit >=0.5 decision policy,label it separately and do not claim parity with native predict.
5. Define mean binary cross-entropy via stable logits:mean(logaddexp(0,z)−y*z). For unweighted n rows,MLP L2 objective adds alpha/(2n) times the sum of squared weight matrices,excluding biases;mean gradient adds alpha*W/n. Equal numeric alpha is not automatically equivalent to another model's normalization. Unweighted dense data is the recommended introductory boundary;no unapproved sample-weight/resampling extension.
6. For a tiny manual batch,output delta=p−y;hidden delta=(output delta times W2 transpose) elementwise g'(Z1). Show the mean and L2 terms explicitly. Compute every gradient using the SAME pre-update parameters,then apply theta_new=theta−eta*gradient simultaneously. Backprop computes gradients;the optimizer applies updates. Adam/momentum updates are not this plain-gradient formula.
7. Freeze solver,learning schedule,batch size,shuffle,momentum/Nesterov or Adam settings when applicable,alpha,initialization,seed,max_iter,tol,n_iter_no_change and stopping policy explicitly;do not use unknown defaults. Repeated fit with warm_start is not assumed equivalent to uninterrupted optimizer state;partial_fit continuation or an explicit reference loop requires documented state semantics and public-API parity. Choose the smallest verified mechanism supporting the two approved labs.
8. Library training loss_curve_ need not equal post-update full-batch data-only log loss. Record which rows,parameter snapshot,penalty,aggregation and epoch timing each loss refers to;compute displayed comparison metrics independently. Freeze convergence-warning/iteration-limit outcomes rather than hiding them.
9. Use central finite differences for each weight AND bias of smooth,non-saturated reference states,with fixed epsilon and absolute/relative tolerances selected before freeze. Test multiple small epsilon values to separate truncation and cancellation;check ReLU only away from kinks or label one-sided/subgradient behavior separately. Recommended starting epsilon1e−5 and gradient tolerances1e−6 absolute/1e−4 relative require actual evidence before locking;these are not answer-grading tolerances.
10. For extreme logits,distinguish mathematical sigmoid limits,finite-precision rounding,mathematical infinite cross-entropy at a contradictory exact endpoint,and library probability clipping. Never coerce undefined/infinite outcomes to numeric0. Endpoint illustrations use finite tagged choices;finite-number answer bounds remain unchanged. Freeze stable logit-loss calculations separately from library clipped-probability reports.
11. Full-precision reference values govern classes and comparisons;round only display. Default answer/reference scalar tolerance1e−9 absolute+relative applies where appropriate;solver,gradient and cross-host reproduction tolerances are separate and must be justified. IDs,shapes,row permissions and class labels compare exactly.
12. Scaling fits on training rows only,and separately inside every CV fold. Development data may guide the explicitly permitted selection,not fit scaler weights or network gradients;test never chooses architecture,activation,alpha,learning rate,epochs,threshold or seed. Freeze candidate ordering,selection metric/direction/ties and rejected configurations. No training score alone establishes generalization.

Read-only source/API inspection used the existing approved environment;no fitting or gradient experiment was run. It confirmed coefficient orientation,binary output,unpenalized biases,L2/n normalization,ReLU's implemented zero derivative and strict binary prediction comparison. One attempted lookup of a nonexistent private _compute_loss method was corrected by inspecting _backprop/_compute_loss_grad;no application dependency on private internals is proposed. Constructor/source inspection is not numerical parity,convergence or cross-host verification.

## 6. Evaluator,completion and persistence boundaries

Reuse the supervised-local deterministic architecture and existing finite-answer primitives,without changing Math,Regression,Python or earlier supervised registries.

- Allow authored finite choice IDs,typed finite numbers and predefined complete repair tuples only. Fixed forward/gradient arithmetic uses authored immutable inputs;there is no general neural-network/expression interpreter.
- Numeric magnitude<=1e6;default abs(answer−expected)<=1e−9+1e−9*abs(expected). Decimal field parsing is an input adapter,not permission to coerce strings/Booleans/objects at the scorer. Reject NaN,Infinity,code,expression strings and unsupported shapes. Distinguish unsupported format from a valid wrong number. Tagged endpoint/kink/undefined states use finite options.
- Preserve32 families/attempt,two atoms/family,eight choices/slots/accepted whole tuples;atom512B,family1.5KiB,submission64KiB,envelope256KiB,depth8. Snippets25lines/4KiB;learner arrays rank<=2,dimensions<=32,total<=64 cells;tables32×8,fixture strings120characters. Immutable model/epoch traces are separately validated assets,not larger learner answers. No unapproved scene-bound expansion.
- Reject unknown operations/versions,extra keys,unsafe/deep/oversize records before scoring,with bounded safe feedback. Do not echo attacks or stack traces. Exact accepted repair tuples get equal credit;mixing individually valid tokens into an unapproved whole tuple does not.
- Prohibit learner code execution,unrestricted imports,eval/exec,arbitrary callable/derivative interpretation,filesystem/network/shell access,uploads and model deserialization. Trusted offline author notebooks remain separate.
- Lesson completion:four correct practice families,a changed prediction/reveal/explanation interaction and a correct bounded transfer explanation. Practice allows two valid submissions per variant/cycle;invalid format consumes none. Exhaustion requires worked review,changed recall and explicit recovery,not deletion of history.
- Independent mastery stays disabled until all lessons,forms,gates,references and mandatory implementation checks verify. Require16/20 plus all five paired gates in ONE confirmed attempt. No partial-family points,cross-attempt mosaics,cross-module imports or completion/notebook mastery. Correct noncritical gaps in a passing attempt remain gaps,not fabricated100% completion.
- Unlimited independent fresh IDs rotate complete forms A/B/C. No active correctness reveal;review and explicit confirmation precede submission. Reloaded review requires reconfirmation. Remediation recommends recall without creating a prerequisite navigation lock. Preserve earlier same-version mastery after later failure.
- Separate NN versioned scope;proposed key ml-math-lab:supervised:mlp:full:v1,content supervised.mlp.1.0.0,policy supervised.mlp.policy.1.0.0,assessment supervised.mlp.mastery.1.0.0. These are reserved design candidates,to be frozen with fixture ownership before implementation;objective IDs remain NN.
- Hydrate/validate before writes;one canonical failure-safe commit per immutable attempt ID;retain latest20 compact summaries,latest full response and earned mastery within envelope bounds. Corrupt,foreign,future,oversize/stale records remain untouched. Quota/denial/stale-tab failure preserves originals and truthful memory-only warnings. No cross-device,distributed-CAS or tamper-proof credential claim.
- No migration or old-evidence copying. Semantic changes require new versions and separately approved mapping/archive decisions;never regrade earlier mastery silently. Preserve all prior scopes,including SVM,X-Ray and Regression.

## 7. Notebook reproducibility requirements

One trusted notebook follows NN01–05:fictional classification problem → forward layer trace → chain-rule/gradient step → capacity/L2/development curves → safe scaler/MLP pipeline and fold-only fitting → matched-row Logistic/tree comparison and error analysis.

Include plain-language motivation,prediction prompts,worked/changed examples,shape/symbol explanations,bounded guided repair,expected output assertions,warning interpretation and explicit no-mastery notice. Embed small fictional data with stable IDs/units,provenance/license declaration,train/development partitions,sealed test policy and checksums. No credentials,uploads,remote datasets or installation cells.

Use accepted tested local profile:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1 on macOS15.6.1 ARM64. No install/upgrade proposed. Record seed,solver/optimizer/initialization/scaling settings,fit/fold/stopping IDs,objective normalization,versions and source/output hashes. Two fresh local kernels must match canonical numerical/text outputs within frozen tolerances;timings are not deterministic target outputs. Log warnings and label expected pedagogical nonconvergence. Genuine Colab remains a separate unverified gate;local notebook success never substitutes for it.

## 8. Future implementation acceptance criteria

| Area | Required evidence |
|---|---|
| Coverage/depth |All20 exact families map to teaching,motivation,math/symbols,worked/changed examples,ML application,practice A/B,independent A/B/C,misconception feedback and targeted recall. |
| Reference parity |All100 scored instances,every reachable state and worked numeric example independently checked using scalar/NumPy arithmetic and trusted MLPClassifier where applicable;semantic inference/causality claims separately reviewed. |
| Forward correctness |Shapes,bias broadcasting,parameter counts,affine collapse,ReLU/sigmoid,output class order/threshold equality and exported-weight forward parity. |
| Gradient correctness |Every tiny-network weight/bias gradient checked analytically and with declared finite differences away from kinks;simultaneous update,mean/L2 normalization,saturation/dead-unit and small/large-rate behavior. Manual SGD is not mislabeled Adam. |
| Frozen experiments |At most64 states per lab;exact data/weights/fit IDs/optimizer/epoch traces,seeds,selection rules,outputs,invalid/tagged cases,versions/hashes and byte-identical regeneration. No unreviewed sliders,architectures or meshes. |
| Mastery |All three forms:15/20 fails,16/20 passes with gates correct;all30 valid-wrong critical-component scenarios(5×2×3) fail at19/20. Test blanks,no partial gate credit,no mosaics,retained earlier mastery and release-disabled behavior. |
| Leakage/evaluation |Separate train-only and fold-only scaling/network fits;test-tuned stopping,globally scaled folds,seed/candidate cherry-picking and invalid evaluation rows fail. Outer evaluation fold does not select its own epoch. Inference leaves all learned state unchanged. |
| Evaluator/retry |Equivalence/tolerance boundaries,whole repair tuples,malformed/unsupported/unsafe/oversize inputs,practice exhaustion/recovery,review/reconfirmation,idempotent submit,whole-form retry and useful feedback. |
| Persistence |Practice/lab/draft/result restoration,corruption/quota/denial/stale-tab handling,version ownership,no cross-module writes,no automatic imports and safe non-saved warnings. |
| Regressions/build |Complete frontend/TypeScript and Python suites,typecheck and production build;preserve Math,Regression,all Python modules,EV/PR/RG/LG/KN/NB/DT/RF/GB/SV behavior and notebooks. Record source equality if isolated QA is required. |
| Live UI |Keyboard-only controls/tab order/focus,predict/change/reveal/explain/reset,route/back-forward,320px no page overflow,focusable local numerical scrolling,semantic layer/gradient alternatives,reduced motion and progress isolation. |
| Notebook |Two fresh local kernels,matching canonical outputs,complete environment/data/seed/solver metadata and no credentials/uploads/remote data. |

Genuine screen-reader,genuine browser zoom,genuine Colab and original-directory I/O reliability remain OPEN unless actually evidenced. Carry accessibility obligations in the quality/release register;do not silently waive them or claim that automated/viewport checks satisfy them. Mandatory local correctness and leakage gates cannot be deferred to Task017.

## 9. Findings,founder decisions and stop

No conflict found in task identifier,five lesson boundaries,20/40/60 counts,five exact O2 gates,16/20 threshold,two labs or one notebook. No new objective or mastery policy is needed. Task015.12 MS remains separate;this module does not complete the full Task015 sequence.

One workflow choice needs approval as part of this bounded specification:recommend external development checkpoint selection with implicit library early stopping disabled,as detailed in NN-E2. Alternative:library-managed stopping with explicitly verified split/scaler semantics;it adds complexity and must not conceal global preprocessing leakage. The original blueprint requires early-stopping understanding but does not freeze this implementation convention.

After scope approval,recommend separate authorization to author and reference-freeze NN-E1/NN-E2 before application implementation. Exact state counts,weights/datasets,solver/optimizer state,epoch budgets,loss/gradient tolerances,endpoint/threshold conventions and tie rules remain that freeze's numerical prerequisites,not fabricated verified outputs. Escalate any inability to fit them within existing bounds.

Implementation planning allowance remains the approved2–3 person-weeks for NN content,two labs,references,notebook and local QA;not a delivery-date promise. No scope expansion or estimate reduction is implied by reusing the prior UI/evaluator. Risks:confusing optimizer with backprop,loss-curve timing,ReLU nondifferentiability,probability calibration,nonconvex convergence,finite-bank memorization,editable local evidence,tiny-data representativeness and cross-host floating variation.

Specification validation passed:five lesson rows reproduce all20 approved objective statements;five critical-gate rows,assessment arithmetic and local authority links reconcile. All535 accepted source files match the Task015.10 aggregate SHA256 06065cb9a247afee31b97e1643c5d443b17c01e534e79176495387324e861efc. Only this specification and four documentation status/register entries were authored. Local API/source inspection is read-only and does not establish fitted/gradient parity.

This review creates documentation only. No app/source/evidence/mastery change,new fixtures,training,gradient experiments,notebook execution,regression/build claim,dependency installation,deployment,migration,external learner test or subsequent task implementation. Existing SVM results are prior-module evidence only. Stop for founder review and await scope approval.
