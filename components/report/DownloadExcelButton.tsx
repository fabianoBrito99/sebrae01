"use client";

import { buildExcelXml } from "@/services/server/report";
import type { PlayerRecord } from "@/types/game";
import styles from "./DownloadExcelButton.module.css";

const browserStorageKey = "campaign-pwa-browser-storage";

function downloadXml(xml: string): void {
  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "participantes.xls";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getBrowserParticipants(): PlayerRecord[] {
  const raw = window.localStorage.getItem(browserStorageKey);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as { participants?: PlayerRecord[] };
    return Array.isArray(parsed.participants) ? parsed.participants : [];
  } catch {
    return [];
  }
}

export default function DownloadExcelButton() {
  const handleDownload = async () => {
    const browserParticipants = getBrowserParticipants();
    if (browserParticipants.length > 0) {
      downloadXml(buildExcelXml(browserParticipants));
      return;
    }

    try {
      const response = await fetch("/api/export");
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "participantes.xls";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback logo abaixo.
    }

    downloadXml(buildExcelXml(browserParticipants));
  };

  return (
    <button type="button" className={styles.button} onClick={() => void handleDownload()}>
      Baixar Excel
    </button>
  );
}
