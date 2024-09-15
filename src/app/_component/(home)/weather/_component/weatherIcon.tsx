/* eslint-disable @next/next/no-img-element */
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

export default function WeatherIcon({
  weather,
  classes,
}: {
  weather: string;
  classes: Boolean;
}) {
  return (
    <img
      width={classes ? "" : 20}
      height={classes ? "" : 20}
      className={classes ? "weather-today-img" : ""}
      src={`/img/weather/${weatherDescriptions[weather].icon}.svg`}
      alt={weatherDescriptions[weather].name}
    />
  );
}
