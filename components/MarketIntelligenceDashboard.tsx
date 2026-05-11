
'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Sparkles,
  Loader2,
  ChevronRight,
  History,
  LayoutDashboard,
  BrainCircuit,
  Percent
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { MARKETS, REGION_CROP_PRICES, MOCK_BIDS } from '@/lib/market-data';
import { CROP_REGISTRY } from '@/lib/market-engine';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

interface MarketDashboardProps {
  farmerId: string;
  county: string;
  preferredLang: 'en' | 'sw';
}

export default function MarketIntelligenceDashboard({ farmerId, county, preferredLang }: MarketDashboardProps) {
  const [selectedCrop, setSelectedCrop] = useState('Maize');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState(30);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Generate mock chart data based on selection
  const chartData = useMemo(() => {
    const basePrices: Record<string, number> = {
      'Maize': 40,
      'Beans': 110,
      'Sorghum': 35,
      'Millet': 70,
      'Green Grams': 120,
      'Sukuma Wiki': 30,
      'Tomatoes': 80,
      'Potatoes': 50,
      'Cassava': 25
    };

    const base = basePrices[selectedCrop] || 50;
    const data = [];
    const now = new Date();
    
    for (let i = selectedTimeRange; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Seasonal fluctuation simulation
      const month = date.getMonth();
      const seasonFactor = (month >= 3 && month <= 6) ? 1.2 : (month >= 9 && month <= 11) ? 0.8 : 1.0;
      
      const randomWalk = (Math.random() - 0.48) * (base * 0.05); // Slight upward bias
      const price = base * seasonFactor + randomWalk + (selectedTimeRange - i) * 0.1;
      
      data.push({
        name: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        price: Math.round(price),
        avg: Math.round(base * seasonFactor)
      });
    }
    return data;
  }, [selectedCrop, selectedTimeRange]);

  const currentPrice = chartData[chartData.length - 1].price;
  const previousPrice = chartData[0].price;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(1);

  // Regional comparisons
  const regionalData = useMemo(() => {
    const cropPrices = REGION_CROP_PRICES[selectedCrop] || {
      'Central': 40,
      'Coastal': 45,
      'Nyanza': 42,
      'Rift Valley': 38,
      'Eastern': 41
    };
    
    return Object.entries(cropPrices).map(([region, price]) => ({
      region,
      price: price as number
    })).sort((a, b) => b.price - a.price);
  }, [selectedCrop]);

  const getAiInsight = async () => {
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert agricultural market analyst in Kenya. 
        Analyze the current market for ${selectedCrop} in ${county}. 
        The current price is roughly KSh ${currentPrice}/kg. 
        Provide a 2-sentence market prediction (e.g., if prices will rise/fall due to supply/season) 
        and 1 specific recommendation for a farmer (e.g., when to sell). 
        Keep it very practical and localized. Language: ${preferredLang === 'sw' ? 'Swahili' : 'English'}.`,
      });
      setAiInsight(response.text);
    } catch (err) {
      console.error(err);
      setAiInsight(preferredLang === 'sw' ? "Hatuwezi kupata uchambuzi kwa sasa." : "Unable to generate analysis right now.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    setAiInsight(null);
  }, [selectedCrop]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <LayoutDashboard className="text-green-600" />
            {preferredLang === 'sw' ? 'Uchambuzi wa Soko' : 'Market Intelligence'}
          </h2>
          <p className="text-xs text-neutral-500 font-medium font-mono uppercase tracking-widest">
            {preferredLang === 'sw' ? 'Data za soko za hivi karibuni' : 'Real-time regional price analytics'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-green-600" size={14} />
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl text-xs font-bold ring-1 ring-neutral-200 dark:ring-neutral-700 focus:ring-2 focus:ring-green-500 transition-all outline-none appearance-none"
            >
              {CROP_REGISTRY.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
            {[7, 30, 90].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeRange(t)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedTimeRange === t 
                    ? 'bg-white dark:bg-neutral-700 text-green-700 dark:text-green-400 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Trend Analysis */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] block mb-2">Price Trend</span>
                <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-neutral-100">
                  {selectedCrop} <span className="text-neutral-400 dark:text-neutral-600 font-medium">Analytics</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100">KSh {currentPrice}</span>
                <div className={`flex items-center justify-end gap-1 text-sm font-bold ${Number(priceChangePercent) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {Number(priceChangePercent) >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {priceChangePercent}%
                </div>
              </div>
            </div>

            <div className="h-[300px] md:h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.4} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '16px',
                      backgroundColor: 'rgba(255,255,255,0.95)'
                    }}
                    itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                    labelStyle={{ marginBottom: '4px', opacity: 0.5, fontSize: '10px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#16a34a" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    animationDuration={2000}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#16a34a' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={0} 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Region Heatmap / Price Bar Chart */}
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                <MapPin size={20} />
              </div>
              <h4 className="font-extrabold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">Regional Variations</h4>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData}>
                  <XAxis dataKey="region" hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="price" radius={[8, 8, 0, 0]} barSize={40}>
                    {regionalData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.region === 'Rift Valley' ? '#16a34a' : '#e2e8f0'} 
                        className="dark:fill-neutral-800"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {regionalData.map((item) => (
                <div key={item.region} className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 text-center">
                  <span className="block text-[8px] font-black uppercase text-neutral-400 tracking-widest mb-1">{item.region}</span>
                  <span className="text-sm font-black text-neutral-900 dark:text-neutral-100">KSh {item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insight & Marketplace */}
        <div className="flex flex-col gap-6">
          {/* AI Predictor Block */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 group">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                  <BrainCircuit size={20} />
                </div>
                <h3 className="font-black text-lg uppercase tracking-widest">Gemini Market Advisor</h3>
              </div>

              {!aiInsight && !isAnalyzing && (
                <div className="flex flex-col gap-4">
                  <p className="text-indigo-100/80 text-sm font-medium leading-relaxed italic">
                    Tap to generate an AI-powered forecast for {selectedCrop} in your specific region.
                  </p>
                  <button 
                    onClick={getAiInsight}
                    className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all shadow-xl active:scale-95"
                  >
                    <Sparkles size={16} /> Predict Trend
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <Loader2 className="animate-spin text-white/50" size={40} />
                  <p className="text-sm font-bold uppercase tracking-widest text-indigo-100 animate-pulse">Running analysis...</p>
                </div>
              )}

              {aiInsight && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-sm leading-relaxed font-medium">
                      {aiInsight}
                    </p>
                  </div>
                  <button 
                    onClick={() => setAiInsight(null)}
                    className="text-[10px] font-black uppercase tracking-wider text-indigo-200 hover:text-white transition-colors"
                  >
                    Refresh Analysis
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Quick Insights Cards */}
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] p-6 border border-amber-100 dark:border-amber-900/30">
            <h4 className="text-sm font-black text-amber-900 dark:text-amber-100 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History size={16} /> Seasonal Context
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed font-medium">
                  {selectedCrop} prices typically rise by <span className="font-black text-amber-900 dark:text-amber-200">12%</span> during the dry season (Jan-Feb).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed font-medium">
                  Rift Valley region currently reports a <span className="font-black text-amber-900 dark:text-amber-200">supply surplus</span>, lowering bulk prices.
                </p>
              </div>
            </div>
          </div>

          {/* Live Market Bids (Compact) */}
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col flex-1">
             <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight text-sm">Top Bids Near You</h4>
                <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-[9px] font-black uppercase">Live</div>
             </div>
             
             <div className="space-y-3">
               {MOCK_BIDS.filter(b => b.location.toLowerCase() === county.toLowerCase() || b.location === 'Nairobi').slice(0, 3).map(bid => (
                 <div key={bid.id} className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 hover:border-blue-400 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[10px] font-black text-neutral-400 group-hover:text-blue-600 transition-colors">{bid.buyer}</span>
                       <span className="text-xs font-black text-neutral-900 dark:text-neutral-100">KSh {bid.pricePerKg}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-neutral-500 font-bold">{bid.quantity} • {bid.location}</span>
                       <button className="p-1 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-[8px] font-black uppercase text-blue-600">View</button>
                    </div>
                 </div>
               ))}
             </div>

             <button className="mt-6 w-full py-3 text-neutral-400 dark:text-neutral-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-green-600 transition-colors flex items-center justify-center gap-2">
               Show All Bids <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
