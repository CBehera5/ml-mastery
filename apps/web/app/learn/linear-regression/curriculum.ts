export const LINEAR_REGRESSION_PATH = "/learn/linear-regression";

export type RegressionLessonId =
  | "why"
  | "equation"
  | "errors"
  | "gradient-descent"
  | "multiple-features"
  | "implementation"
  | "failure-modes"
  | "project"
  | "mastery";

export type RegressionLesson = {
  id: RegressionLessonId;
  number: number;
  title: string;
  shortTitle: string;
  objective: string;
  summary: string;
  duration: string;
  type: "learn" | "lab" | "practice" | "project" | "assessment";
  futureDeliverables: string[];
};

export const REGRESSION_LESSONS: RegressionLesson[] = [
  { id:"why", number:1, title:"Why Linear Regression Exists", shortTitle:"Why it exists", objective:"Frame a prediction problem using features, targets, observations, and estimates.", summary:"Explore a small house-price dataset and reason about a prediction before seeing an equation.", duration:"12 min", type:"learn", futureDeliverables:["Scatterplot exploration","Prediction-before-reveal check","Concept assessment"] },
  { id:"equation", number:2, title:"From Intuition to Equation", shortTitle:"The equation", objective:"Interpret weight, bias, slope, and the equation y = wx + b.", summary:"Connect a line on a graph to its numerical prediction and then extend the idea to multiple inputs.", duration:"15 min", type:"lab", futureDeliverables:["Weight and bias controls","Regression-line SVG","Calculation inspector"] },
  { id:"errors", number:3, title:"Measuring Prediction Errors", shortTitle:"Errors & metrics", objective:"Compare residuals, MAE, MSE, and RMSE and explain their tradeoffs.", summary:"Inspect prediction misses and predict which parameter change should improve the model.", duration:"18 min", type:"lab", futureDeliverables:["Residual visualization","Metric comparison","Loss-curve experiment"] },
  { id:"gradient-descent", number:4, title:"How Gradient Descent Learns", shortTitle:"Gradient descent", objective:"Explain gradients, learning rate, updates, convergence, and divergence.", summary:"Step through training and connect each parameter movement to a change in dataset MSE.", duration:"20 min", type:"lab", futureDeliverables:["Training stepper","Loss history","Divergence diagnostics"] },
  { id:"multiple-features", number:5, title:"Multiple Linear Regression", shortTitle:"Multiple features", objective:"Use feature and weight vectors, matrix multiplication, and feature scaling.", summary:"Add and remove controlled features while preserving interpretable calculations.", duration:"20 min", type:"lab", futureDeliverables:["Feature selector","Matrix trace","Scaling diagnostic"] },
  { id:"implementation", number:6, title:"Implementing the Algorithm", shortTitle:"Implementation", objective:"Translate predictions, metrics, gradients, and training into NumPy code.", summary:"Complete deterministic code exercises and compare the result with scikit-learn.", duration:"22 min", type:"practice", futureDeliverables:["Guided code gaps","Downloadable notebook","Deterministic checks"] },
  { id:"failure-modes", number:7, title:"When Linear Regression Fails", shortTitle:"Failure modes", objective:"Diagnose underfitting, outliers, nonlinearity, scaling, leakage, and correlated features.", summary:"Investigate deliberately problematic datasets and choose a defensible next action.", duration:"20 min", type:"practice", futureDeliverables:["Dataset diagnostics","Misconception feedback","Remediation links"] },
  { id:"project", number:8, title:"Real-World Application", shortTitle:"Guided project", objective:"Build and evaluate a complete regression workflow and explain its limitations.", summary:"Inspect data, select features, train, evaluate, and communicate model decisions.", duration:"30 min", type:"project", futureDeliverables:["Guided project brief","Decision record","Evaluation rubric"] },
  { id:"mastery", number:9, title:"Independent Mastery Challenge", shortTitle:"Mastery", objective:"Solve an unfamiliar prediction problem with justified mathematical and modeling choices.", summary:"Demonstrate conceptual, applied, and independent competence without an upfront walkthrough.", duration:"25 min", type:"assessment", futureDeliverables:["Three-level rubric","Alternative retry","Targeted remediation"] },
];

export const REGRESSION_PREREQUISITES = [
  { title:"Functions and graphs", href:"/math/functions-derivatives", detail:"Inputs, outputs, and visual relationships" },
  { title:"Vectors and weighted sums", href:"/math/vectors-dot-product", detail:"Feature vectors and dot products" },
  { title:"Matrices", href:"/math/matrices-multiplication", detail:"Batching examples and compatible shapes" },
  { title:"Derivatives and gradients", href:"/math/derivatives", detail:"Local sensitivity and the chain rule" },
] as const;

export function regressionLessonStatus(id: RegressionLessonId): "planned" | "implemented" | "verified" {
  if (["why", "errors", "implementation", "equation", "gradient-descent", "multiple-features", "failure-modes"].includes(id)) return "verified";
  if (id === "project" || id === "mastery") return "implemented";
  return "planned";
}

export function lessonHref(id: RegressionLessonId) { return `${LINEAR_REGRESSION_PATH}/${id}`; }
export function findRegressionLesson(id: string) { return REGRESSION_LESSONS.find((lesson) => lesson.id === id); }
export function adjacentLessons(id: RegressionLessonId) {
  const index = REGRESSION_LESSONS.findIndex((lesson) => lesson.id === id);
  return { previous:index>0?REGRESSION_LESSONS[index-1]:null, next:index<REGRESSION_LESSONS.length-1?REGRESSION_LESSONS[index+1]:null };
}
