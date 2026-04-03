import type { User } from "firebase/auth";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthLoading: (load: boolean) => void;
};

type AuthModalState = {
  isAuthModalOpen: boolean;
  toggleAuthModal: () => void;
};

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isAuthModalOpen: false,
  toggleAuthModal: () =>
    set((state) => ({
      isAuthModalOpen: !state.isAuthModalOpen,
    })),
}));

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: true,
  setUser: (user) => {
    set({ user: user });
  },
  setAuthLoading: (load) => {
    set({ isAuthLoading: load });
  },
}));
