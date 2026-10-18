import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {optimizationGrid,optimizationRegressionComparison,optimizationSlice,optimizationState,optimizationTrainingTrace,regressionTrainingTrace,type ObjectiveKind,type OptimizationInput} from "../src";
const fixture=JSON.parse(readFileSync(new URL("../../math-contracts/fixtures/optimization.v1.json",import.meta.url),"utf8"));
const base:OptimizationInput={kind:"quadratic",point:[1,0],scale:1,penalty:0};
function compare(actual:any,expected:any) {
  if(typeof expected==="number")expect(actual).toBeCloseTo(expected,8);
  else if(Array.isArray(expected)){expect(actual).toHaveLength(expected.length);expected.forEach((value,index)=>compare(actual[index],value));}
  else if(expected&&typeof expected==="object"){expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());Object.entries(expected).forEach(([key,value])=>compare(actual[key],value));}
  else expect(actual).toEqual(expected);
}
describe("optimization.v1 mathematics",()=>{
  it("matches frozen Python states, updates, failure reasons and reused regression",()=>{
    fixture.states.forEach((item:any)=>compare(optimizationState(item.input),item.trace));
    fixture.training.forEach((item:any)=>compare(optimizationTrainingTrace(item.input,item.rate,item.iterations),item.trace));
    fixture.comparison.forEach((item:any)=>compare(optimizationRegressionComparison(item.rate,item.iterations),item.trace));
  });
  it("checks signed gradient, displacement and simultaneous coupled updates",()=>{
    expect(optimizationState(base)).toMatchObject({dataLoss:4,totalLoss:4,gradient:[-4,0]});
    expect(optimizationTrainingTrace(base,.1,1).entries[1].point[0]).toBeCloseTo(1.4,12);
    const coupled=optimizationTrainingTrace({...base,kind:"coupled",point:[1,2]},.1,1);
    expect(coupled.entries[1].point[0]).toBeCloseTo(.4,12);expect(coupled.entries[1].point[1]).toBeCloseTo(1.4,12);
    expect(base.point).toEqual([1,0]);
  });
  it("compares analytic and perturbation gradients across every shape",()=>{
    for(const kind of ["quadratic","coupled","saddle","double-well","anisotropic"] as const)for(const point of [[-2,1],[0,0],[1,2]] as [number,number][]){
      const state=optimizationState({...base,kind,point,scale:10});
      expect(state.gradientCheck.passed).toBe(true);
      state.gradient.forEach((value,index)=>expect(value).toBeCloseTo(state.numericalGradient[index],5));
    }
  });
  it("separates a stationary saddle from a minimum and checks landscape tables",()=>{
    expect(optimizationState({...base,kind:"saddle",point:[0,0]}).gradientNorm).toBe(0);
    expect(optimizationState({...base,kind:"saddle",point:[0,1]}).totalLoss).toBe(-1);
    const grid=optimizationGrid(base),slice=optimizationSlice(base);
    expect(grid).toHaveLength(121);expect(slice).toHaveLength(41);
    grid.forEach(cell=>expect(cell.totalLoss).toBe(optimizationState({...base,point:cell.point}).totalLoss));
    slice.forEach(cell=>expect(cell.totalLoss).toBe(optimizationState({...base,point:[cell.coordinate,0]}).totalLoss));
    expect(optimizationState({...base,kind:"double-well",point:[-1,0]}).totalLoss).toBe(0);
    expect(optimizationState({...base,kind:"double-well",point:[1,0]}).totalLoss).toBe(0);
  });
  it("distinguishes completed finite budget from oscillation and explicit limits",()=>{
    const oscillation=optimizationTrainingTrace(base,1,4);
    expect(oscillation.entries.map(entry=>entry.point[0])).toEqual([1,5,1,5,1]);
    expect(oscillation.entries.every(entry=>entry.totalLoss===4)).toBe(true);
    expect(oscillation.terminationReason).toBe("iterations_completed");
    const failed=optimizationTrainingTrace({...base,kind:"anisotropic",point:[1,1],scale:100},.1,30);
    expect(failed.status).toBe("diverged");expect(failed.terminationReason).toBe("numerical_limit_exceeded");
    expect(failed.entries.at(-1)).toMatchObject({dataLoss:null,penaltyLoss:null,totalLoss:null,gradient:null});
    expect(failed.entries.length).toBeLessThan(31);expect(JSON.stringify(failed)).not.toMatch(/NaN|Infinity/);
    expect(optimizationTrainingTrace({...base,kind:"saddle",point:[0,0]},.1,5).entries.every(entry=>entry.totalLoss===0)).toBe(true);
  });
  it("shows fit/penalty decomposition and analytic L2 optima without changing old objectives",()=>{
    expect(optimizationState({...base,penalty:1})).toMatchObject({dataLoss:4,penaltyLoss:1,totalLoss:5,gradient:[-2,0]});
    for(const penalty of [0,1,2]){
      const state=optimizationState({...base,penalty,point:[3/(1+penalty),0]});
      expect(state.gradientNorm).toBeCloseTo(0,12);
    }
    const comparison=optimizationRegressionComparison(.01,4);
    expect(comparison.original.entries[0].loss).toBe(comparison.scaled.entries[0].loss);
    expect(comparison.original.entries[4].loss!).toBeGreaterThan(comparison.original.entries[0].loss!);
    expect(comparison.scaled.entries[4].loss!).toBeLessThan(comparison.scaled.entries[0].loss!);
    expect(comparison.original).toEqual(regressionTrainingTrace({features:[[-20],[-10],[10],[20]],targets:[-4,-2,2,4],weights:[0],bias:0},.01,4));
  });
  it("rejects invalid shapes, settings, nonfinite coordinates, budgets and unsupported penalties",()=>{
    for(const rate of [0,-1,2.1,Infinity,NaN])expect(()=>optimizationTrainingTrace(base,rate,4)).toThrow();
    for(const budget of [0,101,1.5,NaN])expect(()=>optimizationTrainingTrace(base,.1,budget)).toThrow();
    expect(()=>optimizationState({...base,point:[NaN,0]})).toThrow();expect(()=>optimizationState({...base,point:new Array<number>(2) as [number,number]})).toThrow();
    expect(()=>optimizationState({...base,kind:"unknown" as ObjectiveKind})).toThrow();
    expect(()=>optimizationState({...base,kind:"saddle",penalty:1})).toThrow();
    expect(()=>optimizationState({...base,scale:101})).toThrow();expect(()=>optimizationTrainingTrace({...base,point:[11,0]},.1,4)).toThrow();
    expect(()=>optimizationRegressionComparison(.1,41)).toThrow();
  });
});
