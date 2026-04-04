export type Column = {
  id: string;
  name: string;
  color: string | null;

  createdAt: string;
  updatedAt: string | null;
  archivedAt: string | null;
};

export type ColumnOperationResult = {
  success: boolean;
  error?: string;
  errorType?: "not-found" | "not-empty";
};
