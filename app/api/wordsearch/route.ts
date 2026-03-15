import { NextResponse } from "next/server";
import { buildWordSearch, getWordSetKey, pickWords } from "@/utils/wordsearch";
import { getLastWordSetKey, setLastWordSetKey } from "@/services/server/storage";

export async function GET() {
  const lastKey = await getLastWordSetKey();
  const words = pickWords(lastKey);
  const puzzle = buildWordSearch(words);
  await setLastWordSetKey(getWordSetKey(words));
  return NextResponse.json(puzzle);
}
