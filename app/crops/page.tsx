"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Search, ChevronRight, X, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import HamburgerNav from "@/components/navigation/HamburgerNav";

const translations = {
  en: {
    inventoryManager: "Crop Inventory",
    myPortfolio: "Manage your plots and harvest schedules",
    registerNewCrop: "Register New Crop",
    enterDetailsForCrop: "Enter details for your new crop",
    cancel: "Cancel",
    cropType: "Crop Type",
    selectCrop: "Select a crop...",
    maize: "Maize (Corn)",
    beans: "Beans",
    avocado: "Avocado",
    coffee: "Coffee",
    potato: "Irish Potatoes",
    wheat: "Wheat",
    saveRegistration: "Save Registration",
    growthStage: "Stage",
    trackMarket: "Track Market",
    viewAll: "View All",
    planted: "Planted",
    aiAdvisorPrefix: "AI Advisor:",
    liveMarketBids: "Live Market Bids",
    topBid: "TOP BID",
    offering: "Offering",
    acceptBook: "Accept & Book",
    aiPricePrediction: "AI Price Prediction",
    pricePredictionRise: "rise 5%",
    pricePredictionText: "Based on current {county} volumes, prices are expected to {rise} next week. Consider holding inventory if storage permits.",
    cropInventory: "Crop Inventory",
    managePlots: "Manage your plots and harvest schedules",
    askAI: "Ask AI",
    addCrop: "Add Crop",
    bookTruck: "Book Truck",
    attentionToday: "Needs Attention Today",
    profileSettings: "Profile Settings",
    resourceLibrary: "Resource Library",
    updateProfile: "Update Profile",
    firstName: "First Name",
    lastName: "Last Name",
    saveChanges: "Save Changes",
    profileUpdated: "Profile updated successfully!",
    myProfile: "My Profile"
  },
  sw: {
    inventoryManager: "Hifadhi ya Mazao",
    myPortfolio: "Simamia mashamba yako na ratiba za mavuno",
    registerNewCrop: "Sajili Zao Jipya",
    enterDetailsForCrop: "Ingiza maelezo ya zao lako jipya",
    cancel: "Ghairi",
    cropType: "Aina ya Zao",
    selectCrop: "Chagua zao...",
    maize: "Mahindi",
    beans: "Maharagwe",
    avocado: "Parachichi",
    coffee: "Kahawa",
    potato: "Viazi",
    wheat: "Ngano",
    saveRegistration: "Hifadhi Usajili",
    growthStage: "Hatua",
    trackMarket: "Fuatilia Soko",
    viewAll: "Ona Zote",
    planted: "Imepandwa",
    aiAdvisorPrefix: "Mshauri AI:",
    liveMarketBids: "Zabuni za Soko Moja kwa Moja",
    topBid: "ZABUNI BORA",
    offering: "Inatoa",
    acceptBook: "Kubali & Afadhali",
    aiPricePrediction: "Utabiri wa Bei ya AI",
    pricePredictionRise: "kupanda 5%",
    pricePredictionText: "Kulingana na kiasi cha {county}, bei zinatarajiwa {rise} wiki ijayo. Fikiria kuhifadhi mazao ikiwa nafasi ya kuhifadhi ipo.",
    cropInventory: "Hifadhi ya Mazao",
    managePlots: "Simamia mashamba yako na ratiba za mavuno",
    askAI: "Uliza AI",
    addCrop: "Ongeza Zao",
    bookTruck: "Tafuta Lori",
    attentionToday: "Inahitaji Kuzingatiwa Leo",
    profileSettings: "Mipangilio ya Wasifu",
    resourceLibrary: "Maktaba ya Rasilimali",
    updateProfile: "Sasisha Wasifu",
    firstName: "Jina la Kwanza",
    lastName: "Jina la Mwisho",
    saveChanges: "Hifadhi Mabadiliko",
    profileUpdated: "Wasifu umesasishwa kikamilifu!",
    myProfile: "Wasifu Wangu"
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

export default function CropsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [userCrops, setUserCrops] = useState<any[]>([]);
  const [isUpdatingCrop, setIsUpdatingCrop] = useState<string | null>(null);
  const t = translations[preferredLang];

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

  // Load user crops
  useEffect(() => {
    const loadCrops = async () => {
      try {
        const res = await fetch('/api/crops');
        const data = await res.json();
        setUserCrops(data);
      } catch (error) {
        console.error('Failed to load crops:', error);
      }
    };
    loadCrops();
  }, []);

  const toggleTrackMarket = async (id: string, currentState: boolean) => {
    const newState = !currentState;
    setUserCrops(prev => prev.map(c => c.id === id ? { ...c, trackMarket: newState } : c));
    setIsUpdatingCrop(id);

    try {
      await fetch('/api/crops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, trackMarket: newState })
      });
    } catch (e) {
      console.error("Toggle failed", e);
      setUserCrops(prev => prev.map(c => c.id === id ? { ...c, trackMarket: !newState } : c));
    } finally {
      setIsUpdatingCrop(null);
    }
  };

  const updateCropStage = async (id: string, stage: string) => {
    setUserCrops(prev => prev.map(c => c.id === id ? { ...c, stage } : c));
    setIsUpdatingCrop(id);

    try {
      await fetch('/api/crops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stage })
      });
    } catch (e) {
      console.error("Stage update failed", e);
    } finally {
      setIsUpdatingCrop(null);
    }
  };

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
              { id: "inventory", icon: "🌱", label: t.cropInventory, path: "/crops" },
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
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate uppercase font-black tracking-wider">{t.myProfile}</p>
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
              <HamburgerNav
                activeTab="inventory"
                t={t}
                farmerName={user?.user_metadata?.full_name || "Farmer"}
              />
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm gap-4">
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{showRegistrationForm ? t.registerNewCrop : t.inventoryManager}</h2>
                <p className="text-[10px] md:text-sm text-neutral-500 dark:text-neutral-400">{showRegistrationForm ? t.enterDetailsForCrop : t.myPortfolio}</p>
              </div>
              {!showRegistrationForm ? (
                <button onClick={() => setShowRegistrationForm(true)} className="bg-green-700 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-xl text-xs md:text-sm font-bold shadow-sm hover:bg-green-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Sprout className="w-4 h-4 md:w-5 md:h-5" /> <span>{t.registerNewCrop}</span>
                </button>
              ) : (
                <button onClick={() => setShowRegistrationForm(false)} className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2.5 md:px-5 md:py-3 rounded-xl text-xs md:text-sm font-bold shadow-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  {t.cancel}
                </button>
              )}
            </div>

            {showRegistrationForm ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-2xl mx-auto">
                <form className="space-y-4 md:space-y-6" onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const cropId = formData.get('cropType') as string;
                  const newCrop = {
                    cropId,
                    area: Number(formData.get('acreage')),
                    stage: 'planting',
                    trackMarket: true,
                  };

                  try {
                    const res = await fetch('/api/crops', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newCrop)
                    });
                    const data = await res.json();
                    setUserCrops(prev => [data, ...prev]);
                    setShowRegistrationForm(false);
                  } catch (error) {
                    console.error('Failed to register crop:', error);
                  }
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 md:mb-2">{t.cropType}</label>
                      <select name="cropType" required className="w-full border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2.5 md:px-4 md:py-3 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none text-sm">
                        <option value="">{t.selectCrop}</option>
                        {cropRegistry.map(c => (
                          <option key={c.id} value={c.id}>
                            {preferredLang === 'sw' ? c.localNameSw : c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 md:mb-2">Acreage</label>
                      <input name="acreage" type="number" step="0.1" required className="w-full border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2.5 md:px-4 md:py-3 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" />
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 md:pt-6 flex justify-end">
                    <button type="submit" className="bg-green-700 text-white font-bold py-2.5 px-6 md:py-3 md:px-8 rounded-xl shadow-sm hover:bg-green-800 transition-colors w-full sm:w-auto text-sm">
                      {t.saveRegistration}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {userCrops.map((userCrop) => {
                  const cropInfo = cropRegistry.find(c => c.id === userCrop.cropId);
                  return (
                    <div key={userCrop.id} className="bg-white dark:bg-neutral-900 rounded-xl md:rounded-2xl p-4 md:p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-6">
                      <div
                        className="flex items-center gap-3 md:gap-4 flex-1 cursor-pointer"
                        onClick={() => router.push(`/crops/${userCrop.id}`)}
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xl md:text-2xl border border-green-100 dark:border-green-800">
                          {getCropEmoji(cropInfo?.name || '')}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm md:text-lg text-neutral-900 dark:text-neutral-100">{preferredLang === 'sw' ? cropInfo?.localNameSw : cropInfo?.name}</h3>
                          <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400">{userCrop.area} Acres • {userCrop.stage}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 md:gap-8">
                        <div className="flex flex-col">
                          <span className="text-[9px] md:text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 mb-1">{t.growthStage}</span>
                          <select
                            value={userCrop.stage}
                            onChange={(e) => updateCropStage(userCrop.id, e.target.value)}
                            className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold focus:outline-none text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="planting">Planting</option>
                            <option value="growing">Growing</option>
                            <option value="harvesting">Harvesting</option>
                            <option value="stored">Stored</option>
                          </select>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[9px] md:text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 mb-1">{t.trackMarket}</span>
                          <button
                            onClick={() => toggleTrackMarket(userCrop.id, userCrop.trackMarket)}
                            className={`relative w-10 h-5 md:w-11 md:h-6 rounded-full transition-all duration-300 ease-in-out shadow-inner ${userCrop.trackMarket ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                          >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${userCrop.trackMarket ? 'translate-x-5 md:translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        <div className="flex flex-col gap-2 md:gap-3 items-stretch w-full md:w-auto">
                          <button
                            onClick={() => router.push(`/crops/${userCrop.id}`)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-xs md:text-sm font-bold"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/crops/${userCrop.id}`)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-xs md:text-sm font-bold"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this crop?')) {
                                try {
                                  await fetch(`/api/crops/${userCrop.id}`, { method: 'DELETE' });
                                  setUserCrops(prev => prev.filter(c => c.id !== userCrop.id));
                                } catch (error) {
                                  console.error('Delete failed', error);
                                }
                              }
                            }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-xs md:text-sm font-bold"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </Protected>
  );
}