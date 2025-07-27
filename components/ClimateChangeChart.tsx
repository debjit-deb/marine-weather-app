"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Card } from "../components/ui/card";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function ClimateChangeChart({ data }: { data: any }) {
  if (!data || !data.daily || !data.daily.time) return null;

  const labels = data.daily.time.map((t: string) =>
    new Date(t).toLocaleDateString()
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "CMCC_CM2_VHR4",
        data: data.daily.temperature_2m_mean_CMCC_CM2_VHR4 || [],
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        fill: true,
      },
      {
        label: "FGOALS_f3_H",
        data: data.daily.temperature_2m_mean_FGOALS_f3_H || [],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
      },
      {
        label: "HiRAM_SIT_HR",
        data: data.daily.temperature_2m_mean_HiRAM_SIT_HR || [],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        fill: true,
      },
      {
        label: "MRI_AGCM3_2_S",
        data: data.daily.temperature_2m_mean_MRI_AGCM3_2_S || [],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        fill: true,
      },
      {
        label: "EC_Earth3P_HR",
        data: data.daily.temperature_2m_mean_EC_Earth3P_HR || [],
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.1)",
        fill: true,
      },
      {
        label: "MPI_ESM1_2_XR",
        data: data.daily.temperature_2m_mean_MPI_ESM1_2_XR || [],
        borderColor: "teal",
        backgroundColor: "rgba(0, 128, 128, 0.1)",
        fill: true,
      },
      {
        label: "NICAM16_8S",
        data: data.daily.temperature_2m_mean_NICAM16_8S || [],
        borderColor: "brown",
        backgroundColor: "rgba(165, 42, 42, 0.1)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Temperature (°C)" } },
    },
  };

  return (
    <Card className="mt-6 p-4 bg-white dark:bg-gray-900 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Climate Model Temperature Trends</h2>
      <Line data={chartData} options={options} />
    </Card>
  );
}