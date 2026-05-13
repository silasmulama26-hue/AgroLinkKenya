"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, MessageCircle, Sparkles, Send, Mic, MicOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import ChatAdvisor from "@/app/components/ChatAdvisor";

const translations = {
  en: {
    aiAdvisor: "AI Advisor",
    askAnything: "Ask me anything about farming, crops, markets, or weather",
    typeMessage: "Type your farming question...",
    voiceInput: "Voice Input",
    sendMessage: "Send",
    analyzing: "Analyzing your question...",
    suggestions: "Quick Suggestions",
    cropHealth: "Crop Health Analysis",
    marketPrices: "Market Price Predictions",
    weatherForecast: "Weather Impact Assessment",
    pestControl: "Pest & Disease Control",
    soilManagement: "Soil & Fertilizer Management",
    irrigationTips: "Irrigation Optimization"
  },
  sw: {
    aiAdvisor: "Mshauri wa AI",
    askAnything: "Uliza chochote kuhusu kilimo, mazao, masoko, au hali ya hewa",
    typeMessage: "Andika swali lako la kilimo...",
    voiceInput: "Ingizo la Sauti",
    sendMessage: "Tuma",
    analyzing: "Inachanganua swali lako...",
    suggestions: "Mapendekezo ya Haraka",
    cropHealth: "Uchanganuzi wa Afya ya Zao",
    marketPrices: "Utabiri wa Bei za Masoko",
    weatherForecast: "Tathmini ya Athari za Hali ya Hewa",
    pestControl: "Udhibiti wa Wadudu na Magonjwa",
    soilManagement: "Usimamizi wa Udongo na Mbolea",
    irrigationTips: "Uboreshaji wa Umwagiliaji"
  }
};

export default function AIAnalyzePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const t = translations[preferredLang];

  const quickSuggestions = [
    { text: t.cropHealth, icon: "🌱" },
    { text: t.marketPrices, icon: "📈" },
    { text: t.weatherForecast, icon: "🌤️" },
    { text: t.pestControl, icon: "🐛" },
    { text: t.soilManagement, icon: "🌿" },
    { text: t.irrigationTips, icon: "💧" }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // This would integrate with the ChatAdvisor component
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }

    setIsListening(!isListening);

    if (!isListening) {
      // Type assertion for SpeechRecognition API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = preferredLang === 'sw' ? 'sw-KE' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
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
              { id: "inventory", icon: "🌱", label: "Crop Inventory", path: "/crops" },
              { id: "market", icon: "📈", label: "Market Explorer", path: "/market" },
              { id: "weather", icon: "🌤️", label: "Weather", path: "/weather" },
              { id: "scan", icon: "📷", label: "AI Quality Check", path: "/scan" },
              { id: "logistics", icon: "🚛", label: "Logistics", path: "/logistics" },
              { id: "library", icon: "📚", label: "Resource Library", path: "/library" },
              { id: "advisor", icon: "🤖", label: "AI Advisor", path: "/ai/analyze" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  item.path === "/ai/analyze"
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

          {/* AI Advisor Content */}
          <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t.aiAdvisor}</h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{t.askAnything}</p>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden">
              <ChatAdvisor farmer={{ county: "Kakamega", subCounty: "Lurambi" }} t={t} preferredLang={preferredLang} />
            </div>

            {/* Quick Suggestions */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">{t.suggestions}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion.text)}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{suggestion.icon}</span>
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{suggestion.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t.typeMessage}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <button
                    onClick={handleVoiceInput}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all ${
                      isListening
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white disabled:text-neutral-500 rounded-xl font-medium transition-all flex items-center gap-2"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">{t.sendMessage}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
}