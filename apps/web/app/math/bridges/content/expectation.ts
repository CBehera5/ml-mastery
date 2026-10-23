import type {DeepLesson} from "../../teaching/deep-read";
export const EXPECTATION:DeepLesson={title:"What is a gamble worth, and how wildly does it swing?",minutes:12,sections:[
 {id:"e-observe",kicker:"1 · Observe",title:"A ticket, a prize, and a hunch",blocks:[
  {kind:"p",text:"A stall sells scratch tickets for ₹100. After many sales the owner knows the pattern: 7 tickets in 10 win nothing, 2 in 10 return ₹100, and 1 in 10 pays ₹500. Should you buy? Your gut cannot do this sum. You need one number that sums up the whole gamble."},
  {kind:"callout",tone:"idea",title:"The question",text:"If you could play this ticket a thousand times, what would one play be worth on average?"}]},
 {id:"e-express",kicker:"2 · Express",title:"Weight each outcome by how often it happens",blocks:[
  {kind:"p",text:"Take each prize and multiply by its chance, then add. That weighted average is the expected value, written E[X]."},
  {kind:"eq",lines:["E[X] = 0 × 0.7 + 100 × 0.2 + 500 × 0.1","     = 0 + 20 + 50","     = ₹70"],note:"Expected prize ₹70 for a ₹100 ticket."},
  {kind:"p",text:"So on average each ticket loses ₹30. “Expected” is an unlucky word: you will never win exactly ₹70. It is the centre of gravity of the gamble, the balance point if you put the prizes on a seesaw with weights equal to their probabilities."}]},
 {id:"e-visualize",kicker:"3 · Visualize",title:"The balance point and the spread around it",blocks:[
  {kind:"p",text:"The average alone hides the drama. Two stalls can both have an expected prize of ₹70, one paying ₹70 every time and one paying ₹700 one time in ten. They feel completely different. We measure the difference by asking how far outcomes typically sit from the average."},
  {kind:"table",caption:"Variance of the scratch ticket",headers:["Prize x","Chance","Distance from 70","Squared distance","Chance × squared"],rows:[["0","0.7","−70","4,900","3,430"],["100","0.2","30","900","180"],["500","0.1","430","184,900","18,490"]]},
  {kind:"p",text:"Add the last column: 3,430 + 180 + 18,490 = 22,100. That is the variance. Its square root, about ₹149, is the standard deviation, in rupees again so it is easy to read. A typical ticket lands about ₹149 away from the ₹70 average. Use the playground to move the chances and watch both numbers respond."}]},
 {id:"e-discover",kicker:"4 · Discover",title:"Two rules that make life easy",blocks:[
  {kind:"p",text:"Shortcut for variance: E[X²] − (E[X])². Here E[X²] = 0 + 0.2 × 10,000 + 0.1 × 250,000 = 27,000, and 27,000 − 70² = 27,000 − 4,900 = 22,100. Same answer, less typing."},
  {kind:"p",text:"Rule two, expectation is linear. If a stall gives you a ₹10 voucher on every ticket on top of the prize, the average goes up by exactly 10, and the spread does not change at all. In symbols: E[aX + b] = a·E[X] + b and Var(aX + b) = a²·Var(X). Shifting moves the centre, scaling stretches the spread by the square."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"Expected value is the probability-weighted average, variance is the probability-weighted squared distance from it, and together they describe both the centre and the risk."}]},
 {id:"e-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, a model's error. A model predicts four house prices (in lakh) and misses by −2, 0, 1 and 3. Treat each miss as equally likely. The average error is (−2 + 0 + 1 + 3) / 4 = 0.5, small, because the misses cancel. The average squared error is (4 + 0 + 1 + 9) / 4 = 3.5. That second number is the mean squared error, an expected value of squared miss. It does not let the errors cancel, which is why we train on it."},
  {kind:"p",text:"Example 2, decision under uncertainty. A bank approves a ₹1,000 loan. With chance 0.95 it earns ₹100 interest, with chance 0.05 the borrower defaults and the bank loses ₹1,000. Expected profit is 0.95 × 100 − 0.05 × 1,000 = 95 − 50 = ₹45. Positive, so on average it pays. But the variance is large, and a bad run could still hurt. Averages guide strategy, variance warns you about the ride."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Every loss function is an expected value over data. Bias and variance of a model are named after the same quantities. Mean, standard deviation and standardizing features all come from here."},
  {kind:"check",question:"A game pays ₹0 or ₹10 with equal chance. What are the expected value and variance?",options:["E = 5, variance = 25","E = 5, variance = 5","E = 10, variance = 25"],answer:0,why:"E = 0.5 × 0 + 0.5 × 10 = 5. Each outcome is 5 away from 5, so squared distance is 25 either way, and the variance is 25."}]},
 {id:"e-wrong",kicker:"6 · Where it goes wrong",title:"Where the average lies",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Treating the average as a promise",text:"No ticket pays ₹70. A single play can be far from the expected value."},
  {kind:"callout",tone:"warn",title:"2 · Ignoring the tail",text:"Rare large losses barely move the average but can ruin you. Always look at variance too."},
  {kind:"callout",tone:"warn",title:"3 · Squares versus units",text:"Variance is in squared units, rupees squared here. The standard deviation brings it back to rupees."}]},
 {id:"e-python",kicker:"7 · In Python",title:"The ticket in six lines",blocks:[
  {kind:"code",caption:"Expectation, variance and standard deviation",code:"import numpy as np\n\nprize = np.array([0, 100, 500])\nchance = np.array([0.7, 0.2, 0.1])\n\nmean = (prize * chance).sum()\nvar = ((prize - mean) ** 2 * chance).sum()\nprint(round(mean, 2), round(var, 2), round(var ** 0.5, 2))",output:"70.0 22100.0 148.66"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"Weight by chance, add: that is the average. Weight squared distance by chance, add: that is the risk."}]}
]};
