import type { Metadata } from "next";
import { MatricesLesson } from "./matrices-lesson";
export const metadata: Metadata = { title:"Matrices & Matrix Multiplication | ML Math Lab", description:"Use one matrix operation to calculate many predictions and debug shape contracts." };
export default function Page(){ return <MatricesLesson/>; }
