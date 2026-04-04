import "./App.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./features/nav/app-sidebar";
import Layout from "./components/layout";
import { useEffect, useRef } from "react";
import { useAuthStore } from "./features/auth/useAuthStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import LayoutSkeleton from "./components/layout-skeleton";
import { useBoardStore } from "./store/board-store";
import type { Board } from "./types/board";
import { getStrategy, guestStrategy } from "./lib/storage-strategies";
// import Board from "./features/board/board";

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
const debouncedSave = debounce((boards: Record<string, Board>) => {
  localStorage.setItem("boards", JSON.stringify(boards));
}, 400);

function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const createBoard = useBoardStore((s) => s.createBoard);
  const hydrateBoards = useBoardStore((s) => s.hydrateBoards);
  // AUTH listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Hydration  THIS IS SO WIERD BECAUSE OF STRICT MODE

  const user = useAuthStore((s) => s.user);
  let modeRef = useRef<string | null>(null);
  useEffect(() => {
    if (isAuthLoading) return;
    const mode = user ? "user" : "guest";
    if (mode === modeRef.current) return;
    const strategy = getStrategy(mode);
    strategy.load({ hydrateBoards, createBoard });
    useBoardStore.setState({ isHydrated: true, hydriationMode: mode });
    modeRef.current = mode;
  }, [isAuthLoading, hydrateBoards, createBoard, user]);

  // Persistence

  useEffect(() => {
    const unsubscribe = useBoardStore.subscribe((state) => {
      if (!state.isHydrated) return;
      const mode = useAuthStore.getState().user ? "user" : "guest";
      const strategy = getStrategy(mode);
      strategy.save({ hydrateBoards, createBoard }, state.boards);
    });

    return unsubscribe;
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="absolute inset-0 bg-background -z-10" />
      <AppSidebar />
      <main className="w-full overflow-y-hidden">
        {!isAuthLoading && <Layout />}
        {isAuthLoading && <LayoutSkeleton />}
      </main>
    </SidebarProvider>
  );
}

export default App;
