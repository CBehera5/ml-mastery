// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { LearningJourney } from "./dashboard";
import { readJourneyProgress, type JourneyProgress } from "./progress";
import Home from "../page";
vi.mock("./progress", async original => ({ ...await original<typeof import("./progress")>(), readJourneyProgress: vi.fn() }));
const read = vi.mocked(readJourneyProgress);
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it("renders the root dashboard, distinct loading/empty states and one prominent Start action", async () => {
  read.mockResolvedValue({ scopes: [], warnings: [] });
  render(<Home />);
  expect(screen.getByRole("heading", { name: /Build understanding/ })).toBeInTheDocument();
  const start = await screen.findByRole("link", { name: /Start Learning/ });
  expect(start).toHaveAttribute("href", "/math/algebra-functions/variables");
  expect(screen.queryByRole("link", { name: /Continue Learning/ })).not.toBeInTheDocument();
  expect(screen.getByRole("list", { name: "Learning roadmap" }).children).toHaveLength(5);
  expect(screen.queryByRole("link", { name: "Project Studio" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Deployment/ })).not.toBeInTheDocument();
});
it("resumes validated work and exposes mastery as separate evidence, never writes storage", async () => {
  const saved: JourneyProgress = { scopes: [{ title: "pandas", href: "/python/pandas", active: true, mastery: "Mastery not yet demonstrated", target: { title: "Aligned selection", href: "/python/pandas/d02", stage: "Python for ML / pandas", why: "Keep observations aligned.", detail: "Suggested continuation." } }], warnings: [] };
  read.mockResolvedValue(saved);
  const write = vi.spyOn(Storage.prototype, "setItem");
  render(<LearningJourney />);
  expect(await screen.findByRole("link", { name: /Continue Learning/ })).toHaveAttribute("href", "/python/pandas/d02");
  expect(screen.getByRole("button", { name: "Python for ML" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByText("View saved module states"));
  expect(screen.getByText("Mastery not yet demonstrated")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Choose a different starting point"));
  fireEvent.click(screen.getByRole("radio", { name: /I already know this/ }));
  expect(screen.getByRole("link", { name: "pandas assessment" })).toHaveAttribute("href", "/python/pandas/mastery");
  expect(write).not.toHaveBeenCalled();
});
it("offers available stages, reversible existing-content modes and five concept connections", async () => {
  read.mockResolvedValue({ scopes: [], warnings: [] }); render(<LearningJourney />);
  await screen.findByRole("link", { name: /Start Learning/ });
  fireEvent.click(screen.getByRole("button", { name: "Python for ML" }));
  const detail = screen.getByRole("region", { name: "Python for ML: implemented content" });
  expect(within(detail).getAllByRole("link")).toHaveLength(6);
  fireEvent.click(screen.getByText("Choose a different starting point"));
  fireEvent.click(screen.getByRole("radio", { name: /focused refresher/ }));
  expect(screen.getByRole("link", { name: "Leakage and fold-local preparation" })).toHaveAttribute("href", "/python/preparation/t05");
  fireEvent.click(screen.getByText("Derivatives → Gradients → Gradient Descent", { selector: "summary" }));
  expect(screen.getByRole("link", { name: "Gradient updates" })).toHaveAttribute("href", "/math/optimization/updates");
});
it("treats unreadable progress as unknown, not zero, and refreshes after returning", async () => {
  read.mockResolvedValue({ scopes: [], warnings: ["Unsupported version. Original records are untouched."] });
  render(<LearningJourney />);
  await screen.findByRole("link", { name: /Start Learning/ });
  expect(screen.getByText("Some progress is unavailable; it is not treated as zero.")).toBeInTheDocument();
  expect(screen.queryByText(/No saved learning activity found/)).not.toBeInTheDocument();
  const previous = read.mock.calls.length;
  fireEvent(window, new Event("pageshow"));
  await waitFor(() => expect(read.mock.calls.length).toBeGreaterThan(previous));
});
it("sends the logo home and keeps Beta Guide, experiments and challenges in semantic disclosures", async () => {
  read.mockResolvedValue({ scopes: [], warnings: [] }); render(<LearningJourney />);
  await screen.findByRole("link", { name: /Start Learning/ });
  const nav = screen.getByRole("navigation", { name: "Learning navigation" });
  expect(within(nav).getByRole("link", { name: "ML Math Lab" })).toHaveAttribute("href", "/");
  fireEvent.click(within(nav).getByText("Help", { selector: "summary" }));
  expect(within(nav).getByRole("link", { name: /Beta guide/ })).toHaveAttribute("href", "/beta");
  fireEvent.keyDown(within(nav).getByRole("link", { name: /Beta guide/ }), { key: "Escape" });
  expect(within(nav).getByText("Help", { selector: "summary" }).closest("details")).not.toHaveAttribute("open");
  expect(within(nav).getByText("Help", { selector: "summary" })).toHaveFocus();
  fireEvent.click(within(nav).getByText("Challenges", { selector: "summary" }));
  expect(within(nav).getByRole("link", { name: "X-Ray experiment" })).toHaveAttribute("href", "/demo");
  expect(within(nav).getByRole("link", { name: "Debug challenge" })).toHaveAttribute("href", "/challenges/wrong-direction");
});

