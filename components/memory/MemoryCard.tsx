import styles from "./MemoryCard.module.css";

type Props = {
  image: string;
  flipped: boolean;
  matched: boolean;
  onClick: () => void;
};

export default function MemoryCard({ image, flipped, matched, onClick }: Props) {
  return (
    <button
      className={`${styles.card} ${flipped || matched ? styles.flipped : ""}`}
      type="button"
      onClick={onClick}
      disabled={matched}
    >
      <span className={styles.inner}>
        <span className={styles.front}>?</span>
        <span className={styles.back}>
          <img src={image} alt="Carta do jogo da memoria" />
        </span>
      </span>
    </button>
  );
}
