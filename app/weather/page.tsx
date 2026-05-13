"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Bell,
  Settings
} from "lucide-react";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import HamburgerNav from "@/components/navigation/HamburgerNav";
import { useAuth } from "@/hooks/use-auth";

const translations = {
  en: {
    weather: "Weather",
    currentConditions: "Current Conditions",
    forecast: "7-Day Forecast",
    alerts: "Weather Alerts",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    visibility: "Visibility",
    pressure: "Pressure",
    uvIndex: "UV Index",
    sunrise: "Sunrise",
    sunset: "Sunset",
    feelsLike: "Feels like",
    precipitation: "Precipitation",
    chance: "Chance",
    today: "Today",
    tomorrow: "Tomorrow",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    rainAlert: "Heavy rain expected in the next 24 hours",
    droughtAlert: "Drought conditions developing - consider irrigation",
    frostAlert: "Frost warning - protect sensitive crops",
    windAlert: "Strong winds expected - secure farming equipment",
    temperature: "Temperature",
    conditions: "Conditions",
    location: "Location",
    lastUpdated: "Last updated",
    refresh: "Refresh",
    notifications: "Notifications",
    settings: "Settings",
    enableAlerts: "Enable weather alerts",
    locationAccess: "Location access required for accurate forecasts",
    grantPermission: "Grant Permission",
    kmh: "km/h",
    km: "km",
    hPa: "hPa",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    veryHigh: "Very High",
    extreme: "Extreme",
    clearSky: "Clear Sky",
    partlyCloudy: "Partly Cloudy",
    cloudy: "Cloudy",
    lightRain: "Light Rain",
    moderateRain: "Moderate Rain",
    heavyRain: "Heavy Rain",
    thunderstorm: "Thunderstorm",
    snow: "Snow",
    mist: "Mist"
  },
  sw: {
    weather: "Hali ya Hewa",
    currentConditions: "Hali ya Sasa",
    forecast: "Utabiri wa Siku 7",
    alerts: "Tahadhari za Hewa",
    humidity: "Unyevu",
    windSpeed: "Kasi ya Upepo",
    visibility: "Muonekano",
    pressure: "Shinikizo",
    uvIndex: "Kielezo cha UV",
    sunrise: "Jua Kuchomoza",
    sunset: "Jua Kuchwa",
    feelsLike: "Inahisi kama",
    precipitation: "Mvua",
    chance: "Uwezekano",
    today: "Leo",
    tomorrow: "Kesho",
    monday: "Jumatatu",
    tuesday: "Jumanne",
    wednesday: "Jumatano",
    thursday: "Alhamisi",
    friday: "Ijumaa",
    saturday: "Jumamosi",
    sunday: "Jumapili",
    rainAlert: "Mvua kubwa inatarajiwa katika saa 24 zijazo",
    droughtAlert: "Hali ya ukame inaendelea - fikiria umwagiliaji",
    frostAlert: "Onyo la baridi - linda mazao nyeti",
    windAlert: "Upepo mkali unatarajiwa - salama vifaa vya kilimo",
    temperature: "Joto",
    conditions: "Hali",
    lastUpdated: "Ilisasishwa mwisho",
    refresh: "Sasisha",
    notifications: "Arifa",
    settings: "Mipangilio",
    enableAlerts: "Wezesha tahadhari za hewa",
    locationAccess: "Upatikanaji wa eneo unahitajika kwa utabiri sahihi",
    grantPermission: "Toa Ruhusa",
    kmh: "km/h",
    km: "km",
    hPa: "hPa",
    low: "Chini",
    moderate: "Wastani",
    high: "Juu",
    veryHigh: "Juu Sana",
    extreme: "Kali",
    clearSky: "Angani Safi",
    partlyCloudy: "Angani na Mawingu",
    cloudy: "Mawingu",
    lightRain: "Mvua Kidogo",
    moderateRain: "Mvua Wastani",
    heavyRain: "Mvua Kubwa",
    thunderstorm: "Dhoruba",
    snow: "Theluji",
    mist: "Ukungu"
  }
};

// Mock weather data
const currentWeather = {
  location: "Nairobi, Kenya",
  temperature: 24,
  feelsLike: 26,
  condition: "partlyCloudy",
  humidity: 65,
  windSpeed: 12,
  windDirection: "NE",
  visibility: 10,
  pressure: 1013,
  uvIndex: 7,
  sunrise: "06:30",
  sunset: "18:45",
  lastUpdated: new Date()
};

const weatherForecast = [
  {
    day: "today",
    date: new Date(),
    high: 26,
    low: 18,
    condition: "partlyCloudy",
    precipitation: 20,
    humidity: 65
  },
  {
    day: "tomorrow",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    high: 28,
    low: 19,
    condition: "sunny",
    precipitation: 5,
    humidity: 60
  },
  {
    day: "monday",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    high: 25,
    low: 17,
    condition: "cloudy",
    precipitation: 80,
    humidity: 75
  },
  {
    day: "tuesday",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    high: 22,
    low: 16,
    condition: "lightRain",
    precipitation: 60,
    humidity: 80
  },
  {
    day: "wednesday",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    high: 24,
    low: 18,
    condition: "moderateRain",
    precipitation: 90,
    humidity: 85
  },
  {
    day: "thursday",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    high: 27,
    low: 20,
    condition: "sunny",
    precipitation: 10,
    humidity: 55
  },
  {
    day: "friday",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    high: 29,
    low: 21,
    condition: "sunny",
    precipitation: 5,
    humidity: 50
  }
];

