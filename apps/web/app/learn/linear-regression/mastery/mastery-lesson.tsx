"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, parseLearningEvidence, validateLearningEvidence, type LearningEvidenceV1 } from "../../foundation/evidence";
import type { LearnerResponse } from "../../foundation/exercises";
import { AGGREGATE_OBJECTIVE, ASSESSMENT_ID, assessmentQuestions, BLUEPRINT, commitAssessment, gradeAssessment, MASTERY_DRAFT_KEY, MASTERY_LESSON_ID, newDraft, nextVariant, parseAssessmentDraft, responseComplete, type AssessmentDraft, type Question } from "./assessment";
const storageKey=evidenceStorageKey("linear-regression");
const time=()=>new Date().toISOString();
function responseLabel(question:Question,response:LearnerResponse|undefined){
 if(!response)return "Unanswered";
 if(response.kind==="numerical")return String(response.value);
 if(response.kind==="constrained-code")return question.exercise.kind==="constrained-code"?question.exercise.slots.map(slot=>`${slot.id}: ${response.slots[slot.id]??"unanswered"}`).join("; "):"Unanswered";
 return question.exercise.kind==="conceptual"||question.exercise.kind==="parameter-prediction"?question.exercise.options.find(option=>option.id===response.optionId)?.label??"Unanswered":"Unanswered";
}
export function MasteryLesson(){
 const [draft,setDraft]=useState<AssessmentDraft>(newDraft),[evidence,setEvidence]=useState<LearningEvidenceV1>(()=>createEmptyEvidence("linear-regression.v1"));
 const [loaded,setLoaded]=useState(false),[storageError,setStorageError]=useState(false),[confirmed,setConfirmed]=useState(false),[focusTarget,setFocusTarget]=useState("");
 const submitting=useRef(false);
 const questions=useMemo(()=>assessmentQuestions(draft.variant),[draft.variant]);
 const result=useMemo(()=>draft.phase==="submitted"?gradeAssessment(draft.variant,draft.responses):null,[draft]);
 const answered=questions.filter(question=>responseComplete(question,draft.responses[question.key])).length;
 const history=evidence.assessmentAttempts.filter(attempt=>attempt.assessmentId===ASSESSMENT_ID);
 useEffect(()=>{
  try{
   const stored=markLessonState(parseLearningEvidence(localStorage.getItem(storageKey),"linear-regression.v1"),MASTERY_LESSON_ID,"visited",[],time());
   const own=stored.assessmentAttempts.filter(attempt=>attempt.assessmentId===ASSESSMENT_ID);
   const fallback=own.length?nextVariant(own.at(-1)!.variantId):BLUEPRINT.variantIds[0];
   const restored=parseAssessmentDraft(localStorage.getItem(MASTERY_DRAFT_KEY),fallback);
   // A submitted display must correspond to an actual recorded attempt. Never award on hydration.
   if(restored.phase==="submitted"){
    const graded=gradeAssessment(restored.variant,restored.responses);
    const matching=stored.assessmentAttempts.some(attempt=>attempt.id===restored.attemptId&&attempt.assessmentId===ASSESSMENT_ID&&attempt.variantId===restored.variant&&attempt.score===graded.score&&attempt.maxScore===graded.maxScore&&JSON.stringify([...attempt.objectiveIds].sort())===JSON.stringify([...graded.passedObjectiveIds].sort()));
    if(!matching)restored.phase="active";
   }
   setEvidence(stored);setDraft(restored);
  }catch{setStorageError(true)}setLoaded(true);
 },[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(MASTERY_DRAFT_KEY,JSON.stringify(draft))}catch{setStorageError(true)}},[draft,loaded]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(storageKey,JSON.stringify(evidence))}catch{setStorageError(true)}},[evidence,loaded]);
 useEffect(()=>{if(focusTarget){document.getElementById(focusTarget)?.focus();setFocusTarget("")}},[focusTarget]);
 function answer(key:string,value:LearnerResponse|undefined){
  if(!loaded||draft.phase!=="active")return;
  setDraft(current=>{const responses={...current.responses};if(value)responses[key]=value;else delete responses[key];return {...current,responses}});
  setEvidence(current=>["started","completed","assessed"].includes(current.lessons[MASTERY_LESSON_ID]?.state??"")?current:markLessonState(current,MASTERY_LESSON_ID,"started",[],time()));
 }
 function review(){setConfirmed(false);setDraft(current=>({...current,phase:"review"}));setFocusTarget("mastery-review-title")}
 function edit(key?:string){setConfirmed(false);setDraft(current=>({...current,phase:"active"}));setFocusTarget(key?`mastery-${key}`:"mastery-instructions")}
 function submit(){
  if(!loaded||!confirmed||draft.phase!=="review"||submitting.current)return;
  submitting.current=true;
  const submittedAt=time(),attemptId=`${ASSESSMENT_ID}:${draft.variant}:${submittedAt}`;
  const graded=gradeAssessment(draft.variant,draft.responses);
  let current=evidence;
  try{const raw=localStorage.getItem(storageKey);if(raw){const candidate:unknown=JSON.parse(raw);if(validateLearningEvidence(candidate))current=parseLearningEvidence(raw,"linear-regression.v1")}}catch{setStorageError(true)}
  const next=commitAssessment(current,graded,attemptId,submittedAt);
  try{localStorage.setItem(storageKey,JSON.stringify(next))}catch{setStorageError(true)}
  setEvidence(next);setDraft(currentDraft=>({...currentDraft,phase:"submitted",attemptId,submittedAt}));setConfirmed(false);setFocusTarget("mastery-result-title");
 }
 function retry(){submitting.current=false;setConfirmed(false);setDraft(newDraft(nextVariant(draft.variant)));setFocusTarget("mastery-instructions")}
 return <div className="why-regression-lesson mastery-assessment">
  <header><p className="eyebrow">Independent assessment · version {BLUEPRINT.assessmentVersion}</p><h2 id="mastery-instructions" tabIndex={-1}>Demonstrate Linear Regression understanding</h2><p>Attempt this directly, regardless of lesson completion. Use scratch paper or a calculator if useful. There is no time limit and no arbitrary Python execution. Examples are fictional and use unfamiliar prediction domains.</p><ul><li>24 questions, four in each of six competencies. One point per question; code questions require all their slots. No negative marking or partial credit.</li><li>Mastery requires at least 80% overall (20 of 24 correct) and every one of the 10 marked critical objectives passed in the same attempt.</li><li>Numerical answers accept an absolute tolerance of 0.001. Symbols: x is input, y actual target, ŷ prediction, w weight, b bias, m observation count, Σ sum, L loss, dL/dw a weight derivative, and rate/α the learning rate.</li><li>Answers and explanations appear only after review and confirmed submission. Unanswered questions score zero. Review lets you return to any question.</li><li>A retake uses the next of 12 deterministic variants, changing values, signs and scenarios. The finite pool cycles after 12; this local assessment is educational, not a proctored certification.</li><li>The last 20 assessment summaries and one bounded current draft are stored locally. No names or free-form personal information are collected. Earlier valid mastery is preserved after a lower-scoring retake.</li></ul><p>Current variant: {draft.variant}. {evidence.objectives[AGGREGATE_OBJECTIVE]?.mastered?"A previous valid mastery result is recorded; this attempt is scored independently.":"Lesson or project completion does not award assessment mastery."}</p>{storageError&&<p role="alert">Local storage is unavailable. You can continue, but answers and results cannot be saved reliably.</p>}</header>
  {draft.phase==="active"&&<>
   <div className="mastery-progress" aria-live="polite"><label htmlFor="mastery-progress">Responses entered: {answered} of 24</label><progress id="mastery-progress" max={24} value={answered}/></div>
   <form onSubmit={event=>{event.preventDefault();review()}}>
    {BLUEPRINT.competencies.map(competency=><section key={competency.id} aria-labelledby={`mastery-competency-${competency.id}`}><h3 id={`mastery-competency-${competency.id}`}>{competency.title}</h3>{questions.filter(question=>question.competency===competency.id).map(question=>{
     const exercise=question.exercise,response=draft.responses[question.key];
     return <fieldset key={question.key} id={`mastery-${question.key}`} tabIndex={-1} disabled={!loaded}><legend>{question.key.toUpperCase()} · {question.statement}{question.critical?" · Critical objective":""}</legend><p className="mastery-question-text">{exercise.prompt}</p>
      {exercise.kind==="numerical"?<label>Numerical answer for {question.key.toUpperCase()}<input type="number" step="any" value={response?.kind==="numerical"?response.value:""} onChange={event=>{const value=event.target.value;answer(question.key,value.trim()!==""&&Number.isFinite(Number(value))?{kind:"numerical",value:Number(value)}:undefined)}}/></label>:exercise.kind==="constrained-code"?exercise.slots.map(slot=><label key={slot.id}>{question.key.toUpperCase()} — {slot.id}<select value={response?.kind==="constrained-code"?response.slots[slot.id]??"":""} onChange={event=>{const slots=response?.kind==="constrained-code"?{...response.slots}:{};if(event.target.value)slots[slot.id]=event.target.value;else delete slots[slot.id];answer(question.key,Object.keys(slots).length?{kind:"constrained-code",slots}:undefined)}}><option value="">Choose a code expression</option>{slot.allowedValues.map(value=><option key={value} value={value}>{value}</option>)}</select></label>):exercise.options.map(option=><label key={option.id}><input type="radio" name={question.key} checked={(response?.kind==="conceptual"||response?.kind==="parameter-prediction")&&response.optionId===option.id} onChange={()=>answer(question.key,{kind:exercise.kind,optionId:option.id})}/>{option.label}</label>)}
     </fieldset>
    })}</section>)}
    <button type="submit" className="button primary" disabled={!loaded}>Review responses before submitting</button>
   </form>
  </>}
  {draft.phase==="review"&&<section aria-labelledby="mastery-review-title"><h2 id="mastery-review-title" tabIndex={-1}>Review your responses</h2><p>{answered} of 24 questions have complete responses. {24-answered} unanswered or incomplete questions will score zero. No correctness feedback is shown yet.</p><ol>{questions.map(question=><li key={question.key}><strong>{question.key.toUpperCase()}: {question.statement}</strong><p>{responseLabel(question,draft.responses[question.key])}</p><button className="button secondary" onClick={()=>edit(question.key)}>Edit {question.key.toUpperCase()}</button></li>)}</ol><label className="mastery-confirm"><input type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)}/>I’m ready to submit these responses and view the assessment results.</label><div className="playback-row"><button className="button secondary" onClick={()=>edit()}>Return to the assessment</button><button className="button primary" disabled={!confirmed} onClick={submit}>Submit assessment</button></div></section>}
  {result&&<section aria-labelledby="mastery-result-title"><h2 id="mastery-result-title" tabIndex={-1}>{result.passed?"Mastery criteria met":"Review the objectives before another attempt"}</h2><p role="status">Score: {result.score}/{result.maxScore} ({result.percent.toFixed(1)}%). {result.passed?"Overall threshold and all critical objectives passed.":`${result.failedCritical.length} critical objective(s) not passed. A failed attempt awards no new mastery.`}</p>
   <div className="project-table-scroll" tabIndex={0} role="region" aria-label="Performance by competency — scroll horizontally if needed"><table><caption>Performance by competency</caption><thead><tr><th scope="col">Competency</th><th scope="col">Points</th><th scope="col">Percent</th></tr></thead><tbody>{result.competencies.map(area=><tr key={area.id}><th scope="row">{area.title}</th><td>{area.score}/{area.maxScore}</td><td>{(area.score/area.maxScore*100).toFixed(0)}%</td></tr>)}</tbody></table></div>
   <h3>Critical objectives</h3><ul>{result.items.filter(item=>item.question.critical).map(item=><li key={item.question.key}>{item.question.statement}: <strong>{item.correct?"Passed":"Not passed"}</strong></li>)}</ul>
   <h3>Feedback and next learning steps</h3><p>{result.passed?"Any missed noncritical objectives remain unmastered. Keep practising them, then try a later unfamiliar transfer problem. No next module is started automatically.":"Review each missed objective below, revisit its lesson, then attempt the next variant. Meeting the percentage alone cannot compensate for a missed critical objective."}</p>
   {result.items.filter(item=>!item.correct).map(item=><article key={item.question.key} className="mastery-remediation"><h4>{item.question.key.toUpperCase()} · {item.question.statement}</h4><p>Your response: {responseLabel(item.question,draft.responses[item.question.key])}</p><p>{item.feedback}</p><a href={item.question.remediationRoute}>Review the relevant lesson →</a></article>)}
   <p>Submission records assessment evidence separately from mastery. Previously earned evidence is never revoked by this result. {storageError?"Local saving failed; do not rely on this result persisting.":"This result and objective evidence are saved locally."}</p><button className="button primary" onClick={retry}>Start next variant</button>
  </section>}
  <section aria-labelledby="mastery-history-title"><h2 id="mastery-history-title">Recent assessment attempts</h2>{history.length?<div className="project-table-scroll" tabIndex={0} role="region" aria-label="Last 20 attempts for this assessment — scroll horizontally if needed"><table><caption>Last 20 attempts for this assessment</caption><thead><tr>{["Variant","Submitted (UTC)","Score","Critical objectives","Outcome"].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{[...history].reverse().map(attempt=>{const failed=BLUEPRINT.questions.filter(question=>question.critical&&!attempt.objectiveIds.includes(question.objectiveId)),passed=attempt.score*100>=BLUEPRINT.minimumPercent*attempt.maxScore&&failed.length===0;return <tr key={attempt.id}><th scope="row">{attempt.variantId}</th><td>{attempt.submittedAt}</td><td>{attempt.score}/{attempt.maxScore}</td><td>{10-failed.length}/10 passed</td><td>{passed?"Mastery criteria met":"More learning recommended"}</td></tr>})}</tbody></table></div>:<p>No submitted attempts yet. Opening or answering questions does not submit an assessment.</p>}</section>
 </div>;
}
