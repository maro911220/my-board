"use client";
import "./header.scss";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { BsGearFill, BsFillLightbulbFill } from "react-icons/bs";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("ko"); // use locale

export default function Header() {
  const { setEdit } = useStore(defaultStore);
  const editMode = () => {
    setEdit(true);
  };

  const modeToggle = () => {
    let theme = localStorage.getItem("theme");
    let beforeTheme: any = theme;
    theme = theme == "light" ? "dark" : "light";
    document.documentElement.classList.replace(beforeTheme, theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <header className="header">
      <div className="header-con">
        <h1 className="hidden">Maro</h1>
        <p className="header-date">
          {dayjs(new Date()).format("YYYY-MM-DD (ddd)")}
        </p>
        <div className="header-btn">
          <button onClick={() => editMode()}>
            <BsGearFill />
          </button>
          <button onClick={() => modeToggle()}>
            <BsFillLightbulbFill />
          </button>
        </div>
      </div>
    </header>
  );
}
