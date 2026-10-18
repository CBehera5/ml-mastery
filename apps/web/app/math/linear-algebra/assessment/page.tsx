import type { Metadata } from "next";
import { CoreAssessment } from "../assessment";
export const metadata: Metadata = { title: "Linear Algebra core assessment | ML Math Lab" };
export default function AssessmentPage() { return <CoreAssessment />; }
