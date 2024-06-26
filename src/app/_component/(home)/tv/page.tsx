/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import List from "@/app/_component/List";
import Loading from "@/app/_component/Loading";

export default function Tv() {
  // 현재 날짜
  const date = dayjs().format("YYYY");

  // API 키 설정, URL
  const API_KEY = process.env.TMDB;
  const url = `https://api.themoviedb.org/3/discover/tv`;

  // TV 데이터 가져오기
  const { isPending, error, data } = useQuery({
    queryKey: ["tv"],
    queryFn: () =>
      axios
        .get(url, {
          params: {
            api_key: API_KEY,
            language: "ko-KR",
            with_origin_country: "KR",
            first_air_date_year: date,
          },
        })
        .then((res) => res.data),
  });

  // Loading & Error
  if (isPending) return <Loading />;
  if (error) return "방송 정보를 불러오는데 실패했습니다.";

  // 불러온 데이터에서 필요한 데이터 정리
  const listDatas = [
    ...data.results.map((item: any) => {
      return {
        title: item.original_name,
        id: item.id,
        poster_path: item.poster_path,
      };
    }),
  ];

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">TV</h3>
      <div className="media">
        <p className="media-title">국내 인기 방송</p>
        <List data={listDatas} type="tv" />
      </div>
    </>
  );
}
