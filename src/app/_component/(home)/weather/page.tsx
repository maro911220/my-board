"use client";
import "@/styles/component/home/weather.scss";
import axios from "axios";
import { useGeolocation } from "@uidotdev/usehooks";
import { useQueries } from "@tanstack/react-query";
import { dayDatasProps, timeDatasProps } from "@/types/itemsType";
import { useCallback, useEffect, useState } from "react";
import Loading from "@/app/_component/Loading";
import WeatherTime from "./_component/weatherTime";
import WeatherToday from "./_component/weatherToday";

// 환경 변수에서 API_KEY 가져오기
const API_KEY = process.env.WEATHER;

// Weather 컴포넌트 정의
export default function Weather() {
  const [dayDatas, setDayDatas] = useState<dayDatasProps | null>(null);
  const [timeDatas, setTimeDatas] = useState<timeDatasProps[] | null>(null);

  // 현재 위치 가져오기
  const { latitude, longitude, error } = useGeolocation();

  // API 호출을 위한 URL 설정
  const urls = [
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`,
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
  ];

  // 날씨 데이터를 가져오기 위한 함수
  const fetchWeather = useCallback(
    async (url: any) => {
      const response = await axios.get(url);
      return response;
    },
    [latitude, longitude]
  );

  // API 호출 및 데이터 가져오기
  const results = useQueries({
    queries: urls?.map((url) => ({
      queryKey: ["weather", url],
      queryFn: () => fetchWeather(url),
      staleTime: Infinity,
      enabled: latitude != null,
    })),
  });

  // 기존 데이터 저장 방식을 변경.
  useEffect(() => {
    if (!results[0].isPending && !results[1].isPending) {
      const weatherDay = results[0].data?.data;
      const weatherTime = results[1].data?.data;
      console.log(weatherDay.sys.country);
      // 레이아웃 변경으로 데이터 추가 예정
      // day
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

      // time
      const fitTimeList = weatherTime.list.slice(3).slice(0, 10);
      const timeData = [
        ...fitTimeList.map((item: any) => {
          return {
            dayWeather: item.weather[0].main,
            temp: item.main.temp,
            day: item.dt_txt,
          };
        }),
      ];

      setDayDatas(dayData);
      setTimeDatas(timeData);
    }
  }, [results[0].isPending, results[1].isPending]);

  // 위치 정보 에러
  if (error) return <p>위치동의가 필요합니다.</p>;
  // 데이터 로딩중
  if (results[0].isLoading || results[1].isLoading) return <Loading />;

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
