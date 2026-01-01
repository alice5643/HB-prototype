import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Bell, Home, BookOpen, ConciergeBell, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Status Bar */}
      <div className="bg-card border-b border-border/50 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Status:</span>
          <span className="font-medium text-primary">Ready to Order</span>
        </div>
        <button className="relative p-2 hover:bg-secondary rounded-full transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Image / Restaurant Background */}
        <div className="h-48 w-full relative overflow-hidden">
          <img 
            src="/images/hero-restaurant.jpg" 
            alt="Restaurant Ambience" 
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              // Fallback if image doesn't exist
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="px-6 -mt-12 relative z-10 space-y-6">
          {/* The Ritual Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-xl p-6 shadow-sm"
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl text-primary">Tonight's Ritual</h2>
              <div className="h-[1px] w-12 bg-primary/20 mx-auto mt-2" />
            </div>

            <div className="space-y-4">
              {[
                { id: 1, text: "Browse the Menu" },
                { id: 2, text: "Select Your Favorites" },
                { id: 3, text: "Notify Sommelier" },
                { id: 4, text: "Wine Service" },
                { id: 5, text: "Courses Served" }
              ].map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif ${index < 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {step.id}
                  </div>
                  <span className={`text-sm ${index < 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sommelier Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden flex-shrink-0">
              <img 
                src="/images/sommelier.jpg" 
                alt="Sommelier" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Sommelier is Ready</p>
              <h3 className="font-serif text-lg text-foreground">John · Head Sommelier</h3>
              <p className="text-xs text-muted-foreground mt-1">Ready to recommend pairings.</p>
            </div>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setLocation("/menu/drinks")}>
              Wine List
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 px-6 py-4 z-30" style={{ maxWidth: 'inherit', margin: '0 auto' }}>
        <div className="flex justify-between items-center">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setLocation("/menus")}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <ConciergeBell className="w-6 h-6" />
            <span className="text-[10px] font-medium">Service</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
