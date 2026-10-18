import {createEmptyEvidence,markLessonState,recordObjectiveCompletion,validateLearningEvidence,type LearningEvidenceV1} from "../../learn/foundation/evidence";
import {INTEGRATION_VERSION,transferChecks} from "./content";
export const emptyIntegration=()=>createEmptyEvidence(INTEGRATION_VERSION);
export function loadIntegration(raw:string|null) {
  if(raw===null)return emptyIntegration();
  const value:unknown=JSON.parse(raw);
  if(!validateLearningEvidence(value)||value.curriculumVersion!==INTEGRATION_VERSION)throw new Error("Unsupported integration evidence");
  return value;
}
export function recordTransfer(evidence:LearningEvidenceV1,key:string,time:string) {
  const objectiveId=key==="reflection"?"math.integration.reflection":transferChecks(0).find(check=>check.key===key)?.exercise.objectiveIds[0];
  if(!objectiveId)throw new Error("Unknown transfer objective");
  const next=recordObjectiveCompletion(evidence,objectiveId,`math.integration.practice.${key}`,time);
  const ids=[...transferChecks(0).map(check=>check.exercise.objectiveIds[0]),"math.integration.reflection"];
  return markLessonState(next,"math.integration.transfer",ids.every(id=>next.objectives[id]?.completed)?"completed":"started",ids.filter(id=>next.objectives[id]?.completed),time);
}
