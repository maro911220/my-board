/* eslint-disable @next/next/no-img-element */
"use client";
import "@/styles/page/search.scss";
import SearchList from "../_component/SearchList";
import { useEffect, useState } from "react";
import Loading from "@/app/_component/Loading";
import { AnimatePresence } from "framer-motion";

export default function Page(props: any) {
  const title = decodeURI(props.params.id);
  const [load, setLoad] = useState(true);
  const [type, setType] = useState("web");
  const typeChange = (e: string) => setType(e);

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 100);
    return () => setLoad(false);
  }, [type]);

  const tabList = [
    { type: "web", name: "웹문서" },
    { type: "blog", name: "블로그" },
    { type: "cafe", name: "카페" },
  ];

  return (
    <section className="search-con" onClick={(e) => e.stopPropagation()}>
      <h2 className="hidden">검색 상세</h2>
      <div className="search-tab">
        {tabList.map((item: any, index: number) => {
          return (
            <button
              key={index}
              className={type == item.type ? "active" : ""}
              onClick={() => typeChange(item.type)}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {load ? <SearchList title={title} type={type} /> : <Loading />}
      </AnimatePresence>
    </section>
  );
}
