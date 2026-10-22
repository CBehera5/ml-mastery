// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {render,screen,cleanup,within} from "@testing-library/react";
import {afterEach,beforeEach,describe,it,expect} from "vitest";
import {PYTHON_JOURNEYS} from "./journey";
import {lessonRoute} from "./journey-components";
import {EssentialsOverview,EssentialsLesson} from "./essentials/learning";
import {LESSONS as EssentialsLessons} from "./essentials/catalog";
import {NumPyOverview,NumPyLesson} from "./numpy/learning";
import {LESSONS as NumPyLessons} from "./numpy/catalog";
import {PandasOverview,PandasLesson} from "./pandas/learning";
import {LESSONS as PandasLessons} from "./pandas/catalog";
import {VisualizationOverview,VisualizationLesson} from "./visualization/learning";
import {LESSONS as VisualizationLessons} from "./visualization/catalog";
import {PreparationOverview,PreparationLesson} from "./preparation/learning";
import {LESSONS as PreparationLessons} from "./preparation/catalog";
import {SklearnOverview,SklearnLesson} from "./sklearn/learning";
import {LESSONS as SklearnLessons} from "./sklearn/catalog";
beforeEach(()=>{localStorage.clear();localStorage.setItem("unrelated-progress","preserve");});afterEach(cleanup);
const modules=[{module:"essentials",Overview:EssentialsOverview,Lesson:EssentialsLesson,lessons:EssentialsLessons},
{module:"numpy",Overview:NumPyOverview,Lesson:NumPyLesson,lessons:NumPyLessons},
{module:"pandas",Overview:PandasOverview,Lesson:PandasLesson,lessons:PandasLessons},
{module:"visualization",Overview:VisualizationOverview,Lesson:VisualizationLesson,lessons:VisualizationLessons},
{module:"preparation",Overview:PreparationOverview,Lesson:PreparationLesson,lessons:PreparationLessons},
{module:"sklearn",Overview:SklearnOverview,Lesson:SklearnLesson,lessons:SklearnLessons}] as const;
for(const item of modules){describe(item.module+" connected lesson structure",()=>{
 it("gives every lesson exactly one route card",()=>{render(<item.Overview/>);const path=document.getElementById("lesson-path")!;expect(within(path).getAllByRole("article")).toHaveLength(item.lessons.length);item.lessons.forEach(lesson=>expect(within(path).getByRole("link",{name:`Explore ${lesson.title}`})).toHaveAttribute("href",lessonRoute(item.module,lesson.slug)));expect(localStorage.getItem("unrelated-progress")).toBe("preserve");});
 item.lessons.forEach((lesson,index)=>it("starts "+lesson.slug+" with a question and experiment before explanation",()=>{render(<item.Lesson lesson={index}/>);expect(screen.getByRole("heading",{level:1})).toHaveTextContent(PYTHON_JOURNEYS[item.module][index][0]);const experiment=document.getElementById("experiment")!,explanation=document.getElementById("lesson-explain")!;expect(experiment.compareDocumentPosition(explanation)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();expect(document.querySelectorAll("#experiment")).toHaveLength(1);expect(document.getElementById("lesson-practice")).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Make the idea yours"})).toBeInTheDocument();expect(screen.getByRole("navigation",{name:"Next Python lesson"})).toBeInTheDocument();expect(localStorage.getItem("unrelated-progress")).toBe("preserve");}));
});}
it("keeps the full Essentials entry distinct from the original P01 prototype",()=>{expect(lessonRoute("essentials","p01")).toBe("/python/essentials/p01/module");});
