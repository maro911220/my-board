import { create } from "zustand";
type Store = {
  edit: boolean;
  list: any[];
  setDefaultList: () => void;
  setEdit: (e: any) => void;
  setList: (e: any) => void;
  setLayout: (e: any) => void;
  moveItem: (e: any, dragIndex: any, hoverIndex: any) => void;
};

export const defaultStore = create<Store>()((set) => ({
  edit: false,
  list: [],
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
