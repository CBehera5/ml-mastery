"use client";

import { useEffect, useRef, useState } from "react";
import { linearNeuronTrace, type LinearNeuronTrace } from "@mlmath/runtime";
import styles from "./welcome.module.css";

type Direction = "increase" | "decrease" | "unsure";
type Stage = "predict" | "ready" | "result" | "restored";
const explanations: Record<Direction, string> = {
  increase: "Yes. With the same positive distance, more minutes per kilometre makes the estimate larger. Try the change to see by how much.",
  decrease: "The delivery distance stays fixed. Allowing more minutes for each kilometre adds time rather than removing it. Try the change and compare.",
  unsure: "Keep the delivery fixed. We are changing only how many minutes the rule allows for each kilometre. Try it and compare before with after.",
};

// A disposable reference experiment. No live-lab callbacks, storage or guide events.
export function ParameterExperiment({ reference }: { reference: LinearNeuronTrace }) {
  const [direction, setDirection] = useState<Direction | "">("");
  const [stage, setStage] = useState<Stage>("predict");
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const replaying = useRef(false);
  const before = reference.forward;
  const startWeight = reference.input.weights[1];
  const nextWeight = startWeight + 1;
  const tried = stage === "result" || stage === "restored";
  // Never apply the runtime's returned update: this is a manual one-weight comparison.
  const changed = tried ? linearNeuronTrace({ ...reference.input, inputs: [...reference.input.inputs], weights: [reference.input.weights[0], nextWeight] }).forward : null;
  const absoluteBefore = Math.abs(before.error);
  const absoluteAfter = changed ? Math.abs(changed.error) : null;
  const announcement = stage === "ready" && direction ? explanations[direction]
    : stage === "result" && changed ? `Distance weight increased from ${startWeight} to ${nextWeight} minutes per kilometre. Prediction increased from ${before.prediction} to ${changed.prediction} minutes. Recorded outcome remains ${reference.input.target} minutes. Absolute error decreased from ${absoluteBefore} to ${absoluteAfter} minutes.`
    : stage === "restored" && changed ? `Example restored to ${startWeight} minutes per kilometre. Prediction returned from ${changed.prediction} to ${before.prediction} minutes. Absolute error increased from ${absoluteAfter} to ${absoluteBefore} minutes. Your full lab is unchanged.` : "";
  useEffect(() => {
    if (replaying.current) { heading.current?.focus(); replaying.current = false; }
    else if (document.activeElement instanceof HTMLElement && section.current?.contains(document.activeElement)) document.activeElement.scrollIntoView?.({ block: "nearest" });
  }, [stage]);
  return <section ref={section} className={styles.experiment} aria-labelledby="parameter-experiment-title" data-testid="parameter-experiment">
    <p className={styles.kicker}>One change · same delivery</p>
    <h2 ref={heading} tabIndex={-1} id="parameter-experiment-title">Change the rule, not the trip</h2>
    <p>The distance weight currently allows <strong>{startWeight} minutes per kilometre</strong>. We will try <strong>{nextWeight} min/km</strong>. The delivery stays at {reference.input.inputs[0]} items and {reference.input.inputs[1]} km. Its recorded outcome stays {reference.input.target} minutes.</p>
    <p>Items still contribute {before.weightedInputs[0]} minutes ({reference.input.inputs[0]} items × {reference.input.weights[0]} min/item). The baseline still adds {reference.input.bias} minute. Only the distance weight changes in this separate example; your full lab stays unchanged.</p>
    {stage === "predict" && <fieldset className={styles.choices}>
      <legend>Will increasing the distance weight increase or decrease the model prediction?</legend>
      {([["increase", "Increase"], ["decrease", "Decrease"], ["unsure", "Not sure"]] as const).map(([value, label]) => <label key={value}><input type="radio" name="parameter-direction" value={value} checked={direction === value} onChange={() => setDirection(value)} />{label}</label>)}
      <p className={styles.note}>Choose an answer, or choose Not sure. Any choice can continue. The current prediction is {before.prediction} minutes.</p>
    </fieldset>}
    {stage === "ready" && direction && <p>{explanations[direction]}</p>}
    <div className={styles.srOnly} aria-live="polite" aria-atomic="true" data-testid="parameter-announcement">{announcement}</div>
    {tried && changed && <div data-testid="parameter-result">
      <dl className={styles.comparison}>
        <div><dt>Before prediction</dt><dd>{before.prediction} minutes</dd></div>
        <div><dt>After trying {nextWeight} min/km</dt><dd>{changed.prediction} minutes</dd></div>
      </dl>
      <p>Recorded outcome: still <strong>{reference.input.target} minutes</strong>. Distance contributed {reference.input.inputs[1]} km × {startWeight} min/km = {before.weightedInputs[1]} minutes before, then {reference.input.inputs[1]} km × {nextWeight} min/km = {changed.weightedInputs[1]} minutes. The extra {nextWeight - startWeight} min/km adds {changed.prediction - before.prediction} minutes because the distance is {reference.input.inputs[1]} km.</p>
      <p>The total changes from {before.weightedInputs[0]} + {before.weightedInputs[1]} + {reference.input.bias} = {before.prediction} minutes to {changed.weightedInputs[0]} + {changed.weightedInputs[1]} + {reference.input.bias} = {changed.prediction} minutes.</p>
      <p><strong>Absolute error: {absoluteBefore} minutes before; {absoluteAfter} minutes after.</strong> This means how far the estimate is from the recorded outcome, ignoring direction: |{before.prediction} − {reference.input.target}| = {absoluteBefore}, then |{changed.prediction} − {reference.input.target}| = {absoluteAfter} minutes. The miss is smaller by {absoluteBefore - Math.abs(changed.error)} minutes: improved for this trip.</p>
      {stage === "restored" && <p className={styles.card}><strong>Example restored:</strong> current distance weight {startWeight} min/km; current prediction {before.prediction} minutes. Absolute error returned from {absoluteAfter} to {absoluteBefore} minutes, worse by {absoluteBefore - Math.abs(changed.error)} minutes for this trip. The comparison above shows the change you just reversed. Your full lab was not reset.</p>}
      <p>Matching one delivery does not establish model reliability. We chose this change by hand. Predicting other deliveries reliably needs more examples and evaluation on deliveries the model has not learned from.</p>
    </div>}
    <button type="button" ref={action} className={styles.primary} disabled={stage === "predict" && !direction} onClick={() => setStage(current => current === "predict" ? "ready" : "result")}>{stage === "predict" ? "Check my prediction" : stage === "ready" ? `Try ${nextWeight} min/km` : `Try ${nextWeight} min/km again`}</button>
    {tried && <button type="button" className={styles.quiet} onClick={() => setStage("restored")}>Restore example to {startWeight} min/km</button>}
    <button type="button" className={styles.quiet} onClick={() => { replaying.current = true; setDirection(""); setStage("predict"); if (stage === "predict") { heading.current?.focus(); replaying.current = false; } }}>Replay experiment</button>
    <p className={styles.note}>In the full lab: x1 means item count; x2 means distance in km; w1 means min/item; w2 means min/km; bias means baseline minutes. Your current lab may have different values. This example awards no guide completion or mastery.</p>
  </section>;
}
