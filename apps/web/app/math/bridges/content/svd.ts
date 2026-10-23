import type {DeepLesson} from "../../teaching/deep-read";
export const SVD:DeepLesson={title:"Which direction carries the story?",minutes:13,sections:[
 {id:"s-observe",kicker:"1 · Observe",title:"Two columns that are really one",blocks:[
  {kind:"p",text:"A bank records two numbers for each customer: monthly income and monthly spend, both in ₹ thousands and measured from the average. Plot a few customers and the points hug a slanted line. When income goes up, spend goes up, nearly in lockstep. You recorded two numbers, but almost all of the information is in one: how far along that slanted line a customer sits."},
  {kind:"callout",tone:"idea",title:"The question",text:"Can you find the one direction that carries most of the variation, and throw the rest away with little loss?"}]},
 {id:"s-express",kicker:"2 · Express",title:"Spread has a formula, and so does its direction",blocks:[
  {kind:"p",text:"Take four customers, already centred: (3, 2), (−3, −2), (1, 1), (−1, −1). The covariance matrix collects how each pair of columns varies together: C = (1/n) XᵀX."},
  {kind:"eq",lines:["C = (1/4) [[3²+3²+1+1, 6+6+1+1],[6+6+1+1, 4+4+1+1]]","  = [[5, 3.5],[3.5, 2.5]]"],note:"The diagonal is each column's variance. The off-diagonal says they rise together."},
  {kind:"p",text:"If you project the customers onto a direction u (a unit arrow), the spread of the shadows is uᵀCu. Different directions give different spreads. We want the direction with the largest one. That direction is an eigenvector of C, and the spread it carries is its eigenvalue."}]},
 {id:"s-visualize",kicker:"3 · Visualize",title:"Spin a line and watch the spread",blocks:[
  {kind:"table",caption:"Spread of the shadows when projecting onto a line at angle θ",headers:["Direction","Spread uᵀCu"],rows:[["0° (income only)","5"],["35.2° (best)","7.47"],["45°","7.25"],["90° (spend only)","2.5"]]},
  {kind:"p",text:"Spin the line in the playground. The spread rises, peaks near 35°, and falls. The peak, 7.47, is the first principal component. The perpendicular direction carries the rest, 0.03. The two add back to the total variance 5 + 2.5 = 7.5, so one direction explains 99.6 percent of everything."}]},
 {id:"s-discover",kicker:"4 · Discover",title:"Principal components, and SVD in one breath",blocks:[
  {kind:"p",text:"The eigenvalues of C are 7.47 and 0.03. The eigenvectors, (0.82, 0.58) and (−0.58, 0.82), are the principal components: perpendicular directions ordered by how much variation they carry. PCA is just rotating your axes to line up with them."},
  {kind:"p",text:"The singular value decomposition, SVD, is the same story told for any table, not only square ones. It writes X as a stack of simple pieces, each a direction, a strength and a pattern across rows. Keeping the biggest few pieces gives the best low-rank approximation of X, the closest you can get with that many pieces."},
  {kind:"callout",tone:"idea",title:"The idea in one sentence",text:"PCA finds the perpendicular directions that capture the most variation, so you can describe each row with a few numbers instead of many."}]},
 {id:"s-apply",kicker:"5 · Apply",title:"Two worked examples",blocks:[
  {kind:"p",text:"Example 1, compressing the bank data. Keep only the first component. Customer (3, 2) lands at 3 × 0.817 + 2 × 0.576 = 3.60 along it. Rebuilding gives (2.94, 2.07), very close to the original (3, 2). We replaced two numbers by one and lost almost nothing."},
  {kind:"p",text:"Example 2, deciding how many components. Add up eigenvalues from the biggest. If the first two of ten components explain 85 percent and the next eight add just 15, keep two for a chart and maybe five if you need 95 percent. The “explained variance” list is the guide."},
  {kind:"callout",tone:"ml",title:"Where you will meet this",text:"PCA to shrink many features, to plot data in two dimensions, to remove noise, and to fix collinear columns. SVD underlies recommendations, search and word embeddings."},
  {kind:"check",question:"The covariance matrix has eigenvalues 7.47 and 0.03. What share of the variation does the first component carry?",options:["About 99.6 percent","About 50 percent","About 7.47 percent"],answer:0,why:"7.47 / (7.47 + 0.03) is about 0.996. A near-zero second eigenvalue means the data is almost one-dimensional."}]},
 {id:"s-wrong",kicker:"6 · Where it goes wrong",title:"Where PCA misleads",blocks:[
  {kind:"callout",tone:"warn",title:"1 · Forgetting to centre",text:"PCA assumes the average is subtracted first. Without it, the top direction just points at the average."},
  {kind:"callout",tone:"warn",title:"2 · Mixed units",text:"A column in rupees will dominate one in years because its variance is bigger. Standardize before PCA."},
  {kind:"callout",tone:"warn",title:"3 · Big variance is not the same as useful",text:"The label may live in a low-variance direction. PCA is blind to the target, so it can throw away exactly what you needed."}]},
 {id:"s-python",kicker:"7 · In Python",title:"Eigenvalues and PCA in NumPy",blocks:[
  {kind:"code",caption:"Covariance, eigenvalues and explained variance",code:"import numpy as np\n\nX = np.array([[3, 2], [-3, -2], [1, 1], [-1, -1]])\nC = X.T @ X / len(X)\nvals, vecs = np.linalg.eigh(C)\n\nprint(C)\nprint(vals.round(3), (vals / vals.sum()).round(3))",output:"[[5.  3.5]\n [3.5 2.5]]\n[0.033 7.467] [0.004 0.996]"},
  {kind:"callout",tone:"idea",title:"Keep this",text:"Centre, find the directions of largest spread, keep the top few. That is PCA."}]}
]};
