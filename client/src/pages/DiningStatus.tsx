import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Utensils, Home, BookOpen, ConciergeBell, Sparkles, Compass } from "lucide-react";
import { useStore } from "@/lib/store";

export default function DiningStatus() {
  const [, setLocation] = useLocation();
  const { tableNumber, partySize } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] relative">
      {/* Top Navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-2 text-sm font-medium text-[#8B4513] transition-colors"
            onClick={() => setLocation("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-[#5C4033] hover:text-[#8B4513] transition-colors"
            onClick={() => setLocation("/menus")}
          >
            <BookOpen className="w-4 h-4" />
            Menu
          </button>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-[#5C4033] hover:text-[#8B4513] transition-colors"
            onClick={() => setLocation("/service")}
          >
            <ConciergeBell className="w-4 h-4" />
            Service
          </button>
        </div>
        
        <button 
          className="relative p-2 hover:bg-[#F5F2EA] rounded-full transition-colors border border-transparent hover:border-[#D4AF37]/20"
          onClick={() => setLocation("/dining-status")}
        >
          <Utensils className="w-5 h-5 text-[#D4AF37]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
        </button>
      </div>

      <div className="flex-1 flex flex-col p-6 space-y-8 max-w-md mx-auto w-full">
        
        {/* Welcome + Table Context */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mt-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#D4AF37]/20 text-xs font-medium text-[#8B4513] uppercase tracking-wider">
            <span>Table {tableNumber}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            <span>{partySize || 2} Guests</span>
          </div>
          <h1 className="font-serif text-3xl text-[#2C2C2C]">You’re all set — take your time.</h1>
        </motion.div>

        {/* Primary Action Zone */}
        <div className="space-y-4 mt-8">
          
          {/* Card 1 — Guided Choice (Primary) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setLocation("/discovery")}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 cursor-pointer shadow-[0_4px_20px_-4px_rgba(212,175,55,0.15)] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(212,175,55,0.25)]"
          >
            {/* Soft Glow Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-[#D4AF37]/10" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F5F2EA] flex items-center justify-center text-[#D4AF37] mb-1 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              
              <h2 className="font-serif text-xl text-[#2C2C2C] group-hover:text-[#8B4513] transition-colors">Help me choose</h2>
              <p className="text-sm text-[#5C4033]/80 leading-relaxed max-w-[240px]">
                Tell us what you like — we’ll suggest something that fits perfectly.
              </p>
            </div>
          </motion.div>

          {/* Card 2 — Browse Freely (Secondary) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setLocation("/menus")}
            className="group bg-white rounded-xl p-5 cursor-pointer border border-[#E5E5E5] hover:border-[#D4AF37]/50 hover:bg-[#F9F9F9] transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#5C4033] group-hover:bg-white group-hover:shadow-sm transition-all">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-[#2C2C2C] group-hover:text-[#8B4513] transition-colors">Browse the menu</h3>
                <p className="text-xs text-[#5C4033]/60">Explore full selection at your own pace</p>
              </div>
            </div>
            <div className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
              →
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
