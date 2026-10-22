"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BetaNav } from "../../components/beta-nav";
import type { LearnerResponse } from "../../learn/foundation/exercises";
import { CONTENT, TOPICS, routeFor } from "./content";
import { ASSESSMENT_ID, DRAFT_KEY, MASTERY_ID, assessmentQuestions, commit, grade, newDraft, parseDraft, type Draft } from "./model";
import { useCoreEvidence } from "./use-evidence";

export function CoreAssessment() {
  const { evidence, setEvidence, loaded, storageError } = useCoreEvidence();
  const [draft, setDraft] = useState<Draft>(newDraft), [ready, setReady] = useState(false), [saveError, setSaveError] = useState(false), [confirmed, setConfirmed] = useState(false);
  const history = evidence.assessmentAttempts.filter(attempt => attempt.assessmentId === ASSESSMENT_ID);
  const checks = assessmentQuestions(draft.variant), answered = Object.keys(draft.responses).length;
  useEffect(() => {
    if (!loaded || ready) return;
    try {
      const fallback = history.at(-1)?.variantId === "v01" ? "v02" : "v01";
      const restored = parseDraft(localStorage.getItem(DRAFT_KEY), fallback);
      if (restored.phase === "submitted") {
        const result = grade(restored.variant, restored.responses), canonical = history.find(attempt => attempt.id === restored.attemptId);
        const objectives = result.items.filter(item => item.correct).map(item => item.question.objectiveId).sort();
        setDraft(canonical && canonical.variantId === restored.variant && canonical.score === result.score && canonical.maxScore === result.maxScore && JSON.stringify([...canonical.objectiveIds].sort()) === JSON.stringify(objectives) ? restored : newDraft(fallback));
      } else setDraft(restored);
    } catch { setSaveError(true); }
    setReady(true);
  }, [loaded, ready, history]);
  useEffect(() => { if (ready) try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { setSaveError(true); } }, [ready, draft]);
  useEffect(() => { if (ready && draft.phase !== "active") document.getElementById(draft.phase === "review" ? "la-review" : "la-result")?.focus(); }, [ready, draft.phase]);
  function answer(key: string, response: LearnerResponse | undefined) {
    setDraft(previous => { const responses = { ...previous.responses }; if (response) responses[key] = response; else delete responses[key]; return { ...previous, responses }; });
  }
  function returnToQuestions(question?: string) {
    setConfirmed(false); setDraft(previous => ({ ...previous, phase: "active" }));
    requestAnimationFrame(() => document.getElementById(question ? `la-question-${question}` : "la-assessment")?.focus());
  }
  function submit() {
    if (!ready || !loaded || !confirmed || draft.phase !== "review") return;
    const result = grade(draft.variant, draft.responses), id = `la-${crypto.randomUUID()}`;
    setEvidence(previous => commit(previous, result, id, new Date().toISOString()));
    setDraft(previous => ({ ...previous, phase: "submitted", attemptId: id })); setConfirmed(false);
  }
  const result = draft.phase === "submitted" ? grade(draft.variant, draft.responses) : null;
  return <main className="math-lesson-page la-page"><a className="la-skip" href="#la-assessment">Skip to assessment</a><BetaNav status="Linear Algebra · Core assessment" /><article className="panel la-core"><Link href="/math/linear-algebra">← Linear Algebra overview</Link><h1 id="la-assessment" tabIndex={-1}>Independent Linear Algebra core assessment</h1><p>Attempt directly; guided completion is not required. This assesses vectors, dot products and matrix computations, not the topics in the later geometry extension.</p><ul><li>16 questions in four areas. To earn mastery, score at least 80% (13 of 16) and get all four critical ideas right in one attempt.</li><li>Critical ideas: magnitude, signed dot product, the shape of a matrix-vector result, and when two matrices can be multiplied.</li><li>Answers within 0.001 count as correct. Unanswered questions score zero. No timer; scratch paper and calculators are welcome.</li><li>Review your answers, then submit to see feedback. Each retake uses a fresh set of values. Your draft and last 20 attempts are saved on this device.</li></ul><p>Current variant: {draft.variant}. {evidence.objectives[MASTERY_ID]?.mastered ? "You have earned core mastery." : "Core mastery is not earned yet."}</p>{(storageError || saveError) && <p role="alert">Progress cannot be saved reliably in this browser. You can continue during this visit.</p>}
    {draft.phase === "active" && <><label htmlFor="la-progress">Responses entered: {answered} of 16</label><progress id="la-progress" max={16} value={answered} />{TOPICS.map(topic => <section key={topic}><h2>{CONTENT[topic].title}</h2>{checks.filter(question => question.topic === topic).map(question => {
      const response = draft.responses[question.key], number = checks.indexOf(question) + 1;
      return <fieldset key={question.key} id={`la-question-${question.key}`} tabIndex={-1}><legend>Q{number}. {question.critical ? "Critical · " : ""}{question.exercise.prompt}</legend>{question.exercise.kind === "numerical" ? <label>Numerical answer for Q{number}<input type="number" step="any" value={response?.kind === "numerical" ? response.value : ""} onChange={event => answer(question.key, event.target.value.trim() && Number.isFinite(Number(event.target.value)) ? { kind: "numerical", value: Number(event.target.value) } : undefined)} /></label> : question.exercise.options.map(option => <label key={option.id}><input type="radio" name={`assessment-${question.key}`} checked={response?.kind === "conceptual" && response.optionId === option.id} onChange={() => answer(question.key, { kind: "conceptual", optionId: option.id })} />{option.label}</label>)}</fieldset>;
    })}</section>)}<button disabled={!ready || !loaded} onClick={() => { setConfirmed(false); setDraft(previous => ({ ...previous, phase: "review" })); }}>Review core responses</button></>}
    {draft.phase === "review" && <section><h2 id="la-review" tabIndex={-1}>Review your core responses</h2><p>{answered}/16 answered. {16 - answered} unanswered questions score zero.</p><ol>{checks.map((question, index) => {
      const response = draft.responses[question.key];
      const label = response?.kind === "numerical" ? String(response.value) : response?.kind === "conceptual" && question.exercise.kind === "conceptual" ? question.exercise.options.find(option => option.id === response.optionId)?.label : "Unanswered";
      return <li key={question.key}><p>{question.exercise.prompt}</p><p>{label}</p><button onClick={() => returnToQuestions(question.key)}>Edit Q{index + 1}</button></li>;
    })}</ol><label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />I confirm these core responses are ready to submit.</label><div className="la-actions"><button onClick={() => returnToQuestions()}>Return to core questions</button><button disabled={!confirmed} onClick={submit}>Submit core assessment</button></div></section>}
    {result && <section><h2 id="la-result" tabIndex={-1}>{result.passed ? "Linear Algebra core mastery criteria met" : "Review before another core attempt"}</h2><p role="status">Score: {result.score}/16 ({result.percent.toFixed(1)}%). {result.failedCritical.length} critical objectives not passed. {result.passed ? "Overall threshold and all four critical objectives passed." : "This attempt awards no new mastery."}</p><h3>Competency results</h3><ul>{TOPICS.map(topic => <li key={topic}>{CONTENT[topic].title}: {result.items.filter(item => item.correct && item.question.topic === topic).length}/4</li>)}</ul><h3>Critical objective outcomes</h3><ul>{result.items.filter(item => item.question.critical).map(item => <li key={item.question.key}>{item.question.statement}: {item.correct ? "Passed" : "Not passed"}</li>)}</ul><h3>Feedback and remediation</h3>{result.items.filter(item => !item.correct).map(item => <section className="la-recall" key={item.question.key}><h4>{item.question.exercise.prompt}</h4><p>{item.question.exercise.feedback.correct.replace(/^Correct\. /, "")}</p>{item.question.exercise.kind === "numerical" && <p>Worked result: {item.question.exercise.expected}</p>}<Link href={`${routeFor(item.question.topic)}#core-${item.question.topic}`}>Review {CONTENT[item.question.topic].title} →</Link></section>)}{result.passed && <p>Core mastery does not establish geometry proficiency or imply every noncritical objective passed. Only correct objectives receive individual mastery evidence.</p>}<button onClick={() => { setConfirmed(false); setDraft(newDraft(draft.variant === "v01" ? "v02" : "v01")); requestAnimationFrame(() => document.getElementById("la-assessment")?.focus()); }}>Start alternate core variant</button></section>}
    <section><h2>Recent core attempts</h2>{history.length ? <div className="la-table" role="region" tabIndex={0} aria-label="Core assessment history — scroll horizontally if needed"><table><caption>Last 20 Linear Algebra core attempts</caption><thead><tr><th scope="col">Variant</th><th scope="col">Score</th><th scope="col">Critical passed</th><th scope="col">Submitted UTC</th></tr></thead><tbody>{[...history].reverse().map(attempt => <tr key={attempt.id}><th scope="row">{attempt.variantId}</th><td>{attempt.score}/{attempt.maxScore}</td><td>{checks.filter(question => question.critical && attempt.objectiveIds.includes(question.objectiveId)).length}/4</td><td>{attempt.submittedAt}</td></tr>)}</tbody></table></div> : <p>No submitted core attempts.</p>}</section></article></main>;
}
