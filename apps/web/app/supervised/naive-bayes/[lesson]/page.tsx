import { notFound } from "next/navigation";
import { LESSONS } from "../teaching";
import { NaiveBayesLesson } from "../learning";
export const dynamicParams = false;
export function generateStaticParams() { return LESSONS.map(lesson=>({lesson:lesson.slug})); }
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}) { const {lesson}=await params; const item=LESSONS.find(item=>item.slug===lesson); return {title:item?`${lesson.toUpperCase()} — ${item.title} | ML Mastery`:"NaiveBayes Regression | ML Mastery"}; }
export default async function Page({params}:{params:Promise<{lesson:string}>}) { const {lesson}=await params; const index=LESSONS.findIndex(item=>item.slug===lesson); if(index<0)notFound(); return <NaiveBayesLesson lesson={index}/>; }
