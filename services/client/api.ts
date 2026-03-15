import type { DailyGameSelection, GameType, PlayerRecord } from "@/types/game";
import type { DashboardSummary, PlayerFormData } from "@/types/game";
import type { WordSearchPuzzle } from "@/types/wordsearch";

type DailyGameResponse = {
  dailyGame: DailyGameSelection | null;
};

type ReportResponse = {
  summary: DashboardSummary;
  participants: PlayerRecord[];
};

export async function fetchDailyGame(): Promise<DailyGameSelection | null> {
  const response = await fetch("/api/settings", { cache: "no-store" });
  const data = (await response.json()) as DailyGameResponse;
  return data.dailyGame;
}

export async function updateDailyGame(game: GameType): Promise<DailyGameSelection> {
  const response = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game })
  });
  const data = (await response.json()) as DailyGameResponse;
  if (!data.dailyGame) {
    throw new Error("Nao foi possivel salvar o jogo do dia.");
  }
  return data.dailyGame;
}

export async function resetDailyGame(): Promise<void> {
  await fetch("/api/settings", {
    method: "DELETE"
  });
}

export async function saveParticipantRecord(payload: PlayerFormData & { game: GameType; score: number }) {
  const response = await fetch("/api/participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return (await response.json()) as PlayerRecord;
}

export async function fetchParticipant(id: string): Promise<PlayerRecord | null> {
  const response = await fetch(`/api/participants/${id}`, { cache: "no-store" });
  if (response.status === 404) {
    return null;
  }
  return (await response.json()) as PlayerRecord;
}

export async function fetchReport(): Promise<ReportResponse> {
  const response = await fetch("/api/report", { cache: "no-store" });
  return (await response.json()) as ReportResponse;
}

export async function fetchWordSearchPuzzle(): Promise<WordSearchPuzzle> {
  const response = await fetch("/api/wordsearch", { cache: "no-store" });
  return (await response.json()) as WordSearchPuzzle;
}
