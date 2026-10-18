export const EVIDENCE_SCHEMA_VERSION = "1.0.0" as const;
export const evidenceStorageKey = (scopeId: string) => `ml-math-lab:evidence:${scopeId}:v1`;

export type LearningState = "visited" | "started" | "completed" | "assessed" | "mastered";
export type LessonEvidence = { state: Exclude<LearningState, "mastered">; completedObjectiveIds: string[]; updatedAt: string };
export type ObjectiveEvidence = { completed: boolean; mastered: boolean; evidenceIds: string[]; updatedAt: string };
export type AssessmentAttempt = { id: string; assessmentId: string; variantId: string; score: number; maxScore: number; objectiveIds: string[]; submittedAt: string };
export type MasteryEvidence = { id: string; objectiveId: string; sourceType: "assessment" | "project"; sourceId: string; level: 1 | 2 | 3; awardedAt: string };
export type ProjectMilestoneEvidence = { projectId: string; milestoneId: string; completed: boolean; evidenceId?: string; updatedAt: string };

export type LearningEvidenceV1 = {
  schemaVersion: typeof EVIDENCE_SCHEMA_VERSION;
  curriculumVersion: string;
  lessons: Record<string, LessonEvidence>;
  objectives: Record<string, ObjectiveEvidence>;
  assessmentAttempts: AssessmentAttempt[];
  masteryEvidence: MasteryEvidence[];
  projectMilestones: ProjectMilestoneEvidence[];
};

export const createEmptyEvidence = (curriculumVersion: string): LearningEvidenceV1 => ({ schemaVersion: EVIDENCE_SCHEMA_VERSION, curriculumVersion, lessons: {}, objectives: {}, assessmentAttempts: [], masteryEvidence: [], projectMilestones: [] });
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const validDate = (value: unknown) => typeof value === "string" && !Number.isNaN(Date.parse(value));
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
const lessonState = (value: unknown) => value === "visited" || value === "started" || value === "completed" || value === "assessed";

export function validateLearningEvidence(value: unknown): value is LearningEvidenceV1 {
  if (!isRecord(value) || value.schemaVersion !== EVIDENCE_SCHEMA_VERSION || typeof value.curriculumVersion !== "string" || !isRecord(value.lessons) || !isRecord(value.objectives) || !Array.isArray(value.assessmentAttempts) || !Array.isArray(value.masteryEvidence) || !Array.isArray(value.projectMilestones)) return false;
  if (!Object.values(value.lessons).every((item) => isRecord(item) && lessonState(item.state) && strings(item.completedObjectiveIds) && validDate(item.updatedAt))) return false;
  if (!Object.values(value.objectives).every((item) => isRecord(item) && typeof item.completed === "boolean" && typeof item.mastered === "boolean" && strings(item.evidenceIds) && validDate(item.updatedAt))) return false;
  if (!value.assessmentAttempts.every((item) => isRecord(item) && typeof item.id === "string" && typeof item.assessmentId === "string" && typeof item.variantId === "string" && typeof item.score === "number" && Number.isFinite(item.score) && typeof item.maxScore === "number" && Number.isFinite(item.maxScore) && item.score >= 0 && item.maxScore > 0 && item.score <= item.maxScore && strings(item.objectiveIds) && validDate(item.submittedAt))) return false;
  if (!value.masteryEvidence.every((item) => isRecord(item) && typeof item.id === "string" && typeof item.objectiveId === "string" && (item.sourceType === "assessment" || item.sourceType === "project") && typeof item.sourceId === "string" && (item.level === 1 || item.level === 2 || item.level === 3) && validDate(item.awardedAt))) return false;
  return value.projectMilestones.every((item) => isRecord(item) && typeof item.projectId === "string" && typeof item.milestoneId === "string" && typeof item.completed === "boolean" && (item.evidenceId === undefined || typeof item.evidenceId === "string") && validDate(item.updatedAt));
}

