import { notFound } from "next/navigation";
import { FoundationPage, foundationMetadata } from "../foundation-page";
import { FOUNDATION_LESSONS } from "../foundation-lessons";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(FOUNDATION_LESSONS).map((slug) => ({ slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return FOUNDATION_LESSONS[slug] ? foundationMetadata(slug) : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!FOUNDATION_LESSONS[slug]) notFound();
  return <FoundationPage slug={slug} />;
}
