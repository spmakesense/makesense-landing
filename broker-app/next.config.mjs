/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  // The PDF generator reads the Hebrew fonts from disk – include them in every server bundle (Vercel).
  outputFileTracingIncludes: { "/**": ["./public/fonts/**"] },
};

export default config;
