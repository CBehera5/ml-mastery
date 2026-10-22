"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readJourneyProgress, READ_KEYS, recommend, type JourneyProgress } from "../learning-journey/progress";
import styles from "../experience/pathway.module.css";
export function NextStep(){
 const [progress,setProgress]=useState<JourneyProgress|null>(null);
 useEffect(()=>{let active=true,generation=0;async function refresh(){const id=++generation;let result:JourneyProgress;try{result=await readJourneyProgress(window.localStorage);}catch{result={scopes:[],warnings:["Saved progress could not be read; existing records are untouched."]};}if(active&&id===generation)setProgress(result);}
 const changed=(e:StorageEvent)=>{if(e.key===null||READ_KEYS.includes(e.key))void refresh();};void refresh();window.addEventListener("storage",changed);window.addEventListener("focus",refresh);window.addEventListener("pageshow",refresh);return()=>{active=false;window.removeEventListener("storage",changed);window.removeEventListener("focus",refresh);window.removeEventListener("pageshow",refresh);};},[]);
 const returning=progress?.scopes.some(scope=>scope.active),target=progress?recommend(progress):null;
 return <section id="next-step" className={styles.continuation} aria-labelledby="next-title"><div><p className={styles.eyebrow}>Your next step</p><h2 id="next-title">{progress?returning?"Pick up your learning":"Start with the foundations":"Find your starting point"}</h2>{target?<><p><strong>{target.title}</strong></p><p>{target.why}</p><Link className={styles.primary} href={target.href}>{returning?"Continue learning":"Start learning"} →</Link><p className={styles.note}>{target.detail}</p></>:<p role="status">Checking supported local progress… You can explore the sections below.</p>}</div><div><p className={styles.note}>This suggestion uses supported Math, Python and Linear Regression records. Other algorithm modules retain their own progress; absence here does not mean you have not started them.</p>{progress?.warnings.length? <p role="status">Some saved progress is unavailable. We have not treated it as zero or changed it.</p>:null}<Link href="/journey">View detailed learning record</Link><p className={styles.note}>No account needed. Progress stays in this browser and site address.</p></div></section>;
}
