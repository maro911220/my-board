/* eslint-disable @next/next/no-img-element */
"use client";
import "@/styles/component/home/poke.scss";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import Loading from "@/app/_component/Loading";
import { pokeProps, pokeStatProps } from "@/types/itemsType";

export default function Page() {
  // 현재 날짜와 시간을 가져옵니다.
  const currentDate = dayjs().format("YYYY-MM-DD");

  // 로컬 스토리지에서 날짜와 포켓몬 정보를 가져옵니다.
  let [localDate, setLocalDate] = useState<string | null>(
    localStorage.getItem("maro-date")
  );
  let [localPoke, setLocalPoke] = useState<string | null>(
    localStorage.getItem("maro-poke")
  );

  // 랜덤 포켓몬 번호를 생성합니다.
  function getRandomPoke() {
    return Math.floor(Math.random() * 750).toString();
  }

  // 새로운 데이터를 설정합니다.
  function setNewData() {
    let num = getRandomPoke();
    setLocalDate(currentDate);
    setLocalPoke(num);
    localStorage.setItem("maro-date", currentDate);
    localStorage.setItem("maro-poke", num);
  }

  useEffect(() => {
    if (!localDate || currentDate !== localDate) {
      setNewData();
    }
  }, []);

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
      enabled: localPoke != null,
    })),
  });

  // Loading 처리
  if (results[0].isPending || results[1].isPending) return <Loading />;
  if (results[0].error || results[1].error)
    return "포켓몬 정보를 불러오는데 실패했습니다.";

  // 포켓몬 정보 및 종류 가져오기
  const pokemonData = results[0].data?.data;
  const speciesData = results[1].data?.data;

  // Loading 이후 데이터 적용
  const findDataByLanguage = (data: any) =>
    data.find((item: any) => item.language.name === "ko");

  const listDatas: pokeProps = {
    title: pokemonData.title,
    id: pokemonData.id,
    height: pokemonData.height,
    weight: pokemonData.weight,
    pokeImg: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${localPoke}.png`,
    pokename: findDataByLanguage(speciesData.names).name,
    pokeGenus: findDataByLanguage(speciesData.genera).genus,
    pokeFlavor: findDataByLanguage(speciesData.flavor_text_entries).flavor_text,
  };

  return (
    <>
      <h3 className="text-xl font-bold uppercase leading-4 mb-4">Poke</h3>
      <div className="poke">
        <div className="poke-box">
          <p className="poke-title">오늘의 럭키 포켓몬</p>
          <div className="poke-main">
            <img
              className="poke-main-img"
              src={listDatas.pokeImg}
              alt={listDatas.pokename}
            />
            <div className="poke-main-detail">
              <p className="poke-main-detail__name">{listDatas.pokename}</p>
              <div>
                <p>No.{listDatas.id}</p>
                <p>{listDatas.pokeGenus}</p>
              </div>
              <div>
                <p>키 : {listDatas.height / 10}m</p>
                <p>무게 : {listDatas.weight / 10}KG</p>
              </div>
              <p className="poke-main-detail__flavor">{listDatas.pokeFlavor}</p>
            </div>
          </div>
        </div>
        <div className="poke-box type-stat">
          <p className="poke-title">포켓몬 능력치</p>
          <div className="poke-stat">
            {pokemonData.stats.map((item: pokeStatProps, index: number) => {
              const baseStatNames: { [key: string]: string } = {
                hp: "HP",
                attack: "공격",
                defense: "방어",
                "special-attack": "특수공격",
                "special-defense": "특수방어",
                speed: "스피드",
              };
              const baseStat = baseStatNames[item.stat.name];

              return (
                <div key={index} className="poke-stat-item">
                  <p className="poke-stat-name">{baseStat}</p>
                  <div className="poke-stat-box">
                    <span>{item.base_stat}</span>
                    <div className="poke-stat-bar">
                      <span
                        style={{ width: (item.base_stat / 255) * 100 + "%" }}
                      >
                        {item.base_stat}
                      </span>
                    </div>
                    <span>255</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
