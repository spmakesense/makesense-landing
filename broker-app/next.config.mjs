/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
};

export default config;
