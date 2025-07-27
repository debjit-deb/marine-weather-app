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

export default function MarineChart({ data }: { data: any }) {
  if (!data || !data.hourly || !data.hourly.time) return null;

  const labels = data.hourly.time.map((t: string) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Wave Height (m)",
        data: data.hourly.wave_height || [],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
      },
      {
        label: "Wave Direction (°)",
        data: data.hourly.wave_direction || [],
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        fill: true,
      },
      {
        label: "Wind Wave Height (m)",
        data: data.hourly.wind_wave_height || [],
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        fill: true,
      },
      {
        label: "Wind Wave Direction (°)",
        data: data.hourly.wind_wave_direction || [],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
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
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Values" } },
    },
  };

  return (
    <Card className="mt-6 p-4 bg-white dark:bg-gray-900 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Hourly Marine Forecast</h2>
      <Line data={chartData} options={options} />
    </Card>
  );
}
