import Link from "next/link";
import {PublicNav} from "../../landing/public-nav";
import {BRIDGES} from "./lessons";
export const metadata={title:"Math bridges to ML",description:"The extra math ideas machine learning leans on: distance, expectation, likelihood and more."};
export default function Page(){
 return <main className="math-lesson-page" style={{maxWidth:"52rem",margin:"0 auto",padding:"0 1rem 4rem"}}><PublicNav active="Math"/>
  <p><Link href="/math" className="refresher-link">← Math foundations</Link></p>
  <p className="eyebrow">Math · Bridges to ML</p><h1>The ideas ML quietly leans on</h1>
  <p>Each lesson starts from a real problem, builds one idea with numbers, and ends where you will meet it in an algorithm.</p>
  <ol>{BRIDGES.map(b=><li key={b.slug} style={{margin:"1.2rem 0"}}><h2 style={{margin:0}}><Link href={`/math/bridges/${b.slug}`}>{b.title}</Link></h2><p style={{margin:".2rem 0"}}>{b.blurb}</p><small>About {b.lesson.minutes} minutes · Unlocks {b.unlocks}</small></li>)}</ol>
 </main>;
}
