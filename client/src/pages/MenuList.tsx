import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { menus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Bell, Home, BookOpen, ConciergeBell, Grid, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MenuList() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Top Navigation */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border/50 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            onClick={() => setLocation("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${location === '/menus' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
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
          className="relative p-2 hover:bg-secondary rounded-full transition-colors"
          onClick={() => setLocation("/dining-status")}
        >
          <Utensils className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Elements */}
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
            <h1 className="text-6xl font-serif text-primary tracking-tight">Savoy</h1>
            <p className="text-muted-foreground font-serif italic">Select a menu to begin</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full space-y-6"
          >
            {menus.map((menu, index) => (
              <motion.button
                key={menu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => !menu.disabled && setLocation(`/menu/${menu.id}`)}
                disabled={menu.disabled}
                className={cn(
                  "w-full py-3 text-xl font-serif transition-all duration-300 border-b border-border/30 hover:border-primary/50",
                  menu.disabled 
                    ? "text-muted-foreground/40 cursor-not-allowed" 
                    : "text-foreground hover:text-primary hover:scale-105 active:scale-95"
                )}
              >
                {menu.title}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setLocation("/discovery")}
            >
              <Grid className="w-4 h-4" />
              Switch to Gallery View
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
