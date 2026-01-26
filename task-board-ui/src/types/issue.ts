export type Issue = {
  id: string;
  title: string;
  body: string | null;
  blocks: Record<string, unknown>[] | null;
  columnId: string | null;
  tags:string[] | null;
  priority: number;
  color: string|null;

  createdAt: string;
  updatedAt: string | null;
  archivedAt: string | null;
};

