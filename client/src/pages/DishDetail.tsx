import { useLocation, useRoute } from "wouter";
import { useStore } from "@/lib/store";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, Check, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { menus, MenuSection, Dish } from "@/lib/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DishDetail() {
  const [, params] = useRoute("/dish/:id");
  const [, setLocation] = useLocation();
  const { addToCart, cart, updateQuantity } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedPairings, setAddedPairings] = useState<string[]>([]);
  
  // Find dish in static data
  const dishId = params?.id;
  
  // Search across all menus
  const allDishes = menus.flatMap(menu => menu.data || []).flatMap((section: MenuSection) => section.items);
  const dish = allDishes.find((item: Dish) => item.id === dishId);
  
  // State for selected variation (default to first one if available)
  const [selectedVariationId, setSelectedVariationId] = useState<string | undefined>(
    dish?.variations?.[0]?.id
  );

  // Check if already in cart (matching both dish ID and variation)
  const cartItem = cart.find(item => 
    item.id === dishId && 
    (!dish?.variations || item.selectedVariationId === selectedVariationId)
  );
  
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem, selectedVariationId]);

  if (!dish) return null;

  const currentPrice = selectedVariationId 
    ? dish.variations?.find(v => v.id === selectedVariationId)?.price || dish.price
    : dish.price;

  // Get recommendations (6 items mixed from sides, drinks, and similar category)
  // Use a Map to deduplicate items by ID since categories might overlap (e.g. if current dish is a side)
  const rawRecommendations = [
    ...allDishes.filter(d => d.category === 'sides' && d.id !== dish.id).slice(0, 2),
    ...allDishes.filter(d => (d.category === 'cocktails' || d.category === 'wine') && d.id !== dish.id).slice(0, 2),
    ...allDishes.filter(d => d.category === dish.category && d.id !== dish.id).slice(0, 2)
  ];

  const uniqueRecommendations = Array.from(new Map(rawRecommendations.map(item => [item.id, item])).values());

  const recommendations = uniqueRecommendations.map(item => ({
    ...item,
    tag: item.category === 'sides' ? 'Side' : 
         (item.category === 'cocktails' || item.category === 'wine') ? 'Drink' : 'Try this'
  }));

  const handleAddToCart = () => {
    if (cartItem) {
      window.history.back();
    } else {
      const variation = dish.variations?.find(v => v.id === selectedVariationId);
      addToCart(
        dish, 
        selectedVariationId, 
        variation?.name, 
        variation?.price
      );
      // Do not redirect, stay on page to show pairing suggestions
    }
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
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                setLocation("/menus");
              }
            }}
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
                <span className="text-xl font-mono text-muted-foreground mt-2">£{currentPrice}</span>
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

            {/* Variation Selector */}
            {dish.variations && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {dish.variations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariationId(variation.id)}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-xl border transition-all min-w-[140px]
                        ${selectedVariationId === variation.id 
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                          : "border-border bg-card hover:border-primary/50 text-muted-foreground"}
                      `}
                    >
                      <span className="font-medium">{variation.name}</span>
                      <span className="text-sm ml-2">£{variation.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            {/* Combined Suggestions Section (Always visible) */}
            <div className="pt-6 border-t border-border/40">
              <h3 className="text-lg font-serif text-primary mb-4">Complete Your Experience</h3>
              
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                {recommendations.map((recDish) => {
                  const isAdded = addedPairings.includes(recDish.id) || cart.some(i => i.id === recDish.id);
                  
                  return (
                    <Popover key={`rec-${recDish.id}`}>
                      <PopoverTrigger asChild>
                        <div 
                          className="min-w-[160px] w-[160px] bg-card rounded-xl overflow-hidden border border-border/40 cursor-pointer hover:border-primary/40 transition-colors flex-shrink-0 relative group"
                        >
                          <div className="h-24 bg-secondary relative">
                            <img 
                              src={recDish.image || "/images/placeholder-dish.jpg"} 
                              alt={recDish.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isAdded) {
                                  addToCart(recDish);
                                  setAddedPairings(prev => [...prev, recDish.id]);
                                }
                              }}
                              className={`absolute top-2 right-2 backdrop-blur-sm rounded-full p-2 transition-all duration-300 z-10 ${
                                isAdded 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-background/80 hover:bg-primary hover:text-primary-foreground"
                              }`}
                            >
                              {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                            <div className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
                              {recDish.tag}
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-serif text-sm font-medium line-clamp-1">{recDish.name}</h4>
                              <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1 opacity-50" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">£{recDish.price}</p>
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-4" align="start">
                        <div className="space-y-2">
                          <h4 className="font-serif font-medium text-lg">{recDish.name}</h4>
                          <p className="text-sm text-muted-foreground">{recDish.description}</p>
                          {recDish.allergens && recDish.allergens.length > 0 && (
                            <p className="text-xs text-amber-600/80">
                              Contains: {recDish.allergens.join(", ")}
                            </p>
                          )}
                          <Button 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setLocation(`/dish/${recDish.id}`)}
                          >
                            View Full Details
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  );
                })}
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
                    onClick={() => updateQuantity(dish.id, Math.max(0, quantity - 1), selectedVariationId)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-lg w-6 text-center">{quantity}</span>
                  <button 
                    onClick={() => updateQuantity(dish.id, quantity + 1, selectedVariationId)}
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
