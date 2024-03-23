/* eslint-disable @next/next/no-img-element */
"use client";
import "@/styles/page/search.scss";
import SearchList from "../_component/SearchList";
import { useEffect, useState } from "react";
import Loading from "@/app/_component/Loading";

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

  return (
    <section className="search-con" onClick={(e) => e.stopPropagation()}>
      <h2 className="hidden">검색 상세</h2>
      <div>
        <button onClick={() => typeChange("web")}>웹문서</button>
        <button onClick={() => typeChange("blog")}>블로그</button>
        <button onClick={() => typeChange("cafe")}>카페</button>
      </div>
      {load ? <SearchList title={title} type={type} /> : <Loading />}
    </section>
  );
}
