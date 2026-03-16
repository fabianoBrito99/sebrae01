"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DailyGameSelection, GameType, PlayerFormData } from "@/types/game";
import BackHomeButton from "@/components/common/BackHomeButton";
import InputCampo from "@/components/forms/InputCampo";
import BotaoPrimario from "@/components/common/BotaoPrimario";
import LogoHeader from "@/components/common/LogoHeader";
import BackgroundMarca from "@/components/layout/BackgroundMarca";
import { maskCpf, maskPhone } from "@/utils/masks";
import { isFormValid, validateForm } from "@/utils/validators";
import { savePlayerSession } from "@/utils/session";
import styles from "./FormularioJogador.module.css";

const routeByGame: Record<GameType, string> = {
  memory: "/game/memory",
  wordsearch: "/game/wordsearch"
};

type Props = {
  dailyGame: DailyGameSelection;
};

export default function FormularioJogador({ dailyGame }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PlayerFormData>({
    fullName: "",
    cpf: "",
    phone: "(69) 9",
    email: ""
  });

  const errors = useMemo(() => validateForm(form), [form]);
  const valid = isFormValid(form);

  const handleStart = () => {
    savePlayerSession({ player: form, game: dailyGame.game });
    router.push(routeByGame[dailyGame.game]);
  };

  return (
    <main className={styles.page}>
      <BackgroundMarca />
      <BackHomeButton game={dailyGame.game} />
      <section className={styles.panel}>
        <div className={styles.center}>
          <LogoHeader compact />
        </div>

        <div className={styles.heading}>
          <h1>Preencha seus dados para iniciar.</h1>
          <p>{"Campos obrigat\u00F3rios *"}</p>
        </div>
        <div className={styles.grid}>
          <InputCampo
            id="fullName"
            label="Nome completo"
            value={form.fullName}
            onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
            placeholder="Digite nome e sobrenome"
            error={errors.fullName}
          />
          <InputCampo
            id="cpf"
            label="CPF"
            value={form.cpf}
            onChange={(value) => setForm((current) => ({ ...current, cpf: maskCpf(value) }))}
            placeholder="000.000.000-00"
            error={errors.cpf}
          />
          <InputCampo
            id="phone"
            label="Telefone"
            value={form.phone}
            onChange={(value) => setForm((current) => ({ ...current, phone: maskPhone(value) }))}
            placeholder="(69) 99999-9999"
            error={errors.phone}
          />
          <InputCampo
            id="email"
            label="E-mail"
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            placeholder={"voc\u00EA@empresa.com"}
            type="email"
            error={errors.email}
          />
        </div>
        <BotaoPrimario onClick={handleStart} disabled={!valid} block>
          Iniciar
        </BotaoPrimario>
      </section>
    </main>
  );
}
