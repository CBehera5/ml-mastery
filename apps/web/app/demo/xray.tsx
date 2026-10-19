"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { linearNeuronTrace, type LinearNeuronInput, type LinearNeuronTrace } from "@mlmath/runtime";
import { BetaNav } from "../components/beta-nav";
import { trackEvent } from "../lib/analytics";

const REFERENCE: LinearNeuronInput = { inputs: [2, 3], weights: [1, 2], bias: 1, target: 12, learningRate: 0.01 };
const MAX_TRAINING_STEPS = 100;
type InspectorView = "forward" | "backward" | "update";
type DiagramMode = "forward" | "backward";
type Draft = { inputs: string[]; weights: string[]; bias: string; target: string; learningRate: string };
type HistoryPoint = { step: number; before: number; after: number };
type LessonProgress = { ranForward: boolean; changedWeight: boolean; inspectedLoss: boolean; inspectedGradient: boolean; appliedUpdate: boolean };

const LESSONS = [
  { title: "Inputs become a prediction", explanation: "Each feature travels through its own weighted connection. The neuron combines those contributions with the bias to produce ŷ.", action: "Run the forward pass with the reference values." },
  { title: "Weights control influence", explanation: "A weight changes how strongly—and in which direction—its input affects the prediction.", action: "Change either weight, then run the forward pass again." },
  { title: "Loss measures the miss", explanation: "The target is the answer we want. Squared-error loss turns the gap between prediction and target into one non-negative score.", action: "Select the squared-loss summary card." },
  { title: "Gradients point the way", explanation: "Backpropagation uses the chain rule to measure how much each parameter contributed to the loss.", action: "Switch to Backward mode and select a connection." },
  { title: "An update becomes learning", explanation: "Gradient descent moves parameters opposite their gradients. A useful step should usually reduce loss—but an oversized step can overshoot.", action: "Apply one gradient update and compare the loss." },
] as const;

const toDraft = (value: LinearNeuronInput): Draft => ({ inputs: value.inputs.map(String), weights: value.weights.map(String), bias: String(value.bias), target: String(value.target), learningRate: String(value.learningRate) });
const isFiniteTrace = (trace: LinearNeuronTrace) => [trace.forward.prediction, trace.forward.loss, ...trace.backward.weightGradients, trace.backward.biasGradient, ...trace.update.weights, trace.update.bias, trace.update.prediction, trace.update.loss].every(Number.isFinite);
const parseDraft = (draft: Draft): LinearNeuronInput => {
  const parse = (label: string, value: string) => {
    if (value.trim() === "") throw new Error(`${label} is required.`);
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error(`${label} must be a finite number.`);
    return number;
  };
  return { inputs: draft.inputs.map((v, i) => parse(`Input x${i + 1}`, v)), weights: draft.weights.map((v, i) => parse(`Weight w${i + 1}`, v)), bias: parse("Bias", draft.bias), target: parse("Target", draft.target), learningRate: parse("Learning rate", draft.learningRate) };
};
const format = (value: number, digits = 4) => {
  if (!Number.isFinite(value)) return value > 0 ? "∞" : value < 0 ? "−∞" : "NaN";
  if (value === 0) return "0";
  const magnitude = Math.abs(value);
  if (magnitude >= 100_000 || magnitude < 0.0001) return value.toExponential(3);
  return Number(value.toFixed(digits)).toString();
};

