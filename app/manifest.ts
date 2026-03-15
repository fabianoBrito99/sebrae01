import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sebrae Games",
    short_name: "Sebrae Games",
    description: "PWA de campanha com jogos para eventos e totem",
    start_url: "/",
    display: "standalone",
    background_color: "#07101f",
    theme_color: "#00d2ff",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ]
  };
}
