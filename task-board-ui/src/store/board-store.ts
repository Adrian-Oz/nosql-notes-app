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
  boards: Record<string, Board>;
  activeBoardId: string | null;
  isHydrated: boolean;
  hydriationMode: "user" | "guest" | null;
  issueDialog: {
    mode: "create" | "edit" | null;
    issueId?: string;
    targetColumnId?: string;
  };
  tagDialog: {
    mode: "create" | "edit" | null;
    tagId?: string;
  };

  hydrateBoards: (boards: Record<string, Board>) => void;
  getActiveBoard: () => Board | null;
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

const initialBoard = createEmptyBoard("Base");

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: {
    [initialBoard.id]: initialBoard,
  },
  activeBoardId: initialBoard.id,
  isHydrated: false,
  hydriationMode: null,
  issueDialog: {
    mode: null,
  },
  tagDialog: {
    mode: null,
  },
  getActiveBoard: () => {
    const { boards, activeBoardId } = get();
    if (!activeBoardId) return null;
    return boards[activeBoardId] ?? null;
  },
  hydrateBoards: (boards: Record<string, Board>) => {
    const ids = Object.keys(boards);
    set({
      boards: boards,
      activeBoardId: ids[0] ?? null,
      isHydrated: true,
    });
  },
  createBoard: (name: string) => {
    set((state) => {
      const newBoard = createEmptyBoard(name);

      return {
        boards: {
          ...state.boards,
          [newBoard.id]: newBoard,
        },
        activeBoardId: newBoard.id,
      };
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
  // addColumn: ({ name, color = null }) => {
  //   set((state) => {
  //     const id = crypto.randomUUID();
  //     const now = new Date().toISOString();
  //     const column: Column = {
  //       id,
  //       name,
  //       color,
  //       createdAt: now,
  //       updatedAt: null,
  //       archivedAt: null,
  //     };
  //     const board = get().getActiveBoard();
  //     if (!board) {
  //       return state;
  //     }
  //     const nextBoard: Board = {
  //       ...board,
  //       columns: {
  //         ...board.columns,
  //         [id]: column,
  //       },
  //       columnOrder: [...board.columnOrder, id],
  //       issueOrderByColumn: {
  //         ...board.issueOrderByColumn,
  //         [id]: [],
  //       },
  //     };
  //     return {
  //       boards: {
  //         ...state.boards,
  //         [board.id]: nextBoard,
  //       },
  //     };
  //   });
  // },
  addColumn: ({ name, color = null }) => {
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;

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

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });
  },
  addTag: ({ name, icon = null, color = null }) => {
    const { boards, activeBoardId } = get();
    if (!activeBoardId) {
      let result: TagOperationResult = { success: false };
      return result;
    }
    const result: TagOperationResult = validateTagName(
      name,
      boards[activeBoardId],
    );
    if (!result.success) return result;
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;
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
      const nextBoard: Board = {
        ...board,
        tags: {
          ...board.tags,
          [id]: tag,
        },
        tagOrder: [...board.tagOrder, tag.id],
      };

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });
    return result;
  },
  shallowDeleteTag: (tagId) => {
    let result: TagOperationResult = { success: true };
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;
      const now = new Date().toISOString();
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
      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });
    return result;
  },
  attachTag: ({ tagId, issueId }) => {
    let result: TagOperationResult = { success: true };
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;
      const now = new Date().toISOString();
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
      const nextBoard: Board = {
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

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });

    return result;
  },
  detachTag: ({ tagId, issueId }) => {
    let result: TagOperationResult = { success: true };
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;
      const now = new Date().toISOString();
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
      const nextBoard: Board = {
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

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
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
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;

      const targetColumnId = columnId ?? board.columnOrder[0];
      if (!targetColumnId) return state;

      const now = new Date().toISOString();
      const id = crypto.randomUUID();

      const issue: Issue = {
        id,
        title,
        columnId: targetColumnId,
        body,
        blocks: null,
        priority,
        color,
        tagIDs,
        createdAt: now,
        updatedAt: null,
        archivedAt: null,
      };

      const currentOrder = board.issueOrderByColumn[targetColumnId] ?? [];

      const nextBoard: Board = {
        ...board,
        issues: {
          ...board.issues,
          [id]: issue,
        },
        issueOrderByColumn: {
          ...board.issueOrderByColumn,
          [targetColumnId]: [...currentOrder, id],
        },
      };

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });
  },
  deleteIssue: (issueId) =>
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;
      const issue = board.issues[issueId];
      if (!issue) return state;

      const columnId = issue.columnId;
      if (!columnId) return state;

      // Remove from issues dictionary
      const { [issueId]: _, ...remainingIssues } = board.issues;

      // Remove from column order
      const currentOrder = board.issueOrderByColumn[columnId] ?? [];
      const newOrder = currentOrder.filter((id) => id !== issueId);

      const nextBoard: Board = {
        ...board,
        issues: remainingIssues,
        issueOrderByColumn: {
          ...board.issueOrderByColumn,
          [columnId]: newOrder,
        },
      };

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    }),
  editIssue: ({ issueId, title, body }) => {
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;

      const issue = board.issues[issueId];
      if (!issue) return state;
      const now = new Date().toISOString();

      const nextBoard: Board = {
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
      };
      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });
  },
  moveColumn: ({ oldIndex, newIndex }) => {
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;

      const order = board.columnOrder;

      if (
        oldIndex === newIndex ||
        oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= order.length ||
        newIndex >= order.length
      ) {
        return state;
      }

      const newOrder = [...order];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);

      const nextBoard: Board = {
        ...board,
        columnOrder: newOrder,
      };

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });
  },
  moveIssue: ({ issueId, fromColumnId, toColumnId, toIndex }) => {
    set((state) => {
      const { activeBoardId, boards } = state;

      if (!activeBoardId) return state;

      const board = boards[activeBoardId];
      if (!board) return state;

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

        const nextBoard: Board = {
          ...board,
          issueOrderByColumn: {
            ...board.issueOrderByColumn,
            [fromColumnId]: newOrder,
          },
        };

        return {
          boards: {
            ...boards,
            [activeBoardId]: nextBoard,
          },
        };
      }

      const nextSourceOrder = sourceOrder.filter((id) => id !== issueId);

      const nextDestinationOrder = [...destinationOrder];
      nextDestinationOrder.splice(toIndex, 0, issueId);

      const nextBoard: Board = {
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
      };

      return {
        boards: {
          ...boards,
          [activeBoardId]: nextBoard,
        },
      };
    });
  },
}));
