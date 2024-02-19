import { create } from "zustand";
type Store = {
  edit: boolean;
  list: any[];
  theme: string | null;
  setTheme: () => void;
  setDefaultList: () => void;
  setEdit: (e: any) => void;
  setList: (e: any) => void;
  setLayout: (e: any) => void;
  moveItem: (e: any, dragIndex: any, hoverIndex: any) => void;
};

export const defaultStore = create<Store>()((set) => ({
  edit: false,
  list: [],
  theme: null,
  setTheme: () => {
    let themes = localStorage.getItem("theme");
    let beforeTheme: any = themes;
    themes = themes == "light" ? "dark" : "light";
    document.documentElement.classList.replace(beforeTheme, themes);
    localStorage.setItem("theme", themes);
    set(() => ({ theme: themes }));
  },
  setDefaultList: () => {
    const defaultItem = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ];
    const localItem = localStorage.getItem("dndLayouts");
    set(() => ({ list: localItem ? JSON.parse(localItem) : defaultItem }));
  },
  setEdit: (e) => set(() => ({ edit: e })),
  setList: (e) => set(() => ({ list: e })),
  setLayout: (e) => {
    set(() => ({ edit: false }));
    localStorage.setItem("dndLayouts", JSON.stringify(e));
  },
  moveItem: (e, dragIndex, hoverIndex) => {
    const act = () => {
      const newItem = [...e];
      const draggedItem = newItem[dragIndex];
      newItem.splice(dragIndex, 1);
      newItem.splice(hoverIndex, 0, draggedItem);
      return newItem;
    };

    set(() => ({ list: act() }));
  },
}));
