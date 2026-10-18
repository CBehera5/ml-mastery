# MLP numerical,gradient and checkpoint conventions — v1

Task015.11 reference freeze only. NN01–05,20 essential families,40 practice,60 independent,five paired O2 gates,16/20 in one confirmed attempt,two labs and one notebook are unchanged. No application implementation or learner-evidence writes.

## Data and finite scene ownership

Original fictional customer coordinates,CC0-1.0,no personal records. Two pre-prediction feature indexes;0=stays,1=churns;class order[0,1]. Twelve training,six development,four query and four sealed test observations have exact stable IDs in both manifests. One deliberately noisy training target near the boundary illustrates fitting noise. No real documentation labels or production corpus.

Training-only StandardScaler uses population variance;means/variances/scales and fit IDs are exported. Development/query transformations use those statistics. Sealed test rows are never transformed,predicted,scored or inspected by model selection;future client replay must strip them. A separately labeled exact fold-permission example is not an executed CV score.

All controls select complete authored configurations,no free text/code/continuous sliders. NN-E1 enumerates manual forward scenes,two-hidden-unit fitted snapshots,numerical endpoint diagnostics and rejected cases. NN-E2 enumerates one-step gradient scenes,training checkpoints and rejected permissions/parameters. Every exposed invalid state counts toward the64-per-lab bound. Prediction/reveal/reset UI states do not introduce additional numerical configurations.

## Shape,orientation and forward pass

X:(n,2),W1:(2,h),b1:(h),W2:(h,1),b2:(1);h=1 or2. Row batches multiply on the left:Z1=X@W1+b1,A1=g(Z1),z2=A1@W2+b2,p=sigmoid(z2). Learned parameter count4h+1,including biases. Two affine layers with identity hidden activation collapse to X@(W1@W2)+(b1@W2+b2);they do not gain nonlinear expressive power.

Hidden identity is a contrast;sigmoid and ReLU are the taught nonlinearities. Stable sigmoid evaluates1/(1+exp(-z)) for nonnegative z and exp(z)/(1+exp(z)) otherwise. ReLU=max(0,z);sigmoid derivative=a(1-a). ReLU derivative1 at positive z and0 at negative z. At exact0,the mathematical derivative is undefined;the pinned library implements0. A tagged kink scene reproduces that chosen convention but explicitly does NOT claim a central finite-difference derivative exists there.

Public pinned MLPClassifier binary predict uses p>0.5→1,p<=0.5→0. Exact equality is tested independently. This differs from SVC score>=0 and from some explicit user decision policies;do not copy another module's equality convention. Hidden units are not intrinsically human concepts;output probabilities are not automatically calibrated risk.

Manual scenes contain supplied parameters and are not trained optima. Their arithmetic is checked by independent scalar loops,NumPy matrix operations and public predict_proba/predict using the same supplied parameters in a pinned offline reference object. Offline private initialization metadata does not turn the scene into a fitted or learner-executable model.

## Loss,gradients and update

For n unweighted rows,data loss=mean(logaddexp(0,z)-y*z). Full objective=data loss+alpha/(2n)*(sum(W1²)+sum(W2²));biases are not penalized. Sum loss versus mean loss must never be mixed. Native private reference gradients and pre-update loss are checked against independent arithmetic,not used as the sole oracle.

Output delta before mean=p-y;hidden delta=(output delta@W2.T)*g'(Z1). dW1=(X.T@hidden delta+alpha*W1)/n;db1=sum(hidden delta)/n;dW2=(A1.T@output delta+alpha*W2)/n;db2=sum(output delta)/n. Every gradient comes from the SAME old parameter snapshot. All parameters update simultaneously:theta_new=theta-eta*dL/dtheta. Backprop computes these gradients;SGD changes parameters. Prediction alone changes neither scaler,weights,biases nor optimizer state.

Manual learning rates.1/3 and alpha0/.4 expose small versus large steps and penalized versus unpenalized gradients. Separate dead-ReLU,exact-kink and saturated-sigmoid scenes illustrate limitations. Dead hidden-unit data gradients can be0 while output-bias gradient remains nonzero;with L2,zero data gradient does not imply zero penalized weight gradient.

## Trusted training and initialization

Eight runs:logistic/ReLU hidden activation × learning_rate_init .05/.5 × alpha0/.4,one hidden layer of2 units. Public MLPClassifier.partial_fit performs128 sequential one-epoch calls;full training batch12,solver=sgd,constant learning rate,shuffle=False,momentum=0,nesterovs_momentum=False,early_stopping=False,max_iter=1,tol=0,n_iter_no_change=10000,warm_start=False,seed1729. Full serialized get_params accompanies every run,including inactive settings. No Adam,momentum,implicit split or implicit early stopping.

The SAME estimator/SGDOptimizer continues across partial_fit calls;no repeated warm_start fit resets. With zero momentum,each full batch is exactly the plain simultaneous gradient update. First-call random initialization is independently reconstructed using NumPy RandomState1729:uniform bounds sqrt(factor/(fan_in+fan_out)),factor2 for logistic,6 otherwise;draw weight matrix then bias vector for each layer. Initialization and every subsequent weight/bias are checked.

