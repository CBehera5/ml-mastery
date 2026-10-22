import Link from "next/link";
import styles from "./pathway.module.css";
export type PathCard = { title:string; outcome:string; detail:string; href?:string; action:string; status?:string };
export function PathwayCard({item,index}:{item:PathCard;index:number}) {
 return <article className={styles.card}><div className={styles.cardTop}><span>{String(index+1).padStart(2,"0")}</span><small>{item.status??"Available to explore"}</small></div><h3>{item.title}</h3><p>{item.outcome}</p><p className={styles.detail}>{item.detail}</p>{item.href?<Link className={styles.cardLink} href={item.href}>{item.action}<span aria-hidden="true">→</span></Link>:<span className={styles.cardLink}>{item.action}</span>}</article>;
}
export function PathwayFooter(){return <footer className={styles.footer}><Link href="/">ML Mastery</Link><p>Progress stays in this browser and site address. Lesson completion and independent mastery are different.</p><Link href="/journey">Detailed learning record & resources</Link></footer>;}
