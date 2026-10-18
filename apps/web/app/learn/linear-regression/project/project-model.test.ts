import { describe, expect, it } from "vitest";
import { validateExercise } from "../../foundation/exercises";
import { REFERENCE_CURRICULUM } from "../../foundation/reference-catalog";
import { validateCurriculumCatalog } from "../../foundation/curriculum";
import reference from "../../../../public/data/linear-regression-housing-bridge.reference.v1.json";
import { answerCorrect, completedStages, DEFAULT_CONFIG, emptySession, parseProjectSession, prepareProject, PROJECT_DATA, PROJECT_ID, PROJECT_OBJECTIVES, projectExercises, projectSummary, runProject, testRows, trainingRows } from "./project-model";

export function solvedSession(){const session=emptySession();session.hasRun=true;session.cursor=1;session.evaluated=true;session.testExposed=true;session.inspected=["H03","H04"];const run=runProject(session.config);for(const check of projectExercises(run,session.config.mode).flat())session.answers[check.id]=check.kind==="numerical"?String(check.expected):check.kind==="conceptual"?check.expectedOptionId:"";return session}
function metricClose(actual:{mae:number;mse:number;rmse:number},expected:{mae:number;mse:number;rmse:number}){for(const key of ["mae","mse","rmse"] as const)expect(actual[key]).toBeCloseTo(expected[key],8)}
describe("deterministic housing bridge",()=>{
 it("documents synthetic provenance, fixed price construction and disjoint split IDs",()=>{
  expect(PROJECT_DATA.provenance).toMatch(/synthetic/);expect(PROJECT_DATA.provenance).toMatch(/do not represent any market/);
  expect(trainingRows.map(row=>row.id)).toEqual(["H01","H02","H03","H04","H05","H06","H07","H08"]);
  expect(testRows.map(row=>row.id)).toEqual(["H09","H10","H11","H12"]);
  expect(new Set(PROJECT_DATA.rows.map(row=>row.id)).size).toBe(12);
  PROJECT_DATA.rows.forEach(row=>expect(row.price).toBeCloseTo(100+60*row.area-row.age+row.adjustment,9));
 });
 it("matches independent standard-library Python reference predictions and metrics",()=>{
  const result=runProject(DEFAULT_CONFIG);
  expect(result.prepared.scaling.mean).toEqual(reference.mean);
  result.prepared.scaling.scale.forEach((value,i)=>expect(value).toBeCloseTo(reference.scale[i],10));
  result.training.entries.at(-1)!.weights.forEach((value,i)=>expect(value).toBeCloseTo(reference.weights[i],8));
  expect(result.training.entries.at(-1)!.bias).toBeCloseTo(reference.bias,8);
  result.train!.rows.forEach((row,i)=>expect(row.prediction).toBeCloseTo(reference.trainPredictions[i],8));
  result.test!.rows.forEach((row,i)=>{expect(row.prediction).toBeCloseTo(reference.testPredictions[i],8);expect(row.residual).toBeCloseTo(row.prediction-testRows[i].price,9)});
  metricClose(result.train!.metrics,reference.trainMetrics);metricClose(result.test!.metrics,reference.testMetrics);metricClose(result.baseline.metrics,reference.baselineMetrics);
 });
 it("does not let held-out inputs or targets change fitted scaling, weights or training loss",()=>{
  const before=runProject(DEFAULT_CONFIG),row=testRows[0],old={...row};
  try{row.area=100;row.price=100000;const after=runProject(DEFAULT_CONFIG);expect(after.prepared.scaling).toEqual(before.prepared.scaling);expect(after.training).toEqual(before.training);expect(after.train).toEqual(before.train);expect(after.test!.metrics.mae).not.toBe(before.test!.metrics.mae)}finally{Object.assign(row,old)}
 });
 it("supports area-only and two-feature configurations without mismatched input dimensions",()=>{
  for(const mode of ["area","area-age"] as const){const run=runProject({...DEFAULT_CONFIG,mode});expect(run.training.entries[0].weights).toHaveLength(mode==="area"?1:2);expect(run.test!.shape.observations).toBe(4);expect(run.train!.metrics.mse).toBeLessThan(run.training.entries[0].loss!)}
  expect(prepareProject("area").scaling.mean).toEqual([2.4]);
 });
 it("rejects invalid session versions, unsafe bounds and inconsistent execution flags",()=>{
  for(const bad of ["bad JSON",JSON.stringify({...emptySession(),version:2}),JSON.stringify({...emptySession(),config:{...DEFAULT_CONFIG,rate:99}}),JSON.stringify({...emptySession(),cursor:300}),JSON.stringify({...emptySession(),evaluated:true}),JSON.stringify({...emptySession(),inspected:["H12"]}),JSON.stringify({...emptySession(),answers:{unknown:"0"}})])expect(parseProjectSession(bad)).toEqual(emptySession());
  expect(parseProjectSession(JSON.stringify(solvedSession()))).toEqual(solvedSession());
 });
 it("requires all preceding stages, inspected observations, a stable run and current metric interpretation",()=>{
  const session=solvedSession(),run=runProject(session.config);expect(completedStages(session,run)).toEqual([true,true,true,true,true,true]);
  const skipped={...session,inspected:["H03"]};expect(completedStages(skipped,run)).toEqual([true,false,false,false,false,false]);
  expect(completedStages({...session,cursor:0},run)).toEqual([true,true,true,false,false,false]);
  expect(completedStages({...session,answers:{...session.answers,"linear-regression.project.evaluate-mae":"999"}},run)).toEqual([true,true,true,true,false,false]);
  const unstable=runProject({...DEFAULT_CONFIG,rate:2,iterations:200});expect(unstable.train?.metrics.mse??Infinity).toBeGreaterThan(unstable.training.entries[0].loss!);expect(completedStages(session,unstable)[3]).toBe(false);
 });
 it("validates all thirteen exercises and provides causal remediation for wrong decisions",()=>{
  const checks=projectExercises(runProject(DEFAULT_CONFIG),"area-age").flat();expect(checks).toHaveLength(13);
  checks.forEach(check=>{expect(validateExercise(check)).toEqual([]);expect(answerCorrect(check,"")).toBe(false);expect(answerCorrect(check,check.kind==="numerical"?"NaN":"not-an-option")).toBe(false);expect(check.feedback.incorrect).toMatch(/Review and retry/)});
 });
 it("registers the preserved aggregate objective and additive stage/milestone contracts",()=>{
  expect(validateCurriculumCatalog(REFERENCE_CURRICULUM)).toEqual({valid:true,errors:[]});
  const lesson=REFERENCE_CURRICULUM.lessons.find(l=>l.id==="linear-regression.project")!;expect(lesson.objectiveIds).toEqual(PROJECT_OBJECTIVES);expect(lesson.exerciseIds).toHaveLength(13);expect(lesson.projectIds).toEqual([PROJECT_ID]);expect(REFERENCE_CURRICULUM.projects.find(p=>p.id===PROJECT_ID)!.milestoneIds).toHaveLength(6);
  expect(REFERENCE_CURRICULUM.lessons.find(l=>l.id==="linear-regression.mastery")!.status).toBe("implemented");
 });
 it("reports actual measured results with units, settings, provenance and limitations",()=>{
  const session=solvedSession(),text=projectSummary(session,runProject(session.config));expect(text).toContain("33.73 $k");expect(text).toContain("2344.92 ($k)²");expect(text).toContain("Floor area, Property age");expect(text).toContain("not validated for real pricing");expect(text).toContain("not mastery");
 });
});
