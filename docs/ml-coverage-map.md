# ML coverage map

What a learner needs to do machine learning well, against what the course teaches today.
Status: ✅ taught · 🟡 touched inside another lesson · ❌ missing (new lesson needed).

## Math (6 modules, 40 lessons)

| Need | Status | Where / note |
|---|---|---|
| Variables, functions, graphs, powers, logs, transformations | ✅ | algebra |
| Vectors, dot product, matrices, composition, span, inverse, eigen | ✅ | linear |
| Norms and distance (L1, L2, cosine) | 🟡 | used in KNN/regularization, never taught | ❌ new: linear/norms
| Projection and orthogonality (least squares geometry) | ❌ | new: linear/projection
| SVD and PCA | ❌ | new: linear/svd
| Derivatives, chain rule, gradients, backprop trace | ✅ | calculus |
| Partial derivatives and the Jacobian | 🟡 | gradient lesson | deepen in rewrite
| Counting, AND/OR, conditional, Bayes, distributions | ✅ | probability |
| Expectation and variance | ❌ | new: probability/expectation
| Joint, marginal, independence | 🟡 | multiple-events |
| Likelihood and maximum likelihood | ❌ | new: probability/mle
| Entropy, cross-entropy, KL divergence | ❌ | new: probability/information
| Law of large numbers, central limit theorem | 🟡 | sampling | deepen
| Descriptive stats, spread, correlation vs cause, sampling, errors | ✅ | statistics |
| Confidence intervals and hypothesis tests | ❌ | new: statistics/inference
| Bias–variance trade-off | 🟡 | regularization, polynomial | new: statistics/bias-variance
| Objectives, gradient steps, landscapes, step size, regularization | ✅ | optimization |
| Convexity | ❌ | new: optimization/convexity
| SGD, momentum, Adam | ❌ | new: optimization/stochastic
| Constraints and Lagrange (SVM margin) | ❌ | new: optimization/constraints

## Python (6 modules, 33 lessons)

| Need | Status |
|---|---|
| Essentials, NumPy, pandas, visualization, preparation, scikit-learn | ✅ |
| Writing small classes and reading files | ❌ new: python/essentials extra |
| Autograd and a tiny PyTorch loop | ❌ new: python/autograd |

## Algorithms (13 modules, ~65 lessons)

| Need | Status |
|---|---|
| Linear regression, polynomial, regularization, logistic | ✅ |
| KNN, naive Bayes, trees, forests, boosting, SVM | ✅ |
| Evaluation, model selection, neural network (MLP) | ✅ |
| Clustering (k-means) | ❌ new module |
| Dimensionality reduction in practice (PCA) | ❌ new module (after linear/svd) |
| Class imbalance, anomaly detection | ❌ new module |
| Feature engineering and data leakage as a topic | 🟡 preparation | consolidate |
| Interpretability (permutation importance, partial dependence) | 🟡 RF importance | new module |
| Text and sequences (bag of words, embeddings idea), CNN idea | ❌ new module |
| Time-series basics | ❌ new module |

## Order of work

1. Rewrite existing lessons to the approved depth: Algorithms first, then Math, then Python.
2. Add the missing Math lessons first (they unlock Algorithms): norms, expectation, MLE, information, convexity, stochastic steps, SVD.
3. Add new Algorithms modules: clustering, PCA, imbalance and anomalies, interpretability, text and sequences, time series.
