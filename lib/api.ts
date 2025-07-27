
// lib/api.ts
// Open-Meteo API client for location searches and weather data

const BASE_MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";
const BASE_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const BASE_AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const BASE_RADIATION_URL = "https://satellite-api.open-meteo.com/v1/archive";
const BASE_ELEVATION_URL = "https://api.open-meteo.com/v1/elevation";
const BASE_CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate";
const BASE_FLOOD_URL = "https://flood-api.open-meteo.com/v1/flood";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Search for locations using Open-Meteo's Geocoding API.
 * @param query - Location name or keyword
 * @returns JSON response with location results
 */
export async function searchLocations(query: string) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch locations from Open-Meteo Geocoding API");
  }
  return res.json();
}

/**
 * Fetch geocoding data for a given location name.
 * @param query - Location name
 * @returns JSON response with geocoding results
 */
export async function getGeocodingData(query: string) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch geocoding data from Open-Meteo API");
  }
  return res.json();
}

/**
 * Fetch marine weather data for a given latitude and longitude.
 * Includes current and hourly data for wave height, wave direction,
 * wind wave height, and wind wave direction.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns JSON response with marine weather data
 */
export async function getMarineData(latitude: number, longitude: number) {
  const url = `${BASE_MARINE_URL}?latitude=${latitude}&longitude=${longitude}&current=wave_height,sea_surface_temperature&hourly=wave_height,wave_direction,wind_wave_height,wind_wave_direction`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch marine data from Open-Meteo API");
  }
  return res.json();
}

/**
 * Fetch weather forecast data for a given latitude and longitude.
 * Includes current and daily data for temperature, humidity, wind, pressure, cloud cover, and UV index.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns JSON response with weather forecast data
 */
export async function getWeatherForecast(latitude: number, longitude: number) {
  const url = `${BASE_FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,wind_direction_10m,rain,precipitation,pressure_msl,surface_pressure,cloud_cover,weather_code`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch weather forecast data from Open-Meteo API");
  }
  return res.json();
}

/**
 * Fetch air quality data for a given latitude and longitude.
 * Includes current and hourly data for pollutants and AQI.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns JSON response with air quality data
 */
export async function getAirQualityData(latitude: number, longitude: number) {
  const url = `${BASE_AIR_QUALITY_URL}?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5&current=ozone,uv_index,uv_index_clear_sky,european_aqi,us_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch air quality data from Open-Meteo API");
  }
  return res.json();
}

/**
 * Fetch satellite radiation data for a given latitude and longitude.
 * Includes current and hourly data for shortwave and direct radiation.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns JSON response with radiation data
 */
export async function getSatelliteRadiationData(latitude: number, longitude: number) {
  const url = `${BASE_RADIATION_URL}?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,daylight_duration,sunshine_duration,shortwave_radiation_sum&hourly=shortwave_radiation,direct_radiation,diffuse_radiation,direct_normal_irradiance,global_tilted_irradiance,terrestrial_radiation&models=satellite_radiation_seamless`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch satellite radiation data from Open-Meteo API");
  }
  return res.json();
}

/**
 * Fetch elevation data for a given latitude and longitude.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns JSON response with elevation data
 */
export async function getElevationData(latitude: number, longitude: number) {
  const url = `${BASE_ELEVATION_URL}?latitude=${latitude}&longitude=${longitude}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch elevation data from Open-Meteo API");
  }
  return res.json();
}

/**
 * Fetch flood forecast data for a given latitude and longitude.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns JSON response with flood data
 */
export async function getFloodData(latitude: number, longitude: number) {
  const url = `${BASE_FLOOD_URL}?latitude=${latitude}&longitude=${longitude}&daily=river_discharge,river_discharge_mean,river_discharge_median,river_discharge_max,river_discharge_min,river_discharge_p25,river_discharge_p75`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.reason || "Failed to fetch flood data from Open-Meteo API");
  }
  return res.json();
}

/**
 * Fetch climate change forecast data for a given latitude and longitude.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns JSON response with climate change data
 */
export async function getClimateChangeData(latitude: number, longitude: number) {
  // const start_date = "1950-01-01";
  const start_date = "2020-01-01";
  // const end_date = "2050-12-31";
  const end_date = "2035-12-31";
  const models = "CMCC_CM2_VHR4,FGOALS_f3_H,HiRAM_SIT_HR,MRI_AGCM3_2_S,EC_Earth3P_HR,MPI_ESM1_2_XR,NICAM16_8S";
  const daily = "temperature_2m_mean,wind_speed_10m_mean,cloud_cover_mean,shortwave_radiation_sum,relative_humidity_2m_mean,dew_point_2m_mean,rain_sum,soil_moisture_0_to_10cm_mean";
  const url = `${BASE_CLIMATE_URL}?latitude=${latitude}&longitude=${longitude}&start_date=${start_date}&end_date=${end_date}&models=${models}&daily=${daily}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.reason || "Failed to fetch climate change data from Open-Meteo API");
  }
  return res.json();
}
