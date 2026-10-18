import { describe, expect, it } from "vitest";
import { validateExercise, type LearnerResponse } from "../../learn/foundation/exercises";
import { validateCurriculumCatalog } from "../../learn/foundation/curriculum";
import { REFERENCE_CURRICULUM } from "../../learn/foundation/reference-catalog";
import { recordAssessmentAttempt } from "../../learn/foundation/evidence";
import { CORE_BLUEPRINT, MODULE_ID, questions } from "./content";
import { ASSESSMENT_ID, MASTERY_ID, assessmentQuestions, commit, emptyEvidence, grade, importLegacy, newDraft, parseDraft, type Variant } from "./model";

const time = "2026-10-15T12:00:00Z";
export function answersFor(variant: Variant): Record<string, LearnerResponse> {
  return Object.fromEntries(assessmentQuestions(variant).map(question => [question.key, question.exercise.kind === "numerical" ? { kind: "numerical", value: question.exercise.expected } : { kind: "conceptual", optionId: question.exercise.expectedOptionId }]));
}
describe("Linear Algebra core learning contracts", () => {
  it("publishes four competencies, 16 objectives and four critical gates without geometry claims", () => {
    expect(CORE_BLUEPRINT.questions).toHaveLength(16);
    expect(CORE_BLUEPRINT.questions.filter(question => question.critical).map(question => question.key)).toEqual(["vectors.norm", "dot.signed", "matrix.shape", "batch.shape"]);
    for (const variant of [0, 1, 2] as const) for (const question of questions(variant)) expect(validateExercise(question.exercise)).toEqual([]);
    expect(validateCurriculumCatalog(REFERENCE_CURRICULUM)).toEqual({ valid: true, errors: [] });
    expect(REFERENCE_CURRICULUM.lessons.find(lesson => lesson.id === `${MODULE_ID}.vectors`)?.route).toBe("/math/vectors-dot-product");
    expect(REFERENCE_CURRICULUM.lessons.find(lesson => lesson.id === `${MODULE_ID}.matrices`)?.route).toBe("/math/matrices-multiplication");
    expect(REFERENCE_CURRICULUM.lessons.filter(lesson => lesson.moduleId === "calculus.derivatives").every(lesson => lesson.exerciseIds.length === 0)).toBe(true);
  });
  it("agrees with hand-calculated numerical references for all three sets", () => {
    const expected = [[5, 5, -2, -8, 3, 4, -2, 2, 4], [10, 5, -4, -6, 4, 5, -1, 2, 5], [15, 5, -6, -4, 5, 6, 0, 2, 6]];
    for (const variant of [0, 1, 2] as const) expect(questions(variant).flatMap(question => question.exercise.kind === "numerical" ? [question.exercise.expected] : [])).toEqual(expected[variant]);
  });
  it("requires 13/16 plus every critical objective in one attempt", () => {
    const correct = answersFor("v01");
    const missingCritical = { ...correct }; delete missingCritical["vectors.norm"];
    const failed = grade("v01", missingCritical);
    expect(failed).toMatchObject({ score: 15, passed: false }); expect(commit(emptyEvidence(), failed, "failed", time).masteryEvidence).toEqual([]);
    const noncritical = assessmentQuestions("v01").filter(question => !question.critical);
    const reduced = { ...correct }; noncritical.slice(0, 3).forEach(question => delete reduced[question.key]);
    expect(grade("v01", reduced)).toMatchObject({ score: 13, passed: true });
    const passed = commit(emptyEvidence(), grade("v01", reduced), "passed", time);
    expect(passed.objectives[MASTERY_ID].mastered).toBe(true);
    expect(passed.objectives[noncritical[0].objectiveId]?.mastered).not.toBe(true);
    delete reduced[noncritical[3].key]; expect(grade("v01", reduced)).toMatchObject({ score: 12, passed: false });
    expect(grade("v02", correct).passed).toBe(false);
  });
  it("imports only valid complete historical flags idempotently without awarding understanding/mastery", () => {
    const initial = emptyEvidence();
    for (const raw of [null, "broken", "{}", "[true,true]", "[true,true,true,true,false]", '[1,1,1,1,1]']) expect(importLegacy(initial, "vectors", raw, time)).toBe(initial);
    const complete = importLegacy(initial, "vectors", "[true,true,true,true,true]", time);
    expect(complete.objectives[`${MODULE_ID}.vectors.legacy-completion`].completed).toBe(true);
    expect(Object.keys(complete.objectives)).toHaveLength(1); expect(complete.masteryEvidence).toEqual([]); expect(complete.lessons).toEqual({});
    expect(importLegacy(complete, "vectors", "[true,true,true,true,true]", time)).toBe(complete);
  });
  it("preserves previous mastery and unrelated attempts while retaining only 20 own attempts", () => {
    let evidence = recordAssessmentAttempt(emptyEvidence(), { id: "other", assessmentId: "other", variantId: "a", score: 1, maxScore: 1, objectiveIds: [], submittedAt: time });
    evidence = commit(evidence, grade("v01", answersFor("v01")), "pass", time);
    const earned = evidence.masteryEvidence;
    expect(commit(evidence, grade("v02", {}), "pass", time)).toBe(evidence);
    for (let index = 0; index < 22; index++) evidence = commit(evidence, grade("v02", {}), `failure-${index}`, time);
    expect(evidence.masteryEvidence).toEqual(earned); expect(evidence.assessmentAttempts.some(attempt => attempt.id === "other")).toBe(true);
    expect(evidence.assessmentAttempts.filter(attempt => attempt.assessmentId === ASSESSMENT_ID)).toHaveLength(20);
  });
  it("restores bounded drafts and rejects corrupt or future responses; review consent resets", () => {
    const draft = { ...newDraft("v02"), responses: { "vectors.norm": { kind: "numerical", value: 15 } } };
    expect(parseDraft(JSON.stringify(draft))).toEqual(draft);
    expect(parseDraft(JSON.stringify({ ...draft, phase: "review" })).phase).toBe("active");
    for (const value of ["broken", JSON.stringify({ ...draft, version: 2 }), JSON.stringify({ ...draft, responses: { unknown: { kind: "numerical", value: 1 } } }), JSON.stringify({ ...draft, responses: { "vectors.norm": { kind: "numerical", value: 1e100 } } }), JSON.stringify({ ...draft, responses: { "dot.order": { kind: "conceptual", optionId: "forged" } } })]) expect(parseDraft(value)).toEqual(newDraft());
  });
});
