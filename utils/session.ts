import type { GameType, PlayerFormData } from "@/types/game";

const SESSION_KEY = "campanha-player-session";

export type PlayerSession = {
  player: PlayerFormData;
  game: GameType;
};

export function savePlayerSession(session: PlayerSession): void {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadPlayerSession(): PlayerSession | null {
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as PlayerSession;
  } catch {
    return null;
  }
}

export function clearPlayerSession(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
}
