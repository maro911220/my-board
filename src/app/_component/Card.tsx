import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { itemProps, DragItemProps } from "./type";

export default function Card({
  id,
  index,
  edit,
  children,
  moveItem,
}: itemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: "card", // drag할 요소의 type 아무 이름이나 OK
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [handlerId, drop] = useDrop<DragItemProps>({
    accept: "card", // useDrag와 타입이 맞는지 체크
    hover(item: DragItemProps) {
      //item.index 기존  index 변경
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });

  edit ? drag(drop(ref)) : drag(null);
  const opacity = isDragging ? 0.3 : 1;
  const cursor = edit ? "grab" : "default";
  const border = edit ? "3px dashed #111" : "none";

  return (
    <div
      ref={ref}
      style={{ opacity, cursor, border }}
      className={`react-dnd-item card_${id}`}
    >
      {children}
    </div>
  );
}
