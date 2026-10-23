"use client";
import {useId,useState} from "react";
import styles from "./deep-read.module.css";
/** Unscored self-check: pick an answer, see why. Never touches progress. */
export function DeepCheck({question,options,answer,why}:{question:string;options:string[];answer:number;why:string}){
 const id=useId();const [picked,setPicked]=useState<number|null>(null);
 return <fieldset className={styles.check}><legend>Check yourself</legend><p id={`${id}-q`}>{question}</p>
  {options.map((o,i)=><label key={o}><input type="radio" name={id} checked={picked===i} onChange={()=>setPicked(i)} aria-describedby={`${id}-q`}/> {o}</label>)}
  {picked!==null&&<p role="status" className={picked===answer?styles.right:styles.wrong}>{picked===answer?"Right. ":"Not quite. "}{why}</p>}
 </fieldset>;
}
