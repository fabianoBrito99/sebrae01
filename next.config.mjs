import withPWAInit from "next-pwa";
import runtimeCaching from "./pwa-runtime-caching.mjs";

const appShellRevision = process.env.VERCEL_GIT_COMMIT_SHA ?? "local-shell-v1";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  dynamicStartUrl: false,
  runtimeCaching,
  additionalManifestEntries: [
    { url: "/", revision: appShellRevision },
    { url: "/form", revision: appShellRevision },
    { url: "/game/memory", revision: appShellRevision },
    { url: "/game/wordsearch", revision: appShellRevision },
    { url: "/resultado", revision: appShellRevision },
    { url: "/relatorio", revision: appShellRevision }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {}
};

export default withPWA(nextConfig);
