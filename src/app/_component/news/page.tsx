/* eslint-disable @next/next/no-img-element */
"use client";
import "./news.scss";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function News() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["news"],
    queryFn: () =>
      axios
        .get(
          "https://newsapi.org/v2/top-headlines?country=kr&apiKey=67f16fb64c9b415dacdf676a6f0139e9"
        )
        .then((res) => res.data),
  });
  // Loading
  if (isPending) return "Loading...";
  // Error
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">News</h3>
      <div className="news">
        <div className="news-box">
          {data.articles.map((news: any, index: number) => {
            if (index < 2) return <Card key={index} news={news} />;
          })}
        </div>
        <div className="news-list">
          {data.articles.map((news: any, index: number) => {
            if (index > 2 && index < 13)
              return <List key={index} news={news} />;
          })}
        </div>
      </div>
    </>
  );
}

function Card(news: any) {
  return (
    <a href={news.news.url} target="_blank" className="news-box-card">
      <div className="news-box-card__img">
        <img alt={news.news.title} src={news.news.urlToImage} />
      </div>

      <div className="news-box-card__title">
        <p>{news.news.title.split("- ")[0]}</p>
        <div>
          <span>{news.news.title.split("- ")[1]}</span>
          <span>{news.news.publishedAt.split("T")[0]}</span>
        </div>
      </div>
    </a>
  );
}

function List(news: any) {
  return (
    <a href={news.news.url} target="_blank" className="news-list-item">
      <p className="news-list-item__title">
        <span>{news.news.title.split("- ")[0]}</span>
        <span>{news.news.title.split("- ")[1]}</span>
      </p>
    </a>
  );
}
