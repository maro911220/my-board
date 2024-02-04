import { create } from "zustand";
type Store = {
  edit: boolean;
  list: [];
  setEdit: (e: any) => void;
  setList: (e: any) => void;
};

export const defaultStore = create<Store>()((set) => ({
  edit: false,
  list: [],
  setEdit: (e) => set(() => ({ edit: e })),
  setList: (e) => set(() => ({ list: e })),
}));
