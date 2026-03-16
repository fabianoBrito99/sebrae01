import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Campanha Sebrae | Totem de Jogos",
  description: "Totem de campanha com Jogo da Mem\u00F3ria e Ca\u00E7a-palavras"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
