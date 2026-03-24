"use client";

import { useEffect } from "react";
import offlineRoutes from "@/config/pwa-routes.json";

const PAGE_CACHE = "app-pages";
const IMAGE_CACHE = "images";
const ASSET_CACHE = "http-cache";

function isImagePath(path: string): boolean {
  return /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(path);
}

async function cacheRoute(path: string): Promise<void> {
  try {
    const response = await fetch(path, {
      cache: "reload",
      credentials: "same-origin"
    });

    if (!response.ok) {
      return;
    }

    const cacheName = isImagePath(path) ? IMAGE_CACHE : path.startsWith("/_next/") ? ASSET_CACHE : PAGE_CACHE;
    const cache = await window.caches.open(cacheName);
    await cache.put(path, response.clone());
  } catch {
    // Warm-up is best-effort. The service worker precache remains the main fallback.
  }
}

export default function OfflineAssetsBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined" || !("caches" in window) || !navigator.onLine) {
      return;
    }

    const warmOfflineRoutes = async () => {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.ready.catch(() => undefined);
      }

      for (const route of offlineRoutes) {
        await cacheRoute(route);
      }
    };

    void warmOfflineRoutes();
  }, []);

  return null;
}
