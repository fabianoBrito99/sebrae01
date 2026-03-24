"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormularioJogador from "@/components/forms/FormularioJogador";
import { fetchDailyGame } from "@/services/client/api";
import type { DailyGameSelection, GameType } from "@/types/game";

type Props = {
  initialGame: GameType | null;
};

export default function FormPageClient({ initialGame }: Props) {
  const router = useRouter();
  const [dailyGame, setDailyGame] = useState<DailyGameSelection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (initialGame) {
        setDailyGame({
          date: new Date().toISOString().slice(0, 10),
          game: initialGame
        });
        setLoading(false);
        return;
      }

      const selection = await fetchDailyGame();
      if (!selection) {
        router.replace("/");
        return;
      }

      setDailyGame(selection);
      setLoading(false);
    };

    void load();
  }, [initialGame, router]);

  if (loading || !dailyGame) {
    return null;
  }

  return <FormularioJogador dailyGame={dailyGame} />;
}
