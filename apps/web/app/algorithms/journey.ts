export const ALGORITHM_QUESTIONS = {
  "polynomial": [
    "How can a straight-line calculation describe a curve?",
    "What changes when features interact?",
    "How much flexibility does this problem need?",
    "Where should we stop trusting a fitted curve?"
  ],
  "regularization": [
    "Why would we deliberately penalize a fitted model?",
    "How does Ridge change the balance between fit and coefficient size?",
    "When can a penalty remove a feature’s coefficient?",
    "Why combine two kinds of penalty?",
    "Which data is allowed to choose the penalty?",
    "What can smaller coefficients actually tell us?"
  ],
  "logistic": [
    "How does a score become a probability?",
    "How does a confident mistake affect learning?",
    "When should a probability become a positive decision?",
    "What does regularization change about classification?",
    "What makes a classification workflow trustworthy?",
    "What can this classifier explain—and what can it not?"
  ],
  "knn": [
    "What can nearby labeled cases tell us?",
    "Who counts as nearby when feature scales differ?",
    "How many neighbors should get a vote?",
    "When should we question a neighbor-based prediction?"
  ],
  "naive-bayes": [
    "How can separate clues change a class prediction?",
    "What happens when a useful count is zero?",
    "How can a continuous measurement become class evidence?",
    "When do convenient probability assumptions mislead?"
  ],
  "svm": [
    "What makes one separating boundary preferable to another?",
    "How much should a margin violation cost?",
    "Can similarity create a curved boundary?",
    "Why must scaling stay inside the training workflow?",
    "When is a margin-based classifier a sensible choice?"
  ],
  "decision-trees": [
    "How can a sequence of questions define a prediction?",
    "What should a leaf predict for a numerical target?",
    "How does a leaf turn class counts into a decision?",
    "When does a more detailed tree become less dependable?",
    "Which observations are allowed to shape the tree?",
    "What does following a rule explain about the world?"
  ],
  "random-forests": [
    "Why might different imperfect trees help each other?",
    "What changes when we average tree predictions?",
    "How do several trees combine their class evidence?",
    "Which cases can evaluate a tree they did not train?",
    "What does an importance score leave unexplained?"
  ],
  "gradient-boosting": [
    "What if the next model focused on what remains wrong?",
    "How does a residual become the next training target?",
    "What changes when the target is a class?",
    "When should we stop adding corrective stages?",
    "Which data can choose how boosting proceeds?",
    "How can we diagnose a strong-looking ensemble?"
  ],
  "mlp": [
    "What can several nonlinear units represent together?",
    "How does an error signal travel backward through a network?",
    "When does more capacity help—and when can it overfit?",
    "What makes a small neural-network workflow reproducible?",
    "What can a network’s prediction justify?"
  ],
  "model-selection": [
    "What makes two model scores comparable?",
    "Why does searching more settings consume evidence?",
    "Who evaluates the procedure that chooses a model?",
    "How should the cost of mistakes affect a decision?",
    "What can we responsibly say about the selected model?",
    "What must accompany a reproducible model choice?"
  ],
  "module": [
    "What is actually known at the prediction moment?",
    "How can we estimate performance on unseen cases?",
    "Which mistakes matter for this decision?",
    "Is a good ranking the same as a reliable probability?",
    "How uncertain is the performance story?",
    "What makes an evaluation report honest?"
  ]
} as const;
