import {editorialMetadata} from "../../../experience/editorial-metadata";
import { notFound } from "next/navigation";
import { lessons } from "../content";
import { ProbabilityAssessment, ProbabilityLesson } from "../learning";
export function generateStaticParams() { return [...lessons.map(lesson=>({lesson:lesson.slug})),{lesson:"mastery"}]; }
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}) { const {lesson}=await params; return editorialMetadata(`/math/probability/${lesson}`); }
export default async function Page({ params }: { params: Promise<{lesson:string}> }) {
  const {lesson}=await params;
  if(lesson==="mastery")return <ProbabilityAssessment/>;
  const entry=lessons.find(item=>item.slug===lesson);
  if(!entry)notFound();
  return <ProbabilityLesson slug={entry.slug}/>;
}
