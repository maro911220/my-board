import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/app/_component/Loading";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ListItem from "./ListItem";

const API_KEY = process.env.KAKAO;

export default function Page({ title }: { title: string }) {
  // 검색어가 바뀌면 적용
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  // 데이터를 가져오는 함수
  const ids = [
    `https://dapi.kakao.com/v2/search/web`,
    `https://dapi.kakao.com/v2/search/blog`,
    `https://dapi.kakao.com/v2/search/cafe`,
  ];

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: [`${title}-${id}`],
      queryFn: () =>
        axios.get(id, {
          params: { query: title, size: 4 },
          headers: {
            Authorization: API_KEY,
          },
        }),
      staleTime: Infinity,
    })),
  });

  const webData = results[0].data?.data;
  const blogData = results[1].data?.data;
  const cafeData = results[2].data?.data;

  // Loading & Error
  if (results[results.length - 1].isPending) return <Loading />;
  if (results[0].error)
    return "An error has occurred: " + results[0].error.message;
  return (
    <motion.article
      className="search-area"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="search-list">
        {webData.documents.map((item: any, index: number) => {
          return <ListItem item={item} key={index} />;
        })}
        <button>웹 더보기</button>
      </div>
      <div className="search-list">
        {blogData.documents.map((item: any, index: number) => {
          return <ListItem item={item} key={index} />;
        })}
        <button>블로그 더보기</button>
      </div>
      <div className="search-list">
        {cafeData.documents.map((item: any, index: number) => {
          return <ListItem item={item} key={index} />;
        })}
        <button>카페 더보기</button>
      </div>
    </motion.article>
  );
}
