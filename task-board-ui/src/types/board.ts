import type { Column } from "./column";
import type { Issue } from "./issue";
import type { Tag } from "./tag";

export type Board = {
  id: string;
  name: string;

  columns: Record<string, Column>;
  issues: Record<string, Issue>;
  tags: Record<string, Tag>;

  tagOrder: string[];
  columnOrder: string[];
  issueOrderByColumn: Record<string, string[]>;
};
