import { awardMastery, createEmptyEvidence, evidenceStorageKey, markLessonState, recordAssessmentAttempt, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../learn/foundation/evidence";
import { evaluateExercise, type LearnerResponse } from "../../learn/foundation/exercises";
import { CORE_BLUEPRINT, MODULE_ID, lessonTopics, questions, type Lesson } from "./content";

export const STORAGE_KEY = evidenceStorageKey("math.linear-algebra");
export const DRAFT_KEY = "ml-math-lab:assessment:math.linear-algebra:core:v1";
export const ASSESSMENT_ID = CORE_BLUEPRINT.assessmentId;
export const MASTERY_ID = `${MODULE_ID}.core-mastery`;
export const emptyEvidence = () => createEmptyEvidence("linear-algebra.core.v1");
export type Variant = "v01" | "v02";
export type Responses = Record<string, LearnerResponse>;
export type Draft = { version: 1; variant: Variant; phase: "active" | "review" | "submitted"; responses: Responses; attemptId?: string };
export const assessmentQuestions = (variant: Variant) => questions(variant === "v01" ? 1 : 2);
export const newDraft = (variant: Variant = "v01"): Draft => ({ version: 1, variant, phase: "active", responses: {} });
export function parseDraft(raw: string | null, fallback: Variant = "v01"): Draft {
  try {
    if (!raw) return newDraft(fallback);
    const value = JSON.parse(raw);
    if (value.version !== 1 || !["v01", "v02"].includes(value.variant) || !["active", "review", "submitted"].includes(value.phase) || !value.responses || typeof value.responses !== "object" || Array.isArray(value.responses)) return newDraft(fallback);
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
    return { version: 1, variant: value.variant, phase: value.phase === "review" ? "active" : value.phase, responses: value.responses, ...(value.phase === "submitted" ? { attemptId: value.attemptId } : {}) };
  } catch { return newDraft(fallback); }
}
export function grade(variant: Variant, responses: Responses) {
  const items = assessmentQuestions(variant).map(question => ({ question, correct: Boolean(responses[question.key] && evaluateExercise(question.exercise, responses[question.key], 1).correct) }));
  const score = items.filter(item => item.correct).length;
  const failedCritical = items.filter(item => item.question.critical && !item.correct);
  return { variant, items, score, maxScore: items.length, percent: 100 * score / items.length, failedCritical, passed: score * 100 >= CORE_BLUEPRINT.minimumPercent * items.length && failedCritical.length === 0 };
}
export function finishLesson(evidence: LearningEvidenceV1, lesson: Lesson, time: string) {
  const objectiveIds = questions(0).filter(question => lessonTopics(lesson).includes(question.topic)).map(question => question.objectiveId);
  const activityIds = lessonTopics(lesson).map(topic => `${MODULE_ID}.${topic}.activity`);
  const complete = [...objectiveIds, ...activityIds].every(id => evidence.objectives[id]?.completed);
  return markLessonState(evidence, `${MODULE_ID}.${lesson}`, complete ? "completed" : "started", complete ? [...objectiveIds, ...activityIds] : [], time);
}
export function importLegacy(evidence: LearningEvidenceV1, lesson: Lesson, raw: string | null, time: string) {
  try {
    const flags = JSON.parse(raw ?? "null");
    if (!Array.isArray(flags) || flags.length !== 5 || !flags.every(flag => flag === true)) return evidence;
    const id = `${MODULE_ID}.${lesson}.legacy-completion`;
    if (evidence.objectives[id]?.completed) return evidence;
    return recordObjectiveCompletion(evidence, id, `ml-math-lab:lesson:${lesson === "vectors" ? "vectors-dot-product" : "matrices-multiplication"}:v1:five-flags`, time);
  } catch { return evidence; }
}
export function commit(evidence: LearningEvidenceV1, result: ReturnType<typeof grade>, id: string, time: string) {
  if (evidence.assessmentAttempts.some(attempt => attempt.id === id)) return evidence;
  const objectiveIds = result.items.filter(item => item.correct).map(item => item.question.objectiveId);
  let next = recordAssessmentAttempt(evidence, { id, assessmentId: ASSESSMENT_ID, variantId: result.variant, score: result.score, maxScore: result.maxScore, objectiveIds, submittedAt: time }, Number.MAX_SAFE_INTEGER);
  const retained = new Set(next.assessmentAttempts.filter(attempt => attempt.assessmentId === ASSESSMENT_ID).slice(-20).map(attempt => attempt.id));
  next = { ...next, assessmentAttempts: next.assessmentAttempts.filter(attempt => attempt.assessmentId !== ASSESSMENT_ID || retained.has(attempt.id)) };
  next = markLessonState(next, `${MODULE_ID}.assessment`, "assessed", objectiveIds, time);
  for (const objective of objectiveIds) next = recordObjectiveCompletion(next, objective, id, time);
  if (result.passed) for (const objective of [...objectiveIds, MASTERY_ID]) next = awardMastery(next, { id: `${id}:${objective}`, objectiveId: objective, sourceType: "assessment", sourceId: ASSESSMENT_ID, level: 2, awardedAt: time });
  return next;
}
