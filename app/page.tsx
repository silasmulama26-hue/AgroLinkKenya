"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Sprout, 
  Camera, 
  TrendingUp, 
  TrendingDown,
  Truck, 
  Wifi, 
  WifiOff, 
  Bell, 
  Search, 
  Menu,
  Home,
  LayoutGrid,
  MapPin,
  MessageCircle,
  ThermometerSun,
  Droplets,
  ChevronRight,
  X,
  AlertCircle,
  CloudRain,
  RefreshCw,
  BrainCircuit,
  Sparkles,
  History,
  LogOut,
  Book
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import ChatAdvisor from "./components/ChatAdvisor";
import QualityScanner from "./components/QualityScanner";
import CropDetailModal from "./components/CropDetailModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleGenAI } from "@google/genai";
import { useAuth } from "@/hooks/use-auth";
import MarketIntelligenceDashboard from "@/components/MarketIntelligenceDashboard";
import { Protected } from "@/components/Protected";
import HamburgerNav from "@/components/navigation/HamburgerNav";
import { KENYA_REGIONS } from "@/lib/regions";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase";

// DISABLED: Offline queue feature removed for stability
// type PendingAction = {
//   id: string;
//   type: 'REGISTER_CROP' | 'UPDATE_PROFILE';
//   payload: any;
//   timestamp: number;
// };

