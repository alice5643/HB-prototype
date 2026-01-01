import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, BookOpen, ConciergeBell, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Top Navigation - Paper Style */}
      <div className="bg-background/95 backdrop-blur-md border-b border-primary/20 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${location === '/dashboard' ? 'text-primary font-serif' : 'text-muted-foreground hover:text-primary'}`}
            onClick={() => setLocation("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${location === '/menus' ? 'text-primary font-serif' : 'text-muted-foreground hover:text-primary'}`}
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Image / Restaurant Background */}
        <div className="h-48 w-full relative overflow-hidden">
          <img 
            src="/images/hero-restaurant.jpg" 
            alt="Restaurant Ambience" 
            className="w-full h-full object-cover opacity-80 sepia-[.3]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="px-6 -mt-16 relative z-10 space-y-6">
          {/* Status Card - Paper Style */}
          <div className="card-paper p-4 flex justify-between items-center bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-serif italic">Status:</span>
              <span className="font-medium text-primary text-gold">Ready to Order</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setLocation("/dining-status")} className="h-8 text-xs">
              View Status
            </Button>
          </div>

          {/* The Ritual Card - Embossed Paper */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-paper p-6"
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl text-gold">Tonight's Ritual</h2>
              <div className="h-[1px] w-12 bg-primary/30 mx-auto mt-2" />
            </div>

            <div className="space-y-4">
              {[
                { id: 1, text: "Browse the Menu" },
                { id: 2, text: "Select Your Favorites" },
                { id: 3, text: "Notify Sommelier" },
                { id: 4, text: "Wine Service" },
                { id: 5, text: "Courses Served" }
              ].map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif border transition-all shadow-sm ${index < 2 ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-primary/20 paper-pressed'}`}>
                    {step.id}
                  </div>
                  <span className={`text-sm font-serif transition-colors ${index < 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sommelier Card - Paper Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-paper p-6 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden flex-shrink-0 border-2 border-primary/20 shadow-inner">
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
              <p className="text-xs text-primary uppercase tracking-widest mb-1 font-medium">Sommelier is Ready</p>
              <h3 className="font-serif text-lg text-foreground">John · Head Sommelier</h3>
              <p className="text-xs text-muted-foreground mt-1 italic">Ready to recommend pairings.</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setLocation("/menu/drinks")}>
              Wine List
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
