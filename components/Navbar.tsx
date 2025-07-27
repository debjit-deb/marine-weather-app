"use client";
import { Button } from "../components/ui/button";

export default function Navbar({ onSelect }: { onSelect: (feature: string) => void }) {
  const features = [
    "Geocoding",
    "Marine Forecast",
    "Weather Forecast",
    // "Climate Change",
    "Air Quality",
    "Satellite Radiation",
    // "Elevation",
    // "Flood"
  ];

  return (
    <nav className="w-full flex flex-wrap justify-center gap-4 p-4 bg-white shadow-md">
      {features.map((feature) => (
        <Button key={feature} onClick={() => onSelect(feature)} variant="outline">
          {feature}
        </Button>
      ))}
    </nav>
  );
}
