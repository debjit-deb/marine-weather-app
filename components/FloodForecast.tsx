"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import dynamic from "next/dynamic";
import { searchLocations, getFloodData } from "../lib/api";
import FloodChart from "../components/FloodChart";

const MapPoint = dynamic(() => import("./MapPoint"), { ssr: false });

export default function Flood() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [floodData, setFloodData] = useState<any | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setFloodData(null);
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
    setFloodData(null);
    setShowMap(false);
    try {
      const data = await getFloodData(loc.latitude, loc.longitude);
      setFloodData({ ...data, location: loc });
    } catch (err: any) {
      setError(err.message || "Failed to fetch flood data.");
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
      <h1 className="text-2xl font-bold mb-2">Flood Forecast Search</h1>
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
      {!floodData ? (
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
          <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-900">
            <div className="font-bold mb-2">Flood Forecast Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderCard("Latitude", floodData.latitude, "blue")}
              {renderCard("Longitude", floodData.longitude, "green")}
              {renderCard("Timezone", floodData.timezone, "yellow")}
              {renderCard("River Discharge (Mean)", `${average(floodData.daily?.river_discharge)} m³/s`, "orange")}
              {renderCard("Discharge Mean", `${average(floodData.daily?.river_discharge_mean)} m³/s`, "purple")}
              {renderCard("Discharge Median", `${average(floodData.daily?.river_discharge_median)} m³/s`, "pink")}
              {renderCard("Discharge Max", `${average(floodData.daily?.river_discharge_max)} m³/s`, "red")}
              {renderCard("Discharge Min", `${average(floodData.daily?.river_discharge_min)} m³/s`, "teal")}
              {renderCard("Discharge P25", `${average(floodData.daily?.river_discharge_p25)} m³/s`, "cyan")}
              {renderCard("Discharge P75", `${average(floodData.daily?.river_discharge_p75)} m³/s`, "lime")}
            </div>
          </Card>

          <FloodChart data={floodData} />

          <div className="mt-4 text-center">
            <a
              href={`https://open-meteo.com/en/docs/flood-api?latitude=${floodData.latitude}&longitude=${floodData.longitude}&daily=river_discharge,river_discharge_mean,river_discharge_median,river_discharge_max,river_discharge_min,river_discharge_p25,river_discharge_p75`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View sample flood API data on Open-Meteo
            </a>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => setFloodData(null)}>
              Return to search page
            </Button>
            <Button variant="default" onClick={() => setShowMap(true)}>
              Locate in Map
            </Button>
          </div>

          {showMap && floodData.latitude && floodData.longitude && (
            <div className="mt-6">
              <MapPoint
                latitude={floodData.latitude}
                longitude={floodData.longitude}
                label={floodData.location?.name || "Flood Location"}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
