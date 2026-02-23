export {};

declare global {
  interface Window {
    api: {
      loadBoard: () => Promise<
        | { status: "ok"; data: any }
        | { status: "not_found" }
        | { status: "corrupted" }
      >;
      saveBoard: (
        board: unknown,
      ) => Promise<{ status: "ok" } | { status: "error"; reason: string }>;
    };
  }
}
