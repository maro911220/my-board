"use client";
import Card from "./_component/Card";
import { useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";

export default function Dnd() {
  //로컬스토리지 저장본이 있다면 불러오고 없다면 기본리스트로 생성
  const { edit, setEdit, list, setList } = useStore(defaultStore);

  useEffect(() => {
    const defualtCardList = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const localItem = localStorage.getItem("dndLayouts");
    setList(localItem ? JSON.parse(localItem) : defualtCardList);
  }, []);

  // 아이템(카드) 드래그시 배열 변경 함수, 변경에 immutability-helper 사용
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const act = () => {
        const newCards = [...list];
        const draggedCard = newCards[dragIndex];
        newCards.splice(dragIndex, 1);
        newCards.splice(hoverIndex, 0, draggedCard);
        return newCards;
      };
      setList(act());
    },
    [list]
  );

  // 아이템(카드) 재사용을 위한 useCallback
  const renderCard = useCallback(
    (card: { id: number }, index: number) => {
      const components = [
        <p key="1">component1</p>,
        <p key="2">component2</p>,
        <p key="3">component3</p>,
      ];

      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          edit={edit}
          moveItem={moveItem}
        >
          {components[card.id]}
        </Card>
      );
    },
    [moveItem, edit]
  );

  // 편집모드
  const editMode = () => {
    setEdit(true);
  };

  const saveLayout = () => {
    setEdit(false);
    localStorage.setItem("dndLayouts", JSON.stringify(list));
  };

  return (
    <main>
      <DndProvider options={HTML5toTouch}>
        <div className="react-dnd-con">
          {list.map((item, index) => {
            return renderCard(item, index);
          })}
        </div>
      </DndProvider>
      <button
        onClick={() => {
          editMode();
        }}
      >
        edit
      </button>
      <button
        onClick={() => {
          saveLayout();
        }}
      >
        save
      </button>
    </main>
  );
}
