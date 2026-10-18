import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  featureScalingTrace,
  inverseTransformFeatures,
  predictBatch,
  predictOne,
  regressionEvaluationTrace,
  regressionGradientCheck,
  regressionGradientTrace,
  regressionMetrics,
  regressionResiduals,
  regressionTrainingTrace,
  regressionUpdateTrace,
  transformFeatures,
  type RegressionInput,
} from "../src";

type FixtureInput = RegressionInput & { learningRate:number; iterations:number };
const single:RegressionInput={features:[[1],[2],[3]],targets:[3,5,7],weights:[1],bias:0};
const expectCloseDeep=(actual:unknown,expected:unknown,tolerance=1e-9):void=>{if(typeof expected==="number"){expect(typeof actual).toBe("number");expect(Math.abs((actual as number)-expected)).toBeLessThanOrEqual(tolerance);}else if(Array.isArray(expected)){expect(Array.isArray(actual)).toBe(true);expect((actual as unknown[]).length).toBe(expected.length);expected.forEach((value,index)=>expectCloseDeep((actual as unknown[])[index],value,tolerance));}else if(expected&&typeof expected==="object"){Object.entries(expected).forEach(([key,value])=>expectCloseDeep((actual as Record<string,unknown>)[key],value,tolerance));}else expect(actual).toBe(expected)};

describe("dataset linear regression v1",()=>{
  it("predicts, calculates residuals, and reports MAE/MSE/RMSE",()=>{expect(predictOne([2,3],[1,2],1)).toBe(9);expect(predictBatch([[1],[2],[3]],[2],1)).toEqual([3,5,7]);expect(regressionResiduals([2,7,6],[3,5,7])).toEqual([-1,2,-1]);expect(regressionMetrics([-1,2,-1])).toEqual({mae:4/3,mse:2,rmse:Math.sqrt(2)})});
  it("uses the standard 2/m batch gradient",()=>{const trace=regressionGradientTrace(single);expect(trace.factor).toBeCloseTo(2/3,14);expect(trace.weightGradients[0]).toBeCloseTo(-40/3,14);expect(trace.biasGradient).toBe(-6)});
  it("updates immutably and can reduce loss with a suitable learning rate",()=>{const update=regressionUpdateTrace(single,0.01);expect(single.weights).toEqual([1]);expect(update.after.metrics.mse).toBeLessThan(update.before.metrics.mse)});
  it("passes deterministic central finite-difference checks",()=>{expect(regressionGradientCheck({features:[[1,2],[2,0],[3,1]],targets:[5,4,7],weights:[0.5,-1],bias:1},1e-5,1e-6).passed).toBe(true)});
  it("uses bounded state-based training entries",()=>{const trace=regressionTrainingTrace(single,0.01,5);expect(trace.entries).toHaveLength(6);expect(trace.entries[0].iteration).toBe(0);expect(trace.entries[5].status).toBe("completed");expect(trace.terminationReason).toBe("iterations_completed");expect(()=>regressionTrainingTrace(single,0.01,1001)).toThrow("integer from 1")});
  it("reports divergent training explicitly",()=>{const trace=regressionTrainingTrace({features:[[1e100]],targets:[1],weights:[0],bias:0},1,3);expect(trace.status).toBe("diverged");expect(trace.entries.at(-1)?.loss).toBeNull()});
  it("scales, reuses statistics, inverts values, and rejects zero variance",()=>{const values=[[1,10],[2,20],[3,30]],trace=featureScalingTrace(values);expectCloseDeep(transformFeatures(values,trace.mean,trace.scale),trace.scaled);expectCloseDeep(inverseTransformFeatures(trace.scaled,trace.mean,trace.scale),values);expect(()=>featureScalingTrace([[1,4],[2,4]])).toThrow("feature column 1 has zero variance")});
  it("rejects invalid datasets and learning rates",()=>{expect(()=>regressionEvaluationTrace({...single,features:[]})).toThrow("non-empty rectangular");expect(()=>regressionEvaluationTrace({...single,features:[[1],[2,3]]})).toThrow("rectangular");expect(()=>regressionEvaluationTrace({...single,bias:Number.NaN})).toThrow("finite");expect(()=>regressionUpdateTrace(single,0)).toThrow("greater than 0")});
  it("matches every Python-generated fixture",()=>{const path=fileURLToPath(new URL("../../math-contracts/fixtures/regression.v1.json",import.meta.url));const fixture=JSON.parse(readFileSync(path,"utf8")) as {cases:Array<{input:FixtureInput;evaluation:unknown;gradient:unknown;update:unknown;training:unknown}>;scaling:{input:{features:number[][]};trace:unknown};divergent:{input:FixtureInput;trace:unknown}};fixture.cases.forEach(({input,evaluation,gradient,update,training})=>{const common:RegressionInput={features:input.features,targets:input.targets,weights:input.weights,bias:input.bias};expectCloseDeep(regressionEvaluationTrace(common),evaluation);expectCloseDeep(regressionGradientTrace(common),gradient);expectCloseDeep(regressionUpdateTrace(common,input.learningRate),update);expectCloseDeep(regressionTrainingTrace(common,input.learningRate,input.iterations),training)});expectCloseDeep(featureScalingTrace(fixture.scaling.input.features),fixture.scaling.trace);const d=fixture.divergent.input;expectCloseDeep(regressionTrainingTrace(d,d.learningRate,d.iterations),fixture.divergent.trace)});
  it("matches Python validation diagnostics from fixtures",()=>{const path=fileURLToPath(new URL("../../math-contracts/fixtures/regression.v1.json",import.meta.url));const fixture=JSON.parse(readFileSync(path,"utf8")) as {invalidCases:Array<{operation:string;input:FixtureInput;expectedError:string}>};fixture.invalidCases.forEach(({operation,input,expectedError})=>{const call=operation==="scaling"?()=>featureScalingTrace(input.features):operation==="training"?()=>regressionTrainingTrace(input,input.learningRate,input.iterations):()=>regressionEvaluationTrace(input);expect(call).toThrow(expectedError)})});
});
