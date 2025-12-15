import { useState } from "react";
import { useLocation } from "wouter";
import { useStore, PartySize, SharingModel } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Welcome() {
  const [step, setStep] = useState<1 | 2>(1);
  const [, setLocation] = useLocation();
  const { setPartySize, setSharingModel } = useStore();
  
  const handlePartySize = (size: PartySize) => {
    setPartySize(size);
    setStep(2);
  };
  
  const handleSharingModel = (model: SharingModel) => {
    setSharingModel(model);
    setLocation("/menu");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-stone-400 blur-[60px]" />
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center text-center space-y-12">
        {/* Logo / Brand */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-serif text-primary tracking-tight">Azay</h1>
          <div className="h-[1px] w-12 bg-primary/30 mx-auto" />
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full space-y-8"
            >
              <div className="space-y-2">
                <p className="text-lg font-serif italic text-muted-foreground">Let's make choosing easy.</p>
                <h2 className="text-2xl font-medium text-foreground">How many people are at the table?</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePartySize(num as PartySize)}
                    className="aspect-square rounded-2xl border border-border bg-white/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-xl font-serif flex items-center justify-center shadow-sm active:scale-95"
                  >
                    {num}{num === 6 ? "+" : ""}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full space-y-8"
            >
              <div className="space-y-2">
                <button 
                  onClick={() => setStep(1)}
                  className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center justify-center gap-1 mx-auto"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-medium text-foreground">How will you eat today?</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-6 text-lg font-serif justify-between group hover:border-primary hover:bg-primary/5"
                  onClick={() => handleSharingModel('sharing')}
                >
                  <span>Sharing</span>
                  <span className="text-xs font-sans text-muted-foreground group-hover:text-primary/70">Family style</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-6 text-lg font-serif justify-between group hover:border-primary hover:bg-primary/5"
                  onClick={() => handleSharingModel('separate')}
                >
                  <span>Separate</span>
                  <span className="text-xs font-sans text-muted-foreground group-hover:text-primary/70">My own plate</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-6 text-lg font-serif justify-between group hover:border-primary hover:bg-primary/5"
                  onClick={() => handleSharingModel('mix')}
                >
                  <span>A mix of both</span>
                  <span className="text-xs font-sans text-muted-foreground group-hover:text-primary/70">Best of both</span>
                </Button>
              </div>
              
              <Button 
                className="w-full mt-8 btn-primary"
                onClick={() => handleSharingModel('sharing')} // Default action if they just want to start
              >
                Start exploring the menu
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
