/* eslint-disable @next/next/no-img-element */
"use client";
import "./poke.scss";
import axios from "axios";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useQueries } from "@tanstack/react-query";

export default function Page() {
  // 현재 날짜와 시간을 가져옵니다.
  const currentDate = dayjs().format("YYYY-MM-DD");

  // 로컬 스토리지에서 날짜와 포켓몬 정보를 가져옵니다.
  let localDate = localStorage.getItem("maro-date");
  let localPoke = localStorage.getItem("maro-poke");

  // 랜덤 포켓몬 번호를 생성합니다.
  function getRandomPoke() {
    return Math.floor(Math.random() * 500);
  }

  // 새로운 데이터를 설정합니다.
  function setNewData() {
    localDate = currentDate;
    localPoke = getRandomPoke().toString();
    localStorage.setItem("maro-date", localDate);
    localStorage.setItem("maro-poke", localPoke);
  }

  if (localDate && currentDate !== localDate) {
    setNewData();
  } else if (!localDate) {
    setNewData();
  }

  // 포켓몬 API에 대한 쿼리 ID 배열
  const queryIds = [
    `https://pokeapi.co/api/v2/pokemon/${localPoke}`,
    `https://pokeapi.co/api/v2/pokemon-species/${localPoke}`,
  ];

  // 쿼리 실행 및 결과 가져오기
  const results = useQueries({
    queries: queryIds.map((id) => ({
      queryKey: ["pokemon", id],
      queryFn: () => axios.get(id),
      staleTime: Infinity,
    })),
  });

  // 포켓몬 정보 및 종류 가져오기
  const pokemonData = results[0].data?.data;
  const speciesData = results[1].data?.data;

  // Loading 처리
  if (results[0].isPending || results[1].isPending) return "Loading...";

  // Loading 이후 데이터 적용
  const pokename = speciesData.names.find(
    (name: any) => name.language.name === "ko"
  ).name;

  const pokeGenus = speciesData.genera.find(
    (genera: any) => genera.language.name === "ko"
  ).genus;

  const pokeImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${localPoke}.png`;

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Poke</h3>
      <div className="poke">
        <p className="poke-title">오늘의 럭키 포켓몬</p>
        <div className="poke-box">
          <img className="poke-box-img" src={pokeImg} alt={pokename} />
          <p>{pokename}</p>
          <p>{pokeGenus}</p>
        </div>
      </div>
    </>
  );
}
