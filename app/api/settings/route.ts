import { NextResponse } from "next/server";
import type { GameType } from "@/types/game";
import { getTodayKey } from "@/utils/date";
import { clearDailyGame, getDailyGame, setDailyGame } from "@/services/server/storage";

export async function GET() {
  const dailyGame = await getDailyGame();
  return NextResponse.json({ dailyGame });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { game?: GameType };
  if (body.game !== "memory" && body.game !== "wordsearch") {
    return NextResponse.json({ error: "Jogo invalido." }, { status: 400 });
  }

  const dailyGame = await setDailyGame({
    date: getTodayKey(),
    game: body.game
  });

  return NextResponse.json({ dailyGame });
}

export async function DELETE() {
  await clearDailyGame();
  return NextResponse.json({ ok: true });
}
