import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Lesson pages keep their internal code slugs (n03, kn02 …) so saved progress and contracts never change.
// The public URL is a readable name: the word URL is rewritten to the code route, and the old code URL
// redirects permanently to the word URL.
const lessonSlugs: { old: string; new: string }[] = JSON.parse(readFileSync(new URL("./lesson-slugs.json", import.meta.url), "utf8"));

const nextConfig: NextConfig = {
  transpilePackages: [],
  // Algorithms moved from /supervised and /learn/linear-regression (Oct 2026). Keep old links working.
  async redirects() {
    return [
      ...lessonSlugs.flatMap((l) => [
        { source: l.old, destination: l.new, permanent: true },
        { source: l.old.replace(/^\/algorithms/, "/supervised"), destination: l.new, permanent: true },
      ]),
      { source: "/supervised", destination: "/algorithms", permanent: true },
      { source: "/supervised/:path*", destination: "/algorithms/:path*", permanent: true },
      { source: "/learn/linear-regression", destination: "/algorithms/linear-regression", permanent: true },
      { source: "/learn/linear-regression/:path*", destination: "/algorithms/linear-regression/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return { beforeFiles: lessonSlugs.map((l) => ({ source: l.new, destination: l.old })), afterFiles: [], fallback: [] };
  },
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
};

export default nextConfig;
