import { WORD_BANK } from "@/data/words";
import type { WordSearchPuzzle, WordPlacement } from "@/types/wordsearch";
import { shuffle } from "@/lib/utils/shuffle";

// Grid reduzida para 10x10 conforme o ajuste solicitado para o caça-palavras.
const GRID_SIZE = 10;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function normalizeWord(word: string): string {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

function randomLetter(): string {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

function canPlaceHorizontal(grid: string[][], word: string, row: number, col: number): boolean {
  if (col + word.length > GRID_SIZE) {
    return false;
  }
  for (let index = 0; index < word.length; index += 1) {
    if (grid[row][col + index] !== "") {
      return false;
    }
  }
  return true;
}

function canPlaceVertical(grid: string[][], word: string, row: number, col: number): boolean {
  if (row + word.length > GRID_SIZE) {
    return false;
  }
  for (let index = 0; index < word.length; index += 1) {
    if (grid[row + index][col] !== "") {
      return false;
    }
  }
  return true;
}

function placeWord(grid: string[][], placement: WordPlacement): void {
  for (let index = 0; index < placement.word.length; index += 1) {
    if (placement.direction === "horizontal") {
      grid[placement.row][placement.col + index] = placement.word[index];
    } else {
      grid[placement.row + index][placement.col] = placement.word[index];
    }
  }
}

function buildSetKey(words: string[]): string {
  return [...words].sort().join("|");
}

export function pickWords(lastKey: string | null): string[] {
  const normalizedPool = WORD_BANK.map(normalizeWord).filter((word) => word.length >= 4 && word.length <= GRID_SIZE);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const picked = shuffle(normalizedPool).slice(0, 10);
    if (buildSetKey(picked) !== lastKey) {
      return picked;
    }
  }
  return shuffle(normalizedPool).slice(10, 20);
}

export function buildWordSearch(words: string[]): WordSearchPuzzle {
  const grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ""));
  const placements: WordPlacement[] = [];

  for (const word of words) {
    let placed = false;
    for (let attempt = 0; attempt < 150 && !placed; attempt += 1) {
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (horizontal && canPlaceHorizontal(grid, word, row, col)) {
        const placement: WordPlacement = { word, row, col, direction: "horizontal" };
        placeWord(grid, placement);
        placements.push(placement);
        placed = true;
      }

      if (!horizontal && canPlaceVertical(grid, word, row, col)) {
        const placement: WordPlacement = { word, row, col, direction: "vertical" };
        placeWord(grid, placement);
        placements.push(placement);
        placed = true;
      }
    }
  }

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (!grid[row][col]) {
        grid[row][col] = randomLetter();
      }
    }
  }

  return {
    grid,
    words,
    placements
  };
}

export function getWordSetKey(words: string[]): string {
  return buildSetKey(words);
}
