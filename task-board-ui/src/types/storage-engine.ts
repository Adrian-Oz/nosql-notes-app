import type { Board } from "./board";

export type StorageEngine = {
  load: () => Promise<Record<string, Board> | null>;
  save: (boards: Record<string, Board>) => void;
};
