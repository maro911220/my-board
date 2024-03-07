"use client";
import axios from "axios";
import MediaList from "@/app/(page)/mediaList";
import { useQueries } from "@tanstack/react-query";

export default function Page(props: any) {
  const API_KEY = process.env.TMDB;
  const title = decodeURI(props.params.id);

  // 데이터를 가져오는 React Query 훅
  const ids = [
    `https://api.themoviedb.org/3/movie/${title}`,
    `https://api.themoviedb.org/3/movie/${title}/credits`,
  ];

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: [title, id],
      queryFn: () =>
        axios.get(id, {
          params: { api_key: API_KEY, language: "ko" },
        }),
      staleTime: Infinity,
    })),
  });

  const data = results[0].data?.data;
  const creditsData = results[1].data?.data;
  // Loading & Error
  if (results[0].isPending) return "Loading...";
  if (results[0].error) return "An error has occurred: ";
  console.log(creditsData);

  const mediaData = {
    title: data?.title,
    tagline: data?.tagline,
    overview: data?.overview,
    poster: data?.poster_path,
    genres: data?.genres,
    runtime: data?.runtime,
    release_date: data?.release_date,
    credits: creditsData?.cast.slice(0, 10),
  };

  return (
    <div>
      <div className="media-detail">
        {data && <MediaList mediaData={mediaData} />}
      </div>
    </div>
  );
}
