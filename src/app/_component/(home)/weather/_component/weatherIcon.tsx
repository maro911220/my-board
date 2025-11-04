/* eslint-disable @next/next/no-img-element */

// WeatherAPI.com 한글 텍스트 → 아이콘 매핑
const weatherDescriptions: Record<string, { name: string; icon: string }> = {
  // 맑음
  맑음: { name: "맑음", icon: "sun" },
  Sunny: { name: "맑음", icon: "sun" },
  Clear: { name: "맑음", icon: "sun" },

  // 구름
  구름조금: { name: "구름 조금", icon: "cloud" },
  "Partly cloudy": { name: "구름 조금", icon: "cloud" },
  구름많음: { name: "구름", icon: "cloud" },
  Cloudy: { name: "구름", icon: "cloud" },
  흐림: { name: "흐림", icon: "cloudy-qusts" },
  Overcast: { name: "흐림", icon: "cloudy-qusts" },

  // 안개
  안개: { name: "안개", icon: "cloudy-qusts" },
  Mist: { name: "안개", icon: "cloudy-qusts" },
  Fog: { name: "안개", icon: "cloudy-qusts" },

  // 비
  "약한 비": { name: "이슬비", icon: "rain" },
  "Patchy rain possible": { name: "비 가능", icon: "rain" },
  "Light rain": { name: "약한 비", icon: "rain" },
  "Moderate rain": { name: "비", icon: "rain" },
  "Heavy rain": { name: "강한 비", icon: "rain" },
  비: { name: "비", icon: "rain" },
  Rain: { name: "비", icon: "rain" },
  이슬비: { name: "이슬비", icon: "rain" },
  Drizzle: { name: "이슬비", icon: "rain" },

  // 눈
  눈: { name: "눈", icon: "snow" },
  Snow: { name: "눈", icon: "snow" },
  "Light snow": { name: "약한 눈", icon: "snow" },
  "Heavy snow": { name: "강한 눈", icon: "snow" },

  // 뇌우
  뇌우: { name: "뇌우", icon: "thunder" },
  Thunderstorm: { name: "뇌우", icon: "thunder" },
  "Thundery outbreaks possible": { name: "뇌우 가능", icon: "thunder" },
};

export default function WeatherIcon({
  weather,
  classes,
}: {
  weather: string;
  classes: Boolean;
}) {
  // 매핑되지 않은 날씨는 기본값 사용
  const weatherInfo = weatherDescriptions[weather] || {
    name: weather,
    icon: "sun",
  };

  return (
    <img
      width={classes ? "" : 20}
      height={classes ? "" : 20}
      className={classes ? "weather-today-img" : ""}
      src={`/img/weather/${weatherInfo.icon}.svg`}
      alt={weatherInfo.name}
    />
  );
}
