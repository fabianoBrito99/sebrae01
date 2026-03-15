import type { DashboardSummary } from "@/types/game";
import CardIndicador from "@/components/report/CardIndicador";
import styles from "./DashboardResumo.module.css";

type Props = {
  summary: DashboardSummary;
};

export default function DashboardResumo({ summary }: Props) {
  return (
    <section className={styles.grid}>
      <CardIndicador title="Total de pessoas" value={String(summary.totalPlayers)} />
      <CardIndicador title="Jogaram memoria" value={String(summary.memoryPlayers)} />
      <CardIndicador title="Jogaram caca-palavras" value={String(summary.wordSearchPlayers)} />
      <CardIndicador title="Mais brindes" value={summary.bestPrizeGame} />
      <CardIndicador title="Media memoria" value={String(summary.averageMemoryScore)} />
      <CardIndicador title="Media caca-palavras" value={String(summary.averageWordSearchScore)} />
      <CardIndicador title="Vitorias" value={String(summary.wins)} />
      <CardIndicador title="Derrotas" value={String(summary.losses)} />
      <CardIndicador title="Conversao memoria" value={`${summary.memoryConversionRate}%`} />
      <CardIndicador title="Conversao caca-palavras" value={`${summary.wordSearchConversionRate}%`} />
    </section>
  );
}
