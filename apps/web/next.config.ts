import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  transpilePackages: [],
  // Algorithms moved from /supervised and /learn/linear-regression (Oct 2026). Keep old links working.
  async redirects() {
    return [
      { source: "/supervised", destination: "/algorithms", permanent: true },
      { source: "/supervised/:path*", destination: "/algorithms/:path*", permanent: true },
      { source: "/learn/linear-regression", destination: "/algorithms/linear-regression", permanent: true },
      { source: "/learn/linear-regression/:path*", destination: "/algorithms/linear-regression/:path*", permanent: true },
    ];
  },
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
};

export default nextConfig;
