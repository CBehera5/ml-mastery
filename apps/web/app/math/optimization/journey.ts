import type {LessonSlug} from "./content";
export const OPTIMIZATION_JOURNEY:Record<LessonSlug,{question:string;outcome:string;connection:string;explore:string;code:string;codeMeaning:string;transfer:string;reference:string;takeaway:string}>={
  "objectives": {
    "question": "What exactly are we trying to improve?",
    "outcome": "Read an objective and interpret its gradient as local sensitivity.",
    "connection": "A prediction model needs a defined measure of error. Optimization improves that chosen objective, not every possible real-world goal.",
    "explore": "Move a and b separately in the bowl. Predict which movement increases the objective; compare the gradient components. Try the saddle and inspect more than one direction before calling a stationary point a minimum.",
    "code": "a, b = 1.0, 0.0\nloss = (a - 3)**2 + b*b  # 4.0\ngradient = (2*(a - 3), 2*b)  # (-4.0, 0.0)",
    "codeMeaning": "The sum defines the explorer’s dimensionless round bowl, with its minimum at (3,0). Each gradient component measures local sensitivity to one coordinate with the other held fixed.",
    "transfer": "If a chosen training objective decreases, must every important product outcome improve?",
    "reference": "No. The objective is a modeling choice. It may omit important costs or fail to reflect unseen data; inspect both its meaning and the appropriate evaluation evidence.",
    "takeaway": "First define the objective and units. The gradient tells you its local response, not whether the objective is the right goal."
  },
  "updates": {
    "question": "How does a slope become a useful next step?",
    "outcome": "Explain simultaneous gradient updates and the role of learning rate.",
    "connection": "Calculus measures sensitivity. An optimizer turns that information into a controlled parameter change.",
    "explore": "Keep objective, starting point and budget fixed. Compare Rate 0.1, 0.5 and 1 using Next state. Predict the effect of a larger step, and inspect which gradient was used before either coordinate changed.",
    "code": "a, b = 1.0, 0.0\neta = 0.1\nga, gb = 2*(a - 3), 2*b\na_next = a - eta*ga  # 1.4\nb_next = b - eta*gb  # 0.0",
    "codeMeaning": "Both derivatives use the original point. Subtraction moves opposite the gradient; eta scales the displacement. New variables make the simultaneous nature of the update explicit.",
    "transfer": "Why is recomputing the second derivative after changing the first coordinate a different procedure?",
    "reference": "It evaluates components at different parameter states. A simultaneous step evaluates the entire gradient at one starting state before updating any component.",
    "takeaway": "Direction and distance are separate choices. An update rule must specify both the gradient state and step size."
  },
  "geometry": {
    "question": "Why can one step size behave differently in different directions?",
    "outcome": "Relate curvature and coordinate scale to update behavior.",
    "connection": "A bowl can be narrow in one direction and shallow in another. Equal coordinate steps need not produce equal changes.",
    "explore": "Select the narrow bowl and increase its curvature ratio while keeping the selected point fixed. Compare gradient components and the sampled map. Then compare the saddle: a flat slope in one view may hide a downhill direction.",
    "code": "a, b = 1.0, 1.0\nk = 10.0\nloss = (a - 3)**2 + k*b*b  # 14.0\ngradient = (2*(a - 3), 2*k*b)  # (-4.0, 20.0)",
    "codeMeaning": "The larger multiplier makes the objective more sensitive to b at this point. The same eta multiplies both gradient components, but their displacements can differ greatly.",
    "transfer": "Why might an apparently safe step along one coordinate overshoot along another?",
    "reference": "The objective can have different curvature by direction. A step size that suits a shallow direction may be too large for a steep one; a one-dimensional view hides that difference.",
    "takeaway": "Geometry shapes the update. Scaling may help, but it is not a universal convergence guarantee."
  },
  "stability": {
    "question": "What does a short training history actually prove?",
    "outcome": "Distinguish finite progress, instability and convergence claims.",
    "connection": "A trace lets you inspect what happened at recorded states. It cannot certify everything that would happen indefinitely.",
    "explore": "Use the same objective, start and budget. Compare rates 0.1, 1 and 1.1; inspect both state 0 and later states. Predict whether objective rises, falls or oscillates, and read the termination reason rather than treating every stop as success.",
    "code": "a = 1.0\neta = 1.1\nhistory = [(a - 3)**2]\nfor _ in range(3):\n    a = a - eta*(2*(a - 3))\n    history.append((a - 3)**2)\n# [4.0, 5.76, 8.2944, 11.943936] approximately",
    "codeMeaning": "With b fixed at 0, this is the round bowl used in the explorer. Each update multiplies the distance a−3 by −1.2: it crosses the minimum while that distance grows. The history includes state 0 and three completed updates, not four updates.",
    "transfer": "If loss fell for ten updates, can you conclude that training will converge or that unseen predictions are good?",
    "reference": "No. You have evidence about those finite states. Convergence needs further reasoning; generalization requires suitable held-out evidence.",
    "takeaway": "Inspect the full trace, settings and stop reason. Finite progress and successful generalization are different claims."
  },
  "regularization": {
    "question": "Why might we deliberately trade some fit for smaller parameters?",
    "outcome": "Separate data fit, penalty and the combined objective.",
    "connection": "Regularization changes what we optimize. Its value depends on a modeling tradeoff, not on a smaller weight being automatically better.",
    "explore": "Hold the start and rate fixed while changing penalty strength. Compare the data term, penalty and total separately. Predict whether smaller parameter magnitude guarantees better unseen predictions before revealing the comparison.",
    "code": "a, b = 2.0, 0.0\nlam = 1.0\ndata_loss = (a - 3)**2 + b*b  # 1.0\npenalty = lam*(a*a + b*b)  # 4.0\ntotal = data_loss + penalty  # 5.0\ngrad_a = 2*(a - 3) + 2*lam*a  # 2.0",
    "codeMeaning": "The data term favors a=3, while the penalty favors smaller magnitude. Both contribute to the gradient. This dimensionless illustration penalizes both coordinates; real parameter units and bias conventions need explicit choices.",
    "transfer": "Can you rank runs with different penalties using only their total objective values as if the totals had the same meaning?",
    "reference": "No. Changing lambda changes the criterion. Inspect data fit, parameter magnitude and appropriate validation performance to judge the tradeoff.",
    "takeaway": "A penalty changes the objective and its curvature. Choose its strength using validation, not the final test set."
  },
  "responsible": {
    "question": "When is a better training run a better model?",
    "outcome": "Compare controlled runs while keeping evaluation claims honest.",
    "connection": "Optimization provides training evidence. Responsible model choice adds valid comparisons and independent evaluation.",
    "explore": "Keep the shared regression rate and update budget fixed. Compare raw and standardized feature histories from the same initial predictions. Predict why the weight numbers cannot be compared as if their units were unchanged; compare MSE and stop reasons instead.",
    "code": "from statistics import mean, pstdev\ntrain_x = [-20, -10, 10, 20]\ncenter = mean(train_x)\nscale = pstdev(train_x)\nz = [(x - center) / scale for x in train_x]\n# Mean 0; population SD 1 for these training values",
    "codeMeaning": "Training rows fit the scaling reference. Standardized coordinates have different weight units. This preprocessing snippet does not train a model or manufacture a validation score.",
    "transfer": "If one scaled run makes faster training progress, what evidence is still needed before claiming a better deployed model?",
    "reference": "Use an appropriate validation process and independent test evidence, checking leakage, representativeness and relevant error costs. One controlled training trace does not establish generalization.",
    "takeaway": "Compare like with like, state what changed, and keep training success separate from evidence about unseen cases."
  }
};
