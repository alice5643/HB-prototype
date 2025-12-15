import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Bell } from "lucide-react";

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const { cart, resetSession } = useStore();

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8"
        >
          <Check className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6 max-w-sm"
        >
          <h1 className="text-3xl font-serif text-primary">Order Sent</h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            A member of our team will come by shortly to confirm your order and allergies.
          </p>

          <div className="bg-secondary/30 p-6 rounded-2xl border border-border/50 mt-8 text-left">
            <h3 className="font-serif text-lg mb-4 border-b border-border/50 pb-2">Order Summary</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground/80">{item.quantity}x {item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 w-full max-w-xs space-y-4"
        >
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-full border-primary/20 hover:bg-primary/5"
            onClick={() => setLocation("/menu")}
          >
            Add something else
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full h-12 rounded-full text-muted-foreground hover:text-primary gap-2"
          >
            <Bell className="w-4 h-4" />
            Call Server
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
