/* eslint-disable @next/next/no-img-element */
import "./mediaList.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";

export default function MediaList({ mediaData }: { mediaData: any }) {
  return (
    <motion.section
      className="media-detail-item"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="hidden">미디어 상세</h2>
      <article className="media-detail-con">
        <div className="media-detail-img">
          <img
            src={`https://image.tmdb.org/t/p/w500/${mediaData.poster}`}
            alt={mediaData.title}
          />
        </div>
        <div className="media-detail-text">
          <h3 className="media-detail-text__title">{mediaData.title}</h3>
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
              평점 {mediaData.vote} / 10
            </p>
            <p className="media-detail-text__runtime">
              러닝 타임 {mediaData.runtime}분
            </p>
            <p className="media-detail-text__release">
              {mediaData.type == "tv" ? "첫 방송 " : "개봉일 "}
              {mediaData.release_date}
            </p>
          </div>
          <div className="media-detail-box">
            <p className="media-detail-text__overview">소개</p>
            <p>{mediaData.overview ? mediaData.overview : "데이터 없음"}</p>
          </div>
        </div>
      </article>
      <article className="media-detail-credits">
        <h3 className="media-detail-credits__title">주요 출연진</h3>
        <div className="flex">
          {mediaData.credits?.length !== 0 ? (
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
          ) : (
            <p>데이터 없음</p>
          )}
        </div>
      </article>
    </motion.section>
  );
}
