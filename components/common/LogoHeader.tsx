import styles from "./LogoHeader.module.css";

type Props = {
  compact?: boolean;
};

export default function LogoHeader({ compact = false }: Props) {
  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ""}`}>
      
      <img src="/logo.png" alt="Sebrae Rolim de Moura" className={styles.mark} />
      <div className={styles.copy}>
      </div>
    </div>
  );
}
