"use client";

import Link from "next/link";
import styles from "./landing.module.css";

export function PublicNav() {
  return <nav className={styles.nav} aria-label="Public navigation" onKeyDown={event => {
    if (event.key === "Escape") {
      const menu = (event.target as HTMLElement).closest("details");
      if (menu) { menu.open = false; menu.querySelector("summary")?.focus(); }
    }
  }}>
    <Link className={styles.brand} href="/" aria-current="page"><span aria-hidden="true" className={styles.mark}>M</span>ML Mastery</Link>
    <details className={styles.menu} onClick={event => {
      if ((event.target as HTMLElement).closest("a")) event.currentTarget.open = false;
    }}>
      <summary>Menu</summary>
      <div className={styles.menuLinks}>
        <a href="#learning-stages">Learning stages</a>
        <Link href="/journey">My learning journey</Link>
        <Link href="/beta">Help</Link>
      </div>
    </details>
  </nav>;
}
