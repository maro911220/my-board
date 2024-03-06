"use client";
import axios from "axios";
import MediaList from "@/app/(page)/mediaList";
import { useQuery } from "@tanstack/react-query";

export default function Page(props: any) {
  const API_KEY = process.env.TMDB;
  const title = decodeURI(props.params.id);
  const url = `https://api.themoviedb.org/3/movie/${title}`;
  // 데이터를 가져오는 React Query 훅
  const { isPending, error, data } = useQuery({
    queryKey: [title],
    queryFn: () =>
      axios
        .get(url, {
          params: { api_key: API_KEY, language: "ko" },
        })
        .then((res) => res.data),
  });

  // Loading & Error
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  console.log(data);

  const mediaData = {
    title: data.title,
    tagline: data.tagline,
    overview: data.overview,
    poster: data.poster_path,
    genres: data.genres,
    runtime: data.runtime,
    release_date: data.release_date,
  };

  return (
    <div>
      <div className="media-detail">
        {data && <MediaList mediaData={mediaData} />}
      </div>
    </div>
  );
}
