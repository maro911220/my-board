/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import List from "@/app/_component/List";
import Loading from "@/app/_component/Loading";

export default function Movie() {
  const API_KEY = process.env.TMDB;
  const url = `https://api.themoviedb.org/3/movie/now_playing`;
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
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Movie</h3>
      <div className="media">
        <p className="media-title">최신 영화</p>
        <List data={data.results} type="movie" />
      </div>
    </>
  );
}
