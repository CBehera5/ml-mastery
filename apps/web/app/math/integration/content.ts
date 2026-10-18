import {matrixVectorTrace,regressionEvaluationTrace,regressionGradientCheck,regressionUpdateTrace,summaryTrace} from "@mlmath/runtime";
import type {ConceptualExercise,NumericalExercise} from "../../learn/foundation/exercises";
export const INTEGRATION_VERSION="math.integration.v1";
export const INTEGRATION_KEY="ml-math-lab:evidence:math.integration:v1";
export function modelingScenario(area=2,age=10,weight=100,bias=50,rate=.001) {
  if(![area,age,weight,bias,rate].every(Number.isFinite)||area<1||area>3||age<0||age>20||weight<80||weight>120||bias<40||bias>80||rate<.0005||rate>.01)throw new Error("Use the bounded fictional scenario controls.");
  const input={features:[[area,age]],targets:[250],weights:[weight,-2],bias};
  const batch={features:[[2,10],[1,5],[3,15]],targets:[250,160,310],weights:[weight,-2],bias};
  const evaluation=regressionEvaluationTrace(input);
  const batchEvaluation=regressionEvaluationTrace(batch);
  return {input,evaluation,batchEvaluation,matrix:matrixVectorTrace({matrix:batch.features,vector:input.weights}),update:regressionUpdateTrace(input,rate),check:regressionGradientCheck(input),residualSummary:summaryTrace(batchEvaluation.rows.map(row=>row.residual),"sample")};
}
export const subjectLinks=[
  {title:"Algebra",route:"/math/algebra-functions",recall:"Variables, functions and target units"},
  {title:"Linear Algebra",route:"/math/linear-algebra",recall:"Ordered feature vectors and compatible matrix products"},
  {title:"Calculus",route:"/math/derivatives",recall:"Local sensitivities; historical mastery stays valid for its original scope"},
  {title:"Probability",route:"/math/probability",recall:"Uncertainty needs a probability model; a point estimate is not one"},
  {title:"Statistics",route:"/math/statistics",recall:"Summarize paired errors without causal or population overclaims"},
  {title:"Optimization",route:"/math/optimization",recall:"Signed simultaneous updates and honest finite-run claims"},
];
export function transferChecks(variant:0|1) {
  const reference=modelingScenario(2,10,variant===0?100:90,variant===0?50:60);
  const checks:{key:string;exercise:ConceptualExercise|NumericalExercise;route:string}[]=[];
  function add(key:string,prompt:string,expected:number|string,explanation:string,route:string,options?:[string,string][]) {
    const base={schemaVersion:"1.0.0" as const,id:`math.integration.${key}.v${variant+1}`,version:"1.0.0",objectiveIds:[`math.integration.${key}`],prompt,points:1,retry:{maxAttempts:2,variantIds:["v1","v2"]},feedback:{correct:`Correct. ${explanation}`,incorrect:`Review: ${explanation}`,exhausted:explanation}};
    checks.push({key,route,exercise:typeof expected==="number"?{...base,kind:"numerical",expected,absoluteTolerance:.00001}:{...base,kind:"conceptual",options:options!.map(([id,label])=>({id,label})),expectedOptionId:expected}});
  }
  add("prediction",`For area=2, age=10, area weight=${reference.input.weights[0]}, age weight=−2 and bias=${reference.input.bias}, predict price in fictional $k.`,reference.evaluation.rows[0].prediction,"Multiply each ordered feature by its own weight, then add bias once.","/math/algebra-functions/graphs");
  add("dimensions","A dataset matrix is 3×2. What length must a compatible coefficient vector have?",2,"The two columns are features; the result has one value per row. Bias is added afterward.","/math/matrices-multiplication");
  add("gradient",`For the single observation above with target 250, what is the MSE gradient with respect to the area weight?`,reference.update.gradient.weightGradients[0],"For one row, the weight gradient is 2 × residual × area, using the original parameter state.","/math/derivatives#calculus-essentials");
  add("summary",`With the same weights/bias, three fixed comparison rows have residuals [${reference.batchEvaluation.rows.map(row=>row.residual).join(", ")}]. What is their signed mean?`,reference.residualSummary.mean,"This summarizes these three fictional rows, not all houses; signed errors can cancel.","/math/statistics/center");
  add("uncertainty","Can this point-price equation alone tell us P(actual price > 250)?","no","A scalar estimate alone does not specify a probability distribution, calibration or interval coverage.","/math/probability/ml",[["no","No: that requires a justified uncertainty model and evidence."],["yes","Yes: any price estimate is automatically a probability."]]);
  add("causation","The age coefficient is −2. Does this fitted/preset association alone prove that changing age causes a $2k price change?","no","Holding input coordinates fixed in a mathematical formula is not a real-world causal intervention.","/math/statistics/relationships",[["no","No: association or model sensitivity alone does not identify a causal effect."],["yes","Yes: a coefficient proves causation."]]);
  add("update","Using η=0.001 and all original gradients above, what is the new area weight?",reference.update.updatedParameters.weights[0],"Compute the whole original gradient first; subtract η times each component simultaneously.","/math/optimization/updates");
  add("claim","One update reduces this observation's training loss. What may we claim?","limited","Only inspected one-step training progress. It does not establish convergence, unseen-data performance, causality or track mastery.","/math/optimization/stability",[["limited","One-step progress on this supplied observation only."],["all","The complete Math track and generalization are now mastered."]]);
  return checks;
}
