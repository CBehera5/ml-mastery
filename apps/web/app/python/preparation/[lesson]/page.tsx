import { notFound } from "next/navigation";
import { LESSONS } from "../catalog";
import { PreparationLesson } from "../learning";
export const dynamicParams = false;
export function generateStaticParams() { return LESSONS.map(lesson => ({ lesson: lesson.slug })); }
export default async function Page({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const index = LESSONS.findIndex(item => item.slug === lesson);
  if (index < 0) notFound();
  return <PreparationLesson lesson={index}/>;
}
