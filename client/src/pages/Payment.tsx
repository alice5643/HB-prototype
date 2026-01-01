import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, EyeOff, CreditCard, User, Users, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock order data matching the simulator context
const mockOrderItems = [
  { id: 1, name: "Wagyu Ribeye", price: 85, type: "food", guest: "Guest A" },
  { id: 2, name: "Truffle Pasta", price: 32, type: "food", guest: "Guest B" },
  { id: 3, name: "2015 Château Margaux", price: 450, type: "drink", guest: "Guest A" },
  { id: 4, name: "Caesar Salad", price: 18, type: "food", guest: "Guest B" },
  { id: 5, name: "Bread Basket", price: 8, type: "food", guest: "Shared" },
];

export default function Payment() {
  const [, setLocation] = useLocation();
  const [showDetails, setShowDetails] = useState(true);
  const [tipOption, setTipOption] = useState<number | 'custom'>(15);
  const [customTip, setCustomTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'waiter' | 'split' | 'online'>('waiter');

  // Calculate bill totals
  const foodTotal = mockOrderItems.filter(i => i.type === 'food').reduce((sum, i) => sum + i.price, 0);
  const drinkTotal = mockOrderItems.filter(i => i.type === 'drink').reduce((sum, i) => sum + i.price, 0);
  const subtotal = foodTotal + drinkTotal;
  const serviceCharge = Math.round(subtotal * 0.1);
  
  const getTipAmount = () => {
    if (tipOption === 'custom') {
      return Number(customTip) || 0;
    }
    return Math.round(subtotal * (tipOption / 100));
  };

  const total = subtotal + serviceCharge + getTipAmount();

  // Calculate split bill
  const getGuestTotal = (guest: string) => {
    const guestItems = mockOrderItems.filter(i => i.guest === guest);
    const sharedItems = mockOrderItems.filter(i => i.guest === 'Shared');
    
    const guestSubtotal = guestItems.reduce((sum, i) => sum + i.price, 0) + 
                         (sharedItems.reduce((sum, i) => sum + i.price, 0) / 2); // Split shared items evenly
    
    const guestService = Math.round(guestSubtotal * 0.1);
    const guestTip = Math.round(guestSubtotal * (typeof tipOption === 'number' ? tipOption / 100 : 0)); // Simplified tip for split
    
    return {
      items: guestItems,
      subtotal: guestSubtotal,
      total: guestSubtotal + guestService + guestTip
    };
  };

  const guestA = getGuestTotal('Guest A');
  const guestB = getGuestTotal('Guest B');

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border/50 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
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
                {mockOrderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span>£{item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="h-[1px] bg-border/50" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>£{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Charge (10%)</span>
                  <span>£{serviceCharge}</span>
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
            <span className="font-serif text-3xl text-primary">£{total}</span>
            {tipOption !== 0 && (
              <p className="text-xs text-muted-foreground mt-1">Includes Tip £{getTipAmount()}</p>
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
                  <span className="text-muted-foreground">£{Math.round(subtotal * (pct / 100))}</span>
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
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'waiter' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'waiter' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>Pay with Waiter</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'split' ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={() => setPaymentMethod('split')}
            >
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'split' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'split' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>Split Bill</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={() => setPaymentMethod('online')}
            >
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'online' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>Online Payment (Beta)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Bill Details */}
        <AnimatePresence>
          {paymentMethod === 'split' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-6 pt-4 border-t border-border/50"
            >
              <h3 className="font-medium text-foreground">Split Bill Details</h3>
              
              {/* Guest A */}
              <div className="space-y-3 p-4 bg-secondary/20 rounded-lg">
                <div className="flex justify-between font-medium text-sm">
                  <span>Guest A</span>
                  <span>£{guestA.total}</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {guestA.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>£{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between italic">
                    <span>Shared Items (1/2)</span>
                    <span>£{mockOrderItems.filter(i => i.guest === 'Shared').reduce((sum, i) => sum + i.price, 0) / 2}</span>
                  </div>
                </div>
              </div>

              {/* Guest B */}
              <div className="space-y-3 p-4 bg-secondary/20 rounded-lg">
                <div className="flex justify-between font-medium text-sm">
                  <span>Guest B</span>
                  <span>£{guestB.total}</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {guestB.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>£{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between italic">
                    <span>Shared Items (1/2)</span>
                    <span>£{mockOrderItems.filter(i => i.guest === 'Shared').reduce((sum, i) => sum + i.price, 0) / 2}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-border/50 z-30">
        <Button className="w-full h-12 text-lg font-serif bg-primary text-primary-foreground hover:bg-primary/90">
          Confirm Bill & Call Waiter
        </Button>
      </div>
    </div>
  );
}
