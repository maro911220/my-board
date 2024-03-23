/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "@/styles/component/list.scss";
import Link from "next/link";
import { defaultStore } from "@/store/store";
import { useStore } from "zustand";
import { useEffect, useRef } from "react";

export default function List({ data, type }: { data: any; type: string }) {
  const { edit } = useStore(defaultStore);
  const swiperRef = useRef<any>(null);

  // 편집 모드에 따라 자동 재생 및 슬라이드 위치를 제어합니다.
  useEffect(() => {
    if (edit) {
      swiperRef.current.swiper.slideTo(0, 0, false);
      swiperRef.current.swiper.autoplay.stop();
    } else {
      swiperRef.current.swiper.autoplay.start();
    }
  }, [edit]);

  return (
    <Swiper
      ref={swiperRef}
      className="media-list"
      spaceBetween={12}
      slidesPerView="auto"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      loop={true}
      modules={[Autoplay]}
    >
      {data.map((item: any, index: number) => {
        const title = item.title ? item.title : item.original_name;
        return (
          <SwiperSlide key={index} className="media-list-item">
            {/* 각 항목에 대한 세부 정보 페이지 링크 */}
            <Link href={`/${type}/${item.id}`}>
              <div>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                  alt={title}
                />
              </div>
              <p>{title}</p>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