export function parseLearningEvidence(raw: string | null, curriculumVersion: string): LearningEvidenceV1 {
  if (!raw) return createEmptyEvidence(curriculumVersion);
  try {
    const value: unknown = JSON.parse(raw);
    if (!validateLearningEvidence(value)) return createEmptyEvidence(curriculumVersion);
    return { ...value, curriculumVersion };
  } catch { return createEmptyEvidence(curriculumVersion); }
}

export function markLessonState(evidence: LearningEvidenceV1, lessonId: string, state: LessonEvidence["state"], objectiveIds: string[], now: string): LearningEvidenceV1 {
  if (!validDate(now)) throw new Error("Evidence timestamp must be an ISO-compatible date.");
  const order: LessonEvidence["state"][] = ["visited", "started", "completed", "assessed"];
  const previous = evidence.lessons[lessonId];
  const nextState = previous && order.indexOf(previous.state) > order.indexOf(state) ? previous.state : state;
  return { ...evidence, lessons: { ...evidence.lessons, [lessonId]: { state: nextState, completedObjectiveIds: [...new Set([...(previous?.completedObjectiveIds ?? []), ...objectiveIds])], updatedAt: now } } };
}

export function recordAssessmentAttempt(evidence: LearningEvidenceV1, attempt: AssessmentAttempt, maxAttempts = 20): LearningEvidenceV1 {
  if (!Number.isFinite(attempt.score) || !Number.isFinite(attempt.maxScore) || attempt.maxScore <= 0 || attempt.score < 0 || attempt.score > attempt.maxScore || !validDate(attempt.submittedAt)) throw new Error("Invalid assessment attempt.");
  return { ...evidence, assessmentAttempts: [...evidence.assessmentAttempts, attempt].slice(-maxAttempts) };
}

export function awardMastery(evidence: LearningEvidenceV1, mastery: MasteryEvidence): LearningEvidenceV1 {
  if (!validDate(mastery.awardedAt)) throw new Error("Invalid mastery timestamp.");
  const existing = evidence.objectives[mastery.objectiveId];
  return {
    ...evidence,
    objectives: { ...evidence.objectives, [mastery.objectiveId]: { completed: existing?.completed ?? true, mastered: true, evidenceIds: [...new Set([...(existing?.evidenceIds ?? []), mastery.id])], updatedAt: mastery.awardedAt } },
    masteryEvidence: [...evidence.masteryEvidence.filter(({ id }) => id !== mastery.id), mastery],
  };
}

export function recordObjectiveCompletion(evidence: LearningEvidenceV1, objectiveId: string, evidenceId: string, now: string): LearningEvidenceV1 {
  if (!validDate(now)) throw new Error("Invalid objective evidence timestamp.");
  const existing = evidence.objectives[objectiveId];
  return { ...evidence, objectives: { ...evidence.objectives, [objectiveId]: { completed: true, mastered: existing?.mastered ?? false, evidenceIds: [...new Set([...(existing?.evidenceIds ?? []), evidenceId])], updatedAt: now } } };
}

export function recordProjectMilestone(evidence: LearningEvidenceV1, milestone: ProjectMilestoneEvidence): LearningEvidenceV1 {
  if (!validDate(milestone.updatedAt)) throw new Error("Invalid milestone timestamp.");
  return { ...evidence, projectMilestones: [...evidence.projectMilestones.filter((item) => !(item.projectId === milestone.projectId && item.milestoneId === milestone.milestoneId)), milestone] };
}

export type LegacyDerivativeProgress = { completed: string[]; mastered: boolean; bestScore: number };
export function migrateDerivativeProgress(legacy: LegacyDerivativeProgress, now: string, curriculumVersion = "v1"): LearningEvidenceV1 {
  let evidence = createEmptyEvidence(curriculumVersion);
  for (const moduleId of legacy.completed) evidence = markLessonState(evidence, `derivatives.${moduleId}`, moduleId === "mastery" ? "assessed" : "completed", [], now);
  if (legacy.mastered) evidence = awardMastery(evidence, { id: "legacy-derivatives-mastery", objectiveId: "calculus.derivatives.transfer", sourceType: "assessment", sourceId: "derivatives.mastery.v1", level: legacy.bestScore >= 5 ? 3 : 2, awardedAt: now });
  return evidence;
}
