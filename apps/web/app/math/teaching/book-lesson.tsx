import content from "./book-content.json";
import styles from "./book-lesson.module.css";
type Reading = {title:string;pages:string;story:string;predict:string;headers:string[];rows:string[][];relationship:string;ml:string;caution:string;figure:string;alt:string;module:string;width:number;height:number};
const readings: Record<string,Reading> = content.lessons;
const books: Record<string,string> = content.books;
export function BookOpening({module,lesson}:{module:string;lesson:string}) {
 const reading=readings[`${module}/${lesson}`]; if(!reading)return null;
 return <section className={styles.opening} aria-label="The book’s question"><h3>{reading.title}</h3><p>{reading.story}</p><aside className={styles.predict}><strong>Pause and predict</strong><p>{reading.predict}</p></aside><p>Use the playground’s displayed inputs when testing this idea.</p></section>;
}
export function BookExplanation({module,lesson}:{module:string;lesson:string}) {
 const reading=readings[`${module}/${lesson}`]; if(!reading)return null;
 return <section className={styles.reading} aria-label={`Reason through: ${reading.title}`}><figure className={styles.figure}>{/* Supplied-book raster artwork: retain intrinsic aspect ratio, never crop labels. */}<img src={`/math-books/${reading.figure}`} alt={reading.alt} width={reading.width} height={reading.height} loading="lazy"/><figcaption>{reading.alt} Source: {books[module]}, PDF pages {reading.pages}.</figcaption><a className={styles.figureLink} href={`/math-books/${reading.figure}`} target="_blank" rel="noreferrer">Open full-size figure <span className={styles.srOnly}>for {reading.title} (opens a new tab)</span>↗</a></figure><div className={styles.tableWrap} role="region" aria-label={`${reading.title}: worked comparison`} tabIndex={0}><table><caption>{reading.title}: follow the quantities</caption><thead><tr>{reading.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{reading.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div><div className={styles.relationship}><p>{reading.relationship}</p></div><aside className={styles.application}><h4>From this example to a model</h4><p>{reading.ml}</p></aside><aside className={styles.caution}><strong>Keep the distinction</strong><p>{reading.caution}</p></aside></section>;
}
