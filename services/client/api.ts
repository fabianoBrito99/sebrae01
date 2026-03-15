import { buildDashboardSummary } from "@/services/server/report";
import type { DashboardSummary, DailyGameSelection, GameType, PlayerFormData, PlayerRecord } from "@/types/game";
import type { WordSearchPuzzle } from "@/types/wordsearch";
import { getTodayKey } from "@/utils/date";
import { buildWordSearch, getWordSetKey, pickWords } from "@/utils/wordsearch";

type DailyGameResponse = { dailyGame: DailyGameSelection | null };
type ReportResponse = { summary: DashboardSummary; participants: PlayerRecord[] };
type BrowserStorage = {
  dailyGame: DailyGameSelection | null;
  participants: PlayerRecord[];
  lastWordSetKey: string | null;
};
type SafeApiResponse<T> = {
  ok: boolean;
  status: number;
  data: T | null;
};

const BROWSER_STORAGE_KEY = "campaign-pwa-browser-storage";
const defaultBrowserStorage: BrowserStorage = {
  dailyGame: null,
  participants: [],
  lastWordSetKey: null
};

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readBrowserStorage(): BrowserStorage {
  if (!canUseBrowserStorage()) {
    return defaultBrowserStorage;
  }

  const raw = window.localStorage.getItem(BROWSER_STORAGE_KEY);
  if (!raw) {
    return defaultBrowserStorage;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<BrowserStorage>;
    return {
      dailyGame: parsed.dailyGame ?? null,
      participants: Array.isArray(parsed.participants) ? parsed.participants : [],
      lastWordSetKey: parsed.lastWordSetKey ?? null
    };
  } catch {
    return defaultBrowserStorage;
  }
}

function writeBrowserStorage(storage: BrowserStorage): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(storage));
}

function saveDailyGameToBrowser(dailyGame: DailyGameSelection | null): void {
  const storage = readBrowserStorage();
  writeBrowserStorage({ ...storage, dailyGame });
}

function saveParticipantToBrowser(record: PlayerRecord): void {
  const storage = readBrowserStorage();
  const participants = [record, ...storage.participants.filter((item) => item.id !== record.id)];
  writeBrowserStorage({ ...storage, participants });
}

function saveLastWordSetKeyToBrowser(lastWordSetKey: string): void {
  const storage = readBrowserStorage();
  writeBrowserStorage({ ...storage, lastWordSetKey });
}

function normalizeDailyGameForToday(selection: DailyGameSelection | null): DailyGameSelection | null {
  if (!selection) {
    return null;
  }

  return selection.date === getTodayKey() ? selection : null;
}

async function readJsonSafely<T>(response: Response): Promise<T | null> {
  const raw = await response.text();
  if (!raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<SafeApiResponse<T>> {
  try {
    const response = await fetch(input, init);
    const data = await readJsonSafely<T>(response);
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null
    };
  }
}

export async function fetchDailyGame(): Promise<DailyGameSelection | null> {
  const response = await requestJson<DailyGameResponse>("/api/settings", { cache: "no-store" });
  const browserStorageDailyGame = normalizeDailyGameForToday(readBrowserStorage().dailyGame);

  if (response.ok && response.data) {
    const normalizedServerDailyGame = normalizeDailyGameForToday(response.data.dailyGame);
    saveDailyGameToBrowser(normalizedServerDailyGame);
    return normalizedServerDailyGame ?? browserStorageDailyGame;
  }

  return browserStorageDailyGame;
}

export async function updateDailyGame(game: GameType): Promise<DailyGameSelection> {
  const response = await requestJson<DailyGameResponse>("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game })
  });
  const fallbackSelection: DailyGameSelection = {
    date: getTodayKey(),
    game
  };
  const dailyGame = response.ok && response.data?.dailyGame ? response.data.dailyGame : fallbackSelection;
  saveDailyGameToBrowser(dailyGame);
  return dailyGame;
}

export async function resetDailyGame(): Promise<void> {
  await requestJson<{ ok: boolean }>("/api/settings", { method: "DELETE" });
  saveDailyGameToBrowser(null);
}

export async function saveParticipantRecord(
  payload: PlayerFormData & { game: GameType; score: number }
): Promise<PlayerRecord> {
  const response = await requestJson<PlayerRecord>("/api/participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok && response.data) {
    saveParticipantToBrowser(response.data);
    return response.data;
  }

  const fallbackRecord: PlayerRecord = {
    id: crypto.randomUUID(),
    fullName: payload.fullName.trim(),
    cpf: payload.cpf,
    phone: payload.phone,
    email: payload.email.trim(),
    game: payload.game,
    score: payload.score,
    wonPrize: payload.score >= 5,
    playedAt: new Date().toISOString()
  };
  saveParticipantToBrowser(fallbackRecord);
  return fallbackRecord;
}

export async function fetchParticipant(id: string): Promise<PlayerRecord | null> {
  const response = await requestJson<PlayerRecord>(`/api/participants/${id}`, { cache: "no-store" });
  if (response.ok && response.data) {
    saveParticipantToBrowser(response.data);
    return response.data;
  }

  const storage = readBrowserStorage();
  return storage.participants.find((item) => item.id === id) ?? null;
}

export async function fetchReport(): Promise<ReportResponse> {
  const response = await requestJson<ReportResponse>("/api/report", { cache: "no-store" });
  const storage = readBrowserStorage();

  if (response.ok && response.data) {
    if (response.data.participants.length === 0 && storage.participants.length > 0) {
      return {
        summary: buildDashboardSummary(storage.participants),
        participants: storage.participants.slice(0, 10)
      };
    }

    return response.data;
  }

  return {
    summary: buildDashboardSummary(storage.participants),
    participants: storage.participants.slice(0, 10)
  };
}

export async function fetchWordSearchPuzzle(): Promise<WordSearchPuzzle> {
  const response = await requestJson<WordSearchPuzzle>("/api/wordsearch", { cache: "no-store" });
  if (response.ok && response.data) {
    return response.data;
  }

  const storage = readBrowserStorage();
  const words = pickWords(storage.lastWordSetKey);
  const puzzle = buildWordSearch(words);
  saveLastWordSetKeyToBrowser(getWordSetKey(words));
  return puzzle;
}
