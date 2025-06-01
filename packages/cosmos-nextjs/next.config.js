// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  env: {
    CHAIN: "dhealth",
    CONTRACT_ADDRESS: "dh14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s8py8te",
    EXPLORER_ADDRESS: "https://ping.pub/dhealth/tx/",
    KEY: "",
    PROOF: ""
  },
};

module.exports = nextConfig;
