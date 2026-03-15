import styles from "./BackgroundMarca.module.css";

export default function BackgroundMarca() {
  return (
    <div className={styles.shell} aria-hidden="true">
      <div className={styles.gradient} />
      <div className={styles.orb} />
      <div className={styles.orbSecondary} />
      <div className={styles.ribbonOne} />
      <div className={styles.ribbonTwo} />
      <div className={styles.circleOne} />
      <div className={styles.circleTwo} />
      <div className={styles.grid} />
      <div className={styles.noise} />
    </div>
  );
}
