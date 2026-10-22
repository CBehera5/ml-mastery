// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EquationLab } from "./equation-lab";
import { ErrorsLab } from "./errors-lab";
import { FailureModesLab } from "./failure-modes-lab";
import { GradientLab } from "./gradient-lab";
import { MultipleFeaturesLab } from "./multiple-features-lab";

afterEach(cleanup);

const metricValue=(label:string)=>within(screen.getByText(label,{selector:"dt"}).parentElement!).getByRole("definition").textContent;

describe("interactive linear regression labs",()=>{
  it("updates synchronized predictions when a parameter changes and resets",()=>{render(<EquationLab/>);fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));expect(metricValue("Selected prediction")).toBe("$245k");fireEvent.change(screen.getByRole("slider",{name:"Weight ($k per thousand ft²)"}),{target:{value:"50"}});expect(metricValue("Selected prediction")).toBe("$265k");expect(screen.getByText(/50 × 2.5 \+ 140/)).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Reset parameters"}));expect(metricValue("Selected prediction")).toBe("$245k")});
  it("updates all loss metrics and reveals the predicted outlier effect",()=>{render(<ErrorsLab/>);const before=metricValue("MSE");fireEvent.click(screen.getByRole("radio",{name:"MSE"}));fireEvent.click(screen.getByRole("button",{name:"Reveal outlier"}));expect(metricValue("MSE")).not.toBe(before);expect(screen.getByText(/Squaring makes the large residual/)).toBeInTheDocument()});
  it("starts gradient navigation at iteration zero, steps, and resets",()=>{Object.defineProperty(window,"matchMedia",{writable:true,value:vi.fn().mockReturnValue({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})});render(<GradientLab/>);expect(metricValue("Iteration")).toBe("0");fireEvent.click(screen.getByRole("button",{name:"Step"}));expect(metricValue("Iteration")).toBe("1");fireEvent.click(screen.getByRole("button",{name:"Reset training"}));expect(metricValue("Iteration")).toBe("0")});
  it("provides a named keyboard scroller and qualifies a falling loss trace",()=>{render(<GradientLab/>);expect(screen.getByRole("region",{name:/Training history from the mathematical runtime/})).toHaveAttribute("tabindex","0");expect(screen.getByText(/short trace alone does not establish convergence or generalization/)).toBeInTheDocument()});
  it("handles an invalid training configuration without crashing",()=>{render(<GradientLab/>);fireEvent.change(screen.getByLabelText("Training iterations"),{target:{value:"0"}});expect(screen.getByRole("alert")).toHaveTextContent("integer from 1")});
  it("distinguishes input edits from weights and exposes runtime contributions",()=>{render(<MultipleFeaturesLab/>);expect(screen.getByText("-16.8 $k")).toBeInTheDocument();fireEvent.change(screen.getByRole("slider",{name:"Property age (years)"}),{target:{value:"30"}});expect(screen.getByText("-42 $k")).toBeInTheDocument();expect(screen.getByText(/Applied: area and bedroom contributions stayed fixed/)).toBeInTheDocument()});
  it("shows scaling output with visible labels and units",()=>{render(<MultipleFeaturesLab/>);expect(screen.getByRole("heading",{name:"Same house, standardized coordinates"})).toBeInTheDocument();expect(screen.getByRole("slider",{name:"Floor area (thousand ft²)"})).toHaveAttribute("type","range");expect(screen.getByText(/training-only statistics/i)).toBeInTheDocument()});
  it("uses training-versus-validation evidence before naming overfitting",()=>{render(<FailureModesLab/>);fireEvent.click(screen.getByRole("button",{name:"Training versus validation"}));expect(screen.getByText("Flexible train MSE")).toBeInTheDocument();expect(screen.getByText("Flexible validation MSE")).toBeInTheDocument();expect(screen.getByText(/Only training-versus-validation evidence supports the label/)).toBeInTheDocument()});
  it("provides keyboard-selectable graph observations and accessible alternatives",()=>{render(<EquationLab/>);fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));const plot=screen.getByRole("img",{name:/house-price regression line explorer/i});expect(plot).toHaveAccessibleName(expect.stringContaining("Selected observation 3"));const point=screen.getByRole("button",{name:/Select observation 1/});fireEvent.keyDown(point,{key:"Enter"});expect(metricValue("Selected actual")).toBe("$178k")});
});


