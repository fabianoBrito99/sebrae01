import styles from "./DownloadExcelButton.module.css";

export default function DownloadExcelButton() {
  return (
    <a href="/api/export" className={styles.button}>
      Baixar Excel
    </a>
  );
}
