export const STATISTICS_CONTRACT = "statistics.v1" as const;
export type VarianceConvention = "population" | "sample";
function dataset(values: readonly number[], minimum = 1) {
  if (values.length < minimum || values.length > 1000 || !Array.from(values).every(value => Number.isFinite(value) && Math.abs(value) <= 1e12)) throw new Error("Use finite, complete datasets of 1–1000 values, each within ±10^12; sample statistics need at least 2.");
}
function stableSum(values: readonly number[]) {
  let sum = 0, correction = 0;
  for (const value of values) {
    const adjusted = value - correction, next = sum + adjusted;
    correction = (next - sum) - adjusted;
    sum = next;
  }
  return sum;
}
function middle(sorted: readonly number[]) {
  const index = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[index] : sorted[index-1] + (sorted[index]-sorted[index-1])/2;
}
export function summaryTrace(values: readonly number[], convention: VarianceConvention = "population") {
  if (!["population","sample"].includes(convention)) throw new Error("Declare population or sample denominator.");
  dataset(values, convention === "sample" ? 2 : 1);
  const sorted = [...values].sort((left,right)=>left-right), count = values.length;
  const origin = values[0], mean = origin + stableSum(values.map(value=>value-origin))/count;
  const deviations = values.map(value=>value-mean);
  const variance = stableSum(deviations.map(value=>value*value))/(convention === "sample" ? count-1 : count);
  const median = middle(sorted), half = Math.floor(count/2);
  const q1 = half ? middle(sorted.slice(0,half)) : median, q3 = half ? middle(sorted.slice(count-half)) : median;
  const frequencies = new Map<number,number>();
  for(const value of sorted)frequencies.set(value,(frequencies.get(value)??0)+1);
  const peak = Math.max(...frequencies.values()), modes = peak === 1 ? [] : [...frequencies].filter(([,frequency])=>frequency===peak).map(([value])=>value);
  const iqr = q3-q1, lowerFence=q1-1.5*iqr, upperFence=q3+1.5*iqr;
  const nonOutliers=sorted.filter(value=>value>=lowerFence&&value<=upperFence);
  return {contract:STATISTICS_CONTRACT,count,convention,denominator:convention==="sample"?count-1:count,mean,median,modes,minimum:sorted[0],maximum:sorted[count-1],range:sorted[count-1]-sorted[0],variance,standardDeviation:Math.sqrt(variance),q1,q3,iqr,lowerFence,upperFence,whiskerLow:nonOutliers[0],whiskerHigh:nonOutliers.at(-1)!,outliers:sorted.filter(value=>value<lowerFence||value>upperFence)};
}
export function pairedStatisticsTrace(x: readonly number[], y: readonly number[], convention: VarianceConvention = "sample") {
  if(x.length!==y.length)throw new Error("Paired datasets must have equal lengths.");
  dataset(x,2);dataset(y,2);
  const first=summaryTrace(x,convention),second=summaryTrace(y,convention);
  const cross=stableSum(x.map((value,index)=>(value-first.mean)*(y[index]-second.mean)));
  const covariance=cross/first.denominator;
  const denominator=Math.sqrt(first.variance)*Math.sqrt(second.variance);
  return {contract:STATISTICS_CONTRACT,count:x.length,convention,covariance,correlation:denominator===0?null:Math.max(-1,Math.min(1,covariance/denominator))};
}
export function histogramTrace(values: readonly number[], bins: number) {
  dataset(values);
  if(!Number.isInteger(bins)||bins<1||bins>20)throw new Error("Use 1–20 bins.");
  const minimum=Math.min(...values), maximum=Math.max(...values);
  const width=maximum===minimum?1:(maximum-minimum)/bins;
  const counts=Array<number>(bins).fill(0);
  for(const value of values)counts[Math.min(bins-1,Math.floor((value-minimum)/width))]++;
  return {contract:STATISTICS_CONTRACT,bins:Array.from({length:bins},(_,index)=>({lower:minimum+index*width,upper:minimum+(index+1)*width,includesUpper:index===bins-1,count:counts[index]}))};
}
export function zScore(value: number, mean: number, standardDeviation: number) {
  if(![value,mean,standardDeviation].every(Number.isFinite)||standardDeviation<0)throw new Error("Finite inputs and nonnegative deviation required.");
  if(standardDeviation===0)return null;
  const score=(value-mean)/standardDeviation;
  if(!Number.isFinite(score))throw new Error("Z-score exceeds numerical range.");
  return score;
}
export function samplingTrace(sampleSize: number, repetitions: number, seed: number, biased = false) {
  if(!Number.isInteger(sampleSize)||sampleSize<2||sampleSize>100||!Number.isInteger(repetitions)||repetitions<1||repetitions>200||!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw new Error("Use n=2–100, 1–200 repetitions and a uint32 seed.");
  const population=[0,0,0,0,0,0,0,0,10,10], populationSummary=summaryTrace(population);
  const frame=biased?population.slice(-2):population;
  let state=seed>>>0;
  const samples=Array.from({length:repetitions},()=>{
    const values=Array.from({length:sampleSize},()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return frame[Math.floor(state/4294967296*frame.length)];});
    const summary=summaryTrace(values);
    const standardError=populationSummary.standardDeviation/Math.sqrt(sampleSize), margin=1.96*standardError;
    return {mean:summary.mean,lower:summary.mean-margin,upper:summary.mean+margin,covers:summary.mean-margin<=populationSummary.mean&&summary.mean+margin>=populationSummary.mean};
  });
  return {contract:STATISTICS_CONTRACT,population,populationMean:populationSummary.mean,populationDeviation:populationSummary.standardDeviation,sampleSize,repetitions,seed,biased,standardError:populationSummary.standardDeviation/Math.sqrt(sampleSize),samples,coverage:samples.filter(sample=>sample.covers).length/repetitions,meanOfMeans:stableSum(samples.map(sample=>sample.mean))/repetitions};
}
export function relationshipTrace(commonStrength: number, directEffect: number, intervention: number) {
  if(!Number.isFinite(commonStrength)||commonStrength<0||commonStrength>30||!Number.isFinite(directEffect)||Math.abs(directEffect)>2||!Number.isFinite(intervention)||Math.abs(intervention)>10)throw new Error("Use bounded toy-model controls.");
  const rows=Array.from({length:8},(_,index)=>{
    const warm=index<4?0:1, noiseX=index%2===0?-2:2,noiseY=index%4<2?-3:3;
    const x=10+commonStrength*warm+noiseX, y=50+30*warm+directEffect*(x-10)+noiseY;
    return {warm,x,y,intervenedX:x+intervention,intervenedY:y+directEffect*intervention};
  });
  const pooled=pairedStatisticsTrace(rows.map(row=>row.x),rows.map(row=>row.y));
  const groups=[0,1].map(warm=>{const group=rows.filter(row=>row.warm===warm);return pairedStatisticsTrace(group.map(row=>row.x),group.map(row=>row.y));});
  return {contract:STATISTICS_CONTRACT,rows,pooled,groups,causalChange:directEffect*intervention};
}
export function observationalTwins(intervention: 0 | 1) {
  if(intervention!==0&&intervention!==1)throw new Error("Binary intervention required.");
  return {contract:STATISTICS_CONTRACT,observations:[{z:0,x:0,y:0},{z:1,x:1,y:1}],observedCorrelation:1,intervention,commonCauseY:[0,1],directCauseY:[intervention,intervention]};
}
