"use client";
import {EquationReader} from "../../experience/equation-literacy/equation-reader";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PublicNav } from "../../landing/public-nav";
import {PathwayFooter} from "../../experience/pathway";
import shared from "../../experience/pathway.module.css";
import {PythonCards,PythonReflection,PythonNext,lessonRoute} from "../journey-components";
import {PYTHON_JOURNEYS} from "../journey";
import { AnswerInput } from "../foundation/learning";
import { validResponse, type Answer, type Family } from "../foundation/contracts";
import { Outcome } from "./outcome";
import { CONCEPT_NOTES } from "./teaching";
import { DATASET } from "./catalog";
import styles from "../journey.module.css";
import { ACTIVITIES, ACTIVITY_REASONS, activityPredictions, ASSESSMENT, INDEPENDENT_FORMS, LESSONS, MASTERY_AVAILABLE, PRACTICE_FORMS, referenceCase as workedCase } from "./catalog";
import { alternate, changeActivity, checkActivity, confirmAttempt, emptyState, familyResponse, lessonComplete, MASTERY, ModuleStore, practiceSubmit, recover, resetLesson, retry, type State } from "./model";

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
function Nav({current}:{current?:number}) {return <details className={styles.navigation}><summary>Module learning path</summary><nav aria-label="pandas navigation"><Link href="/python/pandas">Module overview</Link><ol>{LESSONS.map((item,index)=><li key={item.slug}><Link aria-current={current===index?"page":undefined} href={lessonRoute("pandas",item.slug)}>{item.title}</Link></li>)}</ol><Link href="/python/pandas/mastery">Independent assessment</Link></nav></details>;}
function Frame({children,message,title,overview=false,lesson}:{children:React.ReactNode;message:string;title:string;overview?:boolean;lesson?:number}){return <div className={shared.page}><main className={styles.page}><a className={shared.skip} href="#pandas-content">Skip to lesson content</a><PublicNav active="Python"/><p><Link href="/python">← Python learning path</Link></p>{!overview&&<Nav current={lesson}/>}<header id="pandas-content" tabIndex={-1}><p className={styles.eyebrow}>Python · pandas</p><h1>{title}</h1></header>{message&&<p role="alert">{message}</p>}{children}<PathwayFooter/></main></div>;}

