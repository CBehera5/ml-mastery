import {calculusExtensionModule,calculusExtensionLesson,calculusExtensionObjectives,calculusExtensionLabs,calculusExtensionExercises,calculusExtensionAssessment} from "../../math/derivatives/extension-catalog";
import {geometryObjectives,geometryLessons,geometryLabs,moduleAssessment,geometryExerciseIds} from "../../math/linear-algebra/geometry-catalog";
import {linearAlgebraModule,linearAlgebraLessons,linearAlgebraObjectives,linearAlgebraLabs,linearAlgebraAssessment,linearAlgebraExerciseIds} from "../../math/linear-algebra/catalog";
import {algebraModule,algebraLessons,algebraObjectives,algebraLabs,algebraAssessment,algebraExerciseIds} from "../../math/algebra-functions/catalog";
import { ASSESSMENT_ID, BLUEPRINT, MASTERY_OBJECTIVES, assessmentQuestions } from "../../algorithms/linear-regression/mastery/assessment";
import { PROJECT_ID, PROJECT_OBJECTIVES, projectExercises, STAGES } from "../../algorithms/linear-regression/project/project-model";
import { INSTRUCTIONS, INSTRUCTIONAL_IDS, INSTRUCTIONAL_OUTCOMES, instructionalObjectiveIds, type InstructionalId } from "../../algorithms/linear-regression/lessons/instructional-content";
import { DERIVATIVE_MODULES } from "../../math/derivatives/curriculum";
import { regressionLessonStatus, REGRESSION_LESSONS } from "../../algorithms/linear-regression/curriculum";
import { REGRESSION_KIND_EXERCISE, SIZE_PREDICTION_EXERCISE, SUITABILITY_EXERCISE, WHY_OBJECTIVES } from "../../algorithms/linear-regression/lessons/why-content";
import { ERRORS_EXERCISES, ERRORS_OBJECTIVES } from "../../algorithms/linear-regression/lessons/errors-content";
import { IMPLEMENTATION_EXERCISES, IMPLEMENTATION_OBJECTIVES } from "../../algorithms/linear-regression/lessons/implementation-content";
import type { CurriculumCatalogV1, CurriculumLesson, ImplementationStatus } from "./curriculum";
import { probabilityModule, probabilityLessons, probabilityObjectives, probabilityLabs, probabilityExerciseIds, probabilityAssessment } from "../../math/probability/catalog";
import { statisticsModule, statisticsLessons, statisticsObjectives, statisticsLabs, statisticsExerciseIds, statisticsAssessment } from "../../math/statistics/catalog";
import { optimizationModule, optimizationLessons, optimizationObjectives, optimizationLabs, optimizationExerciseIds, optimizationAssessment } from "../../math/optimization/catalog";
import {integrationModule,integrationLesson,integrationObjectives,integrationLab,integrationExercises} from "../../math/integration/catalog";

const regressionStatus = (id: (typeof REGRESSION_LESSONS)[number]["id"]): ImplementationStatus => regressionLessonStatus(id);
const regressionObjectiveIds = (id: (typeof REGRESSION_LESSONS)[number]["id"]) => id === "mastery" ? MASTERY_OBJECTIVES : id === "project" ? PROJECT_OBJECTIVES : id === "why" ? Object.values(WHY_OBJECTIVES) : id === "errors" ? Object.values(ERRORS_OBJECTIVES) : id === "implementation" ? Object.values(IMPLEMENTATION_OBJECTIVES) : INSTRUCTIONAL_IDS.includes(id as InstructionalId) ? instructionalObjectiveIds(id as InstructionalId) : [`linear-regression.${id}.objective`];
const regressionExerciseIds = (id: (typeof REGRESSION_LESSONS)[number]["id"]) => id === "mastery" ? BLUEPRINT.variantIds.flatMap(variant=>assessmentQuestions(variant).map(question=>question.exercise.id)) : id === "project" ? projectExercises(null,"area-age").flat().map(check=>check.id) : id === "why" ? [SIZE_PREDICTION_EXERCISE.id, REGRESSION_KIND_EXERCISE.id, SUITABILITY_EXERCISE.id] : id === "errors" ? ERRORS_EXERCISES.map(({ id: exerciseId }) => exerciseId) : id === "implementation" ? IMPLEMENTATION_EXERCISES.map(({ id: exerciseId }) => exerciseId) : INSTRUCTIONAL_IDS.includes(id as InstructionalId) ? INSTRUCTIONS[id as InstructionalId].checks.map(check=>check.id) : [];

