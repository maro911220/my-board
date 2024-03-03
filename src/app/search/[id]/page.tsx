"use client";
import { useState } from "react";
import axios from "axios";
import "@/app/search/search.scss";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page(props: any) {
  const API_KEY = process.env.KAKAO;
  const title = decodeURI(props.params.id);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // 데이터를 가져오는 함수
  const fetchData = async (num: number) => {
    return await axios
      .get(`https://dapi.kakao.com/v2/search/web`, {
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
      staleTime: 10,
    });
  };

  // 데이터를 가져오는 React Query 훅
  const { isPending, error, data } = useQuery({
    queryKey: [title],
    queryFn: () => fetchData(0),
  });

  // Loading & Error
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  console.log(data);
  return (
    <div>
      <div className="search">
        <div className="search-con" onClick={(e) => e.stopPropagation()}>
          <p className="search-result">
            <span>{title}</span> 검색 결과
          </p>
          <div className="search-list">
            {data.documents.length > 0 ? (
              // 검색 결과가 있을 경우 각 항목을 매핑하여 렌더링합니다.
              data.documents.map((item: any, index: number) => {
                // 정규식을 이용하여 컨텐츠와 제목에서 HTML 태그 제거.
                const replaceWord = /[<b\>{\}\[\]\/\\\=\(\'\"/&#39;]/g;
                const contents = item.contents.replace(replaceWord, "");
                const title = item.title.replace(replaceWord, "");
                const datetime = item.datetime.slice(0, 10);

                return (
                  <a
                    className="search-list-item"
                    href={item.url}
                    target="_blank"
                    key={index}
                  >
                    <div>
                      <span>{title}</span>
                      <span>| {datetime}</span>
                    </div>
                    <span>{contents}</span>
                  </a>
                );
              })
            ) : (
              // 검색 결과가 없을 경우 메시지를 표시합니다.
              <div>검색 결과가 없습니다..</div>
            )}
          </div>
          {currentPage !== 1 && (
            <button
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                prefetch(-1);
              }}
            >
              Prev
            </button>
          )}

          {!data.meta.is_end && (
            <button
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                prefetch(1);
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
