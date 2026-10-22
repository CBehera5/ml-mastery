// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach,expect,it,vi } from "vitest";
import { cleanup,render,screen,within } from "@testing-library/react";
import PythonPage from "../python/page";
import AlgorithmsPage from "../supervised/page";
import ProjectsPage from "../projects/page";
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it.each([["Python",PythonPage,6],["Algorithms",AlgorithmsPage,13],["Projects",ProjectsPage,4]] as const)("%s uses shared subject cards and the active section navigation",(name,Page,count)=>{
 const read=vi.spyOn(Storage.prototype,"getItem"),write=vi.spyOn(Storage.prototype,"setItem");render(<Page/>);
 expect(screen.getAllByRole("article")).toHaveLength(count);
 const nav=screen.getByRole("navigation",{name:"Main navigation"});expect(within(nav).getAllByRole("link",{name})[0]).toHaveAttribute("aria-current","page");
 expect(read).not.toHaveBeenCalled();expect(write).not.toHaveBeenCalled();
});
it("preserves all six Python modules and the earlier pilot",()=>{
 render(<PythonPage/>);for(const id of ["essentials","numpy","pandas","visualization","preparation","sklearn"])expect(document.querySelector(`a[href="/python/${id}"]`)).toBeInTheDocument();
 expect(screen.getByRole("link",{name:"original P01 prototype"})).toHaveAttribute("href","/python/essentials/p01");
});
it("preserves all thirteen algorithm paths and the original evaluation prototype",()=>{
 render(<AlgorithmsPage/>);for(const path of ["/learn/linear-regression",...['polynomial','regularization','logistic','knn','naive-bayes','svm','decision-trees','random-forests','gradient-boosting','mlp','evaluation','model-selection'].map(id=>`/supervised/${id}`)])expect(document.querySelector(`a[href="${path}"]`)).toBeInTheDocument();
 expect(screen.getByRole("link",{name:"original EV01 prototype"})).toHaveAttribute("href","/supervised/evaluation/ev01");
});
it("keeps planned capstones noninteractive and the existing guided project available",()=>{
 render(<ProjectsPage/>);
 for(const name of ["House Price","Customer Churn","Technical Documentation Quality"]){const article=screen.getByRole("heading",{name,level:3}).closest("article")!;expect(within(article).queryByRole("link")).not.toBeInTheDocument();expect(article).toHaveTextContent("Not yet available");}
 expect(screen.getByRole("link",{name:"Open guided housing project"})).toHaveAttribute("href","/learn/linear-regression/project");
 expect(screen.getByText(/Purchase is not available/)).toBeInTheDocument();
});
