import type { Board } from "@/types/board";
import { createEmptyBoard } from "./create-empty-board";
import { create } from "zustand";
import type { Column } from "@/types/column";

import type { Issue } from "@/types/issue";

type BoardState = {
  board: Board;
  createBoard: (name: string) => void;
  addColumn: (input: { name: string; color?: string | null }) => void;
  moveColumn: (input: { oldIndex: number; newIndex: number }) => void;
  addIssue: (input: {
    title: string;
    columnId?: string;
    body?: string | null;
    tags?: string[] | null;
    priority?: number;
    color?: string | null;
  }) => void;

  moveIssue: (input: {
    issueId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex: number;
  }) => void;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  board: createEmptyBoard("Untitled"),
  createBoard: (name: string) => {
    set({
      board: createEmptyBoard(name),
    });
  },
  addColumn: ({ name, color = null }) => {
    set((state) => {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const column: Column = {
        id,
        name,
        color,
        createdAt: now,
        updatedAt: null,
        archivedAt: null,
      };
      const board = state.board;
      const nextBoard: Board = {
        ...board,
        columns: {
          ...board.columns,
          [id]: column,
        },
        columnOrder: [...board.columnOrder, id],
        issueOrderByColumn: {
          ...board.issueOrderByColumn,
          [id]: [],
        },
      };
      return { board: nextBoard };
    });
  },
  moveColumn: ({ oldIndex, newIndex }) => {
    set((state) => {
      const board = state.board;
      const order = board.columnOrder;

      if (oldIndex === newIndex) return state;

      const newOrder = [...order];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);

      return {
        board: {
          ...board,
          columnOrder: newOrder,
        },
      };
    });
  },
  addIssue: ({
    title,
    columnId,
    body = null,
    tags = null,
    priority = 1,
    color = null,
  }) => {
    // this ensures that board have at least 1 column , and created issue is visible to the user.
    const { board, addColumn } = get();
    if (board.columnOrder.length == 0) {
      addColumn({ name: "Backlog" });
    }
    const { board: updatedBoard } = get();
    const targetColumnId = columnId ?? updatedBoard.columnOrder[0];
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    set((state) => {
      const issue: Issue = {
        id,
        title,
        columnId: targetColumnId,
        body,
        blocks: null,
        tags,
        priority,
        color,
        createdAt: now,
        updatedAt: null,
        archivedAt: null,
      };
      const curBoard = state.board;
      const currentOrder = state.board.issueOrderByColumn[`${targetColumnId}`];
      const newOrderByColumn = [...currentOrder];
      newOrderByColumn.push(issue.id);
      const nextBoard: Board = {
        ...curBoard,
        issues: { ...curBoard.issues, [id]: issue },
        issueOrderByColumn: {
          ...curBoard.issueOrderByColumn,
          [targetColumnId]: newOrderByColumn,
        },
      };

      return { board: nextBoard };
    });
  },
  moveIssue: ({ issueId, fromColumnId, toColumnId, toIndex }) => {
    set((state) => {
      const board = state.board;

      const sourceOrder = board.issueOrderByColumn[fromColumnId] ?? [];
      const destinationOrder = board.issueOrderByColumn[toColumnId] ?? [];

      // Remove from source
      const nextSourceOrder = sourceOrder.filter((id) => id !== issueId);

      // Insert into destination
      const nextDestinationOrder = [...destinationOrder];
      nextDestinationOrder.splice(toIndex, 0, issueId);

      return {
        board: {
          ...board,

          issues: {
            ...board.issues,
            [issueId]: {
              ...board.issues[issueId],
              columnId: toColumnId,
            },
          },

          issueOrderByColumn: {
            ...board.issueOrderByColumn,
            [fromColumnId]: nextSourceOrder,
            [toColumnId]: nextDestinationOrder,
          },
        },
      };
    });
  },
}));
