export type Issue = {
  id: string;
  title: string;
  body: string | null;
  blocks: Record<string, unknown>[] | null;
  columnId: string | null;
  priority: number;
  color: string | null;
  tagIDs: string[];

  createdAt: string;
  updatedAt: string | null;
  archivedAt: string | null;
};

export type CreateIssueInput = {
  title: string;
  columnId?: string;
  body?: string | null;
  tags?: string[] | null;
  priority?: number;
  color?: string | null;
};
