import type { NextConfig } from "next";

const repo = "health-NC-Telemedicine";
const isPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : undefined,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"]
};

export default nextConfig;
