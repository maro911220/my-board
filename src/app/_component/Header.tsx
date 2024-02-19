"use client";
import "./header.scss";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { BsGearFill, BsFillLightbulbFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("ko"); // use locale

export default function Header() {
  const { setEdit, setTheme } = useStore(defaultStore);
  const [searchData, setSearchData] = useState("");
  const editMode = () => {
    setEdit(true);
  };

  const modeToggle = () => {
    setTheme();
  };

  const search = () => {
    if (searchData != "") {
      axios(`https://dapi.kakao.com/v2/search/web?query=${searchData}`, {
        headers: {
          Authorization: "KakaoAK ddb4493be86f80bb366093fa2a1b3e3d",
        },
      }).then((res) => {
        console.log(res);
      });
    } else {
      alert("검색어를 입력해주세요!");
    }
  };

  return (
    <header className="header">
      <div className="header-con">
        <h1 className="hidden">Maro</h1>
        <p className="header-date">
          {dayjs(new Date()).format("YYYY-MM-DD (ddd)")}
        </p>
        <div className="header-search">
          <input
            type="text"
            className="header-search-input"
            placeholder="검색어를 입력해주세요"
            defaultValue={searchData}
            onChange={(e) => {
              setSearchData(e.target.value);
              console.log(searchData);
            }}
          />
          <button className="header-search-btn" onClick={() => search()}>
            클릭
          </button>
        </div>
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
