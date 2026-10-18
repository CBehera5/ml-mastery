import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bayesTrace, binaryLogLoss, binomialTrace, countProbability, eventTrace, normalDensity, normalInterval, probability, simulateOutcomes, thresholdTrace } from "../src";
const fixture = JSON.parse(readFileSync(new URL("../../math-contracts/fixtures/probability.v1.json", import.meta.url), "utf8"));
function compare(actual: any, expected: any) {
  if (typeof expected === "number") expect(actual).toBeCloseTo(expected, 9);
  else if (Array.isArray(expected)) { expect(actual).toHaveLength(expected.length); expected.forEach((value,index)=>compare(actual[index],value)); }
  else if (expected && typeof expected === "object") { expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort()); Object.entries(expected).forEach(([key,value])=>compare(actual[key],value)); }
  else expect(actual).toEqual(expected);
}
describe("probability.v1",()=>{
  it("matches frozen Python reference traces, including integer seeded outcomes",()=>{
    for(const item of fixture.events)compare(eventTrace(...item.input as [number,number,number,number]),item.trace);
    for(const item of fixture.bayes)compare(bayesTrace(...item.input as [number,number,number]),item.trace);
    for(const item of fixture.binomial)compare(binomialTrace(...item.input as [number,number]),item.trace);
    for(const item of fixture.simulation)expect(simulateOutcomes(...item.input as [number,number,number])).toEqual(item.trace);
    for(const item of fixture.normal){expect(normalDensity(...item.input as [number,number,number])).toBeCloseTo(item.density,10);}
    for(const item of fixture.intervals)expect(normalInterval(...item.input as [number,number])).toBeCloseTo(item.area,10);
    for(const item of fixture.thresholds)compare(thresholdTrace(item.input),item.trace);
  });
  it("preserves complement, inclusion-exclusion, joint and conditioning invariants",()=>{
    for(let both=0;both<=10;both++)for(let only=0;only<=10;only++){
      const trace=eventTrace(both,only,3,7);
      expect(trace.pA+trace.complementA).toBeCloseTo(1,12);
      expect(trace.union).toBeCloseTo(trace.pA+trace.pB-trace.joint,12);
      expect(trace.joint).toBeCloseTo(trace.conditional!*trace.pB,12);
      expect(trace.joint).toBeLessThanOrEqual(Math.min(trace.pA,trace.pB));
    }
    expect(eventTrace(25,25,25,25).independent).toBe(true);
    expect(eventTrace(0,50,50,0).independent).toBe(false);
    expect(eventTrace(0,20,0,80).conditional).toBeNull();
  });
  it("rejects impossible counts and invalid probabilities",()=>{
    for(const value of [-1,1.01,Infinity,NaN])expect(()=>probability(value)).toThrow();
    for(const input of [[1,0],[2,1],[-1,3],[.5,1]])expect(()=>countProbability(...input as [number,number])).toThrow();
    expect(()=>eventTrace(0,0,0,0)).toThrow();expect(()=>eventTrace(-1,2,3,4)).toThrow();expect(()=>eventTrace(1e6,1,0,0)).toThrow();
  });
  it("uses all positives in Bayes and handles empty evidence",()=>{
    expect(bayesTrace(.01,.9,.1).posterior).toBeCloseTo(9/108,12);
    expect(bayesTrace(.5,.9,.1).posterior).toBeCloseTo(.9,12);
    expect(bayesTrace(.5,0,0).posterior).toBeNull();
    expect(bayesTrace(0,.9,.1).posterior).toBe(0);expect(bayesTrace(1,.9,.1).posterior).toBe(1);
    expect(()=>bayesTrace(.1,1.1,.1)).toThrow();
  });
  it("normalizes Bernoulli/binomial mass and computes weighted moments/CDF",()=>{
    for(const trials of [1,2,10,30])for(const chance of [0,.01,.3,.5,.99,1]){
      const trace=binomialTrace(trials,chance);
      expect(trace.mass.reduce((sum,value)=>sum+value,0)).toBeCloseTo(1,11);
      expect(trace.mass.reduce((sum,value,index)=>sum+value*index,0)).toBeCloseTo(trace.expectation,10);
      expect(trace.mass.reduce((sum,value,index)=>sum+value*(index-trace.expectation)**2,0)).toBeCloseTo(trace.variance,10);
      expect(trace.cdf.at(-1)).toBeCloseTo(1,11);
      expect(trace.cdf.every((value,index)=>index===0||value>=trace.cdf[index-1])).toBe(true);
    }
    expect(binomialTrace(2,.5).mass).toEqual([.25,.5,.25]);
    for(const count of [0,31,1.5,NaN])expect(()=>binomialTrace(count,.5)).toThrow();
  });
  it("distinguishes normal density from interval probability",()=>{
    expect(normalDensity(0,0,.1)).toBeGreaterThan(1);
    expect(normalInterval(0,0)).toBe(0);
    expect(normalInterval(-1,1)).toBeCloseTo(.682689492137,10);
    expect(normalInterval(-8,8)).toBeCloseTo(1,10);
    expect(()=>normalDensity(1,0,0)).toThrow();expect(()=>normalInterval(2,1)).toThrow();expect(()=>normalInterval(-9,1)).toThrow();
  });
  it("is reproducible and conserves every simulated draw",()=>{
    for(const sides of [2,6])for(const seed of [0,42,0xffffffff]){
      const trace=simulateOutcomes(sides,1000,seed);
      expect(trace).toEqual(simulateOutcomes(sides,1000,seed));expect(trace.counts.reduce((sum,value)=>sum+value,0)).toBe(1000);
    }
    for(const input of [[3,10,1],[2,0,1],[2,10,-1],[2,10001,1],[2,10,1.5]])expect(()=>simulateOutcomes(...input as [number,number,number])).toThrow();
  });
  it("uses inclusive thresholds and explicit infinite boundary log loss",()=>{
    expect(thresholdTrace(.6)).toMatchObject({truePositive:2,falsePositive:1,falseNegative:1,trueNegative:2});
    expect(thresholdTrace(0).rows.every(row=>row.predicted===1)).toBe(true);
    expect(thresholdTrace(1).rows.every(row=>row.predicted===0)).toBe(true);
    expect(binaryLogLoss(1,.8)).toBeCloseTo(.2231435513,9);
    expect(binaryLogLoss(1,0)).toBe(Infinity);expect(binaryLogLoss(0,1)).toBe(Infinity);
    expect(binaryLogLoss(1,1)).toBeCloseTo(0);expect(binaryLogLoss(0,0)).toBeCloseTo(0);
    expect(()=>binaryLogLoss(2,.5)).toThrow();
  });
});
