"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useStore } from "zustand";
import { defaultStore } from "@/store/store";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { timeDatasProps } from "@/types/itemsType";

// ChartJS에 필요한 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels
);

// Charts 컴포넌트 정의
export default function Charts({
  fitTimeList,
}: {
  fitTimeList: timeDatasProps[];
}) {
  // Zustand를 사용하여 테마 정보 가져오기
  // fitTimeList의 각 항목을 매핑하여 적절한 데이터로 변환
  const { theme } = useStore(defaultStore);
  const mappedData = fitTimeList.map((item: any) => ({
    temperature: item.temp,
    time: item.day.slice(-8).slice(0, 2) + "시",
  }));

  // 테마에 따라 틱 색상 설정
  const ticksColor = theme != "dark" ? "#333" : "#ccc";

  // 차트 옵션 설정
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: ticksColor,
        offset: -20,
        formatter: (value: number) => {
          return value.toFixed(1) + "°";
        },
        anchor: "end",
        align: "start",
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
    scales: {
      y: {
        ticks: {
          color: "transparent",
        },
        grid: {
          color: "transparent",
        },
        border: {
          color: "transparent",
        },
      },
      x: {
        ticks: {
          color: ticksColor,
        },
        grid: { color: "transparent" },
        border: {
          color: "rgba(93,90,255,1)",
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
        borderColor: "rgba(93,90,255,1)",
        borderWidth: 1,
        backgroundColor: (context: any) => {
          if (!context.chart.chartArea) return;
          const {
            ctx,
            chartArea: { top, bottom },
          } = context.chart;
          const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
          gradientBg.addColorStop(0, "rgba(93,90,255,1)");
          gradientBg.addColorStop(0.5, "rgba(93,90,255,0.5)");
          gradientBg.addColorStop(1, "rgba(93,90,255,0.2)");
          return gradientBg;
        },
        fill: true,
      },
    ],
  };

  // Line 차트 컴포넌트 반환
  return <Line options={options} data={data} />;
}
