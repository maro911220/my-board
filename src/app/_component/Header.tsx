"use client";
import "./header.scss";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("ko"); // use locale

export default function Header() {
  return (
    <header className="header">
      <div className="header-con">
        <h1>Maro</h1>
        <p>{dayjs(new Date()).format("YYYY-MM-DD ddd")}</p>
        <div>
          <button>h</button>
          <button>b</button>
        </div>
      </div>
    </header>
  );
}
