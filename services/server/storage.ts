import { promises as fs } from "node:fs";
import path from "node:path";
import type { AppStorage, DailyGameSelection, PlayerRecord } from "@/types/game";
import { getTodayKey } from "@/utils/date";

const storageFile = path.join(process.cwd(), "data", "storage.json");

const defaultStorage: AppStorage = {
  dailyGame: null,
  participants: [],
  lastWordSetKey: null
};

function isAppStorage(value: unknown): value is AppStorage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as AppStorage;
  return Array.isArray(candidate.participants) && "dailyGame" in candidate && "lastWordSetKey" in candidate;
}

function tryRepairStorage(raw: string): AppStorage | null {
  const lastBrace = raw.lastIndexOf("}");
  if (lastBrace < 0) {
    return null;
  }

  const trimmed = raw.slice(0, lastBrace + 1);
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return isAppStorage(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function ensureStorage(): Promise<void> {
  try {
    await fs.access(storageFile);
  } catch {
    await fs.mkdir(path.dirname(storageFile), { recursive: true });
    await fs.writeFile(storageFile, JSON.stringify(defaultStorage, null, 2), "utf8");
  }
}

export async function readStorage(): Promise<AppStorage> {
  await ensureStorage();
  const raw = await fs.readFile(storageFile, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isAppStorage(parsed)) {
      return parsed;
    }
  } catch {
    const repaired = tryRepairStorage(raw);
    if (repaired) {
      await writeStorage(repaired);
      return repaired;
    }
  }

  await writeStorage(defaultStorage);
  return defaultStorage;
}

export async function writeStorage(data: AppStorage): Promise<void> {
  await ensureStorage();
  await fs.writeFile(storageFile, JSON.stringify(data, null, 2), "utf8");
}

export async function getDailyGame(): Promise<DailyGameSelection | null> {
  const storage = await readStorage();
  if (!storage.dailyGame) {
    return null;
  }
  return storage.dailyGame.date === getTodayKey() ? storage.dailyGame : null;
}

export async function setDailyGame(game: DailyGameSelection): Promise<DailyGameSelection> {
  const storage = await readStorage();
  storage.dailyGame = game;
  await writeStorage(storage);
  return game;
}

export async function clearDailyGame(): Promise<void> {
  const storage = await readStorage();
  storage.dailyGame = null;
  await writeStorage(storage);
}

export async function saveParticipant(record: PlayerRecord): Promise<PlayerRecord> {
  const storage = await readStorage();
  storage.participants.unshift(record);
  await writeStorage(storage);
  return record;
}

export async function getParticipants(): Promise<PlayerRecord[]> {
  const storage = await readStorage();
  return storage.participants;
}

export async function getParticipantById(id: string): Promise<PlayerRecord | null> {
  const participants = await getParticipants();
  return participants.find((item) => item.id === id) ?? null;
}

export async function getLastWordSetKey(): Promise<string | null> {
  const storage = await readStorage();
  return storage.lastWordSetKey;
}

export async function setLastWordSetKey(value: string): Promise<void> {
  const storage = await readStorage();
  storage.lastWordSetKey = value;
  await writeStorage(storage);
}
