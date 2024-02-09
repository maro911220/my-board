import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { itemProps, DragItemProps } from "./type";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";

export default function Item({ id, index, children }: itemProps) {
  const { list, moveItem, edit } = useStore(defaultStore);
  const ref = useRef<HTMLDivElement>(null);

  // 드래그 앤 드롭 로직
  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: () => ({ id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [handlerId, drop] = useDrop<DragItemProps>({
    accept: "item",
    hover(item: DragItemProps) {
      if (item.index !== index) {
        moveItem(list, item.index, index);
        item.index = index;
      }
    },
  });

  // 드래그 가능한 상태인 경우만 drag, drop 적용
  edit ? drag(drop(ref)) : drag(null);

  return (
    <article
      ref={ref}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      className={`list-grid-item ${edit ? "edit" : ""}`}
    >
      {children}
    </article>
  );
}
