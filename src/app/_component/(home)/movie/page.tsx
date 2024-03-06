/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { defaultStore } from "@/store/store";
import { useStore } from "zustand";
import { useEffect, useState } from "react";
import List from "@/app/_component/List";

export default function Movie() {
  const [reload, setReload] = useState(false);
  const { list } = useStore(defaultStore);

  // 상태 업데이트 후 슬라이드 재생성
  useEffect(() => {
    setTimeout(() => {
      setReload(true);
    }, 10);
    return () => setReload(false);
  }, [list]);

  const API_KEY = process.env.TMDB;
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko`;
  const { isPending, error, data } = useQuery({
    queryKey: ["movies"],
    queryFn: () => axios.get(url).then((res) => res.data),
  });

  // Loading & Error
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Movie</h3>
      <div className="media">
        <p className="media-title">최신 영화</p>
        {reload && <List data={data.results} type="movie" />}
      </div>
    </>
  );
}
