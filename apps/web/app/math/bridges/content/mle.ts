import type {DeepLesson} from "../../teaching/deep-read";
export const MLE:DeepLesson={title:"Which story makes the data least surprising?",minutes:13,sections:[
 {id:"m-observe",kicker:"1 · Observe",title:"Ten flips, seven heads",blocks:[
  {kind:"p",text:"A friend hands you a coin and you flip it ten times. You get 7 heads and 3 tails. Is the coin fair? You cannot know for certain, but some guesses about the coin feel more sensible than others. A coin that lands heads 7 times in 10 seems more believable than one that lands heads only 1 time in 10. Learning from data is the art of making that feeling precise."},
  {kind:"callout",tone:"idea",title:"The question",text:"Among all possible coins, which one would have been least surprised by what we saw?"}]},
 {id:"m-express",kicker:"2 · Express",title:"The likelihood of a story",blocks:[
  {kind:"p",text:"Let p be the unknown chance of heads. If p were true, the probability of getting exactly this sequence, with 7 heads and 3 tails, is p × p × … (7 times) × (1 − p) × (1 − p) × (1 − p). That is p⁷(1 − p)³. Call it the likelihood L(p). It is a function of the story p, with the data held fixed."},
  {kind:"eq",lines:["L(p) = p⁷ (1 − p)³"],note:"Likelihood asks how probable the data is under each story. It is not the probability that the story is true."},
  {kind:"table",caption:"Likelihood of 7 heads and 3 tails under three coins",headers:["Story p","p⁷","(1−p)³","L(p)"],rows:[["0.5","0.0078125","0.125","0.000977"],["0.7","0.0823543","0.027","0.002224"],["0.9","0.4782969","0.001","0.000478"]]},
  {kind:"p",text:"The p = 0.7 coin makes our data more likely than the fair coin, by more than two times, and far more likely than the p = 0.9 coin."}]},
 {id:"m-visualize",kicker:"3 · Visualize",title:"A hill with one top",blocks:[
  {kind:"p",text:"Plot L(p) for every p from 0 to 1. It is a hill. It rises from zero at p = 0, peaks, and falls back to zero at p = 1. The peak is the best story. Use the playground to slide p along the hill and watch the likelihood climb, then drop."},
  {kind:"p",text:"One practical problem. With hundreds of flips the likelihood is a product of hundreds of small numbers, and computers round it to zero. The fix is to take logarithms. A log turns products into sums and keeps the peak in the same place, because the log is always increasing."},
  {kind:"eq",lines:["log L(p) = 7 ln p + 3 ln(1 − p)","at p = 0.5: 10 ln 0.5 = −6.931","at p = 0.7: 7 ln 0.7 + 3 ln 0.3 = −6.109"],note:"Higher (closer to zero) is better. Training minimizes the negative of this."}]},
 {id:"m-discover",kicker:"4 · Discover",title:"The peak is where the data says it is",blocks:[
  {kind:"p",text:"Find the top with calculus. Set the slope of log L to zero. With k heads in n flips, log L(p) = k ln p + (n − k) ln(1 − p). Its derivative is k / p − (n − k) / (1 − p). Set that to zero and solve:"},
  {kind:"eq",lines:["k / p = (n − k) / (1 − p)","k (1 − p) = (n − k) p","k = n p","p̂ = k / n = 7 / 10 = 0.7"],note:"The best coin is the one that matches the fraction of heads we saw."},
  {kind:"p",text:"A reassuring answer: the most believable story is the plain frequency. This is maximum likelihood estimation, MLE. The skill is not this one coin. It is the recipe, which works for any model: write the probability of the data as a function of the settings, take the log, and find the settings that make it as high as possible."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"Maximum likelihood chooses the model settings under which the data you actually saw would have been least surprising."}]},
 {id:"m-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, a spam filter. Of 200 emails, 50 are spam. The MLE for the chance an email is spam is 50 / 200 = 0.25. This is exactly the prior a naive Bayes classifier uses. Counting was maximum likelihood all along."},
  {kind:"p",text:"Example 2, logistic regression and its loss. A model says the chance a customer leaves is 0.8. The customer does leave, label 1. The model gave the data probability 0.8, so its log likelihood is ln 0.8 = −0.223 and the loss is 0.223. If the model had said 0.1, the loss would be −ln 0.1 = 2.303, ten times larger. Training logistic regression is maximizing the log likelihood over all customers. The loss function is called cross-entropy and it is just the negative log likelihood."},
  {kind:"table",caption:"Loss for a customer who really leaves",headers:["Model says","Loss −ln p"],rows:[["0.9","0.105"],["0.8","0.223"],["0.5","0.693"],["0.1","2.303"],["0.01","4.605"]]},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Logistic regression, naive Bayes, neural network classifiers and language models are all trained by maximum likelihood. Mean squared error is the same idea when errors follow a bell curve."},
  {kind:"check",question:"You see 3 heads in 10 flips. What is the maximum likelihood estimate of p?",options:["0.3","0.5","0.7"],answer:0,why:"p̂ = k / n = 3 / 10 = 0.3. The best story is the observed fraction."}]},
 {id:"m-wrong",kicker:"6 · Where it goes wrong",title:"Three ways to fool yourself",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Likelihood is not the chance the story is true",text:"L(p) is the probability of the data given p. Flipping that into “probability of p given data” needs a prior and Bayes' rule."},
  {kind:"callout",tone:"warn",title:"2 · Tiny data, extreme answers",text:"Flip once and see heads, and MLE says p = 1. Smoothing and priors, as in naive Bayes counts, protect you."},
  {kind:"callout",tone:"warn",title:"3 · Confident and wrong is costly",text:"The loss −ln p explodes as p approaches 0 for the true label. A model that says 0.01 for something that happens pays 4.6. Cross-entropy punishes overconfidence hard."}]},
 {id:"m-python",kicker:"7 · In Python",title:"Finding the peak by search",blocks:[
  {kind:"code",caption:"Log likelihood for 7 heads in 10 flips",code:"import numpy as np\n\nk, n = 7, 10\np = np.linspace(0.01, 0.99, 99)\nloglik = k * np.log(p) + (n - k) * np.log(1 - p)\n\nbest = p[loglik.argmax()]\nprint(round(best, 2), round(loglik.max(), 3))",output:"0.7 -6.109"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"Likelihood scores each story by how unsurprised it is by the data. The best story is the maximum. Cross-entropy loss is that score with the sign flipped."}]}
]};
