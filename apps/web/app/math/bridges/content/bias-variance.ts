import type {DeepLesson} from "../../teaching/deep-read";
export const BIAS_VARIANCE:DeepLesson={title:"Why a slightly wrong guess can beat an honest one",minutes:13,sections:[
 {id:"b-observe",kicker:"1 · Observe",title:"A noisy average",blocks:[
  {kind:"p",text:"A shop tracks daily footfall. The true average is 10 hundred visitors, but each day is noisy, with a variance of 25. You only get 5 days of data, and you must estimate the average. The obvious answer is the average of the 5 days. Could any other rule do better on average?"},
  {kind:"callout",tone:"idea",title:"The question",text:"If a rule is allowed to be slightly wrong on purpose, can it be more reliable overall?"}]},
 {id:"b-express",kicker:"2 · Express",title:"Two kinds of error, one total",blocks:[
  {kind:"p",text:"The 5-day average x̄ wobbles from sample to sample. Its variance is 25 / 5 = 5, and on average it hits the truth, so its bias is 0. Total expected squared error is bias² + variance = 0 + 5 = 5."},
  {kind:"p",text:"Now shrink it: use c × x̄ with c a little below 1, pulling the estimate toward zero. This introduces bias, (c − 1) × 10, because it now misses the truth on average. But it shrinks the wobble to c² × 5."},
  {kind:"eq",lines:["bias = (c − 1) × 10","variance = c² × 5","MSE = bias² + variance"],note:"Mean squared error splits exactly into these two pieces."}]},
 {id:"b-visualize",kicker:"3 · Visualize",title:"A small bias can buy a large cut in wobble",blocks:[
  {kind:"table",caption:"Shrinking the 5-day average by c",headers:["c","Bias²","Variance","Total MSE"],rows:[["1.0","0","5","5"],["0.95","0.25","4.5125","4.7625"],["0.9","1","4.05","5.05"],["0.8","4","3.2","7.2"]]},
  {kind:"p",text:"At c = 0.95 we accept a tiny bias and the total error drops from 5 to 4.76. Push too far and bias takes over: at c = 0.8 the error is 7.2. There is a sweet spot, and it sits just below 1. Slide c in the playground and watch the two pieces trade places."}]},
 {id:"b-discover",kicker:"4 · Discover",title:"The sweet spot has a formula",blocks:[
  {kind:"p",text:"Set the slope of total error to zero and the best shrink factor is c = θ² / (θ² + σ²/n), here 100 / 105 = 0.952. The less data you have, or the noisier it is, the more shrinking helps. With lots of clean data, c moves toward 1 and honesty wins."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"Total error is bias squared plus variance. Flexible models have low bias and high variance, simple ones the reverse, and the best model balances the two."},
  {kind:"p",text:"This is the whole story of regularization. Ridge regression shrinks weights toward zero, on purpose, for the same reason: a small bias for a bigger drop in variance."}]},
 {id:"b-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, a polynomial. A straight line fitted to curved data misses systematically, so it has high bias but barely changes between samples, low variance. A degree-9 curve chases every wiggle, so its bias is low but a fresh sample changes it a lot. The test error is lowest between the two."},
  {kind:"p",text:"Example 2, KNN. With k = 1 each prediction trusts a single neighbour: low bias, high variance. With k = 50 you average many neighbours: lower variance, but you blur real patterns, so bias rises. Choosing k is choosing a point on this trade-off, which is why you pick it by validation."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Model complexity, regularization, ensembles (bagging cuts variance, boosting cuts bias), and reading learning curves. It is the reason training error alone cannot pick a model."},
  {kind:"check",question:"A model scores very well on training data and poorly on new data. Which is the likely problem?",options:["High variance (overfitting)","High bias (underfitting)","Too much data"],answer:0,why:"A big gap between training and test error is the signature of high variance. High bias would give poor scores on both."}]},
 {id:"b-wrong",kicker:"6 · Where it goes wrong",title:"Three traps",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Judging on training data",text:"Training error always favours flexibility. Judge on data the model never saw."},
  {kind:"callout",tone:"warn",title:"2 · Believing more complex is better",text:"Past the sweet spot extra flexibility only adds variance."},
  {kind:"callout",tone:"warn",title:"3 · Ignoring noise",text:"Some error is irreducible noise in the world. No model removes it."}]},
 {id:"b-python",kicker:"7 · In Python",title:"The trade in a loop",blocks:[
  {kind:"code",caption:"Bias², variance and MSE for each shrink factor",code:"theta, var_x = 10, 25 / 5\n\nfor c in [1.0, 0.95, 0.9, 0.8]:\n    bias2 = ((c - 1) * theta) ** 2\n    var = c ** 2 * var_x\n    print(c, round(bias2, 4), round(var, 4), round(bias2 + var, 4))",output:"1.0 0.0 5.0 5.0\n0.95 0.25 4.5125 4.7625\n0.9 1.0 4.05 5.05\n0.8 4.0 3.2 7.2"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"Error = bias² + variance. Pay a little bias to remove a lot of variance, but stop before bias takes over."}]}
]};
