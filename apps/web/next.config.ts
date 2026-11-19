import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/floating-worlds/index.html",
      },
      {
        source: "/archive/floating-worlds",
        destination: "/floating-worlds/index.html",
      },
      {
        source: "/archive/floating-worlds-old",
        destination: "/floating-worlds-old/index.html",
      },
    ];
  },
  async redirects() {
    return [
      { source: "/brand", destination: "/design/brand", permanent: true },
      { source: "/brand-artwork", destination: "/design/brand-artwork", permanent: true },
      { source: "/brand-blue-hour", destination: "/design/brand-blue-hour", permanent: true },
      { source: "/brand-bright", destination: "/design/brand-bright", permanent: true },
      { source: "/brand-dusk", destination: "/design/brand-dusk", permanent: true },
      { source: "/brand-golden-hour", destination: "/design/brand-golden-hour", permanent: true },
      { source: "/brand-storm", destination: "/design/brand-storm", permanent: true },
      { source: "/katana", destination: "/archive/katana", permanent: true },
      { source: "/maa-inti-bangaaram", destination: "/archive/maa-inti-bangaaram", permanent: true },
      { source: "/mib", destination: "/archive/mib", permanent: true },
      { source: "/mib-compare", destination: "/archive/mib-compare", permanent: true },
      { source: "/mib2", destination: "/mib-page", permanent: true },
      { source: "/og-car", destination: "/og-page", permanent: true },
      { source: "/og-compare", destination: "/archive/og-compare", permanent: true },
      { source: "/og2", destination: "/archive/og2", permanent: true },
      { source: "/oncemore", destination: "/archive/oncemore", permanent: true },
      { source: "/oncemore2", destination: "/archive/oncemore2", permanent: true },
      { source: "/profile", destination: "/archive/profile", permanent: true },
      { source: "/profile2", destination: "/archive/profile2", permanent: true },
      { source: "/scroll", destination: "/archive/scroll", permanent: true },
      { source: "/scroll2", destination: "/archive/scroll2", permanent: true },
      { source: "/signup", destination: "/archive/signup", permanent: true },
      { source: "/signup-3d", destination: "/archive/signup-3d", permanent: true },
      { source: "/squish", destination: "/archive/squish", permanent: true },
      { source: "/squish2", destination: "/archive/squish2", permanent: true },
      { source: "/transition", destination: "/archive/transition", permanent: true },
      { source: "/floating-worlds", destination: "/archive/floating-worlds", permanent: true },
      { source: "/floating-worlds-old", destination: "/archive/floating-worlds-old", permanent: true },
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
