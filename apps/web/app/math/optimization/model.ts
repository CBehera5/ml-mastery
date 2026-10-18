import { awardMastery, createEmptyEvidence, evidenceStorageKey, markLessonState, recordAssessmentAttempt, recordObjectiveCompletion, validateLearningEvidence, type LearningEvidenceV1 } from "../../learn/foundation/evidence";
import { evaluateExercise, type LearnerResponse } from "../../learn/foundation/exercises";
import { ASSESSMENT, MASTERY, MODULE, VERSION, questions, type LessonSlug } from "./content";
export const STORAGE_KEY = evidenceStorageKey("math.optimization");
export const emptyEvidence = () => createEmptyEvidence(VERSION);
export type Responses = Record<string, LearnerResponse>;
export function loadEvidence(raw: string | null): LearningEvidenceV1 {
  if (raw === null) return emptyEvidence();
  const value: unknown = JSON.parse(raw);
  if (!validateLearningEvidence(value) || value.curriculumVersion !== VERSION) throw new Error("Unsupported or damaged Optimization evidence. Original data preserved; saving disabled.");
  return value;
}
export function grade(variant: 0 | 1, responses: Responses) {
  const items = questions(variant).map(question => ({ ...question, correct: Boolean(responses[question.concept.key] && evaluateExercise(question.exercise, responses[question.concept.key], 1).correct) }));
  const score = items.filter(item => item.correct).length;
  const failedCritical = items.filter(item => item.concept.critical && !item.correct);
  return { variant, items, score, maxScore: items.length, failedCritical, passed: score * 100 >= items.length * 80 && failedCritical.length === 0 };
}
export function completeLesson(evidence: LearningEvidenceV1, slug: LessonSlug, time: string) {
  const ids = questions(0).filter(question => question.concept.lesson === slug).map(question => question.exercise.objectiveIds[0]);
  const activity = `${MODULE}.${slug}.activity`;
  const complete = [...ids, activity].every(id => evidence.objectives[id]?.completed);
  return markLessonState(evidence, `${MODULE}.${slug}`, complete ? "completed" : "started", complete ? [...ids, activity] : [], time);
}
export function commit(evidence: LearningEvidenceV1, result: ReturnType<typeof grade>, id: string, time: string) {
  if (evidence.assessmentAttempts.some(attempt => attempt.id === id)) return evidence;
  const objectiveIds = result.items.filter(item => item.correct).map(item => item.exercise.objectiveIds[0]);
  let next = recordAssessmentAttempt(evidence, { id, assessmentId: ASSESSMENT, variantId: `v${result.variant+1}`, score: result.score, maxScore: result.maxScore, objectiveIds, submittedAt: time }, Number.MAX_SAFE_INTEGER);
  const retained = new Set(next.assessmentAttempts.filter(attempt => attempt.assessmentId === ASSESSMENT).slice(-20).map(attempt => attempt.id));
  next = { ...next, assessmentAttempts: next.assessmentAttempts.filter(attempt => attempt.assessmentId !== ASSESSMENT || retained.has(attempt.id)) };
  for (const objective of objectiveIds) next = recordObjectiveCompletion(next, objective, id, time);
  next = markLessonState(next, `${MODULE}.assessment`, "assessed", objectiveIds, time);
  if (result.passed) for (const objective of [...objectiveIds, MASTERY]) next = awardMastery(next, { id: `${id}:${objective}`, objectiveId: objective, sourceType: "assessment", sourceId: ASSESSMENT, level: 2, awardedAt: time });
  return next;
}
