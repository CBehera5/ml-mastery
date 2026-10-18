"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BetaNav } from "../../components/beta-nav";
import { type Answer, type Atom, type Family } from "./contracts";
import { EXPERIMENT, OBJECTIVES, PRACTICE, PREDICTIONS, REASONS, responseFor } from "./fixtures";
import { alternatePractice, checkExperiment, chooseExperiment, emptyProgress, ProgressStore, RECOVERY_ANSWERS, recoverPractice, resetLessonPractice, submitPractice, type Progress } from "./progress";
import styles from "./lesson.module.css";

export function AnswerInput({ atom, answer, change, name }: { atom: Atom; answer: Answer; change: (answer: Answer) => void; name: string }) {
  if (atom.kind === "number") return <label>{atom.label}<input type="number" step="any" value={answer.kind === "number" ? answer.value : ""} onChange={event => change(event.target.value === "" || !Number.isFinite(event.target.valueAsNumber) ? { kind: "unanswered" } : { kind: "number", value: event.target.valueAsNumber })}/><small>Finite decimal; absolute and relative tolerances are each 1e−9.</small></label>;
  if (atom.kind === "choice") return <fieldset><legend>{atom.label}</legend>{atom.options.map(option => <label key={option.id}><input type="radio" name={name} checked={answer.kind === "choice" && answer.optionId === option.id} onChange={() => change({ kind: "choice", optionId: option.id })}/>{option.label}</label>)}</fieldset>;
  return <fieldset><legend>{atom.label}</legend>{atom.slots.map(slot => <label key={slot.id}>{slot.label}<select value={answer.kind === "slots" ? answer.entries.find(entry => entry.slotId === slot.id)?.optionId ?? "" : ""} onChange={event => {
    const previous = answer.kind === "slots" ? answer.entries.filter(entry => entry.slotId !== slot.id) : [];
    change({ kind: "slots", entries: event.target.value ? [...previous, { slotId: slot.id, optionId: event.target.value }] : previous });
  }}><option value="">Choose a supplied repair</option>{slot.options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>)}</fieldset>;
}
export const REMEDIATION = [
  { worked: "rooms='3' stores text even though it looks numeric. has_garage=True stores bool, not a room count.", prompt: "A new record stores distance='2.5'. What is its type?", options: ["Text str, not float.", "Always a float because of its decimal point."], answer: 0 },
  { worked: "3 × 100 + 50 = 350 ($k). Multiply first; area units cancel weight's $k/unit. '3'*3 repeats text as '333'.", prompt: "Why is '3'*3 not a numeric price?", options: ["It is the number 9 in dollars.", "It is repeated text with no numeric price units."], answer: 1 },
  { worked: "area=2; area=area+1 stores 3. area==2 returns False without changing area.", prompt: "After area=4, does area==5 store 5?", options: ["Yes, == assigns the right-hand value.", "No, it returns False and area remains 4."], answer: 1 },
  { worked: "(float('2')+1)*100 and float('2')*100+100 both give 300. float('unknown') raises ValueError rather than silently producing zero.", prompt: "What does float('unknown') produce?", options: ["A ValueError, not a replacement prediction.", "A numeric zero."], answer: 0 },
];
function Practice({ index, progress, update }: { index: number; progress: Progress; update: (next: Progress) => void }) {
  const state = progress.practice[index];
  const definition: Family = PRACTICE[index][state.variant];
  const objectiveLabel = `P01.O${index + 1}`;
  const [localFeedback, setLocalFeedback] = useState("");
  const remediation = REMEDIATION[index];
  const exhausted = state.counts.every(count => count >= 2);
  const answers: Record<string, Answer> = Object.fromEntries(definition.atoms.map((atom, position) => [atom.id, state.response?.[position] ?? { kind: "unanswered" } as Answer]));
  return <section aria-labelledby={`practice-${index}`} className={styles.card}>
    <h3 id={`practice-${index}`}>{objectiveLabel} {definition.critical ? "— critical reasoning" : ""}</h3>
    <p>{state.passed ? "Practice demonstrated; not independent mastery." : "Practice not yet demonstrated."} Variant {state.variant === 0 ? "A" : "B"} · valid submissions {state.counts[state.variant]}/2 · review cycle {state.cycle >= 1e6 ? "1000000+" : state.cycle + 1}.</p>
    <p>{definition.prompt}</p><pre><code>{definition.code}</code></pre>
    {definition.atoms.map(atom => <AnswerInput key={`${definition.id}-${atom.id}`} atom={atom} answer={answers[atom.id]} name={`${definition.id}-${atom.id}`} change={answer => {
      const nextAnswers = { ...answers, [atom.id]: answer };
      const response = definition.atoms.map(item => nextAnswers[item.id]);
      update({ ...progress, practice: progress.practice.map((item, position) => position === index ? { ...item, response, feedback: "" } : item) });
      setLocalFeedback("");
    }}/>)}
    <button disabled={state.counts[state.variant] >= 2} onClick={() => {
      const result = submitPractice(progress, index, responseFor(definition, answers), new Date().toISOString());
      if (result.result.status === "invalid") setLocalFeedback(result.result.feedback);
      else { update(result.progress); setLocalFeedback(""); }
    }}>Check {objectiveLabel}</button>
    <p role="status">{localFeedback || state.feedback}</p>
    {state.counts[state.variant] >= 2 && <p><strong>Worked correction:</strong> {definition.explanation}</p>}
    {!exhausted && <button onClick={() => { update(alternatePractice(progress, index)); setLocalFeedback(""); }}>Use alternate {objectiveLabel} practice</button>}
    {exhausted && <div><h4>Remediation before a new review cycle</h4><p>{remediation.worked}</p>
      <label><input type="checkbox" checked={state.reviewed} onChange={event => update({ ...progress, practice: progress.practice.map((item, position) => position === index ? { ...item, reviewed: event.target.checked } : item) })}/>I reviewed this contrast.</label>
      <label>{remediation.prompt}<select value={state.counterexample} onChange={event => update({ ...progress, practice: progress.practice.map((item, position) => position === index ? { ...item, counterexample: event.target.value } : item) })}><option value="">Choose a counterexample explanation</option>{remediation.options.map((option, position) => <option key={option} value={String(position)}>{option}</option>)}</select></label>
      <button onClick={() => {
        if (!state.reviewed || state.counterexample !== String(remediation.answer)) { setLocalFeedback("Review the worked contrast and explain the changed case correctly before reopening practice."); return; }
        update(recoverPractice(progress, index, RECOVERY_ANSWERS[index], true)); setLocalFeedback("New review cycle opened. This repeats the finite practice bank; it is not independent mastery.");
      }}>Start new {objectiveLabel} review cycle</button></div>}
  </section>;
}

export function PythonP01() {
  const [store] = useState(() => new ProgressStore({ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) }));
  const [progress, setProgress] = useState(emptyProgress);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmModule, setConfirmModule] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setProgress(store.hydrate()); setWarning(store.warning); setReady(true); }, [store]);
  function update(next: Progress) {
    try { store.save(next); setProgress(next); setWarning(store.warning); }
    catch { setWarning("This representation cannot be saved. Complete all supplied repair slots; your last valid progress is preserved."); }
  }
  const experiment = EXPERIMENT.find(item => item.id === progress.experiment.config)!;
  const completed = progress.evidence.lessons["python.essentials.p01"]?.state === "completed";
  return <main className={styles.page}>
    <BetaNav status="Python P01 prototype"/>
    <a href="#p01-content">Skip to lesson content</a>
    <nav aria-label="Python lesson navigation"><Link href="/python">Python overview</Link><a href="#experiment">Experiment</a><a href="#practice">Objective practice</a><a href="#notebook">Notebook</a></nav>
    <header id="p01-content"><p>Python Essentials · P01 · beginner · no prior Python required</p><h1>Values, names, operators and units</h1><p>Build a meaningful house-price rule before learning more syntax. You will distinguish values and types, trace a weighted prediction, separate assignment from comparison, and repair a conversion.</p></header>
    <p role="status">{!ready ? "Loading local Python progress…" : completed ? "P01 lesson completed. Essentials mastery is unavailable: only 4 of 32 objective families are implemented." : "P01 in progress. Practice and interaction can complete this lesson, never award module mastery."}</p>
    {warning && <p role="alert">{warning}</p>}
    <section className={styles.card}><h2>1. A feature value is more than its appearance</h2>
      <p>Machine learning starts with observations. A model cannot treat a customer identifier, a measured area and a yes/no flag as interchangeable quantities. A <strong>value</strong> is the stored information; its <strong>type</strong> defines what operations mean.</p>
      <table><caption>The same record can contain different kinds of information</caption><thead><tr><th>Python value</th><th>Type</th><th>Meaning</th></tr></thead><tbody><tr><td><code>rooms = 3</code></td><td>int</td><td>A whole-number count</td></tr><tr><td><code>area = 2.5</code></td><td>float</td><td>A decimal measurement</td></tr><tr><td><code>postcode = '003'</code></td><td>str</td><td>Text: leading zeros may matter</td></tr><tr><td><code>has_garage = True</code></td><td>bool</td><td>A yes/no condition, not a count</td></tr></tbody></table>
      <p>A <strong>name</strong> refers to a value. Quotes mark text; they do not merely decorate a number. Python's <code>bool</code> has some numeric behavior, but a Boolean feature's meaning is still a condition; these checks never silently coerce bool into a numeric answer.</p>
      <p><strong>Changed case:</strong> <code>distance = '2.5'</code> is text. It needs a deliberate, valid conversion before numeric prediction. A postcode should usually stay text. Choose conversion based on meaning, not appearance.</p>
    </section>
    <section className={styles.card}><h2>2. Weighted predictions carry units</h2>
      <p>Suppose area is measured in hundreds of square metres. A simple model assigns a weight of 100 thousand dollars per area unit and a baseline price of 50 thousand dollars.</p>
      <p><strong>Prediction = area × weight + bias.</strong> Area is the measured feature; weight converts one area unit to price; bias is the baseline. <code>$k</code> means thousands of dollars. This is the same <Link href="/math/algebra-functions/variables">weighted-sum idea from Algebra</Link>, not a new law of house prices.</p>
      <pre><code>{"area = 2\nweight = 100\nbias = 50\nprediction = area * weight + bias"}</code></pre>
      <ol><li>Substitute numeric values: 2 × 100 + 50.</li><li>Multiplication happens before addition: 200 + 50 = 250.</li><li>Area units cancel the weight's per-area unit, leaving 250 ($k), or $250,000.</li></ol>
      <p><strong>Changed case:</strong> area 4 gives 450 ($k). Doubling the area does not double the full prediction because the bias is added only once.</p>
      <p><strong>Misconception:</strong> <code>'2' * 3</code> gives <code>'222'</code>. Repeating text is not numerical multiplication, and it has no numeric price units. Python's valid operation can still be the wrong ML reasoning.</p>
    </section>
    <fieldset disabled={!ready} className={styles.activity}><legend>Interactive learning and saved practice</legend>
      <section id="experiment" className={styles.card}><h2>Experiment: change one representation</h2><p>This is a deterministic simulation of six trusted Python fixtures, not an interpreter. Change a supplied configuration, predict its output and explain why before revealing the trace.</p>
        <label>Experiment configuration<select value={experiment.id} onChange={event => update(chooseExperiment(progress, event.target.value))}>{EXPERIMENT.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <pre><code>{experiment.code}</code></pre>
        <label>Predict the output<select value={progress.experiment.prediction} onChange={event => update({ ...progress, experiment: { ...progress.experiment, prediction: event.target.value, revealed: false } })}><option value="">Choose an output</option>{PREDICTIONS.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <label>Explain the operation<select value={progress.experiment.reason} onChange={event => update({ ...progress, experiment: { ...progress.experiment, reason: event.target.value, revealed: false } })}><option value="">Choose an explanation</option>{REASONS.map(reason => <option key={reason.id} value={reason.id}>{reason.label}</option>)}</select></label>
        <button onClick={() => { update(checkExperiment(progress, new Date().toISOString())); resultRef.current?.focus(); }}>Check prediction and reveal trace</button>
        <button onClick={() => update({ ...progress, experiment: { ...progress.experiment, config: EXPERIMENT[0].id, prediction: "", reason: "", revealed: false } })}>Reset experiment controls</button>
        <div ref={resultRef} tabIndex={-1} role="status" aria-label="Experiment result">{progress.experiment.revealed && <><p>{progress.experiment.prediction === experiment.value && progress.experiment.reason === experiment.reason ? "Prediction and explanation correct." : "Not yet: compare your prediction and explanation with this trace."} {!progress.experiment.changed && "Change a configuration to earn meaningful interaction evidence."}</p><ol>{experiment.steps.map(step => <li key={step}>{step}</li>)}</ol><p>Output: {experiment.value}. Type: {experiment.type}. Units: {experiment.units}.</p></>}</div>
        <p>{progress.experiment.passed ? "Meaningful interaction and a correct explanation recorded. Not mastery." : "Interaction/explanation evidence not yet recorded."}</p>
      </section>
      <section className={styles.card}><h2>3. Assignment updates; comparison asks</h2><pre><code>{"area = 2\narea = area + 1\ncomparison = area == 2"}</code></pre><p>The first assignment stores 2. The second reads the old value, adds one and stores 3. <code>==</code> asks whether 3 equals 2: <code>False</code>. It does not restore 2.</p><p><strong>Changed case:</strong> after <code>area = 5</code>, <code>area == 5</code> returns True but does not perform an update. Assignment is not the symmetric equality relation used when solving algebraic equations. Predicting a model's state requires tracing updates in order.</p></section>
      <section className={styles.card}><h2>4. Group intentionally; convert safely</h2><p>For a rule that adds one area unit before multiplying, parentheses matter. With numeric text <code>area = '2'</code>, convert explicitly:</p><pre><code>{"(float(area) + 1) * 100\nfloat(area) * 100 + 100"}</code></pre><p>Both give 300.0 here: the second distributes multiplication. In contrast, <code>float(area) + 1 * 100</code> gives 102.0, the wrong rule. Without conversion, adding text and a number raises TypeError.</p><p><strong>Failure case:</strong> <code>float('unknown')</code> raises <code>ValueError</code>. There is no numeric output. Replacing a failed conversion with zero can invent a false feature or price. Later lessons will teach error handling; here identify the failure rather than hide it.</p></section>
      <section id="practice"><h2>Demonstrate all four objectives</h2><p>These are guided practice, not the independent Essentials assessment. Both parts of critical P01.O2 must be correct. In repair questions, complete both supplied slots before checking.</p>{OBJECTIVES.map((objective, index) => <Practice key={objective} index={index} progress={progress} update={update}/>)}</section>
      <section id="notebook" className={styles.card}><h2>Notebook template and P01 feasibility</h2><p><a href="/notebooks/python-p01-template.ipynb" download>Download the trusted P01 notebook</a>. It includes worked predictions, assignment traces, two equivalent repairs and a conversion-failure check. Run it locally in the approved exact environment; notebooks do not submit evidence or award platform mastery.</p><p>Genuine Google Colab execution remains unverified. Local success is not a Colab compatibility claim. No credentials, uploads or external data are needed by the notebook code.</p></section>
      <section className={styles.card}><h2>Independent mastery is not available yet</h2><p>Only 4 of 32 Essentials objective families and 1 of its 8 critical gates are implemented. The complete future assessment requires at least 26/32 plus every critical gate, together in one independent attempt. No synthetic test or P01 completion can award it.</p></section>
      <section className={styles.card}><h2>Scoped resets</h2><label><input type="checkbox" checked={confirmReset} onChange={event => setConfirmReset(event.target.checked)}/>Confirm clearing only P01 practice, draft answers and lesson completion. Other subjects stay unchanged.</label><button disabled={!confirmReset} onClick={() => { update(resetLessonPractice(progress, true)); setConfirmReset(false); }}>Reset P01 lesson practice</button><label><input type="checkbox" checked={confirmModule} onChange={event => setConfirmModule(event.target.checked)}/>Confirm deleting this Python Essentials scope, including any unsupported saved record. Other subjects stay unchanged.</label><button disabled={!confirmModule} onClick={() => { setProgress(store.resetModule(true)); setWarning(store.warning); setConfirmModule(false); }}>Reset this Python module</button><p>Lesson reset never replaces an unsupported saved record. A separately confirmed module reset clears only this Python scope; if storage fails, it resets this visit in memory only.</p></section>
    </fieldset>
  </main>;
}
