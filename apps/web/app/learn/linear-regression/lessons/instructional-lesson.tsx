"use client";
import { useEffect, useState, type ReactNode } from "react";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, parseLearningEvidence, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../foundation/evidence";
import { evaluateExercise, type ExerciseResult } from "../../foundation/exercises";
import { ConceptPrimer } from "../components/concept-primer";
import { INSTRUCTIONS, INSTRUCTIONAL_OUTCOMES, instructionalObjectiveIds, type InstructionalId } from "./instructional-content";
const key=evidenceStorageKey("linear-regression");
const now=()=>new Date().toISOString();

export function InstructionalLesson({id,children}:{id:InstructionalId;children:ReactNode|((explore:()=>void, reveal:(value:boolean)=>void, explanation:ReactNode)=>ReactNode)}) {
 const [discovered,setDiscovered]=useState(false),[transferAnswer,setTransferAnswer]=useState(""),[transferRevealed,setTransferRevealed]=useState(false);
 const showExplanation=id!=="equation"||discovered;
 useEffect(()=>{if(discovered)document.getElementById("equation-reasoning")?.focus()},[discovered]);
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
 const lessonContent=<>
  {id!=="equation"&&<>
  <section className="why-suitability"><h2 id="lesson-mathematics">Mathematical reasoning</h2>{content.reasoning.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<h3>Mathematical symbol key</h3><dl>{content.symbols.map(([symbol,meaning])=><div key={symbol}><dt><code>{symbol}</code></dt><dd>{meaning}</dd></div>)}</dl>{id==="multiple-features"&&<p><a href="/math/matrices-multiplication">Recall matrix shapes and multiplication →</a></p>}</section>
  </>}
  {id==="equation"&&showExplanation&&<>
  <ConceptPrimer title="Recall the concepts you will use" reminder="Connect these familiar ideas to this lesson before using the notation. Follow a review link if the prerequisite feels unfamiliar." concepts={content.concepts}/>
  <section className="why-suitability"><h2 id="equation-reasoning" tabIndex={-1}>Mathematical reasoning</h2><h3>From the estimating rule to the equation</h3><p>We have described the rule in words. Now give each part a short name:</p><div className="equation-readout"><strong>ŷ = w × x + b</strong><span>Predicted price = coefficient × floor area + baseline</span><b>245 = 42 × 2.5 + 140</b></div><p><strong>x</strong> is the known floor area: 2.5 thousand ft². <strong>w</strong> is the coefficient: 42 $k per thousand ft². Multiplying them gives the area contribution, 105 $k. <strong>b</strong> is the baseline: 140 $k, added once. <strong>ŷ</strong> (read “y-hat”) is the predicted price: 245 $k.</p><p>You may see the rule written as <code>y = wx + b</code>. Here we use the hat to distinguish an estimate from the recorded value: <strong>y</strong> is the actual sale price, 246 $k. Writing <code>wx</code> is shorthand for multiplication, <code>w × x</code>; it is not a single variable. For this one-input example we use lowercase <code>x</code>.</p>{content.reasoning.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<h3>Mathematical symbol key</h3><dl>{content.symbols.map(([symbol,meaning])=><div key={symbol}><dt><code>{symbol}</code></dt><dd>{meaning}</dd></div>)}</dl></section>
  <section><h2 id="lesson-python">The same rule in Python</h2><pre className="python-code" style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}><code>{`area_thousand_sqft = 2.5
coefficient_k_per_thousand_sqft = 42.0
baseline_k = 140.0
estimate_k = coefficient_k_per_thousand_sqft * area_thousand_sqft + baseline_k
recorded_price_k = 246.0
residual_k = estimate_k - recorded_price_k`}</code></pre><p>Assignment (=) names a value. Multiplication (*) creates the area contribution; addition (+) includes the baseline once. Subtraction (-) compares the estimate with the recorded price afterward. These supplied settings are not learned by this code. Putting baseline inside coefficient * (area + baseline) mixes units and multiplies the baseline incorrectly.</p></section>
  </>}
  {showExplanation&&<>
  <section className="why-suitability"><h2>Real-world application</h2><p>{content.application}</p></section>
  <section id="lesson-practice" className="instructional-checks"><h2>Guided exercises and misconception checks</h2>{id==="equation"&&<p>Separate additional practice: the following practice examples use different numbers from the housing experiment, including x = 3, w = 40, b = 100. Start afresh with these values.</p>}<p>Explain the consequence of a change or choose a defensible action. Each check can be retried after the worked feedback. Successful checks remain recorded when you return.</p>{content.checks.map((exercise,index)=><fieldset key={exercise.id} style={id==="equation"?{minWidth:0}:undefined}><legend>{index+1}. {exercise.prompt}</legend>{exercise.kind==="numerical"?<label>Numerical answer<input type="number" step="any" value={answers[exercise.id]??""} onChange={event=>{setAnswers(previous=>({...previous,[exercise.id]:event.target.value}));setResults(previous=>{const next={...previous};delete next[exercise.id];return next})}}/></label>:exercise.options.map(option=><label key={option.id}><input type="radio" name={exercise.id} checked={answers[exercise.id]===option.id} onChange={()=>{setAnswers(previous=>({...previous,[exercise.id]:option.id}));setResults(previous=>{const next={...previous};delete next[exercise.id];return next})}}/>{option.label}</label>)}<button className="button secondary" disabled={!loaded||!answers[exercise.id]?.trim()} onClick={()=>checkAnswer(index)}>Check answer {index+1}</button>{results[exercise.id]&&<p role="status" className={`validation ${results[exercise.id].correct?"success":"failure"}`}>{results[exercise.id].feedback}</p>}{exercise.objectiveIds.every(objective=>evidence.objectives[objective]?.completed)&&<p>Understanding check recorded.</p>}</fieldset>)}</section>
  {id==="equation"&&<section><h2>Try a new context: energy use (unscored)</h2><p>Unscored self-check; nothing here changes saved completion or mastery. A workshop rule uses 3 kWh/m² across 12 m² plus a fixed 8 kWh. Only the coefficient changes to 2.5 kWh/m². Explain the direction, amount and why; identify what stays fixed. What do you know about actual measured consumption?</p><label>Your energy explanation<textarea style={{maxWidth:"100%"}} value={transferAnswer} onChange={event=>{setTransferAnswer(event.target.value);setTransferRevealed(false)}}/></label><button className="button secondary" onClick={()=>setTransferRevealed(true)}>Reveal energy comparison</button>{transferRevealed&&<p role="status">The estimate falls from 44 to 38 kWh: 0.5 less per m² across 12 m² means 6 kWh less. Baseline stays 8; actual consumption is unknown. A baseline decrease of 6 would shift every estimate equally. Compare your mechanism and units, not just the number. This self-check does not certify independent mastery.</p>}</section>}
  </>}
 </>;
 return <div className="why-regression-lesson" style={id==="equation"?{minWidth:0,overflowWrap:"anywhere"}:undefined}>

  <section id="lesson-context" className="why-story"><div><h2>Problem and motivation</h2><p>{content.motivation}</p><h3>Build the intuition</h3><p>{content.intuition}</p></div></section>
  <details className="why-objectives"><summary>What you will learn</summary><h2>{content.title}</h2><ul>{INSTRUCTIONAL_OUTCOMES[id].map(outcome=><li key={outcome}>{outcome}</li>)}</ul></details>
  {id!=="equation"&&<details><summary>Need a quick concept reminder?</summary><ConceptPrimer title="Recall the concepts you will use" reminder="Connect these familiar ideas to this lesson before using the notation. Follow a review link if the prerequisite feels unfamiliar." concepts={content.concepts}/></details>}
  <nav aria-label="In this lesson" className="lesson-section-nav"><a href="#lesson-context">The problem</a><a href="#lesson-experiment">Experiment</a>{showExplanation&&<><a href={id==="equation"?"#equation-reasoning":"#lesson-mathematics"}>Mathematics</a>{id==="equation"&&<a href="#lesson-python">Python</a>}<a href="#lesson-practice">Practice</a></>}</nav>
  <section style={id==="equation"?{minWidth:0}:undefined}><h2 id="lesson-experiment">Guided experiment</h2><p>{content.experiment}</p><p>{explored?"Saved progress: you have explored this before. You can replay it below.":(id==="equation"?"Choose a direction, including Not sure, then try the controlled change. Review is available without recording an experiment.":"Change a lab parameter or inspect another training state or diagnostic scenario, then answer the checks.")}</p>
   <div onChangeCapture={event=>{if(id==="equation")return;const element=event.target;if(element instanceof HTMLInputElement&&(element.type==="range"||element.type==="number")&&element.value!==""&&Number.isFinite(Number(element.value)))explore()}} onClickCapture={event=>{if(id==="equation")return;const button=(event.target as HTMLElement).closest("button");if(button&&!button.disabled&&(button.textContent==="Step"||button.getAttribute("aria-pressed")==="false"))explore()}}>{typeof children==="function"?children(explore,value=>{setDiscovered(value);if(!value){setTransferAnswer("");setTransferRevealed(false)}},lessonContent):children}</div>
  </section>
  {id!=="equation"&&lessonContent}
  <section className={`why-summary ${complete?"complete":""}`} aria-live="polite"><h2>{complete?(id==="equation"?"Existing lesson checks complete":"Lesson outcome demonstrated"):"Build the evidence"}</h2><p>{content.checks.filter(check=>check.objectiveIds.every(objective=>evidence.objectives[objective]?.completed)).length} of {content.checks.length} checks complete. {explored?"Experiment recorded.":"Experiment interaction still required."}</p><p>Completion records these objectives locally; it does not award mastery. Independent mastery will require unfamiliar examples and critical-objective evidence in the later assessment.</p>{storageError&&<p role="alert">Browser storage is unavailable. Progress works in this visit but cannot be saved reliably.</p>}</section>
 </div>;
}
