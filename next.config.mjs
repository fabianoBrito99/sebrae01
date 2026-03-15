import withPWAInit from "next-pwa";
import runtimeCaching from "./pwa-runtime-caching.mjs";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {}
};

export default withPWA(nextConfig);
