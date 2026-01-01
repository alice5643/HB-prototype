import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ChevronRight, Minus, Plus, ClipboardList, Bell } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  title?: string;
}

export default function Layout({ children, showHeader = true, title }: LayoutProps) {
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const { cart, partySize, sharingModel, removeFromCart, updateQuantity, submitOrder } = useStore();
  const [, setLocation] = useLocation();
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.10;
  const total = subtotal + serviceCharge;
  
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Sticky Header */}
      {showHeader && (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl text-primary cursor-pointer" onClick={() => setLocation("/menu")}>
                  {title || "Savoy"}
                </h1>
                <ThemeSwitcher />
              </div>
              {partySize && (
                <span className="text-xs text-muted-foreground">
                  Table of {partySize} · {sharingModel === 'sharing' ? 'Sharing' : sharingModel === 'separate' ? 'Separate' : 'Mixed'}
                </span>
              )}
            </div>
            
            {/* Table Tray Indicator */}
            {totalItems > 0 && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTrayOpen(true)}
                className="relative p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <ClipboardList className="w-6 h-6 text-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                  {totalItems}
                </span>
              </motion.button>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Table Tray Drawer (S6) */}
      <AnimatePresence>
        {isTrayOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTrayOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-white/20 max-h-[85vh] flex flex-col"
              style={{ maxWidth: 'inherit', margin: '0 auto' }} // Inherit max-width from parent #root
            >
              <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="p-6 pb-0 flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="font-serif text-2xl text-primary">Table Order</h2>
                  <button onClick={() => setIsTrayOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content Area - Explicitly constrained */}
                <div className="flex-1 overflow-y-auto px-6 min-h-0">
                  <div className="space-y-6 pb-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>Your table is empty.</p>
                        <Button variant="link" onClick={() => setIsTrayOpen(false)} className="mt-2">
                          Browse Menu
                        </Button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={`${item.id}-${item.selectedVariationId}`} className="flex gap-4 items-start py-4 border-b border-border/40 last:border-0">
                          <div className="flex-1">
                            <h3 className="font-medium font-serif text-lg">{item.name}</h3>
                            {item.selectedVariationName && (
                              <p className="text-xs text-muted-foreground">{item.selectedVariationName}</p>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                            {item.allergens && item.allergens.length > 0 && (
                              <p className="text-xs text-amber-600/80 mt-1">
                                Contains: {item.allergens.join(", ")}
                              </p>
                            )}
                            <p className="text-sm font-mono mt-1">£{item.price}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1), item.selectedVariationId)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariationId)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sticky Footer - Flex Item */}
                <div className="flex-shrink-0 p-6 pt-4 border-t border-border bg-background z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] mt-auto">
                  {cart.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>£{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service Charge (10%)</span>
                        <span>£{serviceCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-medium pt-2 border-t border-border/50">
                        <span className="font-serif text-primary">Total</span>
                        <span className="font-mono">£{total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Button 
                      className="w-full btn-primary h-14 text-lg gap-2"
                      disabled={cart.length === 0}
                      onClick={() => {
                        submitOrder();
                        setIsTrayOpen(false);
                        setLocation("/dining-status");
                      }}
                    >
                      <Bell className="w-5 h-5" />
                      Ring waiter to confirm order
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
