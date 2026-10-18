// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Chart, Outcome } from "./outcome";
import { ACTIVITIES, referenceCase } from "./catalog";
afterEach(cleanup);
it("renders all34 finite chart states with explicit numerical/scale/marker alternatives",()=>{
  ACTIVITIES.flat().forEach(config=>{
    render(<><Chart charts={config.charts} label="Reference chart"/><Outcome value={JSON.parse(config.output)} label="Outcome"/></>);
    expect(screen.getAllByRole("img")).toHaveLength(config.charts.length);
    for (let index = 0; index < config.charts.length; index++) {
      const plot = config.charts[index];
      const region=screen.getByRole("region",{name:`Reference chart ${index+1} numerical alternative`});
      expect(region).toHaveTextContent("Linear x limits "+JSON.stringify(plot.xlim));
      expect(region).toHaveTextContent("linear y limits "+JSON.stringify(plot.ylim));
      expect(screen.getAllByText(plot.title,{exact:true}).length).toBeGreaterThan(0);
    }
    cleanup();
  });
});
it("preserves plotting geometry, rather than substituting a decorative image",()=>{
  const line=referenceCase(0,1);
  const view=render(<Chart charts={line.charts} label="Prediction"/>);
  const plot=line.charts[0],series=plot.series[0]!;
  const expected=series.x.map((value,index)=>`${72+(value-plot.xlim[0])/(plot.xlim[1]-plot.xlim[0])*530},${270-(series.y[index]-plot.ylim[0])/(plot.ylim[1]-plot.ylim[0])*230}`).join(" ");
  expect(view.container.querySelector("polyline")).toHaveAttribute("points",expected);
  expect(view.container.querySelectorAll("circle")).toHaveLength(3);
  cleanup();
  const histogram=referenceCase(1,1);render(<Chart charts={histogram.charts} label="Density"/>);
  expect(screen.getByRole("region",{name:"Density 1 numerical alternative"})).toHaveTextContent("Probability area=0.5");
});
