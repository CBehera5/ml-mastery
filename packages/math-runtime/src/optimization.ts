import { centralDerivative } from "./calculus";
import { featureScalingTrace, regressionGradientCheck, regressionTrainingTrace } from "./regression";
export const OPTIMIZATION_CONTRACT = "optimization.v1" as const;
export type ObjectiveKind = "quadratic" | "anisotropic" | "coupled" | "saddle" | "double-well";
export type OptimizationInput = { kind: ObjectiveKind; point: [number,number]; scale: number; penalty: number };
function validateSettings(input: OptimizationInput) {
  if(!["quadratic","anisotropic","coupled","saddle","double-well"].includes(input.kind)||!Array.isArray(input.point)||input.point.length!==2||!Array.from(input.point).every(value=>Number.isFinite(value)&&Math.abs(value)<=1e6))throw new Error("Choose a known objective and two finite coordinates within ±10^6.");
  if(!Number.isFinite(input.scale)||input.scale<1||input.scale>100||!Number.isFinite(input.penalty)||input.penalty<0||input.penalty>10)throw new Error("Scale must be 1–100 and penalty 0–10.");
  if(input.kind!=="quadratic"&&input.penalty!==0)throw new Error("This bounded penalty comparison applies only to the quadratic objective.");
}
function objectiveValues(input: OptimizationInput) {
  const [first,second]=input.point;
  let dataLoss:number, dataGradient:[number,number];
  if(input.kind==="coupled"){dataLoss=(first+second)**2;dataGradient=[2*(first+second),2*(first+second)];}
  else if(input.kind==="saddle"){dataLoss=first**2-second**2;dataGradient=[2*first,-2*second];}
  else if(input.kind==="double-well"){dataLoss=(first**2-1)**2+second**2;dataGradient=[4*first*(first**2-1),2*second];}
  else {const curvature=input.kind==="anisotropic"?input.scale:1;dataLoss=(first-3)**2+curvature*second**2;dataGradient=[2*(first-3),2*curvature*second];}
  const penaltyLoss=input.penalty*(first**2+second**2);
  return {dataLoss,penaltyLoss,totalLoss:dataLoss+penaltyLoss,gradient:[dataGradient[0]+2*input.penalty*first,dataGradient[1]+2*input.penalty*second] as [number,number]};
}
export function optimizationState(input: OptimizationInput) {
  validateSettings(input);
  const values=objectiveValues(input);
  if(![values.dataLoss,values.penaltyLoss,values.totalLoss,...values.gradient].every(Number.isFinite))throw new Error("Objective calculation became nonfinite.");
  const numerical=input.point.map((coordinate,index)=>centralDerivative(value=>{const point:[number,number]=[...input.point];point[index]=value;return objectiveValues({...input,point}).totalLoss;},coordinate));
  const maxAbsoluteError=Math.max(...values.gradient.map((value,index)=>Math.abs(value-numerical[index])));
  const tolerance=1e-6*Math.max(1,...values.gradient.map(Math.abs));
  return {contract:OPTIMIZATION_CONTRACT,...input,point:[...input.point],...values,gradientNorm:Math.hypot(...values.gradient),numericalGradient:numerical,gradientCheck:{passed:maxAbsoluteError<=tolerance,maxAbsoluteError,tolerance}};
}
export type OptimizationEntry = {iteration:number;point:[number,number];dataLoss:number|null;penaltyLoss:number|null;totalLoss:number|null;gradient:[number,number]|null;status:"running"|"completed"|"diverged";terminationReason:null|"iterations_completed"|"numerical_limit_exceeded"|"non_finite_calculation"};
export function optimizationTrainingTrace(input: OptimizationInput,learningRate:number,iterations:number) {
  validateSettings(input);
  if(!Number.isFinite(learningRate)||learningRate<=0||learningRate>2||!Number.isInteger(iterations)||iterations<1||iterations>100||input.point.some(value=>Math.abs(value)>10))throw new Error("Use finite 0 < rate ≤ 2, 1–100 updates and starting coordinates within ±10.");
  let point:[number,number]=[...input.point];
  const entries:OptimizationEntry[]=[];
  for(let iteration=0;iteration<=iterations;iteration++){
    const values=objectiveValues({...input,point});
    const nonfinite=![...point,values.dataLoss,values.penaltyLoss,values.totalLoss,...values.gradient].every(Number.isFinite);
    const limited=point.some(value=>Math.abs(value)>1e6)||Math.abs(values.totalLoss)>1e12||values.gradient.some(value=>Math.abs(value)>1e8);
    if(nonfinite||limited){
      entries.push({iteration,point:[...point],dataLoss:null,penaltyLoss:null,totalLoss:null,gradient:null,status:"diverged",terminationReason:nonfinite?"non_finite_calculation":"numerical_limit_exceeded"});
      break;
    }
    entries.push({iteration,point:[...point],...values,status:iteration===iterations?"completed":"running",terminationReason:iteration===iterations?"iterations_completed":null});
    if(iteration===iterations)break;
    const next:[number,number]=[point[0]-learningRate*values.gradient[0],point[1]-learningRate*values.gradient[1]];
    if(!next.every(Number.isFinite)){
      entries[entries.length-1]={...entries[entries.length-1],status:"diverged",terminationReason:"non_finite_calculation"};
      break;
    }
    point=next;
  }
  const final=entries.at(-1)!;
  return {contract:OPTIMIZATION_CONTRACT,entryConvention:"state 0 is initial; state k follows k simultaneous updates",requestedIterations:iterations,learningRate,completedUpdates:final.iteration,status:final.status,terminationReason:final.terminationReason,entries};
}
export function optimizationSlice(input:OptimizationInput) {
  validateSettings(input);
  return Array.from({length:41},(_,index)=>{const coordinate=-5+index/4;return {coordinate,...objectiveValues({...input,point:[coordinate,input.point[1]]})};});
}
export function optimizationGrid(input:OptimizationInput) {
  validateSettings(input);
  return Array.from({length:121},(_,index)=>{
    const first=-5+index%11,second=-5+Math.floor(index/11);
    return {point:[first,second] as [number,number],...objectiveValues({...input,point:[first,second]})};
  });
}
export function optimizationRegressionComparison(learningRate:number,iterations:number) {
  if(!Number.isFinite(learningRate)||learningRate<=0||learningRate>1||!Number.isInteger(iterations)||iterations<1||iterations>40)throw new Error("Comparison uses 0 < rate ≤ 1 and 1–40 updates.");
  const rawFeatures=[[-20],[-10],[10],[20]],targets=[-4,-2,2,4];
  const scaling=featureScalingTrace(rawFeatures);
  const original={features:rawFeatures,targets,weights:[0],bias:0},scaled={...original,features:scaling.scaled};
  return {contract:OPTIMIZATION_CONTRACT,scaling,original:regressionTrainingTrace(original,learningRate,iterations),scaled:regressionTrainingTrace(scaled,learningRate,iterations),gradientChecks:{original:regressionGradientCheck(original),scaled:regressionGradientCheck(scaled)}};
}
