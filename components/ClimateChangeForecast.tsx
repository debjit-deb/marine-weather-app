
"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import dynamic from "next/dynamic";
import { searchLocations, getClimateChangeData } from "../lib/api";
import ClimateChangeChart from "../components/ClimateChangeChart";

const MapPoint = dynamic(() => import("./MapPoint"), { ssr: false });

export default function ClimateChangeForecast() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [climateData, setClimateData] = useState<any | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setClimateData(null);
    setShowMap(false);
    try {
      const data = await searchLocations(query);
      setResults(data.results || []);
    } catch {
      setError("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLocationSelect(loc: any) {
    setDataLoading(true);
    setClimateData(null);
    setShowMap(false);
    try {
      const data = await getClimateChangeData(loc.latitude, loc.longitude);
      setClimateData({ ...data, location: loc });
    } catch (err: any) {
      setError(err.message || "Failed to fetch climate change data.");
    } finally {
      setDataLoading(false);
    }
  }

  const renderCard = (label: string, value: any, color: string) => (
    <Card className={`p-4 bg-${color}-100 dark:bg-${color}-800`}>
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</div>
      <div className="text-lg font-semibold text-gray-800 dark:text-white">
        {value ?? "No Data Found"}
      </div>
    </Card>
  );

  const average = (arr: number[] | undefined): string => {
    if (!arr || arr.length === 0) return "No Data";
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length).toFixed(2);
  };

  return (
    <Card className="w-full max-w-xl p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-2">Climate Change Forecast</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!climateData ? (
        <ul className="mt-4 space-y-2">
          {loading &&
            [...Array(3)].map((_, i) => (
              <li key={i}>
                <Skeleton className="h-6 w-full rounded" />
              </li>
            ))}
          {!loading && results.length === 0 && !error && (
            <li className="text-gray-500">No locations found.</li>
          )}
          {!loading &&
            results.map((loc: any) => (
              <li
                key={loc.id || loc.name || loc.label}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 cursor-pointer"
                onClick={() => handleLocationSelect(loc)}
              >
                <span className="font-semibold">{loc.name || loc.label}</span>
                {loc.country && <span className="ml-2 text-gray-500">{loc.country}</span>}
                {loc.latitude && loc.longitude && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({loc.latitude}, {loc.longitude})
                  </span>
                )}
              </li>
            ))}
          {dataLoading && (
            <div className="mt-4">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          )}
        </ul>
      ) : (
        <>
          <Card className="mt-4 p-4 bg-green-50 dark:bg-green-900">
            <div className="font-bold mb-2">Climate Change Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderCard("Latitude", climateData.latitude, "blue")}
              {renderCard("Longitude", climateData.longitude, "green")}
              {renderCard("Timezone", climateData.timezone, "yellow")}
              {renderCard("Elevation", `${climateData.elevation} m`, "purple")}
              {renderCard("Temp Mean CMCC", `${average(climateData.daily?.temperature_2m_mean_CMCC_CM2_VHR4)} °C`, "orange")}
              {renderCard("Wind Mean CMCC", `${average(climateData.daily?.wind_speed_10m_mean_CMCC_CM2_VHR4)} km/h`, "pink")}
              {renderCard("Cloud Cover CMCC", `${average(climateData.daily?.cloud_cover_mean_CMCC_CM2_VHR4)} %`, "teal")}
              {renderCard("Humidity CMCC", `${average(climateData.daily?.relative_humidity_2m_mean_CMCC_CM2_VHR4)} %`, "cyan")}
              {renderCard("Temp Mean FGOALS", `${average(climateData.daily?.temperature_2m_mean_FGOALS_f3_H)} °C`, "lime")}
              {renderCard("Wind Mean FGOALS", `${average(climateData.daily?.wind_speed_10m_mean_FGOALS_f3_H)} km/h`, "rose")}
              {renderCard("Cloud Cover FGOALS", `${average(climateData.daily?.cloud_cover_mean_FGOALS_f3_H)} %`, "violet")}
              {renderCard("Humidity FGOALS", `${average(climateData.daily?.relative_humidity_2m_mean_FGOALS_f3_H)} %`, "amber")}
            </div>
          </Card>

          <ClimateChangeChart data={climateData} />

          <div className="mt-4 text-center">
            <a
              href={`https://open-meteo.com/en/docs/climate-api?latitude=${climateData.latitude}&longitude=${climateData.longitude}&start_date=2020-01-01&end_date=2035-12-31&models=CMCC_CM2_VHR4,FGOALS_f3_H,HiRAM_SIT_HR,MRI_AGCM3_2_S,EC_Earth3P_HR,MPI_ESM1_2_XR,NICAM16_8S&daily=temperature_2m_mean,wind_speed_10m_mean,cloud_cover_mean,shortwave_radiation_sum,relative_humidity_2m_mean,dew_point_2m_mean,rain_sum,soil_moisture_0_to_10cm_mean`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View sample climate change API data on Open-Meteo
            </a>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => setClimateData(null)}>
              Return to search page
            </Button>
            <Button variant="default" onClick={() => setShowMap(true)}>
              Locate in Map
            </Button>
          </div>

          {showMap && climateData.latitude && climateData.longitude && (
            <div className="mt-6">
              <MapPoint
                latitude={climateData.latitude}
                longitude={climateData.longitude}
                label={climateData.location?.name || "Climate Location"}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
