import type {DeepLesson} from "../teaching/deep-read";
import {NORMS} from "./content/norms";
import {EXPECTATION} from "./content/expectation";
import {MLE} from "./content/mle";
import {PROJECTION} from "./content/projection";
import {SVD} from "./content/svd";
import {INFORMATION} from "./content/information";
import {INFERENCE} from "./content/inference";
import {BIAS_VARIANCE} from "./content/bias-variance";
import {CONVEXITY} from "./content/convexity";
import {STOCHASTIC} from "./content/stochastic";
import {CONSTRAINTS} from "./content/constraints";
export type Bridge={slug:string;title:string;blurb:string;needs:string;unlocks:string;lesson:DeepLesson};
export const BRIDGES:Bridge[]=[
 {slug:"norms",title:"Norms and distance",blurb:"How far apart are two customers? Three honest answers.",needs:"Vectors and the dot product",unlocks:"KNN, k-means, regularization",lesson:NORMS},
 {slug:"expectation",title:"Expectation and variance",blurb:"What a gamble is worth on average, and how wildly it swings.",needs:"Probability distributions",unlocks:"Loss functions, bias and variance",lesson:EXPECTATION},
 {slug:"mle",title:"Likelihood and maximum likelihood",blurb:"Which story makes the data least surprising? That is how models learn.",needs:"Probability, logarithms, derivatives",unlocks:"Logistic regression, cross-entropy, naive Bayes",lesson:MLE},
 {slug:"projection",title:"Least squares is a shadow",blurb:"When no exact answer exists, the closest one is a shadow.",needs:"Dot product, vectors",unlocks:"Linear regression, PCA",lesson:PROJECTION},
 {slug:"svd",title:"Principal components and SVD",blurb:"Find the one direction that carries the story.",needs:"Matrices, eigenvectors, variance",unlocks:"PCA, recommendations, embeddings",lesson:SVD},
 {slug:"information",title:"Entropy and cross-entropy",blurb:"How surprised should you be, and what does a wrong belief cost?",needs:"Probability, logarithms",unlocks:"Decision trees, neural-net losses",lesson:INFORMATION},
 {slug:"inference",title:"Intervals and tests",blurb:"How sure can you be from a sample, and is a gap real or luck?",needs:"Distributions, spread, sampling",unlocks:"Comparing models, A/B tests",lesson:INFERENCE},
 {slug:"bias-variance",title:"Bias and variance",blurb:"Why a slightly wrong guess can beat an honest one.",needs:"Expectation and variance",unlocks:"Regularization, ensembles, model choice",lesson:BIAS_VARIANCE},
 {slug:"convexity",title:"Convexity: one valley or many",blurb:"When walking downhill is guaranteed to find the best answer.",needs:"Derivatives, gradient steps",unlocks:"Why some models train safely, others need care",lesson:CONVEXITY},
 {slug:"stochastic",title:"Stochastic gradient descent",blurb:"Learning from a handful of rows at a time.",needs:"Gradient descent, averages",unlocks:"Neural networks, large-scale training",lesson:STOCHASTIC},
 {slug:"constraints",title:"Constraints and Lagrange",blurb:"The best answer within the rules.",needs:"Derivatives, gradients",unlocks:"SVM margin, budgets on weights",lesson:CONSTRAINTS},
];
