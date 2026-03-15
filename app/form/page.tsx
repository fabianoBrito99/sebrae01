import { redirect } from "next/navigation";
import FormularioJogador from "@/components/forms/FormularioJogador";
import { getDailyGame } from "@/services/server/storage";

export default async function FormPage() {
  const dailyGame = await getDailyGame();
  if (!dailyGame) {
    redirect("/");
  }

  return <FormularioJogador dailyGame={dailyGame} />;
}
