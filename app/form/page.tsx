import FormPageClient from "@/components/forms/FormPageClient";
import type { GameType } from "@/types/game";

type Props = {
  searchParams: Promise<{ game?: string }>;
};

export default async function FormPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialGame: GameType | null =
    params.game === "memory" || params.game === "wordsearch" ? params.game : null;

  return <FormPageClient initialGame={initialGame} />;
}
