import type { Board } from "@/types/board";

const fakeDB: {
  boards: Record<string, Board> | null;
} = {
  boards: null,
};

export async function fakeFetchBoards(): Promise<Record<string, Board> | null> {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  return fakeDB.boards;
}

export async function fakeSaveBoards(data: Record<string, Board> | null) {
  await new Promise((r) => setTimeout(r, 300));
  fakeDB.boards = data;
}