The library resets n_iter_ per partial_fit call in this pinned version;manifest epoch is explicit call count. loss_curve_ records the pre-update batch objective,including L2;post-update training data loss/objective and development data-only loss are recomputed separately. Never label the native loss curve as a post-update validation curve. Incremental fixed-budget runs do not emit a max_iter convergence warning;this is NOT proof of convergence or global optimality. Their status explicitly says fixed-budget checkpoint/no convergence claim.

Each of1024 training updates exports old parameters,forward/chain factors,all gradients,updated parameters,losses and training/development outputs. These are immutable reference evidence;future presentation must show bounded selected rows/layers,not128-row live tables or large learner envelopes.

## Gradient verification and precision

Scalar-loop analytical gradients agree with NumPy and pinned sklearn private _backprop/_compute_loss_grad checks;private methods are offline author tooling only,not browser/backend API contracts. Public partial_fit independently verifies every actual update.

For EVERY smooth gradient-bearing state,central finite differences check all9 weights/biases with requested epsilon1e-5 AND3e-6:(L(theta+epsilon)-L(theta-epsilon))/(2epsilon). For ReLU,scale BOTH epsilons by min(1,min(abs(hidden preactivation))/(10*max(1,max(abs(X)))*1e-5)) to avoid crossing an adjacent kink while preserving two distinct perturbations;record actual epsilons per state. Require abs(fd-analytic)<=1e-6+1e-4*abs(analytic),without relaxing tolerance. Use float64,full objective and unchanged other parameters. Exact ReLU-kink state is tagged not-applicable,not counted as a passed derivative test. An initial draft's fixed epsilon crossed a near-zero ReLU branch;the explicit distance-bounded epsilon fixes the finite-difference procedure,not the analytical gradient.

Default numerical forward/loss/update parity:atol=rtol=1e-9. Gradient finite-difference tolerance above is separate from learner grading tolerance. IDs,labels,shapes,membership and selected epochs compare exactly. Full precision governs comparisons;display7 significant digits plus accessible full-precision details. Do not round before classifying or selecting. Reproducibility guarantee is the tested pinned environment,not cross-host bit identity.

## External checkpoint selection

Candidates are epochs[1,8,32,128],not all128 updates. Fit only training rows;minimize post-update DEVELOPMENT data-only mean binary log loss among those four. Within absolute1e-12 of the minimum,choose the earliest listed epoch. Each checkpoint configuration reports the SAME chosen epoch for its run,not an invented selection from one currently displayed score. A synthetic tie regression explicitly verifies earliest selection.

Implicit library early_stopping is disabled. No test loss or test-selected seed,activation,epoch,alpha or rate. Training budget128 is predeclared;selection is an external development choice,not a claim that the optimizer automatically stops there. A genuine increasing-development/decreasing-training tail must exist among frozen traces before freeze.

Inside CV,scaler/network fit only inner-training rows,optional stopping uses only an inner subset of the outer-training portion;the outer evaluation fold cannot select its own checkpoint. The fold plan lists exact permitted IDs;it illustrates permissions,not an additional fitted CV run. Invalid global scaling,test-selected checkpoints and outer-fold-selected epochs reject without fabricated predictions/gradients.

## Endpoint,invalid and diagnostic semantics

Mathematical sigmoid at finite logits is strictly between0 and1. At±1000,float64 rounds to0/1;stable contradictory-label logit loss remains finite1000. Treat an EXACT contradictory probability endpoint's mathematical log loss as tagged positive-infinity,distinct from finite-logit loss and sklearn log_loss's finite machine-epsilon clipping. Native clipping reports are recorded separately. Never serialize NaN/Infinity as JSON numbers or coerce them to0.

Reject shape mismatch,nonfinite weight,unsupported activation,nonpositive learning rate,nonfinite update,global preprocessing,test-guided checkpoint and outer-fold-guided checkpoint before producing outcomes. Invalid fields use explicit null/tagged states;no invented training result. Fixtures contain no learner-supplied payloads. Runtime payload validation remains the existing bounded evaluator's responsibility during future implementation.

## Regeneration and environment

Approved local profile:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1,macOS15.6.1 ARM64. No dependency installation/upgrade. Generator:work/freeze-task-015-11.py. From repository root,activate the approved Python environment and run `python work/freeze-task-015-11.py --freeze`,then rerun with `--check`. JSON is sorted-key,indented2,UTF-8,newline-terminated,allow_nan=False;timestamps/timings are omitted. Lock hashes both manifests,parity report,source-preservation report,generator and this convention file.

All535 accepted source files must retain the prior Task015.10 aggregate;no application route,evidence or mastery change. Genuine screen-reader,browser zoom,Colab and original-directory I/O reliability remain OPEN. Future100 scored exercises and notebook are not implemented/verified by this freeze.
