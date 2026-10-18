import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {histogramTrace,observationalTwins,pairedStatisticsTrace,relationshipTrace,samplingTrace,summaryTrace,zScore,type VarianceConvention} from "../src";
const fixture=JSON.parse(readFileSync(new URL("../../math-contracts/fixtures/statistics.v1.json",import.meta.url),"utf8"));
function compare(actual:any,expected:any) {
  if(typeof expected==="number")expect(actual).toBeCloseTo(expected,8);
  else if(Array.isArray(expected)){expect(actual).toHaveLength(expected.length);expected.forEach((value,index)=>compare(actual[index],value));}
  else if(expected&&typeof expected==="object"){expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());Object.entries(expected).forEach(([key,value])=>compare(actual[key],value));}
  else expect(actual).toEqual(expected);
}
describe("statistics.v1 mathematical references",()=>{
  it("matches frozen independent Python traces",()=>{
    fixture.summaries.forEach((item:any)=>compare(summaryTrace(item.values,item.convention),item.trace));
    fixture.paired.forEach((item:any)=>compare(pairedStatisticsTrace(item.x,item.y,item.convention),item.trace));
    fixture.histograms.forEach((item:any)=>compare(histogramTrace(item.values,item.bins),item.trace));
    fixture.sampling.forEach((item:any)=>compare(samplingTrace(item.size,item.repetitions,item.seed,item.biased),item.trace));
    fixture.relationships.forEach((item:any)=>compare(relationshipTrace(item.strength,item.effect,item.intervention),item.trace));
    fixture.twins.forEach((item:any)=>compare(observationalTwins(item.intervention),item.trace));
  });
  it("calculates declared means, medians, modes and sample/population variance",()=>{
    expect(summaryTrace([1,2,3])).toMatchObject({mean:2,median:2,variance:2/3,denominator:3,modes:[],q1:1,q3:3});
    expect(summaryTrace([1,2,3],"sample")).toMatchObject({variance:1,standardDeviation:1,denominator:2});
    expect(summaryTrace([1,1,2,2,3]).modes).toEqual([1,2]);
    expect(summaryTrace([1,2,3,100]).median).toBe(2.5);
    expect(summaryTrace([1,2,3,100]).mean).toBe(26.5);
    expect(summaryTrace([5])).toMatchObject({q1:5,q3:5,variance:0,modes:[]});
    expect(summaryTrace([5,5]).modes).toEqual([5]);
  });
  it("pins the median-of-halves convention and 1.5-IQR whiskers",()=>{
    expect(summaryTrace([1,2,3,4,5])).toMatchObject({q1:1.5,q3:4.5,iqr:3});
    expect(summaryTrace([1,2,3,4,5,6,7,100])).toMatchObject({q1:2.5,q3:6.5,upperFence:12.5,whiskerHigh:7,outliers:[100]});
    expect(summaryTrace([1,2])).toMatchObject({q1:1,q3:2,median:1.5});
  });
  it("preserves translation/scaling invariants including representative large offsets",()=>{
    const values=[1,2,3,4,9],base=summaryTrace(values,"sample");
    const translated=summaryTrace(values.map(value=>value+1e12-10),"sample");
    expect(translated.variance).toBeCloseTo(base.variance,6);
    expect(summaryTrace(values.map(value=>value*3),"sample").variance).toBeCloseTo(base.variance*9,10);
    expect(summaryTrace(values.map(value=>value*3),"sample").standardDeviation).toBeCloseTo(base.standardDeviation*3,10);
    expect(pairedStatisticsTrace(values,values.map(value=>value*3+10)).correlation).toBeCloseTo(1,12);
    expect(pairedStatisticsTrace(values,values.map(value=>-value)).correlation).toBeCloseTo(-1,12);
  });
  it("handles covariance units, constant variables and nonlinear zero correlation",()=>{
    expect(pairedStatisticsTrace([1,2,3],[2,4,6])).toMatchObject({covariance:2,correlation:1});
    expect(pairedStatisticsTrace([1,2,3],[2,4,6],"population").covariance).toBeCloseTo(4/3,12);
    expect(pairedStatisticsTrace([1,1,1],[1,2,3]).correlation).toBeNull();
    expect(pairedStatisticsTrace([-2,-1,0,1,2],[4,1,0,1,4]).correlation).toBeCloseTo(0,12);
    expect(zScore(14,10,2)).toBe(2);expect(zScore(10,10,0)).toBeNull();
  });
  it("conserves histogram counts and includes the maximum only in the final bin",()=>{
    expect(histogramTrace([1,2,3,4],2).bins.map(bin=>bin.count)).toEqual([2,2]);
    expect(histogramTrace([0,1,2],2).bins.map(bin=>bin.count)).toEqual([1,2]);
    expect(histogramTrace([5,5,5],4).bins.map(bin=>bin.count)).toEqual([3,0,0,0]);
  });
  it("demonstrates confounding without implying correlation identifies a mechanism",()=>{
    const trace=relationshipTrace(20,0,10);
    expect(trace.pooled.correlation).toBeGreaterThan(.9);
    expect(trace.groups.map(group=>group.correlation)).toEqual([0,0]);
    expect(trace.causalChange).toBe(0);expect(trace.rows.every(row=>row.y===row.intervenedY)).toBe(true);
    expect(relationshipTrace(20,1,10).causalChange).toBe(10);
    expect(relationshipTrace(0,0,10).pooled.correlation).toBe(0);
    for(const intervention of [0,1] as const){
      const twins=observationalTwins(intervention);
      expect(twins.observedCorrelation).toBe(1);expect(twins.commonCauseY).not.toEqual(twins.directCauseY);
    }
  });
  it("reproduces samples and exposes bias, approximate coverage and SE scaling",()=>{
    const trace=samplingTrace(10,20,42);
    expect(trace).toEqual(samplingTrace(10,20,42));expect(trace.populationMean).toBe(2);expect(trace.populationDeviation).toBe(4);
    expect(samplingTrace(100,20,42).standardError).toBe(.4);
    expect(samplingTrace(4,20,42).standardError).toBe(2);
    const biased=samplingTrace(100,20,42,true);
    expect(biased.meanOfMeans).toBe(10);expect(biased.coverage).toBe(0);
    expect(trace.samples.every(sample=>sample.covers===(sample.lower<=2&&sample.upper>=2))).toBe(true);
  });
  it("rejects missing, infinite, empty, invalid-denominator and mismatched data",()=>{
    for(const values of [[],[NaN,1],[Infinity,1],[1e13,1]])expect(()=>summaryTrace(values)).toThrow();
    expect(()=>summaryTrace(new Array<number>(3))).toThrow();
    expect(()=>summaryTrace([1],"sample")).toThrow();expect(()=>summaryTrace([1,2],"unknown" as VarianceConvention)).toThrow();
    expect(()=>pairedStatisticsTrace([1,2],[1])).toThrow();expect(()=>pairedStatisticsTrace([1],[2])).toThrow();
    expect(()=>histogramTrace([1,2],0)).toThrow();expect(()=>samplingTrace(1,10,42)).toThrow();
    expect(()=>samplingTrace(10,10,-1)).toThrow();expect(()=>relationshipTrace(31,0,0)).toThrow();expect(()=>zScore(1,0,-1)).toThrow();
  });
});
