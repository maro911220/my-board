"use client";
import "./main.scss";
import Item from "./_component/Item";
import Ani from "./_component/ani/page";
import Poke from "./_component/poke/page";
import Weather from "./_component/weather/page";
import { useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 쿼리 클라이언트 생성
const queryClient = new QueryClient();

// 컴포넌트 선언
export default function Page() {
  // Zustand를 사용하여 상태 및 액션을 가져오기
  const { edit, list, setLayout, setDefaultList } = useStore(defaultStore);
  useEffect(() => setDefaultList(), [setDefaultList]);

  // 아이템을 렌더링하는 콜백 함수 정의
  const renderItem = useCallback((item: { id: number }, index: number) => {
    const components = [
      <Ani key="1" />,
      <Weather key="2" />,
      <Poke key="3" />,
      <p key="4">component4</p>,
      <p key="5">component5</p>,
      <p key="6">component6</p>,
    ];

    return (
      <Item key={item.id} index={index} id={item.id}>
        {components[item.id]}
      </Item>
    );
  }, []);

  // JSX 반환
  return (
    <main className="main">
      <h1 className="hidden">Main</h1>
      {/* React Query */}
      <QueryClientProvider client={queryClient}>
        {/* React Dnd Provider */}
        <DndProvider options={HTML5toTouch}>
          <section className="list-grid">
            <h2 className="hidden">Main-Layout</h2>
            {list.map((item, index) => renderItem(item, index))}
          </section>
        </DndProvider>
      </QueryClientProvider>
      {/* 편집 모드일 때 레이아웃 저장 버튼 표시 */}
      {edit && (
        <button className="list-save" onClick={() => setLayout(list)}>
          레이아웃 저장
        </button>
      )}
    </main>
  );
}
