"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BetaNav } from "../../components/beta-nav";
import { AnswerInput } from "../../python/foundation/learning";
import { analyze, OBJECTIVES, PRACTICE, REASONS, SCENES, selection, type Scene } from "./contracts";
import { alternate, changeDraft, choose, completed, draftAnswers, emptyProgress, explain, predict, ProgressStore, recover, resetExperiment, resetLesson, reveal, submitPractice, type Progress } from "./progress";
import styles from "./lesson.module.css";

const RECALL = [
  { prompt: "Predict cancellation during days 1–30. Is the target customer age or cancellation in that window?", correct: "target", answer: "Cancellation in the specified window; age is a candidate feature.", contrast: "Customer age, because it is numeric." },
  { prompt: "A cancellation flag appears at t=+1. Is it a valid feature at t=0?", correct: "time", answer: "No; strong correlation cannot make future information available.", contrast: "Yes, if it predicts accurately." },
  { prompt: "New-template deployment: can versions of one template cross train/test?", correct: "groups", answer: "No; hold out complete template/document families.", contrast: "Yes; different row IDs are always independent." },
  { prompt: "Does predicting a quality label prove editing a correlated feature improves quality?", correct: "association", answer: "No; observational association does not identify intervention effects.", contrast: "Yes; an accurate predictor proves the edit causes improvement." },
];

function Manifest({ scene, planId }: { scene: Scene; planId?: string }) {
  const plan = scene.plans.find(item => item.id === planId);
  return <><p>Required deployment boundaries: disjoint row IDs{scene.requireGroup ? ", unseen groups" : "; groups may recur if the question permits"}{scene.requireTime ? ", earlier training cohorts than test cohorts" : "; no chronological claim"}. Cohort time is an ordered teaching index, not a model feature.</p>
    <table><caption>{scene.title}: original fictional six-row manifest</caption><thead><tr><th>Row</th><th>Group</th><th>Cohort time</th>{plan && <th>Assignment</th>}</tr></thead><tbody>{scene.rows.map(row => <tr key={row.id}><td>{row.id}</td><td>{row.group}</td><td>{row.time}</td>{plan && <td>{plan.train.includes(row.id) ? "Train" : ""}{plan.train.includes(row.id) && plan.test.includes(row.id) ? " + " : ""}{plan.test.includes(row.id) ? "Test" : ""}</td>}</tr>)}</tbody></table></>;
}

function Practice({ index, progress, update }: { index: number; progress: Progress; update: (next: Progress) => void }) {
  const state = progress.practice[index];
  const family = PRACTICE[index * 2 + state.variant];
  const answers = draftAnswers(progress, index);
  const [feedback, setFeedback] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [recall, setRecall] = useState("");
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const exhausted = state.counts.every(count => count === 2);
  const objective = OBJECTIVES[index];
  return <section aria-label={objective} className={styles.card}><h3 ref={headingRef} tabIndex={-1}>{objective}{family.critical ? " — critical decision AND reason" : ""}</h3>
    <p>{family.prompt}</p>
    {index === 2 && <Manifest scene={SCENES[(index + 1 + state.variant) % 6]} />}
    <p>Practice {state.variant === 0 ? "A" : "B"}: {state.counts[state.variant]}/2 valid submissions this cycle. {state.proof ? "Objective practice demonstrated (not mastery)." : "Not yet demonstrated."}</p>
    {family.atoms.map((atom, position) => <AnswerInput key={`${family.id}-${atom.id}`} atom={atom} answer={answers[position]} name={`${family.id}-${atom.id}`} change={answer => update(changeDraft(progress, index, answers.map((previous, answerIndex) => answerIndex === position ? answer : previous)))} />)}
    <button disabled={state.counts[state.variant] >= 2} onClick={() => { const result = submitPractice(progress, index); update(result.progress); setFeedback(result.feedback); requestAnimationFrame(() => feedbackRef.current?.focus()); }}>Check {objective}</button>
    <button disabled={state.counts[state.variant === 0 ? 1 : 0] >= 2} onClick={() => { update(alternate(progress, index)); setFeedback(""); requestAnimationFrame(() => headingRef.current?.focus()); }}>Alternate {objective} practice</button>
    <p ref={feedbackRef} tabIndex={-1} role="status" aria-label={`${objective} feedback`}>{feedback}</p>
    {state.counts[state.variant] >= 2 && <p><strong>Worked correction:</strong> {family.explanation}</p>}
    {exhausted && <div><h4>Remediation and a changed case</h4><p>{family.explanation}</p><label><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />I reviewed this contrast.</label><label>{RECALL[index].prompt}<select value={recall} onChange={event => setRecall(event.target.value)}><option value="">Choose a counterexample explanation</option><option value={RECALL[index].correct}>{RECALL[index].answer}</option><option value="wrong">{RECALL[index].contrast}</option></select></label><button onClick={() => {
      const next = recover(progress, index, reviewed, recall);
      if (next === progress) setFeedback("Review the contrast and answer the changed case correctly before opening a new practice cycle.");
      else { update(next); setReviewed(false); setRecall(""); setFeedback("New review cycle opened; this is repeated practice, not independent mastery."); requestAnimationFrame(() => headingRef.current?.focus()); }
    }}>Open new {objective} review cycle</button></div>}
  </section>;
}

