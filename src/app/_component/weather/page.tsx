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
  console.log(weatherTime);
  return (
    <div className="weather">
      <div className="weather-today">
        <div className="weather-today-top">
          <img
            className="weather-today-top__img"
            src={`/img/weather/${weatherDatas.icon}.png`}
            alt={weatherDatas.name}
          />
          <div className="weather-today-top__text">
            <p>{parseFloat(dayItem.temp.day).toFixed(1)}°</p>
            <p>{weatherDatas.name}</p>
          </div>
        </div>
        <div className="weather-today-middle">
          <p>
            최저 <span>{parseFloat(dayItem.temp.min).toFixed(1)}°</span>
          </p>
          <p>
            최고 <span>{parseFloat(dayItem.temp.max).toFixed(1)}°</span>
          </p>
        </div>
        <p className="weather-today-bottom">
          강수
          <span>
            {dayItem.rain == null ? 0 : parseFloat(dayItem.rain).toFixed(0)}mm
          </span>
        </p>
      </div>
      <div className="weather-time">
        {weatherTime.list.map((item: any, index: number) => {
          return (
            index >= 3 && index < 8 && <div key={index}>{item.dt_txt}</div>
          );
        })}
      </div>
    </div>
  );
}
