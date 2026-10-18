export const CURRICULUM_SCHEMA_VERSION = "1.0.0" as const;

export type CurriculumPhaseKind = "mathematics" | "python" | "supervised-ml" | "projects";
export type ImplementationStatus = "planned" | "partial" | "implemented" | "verified";
export type Availability = "upcoming" | "available" | "private-preview" | "retired";
export type LessonKind = "learn" | "lab" | "practice" | "debug" | "project" | "assessment";
export type EvidenceKind = "interaction" | "exercise" | "assessment" | "project-milestone" | "self-check";

export type PrerequisiteRef = {
  kind: "module" | "lesson" | "objective";
  id: string;
  recommended: boolean;
};

export type CurriculumPhase = {
  id: string;
  kind: CurriculumPhaseKind;
  title: string;
  order: number;
  estimatedMinutes: number;
  status: ImplementationStatus;
  availability: Availability;
};

export type CurriculumModule = {
  id: string;
  phaseId: string;
  title: string;
  summary: string;
  order: number;
  estimatedMinutes: number;
  status: ImplementationStatus;
  availability: Availability;
  prerequisiteRefs: PrerequisiteRef[];
  objectiveIds: string[];
};

export type LearningObjective = {
  id: string;
  moduleId: string;
  statement: string;
  evidenceKinds: EvidenceKind[];
  masteryRequired: boolean;
  remediationLessonIds: string[];
};

export type CurriculumLesson = {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  kind: LessonKind;
  order: number;
  route: string;
  estimatedMinutes: number;
  status: ImplementationStatus;
  availability: Availability;
  prerequisiteRefs: PrerequisiteRef[];
  objectiveIds: string[];
  labIds: string[];
  exerciseIds: string[];
  assessmentIds: string[];
  projectIds: string[];
};

export type LabDefinition = { id: string; lessonId: string; title: string; status: ImplementationStatus; runtimeContract?: string };
export type AssessmentDefinition = { id: string; lessonId: string; objectiveIds: string[]; variantIds: string[]; status: ImplementationStatus };
export type ProjectDefinition = { id: string; title: string; mode: "guided" | "independent"; milestoneIds: string[]; status: ImplementationStatus };

export type CurriculumCatalogV1 = {
  schemaVersion: typeof CURRICULUM_SCHEMA_VERSION;
  catalogId: string;
  catalogVersion: string;
  phases: CurriculumPhase[];
  modules: CurriculumModule[];
  lessons: CurriculumLesson[];
  objectives: LearningObjective[];
  labs: LabDefinition[];
  exerciseIds: string[];
  assessments: AssessmentDefinition[];
  projects: ProjectDefinition[];
};

export type ValidationResult = { valid: true; errors: [] } | { valid: false; errors: string[] };

const finiteNonNegative = (value: number) => Number.isFinite(value) && value >= 0;
const duplicateIds = (items: { id: string }[]) => items.map(({ id }) => id).filter((id, index, ids) => ids.indexOf(id) !== index);

export function validateCurriculumCatalog(catalog: CurriculumCatalogV1): ValidationResult {
  const errors: string[] = [];
  if (catalog.schemaVersion !== CURRICULUM_SCHEMA_VERSION) errors.push("Unsupported curriculum schema version.");
  if (!catalog.catalogId.trim() || !catalog.catalogVersion.trim()) errors.push("Catalog ID and version are required.");
  const collections = [catalog.phases, catalog.modules, catalog.lessons, catalog.objectives, catalog.labs, catalog.assessments, catalog.projects];
  for (const collection of collections) for (const id of duplicateIds(collection)) errors.push(`Duplicate curriculum ID: ${id}.`);
  const phaseIds = new Set(catalog.phases.map(({ id }) => id));
  const moduleIds = new Set(catalog.modules.map(({ id }) => id));
  const lessonIds = new Set(catalog.lessons.map(({ id }) => id));
  const objectiveIds = new Set(catalog.objectives.map(({ id }) => id));
  const labIds = new Set(catalog.labs.map(({ id }) => id));
  const assessmentIds = new Set(catalog.assessments.map(({ id }) => id));
  const projectIds = new Set(catalog.projects.map(({ id }) => id));
  const exerciseIds = new Set(catalog.exerciseIds);
  for (const phase of catalog.phases) if (!finiteNonNegative(phase.estimatedMinutes)) errors.push(`Invalid estimated time for ${phase.id}.`);
  for (const module of catalog.modules) {
    if (!phaseIds.has(module.phaseId)) errors.push(`Unknown phase ${module.phaseId} for module ${module.id}.`);
    if (!finiteNonNegative(module.estimatedMinutes)) errors.push(`Invalid estimated time for ${module.id}.`);
    for (const id of module.objectiveIds) if (!objectiveIds.has(id)) errors.push(`Unknown objective ${id} for module ${module.id}.`);
  }
  for (const objective of catalog.objectives) if (!moduleIds.has(objective.moduleId)) errors.push(`Unknown module ${objective.moduleId} for objective ${objective.id}.`);
  for (const lesson of catalog.lessons) {
    if (!moduleIds.has(lesson.moduleId)) errors.push(`Unknown module ${lesson.moduleId} for lesson ${lesson.id}.`);
    if (!finiteNonNegative(lesson.estimatedMinutes)) errors.push(`Invalid estimated time for ${lesson.id}.`);
    for (const id of lesson.objectiveIds) if (!objectiveIds.has(id)) errors.push(`Unknown objective ${id} for lesson ${lesson.id}.`);
    for (const id of lesson.labIds) if (!labIds.has(id)) errors.push(`Unknown lab ${id} for lesson ${lesson.id}.`);
    for (const id of lesson.exerciseIds) if (!exerciseIds.has(id)) errors.push(`Unknown exercise ${id} for lesson ${lesson.id}.`);
    for (const id of lesson.assessmentIds) if (!assessmentIds.has(id)) errors.push(`Unknown assessment ${id} for lesson ${lesson.id}.`);
    for (const id of lesson.projectIds) if (!projectIds.has(id)) errors.push(`Unknown project ${id} for lesson ${lesson.id}.`);
  }
  for (const lab of catalog.labs) if (!lessonIds.has(lab.lessonId)) errors.push(`Unknown lesson ${lab.lessonId} for lab ${lab.id}.`);
  for (const assessment of catalog.assessments) if (!lessonIds.has(assessment.lessonId)) errors.push(`Unknown lesson ${assessment.lessonId} for assessment ${assessment.id}.`);
  const allIds = new Set([...moduleIds, ...lessonIds, ...objectiveIds]);
  for (const owner of [...catalog.modules, ...catalog.lessons]) for (const prerequisite of owner.prerequisiteRefs) if (!allIds.has(prerequisite.id)) errors.push(`Unknown prerequisite ${prerequisite.id} for ${owner.id}.`);
  return errors.length ? { valid: false, errors } : { valid: true, errors: [] };
}

export function isShipped(status: ImplementationStatus) {
  return status === "implemented" || status === "verified";
}
