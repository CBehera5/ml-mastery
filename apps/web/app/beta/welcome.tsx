"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BetaNav } from "../components/beta-nav";
import { trackEvent } from "../lib/analytics";

export function BetaWelcome() {
  useEffect(() => { trackEvent("beta_started"); }, []);
  return (
    <main className="beta-page">
      <BetaNav status="Private beta" />
      <header className="beta-hero">
        <div>
          <p className="eyebrow">Private beta · 15–20 minutes</p>
          <h1>See the math. Then <em>debug the learning.</em></h1>
          <p>ML Math Lab is a hands-on learning environment for developers who want neural-network training to feel inspectable—not magical.</p>
          <div className="beta-hero-actions">
            <Link className="button primary beta-link-button" href="/demo"><span>Start the Neural Network X-Ray</span><span aria-hidden="true">→</span></Link>
            <a className="button secondary beta-link-button" href="#beta-path">Preview the beta path</a>
          </div>
        </div>
        <aside className="beta-promise panel" aria-label="What you will accomplish">
          <span className="step">YOUR OUTCOME</span>
          <strong>Follow one complete learning step</strong>
          <p>Trace a prediction, inspect its loss and gradients, apply an update, then diagnose a realistic gradient-direction bug.</p>
          <div><b>2</b><span>interactive experiences</span></div>
          <div><b>1</b><span>verified mathematical runtime</span></div>
        </aside>
      </header>

      <section className="beta-audience panel" aria-labelledby="audience-title">
        <div><p className="eyebrow">Built for working developers</p><h2 id="audience-title">You can read code, but the training loop still feels opaque.</h2></div>
        <p>No calculus refresher or ML framework setup required. This beta is for frontend, backend, and product engineers who want an accurate mental model of forward propagation, gradients, and parameter updates.</p>
      </section>

      <section className="beta-path" id="beta-path" aria-labelledby="path-title">
        <div className="section-title-row"><div><span className="step">BETA PATH</span><h2 id="path-title">One focused learning loop</h2></div><span className="live">About 15–20 min</span></div>
        <ol>
          <li className="panel"><span>01 · 8–10 min</span><h3>Inspect the Neural Network X-Ray</h3><p>Change inputs and weights, follow contributions, inspect the chain rule, and apply one gradient update.</p><Link href="/demo">Start the X-Ray →</Link></li>
          <li className="panel"><span>02 · 5–7 min</span><h3>Debug the wrong-direction update</h3><p>Observe rising loss, identify gradient ascent, choose the correct operator, and verify the repair.</p><Link href="/challenges/wrong-direction">Open the challenge →</Link></li>
          <li className="panel"><span>03 · 2–3 min</span><h3>Tell us what worked</h3><p>Answer seven concise questions about clarity, learning value, the challenge, and the proposed $39 complete kit.</p><Link href="/beta/feedback" onClick={() => trackEvent("feedback_opened")}>Preview feedback →</Link></li>
        </ol>
      </section>

      <section className="beta-feedback-callout panel">
        <div><p className="eyebrow">What we need from you</p><h2>Honest friction is useful feedback.</h2></div>
        <p>Tell us where the explanation became unclear, whether the interaction changed your mental model, and what would make the full learning kit worth considering. We do not ask for your name, email, employer, or account.</p>
      </section>
      <footer><p>Private beta · unfinished product</p><p>No account, payment, or personal information required.</p></footer>
    </main>
  );
}

