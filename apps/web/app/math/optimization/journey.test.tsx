// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {render,screen,cleanup,within} from "@testing-library/react";
import {afterEach,beforeEach,it,expect} from "vitest";
import {OptimizationOverview,OptimizationLesson} from "./learning";
import {lessons} from "./content";
import {OPTIMIZATION_JOURNEY} from "./journey";
import {STORAGE_KEY} from "./model";
beforeEach(()=>localStorage.clear());afterEach(cleanup);
it("offers exactly 6 lesson cards with one route per card",()=>{render(<OptimizationOverview/>);expect(screen.getAllByRole("article")).toHaveLength(6);for(const lesson of lessons){const card=screen.getByRole("heading",{name:lesson.title}).closest("article")!;expect(within(card).getAllByRole("link")).toHaveLength(1);expect(within(card).getByRole("link")).toHaveAttribute("href",`/math/optimization/${lesson.slug}`);}});
it.each(lessons)("puts controlled exploration before formal reasoning in $slug",lesson=>{render(<OptimizationLesson slug={lesson.slug}/>);expect(screen.getByRole("heading",{level:1})).toHaveTextContent(OPTIMIZATION_JOURNEY[lesson.slug].question);const experiment=document.getElementById("experiment")!,meaning=document.getElementById("optimization-understand")!;expect(experiment.compareDocumentPosition(meaning)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();expect(screen.getByRole("heading",{name:"Connect the relationship to Python"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Make the idea yours"})).toBeInTheDocument();expect(screen.getByRole("button",{name:"Record experiment reflection"})).toBeDisabled();expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).assessmentAttempts).toEqual([]);});
