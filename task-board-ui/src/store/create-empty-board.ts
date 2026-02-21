import type { Board } from "@/types/board";

export function createEmptyBoard(name: string): Board {
  const columnId = crypto.randomUUID();
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    columns: {
      [columnId]: {
        id: columnId,
        name: "Backlog",
        color: null,
        createdAt: now,
        updatedAt: null,
        archivedAt: null,
      },
    },
    columnOrder: [columnId],
    issueOrderByColumn: {
      [columnId]: [],
    },
    issues: {},
  };
}
