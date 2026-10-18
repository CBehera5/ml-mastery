import {describe,expect,it} from "vitest";
import {auditMathCoverage,assessmentPolicies,coverageRows,qualitySnapshot} from "./audit";
import * as algebra from "../algebra-functions/model";
import * as core from "../linear-algebra/model";
import * as geometry from "../linear-algebra/geometry-model";
import * as probability from "../probability/model";
import * as statistics from "../statistics/model";
import * as optimization from "../optimization/model";
import {questions as algebraQuestions} from "../algebra-functions/content";
import {moduleQuestions} from "../linear-algebra/geometry-content";
import {extensionChecks,gradeExtension,commitExtension,emptyExtension,EXTENSION_MASTERY} from "../derivatives/extension-model";
import {questions as coreQuestions} from "../linear-algebra/content";
import {questions as probabilityQuestions} from "../probability/content";
import {questions as statisticsQuestions} from "../statistics/content";
import {questions as optimizationQuestions} from "../optimization/content";
import {loadTopicProgress,scoreAssessment} from "../derivatives/curriculum";
import type {ExerciseDefinition,LearnerResponse} from "../../learn/foundation/exercises";
const time="2026-10-16T06:00:00.000Z";
const response=(exercise:ExerciseDefinition):LearnerResponse=>exercise.kind==="numerical"?{kind:"numerical",value:exercise.expected}:exercise.kind==="conceptual"?{kind:"conceptual",optionId:exercise.expectedOptionId}:{kind:"conceptual",optionId:"unsupported"};
describe("Mathematics integration reference coverage",()=>{
  it("maps every essential exercise objective to teaching, both variants, independent assessment and remediation",()=>{
    expect(auditMathCoverage()).toEqual({valid:true,errors:[]});
    expect(coverageRows).toHaveLength(144);
    expect(new Set(coverageRows.map(row=>row.objectiveId)).size).toBe(144);
    expect(coverageRows.filter(row=>row.critical).every(row=>row.depth==="essential")).toBe(true);
    expect(qualitySnapshot().aggregateMastery).toBe(false);
    expect(assessmentPolicies).toHaveLength(8);
  });
  it("keeps both Algebra and original Linear Algebra policies, drafts and scoped histories intact",()=>{
    for(const variant of ["v01","v02"] as const){
      for(const [model,items]of [[algebra,algebra.assessmentQuestions(variant)],[core,core.assessmentQuestions(variant)]] as const){
        const answers=Object.fromEntries(items.map(item=>[item.key,response(item.exercise)]));
        expect(model.grade(variant,answers).passed).toBe(true);
        for(const item of items.filter(item=>item.critical)){const failed={...answers};delete failed[item.key];expect(model.grade(variant,failed).passed).toBe(false);}
        const draft=model.parseDraft(JSON.stringify({version:1,variant,phase:"review",responses:answers}));
        expect(draft.phase).toBe("active");
      }
    }
    expect(algebra.parseDraft("{").phase).toBe("active");expect(core.parseDraft('{"version":99}').phase).toBe("active");
  });
  it("retains the expanded Linear Algebra gate without upgrading old core mastery",()=>{
    for(const variant of ["v01","v02"] as const){
      const items=moduleQuestions(variant==="v01"?1:2),answers=Object.fromEntries(items.map(item=>[item.key,response(item.exercise)]));
      expect(geometry.grade(variant,answers).passed).toBe(true);
      for(const critical of items.filter(item=>item.critical)){const failed={...answers};delete failed[critical.key];expect(geometry.grade(variant,failed).passed).toBe(false);}
    }
    const imported=core.importLegacy(core.emptyEvidence(),"vectors","[true,true,true,true,true]",time);
    expect(imported.objectives["linear-algebra.foundations.vectors.legacy-completion"]?.completed).toBe(true);
    expect(imported.masteryEvidence).toHaveLength(0);
    expect(core.importLegacy(core.emptyEvidence(),"vectors","[true,true]",time).objectives).toEqual({});
  });
  it("preserves historical Derivatives 4/5 separately from the new extension's critical requirements",()=>{
    const legacy=loadTopicProgress(JSON.stringify({completed:["why","mastery"],mastered:true,bestScore:4}));
    expect(legacy.mastered).toBe(true);
    expect(scoreAssessment({concept:"sensitivity",calculation:"6",graph:"negative",application:"increase",debug:"wrong"}).mastered).toBe(true);
    for(const variant of [0,1] as const){
      const items=extensionChecks(variant),answers=Object.fromEntries(items.map(item=>[item.key,response(item.exercise)]));
      expect(gradeExtension(variant,answers).passed).toBe(true);
      const evidence=commitExtension(emptyExtension(),gradeExtension(variant,answers),"pass",time);
      expect(evidence.objectives[EXTENSION_MASTERY].mastered).toBe(true);
      for(const critical of items.filter(item=>item.critical)){const failed={...answers};delete failed[critical.key];expect(gradeExtension(variant,failed).passed).toBe(false);}
    }
    for(const raw of ["{",'{"schemaVersion":"2.0.0"}','{"completed":[],"mastered":true,"bestScore":99}'])expect(()=>loadTopicProgress(raw)).toThrow();
  });
  it("audits both variants and every critical gate for Probability, Statistics and Optimization",()=>{
    for(const [model,factory]of [[probability,probabilityQuestions],[statistics,statisticsQuestions],[optimization,optimizationQuestions]] as const){
      for(const variant of [0,1] as const){
        const items=factory(variant),answers=Object.fromEntries(items.map(item=>[item.concept.key,response(item.exercise)]));
        expect(model.grade(variant,answers).passed).toBe(true);
        for(const item of items.filter(item=>item.concept.critical)){const failed={...answers};delete failed[item.concept.key];expect(model.grade(variant,failed).passed).toBe(false);}
      }
      expect(()=>model.loadEvidence(JSON.stringify({...model.emptyEvidence(),curriculumVersion:"future"}))).toThrow();
    }
    for(const variant of [0,1] as const){
      const probabilityAnswers=Object.fromEntries(probabilityQuestions(variant).map(item=>[item.concept.key,response(item.exercise)]));
      const statisticsAnswers=Object.fromEntries(statisticsQuestions(variant).map(item=>[item.concept.key,response(item.exercise)]));
      const optimizationAnswers=Object.fromEntries(optimizationQuestions(variant).map(item=>[item.concept.key,response(item.exercise)]));
      const histories=[
        probability.commit(probability.commit(probability.emptyEvidence(),probability.grade(variant,probabilityAnswers),"pass",time),probability.grade(variant,{}),"fail",time),
        statistics.commit(statistics.commit(statistics.emptyEvidence(),statistics.grade(variant,statisticsAnswers),"pass",time),statistics.grade(variant,{}),"fail",time),
        optimization.commit(optimization.commit(optimization.emptyEvidence(),optimization.grade(variant,optimizationAnswers),"pass",time),optimization.grade(variant,{}),"fail",time),
      ];
      for(const evidence of histories)expect(evidence.masteryEvidence.length).toBeGreaterThan(0);
      expect(probability.loadEvidence(JSON.stringify(histories[0]))).toEqual(histories[0]);
      expect(statistics.loadEvidence(JSON.stringify(histories[1]))).toEqual(histories[1]);
      expect(optimization.loadEvidence(JSON.stringify(histories[2]))).toEqual(histories[2]);
    }
  });
});
