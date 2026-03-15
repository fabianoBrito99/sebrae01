import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Campanha Sebrae | Totem de Jogos",
  description: "Totem de campanha com Jogo da Memoria e Caca-Palavras"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
