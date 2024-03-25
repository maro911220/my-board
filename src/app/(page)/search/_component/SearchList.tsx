import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/app/_component/Loading";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const API_KEY = process.env.KAKAO;

export default function Page({ title, type }: { title: string; type: string }) {
  const queryClient = useQueryClient();
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
        params: { query: title, size: 20, page: currentPage + num },
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
      staleTime: 1,
    });
    window.scrollTo(0, 0);
  };
  // 데이터를 가져오는 React Query 훅
  const { isPending, error, data } = useQuery({
    queryKey: [title],
    queryFn: () => fetchData(0),
  });

  // Loading & Error
  if (isPending) return <Loading />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <motion.article
      className="search-area"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="search-list">
        {data.documents.length > 0 ? (
          // 검색 결과가 있을 경우 각 항목을 매핑하여 렌더링합니다.
          data.documents.map((item: any, index: number) => {
            // 정규식을 이용하여 컨텐츠와 제목에서 HTML 태그 제거.
            const replaceWord = /[<b\>{\}\[\]\/\\\=\(\'\"/&#39;]/g;
            const contents = item.contents.replace(replaceWord, "");
            const title = item.title.replace(replaceWord, "");
            const datetime = item.datetime.slice(0, 10);
            const thumbnail = item.thumbnail ? item.thumbnail : null;
            const blogname = item.blogname ? item.blogname : null;
            const cafename = item.cafename ? item.cafename : null;
            const shortUrl = item.url.split("//")[1]?.split("/")[0];

            return (
              <a
                className="search-list-item"
                href={item.url}
                target="_blank"
                key={index}
              >
                <div className="search-list-item__top">
                  <span className="search-list-item__date">{datetime}</span>
                  {blogname ? (
                    <span>{`${shortUrl} / ${blogname}`}</span>
                  ) : cafename ? (
                    <span>{`${shortUrl} / ${cafename}`}</span>
                  ) : (
                    <span>{shortUrl}</span>
                  )}
                  <p>{title}</p>
                </div>
                <div className="search-list-item__content">
                  {thumbnail && (
                    <Image
                      src={thumbnail}
                      alt={title}
                      width={128}
                      height={128}
                    />
                  )}
                  <p>{contents}</p>
                </div>
              </a>
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
  );
}
