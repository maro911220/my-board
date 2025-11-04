"use client";
import "@/styles/component/home/weather.scss";
import axios from "axios";
import { useGeolocation } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import { dayDatasProps, timeDatasProps } from "@/types/itemsType";
import { useEffect, useState, useRef } from "react";
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

  // WeatherAPI.com - 한 번의 호출로 현재 날씨 + 예보 모두 가져옴
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["weather", fixedLat, fixedLon],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${fixedLat},${fixedLon}&days=2&aqi=no&alerts=no`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10분
    enabled: fixedLat != null && fixedLon != null,
  });

  useEffect(() => {
    if (data) {
      console.log("WeatherAPI 응답:", data);

      const current = data.current;
      const today = data.forecast.forecastday[0];
      const hourly = data.forecast.forecastday[0].hour;

      // 오늘 날씨 데이터
      const dayData: dayDatasProps = {
        dayWeather: current.condition.text, // 날씨 상태 (한글)
        rain: current.precip_mm > 0 ? { "1h": current.precip_mm } : undefined,
        country: data.location.country,
        temps: [
          { name: "평균", value: Math.round(today.day.avgtemp_c * 10) / 10 },
          { name: "체감", value: Math.round(current.feelslike_c * 10) / 10 },
          { name: "최저", value: Math.round(today.day.mintemp_c * 10) / 10 },
          { name: "최고", value: Math.round(today.day.maxtemp_c * 10) / 10 },
        ],
      };

      // 현재 시간 이후 10개의 시간별 예보 (3시간 간격)
      const currentHour = new Date().getHours();
      const filteredHourly = hourly
        .filter((item: any) => {
          const hour = new Date(item.time).getHours();
          return hour >= currentHour;
        })
        .filter((_: any, index: number) => index % 3 === 0) // 3시간 간격
        .slice(0, 10);

      const timeData: timeDatasProps[] = filteredHourly.map((item: any) => ({
        dayWeather: item.condition.text,
        temp: Math.round(item.temp_c * 10) / 10,
        day: item.time.split(" ")[1].slice(0, 2) + "시", // "15:00" → "15시"
      }));

      setDayDatas(dayData);
      setTimeDatas(timeData);
    }
  }, [data]);

  if (error) return <p>위치동의가 필요합니다.</p>;
  if (isLoading || isPending || !dayDatas || !timeDatas) return <Loading />;

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
