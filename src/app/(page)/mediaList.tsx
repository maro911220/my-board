/* eslint-disable @next/next/no-img-element */
import "./mediaList.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function MediaList({ mediaData }: { mediaData: any }) {
  return (
    <div className="media-detail-item">
      <div className="media-detail-con">
        <div className="media-detail-img">
          <img
            src={`https://image.tmdb.org/t/p/w500/${mediaData.poster}`}
            alt={mediaData.title}
          />
        </div>

        <div className="media-detail-text">
          <p className="media-detail-text__title">{mediaData.title}</p>
          <p className="media-detail-text__tagline">{mediaData.tagline}</p>
          <div className="media-detail-box">
            <div className="media-detail-text__genres">
              {mediaData.genres.map(
                (item: { id: number; name: string }, index: number) => {
                  return <p key={index}>{item.name}</p>;
                }
              )}
            </div>
            <p className="media-detail-text__runtime">
              러닝 타임 {mediaData.runtime}분
            </p>
            <p className="media-detail-text__release">
              개봉일 {mediaData.release_date}
            </p>
          </div>

          <div className="media-detail-box">
            <p className="media-detail-text__overview">소개</p>
            <p>{mediaData.overview}</p>
          </div>
        </div>
      </div>
      <div className="media-detail-credits">
        <p className="media-detail-credits__title">주요 출연진</p>
        <div className="flex">
          <Swiper
            spaceBetween={12}
            slidesPerView="auto"
            loop={true}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {mediaData.credits?.map((item: any, index: number) => {
              return (
                item.profile_path && (
                  <SwiperSlide key={index}>
                    <img
                      src={`https://media.themoviedb.org/t/p/w138_and_h175_face/${item.profile_path}.jpg`}
                      alt={item.name}
                    />
                    <p>{item.name}</p>
                  </SwiperSlide>
                )
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
