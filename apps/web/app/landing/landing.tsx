import Link from "next/link";
import { PublicNav } from "./public-nav";
import styles from "./landing.module.css";

const stages = [
  { title: "Math Lab", status: "Available", description: "Understand the ideas behind models.", outcome: "Connect equations, vectors, probability and gradients to predictions.", href: "/math", action: "Explore mathematics" },
  { title: "Python Lab", status: "Available", description: "Turn ideas into reliable code.", outcome: "Work with Python, NumPy, pandas, visualization, data preparation and scikit-learn.", href: "/python", action: "Explore Python" },
  { title: "Algorithm Lab", status: "Available curriculum", description: "See how models learn and compare them.", outcome: "Study regression, classification, introductory neural networks and model selection.", href: "/supervised", action: "Explore algorithms" },
  { title: "Project Studio", status: "Coming Soon", description: "Bring your skills together in future guided projects.", outcome: "The full Studio and capstones are not available yet.", href: null, action: null },
];

export function Landing() {
  return <div className={styles.page}>
    <a className={styles.skip} href="#main-content">Skip to main content</a>
    <PublicNav />
    <main className={styles.main} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="welcome-title">
        <p className={styles.eyebrow}>Understand it. Try it. Build on it.</p>
        <h1 id="welcome-title">Machine learning<br /> <span>finally makes sense.</span></h1>
        <p className={styles.intro}>Explore the maths, connect it to Python, and see how models learn — one clear step at a time.</p>
        <div className={styles.actions}><Link className={styles.primary} href="/demo">Try a Free Lab <span aria-hidden="true">↗</span></Link><Link href="/journey">My learning journey <span aria-hidden="true">→</span></Link></div>
        <p className={styles.caption}>Start in <strong>ML Math Lab</strong>: explore one linear neuron, its inputs, weights, prediction and one learning step. No sign-up required.</p>
      </section>
      <section className={styles.path} id="learning-stages" aria-labelledby="stages-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>Your path through machine learning</p><h2 id="stages-title">From an idea to a model.</h2><p>Four stages. Explore the available learning in any order.</p></div>
        <ol className={styles.stages} aria-label="Four learning stages">
          {stages.map((stage, index) => <li key={stage.title}>
            <span className={styles.number} aria-hidden="true">0{index + 1}</span>
            <h3>{stage.title}{!stage.href && <> <span className={styles.soon}>— Coming Soon</span></>}</h3>
            {stage.href && <p className={styles.status}>{stage.status}</p>}
            <p className={styles.description}>{stage.description}</p>
            <p className={styles.outcome}>{stage.outcome}</p>
            {stage.href && <Link href={stage.href}>{stage.action} <span aria-hidden="true">→</span></Link>}
          </li>)}
        </ol>
      </section>
      <aside className={styles.offer} aria-labelledby="offer-title"><div><p className={styles.eyebrow}>Planned full program</p><h2 id="offer-title">$39 one-time purchase</h2></div><p>Informational only. Purchase is not available yet. Included scope and availability will be confirmed before sale. <strong>Project Studio — Coming Soon.</strong> Existing free learning remains open to explore.</p></aside>
    </main>
    <footer className={styles.footer}>
      <p>Practice and lesson completion are separate from independent mastery.</p>
      <p>Learning progress is local to your browser and site address. No account or cross-device synchronization.</p>
      <div className={styles.utilities}>
        <section id="getting-started" aria-labelledby="starting-title"><h2 id="starting-title">Choose your starting point</h2><Link href="/journey#getting-started">Choose your starting point in My learning journey</Link></section>
        <section id="resources" aria-labelledby="resources-title"><h2 id="resources-title">Experiments and notebooks</h2><Link href="/journey#resources">Open experiments and notebooks in My learning journey</Link></section>
      </div>
      <div className={styles.footerLinks}><span>ML Mastery · Interactive mathematics in ML Math Lab</span><Link href="/beta">Help</Link><Link href="/journey">My learning journey</Link></div>
    </footer>
  </div>;
}
