"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { getGeocodingData } from "../lib/api";
import dynamic from "next/dynamic";

// Dynamically import MapPoint to avoid SSR issues
const MapPoint = dynamic(() => import("./MapPoint"), { ssr: false });

export default function Geocoding() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [showMap, setShowMap] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setSelectedLocation(null);
    setShowMap(false);
    try {
      const data = await getGeocodingData(query);
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch geocoding data.");
    } finally {
      setLoading(false);
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
      {!selectedLocation ? (
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
                key={loc.id}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 cursor-pointer"
                onClick={() => {
                  setSelectedLocation(loc);
                  setShowMap(false);
                }}
              >
                <span className="font-semibold">{loc.name}</span>
                {loc.latitude && loc.longitude && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({loc.latitude}, {loc.longitude})
                  </span>
                )}
              </li>
            ))}
        </ul>
      ) : (
        <>
          <Card className="mt-4 p-4 bg-green-50 dark:bg-green-900">
            <div className="font-bold mb-2">Geocoding Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderCard("ID", selectedLocation.id, "blue")}
              {renderCard("Name", selectedLocation.name, "green")}
              {renderCard("Latitude", selectedLocation.latitude, "yellow")}
              {renderCard("Longitude", selectedLocation.longitude, "purple")}
              {renderCard("Elevation", `${selectedLocation.elevation} m`, "pink")}
              {renderCard("Country Code", selectedLocation.country_code, "indigo")}
              {renderCard("Timezone", selectedLocation.timezone, "red")}
              {renderCard("Population", selectedLocation.population, "cyan")}
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <Button variant="outline" onClick={() => setSelectedLocation(null)}>
                Return to search page
              </Button>
              <Button variant="default" onClick={() => setShowMap(true)}>
                Locate in Map
              </Button>
            </div>
          </Card>
          {showMap && selectedLocation.latitude && selectedLocation.longitude && (
            <div className="mt-6">
              <MapPoint
                latitude={selectedLocation.latitude}
                longitude={selectedLocation.longitude}
                label={selectedLocation.name}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
