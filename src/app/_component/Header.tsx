"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { BsGearFill, BsFillLightbulbFill } from "react-icons/bs";
import "@/styles/component/header.scss";

// Day.js 플러그인 확장, 한국어 설정
dayjs.extend(isLeapYear);
dayjs.locale("ko");

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setEdit, setTheme, checkTheme } = useStore(defaultStore);
  const [searchData, setSearchData] = useState("");

  // 편집 모드 활성화
  const editMode = () => setEdit(true);
  // 테바 변경
  const modeToggle = () => setTheme();
  // 검색
  const search = () => {
    const trimmedSearchData = searchData.trim();
    if (!trimmedSearchData) {
      alert("검색어를 입력해 주세요!");
      inputRef.current?.focus();
      setSearchData("");
    } else {
      router.push(`/search/${searchData}`);
    }
  };

  // 테마 체크
  useEffect(() => {
    checkTheme();
  }, []);

  // 페이지 체크
  useEffect(() => {
    pathname === "/" && setSearchData("");
  }, [pathname]);

  // 엔터 키 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && search();
  };

  return (
    <header className="header">
      <div className="header-con">
        <h1 className="hidden">Maro</h1>
        <Link className="header-title" href="/">
          Maro911220
        </Link>
        <div className="header-search">
          <input
            ref={inputRef}
            type="text"
            className="header-search-input"
            placeholder="검색어를 입력해 주세요."
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <button className="header-search-btn" onClick={() => search()}>
            검색
          </button>
        </div>
        <div className="header-btn">
          <button onClick={editMode}>
            <BsGearFill />
          </button>
          <button onClick={modeToggle}>
            <BsFillLightbulbFill />
          </button>
        </div>
      </div>
    </header>
  );
}
