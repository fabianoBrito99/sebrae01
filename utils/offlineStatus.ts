"use client";

export type OfflineCacheStatus = "idle" | "warming" | "ready" | "error";

export const OFFLINE_STATUS_KEY = "campaign-pwa-offline-status";
export const OFFLINE_DISMISSED_KEY = "campaign-pwa-offline-dismissed";
export const OFFLINE_STATUS_EVENT = "campaign-pwa-offline-status-change";

export function readOfflineStatus(): OfflineCacheStatus {
  if (typeof window === "undefined") {
    return "idle";
  }

  const raw = window.localStorage.getItem(OFFLINE_STATUS_KEY);
  if (raw === "idle" || raw === "warming" || raw === "ready" || raw === "error") {
    return raw;
  }

  return "idle";
}

export function writeOfflineStatus(status: OfflineCacheStatus): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(OFFLINE_STATUS_KEY, status);
  window.dispatchEvent(new CustomEvent(OFFLINE_STATUS_EVENT, { detail: { status } }));
}

export function isOfflineNoticeDismissed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(OFFLINE_DISMISSED_KEY) === "1";
}

export function dismissOfflineNotice(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(OFFLINE_DISMISSED_KEY, "1");
}

export function resetOfflineNotice(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(OFFLINE_DISMISSED_KEY);
}