export function EV01Lesson() {
  const [store] = useState(() => new ProgressStore({ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) }));
  const [progress, setProgress] = useState(emptyProgress);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [resetEpoch, setResetEpoch] = useState(0);
  const [experimentFeedback, setExperimentFeedback] = useState("");
  const result = useRef<HTMLDivElement>(null);
  const lessonStatus = useRef<HTMLParagraphElement>(null);
  useEffect(() => { setProgress(store.hydrate()); setWarning(store.warning); setReady(true); }, [store]);
  function update(next: Progress) {
    try { setProgress(store.save(next)); setWarning(store.warning); }
    catch { setWarning("This change could not be recorded. Last valid progress is preserved."); }
  }
  const { scene, feature, plan } = selection(progress.experiment.config);
  const outcome = analyze(progress.experiment.config);
  function change(config: string) { update(choose(progress, config)); setExperimentFeedback(""); }
  return <main className={styles.page}>
    <BetaNav status="Supervised learning · EV01 prototype" />
    <a href="#lesson-content">Skip to lesson content</a>
    <nav className={styles.nav} aria-label="Supervised lesson navigation"><Link href="/algorithms">Supervised overview</Link><a href="#experiment">Experiment</a><a href="#practice">Practice</a><a href="#notebook">Notebook</a></nav>
    <header id="lesson-content"><p>ML Mastery — Learn Machine Learning by Doing.</p><h1>Define the prediction moment</h1><p>Before choosing an algorithm, decide what you will predict, when you must predict it, and what you can actually know. A powerful model with tomorrow's answers is not a useful prediction system.</p></header>
    <p ref={lessonStatus} tabIndex={-1} role="status" aria-label="EV01 lesson status">{!ready ? "Restoring EV01 practice…" : completed(progress) ? "EV01 lesson completed. Module mastery remains unavailable." : "EV01 practice in progress. Module mastery is unavailable."}</p>
    {warning && <p role="alert" className={styles.notice}>{warning}</p>}
    <section className={styles.card}><h2>1. Start with a real decision, not an estimator</h2><p>For a house listed today, predict its later sale price in ₹ lakh. For a customer today, predict whether they cancel during days1–30. For a submitted technical guide, predict its human-reviewed label for this exact version: <strong>Good=0; Needs Improvement=1</strong>. The last two are binary classification targets, not prices or automatic LLM quality scores.</p><p>A <strong>feature</strong> is an input available when the decision is made. A <strong>target</strong> is the outcome we later observe. The same outcome may be available as a training label after observation but unavailable as an input to a new prediction.</p><p><strong>Worked example:</strong> at listing time a house has area80m²; it sells20 days later for240 ₹ lakh. Area80 is a possible input;240 is the future training target, not today's feature. A second house has area100 and sells for300: treating the future300 as a feature would answer the question using its answer.</p><p><strong>Changed case:</strong> a guide has500 words and a later human label Needs Improvement. The target is1, not500. A brief guide can be complete and a long one incorrect. A model may learn a shortcut without learning useful quality.</p><p><strong>Recall, only if useful:</strong> <Link href="/algorithms/linear-regression/multiple-features">features and weighted predictions</Link> · <Link href="/python/sklearn/s01">fit versus predict</Link>.</p></section>
    <section className={styles.card}><h2>2. Visual intuition: draw a boundary at now</h2>
      <ol className={styles.timeline} aria-label="Prediction timeline"><li><strong>Before t=0</strong>Known area, earlier usage, submitted text. Candidate inputs.</li><li><strong>At t=0</strong>Freeze the record and make the prediction.</li><li><strong>After t=0</strong>Sale price, cancellation, review/correction. Later labels or unavailable inputs.</li></ol>
      <p>This timeline is an information boundary, not a claim every old feature is sensible or unbiased. A pre-existing customer ID might still leak identity across an unsuitable split. Timely inputs are necessary, not sufficient.</p><p><strong>Misconception:</strong> “It correlates strongly, so I may use it.” A post-review correction flag can nearly reveal the quality label but cannot exist at submission. Prediction permissions depend on time, not just correlation.</p></section>
    <fieldset disabled={!ready}><legend>EV01 interactive work and local practice</legend>
      <section id="experiment" className={styles.card}><h2>Experiment: can this evaluation answer the deployment question?</h2><p>Six fictional scenarios, two candidate features and three fixed split plans give36 bounded states. No model is fitted here; this is an information-permission simulation. Change a choice, predict before revealing, then explain the result. A wrong initial prediction can still lead to a completed learning cycle.</p>
        <label>Deployment scenario<select value={scene.id} onChange={event => { const next = SCENES.find(item => item.id === event.target.value)!; change(`${next.id}:available:${next.plans[0].id}`); }}>{SCENES.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label>Candidate feature<select value={feature.id} onChange={event => change(`${scene.id}:${event.target.value}:${plan.id}`)}>{scene.features.map(item => <option key={item.id} value={item.id}>{item.label} (t={item.observedAt})</option>)}</select></label>
        <label>Split plan<select value={plan.id} onChange={event => change(`${scene.id}:${feature.id}:${event.target.value}`)}>{scene.plans.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <Manifest scene={scene} planId={plan.id} />
        <label>Predict combined validity<select disabled={progress.experiment.revealed} value={progress.experiment.prediction} onChange={event => update(predict(progress, event.target.value))}><option value="">Choose before reveal</option><option value="valid">Both feature and split are valid</option><option value="invalid">At least one boundary is invalid</option></select></label>
        <button onClick={() => { if (!progress.experiment.prediction) { setExperimentFeedback("Choose a prediction before revealing."); return; } update(reveal(progress)); setExperimentFeedback(""); requestAnimationFrame(() => result.current?.focus()); }}>Reveal boundary analysis</button>
        <button onClick={() => { update(resetExperiment(progress)); setExperimentFeedback(""); }}>Reset experiment controls</button>
        <p role="status">{experimentFeedback}</p>
        <div ref={result} tabIndex={-1} aria-label="Boundary result" role="region">{progress.experiment.revealed && <><h3>{outcome.valid ? "Both boundaries preserved" : "Boundary violation found"}</h3><p>Prediction: {progress.experiment.prediction}. Actual combined validity: {outcome.valid ? "valid" : "invalid"}. Feature: {outcome.featureValid ? "available by t=0" : "only observed after t=0"}. Split: {outcome.splitValid ? "valid for the declared question" : "invalid for the declared question"}.</p><ul><li>Overlapping row IDs: {outcome.overlap.join(", ") || "none"}.</li><li>Overlapping required held-out groups: {outcome.groups.join(", ") || "none"}.</li><li>Training row IDs from the test cohort's time or later: {outcome.future.join(", ") || "none"}.</li></ul><p>“None” applies to required checks only; group reuse is permitted for future events of known customers, but not for unseen-customer deployment. Training labels must also be available before actual prediction; these ordered toy cohorts are not a production split guarantee.</p>
          <label>Explain the observed boundary<select value={progress.experiment.reason} onChange={event => { update(explain(progress, event.target.value)); setExperimentFeedback(event.target.value === outcome.reason ? (progress.experiment.from !== progress.experiment.config ? "Correct explanation and meaningful interaction recorded; not mastery." : "Correct explanation. Change a feature, split or scenario and repeat to demonstrate interaction.") : "Not yet. Check feature time and each required row/group/time boundary separately."); }}><option value="">Choose a bounded explanation</option>{REASONS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></>}</div>
        <p>{progress.experiment.credit ? "Meaningful experiment and correct explanation demonstrated." : "Experiment interaction/explanation not yet demonstrated."}</p>
      </section>
      <section className={styles.card}><h2>3. Mathematics: eligibility is a set, not a score</h2><p>Let t=0 be the decision time. For feature j, let aⱼ be its observation time relative to that decision. Its eligible set is E(0) = &#123;j : aⱼ ≤0&#125;. The symbol≤ means “no later than”; braces collect feature IDs satisfying that rule. This rule checks availability, not causal relevance.</p><p><strong>Worked numbers:</strong> area observed at−1 is in E(0); sale proceeds observed at+1 are not. For training row set T=&#123;r1,r2,r3,r4&#125; and test set H=&#123;r5,r6&#125;, T∩H=∅: no shared row IDs. If H becomes&#123;r4,r5,r6&#125;, the intersection is&#123;r4&#125; and evaluation leaks a row.</p><p><strong>Changed case:</strong> disjoint rows do not guarantee disjoint entities. In the customer manifest, r1/r2 share groupg1; r3/r4 shareg2; r5/r6 shareg3. Training r1,r3,r5 and testing r2,r4,r6 shares all three groups. For unseen groups require G(T)∩G(H)=∅, where G collects group IDs. For future cohorts require max(time(T)) &lt; min(time(H)), alongside any group constraint. Real outcomes may arrive late; eligibility of training labels needs an additional timestamp audit.</p></section>
      <section className={styles.card}><h2>4. Python: inspect permissions before fitting</h2><p>This authored standard-Python example is executable in the downloadable notebook, not in a hosted learner-code service. Set intersection asks which IDs appear in both partitions.</p><pre><code>{"train = {'r1', 'r2', 'r3', 'r4'}\ntest = {'r5', 'r6'}\nobserved_at = {'area': -1, 'sale_proceeds': 1}\neligible = {name for name, time in observed_at.items() if time <= 0}\nassert train & test == set()\nassert eligible == {'area'}"}</code></pre><p>Output assertions pass: no repeated row and only area eligible. Changing test to include r4 breaks the first assertion. A successful row assertion alone does not check customer/template groups or time. Fit preprocessing/model parameters only after choosing a valid training partition; predict with fixed training state on held-out inputs.</p><p><Link href="/python/essentials/p07">Recall comprehensions</Link> · <Link href="/python/preparation/t04">split methodology</Link> · <Link href="/python/preparation/t05">fold-local preparation</Link>.</p></section>
      <section className={styles.card}><h2>5. Evaluate the question, then compare algorithms</h2><p>Random disjoint home rows can address new independent homes from the same population; earlier-versus-later sales address a temporal question. Group-held-out documentation asks about new families/templates, not another revision of familiar text. A split's validity depends on the intended use, not on its random-looking appearance.</p><p>Linear Regression can predict a price in currency units; it is not a drop-in classifier for churn or document labels. Logistic Regression or a classification tree could later address those binary targets. None can rescue a future-derived feature or contaminated holdout. This lesson trains no new algorithm and makes no performance ranking.</p><p><strong>Contrast:</strong> customers with low usage may churn more often. It does not follow that artificially increasing a usage counter prevents churn. Likewise, more words may correlate with a documentation label without proving that padding text improves quality. Confounding, selection and measurement can explain a pattern. Evaluate prediction and intervention claims separately.</p></section>
      <section id="practice"><h2>Practice the four objectives</h2><p>Two authored variants per objective; two valid submissions per variant/review cycle. Complete every supplied answer. Critical EV01.O2 requires both decision and explanation. This is practice, not an independent assessment.</p>{OBJECTIVES.map((id, index) => <Practice key={`${id}-${resetEpoch}`} index={index} progress={progress} update={update} />)}</section>
      <section id="notebook" className={styles.card}><h2>Trusted notebook feasibility section</h2><a href="/notebooks/supervised-ev01.ipynb" download>Download EV01 prediction-boundary notebook</a><p>Original tiny manifests, explicit environment assertions and trusted outputs; no credentials, uploads or remote datasets. Notebook execution never changes platform progress. Genuine Colab execution remains unverified.</p></section>
      <section className={styles.card}><h2>Module mastery is unavailable</h2><p>Only EV01's4 of24 objective families and 1 of6 critical gates are implemented. Twelve independent fixture instances exist for author tests only. No assessment or module mastery can be earned here, from practice, experiments or the notebook.</p><label><input type="checkbox" checked={confirm} onChange={event => setConfirm(event.target.checked)} />Confirm resetting only EV01 practice, drafts and lesson completion; other module evidence remains untouched.</label><button disabled={!confirm} onClick={() => { update(resetLesson(progress, confirm)); setConfirm(false); setResetEpoch(epoch => epoch + 1); requestAnimationFrame(() => lessonStatus.current?.focus()); }}>Reset EV01 lesson progress</button><p>Unsupported saved records are preserved, never overwritten by reset. Storage is browser-local and editable; it is not a synchronized or tamper-proof credential.</p></section>
    </fieldset>
  </main>;
}
