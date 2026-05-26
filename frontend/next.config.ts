import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Transpile shared types from parent directory */
  transpilePackages: ["lucide-react"],
  experimental: {
    // Required for `use(params)` in Next.js 15+ app router
  },
};

export default nextConfig;
