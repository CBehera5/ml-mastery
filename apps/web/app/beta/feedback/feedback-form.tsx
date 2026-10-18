"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { BetaNav } from "../../components/beta-nav";
import { trackEvent } from "../../lib/analytics";

const FORM_URL = process.env.NEXT_PUBLIC_BETA_FEEDBACK_FORM_URL;

export function FeedbackForm() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { trackEvent("feedback_opened"); }, []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (FORM_URL) return;
    event.preventDefault();
    setMessage("Feedback submission is not connected in this local preview. Your answers remain in this browser; ask the beta coordinator for the configured form link.");
  };
  return (
    <main className="beta-page feedback-page">
      <BetaNav status="Beta feedback" />
      <header className="feedback-header"><p className="eyebrow">About 3 minutes</p><h1>Help us make the learning <em>click.</em></h1><p>We want feedback about the experience—not personal information. Please do not include confidential code, company details, or contact information.</p></header>
      <form className="panel feedback-form" action={FORM_URL} method="post" onSubmit={submit}>
        <fieldset><legend>1. What was your ML experience before this beta?</legend>{["New to ML", "Some tutorials or coursework", "I build or maintain ML systems"].map((value) => <label className="choice" key={value}><input required type="radio" name="ml_experience" value={value} /><span>{value}</span></label>)}</fieldset>
        <label htmlFor="ease">2. How easy was the experience to understand? <span aria-hidden="true">(1 difficult · 5 very easy)</span><select required id="ease" name="ease"><option value="">Choose</option>{[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label htmlFor="confusing">3. Which concept, if any, was confusing?<textarea id="confusing" name="confusing_concepts" rows={3} placeholder="Prediction, loss, gradients, update direction…" /></label>
        <label htmlFor="value">4. How much learning value did this provide? <span aria-hidden="true">(1 none · 5 high)</span><select required id="value" name="learning_value"><option value="">Choose</option>{[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}</select></label>
        <fieldset><legend>5. Was the debugging challenge useful?</legend>{["Yes", "Partly", "No"].map((value) => <label className="choice" key={value}><input required type="radio" name="challenge_useful" value={value} /><span>{value}</span></label>)}</fieldset>
        <fieldset id="pricing-interest"><legend>6. Would you consider the complete learning kit at $39?</legend>{["Yes", "Maybe", "No"].map((value) => <label className="choice" key={value}><input required type="radio" name="purchase_consideration" value={value} /><span>{value}</span></label>)}</fieldset>
        <label htmlFor="improvements">7. What is the single most important improvement we should make?<textarea required id="improvements" name="improvements" rows={4} /></label>
        <input type="hidden" name="source" value="private-beta-v1" />
        <button className="button primary" type="submit"><span>Submit beta feedback</span><span aria-hidden="true">→</span></button>
        {message && <p className="notice warning" role="status">{message}</p>}
      </form>
      <div className="feedback-return"><Link href="/challenges/wrong-direction">← Return to the challenge</Link></div>
    </main>
  );
}