describe("equation discovery and actual-change feedback",()=>{
 const open=()=>{render(<EquationLab/>);fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}))};
 const capture=(choice:string)=>{fireEvent.click(screen.getByRole("button",{name:"Capture current rule for comparison"}));fireEvent.click(screen.getByRole("radio",{name:choice}))};
 const compare=()=>fireEvent.click(screen.getByRole("button",{name:"Compare captured prediction"}));
 it("withholds the result until a prediction and derives the two-input contrast",()=>{
  render(<EquationLab/>);expect(screen.getByRole("button",{name:"Try coefficient 46"})).toBeDisabled();expect(screen.queryByText(/255/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("radio",{name:"They increase"}));fireEvent.click(screen.getByRole("button",{name:"Try coefficient 46"}));
  expect(screen.getByRole("status",{name:"Experiment feedback"})).toHaveTextContent("245 → 255");expect(screen.getByRole("status",{name:"Experiment feedback"})).toHaveTextContent("does not establish");
  fireEvent.click(screen.getByRole("button",{name:"Compare coefficient and baseline"}));
  const rows=within(screen.getByRole("table",{name:/Independent changes/})).getAllByRole("row");
  expect(rows[1].textContent).toBe("1182186419210");expect(rows[2].textContent).toBe("2.52452551025510");
 });
 it.each([
  ["They increase","46","255","direction prediction matches"],
  ["They increase","41","242.5","does not match"],
  ["They decrease","41","242.5","direction prediction matches"],
  ["They decrease","46","255","does not match"],
  ["Not sure","46","255","You were unsure"],
  ["They stay the same","42","245","not evidence for a direction match"]
 ])("reports actual behavior for %s and coefficient %s",(choice,value,after,message)=>{
  open();capture(choice);fireEvent.change(screen.getByRole("slider",{name:"Weight ($k per thousand ft²)"}),{target:{value}});compare();
  expect(screen.getByRole("status",{name:"Experiment feedback"})).toHaveTextContent(`245 → ${after}`);expect(screen.getByRole("status",{name:"Experiment feedback"})).toHaveTextContent(message);
 });
 it("handles baseline-only, mixed cancellation, reset, selection and late answers",()=>{
  open();capture("They increase");fireEvent.change(screen.getByRole("slider",{name:"Bias (base price)"}),{target:{value:"150"}});compare();expect(screen.getByRole("status",{name:"Experiment feedback"})).toHaveTextContent("baseline is added once");
  expect(screen.getByRole("radio",{name:"They decrease"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Reset parameters"}));expect(screen.queryByRole("status",{name:"Experiment feedback"})).not.toBeInTheDocument();expect(screen.getByRole("radio",{name:"They increase"})).not.toBeChecked();expect(metricValue("Selected prediction")).toBe("$245k");
  capture("They stay the same");fireEvent.change(screen.getByRole("slider",{name:"Weight ($k per thousand ft²)"}),{target:{value:"46"}});fireEvent.change(screen.getByRole("slider",{name:"Bias (base price)"}),{target:{value:"130"}});compare();expect(screen.getByRole("status",{name:"Experiment feedback"})).toHaveTextContent("Both settings changed");expect(screen.getByRole("status",{name:"Experiment feedback"})).toHaveTextContent("245 → 245");
  fireEvent.keyDown(screen.getByRole("button",{name:/Select observation 1/}),{key:" "});expect(screen.getByRole("button",{name:"Compare captured prediction"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Replay discovery"}));expect(screen.queryByText(/255/)).not.toBeInTheDocument();expect(screen.getByRole("button",{name:"Try coefficient 46"})).toBeDisabled();
 });
 it("preserves supported endpoints and records only genuine parameter changes",()=>{
  const changed=vi.fn();render(<EquationLab onExplore={changed}/>);fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));
  const weight=screen.getByRole("slider",{name:"Weight ($k per thousand ft²)"}),bias=screen.getByRole("slider",{name:"Bias (base price)"});
  expect(weight).toHaveAttribute("min","0");expect(weight).toHaveAttribute("max","90");expect(weight).toHaveAttribute("step","1");expect(bias).toHaveAttribute("max","240");expect(bias).toHaveAttribute("step","5");
  fireEvent.change(weight,{target:{value:"0"}});fireEvent.change(bias,{target:{value:"0"}});expect(metricValue("Selected prediction")).toBe("$0k");fireEvent.change(weight,{target:{value:"90"}});fireEvent.change(bias,{target:{value:"240"}});expect(metricValue("Selected prediction")).toBe("$465k");expect(changed).toHaveBeenCalledTimes(4);
  fireEvent.click(screen.getByRole("button",{name:"Reset parameters"}));expect(changed).toHaveBeenCalledTimes(4);
 });
});
