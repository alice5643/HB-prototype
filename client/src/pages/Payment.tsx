import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, EyeOff, CreditCard, User, Users, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function Payment() {
  const [, setLocation] = useLocation();
  const { cart, partySize } = useStore();
  const [showDetails, setShowDetails] = useState(true);
  const [tipOption, setTipOption] = useState<number | 'custom'>(15);
  const [customTip, setCustomTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'waiter' | 'split' | 'online'>('waiter');

  // Calculate bill totals from real cart data
  // Note: In a real app, we would distinguish food/drink types. 
  // For now, we sum everything as subtotal.
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceCharge = Math.round(subtotal * 0.1);
  
  const getTipAmount = () => {
    if (tipOption === 'custom') {
      return Number(customTip) || 0;
    }
    return Math.round(subtotal * (tipOption / 100));
  };

  const total = subtotal + serviceCharge + getTipAmount();

  // Calculate split bill (Equal Split for now)
  const numberOfGuests = partySize || 2; // Default to 2 if not set
  const splitAmount = Math.round(total / numberOfGuests);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Header - Paper Style */}
      <div className="bg-background/95 backdrop-blur-md border-b border-primary/20 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <button 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-serif"
          onClick={() => setLocation("/dining-status")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-serif"
          onClick={() => setShowDetails(!showDetails)}
        >
          <EyeOff className="w-4 h-4" />
          {showDetails ? "Hide Bill Details" : "Show Bill Details"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-8">
        <div className="text-center mb-2">
          <h1 className="font-serif text-2xl text-gold">🧾 Tonight's Bill</h1>
        </div>

        {/* Bill Details - Paper Receipt Style */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="card-paper p-6 space-y-4 overflow-hidden bg-white/80"
            >
              <div className="space-y-2 text-sm font-serif">
                {cart.length === 0 ? (
                  <div className="text-center text-muted-foreground italic py-4">No items in order</div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.selectedVariationId}`} className="flex justify-between border-b border-dashed border-primary/10 pb-1">
                      <span className="text-foreground">
                        {item.quantity}x {item.name}
                        {item.selectedVariationName && <span className="text-xs text-muted-foreground block">{item.selectedVariationName}</span>}
                      </span>
                      <span className="font-medium">£{item.price * item.quantity}</span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="h-[2px] bg-primary/20" />
              
              <div className="space-y-2 text-sm font-serif">
                <div className="flex justify-between font-medium text-foreground">
                  <span>Subtotal</span>
                  <span>£{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Charge (10%)</span>
                  <span>£{serviceCharge}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total - Embossed Gold */}
        <div className="flex justify-between items-end px-2">
          <span className="font-serif text-xl text-gold">Total</span>
          <div className="text-right">
            <span className="font-serif text-4xl text-gold drop-shadow-sm">£{total}</span>
            {tipOption !== 0 && (
              <p className="text-xs text-muted-foreground mt-1 font-serif italic">Includes Tip £{getTipAmount()}</p>
            )}
          </div>
        </div>

        {/* Tip Selection - Embossed Buttons */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground font-serif uppercase tracking-wider">💝 Tip (Optional)</h3>
          <div className="space-y-3">
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${tipOption === 0 ? 'border-primary bg-primary/5' : 'border-primary/20 bg-white hover:bg-primary/5'}`}
              onClick={() => setTipOption(0)}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tipOption === 0 ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {tipOption === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="font-serif">No Tip</span>
            </div>

            {[15, 18, 20].map((pct) => (
              <div 
                key={pct}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${tipOption === pct ? 'border-primary bg-primary/5' : 'border-primary/20 bg-white hover:bg-primary/5'}`}
                onClick={() => setTipOption(pct)}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tipOption === pct ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {tipOption === pct && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="flex justify-between flex-1 font-serif">
                  <span>{pct}%</span>
                  <span className="text-muted-foreground">£{Math.round(subtotal * (pct / 100))}</span>
                </div>
              </div>
            ))}

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${tipOption === 'custom' ? 'border-primary bg-primary/5' : 'border-primary/20 bg-white hover:bg-primary/5'}`}
              onClick={() => setTipOption('custom')}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tipOption === 'custom' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {tipOption === 'custom' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-2 flex-1 font-serif">
                <span>Custom</span>
                {tipOption === 'custom' && (
                  <Input 
                    type="number" 
                    placeholder="Enter Amount" 
                    className="h-8 w-32 ml-auto bg-background border-primary/30"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method - Embossed Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground font-serif uppercase tracking-wider">💳 Payment Method</h3>
          <div className="space-y-3">
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${paymentMethod === 'waiter' ? 'border-primary bg-primary/5' : 'border-primary/20 bg-white hover:bg-primary/5'}`}
              onClick={() => setPaymentMethod('waiter')}
            >
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-3 flex-1 font-serif">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'waiter' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'waiter' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>Pay with Waiter</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${paymentMethod === 'split' ? 'border-primary bg-primary/5' : 'border-primary/20 bg-white hover:bg-primary/5'}`}
              onClick={() => setPaymentMethod('split')}
            >
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-3 flex-1 font-serif">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'split' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'split' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>Split Bill (Equal Split)</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-primary/20 bg-white hover:bg-primary/5'}`}
              onClick={() => setPaymentMethod('online')}
            >
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-3 flex-1 font-serif">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'online' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>Online Payment (Beta)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Bill Details - Paper Card */}
        <AnimatePresence>
          {paymentMethod === 'split' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-6 pt-4 border-t border-primary/20"
            >
              <h3 className="font-medium text-foreground font-serif">Split Bill Details</h3>
              <p className="text-xs text-muted-foreground italic">Splitting equally among {numberOfGuests} guests.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: numberOfGuests }).map((_, index) => (
                  <div key={index} className="card-paper p-4 bg-white/50 space-y-3">
                    <div className="flex justify-between font-medium text-sm font-serif text-gold">
                      <span>Guest {index + 1}</span>
                      <span>£{splitAmount}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-serif text-center">
                      Equal Share
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action - Floating Paper Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-primary/20 z-30">
        <Button className="w-full btn-primary h-14 text-lg font-serif shadow-lg">
          Confirm Bill & Call Waiter
        </Button>
      </div>
    </div>
  );
}
