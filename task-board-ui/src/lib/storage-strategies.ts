import type { Board } from "@/types/board";

export type StrategyDependencies = {
  hydrateBoards: (boards: Record<string, Board>) => void;
  createBoard: (name: string) => void;
};
type Mode = "user" | "guest";

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
const debouncedSaveGuest = debounce((boards: Record<string, Board>) => {
  localStorage.setItem("boards", JSON.stringify(boards));
}, 400);

const debouncedSaveUser = debounce((boards: Record<string, Board>) => {
  // localStorage.setItem("boards", JSON.stringify(boards));  this has to change into user save
  console.log("user save placeholder");
}, 800); // more time because of server delay

export const guestStrategy = {
  load(dependencies: StrategyDependencies) {
    const raw = localStorage.getItem("boards");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        dependencies.hydrateBoards(parsed);
      } catch {
        console.warn("Corrupted localStorage, resetting...");
        dependencies.createBoard("Base");
      }
    } else {
      dependencies.createBoard("Base");
    }
  },
  save(dependencies: StrategyDependencies, boards: Record<string, Board>) {
    debouncedSaveGuest(boards);
  },
};

export const userStrategy = {
  load(dependencies: StrategyDependencies) {
    // for now i have no idea what i need here :D
    console.log("user load placeholder");
  },
  save(dependencies: StrategyDependencies, boards: Record<string, Board>) {
    debouncedSaveUser(boards);
  },
};

export const strategyMap = {
  user: userStrategy,
  guest: guestStrategy,
};

export function getStrategy(mode: Mode) {
  return strategyMap[mode];
}
