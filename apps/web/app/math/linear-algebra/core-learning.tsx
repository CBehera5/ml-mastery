"use client";
import Link from "next/link";
import {BookOpening,BookExplanation} from "../teaching/book-lesson";
import {EquationReader} from "../../experience/equation-literacy/equation-reader";
import {DiscoveryPrompt,TransferPrompt} from "./journey";
import { useState } from "react";
import { recordObjectiveCompletion } from "../../learn/foundation/evidence";
import { evaluateExercise, type ExerciseResult } from "../../learn/foundation/exercises";
import { CONTENT, MODULE_ID, lessonTopics, questions, type Lesson, type Topic } from "./content";
import { BatchExperiment, VectorExperiment } from "./experiments";
import { finishLesson, importLegacy } from "./model";
import { LessonCode, LessonPlayground, extraFor } from "../extras/registry";
import { useCoreEvidence } from "./use-evidence";

export function CoreLearning({ lesson }: { lesson: Lesson }) {
  const { evidence, setEvidence, loaded, storageError } = useCoreEvidence();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ExerciseResult>>({});
  const [importMessage, setImportMessage] = useState("");
  const checks = questions(0).filter(question => lessonTopics(lesson).includes(question.topic));
  function explore(topic: Topic) {
    if (!loaded) return;
    const time = new Date().toISOString();
    setEvidence(previous => finishLesson(recordObjectiveCompletion(previous, `${MODULE_ID}.${topic}.activity`, `${MODULE_ID}.${topic}.experiment`, time), lesson, time));
  }
  function check(key: string) {
    const question = checks.find(item => item.key === key)!;
    const answer = answers[key];
    if (!loaded || !answer?.trim()) return;
    const result = evaluateExercise(question.exercise, question.exercise.kind === "numerical" ? { kind: "numerical", value: Number(answer) } : { kind: "conceptual", optionId: answer }, 1);
    setResults(previous => ({ ...previous, [key]: result }));
    if (result.correct) {
      const time = new Date().toISOString();
      setEvidence(previous => finishLesson(recordObjectiveCompletion(previous, question.objectiveId, question.exercise.id, time), lesson, time));
    }
  }
  function importCompletion() {
    try {
      const raw = localStorage.getItem(`ml-math-lab:lesson:${lesson === "vectors" ? "vectors-dot-product" : "matrices-multiplication"}:v1`);
      const next = importLegacy(evidence, lesson, raw, new Date().toISOString());
      setEvidence(next);
      setImportMessage(next.objectives[`${MODULE_ID}.${lesson}.legacy-completion`]?.completed ? "Found your earlier five-stage completion and kept it as it was." : "No complete five-stage record found. Your progress is unchanged.");
    } catch { setImportMessage("Could not read historical completion. Existing records remain unchanged."); }
  }
  const completed = evidence.lessons[`${MODULE_ID}.${lesson}`]?.state === "completed";
  return <section className="panel la-core" id="linear-algebra-content" tabIndex={-1} aria-label="Linear Algebra core learning"><h2>{lesson === "vectors" ? "From measurements to a weighted score" : "From one observation to a whole dataset"}</h2><details><summary>How practice and progress work</summary><p>Work through the two concept sections, then use the existing five-stage house lab below. Each new section requires a real experiment change plus four correct checks. Your earlier five-stage progress is kept as it was.</p></details><p><Link href="/math/algebra-functions">Recall Algebra, functions and notation →</Link> · <a href="#existing-house-lab">Jump to the existing house lab</a></p>
    {lessonTopics(lesson).map(topic => {
      const content = CONTENT[topic];
      const activity = evidence.objectives[`${MODULE_ID}.${topic}.activity`]?.completed;
      const topicChecks = checks.filter(question => question.topic === topic);
      return <section key={topic} id={`core-${topic}`} aria-labelledby={`title-${topic}`}><h3 id={`title-${topic}`}>{content.title}</h3><details><summary>What you’ll practice</summary><ul>{topicChecks.map(question => <li key={question.key}>{question.statement}</li>)}</ul></details><BookOpening module="linear" lesson={topic}/><DiscoveryPrompt topic={topic}/><LessonPlayground module="linear" slug={topic} onDone={() => explore(topic)} /><details className="la-more"><summary>{extraFor("linear", topic)?.moreLabel}</summary>{lesson === "vectors" ? <VectorExperiment topic={topic} onExplore={() => explore(topic)} /> : <BatchExperiment topic={topic} onExplore={() => explore(topic)} />}</details><BookExplanation module="linear" lesson={topic}/><LessonCode module="linear" slug={topic} /><details><summary>Definition and notation reference: {content.title}</summary><p>{content.definition}</p><p>{content.intuition}</p><p>{content.symbols}</p></details><h4>Calculate with the playground’s vectors</h4><p>{content.worked}</p><aside className="la-recall"><h4>Prerequisite recall</h4><p>{content.recall}</p>{topic === "dot" && <a href="#core-vectors">Review vector magnitude and direction</a>}{lesson === "matrices" && <Link href="/math/vectors-dot-product#core-dot">Review dot products</Link>}</aside><h4>Misconception to avoid</h4><p>{content.misconception}</p><h4>Where ML uses this</h4><p>{content.application}</p><TransferPrompt topic={topic}/><h4>Understanding checks</h4><p>Use the worked example and the playground to reason about these values. Answers within 0.001 count as correct.</p>{topicChecks.map(question => <fieldset key={question.key}><legend>{question.exercise.prompt}</legend>{question.exercise.kind === "numerical" ? <label>Answer: {question.statement}<input type="number" step="any" value={answers[question.key] ?? ""} onChange={event => { setAnswers(previous => ({ ...previous, [question.key]: event.target.value })); setResults(previous => { const next = { ...previous }; delete next[question.key]; return next; }); }} /></label> : question.exercise.options.map(option => <label key={option.id}><input type="radio" name={`guided-${question.key}`} checked={answers[question.key] === option.id} onChange={() => { setAnswers(previous => ({ ...previous, [question.key]: option.id })); setResults(previous => { const next = { ...previous }; delete next[question.key]; return next; }); }} />{option.label}</label>)}<button disabled={!loaded || !answers[question.key]?.trim()} onClick={() => check(question.key)}>Check: {question.statement}</button>{results[question.key] && <p role="status">{results[question.key].feedback} {!results[question.key].correct && <a href={`#core-${topic}`}>Review this concept and try again.</a>}</p>}{evidence.objectives[question.objectiveId]?.completed && <p>Check complete.</p>}</fieldset>)}<p>{activity ? "Experiment done." : "Change a control in the experiment to start."} {topicChecks.filter(question => evidence.objectives[question.objectiveId]?.completed).length}/4 objective checks recorded.</p></section>;
    })}
    <details><summary>Read a larger ML expression</summary><EquationReader key={lesson} module="linear"/></details><section className="la-recall" aria-live="polite"><h3>{completed ? "Core lesson outcome demonstrated" : "Build your core lesson evidence"}</h3><p>Mastery comes from the assessment. Resetting the original five-stage lesson below clears only that old record.</p>{storageError && <p role="alert">Progress cannot be saved reliably in this browser; it remains usable during this visit.</p>}</section><button disabled={!loaded} onClick={importCompletion}>Import historical five-stage completion</button>{importMessage && <p role="status">{importMessage}</p>}<p><Link href="/math/linear-algebra/assessment">Attempt independent Linear Algebra core assessment →</Link></p></section>;
}
