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

export default function SatelliteRadiationChart({ data }: { data: any }) {
  if (!data || !data.hourly || !data.hourly.time) return null;

  const labels = data.hourly.time.map((t: string) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Shortwave Radiation",
        data: data.hourly.shortwave_radiation || [],
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        fill: true,
      },
      {
        label: "Direct Normal Irradiance",
        data: data.hourly.direct_normal_irradiance || [],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
      },
      {
        label: "Diffuse Radiation",
        data: data.hourly.diffuse_radiation || [],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        fill: true,
      },
      {
        label: "Terrestrial Radiation",
        data: data.hourly.terrestrial_radiation || [],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Radiation (W/m²)" } },
    },
  };

  return (
    <Card className="mt-6 p-4 bg-white dark:bg-gray-900 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Hourly Satellite Radiation</h2>
      <Line data={chartData} options={options} />
    </Card>
  );
}
