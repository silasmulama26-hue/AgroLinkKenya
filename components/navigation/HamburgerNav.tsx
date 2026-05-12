"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Menu, Home, TrendingUp, ThermometerSun, Camera, Truck, Book, MessageCircle, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export default function HamburgerNav({ 
  activeTab, 
  setActiveTab, 
  t,
  farmerName
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  t: any;
  farmerName: string
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "home", label: t.home, icon: Home },
    { id: "market", label: t.market, icon: TrendingUp },
    { id: "weather", label: t.weather, icon: ThermometerSun },
    { id: "scan", label: t.scan, icon: Camera },
    { id: "logistics", label: t.logistics, icon: Truck },
    { id: "library", label: t.resourceLibrary, icon: Book },
    { id: "advisor", label: t.advisor, icon: MessageCircle },
    { id: "profile", label: t.profileSettings, icon: User },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shadow-sm"
      >
        <Menu size={20} className="text-neutral-600 dark:text-neutral-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-neutral-900 z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100">Menu</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${activeTab === item.id ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                  >
                    <item.icon size={20} />
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Signed in as</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-black text-neutral-600 dark:text-neutral-400">
                    {farmerName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">{farmerName}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
