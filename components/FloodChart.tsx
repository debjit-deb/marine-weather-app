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
  ChartOptions,
} from "chart.js";
import { Card } from "../components/ui/card";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function FloodChart({ data }: { data: any }) {
  if (!data || !data.daily || !data.daily.time) return null;

  const labels = data.daily.time.map((t: string) =>
    new Date(t).toLocaleDateString()
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "River Discharge",
        data: data.daily.river_discharge || [],
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        fill: true,
      },
      {
        label: "Discharge Mean",
        data: data.daily.river_discharge_mean || [],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
      },
      {
        label: "Discharge Median",
        data: data.daily.river_discharge_median || [],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        fill: true,
      },
      {
        label: "Discharge Max",
        data: data.daily.river_discharge_max || [],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        fill: true,
      },
      {
        label: "Discharge Min",
        data: data.daily.river_discharge_min || [],
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.1)",
        fill: true,
      },
      {
        label: "Discharge P25",
        data: data.daily.river_discharge_p25 || [],
        borderColor: "teal",
        backgroundColor: "rgba(0, 128, 128, 0.1)",
        fill: true,
      },
      {
        label: "Discharge P75",
        data: data.daily.river_discharge_p75 || [],
        borderColor: "brown",
        backgroundColor: "rgba(165, 42, 42, 0.1)",
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Discharge (m³/s)" } },
    },
  };

  return (
    <Card className="mt-6 p-4 bg-white dark:bg-gray-900 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Daily River Discharge</h2>
      <Line data={chartData} options={options} />
    </Card>
  );
}
