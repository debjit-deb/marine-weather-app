"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import dynamic from "next/dynamic";
import { searchLocations, getWeatherForecast } from "../lib/api";
import WeatherChart from "./WeatherChart";

const MapPoint = dynamic(() => import("./MapPoint"), { ssr: false });

export default function WeatherForecast() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setWeatherData(null);
    setShowMap(false);
    try {
      const data = await searchLocations(query);
      setResults(data.results || []);
    } catch (err: any) {
      setError("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLocationSelect(loc: any) {
    setWeatherLoading(true);
    setWeatherData(null);
    setShowMap(false);
    try {
      const data = await getWeatherForecast(loc.latitude, loc.longitude);
      setWeatherData({ ...data, location: loc });
    } catch (err) {
      setWeatherData({ error: "Failed to fetch weather forecast." });
    } finally {
      setWeatherLoading(false);
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
      {!weatherData ? (
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
          {weatherLoading && (
            <div className="mt-4">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          )}
        </ul>
      ) : (
        <>
          <Card className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900">
            <div className="font-bold mb-2">Weather Forecast</div>
            {weatherData.error ? (
              <span className="text-red-500">No Weather Forecast Found.</span>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderCard("Latitude", weatherData.latitude, "blue")}
                  {renderCard("Longitude", weatherData.longitude, "green")}
                  {renderCard("Timezone", weatherData.timezone, "yellow")}
                  {renderCard("Time", weatherData.current?.time, "purple")}
                  {renderCard("Temperature", `${weatherData.current?.temperature_2m} ${weatherData.current_units?.temperature_2m}`, "pink")}
                  {renderCard("Humidity", `${weatherData.current?.relative_humidity_2m} ${weatherData.current_units?.relative_humidity_2m}`, "indigo")}
                  {renderCard("Wind Speed", `${weatherData.current?.wind_speed_10m} ${weatherData.current_units?.wind_speed_10m}`, "red")}
                  {renderCard("Wind Direction", `${weatherData.current?.wind_direction_10m} ${weatherData.current_units?.wind_direction_10m}`, "cyan")}
                  {renderCard("Rain", `${weatherData.current?.rain} ${weatherData.current_units?.rain}`, "lime")}
                  {renderCard("Precipitation", `${weatherData.current?.precipitation} ${weatherData.current_units?.precipitation}`, "amber")}
                  {renderCard("Pressure MSL", `${weatherData.current?.pressure_msl} ${weatherData.current_units?.pressure_msl}`, "teal")}
                  {renderCard("Surface Pressure", `${weatherData.current?.surface_pressure} ${weatherData.current_units?.surface_pressure}`, "fuchsia")}
                  {renderCard("Cloud Cover", `${weatherData.current?.cloud_cover} ${weatherData.current_units?.cloud_cover}`, "rose")}
                  {renderCard("Weather Code", `${weatherData.current?.weather_code} ${weatherData.current_units?.weather_code}`, "violet")}
                </div>
              </>
            )}
          </Card>
          {weatherData.daily && (
            <div className="mt-6">
              <WeatherChart data={weatherData.daily} />

              <div className="mt-4 text-center">
                <a
                  href={`https://open-meteo.com/en/docs?latitude=${weatherData.latitude}&longitude=${weatherData.longitude}&hourly=&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,wind_direction_10m,rain,precipitation,pressure_msl,surface_pressure,cloud_cover,weather_code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View sample marine weather API data on Open-Meteo
                </a>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setWeatherData(null)}>
                  Return to search page
                </Button>
                <Button variant="default" onClick={() => setShowMap(true)}>
                  Locate in Map
                </Button>
              </div>
            </div>
          )}
          {showMap && weatherData.latitude && weatherData.longitude && (
            <div className="mt-6">
              <MapPoint
                latitude={weatherData.latitude}
                longitude={weatherData.longitude}
                label={weatherData.location?.name || "Location"}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}