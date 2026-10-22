// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import {cleanup, fireEvent, render, screen, within} from "@testing-library/react";
import {afterEach, expect, it} from "vitest";
import {CurveDiscovery} from "./curve-discovery";

afterEach(cleanup);
it.each(["higher","lower","same","unsure"])("traces the actual arithmetic independently of the learner prediction: %s", prediction=>{
 localStorage.setItem("existing-progress", "preserved");
 render(<CurveDiscovery/>);
 const compare=screen.getByRole("button",{name:"Compare the straight line and curve"});
 expect(compare).toBeDisabled();
 fireEvent.change(screen.getByRole("combobox",{name:/Before seeing/}),{target:{value:prediction}});
 fireEvent.click(compare);
 expect(screen.getByRole("heading",{name:"The added term raises the prediction from 5 to 17"})).toBeInTheDocument();
 expect(screen.getByRole("status")).toHaveTextContent("3 × 4 = 12");
 expect(screen.getByRole("status").textContent?.includes("matched")).toBe(prediction==="higher");
 fireEvent.change(screen.getByRole("combobox",{name:"Try another house-size index"}),{target:{value:"3"}});
 expect(screen.getByText(/straight rule = 7; curved rule = 34/)).toBeInTheDocument();
 const rows=within(screen.getByRole("table")).getAllByRole("row");
 expect(rows.slice(1).map(row=>[...within(row).getAllByRole("rowheader"), ...within(row).getAllByRole("cell")].map(cell=>cell.textContent))).toEqual([["1","1","3","6"],["2","4","5","17"],["3","9","7","34"]]);
 expect(localStorage.getItem("existing-progress")).toBe("preserved");
 fireEvent.change(screen.getByRole("combobox",{name:/Before seeing/}),{target:{value:"unsure"}});
 expect(screen.queryByRole("table")).not.toBeInTheDocument();
});
