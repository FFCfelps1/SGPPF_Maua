import type { NextConfig } from "next";
// Validate environment variables at build time (fails the build if missing/invalid).
import "./src/env";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app (sibling lockfiles otherwise confuse detection).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
