"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import MarineChart from "../components/MarineChart";
import dynamic from "next/dynamic";
import { searchLocations, getMarineData } from "../lib/api";

// Dynamically import MapPoint to avoid SSR issues
const MapPoint = dynamic(() => import("./MapPoint"), { ssr: false });

export default function MarineForecast() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [marineWeather, setMarineWeather] = useState<any | null>(null);
  const [marineLoading, setMarineLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setMarineWeather(null);
    setShowMap(false);
    try {
      const data = await searchLocations(query);
      setResults(data.results || data.locations || []);
    } catch (err: any) {
      setError("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLocationSelect(loc: any) {
    setMarineLoading(true);
    setMarineWeather(null);
    setShowMap(false);
    try {
      const weather = await getMarineData(loc.latitude, loc.longitude);
      setMarineWeather(weather);
    } catch (err) {
      setMarineWeather({ error: "Failed to fetch marine weather." });
    } finally {
      setMarineLoading(false);
    }
  }

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
      {!marineWeather ? (
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
          {marineLoading && (
            <div className="mt-4">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          )}
        </ul>
      ) : (
        <>
          <Card className="mt-4 p-4 rounded bg-blue-50 dark:bg-blue-900">
            <div className="font-bold mb-2">Marine Weather</div>
            {marineWeather.error ? (
              <span className="text-red-500">No Marine Weather Found.</span>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-white dark:bg-gray-800 shadow">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Wave Height</div>
                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                      {marineWeather.current?.wave_height != null
                        ? `${marineWeather.current.wave_height} ${marineWeather.current_units?.wave_height ?? "m"}`
                        : "No Marine data found"}
                    </div>
                  </Card>
                  <Card className="p-4 bg-white dark:bg-gray-800 shadow">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Sea Surface Temp</div>
                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                      {marineWeather.current?.sea_surface_temperature != null
                        ? `${marineWeather.current.sea_surface_temperature} ${marineWeather.current_units?.sea_surface_temperature ?? "°C"}`
                        : "No Marine data found"}
                    </div>
                  </Card>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Time: {marineWeather.current?.time ?? "-"}
                </div>
              </>
            )}
          </Card>

          <MarineChart data={marineWeather} />

          <div className="mt-4 text-center">
            <a
              href={`https://open-meteo.com/en/docs/marine-weather-api?current=wave_height,sea_surface_temperature&hourly=wave_height,wave_direction,wind_wave_height,wind_wave_direction&latitude=${marineWeather.latitude}&longitude=${marineWeather.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View sample marine weather API data on Open-Meteo
            </a>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => setMarineWeather(null)}>
              Return to search page
            </Button>
            <Button variant="default" onClick={() => setShowMap(true)}>
              Locate in Map
            </Button>
          </div>

          {showMap && marineWeather.latitude && marineWeather.longitude && (
            <div className="mt-6">
              <MapPoint
                latitude={marineWeather.latitude}
                longitude={marineWeather.longitude}
                label="Marine Location"
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
