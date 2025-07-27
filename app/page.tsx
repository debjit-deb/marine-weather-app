"use client";
import { useState } from "react";
import { Button } from "../components/ui/button";
import Geocoding from "../components/Geocoding";
import MarineForecast from "../components/MarineForecast";
import WeatherForecast from "../components/WeatherForecast";
import AirQualityForecast from "../components/AirQualityForecast";
import SatelliteRadiationForecast from "../components/SatelliteRadiationForecast";
import Elevation from "../components/Elevation";
import FloodForecast from "../components/FloodForecast";
import ClimateChangeForecast from "../components/ClimateChangeForecast";

export default function Page() {
  const [activeFeature, setActiveFeature] = useState("marine");

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 gap-8 bg-gradient-to-r from-yellow-200 via-blue-100 to-blue-300">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md p-4 flex flex-wrap justify-center gap-4 rounded-md">
        <Button
          variant={activeFeature === "marine" ? "default" : "outline"}
          onClick={() => setActiveFeature("marine")}
        >
          Marine Forecast
        </Button>
        <Button
          variant={activeFeature === "geocoding" ? "default" : "outline"}
          onClick={() => setActiveFeature("geocoding")}
        >
          Geocoding
        </Button>
        <Button
          variant={activeFeature === "weather" ? "default" : "outline"}
          onClick={() => setActiveFeature("weather")}
        >
          Weather Forecast
        </Button>
        <Button 
          variant={activeFeature === "climate" ? "default" : "outline"}
          onClick={() => setActiveFeature("climate")}
        >
          Climate Change
        </Button>
        <Button
          variant={activeFeature === "airquality" ? "default" : "outline"}
          onClick={() => setActiveFeature("airquality")}
        >
          Air Quality
        </Button>
        <Button
          variant={activeFeature === "radiation" ? "default" : "outline"}
          onClick={() => setActiveFeature("radiation")}
        >
          Satellite Radiation
        </Button>
        <Button
          variant={activeFeature === "elevation" ? "default" : "outline"}
          onClick={() => setActiveFeature("elevation")}
        >
          Elevation
        </Button>
        <Button
          variant={activeFeature === "flood" ? "default" : "outline"}
          onClick={() => setActiveFeature("flood")}
        >
          Flood
        </Button>
      </nav>

      {/* Header */}
      <div className="w-full py-8 px-4 text-center bg-gradient-to-r from-yellow-200 via-blue-100 to-blue-300 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ☀️ Marine Weather Forecast Web Application 🌧️
        </h1>
        <p className="text-lg text-gray-700">
          Search for any coastal location and view real-time marine weather data including wave height, sea surface temperature, and more.
        </p>
      </div>

      {/* Feature Components */}
      {activeFeature === "geocoding" && <Geocoding />}
      {activeFeature === "marine" && <MarineForecast />}
      {activeFeature === "weather" && <WeatherForecast />}
      {activeFeature === "airquality" && <AirQualityForecast />}
      {activeFeature === "radiation" && <SatelliteRadiationForecast />}
      {activeFeature === "elevation" && <Elevation />}
      {activeFeature === "flood" && <FloodForecast />}
      {activeFeature === "climate" && <ClimateChangeForecast />}
    </main>
  );
}