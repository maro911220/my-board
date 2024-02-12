/* eslint-disable @next/next/no-img-element */
"use client";
import "./weather.scss";
import axios from "axios";
import { useGeolocation } from "@uidotdev/usehooks";
import { useQueries } from "@tanstack/react-query";

const weatherData: any = {
  Clouds: { name: "구름", icon: "cloud" },
  Clear: { name: "맑음", icon: "sun" },
  Atmosphere: { name: "흐림", icon: "cloudy-qusts" },
  Snow: { name: "눈", icon: "snow" },
  Rain: { name: "비", icon: "rain" },
  Drizzle: { name: "이슬비", icon: "drizzle" },
  Thunderstorm: { name: "뇌우", icon: "thunder" },
};

export default function Weather() {
  const API_KEY = process.env.WEATHER;
  const state = useGeolocation();
  const latitudes = !state.loading ? state.latitude : 0;
  const longitudes = !state.loading ? state.longitude : 0;
  const ids = [
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitudes}&lon=${longitudes}&exclude=alerts&appid=${API_KEY}&units=metric`,
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitudes}&lon=${longitudes}&appid=${API_KEY}&units=metric`,
  ];

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["weather", id],
      queryFn: () => axios.get(id),
      staleTime: Infinity,
    })),
  });

  const weatherDay = results[0].data?.data;
  const weatherTime = results[1].data?.data;

  // Loading
  if (results[0].isPending || results[1].isPending) return "Loading...";

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Weather</h3>
      <div className="weather">
        {state.error ? (
          <p>위치동의가 필요합니다.</p>
        ) : (
          <Days weatherDay={weatherDay} weatherTime={weatherTime} />
        )}
      </div>
    </>
  );
}

function Days({
  weatherDay,
  weatherTime,
}: {
  weatherDay: any;
  weatherTime: any;
}) {
  const dayItem = weatherDay.daily[0];
  const weatherDatas = weatherData[dayItem.weather[0].main];
  return (
    <div>
      <img
        width={40}
        src={`/img/weather/${weatherDatas.icon}.png`}
        alt={weatherDatas.name}
      />
      <p>날씨 {weatherDatas.name}</p>
      <p>평균 {parseFloat(dayItem.temp.day).toFixed(1)}°</p>
      <p>최저 {parseFloat(dayItem.temp.min).toFixed(1)}°</p>
      <p>최고 {parseFloat(dayItem.temp.max).toFixed(1)}°</p>
      <p>
        강수량
        {dayItem.rain == null ? 0 : parseFloat(dayItem.rain).toFixed(0)}
        mm
      </p>
    </div>
  );
}
