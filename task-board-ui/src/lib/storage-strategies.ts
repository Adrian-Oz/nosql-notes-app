import type { Board } from "@/types/board";
import { db } from "./firebase";
import {
  doc,
  DocumentReference,
  getDoc,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
export type StrategyDependencies = {
  hydrateBoards: (boards: Record<string, Board>) => void;
  createBoard: (name: string) => void;
  getBoards: () => Record<string, Board>;
  userId: string | undefined;
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

export const guestStrategy = {
  load(dependencies: StrategyDependencies) {
    const raw = localStorage.getItem("boards");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        dependencies.hydrateBoards(parsed);
      } catch {
        console.warn("Corrupted localStorage, resetting...");
        dependencies.createBoard("LocalStorage");
      }
    } else {
      dependencies.createBoard("LocalStorage");
    }
  },
  save(dependencies: StrategyDependencies) {
    debouncedSaveGuest(dependencies.getBoards());
  },
};

export const userStrategy = {
  async load(dependencies: StrategyDependencies) {
    try {
      if (!dependencies.userId) return;

      const userDocRef = doc(db, "users", dependencies.userId);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // console.log("data exists", data);
        const boards = data.boards;
        if (boards) {
          dependencies.hydrateBoards(boards);
        } else {
          console.log("there is no board to hydrate, use board from demo");
          // console.log("USE CURENT BOARD ?");
          // dependencies.createBoard("NoBoards");
        }
      } else {
        // console.log("user doc does not exist");
        dependencies.createBoard("UserDocDoesNotExist");
      }
    } catch (error) {
      console.error("Couldnt get document : ", error);
      dependencies.createBoard("CouldntGetDocument");
    }
  },
  save(dependencies: StrategyDependencies) {
    if (!dependencies.userId) return;
    const userDocRef = doc(db, "users", dependencies.userId);
    debouncedSaveUser(dependencies.getBoards, userDocRef);
  },
};

const debouncedSaveUser = debounce(
  async (
    getBoards: () => Record<string, Board>,
    docRef: DocumentReference<DocumentData, DocumentData>,
  ) => {
    try {
      const boards = getBoards();
      await setDoc(docRef, { boards });
      // console.log(boards);
      console.log("Document successfully written/overwritten!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  },
  400,
);

export const strategyMap = {
  user: userStrategy,
  guest: guestStrategy,
};

export function getStrategy(mode: Mode) {
  return strategyMap[mode];
}
