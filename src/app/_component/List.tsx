/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./list.scss";

export default function List({ data }: { data: any }) {
  return (
    <Swiper
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
            <img
              src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              alt={title}
            />
            <p>{title}</p>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
