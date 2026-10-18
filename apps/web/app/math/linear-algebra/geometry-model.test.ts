import { describe, expect, it } from "vitest";
import { validateExercise, type LearnerResponse } from "../../learn/foundation/exercises";
import { validateCurriculumCatalog } from "../../learn/foundation/curriculum";
import { REFERENCE_CURRICULUM } from "../../learn/foundation/reference-catalog";
import { recordAssessmentAttempt, recordObjectiveCompletion } from "../../learn/foundation/evidence";
import { CORE_BLUEPRINT, MODULE_ID, questions as coreQuestions } from "./content";
import { MODULE_BLUEPRINT, geometryQuestions, geometryTopics } from "./geometry-content";
import { ASSESSMENT_ID, MASTERY_ID, assessmentQuestions, commit, emptyEvidence, finishLesson, grade, newDraft, parseDraft, type Variant } from "./geometry-model";
import { MASTERY_ID as CORE_MASTERY, commit as commitCore, grade as gradeCore, emptyEvidence as emptyCore } from "./model";
const time = "2026-10-15T13:00:00Z";
export function answersForModule(variant: Variant): Record<string, LearnerResponse> {
  return Object.fromEntries(assessmentQuestions(variant).map(question => [question.key, question.exercise.kind === "numerical" ? { kind: "numerical", value: question.exercise.expected } : { kind: "conceptual", optionId: question.exercise.expectedOptionId }]));
}
describe("versioned expanded Linear Algebra assessment", () => {
  it("pins 32 objectives, eight essential critical gates and original unchanged core coverage", () => {
    expect(CORE_BLUEPRINT.questions).toHaveLength(16); expect(MODULE_BLUEPRINT.questions).toHaveLength(32);
    expect(MODULE_BLUEPRINT.questions.filter(question => question.critical).map(question => question.key)).toEqual(["vectors.norm", "dot.signed", "matrix.shape", "batch.shape", "transform.apply", "composition.order", "span.independent", "inverse.undo"]);
    expect(MODULE_BLUEPRINT.questions.filter(question => question.depth === "introductory")).toHaveLength(6);
    expect(MODULE_BLUEPRINT.questions.filter(question => question.depth === "introductory").every(question => !question.critical)).toBe(true);
    expect(new Set(MODULE_BLUEPRINT.questions.map(question => question.objectiveId)).size).toBe(32);
    for (const variant of [1, 2] as const) expect(assessmentQuestions(variant === 1 ? "v01" : "v02").slice(0, 16).map(({ depth, ...question }) => question)).toEqual(coreQuestions(variant));
    for (const variant of [0, 1, 2] as const) geometryQuestions(variant).forEach(question => expect(validateExercise(question.exercise)).toEqual([]));
    expect(validateCurriculumCatalog(REFERENCE_CURRICULUM)).toEqual({ valid: true, errors: [] });
    expect(REFERENCE_CURRICULUM.assessments.some(assessment => assessment.id === "linear-algebra.core.assessment.v1")).toBe(true);
    expect(REFERENCE_CURRICULUM.assessments.some(assessment => assessment.id === ASSESSMENT_ID)).toBe(true);
  });
  it("matches hand-computed geometry answers in guided and both assessment variants", () => {
    const expected = [[2, 3, 2, 3, 1, 1, 2, 2], [4, 4, 4, 4, 1, 2, 2, 3], [6, 5, 6, 5, 1, 3, -1, 4]];
    for (const variant of [0, 1, 2] as const) expect(geometryQuestions(variant).flatMap(question => question.exercise.kind === "numerical" ? [question.exercise.expected] : [])).toEqual(expected[variant]);
  });
  it("requires 26/32 and every essential critical gate without hidden introductory gates", () => {
    const all = answersForModule("v01");
    for (const question of assessmentQuestions("v01").filter(question => question.critical)) {
      const responses = { ...all }; delete responses[question.key];
      expect(grade("v01", responses)).toMatchObject({ score: 31, passed: false });
      expect(commit(emptyEvidence(), grade("v01", responses), question.key, time).masteryEvidence).toEqual([]);
    }
    const essentialsOnly = { ...all };
    const introductory = assessmentQuestions("v01").filter(question => question.depth === "introductory");
    introductory.forEach(question => delete essentialsOnly[question.key]);
    const result = grade("v01", essentialsOnly); expect(result).toMatchObject({ score: 26, passed: true });
    const evidence = commit(emptyEvidence(), result, "pass", time);
    expect(evidence.objectives[MASTERY_ID].mastered).toBe(true);
    introductory.forEach(question => expect(evidence.objectives[question.objectiveId]?.mastered).not.toBe(true));
    delete essentialsOnly["vectors.add"]; expect(grade("v01", essentialsOnly)).toMatchObject({ score: 25, passed: false });
    expect(grade("v02", all).passed).toBe(false);
  });
  it("preserves core mastery as core-only evidence and never automatically upgrades it", () => {
    const answers = Object.fromEntries(coreQuestions(1).map(question => [question.key, question.exercise.kind === "numerical" ? { kind: "numerical", value: question.exercise.expected } : { kind: "conceptual", optionId: question.exercise.expectedOptionId }])) as Record<string, LearnerResponse>;
    const core = commitCore(emptyCore(), gradeCore("v01", answers), "core-pass", time);
    expect(core.objectives[CORE_MASTERY].mastered).toBe(true); expect(core.objectives[MASTERY_ID]).toBeUndefined();
    expect(emptyEvidence().objectives[MASTERY_ID]).toBeUndefined();
    expect(parseDraft(JSON.stringify({ version: 1, variant: "v01", phase: "submitted", responses: answers, attemptId: "core-pass" }))).toEqual(newDraft());
    const module = commit(emptyEvidence(), grade("v01", answersForModule("v01")), "module-pass", time);
    expect(module.objectives[MASTERY_ID].mastered).toBe(true); expect(core.objectives[MASTERY_ID]).toBeUndefined();
  });
  it("keeps guided geometry completion separate from mastery and protects unrelated history", () => {
    let evidence = emptyEvidence();
    for (const question of geometryQuestions(0).filter(question => geometryTopics("transformations").includes(question.topic))) evidence = recordObjectiveCompletion(evidence, question.objectiveId, question.exercise.id, time);
    expect(finishLesson(evidence, "transformations", time).lessons[`${MODULE_ID}.geometry.transformations`].state).toBe("started");
    for (const topic of geometryTopics("transformations")) evidence = recordObjectiveCompletion(evidence, `${MODULE_ID}.geometry.${topic}.activity`, "experiment", time);
    evidence = finishLesson(evidence, "transformations", time); expect(evidence.lessons[`${MODULE_ID}.geometry.transformations`].state).toBe("completed"); expect(evidence.masteryEvidence).toEqual([]);
    evidence = recordAssessmentAttempt(evidence, { id: "unrelated", assessmentId: "other", variantId: "a", score: 1, maxScore: 1, objectiveIds: [], submittedAt: time });
    evidence = commit(evidence, grade("v01", answersForModule("v01")), "pass", time); const earned = evidence.masteryEvidence;
    expect(commit(evidence, grade("v02", {}), "pass", time)).toBe(evidence);
    for (let index = 0; index < 23; index++) evidence = commit(evidence, grade("v02", {}), `failed-${index}`, time);
    expect(evidence.masteryEvidence).toEqual(earned); expect(evidence.assessmentAttempts.filter(attempt => attempt.assessmentId === ASSESSMENT_ID)).toHaveLength(20); expect(evidence.assessmentAttempts.some(attempt => attempt.id === "unrelated")).toBe(true);
  });
  it("validates v2 drafts and resets consent without interpreting v1 or future data", () => {
    const draft = { ...newDraft("v02"), responses: { "transform.apply": { kind: "numerical", value: 6 } } };
    expect(parseDraft(JSON.stringify(draft))).toEqual(draft); expect(parseDraft(JSON.stringify({ ...draft, phase: "review" })).phase).toBe("active");
    for (const raw of ["corrupt", JSON.stringify({ ...draft, version: 1 }), JSON.stringify({ ...draft, version: 3 }), JSON.stringify({ ...draft, responses: { unknown: { kind: "numerical", value: 4 } } }), JSON.stringify({ ...draft, responses: { "transform.apply": { kind: "numerical", value: 1e100 } } })]) expect(parseDraft(raw)).toEqual(newDraft());
  });
});
