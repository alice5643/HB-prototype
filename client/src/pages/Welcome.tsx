import { useState } from "react";
import { useLocation } from "wouter";
import { useStore, PartySize } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ChevronDown, ChevronUp, Check, User, Calendar, Utensils } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
      <div className="h-16" />

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-stone-400 blur-[60px]" />
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8 z-10 max-w-md mx-auto w-full overflow-y-auto">
        {/* Logo */}
        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="font-serif text-2xl text-primary">S</span>
          </div>
          <h1 className="text-3xl font-serif text-primary tracking-tight">Welcome to Savoy</h1>
        </div>

        {/* Table Confirmation Card */}
        <div className="bg-card border border-border/50 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Table Confirmation</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-foreground">Table #12</h3>
              <p className="text-sm text-muted-foreground">Window Seat · 2-4 Guests</p>
            </div>
          </div>
        </div>

        {/* Anonymous Profile */}
        <div className="space-y-4 mb-8">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-foreground">Tailor Your Experience</h3>
            <p className="text-sm text-muted-foreground">We invite you to create an anonymous profile.</p>
          </div>
          
          <div 
            className={`border rounded-xl p-4 transition-all cursor-pointer ${createProfile ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
            onClick={() => setCreateProfile(!createProfile)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${createProfile ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                {createProfile && <Check className="w-3 h-3" />}
              </div>
              <div>
                <h4 className="font-medium text-foreground">Create Anonymous Profile</h4>
                <p className="text-xs text-muted-foreground mt-1">Personalized service for your next visit.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dining Details */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-medium text-foreground">Dining Details</h3>
          
          {/* Party Size */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <span className="text-foreground">Party Size</span>
            <Select value={selectedPartySize} onValueChange={setSelectedPartySize}>
              <SelectTrigger className="w-[80px]">
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
          <div className="border-b border-border/50 pb-4">
            <button 
              className="flex items-center justify-between w-full"
              onClick={() => setShowDietary(!showDietary)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${dietaryReqs.length > 0 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                  {dietaryReqs.length > 0 && <Check className="w-3 h-3" />}
                </div>
                <span className="text-foreground">We have dietary requirements</span>
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
                  <div className="grid grid-cols-2 gap-3 pt-4 pl-7">
                    {["Vegetarian", "Vegan", "Gluten Free", "Nut Allergy", "Seafood Allergy", "Lactose Intolerant", "Low Sodium", "Sugar Free"].map((req) => (
                      <div 
                        key={req} 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleDietary(req)}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${dietaryReqs.includes(req) ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                          {dietaryReqs.includes(req) && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{req}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 cursor-pointer col-span-2">
                      <div className="w-4 h-4 rounded border border-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Other...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Special Occasion */}
          <div className="border-b border-border/50 pb-4">
            <button 
              className="flex items-center justify-between w-full"
              onClick={() => setShowOccasion(!showOccasion)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${occasion !== 'none' ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                  {occasion !== 'none' && <Check className="w-3 h-3" />}
                </div>
                <span className="text-foreground">This is a special occasion</span>
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
                  <RadioGroup value={occasion} onValueChange={setOccasion} className="pt-4 pl-7 space-y-3">
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
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="proposal" id="occ-proposal" />
                      <Label htmlFor="occ-proposal" className="text-sm font-normal text-muted-foreground">Proposal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="occ-other" />
                      <Label htmlFor="occ-other" className="text-sm font-normal text-muted-foreground">Other...</Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Button 
          className="w-full btn-primary h-14 text-lg mt-auto"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
