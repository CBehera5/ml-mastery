import {notFound} from "next/navigation";
import Link from "next/link";
import {BRIDGES} from "../lessons";
import {BridgeLesson} from "../bridge-lesson";
export function generateStaticParams(){return BRIDGES.map(b=>({slug:b.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const b=BRIDGES.find(x=>x.slug===slug);return {title:b?`${b.title} · Math bridges to ML`:"Math bridges to ML",description:b?.blurb}}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const i=BRIDGES.findIndex(x=>x.slug===slug);if(i<0)notFound();
 return <BridgeLesson bridge={BRIDGES[i]} prev={BRIDGES[i-1]} next={BRIDGES[i+1]}/>;
}
