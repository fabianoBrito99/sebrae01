import { NextResponse } from "next/server";
import type { GameType, PlayerFormData, PlayerRecord } from "@/types/game";
import { saveParticipant, getParticipants } from "@/services/server/storage";
import { isValidCpf, isValidEmail, isValidFullName, isValidPhone } from "@/utils/validators";

type ParticipantPayload = PlayerFormData & {
  game: GameType;
  score: number;
};

export async function GET() {
  const participants = await getParticipants();
  return NextResponse.json(participants);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ParticipantPayload;

  if (
    !isValidFullName(body.fullName) ||
    !isValidCpf(body.cpf) ||
    !isValidPhone(body.phone) ||
    !isValidEmail(body.email) ||
    (body.game !== "memory" && body.game !== "wordsearch")
  ) {
    return NextResponse.json({ error: "Dados invalidos." }, { status: 400 });
  }

  const record: PlayerRecord = {
    id: crypto.randomUUID(),
    fullName: body.fullName.trim(),
    cpf: body.cpf,
    phone: body.phone,
    email: body.email.trim(),
    game: body.game,
    score: body.score,
    wonPrize: body.score >= 5,
    playedAt: new Date().toISOString()
  };

  const saved = await saveParticipant(record);
  return NextResponse.json(saved, { status: 201 });
}
