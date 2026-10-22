import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

describe("route moves", () => {
  it("redirects the old Algorithms routes permanently", async () => {
    const rules = await nextConfig.redirects!();
    const map = Object.fromEntries(rules.map((r) => [r.source, r]));
    expect(map["/supervised/:path*"].destination).toBe("/algorithms/:path*");
    expect(map["/learn/linear-regression/:path*"].destination).toBe("/algorithms/linear-regression/:path*");
    expect(rules.every((r) => (r as { permanent?: boolean }).permanent === true)).toBe(true);
  });
});
