"use client";
import axios from "axios";
import MediaList from "@/app/(page)/mediaList";
import { useQueries } from "@tanstack/react-query";
import Loading from "@/app/_component/Loading";

export default function Page(props: any) {
  // ApiKey, title
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

  const mediaData = {
    type: "movie",
    title: data?.title,
    tagline: data?.tagline,
    overview: data?.overview,
    poster: data?.poster_path,
    genres: data?.genres,
    runtime: data?.runtime,
    release_date: data?.release_date,
    credits: creditsData?.cast.slice(0, 20),
    vote: data?.vote_average,
  };

  // Loading & Error
  if (results[0].isPending || results[1].isPending) return <Loading />;
  if (results[0].error || results[1].error)
    return "정보를 불러오는데 실패했습니다.";

  return data && <MediaList mediaData={mediaData} />;
}
