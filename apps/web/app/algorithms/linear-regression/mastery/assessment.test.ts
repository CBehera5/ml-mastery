import { describe, expect, it } from "vitest";
import { createEmptyEvidence, markLessonState, recordAssessmentAttempt, recordProjectMilestone } from "../../../learn/foundation/evidence";
import { validateExercise, type LearnerResponse } from "../../../learn/foundation/exercises";
import { validateCurriculumCatalog } from "../../../learn/foundation/curriculum";
import { REFERENCE_CURRICULUM } from "../../../learn/foundation/reference-catalog";
import reference from "./math-reference.v1.json";
import { AGGREGATE_OBJECTIVE, ASSESSMENT_ID, assessmentQuestions, BLUEPRINT, commitAssessment, gradeAssessment, MASTERY_OBJECTIVES, newDraft, nextVariant, parseAssessmentDraft, responseComplete, type Responses } from "./assessment";
const now="2026-10-15T10:00:00Z";
function correctResponses(variant:string):Responses{return Object.fromEntries(assessmentQuestions(variant).map(question=>{const e=question.exercise;const response:LearnerResponse=e.kind==="numerical"?{kind:e.kind,value:e.expected}:e.kind==="constrained-code"?{kind:e.kind,slots:{...e.expectedSlots}}:{kind:e.kind,optionId:e.expectedOptionId};return [question.key,response]}))}
describe("versioned independent mastery assessment",()=>{
 it("covers all six competencies with four questions each, 24 distinct objectives and ten critical objectives",()=>{
  expect(BLUEPRINT.questions).toHaveLength(24);expect(new Set(BLUEPRINT.questions.map(q=>q.objectiveId)).size).toBe(24);expect(BLUEPRINT.questions.filter(q=>q.critical)).toHaveLength(10);
  BLUEPRINT.competencies.forEach(area=>expect(BLUEPRINT.questions.filter(q=>q.competency===area.id)).toHaveLength(4));
  for(const variant of BLUEPRINT.variantIds){const questions=assessmentQuestions(variant);expect(questions).toHaveLength(24);questions.forEach(question=>{expect(validateExercise(question.exercise)).toEqual([]);expect(question.exercise.objectiveIds).toEqual([question.objectiveId]);expect(question.remediationRoute).toMatch(/^\/algorithms\/linear-regression\//)});expect(new Set(questions.map(q=>q.exercise.kind))).toEqual(new Set(["conceptual","numerical","parameter-prediction","constrained-code"]))}
 });
 it.each(BLUEPRINT.variantIds)("scores every correct response in %s and matches independent arithmetic for all numerical questions",variant=>{
  const result=gradeAssessment(variant,correctResponses(variant));expect(result.score).toBe(24);expect(result.percent).toBe(100);expect(result.passed).toBe(true);expect(result.failedCritical).toEqual([]);expect(result.competencies.every(area=>area.score===4)).toBe(true);
  const values=reference.variants[variant as keyof typeof reference.variants];
  for(const question of assessmentQuestions(variant))if(question.exercise.kind==="numerical")expect(question.exercise.expected).toBeCloseTo(values[question.key as keyof typeof values],9);
 });
 it("rejects a high overall score if any critical objective fails",()=>{
  const answers=correctResponses("v01");delete answers.q06;const result=gradeAssessment("v01",answers);expect(result.score).toBe(23);expect(result.percent).toBeGreaterThan(80);expect(result.failedCritical).toEqual(["linear-regression.mastery.q06"]);expect(result.passed).toBe(false);
  const stored=commitAssessment(createEmptyEvidence("linear-regression.v1"),result,"failed-high",now);expect(stored.masteryEvidence).toEqual([]);expect(stored.objectives[AGGREGATE_OBJECTIVE]).toBeUndefined();expect(stored.lessons["linear-regression.mastery"].state).toBe("assessed");
 });
 it("requires at least 20/24 with all critical items, not merely a critical pass",()=>{
  const answers=correctResponses("v01"),noncritical=BLUEPRINT.questions.filter(q=>!q.critical);
  noncritical.slice(0,4).forEach(q=>delete answers[q.key]);expect(gradeAssessment("v01",answers)).toMatchObject({score:20,passed:true});
  delete answers[noncritical[4].key];expect(gradeAssessment("v01",answers)).toMatchObject({score:19,passed:false,failedCritical:[]});
 });
 it("is deterministic and replaying any other variant's memorized response set cannot pass",()=>{
  for(const variant of BLUEPRINT.variantIds){expect(assessmentQuestions(variant)).toEqual(assessmentQuestions(variant));const old=correctResponses(variant);for(const other of BLUEPRINT.variantIds)if(other!==variant)expect(gradeAssessment(other,old).passed).toBe(false)}
  expect(nextVariant("v01")).toBe("v02");expect(nextVariant("v12")).toBe("v01");
 });
 it("does not award mastery for an empty attempt, prior lesson completion or partial correctness",()=>{
  let evidence=createEmptyEvidence("linear-regression.v1");for(const lesson of ["why","equation","errors","gradient-descent","multiple-features","implementation","failure-modes","project"])evidence=markLessonState(evidence,`linear-regression.${lesson}`,"completed",[],now);
  const result=gradeAssessment("v01",{});expect(result.score).toBe(0);expect(result.failedCritical).toHaveLength(10);const stored=commitAssessment(evidence,result,"failed-empty",now);expect(stored.masteryEvidence).toEqual([]);expect(stored.lessons["linear-regression.project"]).toEqual(evidence.lessons["linear-regression.project"]);
 });
 it("awards only passed objective mastery after a passing gate, preserves it after failure and commits an attempt once",()=>{
  const answers=correctResponses("v01");delete answers.q02;const result=gradeAssessment("v01",answers);const first=commitAssessment(createEmptyEvidence("linear-regression.v1"),result,"success",now);
  expect(first.objectives[AGGREGATE_OBJECTIVE].mastered).toBe(true);expect(first.objectives["linear-regression.mastery.q02"]).toBeUndefined();expect(first.masteryEvidence).toHaveLength(24);
  expect(commitAssessment(first,result,"success",now)).toBe(first);
  const second=commitAssessment(first,gradeAssessment("v02",{}),"later-failure",now);expect(second.masteryEvidence).toEqual(first.masteryEvidence);expect(second.objectives[AGGREGATE_OBJECTIVE]).toEqual(first.objectives[AGGREGATE_OBJECTIVE]);
 });
 it("bounds its own history without deleting unrelated attempts, milestones or learning evidence",()=>{
  let evidence=recordAssessmentAttempt(createEmptyEvidence("linear-regression.v1"),{id:"unrelated",assessmentId:"derivatives.mastery.v1",variantId:"a",score:3,maxScore:5,objectiveIds:["old-objective"],submittedAt:now});
  evidence=recordProjectMilestone(evidence,{projectId:"old-project",milestoneId:"complete",completed:true,updatedAt:now});
  for(let i=0;i<25;i++)evidence=commitAssessment(evidence,gradeAssessment(BLUEPRINT.variantIds[i%12],{}),`attempt-${i}`,now);
  expect(evidence.assessmentAttempts.filter(a=>a.assessmentId===ASSESSMENT_ID)).toHaveLength(20);expect(evidence.assessmentAttempts.some(a=>a.id==="unrelated")).toBe(true);expect(evidence.projectMilestones).toHaveLength(1);
 });
 it("preserves partial code drafts, resets review confirmation, and safely migrates absent/invalid versioned drafts",()=>{
  const draft=newDraft("v03");draft.responses={q20:{kind:"constrained-code",slots:{weight:"w - rate * dw"}}};expect(parseAssessmentDraft(JSON.stringify(draft))).toEqual(draft);expect(responseComplete(assessmentQuestions("v03").find(q=>q.key==="q20")!,draft.responses.q20)).toBe(false);
  expect(parseAssessmentDraft(JSON.stringify({...draft,phase:"review"})).phase).toBe("active");
  for(const raw of [null,"broken",JSON.stringify({...draft,version:2}),JSON.stringify({...draft,variant:"unknown"}),JSON.stringify({...draft,responses:{q99:{kind:"numerical",value:1}}}),JSON.stringify({...draft,responses:{q20:{kind:"constrained-code",slots:{weight:"eval(user_code)"}}}})])expect(parseAssessmentDraft(raw,"v02")).toEqual(newDraft("v02"));
 });
 it("honors declared numerical tolerances and rejects non-finite or malformed responses",()=>{
  const q=assessmentQuestions("v01").find(question=>question.key==="q06")!;const correct=correctResponses("v01");expect(gradeAssessment("v01",{...correct,q06:{kind:"numerical",value:2.5005}}).items.find(i=>i.question.key==="q06")!.correct).toBe(true);
  expect(gradeAssessment("v01",{...correct,q06:{kind:"numerical",value:NaN}}).passed).toBe(false);
  const malformed={kind:"constrained-code",slots:null} as unknown as LearnerResponse;expect(responseComplete(assessmentQuestions("v01").find(question=>question.key==="q20")!,malformed)).toBe(false);expect(q.exercise.kind).toBe("numerical");
 });
 it("integrates assessment, objectives and variant exercises without declaring the module fully verified",()=>{
  expect(validateCurriculumCatalog(REFERENCE_CURRICULUM)).toEqual({valid:true,errors:[]});const assessment=REFERENCE_CURRICULUM.assessments.find(a=>a.id===ASSESSMENT_ID)!;expect(assessment.objectiveIds).toEqual(MASTERY_OBJECTIVES);expect(assessment.variantIds).toHaveLength(12);
  expect(REFERENCE_CURRICULUM.lessons.find(l=>l.id==="linear-regression.mastery")!.exerciseIds).toHaveLength(288);expect(REFERENCE_CURRICULUM.modules.find(m=>m.id==="supervised.linear-regression")!.status).toBe("implemented");
 });
});
