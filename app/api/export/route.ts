import { getParticipants } from "@/services/server/storage";
import { buildExcelXml } from "@/services/server/report";

export async function GET() {
  const participants = await getParticipants();
  const xml = buildExcelXml(participants);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": 'attachment; filename="participantes.xls"'
    }
  });
}
