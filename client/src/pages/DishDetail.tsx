import { useLocation, useRoute } from "wouter";
import { useStore } from "@/lib/store";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, Scale } from "lucide-react";
import { useState, useEffect } from "react";
import { menus, MenuSection, Dish } from "@/lib/data";

export default function DishDetail() {
  const [, params] = useRoute("/dish/:id");
  const [, setLocation] = useLocation();
  const { addToCart, cart, updateQuantity } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  // Find dish in static data
  const dishId = params?.id;
  
  // Search across all menus
  const allDishes = menus.flatMap(menu => menu.data || []).flatMap((section: MenuSection) => section.items);
  const dish = allDishes.find((item: Dish) => item.id === dishId);
    
  // Check if already in cart
  const cartItem = cart.find(item => item.id === dishId);
  
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  if (!dish) return null;

  const handleAddToCart = () => {
    addToCart(dish);
    // Determine which menu to return to based on dish category
    const menuId = menus.find(m => m.data?.some(s => s.items.some(i => i.id === dish.id)))?.id || "alacarte";
    setLocation(`/menu/${menuId}`);
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen bg-background flex flex-col relative">
        {/* Image Header */}
        <div className="relative h-[40vh] w-full overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={dish.image || "/images/placeholder-dish.jpg"} 
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.history.back()}
            className="absolute top-6 left-6 rounded-full bg-background/20 backdrop-blur-md text-foreground hover:bg-background/40"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 -mt-12 relative z-10 flex flex-col pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-serif text-primary leading-tight">{dish.name}</h1>
                <span className="text-xl font-mono text-muted-foreground mt-2">£{dish.price}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dish.tags.map((tag: string) => (
                  <span key={tag} className="text-xs uppercase tracking-wider text-primary/80 border border-primary/20 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed font-serif">
              {dish.description}
            </p>

            {dish.pairingSuggestion && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-sm text-primary/80 font-serif italic">
                  {dish.pairingSuggestion}
                </p>
              </div>
            )}

            {dish.allergens && dish.allergens.length > 0 && (
              <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Allergens:</span> {dish.allergens.join(", ")}
                </p>
              </div>
            )}

            {/* Embedded Comparison Section */}
            <div className="pt-6 border-t border-border/40">
              <h3 className="text-lg font-serif text-primary mb-4">Try a different flavor</h3>
              <p className="text-sm text-muted-foreground mb-4 italic">Choose what fits your mood.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {allDishes
                  .filter((d: Dish) => d.category === dish.category && d.id !== dish.id)
                  .slice(0, 2)
                  .map((similarDish: Dish) => (
                    <div 
                      key={similarDish.id}
                      className="bg-card rounded-xl overflow-hidden border border-border/40 cursor-pointer hover:border-primary/40 transition-colors"
                      onClick={() => setLocation(`/dish/${similarDish.id}`)}
                    >
                      <div className="h-24 bg-secondary relative">
                        <img 
                          src={similarDish.image || "/images/placeholder-dish.jpg"} 
                          alt={similarDish.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-serif text-sm font-medium line-clamp-1">{similarDish.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">£{similarDish.price}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-lg border-t border-border/50 z-20" style={{ maxWidth: 'inherit', margin: '0 auto' }}>
          <div className="flex gap-4">

            <div className="flex-1 flex gap-3">
              {cartItem ? (
                <div className="flex items-center gap-2 bg-secondary rounded-full px-3 h-14">
                  <button 
                    onClick={() => updateQuantity(dish.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-lg w-6 text-center">{quantity}</span>
                  <button 
                    onClick={() => updateQuantity(dish.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
              
              <Button 
                className="flex-1 h-14 rounded-full text-lg btn-primary"
                onClick={handleAddToCart}
              >
                {cartItem ? "Update Table" : "Add to Table"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
