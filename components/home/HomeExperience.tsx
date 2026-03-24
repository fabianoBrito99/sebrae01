"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackgroundMarca from "@/components/layout/BackgroundMarca";
import BotaoPrimario from "@/components/common/BotaoPrimario";
import ModalEscolhaJogoDia from "@/components/home/ModalEscolhaJogoDia";
import { fetchDailyGame, resetDailyGame, updateDailyGame } from "@/services/client/api";
import type { GameType } from "@/types/game";
import {
  dismissOfflineNotice,
  isOfflineNoticeDismissed,
  OFFLINE_STATUS_EVENT,
  readOfflineStatus,
  type OfflineCacheStatus
} from "@/utils/offlineStatus";
import { savePreferredGame } from "@/utils/session";
import styles from "./HomeExperience.module.css";

const labels: Record<GameType, string> = {
  memory: "Jogo da Memória",
  wordsearch: "Caça-palavras"
};

export default function HomeExperience() {
  const router = useRouter();
  const [dailyGame, setDailyGame] = useState<GameType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState<OfflineCacheStatus>("idle");
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);

  useEffect(() => {
    const load = async () => {
      const selection = await fetchDailyGame();
      setDailyGame(selection?.game ?? null);
      setShowSelector(!selection?.game);
      setLoading(false);
    };

    void load();
  }, []);

  useEffect(() => {
    const syncNoticeState = () => {
      const status = readOfflineStatus();
      setOfflineStatus(status);
      setShowOfflineNotice(!isOfflineNoticeDismissed() && (status === "warming" || status === "ready" || status === "error"));
    };

    syncNoticeState();

    const handleOfflineStatusChange = () => {
      syncNoticeState();
    };

    window.addEventListener(OFFLINE_STATUS_EVENT, handleOfflineStatusChange as EventListener);
    window.addEventListener("online", handleOfflineStatusChange);

    return () => {
      window.removeEventListener(OFFLINE_STATUS_EVENT, handleOfflineStatusChange as EventListener);
      window.removeEventListener("online", handleOfflineStatusChange);
    };
  }, []);

  useEffect(() => {
    void router.prefetch("/");
    void router.prefetch("/form");
    void router.prefetch("/game/memory");
    void router.prefetch("/game/wordsearch");
    void router.prefetch("/resultado");
    void router.prefetch("/relatorio");

    Array.from({ length: 10 }, (_, index) => `/im${index + 1}.jpeg`).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [router]);

  const handleSelectGame = async (game: GameType) => {
    setSaving(true);
    const selection = await updateDailyGame(game);
    setDailyGame(selection.game);
    setShowSelector(false);
    setSaving(false);
  };

  const handleBackToSelector = async () => {
    setSaving(true);
    await resetDailyGame();
    setDailyGame(null);
    setShowSelector(true);
    setSaving(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.bgMotion} />
      <div className={styles.noise} />
      <BackgroundMarca />
      <ModalEscolhaJogoDia open={!loading && showSelector} onSelect={handleSelectGame} loading={saving} />

      {showOfflineNotice ? (
        <aside className={`${styles.offlineNotice} ${styles[`offline-${offlineStatus}`] ?? ""}`} aria-live="polite">
          <div className={styles.offlineCopy}>
            <strong>
              {offlineStatus === "ready"
                ? "Modo offline pronto"
                : offlineStatus === "warming"
                  ? "Preparando modo offline"
                  : "Modo offline precisa de atenção"}
            </strong>
            <span>
              {offlineStatus === "ready"
                ? "O totem já pode funcionar sem internet nas telas principais."
                : offlineStatus === "warming"
                  ? "Estamos salvando rotas e imagens para uso sem conexão."
                  : "Abra o app online por alguns segundos para concluir o cache offline."}
            </span>
          </div>
          <button
            type="button"
            className={styles.offlineClose}
            aria-label="Ocultar aviso offline"
            onClick={() => {
              dismissOfflineNotice();
              setShowOfflineNotice(false);
            }}
          >
            ×
          </button>
        </aside>
      ) : null}

      {dailyGame && !showSelector ? (
        <button
          className={styles.backButton}
          type="button"
          onClick={() => void handleBackToSelector()}
          aria-label="Voltar para selecionar o jogo do dia"
          title="Selecionar o jogo do dia"
        >
          <span aria-hidden="true">&#8592;</span>
        </button>
      ) : null}

      <div className={styles.center}>
        <div className={styles.badge}>{dailyGame ? labels[dailyGame] : "Defina o jogo do dia"}</div>
        <div className={styles.content}>
          <div className={styles.img}>
            <img src="/logo.png" alt="Logo do evento" className={styles.eventLogo} />
          </div>

          <div className={styles.ctaRow}>
            <BotaoPrimario
              onClick={() => {
                if (dailyGame) {
                  savePreferredGame(dailyGame);
                  router.push("/form");
                }
              }}
              disabled={!dailyGame}
              block
            >
              Iniciar jogo
            </BotaoPrimario>
          </div>
        </div>
      </div>
    </main>
  );
}
