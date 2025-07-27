"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import dynamic from "next/dynamic";
import { searchLocations, getAirQualityData } from "../lib/api";
import AirQualityChart from "./AirQualityChart";

const MapPoint = dynamic(() => import("./MapPoint"), { ssr: false });

export default function AirQualityForecast() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [airQuality, setAirQuality] = useState<any | null>(null);
  const [airLoading, setAirLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setAirQuality(null);
    setShowMap(false);
    try {
      const data = await searchLocations(query);
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLocationSelect(loc: any) {
    setAirLoading(true);
    setAirQuality(null);
    setShowMap(false);
    try {
      const data = await getAirQualityData(loc.latitude, loc.longitude);
      setAirQuality(data);
    } catch (err) {
      setAirQuality({ error: "Failed to fetch air quality data." });
    } finally {
      setAirLoading(false);
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

  return (
    <Card className="w-full max-w-xl p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-2">Location Search</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!airQuality ? (
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
          {airLoading && (
            <div className="mt-4">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          )}
        </ul>
      ) : (
        <>
          <Card className="mt-4 p-4 bg-green-50 dark:bg-green-900">
            <div className="font-bold mb-2">Air Quality Details</div>
            {airQuality.error ? (
              <span className="text-red-500">No Air Quality Data Found.</span>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderCard("Latitude", airQuality.latitude, "blue")}
                  {renderCard("Longitude", airQuality.longitude, "green")}
                  {renderCard("Time", airQuality.current?.time, "yellow")}
                  {renderCard("Ozone", airQuality.current?.ozone, "purple")}
                  {renderCard("UV Index", airQuality.current?.uv_index, "pink")}
                  {renderCard("UV Index Clear Sky", airQuality.current?.uv_index_clear_sky, "indigo")}
                  {renderCard("European AQI", airQuality.current?.european_aqi, "red")}
                  {renderCard("US AQI", airQuality.current?.us_aqi, "cyan")}
                  {renderCard("Carbon Monoxide", airQuality.current?.carbon_monoxide, "orange")}
                  {renderCard("Nitrogen Dioxide", airQuality.current?.nitrogen_dioxide, "lime")}
                  {renderCard("Sulphur Dioxide", airQuality.current?.sulphur_dioxide, "teal")}
                </div>
              </>
            )}
          </Card>
            {airQuality && !airQuality.error && (
              <>
                <AirQualityChart data={airQuality.hourly} />

                <div className="mt-4 text-center">
                  <a
                    href={`https://open-meteo.com/en/docs/air-quality-api?current=ozone,uv_index,uv_index_clear_sky,european_aqi,us_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide&latitude=${airQuality.latitude}&longitude=${airQuality.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View sample air quality API data on Open-Meteo
                  </a>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setAirQuality(null)}>
                    Return to search page
                  </Button>
                  <Button variant="default" onClick={() => setShowMap(true)}>
                    Locate in Map
                  </Button>
                </div>

                {showMap && (
                  <div className="mt-6">
                    <MapPoint
                      latitude={airQuality.latitude}
                      longitude={airQuality.longitude}
                      label="Air Quality Location"
                    />
                  </div>
                )}
              </>
            )}
        </>
      )}
    </Card>
  );
}
