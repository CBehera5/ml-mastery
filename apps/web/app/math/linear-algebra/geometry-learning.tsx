"use client";
import Link from "next/link";
import {BookOpening,BookExplanation} from "../teaching/book-lesson";
import {EquationReader} from "../../experience/equation-literacy/equation-reader";
import {DiscoveryPrompt,TransferPrompt,LinearPath} from "./journey";
import { useState } from "react";
import { PublicNav } from "../../landing/public-nav";
import { recordObjectiveCompletion } from "../../learn/foundation/evidence";
import { evaluateExercise, type ExerciseResult } from "../../learn/foundation/exercises";
import { MODULE_ID } from "./content";
import { GEOMETRY_CONTENT, geometryQuestions, geometryTopics, type GeometryLesson, type GeometryTopic } from "./geometry-content";
import { EigenExperiment, TransformationExperiment } from "./geometry-experiments";
import { finishLesson } from "./geometry-model";
import { LessonCode, LessonPlayground, extraFor } from "../extras/registry";
import { useGeometryEvidence } from "./use-geometry-evidence";

export function GeometryLearning({ lesson }: { lesson: GeometryLesson }) {
  const { evidence, setEvidence, loaded, storageError } = useGeometryEvidence();
  const [answers, setAnswers] = useState<Record<string, string>>({}), [results, setResults] = useState<Record<string, ExerciseResult>>({});
  const checks = geometryQuestions(0).filter(question => geometryTopics(lesson).includes(question.topic));
  function explore(topic: GeometryTopic) {
    if (!loaded) return;
    const time = new Date().toISOString();
    setEvidence(previous => finishLesson(recordObjectiveCompletion(previous, `${MODULE_ID}.geometry.${topic}.activity`, `${MODULE_ID}.geometry.${topic}.experiment`, time), lesson, time));
  }
  function answer(key: string, value: string) {
    setAnswers(previous => ({ ...previous, [key]: value }));
    setResults(previous => { const next = { ...previous }; delete next[key]; return next; });
  }
  function check(key: string) {
    const question = checks.find(item => item.key === key)!;
    if (!loaded || !answers[key]?.trim()) return;
    const result = evaluateExercise(question.exercise, question.exercise.kind === "numerical" ? { kind: "numerical", value: Number(answers[key]) } : { kind: "conceptual", optionId: answers[key] }, 1);
    setResults(previous => ({ ...previous, [key]: result }));
    if (result.correct) {
      const time = new Date().toISOString();
      setEvidence(previous => finishLesson(recordObjectiveCompletion(previous, question.objectiveId, question.exercise.id, time), lesson, time));
    }
  }
  const complete = evidence.lessons[`${MODULE_ID}.geometry.${lesson}`]?.state === "completed";
  return <main className="math-lesson-page la-page"><a className="la-skip" href="#geometry-content">Skip to geometry content</a><PublicNav active="Math"/><LinearPath current={lesson === "transformations" ? 2 : 3}/><article id="geometry-content" tabIndex={-1} className="panel la-core"><h1>{lesson === "transformations" ? "Geometry, transformations and information" : "Eigenvector directions and PCA intuition"}</h1><details><summary>Practice scope and prerequisites</summary><p>The original 16 core checks and core mastery remain separate. These new checks record geometry understanding. Guided completion never awards independent mastery.</p><p>Prerequisites: ordered vectors, scalar multiplication, and compatible matrix products. <Link href="/math/vectors-dot-product">Recall vectors and dot products →</Link></p></details>
    {geometryTopics(lesson).map(topic => {
      const content = GEOMETRY_CONTENT[topic], topicChecks = checks.filter(question => question.topic === topic);
      return <section id={`geometry-${topic}`} key={topic} aria-labelledby={`geometry-title-${topic}`}><h2 id={`geometry-title-${topic}`}>{content.title}</h2><details><summary>Scope and learning checks</summary><p>{content.depth}</p><ul>{topicChecks.map(question => <li key={question.key}>{question.statement} {question.depth === "introductory" ? "(Introductory)" : "(Essential)"}</li>)}</ul></details><BookOpening module="linear" lesson={topic}/><DiscoveryPrompt topic={topic}/><LessonPlayground module="linear" slug={topic} onDone={() => explore(topic)} /><details className="la-more"><summary>{extraFor("linear", topic)?.moreLabel}</summary>{topic === "eigen" ? <EigenExperiment onExplore={() => explore(topic)} /> : <TransformationExperiment topic={topic} onExplore={() => explore(topic)} />}</details><BookExplanation module="linear" lesson={topic}/><LessonCode module="linear" slug={topic} /><details><summary>Definition and notation reference: {content.title}</summary><p>{content.meaning}</p><p>{content.intuition}</p><p>{content.symbols}</p></details><h3>Calculate with the playground’s transformation</h3><p>{content.worked}</p><aside className="la-recall"><h3>Prerequisite recall</h3><p>{content.recall}</p>{topic === "inverse" && <a href="#geometry-span">Review span and rank</a>}{topic === "eigen" && <Link href="/math/linear-algebra/transformations">Review linear transformations</Link>}</aside><h3>Where ML uses this</h3><p>{content.application}</p><h3>Misconception to avoid</h3><p>{content.misconception}</p><TransferPrompt topic={topic}/><h3>Understanding checks and remediation</h3><p>Use the reasoning above. Answers within 0.001 count as correct. Introductory checks are practice only.</p>{topicChecks.map(question => <fieldset key={question.key}><legend>{question.exercise.prompt}</legend>{question.exercise.kind === "numerical" ? <label>Geometry answer: {question.statement}<input type="number" step="any" value={answers[question.key] ?? ""} onChange={event => answer(question.key, event.target.value)} /></label> : question.exercise.options.map(option => <label key={option.id}><input type="radio" name={`geometry-guided-${question.key}`} checked={answers[question.key] === option.id} onChange={() => answer(question.key, option.id)} />{option.label}</label>)}<button disabled={!loaded || !answers[question.key]?.trim()} onClick={() => check(question.key)}>Check geometry: {question.statement}</button>{results[question.key] && <p role="status">{results[question.key].feedback} {!results[question.key].correct && <a href={`#geometry-${topic}`}>Review this concept and try again.</a>}</p>}{evidence.objectives[question.objectiveId]?.completed && <p>Geometry understanding evidence recorded.</p>}</fieldset>)}<p>{evidence.objectives[`${MODULE_ID}.geometry.${topic}.activity`]?.completed ? "Experiment activity recorded." : "Change an experiment control to record exploration."} {topicChecks.filter(question => evidence.objectives[question.objectiveId]?.completed).length}/4 objective checks recorded.</p></section>;
    })}<details><summary>Read a larger ML expression</summary><EquationReader key={lesson} module="linear"/></details><section className="la-recall" aria-live="polite"><h2>{complete ? "Geometry lesson outcome demonstrated" : "Build your geometry lesson evidence"}</h2><p>Understanding and exploration remain separate from independent module mastery.</p>{storageError && <p role="alert">Geometry progress cannot be saved reliably. Existing core progress remains untouched; you can continue during this visit.</p>}</section><footer className="la-actions"><Link href={lesson === "transformations" ? "/math/linear-algebra/eigenvectors" : "/math/linear-algebra/mastery"}>{lesson === "transformations" ? "Next: Eigenvector intuition →" : "Attempt expanded module assessment →"}</Link><Link href="/math/linear-algebra/assessment">Original core assessment remains available</Link></footer></article></main>;
}