export function PandasOverview() {
  const module = useModule();
  const [reset, setReset] = useState(false);
  return <Frame overview title="Python Pandas for machine learning" message={module.message}><p>Six lessons connect labeled observations, aligned selections, explicit missingness, honest summaries, validated joins and reproducible audits. There is no hosted Python execution. Prior Mathematics remains available through recall links; lesson order is recommended, not a navigation lock.</p>
    <p role="status">{!module.loaded ? "Loading Pandas progress…" : module.state.evidence.objectives[MASTERY]?.mastered ? "Pandas mastery previously earned for this assessment version." : "Pandas mastery not yet earned. Lesson completion does not award it."}</p>
    <PythonCards module="pandas" lessons={LESSONS}/><details><summary>Lesson completion records</summary><ul>{LESSONS.map((item,index)=><li key={item.slug}>{item.title}: {lessonComplete(module.state,index)?"Lesson completed":"Lesson not completed"}</li>)}</ul></details>
    <section className={styles.card}><h2>Independent demonstration</h2><p>24 objective families per form; 20/24 plus all seven critical gates in the same confirmed attempt. Three complete forms rotate on unlimited retries. Both decision and reasoning must pass each critical gate. Only independently correct objectives in a passing attempt receive mastery.</p><Link href="/python/pandas/mastery">Open independent assessment</Link><p>{MASTERY_AVAILABLE ? "Complete assessment verification released for this version." : "Mastery remains unavailable until the full version passes verification."}</p></section>
    <section className={styles.card}><h2>Notebook and scope</h2><a href="/notebooks/python-pandas.ipynb" download>Download the reproducible Pandas notebook</a><p>Trusted local code and embedded fictional records only. Notebook execution/download never grants platform mastery. Genuine Colab, screen-reader and browser-zoom verification remain open.</p></section>
    <section className={styles.card}><h2>Reset only this module</h2><label><input type="checkbox" checked={reset} onChange={event => setReset(event.target.checked)}/>Confirm removing this Pandas module's practice, assessment history and mastery. Essentials, Math and Regression remain untouched.</label><button disabled={!module.loaded || !reset} onClick={() => {
      try { module.setState(module.store.reset(true)); module.setMessage(module.store.warning); setReset(false); } catch { module.setMessage("Module reset failed; original records are preserved."); }
    }}>Reset Pandas only</button></section>
  </Frame>;
}
function PracticePanel({ index, module }: { index: number; module: ReturnType<typeof useModule> }) {
  const state = module.state, entry = state.practice[index], definition = PRACTICE_FORMS[entry.variant][index];
  const exhausted = entry.counts.every(count => count === 2);
  const work = workedCase(Math.floor(index / 4), index % 4);
  return <section className={styles.card} aria-label={`Practice ${definition.objective}`}><h3>{definition.objective}{definition.critical ? " — critical decision and reasoning" : ""}</h3>
    <p>{entry.passed ? "Practice demonstrated — not independent mastery." : "Practice not demonstrated."} Variant {entry.variant ? "B" : "A"} · valid submissions {entry.counts[entry.variant]}/2 · review cycle {entry.cycle >= 1e6 ? "1000000+" : entry.cycle + 1}.</p>
    <p>{definition.prompt}</p><pre tabIndex={0} aria-label={`${definition.objective} Python source`}><code>{definition.code}</code></pre>
    {definition.atoms.map((atom, position) => <AnswerInput key={atom.id} atom={atom} answer={entry.answers[position]} name={`practice-${index}-${atom.id}`} change={answer => module.act(current => ({ ...current, practice: current.practice.map((item, offset) => offset === index ? { ...item, answers: item.answers.map((value, atomIndex) => atomIndex === position ? answer : value), last: null } : item) }))}/>)}
    <button disabled={entry.counts[entry.variant] >= 2} onClick={() => module.act(current => practiceSubmit(current, index, now()))}>Check {definition.objective}</button>
    <p role="status">{entry.last === null ? "" : entry.last ? `Correct. ${definition.explanation}` : `Not yet. ${definition.remediation}`}</p>
    {entry.counts[entry.variant] >= 2 && <p><strong>Worked correction:</strong> {definition.explanation} Accepted response: {workedResponses(definition).join(" · ")}. Use the changed case before a new cycle.</p>}
    {!exhausted && <button onClick={() => module.act(current => alternate(current, index))}>Alternate {definition.objective} practice</button>}
    {exhausted && <div><h4>Targeted remediation and changed-case recall</h4><p>{definition.remediation}</p>
      <pre tabIndex={0} aria-label="Changed-case Python"><code>{work.code}</code></pre><p>{work.reason}</p>
      <label><input type="checkbox" checked={entry.reviewed} onChange={event => module.act(current => ({ ...current, practice: current.practice.map((item, offset) => offset === index ? { ...item, reviewed: event.target.checked } : item) }))}/>I reviewed this objective's contrast.</label>
      <label>Changed-case explanation<select value={entry.remediation} onChange={event => module.act(current => ({ ...current, practice: current.practice.map((item, offset) => offset === index ? { ...item, remediation: event.target.value } : item) }))}><option value="">Choose a changed-case response</option><option value="counter">The shown operation preserves every row, label and missingness value unchanged.</option><option value="observed">{JSON.stringify(work.expected)}</option></select></label>
      <button onClick={() => module.act(current => recover(current, index))}>Start new {definition.objective} review cycle</button></div>}
  </section>;
}
function Lab({ lesson, module }: { lesson: number; module: ReturnType<typeof useModule> }) {
  const current = module.state.activities[lesson], config = ACTIVITIES[lesson].find(item => item.id === current.config)!;
  const output = useRef<HTMLDivElement>(null);
  return <section id="experiment" className={styles.card}><h2>Experiment: trace one meaningful change</h2><p>Finite authored Pandas reference simulation, not execution of your code. Predict before reveal; change the configuration and explain the mechanism to demonstrate activity completion.</p>
    <label>Experiment configuration<select value={current.config} onChange={event => module.act(state => changeActivity(state, lesson, event.target.value))}>{ACTIVITIES[lesson].map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    <pre tabIndex={0} aria-label="Experiment Python source"><code>{config.code}</code></pre>
    <label>Predict normalized outcome<select value={current.prediction} onChange={event => module.act(state => ({ ...state, activities: state.activities.map((item, index) => index === lesson ? { ...item, prediction: event.target.value, revealed: false } : item) }))}><option value="">Choose an outcome</option>{activityPredictions(lesson).map(item => <option key={item} value={item}>{item}</option>)}</select></label>
    <label>Explain this trace<select value={current.reason} onChange={event => module.act(state => ({ ...state, activities: state.activities.map((item, index) => index === lesson ? { ...item, reason: event.target.value, revealed: false } : item) }))}><option value="">Choose a reason</option>{ACTIVITY_REASONS(lesson).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    <button onClick={() => { module.act(state => checkActivity(state, lesson, now())); output.current?.focus(); }}>Check and reveal trace</button>
    <button onClick={() => module.act(state => ({ ...state, activities: state.activities.map((item, index) => index === lesson ? { ...item, config: ACTIVITIES[lesson][0].id, prediction: "", reason: "", revealed: false } : item) }))}>Reset experiment controls</button>
    <div ref={output} tabIndex={-1} role="status" aria-label="Experiment result">{current.revealed && <><p>{current.prediction === config.output && current.reason === config.reasonId ? "Prediction and explanation correct." : "Not yet: compare your prediction with the reference mechanism."}</p><Outcome value={JSON.parse(config.output)} label="Observed reference outcome"/><p>{config.reason}</p>{!current.changed && <p>Change a configuration to demonstrate meaningful interaction.</p>}</>}</div><p>{current.passed ? "Activity demonstrated; not mastery." : "Activity not yet demonstrated."}</p>
  </section>;
}
export function PandasLesson({ lesson }: { lesson: number }) {
  const module = useModule(), content = LESSONS[lesson];
  const [reset, setReset] = useState(false);
  return <Frame lesson={lesson} title={PYTHON_JOURNEYS["pandas"][lesson][0]} message={module.message}>
    <p className={styles.eyebrow}>Lesson {lesson+1} of {LESSONS.length} · {content.title}</p><p>{content.motivation}</p><nav className={styles.local} aria-label="In this Python lesson"><a href="#experiment">Explore</a><a href="#lesson-explain">Understand</a><a href="#lesson-practice">Code and practice</a><a href="#lesson-transfer">Reflect</a><a href="#lesson-next">Next step</a></nav>
    <p role="status">{!module.loaded ? "Loading local progress…" : lessonComplete(module.state, lesson) ? "Lesson completed. Independent module mastery is separate." : "Lesson in progress; four correct practice families and a meaningful explained experiment are required."}</p>
    <details><summary>Need a quick refresher?</summary><p>Prerequisite recall: {content.prerequisites} <Link href="/math/algebra-functions">Algebra functions</Link> · <Link href="/python/numpy">NumPy recall</Link> · <Link href="/math/statistics">Statistics</Link> · <Link href="/math/statistics/relationships">Correlation versus causation experiment</Link>. Direct entry is allowed.</p></details>
    <aside className={styles.discovery}><h2>Predict, then explore</h2><p>{content.progression}</p><p>Read the shown Python, predict the outcome, then reveal it. Change one configuration and explain the difference. These activities use authored reference cases; they do not execute your code in the browser.</p></aside><fieldset disabled={!module.loaded}><legend>Explore one controlled change</legend><Lab lesson={lesson} module={module}/></fieldset>
    <section id="lesson-explain" className={styles.card}><h2>Why this exists</h2><p>{content.motivation}</p><p><strong>Mathematical intuition:</strong> {content.math}</p><p><strong>Terminology:</strong> {content.terms}</p><p><strong>Worked starting point:</strong> {content.worked}</p><p><strong>Now change the conditions:</strong> {content.progression}</p><p><strong>Common misconception:</strong> {content.misconception}</p></section>
    <p>Normalized traces include ordered index labels, index names, columns, dtypes and cells. A missing tag is not zero or an empty string. true/false are Boolean values. These are structured reference tables, not exact pandas display formatting.</p>
    <section className={styles.card}><h2>Build the mental model before tracing syntax</h2>{CONCEPT_NOTES[lesson].map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>
    {lesson === 5 && <section className={styles.card}><h2>Canonical fictional source before overlays</h2><p>{DATASET.manifest.id}; source SHA-256: <code style={{ overflowWrap: "anywhere", whiteSpace: "normal" }}>{DATASET.manifest.sha256}</code>. The source has16 unique house IDs. Questions explicitly name any subset or duplicate-ID overlay; they never mutate this source. price is the target and future_price is quarantined, not a feature.</p><Outcome value={DATASET.table} label="Canonical housing source"/></section>}
    <fieldset id="lesson-practice" disabled={!module.loaded}><legend>Pandas teaching and guided practice</legend>
      {content.objectives.map((objective, offset) => {
        const work = workedCase(lesson, offset);
        return <section key={objective.id}><div className={styles.card}><h2>{objective.id}: {objective.outcome}</h2>
          <p>{work.reason}</p>
          <h3>Worked numerical / coordinate example</h3><pre tabIndex={0} aria-label={`${objective.id} worked Python`}><code>{work.code}</code></pre><Outcome value={work.expected} label={`${objective.id} worked outcome`}/><p>{work.reason}</p><p>Misconception: {work.misconception} {objective.remediation}</p>
          <p><strong>Success means:</strong> {objective.assessment}</p>
        </div><PracticePanel index={lesson * 4 + offset} module={module}/></section>;
      })}

      <section className={styles.card}><h2>Scoped lesson reset</h2><label><input type="checkbox" checked={reset} onChange={event => setReset(event.target.checked)}/>Confirm clearing only this lesson's practice/drafts/activity. Independent assessment history and earned mastery will remain.</label><button disabled={!reset} onClick={() => { module.act(state => resetLesson(state, lesson, true, now())); setReset(false); }}>Reset lesson practice only</button></section>
    </fieldset>
    <p><Link href="/python/pandas/mastery">Independent assessment</Link> · <a href="/notebooks/python-pandas.ipynb" download>Pandas notebook</a>. Neither lesson completion nor notebook use awards mastery.</p>
    <PythonReflection module="pandas" lesson={lesson} reference={content.misconception}/><details><summary>Read a larger ML expression</summary><EquationReader key={content.slug} module="python-pandas"/></details><PythonNext module="pandas" lesson={lesson} lessons={LESSONS}/>
  </Frame>;
}
export function PandasAssessment() {
  const module = useModule(), draft = module.state.draft, definitions = INDEPENDENT_FORMS[draft.form];
  const [confirmed, setConfirmed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (draft.phase !== "active") heading.current?.focus(); }, [draft.phase, draft.id]);
  const invalid = definitions.filter((definition, index) => !validResponse(definition, familyResponse(index, draft.answers[index], draft.form, true))).length;
  const unanswered = draft.answers.filter(answers => answers.some(answer => answer.kind === "unanswered")).length;
  return <Frame title="Independent Pandas assessment" message={module.message}>
    <p role="status">{!module.loaded ? "Loading assessment progress…" : `Form ${["A", "B", "C"][draft.form]} · Previously earned version-scoped mastery: ${module.state.evidence.objectives[MASTERY]?.mastered ? "yes" : "no"}`}</p>
    <p>All 24 families, at least 20 correct and all seven critical gates in one attempt. Both atoms of each critical gate must be correct. No answer-by-answer correctness is revealed before confirmation. Unlimited retries rotate A/B/C; no best-of-attempt combining.</p>
    <p>Results preserve exact labels, column order, dtypes and cells. Missing/error outcomes are explicitly tagged, never fabricated zeros. These are normalized traces, not exact pandas repr.</p>
    {!MASTERY_AVAILABLE && <p role="alert">Mastery is unavailable until the complete content/assessment version passes verification.</p>}
    {draft.phase === "active" && <fieldset disabled={!module.loaded || !MASTERY_AVAILABLE}><legend>Independent answers, form {["A", "B", "C"][draft.form]}</legend>{definitions.map((definition, index) => <section key={definition.id} className={styles.card} aria-label={definition.objective}><h2>{definition.objective}{definition.critical ? " — mandatory critical gate" : ""}</h2><p>{definition.prompt}</p><pre tabIndex={0} aria-label={`${definition.objective} independent Python source`}><code>{definition.code}</code></pre>{definition.atoms.map((atom, position) => <div key={atom.id}><AnswerInput atom={atom} answer={draft.answers[index][position]} name={`independent-${index}-${atom.id}`} change={answer => module.act(state => ({ ...state, draft: { ...state.draft, answers: state.draft.answers.map((answers, familyIndex) => familyIndex === index ? answers.map((value, atomIndex) => atomIndex === position ? answer : value) : answers) } }))}/><button onClick={() => module.act(state => ({ ...state, draft: { ...state.draft, answers: state.draft.answers.map((answers, familyIndex) => familyIndex === index ? answers.map((value, atomIndex) => atomIndex === position ? { kind: "unanswered" } : value) : answers) } }))}>Clear {definition.objective} {atom.id}</button></div>)}</section>)}
      <button onClick={() => { module.act(state => ({ ...state, draft: { ...state.draft, phase: "review" } })); setConfirmed(false); }}>Review all 24 answers</button></fieldset>}
    {draft.phase === "review" && <section className={styles.card}><h2 ref={heading} tabIndex={-1}>Review before submitting</h2><p>{unanswered} families have unanswered parts. Blanks count wrong and unanswered critical parts fail their gate. {invalid} responses have incomplete/unsupported representations; complete or clear those before submitting.</p>
      <ol>{definitions.map((definition, index) => <li key={definition.id}>{definition.objective}: {workedResponses(definition, draft.answers[index]).join(" · ")}</li>)}</ol>
      <button onClick={() => { module.act(state => ({ ...state, draft: { ...state.draft, phase: "active" } })); setConfirmed(false); }}>Edit answers</button>
      <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)}/>I reviewed the full attempt and confirm submission, including any unanswered items.</label>
      <button disabled={!confirmed || invalid > 0 || !MASTERY_AVAILABLE} onClick={() => { module.act(state => confirmAttempt(state, confirmed, now())); setConfirmed(false); heading.current?.focus(); }}>Submit confirmed attempt</button></section>}
    {draft.phase === "results" && draft.result && <section><h2 ref={heading} tabIndex={-1}>{draft.result.passed ? "Mastery demonstrated" : "Not yet mastered"}: {draft.result.score}/24</h2><p>Threshold 20/24 AND every critical gate. Failed critical objectives: {draft.result.critical.join(", ") || "none"}. Previous mastery is never erased by a later failed attempt.</p>
      {definitions.map((definition, index) => <section key={definition.id} className={styles.card}><h3>{definition.objective}: {draft.result!.outcomes[index] ? "correct" : "not yet"}</h3><p>{draft.result!.outcomes[index] ? definition.explanation : definition.remediation}</p>{!draft.result!.outcomes[index] && <><p><strong>Worked correction:</strong> {definition.explanation}</p><p>Reference response: {workedResponses(definition).join(" · ")}</p><p>Compare the changed worked case in the linked lesson before retrying; the next form is a new full attempt, not a combination with this one.</p></>}<Link href={`/python/pandas/${LESSONS[Math.floor(index / 4)].slug}`}>Targeted lesson recall</Link></section>)}
      <button onClick={() => module.act(state => retry(state, crypto.randomUUID()))}>Retry next independent form</button></section>}
    <section className={styles.card}><h2>Saved attempt summaries</h2><p>Latest 20 compact summaries; only the latest full submitted response is retained. Finite forms and client-visible answers are not high-stakes proctoring or unrestricted-code certification.</p><ol>{module.state.history.map(item => <li key={item.id}>{item.at}: form {["A", "B", "C"][item.form]}, {item.score}/24, {item.passed ? "passed all gates" : `not passed; critical failures ${item.critical.join(", ") || "none"}`}; {ASSESSMENT}</li>)}</ol></section>
  </Frame>;
}
