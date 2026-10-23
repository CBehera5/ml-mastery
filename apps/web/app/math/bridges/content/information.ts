import type {DeepLesson} from "../../teaching/deep-read";
export const INFORMATION:DeepLesson={title:"How surprised should you be?",minutes:12,sections:[
 {id:"i-observe",kicker:"1 · Observe",title:"News that tells you nothing",blocks:[
  {kind:"p",text:"“The sun rose this morning” is not news. “It snowed in Hyderabad” is. The rarer the event, the more it tells you when it happens. Information theory turns that feeling into a number, and the number turns out to be exactly what classification models are trained to reduce."},
  {kind:"callout",tone:"idea",title:"The question",text:"How do you measure surprise, and how do you score a model that predicts probabilities?"}]},
 {id:"i-express",kicker:"2 · Express",title:"Surprise is minus a log",blocks:[
  {kind:"p",text:"If an event has probability p, its surprise is −log₂ p, measured in bits. A fair coin landing heads has p = 0.5, so the surprise is 1 bit. An event with p = 1/8 has surprise 3 bits. A certain event, p = 1, has surprise 0. Logs are the right tool because surprises of independent events should add while probabilities multiply."},
  {kind:"eq",lines:["surprise(p) = −log₂ p","p = 0.5 → 1 bit","p = 0.125 → 3 bits","p = 1 → 0 bits"]},
  {kind:"p",text:"Entropy is the average surprise of a source: H = −Σ p log₂ p. For outcomes with chances (0.5, 0.25, 0.25) it is 0.5×1 + 0.25×2 + 0.25×2 = 1.5 bits. A fair coin has H = 1. A coin that always lands heads has H = 0."}]},
 {id:"i-visualize",kicker:"3 · Visualize",title:"Believing the wrong story costs bits",blocks:[
  {kind:"p",text:"Suppose three kinds of customers really occur with chances p = (0.7, 0.2, 0.1), but your model believes q = (0.5, 0.3, 0.2). Each time a customer arrives you pay the model's surprise, −log₂ q of that kind. Average this over the true chances and you get the cross-entropy."},
  {kind:"table",caption:"True chances p, model chances q",headers:["Customer type","p (true)","q (model)","−log₂ p","−log₂ q"],rows:[["A","0.7","0.5","0.515","1.000"],["B","0.2","0.3","2.322","1.737"],["C","0.1","0.2","3.322","2.322"]]},
  {kind:"p",text:"Entropy H(p) = 0.7×0.515 + 0.2×2.322 + 0.1×3.322 = 1.157 bits. Cross-entropy H(p, q) = 0.7×1.000 + 0.2×1.737 + 0.1×2.322 = 1.280 bits. The model pays 0.123 extra bits per customer for being wrong. That extra is the KL divergence."}]},
 {id:"i-discover",kicker:"4 · Discover",title:"Cross-entropy never beats entropy",blocks:[
  {kind:"eq",lines:["cross-entropy(p, q) = H(p) + KL(p ‖ q)","1.280 = 1.157 + 0.123"],note:"KL is never negative, and it is zero only when q equals p."},
  {kind:"p",text:"So the best any model can do is match the truth, and every other belief pays a penalty. Training a classifier by minimizing cross-entropy pulls the model's probabilities toward the real ones. When the label is a single known class, p puts all its weight on that class, and cross-entropy collapses to −log of the probability the model gave it. This is the same −ln p loss you met in maximum likelihood."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"Cross-entropy is the average surprise your model feels about reality, and the gap above the entropy is the price of being wrong."}]},
 {id:"i-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, a decision tree split. A node has 8 customers: 4 stay and 4 leave, so p = (0.5, 0.5) and entropy is 1 bit. A split sends 4 to the left with 4 stay, and 4 to the right with 4 leave. Both children are pure, with entropy 0. The information gain is 1 − 0 = 1 bit, the best possible. Trees choose the split with the largest gain."},
  {kind:"p",text:"Example 2, comparing two classifiers on one customer who leaves. Model A says 0.9, so its surprise is −log₂ 0.9 = 0.152 bits. Model B says 0.6, so −log₂ 0.6 = 0.737 bits. Over thousands of customers the model with the lower average is the better calibrated one."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Cross-entropy loss in logistic regression and neural networks. Information gain in decision trees. KL divergence in model comparison and variational methods."},
  {kind:"check",question:"A source has two outcomes with chances 0.9 and 0.1. Compared with a fair coin, its entropy is…",options:["Lower, because the outcome is more predictable","Higher, because 0.9 is large","The same, because there are two outcomes"],answer:0,why:"Entropy is largest for a fair coin, 1 bit. Here H = 0.9×0.152 + 0.1×3.322 = 0.469 bits, so it is lower."}]},
 {id:"i-wrong",kicker:"6 · Where it goes wrong",title:"Three traps",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Log base",text:"Bits use log base 2. Libraries often use the natural log, giving nats. The ranking is the same, the numbers differ by a constant 0.693."},
  {kind:"callout",tone:"warn",title:"2 · Zero probability",text:"If the model gives probability 0 to something that happens, the surprise is infinite. Clip probabilities away from 0 and 1."},
  {kind:"callout",tone:"warn",title:"3 · KL is not a distance",text:"KL(p ‖ q) and KL(q ‖ p) are different numbers. It measures a one-way cost."}]},
 {id:"i-python",kicker:"7 · In Python",title:"Entropy and KL in a few lines",blocks:[
  {kind:"code",caption:"Entropy, cross-entropy and KL for the customer example",code:"import numpy as np\n\np = np.array([0.7, 0.2, 0.1])\nq = np.array([0.5, 0.3, 0.2])\n\nH = -(p * np.log2(p)).sum()\nCE = -(p * np.log2(q)).sum()\nprint(round(H, 3), round(CE, 3), round(CE - H, 3))",output:"1.157 1.28 0.123"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"Surprise is −log p. Entropy is average surprise. Cross-entropy is the average surprise of a model's beliefs, and the extra over entropy is what a wrong model costs."}]}
]};
