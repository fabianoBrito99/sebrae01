"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackgroundMarca from "@/components/layout/BackgroundMarca";
import BotaoPrimario from "@/components/common/BotaoPrimario";
import ModalEscolhaJogoDia from "@/components/home/ModalEscolhaJogoDia";
import { fetchDailyGame, resetDailyGame, updateDailyGame } from "@/services/client/api";
import type { GameType } from "@/types/game";
import { savePreferredGame } from "@/utils/session";
import styles from "./HomeExperience.module.css";

const labels: Record<GameType, string> = {
  memory: "Jogo da Mem\u00F3ria",
  wordsearch: "Ca\u00E7a-palavras"
};

export default function HomeExperience() {
  const router = useRouter();
  const [dailyGame, setDailyGame] = useState<GameType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

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
                }
                router.push("/form");
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
