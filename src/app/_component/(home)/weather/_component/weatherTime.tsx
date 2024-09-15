import Charts from "./chart";
import WeatherIcon from "./weatherIcon";
import { timeDatasProps } from "@/types/itemsType";

export default function WeatherTime({
  timeDatas,
}: {
  timeDatas: timeDatasProps[] | null;
}) {
  return (
    <div className="weather-time">
      {timeDatas && (
        <div className="weather-time__con">
          <Charts fitTimeList={timeDatas} />
          <div className="weather-time__icon">
            {timeDatas.map((item: any, index: number) => (
              <WeatherIcon
                key={index}
                classes={false}
                weather={item.dayWeather}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
