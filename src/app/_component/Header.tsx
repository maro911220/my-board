"use client";
import "./header.scss";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { BsGearFill, BsFillLightbulbFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from "./Modal";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("ko"); // use locale

export default function Header() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setEdit, setTheme, checkTheme } = useStore(defaultStore);
  const [searchData, setSearchData] = useState("");
  const [modal, setModal] = useState(false);
  const [dataList, setDataList] = useState(null);
  const editMode = () => {
    setEdit(true);
  };

  const modeToggle = () => {
    setTheme();
  };

  const search = () => {
    var blank_pattern = /^\s+|\s+$/g;
    if (searchData.replace(blank_pattern, "") != "") {
      axios(`https://dapi.kakao.com/v2/search/web?query=${searchData}&size=5`, {
        headers: {
          Authorization: "KakaoAK ddb4493be86f80bb366093fa2a1b3e3d",
        },
      }).then((res) => {
        console.log(res);
        setDataList(res.data);
        setModal(true);
      });
    } else {
      alert("검색어를 입력해주세요!");
      setSearchData("");
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    checkTheme();
  }, []);

  return (
    <header className="header">
      <div className="header-con">
        <h1 className="hidden">Maro</h1>
        <p className="header-title">Maro911220</p>
        <div className="header-search">
          <input
            ref={inputRef}
            type="text"
            className="header-search-input"
            placeholder="검색어를 입력해주세요"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
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
      {modal && <Modal dataList={dataList} />}
    </header>
  );
}
