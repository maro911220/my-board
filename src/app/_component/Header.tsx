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
import { motion, AnimatePresence } from "framer-motion";

// Day.js 플러그인 확장, 한국어 설정
dayjs.extend(isLeapYear);
dayjs.locale("ko");

export default function Header() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setEdit, setTheme, checkTheme } = useStore(defaultStore);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [dataList, setDataList] = useState<null | any[]>(null);

  // 편집 모드 활성화
  const editMode = () => setEdit(true);
  // 테바 변경
  const modeToggle = () => setTheme();
  // 모달 닫기
  const modalClose = () => {
    setPage(1);
    setModal(false);
    setDataList(null);
    setSearchData("");
  };

  // 검색
  const search = () => {
    const trimmedSearchData = searchData.trim();
    if (trimmedSearchData) {
      axios
        .get(`https://dapi.kakao.com/v2/search/web`, {
          params: { query: trimmedSearchData, size: 20, page },
          headers: {
            Authorization: "KakaoAK ddb4493be86f80bb366093fa2a1b3e3d",
          },
        })
        .then((res) => {
          setPage((prevPage: number) => prevPage + 1);
          if (!res.data.meta.is_end) {
            const newDocuments = res.data.documents;
            setDataList((prevDataList) =>
              prevDataList ? [...prevDataList, ...newDocuments] : newDocuments
            );
          } else {
            return;
          }
          // 모달이 열려있지 않으면 열기
          modal == false && setModal(true);
        });
    } else {
      // 검색어가 비어있는 경우 경고 표시 및 포커스
      alert("검색어를 입력해 주세요!");
      setSearchData("");
      inputRef.current?.focus();
    }
  };

  // 테마 체크
  useEffect(() => {
    checkTheme();
  }, []);

  // 엔터 키 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") search();
  };

  return (
    <header className={`header ${modal ? "active" : ""}`}>
      <div className="header-con">
        <h1 className="hidden">Maro</h1>
        <p className="header-title">Maro911220</p>
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
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Modal
              dataList={dataList}
              modalClose={modalClose}
              search={search}
              searchData={searchData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
