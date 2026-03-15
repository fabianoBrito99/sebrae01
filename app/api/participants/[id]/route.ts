import { NextResponse } from "next/server";
import { getParticipantById } from "@/services/server/storage";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const participant = await getParticipantById(id);
  if (!participant) {
    return NextResponse.json({ error: "Nao encontrado." }, { status: 404 });
  }
  return NextResponse.json(participant);
}
