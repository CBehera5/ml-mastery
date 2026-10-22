// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach,beforeEach,expect,it,vi } from "vitest";
import { cleanup,fireEvent,render,screen,within,waitFor } from "@testing-library/react";
import Home from "../page";
import MathPage from "../math/page";
import * as progress from "../learning-journey/progress";
beforeEach(()=>localStorage.clear());afterEach(()=>{cleanup();vi.restoreAllMocks();});
it("combines outcomes, four sections and a read-only starting suggestion",async()=>{
 const read=vi.spyOn(Storage.prototype,"getItem"),write=vi.spyOn(Storage.prototype,"setItem"),remove=vi.spyOn(Storage.prototype,"removeItem");render(<Home/>);
 expect(screen.getByRole("heading",{level:1})).toHaveTextContent("Understand the ideas.Then build models.");
 expect(await screen.findByRole("link",{name:"Start learning →"})).toHaveAttribute("href","/math/algebra-functions/variables");
 const nav=screen.getByRole("navigation",{name:"Main navigation"});
 for(const [name,href] of [["Math","/math"],["Python","/python"],["Algorithms","/algorithms"],["Projects","/projects"]])expect(within(nav).getAllByRole("link",{name})[0]).toHaveAttribute("href",href);
 expect(screen.getByText(/intended full-program outcomes/)).toBeInTheDocument();
 expect(screen.getByText(/Full Project Studio: coming soon/)).toBeInTheDocument();
 expect(read.mock.calls.every(([key])=>progress.READ_KEYS.includes(key))).toBe(true);
 expect(write).not.toHaveBeenCalled();expect(remove).not.toHaveBeenCalled();
});
it("continues validated supported activity without pretending to track all algorithms",async()=>{
 vi.spyOn(progress,"readJourneyProgress").mockResolvedValue({scopes:[{title:"Python Essentials",href:"/python/essentials",active:true,mastery:"Not yet",target:{title:"Functions",href:"/python/essentials/p05",stage:"Python",why:"Connect inputs to outputs.",detail:"Suggested continuation."}}],warnings:[]});
 render(<Home/>);expect(await screen.findByRole("link",{name:"Continue learning →"})).toHaveAttribute("href","/python/essentials/p05");
 expect(screen.getByText(/Other algorithm modules retain their own progress/)).toBeInTheDocument();
});
it("keeps unreadable progress unknown and never resets it",async()=>{
 vi.spyOn(progress,"readJourneyProgress").mockRejectedValue(Error("unavailable"));const write=vi.spyOn(Storage.prototype,"setItem");render(<Home/>);
 expect(await screen.findByText(/Some saved progress is unavailable/)).toBeInTheDocument();expect(write).not.toHaveBeenCalled();
});
it("closes the mobile section menu with Escape and restores focus",async()=>{
 render(<Home/>);await screen.findByRole("link",{name:"Start learning →"});
 const summary=screen.getByText("Menu",{selector:"summary"});fireEvent.click(summary);const menu=summary.closest("details")!;
 fireEvent.keyDown(within(menu).getByRole("link",{name:"Math"}),{key:"Escape"});expect(menu).not.toHaveAttribute("open");expect(summary).toHaveFocus();
});
it("uses matching cards on Math and preserves every subject and integration route",()=>{
 render(<MathPage/>);const nav=screen.getByRole("navigation",{name:"Main navigation"});expect(within(nav).getAllByRole("link",{name:"Math"})[0]).toHaveAttribute("aria-current","page");
 const routes=["/math/algebra-functions","/math/linear-algebra","/math/derivatives","/math/probability","/math/statistics","/math/optimization","/math/integration"];
 for(const href of routes)expect(document.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
 expect(screen.getByRole("link",{name:"Explore Python →"})).toHaveAttribute("href","/python");
});
