import "./App.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./features/nav/app-sidebar";

import Layout from "./components/layout";
import { useEffect } from "react";
import { createEmptyBoard } from "./store/create-empty-board";
import { useBoardStore } from "./store/board-store";
import type { Board } from "./types/board";

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function App() {
  const hydrate = useBoardStore((s) => s.hydrate);
  const isHydrated = useBoardStore((s) => s.isHydrated);

  useEffect(() => {
    async function boot() {
      if (useBoardStore.getState().isHydrated) return;

      const result = await window.api.loadBoard();

      if (result.status === "ok") {
        if (isValidBoard(result.data)) {
          hydrate(result.data);
        } else {
          const newBoard = createEmptyBoard("Untitled");
          hydrate(newBoard);
          await window.api.saveBoard(newBoard);
        }
      }

      if (result.status === "not_found") {
        const newBoard = createEmptyBoard("Untitled");
        hydrate(newBoard);
        await window.api.saveBoard(newBoard);
        return;
      }
    }

    boot();
  }, [hydrate]);

  useEffect(() => {
    const debouncedSave = debounce(async (board) => {
      await window.api.saveBoard(board);
    }, 400);

    const unsubscribe = useBoardStore.subscribe((state, prevState) => {
      const board = state.board;
      const prevBoard = prevState.board;

      if (!board) return;
      if (!state.isHydrated) return;
      if (board === prevBoard) return;

      debouncedSave(board);
    });

    return unsubscribe;
  }, []);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="absolute inset-0 bg-background -z-10" />
      <AppSidebar />
      <main className="w-full overflow-y-hidden">
        <Layout />
      </main>
    </SidebarProvider>
  );
}
export default App;
function isValidBoard(data: any): data is Board {
  return (
    data &&
    typeof data === "object" &&
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.columns === "object" &&
    Array.isArray(data.columnOrder) &&
    typeof data.issueOrderByColumn === "object" &&
    typeof data.issues === "object"
  );
}
