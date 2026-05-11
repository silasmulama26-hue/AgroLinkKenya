"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  History, 
  BrainCircuit, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ChevronRight,
  Sprout,
  Droplets,
  ThermometerSun,
  Scale,
  Clock,
  Camera,
  Truck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

interface CropDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCrop: any;
  cropInfo: any;
  marketData?: any;
  availableBids?: any[];
  preferredLang: 'en' | 'sw';
  t: any;
  getCropEmoji: (name: string) => string;
  onBookTransport?: (bid: any) => void;
}

export default function CropDetailModal({ 
  isOpen, 
  onClose, 
  userCrop, 
  cropInfo, 
  marketData, 
  availableBids = [],
  preferredLang, 
  t,
  getCropEmoji,
  onBookTransport
}: CropDetailModalProps) {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [qualityHistory, setQualityHistory] = useState<any[]>([]);
  const [localMarketData, setLocalMarketData] = useState<any>(marketData);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (marketData) {
      setLocalMarketData(marketData);
    }
  }, [marketData]);

  useEffect(() => {
    if (isOpen && userCrop) {
      // Fetch market data if missing
      const fetchMarketStatus = async () => {
        if (!localMarketData || !localMarketData.history) {
          setIsSyncing(true);
          try {
            const res = await fetch(`/api/market/watchlist?crops=${userCrop.cropId}`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.length > 0) {
                setLocalMarketData(data[0]);
              }
            }
          } catch (err) {
            console.error("Failed to sync market data:", err);
          } finally {
            setIsSyncing(false);
          }
        }
      };

      // Fetch quality reports for this crop
      const fetchReports = async () => {
        try {
          const res = await fetch(`/api/crops/quality-reports?cropId=${userCrop.cropId}`);
          if (res.ok) {
            const data = await res.json();
            setQualityHistory(data);
          }
        } catch (err) {
          console.error("Failed to fetch reports:", err);
        }
      };
      
      const generateInsight = async () => {
        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;
        
        setIsLoadingInsight(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
          
          const prompt = `
            You are an expert Kenyan agronomist and market analyst.
            Provide a deep professional insight for a farmer growing ${cropInfo.name} in their current stage: ${userCrop.stage}.
            Crop Details: ${userCrop.area} acres.
            Market Context: Current price is KSh ${marketData?.currentPrice || 'unknown'}/kg with a ${marketData?.trend || 'stable'} trend.
            
            Give one paragraph (3-4 sentences) of actionable advice covering both agronomy (farming tips for the current stage) and market strategy (when to sell).
            Language: ${preferredLang === 'sw' ? 'Swahili' : 'English'}.
            Be specific to the Kenyan context.
          `;
          
          const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
          });
          setAiInsight(result.text || "");
        } catch (err) {
          console.error("Failed to generate AI insight:", err);
        } finally {
          setIsLoadingInsight(false);
        }
      };

      fetchReports();
      generateInsight();
      fetchMarketStatus();
    }
  }, [isOpen, userCrop, cropInfo, marketData, preferredLang, localMarketData]);

  if (!isOpen || !userCrop) return null;

  const stageProgress = {
    'planting': 20,
    'growing': 50,
    'harvesting': 85,
    'stored': 100
  }[userCrop.stage as string] || 10;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 border border-neutral-200 dark:border-neutral-800">
        
        {/* Header */}
        <div className="p-5 md:p-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-950/20">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl border border-green-100 dark:border-green-800 shadow-sm">
              {getCropEmoji(cropInfo?.name || '')}
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                {preferredLang === 'sw' ? cropInfo?.localNameSw : cropInfo?.name}
              </h2>
              <p className="text-[10px] md:text-sm text-neutral-500 font-bold uppercase tracking-widest mt-0.5">
                {userCrop.area} Acres • {userCrop.stage}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 md:p-2.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8 no-scrollbar">
          
          {/* Top Grid: Stats - More robust on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-neutral-400">
                <Calendar size={12} className="shrink-0" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">{t.planted}</span>
              </div>
              <span className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                {new Date(userCrop.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-neutral-400">
                <TrendingUp size={12} className="shrink-0" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">{t.currentPrice}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                  KSh {localMarketData?.currentPrice || '--'}
                </span>
                <span className="text-[10px] font-medium text-neutral-500">/kg</span>
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-neutral-400">
                <Scale size={12} className="shrink-0" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">Yield Est.</span>
              </div>
              <span className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                {localMarketData ? `${(userCrop.area * 18).toFixed(0)}-${(userCrop.area * 22).toFixed(0)} bags` : '--'}
              </span>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-neutral-400">
                <Clock size={12} className="shrink-0" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">Est. Harvest</span>
              </div>
              <span className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                Oct 2026
              </span>
            </div>
          </div>

          {/* Progress Bar Detail */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Sprout size={18} className="text-green-600" />
                {t.growthStage}
              </h3>
              <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-100 dark:border-green-800">
                {stageProgress}% Complete
              </span>
            </div>
            <div className="relative h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-6">
              <div 
                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-1000 shadow-[0_0_10px_rgba(22,163,74,0.3)]"
                style={{ width: `${stageProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[9px] md:text-[10px] font-bold uppercase tracking-tighter">
              <div className={userCrop.stage === 'planting' ? 'text-green-600' : 'text-neutral-400'}>Planting</div>
              <div className={userCrop.stage === 'growing' ? 'text-green-600' : 'text-neutral-400'}>Growing</div>
              <div className={userCrop.stage === 'harvesting' ? 'text-green-600' : 'text-neutral-400'}>Harvesting</div>
              <div className={userCrop.stage === 'stored' ? 'text-green-600' : 'text-neutral-400'}>Stored</div>
            </div>
          </div>

          {/* Main Grid: AI & Market */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* AI Insights Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit size={20} className="text-green-600" />
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100">AI Deep Insights</h3>
              </div>
              <div className="bg-green-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl min-h-[160px] flex items-center">
                <Sparkles size={100} className="absolute -bottom-10 -right-5 text-white/5" />
                <div className="relative z-10">
                  {isLoadingInsight ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm font-medium animate-pulse">Generating personalized advice...</span>
                    </div>
                  ) : aiInsight ? (
                    <p className="text-sm md:text-base leading-relaxed font-semibold italic animate-in fade-in slide-in-from-bottom-2 duration-500">
                      &ldquo;{aiInsight}&rdquo;
                    </p>
                  ) : (
                    <p className="text-sm opacity-60">Complete more quality scans and tracking to unlock deeper AI insights.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Market History Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-blue-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100">{t.historicalData}</h3>
                </div>
                {localMarketData && (
                  <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-700 dark:text-green-400">
                      {isSyncing ? 'Syncing...' : 'Connected'}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 md:p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm h-[220px] md:h-[240px]">
                {localMarketData?.history ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={localMarketData.history || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Bar 
                        dataKey="price" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      >
                        {(localMarketData.history || []).map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === (localMarketData.history?.length || 0) - 1 ? '#16a34a' : '#3b82f6'} 
                            fillOpacity={0.7}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                    <TrendingUp size={32} className={`opacity-20 ${isSyncing ? 'animate-bounce' : ''}`} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {isSyncing ? 'Connecting to KilimoSTAT...' : 'Connect to live market to see trends'}
                    </p>
                    {!isSyncing && (
                      <button 
                        onClick={() => {
                          const fetchMarketStatus = async () => {
                            setIsSyncing(true);
                            try {
                              const res = await fetch(`/api/market/watchlist?crops=${userCrop.cropId}`);
                              if (res.ok) {
                                const data = await res.json();
                                if (data && data.length > 0) setLocalMarketData(data[0]);
                              }
                            } catch (err) { console.error(err); }
                            finally { setIsSyncing(false); }
                          };
                          fetchMarketStatus();
                        }}
                        className="mt-2 text-[10px] font-black text-blue-600 underline underline-offset-4 uppercase tracking-widest hover:text-blue-700"
                      >
                        Try connecting now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Bids Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale size={20} className="text-orange-600" />
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100">{t.availableBids}</h3>
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-800/20 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-800">
                {availableBids.length} {preferredLang === 'sw' ? 'hai' : 'active'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableBids.length > 0 ? (
                availableBids.slice(0, 3).map((bid: any) => (
                  <div key={bid.id} className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 font-bold border border-neutral-200 dark:border-neutral-600">
                          {bid.buyer.charAt(0)}
                        </div>
                        <div className="text-right">
                          <p className="text-base font-black text-green-700 dark:text-green-400 leading-none">KSh {bid.pricePerKg}</p>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">per unit</p>
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-neutral-100 mb-1">{bid.buyer}</h4>
                      <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs mb-4">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{bid.location}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onBookTransport?.(bid)}
                      className="w-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-orange-100 dark:border-orange-900/40"
                    >
                      <Truck size={14} /> {preferredLang === 'sw' ? 'Agiza Usafiri' : 'Book Transport'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-neutral-50 dark:bg-neutral-800/50 p-8 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400">
                  <TrendingUp size={32} className="mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No active bids for {cropInfo?.name} currently</p>
                </div>
              )}
            </div>
          </div>

          {/* Quality History Section */}
          {qualityHistory.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera size={20} className="text-green-600" />
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100">Quality History</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qualityHistory.slice(0, 3).map((report) => (
                  <div key={report.id} className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-neutral-200 dark:bg-neutral-700 overflow-hidden shrink-0">
                      <img src={report.image} alt="Quality Scan" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                          report.grade.includes('A') ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 border-blue-200 bg-blue-50'
                        }`}>{report.grade}</span>
                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium line-clamp-2 leading-tight">
                        {report.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        
        {/* Footer Actions - Stickier on mobile */}
        <div className="p-5 md:p-8 bg-neutral-50 dark:bg-neutral-950/40 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-3 md:gap-4 pb-8 md:pb-8">
          <button 
            onClick={() => {
              onClose();
            }}
            className="flex-1 bg-green-700 text-white font-black py-4 rounded-2xl md:rounded-2xl text-xs uppercase tracking-widest hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 active:scale-95 flex items-center justify-center gap-2"
          >
            Ask Advisor About This {cropInfo?.name} <ChevronRight size={16} />
          </button>
          <button 
            onClick={onClose}
            className="w-full md:w-32 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-black py-4 rounded-2xl md:rounded-2xl text-xs uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all active:scale-95"
          >
            {t.cancel}
          </button>
        </div>

      </div>
    </div>
  );
}
