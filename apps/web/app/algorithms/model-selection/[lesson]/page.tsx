import {editorialMetadata} from "../../../experience/editorial-metadata";
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}) { const {lesson}=await params; return editorialMetadata(`/algorithms/model-selection/${lesson}`); }
import { notFound } from "next/navigation";
import { ModelSelectionLesson } from "../learning";
import { LESSONS } from "../teaching";

export function generateStaticParams() {
  return LESSONS.map(lesson => ({ lesson: lesson.slug }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const index = LESSONS.findIndex(item => item.slug === lesson);
  if (index < 0) notFound();
  return <ModelSelectionLesson lesson={index}/>;
}
