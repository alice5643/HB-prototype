import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingBag, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menus, MenuSection, Dish } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function MenuDiscovery() {
  const [, setLocation] = useLocation();
  const { cart } = useStore();
  const [activeCategory, setActiveCategory] = useState("recommended");

  // Flatten all dishes for the grid
  const allDishes = menus.flatMap(menu => menu.data || []).flatMap((section: MenuSection) => section.items);
  
  // Mock "Recommended" category by picking a few items
  const recommendedDishes = allDishes.slice(0, 4);
  
  // Filter dishes based on active category
  const displayedDishes = activeCategory === "recommended" 
    ? recommendedDishes 
    : allDishes.filter(d => d.category === activeCategory || (activeCategory === 'wine' && d.category === 'wine') || (activeCategory === 'drinks' && d.category === 'drinks'));

  const categories = [
    { id: "recommended", label: "Recommended" },
    { id: "starters", label: "Starters" },
    { id: "mains", label: "Mains" },
    { id: "seafood", label: "Seafood" }, // Mock category for demo
    { id: "meat", label: "Meat" },       // Mock category for demo
    { id: "sides", label: "Sides" },
    { id: "desserts", label: "Desserts" },
    { id: "drinks", label: "Drinks" },
  ];

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setLocation("/dashboard")}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-[60px] z-20 bg-background border-b border-border/30 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex px-4 gap-3 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === cat.id 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Chef's Recommendation Banner */}
        {activeCategory === "recommended" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-2"
          >
            <div className="flex justify-center mb-2">
              <Star className="w-6 h-6 text-primary fill-primary/20" />
            </div>
            <h2 className="font-serif text-xl text-primary">Chef's Recommendation</h2>
            <p className="text-sm text-muted-foreground italic">"Tonight's unmissable experience"</p>
          </motion.div>
        )}

        {/* Dish Grid */}
        <div className="grid grid-cols-2 gap-4">
          {displayedDishes.map((dish) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLocation(`/dish/${dish.id}`)}
              className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-[4/3] relative bg-secondary overflow-hidden">
                <img 
                  src={dish.image || "/images/placeholder-dish.jpg"} 
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Rating Mockup */}
                <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>4.8</span>
                </div>
              </div>
              <div className="p-3 space-y-1">
                <h3 className="font-serif text-sm font-medium line-clamp-1">{dish.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-muted-foreground">£{dish.price}</span>
                  <button className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <span className="text-lg leading-none mb-0.5">+</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-30 pointer-events-none" style={{ maxWidth: 'inherit', margin: '0 auto' }}>
          <Button 
            className="w-full h-14 rounded-full shadow-lg btn-primary pointer-events-auto flex items-center justify-between px-6"
            onClick={() => setLocation("/order-summary")}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Cart ({totalItems})</span>
            </div>
            <span className="font-mono">View</span>
          </Button>
        </div>
      )}
    </div>
  );
}
