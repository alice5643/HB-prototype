import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSummary() {
  const [, setLocation] = useLocation();
  const { cart, updateQuantity, removeFromCart, submitOrder } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.10;
  const total = subtotal + serviceCharge;

  // Mock suggested items
  const suggestedItems = [
    { id: "bread", name: "Bread Basket", price: 58 },
    { id: "salad", name: "Caesar Salad", price: 128 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button className="text-sm text-muted-foreground hover:text-primary">
          Clear
        </button>
      </div>

      <div className="flex-1 p-6 pb-32 overflow-y-auto">
        <h1 className="font-serif text-2xl text-primary mb-6">Your Selection ({cart.reduce((acc, i) => acc + i.quantity, 0)})</h1>

        {/* Cart Items */}
        <div className="space-y-6 mb-8">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Your cart is empty.</p>
              <Button variant="link" onClick={() => setLocation("/menus")}>Browse Menu</Button>
            </div>
          ) : (
            cart.map((item, index) => (
              <motion.div 
                key={`${item.id}-${item.selectedVariationId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border/50 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-serif text-lg font-medium">{item.name}</h3>
                    {item.selectedVariationName && (
                      <p className="text-xs text-muted-foreground">{item.selectedVariationName}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedVariationId)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm font-mono">£{item.price} · {item.quantity}x</p>
                    <p className="text-xs text-muted-foreground italic">"Less salt"</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1), item.selectedVariationId)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariationId)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-background shadow-sm active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Suggested Additions */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Suggested Additions</h3>
          <div className="space-y-3">
            {suggestedItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-border/30 rounded-lg hover:bg-secondary/30 transition-colors">
                <span className="font-serif">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">£{item.price}</span>
                  <button className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="border-t border-border pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Charge (10%)</span>
            <span className="font-mono">£{serviceCharge.toFixed(2)}</span>
          </div>
          <div className="h-[1px] bg-border/50 my-2" />
          <div className="flex justify-between text-lg font-medium">
            <span className="font-serif text-primary">Total</span>
            <span className="font-mono">£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-border/50 z-30" style={{ maxWidth: 'inherit', margin: '0 auto' }}>
        <Button 
          className="w-full h-14 text-lg btn-primary gap-2 shadow-lg"
          onClick={() => {
            submitOrder();
            setLocation("/dining-status");
          }}
          disabled={cart.length === 0}
        >
          <Bell className="w-5 h-5" />
          Ring waiter to confirm order
        </Button>
      </div>
    </div>
  );
}
