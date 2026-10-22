"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { regressionEvaluationTrace } from "@mlmath/runtime";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, parseLearningEvidence, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../../learn/foundation/evidence";
import { evaluateExercise, type ConceptualExercise } from "../../../learn/foundation/exercises";
import { HOUSE_DATA, HOUSE_PARAMETERS } from "../lab-data";
import { formatNumber, MetricCards, ParameterSlider, RegressionPlot } from "../components/lab-ui";
import { ConceptPrimer } from "../components/concept-primer";
import { ERROR_DIRECTION_EXERCISE, ERRORS_EXERCISES, ERRORS_LESSON_ID, ERRORS_OBJECTIVES, METRIC_CHOICE_EXERCISE, RESIDUAL_VALUE_EXERCISE, TRAINING_ERROR_EXERCISE } from "../lessons/errors-content";

const features = HOUSE_DATA.features.map((row) => [...row]);
const STORAGE_KEY = evidenceStorageKey("linear-regression");
const NOW = () => new Date().toISOString();
const objectiveIds = Object.values(ERRORS_OBJECTIVES);

function ChoiceCheck({ exercise, onCorrect }: { exercise: ConceptualExercise; onCorrect: (id: string) => void }) {
  const [answer, setAnswer] = useState("");
  const result = answer ? evaluateExercise(exercise, { kind: "conceptual", optionId: answer }, 1) : null;
  useEffect(() => { if (result?.correct) onCorrect(exercise.id); }, [exercise.id, onCorrect, result?.correct]);
  return <fieldset className="metric-check"><legend>{exercise.prompt}</legend>{exercise.options.map((option) => <label key={option.id}><input type="radio" name={exercise.id} checked={answer === option.id} onChange={() => setAnswer(option.id)}/>{option.label}</label>)}{result && <p role="status" className={`validation ${result.correct ? "success" : "failure"}`}>{result.feedback}</p>}</fieldset>;
}

