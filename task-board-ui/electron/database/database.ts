//Database
import PouchDB from "pouchdb";
import path from "path";
import { app } from "electron";

export type BoardDocument = {
  _id: string;
  _rev?: string;
  type: "board-snapshot";
  snapshot: any; // we'll tighten later
  updatedAt: string;
};

let db: PouchDB.Database | null = null;

export function initDatabase() {
  if (db) return db;

  const dbPath = path.join(app.getPath("userData"), "board-db");

  db = new PouchDB(dbPath);

  return db;
}
