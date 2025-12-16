import { useLocation } from "wouter";
import { useStore, SharingModel } from "@/lib/store";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function OrderDraft() {
  const [, setLocation] = useLocation();
  const { cart, updateQuantity, removeFromCart, sharingModel, partySize } = useStore();
  const [showNudge, setShowNudge] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Check if we should show the nudge
  // Logic: If sharing model is 'sharing' or 'mixed', and they have added mains (price > 20 approx)
  // and item count is roughly equal to party size (meaning 1 main per person), suggest a small plate.
  useEffect(() => {
    const hasMains = cart.some(item => item.price > 18); // Assuming mains are > £18
    const isSharing = sharingModel === 'sharing' || sharingModel === 'mix';
    
    // Only show once per session (in a real app, we'd track this in store/localstorage)
    // For now, just show if conditions met
    if (isSharing && hasMains && itemCount >= (partySize || 2) && itemCount < (partySize || 2) * 2) {
      setShowNudge(true);
    } else {
      setShowNudge(false);
    }
  }, [cart, sharingModel, partySize, itemCount]);

  if (cart.length === 0) {
    return (
      <Layout title="Your Order">
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
          <h2 className="text-xl font-serif text-primary">Your table is empty</h2>
          <p className="text-muted-foreground">Start adding some delicious dishes.</p>
          <Button onClick={() => setLocation("/menus")} className="btn-primary">
            Browse Menus
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Order">
      <div className="pb-32 min-h-screen flex flex-col">
        <div className="container py-6 space-y-6 flex-1">
          {/* Nudge Message */}
          <AnimatePresence>
            {showNudge && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-primary/5 border border-primary/20 rounded-xl p-4 overflow-hidden"
              >
                <p className="text-sm text-primary/80 font-serif italic leading-relaxed">
                  "For sharing tables, one more small plate is common — feel free to add, or continue."
                </p>
                <Button 
                  variant="link" 
                  className="text-primary h-auto p-0 mt-2 text-xs font-medium"
                  onClick={() => setLocation("/menu/alacarte")}
                >
                  Browse Small Plates &rarr;
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-4 bg-card p-4 rounded-xl border border-border/40 shadow-sm"
              >
                {/* Image Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img 
                    src={item.image || "/images/placeholder-dish.jpg"} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    <span className="font-mono text-sm">£{item.price * item.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-xs text-muted-foreground">£{item.price} each</p>
                    
                    <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-2 py-1">
                      <button 
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95 hover:text-destructive transition-colors"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Summary & Action */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-lg border-t border-border/50 z-20" style={{ maxWidth: 'inherit', margin: '0 auto' }}>
          <div className="space-y-4">
            <div className="flex justify-between items-end px-2">
              <span className="text-muted-foreground">Total</span>
              <span className="text-3xl font-serif text-primary">£{total}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-14 rounded-full text-lg"
                onClick={() => setLocation("/menus")}
              >
                Add More
              </Button>
              <Button 
                className="h-14 rounded-full text-lg btn-primary"
                onClick={() => setLocation("/confirmation")}
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
