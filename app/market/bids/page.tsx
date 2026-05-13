"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Phone,
  MessageCircle,
  Filter,
  Search,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Users,
  Package,
  Calendar
} from "lucide-react";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import HamburgerNav from "@/components/navigation/HamburgerNav";
import { useAuth } from "@/hooks/use-auth";

const translations = {
  en: {
    marketBids: "Market Bids",
    liveBids: "Live Market Bids",
    activeBids: "Active Bids",
    myBids: "My Bids",
    bidHistory: "Bid History",
    filterBy: "Filter by",
    cropType: "Crop Type",
    location: "Location",
    priceRange: "Price Range",
    quality: "Quality",
    allCrops: "All Crops",
    allLocations: "All Locations",
    allQualities: "All Qualities",
    searchBids: "Search bids...",
    sortBy: "Sort by",
    newest: "Newest",
    priceHigh: "Price: High to Low",
    priceLow: "Price: Low to High",
    distance: "Distance",
    buyer: "Buyer",
    offering: "Offering",
    quantity: "Quantity",
    unit: "Unit",
    qualityGrade: "Quality Grade",
    timeLeft: "Time Left",
    expiresIn: "Expires in",
    hours: "hours",
    minutes: "minutes",
    placeBid: "Place Bid",
    contactBuyer: "Contact Buyer",
    viewDetails: "View Details",
    acceptBid: "Accept Bid",
    counterOffer: "Counter Offer",
    bidAccepted: "Bid Accepted",
    bidRejected: "Bid Rejected",
    noActiveBids: "No active bids match your criteria",
    noActiveBidsDesc: "Try adjusting your filters or check back later for new opportunities.",
    bidPlaced: "Bid placed successfully!",
    bidPlacedDesc: "The buyer will be notified of your interest.",
    contactInfo: "Contact Information",
    phone: "Phone",
    email: "Email",
    negotiate: "Negotiate",
    bidAmount: "Bid Amount",
    yourBid: "Your Bid",
    minimumBid: "Minimum Bid",
    submitBid: "Submit Bid",
    cancel: "Cancel",
    bidTooLow: "Bid amount is too low",
    bidSubmitted: "Bid submitted successfully",
    negotiationStarted: "Negotiation started",
    marketInsights: "Market Insights",
    averagePrice: "Average Price",
    totalVolume: "Total Volume",
    activeBuyers: "Active Buyers",
    trending: "Trending",
    rising: "Rising",
    falling: "Falling",
    stable: "Stable",
    lastUpdated: "Last updated",
    ago: "ago",
    justNow: "just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago"
  },
  sw: {
    marketBids: "Zabuni za Soko",
    liveBids: "Zabuni za Soko Hai",
    activeBids: "Zabuni Hai",
    myBids: "Zabuni Zangu",
    bidHistory: "Historia ya Zabuni",
    filterBy: "Chuja kwa",
    cropType: "Aina ya Zao",
    location: "Eneo",
    priceRange: "Masafa ya Bei",
    quality: "Ubora",
    allCrops: "Mazia Yote",
    allLocations: "Maeneo Yote",
    allQualities: "Ubora Wote",
    searchBids: "Tafuta zabuni...",
    sortBy: "Panga kwa",
    newest: "Mpya Zaidi",
    priceHigh: "Bei: Juu hadi Chini",
    priceLow: "Bei: Chini hadi Juu",
    distance: "Umbali",
    buyer: "Mnunuzi",
    offering: "Inatoa",
    quantity: "Kiasi",
    unit: "Kitengo",
    qualityGrade: "Daraja la Ubora",
    timeLeft: "Muda Ulioachwa",
    expiresIn: "Inaisha katika",
    hours: "saa",
    minutes: "dakika",
    placeBid: "Weka Zabuni",
    contactBuyer: "Wasiliana na Mnunuzi",
    viewDetails: "Angalia Maelezo",
    acceptBid: "Kubali Zabuni",
    counterOffer: "Pendekezo la Kupinga",
    bidAccepted: "Zabuni Imekubaliwa",
    bidRejected: "Zabuni Imekataliwa",
    noActiveBids: "Hakuna zabuni hai zinazolingana na vigezo vyako",
    noActiveBidsDesc: "Jaribu kubadilisha vichujio vyako au angalia baadaye kwa fursa mpya.",
    bidPlaced: "Zabuni imewekwa kwa mafanikio!",
    bidPlacedDesc: "Mnunuzi ataarifiwa kuhusu nia yako.",
    contactInfo: "Maelezo ya Mawasiliano",
    phone: "Simu",
    email: "Barua pepe",
    negotiate: "Jadili",
    bidAmount: "Kiasi cha Zabuni",
    yourBid: "Zabuni Yako",
    minimumBid: "Zabuni ya Chini",
    submitBid: "Wasilisha Zabuni",
    cancel: "Ghairi",
    bidTooLow: "Kiasi cha zabuni ni cha chini sana",
    bidSubmitted: "Zabuni imewasilishwa kwa mafanikio",
    negotiationStarted: "Mazungumzo yameanza",
    marketInsights: "Maarifa ya Soko",
    averagePrice: "Bei ya Wastani",
    totalVolume: "Jumla ya Kiasi",
    activeBuyers: "Wanunuzi Hai",
    trending: "Inayopanda",
    rising: "Inapanda",
    falling: "Inashuka",
    stable: "Imara",
    lastUpdated: "Ilisasishwa mwisho",
    ago: "iliyopita",
    justNow: "sasa hivi",
    minutesAgo: "dakika zilizopita",
    hoursAgo: "saa zilizopita",
    daysAgo: "siku zilizopita"
  }
};

