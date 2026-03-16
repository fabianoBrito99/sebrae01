"use client";

import { useRouter } from "next/navigation";
import styles from "./BackHomeButton.module.css";

type Props = {
  label?: string;
};

export default function BackHomeButton({ label = "Voltar para a tela inicial" }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => router.push("/")}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">←</span>
    </button>
  );
}
