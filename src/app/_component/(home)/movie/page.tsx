/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import List from "@/app/_component/List";
import Loading from "@/app/_component/Loading";

export default function Movie() {
  // API 키 설정, URL
  const API_KEY = process.env.TMDB;
  const url = `https://api.themoviedb.org/3/movie/now_playing`;

  // 영화 데이터 가져오기
  const { isPending, error, data } = useQuery({
    queryKey: ["movies"],
    queryFn: () =>
      axios
        .get(url, {
          params: { api_key: API_KEY, language: "ko" },
        })
        .then((res) => res.data),
  });

  // Loading & Error
  if (isPending) return <Loading />;
  if (error) return "영화 정보를 불러오는데 실패했습니다.";

  // 불러온 데이터에서 필요한 데이터 정리
  const listDatas = [
    ...data.results.map((item: any) => {
      return {
        title: item.title,
        id: item.id,
        poster_path: item.poster_path,
      };
    }),
  ];

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Movie</h3>
      <div className="media">
        <p className="media-title">최신 영화</p>
        <List data={listDatas} type="movie" />
      </div>
    </>
  );
}
