// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ACTIVITIES } from "./catalog";
import { Outcome } from "./outcome";
it("renders numerical/textual alternatives for every one of the34 exposed configurations", () => {
  expect(ACTIVITIES.flat()).toHaveLength(34);
  for (const config of ACTIVITIES.flat()) {
    const markup = renderToStaticMarkup(<Outcome value={JSON.parse(config.output)} label="Sklearn reference"/>);
    expect(markup).toContain("Sklearn reference");
    expect(markup.length).toBeGreaterThan(50);
    expect(markup).not.toContain("<canvas");
  }
});
