import { create } from "zustand";
type Store = {
  edit: boolean;
  list: any[];
  theme: string | null;
  checkTheme: () => void;
  setTheme: () => void;
  setDefaultList: () => void;
  setEdit: (e: any) => void;
  setList: (e: any) => void;
  setLayout: (e: any) => void;
};

export const defaultStore = create<Store>()((set) => ({
  edit: false,
  list: [],
  theme: null,
  checkTheme: () => {
    let themes = localStorage.getItem("theme");
    set(() => ({ theme: themes }));
  },
  setTheme: () => {
    let themes = localStorage.getItem("theme");
    let beforeTheme: any = themes;
    themes = themes == "light" ? "dark" : "light";
    document.documentElement.classList.replace(beforeTheme, themes);
    localStorage.setItem("theme", themes);
    set(() => ({ theme: themes }));
  },
  setDefaultList: () => {
    const defaultItem = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
    const localItem = localStorage.getItem("dndLayouts");
    set(() => ({ list: localItem ? JSON.parse(localItem) : defaultItem }));
  },
  setEdit: (e) => set(() => ({ edit: e })),
  setList: (e) => set(() => ({ list: e })),
  setLayout: (e) => {
    set(() => ({ edit: false }));
    localStorage.setItem("dndLayouts", JSON.stringify(e));
  },
}));
