export type Destination = { title: string; href: string };
export const PYTHON_MODULES = [
  { id: "essentials", title: "Python Essentials", first: "/python/essentials/p01/module", why: "Types, units and ordered records make prediction code meaningful.", count: 8 },
  { id: "numpy", title: "NumPy", first: "/python/numpy/n01", why: "Shapes and ordered arrays turn weighted sums into reliable batch predictions.", count: 6 },
  { id: "pandas", title: "pandas", first: "/python/pandas/d01", why: "Labels and row identity keep features attached to the right observations and targets.", count: 6 },
  { id: "visualization", title: "Visualization", first: "/python/visualization/v01", why: "Honest charts reveal distributions and relationships without causal shortcuts.", count: 5 },
  { id: "preparation", title: "Data Preparation", first: "/python/preparation/t01", why: "Training-only preparation prevents evaluation information from leaking into a model.", count: 6 },
  { id: "sklearn", title: "scikit-learn", first: "/python/sklearn/s01", why: "Fit, predict and evaluate complete workflows on genuinely held-out observations.", count: 5 },
] as const;
export const MATH_LINKS: Destination[] = [
  { title: "Algebra, functions and graphs", href: "/math/algebra-functions" },
  { title: "Linear Algebra", href: "/math/linear-algebra" },
  { title: "Calculus", href: "/math/derivatives" },
  { title: "Probability", href: "/math/probability" },
  { title: "Statistics", href: "/math/statistics" },
  { title: "Optimization", href: "/math/optimization" },
  { title: "Mathematics integration practice", href: "/math/integration" },
];
export const STAGES = [
  { title: "Math Foundations", status: "Available", why: "Understand the mathematical language of ML.", connection: "Represent inputs and reason about change before implementing them.", links: MATH_LINKS },
  { title: "Python for ML", status: "Available", why: "Turn mathematical ideas into reliable code.", connection: "Use arrays, tables and training-only preparation to build a workflow.", links: PYTHON_MODULES.map(module => ({ title: module.title, href: `/python/${module.id}` })) },
  { title: "ML Algorithms", status: "Partly available", why: "Understand, train and evaluate prediction models.", connection: "Apply the foundations to a model, then inspect its errors on unseen data.", links: [{ title: "Linear Regression", href: "/learn/linear-regression" }, { title: "Evaluation Foundations", href: "/supervised/evaluation" }, { title: "Polynomial Regression", href: "/supervised/polynomial" }, { title: "Ridge, Lasso and Elastic Net", href: "/supervised/regularization" }, { title: "Logistic Regression", href: "/supervised/logistic" }, { title: "K-Nearest Neighbors", href: "/supervised/knn" }, { title: "Naive Bayes", href: "/supervised/naive-bayes" }, { title: "Decision Trees", href: "/supervised/decision-trees" }, { title: "Random Forests", href: "/supervised/random-forests" }, { title: "Gradient Boosting", href: "/supervised/gradient-boosting" }, { title: "Support Vector Machines", href: "/supervised/svm" }, { title: "Original EV01 prototype", href: "/supervised/evaluation/ev01" }] },
  { title: "Project Studio", status: "Planned", why: "Build complete ML solutions. The full studio and capstones are not available.", connection: "Bring data, models and evaluation together in an end-to-end project.", links: [] },
  { title: "Deployment & MLOps", status: "Future / unscoped", why: "Deliver, monitor and maintain models. No course is available yet.", connection: "A future extension beyond building and evaluating a model.", links: [] },
] as const;
export const CONNECTIONS = [
  { title: "Functions → Linear Regression", why: "A function maps features to a prediction; regression learns the rule's parameters.", links: [{ title: "Functions and outputs", href: "/math/algebra-functions/functions" }, { title: "Weight, bias and predictions", href: "/learn/linear-regression/equation" }] },
  { title: "Derivatives → Gradients → Gradient Descent", why: "Differentiate the chosen loss, collect parameter sensitivities, then choose a controlled update. A step is not a convergence guarantee.", links: [{ title: "Derivatives and partials", href: "/math/derivatives" }, { title: "Losses and gradients", href: "/math/optimization/objectives" }, { title: "Gradient updates", href: "/math/optimization/updates" }, { title: "Train Linear Regression", href: "/learn/linear-regression/gradient-descent" }, { title: "Apply one linear-neuron update in X-Ray", href: "/demo" }] },
  { title: "Vectors → Matrices → NumPy → Predictions", why: "Ordered features and compatible axes let matrix multiplication produce one prediction per observation.", links: [{ title: "Vectors and dot products", href: "/math/vectors-dot-product" }, { title: "Matrix multiplication", href: "/math/matrices-multiplication" }, { title: "Vectorized predictions", href: "/python/numpy/n04" }] },
  { title: "Statistics → Data Preparation → Evaluation", why: "Preserve row identity and population meaning; fit preparation inside each training fold before comparing unseen predictions.", links: [{ title: "Statistics in ML", href: "/math/statistics/ml" }, { title: "Aligned selection", href: "/python/pandas/d02" }, { title: "Fold-local preparation", href: "/python/preparation/t05" }, { title: "Unseen-data evaluation", href: "/python/sklearn/s02" }] },
  { title: "Python → scikit-learn → Model Training", why: "Functions and arrays become fitted workflows. Predict uses saved training state; it does not fit on test targets.", links: [{ title: "Python functions", href: "/python/essentials/p05" }, { title: "Estimator lifecycle", href: "/python/sklearn/s01" }, { title: "Complete model pipeline", href: "/python/sklearn/s04" }] },
];

