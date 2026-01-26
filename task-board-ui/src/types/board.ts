import type { Column } from "./column";
import type { Issue } from "./issue";

export type Board = {
  id: string;
  name: string;

  columns: Record<string, Column>;
  issues: Record<string, Issue>;

  columnOrder: string[];
  issueOrderByColumn: Record<string, string[]>;
};
