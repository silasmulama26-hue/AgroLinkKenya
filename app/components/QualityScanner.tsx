"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle, FileText, Sparkles, CheckCircle, BrainCircuit, TrendingUp, Save, History } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function QualityScanner({ farmer, t, preferredLang }: any) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [assessment, setAssessment] = useState<{grade: string, description: string, advice: string} | null>(null);
  const [translatedAssessment, setTranslatedAssessment] = useState<{grade: string, description: string, advice: string} | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [valuation, setValuation] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pastReports, setPastReports] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch past reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/crops/quality-reports');
        if (res.ok) {
          const data = await res.json();
          setPastReports(data);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    const fetchValuation = async () => {
      if (!assessment) return;
      setIsValidating(true);
      try {
        const marketRes = await fetch('/api/market/trends?crop=Maize');
        const marketData = await marketRes.json();
        const currentPrice = marketData.currentPrice;

        const valRes = await fetch('/api/market/valuation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            grade: assessment.grade, 
            currentMarketPricePerKg: currentPrice,
            estimatedYieldKg: 90 * 15 
          })
        });
        const valData = await valRes.json();
        setValuation(valData);
      } catch (error) {
        console.error("Valuation error:", error);
      } finally {
        setIsValidating(false);
      }
    };

    fetchValuation();
  }, [assessment]);

  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup camera tracks on unmount
  useEffect(() => {
    const videoNode = videoRef.current;
    return () => {
      if (videoNode && videoNode.srcObject) {
        const stream = videoNode.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const translateToSwahili = async (data?: {grade: string, description: string, advice: string}) => {
    const source = data || assessment;
    if (!source || isTranslating) return;
    
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const prompt = `Translate the following crop quality assessment into Swahili. Maintain the exact same format and labels (Daraja, Maelezo, Ushauri):
      
Daraja: ${source.grade}
Maelezo: ${source.description}
Ushauri: ${source.advice}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = response.text || "";
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let grade = source.grade; 
      let description = "";
      let advice = "";

      lines.forEach(line => {
        if (line.toLowerCase().startsWith('daraja:')) {
          grade = line.split(':')[1]?.trim() || grade;
        } else if (line.toLowerCase().startsWith('maelezo:')) {
          description = line.split(':')[1]?.trim() || description;
        } else if (line.toLowerCase().startsWith('ushauri:')) {
          advice = line.split(':')[1]?.trim() || advice;
        }
      });
      
      setTranslatedAssessment({ grade, description, advice });
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
      } catch(e) {
        // Fallback if environment camera constraint fails
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      
      // Provide user-friendly feedback for common camera errors
      if (err.name === 'NotReadableError' || err.message?.includes('could not start')) {
        setError(preferredLang === 'sw' 
          ? 'Kamera inatumiwa na programu nyingine. Tafadhali funga programu nyingine na ujaribu tena.' 
          : 'Camera is being used by another app. Please close other apps and try again.');
      } else if (err.name === 'NotAllowedError') {
        setError(preferredLang === 'sw' 
          ? 'Huruhusiwi kutumia kamera. Tafadhali rekebisha mipangilio ya kivinjari chako.' 
          : 'Camera permission denied. Please enable camera access in your browser settings.');
      }
      
      // Fallback to file input if camera fails
      setIsCameraActive(false);
      setTimeout(() => fileInputRef.current?.click(), 1500);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Limit resolution to prevent API errors with large images
      const maxDim = 1024;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
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
        ctx.drawImage(video, 0, 0, width, height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        stopCamera();
        setSelectedImage(imageDataUrl);
        runAssessment(imageDataUrl);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        runAssessment(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAssessment = async (imageDataContent: string) => {
    setIsScanning(true);
    setError(null);
    setAssessment(null);
    setTranslatedAssessment(null);
    setSaveSuccess(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const base64Data = imageDataContent.split(',')[1];
      const mimeType = imageDataContent.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      
      const prompt = `Perform a quality assessment of this crop photo. The crop is ${Object.values(farmer.crops)[0] ? (Object.values(farmer.crops)[0] as any).name : 'unknown'} from ${farmer.county} County. Provide the exact response in English in this format only:
Grade: (Assign a grade A, B, C, or D)
Description: (Briefly describe the visual condition)
Advice: (Recommend actions to take)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: base64Data, mimeType: mimeType } },
              { text: prompt },
            ],
          },
        ],
      });

      const text = response.text || "";
      
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let grade = "Unknown";
      let description = "Could not parse description.";
      let advice = "Could not parse advice.";

      lines.forEach(line => {
        if (line.toLowerCase().startsWith('grade:') || line.toLowerCase().startsWith('daraja:')) {
          grade = line.split(':')[1]?.trim() || grade;
        } else if (line.toLowerCase().startsWith('description:') || line.toLowerCase().startsWith('maelezo:')) {
          description = line.split(':')[1]?.trim() || description;
        } else if (line.toLowerCase().startsWith('advice:') || line.toLowerCase().startsWith('ushauri:')) {
          advice = line.split(':')[1]?.trim() || advice;
        }
      });
      
      const result = { grade, description, advice };
      setAssessment(result);
      
      // Auto-translate if user preferred Swahili
      if (preferredLang === 'sw') {
        translateToSwahili(result);
      }
    } catch (err: any) {
      console.error(err);
      setError(preferredLang === 'sw' ? 'Hitilafu wakati wa kutathmini picha.' : 'An error occurred during assessment.');
    } finally {
      setIsScanning(false);
    }
  };

  const saveAssessment = async () => {
    if (!assessment || !selectedImage || isSaving) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/crops/quality-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropId: Object.values(farmer.crops)[0] ? (Object.values(farmer.crops)[0] as any).id : 'unknown',
          cropName: Object.values(farmer.crops)[0] ? (Object.values(farmer.crops)[0] as any).name : 'unknown',
          grade: assessment.grade,
          description: assessment.description,
          advice: assessment.advice,
          valuation: valuation ? valuation.estimatedTotalValue : 0,
          image: selectedImage
        })
      });
      
      if (res.ok) {
        const saved = await res.json();
        setSaveSuccess(true);
        setPastReports(prev => [saved, ...prev]);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(preferredLang === 'sw' ? 'Mtatatizo yakihifadhi tathmini.' : 'Error saving assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    if (grade.includes('B')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
    if (grade.includes('C')) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
  };

  return (
    <div className="p-5 md:p-10 flex-1 overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-start md:justify-center min-h-[60vh]">
      <div className={`${assessment || showHistory ? 'max-w-md lg:max-w-4xl' : 'max-w-md'} w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm text-center transition-all duration-500`}>
        <div className="flex justify-between items-center mb-6">
          <div />
          {pastReports.length > 0 && !isCameraActive && (
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-green-600 transition-colors"
            >
              <History size={16} />
              {showHistory ? (preferredLang === 'sw' ? 'Ficha Historia' : 'Hide History') : (preferredLang === 'sw' ? 'Historia' : 'History')}
            </button>
          )}
        </div>

        {showHistory ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 text-left">
            <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100 mb-6">{preferredLang === 'sw' ? 'Historia ya Tathmini' : 'Assessment History'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-4">
              {pastReports.map((report) => (
                <div key={report.id} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 flex gap-4">
                  <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden shrink-0">
                    <img src={report.image} alt="Crop" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{report.cropName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getGradeColor(report.grade)}`}>{report.grade}</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-2">{new Date(report.createdAt).toLocaleDateString()}</p>
                    <div className="text-[10px] font-bold text-green-600">KES {report.valuation.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowHistory(false)}
              className="w-full mt-6 py-4 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              {preferredLang === 'sw' ? 'Rudi' : 'Back to Scanner'}
            </button>
          </div>
        ) : !selectedImage && !isCameraActive ? (
          <>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{t.aiAssessmentTitle}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">{t.takePhotoDesc}</p>
            
            <button 
              onClick={startCamera}
              className="w-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl h-64 flex flex-col items-center justify-center mb-6 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer active:scale-95"
            >
              <Camera size={48} className="text-neutral-300 dark:text-neutral-600 mb-4" />
              <p className="font-bold text-neutral-600 dark:text-neutral-400">{t.tapToOpen}</p>
            </button>
            <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleImageUpload} 
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 dark:text-blue-400 font-bold text-sm w-full py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
            >
              {t.orUploadFromGallery}
            </button>
          </>
        ) : isCameraActive ? (
          <div className="animate-in fade-in duration-300 flex flex-col items-center">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">{preferredLang === 'sw' ? 'Piga Picha' : 'Take a Photo'}</h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 mb-4 text-left text-xs border border-red-100 dark:border-red-900/30 w-full">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="relative w-full aspect-[3/4] bg-neutral-900 rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              ></video>
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-4 w-full">
              <button 
                onClick={stopCamera}
                className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-sm flex-1 py-4 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {preferredLang === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button 
                onClick={capturePhoto}
                className="bg-blue-600 text-white font-bold text-sm flex-1 py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                {preferredLang === 'sw' ? 'Piga Picha' : 'Capture'}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="relative mb-6">
              <img src={selectedImage || undefined} alt="Crop" className="w-full h-auto max-h-64 object-cover rounded-2xl border border-neutral-200 dark:border-neutral-800" />
              {isScanning && (
                <div className="absolute inset-0 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                  <RefreshCw size={32} className="text-blue-600 animate-spin mb-3" />
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">{preferredLang === 'sw' ? 'Inatathmini Ubora...' : 'Analyzing Quality...'}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6 text-left text-sm border border-red-100 dark:border-red-900/30">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {assessment && (
              <div className="text-left animate-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <BrainCircuit size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight">AgriLink AI</h3>
                      <p className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-0.5 uppercase tracking-wider">
                        <CheckCircle size={10} /> {preferredLang === 'sw' ? 'Imethibitishwa' : 'AI Verified'}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-2xl border shadow-sm ${getGradeColor(assessment.grade)}`}>
                    {translatedAssessment ? translatedAssessment.grade : assessment.grade}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col">
                    <h4 className="font-bold text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText size={14} className="text-blue-600" /> 
                      {preferredLang === 'sw' ? 'Uchunguzi' : 'Visual Analysis'}
                    </h4>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                      {translatedAssessment ? translatedAssessment.description : assessment.description}
                    </p>
                  </div>
 
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-6 rounded-2xl shadow-md relative overflow-hidden group flex flex-col justify-center">
                    <Sparkles size={120} className="absolute -bottom-10 -right-10 text-white opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                      <h4 className="font-bold text-xs text-blue-100 dark:text-blue-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-amber-300" /> 
                        {preferredLang === 'sw' ? 'Ushauri wa AI' : 'AI Strategic Advice'}
                      </h4>
                      <p className="text-base text-white dark:text-neutral-100 leading-relaxed font-bold">
                        {translatedAssessment ? translatedAssessment.advice : assessment.advice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden mb-6">
                  <div className="absolute top-0 right-0 p-3">
                    <TrendingUp size={40} className="text-green-500 opacity-10" />
                  </div>
                  <h4 className="font-bold text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
                    {preferredLang === 'sw' ? 'Thamani ya Soko Inayokadiriwa' : 'Estimated Market Valuation'}
                  </h4>
                  {isValidating ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2"></div>
                      <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3"></div>
                    </div>
                  ) : valuation ? (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100">KES {valuation.estimatedTotalValue.toLocaleString()}</span>
                        <span className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-1.5 py-0.5 rounded border border-green-100 dark:border-green-800 uppercase tracking-tighter">
                          {valuation.gradeImpactPercent}% Grade Impact
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                        {preferredLang === 'sw' 
                          ? `Kulingana na bei ya leo ya soko ya KSh ${valuation.basePrice}/kg.` 
                          : `Based on current market price of KSh ${valuation.basePrice}/kg.`}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">Valuation data unavailable...</p>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-3 mb-6">
                  {preferredLang !== 'sw' && !translatedAssessment && (
                    <button 
                      onClick={() => translateToSwahili()}
                      disabled={isTranslating}
                      className="w-full lg:flex-1 flex items-center justify-center gap-2 py-3.5 text-blue-600 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all border border-blue-100 dark:border-blue-800 disabled:opacity-50 active:scale-95 shadow-sm"
                    >
                      {isTranslating ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Translating...
                        </>
                      ) : (
                        <>
                          Translate Recommendation to Swahili
                        </>
                      )}
                    </button>
                  )}
                  
                  {translatedAssessment && (
                    <button 
                      onClick={() => setTranslatedAssessment(null)}
                      className="w-full lg:flex-1 py-3.5 text-blue-600 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all border border-blue-100 dark:border-blue-800 active:scale-95 shadow-sm"
                    >
                      Show English Original
                    </button>
                  )}

                  <button 
                    onClick={saveAssessment}
                    disabled={isSaving || saveSuccess}
                    className={`w-full lg:flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-xs rounded-xl transition-all border active:scale-95 shadow-sm ${
                      saveSuccess 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {isSaving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : saveSuccess ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    {saveSuccess 
                      ? (preferredLang === 'sw' ? 'Imehifadhiwa!' : 'Saved Successfully!') 
                      : (preferredLang === 'sw' ? 'Hifadhi Ripoti' : 'Save Quality Report')}
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 mb-6">
                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setAssessment(null);
                      setTranslatedAssessment(null);
                      setError(null);
                    }}
                    className="bg-neutral-800 dark:bg-neutral-700 text-white font-bold text-sm w-full py-3.5 rounded-xl hover:bg-neutral-900 dark:hover:bg-neutral-600 transition-all active:scale-95 shadow-md flex-1"
                  >
                    {preferredLang === 'sw' ? 'Tathmini Picha Nyingine' : 'Scan Another Photo'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