// Mock data for demonstration
const mockBids = [
  {
    id: 1,
    buyer: "AgroCorp Ltd",
    cropType: "Maize",
    quantity: 500,
    unit: "bags",
    price: 3200,
    currency: "KES",
    quality: "Grade A",
    location: "Nairobi",
    distance: 45,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    description: "Looking for premium Grade A maize for export market",
    buyerContact: { phone: "+254 700 123 456", email: "procurement@agrocrop.co.ke" },
    status: "active"
  },
  {
    id: 2,
    buyer: "FarmFresh Kenya",
    cropType: "Beans",
    quantity: 200,
    unit: "bags",
    price: 4500,
    currency: "KES",
    quality: "Grade B",
    location: "Nakuru",
    distance: 120,
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    description: "Need quality beans for local distribution",
    buyerContact: { phone: "+254 722 987 654", email: "purchases@farmfresh.co.ke" },
    status: "active"
  },
  {
    id: 3,
    buyer: "Green Valley Traders",
    cropType: "Avocado",
    quantity: 100,
    unit: "kg",
    price: 120,
    currency: "KES",
    quality: "Premium",
    location: "Thika",
    distance: 25,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    description: "Fresh Hass avocados needed for supermarket chain",
    buyerContact: { phone: "+254 733 456 789", email: "orders@greenvalley.co.ke" },
    status: "active"
  }
];

const marketInsights = {
  averagePrice: { maize: 3100, beans: 4400, avocado: 115 },
  totalVolume: { maize: 2500, beans: 1200, avocado: 800 },
  activeBuyers: 24,
  trends: [
    { crop: "Maize", trend: "rising", change: "+5.2%" },
    { crop: "Beans", trend: "stable", change: "+0.8%" },
    { crop: "Avocado", trend: "falling", change: "-2.1%" }
  ]
};

