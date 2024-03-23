import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import { itemProps, DragItemProps } from "@/types/itemsType";

export default function Item({ id, index, children }: itemProps) {
  const { list, setList, edit } = useStore(defaultStore);
  const ref = useRef<HTMLDivElement>(null);

  const handleHover = (item: DragItemProps, monitor: any) => {
    if (!ref.current) return;
    const dragIndex = item.index;
    const hoverIndex = index;

    if (dragIndex === hoverIndex) return;

    const hoverBoundingRect = ref.current?.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (
      (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
      (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
    ) {
      return;
    }

    const newItem = [...list];
    const draggedItem = newItem[dragIndex];
    newItem.splice(dragIndex, 1);
    newItem.splice(hoverIndex, 0, draggedItem);
    setList(newItem);
    item.index = hoverIndex;
  };

  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: () => ({ id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItemProps>({
    accept: "item",
    hover: handleHover,
  });

  // 드래그 가능한 상태인 경우에만 drag, drop 적용
  edit ? drag(drop(ref)) : drag(null);

  return (
    <div ref={ref} className={`edit-modal-box ${isDragging ? "dragging" : ""}`}>
      {children}
    </div>
  );
}
