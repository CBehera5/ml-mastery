import { createEmptyEvidence, evidenceStorageKey, markLessonState, recordObjectiveCompletion, recordAssessmentAttempt, awardMastery, type LearningEvidenceV1 } from "../../learn/foundation/evidence";
import { evaluateExercise, type LearnerResponse } from "../../learn/foundation/exercises";
import { MODULE_ID, questions, type LessonId } from "./content";
import blueprint from "./blueprint.v1.json";
export const BLUEPRINT=blueprint;
export const STORAGE_KEY=evidenceStorageKey("math.algebra");
export const DRAFT_KEY="ml-math-lab:assessment:math.algebra:v1";
export const ASSESSMENT_ID="algebra.functions.assessment.v1";
export const MASTERY_OBJECTIVE="algebra.functions.mastery";
export type Responses=Record<string,LearnerResponse>;
export type Variant="v01"|"v02";
export type Draft={version:1;variant:Variant;phase:"active"|"review"|"submitted";responses:Responses;attemptId?:string};
export const newDraft=(variant:Variant="v01"):Draft=>({version:1,variant,phase:"active",responses:{}});
export const assessmentQuestions=(variant:Variant)=>questions(variant==="v01"?1:2,"assessment");
export function parseDraft(raw:string|null,fallback:Variant="v01"):Draft{
 try{if(!raw)return newDraft(fallback);const d=JSON.parse(raw);if(d.version!==1||!["v01","v02"].includes(d.variant)||!["active","review","submitted"].includes(d.phase)||!d.responses||Array.isArray(d.responses)||typeof d.responses!=="object")return newDraft(fallback);
 const qs=assessmentQuestions(d.variant);for(const [key,r]of Object.entries(d.responses)){const q=qs.find(q=>q.key===key),response=r as LearnerResponse;if(!q||!response||response.kind!==q.exercise.kind)return newDraft(fallback);if(response.kind==="numerical"){if(!Number.isFinite(response.value)||Math.abs(response.value)>1e12)return newDraft(fallback)}else if(response.kind==="conceptual"){if(q.exercise.kind!=="conceptual"||!q.exercise.options.some(o=>o.id===response.optionId))return newDraft(fallback)}else return newDraft(fallback)}
 if(d.phase==="submitted"&&typeof d.attemptId!=="string")return newDraft(fallback);
 return{version:1,variant:d.variant,phase:d.phase==="review"?"active":d.phase,responses:d.responses,...(d.phase==="submitted"?{attemptId:d.attemptId}:{})};
 }catch{return newDraft(fallback)}
}
export function grade(variant:Variant,responses:Responses){const items=assessmentQuestions(variant).map(q=>({question:q,correct:responses[q.key]?evaluateExercise(q.exercise,responses[q.key],1).correct:false}));const score=items.filter(i=>i.correct).length,failedCritical=items.filter(i=>i.question.critical&&!i.correct);return{variant,items,score,maxScore:items.length,percent:100*score/items.length,failedCritical,passed:score*100>=BLUEPRINT.minimumPercent*items.length&&failedCritical.length===0}}
export function recordActivity(e:LearningEvidenceV1,id:LessonId,now:string){return finishLesson(recordObjectiveCompletion(e,`${MODULE_ID}.${id}.activity`,`${MODULE_ID}.${id}.experiment`,now),id,now)}
export function finishLesson(e:LearningEvidenceV1,id:LessonId,now:string){const ids=questions(0,"guided").filter(q=>q.lesson===id).map(q=>q.objectiveId),activity=`${MODULE_ID}.${id}.activity`,complete=[activity,...ids].every(key=>e.objectives[key]?.completed);return markLessonState(e,`${MODULE_ID}.${id}`,complete?"completed":"started",complete?[activity,...ids]:[],now)}
export function commit(e:LearningEvidenceV1,result:ReturnType<typeof grade>,id:string,now:string){if(e.assessmentAttempts.some(a=>a.id===id))return e;const passed=result.items.filter(i=>i.correct).map(i=>i.question.objectiveId);let next=recordAssessmentAttempt(e,{id,assessmentId:ASSESSMENT_ID,variantId:result.variant,score:result.score,maxScore:result.maxScore,objectiveIds:passed,submittedAt:now},Number.MAX_SAFE_INTEGER);const own=next.assessmentAttempts.filter(a=>a.assessmentId===ASSESSMENT_ID).slice(-20),retained=new Set(own.map(a=>a.id));next={...next,assessmentAttempts:next.assessmentAttempts.filter(a=>a.assessmentId!==ASSESSMENT_ID||retained.has(a.id))};next=markLessonState(next,`${MODULE_ID}.assessment`,"assessed",passed,now);for(const objective of passed)next=recordObjectiveCompletion(next,objective,id,now);if(result.passed)for(const objective of [...passed,MASTERY_OBJECTIVE])next=awardMastery(next,{id:`${id}:${objective}`,objectiveId:objective,sourceType:"assessment",sourceId:ASSESSMENT_ID,level:2,awardedAt:now});return next}
export const emptyEvidence=()=>createEmptyEvidence("algebra.functions.v1");
