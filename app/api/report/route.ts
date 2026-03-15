import { NextResponse } from "next/server";
import { buildDashboardSummary } from "@/services/server/report";
import { getParticipants } from "@/services/server/storage";

export async function GET() {
  const participants = await getParticipants();
  const summary = buildDashboardSummary(participants);
  return NextResponse.json({ summary, participants: participants.slice(0, 10) });
}
