"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { predictOne, regressionEvaluationTrace, regressionGradientTrace, regressionTrainingTrace, regressionUpdateTrace } from "@mlmath/runtime";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, parseLearningEvidence, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../foundation/evidence";
import { evaluateExercise, type ConceptualExercise, type ConstrainedCodeExercise, type NumericalExercise } from "../../foundation/exercises";
import { formatNumber, MetricCards } from "../components/lab-ui";
import { ConceptPrimer } from "../components/concept-primer";
import { GRADIENT_FORMULA_EXERCISE, IMPLEMENTATION_EXERCISES, IMPLEMENTATION_LESSON_ID, IMPLEMENTATION_OBJECTIVES, ITERATION_TRACE_EXERCISE, MSE_REPAIR_EXERCISE, PREDICTION_CODE_EXERCISE, RESIDUAL_CODE_EXERCISE, UPDATE_REPAIR_EXERCISE, WORKFLOW_EXERCISE } from "./implementation-content";

const STORAGE_KEY = evidenceStorageKey("linear-regression");
const NOW = () => new Date().toISOString();
const objectiveIds = Object.values(IMPLEMENTATION_OBJECTIVES);
const singleInput = { features: [[1], [2]], targets: [3, 5], weights: [1], bias: 0 };

function CodeBlock({ children, label }: { children: string; label: string }) {
  return <pre className="python-code" aria-label={label}><code>{children}</code></pre>;
}

