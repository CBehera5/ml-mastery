import type { Metadata } from "next";
import { VectorsDotProductLesson } from "./vectors-dot-product";

export const metadata: Metadata = {
  title: "Vectors & Dot Products | ML Math Lab",
  description: "Build intuition for feature vectors and weighted predictions through one interactive house-score example.",
};

export default function VectorsDotProductPage() { return <VectorsDotProductLesson />; }

