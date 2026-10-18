# MLP reference freeze — trusted parity report

17 October2026 · Specification and experiment reference freeze only. Application implementation,100 learner exercise instances and notebook execution are not part of this result.

## Frozen artifacts

- [NN-E1 manifest](nn-e1.manifest.v1.json):25 configurations:12 manually authored forward traces,8 trusted fitted-checkpoint forward states,2 numerical endpoint diagnostics,3 rejected configurations.
- [NN-E2 manifest](nn-e2.manifest.v1.json):48 configurations:11 manual gradient/update states,32 fitted training checkpoints,5 rejected configurations. Eight deterministic training trajectories each contain128 updates,for1024 sequential training updates.
- [Numerical and checkpoint conventions](NUMERICAL_GRADIENT_CHECKPOINT_CONVENTIONS.md) freeze shapes/orientation,activations,loss,optimizer,seed,finite-difference protocol,validation selection and invalid outcomes.
- [Machine parity report](parity-report.v1.json) records dependencies,counts,tolerances and checks. [Freeze lock](freeze-lock.v1.json) hashes both manifests,the report,source-preservation evidence,the generator and convention specification.

All73 configurations are within the64-state-per-experiment bound. Test inputs/targets are sealed:the generator never transforms,predicts,scores or selects with test rows.

## Reference verification

Used the accepted local profile:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1 on macOS15.6.1 ARM64. No dependency was installed or upgraded.

- Scalar Python forward traces match NumPy and pinned public MLPClassifier probabilities/classes. Maximum checked absolute parity error:3.552713678800501e−15.
- Manual analytical backpropagation agrees with an independent scalar calculation and the pinned private sklearn gradient reference used only by offline author tooling.
- All1024 public `partial_fit` updates match the separately calculated simultaneous full-batch SGD step. Random initialization is independently reconstructed and compared.
- 1,030 finite-difference checks cover nine parameters each at epsilon1e−5 and3e−6. Maximum analytical/central-difference absolute error:1.6872304942072702e−10 against the predeclared `1e−6 + 1e−4*|gradient|` bound. ReLU kink cases are tagged not applicable;no derivative test is falsely claimed at nondifferentiable zero.
- Stable logit binary loss,weight-only L2 penalty,training-only scaler statistics,pre-update sklearn loss-curve semantics,development loss,public class behavior at probability.5,dead/saturated activations and finite-logit versus endpoint-clipped loss distinctions are independently checked.
- A real training/development overfit counterexample is retained: `nn.training.relu.eta-0.5.alpha-0.0.v1`.
- The approved frozen configuration list selects among epochs1,8,32,128 by post-update development data-only binary log loss;ties within1e−12 select the earliest listed epoch. An explicit tie fixture verifies that rule.
- Early stopping is disabled in every fit. Final test is untouched. CV fit/stopping/outer-evaluation permissions are an explicit example,not a claimed fitted CV estimate.

## Regeneration and preservation

Generator: `work/freeze-task-015-11.py`. Serialization is canonical sorted-key UTF-8 JSON with two-space indentation,finite JSON numbers and a terminal newline. A clean generation followed by `--check` passes byte-identically:25/48 configurations,1024 updates and unchanged locked hashes.

Source-preservation report checks535 files against Task015.10;aggregate hash `06065cb9a247afee31b97e1643c5d443b17c01e534e79176495387324e861efc`;zero file changes. No learner storage was accessed.

## Known boundaries

Private sklearn gradient/initialization internals are used only as pinned offline corroboration;the primary analytical oracle is independent scalar/NumPy math and every real update is checked through public `partial_fit`. This does not create an application API contract. Public post-update traces and the library's pre-update `loss_curve_` are separately labeled.

No 100 scored learner exercises or notebook were generated. No app implementation,screen-reader/browser-zoom/Colab check or original-directory reliability claim is made. Cross-host exact floating-point identity is not guaranteed.
