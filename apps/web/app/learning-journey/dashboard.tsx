"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BetaNav } from "../components/beta-nav";
import { CONNECTIONS, PYTHON_MODULES, STAGES } from "./catalog";
import { readJourneyProgress, READ_KEYS, recommend, START, type JourneyProgress } from "./progress";
import styles from "./journey.module.css";

export function LearningJourney() {
  const [progress, setProgress] = useState<JourneyProgress>({ scopes: [], warnings: [] });
  const [loaded, setLoaded] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [experience, setExperience] = useState("guided");
  useEffect(() => {
    let active = true, generation = 0;
    async function restore() {
      const current = ++generation;
      let result: JourneyProgress;
      try { result = await readJourneyProgress(window.localStorage); }
      catch { result = { scopes: [], warnings: ["Progress could not be read in this browser. Original records are untouched."] }; }
      if (active && current === generation) { setProgress(result); setLoaded(true); }
    }
    const changed = (event: StorageEvent) => { if (event.key === null || READ_KEYS.includes(event.key)) void restore(); };
    void restore();
    window.addEventListener("storage", changed);
    window.addEventListener("pageshow", restore);
    window.addEventListener("focus", restore);
    return () => { active = false; window.removeEventListener("storage", changed); window.removeEventListener("pageshow", restore); window.removeEventListener("focus", restore); };
  }, []);
  const target = loaded ? recommend(progress) : START;
  const returning = loaded && progress.scopes.some(scope => scope.active);
  const activeStage = selectedStage ?? (target.stage.startsWith("Python") ? 1 : target.stage.startsWith("ML Algorithms") ? 2 : 0);
  const stage = STAGES[activeStage];
  return <main className={styles.page}>
    <a className={styles.skip} href="#journey-content">Skip to your learning journey</a>
    <BetaNav product />
    <div className={styles.container}>
      <header className={styles.intro} id="journey-content" tabIndex={-1}>
        <p className={styles.eyebrow}>Your learning journey</p>
        <h1>Build understanding.<br /><em>Then build models.</em></h1>
        <p>One useful next step. The freedom to explore.</p>
      </header>
      <section className={styles.focus} aria-labelledby="next-title">
        <div>
          <p className={styles.eyebrow}>{loaded ? target.stage : "Finding your starting point"}</p>
          <h2 id="next-title">{loaded ? target.title : "Your next useful step"}</h2>
          <p className={styles.why}><strong>Why this matters for ML</strong><br />{target.why}</p>
          {loaded ? <Link className={styles.primary} href={target.href}>{returning ? "Continue Learning" : "Start Learning"} <span aria-hidden="true">→</span></Link> : <p role="status">Reading supported local progress… You can browse topics below.</p>}
          <p className={styles.hint}>{loaded ? target.detail : "No progress is changed while this page loads."}</p>
        </div>
        <aside className={styles.evidence} aria-label="Your saved learning evidence">
          <p className={styles.eyebrow}>Your evidence, not a percentage</p>
          <p role="status">{loaded ? returning ? "Saved learning activity found in this browser." : progress.warnings.length ? "Some progress is unavailable; it is not treated as zero." : "No saved learning activity found in the supported records." : "Checking local records…"}</p>
          <p>Lesson completion and independent mastery are different. Opening or skipping a topic awards neither.</p>
          <details><summary>View saved module states</summary>{progress.scopes.filter(scope => scope.active).length ? <ul>{progress.scopes.filter(scope => scope.active).map(scope => <li key={scope.title}><Link href={scope.href}>{scope.title}</Link><span>{scope.mastery}</span></li>)}</ul> : <p>{progress.warnings.length ? "Some module states are unknown. Open the original subject to inspect them." : "Complete practice or attempt an assessment to build evidence."}</p>}</details>
          <p>Only supported existing scopes appear here. Other module records remain in their own modules; omitted scopes are not treated as empty or unmastered.</p><small>Local to this browser and site address. No account or cross-device synchronization.</small>
        </aside>
      </section>
      {progress.warnings.length > 0 && <details className={styles.warning}><summary>Some saved progress could not be read</summary><ul>{progress.warnings.map((message, index) => <li key={`${index}:${message}`}>{message}</li>)}</ul><p>No record was rewritten, imported or reset. Open the original module for its supported recovery controls.</p></details>}
      <section className={styles.entry} id="getting-started" aria-labelledby="entry-title">
        <details><summary id="entry-title">Choose a different starting point</summary>
          <fieldset><legend>How would you like to learn today?</legend>
            {[
              ["guided", "Guide me from the fundamentals"],
              ["refresher", "Give me a focused refresher"],
              ["challenge", "I already know this — check my understanding"],
            ].map(([value, label]) => <label key={value}><input type="radio" name="journey-experience" value={value} checked={experience === value} onChange={() => setExperience(value)} />{label}</label>)}
          </fieldset>
          {experience === "guided" && <p>Begin with <Link href="/math/algebra-functions/variables">variables, equations and units</Link>, or <Link href="/python/essentials/p01/module">Python values and names</Link>. Full explanations and practice remain available.</p>}
          {experience === "refresher" && <div><p>Revisit existing explanations and worked examples. No condensed replacement course or automatic credit.</p><ul><li><Link href="/math/algebra-functions/functions">Functions and outputs</Link></li><li><Link href="/math/derivatives">Derivatives and gradients</Link></li><li><Link href="/python/numpy/n05">Matrix multiplication in NumPy</Link></li><li><Link href="/python/preparation/t05">Leakage and fold-local preparation</Link></li></ul></div>}
          {experience === "challenge" && <div><p>Choose an existing independent assessment. Its full threshold, critical gates, retries and confirmation still apply. This is not a universal placement test.</p><ul>{PYTHON_MODULES.map(module => <li key={module.id}><Link href={`/python/${module.id}/mastery`}>{module.title} assessment</Link></li>)}<li><Link href="/algorithms/linear-regression/mastery">Linear Regression assessment</Link></li></ul></div>}
          <p className={styles.hint}>Optional, reversible choices for this visit only. No ability profile is saved and no route is locked.</p>
        </details>
      </section>
      <section className={styles.roadmap} aria-labelledby="roadmap-title">
        <div className={styles.sectionHeading}><h2 id="roadmap-title">From foundations to real ML work</h2><p>A suggested journey, not a prerequisite lock. Select a stage to explore.</p></div>
        <ol className={styles.stages} aria-label="Learning roadmap">
          {STAGES.map((item, index) => <li key={item.title}>
            <span className={styles.step}>0{index + 1} <span aria-hidden="true">{index < STAGES.length - 1 ? "→" : ""}</span></span>
            <span className={styles.availability}>{item.status}</span>
            {item.links.length ? <button type="button" aria-pressed={activeStage === index} aria-controls="stage-detail" onClick={() => setSelectedStage(index)}>{item.title}</button> : <h3>{item.title}</h3>}
            <p>{item.why}</p>
            <small>{item.connection}</small>
          </li>)}
        </ol>
        <div className={styles.stageDetail} id="stage-detail" role="region" aria-labelledby="stage-title">
          <h3 id="stage-title">{stage.title}: implemented content</h3>
          <ul>{stage.links.map(link => <li key={link.href}><Link href={link.href}>{link.title}</Link></li>)}</ul>
          <p>Available means implemented, not already mastered or fully accessibility-verified.</p>
        </div>
        <p className={styles.hint}>Project Studio — Coming Soon. You can already try the <Link href="/algorithms/linear-regression/project">limited guided Regression housing bridge</Link>; it is not a production capstone. The listed algorithm modules are available; additional future topics remain outside this curriculum.</p>
      </section>
      <section className={styles.connections} aria-labelledby="connections-title">
        <h2 id="connections-title">See how the ideas connect</h2>
        <p>Refresh one concept, then apply it. Relationships explain purpose; they do not transfer mastery.</p>
        {CONNECTIONS.map(connection => <details key={connection.title}><summary>{connection.title}</summary><p>{connection.why}</p><ul>{connection.links.map(link => <li key={link.href}><Link href={link.href}>{link.title}</Link></li>)}</ul></details>)}
        <p className={styles.hint}>The X-Ray demonstrates one linear neuron. Introductory Multilayer Perceptrons is available in Algorithm Lab; advanced neural-network courses remain outside this curriculum.</p>
      </section>
      <section className={styles.resources} id="resources" aria-labelledby="resources-title">
        <div><h2 id="resources-title">Practice tools</h2><ul><li><Link href="/demo">Neural Network X-Ray experiment</Link></li><li><Link href="/challenges/wrong-direction">Debug a wrong-direction update</Link></li><li><Link href="/math/integration">Connect the mathematics in practice</Link></li></ul></div>
        <div><h2>Notebooks & getting started</h2><details><summary>Reproducible Python notebooks</summary><ul>{PYTHON_MODULES.map(module => <li key={module.id}><a href={`/notebooks/python-${module.id}.ipynb`} download>{module.title} notebook</a></li>)}</ul></details><p>Notebook use never awards mastery. Genuine Colab verification remains open.</p><p><Link href="/beta">Beta Guide: the original X-Ray learning loop</Link> · <Link href="/python/essentials/p01">Original P01 pilot and retained progress</Link></p></div>
      </section>
      <footer className={styles.footer}>Implemented content is open to explore. Genuine screen-reader and browser-zoom verification remain outstanding.</footer>
    </div>
  </main>;
}

