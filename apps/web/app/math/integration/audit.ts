import {REFERENCE_CURRICULUM} from "../../learn/foundation/reference-catalog";
import {validateCurriculumCatalog} from "../../learn/foundation/curriculum";
import {validateExercise,type ExerciseDefinition} from "../../learn/foundation/exercises";
import {questions as algebraQuestions} from "../algebra-functions/content";
import {questions as coreQuestions} from "../linear-algebra/content";
import {geometryQuestions,MODULE_BLUEPRINT} from "../linear-algebra/geometry-content";
import {extensionChecks,EXTENSION_ASSESSMENT} from "../derivatives/extension-model";
import {questions as probabilityQuestions} from "../probability/content";
import {questions as statisticsQuestions} from "../statistics/content";
import {questions as optimizationQuestions} from "../optimization/content";

export const assessmentPolicies=[
  {id:"algebra.functions.assessment.v1",route:"/math/algebra-functions/assessment",items:24,minimumCorrect:20,critical:6,scope:"Algebra"},
  {id:"linear-algebra.core.assessment.v1",route:"/math/linear-algebra/assessment",items:16,minimumCorrect:13,critical:4,scope:"Linear Algebra core only"},
  {id:MODULE_BLUEPRINT.assessmentId,route:"/math/linear-algebra/mastery",items:32,minimumCorrect:26,critical:8,scope:"Linear Algebra core plus geometry"},
  {id:"derivatives.mastery.v1",route:"/math/derivatives",items:5,minimumCorrect:4,critical:0,scope:"Historical Derivatives pilot only"},
  {id:EXTENSION_ASSESSMENT,route:"/math/derivatives#calculus-essentials",items:12,minimumCorrect:10,critical:5,scope:"Calculus extension only"},
  {id:"probability.mastery.v1",route:"/math/probability/mastery",items:24,minimumCorrect:20,critical:8,scope:"Probability"},
  {id:"statistics.mastery.v1",route:"/math/statistics/mastery",items:28,minimumCorrect:23,critical:10,scope:"Statistics"},
  {id:"optimization.mastery.v1",route:"/math/optimization/mastery",items:24,minimumCorrect:20,critical:8,scope:"Optimization"},
] as const;
type Definition={exercise:ExerciseDefinition;critical:boolean;introductory:boolean;variants:ExerciseDefinition[];assessmentIds:string[]};
const definitions:Definition[]=[
  ...algebraQuestions(0,"guided").map((question,index)=>({exercise:question.exercise,critical:question.critical,introductory:false,variants:([1,2] as const).map(variant=>algebraQuestions(variant,"assessment")[index].exercise),assessmentIds:["algebra.functions.assessment.v1"]})),
  ...coreQuestions(0).map((question,index)=>({exercise:question.exercise,critical:question.critical,introductory:false,variants:([1,2] as const).map(variant=>coreQuestions(variant)[index].exercise),assessmentIds:["linear-algebra.core.assessment.v1",MODULE_BLUEPRINT.assessmentId]})),
  ...geometryQuestions(0).map((question,index)=>({exercise:question.exercise,critical:question.critical,introductory:question.depth==="introductory",variants:([1,2] as const).map(variant=>geometryQuestions(variant)[index].exercise),assessmentIds:[MODULE_BLUEPRINT.assessmentId]})),
  ...extensionChecks(0).map((question,index)=>({exercise:question.exercise,critical:question.critical,introductory:question.introductory,variants:([0,1] as const).map(variant=>extensionChecks(variant)[index].exercise),assessmentIds:[EXTENSION_ASSESSMENT]})),
  ...[probabilityQuestions,statisticsQuestions,optimizationQuestions].flatMap((factory,index)=>factory(0).map((question,position)=>({exercise:question.exercise,critical:Boolean(question.concept.critical),introductory:Boolean(question.concept.introductory),variants:([0,1] as const).map(variant=>factory(variant)[position].exercise),assessmentIds:[["probability.mastery.v1","statistics.mastery.v1","optimization.mastery.v1"][index]]}))),
];
export const coverageRows=definitions.map(definition=>{
  const objectiveId=definition.exercise.objectiveIds[0];
  const objective=REFERENCE_CURRICULUM.objectives.find(item=>item.id===objectiveId);
  const teaching=REFERENCE_CURRICULUM.lessons.find(lesson=>lesson.kind!=="assessment"&&lesson.objectiveIds.includes(objectiveId));
  const remediation=objective?.remediationLessonIds.map(id=>REFERENCE_CURRICULUM.lessons.find(lesson=>lesson.id===id)?.route).filter((route):route is string=>Boolean(route))??[];
  return {objectiveId,moduleId:objective?.moduleId??"",statement:objective?.statement??"",depth:definition.introductory?"introductory":"essential",critical:definition.critical,teachingRoute:teaching?.route??"",practiceExerciseId:definition.exercise.id,independentExerciseIds:definition.variants.map(exercise=>exercise.id),assessmentIds:definition.assessmentIds,remediationRoutes:remediation};
});
export function auditMathCoverage() {
  const errors:string[]=[];
  const catalog=validateCurriculumCatalog(REFERENCE_CURRICULUM);
  if(!catalog.valid)errors.push(...catalog.errors);
  for(const [index,row]of coverageRows.entries()){
    if(!row.teachingRoute||!row.statement||!row.remediationRoutes.length)errors.push(`Missing teaching/remediation: ${row.objectiveId}`);
    if(row.critical&&row.depth!=="essential")errors.push(`Introductory critical gate: ${row.objectiveId}`);
    for(const exercise of [definitions[index].exercise,...definitions[index].variants]){
      errors.push(...validateExercise(exercise));
      if(!REFERENCE_CURRICULUM.exerciseIds.includes(exercise.id))errors.push(`Unregistered exercise: ${exercise.id}`);
    }
    for(const id of row.assessmentIds)if(!REFERENCE_CURRICULUM.assessments.find(item=>item.id===id)?.objectiveIds.includes(row.objectiveId))errors.push(`Missing independent assessment: ${row.objectiveId}`);
  }
  const mathModules=new Set(REFERENCE_CURRICULUM.modules.filter(module=>module.phaseId==="phase.math"&&module.id!=="math.integration").map(module=>module.id));
  for(const objective of REFERENCE_CURRICULUM.objectives.filter(item=>mathModules.has(item.moduleId)&&item.evidenceKinds.includes("exercise")&&item.masteryRequired)){
    if(!coverageRows.some(row=>row.objectiveId===objective.id))errors.push(`Unmapped essential exercise objective: ${objective.id}`);
  }
  return {valid:errors.length===0,errors};
}
export function qualitySnapshot() {
  return {version:"1.0.0",date:"2026-10-16",status:"implemented; manual reference acceptance open",aggregateMastery:false,audit:auditMathCoverage(),objectives:coverageRows,assessments:assessmentPolicies,legacyPilot:{objectiveId:"calculus.derivatives.transfer",teachingRoutes:["/math/derivatives","/math/functions-derivatives"],checkFields:["concept","calculation","graph","application","debug"],assessmentId:"derivatives.mastery.v1",remediationRoutes:["/math/derivatives"],risk:"Historical coarse transfer objective and 4/5 scorer remain unchanged; per-rule independent granularity is a later pedagogical-audit risk, not a claim of exhaustive rule mastery."},modules:REFERENCE_CURRICULUM.modules.map(module=>({...module,lessons:REFERENCE_CURRICULUM.lessons.filter(lesson=>lesson.moduleId===module.id),experiments:REFERENCE_CURRICULUM.labs.filter(lab=>REFERENCE_CURRICULUM.lessons.some(lesson=>lesson.id===lab.lessonId&&lesson.moduleId===module.id))})),openRequirements:[{id:"AT",owner:"Accessibility reviewer",status:"NOT VERIFIED",requirement:"Actual VoiceOver/NVDA speech and mathematics/table/interaction announcements"},{id:"ZOOM",owner:"Manual browser QA",status:"NOT VERIFIED",requirement:"Genuine 200% and 400% browser zoom, not viewport emulation"},{id:"FULL-A11Y",owner:"QA/frontend",status:"PARTIAL",requirement:"Full supported-device contrast/targets/text spacing/motion review"},{id:"PEDAGOGY",owner:"Curriculum lead",status:"DEFERRED",requirement:"Comprehensive post-assembly pedagogical audit; no external learner study yet"}]};
}
