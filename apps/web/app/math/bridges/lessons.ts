import type {DeepLesson} from "../teaching/deep-read";
import {NORMS} from "./content/norms";
import {EXPECTATION} from "./content/expectation";
import {MLE} from "./content/mle";
export type Bridge={slug:string;title:string;blurb:string;needs:string;unlocks:string;lesson:DeepLesson};
export const BRIDGES:Bridge[]=[
 {slug:"norms",title:"Norms and distance",blurb:"How far apart are two customers? Three honest answers.",needs:"Vectors and the dot product",unlocks:"KNN, k-means, regularization",lesson:NORMS},
 {slug:"expectation",title:"Expectation and variance",blurb:"What a gamble is worth on average, and how wildly it swings.",needs:"Probability distributions",unlocks:"Loss functions, bias and variance",lesson:EXPECTATION},
 {slug:"mle",title:"Likelihood and maximum likelihood",blurb:"Which story makes the data least surprising? That is how models learn.",needs:"Probability, logarithms, derivatives",unlocks:"Logistic regression, cross-entropy, naive Bayes",lesson:MLE},
];
