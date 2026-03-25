import type { Board } from "@/types/board";
import { createEmptyBoard } from "./create-empty-board";
import { create } from "zustand";
import type { Column } from "@/types/column";

import type { Issue } from "@/types/issue";
import type { TagOperationResult, Tag } from "@/types/tag";
//Helpers.
const validateTagName = (name: string, board: Board, tagID?: string) => {
  let result: TagOperationResult = { success: true };
  const normalizedName = name.toLowerCase().trim();
  if (normalizedName === "") {
    result = {
      success: false,
      errorType: "empty",
      error: "Name cannot be an empty string.",
    };
    return result;
  }
  const tags = Object.values(board.tags);
  if (
    tags.some(
      (tag) =>
        tag.name.toLowerCase().trim() === normalizedName && tag.id !== tagID,
    )
  ) {
    result = {
      success: false,
      errorType: "exist",
      error: "Tag already exist ",
    };
    return result;
  }
  return result;
};

type BoardState = {
  board: Board;
  issueDialog: {
    mode: "create" | "edit" | null;
    issueId?: string;
    targetColumnId?: string;
  };
  tagDialog: {
    mode: "create" | "edit" | null;
    tagId?: string;
  };

  createBoard: (name: string) => void;
  // column logic
  addColumn: (input: { name: string; color?: string | null }) => void;
  moveColumn: (input: { oldIndex: number; newIndex: number }) => void;
  // Tags Logic
  addTag: (input: {
    name: string;
    icon?: string;
    color?: string;
  }) => TagOperationResult;
  shallowDeleteTag: (tagId: string) => TagOperationResult;
  attachTag: (input: { tagId: string; issueId: string }) => TagOperationResult;
  detachTag: (input: { tagId: string; issueId: string }) => TagOperationResult;
  openCreateTag: () => void;
  closeTagDialog: () => void;
  // issue logic
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
    tagIDs: string[];
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
  tagDialog: {
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
  openCreateTag: () => {
    set({
      tagDialog: {
        mode: "create",
      },
    });
  },
  closeTagDialog: () => {
    set({
      tagDialog: {
        mode: null,
      },
    });
  },

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
  addTag: ({ name, icon = null, color = null }) => {
    const { board } = get();
    const result: TagOperationResult = validateTagName(name, board);
    if (!result.success) return result;
    set((state) => {
      const normalizedName = name.toLowerCase().trim();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const tag: Tag = {
        id,
        name: normalizedName,
        icon: icon,
        color: color,
        createdAt: now,
        updatedAt: null,
        archivedAt: null,
      };
      const board = state.board;
      const nextBoard: Board = {
        ...board,
        tags: {
          ...board.tags,
          [id]: tag,
        },
        tagOrder: [...board.tagOrder, tag.id],
      };

      return { board: nextBoard };
    });
    return result;
  },
  shallowDeleteTag: (tagId) => {
    let result: TagOperationResult = { success: true };
    set((state) => {
      const now = new Date().toISOString();
      const board = state.board;
      const tag = board.tags[tagId];

      if (!tag) {
        result = {
          success: false,
          errorType: "not-found",
          error: "Cannot found tag to archive",
        };
        return state;
      }
      if (tag.archivedAt) {
        result = {
          success: false,
          errorType: "already-archived",
          error: "This tag is already archived",
        };
        return state;
      }

      const tagOrder = board.tagOrder;
      const newTagOrder = tagOrder.filter(
        (tagIdInOrder) => tagIdInOrder !== tagId,
      );

      const nextBoard: Board = {
        ...board,
        tagOrder: newTagOrder,
        tags: {
          ...board.tags,
          [tagId]: {
            ...tag,
            archivedAt: now,
            updatedAt: now,
          },
        },
      };
      return { board: nextBoard };
    });
    return result;
  },
  attachTag: ({ tagId, issueId }) => {
    let result: TagOperationResult = { success: true };
    set((state) => {
      const now = new Date().toISOString();
      const board = state.board;
      const issue = board.issues[issueId];
      if (!issue) {
        result = {
          success: false,
          errorType: "not-found",
          error: "Could not find the issue",
        };
        return state;
      }
      const tag = board.tags[tagId];
      if (!tag || tag.archivedAt) {
        result = {
          success: false,
          errorType: "not-found",
          error: "Could not find the tag",
        };
        return state;
      }
      if (issue.tagIDs.includes(tagId)) {
        result = {
          success: false,
          errorType: "exist",
          error: "Tag is already attached to this issue",
        };
        return state;
      }
      const newIssueTagList = [...issue.tagIDs, tagId];
      const newBoard: Board = {
        ...board,
        issues: {
          ...board.issues,
          [issueId]: {
            ...issue,
            tagIDs: newIssueTagList,
            updatedAt: now,
          },
        },
      };

      return { board: newBoard };
    });

    return result;
  },
  detachTag: ({ tagId, issueId }) => {
    let result: TagOperationResult = { success: true };
    set((state) => {
      const now = new Date().toISOString();
      const board = state.board;
      const issue = board.issues[issueId];
      if (!issue) {
        result = {
          success: false,
          errorType: "not-found",
          error: "Could not find the issue",
        };
        return state;
      }
      const tag = board.tags[tagId];
      if (!tag) {
        result = {
          success: false,
          errorType: "not-found",
          error: "Could not find the tag",
        };
        return state;
      }
      if (!issue.tagIDs.includes(tagId)) {
        result = {
          success: false,
          errorType: "not-found",
          error: "Tag isn't attached to this issue",
        };
        return state;
      }
      const issueTagList = [...issue.tagIDs];
      const newIssueTagList = issueTagList.filter(
        (attachedTagId) => attachedTagId !== tagId,
      );
      const newBoard: Board = {
        ...board,
        issues: {
          ...board.issues,
          [issueId]: {
            ...issue,
            tagIDs: newIssueTagList,
            updatedAt: now,
          },
        },
      };

      return { board: newBoard };
    });

    return result;
  },
  addIssue: ({
    title,
    columnId,
    body = null,
    priority = 1,
    color = null,
    tagIDs = [],
  }) => {
    //redundand
    // const { board, addColumn } = get();
    // if (board.columnOrder.length == 0) {
    //   addColumn({ name: "Backlog" });
    // }
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
        priority,
        color,
        tagIDs: tagIDs,
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
