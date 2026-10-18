# Task 015.11 — Objective and assessment coverage

The source of truth for the approved IDs and authored finite-answer family fixtures is `apps/web/app/supervised/mlp/catalog.ts`, `teaching.ts` and `authored.json`. Four objective families map to each lesson; each has two practice variants and one independent instance on each of forms A/B/C. The contract test asserts exactly 20 objectives, 40 practice instances, 60 independent instances and five paired gates.

| Lesson | Objective families | Core measurable coverage | Critical requirement |
|---|---|---|---|
| NN01 — Beyond one neuron | NN01.O1–O4 | Count network parameters; track batch/weight/bias shapes; explain why linear activations collapse; calculate a two-layer weighted forward pass; distinguish a neuron from an unexplained black box. | NN01.O2: demonstrate nonlinear activation's role and interpret the paired representation/mechanism components. |
| NN02 — Learn through gradients | NN02.O1–O4 | Follow the chain-rule path; distinguish fitting from inference; calculate a supplied plain-SGD update; identify saturation/inactive-unit behavior and avoid conflating gradient, loss and optimizer. | NN02.O2: correctly distinguish training updates from fixed-parameter prediction in both parts. |
| NN03 — Capacity and regularization | NN03.O1–O4 | Compare parameter counts; interpret train/development loss; reason about capacity, regularization, overfit and checkpoint choice; report convergence warnings. | NN03.O2: protect generalization reasoning and reject “lower training loss always means better model” in both parts. |
| NN04 — Reproducible and safe workflow | NN04.O1–O4 | Track seeds/solver/scaling provenance; identify train/validation/test boundaries; repair an authored pipeline; state limits of seeds and reproducibility. | NN04.O2: identify leakage and enforce fold-only preprocessing/model fitting in both parts. |
| NN05 — Interpretation and limitations | NN05.O1–O4 | Compare MLP with logistic/tree evidence; distinguish prediction from causality/calibration; report subgroup/resource/shift limits; select a simpler adequate baseline when justified. | NN05.O2: reject unsupported causal/universal-best/intrinsic-unit claims and state evidence limits in both parts. |

## Assessment and remediation contract

- Practice A/B and assessment A/B/C are separate deterministic authored families; evaluation checks exact finite-choice/numeric/repair representations, not Python code.
- A wrong or malformed attempt receives targeted concept feedback and remediation. Two attempts per practice variant precede reviewed remediation and an alternate/reopened cycle. Assessment responses do not reveal correctness before submission.
- Each independent form contains 20 objective families. Mastery requires at least 16 correct plus both atoms correct on every paired O2 gate, all in the same independent attempt, followed by review and explicit confirmation.
- Tests cover 15/20 failure, 16/20 success with gates intact, each of ten gate atoms failing on each of three forms, no cross-attempt evidence composition, and preservation of prior mastery after a later failure.
- Frozen experiments and notebook are learning/verification assets only; they do not contribute assessment credit or module mastery.

## Exercise/reference limits

100 authored scored family instances are bounded to declared answer options, numeric values/tolerances and predefined repair slots. They do not invoke a Python evaluator or general expression interpreter. Trusted Python/scikit-learn reference verification applies to the 73 frozen experiment configurations, eight runs/1,024 updates and the notebook calculations; learner-facing family scoring is deterministic against the authored contracts.
