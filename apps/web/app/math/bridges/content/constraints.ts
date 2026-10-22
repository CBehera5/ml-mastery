import type {DeepLesson} from "../../teaching/deep-read";
export const CONSTRAINTS:DeepLesson={title:"The best answer within the rules",minutes:12,sections:[
 {id:"k-observe",kicker:"1 · Observe",title:"A farmer and twenty metres of fence",blocks:[
  {kind:"p",text:"A farmer has 20 metres of fence and wants the biggest rectangular plot. Without any limit the answer is “infinitely large”. The fence is a constraint, and it changes the whole problem from “maximise area” into “maximise area, given a fixed perimeter”. Most real decisions come with a rule like this: a budget, a capacity, a margin."},
  {kind:"callout",tone:"idea",title:"The question",text:"How do you find the best value when you are not allowed to go anywhere you like?"}]},
 {id:"k-express",kicker:"2 · Express",title:"Spend the constraint, then solve",blocks:[
  {kind:"p",text:"Let the sides be x and y. The fence says 2x + 2y = 20, so y = 10 − x. Now area = x × y = x(10 − x) = 10x − x². The constraint removed a variable. This is the simplest way to handle a constraint: substitute it away."},
  {kind:"eq",lines:["area(x) = 10x − x²","area′(x) = 10 − 2x = 0  →  x = 5","y = 5, area = 25 m²"],note:"The best rectangle is a square."}]},
 {id:"k-visualize",kicker:"3 · Visualize",title:"Walking along the fence line",blocks:[
  {kind:"table",caption:"Every rectangle that uses exactly 20 m of fence",headers:["Width x","Height y","Area"],rows:[["2","8","16"],["4","6","24"],["5","5","25"],["6","4","24"],["8","2","16"]]},
  {kind:"p",text:"The constraint leaves you on a single line of choices. Area climbs, peaks at the square, and falls. Slide x in the playground and watch the area peak at 5."}]},
 {id:"k-discover",kicker:"4 · Discover",title:"At the best point, the two slopes line up",blocks:[
  {kind:"p",text:"Substitution is not always possible. A more general view: at the best point on the constraint, the direction of steepest increase of area is parallel to the direction the constraint is steepest. Otherwise you could slide along the fence and gain area. In symbols the gradients are proportional: ∇f = λ∇g, where λ (lambda) is called a Lagrange multiplier."},
  {kind:"eq",lines:["f = xy, g = 2x + 2y","∇f = (y, x),  ∇g = (2, 2)","(y, x) = λ (2, 2)  →  x = y"],note:"The same answer as before: a square. λ also says how much the best area would grow per extra metre of fence."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"With a constraint, the best point is where the objective can no longer improve without breaking the rule, which is where the two gradients point the same way."}]},
 {id:"k-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, the SVM margin. Two points: a negative class at (0, 0) and a positive class at (2, 2). We want a boundary w · x + b = 0 with the data at least 1 away in the units of the score: −(w·x + b) ≥ 1 for the negative and w·x + b ≥ 1 for the positive. The margin width is 2 / ‖w‖, so a wide margin means a small ‖w‖. Minimise ½‖w‖² subject to those two rules."},
  {kind:"p",text:"By symmetry take w = (a, a). The negative point gives −b ≥ 1, so b = −1. The positive gives 4a + b ≥ 1, so a = 0.5. Then ‖w‖ = √0.5 = 0.707 and the margin is 2 / 0.707 = 2.83, exactly the distance between the two points, √8. The boundary sits halfway between them."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"SVMs (margin with constraints), regularization as a budget on weights (‖w‖ ≤ t is the same as adding a penalty), fairness or capacity limits, and any “maximise this, but stay within that”."},
  {kind:"check",question:"With 20 m of fence, which plot has the largest area?",options:["5 m × 5 m","2 m × 8 m","4 m × 6 m"],answer:0,why:"Areas are 25, 16 and 24. For a fixed perimeter the square wins."}]},
 {id:"k-wrong",kicker:"6 · Where it goes wrong",title:"Three traps",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Optimising without the rule",text:"Solving the unconstrained problem and clipping afterwards can give a poor answer."},
  {kind:"callout",tone:"warn",title:"2 · Inequalities versus equalities",text:"A fence that must be at most 20 m can leave slack. Only the rules that actually bind shape the answer."},
  {kind:"callout",tone:"warn",title:"3 · Ignoring feasibility",text:"If the rules contradict each other, no answer exists. A model that cannot separate overlapping classes needs a soft margin."}]},
 {id:"k-python",kicker:"7 · In Python",title:"Search along the constraint",blocks:[
  {kind:"code",caption:"Try every width along the fence",code:"best = max(((x, x * (10 - x)) for x in range(1, 10)), key=lambda t: t[1])\nprint(best)\n\nimport math\nw = 0.5 * math.sqrt(2)\nprint(round(2 / w, 3), round(math.sqrt(8), 3))",output:"(5, 25)\n2.828 2.828"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"A constraint narrows where you may look. The best point is where nothing allowed can do better, which is where the slopes line up."}]}
]};
