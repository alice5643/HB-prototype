import { useState } from "react";
import { useLocation } from "wouter";
import { useStore, PartySize } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check, Utensils } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { setPartySize } = useStore();
  
  // State for form fields
  const [createProfile, setCreateProfile] = useState(false);
  const [selectedPartySize, setSelectedPartySize] = useState<string>("2");
  const [showDietary, setShowDietary] = useState(false);
  const [showOccasion, setShowOccasion] = useState(false);
  
  // Dietary requirements state
  const [dietaryReqs, setDietaryReqs] = useState<string[]>([]);
  
  // Special occasion state
  const [occasion, setOccasion] = useState<string>("none");

  const handleContinue = () => {
    setPartySize(parseInt(selectedPartySize) as PartySize);
    // In a real app, we would save the profile, dietary reqs, and occasion here
    setLocation("/dashboard");
  };

  const toggleDietary = (req: string) => {
    setDietaryReqs(prev => 
      prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Header Spacer */}
      <div className="h-12" />

      <div className="flex-1 flex flex-col px-6 pb-8 z-10 max-w-md mx-auto w-full overflow-y-auto">
        {/* Logo */}
        <div className="text-center mb-8 mt-4">
          <div className="w-20 h-20 bg-primary/5 border-2 border-primary rounded-full mx-auto mb-4 flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.8)]">
            <span className="font-serif text-4xl text-gold">S</span>
          </div>
          <h1 className="text-4xl font-serif text-gold tracking-tight drop-shadow-sm">Savoy</h1>
          <p className="text-sm text-muted-foreground mt-2 font-serif italic">Est. 2024</p>
        </div>

        {/* Table Confirmation Card - Paper Style */}
        <div className="card-paper p-6 mb-8">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4 text-center">Table Confirmation</h2>
          <div className="flex items-center gap-4 justify-center">
            <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-secondary/50 shadow-inner">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-gold">Table #12</h3>
              <p className="text-sm text-muted-foreground">Window Seat · 2-4 Guests</p>
            </div>
          </div>
        </div>

        {/* Anonymous Profile - Pressed Style */}
        <div className="space-y-4 mb-8">
          <div className="space-y-1 text-center">
            <h3 className="text-lg font-serif text-foreground">Tailor Your Experience</h3>
            <p className="text-sm text-muted-foreground">Create an anonymous profile for personalized service.</p>
          </div>
          
          <div 
            className={`rounded-xl p-4 transition-all cursor-pointer border-2 ${createProfile ? 'border-primary bg-primary/5 shadow-inner' : 'border-transparent bg-secondary/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]'}`}
            onClick={() => setCreateProfile(!createProfile)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${createProfile ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 bg-transparent'}`}>
                {createProfile && <Check className="w-3 h-3" />}
              </div>
              <div>
                <h4 className="font-medium text-foreground">Enable Anonymous Profile</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Dining Details */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-serif text-foreground border-b border-primary/20 pb-2">Dining Details</h3>
          
          {/* Party Size */}
          <div className="flex items-center justify-between">
            <span className="text-foreground font-medium">Party Size</span>
            <Select value={selectedPartySize} onValueChange={setSelectedPartySize}>
              <SelectTrigger className="w-[100px] h-10 bg-secondary/50 border-primary/30 shadow-sm">
                <SelectValue placeholder="2" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Requirements */}
          <div className="border-b border-primary/10 pb-4">
            <button 
              className="flex items-center justify-between w-full group"
              onClick={() => setShowDietary(!showDietary)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${dietaryReqs.length > 0 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/50'}`}>
                  {dietaryReqs.length > 0 && <Check className="w-3 h-3" />}
                </div>
                <span className="text-foreground group-hover:text-primary transition-colors">Dietary Requirements</span>
              </div>
              {showDietary ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            
            <AnimatePresence>
              {showDietary && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 pt-4 pl-8">
                    {["Vegetarian", "Vegan", "Gluten Free", "Nut Allergy", "Seafood Allergy", "Lactose Intolerant", "Low Sodium", "Sugar Free"].map((req) => (
                      <div 
                        key={req} 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleDietary(req)}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${dietaryReqs.includes(req) ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/50'}`}>
                          {dietaryReqs.includes(req) && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{req}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Special Occasion */}
          <div className="border-b border-primary/10 pb-4">
            <button 
              className="flex items-center justify-between w-full group"
              onClick={() => setShowOccasion(!showOccasion)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${occasion !== 'none' ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/50'}`}>
                  {occasion !== 'none' && <Check className="w-3 h-3" />}
                </div>
                <span className="text-foreground group-hover:text-primary transition-colors">Special Occasion</span>
              </div>
              {showOccasion ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            
            <AnimatePresence>
              {showOccasion && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <RadioGroup value={occasion} onValueChange={setOccasion} className="pt-4 pl-8 space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="occ-none" />
                      <Label htmlFor="occ-none" className="text-sm font-normal text-muted-foreground">No special occasion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="birthday" id="occ-birthday" />
                      <Label htmlFor="occ-birthday" className="text-sm font-normal text-muted-foreground">Birthday Celebration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="anniversary" id="occ-anniversary" />
                      <Label htmlFor="occ-anniversary" className="text-sm font-normal text-muted-foreground">Anniversary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="occ-business" />
                      <Label htmlFor="occ-business" className="text-sm font-normal text-muted-foreground">Business Dinner</Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Button 
          className="w-full btn-primary mt-auto mb-4"
          onClick={handleContinue}
        >
          Begin Dining Experience
        </Button>
      </div>
    </div>
  );
}
