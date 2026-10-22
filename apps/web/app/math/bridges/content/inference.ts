import type {DeepLesson} from "../../teaching/deep-read";
export const INFERENCE:DeepLesson={title:"How sure can you be from a sample?",minutes:13,sections:[
 {id:"f-observe",kicker:"1 · Observe",title:"Sixty-two out of a hundred",blocks:[
  {kind:"p",text:"You survey 100 customers and 62 say they are satisfied. Your manager asks, “So 62 percent of all our customers are happy?” You know it is not that simple. A different 100 customers would give 58, or 66. The 62 is a measurement with wobble. How much wobble, and what can you honestly claim?"},
  {kind:"callout",tone:"idea",title:"The question",text:"How far could the true value be from what the sample shows, and how do you decide whether a difference is real?"}]},
 {id:"f-express",kicker:"2 · Express",title:"Wobble has a size",blocks:[
  {kind:"p",text:"For a proportion, the wobble of the sample value is the standard error, SE = √( p̂ (1 − p̂) / n ). With p̂ = 0.62 and n = 100 that is √(0.62 × 0.38 / 100) = √0.002356 = 0.0485, about 4.9 percentage points."},
  {kind:"eq",lines:["95% interval ≈ p̂ ± 1.96 × SE","= 0.62 ± 1.96 × 0.0485","= 0.62 ± 0.095","= (0.525, 0.715)"],note:"We are 95 percent confident the true share lies between about 52 and 72 percent."},
  {kind:"p",text:"Read that carefully. It does not say there is a 95 percent chance this particular interval holds the truth. It says that if we repeated the survey many times and built an interval each time, about 95 percent of those intervals would catch the truth."}]},
 {id:"f-visualize",kicker:"3 · Visualize",title:"More data narrows the band, slowly",blocks:[
  {kind:"table",caption:"Half-width of the 95 percent interval when p̂ = 0.62",headers:["Sample size n","Standard error","Half-width (±)"],rows:[["25","0.097","0.19"],["100","0.049","0.095"],["400","0.024","0.048"],["1,600","0.012","0.024"]]},
  {kind:"p",text:"Four times the data halves the wobble. The square root in the formula is a hard law: to be ten times more precise you need a hundred times more people. Drag the sample size in the playground and watch the band tighten."}]},
 {id:"f-discover",kicker:"4 · Discover",title:"Is a difference real, or luck?",blocks:[
  {kind:"p",text:"An A/B test. Old page A: 30 of 200 visitors buy, 15 percent. New page B: 42 of 200 buy, 21 percent. B looks better by 6 points. Could luck alone produce that gap? Combine the wobble of both groups: SE = √(0.15×0.85/200 + 0.21×0.79/200) = √0.001467 = 0.0383."},
  {kind:"eq",lines:["z = difference / SE = 0.06 / 0.0383 = 1.57","two-sided p-value ≈ 0.117"],note:"If the pages were truly equal, a gap this big would appear about 12 times in 100 by luck."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"An interval says how far the truth might be from your estimate. A test asks how often luck alone would give a result this extreme."},
  {kind:"p",text:"A 12 percent chance is not rare enough for most teams to bet on. It is also not proof the pages are equal. The honest conclusion is “not enough data yet”. Run longer or with more visitors."}]},
 {id:"f-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, test accuracy. A model gets 87 of 100 test cases right. SE = √(0.87×0.13/100) = 0.0336, so the interval is about 0.87 ± 0.066, from 80 to 94 percent. A rival model scoring 89 percent is well inside that band, so the data cannot separate the two."},
  {kind:"p",text:"Example 2, how many users do you need? To tell 15 from 21 percent with confidence you need the SE far smaller than the 6-point gap. With 800 visitors each the SE falls to √(0.15×0.85/800 + 0.21×0.79/800) = 0.0192, so z = 0.06 / 0.0192 = 3.1, comfortably convincing."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Comparing models on a test set, A/B tests of a deployed model, deciding whether a feature's coefficient is distinguishable from zero, and reading cross-validation spreads."},
  {kind:"check",question:"You quadruple the sample size. What happens to the width of the confidence interval?",options:["It halves","It drops to a quarter","It stays the same"],answer:0,why:"The width scales with 1/√n. Four times the data gives 1/√4 = 1/2 the width."}]},
 {id:"f-wrong",kicker:"6 · Where it goes wrong",title:"Where inference misleads",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Biased samples",text:"Interval formulas fix random wobble only. If the survey only reached happy customers, a huge n makes you confidently wrong."},
  {kind:"callout",tone:"warn",title:"2 · Checking until it works",text:"Run twenty tests and one will look significant by luck. Decide the test and the sample size before you look."},
  {kind:"callout",tone:"warn",title:"3 · Confusing significant with important",text:"With millions of users a tiny 0.01 point gain can be statistically solid and commercially useless."}]},
 {id:"f-python",kicker:"7 · In Python",title:"Interval and test from first principles",blocks:[
  {kind:"code",caption:"A confidence interval and a two-group comparison",code:"import math\n\nn, wins = 100, 62\np = wins / n\nse = math.sqrt(p * (1 - p) / n)\nprint(round(se, 4), round(p - 1.96 * se, 3), round(p + 1.96 * se, 3))\n\npa, pb, n = 30 / 200, 42 / 200, 200\nse = math.sqrt(pa * (1 - pa) / n + pb * (1 - pb) / n)\nprint(round(se, 4), round((pb - pa) / se, 2))",output:"0.0485 0.525 0.715\n0.0383 1.57"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"Estimate, attach its wobble, and ask whether the gap you see is bigger than luck would make."}]}
]};
