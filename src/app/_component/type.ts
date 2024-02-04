export interface itemProps {
  id: any;
  index: number;
  edit: React.ReactNode;
  children: React.ReactNode;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

export interface DragItemProps {
  index: number;
  id: string;
}
