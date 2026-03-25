export type Tag = {
  id: string;
  name: string;

  icon: string | null;
  color: string | null;

  createdAt: string;
  updatedAt: string | null;
  archivedAt: string | null;
};
export type TagOperationResult = {
  success: boolean;
  errorType?: "empty" | "exist" | "not-found" | "already-archived";
  error?: string;
};