export default function MarketBidsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    cropType: "all",
    location: "all",
    quality: "all",
    sortBy: "newest"
  });

  const t = translations[preferredLang];

  // Filter and sort bids
  const filteredBids = mockBids
    .filter(bid => {
      const matchesSearch = bid.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bid.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bid.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCrop = filters.cropType === "all" || bid.cropType === filters.cropType;
      const matchesLocation = filters.location === "all" || bid.location === filters.location;
      const matchesQuality = filters.quality === "all" || bid.quality === filters.quality;

      return matchesSearch && matchesCrop && matchesLocation && matchesQuality;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "priceHigh":
          return b.price - a.price;
        case "priceLow":
          return a.price - b.price;
        case "distance":
          return a.distance - b.distance;
        default:
          return b.expiresAt.getTime() - a.expiresAt.getTime();
      }
    });

  const handlePlaceBid = (bid: any) => {
    setSelectedBid(bid);
    setBidAmount(bid.price.toString());
    setShowBidModal(true);
  };

  const handleContactBuyer = (bid: any) => {
    setSelectedBid(bid);
    setShowContactModal(true);
  };

  const submitBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount < selectedBid.price) {
      alert(t.bidTooLow);
      return;
    }

    // Mock bid submission
    alert(t.bidSubmitted);
    setShowBidModal(false);
    setSelectedBid(null);
    setBidAmount("");
  };

  const getTimeLeft = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours} ${t.hours}`;
    } else if (minutes > 0) {
      return `${minutes} ${t.minutes}`;
    } else {
      return t.justNow;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "falling":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <ArrowUpDown className="w-4 h-4 text-neutral-500" />;
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
                  activeTab="market"
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
              {t.marketBids}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t.liveBids}
            </p>
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                  {t.averagePrice}
                </span>
              </div>
              <p className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                KES {marketInsights.averagePrice.maize.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500">Maize (avg)</p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                  {t.totalVolume}
                </span>
              </div>
              <p className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                {marketInsights.totalVolume.maize.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500">Bags today</p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                  {t.activeBuyers}
                </span>
              </div>
              <p className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                {marketInsights.activeBuyers}
              </p>
              <p className="text-xs text-neutral-500">Online now</p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                  {t.trending}
                </span>
              </div>
              <div className="space-y-1">
                {marketInsights.trends.slice(0, 2).map(trend => (
                  <div key={trend.crop} className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400">{trend.crop}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(trend.trend)}
                      <span className={`font-bold ${trend.change.startsWith('+') ? 'text-green-600' : trend.change.startsWith('-') ? 'text-red-600' : 'text-neutral-600'}`}>
                        {trend.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              {[
                { id: "active", label: t.activeBids },
                { id: "mybids", label: t.myBids },
                { id: "history", label: t.bidHistory }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={t.searchBids}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filters.cropType}
                  onChange={(e) => setFilters(prev => ({ ...prev, cropType: e.target.value }))}
                  className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="all">{t.allCrops}</option>
                  <option value="Maize">Maize</option>
                  <option value="Beans">Beans</option>
                  <option value="Avocado">Avocado</option>
                </select>

                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="all">{t.allLocations}</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Thika">Thika</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="priceHigh">{t.priceHigh}</option>
                  <option value="priceLow">{t.priceLow}</option>
                  <option value="distance">{t.distance}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bids List */}
          <div className="space-y-4">
            {filteredBids.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {t.noActiveBids}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {t.noActiveBidsDesc}
                </p>
              </div>
            ) : (
              filteredBids.map(bid => (
                <div key={bid.id} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {bid.buyer}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {bid.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-green-600">
                            KES {bid.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-neutral-500">
                            per {bid.unit}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {bid.quantity} {bid.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {bid.quality}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {bid.location} ({bid.distance}km)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {getTimeLeft(bid.expiresAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContactBuyer(bid)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                      >
                        <MessageCircle size={16} />
                        {t.contactBuyer}
                      </button>
                      <button
                        onClick={() => handlePlaceBid(bid)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      >
                        <TrendingUp size={16} />
                        {t.placeBid}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bid Modal */}
        {showBidModal && selectedBid && (
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {t.placeBid}
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t.buyer}: {selectedBid.buyer}
                  </label>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {selectedBid.cropType} • {selectedBid.quantity} {selectedBid.unit} • {selectedBid.quality}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t.yourBid} (KES)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={selectedBid.price}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    {t.minimumBid}: KES {selectedBid.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={submitBid}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  {t.submitBid}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && selectedBid && (
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {t.contactInfo}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <Phone className="w-5 h-5 text-neutral-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {t.phone}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {selectedBid.buyerContact.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-neutral-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {t.email}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {selectedBid.buyerContact.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    window.open(`tel:${selectedBid.buyerContact.phone}`);
                    setShowContactModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  {t.negotiate}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}