// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {render,screen,cleanup,within} from "@testing-library/react";
import {afterEach,describe,it,expect} from "vitest";
import Overview from "./page";
import {CoreLearning} from "./core-learning";
import {GeometryLearning} from "./geometry-learning";
afterEach(cleanup);
describe("Connected Linear Algebra journey",()=>{
 it("offers four distinct lesson cards and preserves both assessment scopes",()=>{render(<Overview/>);expect(screen.getAllByRole("article")).toHaveLength(4);expect(screen.getByRole("link",{name:/Explore matrices/})).toHaveAttribute("href","/math/matrices-multiplication");expect(screen.getByRole("link",{name:/Open original core/})).toHaveAttribute("href","/math/linear-algebra/assessment");});
 it.each(["vectors","matrices"] as const)("puts exploration before formal reasoning for %s",lesson=>{render(<CoreLearning lesson={lesson}/>);const region=screen.getByRole("region",{name:"Linear Algebra core learning"});const text=region.textContent!;expect(text.indexOf("Definition and notation reference:")).toBeGreaterThan(-1);expect(text.indexOf("Predict, then explore.")).toBeLessThan(text.indexOf("Definition and notation reference:"));expect(within(region).getAllByText("Make the idea yours")).toHaveLength(2);});
 it.each(["transformations","eigenvectors"] as const)("keeps geometry discovery and transfer visible for %s",lesson=>{render(<GeometryLearning lesson={lesson}/>);expect(screen.getByRole("navigation",{name:"Linear Algebra learning path"})).toBeInTheDocument();expect(screen.getAllByText("Predict, then explore.").length).toBeGreaterThan(0);expect(screen.getAllByText("Make the idea yours").length).toBeGreaterThan(0);});
});
