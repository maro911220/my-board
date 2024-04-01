import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/app/_component/Loading";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ListItem from "./ListItem";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { SearcMainhProps } from "@/types/itemsType";
import "swiper/css";

const API_KEY = process.env.KAKAO;

export default function Page({ title, setType }: SearcMainhProps) {
  // 검색어가 바뀌면 적용
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  // 데이터를 가져오는 함수
  const ids = [
    { type: "image", name: "이미지" },
    { type: "web", name: "웹문서" },
    { type: "blog", name: "블로그" },
    { type: "cafe", name: "카페" },
  ];

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: [`${title}-${id.type}`],
      queryFn: () =>
        axios.get(`https://dapi.kakao.com/v2/search/${id.type}`, {
          params: { query: title, size: id.type === "image" ? 24 : 4 },
          headers: {
            Authorization: API_KEY,
          },
        }),
      staleTime: Infinity,
    })),
  });

  // Loading & Error
  if (
    results[0].isPending ||
    results[1].isPending ||
    results[2].isPending ||
    results[3].isPending
  )
    return <Loading />;
  if (
    results[0].error ||
    results[1].error ||
    results[2].error ||
    results[3].error
  )
    return "정보를 불러오는데 실패했습니다.";
  console.log(results);

  return (
    <motion.article
      className="search-area"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {ids.map((item: any, index: number) => {
        return (
          // 이미지 제외 리스트
          <div className="search-list" key={index}>
            <p className="search-list-title">{item.name}</p>
            {item.type === "image" ? (
              <Swiper spaceBetween={4} slidesPerView={"auto"} loop={false}>
                {results[index].data?.data.documents.map(
                  (item: any, index: number) => {
                    return (
                      <SwiperSlide className="search-list-img" key={index}>
                        <a href={item.doc_url} target="_blank">
                          <div>
                            <Image
                              src={item.thumbnail_url}
                              alt={item.image_url}
                              width={150}
                              height={150}
                            />
                          </div>
                        </a>
                      </SwiperSlide>
                    );
                  }
                )}
              </Swiper>
            ) : (
              results[index].data?.data.documents.map(
                (item: any, index: number) => {
                  return <ListItem item={item} key={index} />;
                }
              )
            )}
            <button
              className="search-list-more"
              onClick={() => setType(item.type)}
            >
              {item.name} 더보기
            </button>
          </div>
        );
      })}
    </motion.article>
  );
}