function GuidedLesson({ current, completed, onPrevious, onNext }: { current: number; completed: boolean[]; onPrevious: () => void; onNext: () => void }) {
  const lesson = LESSONS[current];
  return <section className="lesson panel" aria-labelledby="lesson-title">
    <div className="lesson-progress" aria-label={`Lesson step ${current + 1} of ${LESSONS.length}`}>
      {LESSONS.map((item, index) => <span key={item.title} className={`${index === current ? "current" : ""} ${completed[index] ? "complete" : ""}`}><b>{completed[index] ? "✓" : index + 1}</b><span>{item.title}</span></span>)}
    </div>
    <div className="lesson-body">
      <div><p className="eyebrow">Guided lesson · {current + 1} of {LESSONS.length}</p><h2 id="lesson-title">{lesson.title}</h2><p>{lesson.explanation}</p></div>
      <div className={`lesson-action ${completed[current] ? "done" : ""}`} role="status"><span aria-hidden="true">{completed[current] ? "✓" : "→"}</span><div><strong>{completed[current] ? "Step complete" : "Try this"}</strong><p>{completed[current] ? "You demonstrated this idea using the live model." : lesson.action}</p></div></div>
    </div>
    <div className="lesson-nav"><button type="button" onClick={onPrevious} disabled={current === 0}>Previous</button><span>{completed.filter(Boolean).length} of {LESSONS.length} complete</span><button type="button" className="primary-next" onClick={onNext} disabled={!completed[current] || current === LESSONS.length - 1}>Next</button></div>
  </section>;
}

function ParameterField({ id, label, value, onChange, step = "any", hint }: { id: string; label: string; value: string; onChange: (value: string) => void; step?: string; hint?: string }) {
  return <label htmlFor={id}>{label}<input id={id} type="number" step={step} value={value} onChange={(event) => onChange(event.target.value)} />{hint && <small>{hint}</small>}</label>;
}

function NetworkDiagram({ trace, mode, selected, onSelect }: { trace: LinearNeuronTrace; mode: DiagramMode; selected: number | null; onSelect: (index: number) => void }) {
  const count = trace.input.inputs.length;
  const positions = trace.input.inputs.map((_, index) => count === 1 ? 155 : 58 + (index * 194) / (count - 1));
  return <svg className="network" viewBox="0 0 700 310" role="img" aria-labelledby="network-title network-desc">
    <title id="network-title">Linear neuron signal diagram</title>
    <desc id="network-desc">{count} input features connect to one prediction node. Solid connections are positive and dashed connections are negative. Thicker lines have larger absolute weights.</desc>
    <g>{trace.input.weights.map((weight, index) => <g key={`connection-${index}`}>
      <line x1="145" y1={positions[index]} x2="505" y2="155" className={`connection ${weight < 0 ? "negative" : "positive"} ${selected === index ? "selected" : ""}`} style={{ strokeWidth: Math.min(11, 2.5 + Math.abs(weight) * 2.4) }} />
      <line x1="145" y1={positions[index]} x2="505" y2="155" className="connection-hit" role="button" tabIndex={0} aria-label={`Select connection ${index + 1}, weight ${format(weight)}`} onClick={() => onSelect(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(index); }} />
      <text x="315" y={(positions[index] + 155) / 2 - 8} className="weight-label">{mode === "forward" ? `w${index + 1} ${format(weight)} · contribution ${format(trace.forward.weightedInputs[index])}` : `∂L/∂w${index + 1} ${format(trace.backward.weightGradients[index])}`}</text>
    </g>)}</g>
    {trace.input.inputs.map((value, index) => <g key={`node-${index}`} className="diagram-motion"><circle cx="105" cy={positions[index]} r="42" className="node input-node" /><text x="105" y={positions[index] - 7} className="node-label">x{index + 1}</text><text x="105" y={positions[index] + 18} className="node-value">{format(value)}</text></g>)}
    <g className="diagram-motion"><circle cx="555" cy="155" r="66" className="node output-node" /><text x="555" y="142" className="node-label">prediction ŷ</text><text x="555" y="178" className="output-value">{format(trace.forward.prediction)}</text></g>
    <g className="bias-chip"><rect x="493" y="250" width="124" height="34" rx="17" /><text x="555" y="272">bias {format(trace.input.bias)}</text></g>
  </svg>;
}

