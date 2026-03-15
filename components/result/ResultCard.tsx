import type { PlayerRecord } from "@/types/game";
import FireworksAnimation from "@/components/result/FireworksAnimation";
import styles from "./ResultCard.module.css";

type Props = {
  participant: PlayerRecord;
};

export default function ResultCard({ participant }: Props) {
  return (
    <section className={`${styles.card} ${participant.wonPrize ? styles.win : styles.loss}`}>
      {participant.wonPrize ? <FireworksAnimation /> : null}
      <div className={styles.header}>
        <p className={styles.eyebrow}>Resultado final</p>
        <h1>
          {participant.wonPrize
            ? "Parabens! Voce ganhou um brinde!"
            : "Sua participacao foi concluida. Continue com a gente nas proximas experiencias."}
        </h1>
      </div>
      <div className={styles.grid}>
        <article>
          <span>Jogador</span>
          <strong>{participant.fullName}</strong>
        </article>
        <article>
          <span>Acertos</span>
          <strong>{participant.score}</strong>
        </article>
        <article>
          <span>Status</span>
          <strong>{participant.wonPrize ? "Ganhou brinde" : "Participacao concluida"}</strong>
        </article>
      </div>
    </section>
  );
}
