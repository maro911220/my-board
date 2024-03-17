/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import List from "@/app/_component/List";
import Loading from "@/app/_component/Loading";

export default function Tv() {
  const date = dayjs().format("YYYY");

  const API_KEY = process.env.TMDB;
  const url = `https://api.themoviedb.org/3/discover/tv`;
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
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">TV</h3>
      <div className="media">
        <p className="media-title">국내 인기 방송</p>
        <List data={data.results} type="tv" />
      </div>
    </>
  );
}
