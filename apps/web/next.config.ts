import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/floating-worlds",
        destination: "/floating-worlds/index.html",
      },
      {
        source: "/floating-worlds-old",
        destination: "/floating-worlds-old/index.html",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/og-car/story/:version(v1|v2)/:asset*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/og-car/:version(v1|v2|v3)/:asset*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/mib2/hair-clean-v1/:asset*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/maa-inti-bangaaram/:version(v1|v2)/:asset*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/maa-inti-bangaaram/case-study/v1/:asset*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withVarlock(nextConfig);
