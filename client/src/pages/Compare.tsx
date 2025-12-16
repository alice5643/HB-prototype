import { useLocation, useRoute } from "wouter";
import { useStore } from "@/lib/store";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { menus, MenuSection, Dish } from "@/lib/data";

export default function Compare() {
  const [, params] = useRoute("/compare/:id1/:id2");
  const [, setLocation] = useLocation();
  const { addToCart, cart, updateQuantity } = useStore();
  
  const id1 = params?.id1;
  const id2 = params?.id2;
  
  // Search across all menus
  const allDishes = menus.flatMap(menu => menu.data || []).flatMap((section: MenuSection) => section.items);
  
  const dish1 = allDishes.find((item: Dish) => item.id === id1);
  const dish2 = allDishes.find((item: Dish) => item.id === id2);
  
  if (!dish1 || !dish2) return null;
  
  const dishes = [dish1, dish2];

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center gap-4 border-b border-border/40">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.history.back()}
            className="rounded-full hover:bg-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-serif text-xl text-primary">Compare Dishes</h1>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 grid grid-cols-2 divide-x divide-border/40 overflow-y-auto">
          {dishes.map((dish, index) => {
            const cartItem = cart.find(item => item.id === dish.id);
            const quantity = cartItem?.quantity || 0;
            
            return (
              <motion.div 
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                {/* Image */}
                <div className="aspect-square w-full relative overflow-hidden bg-secondary/20">
                  <img 
                    src={dish.image || "/images/placeholder-dish.jpg"} 
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col gap-4">
                  <div>
                    <h2 className="font-serif text-lg leading-tight mb-1">{dish.name}</h2>
                    <span className="font-mono text-sm text-muted-foreground">£{dish.price}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {dish.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {dish.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider text-muted-foreground/70 border border-border px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {dish.pairingSuggestion && (
                      <p className="text-xs text-primary/80 italic border-t border-border/40 pt-2 mt-2">
                        {dish.pairingSuggestion}
                      </p>
                    )}
                  </div>
                  
                  {/* Action */}
                  <div className="mt-auto pt-4">
                    {quantity > 0 ? (
                      <div className="flex items-center justify-between bg-secondary rounded-full px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(dish.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-medium text-sm">{quantity}</span>
                        <button 
                          onClick={() => updateQuantity(dish.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full rounded-full text-sm h-10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                        onClick={() => addToCart(dish)}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Context Note */}
        <div className="p-4 bg-secondary/30 text-center border-t border-border/40">
          <p className="text-sm text-muted-foreground font-serif italic">
            "With / Without" balance — choose what fits your mood.
          </p>
        </div>
      </div>
    </Layout>
  );
}
