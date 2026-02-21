import type { Board } from "@/types/board";
import { createEmptyBoard } from "./create-empty-board";
import { create } from "zustand";
import type { Column } from "@/types/column";

import type { Issue } from "@/types/issue";

type BoardState = {
  board: Board;
  issueDialog: {
    mode: "create" | "edit" | null;
    issueId?: string;
    targetColumnId?: string;
  };
  createBoard: (name: string) => void;
  addColumn: (input: { name: string; color?: string | null }) => void;
  moveColumn: (input: { oldIndex: number; newIndex: number }) => void;
  openCreateIssue: (columnId: string) => void;
  openEditIssue: (issueId: string) => void;
  closeIssueDialog: () => void;
  deleteIssue: (issueId: string) => void;
  editIssue: (input: {
    issueId: string;
    title?: string;
    body?: string | null;
  }) => void;
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
  issueDialog: {
    mode: null,
  },
  createBoard: (name: string) => {
    set({
      board: createEmptyBoard(name),
    });
  },
  openCreateIssue: (columnId) =>
    set({
      issueDialog: {
        mode: "create",
        targetColumnId: columnId,
        issueId: undefined,
      },
    }),
  openEditIssue: (issueId) =>
    set({
      issueDialog: {
        mode: "edit",
        issueId,
        targetColumnId: undefined,
      },
    }),
  closeIssueDialog: () =>
    set({
      issueDialog: {
        mode: null,
      },
    }),
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
  deleteIssue: (issueId) =>
    set((state) => {
      const board = state.board;
      const issue = board.issues[issueId];
      if (!issue) return state;

      const columnId = issue.columnId;
      if (!columnId) return state;

      // Remove from issues dictionary
      const { [issueId]: _, ...remainingIssues } = board.issues;

      // Remove from column order
      const currentOrder = board.issueOrderByColumn[columnId] ?? [];
      const newOrder = currentOrder.filter((id) => id !== issueId);

      return {
        board: {
          ...board,
          issues: remainingIssues,
          issueOrderByColumn: {
            ...board.issueOrderByColumn,
            [columnId]: newOrder,
          },
        },
      };
    }),
  editIssue: ({ issueId, title, body }) => {
    set((state) => {
      const board = state.board;
      const issue = board.issues[issueId];
      if (!issue) return state;
      const now = new Date().toISOString();
      return {
        board: {
          ...board,
          issues: {
            ...board.issues,
            [issueId]: {
              ...issue,
              ...(title !== undefined && { title }),
              ...(body !== undefined && { body }),
              updatedAt: now,
            },
          },
        },
      };
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
  // reorderIssueInColumn: ({ columnId, oldIndex, newIndex }) =>
  //   set((state) => {
  //     const oldBoard = state.board;
  //     const order = state.board.issueOrderByColumn[columnId];
  //     const newOrder = [...order];
  //     const [moved] = newOrder.splice(oldIndex, 1);
  //     newOrder.splice(newIndex, 0, moved);

  //     return {
  //       board: {
  //         ...oldBoard,
  //         issueOrderByColumn: {
  //           ...state.board.issueOrderByColumn,
  //           [columnId]: newOrder,
  //         },
  //       },
  //     };
  //   }),
  // moveIssueBetweenColumns: ({ issueId, fromColumnId, toColumnId }) =>
  //   set((state) => {
  //     const oldBoard = state.board;
  //     const issue = oldBoard.issues[issueId];

  //     const nextSourceOrder = oldBoard.issueOrderByColumn[fromColumnId].filter(
  //       (id) => id !== issueId,
  //     );

  //     const nextTargetOrder = [
  //       ...oldBoard.issueOrderByColumn[toColumnId],
  //       issueId,
  //     ];
  //     return {
  //       board: {
  //         ...oldBoard,
  //         issues: {
  //           ...oldBoard.issues,
  //           [issueId]: { ...issue, columnId: toColumnId },
  //         },
  //         issueOrderByColumn: {
  //           ...oldBoard.issueOrderByColumn,
  //           [fromColumnId]: nextSourceOrder,
  //           [toColumnId]: nextTargetOrder,
  //         },
  //       },
  //     };
  //   }),
  moveIssue: ({ issueId, fromColumnId, toColumnId, toIndex }) => {
    set((state) => {
      const board = state.board;

      const sourceOrder = board.issueOrderByColumn[fromColumnId] ?? [];
      const destinationOrder = board.issueOrderByColumn[toColumnId] ?? [];

      // SAME COLUMN MOVE
      if (fromColumnId === toColumnId) {
        const newOrder = [...sourceOrder];

        const oldIndex = newOrder.indexOf(issueId);
        if (oldIndex === -1) return state;
        if (oldIndex === toIndex) return state;

        newOrder.splice(oldIndex, 1);
        newOrder.splice(toIndex, 0, issueId);

        return {
          board: {
            ...board,
            issueOrderByColumn: {
              ...board.issueOrderByColumn,
              [fromColumnId]: newOrder,
            },
          },
        };
      }

      // CROSS COLUMN MOVE
      const nextSourceOrder = sourceOrder.filter((id) => id !== issueId);

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
