import type {DeepLesson} from "../../teaching/deep-read";
export const PROJECTION:DeepLesson={title:"Least squares is a shadow",minutes:12,sections:[
 {id:"p-observe",kicker:"1 · Observe",title:"A line that cannot hit every point",blocks:[
  {kind:"p",text:"Three flats have sizes 1, 2 and 3 (in hundreds of square feet) and prices ₹2, ₹2 and ₹5 lakh. You want one rule, price = w × size. No single w makes all three exact: w = 2 gets the first two right and misses the third. So which w is the best compromise, and what does “best” even mean?"},
  {kind:"callout",tone:"idea",title:"The question",text:"When no exact answer exists, what is the closest answer, and how do you find it without trial and error?"}]},
 {id:"p-express",kicker:"2 · Express",title:"Prices are an arrow, and so is every possible rule",blocks:[
  {kind:"p",text:"Stack the three prices into one vector y = (2, 2, 5). Stack the sizes into x = (1, 2, 3). Any rule w × x is a multiple of x, so all the predictions we can make lie along one line through the origin in 3-D space. The true prices y are not on that line. That is why no w is exact."},
  {kind:"p",text:"The closest point on the line to y is its shadow: the point you get by dropping a perpendicular from y onto the line. Perpendicular is the key. The leftover gap, called the residual, makes a right angle with x, which means their dot product is zero."},
  {kind:"eq",lines:["residual = y − w x","residual · x = 0","(y − w x) · x = 0","w = (x · y) / (x · x)"],note:"Demanding a right angle gives the answer in one step."},
  {kind:"p",text:"Put in the numbers. x · y = 1×2 + 2×2 + 3×5 = 21 and x · x = 1 + 4 + 9 = 14, so w = 21 / 14 = 1.5."}]},
 {id:"p-visualize",kicker:"3 · Visualize",title:"Check that the gap is square to the line",blocks:[
  {kind:"table",caption:"Three candidate rules for y = (2, 2, 5)",headers:["w","Prediction w·x","Residual y − w·x","Residual · x","Sum of squared errors"],rows:[["1","(1, 2, 3)","(1, 0, 2)","7","5"],["1.5","(1.5, 3, 4.5)","(0.5, −1, 0.5)","0","1.5"],["2","(2, 4, 6)","(0, −2, −1)","−8","5"]]},
  {kind:"p",text:"Only w = 1.5 makes the residual perpendicular to x (dot product 0), and it also has the smallest squared error, 1.5. That is not a coincidence. The shortest path from a point to a line is the perpendicular one. Slide w in the playground and watch both numbers: the dot product crosses zero at the very spot where the error bottoms out."}]},
 {id:"p-discover",kicker:"4 · Discover",title:"Why the squares: Pythagoras",blocks:[
  {kind:"p",text:"Squared error is not an arbitrary choice here. For any rule, y splits into the part along x and the part across it, and Pythagoras says their squared lengths add. The shadow's length plus the gap's length make the whole. Minimizing the gap is the same as maximizing what the line explains."},
  {kind:"eq",lines:["‖y‖² = ‖shadow‖² + ‖gap‖²","33 = 31.5 + 1.5"],note:"‖y‖² = 4 + 4 + 25 = 33. The shadow (1.5, 3, 4.5) has squared length 31.5, and the gap has 1.5."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"Least squares is projection: find the point your model can reach that is closest to the data, which is where the leftover error is perpendicular to every feature."}]},
 {id:"p-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, the simplest shadow. Project (3, 4) onto the x-axis direction (1, 0). w = (3×1 + 4×0) / 1 = 3, so the shadow is (3, 0) and the residual is (0, 4). They meet at a right angle, as they must."},
  {kind:"p",text:"Example 2, many features. With several columns the same idea gives the normal equations XᵀXw = Xᵀy. Each column of X must be perpendicular to the residual: Xᵀ(y − Xw) = 0. That single line is exactly how linear regression is solved in closed form, and it is why NumPy and scikit-learn can fit a model without any loop."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"Linear regression, PCA and the reason residuals should show no pattern against your features. If the residual still correlates with a feature, the model missed something that feature could explain."},
  {kind:"check",question:"For x = (1, 2, 3) and y = (2, 2, 5), what is the dot product of the best residual with x?",options:["0","1.5","21"],answer:0,why:"The best fit makes the residual perpendicular to x, so their dot product is exactly 0. 1.5 is the weight, and 21 is x · y."}]},
 {id:"p-wrong",kicker:"6 · Where it goes wrong",title:"Where the shadow misleads",blocks:[
  {kind:"callout",tone:"warn",title:"1 · No intercept",text:"w × x forces the line through the origin. Add a column of ones to let the line start anywhere."},
  {kind:"callout",tone:"warn",title:"2 · Features that repeat each other",text:"If two columns are nearly the same, many weight pairs give nearly the same shadow, so the weights become unstable even though predictions are fine."},
  {kind:"callout",tone:"warn",title:"3 · One far-away point",text:"Squared error gives distant points a large say, so a single outlier can tilt the whole line."}]},
 {id:"p-python",kicker:"7 · In Python",title:"The shadow in NumPy",blocks:[
  {kind:"code",caption:"Weight, residual and the right-angle check",code:"import numpy as np\n\nx = np.array([1, 2, 3])\ny = np.array([2, 2, 5])\n\nw = (x @ y) / (x @ x)\nresidual = y - w * x\nprint(w, residual, residual @ x, (residual ** 2).sum())",output:"1.5 [ 0.5 -1.   0.5] 0.0 1.5"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"The best fit is a shadow: the residual stands at a right angle to what the model can use."}]}
]};
