import Link from "next/link";
import { PublicNav } from "../../landing/public-nav";
import styles from "../../experience/pathway.module.css";
import { FOUNDATION_NAMES } from "../foundations/foundation-lessons";

export const metadata = {
  title: "Math for machine learning: what you need and where it appears",
  description: "A map from every algorithm in the course to the maths underneath it, with the Math lesson that teaches each idea and the bridge lessons that connect them.",
};

type Row = { math: string; why: string; where: string; learn: [string, string][] };
const ROWS: Row[] = [
  { math: "Algebra, functions, powers, logs", why: "A model is a function; losses and probabilities use exp and log.", where: "Every algorithm; log loss; learning-rate decay", learn: [["Algebra & functions", "/math/algebra-functions"]] },
  { math: "Vectors and dot products", why: "A row of features is a vector; a score is a dot product.", where: "Linear and logistic regression, SVM, kNN distances", learn: [["Vectors & dot product", "/math/vectors-dot-product"]] },
  { math: "Matrices and transformations", why: "A whole dataset is one matrix; layers are matrix products.", where: "Normal equation, neural networks, PCA", learn: [["Matrices", "/math/matrices-multiplication"], ["Linear algebra", "/math/linear-algebra"]] },
  { math: "Eigenvectors and the SVD", why: "Find the directions that carry the variation.", where: "PCA, stability of least squares", learn: [["Linear algebra", "/math/linear-algebra"], ["Least squares", "/math/foundations/least-squares"]] },
  { math: "Derivatives and the chain rule", why: "The slope of the loss tells each weight which way to move.", where: "Gradient descent, backpropagation, boosting", learn: [["Derivatives", "/math/derivatives"], ["Partial derivatives & gradients", "/math/foundations/gradients"]] },
  { math: "Optimization", why: "Training is minimising a loss; step size and scaling decide whether it works.", where: "Every trained model, regularisation", learn: [["Optimization", "/math/optimization"]] },
  { math: "Probability and Bayes", why: "Predictions are uncertain; classifiers output probabilities.", where: "Naive Bayes, logistic regression, calibration", learn: [["Probability", "/math/probability"], ["Likelihood, sigmoid & softmax", "/math/foundations/likelihood"]] },
  { math: "Statistics and the normal curve", why: "Scores are averages; averages have a spread.", where: "Cross-validation, model comparison, Gaussian Naive Bayes", learn: [["Statistics", "/math/statistics"], ["Normal curve & the CLT", "/math/foundations/normal"]] },
  { math: "Integration (areas and accumulation)", why: "Totals and probabilities are areas under curves.", where: "ROC AUC, expected values, continuous distributions", learn: [["Integration", "/math/integration"]] },
  { math: "Least squares", why: "The best straight-line fit is a projection.", where: "Linear, polynomial and ridge regression", learn: [["Least squares", "/math/foundations/least-squares"]] },
];
const BRIDGES = [
  { slug: "gradients", line: "Closes the gap between 'a slope' and 'a slope for every weight'." },
  { slug: "normal", line: "Why averages are bell-shaped and how sure a score is." },
  { slug: "least-squares", line: "Where the normal equation comes from and why it can wobble." },
  { slug: "likelihood", line: "Why squared error and log loss are the losses they are." },
];

export default function MlMapPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main-content">Skip to main content</a>
      <PublicNav active="Math" />
      <main id="main-content" tabIndex={-1} className={styles.container}>
        <nav aria-label="Breadcrumb"><Link href="/math">Math</Link> / Math for machine learning</nav>
        <h1 style={{ margin: ".6rem 0" }}>Math for machine learning: what you need, and where it appears</h1>
        <p>You do not need all of mathematics to build good models. You need ten ideas, each with a reason. This map shows the idea, why a model needs it, where you will meet it in the Algorithms section, and the lesson that teaches it.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 640 }}>
            <caption style={{ textAlign: "left", fontWeight: 600, padding: ".5rem 0" }}>The ten ideas under machine learning</caption>
            <thead><tr>{["Idea", "Why a model needs it", "Where it appears", "Learn it"].map((h) => <th key={h} scope="col" style={{ textAlign: "left", borderBottom: "2px solid currentColor", padding: ".4rem" }}>{h}</th>)}</tr></thead>
            <tbody>{ROWS.map((r) => (
              <tr key={r.math}>
                <th scope="row" style={{ textAlign: "left", padding: ".5rem .4rem", borderBottom: "1px solid #8884", verticalAlign: "top" }}>{r.math}</th>
                <td style={{ padding: ".5rem .4rem", borderBottom: "1px solid #8884", verticalAlign: "top" }}>{r.why}</td>
                <td style={{ padding: ".5rem .4rem", borderBottom: "1px solid #8884", verticalAlign: "top" }}>{r.where}</td>
                <td style={{ padding: ".5rem .4rem", borderBottom: "1px solid #8884", verticalAlign: "top" }}>{r.learn.map(([t, h], i) => <span key={h}>{i > 0 ? " · " : ""}<Link href={h}>{t}</Link></span>)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <h2 style={{ marginTop: "2rem" }}>Four bridge lessons</h2>
        <p>These sit between the Math lessons and the Algorithms, and fill in the steps that connect them. Each has figures and code that runs in your browser.</p>
        <ul>{BRIDGES.map((b) => <li key={b.slug}><Link href={`/math/foundations/${b.slug}`}>{FOUNDATION_NAMES[b.slug]}</Link> — {b.line}</li>)}</ul>
        <h2 style={{ marginTop: "2rem" }}>A suggested order</h2>
        <ol>
          <li>Algebra and functions, then vectors and dot products.</li>
          <li>Derivatives, then partial derivatives and the gradient, then optimization.</li>
          <li>Matrices, then least squares.</li>
          <li>Probability, statistics and the normal curve, then likelihood.</li>
          <li>Start the Algorithms with <Link href="/algorithms/linear-regression">Linear Regression</Link>, and open each model&apos;s playbook as you go.</li>
        </ol>
        <p>Stuck on which model to use? <Link href="/algorithms/choose-a-model">How to choose a model</Link>.</p>
      </main>
    </div>
  );
}
