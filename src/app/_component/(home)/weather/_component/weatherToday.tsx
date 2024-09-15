import WeatherIcon from "./weatherIcon";
import { dayDatasProps } from "@/types/itemsType";

export default function WeatherToday({
  dayDatas,
}: {
  dayDatas: dayDatasProps | null;
}) {
  return (
    <div className="weather-today-box">
      {dayDatas && (
        <>
          <div className="weather-today-box__img">
            <WeatherIcon weather={dayDatas.dayWeather} classes={true} />
            <p className="weather-today-box__country">{dayDatas.country}</p>
          </div>
          <div className="weather-today-box__con">
            {dayDatas.temps.map((item, index) => (
              <div key={index} className="weather-today-box__item">
                <span>{item.name}</span>
                <span
                  className={
                    item.name == "최저"
                      ? "text-blue-500"
                      : item.name == "최고"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {item.value.toFixed(1)}°
                </span>
              </div>
            ))}
            <div className="weather-today-box__item col-span-2">
              <span>예상 강수량</span>
              <span className="text-sky-500">
                {dayDatas.rain == null ? 0 : dayDatas.rain["1h"].toFixed(0)}
                mm
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
