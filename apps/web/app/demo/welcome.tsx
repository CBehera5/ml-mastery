"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import type { LinearNeuronTrace } from "@mlmath/runtime";
import styles from "./welcome.module.css";
import { ParameterExperiment } from "./parameter-experiment";

type Reason = "more" | "less" | "unsure";
const feedback: Record<Reason, string> = {
  more: "Yes. The estimate is 3 minutes shorter than the recorded trip. We want to understand what produced that estimate before we change it.",
  less: "Compare 9 with 12: allowing less time would move this estimate farther from what happened. Let’s trace how 9 was calculated.",
  unsure: "The trip took 12 minutes and the estimate allowed 9. That is 3 minutes too short. We can inspect the rule without knowing any ML terminology yet.",
};

// Presentation only: this reference trace never edits the live experiment or guide.
export function XRayWelcome({ reference, headingRef, onEnter }: { reference: LinearNeuronTrace; headingRef: Ref<HTMLHeadingElement>; onEnter: () => void }) {
  const [reason, setReason] = useState<Reason | "">("");
  const [phase, setPhase] = useState<"reason" | "feedback" | "calculation">("reason");
  const [contribution, setContribution] = useState(0);
  const primaryAction = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (primaryAction.current === document.activeElement) primaryAction.current?.scrollIntoView?.({ block: "nearest" });
  }, [phase, contribution]);
  const reasonInput = useRef<HTMLInputElement>(null);
  const reviewing = useRef(false);
  useEffect(() => { if (reviewing.current && phase === "reason") { reasonInput.current?.focus(); reviewing.current = false; } }, [phase]);
  return <section className={styles.welcome} aria-labelledby="xray-welcome-title">
    <p className={styles.kicker}>ML Math Lab · a fictional delivery</p>
    <h1 className={styles.title} id="xray-welcome-title" ref={headingRef} tabIndex={-1}>This delivery took 12 minutes.</h1>
    <p>A delivery carried <strong>2 items</strong> over <strong>3 kilometres</strong>. Our simple model estimated <strong>9 minutes</strong>. What do you notice before we change anything?</p>
    <button className={styles.quiet} type="button" onClick={onEnter}>Skip introduction — open full lab</button>
    <p className={styles.note}>This is the reference example, not a replacement for your current experiment. Opening or replaying the introduction does not reset the model.</p>
    <dl className={styles.comparison}>
      <div><dt>Model estimate</dt><dd>{reference.forward.prediction} minutes</dd></div>
      <div><dt>Recorded outcome</dt><dd>{reference.input.target} minutes</dd></div>
    </dl>
    {phase === "reason" && <div className={styles.card}>
      <fieldset className={styles.choices}><legend>Should this estimate allow more or less time? It’s fine to be unsure.</legend>
        {([["more", "More time"], ["less", "Less time"], ["unsure", "Not sure"]] as const).map(([value, label]) => <label key={value}><input ref={value === "more" ? reasonInput : undefined} type="radio" name="delivery-reason" value={value} checked={reason === value} onChange={() => setReason(value)} />{label}</label>)}
      </fieldset>
    </div>}
    <div role="status" aria-live="polite" aria-atomic="true" className={phase === "reason" ? styles.emptyStatus : styles.card}>
      {phase === "feedback" && <p>{reason && feedback[reason]}</p>}
      {phase === "calculation" && <>
        <h2>What produced nine minutes?</h2>
        <p>A weight is a model multiplier. The model allows {reference.input.weights[0]} minute per item: {reference.input.inputs[0]} items × {reference.input.weights[0]} min/item = <strong>{reference.forward.weightedInputs[0]} minutes</strong>.</p>
        {contribution >= 1 && <p>Distance contributes {reference.input.inputs[1]} km × {reference.input.weights[1]} min/km = <strong>{reference.forward.weightedInputs[1]} minutes</strong>. The items and distance describe the delivery; the multipliers belong to the rule.</p>}
        {contribution >= 2 && <>
          <p>Bias is an adjustable baseline, added once: <strong>{reference.input.bias} minute</strong>. Add the contributions: {reference.forward.weightedInputs[0]} + {reference.forward.weightedInputs[1]} + {reference.input.bias} = <strong>{reference.forward.prediction} minutes</strong>.</p>
          <p>The recorded 12 minutes judges this past trip; it is not an input for predicting a future trip. Matching one trip does not establish a reliable model. Other deliveries and unseen evaluation would be needed.</p>
        </>}
      </>}
    </div>
    {phase === "feedback" && <>
      <p>The rule creates an estimate; the recorded time helps us judge it. Any reasoning choice can continue.</p>
    </>}
    {phase === "calculation" && contribution >= 2 && <ParameterExperiment reference={reference} />}
    <button ref={primaryAction} className={styles.primary} type="button" disabled={phase === "reason" && !reason} onClick={() => {
      if (phase === "reason") setPhase("feedback");
      else if (phase === "feedback") setPhase("calculation");
      else if (contribution < 2) setContribution(value => value + 1);
      else onEnter();
    }}>{phase === "reason" ? "Compare my reasoning" : phase === "feedback" ? "See how 9 was calculated" : contribution === 0 ? "Add the distance contribution" : contribution === 1 ? "Add the baseline" : "Open the full lab"}</button>
    {phase !== "reason" && <button className={styles.quiet} type="button" onClick={() => { reviewing.current = true; setPhase("reason"); setContribution(0); }}>Review my reasoning</button>}
    <p className={styles.note}>Next, the existing lab lets you inspect the error, squared loss and gradients, then try an update. This introduction awards no completion or mastery.</p>
  </section>;
}
