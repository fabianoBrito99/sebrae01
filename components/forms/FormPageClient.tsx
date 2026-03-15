"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormularioJogador from "@/components/forms/FormularioJogador";
import { fetchDailyGame } from "@/services/client/api";
import type { DailyGameSelection } from "@/types/game";

export default function FormPageClient() {
  const router = useRouter();
  const [dailyGame, setDailyGame] = useState<DailyGameSelection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const selection = await fetchDailyGame();
      if (!selection) {
        router.replace("/");
        return;
      }

      setDailyGame(selection);
      setLoading(false);
    };

    void load();
  }, [router]);

  if (loading || !dailyGame) {
    return null;
  }

  return <FormularioJogador dailyGame={dailyGame} />;
}
