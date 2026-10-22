"use client";
import Link from "next/link";
import {BookOpening,BookExplanation} from "../teaching/book-lesson";
import {useState} from "react";
import {EquationReader} from "../../experience/equation-literacy/equation-reader";
import {evaluateExercise,type ExerciseResult,type LearnerResponse} from "../../learn/foundation/exercises";
import {recordObjectiveCompletion} from "../../learn/foundation/evidence";
import {LESSONS,LESSON_IDS,MODULE_ID,href,questions,OBJECTIVE_LABELS,type LessonId} from "./content";
import {JOURNEY} from "./journey";
import {GraphStories} from "../teaching/algebra-stories";
import {VariablesDiscovery} from "./variables-discovery";
import {AlgebraShell} from "./shell";
import {LessonPlayground,LessonCode,extraFor} from "../extras/registry";
import {AlgebraExperiment} from "./experiment";
import {useAlgebraEvidence} from "./use-evidence";
import {finishLesson,recordActivity} from "./model";
import styles from "./variables.module.css";
export function AlgebraLesson({id}:{id:LessonId}){const c=LESSONS[id],j=JOURNEY[id],qs=questions(0,"guided").filter(q=>q.lesson===id),{evidence,setEvidence,loaded,storageError}=useAlgebraEvidence(),[answers,setAnswers]=useState<Record<string,string>>({}),[results,setResults]=useState<Record<string,ExerciseResult>>({});const activity=!!evidence.objectives[`${MODULE_ID}.${id}.activity`]?.completed,understood=qs.filter(q=>evidence.objectives[q.objectiveId]?.completed).length,complete=activity&&understood===qs.length,index=LESSON_IDS.indexOf(id);
 function check(i:number){const q=qs[i],text=answers[q.key];if(!loaded||!text?.trim())return;const response:LearnerResponse=q.exercise.kind==="numerical"?{kind:"numerical",value:Number(text)}:{kind:"conceptual",optionId:text};const result=evaluateExercise(q.exercise,response,1);setResults(old=>({...old,[q.key]:result}));if(result.correct)setEvidence(old=>finishLesson(recordObjectiveCompletion(old,q.objectiveId,q.exercise.id,new Date().toISOString()),id,new Date().toISOString()))}
 function answer(key:string,text:string){setAnswers(old=>({...old,[key]:text}));setResults(old=>{const next={...old};delete next[key];return next})}
 return <AlgebraShell id={id}>
  <p className="eyebrow">Lesson {index+1} of 6</p><h2>{c.title}</h2>
  <nav className={styles.journeySteps} aria-label="In this Algebra lesson"><a href="#lesson-question">The question</a><a href="#lesson-explore">Explore</a><a href="#lesson-understand">Understand</a><a href="#lesson-apply">Apply</a><a href="#lesson-checks">Check</a><a href="#lesson-next">Next step</a></nav>
  <section id="lesson-question" tabIndex={-1}>
    <p className={styles.connection}>{j.connection}</p><BookOpening module="algebra" lesson={id}/>
    <details><summary>Need a quick refresher?</summary><p>{c.recall}</p>{index>0&&<Link href={href(LESSON_IDS[index-1])}>Review {LESSONS[LESSON_IDS[index-1]].title} →</Link>}</details>
  </section>
  <section id="lesson-explore" tabIndex={-1}>
    <h3>Predict, then explore</h3><p className={styles.challenge}><strong>Before changing anything:</strong> {j.challenge}</p><p>{j.controls}</p>
    {id==="variables"&&<details><summary>Try a quick prediction</summary><VariablesDiscovery/></details>}
    <div onChange={()=>{if(loaded&&!activity)setEvidence(old=>recordActivity(old,id,new Date().toISOString()))}} onClick={event=>{if((event.target as HTMLElement).closest("button")&&loaded&&!activity)setEvidence(old=>recordActivity(old,id,new Date().toISOString()))}}><LessonPlayground module="algebra" slug={id}/></div>
    <details className="algebra-more" open={!extraFor("algebra",id)}><summary>{extraFor("algebra",id)?.moreLabel??"Explorer"}</summary><AlgebraExperiment key={id} id={id} onExplore={()=>{if(loaded&&!activity)setEvidence(old=>recordActivity(old,id,new Date().toISOString()))}}/></details>
    <p className={styles.note}>In your own words: what changed, and why did the output change with it?</p>
  </section>
  <LessonCode module="algebra" slug={id}/>
  <section id="lesson-understand" tabIndex={-1}>
    <BookExplanation module="algebra" lesson={id}/><details><summary>Relate the playground’s rule to this reading</summary>{j.reasoning.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<p>{j.notation}</p></details>
    
    {id==="graphs"&&<><p>A line is one family of relationships. Quadratics show changing rates and turning points, exponentials repeated proportional change, and logarithms the inverse growth question.</p><details><summary>Explore other shapes and choose a useful chart</summary><GraphStories/></details></>}
    <details><summary>Symbol and unit reference</summary><dl>{c.symbols.map(([symbol,meaning])=><div key={symbol}><dt><code>{symbol}</code></dt><dd>{meaning}</dd></div>)}</dl></details>
    <details><summary>{id==="variables"?"Separate practice example: a different pricing rule":"Another worked example"}</summary><p>{c.worked}</p></details>
    <aside className="algebra-recall"><h4>Watch for this misconception</h4><p>{c.misconception}</p></aside>
  </section>
  <section id="lesson-apply" tabIndex={-1}>
    <h3>Connect the relationship to Python</h3><pre><code>{j.code}</code></pre><p>{j.codeMeaning}</p>
    <h4>Why this matters for ML</h4><p>{c.application}</p>
    <h3>Try a different situation</h3><p>{j.transfer}</p><details><summary>Compare your reasoning</summary><p>{j.reference}</p><p>This reflection is unscored and is not saved. Compare explanations, not just matching words.</p></details>
  </section>
  <section id="equation-literacy" tabIndex={-1}><h3>Read a larger expression when you’re ready</h3><p>The five-level Equation X-Ray connects these ideas to multiple inputs, curves, nested functions and indexed sums. Choose any level; advanced solving is not required.</p><EquationReader key={id} module="algebra" progression/></section>
  
<section id="lesson-checks" tabIndex={-1} className="algebra-checks"><h3>Understanding checks</h3><p>Use the worked reasoning. Correct checks record understanding evidence; experiment interaction records activity only. Numerical tolerance is 0.001.</p>{qs.map((q,i)=><fieldset key={q.key}><legend>{i+1}. {q.exercise.prompt}</legend>{q.exercise.kind==="numerical"?<label>Answer for check {i+1}<input type="number" step="any" value={answers[q.key]??""} onChange={e=>answer(q.key,e.target.value)}/></label>:q.exercise.options.map(o=><label key={o.id}><input type="radio" name={q.key} checked={answers[q.key]===o.id} onChange={()=>answer(q.key,o.id)}/>{o.label}</label>)}<button className="button secondary" disabled={!loaded||!answers[q.key]?.trim()} onClick={()=>check(i)}>Check understanding {i+1}</button>{results[q.key]&&<p role="status">{results[q.key].feedback}</p>}{evidence.objectives[q.objectiveId]?.completed&&<p>Understanding evidence recorded for this objective.</p>}</fieldset>)}</section><section id="lesson-next" tabIndex={-1} className={styles.recap}><h3>Carry this idea forward</h3><p><strong>{j.takeaway}</strong></p><p>{j.next}</p><details><summary>What the existing checks cover</summary><ul>{qs.map(q=><li key={q.key}>{OBJECTIVE_LABELS[q.key]}</li>)}</ul></details></section><section className="algebra-outcome" aria-live="polite"><h3>{complete?"Lesson outcome demonstrated":"Build your lesson evidence"}</h3><p>{activity?"Activity recorded":"Activity not yet recorded"}. {understood} of 4 understanding checks recorded. Guided completion does not award module mastery.</p>{storageError&&<p role="alert">Browser storage is unavailable. Progress works in this visit but cannot be saved reliably.</p>}</section><footer className="algebra-footer"><Link href={index>0?href(LESSON_IDS[index-1]):"/math/algebra-functions"}>← {index>0?LESSONS[LESSON_IDS[index-1]].title:"Module overview"}</Link><Link href={index<5?href(LESSON_IDS[index+1]):href("assessment")}>{index<5?LESSONS[LESSON_IDS[index+1]].title:"Independent Algebra assessment"} →</Link></footer></AlgebraShell>}
