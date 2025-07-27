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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

interface WeatherChartProps {
  data: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
  };
}

export default function WeatherChart({ data }: WeatherChartProps) {
  const chartData = {
    labels: data.time,
    datasets: [
      {
        label: "Max Temp (°C)",
        data: data.temperature_2m_max,
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      {
        label: "Min Temp (°C)",
        data: data.temperature_2m_min,
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
      {
        label: "UV Index",
        data: data.uv_index_max,
        borderColor: "orange",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: false,
      },
      {
        label: "Weather Code",
        data: data.weather_code,
        borderColor: "green",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Values" } },
    },
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-900 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4 text-center">7-Day Weather Forecast</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}