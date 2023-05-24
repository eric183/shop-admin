import { create } from "zustand";

interface MainState {
  bears: number;
  increase: (by: number) => void;
}

const mainStore = create<MainState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));

export default mainStore;