export function ErrorsLab() {
  const [weight, setWeight] = useState(HOUSE_PARAMETERS.weights[0]), [bias, setBias] = useState(HOUSE_PARAMETERS.bias), [selected, setSelected] = useState(2), [outlierPrediction, setOutlierPrediction] = useState<string | null>(null), [showOutlier, setShowOutlier] = useState(false), [saved, setSaved] = useState<Array<{ mae: number; mse: number; rmse: number }>>([]);
  const [direction, setDirection] = useState(""), [directionRevealed, setDirectionRevealed] = useState(false), [residualAnswer, setResidualAnswer] = useState(""), [residualChecked, setResidualChecked] = useState(false), [correct, setCorrect] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false), [evidence, setEvidence] = useState<LearningEvidenceV1>(() => createEmptyEvidence("linear-regression.v1"));
  const targets = useMemo(() => HOUSE_DATA.targets.map((value, index) => showOutlier && index === 5 ? 520 : value), [showOutlier]);
  const trace = useMemo(() => regressionEvaluationTrace({ features, targets, weights: [weight], bias }), [targets, weight, bias]);
  const baseline = useMemo(() => regressionEvaluationTrace({ features, targets: [...HOUSE_DATA.targets], weights: [...HOUSE_PARAMETERS.weights], bias: HOUSE_PARAMETERS.bias }), []);
  const row = trace.rows[selected];
  const directionResult = direction ? evaluateExercise(ERROR_DIRECTION_EXERCISE, { kind: "parameter-prediction", optionId: direction }, 1) : null;
  const residualResult = residualChecked ? evaluateExercise(RESIDUAL_VALUE_EXERCISE, { kind: "numerical", value: Number(residualAnswer) }, 1) : null;
  const markCorrect = useCallback((id: string) => setCorrect((items) => items.includes(id) ? items : [...items, id]), []);
  const complete = ERRORS_EXERCISES.every(({ id }) => correct.includes(id)) && showOutlier;
  const achieved = complete || evidence.lessons[ERRORS_LESSON_ID]?.state === "completed";

  useEffect(() => { if (directionRevealed && directionResult?.correct) markCorrect(ERROR_DIRECTION_EXERCISE.id); }, [directionResult?.correct, directionRevealed, markCorrect]);
  useEffect(() => { if (residualResult?.correct) markCorrect(RESIDUAL_VALUE_EXERCISE.id); }, [markCorrect, residualResult?.correct]);
  useEffect(() => { const stored = parseLearningEvidence(localStorage.getItem(STORAGE_KEY), "linear-regression.v1"); setEvidence(markLessonState(stored, ERRORS_LESSON_ID, "visited", [], NOW())); setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(evidence)); }, [evidence, loaded]);
  useEffect(() => {
    if (!loaded) return;
    setEvidence((current) => {
      let next = current;
      if ([ERROR_DIRECTION_EXERCISE.id, RESIDUAL_VALUE_EXERCISE.id].every((id) => correct.includes(id))) next = recordObjectiveCompletion(next, ERRORS_OBJECTIVES.residuals, `${ERROR_DIRECTION_EXERCISE.id}+${RESIDUAL_VALUE_EXERCISE.id}`, NOW());
      if (correct.includes(METRIC_CHOICE_EXERCISE.id) && showOutlier) next = recordObjectiveCompletion(next, ERRORS_OBJECTIVES.metrics, `${METRIC_CHOICE_EXERCISE.id}+outlier-experiment`, NOW());
      if (correct.includes(TRAINING_ERROR_EXERCISE.id)) next = recordObjectiveCompletion(next, ERRORS_OBJECTIVES.evaluate, TRAINING_ERROR_EXERCISE.id, NOW());
      if (complete) next = markLessonState(next, ERRORS_LESSON_ID, "completed", objectiveIds, NOW());
      else if (correct.length || showOutlier || saved.length) next = markLessonState(next, ERRORS_LESSON_ID, "started", [], NOW());
      return next;
    });
  }, [complete, correct, loaded, saved.length, showOutlier]);

  const outlierFeedback = showOutlier && outlierPrediction ? (outlierPrediction === "mse" ? "Correct. Squaring makes the large residual contribute disproportionately to MSE and RMSE." : "MAE increases too, but squared-error metrics react more strongly to this extreme miss.") : null;

  return <div className="errors-lesson">
    <section className="why-objectives"><p className="eyebrow">Learning objectives</p><h2>Read an error before reducing it to one score.</h2><ul><li>Calculate and interpret signed residuals.</li><li>Compare MAE, MSE, and RMSE—including outlier sensitivity and units.</li><li>Choose evaluation evidence that matches the real decision.</li></ul></section>

    <ConceptPrimer title="Start with the observation, not the metric acronym." reminder="Lesson 1 introduced predictions as estimates. Error metrics compare those estimates with known targets; they do not explain why a miss happened." concepts={["target", "prediction", "residual"]}/>

    <section className="implementation-step"><p className="eyebrow">Actual, prediction, residual</p><h2>Direction matters before aggregation.</h2><p>An <strong>actual value</strong> is observed. A <strong>prediction</strong> is the model estimate. This course defines <strong>residual = prediction − actual</strong>: negative means underprediction and positive means overprediction.</p><fieldset className="metric-check"><legend>{ERROR_DIRECTION_EXERCISE.prompt}</legend>{ERROR_DIRECTION_EXERCISE.options.map((option) => <label key={option.id}><input type="radio" name="error-direction" checked={direction === option.id} onChange={() => { setDirection(option.id); setDirectionRevealed(false); }}/>{option.label}</label>)}<button className="button primary" disabled={!direction} onClick={() => setDirectionRevealed(true)}>Reveal residual</button>{directionRevealed && directionResult && <p role="status" className={`validation ${directionResult.correct ? "success" : "failure"}`}>{directionResult.feedback}</p>}</fieldset><div className="metric-check numerical"><label>{RESIDUAL_VALUE_EXERCISE.prompt}<input aria-label="Residual answer" type="number" value={residualAnswer} onChange={(event) => { setResidualAnswer(event.target.value); setResidualChecked(false); }}/></label><button className="button secondary" disabled={!residualAnswer} onClick={() => setResidualChecked(true)}>Check residual</button>{residualResult && <p role="status" className={`validation ${residualResult.correct ? "success" : "failure"}`}>{residualResult.feedback}</p>}</div></section>

    <section className="metric-formulas" aria-labelledby="metric-formulas-title"><p className="eyebrow">Three summaries, three meanings</p><h2 id="metric-formulas-title">The transformation determines what the metric emphasizes.</h2><div><article><h3>MAE</h3><p>Average of <code>|residual|</code></p><strong>Direct, proportional penalty</strong><span>Same units as the target</span></article><article><h3>MSE</h3><p>Average of <code>residual²</code></p><strong>Large misses gain extra influence</strong><span>Squared target units</span></article><article><h3>RMSE</h3><p><code>√MSE</code></p><strong>MSE sensitivity, readable scale</strong><span>Same units as the target</span></article></div><p>Squaring turns a residual of 10 into 100, but a residual of 20 into 400. Doubling the miss quadruples its squared contribution.</p></section>

    <details><summary>Review metric names and formulas</summary><ConceptPrimer title="Metric names are shorthand for different priorities." reminder="All three summarize the same residuals. The transformation—absolute value, square, or square root—changes the practical meaning of the final number." concepts={["mae", "mse", "rmse"]}/></details>

    <section className="lab-question"><p className="eyebrow">Interactive experiment</p><h2>How should we summarize all the ways a prediction line can miss?</h2></section>
    <section className="guided-prompt"><p className="eyebrow">Predict before experimenting</p><h3>If one home has an extreme target, which metric will react most strongly?</h3><div><label><input type="radio" name="outlier-prediction" checked={outlierPrediction === "mae"} onChange={() => setOutlierPrediction("mae")}/> MAE</label><label><input type="radio" name="outlier-prediction" checked={outlierPrediction === "mse"} onChange={() => setOutlierPrediction("mse")}/> MSE</label><button className="button train" disabled={!outlierPrediction} onClick={() => setShowOutlier((value) => !value)}>{showOutlier ? "Remove outlier" : "Reveal outlier"}</button></div>{outlierFeedback && <p role="status" className={`guided-feedback ${outlierPrediction === "mse" ? "success" : "failure"}`}>{outlierFeedback}</p>}</section>

    <div className="lab-workspace"><aside className="lab-controls"><h3>Error controls</h3><ParameterSlider label="Weight" value={weight} min={0} max={90} step={1} onChange={setWeight}/><ParameterSlider label="Bias" value={bias} min={0} max={240} step={5} onChange={setBias}/><button className="button secondary" onClick={() => setSaved((items) => [...items.slice(-1), trace.metrics])}>Save this configuration</button><button className="button secondary" onClick={() => { setWeight(HOUSE_PARAMETERS.weights[0]); setBias(HOUSE_PARAMETERS.bias); setSelected(2); setShowOutlier(false); setOutlierPrediction(null); setSaved([]); }}>Reset experiment</button>{saved.map((item, index) => <p className="saved-comparison" key={index}>Saved {index + 1}: MAE {formatNumber(item.mae)}, MSE {formatNumber(item.mse)}, RMSE {formatNumber(item.rmse)}</p>)}</aside><section className="lab-visual"><RegressionPlot trace={trace} selected={selected} onSelect={setSelected} showResiduals title="Residual and loss explorer"/><MetricCards items={[{ label: "MAE", value: formatNumber(trace.metrics.mae), detail: "average absolute miss" }, { label: "MSE", value: formatNumber(trace.metrics.mse), detail: "average squared miss" }, { label: "RMSE", value: formatNumber(trace.metrics.rmse), detail: "square root of MSE" }, { label: `Observation ${selected + 1}`, value: formatNumber(row.residual), detail: "signed residual (₹ lakh)" }]}/></section></div>

    <section className="metric-table-section"><p className="eyebrow">Accessible calculation table</p><h2>Inspect what each observation contributes.</h2><div className="table-scroll" tabIndex={0} role="region" aria-label="Runtime-generated residual calculations for the current parameters — scroll horizontally if needed"><table><caption>Runtime-generated residual calculations for the current parameters</caption><thead><tr><th scope="col">Observation</th><th scope="col">Actual</th><th scope="col">Prediction</th><th scope="col">Residual</th><th scope="col">Absolute</th><th scope="col">Squared</th></tr></thead><tbody>{trace.rows.map((item, index) => <tr key={index}><th scope="row">{index + 1}</th><td>{formatNumber(item.target)}</td><td>{formatNumber(item.prediction)}</td><td>{formatNumber(item.residual)}</td><td>{formatNumber(item.absoluteResidual)}</td><td>{formatNumber(item.squaredResidual)}</td></tr>)}</tbody></table></div></section>

    <section className="metric-comparison"><h2>Outliers change the question.</h2><p>Baseline MAE is {formatNumber(baseline.metrics.mae)} and RMSE is {formatNumber(baseline.metrics.rmse)}. After revealing the extreme target, compare both cards. MAE describes a typical absolute miss; RMSE is more sensitive when large misses deserve disproportionate attention.</p><ChoiceCheck exercise={METRIC_CHOICE_EXERCISE} onCorrect={markCorrect}/><ChoiceCheck exercise={TRAINING_ERROR_EXERCISE} onCorrect={markCorrect}/></section>

    <section className={`why-summary ${achieved ? "complete" : ""}`} aria-live="polite"><p className="eyebrow">Lesson summary</p><h2>{achieved ? "Error-metrics outcome demonstrated" : `${correct.length} of ${ERRORS_EXERCISES.length} checks complete`}</h2><p>Residuals preserve direction. MAE summarizes proportional distance. MSE and RMSE emphasize large misses. Metric choice is a modeling decision, and training error alone cannot establish generalization.</p><strong>{achieved ? "Completed locally. This is objective evidence, not mastery." : "Pass all four checks and run the outlier experiment to complete this lesson."}</strong></section>
  </div>;
}