const derivativeLessons: CurriculumLesson[] = DERIVATIVE_MODULES.map((module, index) => ({
  id: `derivatives.${module.id}`,
  moduleId: "calculus.derivatives",
  title: module.title,
  summary: module.outcome,
  kind: module.kind,
  order: index + 1,
  route: "/math/derivatives",
  estimatedMinutes: module.minutes,
  status: "verified",
  availability: "available",
  prerequisiteRefs: [],
  objectiveIds: ["calculus.derivatives.transfer"],
  labIds: module.id === "lab" ? ["derivatives.slope-lab"] : [],
  exerciseIds: [],
  assessmentIds: module.id === "mastery" ? ["derivatives.mastery.v1"] : [],
  projectIds: [],
}));

const regressionLessons: CurriculumLesson[] = REGRESSION_LESSONS.map((lesson) => ({
  id: `linear-regression.${lesson.id}`,
  moduleId: "supervised.linear-regression",
  title: lesson.title,
  summary: lesson.summary,
  kind: lesson.type,
  order: lesson.number,
  route: `/algorithms/linear-regression/${lesson.id}`,
  estimatedMinutes: Number.parseInt(lesson.duration, 10),
  status: regressionStatus(lesson.id),
  availability: "available",
  prerequisiteRefs: lesson.id === "gradient-descent" ? [{ kind: "module", id: "calculus.derivatives", recommended: true }] : [],
  objectiveIds: regressionObjectiveIds(lesson.id),
  labIds: ["equation", "errors", "gradient-descent", "multiple-features", "failure-modes"].includes(lesson.id) ? [`linear-regression.${lesson.id}.lab`] : [],
  exerciseIds: regressionExerciseIds(lesson.id),
  assessmentIds: lesson.id === "mastery" ? [ASSESSMENT_ID] : [],
  projectIds: lesson.id === "project" ? [PROJECT_ID] : [],
}));

