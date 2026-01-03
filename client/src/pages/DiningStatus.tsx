import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Utensils, Home, BookOpen, ConciergeBell, Sparkles, Compass, Clock, ArrowRight, GlassWater, HandPlatter } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export default function DiningStatus() {
  const [, setLocation] = useLocation();
  const { tableNumber, partySize, orders, cart, addToCart } = useStore();

  // --- Dining Status Logic ---
  // Combine orders and cart for timeline generation
  const allItems = [...orders, ...cart];

  // Filter items by category - Merge sides into mains, case-insensitive
  const starters = allItems.filter(item => item.category.toLowerCase() === "starters");
  const mains = allItems.filter(item => ["mains", "sides"].includes(item.category.toLowerCase()));
  const desserts = allItems.filter(item => item.category.toLowerCase() === "desserts");
  const drinks = allItems.filter(item => ["cocktails", "wine", "drinks"].includes(item.category.toLowerCase()));

  // Determine initial step based on what's ordered
  const [currentStep, setCurrentStep] = useState(() => {
    if (starters.length > 0) return "starters";
    if (mains.length > 0) return "mains";
    if (desserts.length > 0) return "desserts";
    return "finish";
  });

  // Build dynamic steps
  const steps = [
    ...(starters.length > 0 ? [{ id: "starters", label: "Starters" }] : []),
    ...(drinks.length > 0 ? [{ id: "drinks", label: "Drinks" }] : []),
    ...(mains.length > 0 ? [{ id: "mains", label: "Mains" }] : []),
    ...(desserts.length > 0 ? [{ id: "dessert", label: "Dessert" }] : []),
    { id: "finish", label: "Finish" },
  ];

  const activeSteps = steps.length > 1 ? steps : [{ id: "finish", label: "Finish" }];

  const getStepStatus = (stepId: string) => {
    const stepIds = activeSteps.map(s => s.id);
    const currentIndex = stepIds.indexOf(currentStep);
    const stepIndex = stepIds.indexOf(stepId);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const getCurrentItems = () => {
    switch (currentStep) {
      case "starters": return starters;
      case "mains": return mains;
      case "dessert": return desserts;
      case "drinks": return drinks;
      default: return [];
    }
  };

  const getNextStepItems = () => {
    const stepIds = activeSteps.map(s => s.id);
    const currentIndex = stepIds.indexOf(currentStep);
    if (currentIndex >= stepIds.length - 1) return null;
    
    const nextStepId = stepIds[currentIndex + 1];
    switch (nextStepId) {
      case "starters": return starters;
      case "mains": return mains;
      case "dessert": return desserts;
      case "drinks": return drinks;
      default: return null;
    }
  };

  const currentItems = getCurrentItems();
  const nextItems = getNextStepItems();
  const hasActiveOrder = allItems.length > 0;

  // Service Actions
  const handleServiceRequest = (type: string) => {
    toast.success(`${type} request sent to waiter`);
  };

  const handleRefill = () => {
    toast.success("Water refill requested");
  };

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

      <div className="flex-1 flex flex-col p-6 space-y-8 max-w-md mx-auto w-full pb-24">
        
        {/* Welcome + Table Context */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#D4AF37]/20 text-xs font-medium text-[#8B4513] uppercase tracking-wider">
            <span>Table {tableNumber}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            <span>{partySize || 2} Guests</span>
          </div>
          <h1 className="font-serif text-3xl text-[#2C2C2C]">
            {hasActiveOrder ? "Enjoy your meal." : "You’re all set — take your time."}
          </h1>
        </motion.div>

        {/* Primary Action Zone */}
        <div className="space-y-4">
          
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

        {/* --- Dining Status Section (Only visible if there are orders) --- */}
        {hasActiveOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 pt-6 border-t border-[#E5E5E5]"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[#8B4513] uppercase tracking-wider">Your Meal Progress</span>
              <div className="h-[1px] flex-1 bg-[#E5E5E5]" />
            </div>

            {/* Ritual Progress Timeline */}
            <div className="flex justify-between items-center px-2 relative py-4 overflow-x-auto">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-[#D4AF37]/20 -z-10 min-w-[300px]" />
              {activeSteps.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <div 
                    key={step.id} 
                    className="flex flex-col items-center gap-2 cursor-pointer group min-w-[60px]"
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all shadow-sm
                      ${status === 'completed' ? 'bg-[#D4AF37] border-[#D4AF37] text-white' : 
                        status === 'active' ? 'bg-white border-[#D4AF37] ring-4 ring-[#D4AF37]/10 scale-110' : 'bg-white border-[#D4AF37]/30 text-[#5C4033]/50'}`}
                    >
                      {status === 'completed' && <span className="text-xs">✓</span>}
                      {status === 'active' && <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />}
                      {status === 'pending' && <span className="text-[10px] opacity-50">•</span>}
                    </div>
                    <span className={`text-[10px] font-serif font-medium tracking-wide transition-colors ${status === 'active' ? 'text-[#8B4513]' : 'text-[#5C4033]/60'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Course Card */}
            {currentStep !== 'finish' && currentItems.length > 0 && (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-sm"
              >
                <div className="bg-[#F5F2EA] p-3 border-b border-[#E5E5E5] flex justify-between items-center">
                  <span className="text-sm font-medium text-[#8B4513] uppercase tracking-wider font-serif">
                    Current Course: {activeSteps.find(s => s.id === currentStep)?.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#5C4033]/70">
                    <Clock className="w-3 h-3" />
                    <span>Est. 8-12 mins</span>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  {currentItems.map((item, index) => (
                    <div key={`${item.id}-${index}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#F9F9F9] rounded-full flex items-center justify-center flex-shrink-0 border border-[#E5E5E5]">
                          <Utensils className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-[#2C2C2C]">{item.name}</h3>
                          {item.selectedVariationName && <p className="text-xs text-[#5C4033]/70 italic">{item.selectedVariationName}</p>}
                          <p className="text-xs text-[#5C4033]/70">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      {index < currentItems.length - 1 && <div className="h-[1px] bg-[#E5E5E5] w-full my-3" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Up Next Card */}
            {nextItems && nextItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/50 rounded-xl border border-[#E5E5E5] overflow-hidden"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#5C4033]/60">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#8B4513] uppercase tracking-wider">Up Next</p>
                      <p className="text-sm text-[#2C2C2C] font-serif">{nextItems.length} items</p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {nextItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[10px] text-[#5C4033] shadow-sm">
                        {item.name.charAt(0)}
                      </div>
                    ))}
                    {nextItems.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-[#F5F2EA] border border-[#E5E5E5] flex items-center justify-center text-[10px] text-[#8B4513] shadow-sm">
                        +{nextItems.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Service Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleRefill()}
                className="flex items-center justify-center gap-2 p-4 bg-white border border-[#E5E5E5] rounded-xl hover:bg-[#F5F2EA] hover:border-[#D4AF37]/30 transition-all shadow-sm group"
              >
                <GlassWater className="w-5 h-5 text-[#5C4033] group-hover:text-[#D4AF37] transition-colors" />
                <span className="text-sm font-medium text-[#5C4033] group-hover:text-[#8B4513]">Refill Water</span>
              </button>
              <button 
                onClick={() => handleServiceRequest("Waiter")}
                className="flex items-center justify-center gap-2 p-4 bg-white border border-[#E5E5E5] rounded-xl hover:bg-[#F5F2EA] hover:border-[#D4AF37]/30 transition-all shadow-sm group"
              >
                <HandPlatter className="w-5 h-5 text-[#5C4033] group-hover:text-[#D4AF37] transition-colors" />
                <span className="text-sm font-medium text-[#5C4033] group-hover:text-[#8B4513]">Call Waiter</span>
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
