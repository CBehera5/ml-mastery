import Link from "next/link";
import { PublicNav } from "../../landing/public-nav";
import styles from "../../experience/pathway.module.css";
import { DeepRead } from "../../math/teaching/deep-read";
import { CHOOSE_GUIDE } from "../deep/choose-guide";
import { PLAYBOOK_NAMES } from "../playbook/playbook-page";

export const metadata = {
  title: "How to choose a model",
  description: "A step-by-step method for picking a machine-learning model: baselines first, a comparison table of every model, a decision flow, and a fair comparison you can run in your browser.",
};

export default function ChooseAModelPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main-content">Skip to main content</a>
      <PublicNav active="Algorithms" />
      <main id="main-content" tabIndex={-1} className={styles.container}>
        <nav aria-label="Breadcrumb"><Link href="/algorithms">Algorithms</Link> / How to choose a model</nav>
        <p style={{ margin: "1rem 0 0", fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase" }}>Guide · why and how to select a model</p>
        <h1 style={{ margin: ".2rem 0 .5rem" }}>How to choose a model</h1>
        <p>No model wins everywhere. Use this method and the runnable comparison to decide for your own data.</p>
        <DeepRead lesson={CHOOSE_GUIDE} />
        <h2 style={{ marginTop: "2rem" }}>Open a playbook</h2>
        <ul>
          {Object.entries(PLAYBOOK_NAMES).map(([slug, name]) => (
            <li key={slug}><Link href={`/algorithms/${slug}/playbook`}>{name}</Link></li>
          ))}
        </ul>
      </main>
    </div>
  );
}