export const REFERENCE_CURRICULUM: CurriculumCatalogV1 = {
  schemaVersion: "1.0.0",
  catalogId: "ml-math-lab.reference",
  catalogVersion: "1.5.0",
  phases: [
    { id: "phase.math", kind: "mathematics", title: "Mathematics for ML", order: 1, estimatedMinutes: 194, status: "partial", availability: "available" },
    { id: "phase.supervised", kind: "supervised-ml", title: "Supervised ML", order: 3, estimatedMinutes: 167, status: "partial", availability: "available" },
  ],
  modules: [
    integrationModule,
    optimizationModule,
    statisticsModule,
    probabilityModule,
    algebraModule,
    calculusExtensionModule,
    {...linearAlgebraModule,title:"Linear Algebra",summary:"Core vector/matrix computations, geometric transformations, independent directions, undo and introductory eigen/PCA intuition.",estimatedMinutes:200,objectiveIds:[...linearAlgebraModule.objectiveIds,...geometryObjectives.map(objective=>objective.id)]},
    { id: "calculus.derivatives", phaseId: "phase.math", title: "Derivatives pilot", summary: "Preserved scalar-derivative pilot; paired with Calculus essentials. Full accessibility acceptance remains open.", order: 1, estimatedMinutes: 84, status: "implemented", availability: "available", prerequisiteRefs: [], objectiveIds: ["calculus.derivatives.transfer"] },
    { id: "supervised.linear-regression", phaseId: "phase.supervised", title: "Linear Regression", summary: "Prediction, evaluation, optimization, implementation, and limitations.", order: 1, estimatedMinutes: 167, status: "implemented", availability: "available", prerequisiteRefs: [{ kind: "module", id: "calculus.derivatives", recommended: true }], objectiveIds: REGRESSION_LESSONS.flatMap(({ id }) => regressionObjectiveIds(id)) },
  ],
  lessons: [integrationLesson,...optimizationLessons,...statisticsLessons,...probabilityLessons,calculusExtensionLesson,...geometryLessons,...linearAlgebraLessons, ...algebraLessons, ...derivativeLessons, ...regressionLessons],
  objectives: [
    ...integrationObjectives,
    ...optimizationObjectives,
    ...statisticsObjectives,
    ...probabilityObjectives,
    ...calculusExtensionObjectives,
    ...geometryObjectives,
    ...linearAlgebraObjectives,
    ...algebraObjectives,
    { id: "calculus.derivatives.transfer", moduleId: "calculus.derivatives", statement: "Use local sensitivity to reason about and debug an ML loss.", evidenceKinds: ["interaction", "assessment"], masteryRequired: true, remediationLessonIds: ["derivatives.why", "derivatives.debug"] },
    { id: WHY_OBJECTIVES.frame, moduleId: "supervised.linear-regression", statement: "Frame a numerical prediction using observations, features, targets, and estimates.", evidenceKinds: ["interaction", "exercise"], masteryRequired: true, remediationLessonIds: ["linear-regression.why"] },
    { id: WHY_OBJECTIVES.distinguish, moduleId: "supervised.linear-regression", statement: "Distinguish regression outputs from classification outputs.", evidenceKinds: ["exercise"], masteryRequired: true, remediationLessonIds: ["linear-regression.why"] },
    { id: WHY_OBJECTIVES.decide, moduleId: "supervised.linear-regression", statement: "Identify when a linear model is or is not a defensible starting point.", evidenceKinds: ["exercise"], masteryRequired: true, remediationLessonIds: ["linear-regression.why", "linear-regression.failure-modes"] },
    { id: ERRORS_OBJECTIVES.residuals, moduleId: "supervised.linear-regression", statement: "Calculate signed residuals and interpret over- and underprediction.", evidenceKinds: ["exercise", "interaction"], masteryRequired: true, remediationLessonIds: ["linear-regression.errors"] },
    { id: ERRORS_OBJECTIVES.metrics, moduleId: "supervised.linear-regression", statement: "Compare MAE, MSE, and RMSE, including units and outlier sensitivity.", evidenceKinds: ["exercise", "interaction"], masteryRequired: true, remediationLessonIds: ["linear-regression.errors"] },
    { id: ERRORS_OBJECTIVES.evaluate, moduleId: "supervised.linear-regression", statement: "Choose evaluation evidence that supports claims about unseen data.", evidenceKinds: ["exercise"], masteryRequired: true, remediationLessonIds: ["linear-regression.errors"] },
    { id: IMPLEMENTATION_OBJECTIVES.translate, moduleId: "supervised.linear-regression", statement: "Translate prediction, residual, and metric operations into Python.", evidenceKinds: ["exercise"], masteryRequired: true, remediationLessonIds: ["linear-regression.implementation"] },
    { id: IMPLEMENTATION_OBJECTIVES.optimize, moduleId: "supervised.linear-regression", statement: "Implement and trace MSE gradients and gradient descent updates.", evidenceKinds: ["exercise"], masteryRequired: true, remediationLessonIds: ["linear-regression.implementation"] },
    { id: IMPLEMENTATION_OBJECTIVES.workflow, moduleId: "supervised.linear-regression", statement: "Use an honest train/test workflow for unseen predictions.", evidenceKinds: ["exercise"], masteryRequired: true, remediationLessonIds: ["linear-regression.implementation"] },
    ...BLUEPRINT.questions.map(question=>({id:question.objectiveId,moduleId:"supervised.linear-regression",statement:question.statement,evidenceKinds:["assessment" as const],masteryRequired:true,remediationLessonIds:[question.remediationRoute.replace("/learn/","").replaceAll("/",".")]})),
    ...STAGES.map(stage=>({ id:`linear-regression.project.${stage.id}`, moduleId:"supervised.linear-regression", statement:stage.objective, evidenceKinds:["exercise" as const,"project-milestone" as const], masteryRequired:false, remediationLessonIds:["linear-regression.project"] })),
    ...INSTRUCTIONAL_IDS.map(id=>({ id:`linear-regression.${id}.experiment`, moduleId:"supervised.linear-regression", statement:INSTRUCTIONS[id].experiment, evidenceKinds:["interaction" as const], masteryRequired:false, remediationLessonIds:[`linear-regression.${id}`] })),
    ...INSTRUCTIONAL_IDS.flatMap(id => INSTRUCTIONS[id].checks.map((check,index) => ({ id: check.objectiveIds[0], moduleId: "supervised.linear-regression", statement: INSTRUCTIONAL_OUTCOMES[id][index], evidenceKinds: ["exercise" as const], masteryRequired: true, remediationLessonIds: [`linear-regression.${id}`] }))),
    ...REGRESSION_LESSONS.filter(({ id }) => !["why", "errors", "implementation"].includes(id)).map((lesson) => ({ id: `linear-regression.${lesson.id}.objective`, moduleId: "supervised.linear-regression", statement: lesson.objective, evidenceKinds: ["interaction" as const, ...(lesson.id === "mastery" ? ["assessment" as const] : [])], masteryRequired: lesson.id === "mastery", remediationLessonIds: [`linear-regression.${lesson.id}`] })),
  ],
  labs: [
    integrationLab,
    ...optimizationLabs,
    ...statisticsLabs,
    ...probabilityLabs,
    ...calculusExtensionLabs,
    ...geometryLabs,
    ...linearAlgebraLabs,
    ...algebraLabs,
    { id: "derivatives.slope-lab", lessonId: "derivatives.lab", title: "Interactive Derivative Lab", status: "verified", runtimeContract: "calculus-trace.v1" },
    ...regressionLessons.filter(({ labIds }) => labIds.length > 0).map((lesson) => ({ id: `${lesson.id}.lab`, lessonId: lesson.id, title: lesson.title, status: lesson.status, runtimeContract: "regression-trace.v1" })),
  ],
  exerciseIds: [...integrationExercises,...optimizationExerciseIds,...statisticsExerciseIds,...probabilityExerciseIds,...calculusExtensionExercises,...geometryExerciseIds,...linearAlgebraExerciseIds,...algebraExerciseIds,SIZE_PREDICTION_EXERCISE.id, REGRESSION_KIND_EXERCISE.id, SUITABILITY_EXERCISE.id, ...ERRORS_EXERCISES.map(({ id }) => id), ...IMPLEMENTATION_EXERCISES.map(({ id }) => id), ...INSTRUCTIONAL_IDS.flatMap(id=>INSTRUCTIONS[id].checks.map(check=>check.id)),...projectExercises(null,"area-age").flat().map(check=>check.id),...BLUEPRINT.variantIds.flatMap(variant=>assessmentQuestions(variant).map(question=>question.exercise.id))],
  assessments: [optimizationAssessment,statisticsAssessment,probabilityAssessment,calculusExtensionAssessment,moduleAssessment,linearAlgebraAssessment,algebraAssessment,{ id: "derivatives.mastery.v1", lessonId: "derivatives.mastery", objectiveIds: ["calculus.derivatives.transfer"], variantIds: ["a", "b"], status: "verified" },{id:ASSESSMENT_ID,lessonId:"linear-regression.mastery",objectiveIds:MASTERY_OBJECTIVES,variantIds:BLUEPRINT.variantIds,status:"implemented"}],
  projects: [{id:PROJECT_ID,title:"Fictional housing prediction bridge",mode:"guided",milestoneIds:STAGES.map(stage=>stage.id),status:"implemented"}],
};
