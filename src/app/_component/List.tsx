/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./list.scss";
import Link from "next/link";
import { defaultStore } from "@/store/store";
import { useStore } from "zustand";
import { useEffect, useRef } from "react";

export default function List({ data, type }: { data: any; type: string }) {
  const { edit } = useStore(defaultStore);
  const ref = useRef(null);
  useEffect(() => {
    if (edit) {
      ref.current?.swiper.slideTo(0, 0, false);
      ref.current?.swiper?.autoplay?.stop();
    } else {
      ref.current?.swiper?.autoplay?.start();
    }
  }, [edit]);
  return (
    <Swiper
      ref={ref}
      className="media-list"
      spaceBetween={12}
      slidesPerView="auto"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      loop={true}
      onSwiper={(swiper) => console.log(swiper)}
      modules={[Autoplay]}
    >
      {data.map((item: any, index: number) => {
        const title = item.title ? item.title : item.original_name;
        return (
          <SwiperSlide key={index} className="media-list-item">
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
