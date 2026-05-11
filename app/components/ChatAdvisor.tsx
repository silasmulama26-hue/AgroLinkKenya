"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Send, X, Loader2, MessageCircle, ChevronRight, ImageIcon, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export default function ChatAdvisor({ farmer, preferredLang: initialLang }: any) {
  const [localLang, setLocalLang] = useState<"en" | "sw">(initialLang || "sw");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [marketTrends, setMarketTrends] = useState<any>(null);

  const advisorTranslations = {
    en: {
      onlineContext: "Online • Knows {county} Context",
      askQuestionPlaceholder: "Ask a question about your crops...",
      tryAsking: "Try asking:",
      aiAdvisor: "AgriLink Advisor",
      justNow: "Just Now",
      networkError: "Sorry, I ran into a network error.",
      defaultModelResponse: "Sorry, I couldn't process that. Please try again.",
      greeting: (name: string, county: string, crop: string) => `Hello, Farmer ${name}. I see you are in ${county} according to your profile and you are growing ${crop}.`,
      helpText: "How can I help you with your farm today? You can also upload a photo of your crop to check for diseases.",
      suggestions: [
        'What is the maize price today?',
        'How to prevent maize pests?',
        'Which fertilizer is best for this season?'
      ]
    },
    sw: {
      onlineContext: "Mkondoni • Anajua mazingira ya {county}",
      askQuestionPlaceholder: "Uliza swali kuhusu mazao yako...",
      tryAsking: "Jaribu kuuliza:",
      aiAdvisor: "Mshauri wa AgriLink",
      justNow: "Sasa hivi",
      networkError: "Samahani, kumekuwa na tatizo la kimtandao.",
      defaultModelResponse: "Samahani, sikuweza kushughulikia hilo. Tafadhali jaribu tena.",
      greeting: (name: string, county: string, crop: string) => `Habari, Mkulima ${name}. Naona uko ${county} kulingana na wasifu wako na unakuza ${crop}.`,
      helpText: "Nikusaidie aje leo kuhusu shamba lako? Unaweza kupakia picha ya mmea unaougua nikuambie ugonjwa.",
      suggestions: [
        'Bei ya mahindi leo ni gani?',
        'Jinsi ya kuzuia wadudu wa mahindi?',
        'Ni mbolea gani bora kwa msimu huu?'
      ]
    }
  };

  const adT = advisorTranslations[localLang];

  const swahiliModeToggle = () => {
    setLocalLang(prev => prev === 'en' ? 'sw' : 'en');
  };

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch('/api/market/trends?crop=Maize');
        const data = await res.json();
        setMarketTrends(data);
      } catch (e) {
        console.error("Market fetch fail for chat", e);
      }
    };
    fetchMarket();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxDim) {
              height = Math.round(height * (maxDim / width));
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round(width * (maxDim / height));
              height = maxDim;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setSelectedImage(canvas.toDataURL('image/jpeg', 0.8));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      // Prepare history: Convert existing messages to Gemini format
      // We skip images in old history to save tokens/bandwidth unless strictly necessary
      const history = messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Prepare current parts
      const currentParts: any[] = [];
      if (newMessage.image) {
        const base64Data = newMessage.image.split(',')[1];
        const mimeType = newMessage.image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
        currentParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        });
      }
      if (newMessage.text) {
        currentParts.push({ text: newMessage.text });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: currentParts }
        ],
        config: {
          systemInstruction: `You are AgriLink AI Advisor, an expert agronomist specialized in Kenyan farming, specifically for ${farmer.county} County. 
          The user is growing ${Object.values(farmer.crops)[0] ? (Object.values(farmer.crops)[0] as any).name : 'crops'}. 
          ${localLang === 'sw' ? 'Respond in Swahili.' : 'Respond in English.'} 
          
          CURRENT MARKET CONTEXT FOR ${farmer.county}:
          - Maize Price: ${marketTrends?.currentPrice || 'Loading...'} KSh/kg
          - Trend: ${marketTrends?.trend || 'Stable'}
          - Confidence Score: ${marketTrends?.confidence || '0.75'}
          
          Help them detect pests/diseases from photos or answer general questions. 
          STRICT RULE: If they ask about prices or selling, use the MARKET CONTEXT above. Do NOT hallucinate other prices. 
          
          FORMATTING RULES:
          - Use Markdown for all responses.
          - Use bold text for key terms and advice.
          - Use bullet points or numbered lists for steps.
          - Use subheadings (###) for distinct sections like "Immediate Actions", "Long-term Prevention", etc.
          - Keep answers practical, structured, and friendly.`,
        },
      });

      const aiText = response.text || adT.defaultModelResponse;
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', text: aiText },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', text: adT.networkError },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 md:p-8 h-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex-1 bg-white dark:bg-neutral-900 md:rounded-3xl md:border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col overflow-hidden relative">
        <div className="p-3 md:p-4 border-b border-neutral-100 dark:border-neutral-800 bg-green-50/80 dark:bg-green-950/20 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-green-700 text-white rounded-xl md:rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle size={18} className="md:size-6" />
            </div>
            <div>
              <h2 className="font-black text-sm md:text-lg text-neutral-900 dark:text-neutral-100 tracking-tight leading-none mb-1">{adT.aiAdvisor}</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[9px] md:text-xs text-green-700 dark:text-green-400 font-bold uppercase tracking-wider">
                  {adT.onlineContext.replace("{county}", farmer.county)}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={swahiliModeToggle}
            className="text-[9px] md:text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 px-2.5 py-1.5 rounded-lg font-black hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm uppercase tracking-widest active:scale-95"
          >
            {localLang === 'sw' ? '🇺🇸 EN' : '🇰🇪 SW'}
          </button>
        </div>
        
        <div className="flex-1 p-3 md:p-6 flex flex-col gap-3 md:gap-5 overflow-y-auto bg-neutral-50/50 dark:bg-neutral-950/50 scroll-smooth no-scrollbar">
          <div className="max-w-[85%] sm:max-w-[75%] text-left self-start">
            <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700/50 p-3.5 md:p-5 rounded-2xl rounded-tl-none shadow-sm text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed transition-all">
              {adT.greeting(
                farmer.firstName, 
                farmer.county, 
                Object.values(farmer.crops)[0] ? (Object.values(farmer.crops)[0] as any).name : 'crops'
              )}
              <br/><br/>
              {adT.helpText}
            </div>
            <span className="text-[10px] text-neutral-400 mt-2 block ml-1 uppercase tracking-wider font-black opacity-60">AgriLink Advisor • {adT.justNow}</span>
          </div>

          {messages.length === 0 && (
            <div className="grid grid-cols-1 gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1">{adT.tryAsking}</p>
              {adT.suggestions.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="text-left bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-3 px-4 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:border-green-500 hover:text-green-700 dark:hover:text-green-400 transition-all shadow-sm active:scale-95 flex items-center justify-between group"
                >
                  {suggestion}
                  <ChevronRight size={14} className="text-neutral-300 group-hover:text-green-500 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'self-end' : 'self-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`p-3.5 md:p-5 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-green-700 text-white rounded-tr-none border border-green-800 shadow-green-100/20' : 'bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700/50 text-neutral-800 dark:text-neutral-200 rounded-tl-none'}`}>
                {msg.image && (
                  <div className="relative mb-3 group">
                    <img src={msg.image} alt="Uploaded crop photo" className="max-w-full h-auto rounded-xl border border-black/5" />
                  </div>
                )}
                <div className={`markdown-body ${msg.role === 'model' ? 'prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:mb-2 prose-headings:mt-4 prose-headings:text-neutral-900 dark:prose-headings:text-white prose-li:my-1' : ''}`}>
                  {msg.role === 'model' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-1.5 mt-1.5 ${msg.role === 'user' ? 'justify-end mr-1' : 'ml-1'}`}>
                {msg.role === 'model' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-black">
                  {msg.role === 'user' ? 'You' : 'AgriLink AI'}
                </span>
                {msg.role === 'user' && <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="max-w-[85%] sm:max-w-[75%] self-start flex items-center gap-3 animate-in fade-in duration-200">
               <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700/50 px-4 py-3.5 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 md:p-6 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
          {selectedImage && (
            <div className="mb-3 relative inline-block animate-in zoom-in duration-200">
              <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-2xl border-2 border-green-500/20 shadow-md" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-neutral-900 text-white rounded-full p-1.5 shadow-lg hover:bg-red-500 active:scale-90 transition-all border-2 border-white dark:border-neutral-900"
              >
                <X size={12} />
              </button>
            </div>
          )}
          
          <div className="relative flex items-end gap-2 bg-neutral-50 dark:bg-neutral-800/80 p-1.5 rounded-[22px] border border-neutral-200 dark:border-neutral-700/50 shadow-sm transition-all focus-within:shadow-md focus-within:border-green-500/50 focus-within:bg-white dark:focus-within:bg-neutral-800/90 group">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-green-700 dark:hover:text-green-400 rounded-2xl transition-all shrink-0 active:scale-90 bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700 group-focus-within:border-green-100 dark:group-focus-within:border-green-900/30"
              title="Upload photo"
            >
              <Camera size={20} />
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            </button>
            
            <div className="flex-1 min-w-0 flex items-center relative py-1">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={adT.askQuestionPlaceholder}
                className="w-full bg-transparent border-none outline-none resize-none px-2 py-2 text-sm max-h-32 min-h-[40px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 font-medium leading-relaxed overflow-y-auto no-scrollbar"
                rows={1}
              ></textarea>
            </div>

            <button 
              onClick={handleSendMessage}
              disabled={(!input.trim() && !selectedImage) || isTyping}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                (input.trim() || selectedImage) && !isTyping 
                  ? 'bg-green-700 text-white shadow-lg shadow-green-700/20 active:scale-95 hover:bg-green-800 hover:translate-y-[-1px]' 
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed opacity-50'
              }`}
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          
          <div className="mt-2 text-[9px] text-neutral-400 font-bold uppercase tracking-widest text-center px-4 flex items-center justify-center gap-1.5 opacity-50">
             <Sparkles size={10} className="text-amber-500" />
             AI Advisor can make mistakes. Verify important info.
          </div>
        </div>
      </div>
    </div>
  );
}
