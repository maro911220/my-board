/* eslint-disable @next/next/no-img-element */
"use client";
import "@/styles/component/home/weather.scss";
import axios from "axios";
import dayjs from "dayjs";
import { useGeolocation } from "@uidotdev/usehooks";
import { useQueries } from "@tanstack/react-query";
import Charts from "./_component/chart";
import Loading from "@/app/_component/Loading";

// 날씨 상태에 따른 정보 객체
const weatherDescriptions: any = {
  Clouds: { name: "구름", icon: "cloud" },
  Clear: { name: "맑음", icon: "sun" },
  Atmosphere: { name: "흐림", icon: "cloudy-qusts" },
  Snow: { name: "눈", icon: "snow" },
  Rain: { name: "비", icon: "rain" },
  Drizzle: { name: "이슬비", icon: "rain" },
  Thunderstorm: { name: "뇌우", icon: "thunder" },
};
const API_KEY = process.env.WEATHER;

// Weather 컴포넌트 정의
export default function Weather() {
  // 현재 위치 가져오기
  const { latitude, longitude, error, loading } = useGeolocation();
  // API 호출을 위한 URL 설정
  const ids = [
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`,
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
  ];

  // API 호출 및 데이터 가져오기
  const results = useQueries({
    queries: ids?.map((id) => ({
      queryKey: ["weather", id],
      queryFn: () => axios.get(id),
      staleTime: Infinity,
      enabled: latitude != null,
    })),
  });

  // 위치 정보 에러
  if (error) return <p>위치동의가 필요합니다.</p>;
  // API 데이터 로딩
  if (results[0].isPending || results[1].isPending) return <Loading />;
  const weatherDay = results[0].data?.data;
  const weatherTime = results[1].data?.data;

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Weather</h3>
      <div className="weather">
        <Days weatherDay={weatherDay} weatherTime={weatherTime} />
      </div>
    </>
  );
}

// 날씨 정보 출력 컴포넌트
function Days({
  weatherDay,
  weatherTime,
}: {
  weatherDay: any;
  weatherTime: any;
}) {
  // 날씨 아이콘을 렌더링 함수
  const renderWeatherIcon = (weather: string, classes: Boolean, index: any) => (
    <img
      key={index && index}
      width={classes ? "" : 20}
      height={classes ? "" : 20}
      className={classes ? "weather-today-img" : ""}
      src={`/img/weather/${weatherDescriptions[weather].icon}.svg`}
      alt={weatherDescriptions[weather].name}
    />
  );

  // 주간 날씨 정보 렌더링
  const renderWeatherForecast = () => {
    return weatherDay.daily.slice(1).map((day: any, index: number) => (
      <div className="weather-week-item" key={index}>
        <div className="weather-week-day">
          {renderWeatherIcon(day.weather[0].main, false, null)}
          <p>
            {dayjs()
              .add(index + 1, "day")
              .format("YYYY-MM-DD (ddd)")}
          </p>
        </div>
        <div className="weather-week-temp">
          <p>
            최저 <span>{day.temp.min.toFixed(1)}°</span>
          </p>
          <p>
            최고 <span>{day.temp.max.toFixed(1)}°</span>
          </p>
        </div>
      </div>
    ));
  };

  // 오늘 날씨 정보 렌더링
  const renderWeatherToday = () => {
    const dayItem = weatherDay.daily[0];
    return (
      <div className="weather-today-box">
        <div className="flex items-center">
          {renderWeatherIcon(dayItem.weather[0].main, true, null)}
          <p className="weather-today-temp">
            {parseFloat(dayItem.temp.day).toFixed(1)}°
            <span className="weather-today-name">
              {dayItem.weather[0].main}
            </span>
          </p>
        </div>

        <div>
          <div className="weather-today-box__con">
            <p className="weather-today-temp__min">
              <span>{parseFloat(dayItem.temp.min).toFixed(1)}°</span>
            </p>
            <p>/</p>
            <p className="weather-today-temp__max">
              <span>{parseFloat(dayItem.temp.max).toFixed(1)}°</span>
            </p>
          </div>
          <p className="weather-today-rain">
            예상 강수량
            <span>
              {dayItem.rain == null ? 0 : parseFloat(dayItem.rain).toFixed(0)}
              mm
            </span>
          </p>
        </div>
      </div>
    );
  };

  // 시간별 날씨 정보 렌더링
  const renderWeatherTime = () => {
    const fitTimeList = weatherTime.list.slice(3).slice(0, 5);
    return (
      <div className="weather-time">
        <Charts fitTimeList={fitTimeList} />
        <div className="weather-time__icon">
          {fitTimeList.map((item: any, index: number) => {
            return renderWeatherIcon(item.weather[0].main, false, index);
          })}
        </div>
      </div>
    );
  };

  // 화면에 날씨 정보 출력
  return (
    <>
      <div className="weather-today">
        <p className="weather-title">오늘 날씨</p>
        <div className="weather-today-con">
          {renderWeatherToday()}
          {renderWeatherTime()}
        </div>
      </div>

      <div className="weather-week">
        <p className="weather-title">주간 날씨</p>
        <div className="weather-week-box">{renderWeatherForecast()}</div>
      </div>
    </>
  );
}