const translations = {
  en: {
    currentValueEst: "Current Value Est.",
    vsLastSeason: "+12% vs last season",
    activeBids: "Active Bids",
    pending: "pending",
    nextHarvest: "Next Harvest",
    days: "Days",
    weather: "Weather",
    irrigationNotNeeded: "Irrigation not needed",
    quickActions: "Quick Actions",
    registerCrop: "Register Crop",
    aiQualityCheck: "AI Quality Check",
    marketPrices: "Market Prices",
    bookTransport: "Book Transport",
    myCrops: "My Crops",
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
    enterDetailsForCrop: "Enter details for your new crop",
    cancel: "Cancel",
    registerNewCrop: "Register New Crop",
    cropType: "Crop Type",
    selectCrop: "Select a crop...",
    maize: "Maize (Corn)",
    beans: "Beans",
    avocado: "Avocado",
    coffee: "Coffee",
    potato: "Irish Potatoes",
    wheat: "Wheat",
    plantingDate: "Planting Date",
    acreage: "Acreage (Acres)",
    expectedYield: "Expected Yield (Bags/Kg)",
    saveRegistration: "Save Registration",
    stage: "Stage",
    started: "Started",
    currentYield: "Current Yield",
    estHarvestDate: "Est. Harvest Date",
    runAiQualityAssessment: "Run AI Quality Assessment",
    marketExplorer: "Market & Bids Explorer",
    marketDesc: "Connect directly with buyers and see AI-driven regional price trends for {county} County.",
    averageMaizePrice: "Average Maize Price",
    noNewBids: "No new matching bids",
    noNewBidsDesc: "There are currently no active buyers matching your {cropName} quality in the system. We will notify you when buyers post requests.",
    aiAssessmentTitle: "AI Quality Assessment",
    takePhotoDesc: "Take a clear photo of your crop leaf for disease detection, or harvested produce for grading.",
    tapToOpen: "Tap to open Camera",
    orUploadFromGallery: "Or upload from gallery",
    transportLogistics: "Transport & Logistics",
    bookCooperative: "Book cooperative trucks to transport your produce",
    bookCollection: "Book Collection",
    coordinateWith: "Coordinate with {county} aggregators for shared transport to Nairobi.",
    findTrucks: "Find Trucks",
    activeShipments: "Active Shipments",
    noActiveShipments: "You have no active deliveries in transit.",
    onlineContext: "Online • Knows {county} Context",
    askQuestionPlaceholder: "Ask a question about your crops...",
    swahiliMode: "English Mode Active",
    offlineMode: "Offline Mode (Synced)",
    online: "Online",
    dashboard: "Dashboard",
    logistics: "Logistics",
    advisor: "AI Advisor",
    home: "Home",
    scan: "Scan",
    market: "Market",
    crops: "Crops",
    ai: "AI",
    notifications: "Notifications",
    noNewNotifications: "No new notifications",
    overview: "Farm Overview",
    countyHub: "{county} County Hub",
    marketInsights: "Market Insights",
    liveMarket: "Live Market",
    priceTrends: "Price Trends",
    weeklyAvg: "Weekly Average",
    aiMarketAnalysis: "AI Market Analysis",
    availableBids: "Available Bids",
    region: "Region",
    contact: "Contact",
    marketNotice: "Market Notice",
    historicalData: "Historical Data",
    currentPrice: "Current Price",
    trackMarket: "Track Market",
    untrackMarket: "Stop Tracking",
    marketPerformance: "Market Performance",
    growthStage: "Growth Stage",
    timeRange: "Time Range",
    day7: "Last 7 Days",
    day30: "Last 30 Days",
    day90: "Last 90 Days",
    comparison: "Regional Average",
    notTracked: "Not tracking market",
    tracking: "Tracking market",
    bestPerforming: "Best Performing",
    risingDemand: "Rising Demand",
    inventoryManager: "Inventory Manager",
    myPortfolio: "My Portfolio",
    greet: "Hello, {name}",
    highPriorityAlerts: "Strategic Alerts",
    rainAlert: "Rain expected tomorrow — delay harvesting",
    priceAlert: "Maize prices rising (+5% this week)",
    viewBids: "View All Bids",
    quickScan: "Scan Crop",
    askAI: "Ask AI",
    addCrop: "Add Crop",
    bookTruck: "Book Transport",
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
    currentValueEst: "Makadirio ya Thamani",
    vsLastSeason: "+12% dhidi ya msimu uliopita",
    activeBids: "Zabuni Hai",
    pending: "zinasubiri",
    nextHarvest: "Mavuno Yajayo",
    days: "Siku",
    weather: "Hali ya Hewa",
    irrigationNotNeeded: "Hakuna haja ya kunyunyiza maji",
    quickActions: "Vitendo vya Haraka",
    registerCrop: "Sajili Zao",
    aiQualityCheck: "Hakiki Ubora (AI)",
    marketPrices: "Bei za Soko",
    bookTransport: "Tafuta Usafiri",
    myCrops: "Mazao Yangu",
    viewAll: "Tazama Yote",
    planted: "Imepandwa",
    aiAdvisorPrefix: "Mshauri wa AI:",
    liveMarketBids: "Zabuni za Soko Live",
    topBid: "ZABUNI KUBWA",
    offering: "Wanatoa",
    acceptBook: "Kubali & Weka",
    aiPricePrediction: "Utabiri wa Bei (AI)",
    pricePredictionRise: "kupanda kwa 5%",
    pricePredictionText: "Kulingana na viwango vya sasa vya {county}, bei zinatarajiwa {rise} wiki ijayo. Fikiria kuhifadhi mazao yako ukisubiria soko zuri.",
    cropInventory: "Orodha ya Mazao",
    managePlots: "Dhibiti mashamba yako na ratiba ya mavuno",
    enterDetailsForCrop: "Weka taarifa za zao lako jipya",
    cancel: "Ghairi",
    registerNewCrop: "Sajili Zao Jipya",
    cropType: "Aina ya Zao",
    selectCrop: "Chagua zao...",
    maize: "Mahindi",
    beans: "Maharagwe",
    avocado: "Parachichi",
    coffee: "Kahawa",
    potato: "Viazi Mviringo",
    wheat: "Ngano",
    plantingDate: "Tarehe ya Kupanda",
    acreage: "Eneo (Ekari)",
    expectedYield: "Makadirio ya Mavuno",
    saveRegistration: "Hifadhi Usajili",
    stage: "Hatua",
    started: "Ilianza",
    currentYield: "Mavuno ya Sasa",
    estHarvestDate: "Makadirio ya Siku ya Kuvuna",
    runAiQualityAssessment: "Hakiki Ubora kwa AI",
    marketExplorer: "Soko & Zabuni",
    marketDesc: "Ungana moja kwa moja na wanunuzi na uone mwelekeo wa bei wa AI kwa jimbo la {county}.",
    averageMaizePrice: "Wastani wa Bei ya Mahindi",
    noNewBids: "Hakuna zabuni mpya",
    noNewBidsDesc: "Kwa sasa hakuna wanunuzi wanaolingana na ubora wa zao lako la {cropName}. Tutakuarifu wanunuzi wakiweka maombi.",
    aiAssessmentTitle: "Uhaguzi wa Ubora kwa AI",
    takePhotoDesc: "Piga picha safi ya jani la zao lako kwa utambuzi wa magonjwa, au mazao yaliyovunwa.",
    tapToOpen: "Bofya kufungua Kamera",
    orUploadFromGallery: "Au pakia kutoka matunzio",
    transportLogistics: "Usafiri & Lojistiki",
    bookCooperative: "Wezesha malori kusafirisha mazao yako",
    bookCollection: "Wezesha Usafiri",
    coordinateWith: "Wasiliana na wakusanyaji wa {county} kusafirisha mazao.",
    findTrucks: "Tafuta Malori",
    activeShipments: "Usafirishaji Unaoendelea",
    noActiveShipments: "Huna mzigo wowote unaosafirishwa.",
    onlineContext: "Mkondoni • Anajua mazingira ya {county}",
    askQuestionPlaceholder: "Uliza swali kuhusu mazao yako...",
    swahiliMode: "Swahili Mode Active",
    offlineMode: "Imekatika mtandao (Oflaini)",
    online: "Mkondoni",
    dashboard: "Dashibodi",
    logistics: "Usafiri",
    advisor: "Mshauri wa AI",
    home: "Mwanzo",
    scan: "Picha",
    market: "Soko",
    crops: "Mazao",
    ai: "Mshauri",
    notifications: "Arifa",
    noNewNotifications: "Hakuna arifa mpya",
    overview: "Muhtasari wa Shamba",
    countyHub: "Kituo Mkoa wa {county}",
    marketInsights: "Ufahamu wa Soko",
    liveMarket: "Soko la Moja kwa Moja",
    priceTrends: "Mielekeo ya Bei",
    weeklyAvg: "Wastani wa Wiki",
    aiMarketAnalysis: "Uchambuzi wa Soko wa AI",
    availableBids: "Zabuni Zinazopatikana",
    region: "Eneo",
    contact: "Wasiliana",
    marketNotice: "Taarifa ya Soko",
    historicalData: "Data ya Kihistoria",
    currentPrice: "Bei ya Sasa",
    trackMarket: "Fuatilia Soko",
    untrackMarket: "Acha Kufuatilia",
    marketPerformance: "Utendaji wa Soko",
    growthStage: "Hatua ya Ukuaji",
    timeRange: "Kipindi",
    day7: "Siku 7",
    day30: "Siku 30",
    day90: "Siku 90",
    comparison: "Wastani wa Mkoa",
    notTracked: "Haifuatilii soko",
    tracking: "Inafuatilia soko",
    bestPerforming: "Inafanya Vizuri Zaidi",
    risingDemand: "Mahitaji Yanayopanda",
    inventoryManager: "Meneja wa Akiba",
    myPortfolio: "Portfolio Yangu ya Mazao",
    greet: "Habari, {name}",
    highPriorityAlerts: "Arifa Muhimu",
    rainAlert: "Mvua inatarajiwa kesho — ahirisha kuvuna",
    priceAlert: "Bei ya mahindi inapanda (+5% wiki hii)",
    viewBids: "Tazama Zabuni",
    quickScan: "Pima Zao",
    askAI: "Uliza AI",
    addCrop: "Weka Zao",
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

const farmerDataMap = {
  en: {
    weatherCondition: "Warm and humid. Showers expected.",
    crops: {
      "1": { name: "Western Hybrid Maize", details: "Block A • 2 Acres", stage: "V6 Stage", status: "Growing", yieldEst: "18 - 22 bags", aiAdvice: "Top-dressing with CAN recommended within 3 days before expected heavy rains." },
      "2": { name: "Kakamega Dairy Beans", details: "Block B • 1 Acre", stage: "Flowering", status: "Healthy", yieldEst: "400 kgs", aiAdvice: "Ensure field is weed-free to prevent pest buildup during flowering." }
    },
    bids: {
      "b1": { requirement: "Needs delivery by Friday" }
    }
  },
  sw: {
    weatherCondition: "Joto na unyevu. Mvua inatarajiwa.",
    crops: {
      "1": { name: "Mahindi Chotara ya Magharibi", details: "Kitalu A • Ekari 2", stage: "Hatua ya V6", status: "Inakua", yieldEst: "Mifuko 18 - 22", aiAdvice: "Inashauriwa kuweka mbolea ya CAN ndani ya siku 3 kabla ya mvua kubwa kuanza." },
      "2": { name: "Maharagwe ya Kakamega", details: "Kitalu B • Ekari 1", stage: "Inatoa maua", status: "Inastawi", yieldEst: "Kilo 400", aiAdvice: "Palia shamba ili kuzuia wadudu wakati wa kutoa maua." }
    },
    bids: {
      "b1": { requirement: "Inahitajika ifikapo Ijumaa" }
    }
  }
};

const notificationsDataMap = {
  en: {
    1: { title: "Heavy Rain Alert", message: "Heavy rainfall expected in Kakamega next Tuesday. Consider delaying fertilizer application.", time: "2 hours ago" },
    2: { title: "AI Crop Suggestion", message: "Based on local market data, early planting of beans next season could yield 15% better prices.", time: "1 day ago" },
    3: { title: "New Bid Opportunity", message: "Kakamega Fresh Millers posted a new bid matching your Highland Maize volume.", time: "2 days ago" },
  },
  sw: {
    1: { title: "Tahadhari ya Mvua Kubwa", message: "Mvua kubwa inatarajiwa Kakamega Jumanne ijayo. Fikiria kusubiri kabla ya kuweka mbolea.", time: "Masaa 2 yaliyopita" },
    2: { title: "Ushauri wa Zao (AI)", message: "Kulingana na data za soko la karibu, kupanda maharagwe mapema msimu ujao kunaweza kukupa bei nzuri kwa 15%.", time: "Siku 1 iliyopita" },
    3: { title: "Fursa Mpya ya Zabuni", message: "Kakamega Fresh Millers wameweka zabuni mpya inayolingana na kiwango chako cha Mahindi.", time: "Siku 2 zilizopita" },
  }
};

// Helper for generating unique IDs outside of component render scope
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function AgriLinkDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  // DISABLED: Offline state and queue removed for stability
  // const [isOffline, setIsOffline] = useState(typeof window !== 'undefined' ? !navigator.onLine : false);
  // const [offlineQueue, setOfflineQueue] = useState<PendingAction[]>(() => {
  //   if (typeof window !== 'undefined') {
  //     const saved = localStorage.getItem('agrilink_offline_queue');
  //     return saved ? JSON.parse(saved) : [];
  //   }
  //   return [];
  // });
  // const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  
  // Update activeTab based on current pathname
  useEffect(() => {
    if (pathname === '/') setActiveTab('home');
    else if (pathname.startsWith('/crops')) setActiveTab('inventory');
    else if (pathname.startsWith('/market')) setActiveTab('market');
    else if (pathname.startsWith('/weather')) setActiveTab('weather');
    else if (pathname.startsWith('/ai/analyze')) setActiveTab('scan');
    else if (pathname.startsWith('/logistics')) setActiveTab('logistics');
    else if (pathname.startsWith('/library')) setActiveTab('library');
    else if (pathname.startsWith('/profile')) setActiveTab('profile');
    else setActiveTab('home');
  }, [pathname]);
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const t = translations[preferredLang];
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "weather", read: false },
    { id: 2, type: "advice", read: false },
    { id: 3, type: "market", read: true },
  ]);

  const derivedNotifications = notifications.map(n => ({
    ...n,
    ...notificationsDataMap[preferredLang][n.id as keyof typeof notificationsDataMap["en"]]
  }));

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Define sync function first to avoid temporal dead zone
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

  // DISABLED: Offline sync functions removed for stability
  // const syncOfflineData = React.useCallback(async () => {
  //   if (offlineQueue.length === 0) return;
  //   setIsSyncing(true);
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   console.log("Syncing actions:", offlineQueue);
  //   setOfflineQueue([]);
  //   setIsSyncing(false);
  // }, [offlineQueue]);
  //
  // const queueAction = React.useCallback((action: Omit<PendingAction, 'id' | 'timestamp'>) => {
  //   const newAction: PendingAction = {
  //     ...action,
  //     id: generateId(),
  //     timestamp: Date.now()
  //   };
  //   setOfflineQueue(prev => [...prev, newAction]);
  // }, []);

  // DISABLED: Offline sync trigger removed for stability
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('agrilink_offline_queue', JSON.stringify(offlineQueue, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  //   }
  //   if (!isOffline && offlineQueue.length > 0 && !isSyncing) {
  //     const timer = setTimeout(() => syncOfflineData(), 0);
  //     return () => clearTimeout(timer);
  //   }
  // }, [offlineQueue, isOffline, isSyncing, syncOfflineData]);

  const handleRegisterCrop = (cropData: any) => {
    const newCrop = {
      id: generateId(),
      emoji: getCropEmoji(cropData.type),
      name: t[cropData.type as keyof typeof t] || cropData.type,
      details: `Block ${String.fromCharCode(65 + baseFarmer.crops.length)} • ${cropData.acreage} Acres`,
      stage: "Planting",
      status: "Healthy",
      statusColor: "green",
      plantedDate: cropData.plantingDate,
      harvestDate: "Calculating...",
      yieldEst: cropData.expectedYield
    };

    // Optimistic Update
    setFarmer(prev => ({
      ...prev,
      crops: [newCrop, ...prev.crops]
    }));

    // DISABLED: Offline queue removed for stability
    // if (isOffline) {
    //   queueAction({ type: 'REGISTER_CROP', payload: newCrop });
    // } else {
      // In a real app, call API here. For now, we simulate success.
      console.log("Crop registered online");
    // }

    setShowRegistrationForm(false);
  };

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const county = formData.get('county') as string;
    const subCounty = formData.get('subCounty') as string;
    const agroZone = formData.get('agroZone') as string;

    const updatedFarmer = {
      ...baseFarmer,
      firstName,
      lastName,
      initials: (firstName[0] || '') + (lastName[0] || ''),
      county,
      agroZone
    };

    setFarmer(updatedFarmer);
    
    // In a real app, update profile in DB here
    // DISABLED: Offline checks removed for stability
    // if (!isOffline && isSupabaseConfigured()) {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase.from('profiles').update({
        full_name: `${firstName} ${lastName}`,
        county,
        sub_county: subCounty
      }).eq('id', user?.id);
    }
    
    // if (isOffline) {
    //   queueAction({ type: 'UPDATE_PROFILE', payload: updatedFarmer });
    // }

    // Success feedback (could be a toast in a bigger app)
    alert(t.profileUpdated);
    setActiveTab('home');
  };

  const { user, profile, signOut } = useAuth();
  
  // Dynamic farmer data that would typically come from an API/Supabase auth context
  const [baseFarmer, setFarmer] = useState({
    firstName: profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || "Juma",
    lastName: profile?.full_name?.split(' ')[1] || user?.user_metadata?.full_name?.split(' ')[1] || "Omari",
    initials: (profile?.full_name || user?.user_metadata?.full_name || "JO").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
    county: profile?.county || user?.user_metadata?.county || "Kakamega",
    subCounty: profile?.sub_county || user?.user_metadata?.sub_county || "Central",
    agroZone: profile?.county ? "Regional Zone" : "Lake Basin",
    weather: { temp: "26°C" },
    crops: [
      { id: "1", emoji: "🌽", plantedDate: "12 Mar 2026", statusColor: "amber", harvestDate: "14 Sep 2026" },
      { id: "2", emoji: "🫘", plantedDate: "05 Apr 2026", statusColor: "green", harvestDate: "20 Jul 2026" },
    ],
    bids: [
      { id: "b1", buyer: "Kakamega Fresh Millers", price: "KES 4,200", unit: "/ 90kg bag" }
    ]
  });

  // Sync state with profile changes
  useEffect(() => {
    if (user || profile) {
      const fName = profile?.full_name || user?.user_metadata?.full_name || "";
      const initials = fName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || "JO";
      setFarmer(prev => ({
        ...prev,
        firstName: fName.split(' ')[0] || "Juma",
        lastName: fName.split(' ')[1] || "Omari",
        initials: initials,
        county: profile?.county || user?.user_metadata?.county || prev.county,
        subCounty: profile?.sub_county || user?.user_metadata?.sub_county || prev.subCounty,
      }));
    }
  }, [user, profile]);

  // Regional-based Weather, Recommendations, and Logistics
  const regionalLogistics = KENYA_REGIONS.logisticsProviders[baseFarmer.county] || ["Local Farmers Cooperative"];
  const regionalRecommendations = KENYA_REGIONS.recommendations[baseFarmer.county] || ["Continue monitoring your crops regularly.", "Coordinate with neighbors for shared inputs."];
  
  const farmer = {
    ...baseFarmer,
    weather: {
      ...baseFarmer.weather,
      condition: farmerDataMap[preferredLang].weatherCondition,
      temp: baseFarmer.county === "Nakuru" ? "22°C" : baseFarmer.county === "Mombasa" ? "31°C" : "26°C"
    },
    crops: baseFarmer.crops.map(crop => ({
      ...crop,
      ...farmerDataMap[preferredLang].crops[crop.id as keyof typeof farmerDataMap["en"]["crops"]]
    })),
    bids: baseFarmer.bids.map(bid => ({
      ...bid,
      ...farmerDataMap[preferredLang].bids[bid.id as keyof typeof farmerDataMap["en"]["bids"]]
    }))
  };

  const [marketTrends, setMarketTrends] = useState<any>(null);
  const [marketExplanation, setMarketExplanation] = useState<{ en: string, sw: string } | null>(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [cropRegistry, setCropRegistry] = useState<any[]>([]);
  const [marketWatchlist, setMarketWatchlist] = useState<any[]>([]);
  const [userCrops, setUserCrops] = useState<any[]>([]);
  const [isUpdatingCrop, setIsUpdatingCrop] = useState<string | null>(null);
  const [availableBids, setAvailableBids] = useState<Record<string, any[]>>({});
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [marketRange, setMarketRange] = useState(7);
  const [showComparison, setShowComparison] = useState(false);
  const [logisticsPreFill, setLogisticsPreFill] = useState<any>(null);

  // Initialize data with retries
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    const maxRetries = 2;
    let retryCount = 0;

    const initData = async () => {
      try {
        setInitError(null);
        console.log(`Starting initialization attempt ${retryCount + 1}...`);
        
        // Use absolute paths if possible to avoid issues in some proxy environments
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        
        const [registryRes, cropsRes] = await Promise.all([
          fetch(`${origin}/api/market/crops`),
          fetch(`${origin}/api/crops`)
        ]);
        
        if (!registryRes.ok || !cropsRes.ok) {
          const regStatus = registryRes.status;
          const cropStatus = cropsRes.status;
          throw new Error(`Server error: market/crops=${regStatus}, crops=${cropStatus}`);
        }

        const registry = await registryRes.json();
        const crops = await cropsRes.json();
        
        if (mounted) {
          setCropRegistry(registry);
          setUserCrops(crops);
          setIsInitializing(false);
          console.log("Initialization successful");
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Initialization failed attempt ${retryCount + 1}:`, e);
        
        if (mounted) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying in 3 seconds... (Count: ${retryCount})`);
            setTimeout(initData, 3000);
          } else {
            setInitError(errorMessage || 'Failed to connect to server');
            setIsInitializing(false);
          }
        }
      }
    };
    initData();
    return () => { mounted = false; };
  }, []);

  // Sync Watchlist & AI Summary
  useEffect(() => {
    const fetchWatchlist = async () => {
      const trackedCropIds = userCrops
        .filter(c => c.trackMarket)
        .map(c => c.cropId);
      
      if (trackedCropIds.length === 0) {
        setMarketWatchlist([]);
        setMarketExplanation(null);
        return;
      }

      setMarketLoading(true);
      try {
        const res = await fetch(`/api/market/watchlist?crops=${trackedCropIds.join(',')}&range=${marketRange}`);
        const data = await res.json();
        const watchlistArray = Array.isArray(data) ? data : [];
        setMarketWatchlist(watchlistArray);

        // Fetch bids for each tracked crop
        const bidsData: Record<string, any[]> = {};
        await Promise.all(watchlistArray.map(async (item: any) => {
          try {
            const bidRes = await fetch(`/api/market/bids?crop=${item.id}`);
            if (bidRes.ok) {
              bidsData[item.id] = await bidRes.json();
            }
          } catch (bidErr) {
            console.error(`Failed to fetch bids for ${item.id}:`, bidErr);
          }
        }));
        setAvailableBids(bidsData);

        if (data.length > 0 && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
            const best = data.reduce((prev: any, current: any) => (prev.changePercent > current.changePercent) ? prev : current);
            
            const prompt = `
              You are a professional Kenyan agricultural market analyst and agronomist.
              Review these tracked crops for a farmer in ${farmer.county} over the last ${marketRange} days:
              ${JSON.stringify(data.map((c: any) => ({ name: c.name, change: c.changePercent, trend: c.trend })), (_, v) => typeof v === 'bigint' ? v.toString() : v)}

              STRICT RULES:
              1. Generate 2-3 data-driven insights. 
              2. Each insight MUST be exactly ONE short, punchy sentence.
              3. English first, then Swahili translation.
              4. English format: "Insight 1. Insight 2."
              5. Swahili format: "Muhtasari 1. Muhtasari 2."
              6. Return the result in this exact string format: "English sentence 1. English sentence 2.|Swahili sentence 1. Swahili sentence 2."
            `;

            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt,
            });
            
            const text = response.text || "";
            const [enText, swText] = text.split('|');
            
            setMarketExplanation({ 
              en: enText?.trim() || "Consistently track your crops to see AI insights here.", 
              sw: swText?.trim() || "Fuatilia mazao yako mara kwa mara ili kuona maoni ya AI hapa." 
            });
          } catch (aiError) {
            console.error("AI Generation failed:", aiError);
          }
        }
      } catch (error) {
        console.error("Watchlist fetch error:", error);
      } finally {
        setMarketLoading(false);
      }
    };

    if (activeTab === 'market' && userCrops.length > 0) {
      fetchWatchlist();
    }
  }, [activeTab, farmer.county, userCrops, marketRange]);

  const toggleTrackMarket = async (id: string, currentState: boolean) => {
    const newState = !currentState;
    
    // Optimistic UI update
    setUserCrops(prev => prev.map(c => c.id === id ? { ...c, trackMarket: newState } : c));
    setIsUpdatingCrop(id);

    try {
      // DISABLED: Offline queue removed for stability
      // if (isOffline) {
      //   queueAction({ type: 'UPDATE_PROFILE', payload: { id, trackMarket: newState } });
      // } else {
        await fetch('/api/crops', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, trackMarket: newState })
        });
      // }
    } catch (e) {
      console.error("Toggle failed", e);
      // Revert if failed
      setUserCrops(prev => prev.map(c => c.id === id ? { ...c, trackMarket: !newState } : c));
    } finally {
      setIsUpdatingCrop(null);
    }
  };

  const updateCropStage = async (id: string, stage: string) => {
    setUserCrops(prev => prev.map(c => c.id === id ? { ...c, stage } : c));
    setIsUpdatingCrop(id);

    try {
      // DISABLED: Offline queue removed for stability
      // if (isOffline) {
      //   queueAction({ type: 'UPDATE_PROFILE', payload: { id, stage } });
      // } else {
        await fetch('/api/crops', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, stage })
        });
      // }
    } catch (e) {
      console.error("Stage update failed", e);
    } finally {
      setIsUpdatingCrop(null);
    }
  };

  // DISABLED: Offline event listeners removed for stability
  // useEffect(() => {
  //   const handleOnline = () => setIsOffline(false);
  //   const handleOffline = () => setIsOffline(true);
  //   
  //   // Check initial state
  //   if (typeof window !== "undefined") {
  //     window.addEventListener("online", handleOnline);
  //     window.addEventListener("offline", handleOffline);
  //   }
  //
  //   return () => {
  //     if (typeof window !== "undefined") {
  //       window.removeEventListener("online", handleOnline);
  //       window.removeEventListener("offline", handleOffline);
  //     }
  //   };
  // }, []);

  const renderHome = () => (
    <div className="p-4 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 space-y-6 md:space-y-8">
      
      {/* 1. SMART HEADER */}
      <section className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h1 className="text-xl md:text-3xl font-black text-neutral-900 dark:text-neutral-100 leading-tight">
              {t.greet.replace("{name}", farmer.firstName)}!
            </h1>
            <p className="text-[11px] md:text-sm text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{farmer.county} • {farmer.subCounty}</p>
          </div>
          {/* DISABLED: Offline indicator removed for stability */}
          <div className="flex flex-col items-end gap-1.5">
               <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full text-[9px] font-black border border-blue-100 dark:border-blue-800 flex items-center gap-1 animate-pulse">
                  <CloudRain size={10} /> {preferredLang === 'sw' ? 'Mvua' : 'Rain'}
               </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="grid grid-cols-2 gap-3 px-1">
        <button 
          onClick={() => router.push('/ai/analyze')} 
          className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-3 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
            <Camera size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{t.aiQualityCheck}</p>
            <p className="text-[9px] text-neutral-500 font-medium">{preferredLang === 'sw' ? 'Chunguza' : 'Diagnostic Scan'}</p>
          </div>
        </button>
        <button 
          onClick={() => router.push('/crops')} 
          className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-3 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
            <Sprout size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{t.registerNewCrop}</p>
            <p className="text-[9px] text-neutral-500 font-medium">{preferredLang === 'sw' ? 'Sajili' : 'Add Records'}</p>
          </div>
        </button>
      </section>

      {/* 2. MY CROPS SNAPSHOT */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t.myCrops}</h3>
          <button onClick={() => router.push('/crops')} className="text-[10px] font-black text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">{t.viewAll}</button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1 -mx-4 md:mx-0 px-4 md:px-0">
          {userCrops.filter(c => c.trackMarket).map((userCrop) => {
            const marketData = marketWatchlist.find(m => m.id === userCrop.cropId);
            const cropInfo = cropRegistry.find(c => c.id === userCrop.cropId);
            const stageProgress = {
              'planting': 20,
              'growing': 50,
              'harvesting': 85,
              'stored': 100
            }[userCrop.stage as string] || 10;

            if (!marketData) return null;

            return (
              <div 
                key={userCrop.id} 
                onClick={() => setSelectedCropId(userCrop.id)}
                className="min-w-[160px] md:min-w-[220px] bg-white dark:bg-neutral-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer shrink-0"
              >
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg md:rounded-2xl flex items-center justify-center text-lg md:text-2xl border border-neutral-100 dark:border-neutral-700">
                    {getCropEmoji(marketData.name)}
                  </div>
                  <div className={`px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-black flex items-center gap-1 ${marketData.trend === 'upward' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                    {marketData.trend === 'upward' ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                    {marketData.changePercent}%
                  </div>
                </div>
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 leading-none mb-0.5 text-xs md:text-base truncate">{preferredLang === 'sw' ? cropInfo?.localNameSw : cropInfo?.name}</h4>
                <p className="text-[8px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-tight mb-2 md:mb-4 whitespace-nowrap">KSh {marketData.currentPrice}/kg</p>
                
                <div className="space-y-1">
                   <div className="flex justify-between text-[7px] md:text-[9px] font-black uppercase tracking-tighter text-neutral-400">
                      <span>{userCrop.stage}</span>
                      <span>{stageProgress}%</span>
                   </div>
                   <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-1000 ${stageProgress === 100 ? 'bg-blue-500' : 'bg-green-500'}`} 
                       style={{ width: `${stageProgress}%` }}
                     ></div>
                   </div>
                </div>
              </div>
            );
          })}
          {userCrops.filter(c => c.trackMarket).length === 0 && (
             <div className="w-full bg-neutral-50 dark:bg-neutral-900 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl md:rounded-3xl p-6 md:p-10 text-center shrink-0">
                <LayoutGrid size={24} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-2" />
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t.notTracked}</p>
                <button onClick={() => router.push('/crops')} className="text-[10px] font-black text-green-700 dark:text-green-400 mt-2 bg-white dark:bg-neutral-800 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">{t.addCrop}</button>
             </div>
          )}
        </div>
      </section>

      {/* 3. AI INSIGHTS PANEL */}
      {marketExplanation && (
        <section className="bg-green-900 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden group">
          <Sparkles size={80} className="absolute -bottom-10 -right-5 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 space-y-3 md:space-y-4">
            <div className="flex items-center gap-2">
              <BrainCircuit size={16} className="text-green-300" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-green-300">{t.aiMarketAnalysis}</h3>
            </div>
            <div className="space-y-2.5">
               {(preferredLang === 'sw' ? marketExplanation.sw : marketExplanation.en).split('. ').map((sentence, idx) => (
                 sentence && (
                   <div key={idx} className="flex gap-2.5 items-start animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-xs md:text-sm font-medium leading-relaxed">{sentence}.</p>
                   </div>
                 )
               ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. MARKET OPPORTUNITIES (BIDS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t.activeBids}</h3>
          <button onClick={() => router.push('/market/bids')} className="text-[10px] font-black text-green-700 dark:text-green-400 hover:underline">{t.viewBids}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {farmer.bids.slice(0, 2).map((bid) => (
            <div key={bid.id} className="bg-white dark:bg-neutral-900 p-4 md:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between group hover:border-green-200 dark:hover:border-green-800 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:scale-110 transition-all">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100 leading-tight text-sm">{bid.buyer}</h4>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">{bid.price} {bid.unit}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('logistics')}
                className="bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:bg-green-700 hover:text-white transition-all shadow-sm"
              >
                {t.acceptBook}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REGIONAL ADAPTATION ENGINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Weather & Notifications */}
        <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500">
                <ThermometerSun size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">{t.weather}</p>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{farmer.weather.temp} • {farmer.weather.condition}</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-2">
              <AlertCircle size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">{t.irrigationNotNeeded}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Region-Specific Alerts</h4>
             <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                   <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                   <p className="text-xs font-semibold text-red-700 dark:text-red-400">Rain expected tomorrow in {farmer.subCounty} — delay harvesting activities.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Nearby Logistics & Providers */}
        <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Local Logistics Providers</p>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{farmer.county} Service Hub</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {regionalLogistics.map((provider, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{provider}</span>
                </div>
                <button className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-tight hover:underline">Book Now</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6. LOCAL FARMING RECOMMENDATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Expert Recommendations for {farmer.county}</h3>
           <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
              <MapPin size={14} className="text-green-600" /> {farmer.subCounty}
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {regionalRecommendations.map((rec, i) => (
             <div key={i} className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles size={40} />
                </div>
                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 mb-3 font-black text-xs">
                  {i + 1}
                </div>
                <p className="text-xs md:text-sm font-bold text-neutral-800 dark:text-neutral-200 leading-relaxed">{rec}</p>
             </div>
           ))}
        </div>
      </section>

    </div>
  );

  const renderInventory = () => (
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
            
            // Call API
            const res = await fetch('/api/crops', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newCrop)
            });
            const data = await res.json();
            setUserCrops(prev => [data, ...prev]);
            setShowRegistrationForm(false);
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
                    onClick={() => setSelectedCropId(userCrop.id)}
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

                  <button 
                    onClick={() => setSelectedCropId(userCrop.id)}
                    className="bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 p-2 md:p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all ml-auto md:ml-0"
                  >
                    <ChevronRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderMarket = () => (
    <MarketIntelligenceDashboard 
      farmerId={user?.id || 'demo-farmer'} 
      county={baseFarmer.county} 
      preferredLang={preferredLang} 
    />
  );

  const renderScan = () => (
    <QualityScanner farmer={farmer} t={t} preferredLang={preferredLang} />
  );

  const renderLogistics = () => (
    <div className="p-4 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm gap-4">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t.transportLogistics}</h2>
          <p className="text-[10px] md:text-sm text-neutral-500 dark:text-neutral-400">{t.bookCooperative}</p>
        </div>
        {logisticsPreFill && (
          <button 
            onClick={() => setLogisticsPreFill(null)}
            className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl transition-all"
          >
            {preferredLang === 'sw' ? 'Futa Yote' : 'Clear Form'}
          </button>
        )}
      </div>
      
      {logisticsPreFill && (
        <div className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border-2 border-orange-500/20 shadow-xl shadow-orange-500/5 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Truck size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 p-3 rounded-2xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 leading-tight">
                  {preferredLang === 'sw' ? 'Maelezo ya Zabuni Iliyochaguliwa' : 'Selected Bid Details'}
                </h3>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Pre-filled from Market Explorer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Buyer & Commodity</span>
                <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">{logisticsPreFill.bid.buyer}</p>
                <p className="text-sm text-green-700 dark:text-green-400 font-bold">{preferredLang === 'sw' ? logisticsPreFill.crop.localNameSw : logisticsPreFill.crop.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Agreed Price</span>
                <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">KSh {logisticsPreFill.bid.pricePerKg}/unit</p>
                <p className="text-[10px] text-neutral-500 font-medium">Valid for 48 hours</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Delivery Destination</span>
                <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
                  <MapPin size={14} className="text-red-500" />
                  <p className="text-base font-bold">{logisticsPreFill.bid.location}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  alert(preferredLang === 'sw' ? 'Ombi la usafiri limetumwa kwa chama cha ushirika!' : 'Transport request sent to cooperative!');
                  setLogisticsPreFill(null);
                }}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-green-700/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Truck size={16} /> {preferredLang === 'sw' ? 'Thibitisha na Agiza Lori' : 'Confirm & Request Truck'}
              </button>
              <button 
                onClick={() => setLogisticsPreFill(null)}
                className="px-8 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-black py-4 rounded-2xl text-xs uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-all"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-100 dark:border-amber-900 flex flex-col justify-center items-center text-center py-8 md:py-10 md:h-64">
           <Truck className="w-10 h-10 md:w-12 md:h-12 text-amber-500 mb-4" />
           <h3 className="font-bold text-sm md:text-lg text-amber-900 dark:text-amber-100 mb-2">{t.bookCollection}</h3>
           <p className="text-[10px] md:text-sm text-amber-800/80 dark:text-amber-400/80 max-w-xs mb-6 md:mb-4">{t.coordinateWith.replace("{county}", farmer.county)}</p>
           <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 md:px-8 md:py-2 rounded-xl transition-all active:scale-95 shadow-sm w-full sm:w-auto text-[10px] md:text-sm uppercase tracking-wider">
             {t.findTrucks}
           </button>
        </div>
        
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center items-center text-center py-8 md:py-10 md:h-64 text-neutral-400">
           <MapPin className="w-10 h-10 md:w-12 md:h-12 mb-4 opacity-50" />
           <h3 className="font-bold text-sm md:text-lg text-neutral-900 dark:text-neutral-100 mb-2">{t.activeShipments}</h3>
           <p className="text-[10px] md:text-sm text-neutral-500 dark:text-neutral-400">{t.noActiveShipments}</p>
        </div>
      </div>
    </div>
  );

  const renderAdvisor = () => (
    <ChatAdvisor 
      farmer={farmer} 
      preferredLang={preferredLang} 
    />
  );

  const renderWeather = () => (
    <div className="p-4 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500">
             <ThermometerSun size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{t.weather} Explorer</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Detailed forecast for {farmer.subCounty}, {farmer.county}</p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Temperature", value: farmer.weather.temp, icon: ThermometerSun, color: "text-amber-500" },
             { label: "Humidity", value: "65%", icon: Droplets, color: "text-blue-500" },
             { label: "Precipitation", value: "20%", icon: CloudRain, color: "text-blue-400" },
             { label: "Wind Speed", value: "12 km/h", icon: Truck, color: "text-neutral-500" }
           ].map((item, idx) => (
             <div key={idx} className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <item.icon size={20} className={`${item.color} mb-2`} />
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{item.label}</p>
                <p className="text-lg font-black text-neutral-900 dark:text-neutral-100">{item.value}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
         <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-6">7-Day Forecast</h3>
         <div className="space-y-4">
           {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
             <div key={day} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800/50">
                <span className="w-12 font-bold text-neutral-900 dark:text-neutral-100">{day}</span>
                <div className="flex items-center gap-3">
                   <CloudRain size={18} className="text-blue-400" />
                   <span className="text-xs font-medium text-neutral-500">{idx % 3 === 0 ? 'Showers' : 'Partly Cloudy'}</span>
                </div>
                <div className="flex gap-4">
                   <span className="font-black text-neutral-900 dark:text-neutral-100">26°</span>
                   <span className="font-bold text-neutral-400">18°</span>
                </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="p-4 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mb-2">{t.resourceLibrary}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">Expert agricultural guides and best practices for your region.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { title: "Optimizing Maize Yields", category: "Crops", time: "5 min read" },
             { title: "Water Conservation Techniques", category: "Sustainability", time: "8 min read" },
             { title: "Pest Management in Coffee", category: "Protection", time: "6 min read" },
             { title: "Soil Health Fundamentals", category: "Soil", time: "10 min read" }
           ].map((resource, idx) => (
             <button key={idx} className="flex items-center justify-between p-5 bg-neutral-50 dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-green-300 transition-all text-left group">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">{resource.category}</span>
                   <h4 className="font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-green-700 transition-colors">{resource.title}</h4>
                   <p className="text-[10px] text-neutral-400 font-bold">{resource.time}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-green-600 shadow-sm border border-neutral-100 dark:border-neutral-800">
                   <ChevronRight size={18} />
                </div>
             </button>
           ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (

    <div className="p-4 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm gap-4">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t.profileSettings}</h2>
          <p className="text-[10px] md:text-sm text-neutral-500 dark:text-neutral-400">{t.updateProfile}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-800 dark:text-orange-400 font-black text-2xl md:text-3xl border-4 border-white dark:border-neutral-800 shadow-md">
              {farmer.initials}
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-400 uppercase tracking-widest">{t.myProfile}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-neutral-400 tracking-wider ml-1">{t.firstName}</label>
              <input 
                name="firstName" 
                defaultValue={farmer.firstName} 
                required 
                className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-green-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-neutral-400 tracking-wider ml-1">{t.lastName}</label>
              <input 
                name="lastName" 
                defaultValue={farmer.lastName} 
                required 
                className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-green-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-neutral-400 tracking-wider ml-1">County</label>
              <select 
                name="county" 
                value={farmer.county}
                onChange={(e) => {
                  const newCounty = e.target.value;
                  setFarmer(prev => ({ ...prev, county: newCounty, subCounty: "" }));
                }}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-green-500 transition-all outline-none appearance-none"
              >
                {KENYA_REGIONS.counties.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-neutral-400 tracking-wider ml-1">Sub-County</label>
              <select 
                name="subCounty" 
                value={farmer.subCounty}
                onChange={(e) => {
                  const newSubCounty = e.target.value;
                  setFarmer(prev => ({ ...prev, subCounty: newSubCounty }));
                }}
                disabled={!farmer.county}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-green-500 transition-all outline-none appearance-none disabled:opacity-50"
              >
                <option value="">Select Region</option>
                {farmer.county && KENYA_REGIONS.subCounties[farmer.county]?.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-4">
            <button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              {t.saveChanges}
            </button>
            <button 
              type="button"
              onClick={() => signOut()}
              className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black py-4 rounded-2xl transition-all active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              {preferredLang === 'sw' ? 'Ondoka (Logout)' : 'Sign Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "inventory": return renderInventory();
      case "market": return renderMarket();
      case "weather": return renderWeather();
      case "logistics": return renderLogistics();
      case "library": return renderLibrary();
      case "advisor": return renderAdvisor();
      case "profile": return renderProfile();
      case "action":
      case "scan": return renderScan();
      case "home":
      default: return renderHome();
    }
  };

  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-950 z-[100]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-black text-neutral-400 uppercase tracking-widest animate-pulse">AgriLink Initialization...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-950 z-[100] p-6">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100">Connection Failed</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">We couldn&apos;t connect to the AgriLink servers. This usually happens during server startup. Please wait a moment and try again.</p>
          <div className="text-[10px] bg-white dark:bg-neutral-900 p-2 rounded-lg font-mono text-red-400 border border-red-100 dark:border-red-900/20 truncate">
             Error: {initError}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Protected>
      <div className={`bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col md:flex-row w-full ${activeTab === 'advisor' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`}>
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-green-700 flex items-center justify-center text-white font-bold">A</div>
            <h1 className="text-xl font-bold tracking-tight text-green-900 dark:text-green-400">AgriLink</h1>
          </div>
          {/* DISABLED: Offline sync indicator removed for stability */}
          <Wifi size={18} className="text-green-500" />
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {[
              { id: "home", icon: Home, label: t.dashboard, path: "/" },
              { id: "inventory", icon: LayoutGrid, label: t.myCrops, path: "/crops" },
              { id: "market", icon: TrendingUp, label: t.marketExplorer, path: "/market/bids" },
              { id: "weather", icon: ThermometerSun, label: t.weather, path: "/weather" },
              { id: "scan", icon: Camera, label: t.aiQualityCheck, path: "/ai/analyze" },
              { id: "logistics", icon: Truck, label: t.logistics, path: "/logistics" },
              { id: "library", icon: Book, label: t.resourceLibrary, path: "/library" },
              { id: "advisor", icon: MessageCircle, label: t.advisor, path: "/ai/analyze" },
            ].map((item) => (
            <button 
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === item.id 
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400" 
                  : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-neutral-100 dark:border-neutral-800">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border ${activeTab === 'profile' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-800 dark:text-orange-400 font-bold shrink-0">
              {farmer.initials}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">{farmer.firstName} {farmer.lastName}</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate uppercase font-black tracking-wider">{t.myProfile}</p>
            </div>
          </button>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold border border-transparent hover:border-red-100 dark:hover:border-red-900/20"
          >
            <LogOut size={18} />
            <span className="text-sm">{preferredLang === 'sw' ? 'Ondoka' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col ${activeTab === 'advisor' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`}>
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
             <div onClick={() => router.push('/')} className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer">A</div>
             <div>
               <h1 onClick={() => router.push('/')} className="text-lg font-black tracking-tight text-green-900 dark:text-green-400 leading-none cursor-pointer">AgriLink</h1>
               {/* DISABLED: Offline sync indicator removed for stability */}
               <div className="flex items-center gap-1 mt-0.5 text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                 <Wifi size={8} className="text-green-500"/>
                 {preferredLang === 'sw' ? 'Mhewani' : 'Online'}
               </div>
             </div>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {/* DISABLED: Offline queue indicator removed for stability */}
            {/* {offlineQueue.length > 0 && (
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] px-1.5 py-0.5 rounded-md font-black border border-amber-200 dark:border-amber-800 animate-pulse shrink-0">
                {offlineQueue.length}
              </span>
            )} */}
            <div className="scale-90">
              <ThemeToggle />
            </div>
            <button 
              onClick={() => setPreferredLang(prev => prev === "en" ? "sw" : "en")}
              className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[9px] font-black text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm uppercase"
            >
              {preferredLang}
            </button>
            <button onClick={() => setShowNotifications(true)} className="w-8 h-8 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center relative border border-neutral-200 dark:border-neutral-700 shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
              <Bell size={14} className="text-neutral-600 dark:text-neutral-400" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-neutral-100 dark:border-neutral-800"></span>}
            </button>
            <HamburgerNav 
              activeTab={activeTab} 
              t={t} 
              farmerName={`${farmer.firstName} ${farmer.lastName}`} 
            />
          </div>
        </header>

        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-10 py-5 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            {farmer.county} {t.overview}
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-medium flex items-center gap-1">
              <MapPin size={12} /> {farmer.subCounty}
            </span>
          </h2>
          <div className="flex items-center gap-4">
             {/* DISABLED: Offline queue badge removed for stability */}
             {/* {offlineQueue.length > 0 && (
               <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-800 shadow-sm animate-in fade-in slide-in-from-right-4">
                 <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                 <span className="text-xs font-bold whitespace-nowrap">
                   {offlineQueue.length} {preferredLang === 'sw' ? 'Zinasubiri' : 'Pending Sync'}
                 </span>
               </div>
             )} */}
             <div className="relative">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
               <input 
                 type="text" 
                 placeholder={preferredLang === 'sw' ? 'Tafuta mazao, zabuni...' : 'Search crops, bids...'} 
                 className="pl-10 pr-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 border-transparent focus:bg-white dark:focus:bg-neutral-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 transition-all text-sm w-64"
               />
             </div>
             <div className="flex items-center gap-2">
               <ThemeToggle />
               <button 
                 onClick={() => setPreferredLang(prev => prev === "en" ? "sw" : "en")}
                 className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm uppercase"
               >
                 {preferredLang === "en" ? "EN" : "SW"}
               </button>
               <button onClick={() => setShowNotifications(true)} className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all flex items-center justify-center relative border border-neutral-200 dark:border-neutral-700 shadow-sm">
                 <Bell size={18} className="text-neutral-600 dark:text-neutral-400" />
                 {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-neutral-100 dark:border-neutral-800"></span>}
               </button>
             </div>
          </div>
        </header>

        {/* Dashboard Content Dynamic Render */}
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation Form */}
      {/* Navigation moved to Hamburger Menu */}

      {/* Notifications Slide-over */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowNotifications(false)}></div>
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-900 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Bell size={20} className="text-neutral-700 dark:text-neutral-300" /> {t.notifications}
              </h2>
              <button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                  <Bell size={48} className="opacity-20 mb-4" />
                  <p>{t.noNewNotifications}</p>
                </div>
              ) : (
                derivedNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-xl border ${notification.read ? 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 opacity-70' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'} transition-all hover:shadow-sm cursor-pointer`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {notification.type === 'weather' && <CloudRain size={16} className={notification.read ? "text-neutral-400" : "text-blue-500 dark:text-blue-400"} />}
                        {notification.type === 'advice' && <MessageCircle size={16} className={notification.read ? "text-neutral-400" : "text-green-500 dark:text-green-400"} />}
                        {notification.type === 'market' && <TrendingUp size={16} className={notification.read ? "text-neutral-400" : "text-purple-500 dark:text-purple-400"} />}
                        <span className={`text-sm font-bold ${notification.read ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-900 dark:text-neutral-100'}`}>{notification.title}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">{notification.time}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${notification.read ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-700 dark:text-neutral-200'}`}>{notification.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {selectedCropId && (
        <CropDetailModal 
          isOpen={!!selectedCropId}
          onClose={() => setSelectedCropId(null)}
          userCrop={userCrops.find(c => c.id === selectedCropId)}
          cropInfo={cropRegistry.find(c => c.id === userCrops.find(uc => uc.id === selectedCropId)?.cropId)}
          marketData={marketWatchlist.find(m => m.id === userCrops.find(uc => uc.id === selectedCropId)?.cropId)}
          availableBids={availableBids[userCrops.find(uc => uc.id === selectedCropId)?.cropId || '']}
          preferredLang={preferredLang}
          t={t}
          getCropEmoji={getCropEmoji}
          onBookTransport={(bid) => {
            setLogisticsPreFill({
              crop: cropRegistry.find(c => c.id === userCrops.find(uc => uc.id === selectedCropId)?.cropId),
              bid: bid
            });
            setActiveTab('logistics');
            setSelectedCropId(null);
          }}
        />
      )}
      </div>
    </Protected>
  );
}

