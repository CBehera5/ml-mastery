"use client";

import { useEffect, useMemo, useState } from "react";
import { regressionEvaluationTrace } from "@mlmath/runtime";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, parseLearningEvidence, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../foundation/evidence";
import { evaluateExercise } from "../../foundation/exercises";
import { HOUSE_DATA, HOUSE_PARAMETERS } from "../lab-data";
import { formatNumber, MetricCards, ParameterSlider, RegressionPlot } from "../components/lab-ui";
import { REGRESSION_KIND_EXERCISE, SIZE_PREDICTION_EXERCISE, SUITABILITY_EXERCISE, WHY_LESSON_ID, WHY_OBJECTIVES } from "./why-content";

const STORAGE_KEY = evidenceStorageKey("linear-regression");
const NOW = () => new Date().toISOString();
const objectiveIds = Object.values(WHY_OBJECTIVES);

export function WhyLinearRegressionLesson() {
  const [area, setArea] = useState(2.5), [selected, setSelected] = useState(2), [prediction, setPrediction] = useState(""), [revealed, setRevealed] = useState(false), [kindAnswer, setKindAnswer] = useState(""), [decision, setDecision] = useState("");
  const [explored, setExplored] = useState(false), [loaded, setLoaded] = useState(false), [evidence, setEvidence] = useState<LearningEvidenceV1>(() => createEmptyEvidence("linear-regression.v1"));
  const datasetTrace = useMemo(() => regressionEvaluationTrace({ features: HOUSE_DATA.features.map((row) => [...row]), targets: [...HOUSE_DATA.targets], weights: [...HOUSE_PARAMETERS.weights], bias: HOUSE_PARAMETERS.bias }), []);
  const comparisonTrace = useMemo(() => regressionEvaluationTrace({ features: [[1.4], [3.6]], targets: [190, 310], weights: [...HOUSE_PARAMETERS.weights], bias: HOUSE_PARAMETERS.bias }), []);
  const estimateTrace = useMemo(() => regressionEvaluationTrace({ features: [[area]], targets: [246], weights: [...HOUSE_PARAMETERS.weights], bias: HOUSE_PARAMETERS.bias }), [area]);
  const predictionResult = prediction ? evaluateExercise(SIZE_PREDICTION_EXERCISE, { kind: "parameter-prediction", optionId: prediction }, 1) : null;
  const kindResult = kindAnswer ? evaluateExercise(REGRESSION_KIND_EXERCISE, { kind: "conceptual", optionId: kindAnswer }, 1) : null;
  const decisionResult = decision ? evaluateExercise(SUITABILITY_EXERCISE, { kind: "conceptual", optionId: decision }, 1) : null;
  const complete = Boolean(predictionResult?.correct && revealed && explored && kindResult?.correct && decisionResult?.correct);
  const achieved = complete || evidence.lessons[WHY_LESSON_ID]?.state === "completed";

  useEffect(() => {
    const stored = parseLearningEvidence(localStorage.getItem(STORAGE_KEY), "linear-regression.v1");
    setEvidence(markLessonState(stored, WHY_LESSON_ID, "visited", [], NOW())); setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(evidence)); }, [evidence, loaded]);
  useEffect(() => {
    if (!loaded) return;
    setEvidence((current) => {
      let next = current;
      if (predictionResult?.correct && revealed) next = recordObjectiveCompletion(next, WHY_OBJECTIVES.frame, SIZE_PREDICTION_EXERCISE.id, NOW());
      if (kindResult?.correct) next = recordObjectiveCompletion(next, WHY_OBJECTIVES.distinguish, REGRESSION_KIND_EXERCISE.id, NOW());
      if (decisionResult?.correct) next = recordObjectiveCompletion(next, WHY_OBJECTIVES.decide, SUITABILITY_EXERCISE.id, NOW());
      if (complete) next = markLessonState(next, WHY_LESSON_ID, "completed", objectiveIds, NOW());
      else if (prediction || explored || kindAnswer || decision) next = markLessonState(next, WHY_LESSON_ID, "started", [], NOW());
      return next;
    });
  }, [complete, decision, decisionResult?.correct, explored, kindAnswer, kindResult?.correct, loaded, prediction, predictionResult?.correct, revealed]);

  return <div className="why-regression-lesson">
    <section className="why-objectives" aria-labelledby="why-objectives-title"><p className="eyebrow">Learning objectives</p><h2 id="why-objectives-title">Start with the decision, not the equation.</h2><ul><li>Recognize a numerical prediction problem.</li><li>Distinguish features from the target.</li><li>Decide when a straight-line model is a useful baseline—and when it is not.</li></ul></section>

    <section className="why-story"><div><p className="eyebrow">Problem and motivation</p><h2>A housing analyst needs a useful first estimate.</h2><p>Imagine a fictional housing team reviewing six homes. Before commissioning a detailed valuation, they want a consistent estimate from one known feature: floor area. Each row is an <strong>observation</strong>. Floor area is the <strong>feature</strong> we know; price is the numerical <strong>target</strong> we want to estimate.</p><p>Regression means predicting a number. Classification instead chooses a category. Neither is automatically “better”—they answer different questions.</p></div><aside className="why-vocabulary" aria-label="Regression vocabulary"><div><b>Feature</b><span>Information available to the model</span></div><div><b>Target</b><span>The number the model should estimate</span></div><div><b>Prediction</b><span>The model’s numerical output</span></div><div><b>Residual</b><span>The gap between prediction and reality</span></div></aside></section>

    <section className="guided-prompt why-prediction"><p className="eyebrow">Predict before reveal</p><h3>{SIZE_PREDICTION_EXERCISE.prompt}</h3><fieldset><legend className="sr-only">Choose which home should have the larger estimate</legend>{SIZE_PREDICTION_EXERCISE.options.map((option) => <label key={option.id}><input type="radio" name="size-prediction" checked={prediction === option.id} onChange={() => { setPrediction(option.id); setRevealed(false); }}/>{option.label}</label>)}</fieldset><button className="button primary" disabled={!prediction} onClick={() => setRevealed(true)}>Reveal the model estimate</button>{revealed && predictionResult && <p role="status" className={`guided-feedback ${predictionResult.correct ? "success" : "failure"}`}>{predictionResult.correct ? "Yes. In this dataset, larger floor area follows the upward trend." : "Not in this observed trend. Compare the two estimates and revise your prediction."} The verified runtime estimates ${formatNumber(comparisonTrace.rows[0].prediction)}k at {comparisonTrace.rows[0].features[0]} and ${formatNumber(comparisonTrace.rows[1].prediction)}k at {comparisonTrace.rows[1].features[0]} thousand ft².</p>}</section>

    <section className="why-experiment"><div className="why-control"><p className="eyebrow">Interactive exploration</p><h3>Move one feature and observe the estimate.</h3><p>This line summarizes a trend; it does not memorize every observed price.</p><ParameterSlider label="Floor area (thousand ft²)" value={area} min={1.2} max={4.2} step={0.1} onChange={(value) => { setArea(value); setExplored(true); }}/><MetricCards items={[{ label: "Input feature", value: `${formatNumber(area)}k ft²` }, { label: "Model estimate", value: `$${formatNumber(estimateTrace.rows[0].prediction)}k` }]}/>{explored && <p role="status" className="validation success">Observed: changing the feature changes the numerical prediction. The model still cannot see location, condition, or other omitted factors.</p>}</div><RegressionPlot trace={datasetTrace} selected={selected} onSelect={setSelected} title="Fictional house-price observations and a simple fitted line"/></section>

    <section className="why-check-grid"><fieldset><legend>Misconception check</legend><p>{REGRESSION_KIND_EXERCISE.prompt}</p>{REGRESSION_KIND_EXERCISE.options.map((option) => <label key={option.id}><input type="radio" name="kind-check" checked={kindAnswer === option.id} onChange={() => setKindAnswer(option.id)}/>{option.label}</label>)}{kindResult && <p role="status" className={`validation ${kindResult.correct ? "success" : "failure"}`}>{kindResult.correct ? "Correct: the output is a continuous number." : "That would be classification because the output is a category."}</p>}</fieldset><fieldset><legend>Practical decision</legend><p>{SUITABILITY_EXERCISE.prompt}</p>{SUITABILITY_EXERCISE.options.map((option) => <label key={option.id}><input type="radio" name="suitability" checked={decision === option.id} onChange={() => setDecision(option.id)}/>{option.label}</label>)}{decisionResult && <p role="status" className={`validation ${decisionResult.correct ? "success" : "failure"}`}>{decisionResult.correct ? "Good starting point: numerical target, useful feature, and roughly straight trend." : decision === "spam" ? "Spam is a category, so this is classification." : "A single straight line is unsuitable when the relationship repeatedly changes direction."}</p>}</fieldset></section>

    <section className="why-suitability"><p className="eyebrow">When to use it</p><div><article><h3>A reasonable starting point</h3><ul><li>The target is numerical.</li><li>A roughly straight trend is plausible.</li><li>You need an interpretable baseline.</li><li>Residuals can be checked afterward.</li></ul></article><article><h3>Pause or choose another approach</h3><ul><li>The desired output is a category.</li><li>The relationship is strongly curved or discontinuous.</li><li>Important variables are missing.</li><li>Outliers or extrapolation dominate the decision.</li></ul></article></div></section>

    <section className={`why-summary ${achieved ? "complete" : ""}`} aria-live="polite"><p className="eyebrow">Lesson summary</p><h2>{achieved ? "Lesson outcome demonstrated" : "Connect the final pieces"}</h2><p>Linear Regression predicts a numerical target from features by fitting a straight relationship. Predictions are estimates, so residuals are expected and must be evaluated. It is a useful, interpretable baseline—not a guarantee that the world is linear.</p><strong>{achieved ? "Completed locally. This is completion evidence, not mastery." : "Complete the prediction, move the feature control, and answer both decision checks."}</strong></section>
  </div>;
}
