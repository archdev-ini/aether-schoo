
import { create } from 'zustand';

interface HeaderState {
  user: { name: string; id: string } | null;
  setUser: (user: { name: string; id: string } | null) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
