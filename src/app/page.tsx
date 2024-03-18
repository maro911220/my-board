"use client";
import "./main.scss";
import Item from "./_component/Item";
import Movie from "./_component/(home)/movie/page";
import Poke from "./_component/(home)/poke/page";
import Weather from "./_component/(home)/weather/page";
import Tv from "./_component/(home)/tv/page";
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
    const sample = ["Tv", "Movie", "Weather", "Poke"];

    return (
      <Item key={item.id} index={index} id={item.id}>
        {/* {components[item.id]} */}
        <p>{sample[item.id]}</p>
      </Item>
    );
  }, []);

  const components = [
    <Tv key="1" />,
    <Movie key="2" />,
    <Weather key="3" />,
    <Poke key="4" />,
  ];

  // JSX 반환
  return (
    <main className="main">
      <h1 className="hidden">Main</h1>
      {/* React Query */}
      <QueryClientProvider client={queryClient}>
        {/* React Dnd Provider */}
        <section className="list-grid">
          <h2 className="hidden">Main-Layout</h2>
          {list.map((item, index) => (
            <article className="list-grid-item" key={index}>
              {components[item.id]}
            </article>
          ))}
        </section>
      </QueryClientProvider>
      {/* React Dnd Provider */}
      <DndProvider options={HTML5toTouch}>
        {edit && (
          <div className="edit-modal">
            <div className="edit-modal-con">
              <p>위젯을 움직여 원하는 순서대로 변경해주세요.</p>
              <div className="edit-modal-list">
                {list.map((item, index) => renderItem(item, index))}
              </div>
              <button className="list-save" onClick={() => setLayout(list)}>
                레이아웃 저장
              </button>
            </div>
            <div className="edit-modal-backdrop"></div>
          </div>
        )}
      </DndProvider>
    </main>
  );
}
