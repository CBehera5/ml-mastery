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
  it("updates synchronized predictions when a parameter changes and resets",()=>{render(<EquationLab/>);expect(metricValue("Selected prediction")).toBe("$245k");fireEvent.change(screen.getByRole("slider",{name:"Weight ($k per thousand ft²)"}),{target:{value:"50"}});expect(metricValue("Selected prediction")).toBe("$265k");expect(screen.getByText(/50 × 2.5 \+ 140/)).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Reset parameters"}));expect(metricValue("Selected prediction")).toBe("$245k")});
  it("updates all loss metrics and reveals the predicted outlier effect",()=>{render(<ErrorsLab/>);const before=metricValue("MSE");fireEvent.click(screen.getByRole("radio",{name:"MSE"}));fireEvent.click(screen.getByRole("button",{name:"Reveal outlier"}));expect(metricValue("MSE")).not.toBe(before);expect(screen.getByText(/Squaring makes the large residual/)).toBeInTheDocument()});
  it("starts gradient navigation at iteration zero, steps, and resets",()=>{Object.defineProperty(window,"matchMedia",{writable:true,value:vi.fn().mockReturnValue({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})});render(<GradientLab/>);expect(metricValue("Iteration")).toBe("0");fireEvent.click(screen.getByRole("button",{name:"Step"}));expect(metricValue("Iteration")).toBe("1");fireEvent.click(screen.getByRole("button",{name:"Reset training"}));expect(metricValue("Iteration")).toBe("0")});
  it("provides a named keyboard scroller and qualifies a falling loss trace",()=>{render(<GradientLab/>);expect(screen.getByRole("region",{name:/Training history from the mathematical runtime/})).toHaveAttribute("tabindex","0");expect(screen.getByText(/short trace alone does not establish convergence or generalization/)).toBeInTheDocument()});
  it("handles an invalid training configuration without crashing",()=>{render(<GradientLab/>);fireEvent.change(screen.getByLabelText("Training iterations"),{target:{value:"0"}});expect(screen.getByRole("alert")).toHaveTextContent("integer from 1")});
  it("distinguishes input edits from weights and exposes runtime contributions",()=>{render(<MultipleFeaturesLab/>);expect(screen.getByText("-16.8 $k")).toBeInTheDocument();fireEvent.change(screen.getByRole("slider",{name:"Property age (years)"}),{target:{value:"30"}});expect(screen.getByText("-42 $k")).toBeInTheDocument();expect(screen.getByText(/Applied: area and bedroom contributions stayed fixed/)).toBeInTheDocument()});
  it("shows scaling output with visible labels and units",()=>{render(<MultipleFeaturesLab/>);expect(screen.getByRole("heading",{name:"Same house, standardized coordinates"})).toBeInTheDocument();expect(screen.getByRole("slider",{name:"Floor area (thousand ft²)"})).toHaveAttribute("type","range");expect(screen.getByText(/training-only statistics/i)).toBeInTheDocument()});
  it("uses training-versus-validation evidence before naming overfitting",()=>{render(<FailureModesLab/>);fireEvent.click(screen.getByRole("button",{name:"Training versus validation"}));expect(screen.getByText("Flexible train MSE")).toBeInTheDocument();expect(screen.getByText("Flexible validation MSE")).toBeInTheDocument();expect(screen.getByText(/Only training-versus-validation evidence supports the label/)).toBeInTheDocument()});
  it("provides keyboard-selectable graph observations and accessible alternatives",()=>{render(<EquationLab/>);const plot=screen.getByRole("img",{name:/house-price regression line explorer/i});expect(plot).toHaveAccessibleName(expect.stringContaining("Selected observation 3"));const point=screen.getByRole("button",{name:/Select observation 1/});fireEvent.keyDown(point,{key:"Enter"});expect(metricValue("Selected actual")).toBe("$178k")});
});
