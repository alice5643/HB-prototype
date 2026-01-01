import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Bell, Camera, Utensils, Wine, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiningStatus() {
  const [, setLocation] = useLocation();

  // Mock progress state
  const steps = [
    { id: "starters", label: "Starters", status: "completed" },
    { id: "wine", label: "Wine", status: "completed" },
    { id: "mains", label: "Mains", status: "active" },
    { id: "dessert", label: "Dessert", status: "pending" },
    { id: "finish", label: "Finish", status: "pending" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Status Bar */}
      <div className="bg-card border-b border-border/50 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Status:</span>
          <span className="font-medium text-primary">Dining</span>
        </div>
        <button className="relative p-2 hover:bg-secondary rounded-full transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8">
        {/* Ritual Progress */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg text-primary text-center">Tonight's Ritual Progress</h2>
          <div className="flex justify-between items-center px-2 relative">
            {/* Connecting Line */}
            <div className="absolute left-4 right-4 top-3 h-[2px] bg-border -z-10" />
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-1">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 
                  ${step.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' : 
                    step.status === 'active' ? 'bg-primary border-primary' : 'bg-background border-border'}`}
                >
                  {step.status === 'completed' && <span className="text-[10px]">✓</span>}
                  {step.status === 'active' && <div className="w-2 h-2 bg-background rounded-full" />}
                </div>
                <span className={`text-[10px] font-medium ${step.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Course Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm"
        >
          <div className="bg-primary/5 p-3 border-b border-primary/10 flex justify-between items-center">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Current Course: Mains</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Est. 8-12 mins</span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Dish */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Utensils className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Wagyu Ribeye</h3>
                <p className="text-sm text-muted-foreground">Medium Rare</p>
              </div>
            </div>

            <div className="h-[1px] bg-border/50" />

            {/* Wine Pairing */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Wine className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">2015 Château Margaux</h3>
                <p className="text-sm text-muted-foreground">Sommelier: John</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quick Service</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 justify-start gap-3 hover:border-primary hover:bg-primary/5">
              <span className="text-lg">🧂</span>
              <span>Add Seasoning</span>
            </Button>
            <Button variant="outline" className="h-12 justify-start gap-3 hover:border-primary hover:bg-primary/5">
              <span className="text-lg">🔪</span>
              <span>New Cutlery</span>
            </Button>
            <Button variant="outline" className="h-12 justify-start gap-3 hover:border-primary hover:bg-primary/5">
              <span className="text-lg">🧊</span>
              <span>Ice Bucket</span>
            </Button>
            <Button variant="outline" className="h-12 justify-start gap-3 hover:border-primary hover:bg-primary/5">
              <Camera className="w-5 h-5" />
              <span>Photo Moment</span>
            </Button>
          </div>
        </div>

        {/* Next Course Preview */}
        <div className="bg-secondary/30 rounded-xl p-4 border border-border/30">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Up Next</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🍮</span>
              <span className="font-serif text-foreground">Chocolate Lava Cake</span>
            </div>
            <span className="text-xs text-muted-foreground">~12 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
