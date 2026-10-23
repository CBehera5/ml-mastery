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
  it("gives every lesson a readable public URL that maps back to its code route", async () => {
    const redirects = await nextConfig.redirects!();
    const rewrites = (await nextConfig.rewrites!()) as { beforeFiles: { source: string; destination: string }[] };
    const to = Object.fromEntries(redirects.map((r) => [r.source, r.destination]));
    expect(to["/python/numpy/n03"]).toBe("/python/numpy/broadcasting");
    expect(to["/supervised/knn/kn03"]).toBe("/algorithms/knn/choose-k");
    expect(rewrites.beforeFiles.find((r) => r.source === "/python/numpy/broadcasting")!.destination).toBe("/python/numpy/n03");
    const sources = rewrites.beforeFiles.map((r) => r.source);
    expect(new Set(sources).size).toBe(sources.length);
    expect(sources.every((s) => !/\/[a-z]{1,2}\d\d$/.test(s))).toBe(true);
  });
});
