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

// constants
const API_KEY = process.env.WEATHER;
const CACHE_KEY = "weather_cache";
const LOCATION_KEY = "weather_location";
const CACHE_DURATION = 1000 * 60 * 60 * 3;

// localStorage
const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem(LOCATION_KEY);
    if (!cached) return null;

    const { lat, lon, timestamp } = JSON.parse(cached);

    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(LOCATION_KEY);
      return null;
    }

    return { lat, lon };
  } catch (error) {
    return null;
  }
};

const setCachedLocation = (lat: number, lon: number) => {
  try {
    localStorage.setItem(
      LOCATION_KEY,
      JSON.stringify({ lat, lon, timestamp: Date.now() })
    );
  } catch (error) {
    console.error("위치 캐시 저장 실패:", error);
  }
};

const getCachedWeather = (lat: number, lon: number) => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp, location, cacheDate } = JSON.parse(cached);
    const todayDate = new Date().toISOString().split("T")[0];

    if (location.lat !== lat || location.lon !== lon) return null;

    if (cacheDate !== todayDate) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error("캐시 읽기 실패:", error);
    return null;
  }
};

const setCachedWeather = (data: any, lat: number, lon: number) => {
  try {
    const todayDate = new Date().toISOString().split("T")[0];

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
        location: { lat, lon },
        cacheDate: todayDate,
      })
    );
  } catch (error) {
    console.error("캐시 저장 실패:", error);
  }
};

// Weather
export default function Weather() {
  const [dayDatas, setDayDatas] = useState<dayDatasProps | null>(null);
  const [timeDatas, setTimeDatas] = useState<timeDatasProps[] | null>(null);
  const locationRef = useRef<{ lat: number; lon: number } | null>(null);
  const cachedLocation = getCachedLocation();

  if (cachedLocation && !locationRef.current) {
    locationRef.current = cachedLocation;
  }

  const { latitude, longitude, error } = useGeolocation();

  // 경도,위도
  useEffect(() => {
    if (latitude != null && longitude != null) {
      const newLocation = {
        lat: Math.round(latitude * 10000) / 10000,
        lon: Math.round(longitude * 10000) / 10000,
      };

      // 위치가 변경되었을 때만 업데이트
      if (
        !locationRef.current ||
        locationRef.current.lat !== newLocation.lat ||
        locationRef.current.lon !== newLocation.lon
      ) {
        locationRef.current = newLocation;
        setCachedLocation(newLocation.lat, newLocation.lon);
        console.log("📍 새 위치 저장:", newLocation);
      }
    }
  }, [latitude, longitude]);

  const fixedLat = locationRef.current?.lat;
  const fixedLon = locationRef.current?.lon;

  // WeatherAPI
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["weather", fixedLat, fixedLon],
    queryFn: async () => {
      const cached = getCachedWeather(fixedLat!, fixedLon!);

      if (cached) return cached;

      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${fixedLat},${fixedLon}&days=2&aqi=no&alerts=no`
      );

      setCachedWeather(response.data, fixedLat!, fixedLon!);

      return response.data;
    },
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION,
    enabled: fixedLat != null && fixedLon != null,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data) {
      const current = data.current;
      const today = data.forecast.forecastday[0];
      const hourly = data.forecast.forecastday[0].hour;

      // 오늘 날씨 데이터
      const dayData: dayDatasProps = {
        dayWeather: current.condition.text,
        rain: current.precip_mm > 0 ? { "1h": current.precip_mm } : undefined,
        country: data.location.country,
        temps: [
          { name: "평균", value: Math.round(today.day.avgtemp_c * 10) / 10 },
          { name: "체감", value: Math.round(current.feelslike_c * 10) / 10 },
          { name: "최저", value: Math.round(today.day.mintemp_c * 10) / 10 },
          { name: "최고", value: Math.round(today.day.maxtemp_c * 10) / 10 },
        ],
      };

      // 오늘 + 내일 시간별 예보 데이터 합치기
      const tomorrow = data.forecast.forecastday[1];
      const allHourly = [...hourly, ...(tomorrow?.hour || [])];

      // 현재 시간 이후 30개 추출
      const currentTime = new Date().getTime();
      const filteredHourly = allHourly
        .filter((item: any) => new Date(item.time).getTime() > currentTime)
        .filter((_: any, index: number) => index % 3 === 0) // 3시간 간격
        .slice(0, 8);

      const timeData: timeDatasProps[] = filteredHourly.map((item: any) => ({
        dayWeather: item.condition.text,
        temp: Math.round(item.temp_c * 10) / 10,
        day: item.time.split(" ")[1].slice(0, 2) + "시",
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
