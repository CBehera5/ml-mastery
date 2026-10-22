"use client";
import Link from "next/link";
import styles from "../experience/pathway.module.css";
export function PublicNav({active}:{active?:"Math"|"Python"|"Algorithms"|"Projects"}) {
 const links=[{title:"Math",href:"/math"},{title:"Python",href:"/python"},{title:"Algorithms",href:"/algorithms"},{title:"Projects",href:"/projects"}];
 const items=links.map(item=><Link key={item.title} href={item.href} aria-current={active===item.title?"page":undefined}>{item.title}</Link>);
 return <nav className={styles.nav} aria-label="Main navigation" onKeyDown={event=>{if(event.key==="Escape"){const menu=(event.target as HTMLElement).closest("details");if(menu){menu.open=false;menu.querySelector("summary")?.focus();}}}}><Link className={styles.brand} href="/" aria-current={active?undefined:"page"}><span className={styles.mark} aria-hidden="true">M</span>ML Mastery</Link><div className={styles.desktopLinks}>{items}</div><details className={styles.menu} onClick={event=>{if((event.target as HTMLElement).closest("a"))event.currentTarget.open=false;}}><summary>Menu</summary><div className={styles.menuLinks}>{items}</div></details></nav>;
}
