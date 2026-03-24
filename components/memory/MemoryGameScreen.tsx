"use client";

import { useEffect, useState } from "react";
import GameFrame from "@/components/common/GameFrame";
import MemoryBoard from "@/components/memory/MemoryBoard";
import { saveParticipantRecord } from "@/services/client/api";
import { replacePath } from "@/utils/navigation";
import { clearPlayerSession, loadPlayerSession, saveLastResultParticipantId } from "@/utils/session";
import styles from "./MemoryGameScreen.module.css";

export default function MemoryGameScreen() {
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const session = loadPlayerSession();
    if (!session || session.game !== "memory") {
      replacePath("/form");
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft !== 0 || locked) {
      return;
    }

    void finishGame(score);
  }, [locked, score, secondsLeft]);

  const finishGame = async (finalScore: number) => {
    if (locked) {
      return;
    }

    const session = loadPlayerSession();
    if (!session) {
      replacePath("/form");
      return;
    }

    setLocked(true);
    const participant = await saveParticipantRecord({
      ...session.player,
      game: "memory",
      score: finalScore
    });
    saveLastResultParticipantId(participant.id);
    clearPlayerSession();
    replacePath("/resultado");
  };

  return (
    <GameFrame
      title="Jogo da Memória"
      subtitle="Encontre o maior número de pares em um minuto."
      secondsLeft={secondsLeft}
      score={score}
    >
      <div className={styles.board}>
        <MemoryBoard onScoreChange={setScore} onFinish={finishGame} disabled={locked || secondsLeft === 0} />
      </div>
    </GameFrame>
  );
}