function Reveal({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="implementation-reveal"><strong>Predict first: {question}</strong><button className="button secondary" onClick={() => setOpen(true)} disabled={open}>{open ? "Explanation revealed" : "Reveal explanation"}</button>{open && <div role="status">{children}</div>}</div>;
}

function CodePractice({ exercise, onCorrect }: { exercise: ConstrainedCodeExercise; onCorrect: (id: string) => void }) {
  const slot = exercise.slots[0], [answer, setAnswer] = useState(""), [attempt, setAttempt] = useState(0);
  const result = attempt ? evaluateExercise(exercise, { kind: "constrained-code", slots: { [slot.id]: answer } }, attempt) : null;
  return <section className="implementation-practice"><p className="eyebrow">Deterministic code check</p><h3>{exercise.prompt}</h3><label>Choose the replacement for <code>{slot.id}</code><select value={answer} onChange={(event) => { setAnswer(event.target.value); setAttempt(0); }}><option value="">Select an expression</option>{slot.allowedValues.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><button className="button primary" disabled={!answer} onClick={() => { const next = attempt + 1; setAttempt(next); if (evaluateExercise(exercise, { kind: "constrained-code", slots: { [slot.id]: answer } }, next).correct) onCorrect(exercise.id); }}>Check code</button>{result && <p role="status" className={`validation ${result.correct ? "success" : "failure"}`}>{result.feedback}</p>}</section>;
}

function NumberPractice({ exercise, onCorrect }: { exercise: NumericalExercise; onCorrect: (id: string) => void }) {
  const [answer, setAnswer] = useState(""), [attempt, setAttempt] = useState(0), value = Number(answer);
  const result = attempt ? evaluateExercise(exercise, { kind: "numerical", value }, attempt) : null;
  return <section className="implementation-practice"><p className="eyebrow">Trace one iteration</p><h3>{exercise.prompt}</h3><label>Updated weight<input type="number" step="0.1" value={answer} onChange={(event) => { setAnswer(event.target.value); setAttempt(0); }}/></label><button className="button primary" disabled={answer === ""} onClick={() => { const next = attempt + 1; setAttempt(next); if (evaluateExercise(exercise, { kind: "numerical", value }, next).correct) onCorrect(exercise.id); }}>Check result</button>{result && <p role="status" className={`validation ${result.correct ? "success" : "failure"}`}>{result.feedback}</p>}</section>;
}

function ChoicePractice({ exercise, onCorrect }: { exercise: ConceptualExercise; onCorrect: (id: string) => void }) {
  const [answer, setAnswer] = useState(""), [attempt, setAttempt] = useState(0);
  const result = attempt ? evaluateExercise(exercise, { kind: "conceptual", optionId: answer }, attempt) : null;
  return <fieldset className="implementation-practice"><legend>{exercise.prompt}</legend>{exercise.options.map((option) => <label key={option.id}><input type="radio" name={exercise.id} checked={answer === option.id} onChange={() => { setAnswer(option.id); setAttempt(0); }}/>{option.label}</label>)}<button className="button primary" disabled={!answer} onClick={() => { const next = attempt + 1; setAttempt(next); if (evaluateExercise(exercise, { kind: "conceptual", optionId: answer }, next).correct) onCorrect(exercise.id); }}>Check decision</button>{result && <p role="status" className={`validation ${result.correct ? "success" : "failure"}`}>{result.feedback}</p>}</fieldset>;
}

export function ImplementationLesson() {
  const [correct, setCorrect] = useState<string[]>([]), [loaded, setLoaded] = useState(false), [evidence, setEvidence] = useState<LearningEvidenceV1>(() => createEmptyEvidence("linear-regression.v1"));
  const evaluation = useMemo(() => regressionEvaluationTrace(singleInput), []), gradient = useMemo(() => regressionGradientTrace(singleInput), []), update = useMemo(() => regressionUpdateTrace(singleInput, 0.1), []), training = useMemo(() => regressionTrainingTrace(singleInput, 0.1, 3), []);
  const unseen = predictOne([3], update.updatedParameters.weights, update.updatedParameters.bias), multiple = predictOne([2, 3], [30, -2], 10);
  const markCorrect = (id: string) => setCorrect((items) => items.includes(id) ? items : [...items, id]);
  const complete = IMPLEMENTATION_EXERCISES.every(({ id }) => correct.includes(id));
  const achieved = complete || evidence.lessons[IMPLEMENTATION_LESSON_ID]?.state === "completed";

  useEffect(() => { const stored = parseLearningEvidence(localStorage.getItem(STORAGE_KEY), "linear-regression.v1"); setEvidence(markLessonState(stored, IMPLEMENTATION_LESSON_ID, "visited", [], NOW())); setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(evidence)); }, [evidence, loaded]);
  useEffect(() => {
    if (!loaded) return;
    setEvidence((current) => {
      let next = current;
      const translationIds = [PREDICTION_CODE_EXERCISE.id, RESIDUAL_CODE_EXERCISE.id, MSE_REPAIR_EXERCISE.id];
      const optimizeIds = [GRADIENT_FORMULA_EXERCISE.id, UPDATE_REPAIR_EXERCISE.id, ITERATION_TRACE_EXERCISE.id];
      if (translationIds.every((id) => correct.includes(id))) next = recordObjectiveCompletion(next, IMPLEMENTATION_OBJECTIVES.translate, translationIds.join("+"), NOW());
      if (optimizeIds.every((id) => correct.includes(id))) next = recordObjectiveCompletion(next, IMPLEMENTATION_OBJECTIVES.optimize, optimizeIds.join("+"), NOW());
      if (correct.includes(WORKFLOW_EXERCISE.id)) next = recordObjectiveCompletion(next, IMPLEMENTATION_OBJECTIVES.workflow, WORKFLOW_EXERCISE.id, NOW());
      if (complete) next = markLessonState(next, IMPLEMENTATION_LESSON_ID, "completed", objectiveIds, NOW());
      else if (correct.length) next = markLessonState(next, IMPLEMENTATION_LESSON_ID, "started", [], NOW());
      return next;
    });
  }, [complete, correct, loaded]);

  return <div className="implementation-lesson">
    <section className="why-objectives"><p className="eyebrow">Learning objectives</p><h2>Translate each mathematical idea into inspectable Python.</h2><ul><li>Represent features and targets without assuming NumPy or pandas.</li><li>Implement prediction, residuals, metrics, gradients, updates, and a training loop.</li><li>Evaluate unseen examples without leaking test information.</li></ul></section>

    <ConceptPrimer title="Reconnect the model vocabulary before writing code." reminder="You met features, targets, and predictions in Lesson 1. Here the same concepts become variables; the meaning stays unchanged across mathematics, Python, and the lab." concepts={["feature", "target", "prediction", "parameter"]}/>

    <section className="symbol-key" aria-labelledby="implementation-symbols"><p className="eyebrow">Symbol and variable key</p><h2 id="implementation-symbols">Read the equation as a sentence.</h2><p><code>ŷ = wx + b</code> means: prediction equals weight times feature, plus bias.</p><dl><div><dt><code>x</code></dt><dd>one input feature</dd></div><div><dt><code>y</code></dt><dd>the actual target</dd></div><div><dt><code>ŷ</code></dt><dd>the model prediction</dd></div><div><dt><code>w</code></dt><dd>feature weight</dd></div><div><dt><code>b</code></dt><dd>baseline bias</dd></div><div><dt><code>m</code></dt><dd>number of observations</dd></div><div><dt><code>r</code></dt><dd>prediction − actual</dd></div><div><dt><code>α</code></dt><dd>learning rate</dd></div></dl></section>

    <section className="implementation-step"><p className="eyebrow">1 · Dataset → Python lists</p><h2>Start with observations you can inspect.</h2><p><code>xs</code> contains the known feature. <code>ys</code> contains the target. Matching positions describe the same observation.</p><CodeBlock label="Python lists for features and targets">{`xs = [1.0, 2.0]   # feature values\nys = [3.0, 5.0]   # target values\nw = 1.0\nb = 0.0`}</CodeBlock><Reveal question="How many training observations are represented?"><p>Two. <code>xs[0]</code> pairs with <code>ys[0]</code>, and the same is true at index 1.</p></Reveal></section>

    <section className="implementation-step"><p className="eyebrow">2 · Prediction function</p><h2>Turn ŷ = wx + b into a reusable function.</h2><CodeBlock label="Single feature prediction function">{`def predict_one(x, w, b):\n    return w * x + b\n\npredictions = [predict_one(x, w, b) for x in xs]`}</CodeBlock><Reveal question="With w=1, b=0, and x=2, what is ŷ?"><p>The verified runtime returns {evaluation.rows[1].prediction}. The feature <code>x</code> varies by home; <code>w</code> and <code>b</code> are learned parameters.</p></Reveal><CodePractice exercise={PREDICTION_CODE_EXERCISE} onCorrect={markCorrect}/></section>

    <section className="implementation-step"><p className="eyebrow">3 · Residuals and metrics</p><h2>Measure each miss before summarizing all misses.</h2><p>This course uses residual = prediction − actual. MAE averages <code>abs(r)</code>; MSE averages <code>r ** 2</code>.</p><CodeBlock label="Residual, MAE, and MSE Python">{`residuals = [p - y for p, y in zip(predictions, ys)]\nmae = sum(abs(r) for r in residuals) / len(residuals)\nmse = sum(r ** 2 for r in residuals) / len(residuals)`}</CodeBlock><MetricCards items={[{ label: "Residuals", value: `[${evaluation.rows.map((row) => formatNumber(row.residual)).join(", ")}]` }, { label: "MAE", value: formatNumber(evaluation.metrics.mae) }, { label: "MSE", value: formatNumber(evaluation.metrics.mse) }]}/><Reveal question="Can signed residuals be averaged directly to measure error size?"><p>No. Positive and negative misses can cancel. Absolute values or squares prevent that cancellation.</p></Reveal><CodePractice exercise={RESIDUAL_CODE_EXERCISE} onCorrect={markCorrect}/><CodePractice exercise={MSE_REPAIR_EXERCISE} onCorrect={markCorrect}/></section>

    <section className="implementation-step"><p className="eyebrow">4 · MSE gradients</p><h2>Compute how loss responds to each parameter.</h2><p>For <code>m</code> observations, the MSE weight gradient is <code>(2/m) Σ residual × x</code>; the bias gradient is <code>(2/m) Σ residual</code>.</p><CodeBlock label="MSE gradient Python">{`m = len(xs)\ndw = (2 / m) * sum(r * x for r, x in zip(residuals, xs))\ndb = (2 / m) * sum(residuals)`}</CodeBlock><Reveal question="Are both gradients positive for the starting parameters?"><p>No. The runtime gives <code>dw = {formatNumber(gradient.weightGradients[0])}</code> and <code>db = {formatNumber(gradient.biasGradient)}</code>. Negative gradients mean increasing these parameters locally reduces MSE.</p></Reveal><CodePractice exercise={GRADIENT_FORMULA_EXERCISE} onCorrect={markCorrect}/></section>

    <ConceptPrimer title="A gradient is sensitivity, not an instruction by itself." reminder="A derivative describes local change. Gradient descent uses that information with a learning rate and moves in the opposite direction to reduce loss." concepts={["gradient", "learningRate"]}/>

    <section className="implementation-step"><p className="eyebrow">5 · One gradient descent update</p><h2>Move against the gradient.</h2><CodeBlock label="Gradient descent parameter update">{`learning_rate = 0.1\nw = w - learning_rate * dw\nb = b - learning_rate * db`}</CodeBlock><Reveal question="What happens to w after one update?"><p>It increases from 1 to {formatNumber(update.updatedParameters.weights[0])}, because subtracting the negative gradient adds 0.8.</p></Reveal><CodePractice exercise={UPDATE_REPAIR_EXERCISE} onCorrect={markCorrect}/><NumberPractice exercise={ITERATION_TRACE_EXERCISE} onCorrect={markCorrect}/></section>

    <section className="implementation-step"><p className="eyebrow">6 · Training loop</p><h2>Repeat prediction → residual → gradient → update.</h2><CodeBlock label="From scratch training loop">{`for step in range(steps):\n    predictions = [predict_one(x, w, b) for x in xs]\n    residuals = [p - y for p, y in zip(predictions, ys)]\n    dw = (2 / len(xs)) * sum(r*x for r, x in zip(residuals, xs))\n    db = (2 / len(xs)) * sum(residuals)\n    w -= learning_rate * dw\n    b -= learning_rate * db`}</CodeBlock><Reveal question="Does iteration 0 mean one update has already happened?"><p>No. The verified trace defines iteration 0 as the initial state. After three updates, MSE is {formatNumber(training.entries[3].loss ?? 0, 4)}.</p></Reveal></section>

    <section className="implementation-step"><p className="eyebrow">7 · Unseen and multiple-feature predictions</p><h2>Inference uses learned parameters; it does not update them.</h2><CodeBlock label="Prediction for unseen and multiple feature examples">{`unseen_prediction = predict_one(3.0, w, b)\n\ndef predict_many(features, weights, bias):\n    return sum(x*w for x, w in zip(features, weights)) + bias`}</CodeBlock><Reveal question="What does the single-feature model predict for x=3 after one update?"><p>{formatNumber(unseen)}. For features <code>[2, 3]</code>, weights <code>[30, -2]</code>, and bias <code>10</code>, the multi-feature prediction is {formatNumber(multiple)}.</p></Reveal></section>

    <section className="implementation-step"><p className="eyebrow">8 · Honest comparison</p><h2>Compare with scikit-learn on the same split.</h2><CodeBlock label="Scikit-learn comparison">{`from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)\n# Compare coefficients, predictions, and test metrics.`}</CodeBlock><p>Library agreement is a useful check, not a substitute for understanding shapes, splits, metrics, or leakage. A <strong>training set</strong> is allowed to influence model parameters; a <strong>test set</strong> stays untouched until final evaluation. The notebook performs this comparison from top to bottom.</p><ConceptPrimer title="Keep learning data separate from evaluation data." reminder="This is the same fairness principle you will use in every supervised ML algorithm and project." concepts={["trainingSet", "testSet"]}/><ChoicePractice exercise={WORKFLOW_EXERCISE} onCorrect={markCorrect}/><a className="button primary notebook-download" href="/notebooks/linear-regression-from-scratch.ipynb" download>Download the Colab-compatible notebook</a></section>

    <section className={`why-summary ${achieved ? "complete" : ""}`} aria-live="polite"><p className="eyebrow">Lesson summary</p><h2>{achieved ? "Implementation outcome demonstrated" : `${correct.length} of ${IMPLEMENTATION_EXERCISES.length} checks complete`}</h2><p>Lists hold observations; functions encode equations; residuals feed metrics and gradients; updates move against the gradient; loops repeat the process; untouched examples test transfer.</p><strong>{achieved ? "Completed locally. This is objective evidence, not mastery." : "Pass all seven deterministic checks to complete this lesson."}</strong></section>
  </div>;
}
