export type DerivativeModuleKind = "learn"|"practice"|"lab"|"debug"|"assessment";
export type DerivativeModule = { id:string; title:string; kind:DerivativeModuleKind; minutes:number; outcome:string };

export const DERIVATIVE_MODULES: DerivativeModule[] = [
  {id:"why",title:"Why derivatives exist",kind:"learn",minutes:12,outcome:"Distinguish average from instantaneous change and connect local rate to ML loss."},
  {id:"secants",title:"Secants & tangent lines",kind:"learn",minutes:10,outcome:"Connect average change to instantaneous change."},
  {id:"rules",title:"Derivative rules",kind:"learn",minutes:18,outcome:"Choose and explain common derivative rules."},
  {id:"practice",title:"Guided practice",kind:"practice",minutes:12,outcome:"Interpret, calculate, and apply derivatives."},
  {id:"lab",title:"Interactive Derivative Lab",kind:"lab",minutes:10,outcome:"Compare graphical, analytical, and numerical slopes."},
  {id:"debug",title:"Debugging derivatives in ML",kind:"debug",minutes:10,outcome:"Find and repair a chain-rule error."},
  {id:"mastery",title:"Mastery assessment",kind:"assessment",minutes:12,outcome:"Transfer understanding to unfamiliar examples."},
];

export const TOPIC_PROGRESS_KEY="ml-math-lab:topic:derivatives:v1";
export type TopicProgress={completed:string[];mastered:boolean;bestScore:number};
export const EMPTY_PROGRESS:TopicProgress={completed:[],mastered:false,bestScore:0};
export function loadTopicProgress(raw:string|null):TopicProgress {
  if(raw===null)return EMPTY_PROGRESS;
  const value:unknown=JSON.parse(raw);
  if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Unsupported pilot progress");
  const record=value as Record<string,unknown>;
  if(Object.keys(record).some(key=>!["completed","mastered","bestScore"].includes(key))||!Array.isArray(record.completed)||!record.completed.every(id=>typeof id==="string"&&DERIVATIVE_MODULES.some(module=>module.id===id))||typeof record.mastered!=="boolean"||typeof record.bestScore!=="number"||!Number.isInteger(record.bestScore)||record.bestScore<0||record.bestScore>5)throw new Error("Unsupported pilot progress");
  return parseTopicProgress(raw);
}

export function parseTopicProgress(raw:string|null):TopicProgress {
  if(!raw)return EMPTY_PROGRESS;
  try{const value=JSON.parse(raw);return {completed:Array.isArray(value.completed)?value.completed.filter((id:unknown)=>typeof id==="string"):[],mastered:value.mastered===true,bestScore:Number.isFinite(value.bestScore)?value.bestScore:0};}catch{return EMPTY_PROGRESS;}
}

export type AssessmentAnswers={concept:string;calculation:string;graph:string;application:string;debug:string};
export function scoreAssessment(answers:AssessmentAnswers,variant=0){
  const expected=variant%2===0?{concept:"sensitivity",calculation:"6",graph:"negative",application:"increase",debug:"6"}:{concept:"sensitivity",calculation:"20",graph:"positive",application:"decrease",debug:"6"};
  const fields=(Object.keys(expected) as (keyof AssessmentAnswers)[]);
  const correct=fields.filter(key=>answers[key].trim().toLowerCase()===expected[key]);
  return {score:correct.length,total:fields.length,mastered:correct.length>=4,correct};
}

export function debugLossDerivative(w:number,x=2,y=6){return 2*(w*x-y)*x;}
export function buggyLossDerivative(w:number,x=2,y=6){return 2*(w*x-y);}
