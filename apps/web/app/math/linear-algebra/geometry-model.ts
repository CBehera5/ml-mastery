import { awardMastery, createEmptyEvidence, evidenceStorageKey, markLessonState, recordAssessmentAttempt, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../learn/foundation/evidence";
import { evaluateExercise, type LearnerResponse } from "../../learn/foundation/exercises";
import { MODULE_ID } from "./content";
import { MODULE_BLUEPRINT, geometryTopics, geometryQuestions, moduleQuestions, type GeometryLesson } from "./geometry-content";

export const STORAGE_KEY = evidenceStorageKey("math.linear-algebra.geometry");
export const DRAFT_KEY = "ml-math-lab:assessment:math.linear-algebra:module:v2";
export const ASSESSMENT_ID = MODULE_BLUEPRINT.assessmentId;
export const MASTERY_ID = `${MODULE_ID}.module-mastery.v2`;
export const emptyEvidence = () => createEmptyEvidence("linear-algebra.geometry.v1");
export type Variant = "v01" | "v02";
export type Responses = Record<string, LearnerResponse>;
export type Draft = { version: 2; variant: Variant; phase: "active" | "review" | "submitted"; responses: Responses; attemptId?: string };
export const assessmentQuestions = (variant: Variant) => moduleQuestions(variant === "v01" ? 1 : 2);
export const newDraft = (variant: Variant = "v01"): Draft => ({ version: 2, variant, phase: "active", responses: {} });
export function parseDraft(raw: string | null, fallback: Variant = "v01"): Draft {
  try {
    if (!raw) return newDraft(fallback);
    const value = JSON.parse(raw);
    if (value.version !== 2 || !["v01", "v02"].includes(value.variant) || !["active", "review", "submitted"].includes(value.phase) || !value.responses || typeof value.responses !== "object" || Array.isArray(value.responses)) return newDraft(fallback);
    for (const [key, response] of Object.entries(value.responses) as [string, LearnerResponse][]) {
      const question = assessmentQuestions(value.variant).find(item => item.key === key);
      if (!question || !response || response.kind !== question.exercise.kind) return newDraft(fallback);
      if (response.kind === "numerical") {
        if (!Number.isFinite(response.value) || Math.abs(response.value) > 1e12) return newDraft(fallback);
      } else if (response.kind === "conceptual") {
        if (question.exercise.kind !== "conceptual" || !question.exercise.options.some(option => option.id === response.optionId)) return newDraft(fallback);
      } else return newDraft(fallback);
    }
    if (value.phase === "submitted" && (typeof value.attemptId !== "string" || !value.attemptId || value.attemptId.length > 100)) return newDraft(fallback);
    return { version: 2, variant: value.variant, phase: value.phase === "review" ? "active" : value.phase, responses: value.responses, ...(value.phase === "submitted" ? { attemptId: value.attemptId } : {}) };
  } catch { return newDraft(fallback); }
}
export function grade(variant: Variant, responses: Responses) {
  const items = assessmentQuestions(variant).map(question => ({ question, correct: Boolean(responses[question.key] && evaluateExercise(question.exercise, responses[question.key], 1).correct) }));
  const score = items.filter(item => item.correct).length;
  const failedCritical = items.filter(item => item.question.critical && !item.correct);
  return { variant, items, score, maxScore: items.length, percent: 100 * score / items.length, failedCritical, passed: score * 100 >= MODULE_BLUEPRINT.minimumPercent * items.length && failedCritical.length === 0 };
}
export function finishLesson(evidence: LearningEvidenceV1, lesson: GeometryLesson, time: string) {
  const objectiveIds = geometryQuestions(0).filter(question => geometryTopics(lesson).includes(question.topic)).map(question => question.objectiveId);
  const activityIds = geometryTopics(lesson).map(topic => `${MODULE_ID}.geometry.${topic}.activity`);
  const complete = [...objectiveIds, ...activityIds].every(id => evidence.objectives[id]?.completed);
  return markLessonState(evidence, `${MODULE_ID}.geometry.${lesson}`, complete ? "completed" : "started", complete ? [...objectiveIds, ...activityIds] : [], time);
}
export function commit(evidence: LearningEvidenceV1, result: ReturnType<typeof grade>, id: string, time: string) {
  if (evidence.assessmentAttempts.some(attempt => attempt.id === id)) return evidence;
  const objectiveIds = result.items.filter(item => item.correct).map(item => item.question.objectiveId);
  let next = recordAssessmentAttempt(evidence, { id, assessmentId: ASSESSMENT_ID, variantId: result.variant, score: result.score, maxScore: result.maxScore, objectiveIds, submittedAt: time }, Number.MAX_SAFE_INTEGER);
  const retained = new Set(next.assessmentAttempts.filter(attempt => attempt.assessmentId === ASSESSMENT_ID).slice(-20).map(attempt => attempt.id));
  next = { ...next, assessmentAttempts: next.assessmentAttempts.filter(attempt => attempt.assessmentId !== ASSESSMENT_ID || retained.has(attempt.id)) };
  next = markLessonState(next, `${MODULE_ID}.module-assessment.v2`, "assessed", objectiveIds, time);
  for (const objective of objectiveIds) next = recordObjectiveCompletion(next, objective, id, time);
  if (result.passed) for (const objective of [...objectiveIds, MASTERY_ID]) next = awardMastery(next, { id: `${id}:${objective}`, objectiveId: objective, sourceType: "assessment", sourceId: ASSESSMENT_ID, level: 2, awardedAt: time });
  return next;
}