const weatherAlerts = [
  {
    id: 1,
    type: "rain",
    severity: "moderate",
    title: "Heavy Rain Expected",
    message: "Heavy rainfall expected in Nairobi region over the next 24 hours. Prepare for potential flooding and crop damage.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    type: "wind",
    severity: "low",
    title: "Strong Winds",
    message: "Winds of 15-20 km/h expected tomorrow. Secure loose farming equipment and consider delaying spraying operations.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

export default function WeatherPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [activeTab, setActiveTab] = useState("current");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const t = translations[preferredLang];

  const getWeatherIcon = (condition: string, size: number = 24) => {
    const iconProps = { size, className: "text-neutral-600 dark:text-neutral-400" };

    switch (condition) {
      case "sunny":
        return <Sun {...iconProps} className="text-yellow-500" />;
      case "partlyCloudy":
        return <Cloud {...iconProps} className="text-neutral-500" />;
      case "cloudy":
        return <Cloud {...iconProps} className="text-neutral-600" />;
      case "lightRain":
        return <CloudRain {...iconProps} className="text-blue-500" />;
      case "moderateRain":
        return <CloudRain {...iconProps} className="text-blue-600" />;
      case "heavyRain":
        return <CloudRain {...iconProps} className="text-blue-700" />;
      case "thunderstorm":
        return <Cloud {...iconProps} className="text-purple-600" />;
      case "snow":
        return <CloudSnow {...iconProps} className="text-neutral-400" />;
      case "mist":
        return <Cloud {...iconProps} className="text-neutral-500" />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "sunny":
        return t.clearSky;
      case "partlyCloudy":
        return t.partlyCloudy;
      case "cloudy":
        return t.cloudy;
      case "lightRain":
        return t.lightRain;
      case "moderateRain":
        return t.moderateRain;
      case "heavyRain":
        return t.heavyRain;
      case "thunderstorm":
        return t.thunderstorm;
      case "snow":
        return t.snow;
      case "mist":
        return t.mist;
      default:
        return t.clearSky;
    }
  };

  const getUVIndexText = (uvIndex: number) => {
    if (uvIndex <= 2) return t.low;
    if (uvIndex <= 5) return t.moderate;
    if (uvIndex <= 7) return t.high;
    if (uvIndex <= 10) return t.veryHigh;
    return t.extreme;
  };

  const getDayName = (day: string) => {
    const dayMap: { [key: string]: string } = {
      today: t.today,
      tomorrow: t.tomorrow,
      monday: t.monday,
      tuesday: t.tuesday,
      wednesday: t.wednesday,
      thursday: t.thursday,
      friday: t.friday,
      saturday: t.saturday,
      sunday: t.sunday
    };
    return dayMap[day] || day;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "rain":
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case "wind":
        return <Wind className="w-5 h-5 text-neutral-500" />;
      case "frost":
        return <Thermometer className="w-5 h-5 text-blue-400" />;
      case "drought":
        return <Sun className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "moderate":
        return "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case "high":
        return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      default:
        return "bg-neutral-100 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800";
    }
  };

  return (
    <Protected>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-sm"
                >
                  A
                </button>
                <h1 className="text-lg font-black tracking-tight text-green-900 dark:text-green-400">
                  AgriLink
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreferredLang(prev => prev === "en" ? "sw" : "en")}
                  className="px-3 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 uppercase"
                >
                  {preferredLang}
                </button>
                <ThemeToggle />
                <HamburgerNav
                  activeTab="weather"
                  t={t}
                  farmerName={user?.user_metadata?.full_name || "Farmer"}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mb-2">
              {t.weather}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {currentWeather.location}
            </p>
          </div>

          {/* Weather Alerts */}
          {weatherAlerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {t.alerts}
              </h2>
              <div className="space-y-3">
                {weatherAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {alert.message}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Weather */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {t.currentConditions}
              </h2>
              <button className="flex items-center gap-2 px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                <RefreshCw className="w-4 h-4" />
                {t.refresh}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Main Temperature */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-4 mb-4">
                  {getWeatherIcon(currentWeather.condition, 48)}
                  <div>
                    <p className="text-4xl font-black text-neutral-900 dark:text-neutral-100">
                      {currentWeather.temperature}°C
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {t.feelsLike} {currentWeather.feelsLike}°C
                    </p>
                  </div>
                </div>
                <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                  {getConditionText(currentWeather.condition)}
                </p>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <p>🌅 {t.sunrise}: {currentWeather.sunrise}</p>
                  <p>🌇 {t.sunset}: {currentWeather.sunset}</p>
                </div>
              </div>

              {/* Weather Details */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {t.humidity}
                    </p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {currentWeather.humidity}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <Wind className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {t.windSpeed}
                    </p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {currentWeather.windSpeed} {t.kmh}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <Eye className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {t.visibility}
                    </p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {currentWeather.visibility} {t.km}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <Gauge className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {t.pressure}
                    </p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {currentWeather.pressure} {t.hPa}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg col-span-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {t.uvIndex}
                    </p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {currentWeather.uvIndex} - {getUVIndexText(currentWeather.uvIndex)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-500">
                {t.lastUpdated}: {currentWeather.lastUpdated.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              {t.forecast}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {weatherForecast.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    index === 0
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  }`}
                >
                  <div className="text-center mb-3">
                    <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {getDayName(day.day)}
                    </p>
                    {getWeatherIcon(day.condition, 32)}
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                      {day.high}°
                    </p>
                    <p className="text-sm text-neutral-500">
                      {day.low}°
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {day.precipitation}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Settings */}
          <div className="mt-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {t.settings}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {t.enableAlerts}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Get notified about important weather changes
                  </p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    notificationsEnabled
                      ? "bg-green-600"
                      : "bg-neutral-300 dark:bg-neutral-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-all ${
                      notificationsEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {t.locationAccess}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Allow access to your location for accurate forecasts
                  </p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all">
                  {t.grantPermission}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}