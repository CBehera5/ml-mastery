import { describe, expect, it } from "vitest";
import { isShipped, validateCurriculumCatalog } from "./curriculum";
import { awardMastery, createEmptyEvidence, markLessonState, migrateDerivativeProgress, parseLearningEvidence, recordAssessmentAttempt, recordObjectiveCompletion, recordProjectMilestone } from "./evidence";
import { evaluateExercise, type ExerciseDefinition, validateExercise } from "./exercises";
import { REFERENCE_CURRICULUM } from "./reference-catalog";
import { CONCEPTS, CONCEPT_REGISTRY_VERSION, validateConceptRegistry } from "./concepts";

const NOW = "2026-10-15T00:00:00.000Z";
const base = { schemaVersion: "1.0.0" as const, version: "1.0.0", objectiveIds: ["objective.one"], points: 2, retry: { maxAttempts: 2, variantIds: ["retry-b"] }, feedback: { correct: "Correct", incorrect: "Try the hint", exhausted: "Review the explanation" } };

describe("versioned curriculum contracts", () => {
  it("validates the integrated Derivatives and Linear Regression reference catalog", () => expect(validateCurriculumCatalog(REFERENCE_CURRICULUM)).toEqual({ valid: true, errors: [] }));
  it("distinguishes planned, implemented, and verified lessons", () => {
    expect(REFERENCE_CURRICULUM.lessons.find(({ id }) => id === "linear-regression.project")?.status).toBe("implemented");
    expect(REFERENCE_CURRICULUM.lessons.find(({ id }) => id === "linear-regression.equation")?.status).toBe("verified");
    expect(REFERENCE_CURRICULUM.lessons.find(({ id }) => id === "linear-regression.implementation")?.status).toBe("verified");
    expect(REFERENCE_CURRICULUM.lessons.find(({ id }) => id === "derivatives.mastery")?.status).toBe("verified");
    expect(isShipped("planned")).toBe(false); expect(isShipped("verified")).toBe(true);
  });
  it("rejects broken references and duplicate IDs", () => {
    const broken = structuredClone(REFERENCE_CURRICULUM); broken.lessons[0].objectiveIds = ["missing"]; broken.phases.push(broken.phases[0]);
    const result = validateCurriculumCatalog(broken); expect(result.valid).toBe(false); if (!result.valid) expect(result.errors.join(" ")).toMatch(/Duplicate curriculum ID.*Unknown objective/);
  });
});

describe("shared concept registry", () => {
  it("keeps technical terms unique, defined, intuitive, and versioned", () => {
    expect(CONCEPT_REGISTRY_VERSION).toBe("1.0.0");
    expect(validateConceptRegistry(Object.values(CONCEPTS))).toEqual([]);
    expect(CONCEPTS.residual).toMatchObject({ term: "Residual", symbol: "r = ŷ − y" });
    expect(CONCEPTS.gradient.prerequisite?.href).toBe("/math/derivatives");
  });
});

