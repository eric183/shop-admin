import { create } from "zustand";

type TDarkmode = "dark" | "light";

const themeStore = create<{
  darkMode: TDarkmode;
  toggleDarkMode: (arg: TDarkmode) => void;
}>()((set) => {
  return {
    darkMode: "dark",
    toggleDarkMode: () =>
      set(({ darkMode }) => ({
        darkMode,
      })),
  };
});

export default themeStore;
