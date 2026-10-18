import { describe, expect, it } from "vitest";
import { concepts, MASTERY, MODULE, questions, VERSION } from "./content";
import { commit, completeLesson, emptyEvidence, grade, loadEvidence, type Responses } from "./model";
import { recordObjectiveCompletion } from "../../learn/foundation/evidence";
import { validateExercise } from "../../learn/foundation/exercises";
const time="2026-10-15T12:00:00.000Z";
function answers(variant:0|1) { return Object.fromEntries(questions(variant).map(({concept,exercise})=>[concept.key,exercise.kind==="numerical"?{kind:"numerical",value:exercise.expected}:{kind:"conceptual",optionId:exercise.expectedOptionId}])) as Responses; }
describe("Statistics exercise and evidence contracts",()=>{
  it("has 28 distinct objectives, 10 critical gates and 2 valid deterministic variants",()=>{
    expect(concepts).toHaveLength(28);expect(concepts.filter(item=>item.critical)).toHaveLength(10);
    const ids=([0,1] as const).flatMap(variant=>questions(variant).map(({exercise})=>{expect(validateExercise(exercise)).toEqual([]);return exercise.id;}));
    expect(new Set(ids).size).toBe(56);
    expect(grade(0,answers(0)).passed).toBe(true);expect(grade(1,answers(1)).passed).toBe(true);
  });
  it("gates high scores on all critical objectives and the 80% threshold",()=>{
    for(const concept of concepts.filter(item=>item.critical)){const response=answers(0);delete response[concept.key];const result=grade(0,response);expect(result.score).toBe(27);expect(result.passed).toBe(false);}
    const response=answers(0), optional=concepts.filter(item=>!item.critical);
    optional.slice(0,5).forEach(item=>delete response[item.key]);expect(grade(0,response).score).toBe(23);expect(grade(0,response).passed).toBe(true);
    delete response[optional[5].key];expect(grade(0,response).score).toBe(22);expect(grade(0,response).passed).toBe(false);
    expect(grade(0,{}).passed).toBe(false);
  });
  it("does not award mastery for practice or lesson completion",()=>{
    let evidence=emptyEvidence();for(const item of concepts.filter(item=>item.lesson==="data"))evidence=recordObjectiveCompletion(evidence,`${MODULE}.${item.key}`,"practice",time);
    expect(completeLesson(evidence,"data",time).lessons[`${MODULE}.data`].state).toBe("started");
    evidence=recordObjectiveCompletion(evidence,`${MODULE}.data.activity`,"activity",time);
    evidence=completeLesson(evidence,"data",time);expect(evidence.lessons[`${MODULE}.data`].state).toBe("completed");expect(evidence.masteryEvidence).toHaveLength(0);
  });
  it("persists failure, retry, retained mastery and duplicate-safe submission",()=>{
    let evidence=commit(emptyEvidence(),grade(0,{}),"fail",time);expect(evidence.objectives[MASTERY]).toBeUndefined();
    evidence=commit(evidence,grade(1,answers(1)),"pass",time);expect(evidence.objectives[MASTERY].mastered).toBe(true);
    expect(commit(evidence,grade(1,answers(1)),"pass",time)).toBe(evidence);
    evidence=commit(evidence,grade(0,{}),"later-fail",time);expect(evidence.objectives[MASTERY].mastered).toBe(true);
    expect(loadEvidence(JSON.stringify(evidence))).toEqual(evidence);
  });
  it("keeps unrelated evidence, bounds only this history and rejects future/corrupt storage",()=>{
    let evidence=emptyEvidence();evidence.assessmentAttempts.push({id:"unrelated",assessmentId:"other",variantId:"a",score:1,maxScore:1,objectiveIds:[],submittedAt:time});
    for(let index=0;index<25;index++)evidence=commit(evidence,grade(0,{}),`fail-${index}`,time);
    expect(evidence.assessmentAttempts).toHaveLength(21);expect(evidence.assessmentAttempts[0].id).toBe("unrelated");
    expect(()=>loadEvidence("{" )).toThrow();expect(()=>loadEvidence(JSON.stringify({...evidence,curriculumVersion:"future"}))).toThrow();
    expect(()=>loadEvidence(JSON.stringify({...evidence,schemaVersion:"2.0.0"}))).toThrow();expect(loadEvidence(null).curriculumVersion).toBe(VERSION);
  });
});
