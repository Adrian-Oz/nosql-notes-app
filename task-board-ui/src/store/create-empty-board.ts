import type { Board } from "@/types/board";

export function createEmptyBoard(name: string): Board {
  return {
    id: crypto.randomUUID(),
    name,

    columns: {},
    issues: {},

    columnOrder: [],
    issueOrderByColumn: {},
  };
}