describe("learning evidence and migrations", () => {
  it("keeps completion separate from mastery", () => {
    let completed = markLessonState(createEmptyEvidence("1.0.0"), "lesson.one", "completed", ["objective.one"], NOW);
    completed = recordObjectiveCompletion(completed, "objective.one", "exercise.one", NOW);
    expect(completed.lessons["lesson.one"].state).toBe("completed"); expect(completed.objectives["objective.one"]).toMatchObject({ completed: true, mastered: false }); expect(completed.masteryEvidence).toEqual([]);
  });
  it("never regresses an existing lesson state", () => {
    const assessed = markLessonState(createEmptyEvidence("1.0.0"), "lesson.one", "assessed", [], NOW);
    expect(markLessonState(assessed, "lesson.one", "visited", [], NOW).lessons["lesson.one"].state).toBe("assessed");
  });
  it("bounds attempts, validates scores, and awards explicit mastery", () => {
    let evidence = createEmptyEvidence("1.0.0");
    for (let i = 0; i < 3; i++) evidence = recordAssessmentAttempt(evidence, { id: `${i}`, assessmentId: "a", variantId: "v", score: i, maxScore: 3, objectiveIds: ["o"], submittedAt: NOW }, 2);
    expect(evidence.assessmentAttempts.map(({ id }) => id)).toEqual(["1", "2"]);
    evidence = awardMastery(evidence, { id: "m", objectiveId: "o", sourceType: "assessment", sourceId: "a", level: 2, awardedAt: NOW });
    expect(evidence.objectives.o.mastered).toBe(true); expect(evidence.masteryEvidence).toHaveLength(1);
  });
  it("records project milestones independently", () => {
    const evidence = recordProjectMilestone(createEmptyEvidence("1"), { projectId: "p", milestoneId: "data", completed: true, updatedAt: NOW });
    expect(evidence.projectMilestones).toEqual([{ projectId: "p", milestoneId: "data", completed: true, updatedAt: NOW }]);
  });
  it("fails safely on corrupt or unsupported stored data", () => {
    expect(parseLearningEvidence("broken", "current")).toEqual(createEmptyEvidence("current"));
    expect(parseLearningEvidence('{"schemaVersion":"2.0.0"}', "current")).toEqual(createEmptyEvidence("current"));
    expect(parseLearningEvidence('{"schemaVersion":"1.0.0","curriculumVersion":"old","lessons":{"x":{"state":"mastered"}},"objectives":{},"assessmentAttempts":[],"masteryEvidence":[],"projectMilestones":[]}', "current")).toEqual(createEmptyEvidence("current"));
  });
  it("migrates a copy of legacy Derivatives evidence without changing its shape", () => {
    const legacy = { completed: ["why", "mastery"], mastered: true, bestScore: 4 };
    const copy = structuredClone(legacy); const migrated = migrateDerivativeProgress(legacy, NOW);
    expect(legacy).toEqual(copy); expect(migrated.lessons["derivatives.why"].state).toBe("completed"); expect(migrated.objectives["calculus.derivatives.transfer"].mastered).toBe(true);
  });
});

describe("deterministic exercise evaluation", () => {
  const exercises: ExerciseDefinition[] = [
    { ...base, id: "concept", prompt: "Choose", kind: "conceptual", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], expectedOptionId: "b" },
    { ...base, id: "number", prompt: "Calculate", kind: "numerical", expected: 9, absoluteTolerance: 1e-9 },
    { ...base, id: "predict", prompt: "Predict", kind: "parameter-prediction", options: [{ id: "up", label: "Up" }, { id: "down", label: "Down" }], expectedOptionId: "down" },
    { ...base, id: "code", prompt: "Fill slots", kind: "constrained-code", slots: [{ id: "operator", allowedValues: ["+", "-"] }], expectedSlots: { operator: "-" } },
  ];
  it("validates all four supported exercise kinds", () => exercises.forEach((exercise) => expect(validateExercise(exercise)).toEqual([])));
  it("scores conceptual, numerical, prediction, and constrained code responses", () => {
    expect(evaluateExercise(exercises[0], { kind: "conceptual", optionId: "b" }, 1).score).toBe(2);
    expect(evaluateExercise(exercises[1], { kind: "numerical", value: 9.0000000001 }, 1).correct).toBe(true);
    expect(evaluateExercise(exercises[2], { kind: "parameter-prediction", optionId: "down" }, 1).correct).toBe(true);
    expect(evaluateExercise(exercises[3], { kind: "constrained-code", slots: { operator: "-" } }, 1).correct).toBe(true);
  });
  it("applies deterministic retry and exhausted feedback without executing code", () => {
    const first = evaluateExercise(exercises[3], { kind: "constrained-code", slots: { operator: "+" } }, 1);
    const final = evaluateExercise(exercises[3], { kind: "constrained-code", slots: { operator: "+" } }, 2);
    expect(first).toMatchObject({ retryAllowed: true, nextVariantId: "retry-b", feedback: "Try the hint" }); expect(final).toMatchObject({ retryAllowed: false, feedback: "Review the explanation" });
  });
});
