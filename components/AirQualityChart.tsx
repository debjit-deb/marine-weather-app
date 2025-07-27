import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AirQualityChartProps {
  data: {
    time: string[];
    pm10: (number | null)[];
    pm2_5: (number | null)[];
  };
}

const AirQualityChart: React.FC<AirQualityChartProps> = ({ data }) => {
  const labels = data.time.map((t) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "PM10 (μg/m³)",
        data: data.pm10,
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "PM2.5 (μg/m³)",
        data: data.pm2_5,
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        fill: true,
        tension: 0.4,
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
      y: { title: { display: true, text: "Concentration (μg/m³)" } },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Air Quality Forecast</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AirQualityChart;
