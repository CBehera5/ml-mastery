import { awardMastery, createEmptyEvidence, evidenceStorageKey, markLessonState, recordAssessmentAttempt, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../learn/foundation/evidence";
import { evaluateExercise, type ConceptualExercise, type LearnerResponse, type NumericalExercise } from "../../learn/foundation/exercises";

export const EXTENSION_MODULE = "calculus.multivariable";
export const EXTENSION_KEY = evidenceStorageKey("math.calculus.extension");
export const EXTENSION_ASSESSMENT = "calculus.extension.assessment.v1";
export const EXTENSION_MASTERY = "calculus.extension.mastery.v1";
export const emptyExtension = () => createEmptyEvidence("calculus.extension.v1");
export type ExtensionCheck = { key: string; critical: boolean; introductory: boolean; exercise: NumericalExercise | ConceptualExercise };
export function extensionChecks(variant: 0 | 1): ExtensionCheck[] {
  const x = variant + 1, y = variant === 0 ? 2 : 1;
  const checks: ExtensionCheck[] = [];
  function add(key: string, prompt: string, expected: string | number, explanation: string, options?: string[], critical = false, introductory = false) {
    const base = { schemaVersion: "1.0.0" as const, id: `calculus.extension.${key}.v${variant + 1}`, version: "1.0.0", objectiveIds: [`calculus.extension.${key}`], prompt, points: 1, retry: { maxAttempts: 3, variantIds: ["v1", "v2"] }, feedback: { correct: `Correct. ${explanation}`, incorrect: `Review: ${explanation}`, exhausted: `Review: ${explanation}` } };
    checks.push({ key, critical, introductory, exercise: typeof expected === "number" ? { ...base, kind: "numerical", expected, absoluteTolerance: .001 } : { ...base, kind: "conceptual", expectedOptionId: `option-${options!.indexOf(expected)}`, options: options!.map((label, index) => ({ id: `option-${index}`, label })) } });
  }
  add("limit", variant === 0 ? "For (t²−1)/(t−1), what is the limit as t approaches 1?" : "For (t²−4)/(t−2), what is the limit as t approaches 2?", variant === 0 ? 2 : 4, "Factor the numerator. Away from the missing point the expression equals t+1 or t+2. A limit does not require the function to be defined at that point.", undefined, true);
  add("jump", "A function equals −1 to the left of 0 and +1 at and to the right of 0. Does a two-sided limit exist at 0?", "No: the left and right limits disagree", "Approaching from the left gives −1, while approaching from the right gives +1.", ["Yes: its assigned value is +1", "No: the left and right limits disagree", "Yes: average the two sides"], true);
  add("corner", "A symmetric difference gives 0 for |t| at 0. What can you conclude?", "The derivative is undefined: one-sided slopes are −1 and +1", "A central estimate can hide a corner. A derivative needs the same limiting slope from both sides.", ["The derivative is definitely zero", "The derivative is undefined: one-sided slopes are −1 and +1", "Every continuous function is differentiable"], true);
  add("continuity", "Which relationship is valid at a point?", "Differentiability implies continuity; continuity alone does not imply differentiability", "The corner |t| is continuous at zero but not differentiable there.", ["Continuity always implies differentiability", "Differentiability implies continuity; continuity alone does not imply differentiability", "A hole is continuous because its limit exists"]);
  add("partial-x", `For g(x,y)=x²+3y², what is ∂g/∂x at (${x},${y})?`, 2 * x, "Hold y fixed; only x² changes, so ∂g/∂x=2x.", undefined, true);
  add("partial-y", `For the same g, what is ∂g/∂y at (${x},${y})?`, 6 * y, "Hold x fixed; the y partial is 6y.");
  add("simultaneous", `For q=(x+y)² at (${x},${y}), use (x,y)−0.1∇q(x,y) with both partials from the original point. What is the new y?`, variant === 0 ? 1.4 : .4, "Both partials are 2(x+y)=6 at the original point. Subtract 0.6 from each coordinate; do not recompute the second partial after changing x.", undefined, true);
  add("direction", `At (${x},${y}), what is the directional derivative of g along the positive x unit direction [1,0]?`, 2 * x, "A directional derivative is ∇g·d for a unit direction d. It is a sensitivity, not the update displacement −η∇g.");
  add("stationary", "For s(x,y)=x²−y² at (0,0), the gradient is zero. Is this necessarily a local minimum?", "No: moving along y decreases the function, so this point is a saddle", "Along x the value rises; along y it falls. A zero gradient alone does not certify a minimum.", ["Yes: zero gradient proves a minimum", "No: moving along y decreases the function, so this point is a saddle", "The function has no derivatives"]);
  add("holding-fixed", "What does a partial derivative with respect to x measure?", "Change in the output as x changes while other inputs stay fixed", "A partial isolates one input coordinate. The gradient collects all scalar-output partials in input order.", ["Change in every input at once", "Change in the output as x changes while other inputs stay fixed", "The next parameter value"]);
  add("jacobian", `F(x,y)=[x+y,xy]. At (${x},${y}), what is Jacobian entry (output 2, input 1)?`, y, "Rows index outputs, columns index inputs: J=[[1,1],[y,x]]. Entry (2,1) is ∂(xy)/∂x=y.", undefined, false, true);
  add("hessian", "For g=x²+3y², what is the Hessian entry ∂²g/∂y²?", 6, "The Hessian is the input-by-input matrix of second partials for a scalar output: [[2,0],[0,6]].", undefined, false, true);
  return checks;
}
export const EXTENSION_BLUEPRINT = { version: "1.0.0", assessmentId: EXTENSION_ASSESSMENT, minimumPercent: 80, criticalKeys: extensionChecks(0).filter(check => check.critical).map(check => check.key), introductoryKeys: ["jacobian", "hessian"] };
export function gradeExtension(variant: 0 | 1, responses: Record<string, LearnerResponse>) {
  const items = extensionChecks(variant).map(check => ({ check, correct: Boolean(responses[check.key] && evaluateExercise(check.exercise, responses[check.key], 1).correct) }));
  const score = items.filter(item => item.correct).length;
  return { variant, items, score, passed: score >= 10 && items.filter(item => item.check.critical).every(item => item.correct) };
}
export function commitExtension(evidence: LearningEvidenceV1, result: ReturnType<typeof gradeExtension>, id: string, time: string) {
  if (evidence.assessmentAttempts.some(attempt => attempt.id === id)) return evidence;
  const objectiveIds = result.items.filter(item => item.correct).flatMap(item => item.check.exercise.objectiveIds);
  let next = recordAssessmentAttempt(evidence, { id, assessmentId: EXTENSION_ASSESSMENT, variantId: `v${result.variant + 1}`, score: result.score, maxScore: 12, objectiveIds, submittedAt: time }, Number.MAX_SAFE_INTEGER);
  const retained = new Set(next.assessmentAttempts.filter(attempt => attempt.assessmentId === EXTENSION_ASSESSMENT).slice(-20).map(attempt => attempt.id));
  next = { ...next, assessmentAttempts: next.assessmentAttempts.filter(attempt => attempt.assessmentId !== EXTENSION_ASSESSMENT || retained.has(attempt.id)) };
  for (const objective of objectiveIds) next = recordObjectiveCompletion(next, objective, id, time);
  if (result.passed) for (const objective of [...objectiveIds, EXTENSION_MASTERY]) next = awardMastery(next, { id: `${id}:${objective}`, objectiveId: objective, sourceType: "assessment", sourceId: EXTENSION_ASSESSMENT, level: 2, awardedAt: time });
  return markLessonState(next, "calculus.extension", "assessed", objectiveIds, time);
}
