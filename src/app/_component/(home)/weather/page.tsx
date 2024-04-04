/* eslint-disable @next/next/no-img-element */
"use client";
import "@/styles/component/home/weather.scss";
import axios from "axios";
import dayjs from "dayjs";
import { useGeolocation } from "@uidotdev/usehooks";
import { useQueries } from "@tanstack/react-query";
import Charts from "./_component/chart";
import Loading from "@/app/_component/Loading";
import { dayDatasProps, timeDatasProps } from "@/types/itemsType";

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
  const { latitude, longitude, error } = useGeolocation();
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
  if (results[0].isError || results[1].isError)
    return "날씨 정보를 불러오는데 실패했습니다.";

  // 불러온 데이터에서 필요한 데이터 정리
  const weatherDay = results[0].data?.data;
  const weatherTime = results[1].data?.data;

  // 일간 데이터
  const dayDatas = [
    ...weatherDay.daily.map((item: any) => {
      return {
        dayWeather: item.weather[0].main,
        temp_min: item.temp.min,
        temp_max: item.temp.max,
        temp: item.temp.day,
        rain: item.temp.rain,
      };
    }),
  ];

  // 시간 데이터
  const fitTimeList = weatherTime.list.slice(3).slice(0, 5);
  const timeDatas = [
    ...fitTimeList.map((item: any) => {
      return {
        dayWeather: item.weather[0].main,
        temp: item.main.temp,
        day: item.dt_txt,
      };
    }),
  ];

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Weather</h3>
      <div className="weather">
        <Days dayDatas={dayDatas} timeDatas={timeDatas} />
      </div>
    </>
  );
}

// 날씨 정보 출력 컴포넌트
function Days({
  dayDatas,
  timeDatas,
}: {
  dayDatas: dayDatasProps[];
  timeDatas: timeDatasProps[];
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
    return dayDatas.slice(1).map((day: dayDatasProps, index: number) => (
      <div className="weather-week-item" key={index}>
        <div className="weather-week-day">
          {renderWeatherIcon(day.dayWeather, false, null)}
          <p>
            {dayjs()
              .add(index + 1, "day")
              .format("YYYY-MM-DD (ddd)")}
          </p>
        </div>
        <div className="weather-week-temp">
          <p>
            최저 <span>{day.temp_min.toFixed(1)}°</span>
          </p>
          <p>
            최고 <span>{day.temp_max.toFixed(1)}°</span>
          </p>
        </div>
      </div>
    ));
  };

  // 오늘 날씨 정보 렌더링
  const renderWeatherToday = () => {
    const dayItem = dayDatas[0];
    return (
      <div className="weather-today-box">
        <div className="flex items-center">
          {renderWeatherIcon(dayItem.dayWeather, true, null)}
          <p className="weather-today-temp">
            {dayItem.temp.toFixed(1)}°
            <span className="weather-today-name">{dayItem.dayWeather}</span>
          </p>
        </div>

        <div>
          <div className="weather-today-box__con">
            <p className="weather-today-temp__min">
              <span>{dayItem.temp_min.toFixed(1)}°</span>
            </p>
            <p>/</p>
            <p className="weather-today-temp__max">
              <span>{dayItem.temp_max.toFixed(1)}°</span>
            </p>
          </div>
          <p className="weather-today-rain">
            예상 강수량
            <span>
              {dayItem.rain == null ? 0 : dayItem.rain.toFixed(0)}
              mm
            </span>
          </p>
        </div>
      </div>
    );
  };

  // 시간별 날씨 정보 렌더링
  const renderWeatherTime = () => {
    return (
      <div className="weather-time">
        <Charts fitTimeList={timeDatas} />
        <div className="weather-time__icon">
          {timeDatas.map((item: any, index: number) => {
            return renderWeatherIcon(item.dayWeather, false, index);
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
