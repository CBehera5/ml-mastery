import Link from "next/link";
import { PublicNav } from "../../landing/public-nav";
import styles from "../../experience/pathway.module.css";
import { DeepRead } from "../teaching/deep-read";
import { FOUNDATION_LESSONS, FOUNDATION_NAMES } from "./foundation-lessons";

export const foundationMetadata = (slug: string) => ({
  title: `${FOUNDATION_NAMES[slug]} — a foundation for machine learning`,
  description: `Why machine learning needs ${FOUNDATION_NAMES[slug].toLowerCase()}, drawn and worked by hand, with code that runs in your browser.`,
});

/** A bridge lesson: the maths that sits underneath several algorithms, with the why and the how. */
export function FoundationPage({ slug }: { slug: string }) {
  const lesson = FOUNDATION_LESSONS[slug];
  const name = FOUNDATION_NAMES[slug];
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main-content">Skip to main content</a>
      <PublicNav active="Math" />
      <main id="main-content" tabIndex={-1} className={styles.container}>
        <nav aria-label="Breadcrumb"><Link href="/math">Math</Link> / <Link href="/math/ml-map">Math for machine learning</Link> / {name}</nav>
        <p style={{ margin: "1rem 0 0", fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase" }}>Foundation · the maths under the models</p>
        <h1 style={{ margin: ".2rem 0 .5rem" }}>{name}</h1>
        <DeepRead lesson={lesson} />
        <p style={{ margin: "2rem 0" }}>
          <Link href="/math/ml-map">← Back to the Math-to-ML map</Link> · <Link href="/algorithms">Algorithms</Link>
        </p>
      </main>
    </div>
  );
}
