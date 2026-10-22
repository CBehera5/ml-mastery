import data from "./book-content.json";
import styles from "../math/teaching/book-lesson.module.css";
import local from "./book-reading.module.css";
type Reading={title:string;pages:string;story:string;predict:string;equation:string;explain:string;headers:string[];rows:string[][];figure:string;chart:string;caution:string;module:string;width:number;height:number;figureOrigin?:string};
const readings:Record<string,Reading>=data.readings;
const mappings:Record<string,string[]>=data.mapping;
const books:Record<string,{title:string;file:string}>=data.books;
export function readingFor(module:string,lesson:number):Reading|undefined {
 const source=module==="module"||module==="model-selection"?"evaluation":module;
 const key=mappings[module]?.[lesson];return key?readings[`${source}/${key}`]:undefined;
}
export function AlgorithmBookOpening({module,lesson}:{module:string;lesson:number}) {
 const r=readingFor(module,lesson);if(!r)return null;
 return <section className={styles.opening} aria-label="Book-inspired question"><h2 className={local.title}>{r.title}</h2><p>{r.story}</p><aside className={styles.predict}><strong>Pause and predict</strong><p>{r.predict}</p></aside><p className={local.note}>The playground uses a separate dataset. <a href="#book-explanation">Compare with the illustrated example ↓</a></p>{module==="model-selection"&&<p className={local.note}>This companion reading uses Evaluation Foundations. The lesson’s existing search, comparison and validation material supplies the additional model-selection depth.</p>}</section>;
}
export function AlgorithmBookExplanation({module,lesson}:{module:string;lesson:number}) {
 const r=readingFor(module,lesson);if(!r)return null;
 return <section id="book-explanation" className={styles.reading} aria-label={`Book walkthrough: ${r.title}`}><figure className={`${styles.figure} ${local.figure}`}><img src={`/algorithm-books/${r.figure}`} width={r.width} height={r.height} loading="lazy" alt={`Illustration for ${r.title}. The reading guide immediately below explains its parts and conclusion.`}/><figcaption><strong>Read the illustration:</strong> {r.chart}<p className={local.note}>Source: {books[r.module].title}, PDF pages {r.pages}. {r.figureOrigin==="adapted"?"Adapted diagram; rounded values, not a live result.":"Static source illustration; annotated scores belong to this example."}</p></figcaption><a className={styles.figureLink} href={`/algorithm-books/${r.figure}`} target="_blank" rel="noreferrer">Open full-size figure <span className={styles.srOnly}>for {r.title} (opens a new tab)</span>↗</a></figure><div className={styles.tableWrap} role="region" tabIndex={0} aria-label={`Worked comparison: ${r.title}`}><table><caption>{r.title}: compare the quantities</caption><thead><tr>{r.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{r.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th scope="row" key={j}>{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div><div className={styles.relationship}><p className={local.equation}>{r.equation}</p><p>{r.explain}</p></div><aside className={styles.caution}><strong>Check the assumptions</strong><p>{r.caution}</p></aside><p><a href={module==="linear"?"#regression-lesson-content":"#experiment"}>Return to the playground</a> and explain how its inputs connect to this relationship. Unscored reading.</p></section>;
}
