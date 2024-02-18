"use client";
import "./header.scss";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { BsGearFill, BsFillLightbulbFill } from "react-icons/bs";
import { useEffect } from "react";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("ko"); // use locale

export default function Header() {
  const { setEdit, setTheme, checkTheme } = useStore(defaultStore);
  const editMode = () => {
    setEdit(true);
  };

  const modeToggle = () => {
    setTheme();
  };

  useEffect(() => {
    checkTheme();
  }, []);

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
