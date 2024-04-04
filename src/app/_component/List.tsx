import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "@/styles/component/list.scss";
import Link from "next/link";
import { defaultStore } from "@/store/store";
import { useStore } from "zustand";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { mainMediaProps } from "@/types/itemsType";

export default function List({
  data,
  type,
}: {
  data: mainMediaProps[];
  type: string;
}) {
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
        return (
          <SwiperSlide key={index} className="media-list-item">
            <Link href={`/${type}/${item.id}`}>
              <div>
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                  alt={item.title}
                  width={500}
                  height={500}
                />
              </div>
              <p>{item.title}</p>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
