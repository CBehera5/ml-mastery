import type {DeepLesson} from "../../teaching/deep-read";
export const STOCHASTIC:DeepLesson={title:"Learning from a handful at a time",minutes:12,sections:[
 {id:"t-observe",kicker:"1 · Observe",title:"A million rows, one step",blocks:[
  {kind:"p",text:"A company has ten million transactions. To take one gradient step the careful way, you must scan all ten million rows, then step once, then scan again. Training for a thousand steps means ten billion row visits. There has to be a cheaper way to know roughly which way is downhill."},
  {kind:"callout",tone:"idea",title:"The question",text:"Can a tiny random sample point you downhill almost as well as the whole dataset?"}]},
 {id:"t-express",kicker:"2 · Express",title:"The gradient is an average, so sample it",blocks:[
  {kind:"p",text:"Take four flats with sizes x = (1, 2, 3, 4) and prices y = (2.2, 3.8, 6.3, 7.7). The model is price = w × size, with loss (wx − y)² averaged over flats. Each flat has its own gradient 2x(wx − y). At w = 0 they are:"},
  {kind:"table",caption:"Per-flat gradients at w = 0",headers:["Flat","Size x","Price y","Gradient 2x(wx − y)"],rows:[["1","1","2.2","−4.4"],["2","2","3.8","−15.2"],["3","3","6.3","−37.8"],["4","4","7.7","−61.6"]]},
  {kind:"p",text:"Their average is (−4.4 − 15.2 − 37.8 − 61.6) / 4 = −29.75. That is the full gradient. A single flat gives −4.4 or −61.6: all pointing the same way, but with wildly different strength. That is the trade. A cheap estimate is noisy but, averaged over many tries, correct."},
  {kind:"eq",lines:["w ← w − η × (gradient of a random batch)"],note:"η (eta) is the learning rate."}]},
 {id:"t-visualize",kicker:"3 · Visualize",title:"A steady walk versus a stumbling one",blocks:[
  {kind:"table",caption:"Full-batch descent, η = 0.05",headers:["Step","w","Loss"],rows:[["1","1.488","1.907"],["2","1.859","0.178"],["3","1.952","0.070"],["4","1.976","0.063"],["5","1.981","0.063"]]},
  {kind:"p",text:"The best weight is Σxy / Σx² = 59.5 / 30 = 1.983. The full-batch walk glides straight there. A one-flat-at-a-time walk gets there too, but zigzags, since each step follows a different flat. Run both in the playground and change the batch size."}]},
 {id:"t-discover",kicker:"4 · Discover",title:"Noise is a feature, and momentum smooths it",blocks:[
  {kind:"p",text:"Stochastic gradient descent, SGD, costs a tiny sample per step instead of the whole table, so it can take thousands of steps in the time one careful step would take. The noise even helps on bumpy, non-convex landscapes by shaking the walker out of shallow dips."},
  {kind:"p",text:"Momentum keeps a running memory of past steps: v ← βv + g, then w ← w − ηv. Steps that agree add up, steps that disagree cancel, so the walk is smoother. Adam goes further and gives each weight its own step size from the history of its gradients. For many models Adam is the default."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"SGD trades an exact but expensive gradient for a noisy, cheap one, and momentum or Adam smooth the noise so you can take many fast steps."}]},
 {id:"t-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, one stochastic step. Start at w = 0, pick flat 3 at random. Its gradient is −37.8. With η = 0.02 the step is w = 0 − 0.02 × (−37.8) = 0.756. We moved toward 1.983, the right direction, though not the exact amount the full gradient would give."},
  {kind:"p",text:"Example 2, epochs. One pass through all rows in shuffled mini-batches is an epoch. With 10 million rows and a batch of 1,000 you get 10,000 steps per epoch, and a few epochs are often enough."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Every neural network, large logistic regression and gradient boosting variants with subsampling. Batch size and learning rate are the two numbers you will tune most."},
  {kind:"check",question:"What does a smaller batch size give you, compared with the full dataset?",options:["Cheaper but noisier steps","Exact but slower steps","The same gradient every time"],answer:0,why:"Small batches are cheap but each gradient is a noisy estimate of the full one. Averaging over many steps recovers the right direction."}]},
 {id:"t-wrong",kicker:"6 · Where it goes wrong",title:"Three traps",blocks:[
  {kind:"callout",tone:"warn",title:"1 · A learning rate that is too big",text:"Noisy steps with a big η bounce around the minimum or blow up. Lower η, or shrink it over time."},
  {kind:"callout",tone:"warn",title:"2 · Not shuffling",text:"If rows are sorted, say all one class first, each batch points the wrong way. Shuffle each epoch."},
  {kind:"callout",tone:"warn",title:"3 · Reading one step as progress",text:"The loss on a single batch jumps around. Judge by a running average or a held-out set."}]},
 {id:"t-python",kicker:"7 · In Python",title:"SGD in six lines",blocks:[
  {kind:"code",caption:"One random flat per step",code:"import numpy as np\n\nx = np.array([1, 2, 3, 4.])\ny = np.array([2.2, 3.8, 6.3, 7.7])\nrng = np.random.default_rng(0)\nw = 0.0\nfor step in range(8):\n    i = rng.integers(len(x))\n    w -= 0.02 * 2 * x[i] * (w * x[i] - y[i])\n    print(step, round(w, 3))",output:"0 1.232\n1 1.544\n2 1.744\n3 1.769\n4 1.79\n5 1.807\n6 1.822\n7 1.837"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"Estimate the downhill direction from a small random batch, step, repeat. Cheap and noisy, and in the long run it gets there."}]}
]};
