export interface itemProps {
  id: number;
  index: number;
  children: React.ReactNode;
}

export interface DragItemProps {
  index: number;
  id: string;
}

export interface Reactchildren {
  children: React.ReactNode;
}

export interface SearcMainhProps {
  title: string;
  setType: any;
}

export interface SearchItemProps {
  title: string;
  type: string;
}
