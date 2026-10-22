import Link from "next/link";
import {PublicNav} from "../../landing/public-nav";
import {DeepRead} from "../teaching/deep-read";
import {BridgeLab} from "./bridge-labs";
import type {Bridge} from "./lessons";
export function BridgeLesson({bridge,prev,next}:{bridge:Bridge;prev?:Bridge;next?:Bridge}){
 return <main className="math-lesson-page" style={{maxWidth:"52rem",margin:"0 auto",padding:"0 1rem 4rem"}}><PublicNav active="Math"/>
  <p><Link href="/math/bridges" className="refresher-link">← Math bridges to ML</Link></p>
  <p className="eyebrow">Needs: {bridge.needs} · Unlocks: {bridge.unlocks}</p>
  <DeepRead lesson={bridge.lesson}/>
  <BridgeLab slug={bridge.slug}/>
  <nav aria-label="Next lesson" style={{display:"flex",justifyContent:"space-between",gap:"1rem",marginTop:"2rem"}}>{prev?<Link href={`/math/bridges/${prev.slug}`}>← {prev.title}</Link>:<span/>}{next?<Link href={`/math/bridges/${next.slug}`}>{next.title} →</Link>:<Link href="/math/bridges">All bridges</Link>}</nav>
 </main>;
}
