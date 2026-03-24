"use client";

import { useEffect, useState } from "react";
import GameFrame from "@/components/common/GameFrame";
import WordSearchBoard from "@/components/wordsearch/WordSearchBoard";
import WordList from "@/components/wordsearch/WordList";
import { fetchWordSearchPuzzle, saveParticipantRecord } from "@/services/client/api";
import type { WordSearchPuzzle } from "@/types/wordsearch";
import { replacePath } from "@/utils/navigation";
import { clearPlayerSession, loadPlayerSession, saveLastResultParticipantId } from "@/utils/session";
import styles from "./WordSearchGameScreen.module.css";

export default function WordSearchGameScreen() {
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [locked, setLocked] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState<WordSearchPuzzle | null>(null);

  useEffect(() => {
    const session = loadPlayerSession();
    if (!session || session.game !== "wordsearch") {
      replacePath("/form");
      return;
    }

    const loadPuzzle = async () => {
      const data = await fetchWordSearchPuzzle();
      setPuzzle(data);
    };
    void loadPuzzle();

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
      game: "wordsearch",
      score: finalScore
    });
    saveLastResultParticipantId(participant.id);
    clearPlayerSession();
    replacePath("/resultado");
  };

  if (!puzzle) {
    return (
      <GameFrame title="Caça-palavras" subtitle="Preparando a grade do jogo..." secondsLeft={60} score={0}>
        <div className={styles.loading}>Carregando puzzle...</div>
      </GameFrame>
    );
  }

  return (
    <GameFrame
      title="Caça-palavras"
      subtitle="Selecione palavras horizontais e verticais com toque ou mouse."
      secondsLeft={secondsLeft}
      score={score}
    >
      <div className={styles.layout}>
        <WordSearchBoard
          puzzle={puzzle}
          onScoreChange={setScore}
          onFoundWordsChange={setFoundWords}
          onFinish={finishGame}
          disabled={locked || secondsLeft === 0}
        />
        <WordList words={puzzle.words} foundWords={foundWords} />
      </div>
    </GameFrame>
  );
}
