import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, EyeOff, CreditCard, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function Payment() {
  const [, setLocation] = useLocation();
  const [tipOption, setTipOption] = useState<number | 'custom'>(15);
  const [customTip, setCustomTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'waiter' | 'split' | 'online'>('waiter');
  const [showDetails, setShowDetails] = useState(true);

  // Mock Bill Data
  const bill = {
    food: 2450,
    drinks: 860,
    subtotal: 3310,
    serviceCharge: 331,
  };

  const getTipAmount = () => {
    if (tipOption === 'custom') {
      return parseFloat(customTip) || 0;
    }
    return Math.round(bill.subtotal * (tipOption / 100));
  };

  const total = bill.subtotal + bill.serviceCharge + getTipAmount();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-30">
        <button 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setLocation("/dining-status")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setShowDetails(!showDetails)}
        >
          <EyeOff className="w-4 h-4" />
          {showDetails ? "Hide Bill Details" : "Show Bill Details"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-8">
        <div className="text-center mb-2">
          <h1 className="font-serif text-2xl text-primary">🧾 Tonight's Bill</h1>
        </div>

        {/* Bill Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Food</span>
                  <span>¥{bill.food}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Drinks</span>
                  <span>¥{bill.drinks}</span>
                </div>
              </div>
              
              <div className="h-[1px] bg-border/50" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>¥{bill.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Charge (10%)</span>
                  <span>¥{bill.serviceCharge}</span>
                </div>
              </div>
              <div className="h-[1px] bg-border/50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total */}
        <div className="flex justify-between items-end">
          <span className="font-serif text-xl text-primary">Total</span>
          <div className="text-right">
            <span className="font-serif text-3xl text-primary">¥{total}</span>
            {tipOption !== 0 && (
              <p className="text-xs text-muted-foreground mt-1">Includes Tip ¥{getTipAmount()}</p>
            )}
          </div>
        </div>

        {/* Tip Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">💝 Tip (Optional)</h3>
          <div className="space-y-3">
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${tipOption === 0 ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={() => setTipOption(0)}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tipOption === 0 ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {tipOption === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span>No Tip</span>
            </div>

            {[15, 18, 20].map((pct) => (
              <div 
                key={pct}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${tipOption === pct ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => setTipOption(pct)}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tipOption === pct ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {tipOption === pct && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="flex justify-between flex-1">
                  <span>{pct}%</span>
                  <span className="text-muted-foreground">¥{Math.round(bill.subtotal * (pct / 100))}</span>
                </div>
              </div>
            ))}

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${tipOption === 'custom' ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={() => setTipOption('custom')}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tipOption === 'custom' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {tipOption === 'custom' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span>Custom</span>
                {tipOption === 'custom' && (
                  <Input 
                    type="number" 
                    placeholder="Enter Amount" 
                    className="h-8 w-32 ml-auto bg-background"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">💳 Payment Method</h3>
          <div className="space-y-3">
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'waiter' ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={() => setPaymentMethod('waiter')}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'waiter' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {paymentMethod === 'waiter' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Pay with Waiter</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'split' ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={() => setPaymentMethod('split')}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'split' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {paymentMethod === 'split' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>Split Bill</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={() => setPaymentMethod('online')}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {paymentMethod === 'online' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>Online Payment (Beta)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Bill View */}
        <AnimatePresence>
          {paymentMethod === 'split' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-secondary/30 rounded-xl p-4 border border-border/30 space-y-4 overflow-hidden"
            >
              <h3 className="font-medium text-foreground">Split Bill Details</h3>
              
              {/* Guest A */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Guest A</span>
                  <span>¥1,820</span>
                </div>
                <div className="pl-4 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Wagyu Ribeye</span>
                    <span>¥688</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Château Margaux (Glass)</span>
                    <span>¥450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal + Service</span>
                    <span>¥1,251</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-border/50" />

              {/* Guest B */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Guest B</span>
                  <span>¥1,821</span>
                </div>
                <div className="pl-4 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Truffle Pasta</span>
                    <span>¥488</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cocktail Pairing</span>
                    <span>¥380</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal + Service</span>
                    <span>¥954</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-border/50 z-30" style={{ maxWidth: 'inherit', margin: '0 auto' }}>
        <Button 
          className="w-full btn-primary h-14 text-lg"
          onClick={() => {
            alert("Wait staff has been notified.");
          }}
        >
          Confirm Bill & Call Waiter
        </Button>
      </div>
    </div>
  );
}
