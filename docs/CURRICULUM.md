# ML Math Lab curriculum direction

> Historical implementation record through Task 009.4. The approved V1 inventory and future scope are canonical in `V1_CURRICULUM_MASTER_PLAN.md`; current gaps are canonical in `V1_CURRICULUM_GAP_AUDIT.md`.

## Learning philosophy

Every lesson follows the same connected loop:

1. **Intuition** — identify the concrete ML problem.
2. **Visualize** — manipulate values and observe behavior.
3. **Math** — name and derive the compact notation.
4. **Code** — implement the same operation explicitly.
5. **Debug** — diagnose a realistic contract or implementation failure.

Mathematics is included when it gives developers a useful model of actual ML behavior. It is not a detached prerequisite syllabus.

## Pathways

- **Math Intuition:** vectors/dot products, matrices/multiplication, and functions/derivatives complete; probability, statistics, and decompositions remain proposals.
- **Build Machine Learning:** the Neural Network X-Ray currently demonstrates a complete linear-neuron update.
- **Debug ML Models:** the wrong-direction gradient challenge currently demonstrates diagnosis and verification.

## Lesson 01: Vectors and dot products

- Objective: explain how an ordered feature vector and weight vector produce a scalar score.
- Prerequisite: basic arithmetic and array syntax.
- Interaction: edit three normalized house features and three fictional weights.
- Mathematical contract: equal-length, finite one-dimensional vectors; elementwise contributions followed by a sum.
- Code artifact: NumPy/Colab notebook.
- Debug objective: distinguish shape validity from semantic feature-order validity.
- Completion: all five stage-specific actions must be demonstrated.
- Next lesson: Matrices & Matrix Multiplication.

## Lesson 02: Matrices and matrix multiplication

- Objective: batch feature vectors, reason about compatible shapes, and connect output columns to neurons.
- Prerequisite: vectors and dot products recommended.
- Interaction: select and edit matrix rows, columns, cells, and weights while inspecting row-product traces.
- Mathematical contract: matrix-vector `(m,n)@(n,)→(m,)` and matrix-matrix `(m,n)@(n,p)→(m,p)`.
- Code artifact: NumPy/Colab notebook with fourth-house, weight-change, shape, and two-output exercises.
- Debug objective: repair a missing feature weight without truncating, transposing, or changing feature meaning.
- Completion: group the examples, execute the batch, answer the shape question, copy the exercise, and verify the semantic fix.
- Next lesson: Functions, Graphs & Derivatives.

## Lesson 03: Functions, graphs, and derivatives

- Objective: interpret a derivative as the local response of an output—and especially model loss—to a small input or parameter change.
- Prerequisite: basic algebra; the previous vector and matrix lessons are recommended but not required.
- Interaction: change linear and quadratic parameters, shrink a secant interval toward a tangent, and compare the loss slope at `w=2`, `w=3`, and `w=4`.
- Mathematical contract: finite scalar evaluation, analytical derivatives, central finite differences, secant slopes, and tangent-line traces.
- Code artifact: NumPy/Colab notebook with analytical and numerical derivative checks.
- Debug objective: repair a missing chain-rule factor and verify it numerically.
- Completion: predict a function output, manipulate a graph, approximate a tangent, reason correctly at two loss-curve points, and verify the derivative fix.
- Next lesson: Gradients & Gradient Descent. The existing Neural Network X-Ray remains an optional preview, not a substitute for that lesson.

Do not commit to the remaining curriculum until this prototype is tested with learners alongside the private beta.

## Task 009: Linear Regression mastery pathway

The approved route namespace is `/learn/linear-regression/*`. Task 009.2 establishes nine independent entry points while recommending this learning sequence:

1. Why Linear Regression Exists
2. From Intuition to Equation
3. Measuring Prediction Errors
4. How Gradient Descent Learns
5. Multiple Linear Regression
6. Implementing the Algorithm
7. When Linear Regression Fails
8. Real-World Application
9. Independent Mastery Challenge

Functions and graphs, vectors, matrices, and derivatives are recommended refreshers, never route locks. Opening a lesson is not completion. Future completion must reflect lesson-specific evidence, while mastery must reflect objective-level performance through an assessment or project rubric. Task 009.2 contains navigation and metadata only; regression calculations, simulations, exercises, assessments, analytics, and mastery persistence remain intentionally deferred.

Task 009.4 activates five investigation labs: equation, errors, gradient descent, multiple features, and failure modes. Each follows Predict → Experiment → Observe → Explain → Apply, but none awards completion or mastery. The failure-mode lab requires evidence appropriate to each claim: overfitting includes separate training and validation results, while the nonlinear example contrasts a raw feature with a transformed feature and preserves linearity in learned parameters.

Task 011.1 completes `Why Linear Regression Exists` as the module's first verified educational lesson. Its three objectives cover prediction framing, regression-versus-classification distinction, and model suitability. Completion requires a correct prediction followed by reveal, a genuine feature-control edit, and two decision checks. Evidence is stored locally under the shared Linear Regression namespace; no mastery is awarded.

Task 011.2 verifies `Measuring Prediction Errors` and `Implementing the Algorithm`. Error Metrics requires signed-residual calculation, metric reasoning, an outlier experiment, and rejection of training-only evidence. Python Implementation requires seven deterministic checks spanning prediction, residuals, MSE, gradients, the update direction, one traced iteration, and a leakage-safe workflow. Its downloadable notebook runs from scratch through a scikit-learn comparison without repository imports. Both routes record objective completion locally and never award mastery. Equation, Gradient Descent, Multiple Features, and Failure Modes remain implemented labs; Project and Mastery remain planned.

Task 011.2 also establishes a deliberately small versioned concept registry for recurring regression, evaluation, and optimization terms. The two lessons use it for first-use definitions, intuition, symbols, and prerequisite refreshers. Curriculum-wide terminology, notation, recall, and continuity normalization remains deferred to Task 017 and is tracked in `TASK_017_CONCEPTUAL_DEPTH_BACKLOG.md`.
