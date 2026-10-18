"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BetaNav } from "../../components/beta-nav";
import { AnswerInput, REMEDIATION } from "../foundation/learning";
import { validResponse, type Answer, type Family } from "../foundation/contracts";
import styles from "../foundation/lesson.module.css";
import { ACTIVITIES, ACTIVITY_REASONS, activityPredictions, ASSESSMENT, INDEPENDENT_FORMS, LESSONS, MASTERY_AVAILABLE, PRACTICE_FORMS, workedCase } from "./catalog";
import { alternate, changeActivity, checkActivity, confirmAttempt, emptyState, familyResponse, lessonComplete, MASTERY, ModuleStore, practiceSubmit, previewP01, recover, resetLesson, retry, type Preview, type State } from "./model";

const now = () => new Date().toISOString();
function workedResponses(definition: Family, answers: readonly Answer[] = definition.accepted[0]): string[] {
  return definition.atoms.map((atom, position) => {
    const answer = answers[position];
    if (!answer || answer.kind === "unanswered") return `${atom.label}: unanswered`;
    if (atom.kind === "number" && answer.kind === "number") return `${atom.label}: ${answer.value}`;
    if (atom.kind === "choice" && answer.kind === "choice") return atom.options.find(option => option.id === answer.optionId)!.label;
    if (atom.kind === "slots" && answer.kind === "slots") return atom.slots.map(slot => `${slot.label}: ${slot.options.find(option => option.id === answer.entries.find(entry => entry.slotId === slot.id)?.optionId)?.label ?? "unanswered"}`).join(" · ");
    return "";
  });
}
function useModule() {
  const [store] = useState(() => new ModuleStore({ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) }));
  const [state, setState] = useState(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { setState(store.hydrate()); setLoaded(true); setMessage(store.warning); }, [store]);
  function act(reducer: (current: State) => State) {
    try { setState(store.save(reducer(store.state))); setMessage(store.warning); }
    catch (error) { setMessage(error instanceof Error ? error.message : "This action is unavailable; earlier progress is preserved."); }
  }
  return { store, state, setState, loaded, message, setMessage, act };
}
function Nav() {
  return <nav aria-label="Essentials navigation"><Link href="/python/essentials">Essentials overview</Link>{LESSONS.map((lesson, index) => <Link key={lesson.slug} href={index === 0 ? "/python/essentials/p01/module" : `/python/essentials/${lesson.slug}`}>{lesson.slug.toUpperCase()}</Link>)}<Link href="/python/essentials/mastery">Independent assessment</Link></nav>;
}
function Frame({ children, message, title }: { children: React.ReactNode; message: string; title: string }) {
  return <main className={styles.page}><BetaNav status="Python Essentials"/><a href="#essentials-content">Skip to Essentials content</a><Nav/><header id="essentials-content"><h1>{title}</h1></header>{message && <p role="alert">{message}</p>}{children}</main>;
}
function TransferPanel({ module }: { module: ReturnType<typeof useModule> }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [consent, setConsent] = useState(false);
  const [feedback, setFeedback] = useState("");
  return <section className={styles.card} aria-labelledby="copy-title"><h2 id="copy-title">Optional copy from original P01</h2>
    <p>Your original P01 remains available at its original route and storage key. Nothing is copied automatically. Only compatible practice, drafts, counters, remediation and activity/completion can be copied—not independent mastery.</p>
    <Link href="/python/essentials/p01">Open original P01 and its retained progress</Link>
    <button disabled={!module.loaded || Boolean(module.state.transfer)} onClick={async () => {
      try { setPreview(await previewP01(module.store.storage)); setConsent(false); setFeedback(""); }
      catch (error) { setPreview(null); setFeedback(error instanceof Error ? error.message : "Cannot validate original P01; nothing changed."); }
    }}>Preview P01 copy</button>
    {preview && <div><h3>Preview only — not yet copied</h3><p>Source: {preview.source.content}. Mapping: p01-to-essentials.copy.1. {preview.completed}/4 practice objectives demonstrated; original lesson {preview.lessonCompleted ? "completed" : "not completed"}. Current P01 work in this module will never be overwritten.</p>
      <ul>{preview.source.practice.map((item, index) => <li key={index}>P01.O{index + 1}: {item.passed ? "practice complete" : "practice incomplete"}; variant {item.variant ? "B" : "A"}; counters {item.counts.join("/")}; review cycle {item.cycle + 1}; {item.response ? "compatible draft included" : "no draft"}.</li>)}</ul>
      <p>Experiment evidence: {preview.source.experiment.passed ? "demonstrated" : "not demonstrated"}. Source timestamps retained. Feedback text is regenerated, not copied as assessment evidence. One copy per mapping; repeating confirmation cannot inflate progress.</p>
      <p>Source SHA-256: <code>{preview.hash}</code></p>
      <label><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)}/>I opt in to this copy-only mapping. Original P01 will remain untouched; no mastery will be awarded.</label>
      <button disabled={!consent || !module.store.writable} onClick={() => {
        try { module.setState(module.store.transfer(preview, consent, now())); setPreview(null); setConsent(false); setFeedback("P01 copied once into Essentials. Original bytes are unchanged; no mastery was awarded."); }
        catch (error) { setFeedback(error instanceof Error ? error.message : "Copy failed; original and earlier target progress are preserved."); }
      }}>Confirm copy into Essentials</button><button onClick={() => { setPreview(null); setConsent(false); }}>Cancel preview</button></div>}
    {module.state.transfer && <p>Compatible P01 copy already recorded. Source and map provenance retained; no duplicate copy is available.</p>}<p role="status">{feedback}</p>
  </section>;
}
export function EssentialsOverview() {
  const module = useModule();
  const [reset, setReset] = useState(false);
  return <Frame title="Python Essentials for machine learning" message={module.message}><p>Eight lessons connect values, ordered records, reliable transformations and small validated programs. There is no hosted Python execution. Prior Mathematics remains available through recall links; lesson order is recommended, not a navigation lock.</p>
    <p role="status">{!module.loaded ? "Loading Essentials progress…" : module.state.evidence.objectives[MASTERY]?.mastered ? "Essentials mastery previously earned for this assessment version." : "Essentials mastery not yet earned. Lesson completion does not award it."}</p>
    <ol>{LESSONS.map((lesson, index) => <li key={lesson.slug}><Link href={index === 0 ? "/python/essentials/p01/module" : `/python/essentials/${lesson.slug}`}>{lesson.slug.toUpperCase()} — {lesson.title}</Link><p>{lesson.motivation} · {lessonComplete(module.state, index) ? "Lesson completed" : "Lesson not completed"}</p></li>)}</ol>
    <section className={styles.card}><h2>Independent demonstration</h2><p>32 objective families per form; 26/32 plus all eight critical gates in the same confirmed attempt. Three complete forms rotate on unlimited retries. Both decision and reasoning must pass each critical gate. Only independently correct objectives in a passing attempt receive mastery.</p><Link href="/python/essentials/mastery">Open independent assessment</Link><p>{MASTERY_AVAILABLE ? "Complete assessment verification released for this version." : "Mastery remains unavailable until the full version passes verification."}</p></section>
    <TransferPanel module={module}/>
    <section className={styles.card}><h2>Notebook and scope</h2><a href="/notebooks/python-essentials.ipynb" download>Download the reproducible Essentials notebook</a><p>Trusted local code and embedded fictional records only. Notebook execution/download never grants platform mastery. Genuine Colab, screen-reader and browser-zoom verification remain open.</p></section>
    <section className={styles.card}><h2>Reset only this module</h2><label><input type="checkbox" checked={reset} onChange={event => setReset(event.target.checked)}/>Confirm removing this v2 module's practice, assessment history and mastery. Original P01, Math and Regression remain untouched.</label><button disabled={!module.loaded || !reset} onClick={() => {
      try { module.setState(module.store.reset(true)); module.setMessage(module.store.warning); setReset(false); } catch { module.setMessage("Module reset failed; original records are preserved."); }
    }}>Reset Essentials v2 only</button></section>
  </Frame>;
}
function PracticePanel({ index, module }: { index: number; module: ReturnType<typeof useModule> }) {
  const state = module.state, entry = state.practice[index], definition = PRACTICE_FORMS[entry.variant][index];
  const exhausted = entry.counts.every(count => count === 2);
  const work = workedCase(Math.floor(index / 4), index % 4);
  return <section className={styles.card} aria-label={`Practice ${definition.objective}`}><h3>{definition.objective}{definition.critical ? " — critical decision and reasoning" : ""}</h3>
    <p>{entry.passed ? "Practice demonstrated — not independent mastery." : "Practice not demonstrated."} Variant {entry.variant ? "B" : "A"} · valid submissions {entry.counts[entry.variant]}/2 · review cycle {entry.cycle >= 1e6 ? "1000000+" : entry.cycle + 1}.</p>
    <p>{definition.prompt}</p><pre><code>{definition.code}</code></pre>
    {definition.atoms.map((atom, position) => <AnswerInput key={atom.id} atom={atom} answer={entry.answers[position]} name={`practice-${index}-${atom.id}`} change={answer => module.act(current => ({ ...current, practice: current.practice.map((item, offset) => offset === index ? { ...item, answers: item.answers.map((value, atomIndex) => atomIndex === position ? answer : value), last: null } : item) }))}/>)}
    <button disabled={entry.counts[entry.variant] >= 2} onClick={() => module.act(current => practiceSubmit(current, index, now()))}>Check {definition.objective}</button>
    <p role="status">{entry.last === null ? "" : entry.last ? `Correct. ${definition.explanation}` : `Not yet. ${definition.remediation}`}</p>
    {entry.counts[entry.variant] >= 2 && <p><strong>Worked correction:</strong> {definition.explanation} Accepted response: {JSON.stringify(definition.accepted[0])}. Use the changed case before a new cycle.</p>}
    {!exhausted && <button onClick={() => module.act(current => alternate(current, index))}>Alternate {definition.objective} practice</button>}
    {exhausted && <div><h4>Targeted remediation and changed-case recall</h4><p>{definition.remediation}</p>
      {index < 4 ? <><p>{REMEDIATION[index].worked}</p><p>{REMEDIATION[index].prompt}</p></> : <><pre><code>{work!.code}</code></pre><p>Predict this changed worked case after reviewing its state trace. {work!.reason}</p></>}
      <label><input type="checkbox" checked={entry.reviewed} onChange={event => module.act(current => ({ ...current, practice: current.practice.map((item, offset) => offset === index ? { ...item, reviewed: event.target.checked } : item) }))}/>I reviewed this objective's contrast.</label>
      <label>Changed-case explanation<select value={entry.remediation} onChange={event => module.act(current => ({ ...current, practice: current.practice.map((item, offset) => offset === index ? { ...item, remediation: event.target.value } : item) }))}><option value="">Choose a changed-case response</option>{index < 4 ? REMEDIATION[index].options.map((option, position) => <option key={option} value={String(position)}>{option}</option>) : <><option value="counter">{JSON.stringify(work!.wrong)}</option><option value="observed">{JSON.stringify(work!.expected)}</option></>}</select></label>
      <button onClick={() => module.act(current => recover(current, index))}>Start new {definition.objective} review cycle</button></div>}
  </section>;
}
function Lab({ lesson, module }: { lesson: number; module: ReturnType<typeof useModule> }) {
  const current = module.state.activities[lesson], config = ACTIVITIES[lesson].find(item => item.id === current.config)!;
  const output = useRef<HTMLDivElement>(null);
  return <section id="experiment" className={styles.card}><h2>Experiment: trace one meaningful change</h2><p>Finite authored Python reference simulation, not execution of your code. Predict before reveal; change the configuration and explain the mechanism to demonstrate activity completion.</p>
    <label>Experiment configuration<select value={current.config} onChange={event => module.act(state => changeActivity(state, lesson, event.target.value))}>{ACTIVITIES[lesson].map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    <pre><code>{config.code}</code></pre>
    <label>Predict normalized outcome<select value={current.prediction} onChange={event => module.act(state => ({ ...state, activities: state.activities.map((item, index) => index === lesson ? { ...item, prediction: event.target.value, revealed: false } : item) }))}><option value="">Choose an outcome</option>{activityPredictions(lesson).map(item => <option key={item} value={item}>{item}</option>)}</select></label>
    <label>Explain this trace<select value={current.reason} onChange={event => module.act(state => ({ ...state, activities: state.activities.map((item, index) => index === lesson ? { ...item, reason: event.target.value, revealed: false } : item) }))}><option value="">Choose a reason</option>{ACTIVITY_REASONS(lesson).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    <button onClick={() => { module.act(state => checkActivity(state, lesson, now())); output.current?.focus(); }}>Check and reveal trace</button>
    <button onClick={() => module.act(state => ({ ...state, activities: state.activities.map((item, index) => index === lesson ? { ...item, config: ACTIVITIES[lesson][0].id, prediction: "", reason: "", revealed: false } : item) }))}>Reset experiment controls</button>
    <div ref={output} tabIndex={-1} role="status" aria-label="Experiment result">{current.revealed && <><p>{current.prediction === config.output && current.reason === config.reasonId ? "Prediction and explanation correct." : "Not yet: compare your prediction with the reference mechanism."}</p><p>Observed outcome: {config.output}</p><p>{config.reason}</p>{!current.changed && <p>Change a configuration to demonstrate meaningful interaction.</p>}</>}</div><p>{current.passed ? "Activity demonstrated; not mastery." : "Activity not yet demonstrated."}</p>
  </section>;
}
export function EssentialsLesson({ lesson }: { lesson: number }) {
  const module = useModule(), content = LESSONS[lesson];
  const [reset, setReset] = useState(false);
  return <Frame title={`${content.slug.toUpperCase()} — ${content.title}`} message={module.message}>
    <p role="status">{!module.loaded ? "Loading local progress…" : lessonComplete(module.state, lesson) ? "Lesson completed. Independent module mastery is separate." : "Lesson in progress; four correct practice families and a meaningful explained experiment are required."}</p>
    <p>Prerequisite recall: {content.prerequisites} <Link href="/math/algebra-functions">Algebra functions</Link> · <Link href="/math/statistics">Statistics</Link>. Direct entry is allowed.</p>
    <section className={styles.card}><h2>Why this exists</h2><p>{content.motivation}</p><p><strong>Mathematical intuition:</strong> {content.math}</p><p><strong>Terminology:</strong> {content.terms}</p><p><strong>Worked starting point:</strong> {content.worked}</p><p><strong>Now change the conditions:</strong> {content.progression}</p><p><strong>Common misconception:</strong> {content.misconception}</p></section>
    <p>Structured outcomes use normalized JSON traces: true/false/null correspond to Python True/False/None; tuple pairs appear as ordered arrays. Where collection types matter, explicit type names are assessed. These are not promises of identical Python print formatting.</p>
    {lesson === 0 && <p><Link href="/python/essentials/p01">Revisit the unchanged original P01 lesson and its worked explanations</Link>. Module practice uses the same P01 question/experiment semantics; copying original evidence remains opt-in from the overview.</p>}
    <fieldset disabled={!module.loaded}><legend>Essentials teaching and guided practice</legend>
      {content.objectives.map((objective, offset) => {
        const work = workedCase(lesson, offset);
        return <section key={objective.id}><div className={styles.card}><h2>{objective.id}: {objective.outcome}</h2>
          {objective.introductory && <p>Introductory recognition only; no advanced class design or inheritance requirement.</p>}
          <p>{work?.reason ?? PRACTICE_FORMS[0][offset].explanation}</p>
          {work ? <><h3>Worked numerical / state example</h3><pre><code>{work.code}</code></pre><p>Reference outcome/error: {JSON.stringify(work.expected)}.</p><p>Misconception contrast: {JSON.stringify(work.wrong)} is not this program's outcome. {objective.remediation}</p></> : <><h3>Worked P01 reference</h3><pre><code>{PRACTICE_FORMS[0][offset].code}</code></pre><ul>{workedResponses(PRACTICE_FORMS[0][offset]).map(response => <li key={response}>{response}</li>)}</ul></>}
          <p><strong>ML application:</strong> {content.motivation} Use this check to justify the data/result before passing it into a model, not merely to recognize syntax.</p><p><strong>Success means:</strong> {objective.assessment}</p>
        </div><PracticePanel index={lesson * 4 + offset} module={module}/></section>;
      })}
      <Lab lesson={lesson} module={module}/>
      <section className={styles.card}><h2>Scoped lesson reset</h2><label><input type="checkbox" checked={reset} onChange={event => setReset(event.target.checked)}/>Confirm clearing only this lesson's practice/drafts/activity. Independent assessment history and earned mastery will remain.</label><button disabled={!reset} onClick={() => { module.act(state => resetLesson(state, lesson, true, now())); setReset(false); }}>Reset lesson practice only</button></section>
    </fieldset>
    <p><Link href="/python/essentials/mastery">Independent assessment</Link> · <a href="/notebooks/python-essentials.ipynb" download>Essentials notebook</a>. Neither lesson completion nor notebook use awards mastery.</p>
  </Frame>;
}
export function EssentialsAssessment() {
  const module = useModule(), draft = module.state.draft, definitions = INDEPENDENT_FORMS[draft.form];
  const [confirmed, setConfirmed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (draft.phase !== "active") heading.current?.focus(); }, [draft.phase, draft.id]);
  const invalid = definitions.filter((definition, index) => !validResponse(definition, familyResponse(index, draft.answers[index], draft.form, true))).length;
  const unanswered = draft.answers.filter(answers => answers.some(answer => answer.kind === "unanswered")).length;
  return <Frame title="Independent Essentials assessment" message={module.message}>
    <p role="status">{!module.loaded ? "Loading assessment progress…" : `Form ${["A", "B", "C"][draft.form]} · Previously earned version-scoped mastery: ${module.state.evidence.objectives[MASTERY]?.mastered ? "yes" : "no"}`}</p>
    <p>All 32 families, at least 26 correct and all eight critical gates in one attempt. Both atoms of each critical gate must be correct. No answer-by-answer correctness is revealed before confirmation. Unlimited retries rotate A/B/C; no best-of-attempt combining.</p>
    <p>Results are normalized JSON traces, not exact Python repr: true/false/null mean True/False/None; tuple pairs preserve order in arrays.</p>
    {!MASTERY_AVAILABLE && <p role="alert">Mastery is unavailable until the complete content/assessment version passes verification.</p>}
    {draft.phase === "active" && <fieldset disabled={!module.loaded || !MASTERY_AVAILABLE}><legend>Independent answers, form {["A", "B", "C"][draft.form]}</legend>{definitions.map((definition, index) => <section key={definition.id} className={styles.card} aria-label={definition.objective}><h2>{definition.objective}{definition.critical ? " — mandatory critical gate" : ""}</h2><p>{definition.prompt}</p><pre><code>{definition.code}</code></pre>{definition.atoms.map((atom, position) => <div key={atom.id}><AnswerInput atom={atom} answer={draft.answers[index][position]} name={`independent-${index}-${atom.id}`} change={answer => module.act(state => ({ ...state, draft: { ...state.draft, answers: state.draft.answers.map((answers, familyIndex) => familyIndex === index ? answers.map((value, atomIndex) => atomIndex === position ? answer : value) : answers) } }))}/><button onClick={() => module.act(state => ({ ...state, draft: { ...state.draft, answers: state.draft.answers.map((answers, familyIndex) => familyIndex === index ? answers.map((value, atomIndex) => atomIndex === position ? { kind: "unanswered" } : value) : answers) } }))}>Clear {definition.objective} {atom.id}</button></div>)}</section>)}
      <button onClick={() => { module.act(state => ({ ...state, draft: { ...state.draft, phase: "review" } })); setConfirmed(false); }}>Review all 32 answers</button></fieldset>}
    {draft.phase === "review" && <section className={styles.card}><h2 ref={heading} tabIndex={-1}>Review before submitting</h2><p>{unanswered} families have unanswered parts. Blanks count wrong and unanswered critical parts fail their gate. {invalid} responses have incomplete/unsupported representations; complete or clear those before submitting.</p>
      <ol>{definitions.map((definition, index) => <li key={definition.id}>{definition.objective}: {workedResponses(definition, draft.answers[index]).join(" · ")}</li>)}</ol>
      <button onClick={() => { module.act(state => ({ ...state, draft: { ...state.draft, phase: "active" } })); setConfirmed(false); }}>Edit answers</button>
      <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)}/>I reviewed the full attempt and confirm submission, including any unanswered items.</label>
      <button disabled={!confirmed || invalid > 0 || !MASTERY_AVAILABLE} onClick={() => { module.act(state => confirmAttempt(state, confirmed, now())); setConfirmed(false); heading.current?.focus(); }}>Submit confirmed attempt</button></section>}
    {draft.phase === "results" && draft.result && <section><h2 ref={heading} tabIndex={-1}>{draft.result.passed ? "Mastery demonstrated" : "Not yet mastered"}: {draft.result.score}/32</h2><p>Threshold 26/32 AND every critical gate. Failed critical objectives: {draft.result.critical.join(", ") || "none"}. Previous mastery is never erased by a later failed attempt.</p>
      {definitions.map((definition, index) => <section key={definition.id} className={styles.card}><h3>{definition.objective}: {draft.result!.outcomes[index] ? "correct" : "not yet"}</h3><p>{draft.result!.outcomes[index] ? definition.explanation : definition.remediation}</p>{!draft.result!.outcomes[index] && <><p><strong>Worked correction:</strong> {definition.explanation}</p><p>Reference response: {workedResponses(definition).join(" · ")}</p><p>Compare the changed worked case in the linked lesson before retrying; the next form is a new full attempt, not a combination with this one.</p></>}<Link href={index < 4 ? "/python/essentials/p01/module" : `/python/essentials/${LESSONS[Math.floor(index / 4)].slug}`}>Targeted lesson recall</Link></section>)}
      <button onClick={() => module.act(state => retry(state, crypto.randomUUID()))}>Retry next independent form</button></section>}
    <section className={styles.card}><h2>Saved attempt summaries</h2><p>Latest 20 compact summaries; only the latest full submitted response is retained. Finite forms and client-visible answers are not high-stakes proctoring or unrestricted-code certification.</p><ol>{module.state.history.map(item => <li key={item.id}>{item.at}: form {["A", "B", "C"][item.form]}, {item.score}/32, {item.passed ? "passed all gates" : `not passed; critical failures ${item.critical.join(", ") || "none"}`}; {ASSESSMENT}</li>)}</ol></section>
  </Frame>;
}
