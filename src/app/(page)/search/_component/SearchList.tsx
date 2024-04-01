import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/app/_component/Loading";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ListItem from "./ListItem";
import ListImg from "./ListImg";
import { SearchItemProps } from "@/types/itemsType";

const API_KEY = process.env.KAKAO;

export default function Page({ title, type }: SearchItemProps) {
  const queryClient = useQueryClient();
  const [load, setLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 타입이 바뀌면 적용
  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  // 검색어가 바뀌면 적용
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  // 데이터를 가져오는 함수
  const fetchData = async (num: number) => {
    return await axios
      .get(`https://dapi.kakao.com/v2/search/${type}`, {
        params: {
          query: title,
          size: type === "image" ? 80 : 20,
          page: currentPage + num,
        },
        headers: {
          Authorization: API_KEY,
        },
      })
      .then((res) => res.data);
  };

  // 데이터를 미리 불러오는 함수
  const prefetch = (num: number) => {
    queryClient.prefetchQuery({
      queryKey: [title],
      queryFn: () => fetchData(num),
      staleTime: 1000,
    });
    window.scrollTo(0, 0);
    setLoad(false);
    setTimeout(() => {
      setLoad(true);
    }, 500);
  };

  // 데이터를 가져오는 React Query 훅
  const { isPending, error, data } = useQuery({
    queryKey: [title],
    queryFn: () => fetchData(0),
  });

  // Loading & Error
  if (isPending) return <Loading />;
  if (error) return "정보를 불러오는데 실패했습니다.";

  return load ? (
    <motion.article
      className="search-area"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={`search-list ${type}`}>
        {data.documents.length > 0 ? (
          // 검색 결과가 있을 경우 각 항목을 매핑하여 렌더링합니다.
          data.documents.map((item: any, index: number) => {
            return type !== "image" ? (
              <ListItem item={item} key={index} />
            ) : (
              <ListImg item={item} key={index} />
            );
          })
        ) : (
          // 검색 결과가 없을 경우 메시지를 표시합니다.
          <div>검색 결과가 없습니다..</div>
        )}
      </div>
      <div className="search-btn">
        <button
          className={`${currentPage == 1 ? "disabled" : ""}`}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
            prefetch(-1);
          }}
        >
          Prev
        </button>
        <span>{currentPage}</span>
        <button
          className={`${data.meta.is_end ? "disabled" : ""}`}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            prefetch(1);
          }}
        >
          Next
        </button>
      </div>
    </motion.article>
  ) : (
    <Loading />
  );
}
