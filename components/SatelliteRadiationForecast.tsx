"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import SatelliteRadiationChart from "../components/SatelliteRadiationChart";
import dynamic from "next/dynamic";
import { searchLocations, getSatelliteRadiationData } from "../lib/api";

const MapPoint = dynamic(() => import("./MapPoint"), { ssr: false });

export default function SatelliteRadiationForecast() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [radiationData, setRadiationData] = useState<any | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setRadiationData(null);
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
    setDataLoading(true);
    setRadiationData(null);
    setShowMap(false);
    try {
      const data = await getSatelliteRadiationData(loc.latitude, loc.longitude);
      setRadiationData({ ...data, location: loc });
    } catch (err) {
      setRadiationData({ error: "Failed to fetch radiation data." });
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

  return (
    <Card className="w-full max-w-xl p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-2">Satellite Radiation Search</h1>
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
      {!radiationData ? (
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
          <Card className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900">
            <div className="font-bold mb-2">Satellite Radiation Summary</div>
            {radiationData.error ? (
              <span className="text-red-500">No Radiation Data Found.</span>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCard("Latitude", radiationData.latitude, "blue")}
                {renderCard("Longitude", radiationData.longitude, "green")}
                {renderCard("Elevation", `${radiationData.elevation} m`, "purple")}
                {renderCard("Timezone", radiationData.timezone, "yellow")}
                {renderCard("Sunrise", radiationData.daily?.sunrise?.[0], "orange")}
                {renderCard("Sunset", radiationData.daily?.sunset?.[0], "pink")}
                {renderCard("Daylight Duration", radiationData.daily?.daylight_duration?.[0] != null ? `${radiationData.daily.daylight_duration[0]} s` : null, "teal")}
                {renderCard("Sunshine Duration", radiationData.daily?.sunshine_duration?.[0] != null ? `${radiationData.daily.sunshine_duration[0]} s` : null, "cyan")}
                {renderCard("Shortwave Radiation Sum", radiationData.daily?.shortwave_radiation_sum?.[0] != null ? `${radiationData.daily.shortwave_radiation_sum[0]} MJ/m²` : null, "rose")}
              </div>
            )}
          </Card>

          <SatelliteRadiationChart data={radiationData} />

          <div className="mt-4 text-center">
            <a
              href={`https://open-meteo.com/en/docs/satellite-radiation-api?latitude=${radiationData.latitude}&longitude=${radiationData.longitude}&daily=sunrise,sunset,daylight_duration,sunshine_duration,shortwave_radiation_sum&hourly=shortwave_radiation,direct_radiation,diffuse_radiation,direct_normal_irradiance,global_tilted_irradiance,terrestrial_radiation&models=satellite_radiation_seamless`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View sample satellite radiation API data on Open-Meteo
            </a>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => setRadiationData(null)}>
              Return to search page
            </Button>
            <Button variant="default" onClick={() => setShowMap(true)}>
              Locate in Map
            </Button>
          </div>

          {showMap && radiationData.latitude && radiationData.longitude && (
            <div className="mt-6">
              <MapPoint
                latitude={radiationData.latitude}
                longitude={radiationData.longitude}
                label={radiationData.location?.name || "Radiation Location"}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
