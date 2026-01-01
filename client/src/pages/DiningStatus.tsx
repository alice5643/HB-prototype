import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Camera, Utensils, Wine, Clock, Home, BookOpen, ConciergeBell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiningStatus() {
  const [, setLocation] = useLocation();

  // Mock progress state
  const [currentStep, setCurrentStep] = useState("mains");

  const steps = [
    { id: "starters", label: "Starters" },
    { id: "wine", label: "Wine" },
    { id: "mains", label: "Mains" },
    { id: "dessert", label: "Dessert" },
    { id: "finish", label: "Finish" },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIds = steps.map(s => s.id);
    const currentIndex = stepIds.indexOf(currentStep);
    const stepIndex = stepIds.indexOf(stepId);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Top Navigation - Paper Style */}
      <div className="bg-background/95 backdrop-blur-md border-b border-primary/20 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setLocation("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setLocation("/menus")}
          >
            <BookOpen className="w-4 h-4" />
            Menu
          </button>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setLocation("/service")}
          >
            <ConciergeBell className="w-4 h-4" />
            Service
          </button>
        </div>
        
        <button 
          className="relative p-2 hover:bg-secondary rounded-full transition-colors border border-transparent hover:border-primary/20"
          onClick={() => setLocation("/dining-status")}
        >
          <Utensils className="w-5 h-5 text-primary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
        </button>
      </div>

      {/* Status Bar - Paper Strip */}
      <div className="bg-white/50 border-b border-primary/10 px-6 py-2 flex justify-center items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs uppercase tracking-wider font-serif">Status:</span>
          <span className="font-medium text-gold text-sm">Dining in Progress</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8">
        {/* Ritual Progress */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg text-gold text-center">Tonight's Ritual Progress</h2>
          <div className="flex justify-between items-center px-2 relative py-4">
            {/* Connecting Line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-primary/20 -z-10" />
            
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              return (
                <div 
                  key={step.id} 
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all shadow-sm
                    ${status === 'completed' ? 'bg-primary border-primary text-primary-foreground' : 
                      status === 'active' ? 'bg-white border-primary ring-4 ring-primary/10 scale-110' : 'bg-white border-primary/30 text-muted-foreground'}`}
                  >
                    {status === 'completed' && <span className="text-xs">✓</span>}
                    {status === 'active' && <div className="w-2 h-2 bg-primary rounded-full" />}
                    {status === 'pending' && <span className="text-[10px] opacity-50">•</span>}
                  </div>
                  <span className={`text-[10px] font-serif font-medium tracking-wide transition-colors ${status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Course Card - Embossed Paper */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-paper overflow-hidden"
        >
          <div className="bg-primary/5 p-3 border-b border-primary/10 flex justify-between items-center">
            <span className="text-sm font-medium text-gold uppercase tracking-wider font-serif">Current Course: Mains</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Est. 8-12 mins</span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Dish */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-inner">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Wagyu Ribeye</h3>
                <p className="text-sm text-muted-foreground italic">Medium Rare</p>
              </div>
            </div>

            <div className="h-[1px] bg-primary/10 w-full" />

            {/* Wine Pairing */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-inner">
                <Wine className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">2015 Château Margaux</h3>
                <p className="text-sm text-muted-foreground italic">Sommelier: John</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-serif text-center">Quick Service</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 justify-start gap-3 border-primary/30 hover:border-primary hover:bg-primary/5 shadow-sm">
              <span className="text-xl">🧂</span>
              <span className="font-serif">Add Seasoning</span>
            </Button>
            <Button variant="outline" className="h-14 justify-start gap-3 border-primary/30 hover:border-primary hover:bg-primary/5 shadow-sm">
              <span className="text-xl">🔪</span>
              <span className="font-serif">New Cutlery</span>
            </Button>
            <Button variant="outline" className="h-14 justify-start gap-3 border-primary/30 hover:border-primary hover:bg-primary/5 shadow-sm">
              <span className="text-xl">🧊</span>
              <span className="font-serif">Ice Bucket</span>
            </Button>
            <Button variant="outline" className="h-14 justify-start gap-3 border-primary/30 hover:border-primary hover:bg-primary/5 shadow-sm">
              <Camera className="w-5 h-5 text-primary" />
              <span className="font-serif">Photo Moment</span>
            </Button>
          </div>
        </div>

        {/* Next Course Preview / Finish State */}
        {currentStep === 'dessert' ? (
          <div className="card-paper p-4 bg-secondary/30 border-dashed border-primary/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-serif">Up Next</p>
            <div className="flex items-center justify-between">
              <span className="font-serif text-foreground text-lg">All dishes served. Would you like anything else?</span>
            </div>
          </div>
        ) : currentStep === 'finish' ? (
          <div className="space-y-4">
            <div className="card-paper p-6 bg-primary/5 border-primary/30 text-center">
              <p className="text-xs text-gold uppercase tracking-widest mb-2 font-serif">Dining Complete</p>
              <h3 className="font-serif text-2xl text-foreground mb-2">Thank you for dining with us.</h3>
              <p className="text-sm text-muted-foreground italic">We hope you enjoyed your experience.</p>
            </div>
            <Button 
              className="w-full btn-primary h-14 text-lg shadow-lg"
              onClick={() => setLocation("/payment")}
            >
              Proceed to Payment
            </Button>
          </div>
        ) : (
          <div className="card-paper p-4 bg-secondary/30 border-dashed border-primary/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-serif">Up Next</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🍮</span>
                <span className="font-serif text-foreground text-lg">Chocolate Lava Cake</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">~12 mins</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
