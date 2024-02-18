"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";

// ChartJS에 필요한 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

// Charts 컴포넌트 정의
export default function Charts({ fitTimeList }: { fitTimeList: any }) {
  // Zustand를 사용하여 테마 정보 가져오기
  // fitTimeList의 각 항목을 매핑하여 적절한 데이터로 변환
  const { theme } = useStore(defaultStore);
  const mappedData = fitTimeList.map((item: any) => ({
    temperature: item.main.temp,
    time: item.dt_txt.slice(-8).slice(0, 2) + "시",
  }));

  // 테마에 따라 틱과 그리드 색상 설정
  const ticksColor = theme == "dark" ? "#ccc" : "#333";
  const gridColor = theme == "dark" ? "#555" : "#ccc";

  // 차트 옵션 설정
  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  // 차트에 표시할 데이터 설정
  const data = {
    labels: mappedData.map((dataPoint: any) => dataPoint.time),
    datasets: [
      {
        label: "Temperature",
        data: mappedData.map((dataPoint: any) => dataPoint.temperature),
        borderColor: "#5D5AFF",
        backgroundColor: "#5D5AFF",
      },
    ],
  };

  // Line 차트 컴포넌트 반환
  return <Line options={options} data={data} />;
}
