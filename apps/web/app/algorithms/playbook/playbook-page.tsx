import Link from "next/link";
import { PublicNav } from "../../landing/public-nav";
import styles from "../../experience/pathway.module.css";
import { DeepRead } from "../../math/teaching/deep-read";
import { PLAYBOOKS } from "../deep/playbooks";

export const PLAYBOOK_NAMES: Record<string, string> = {
  "linear-regression": "Linear Regression", polynomial: "Polynomial Regression", regularization: "Ridge, Lasso & Elastic Net",
  logistic: "Logistic Regression", knn: "K-Nearest Neighbors", "naive-bayes": "Naive Bayes", svm: "Support Vector Machines",
  "decision-trees": "Decision Trees", "random-forests": "Random Forests", "gradient-boosting": "Gradient Boosting", mlp: "Multilayer Perceptrons",
};
export const playbookMetadata = (slug: string) => ({
  title: `${PLAYBOOK_NAMES[slug]} playbook`,
  description: `Build ${PLAYBOOK_NAMES[slug]} from scratch, use it in scikit-learn step by step, tune it, and decide when it is the right model.`,
});

/** One page per algorithm: why use it, the idea drawn, build it, use scikit-learn, tune, choose, pitfalls. */
export function PlaybookPage({ slug }: { slug: string }) {
  const lesson = PLAYBOOKS[slug];
  const name = PLAYBOOK_NAMES[slug];
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main-content">Skip to main content</a>
      <PublicNav active="Algorithms" />
      <main id="main-content" tabIndex={-1} className={styles.container}>
        <nav aria-label="Breadcrumb"><Link href="/algorithms">Algorithms</Link> / <Link href={`/algorithms/${slug}`}>{name}</Link> / Playbook</nav>
        <p style={{ margin: "1rem 0 0", fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase" }}>Playbook · implement it and choose it</p>
        <h1 style={{ margin: ".2rem 0 .5rem" }}>{name}: how to build it and when to use it</h1>
        <p>Follow this page with the lessons open beside it. Every code block runs in your browser, so change a number and watch what moves.</p>
        <DeepRead lesson={lesson} />
        <p style={{ margin: "2rem 0" }}>
          <Link href={`/algorithms/${slug}`}>← Back to the {name} lessons</Link> · <Link href="/algorithms/choose-a-model">Compare all models: how to choose</Link>
        </p>
      </main>
    </div>
  );
}
