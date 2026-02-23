// IPC HANDLERS
import { ipcMain } from "electron";
import { BoardDocument, initDatabase } from "./database/database.js";

let writeInProgress = false;

// =====================
// LOAD
// =====================

ipcMain.handle("board:load", async () => {
  const db = initDatabase();

  try {
    const doc = await db.get<BoardDocument>("main-board");
    return { status: "ok", data: doc.snapshot };
  } catch (err: any) {
    if (err.status === 404) {
      return { status: "not_found" };
    }

    return { status: "corrupted" };
  }
});

// =====================
// SAVE
// =====================

ipcMain.handle("board:save", async (_event, board) => {
  if (writeInProgress) {
    return { status: "error", reason: "Write in progress" };
  }

  writeInProgress = true;

  const db = initDatabase();

  try {
    let existing: BoardDocument | null = null;

    try {
      existing = await db.get<BoardDocument>("main-board");
    } catch (err: any) {
      if (err.status !== 404) throw err;
    }

    if (existing) {
      await db.put({
        ...existing,
        snapshot: board,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await db.put({
        _id: "main-board",
        type: "board-snapshot",
        snapshot: board,
        updatedAt: new Date().toISOString(),
      });
    }

    return { status: "ok" };
  } catch (error: any) {
    return { status: "error", reason: error.message };
  } finally {
    writeInProgress = false;
  }
});
