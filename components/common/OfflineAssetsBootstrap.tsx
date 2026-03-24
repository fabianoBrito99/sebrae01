"use client";

import { useEffect } from "react";
import offlineRoutes from "@/config/pwa-routes.json";
import { resetOfflineNotice, writeOfflineProgress } from "@/utils/offlineStatus";

const PAGE_CACHE = "app-pages";
const IMAGE_CACHE = "images";
const ASSET_CACHE = "http-cache";
const MODULE_COUNT = 6;

function isImagePath(path: string): boolean {
  return /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(path);
}

async function cacheRoute(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, {
      cache: "reload",
      credentials: "same-origin"
    });

    if (!response.ok) {
      return false;
    }

    const cacheName = isImagePath(path) ? IMAGE_CACHE : path.startsWith("/_next/") ? ASSET_CACHE : PAGE_CACHE;
    const cache = await window.caches.open(cacheName);
    await cache.put(path, response.clone());
    return true;
  } catch {
    return false;
  }
}

export default function OfflineAssetsBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined" || !("caches" in window)) {
      return;
    }

    const warmOfflineRoutes = async () => {
      if (!navigator.onLine) {
        return;
      }

      const total = offlineRoutes.length + MODULE_COUNT;
      let completed = 0;

      writeOfflineProgress({
        status: "warming",
        completed,
        total
      });

      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.ready.catch(() => undefined);
      }

      const modules = [
        import("@/components/forms/FormPageClient"),
        import("@/components/memory/MemoryGameScreen"),
        import("@/components/wordsearch/WordSearchGameScreen"),
        import("@/components/result/ResultadoView"),
        import("@/components/report/RelatorioView"),
        import("@/components/home/HomeExperience")
      ];

      const moduleResults = await Promise.all(
        modules.map(async (modulePromise) => {
          const result = await modulePromise.then(
            () => true,
            () => false
          );

          completed += 1;
          writeOfflineProgress({
            status: "warming",
            completed,
            total
          });

          return result;
        })
      );

      let hasRouteFailure = false;
      for (const route of offlineRoutes) {
        const cached = await cacheRoute(route);
        if (!cached) {
          hasRouteFailure = true;
        }

        completed += 1;
        writeOfflineProgress({
          status: "warming",
          completed,
          total
        });
      }

      if (moduleResults.includes(false) || hasRouteFailure) {
        writeOfflineProgress({
          status: "error",
          completed,
          total
        });
        return;
      }

      resetOfflineNotice();
      writeOfflineProgress({
        status: "ready",
        completed: total,
        total
      });
    };

    void warmOfflineRoutes();
  }, []);

  return null;
}
