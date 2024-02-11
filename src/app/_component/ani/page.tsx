/* eslint-disable @next/next/no-img-element */
"use client";
import "./ani.scss";
import axios from "axios";
import dayjs from "dayjs";
import { useQueries } from "@tanstack/react-query";

export default function Ani() {
  const today = dayjs().locale("en").format("ddd");
  const ids = [
    "https://api.jikan.moe/v4/seasons/now?limit=4",
    `https://api.jikan.moe/v4/schedules?filter=${today}day`,
  ];

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["anime", id],
      queryFn: () => axios.get(id),
      staleTime: Infinity,
    })),
  });

  const aniList = results[0].data?.data;
  const aniSchedule = results[1].data?.data;

  // Loading
  if (results[0].isPending || results[1].isPending) return "Loading...";

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Ani</h3>
      <div className="ani">
        <div className="ani-box">
          <p className="font-semibold mb-1">New</p>
          <div className="ani-box-con">
            {aniList.data.map((anis: any, index: number) => {
              return index < 8 && <Card key={index} anis={anis} />;
            })}
          </div>
        </div>
        <div className="ani-list">
          <p className="font-semibold mb-1">Today Schedule</p>
          <div className="ani-list-con">
            {aniSchedule.data.map((schedule: any, index: number) => {
              return <Schedule key={index} schedule={schedule} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Card(anis: any) {
  return (
    <a href={anis.anis.url} target="_blank" className="ani-box-card">
      <div className="ani-box-card__img">
        <img src={anis.anis.images.webp.image_url} alt={anis.anis.title} />
      </div>
      <p>{anis.anis.title}</p>
    </a>
  );
}

function Schedule(schedule: any) {
  return (
    <a href={schedule.schedule.url} target="_blank" className="ani-list-item">
      <p className="ani-list-item__title">{schedule.schedule.title}</p>
    </a>
  );
}
