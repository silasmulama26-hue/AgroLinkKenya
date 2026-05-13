"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Sprout, TrendingUp, MapPin, Calendar, Droplets, ThermometerSun, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import CropDetailModal from "@/app/components/CropDetailModal";

const translations = {
  en: {
    cropDetails: "Crop Details",
    backToCrops: "Back to Crops",
    growthStage: "Growth Stage",
    planted: "Planted",
    acres: "Acres",
    expectedYield: "Expected Yield",
    aiInsights: "AI Insights",
    weatherImpact: "Weather Impact",
    marketTrends: "Market Trends",
    recommendations: "Recommendations",
    irrigationNeeded: "Irrigation needed in 2 days",
    fertilizeSoon: "Fertilize within 3 days",
    monitorPests: "Monitor for pest activity",
    optimalHarvest: "Optimal harvest window approaching",
    priceTrend: "Price trending upward",
    highDemand: "High demand in your region",
    storageAdvice: "Consider storage options",
    loading: "Loading crop details..."
  },
  sw: {
    cropDetails: "Maelezo ya Zao",
    backToCrops: "Rudi kwenye Mazao",
    growthStage: "Hatua ya Ukuaji",
    planted: "Imepandwa",
    acres: "Ekari",
    expectedYield: "Mavuno Yanayotarajiwa",
    aiInsights: "Maarifa ya AI",
    weatherImpact: "Athari za Hali ya Hewa",
    marketTrends: "Mwelekeo wa Soko",
    recommendations: "Mapendekezo",
    irrigationNeeded: "Umwagiliaji unahitajika katika siku 2",
    fertilizeSoon: "Mbolea ndani ya siku 3",
    monitorPests: "Fuatilia wadudu",
    optimalHarvest: "Dirisha bora la mavuno linakaribia",
    priceTrend: "Bei inaongezeka",
    highDemand: "Mahitaji makubwa katika eneo lako",
    storageAdvice: "Fikiria chaguzi za kuhifadhi",
    loading: "Inapakia maelezo ya zao..."
  }
};

const cropRegistry = [
  { id: "maize", name: "Maize (Corn)", localNameSw: "Mahindi" },
  { id: "beans", name: "Beans", localNameSw: "Maharagwe" },
  { id: "avocado", name: "Avocado", localNameSw: "Parachichi" },
  { id: "coffee", name: "Coffee", localNameSw: "Kahawa" },
  { id: "potato", name: "Irish Potatoes", localNameSw: "Viazi" },
  { id: "wheat", name: "Wheat", localNameSw: "Ngano" }
];

export default function CropDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [crop, setCrop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const t = translations[preferredLang];

  const cropId = params.id as string;

  const getCropEmoji = (name: string) => {
    const n = name?.toLowerCase() || '';
    if (n.includes('maize')) return '🌽';
    if (n.includes('bean')) return '🫘';
    if (n.includes('tomato')) return '🍅';
    if (n.includes('potato')) return '🥔';
    if (n.includes('wheat')) return '🌾';
    if (n.includes('coffee')) return '☕';
    if (n.includes('avocado')) return '🥑';
    if (n.includes('sorghum') || n.includes('millet')) return '🌾';
    if (n.includes('sukuma') || n.includes('gram')) return '🥬';
    return '🌱';
  };

  useEffect(() => {
    const loadCrop = async () => {
      try {
        const res = await fetch(`/api/crops/${cropId}`);
        if (res.ok) {
          const data = await res.json();
          setCrop(data);
        } else {
          // Crop not found, redirect to crops list
          router.push('/crops');
        }
      } catch (error) {
        console.error('Failed to load crop:', error);
        router.push('/crops');
      } finally {
        setLoading(false);
      }
    };

    if (cropId) {
      loadCrop();
    }
  }, [cropId, router]);

  if (loading) {
    return (
      <Protected>
        <div className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col md:flex-row w-full min-h-[100dvh]">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-400">{t.loading}</p>
            </div>
          </div>
        </div>
      </Protected>
    );
  }

  if (!crop) {
    return null; // Will redirect in useEffect
  }

  const cropInfo = cropRegistry.find(c => c.id === crop.cropId);

  return (
    <Protected>
      <div className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col md:flex-row w-full min-h-[100dvh]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div onClick={() => router.push('/')} className="w-8 h-8 rounded bg-green-700 flex items-center justify-center text-white font-bold cursor-pointer">A</div>
              <h1 className="text-xl font-bold tracking-tight text-green-900 dark:text-green-400">AgriLink</h1>
            </div>
            <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {[
              { id: "home", icon: "🏠", label: "Dashboard", path: "/" },
              { id: "inventory", icon: "🌱", label: "Crop Inventory", path: "/crops" },
              { id: "market", icon: "📈", label: "Market Explorer", path: "/market" },
              { id: "weather", icon: "🌤️", label: "Weather", path: "/weather" },
              { id: "scan", icon: "📷", label: "AI Quality Check", path: "/scan" },
              { id: "logistics", icon: "🚛", label: "Logistics", path: "/logistics" },
              { id: "library", icon: "📚", label: "Resource Library", path: "/library" },
              { id: "advisor", icon: "🤖", label: "AI Advisor", path: "/advisor" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  item.path === "/crops"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => router.push('/profile')}
              className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all border border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-800 dark:text-orange-400 font-bold shrink-0">
                {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate uppercase font-black tracking-wider">Profile</p>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          {/* Mobile Header */}
          <header className="md:hidden bg-white dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div onClick={() => router.push('/')} className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer">A</div>
              <div>
                <h1 onClick={() => router.push('/')} className="text-lg font-black tracking-tight text-green-900 dark:text-green-400 leading-none cursor-pointer">AgriLink</h1>
                <div className="flex items-center gap-1 mt-0.5 text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <div className="scale-90">
                <ThemeToggle />
              </div>
              <button
                onClick={() => setPreferredLang(prev => prev === "en" ? "sw" : "en")}
                className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[9px] font-black text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm uppercase"
              >
                {preferredLang}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.push('/crops')}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">{t.backToCrops}</span>
            </button>

            {/* Crop Header */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-3xl border border-green-100 dark:border-green-800">
                  {getCropEmoji(cropInfo?.name || '')}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {preferredLang === 'sw' ? cropInfo?.localNameSw : cropInfo?.name}
                  </h1>
                  <p className="text-neutral-500 dark:text-neutral-400">{crop.area} {t.acres} • {t.growthStage}: {crop.stage}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{crop.area}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{t.acres}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{crop.stage}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{t.growthStage}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Health</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">2.2t</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{t.expectedYield}</div>
                </div>
              </div>
            </div>

            {/* AI Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weather Impact */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ThermometerSun size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.weatherImpact}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{t.irrigationNeeded}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Droplets size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">{t.fertilizeSoon}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Trends */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.marketTrends}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">{t.priceTrend}</span>
                    <span className="text-sm font-bold text-green-600">+12%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{t.highDemand}</span>
                    <span className="text-sm font-bold text-blue-600">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Sprout size={20} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.recommendations}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{t.monitorPests}</p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{t.optimalHarvest}</p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{t.storageAdvice}</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-green-800 transition-all"
              >
                View Detailed Analysis
              </button>
            </div>
          </div>
        </main>

        {/* Crop Detail Modal */}
        {showModal && (
          <CropDetailModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            userCrop={crop}
            cropInfo={cropInfo}
            preferredLang={preferredLang}
            t={t}
            getCropEmoji={getCropEmoji}
          />
        )}
      </div>
    </Protected>
  );
}