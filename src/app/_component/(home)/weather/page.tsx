"use client";
import "@/styles/component/home/weather.scss";
import axios from "axios";
import { useGeolocation } from "@uidotdev/usehooks";
import { useQueries } from "@tanstack/react-query";
import { dayDatasProps, timeDatasProps } from "@/types/itemsType";
import { useCallback, useEffect, useState, useRef } from "react";
import Loading from "@/app/_component/Loading";
import WeatherTime from "./_component/weatherTime";
import WeatherToday from "./_component/weatherToday";

const API_KEY = process.env.WEATHER;

export default function Weather() {
  const [dayDatas, setDayDatas] = useState<dayDatasProps | null>(null);
  const [timeDatas, setTimeDatas] = useState<timeDatasProps[] | null>(null);

  const locationRef = useRef<{ lat: number; lon: number } | null>(null);

  const { latitude, longitude, error } = useGeolocation();

  useEffect(() => {
    if (latitude != null && longitude != null && !locationRef.current) {
      locationRef.current = {
        lat: Math.round(latitude * 10000) / 10000,
        lon: Math.round(longitude * 10000) / 10000,
      };
    }
  }, [latitude, longitude]);

  const fixedLat = locationRef.current?.lat;
  const fixedLon = locationRef.current?.lon;

  const fetchWeather = useCallback(async (url: string) => {
    const response = await axios.get(url);
    return response;
  }, []);

  const results = useQueries({
    queries: [
      {
        queryKey: ["weather", "current", fixedLat, fixedLon],
        queryFn: () =>
          fetchWeather(
            `https://api.openweathermap.org/data/2.5/weather?lat=${fixedLat}&lon=${fixedLon}&exclude=alerts&appid=${API_KEY}&units=metric`
          ),
        staleTime: 1000 * 60 * 10,
        enabled: fixedLat != null && fixedLon != null,
      },
      {
        queryKey: ["weather", "forecast", fixedLat, fixedLon],
        queryFn: () =>
          fetchWeather(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${fixedLat}&lon=${fixedLon}&appid=${API_KEY}&units=metric`
          ),
        staleTime: 1000 * 60 * 10,
        enabled: fixedLat != null && fixedLon != null,
      },
    ],
  });

  useEffect(() => {
    if (
      !results[0].isPending &&
      !results[1].isPending &&
      results[0].data &&
      results[1].data
    ) {
      const weatherDay = results[0].data?.data;
      const weatherTime = results[1].data?.data;

      const dayData = {
        dayWeather: weatherDay.weather[0].main,
        rain: weatherDay.rain,
        country: weatherDay.sys.country,
        temps: [
          { name: "평균", value: weatherDay.main.temp },
          { name: "체감", value: weatherDay.main.feels_like },
          { name: "최저", value: weatherDay.main.temp_min },
          { name: "최고", value: weatherDay.main.temp_max },
        ],
      };

      const fitTimeList = weatherTime.list.slice(3, 13);
      const timeData = fitTimeList.map((item: any) => ({
        dayWeather: item.weather[0].main,
        temp: item.main.temp,
        day: item.dt_txt,
      }));

      setDayDatas(dayData);
      setTimeDatas(timeData);
    }
  }, [results[0].data, results[1].data]);

  if (error) return <p>위치동의가 필요합니다.</p>;
  if (results[0].isLoading || results[1].isLoading || !dayDatas || !timeDatas)
    return <Loading />;

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Weather</h3>
      <div className="weather">
        <div className="weather-today">
          <p className="weather-title">오늘 날씨</p>
          <div className="weather-today-con">
            <WeatherToday dayDatas={dayDatas} />
            <WeatherTime timeDatas={timeDatas} />
          </div>
        </div>
      </div>
    </>
  );
}