function LossChart({ history, selectedStep, onSelectStep }: { history: HistoryPoint[]; selectedStep: number | null; onSelectStep: (step: number) => void }) {
  if (history.length === 0) return <div className="chart-empty">Apply an update or train to plot loss over time.</div>;
  const values = [history[0].before, ...history.map((point) => point.after)].filter(Number.isFinite);
  const max = Math.max(...values, 1e-12), width = 640, height = 190;
  const points = values.map((value, index) => ({ x: values.length === 1 ? 32 : 32 + (index * (width - 64)) / (values.length - 1), y: height - 24 - (value / max) * (height - 52), value }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  return <svg className="loss-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">Loss by training step</title><desc id="chart-desc">Loss values: {values.map((value) => format(value)).join(", ")}.</desc><line x1="32" y1={height - 24} x2={width - 24} y2={height - 24} className="chart-axis" /><line x1="32" y1="18" x2="32" y2={height - 24} className="chart-axis" /><path d={path} className="chart-line" />{points.map((point, index) => <g key={`${point.x}-${index}`} role="button" tabIndex={index === 0 ? -1 : 0} aria-label={index === 0 ? "Initial loss" : `Inspect training step ${index}`} onClick={() => index > 0 && onSelectStep(index)} onKeyDown={(event) => { if (index > 0 && (event.key === "Enter" || event.key === " ")) onSelectStep(index); }}><circle cx={point.x} cy={point.y} r={selectedStep === index ? "8" : "5"} className={`chart-point ${selectedStep === index ? "selected" : ""}`} /><text x={point.x} y={height - 7} className="chart-label">{index}</text></g>)}</svg>;
}

function CalculationInspector({ trace, updateTrace, view, onViewChange }: { trace: LinearNeuronTrace; updateTrace: LinearNeuronTrace; view: InspectorView; onViewChange: (view: InspectorView) => void }) {
  const tabs: Array<{ id: InspectorView; label: string }> = [{ id: "forward", label: "Forward pass" }, { id: "backward", label: "Backward pass" }, { id: "update", label: "Update" }];
  return <section className="panel inspector" aria-labelledby="inspector-title">
    <div className="section-title-row"><div><span className="step">03</span><h2 id="inspector-title">Calculation inspector</h2></div><code>trace · v{trace.schemaVersion}</code></div>
    <div className="tabs" role="tablist" aria-label="Calculation stage">{tabs.map((tab) => <button key={tab.id} role="tab" aria-selected={view === tab.id} onClick={() => onViewChange(tab.id)}>{tab.label}</button>)}</div>
    {view === "forward" && <div className="trace-grid" role="tabpanel" aria-label="Forward pass calculations">
      {trace.forward.weightedInputs.map((contribution, index) => <div className="trace-row" key={`forward-${index}`}><span>x{index + 1} × w{index + 1}</span><code>{format(trace.input.inputs[index])} × {format(trace.input.weights[index])}</code><strong>{format(contribution)}</strong></div>)}
      <div className="trace-row emphasis"><span>Contributions + bias</span><code>{trace.forward.weightedInputs.map(format).join(" + ")} + {format(trace.input.bias)}</code><strong>ŷ = {format(trace.forward.prediction)}</strong></div>
      <div className="trace-row"><span>Error</span><code>{format(trace.forward.prediction)} − {format(trace.input.target)}</code><strong>{format(trace.forward.error)}</strong></div>
      <div className="trace-row result"><span>Squared-error loss</span><code>({format(trace.forward.error)})²</code><strong>L = {format(trace.forward.loss)}</strong></div>
    </div>}
    {view === "backward" && <div className="trace-grid" role="tabpanel" aria-label="Backward pass calculations">
      <div className="trace-row emphasis"><span>Loss → prediction</span><code>2 × error</code><strong>∂L/∂ŷ = {format(trace.backward.dLossDPrediction)}</strong></div>
      {trace.backward.weightGradients.map((gradient, index) => <div className="trace-row" key={`backward-${index}`}><span>Chain rule for w{index + 1}</span><code>{format(trace.backward.dLossDPrediction)} × {format(trace.backward.dPredictionDWeights[index])}</code><strong>∂L/∂w{index + 1} = {format(gradient)}</strong></div>)}
      <div className="trace-row result"><span>Bias gradient</span><code>∂ŷ/∂b = 1</code><strong>∂L/∂b = {format(trace.backward.biasGradient)}</strong></div>
    </div>}
    {view === "update" && <div className="trace-grid" role="tabpanel" aria-label="Parameter update calculations">
      {updateTrace.update.weights.map((weight, index) => <div className="trace-row" key={`update-${index}`}><span>Update w{index + 1}</span><code>{format(updateTrace.input.weights[index])} − {format(updateTrace.input.learningRate)} × ({format(updateTrace.backward.weightGradients[index])})</code><strong>{format(weight)}</strong></div>)}
      <div className="trace-row"><span>Update bias</span><code>{format(updateTrace.input.bias)} − {format(updateTrace.input.learningRate)} × ({format(updateTrace.backward.biasGradient)})</code><strong>{format(updateTrace.update.bias)}</strong></div>
      <div className="trace-row emphasis"><span>Learning rate</span><code>η</code><strong>{format(updateTrace.input.learningRate)}</strong></div>
      <div className="trace-row result"><span>After update</span><code>prediction {format(updateTrace.update.prediction)}</code><strong>loss {format(updateTrace.update.loss)}</strong></div>
    </div>}
  </section>;
}

export function NeuralNetworkXRay() {
  const initialTrace = useMemo(() => linearNeuronTrace(REFERENCE), []);
  const [draft, setDraft] = useState<Draft>(() => toDraft(REFERENCE));
  const [trace, setTrace] = useState(initialTrace);
  const [lastUpdateTrace, setLastUpdateTrace] = useState(initialTrace);
  const [view, setView] = useState<InspectorView>("forward");
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [trainingSteps, setTrainingSteps] = useState("10");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [draftValid, setDraftValid] = useState(true);
  const [mode, setMode] = useState<DiagramMode>("forward");
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const [selectedHistoryStep, setSelectedHistoryStep] = useState<number | null>(null);
  const [lessonStep, setLessonStep] = useState(0);
  const [progress, setProgress] = useState<LessonProgress>({ ranForward: false, changedWeight: false, inspectedLoss: false, inspectedGradient: false, appliedUpdate: false });
  const completed = [progress.ranForward, progress.changedWeight, progress.inspectedLoss, progress.inspectedGradient, progress.appliedUpdate];
  const lessonComplete = completed.every(Boolean);
  const completionTracked = useRef(false);
  useEffect(() => { trackEvent("demo_started"); }, []);
  useEffect(() => {
    if (lessonComplete && !completionTracked.current) {
      completionTracked.current = true;
      trackEvent("demo_completed");
    }
  }, [lessonComplete]);
  const editDraft = (producer: (current: Draft) => Draft, kind?: "weight") => {
    setDraft((current) => {
      const nextDraft = producer(current);
      try {
        const nextTrace = linearNeuronTrace(parseDraft(nextDraft));
        if (!isFiniteTrace(nextTrace)) throw new Error("This configuration produces nonfinite values.");
        setTrace(nextTrace);
        setLastUpdateTrace(nextTrace);
        setDraftValid(true);
        setError(null);
      } catch (caught) {
        setDraftValid(false);
        setError(caught instanceof Error ? caught.message : "Unable to calculate this scenario.");
      }
      return nextDraft;
    });
    if (kind === "weight") setProgress((current) => ({ ...current, changedWeight: true }));
    setDirty(true);
    setWarning(null);
  };
  const calculate = (input = parseDraft(draft)) => { const nextTrace = linearNeuronTrace(input); if (!isFiniteTrace(nextTrace)) throw new Error("This configuration produces nonfinite values. Reduce the input, weight, or learning rate magnitude."); return nextTrace; };
  const runForward = () => { try { const next = calculate(); setTrace(next); setLastUpdateTrace(next); setDirty(false); setDraftValid(true); setError(null); setWarning(null); setView("forward"); setMode("forward"); setProgress((current) => ({ ...current, ranForward: true, changedWeight: current.changedWeight && next.input.weights.some((weight, index) => weight !== REFERENCE.weights[index]) })); } catch (caught) { setDraftValid(false); setError(caught instanceof Error ? caught.message : "Unable to calculate this scenario."); } };
  const applyUpdate = () => { try { const source = dirty ? calculate() : trace; const input: LinearNeuronInput = { ...source.input, weights: source.update.weights, bias: source.update.bias }; const next = linearNeuronTrace(input); if (!isFiniteTrace(next)) throw new Error("The update produced nonfinite values. Reduce the learning rate."); setDraft(toDraft(input)); setTrace(next); setLastUpdateTrace(source); setHistory((current) => { const updated = [...current, { step: current.length + 1, before: source.forward.loss, after: next.forward.loss }]; setSelectedHistoryStep(updated.length); return updated; }); setDirty(false); setDraftValid(true); setError(null); setWarning(next.forward.loss > source.forward.loss ? "Loss increased after this update. The learning rate may be too high." : null); setView("update"); setProgress((current) => ({ ...current, appliedUpdate: true })); } catch (caught) { setDraftValid(false); setError(caught instanceof Error ? caught.message : "Unable to apply the update."); } };
  const train = () => { try { const steps = Number(trainingSteps); if (!Number.isInteger(steps) || steps < 1 || steps > MAX_TRAINING_STEPS) throw new Error(`Training steps must be a whole number from 1 to ${MAX_TRAINING_STEPS}.`); let current = dirty ? calculate() : trace; let latestUpdate = current; const points: HistoryPoint[] = []; let diverged = false; for (let index = 0; index < steps; index += 1) { latestUpdate = current; const input: LinearNeuronInput = { ...current.input, weights: current.update.weights, bias: current.update.bias }; const next = linearNeuronTrace(input); if (!isFiniteTrace(next)) { diverged = true; break; } points.push({ step: index + 1, before: current.forward.loss, after: next.forward.loss }); if (next.forward.loss > current.forward.loss) diverged = true; current = next; } setTrace(current); setLastUpdateTrace(latestUpdate); setDraft(toDraft(current.input)); setHistory(points); setSelectedHistoryStep(points.length || null); setDirty(false); setDraftValid(true); setError(null); setWarning(diverged ? "Training diverged: loss increased or became nonfinite. Try a smaller learning rate." : null); setView("update"); setProgress((value) => ({ ...value, appliedUpdate: points.length > 0 || value.appliedUpdate })); } catch (caught) { setDraftValid(false); setError(caught instanceof Error ? caught.message : "Unable to train this scenario."); } };
  const reset = () => { const next = linearNeuronTrace(REFERENCE); setDraft(toDraft(REFERENCE)); setTrace(next); setLastUpdateTrace(next); setHistory([]); setDirty(false); setDraftValid(true); setError(null); setWarning(null); setView("forward"); setMode("forward"); setSelectedConnection(null); setSelectedHistoryStep(null); setTrainingSteps("10"); };

  return <main>
    <BetaNav product={false} status={`Verified runtime · v${trace.schemaVersion}`} />
    <section className="intro"><p className="eyebrow">Interactive model microscope</p><h1>See what a neural network <em>actually computes.</em></h1><p>Edit a value. Follow the signal. Watch one gradient update turn error into learning.</p></section>
    <GuidedLesson current={lessonStep} completed={completed} onPrevious={() => setLessonStep((step) => Math.max(0, step - 1))} onNext={() => setLessonStep((step) => Math.min(LESSONS.length - 1, step + 1))} />
    <section className="workspace" aria-label="Neural Network X-Ray workspace">
      <aside className="panel controls"><div className="panel-heading"><div><span className="step">01</span><h2>Set the experiment</h2></div><button type="button" onClick={reset}>Reset</button></div>
        <div className="field-section"><h3>Features</h3><div className="field-grid">{draft.inputs.map((value, index) => <ParameterField key={`input-${index}`} id={`input-${index}`} label={`Input x${index + 1}`} value={value} onChange={(next) => editDraft((current) => ({ ...current, inputs: current.inputs.map((item, itemIndex) => itemIndex === index ? next : item) }))} />)}</div></div>
        <div className="field-section"><h3>Parameters</h3><div className="field-grid">{draft.weights.map((value, index) => <ParameterField key={`weight-${index}`} id={`weight-${index}`} label={`Weight w${index + 1}`} value={value} onChange={(next) => editDraft((current) => ({ ...current, weights: current.weights.map((item, itemIndex) => itemIndex === index ? next : item) }), "weight")} />)}<ParameterField id="bias" label="Bias b" value={draft.bias} hint="The neuron's adjustable baseline." onChange={(bias) => editDraft((current) => ({ ...current, bias }))} /></div></div>
        <div className="field-section"><h3>Goal & step size</h3><div className="field-grid"><ParameterField id="target" label="Target y" value={draft.target} hint="The desired prediction." onChange={(target) => editDraft((current) => ({ ...current, target }))} /><ParameterField id="learning-rate" label="Learning rate η" value={draft.learningRate} step="0.01" hint="How far parameters move per update." onChange={(learningRate) => editDraft((current) => ({ ...current, learningRate }))} /></div></div>
        {dirty && draftValid && <p className="notice stale" role="status"><span aria-hidden="true">↻</span> Values changed. The preview is synchronized; run the forward pass to confirm this experiment.</p>}{error && <p className="notice error" role="alert"><span aria-hidden="true">!</span> {error}</p>}{warning && <p className="notice warning" role="status"><span aria-hidden="true">▲</span> {warning}</p>}
        <div className="control-actions"><button type="button" className="button primary" onClick={runForward}>Run forward pass <span aria-hidden="true">→</span></button><button type="button" className="button secondary" onClick={() => { if (!draftValid) return; setMode("backward"); setView("backward"); }}>Inspect backward pass</button><button type="button" className="button secondary" onClick={applyUpdate}>Apply one update</button></div>
        <div className="train-box"><ParameterField id="training-steps" label={`Training steps (max ${MAX_TRAINING_STEPS})`} value={trainingSteps} step="1" onChange={setTrainingSteps} /><button type="button" className="button train" onClick={train}>Train model</button></div>
      </aside>
      <div className="main-column"><section className={`panel model-card ${!draftValid ? "is-stale" : ""}`} aria-label="Current mathematical trace"><div className="panel-heading"><div><span className="step">02</span><h2>Trace the signal</h2></div><span className="live">{!draftValid ? "Invalid draft" : dirty ? "Live preview" : "Confirmed"}</span></div>
        <div className="mode-toggle" role="tablist" aria-label="Signal direction"><button type="button" role="tab" aria-selected={mode === "forward"} onClick={() => { setMode("forward"); setView("forward"); }}>Forward <span>contributions</span></button><button type="button" role="tab" aria-selected={mode === "backward"} onClick={() => { setMode("backward"); setView("backward"); }}>Backward <span>gradients</span></button></div>
        {draftValid ? <><NetworkDiagram trace={trace} mode={mode} selected={selectedConnection} onSelect={(index) => { setSelectedConnection(index); if (mode === "backward") setProgress((current) => ({ ...current, inspectedGradient: true })); }} />
        {selectedConnection !== null && <div className="connection-explanation" role="status"><span className="connection-number">w{selectedConnection + 1}</span><div><strong>{mode === "forward" ? `${format(trace.input.inputs[selectedConnection])} × ${format(trace.input.weights[selectedConnection])} = ${format(trace.forward.weightedInputs[selectedConnection])}` : `Gradient ${format(trace.backward.weightGradients[selectedConnection])} → move weight ${trace.backward.weightGradients[selectedConnection] > 0 ? "down" : trace.backward.weightGradients[selectedConnection] < 0 ? "up" : "nowhere"}`}</strong><p>{mode === "forward" ? "This weighted contribution is one part of the prediction." : "Gradient descent moves opposite the gradient; its size is scaled by the learning rate."}</p></div></div>}
        <div className="metrics"><div><span>Prediction</span><strong data-testid="prediction">{format(trace.forward.prediction)}</strong></div><div><span>Target</span><strong>{format(trace.input.target)}</strong><small>The answer the neuron is trying to match.</small></div><button type="button" className="loss" onClick={() => setProgress((current) => ({ ...current, inspectedLoss: true }))}><span>Squared loss</span><strong data-testid="loss">{format(trace.forward.loss)}</strong><small>Select to understand the error score.</small></button></div></> : <div className="invalid-visual"><strong>Fix the highlighted value to resume the live trace.</strong><p>The last valid calculation is hidden so stale numbers are never presented as current.</p></div>}
      </section>{draftValid && <CalculationInspector trace={trace} updateTrace={lastUpdateTrace} view={view} onViewChange={(next) => { setView(next); if (next === "backward") setMode("backward"); if (next === "forward") setMode("forward"); }} />}</div>
    </section>
    <aside className="learning-rate-note"><span aria-hidden="true">η</span><div><strong>Why step size matters</strong><p>At η = 0.01, the reference update lowers loss from 9 to 4.6656. At η = 1, the same gradient overshoots and raises loss to 6,561. A gradient gives direction; the learning rate decides distance.</p></div></aside>
    <section className="panel history-panel" aria-labelledby="history-title"><div className="section-title-row"><div><span className="step">04</span><h2 id="history-title">Training history</h2></div><div className="history-actions"><button type="button" className="text-button" onClick={reset}>Reset experiment</button><button type="button" className="text-button" onClick={() => { setHistory([]); setSelectedHistoryStep(null); setWarning(null); }}>Clear history</button></div></div><div className="history-layout"><div><LossChart history={history} selectedStep={selectedHistoryStep} onSelectStep={setSelectedHistoryStep} />{selectedHistoryStep !== null && history[selectedHistoryStep - 1] && <p className={`history-explanation ${history[selectedHistoryStep - 1].after > history[selectedHistoryStep - 1].before ? "increase" : "decrease"}`}>{history[selectedHistoryStep - 1].after > history[selectedHistoryStep - 1].before ? "Loss increased: this update moved too far or in an unstable region. Try a smaller learning rate." : "Loss decreased: this update moved the prediction closer to the target."} Change: {format(history[selectedHistoryStep - 1].after - history[selectedHistoryStep - 1].before)}.</p>}</div><div className="history-list" aria-label="Loss before and after each update">{history.length === 0 ? <p>No updates recorded yet.</p> : history.map((point) => <button type="button" className={`history-row ${point.after > point.before ? "increase" : "decrease"} ${selectedHistoryStep === point.step ? "selected" : ""}`} key={point.step} onClick={() => setSelectedHistoryStep(point.step)}><span className="direction" aria-hidden="true">{point.after > point.before ? "↑" : "↓"}</span><div><strong>Step {point.step}</strong><span>{format(point.before)} → {format(point.after)}</span></div></button>)}</div></div></section>
    {lessonComplete && <section className="panel route-completion" aria-labelledby="demo-complete-title"><div><span aria-hidden="true">✓</span><div><p className="eyebrow">X-Ray complete</p><h2 id="demo-complete-title">You followed one full learning step.</h2><p>You connected inputs to a prediction, interpreted loss, inspected chain-rule gradients, and applied a descent update.</p></div></div><a className="button primary beta-link-button" href="/challenges/wrong-direction"><span>Continue to the debugging challenge</span><span aria-hidden="true">→</span></a></section>}
    <footer><p>One linear neuron. Every number exposed.</p><p>Calculations run locally in your browser using the verified ML Math Lab runtime.</p></footer>
  </main>;
}
