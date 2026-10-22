"use client";
import {useId,useState} from "react";
import content from "./book-content.json";
import styles from "./book-lesson.module.css";
type Reading = {title:string;pages:string;story:string;predict:string;headers:string[];rows:string[][];relationship:string;ml:string;caution:string;figure:string;alt:string;module:string;width:number;height:number};
const readings: Record<string,Reading> = content.lessons;
const books: Record<string,string> = content.books;
/** Story, then a prediction the learner commits to before the explorer. Unscored: it never touches progress or mastery. */
export function BookOpening({module,lesson}:{module:string;lesson:string}) {
 const reading=readings[`${module}/${lesson}`];
 const [guess,setGuess]=useState(""),[locked,setLocked]=useState<string|null>(null);
 const id=useId();
 if(!reading)return null;
 return <section className={styles.opening} aria-label="The book’s question"><h3>{reading.title}</h3><p>{reading.story}</p>
  <div className={styles.predict}><strong>Pause and predict</strong><p id={`${id}-q`}>{reading.predict}</p>
   {locked===null?<>
    <label className={styles.guessLabel} htmlFor={`${id}-guess`}>Your guess, in a few words</label>
    <textarea id={`${id}-guess`} className={styles.guess} rows={2} maxLength={280} value={guess} onChange={event=>setGuess(event.target.value)} aria-describedby={`${id}-q`}/>
    <div className={styles.predictActions}>
     <button type="button" className={styles.lock} disabled={guess.trim()===""} onClick={()=>setLocked(guess.trim())}>Lock in my guess</button>
     <button type="button" className={styles.skip} onClick={()=>setLocked("")}>I’m not sure. Let me explore</button>
    </div></>
   :<p role="status" className={styles.locked}>{locked===""?"No guess yet, and that is fine. Explore below, then decide what you think.":<>Your guess: <q>{locked}</q> Now test it in the explorer below, then come back and see if you would change it.</>}</p>}
  </div></section>;
}
export function BookExplanation({module,lesson}:{module:string;lesson:string}) {
 const reading=readings[`${module}/${lesson}`]; if(!reading)return null;
 return <section className={styles.reading} aria-label={`Reason through: ${reading.title}`}><figure className={styles.figure}>{/* Supplied-book raster artwork: retain intrinsic aspect ratio, never crop labels. */}<img src={`/math-books/${reading.figure}`} alt={reading.alt} width={reading.width} height={reading.height} loading="lazy"/><figcaption>{reading.alt} Source: {books[module]}, PDF pages {reading.pages}.</figcaption><a className={styles.figureLink} href={`/math-books/${reading.figure}`} target="_blank" rel="noreferrer">Open full-size figure <span className={styles.srOnly}>for {reading.title} (opens a new tab)</span>↗</a></figure><div className={styles.tableWrap} role="region" aria-label={`${reading.title}: worked comparison`} tabIndex={0}><table><caption>{reading.title}: follow the quantities</caption><thead><tr>{reading.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{reading.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div><div className={styles.relationship}><p>{reading.relationship}</p></div><aside className={styles.application}><h4>From this example to a model</h4><p>{reading.ml}</p></aside><aside className={styles.caution}><strong>Keep the distinction</strong><p>{reading.caution}</p></aside></section>;
}
