// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Home from "../page";
import { BetaNav } from "../components/beta-nav";
import { STAGES } from "../learning-journey/catalog";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it("opens public exploration without reading or writing learner storage", () => {
  const read = vi.spyOn(Storage.prototype, "getItem");
  const write = vi.spyOn(Storage.prototype, "setItem");
  const remove = vi.spyOn(Storage.prototype, "removeItem");
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Machine learning finally makes sense.");
  expect(screen.getByRole("link", { name: /Try a Free Lab/ })).toHaveAttribute("href", "/demo");
  expect(screen.getByRole("list", { name: "Four learning stages" }).children).toHaveLength(4);
  expect(screen.getByRole("heading", { name: "Project Studio — Coming Soon" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Project Studio/ })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "$39 one-time purchase" })).toBeInTheDocument();
  expect(screen.getByText(/Purchase is not available yet/)).toBeInTheDocument();
  expect(read).not.toHaveBeenCalled(); expect(write).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled();
});
it("preserves legacy root intent and keyboard-closeable public menu", () => {
  render(<Home />);
  expect(screen.getByRole("link", { name: "Choose your starting point in My learning journey" })).toHaveAttribute("href", "/journey#getting-started");
  expect(screen.getByRole("link", { name: "Open experiments and notebooks in My learning journey" })).toHaveAttribute("href", "/journey#resources");
  const nav = screen.getByRole("navigation", { name: "Public navigation" });
  fireEvent.click(within(nav).getByText("Menu", { selector: "summary" }));
  const link = within(nav).getByRole("link", { name: "Learning stages" });
  fireEvent.keyDown(link, { key: "Escape" });
  expect(link.closest("details")).not.toHaveAttribute("open");
  expect(within(nav).getByText("Menu", { selector: "summary" })).toHaveFocus();
});
it("exposes accepted algorithm modules without a future launch or extra core stage", () => {
  expect(STAGES).toHaveLength(4);
  expect(STAGES[2].links.map(link => link.href)).toEqual(expect.arrayContaining(["/supervised/mlp", "/supervised/model-selection"]));
  expect(STAGES[3].title).toBe("Project Studio — Coming Soon");
  expect(STAGES[3].links).toHaveLength(0);
});

it("distinguishes the product header from the interactive mathematics experience", () => {
  const product = render(<BetaNav />);
  expect(screen.getByRole("link", { name: "ML Mastery" })).toHaveAttribute("href", "/journey");
  product.unmount();
  render(<BetaNav product={false} />);
  expect(screen.getByRole("link", { name: "ML Math Lab" })).toHaveAttribute("href", "/journey");
});
