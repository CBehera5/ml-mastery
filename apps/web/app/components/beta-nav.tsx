"use client";

import Link from "next/link";
import styles from "./beta-nav.module.css";

export function BetaNav({ status }: { status?: string }) {
  return (
    <nav className={`topbar beta-nav ${styles.navigation}`} aria-label="Learning navigation" onKeyDown={event => {
      if (event.key === "Escape") {
        const disclosure = (event.target as HTMLElement).closest("details");
        if (disclosure) { disclosure.open = false; disclosure.querySelector("summary")?.focus(); }
      }
    }}>
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">M</span>
        <span>ML Math Lab</span>
      </Link>
      <div className={styles.links} onClick={event => {
        const summary = (event.target as HTMLElement).closest("summary");
        if (summary) {
          const current = summary.closest("details");
          event.currentTarget.querySelectorAll("details[open]").forEach(disclosure => { if (disclosure !== current) (disclosure as HTMLDetailsElement).open = false; });
        }
        const link = (event.target as HTMLElement).closest("a");
        const disclosure = link?.closest("details");
        if (disclosure) disclosure.open = false;
      }}>
        <details><summary>Browse topics</summary><div className={styles.menu}>
          <Link href="/">Learning journey</Link>
          <Link href="/math">Math foundations</Link>
          <Link href="/python">Python foundations</Link>
          <Link href="/learn/linear-regression">Linear regression</Link>
          <Link href="/supervised">Supervised learning</Link>
        </div></details>
        <details><summary>Challenges</summary><div className={styles.menu}>
          <Link href="/demo">X-Ray experiment</Link>
          <Link href="/challenges/wrong-direction">Debug challenge</Link>
          <Link href="/learn/linear-regression/mastery">Regression mastery challenge</Link>
        </div></details>
        <details><summary>Help</summary><div className={styles.menu}>
          <Link href="/beta">Beta guide / Getting started</Link>
          <Link href="/#getting-started">Choosing your starting point</Link>
          <Link href="/#resources">Experiments and notebooks</Link>
        </div></details>
      </div>
      {status && <span className="status-pill"><span aria-hidden="true">●</span>{status}</span>}
    </nav>
  );
}
