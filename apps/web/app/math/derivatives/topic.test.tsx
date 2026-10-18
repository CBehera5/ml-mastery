// @vitest-environment jsdom
import"@testing-library/jest-dom/vitest";
import{cleanup,fireEvent,render,screen,waitFor,within}from"@testing-library/react";
import{afterEach,beforeEach,describe,expect,it}from"vitest";
import{DerivativesTopic}from"./topic";
import{TOPIC_PROGRESS_KEY}from"./curriculum";
beforeEach(()=>localStorage.clear());afterEach(cleanup);
const open=(name:RegExp)=>fireEvent.click(screen.getByRole("button",{name}));
describe("Derivatives topic experience",()=>{
 it.each(['{broken','{"version":2}'])("preserves unreadable pilot data %s",raw=>{localStorage.setItem(TOPIC_PROGRESS_KEY,raw);render(<DerivativesTopic/>);expect(screen.getByText(/Pilot progress cannot be safely read/)).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Reset activity"}));expect(localStorage.getItem(TOPIC_PROGRESS_KEY)).toBe(raw)});
 it("retains valid historical mastery after activity reset and reload",()=>{const raw=JSON.stringify({completed:["why","mastery"],mastered:true,bestScore:4});localStorage.setItem(TOPIC_PROGRESS_KEY,raw);const view=render(<DerivativesTopic/>);fireEvent.click(screen.getByRole("button",{name:"Reset activity"}));view.unmount();render(<DerivativesTopic/>);expect(JSON.parse(localStorage.getItem(TOPIC_PROGRESS_KEY)!)).toEqual(JSON.parse(raw))});
 it("opens every module independently",()=>{render(<DerivativesTopic/>);open(/Mastery assessment/);expect(screen.getByRole("heading",{name:"Demonstrate transfer, not recall."})).toBeInTheDocument();open(/Interactive Derivative Lab/);expect(screen.getByRole("heading",{name:/One lab/})).toBeInTheDocument()});
 it("keeps stored completion independent from lab edits",async()=>{localStorage.setItem(TOPIC_PROGRESS_KEY,JSON.stringify({completed:["why"],mastered:false,bestScore:0}));render(<DerivativesTopic/>);await waitFor(()=>expect(screen.getByText(/1 \/ 7 modules/)).toBeInTheDocument());open(/Interactive Derivative Lab/);fireEvent.change(screen.getByRole("slider",{name:/x =/}),{target:{value:"4"}});expect(localStorage.getItem(TOPIC_PROGRESS_KEY)).toContain("why")});
 it("resets an activity without erasing topic completion",async()=>{localStorage.setItem(TOPIC_PROGRESS_KEY,JSON.stringify({completed:["why"],mastered:false,bestScore:0}));render(<DerivativesTopic/>);await waitFor(()=>expect(screen.getByText(/1 \/ 7 modules/)).toBeInTheDocument());fireEvent.click(screen.getByRole("button",{name:"Reset activity"}));expect(localStorage.getItem(TOPIC_PROGRESS_KEY)).toContain("why")});
 it("verifies the derivative debugging repair",()=>{render(<DerivativesTopic/>);open(/Debugging derivatives/);fireEvent.click(screen.getByLabelText("Multiply by x"));fireEvent.click(screen.getByRole("button",{name:"Verify numerically"}));expect(within(screen.getByRole("article",{name:"Derivatives pilot activity"})).getByRole("status")).toHaveTextContent("−8 matches")});
 it("provides an alternative assessment after non-mastery",()=>{render(<DerivativesTopic/>);open(/Mastery assessment/);fireEvent.click(screen.getByRole("button",{name:"Score assessment"}));fireEvent.click(screen.getByRole("button",{name:"Retry with alternative questions"}));expect(screen.getByText(/Assessment B/)).toBeInTheDocument()});
});
