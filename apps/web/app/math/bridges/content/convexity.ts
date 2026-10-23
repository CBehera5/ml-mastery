import type {DeepLesson} from "../../teaching/deep-read";
export const CONVEXITY:DeepLesson={title:"One valley, or many?",minutes:12,sections:[
 {id:"c-observe",kicker:"1 · Observe",title:"Two hikers, one mountain range",blocks:[
  {kind:"p",text:"Two hikers start on different slopes and each walks steadily downhill until the ground flattens. If the land is one big bowl, both end up at the same lowest point. If it has several dips, they can stop in different ones, and one of them is stuck in a shallow valley while a deeper one lies over the ridge. Gradient descent is exactly this hiker."},
  {kind:"callout",tone:"idea",title:"The question",text:"When can you trust that walking downhill reaches the best answer?"}]},
 {id:"c-express",kicker:"2 · Express",title:"Bowls bend upward",blocks:[
  {kind:"p",text:"A curve is convex if a straight chord between any two of its points never dips below the curve. The bowl f(w) = (w − 3)² is convex. Check: f(1) = 4 and f(5) = 4, the chord at w = 3 sits at height 4, while the curve there is f(3) = 0, far below the chord, which is what a bowl does."},
  {kind:"p",text:"A faster test uses the second derivative, the rate at which the slope itself is changing. If it is never negative, the curve only bends upward."},
  {kind:"eq",lines:["f(w) = (w − 3)²  →  f′ = 2(w − 3),  f″ = 2 > 0  (convex)","L(w) = (2w − 6)²  →  L″ = 8 > 0  (convex)"],note:"The loss from the very first lesson is a bowl."}]},
 {id:"c-visualize",kicker:"3 · Visualize",title:"A bumpy landscape",blocks:[
  {kind:"p",text:"Now take f(w) = w⁴ − 4w² + w. It has two dips. Run gradient descent with step 0.02 for 200 steps from three different starting points."},
  {kind:"table",caption:"Gradient descent on f(w) = w⁴ − 4w² + w",headers:["Start","Ends at w","Loss there"],rows:[["1.5","1.347","−2.62"],["0.1","−1.473","−5.44"],["−1.5","−1.473","−5.44"]]},
  {kind:"p",text:"Starting at 1.5 the hiker settles into the shallow right dip, where the loss is −2.62. The other two reach the deeper dip at −5.44. Same rule, same step, different answer, decided only by where you begin. Try it in the playground."}]},
 {id:"c-discover",kicker:"4 · Discover",title:"Convex problems have no traps",blocks:[
  {kind:"p",text:"For a convex function every dip is the lowest dip: any place where the slope is zero is a global minimum. So gradient descent, with a sensible step, cannot be fooled by where it starts. Linear regression with squared error and logistic regression with cross-entropy are both convex."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"Convex loss means one valley, so walking downhill always finds the best answer. Non-convex loss can have many valleys, and the start matters."},
  {kind:"p",text:"Neural networks are not convex, yet they train well in practice. Good starting points, random restarts and noise in the steps help the hiker find a good enough valley, even if it is not provably the deepest."}]},
 {id:"c-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, a safe loss. For the mean squared error of a line, the loss as a function of the weights is a bowl in many dimensions. Gradient descent with a small enough step reaches the one answer every time, which is also what the closed-form formula gives."},
  {kind:"p",text:"Example 2, a risky loss. Training a small neural network from two different random starts can give two different models with different test accuracy. This is not a bug. The loss has many dips. Teams run several seeds and report the spread."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Choosing losses that are easy to optimize, regularization terms that keep things convex, SVM training (convex), and the reason neural networks need care with initialization."},
  {kind:"check",question:"A loss is convex. Gradient descent from two different starts will…",options:["Reach the same minimum value","Always reach different minima","Never converge"],answer:0,why:"In a convex problem every local minimum is global, so both starts reach the same lowest value, given a suitable step size."}]},
 {id:"c-wrong",kicker:"6 · Where it goes wrong",title:"Three traps",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Convex does not mean fast",text:"A bowl can be a long narrow trough where plain descent zigzags."},
  {kind:"callout",tone:"warn",title:"2 · Flat is not always a minimum",text:"A zero slope can be a top or a saddle. In a bowl it is the bottom, elsewhere it may not be."},
  {kind:"callout",tone:"warn",title:"3 · A step that is too big",text:"Even on a bowl, an oversized step overshoots and can diverge."}]},
 {id:"c-python",kicker:"7 · In Python",title:"Three hikers",blocks:[
  {kind:"code",caption:"Gradient descent from several starts",code:"def grad(w):\n    return 4 * w**3 - 8 * w + 1\n\ndef f(w):\n    return w**4 - 4 * w**2 + w\n\nfor start in [1.5, 0.1, -1.5]:\n    w = start\n    for _ in range(200):\n        w -= 0.02 * grad(w)\n    print(start, round(w, 3), round(f(w), 2))",output:"1.5 1.347 -2.62\n0.1 -1.473 -5.44\n-1.5 -1.473 -5.44"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"On a bowl, any downhill walk finds the bottom. On a bumpy landscape, where you start decides where you end."}]}
]};
