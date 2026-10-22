import styles from "./deep-read.module.css";
import {DeepCheck} from "./deep-check";
export type DeepBlock =
 | {kind:"p";text:string}
 | {kind:"eq";lines:string[];note?:string}
 | {kind:"table";caption:string;headers:string[];rows:string[][]}
 | {kind:"callout";tone:"idea"|"warn"|"ml";title:string;text:string}
 | {kind:"code";caption:string;code:string;output?:string}
 | {kind:"steps";items:string[]}
 | {kind:"check";question:string;options:string[];answer:number;why:string};
export type DeepSection={id:string;kicker:string;title:string;blocks:DeepBlock[]};
export type DeepLesson={title:string;minutes:number;sections:DeepSection[]};

function Block({b}:{b:DeepBlock}){
 switch(b.kind){
  case "p":return <p>{b.text}</p>;
  case "eq":return <div className={styles.eq}>{b.lines.map(l=><div key={l}>{l}</div>)}{b.note&&<small>{b.note}</small>}</div>;
  case "table":return <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={b.caption}><table><caption>{b.caption}</caption><thead><tr>{b.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{b.rows.map(r=><tr key={r.join("|")}>{r.map((c,i)=>i===0?<th key={i} scope="row">{c}</th>:<td key={i}>{c}</td>)}</tr>)}</tbody></table></div>;
  case "callout":return <aside className={`${styles.callout} ${styles[b.tone]}`}><strong>{b.title}</strong><p>{b.text}</p></aside>;
  case "code":return <figure className={styles.code}><figcaption>{b.caption}</figcaption><pre><code>{b.code}</code></pre>{b.output&&<pre className={styles.out} aria-label="Output"><code>{b.output}</code></pre>}</figure>;
  case "check":return <DeepCheck question={b.question} options={b.options} answer={b.answer} why={b.why}/>;
  case "steps":return <ol className={styles.steps}>{b.items.map(i=><li key={i}>{i}</li>)}</ol>;
 }
}
/** A long-form, story-led reading: real problem, idea built with numbers, worked examples, failure modes, Python. */
export function DeepRead({lesson}:{lesson:DeepLesson}){
 return <section className={styles.deep} aria-label={`The full story: ${lesson.title}`}>
  <header><p className={styles.meta}>The full story · about {lesson.minutes} minutes</p><h3>{lesson.title}</h3>
   <nav aria-label="In this reading"><ol>{lesson.sections.map(s=><li key={s.id}><a href={`#${s.id}`}>{s.kicker}</a></li>)}</ol></nav></header>
  {lesson.sections.map(s=><section key={s.id} id={s.id} className={styles.sec}><p className={styles.kicker}>{s.kicker}</p><h4>{s.title}</h4>{s.blocks.map((b,i)=><Block key={i} b={b}/>)}</section>)}
 </section>;
}
