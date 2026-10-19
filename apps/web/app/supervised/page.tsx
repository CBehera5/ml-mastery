import Link from "next/link";
import { BetaNav } from "../components/beta-nav";
import styles from "./foundation/lesson.module.css";

export const metadata = { title: "Supervised learning | ML Mastery" };

const paths = [
  ["Available: Ridge, Lasso and Elastic Net", "Six lessons connect coefficient preferences, conditional sparsity, scaling and leakage-safe selection.", "/supervised/regularization", "Open regularized regression"],
  ["Available: Logistic Regression", "Six lessons connect churn probabilities, log loss, threshold decisions and leakage-safe classification.", "/supervised/logistic", "Open Logistic Regression"],
  ["Available: K-Nearest Neighbors", "Four lessons connect distances, votes, units and leakage-safe neighbor selection.", "/supervised/knn", "Open K-Nearest Neighbors"],
  ["Available: Naive Bayes", "Four lessons connect priors, count smoothing, Gaussian densities and honest probabilistic evaluation.", "/supervised/naive-bayes", "Open Naive Bayes"],
  ["Available: Decision Trees", "Six lessons connect regression leaves, Gini splits, depth, pruning and leakage-safe evaluation.", "/supervised/decision-trees", "Open Decision Trees"],
  ["Available: Random Forests", "Five lessons connect bootstrap diversity, price means, probability averages, OOB limits and honest importance.", "/supervised/random-forests", "Open Random Forests"],
  ["Available: Gradient Boosting", "Six lessons connect sequential correction, regression residuals, classification gradients and validation-stage selection.", "/supervised/gradient-boosting", "Open Gradient Boosting"],
  ["Available: Support Vector Machines", "Five lessons connect margin geometry, C, RBF locality, training-only scaling and honest classification.", "/supervised/svm", "Open Support Vector Machines"],
  ["Available: Introductory Multilayer Perceptrons", "Five lessons connect nonlinear units, forward passes, gradients, fold-safe evaluation and model limitations.", "/supervised/mlp", "Open introductory MLP"],
] as const;

function PathCard({ title, description, href, link }: { title: string; description: string; href: string; link: string }) {
  return <section className={styles.card}><h2>{title}</h2><p>{description}</p><Link href={href}>{link}</Link></section>;
}

export default function Page() {
  return <main className={styles.page}>
    <BetaNav status="Supervised learning" />
    <header><p>ML Mastery — Learn Machine Learning by Doing.</p><h1>Supervised learning</h1><p>Real problem → Visual intuition → Experiment → Mathematics → Python → Evaluation → Comparison.</p></header>
    <section className={styles.card}><h2>Original EV01 prototype</h2><p>EV01 teaches targets, feature availability, split boundaries and the limits of predictive claims. Its original practice and records remain intact. Prototype completion does not award the separate full-module mastery.</p><Link href="/supervised/evaluation/ev01">Start EV01: Define the prediction moment</Link></section>
    <section className={styles.card}><h2>Available: Evaluation Foundations</h2><p>Six lessons connect prediction permissions, honest comparisons, classification costs, probability quality, uncertainty and fold-local workflows. Full-module practice and independent mastery are separate from the preserved EV01 prototype.</p><Link href="/supervised/evaluation">Open Evaluation Foundations</Link></section>
    <PathCard title="Available learning paths" description="Polynomial Regression connects curved features and model flexibility." href="/supervised/polynomial" link="Open Polynomial Regression" />
    <section className={styles.card}><p>Model Selection &amp; Comparison connects fair comparisons, search, nested validation, decision costs, responsible interpretation and a reproducible final choice.</p><Link href="/supervised/model-selection">Open Model Selection &amp; Comparison</Link></section>
    {paths.map(([title, description, href, link]) => <PathCard key={href} title={title} description={description} href={href} link={link} />)}
    <section className={styles.card}><h2>Existing algorithm course</h2><Link href="/learn/linear-regression">Linear Regression: existing lessons and independent mastery</Link><p>Its content, progress and mastery are unchanged.</p></section>
    <section className={styles.card}><h2>Planned, not available here</h2><p>Project Studio — Coming Soon. The full Studio and capstones are not available yet.</p></section>
    <Link href="/journey">Return to your learning journey</Link>
  </main>;
}
