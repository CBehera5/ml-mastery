"use client";
import { useEffect, useState, type ReactNode } from "react";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, parseLearningEvidence, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../foundation/evidence";
import { evaluateExercise, type ExerciseResult } from "../../foundation/exercises";
import { ConceptPrimer } from "../components/concept-primer";
import { INSTRUCTIONS, INSTRUCTIONAL_OUTCOMES, instructionalObjectiveIds, type InstructionalId } from "./instructional-content";
const key=evidenceStorageKey("linear-regression");
const now=()=>new Date().toISOString();

export function InstructionalLesson({id,children}:{id:InstructionalId;children:ReactNode}) {
 const content=INSTRUCTIONS[id],lessonId=`linear-regression.${id}`,experimentId=`${lessonId}.experiment`;
 const [evidence,setEvidence]=useState<LearningEvidenceV1>(()=>createEmptyEvidence("linear-regression.v1"));
 const [loaded,setLoaded]=useState(false),[storageError,setStorageError]=useState(false);
 const [answers,setAnswers]=useState<Record<string,string>>({}),[results,setResults]=useState<Record<string,ExerciseResult>>({});
 useEffect(()=>{try{setEvidence(markLessonState(parseLearningEvidence(localStorage.getItem(key),"linear-regression.v1"),lessonId,"visited",[],now()));}catch{setStorageError(true)}setLoaded(true)},[lessonId]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(key,JSON.stringify(evidence))}catch{setStorageError(true)}},[evidence,loaded]);
 const explored=Boolean(evidence.objectives[experimentId]?.completed);
 const complete=evidence.lessons[lessonId]?.state==="completed"||evidence.lessons[lessonId]?.state==="assessed";
 function updateEvidence(current:LearningEvidenceV1) {
  const done=Boolean(current.objectives[experimentId]?.completed)&&content.checks.every(check=>check.objectiveIds.every(objective=>current.objectives[objective]?.completed));
  let next=markLessonState(current,lessonId,done?"completed":"started",done?instructionalObjectiveIds(id):[],now());
  if(done)next=recordObjectiveCompletion(next,`${lessonId}.objective`,`${lessonId}.guided-lab`,now());
  return next;
 }
 function explore(){if(!loaded||explored)return;setEvidence(current=>updateEvidence(recordObjectiveCompletion(current,experimentId,`${lessonId}.control-change`,now())))}
 function checkAnswer(index:number){
  const exercise=content.checks[index],answer=answers[exercise.id];
  if(!loaded||answer===undefined||answer.trim()==="")return;
  const result=evaluateExercise(exercise,exercise.kind==="numerical"?{kind:"numerical",value:Number(answer)}:{kind:"conceptual",optionId:answer},1);
  setResults(previous=>({...previous,[exercise.id]:result}));
  setEvidence(current=>{let next=current;if(result.correct)for(const objective of exercise.objectiveIds)next=recordObjectiveCompletion(next,objective,exercise.id,now());return updateEvidence(next)});
 }
 return <div className="why-regression-lesson">
  <section className="why-objectives"><p className="eyebrow">Learning objectives</p><h2>{content.title}</h2><ul>{INSTRUCTIONAL_OUTCOMES[id].map(outcome=><li key={outcome}>{outcome}</li>)}</ul></section>
  <section className="why-story"><div><h2>Problem and motivation</h2><p>{content.motivation}</p><h3>Build the intuition</h3><p>{content.intuition}</p></div></section>
  <ConceptPrimer title="Recall the concepts you will use" reminder="Connect these familiar ideas to this lesson before using the notation. Follow a review link if the prerequisite feels unfamiliar." concepts={content.concepts}/>
  <section className="why-suitability"><h2>Mathematical reasoning</h2>{content.reasoning.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<h3>Mathematical symbol key</h3><dl>{content.symbols.map(([symbol,meaning])=><div key={symbol}><dt><code>{symbol}</code></dt><dd>{meaning}</dd></div>)}</dl>{id==="multiple-features"&&<p><a href="/math/matrices-multiplication">Recall matrix shapes and multiplication →</a></p>}</section>
  <section><h2>Guided experiment</h2><p>{content.experiment}</p><p>{explored?"Experiment interaction recorded. Use the checks below to explain what happened.":"Change a lab parameter or inspect another training state or diagnostic scenario, then answer the checks."}</p>
   <div onChangeCapture={event=>{const element=event.target;if(element instanceof HTMLInputElement&&(element.type==="range"||element.type==="number")&&element.value!==""&&Number.isFinite(Number(element.value)))explore()}} onClickCapture={event=>{const button=(event.target as HTMLElement).closest("button");if(button&&!button.disabled&&(button.textContent==="Step"||button.getAttribute("aria-pressed")==="false"))explore()}}>{children}</div>
  </section>
  <section className="why-suitability"><h2>Real-world application</h2><p>{content.application}</p></section>
  <section className="instructional-checks"><h2>Guided exercises and misconception checks</h2><p>Explain the consequence of a change or choose a defensible action. Each check can be retried after the worked feedback. Successful checks remain recorded when you return.</p>{content.checks.map((exercise,index)=><fieldset key={exercise.id}><legend>{index+1}. {exercise.prompt}</legend>{exercise.kind==="numerical"?<label>Numerical answer<input type="number" step="any" value={answers[exercise.id]??""} onChange={event=>{setAnswers(previous=>({...previous,[exercise.id]:event.target.value}));setResults(previous=>{const next={...previous};delete next[exercise.id];return next})}}/></label>:exercise.options.map(option=><label key={option.id}><input type="radio" name={exercise.id} checked={answers[exercise.id]===option.id} onChange={()=>{setAnswers(previous=>({...previous,[exercise.id]:option.id}));setResults(previous=>{const next={...previous};delete next[exercise.id];return next})}}/>{option.label}</label>)}<button className="button secondary" disabled={!loaded||!answers[exercise.id]?.trim()} onClick={()=>checkAnswer(index)}>Check answer {index+1}</button>{results[exercise.id]&&<p role="status" className={`validation ${results[exercise.id].correct?"success":"failure"}`}>{results[exercise.id].feedback}</p>}{exercise.objectiveIds.every(objective=>evidence.objectives[objective]?.completed)&&<p>Understanding check recorded.</p>}</fieldset>)}</section>
  <section className={`why-summary ${complete?"complete":""}`} aria-live="polite"><h2>{complete?"Lesson outcome demonstrated":"Build the evidence"}</h2><p>{content.checks.filter(check=>check.objectiveIds.every(objective=>evidence.objectives[objective]?.completed)).length} of {content.checks.length} checks complete. {explored?"Experiment recorded.":"Experiment interaction still required."}</p><p>Completion records these objectives locally; it does not award mastery. Independent mastery will require unfamiliar examples and critical-objective evidence in the later assessment.</p>{storageError&&<p role="alert">Browser storage is unavailable. Progress works in this visit but cannot be saved reliably.</p>}</section>
 </div>;
}
